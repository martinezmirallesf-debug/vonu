import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return json(
        {
          error: "No se ha recibido ningún archivo PDF.",
        },
        400
      );
    }

    const filename = file.name || "documento.pdf";
    const mime = file.type || "";

    const looksLikePdf =
      mime === "application/pdf" || filename.toLowerCase().endsWith(".pdf");

    if (!looksLikePdf) {
      return json(
        {
          error: "El archivo recibido no parece un PDF válido.",
        },
        400
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);

    const text = (parsed?.text || "").trim();

    if (!text) {
      return json(
        {
          error:
            "He recibido el PDF, pero no he podido extraer texto útil. Puede que sea un escaneado o una imagen dentro del PDF.",
          filename,
          pageCount: parsed?.numpages ?? null,
        },
        422
      );
    }

    // Limitamos para no disparar tokens en esta v1
    const clippedText = text.slice(0, 50000);

    return json({
      ok: true,
      filename,
      pageCount: parsed?.numpages ?? null,
      text: clippedText,
      wasClipped: text.length > clippedText.length,
    });
  } catch (error: any) {
    return json(
      {
        error: "No se pudo analizar el PDF.",
        message: error?.message ?? String(error),
      },
      500
    );
  }
}