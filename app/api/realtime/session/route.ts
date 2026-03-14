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
      session: {
        type: "realtime",
        model: "gpt-realtime-1.5",
        instructions:
  "Eres Vonu. Habla con una voz muy cálida, dulce, cercana y encantadora. Usa un español natural con un toque rioplatense suave, agradable y simpático, sin exagerarlo ni sonar caricaturesca. Tu energía debe sentirse viva, luminosa y muy humana. Puedes empezar de forma espontánea y cálida, por ejemplo con un 'hola, hola' simpático cuando encaje natural. Evita sonar seca, fría, cortante o demasiado seria. Sonríe en el tono, transmite cercanía y buen rollo, pero sin perder claridad. Responde de forma útil, clara y conversacional. Si el usuario pide ayuda para estudiar o explicar algo, enséñalo paso a paso con tono didáctico y cercano.",
        audio: {
          input: {
            transcription: {
              model: "gpt-4o-mini-transcribe",
              language: "es",
            },
            turn_detection: {
              type: "server_vad",
              create_response: true,
              interrupt_response: true,
              silence_duration_ms: 900,
              prefix_padding_ms: 300,
            },
          },
          output: {
            voice: "verse",
          },
        },
      },
    };

console.log("REALTIME PAYLOAD", JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
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
      console.error("REALTIME_CLIENT_SECRET_ERROR", {
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
    console.error("REALTIME_CLIENT_SECRET_INTERNAL_ERROR", error);

    return NextResponse.json(
      {
        error: "Error interno creando sesión realtime",
        message: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}