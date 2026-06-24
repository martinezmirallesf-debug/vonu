// app/api/usage/realtime/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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

    const body = await req.json().catch(() => ({}));
    const rawSeconds = Number(body?.seconds ?? 0);

    if (!Number.isFinite(rawSeconds) || rawSeconds <= 0) {
      return NextResponse.json(
        { error: "Invalid seconds value" },
        { status: 400 }
      );
    }

    // Evita valores locos si el navegador se queda colgado.
    const seconds = Math.max(1, Math.min(60 * 60, Math.ceil(rawSeconds)));

    const supabase = getSupabaseAdmin();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = getCurrentMonth();

    let { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from("usage")
        .insert({
          user_id: user.id,
          month,
          messages_used: 0,
          realtime_seconds: seconds,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        realtime_seconds_added: seconds,
        realtime_seconds_total: newUsage?.realtime_seconds ?? seconds,
      });
    }

    const currentSeconds = Number(usage?.realtime_seconds ?? 0);
    const nextSeconds = currentSeconds + seconds;

    const { data: updatedUsage, error: updateError } = await supabase
      .from("usage")
      .update({
        realtime_seconds: nextSeconds,
      })
      .eq("user_id", user.id)
      .eq("month", month)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      realtime_seconds_added: seconds,
      realtime_seconds_total: updatedUsage?.realtime_seconds ?? nextSeconds,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}