// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Tu function real (según tu screenshot)
const FUNCTION_NAME = "quick-service";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json(
        {
          error: "Error de configuración",
          message: "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
          hint: "Revisa .env.local o variables en Vercel",
        },
        500
      );
    }

    const body = await req.json().catch(() => ({}));

    const userText = typeof body?.userText === "string" ? body.userText : "";
    const imageBase64 = typeof body?.imageBase64 === "string" ? body.imageBase64 : null;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const url = `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/${FUNCTION_NAME}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userText, imageBase64, messages }),
      cache: "no-store",
    });

    const raw = await resp.text().catch(() => "");
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!resp.ok) {
      return json(
        {
          error: `Supabase function error (${resp.status})`,
          details: data ?? raw ?? null,
        },
        500
      );
    }

    return json(data ?? { text: "Respuesta vacía desde Supabase." }, 200);
  } catch (e: any) {
    return json({ error: "Internal error in /api/chat", message: e?.message ?? String(e) }, 500);
  }
}
