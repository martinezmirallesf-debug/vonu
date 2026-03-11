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

    const payload = {
      model: "gpt-realtime-1.5",
      voice: "marin",
      instructions:
        "Eres Vonu. Habla siempre en español de España, con tono natural, cercano, claro y humano. Usa acento castellano neutro. Evita sonar robótico. Sé útil y breve. Si el usuario pide ayuda para estudiar o explicar algo, enséñalo paso a paso con tono didáctico.",
      audio: {
        input: {
          transcription: {
            model: "gpt-4o-mini-transcribe",
            language: "es",
          },
          turn_detection: {
            type: "server_vad",
            silence_duration_ms: 700,
            prefix_padding_ms: 300,
          },
        },
      },
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