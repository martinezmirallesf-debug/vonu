// app/api/profile/ensure/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email ?? null;

    const { data: existing, error: existingError } = await supabase
      .from("profiles")
      .select("id, email, plan")
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    if (existing?.id) {
      // No machacamos el plan existente. Solo rellenamos email si falta.
      const shouldUpdateEmail = !existing.email && email;

      if (shouldUpdateEmail) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            email,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        ok: true,
        created: false,
        profile: {
          id: existing.id,
          email: existing.email ?? email,
          plan: existing.plan ?? "free",
        },
      });
    }

    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email,
        plan: "free",
        updated_at: new Date().toISOString(),
      })
      .select("id, email, plan")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      created: true,
      profile: created,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}