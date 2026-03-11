import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY en variables de entorno" },
        { status: 500 }
      );
    }

    // ✅ Payload mínimo para aislar el error real
    const payload = {
      type: "realtime",
      model: "gpt-realtime-1.5",
    };

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text().catch(() => "");
    let data: any = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { raw };
    }

    if (!response.ok) {
      console.error("REALTIME_SESSION_ERROR", {
        status: response.status,
        payload,
        data,
      });

      return NextResponse.json(
        {
          error: "No se pudo crear la sesión realtime",
          status: response.status,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("REALTIME_SESSION_INTERNAL_ERROR", error);

    return NextResponse.json(
      {
        error: "Error interno creando sesión realtime",
        message: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}