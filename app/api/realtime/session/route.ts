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

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "realtime",
        model: "gpt-realtime-1.5",
        output_modalities: ["audio"],
        audio: {
          input: {
            noise_reduction: {
              type: "near_field",
            },
            transcription: {
              model: "gpt-4o-mini-transcribe",
              language: "es",
            },
            turn_detection: {
              type: "server_vad",
              create_response: true,
              interrupt_response: true,
              silence_duration_ms: 700,
              prefix_padding_ms: 300,
            },
          },
          output: {
            voice: "marin",
            speed: 1.0,
          },
        },
        instructions:
          "Eres Vonu. Habla siempre en español de España, con tono natural, cercano, claro y humano. Usa acento castellano neutro. Evita sonar robótico. Sé útil y breve. Si el usuario pide ayuda para estudiar o explicar algo, enséñalo paso a paso con tono didáctico.",
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "No se pudo crear la sesión realtime",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error interno creando sesión realtime",
        message: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}