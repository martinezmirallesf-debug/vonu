import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function cleanText(value: unknown, maxLength = 500) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const email = cleanText(body?.email, 180).toLowerCase();
    const page = cleanText(body?.page, 180);

    if (!email || !isValidEmail(email)) {
      return json(
        {
          ok: false,
          error: "Introduce un email válido.",
        },
        400
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("SUBSCRIBE_CONFIG_ERROR", {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });

      return json(
        {
          ok: false,
          error: "Error de configuración.",
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error } = await supabase.from("resource_subscribers").upsert(
      {
        email,
        page: page || null,
        source: "resource_signup",
      },
      {
        onConflict: "email",
      }
    );

    if (error) {
      console.error("SUBSCRIBE_SUPABASE_ERROR", error);

      return json(
        {
          ok: false,
          error: "No se ha podido guardar el email ahora mismo.",
        },
        500
      );
    }

    return json(
      {
        ok: true,
        message: "Email guardado correctamente.",
      },
      200
    );
  } catch (error: any) {
    console.error("SUBSCRIBE_INTERNAL_ERROR", error);

    return json(
      {
        ok: false,
        error: "Error interno guardando el email.",
        message: error?.message ?? String(error),
      },
      500
    );
  }
}