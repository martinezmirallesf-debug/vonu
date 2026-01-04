// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // importante: usar Node (no Edge) para evitar líos con libs/env

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type Body = {
  messages?: IncomingMessage[];
  userText?: string;
  imageBase64?: string | null;
};

function okJson(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function errJson(message: string, status = 400, extra?: any) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return errJson("Falta OPENAI_API_KEY en variables de entorno.", 500);
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) return errJson("Body inválido (JSON).", 400);

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const userText = typeof body.userText === "string" ? body.userText : "";
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : null;

    // Construimos el mensaje final del usuario (texto + imagen opcional)
    // Nota: Chat Completions soporta contenido multimodal como array.
    const userContent: any[] = [];

    const cleanText = (userText || "").trim();
    if (cleanText) {
      userContent.push({ type: "text", text: cleanText });
    } else {
      // si no hay texto pero hay imagen, dejamos una instrucción mínima
      if (imageBase64) userContent.push({ type: "text", text: "Analiza la imagen adjunta." });
    }

    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageBase64 },
      });
    }

    // Pasamos el historial (texto) + añadimos el último mensaje multimodal
    const chatMessages: any[] = [
      {
        role: "system",
        content:
          "Eres Vonu, un asistente preventivo para tomar decisiones seguras. " +
          "Responde en español, claro y accionable. " +
          "Evalúa riesgo real y próximos pasos. " +
          "No pidas datos sensibles (contraseñas, códigos, banca).",
      },
      ...messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({
          role: m.role,
          content: m.content,
        })),
      {
        role: "user",
        content: userContent.length ? userContent : [{ type: "text", text: "Ayúdame con esto." }],
      },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        temperature: 0.4,
      }),
    });

    const raw = await res.text().catch(() => "");
    let json: any = null;
    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = null;
    }

    if (!res.ok) {
      return errJson("Error llamando a OpenAI.", 500, {
        status: res.status,
        statusText: res.statusText,
        details: json || raw || null,
      });
    }

    const text =
      (json?.choices?.[0]?.message?.content as string | undefined)?.trim() ||
      "He recibido una respuesta vacía. ¿Puedes darme un poco más de contexto?";

    return okJson({ text });
  } catch (e: any) {
    return errJson(e?.message || "Error interno.", 500);
  }
}
