// app/api/support-visual/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanText(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isGenericTitle(value: string) {
  const v = cleanText(value).toLowerCase();

  if (!v) return true;

  const genericTitles = [
    "apoyo visual",
    "apoyo visual de explicación",
    "apoyo visual de explicacion",
    "explicación",
    "explicacion",
    "imagen",
    "visual",
    "dibujo",
    "esquema",
  ];

  return genericTitles.includes(v);
}

function toDisplayTitle(rawTitle: string, rawText: string) {
  const title = cleanText(rawTitle);
  const text = cleanText(rawText).toLowerCase();

  if (title && !isGenericTitle(title)) {
    return title.toUpperCase();
  }

  // Matemáticas
  if (/(divisi[oó]n|dividir|cociente|divisor|dividendo)/i.test(text)) {
    return "CÓMO HACER LA DIVISIÓN";
  }

  if (/(fracci[oó]n|fracciones)/i.test(text)) {
    return "FRACCIONES";
  }

  if (/(multiplicaci[oó]n|multiplicar)/i.test(text)) {
    return "CÓMO MULTIPLICAR";
  }

  if (/(suma|sumar)/i.test(text)) {
    return "CÓMO SUMAR";
  }

  if (/(resta|restar)/i.test(text)) {
    return "CÓMO RESTAR";
  }

  // Ciencia / cole
  if (/(fotos[ií]ntesis)/i.test(text)) {
    return "LA FOTOSÍNTESIS";
  }

  if (/(respiraci[oó]n)/i.test(text)) {
    return "LA RESPIRACIÓN";
  }

  if (/(sistema solar)/i.test(text)) {
    return "EL SISTEMA SOLAR";
  }

  if (/(ciclo del agua)/i.test(text)) {
    return "EL CICLO DEL AGUA";
  }

  // Fútbol
  if (/(f[uú]tbol|bal[oó]n|desmarcar|desmarque|regate|driblar|pase)/i.test(text)) {
    return "CÓMO DESMARCARSE";
  }

  // Estudio / explicación general
  if (/(niñ|niña|11 años|colegio|cole|explica)/i.test(text)) {
    return "EXPLICACIÓN FÁCIL";
  }

  return "ESQUEMA VISUAL";
}

function buildSubjectHints(text: string) {
  const t = cleanText(text).toLowerCase();

  const hints: string[] = [];

  // Reglas generales
  hints.push(
    "El título debe ser corto, específico y relacionado con el tema. Nunca uses el texto 'APOYO VISUAL DE VONU'.",
    "El título debe ir arriba, pequeño o mediano, claramente legible, sin ocupar demasiado espacio.",
    "No pongas logotipos, marcas, firmas ni elementos decorativos.",
    "Haz la imagen como una explicación visual de profesor: clara, directa, didáctica y fácil de entender en móvil."
  );

  // Matemáticas
  if (/(divisi[oó]n|dividir|cociente|divisor|dividendo)/i.test(t)) {
    hints.push(
      "Si es una división, represéntala con el formato escolar habitual en España.",
      "Usa la disposición típica de división española, con pasos intermedios claros.",
      "Si procede, muestra una comparación o pequeña conclusión visual al final.",
      "Haz los números grandes y muy legibles.",
      "Si hay flechas, que sean simples y útiles."
    );
  }

  if (/(suma|sumar|resta|restar|multiplicaci[oó]n|multiplicar|fracci[oó]n|fracciones)/i.test(t)) {
    hints.push(
      "Si es una operación matemática, usa presentación escolar tradicional de primaria o secundaria en España.",
      "Ordena todo paso a paso.",
      "Usa cajas, subrayados o pequeñas flechas solo si ayudan a entender."
    );
  }

  // Ciencia
  if (
    /(fotos[ií]ntesis|respiraci[oó]n|ciclo del agua|sistema solar|c[eé]lula|plantas|biolog[ií]a|ciencias)/i.test(
      t
    )
  ) {
    hints.push(
      "Si es un concepto de ciencias, dibújalo como en el colegio: esquema sencillo, etiquetas breves y flechas.",
      "Prioriza claridad sobre detalle.",
      "Hazlo visualmente muy intuitivo, como un dibujo de libro escolar o pizarra."
    );
  }

  // Fútbol
  if (/(f[uú]tbol|desmarcar|desmarque|bal[oó]n|pase|regate|driblar)/i.test(t)) {
    hints.push(
      "Si es fútbol, usa figuras muy simples y un mini esquema de campo o espacio.",
      "Marca movimientos con flechas claras.",
      "Si aparecen jugadores, que sean siluetas sencillas y muy fáciles de distinguir."
    );
  }

  // Explicación para niños
  if (/(niñ|niña|11 años|colegio|cole|fácil|facil)/i.test(t)) {
    hints.push(
      "Como va orientado a un niño o a explicación escolar, hazlo especialmente simple, amable y directo.",
      "Muy poco texto y muy visual."
    );
  }

  return hints.join("\n");
}

function buildPrompt(title: string, text: string) {
  const finalTitle = toDisplayTitle(title, text);
  const subjectHints = buildSubjectHints(text);

  return `
Crea una única imagen didáctica de apoyo visual.

ESTILO GENERAL
- Blanco y negro.
- Fondo blanco puro.
- Trazos negros limpios.
- Estilo minimalista.
- Como una explicación rápida de profesor en pizarra o papel.
- Muy clara, muy simple y muy útil.
- Sin decoración innecesaria.
- Sin realismo.
- Sin sombras complejas.
- Si usas texto, que sea poco, breve y muy legible.
- Si ayuda, usa flechas, pasos numerados, cajas, esquemas simples o mini diagramas.

REGLAS IMPORTANTES
- NO uses el texto "APOYO VISUAL DE VONU".
- NO pongas branding.
- NO hagas un póster decorativo.
- Haz una imagen útil para aprender.
- El contenido debe entenderse rápido.
- Debe verse bien en móvil.

TÍTULO
- Usa este título: "${finalTitle}"
- Debe ir arriba.
- Debe ser corto, claro y legible.
- Debe ser más discreto que el contenido principal.

INDICACIONES ESPECIALES
${subjectHints}

EXPLICACIÓN A REPRESENTAR
${text}

OBJETIVO
Genera una única imagen de apoyo visual que ayude a entender esta explicación de forma rápida, escolar y muy clara.
`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = cleanText(body?.text || "");
    const title = cleanText(body?.title || "");

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const prompt = buildPrompt(title, text);

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
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