// app/api/support-visual/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STYLE_PROMPT = `
Crea una imagen didáctica de apoyo visual.
Estilo: minimalista, blanco y negro.
Fondo blanco puro.
Trazos negros limpios.
Aspecto: como una explicación rápida de profesor en pizarra o papel.
Muy clara, muy simple y muy útil.
Sin decoración.
Sin colores.
Sin realismo.
Si usas texto, que sea poco, breve y muy legible.
Si ayuda, usa flechas, pasos numerados, cajas, esquemas simples o mini diagramas.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body?.text || "").trim();
    const title = String(body?.title || "").trim();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const prompt = `
${STYLE_PROMPT}

Tema:
${title || "Apoyo visual de explicación"}

Explicación:
${text}

Genera una única imagen de apoyo visual que ayude a entender esta explicación de forma rápida.
`;

    const result = await client.images.generate({
  model: "gpt-image-1",
  prompt,
  size: "512x512",
});

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image returned" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        imageUrl: `data:image/png;base64,${imageBase64}`,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}