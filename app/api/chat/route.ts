// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // importante si en tu deploy te da problemas con fetch/streams
export const dynamic = "force-dynamic";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Missing env: ${name}`);
  }
  return v.trim();
}

export async function POST(req: Request) {
  try {
    const SUPABASE_EDGE_FUNCTION_URL =
      process.env.SUPABASE_EDGE_FUNCTION_URL?.trim() ||
      ""; // ej: https://xxxxx.supabase.co/functions/v1

    const SUPABASE_ANON_KEY =
      process.env.SUPABASE_ANON_KEY?.trim() ||
      ""; // anon public

    if (!SUPABASE_EDGE_FUNCTION_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          error: "Error de configuración",
          message:
            "Faltan variables de entorno: SUPABASE_EDGE_FUNCTION_URL, SUPABASE_ANON_KEY",
          hint:
            "Verifica SUPABASE_EDGE_FUNCTION_URL y SUPABASE_ANON_KEY en .env.local",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const userText = typeof body?.userText === "string" ? body.userText : "";
    const imageBase64 =
      typeof body?.imageBase64 === "string" ? body.imageBase64 : null;

    // Pasamos al edge: token del usuario si viene en header (desde cliente)
    // En tu page.tsx ahora llamas /api/chat sin auth. Aun así,
    // intentamos reenviar Authorization si un día lo añades.
    const authHeader = req.headers.get("authorization");

    const edgeUrl = `${SUPABASE_EDGE_FUNCTION_URL.replace(/\/$/, "")}/quick-service`;

    const edgeRes = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: authHeader || `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        messages,
        userText,
        imageBase64,
      }),
      cache: "no-store",
    });

    const raw = await edgeRes.text().catch(() => "");
    let json: any = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = null;
    }

    if (!edgeRes.ok) {
      return NextResponse.json(
        {
          error: "IA_ERROR",
          message: `Edge function error (${edgeRes.status})`,
          details: json || raw,
        },
        { status: 500 }
      );
    }

    // Tu UI espera { text }
    const text =
      (typeof json?.text === "string" && json.text.trim()) ||
      "He recibido una respuesta vacía. ¿Puedes darme un poco más de contexto?";

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: e?.message || "Error interno",
      },
      { status: 500 }
    );
  }
}
