import { NextResponse } from "next/server";

export const runtime = "nodejs"; // necesario si luego quieres usar SDK/streams en Node
export const dynamic = "force-dynamic";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

function stripDataUrlPrefix(dataUrl: string) {
  // acepta: data:image/png;base64,xxxxx
  const m = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!m) return { mime: null, base64: dataUrl };
  return { mime: m[1] ?? null, base64: m[2] ?? "" };
}

function safeJsonParse<T>(txt: string): T | null {
  try {
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}

// ⚠️ Aquí puedes conectar tu IA real.
// Ahora mismo, este handler devuelve una respuesta “placeholder” útil,
// para que tu UI funcione sin romperse.
async function runModel({
  messages,
  userText,
  imageBase64,
}: {
  messages: IncomingMessage[];
  userText: string;
  imageBase64?: string | null;
}): Promise<string> {
  // Si todavía no tienes OpenAI/IA conectada, devolvemos un texto decente.
  const hasImage = !!imageBase64;
  const lastUser = userText?.trim() || (hasImage ? "He adjuntado una imagen." : "");
  const ctx = messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`)
    .join(" · ");

  return (
    "✅ Recibido.\n\n" +
    `**Tu mensaje:** ${lastUser || "(vacío)"}\n` +
    (hasImage ? "\n**Imagen:** sí (adjunta)\n" : "\n**Imagen:** no\n") +
    "\n" +
    "Para dejar esto listo con IA real, conecta aquí tu proveedor (OpenAI / etc.) y devuelve `text`.\n\n" +
    "_Contexto reciente (debug):_\n" +
    "```\n" +
    (ctx || "(sin contexto)") +
    "\n```"
  );
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const body = safeJsonParse<{
      messages?: IncomingMessage[];
      userText?: string;
      imageBase64?: string | null;
    }>(raw);

    if (!body) {
      return NextResponse.json({ error: "Body inválido (no es JSON)." }, { status: 400 });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const userText = typeof body.userText === "string" ? body.userText : "";
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : null;

    // Validación mínima
    for (const m of messages) {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
        return NextResponse.json({ error: "Formato de `messages` inválido." }, { status: 400 });
      }
    }

    // Si viene imagen en dataURL, la dejamos limpia para cuando conectes el modelo
    let cleanedImageBase64: string | null = null;
    if (imageBase64) {
      const { base64 } = stripDataUrlPrefix(imageBase64);
      cleanedImageBase64 = base64?.trim() ? base64.trim() : null;
    }

    const text = await runModel({
      messages,
      userText,
      imageBase64: cleanedImageBase64,
    });

    return NextResponse.json({ text }, { status: 200 });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Error desconocido en /api/chat";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
