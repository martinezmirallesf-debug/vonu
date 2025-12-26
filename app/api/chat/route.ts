// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const userText = (body?.userText ?? "").toString().trim();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const imageBase64 = typeof body?.imageBase64 === "string" ? body.imageBase64 : null;

    if (!userText && !imageBase64) {
      return NextResponse.json(
        { error: "No input provided", text: "No he recibido texto ni imagen." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: "Supabase env missing",
          text:
            "Faltan variables de Supabase en .env.local (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).",
        },
        { status: 500 }
      );
    }

    const fnUrl = `${supabaseUrl}/functions/v1/quick-service`;

    const r = await fetch(fnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        userText,
        messages,
        imageBase64,
      }),
    });

    const txt = await r.text().catch(() => "");

    if (!r.ok) {
      return NextResponse.json(
        {
          error: `Supabase function error: ${r.status} ${txt}`,
          text:
            "⚠️ No he podido conectar con la IA.\n\n**Detalles técnicos:**\n\n```\\n" +
            `HTTP ${r.status} ${txt}` +
            "\\n```",
        },
        { status: 500 }
      );
    }

    let data: any = null;
    try {
      data = JSON.parse(txt);
    } catch {
      data = { text: txt };
    }

    const answer =
      typeof data?.text === "string" && data.text.trim()
        ? data.text
        : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

    return NextResponse.json({ text: answer }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e?.message ?? "Unknown error",
        text: "⚠️ Error interno.\n\n```\\n" + (e?.message ?? "Unknown error") + "\\n```",
      },
      { status: 500 }
    );
  }
}

