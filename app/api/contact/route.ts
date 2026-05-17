import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function cleanText(value: unknown, maxLength = 2000) {
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

    const name = cleanText(body?.name, 120);
    const email = cleanText(body?.email, 180).toLowerCase();
    const reason = cleanText(body?.reason, 120);
    const message = cleanText(body?.message, 5000);

    if (!email || !isValidEmail(email)) {
      return json(
        {
          ok: false,
          error: "Introduce un email válido.",
        },
        400
      );
    }

    if (!message || message.length < 5) {
      return json(
        {
          ok: false,
          error: "Escribe un mensaje un poco más detallado para poder ayudarte.",
        },
        400
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("CONTACT_CONFIG_ERROR", {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });

      return json(
        {
          ok: false,
          error: "Error de configuración del formulario de contacto.",
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error } = await supabase.from("contact_messages").insert({
      name: name || null,
      email,
      reason: reason || null,
      message,
      status: "new",
      source: "contact_page",
    });

    if (error) {
      console.error("CONTACT_SUPABASE_INSERT_ERROR", error);

      return json(
        {
          ok: false,
          error: "No se ha podido guardar el mensaje ahora mismo.",
        },
        500
      );
    }

    return json(
      {
        ok: true,
        message: "Mensaje recibido correctamente.",
      },
      200
    );
  } catch (error: any) {
    console.error("CONTACT_INTERNAL_ERROR", error);

    return json(
      {
        ok: false,
        error: "Error interno enviando el mensaje.",
        message: error?.message ?? String(error),
      },
      500
    );
  }
}