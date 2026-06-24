// app/api/realtime/session/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta OPENAI_API_KEY en variables de entorno" },
        { status: 500 }
      );
    }

    const token = getBearer(req);

    if (!token) {
      return NextResponse.json(
        {
          error: "Para usar el modo conversación necesitas iniciar sesión.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json(
        {
          error: "Sesión inválida. Inicia sesión de nuevo.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const month = getCurrentMonth();

    let { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    if (!usage) {
      const { data: newUsage, error: insertUsageError } = await supabase
        .from("usage")
        .insert({
          user_id: user.id,
          month,
          messages_used: 0,
          realtime_seconds: 0,
        })
        .select()
        .single();

      if (insertUsageError) {
        return NextResponse.json(
          { error: insertUsageError.message },
          { status: 500 }
        );
      }

      usage = newUsage;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const planId = profile?.plan || "free";

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }

    const { data: topups, error: topupsError } = await supabase
      .from("usage_topups")
      .select("extra_messages, extra_realtime_seconds")
      .eq("user_id", user.id)
      .eq("month", month);

    if (topupsError) {
      return NextResponse.json({ error: topupsError.message }, { status: 500 });
    }

    const extraRealtimeSeconds = (topups ?? []).reduce(
      (acc, row) => acc + Number(row.extra_realtime_seconds ?? 0),
      0
    );

    const baseRealtimeSecondsLimit = Number(plan?.realtime_seconds_limit ?? 0);
    const realtimeSecondsLimit = baseRealtimeSecondsLimit + extraRealtimeSeconds;
    const realtimeSecondsUsed = Number(usage?.realtime_seconds ?? 0);
    const realtimeSecondsLeft = Math.max(
      0,
      realtimeSecondsLimit - realtimeSecondsUsed
    );

    if (realtimeSecondsLimit <= 0 || realtimeSecondsLeft <= 0) {
      return NextResponse.json(
        {
          error:
            "No te quedan minutos de conversación por voz. Puedes mejorar tu plan o añadir una recarga.",
          code: "REALTIME_LIMIT_REACHED",
          usage: {
            plan_id: planId,
            realtime_seconds_used: realtimeSecondsUsed,
            realtime_seconds_limit: realtimeSecondsLimit,
            realtime_seconds_left: realtimeSecondsLeft,
            base_realtime_seconds_limit: baseRealtimeSecondsLimit,
            extra_realtime_seconds: extraRealtimeSeconds,
          },
        },
        { status: 402 }
      );
    }

    const realtimeModel =
      process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-mini";

    const realtimeVoice =
      process.env.OPENAI_REALTIME_VOICE || "marin";

    const realtimeTranscriptionModel =
      process.env.OPENAI_REALTIME_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe";

    const realtimeReasoningEffort =
      process.env.OPENAI_REALTIME_REASONING_EFFORT || "low";

    const payload = {
      session: {
        type: "realtime",
        model: realtimeModel,

        reasoning: {
          effort: realtimeReasoningEffort,
        },

        instructions:
          "Eres Vonu. Habla con una voz muy cálida, simpática, dulce, cercana y encantadora. Usa un español natural, agradable y simpático. Tu energía debe sentirse viva, luminosa y muy humana. Puedes empezar de forma espontánea y cálida, por ejemplo con un 'hola, hola' simpático cuando encaje natural. Evita sonar seca, fría, cortante o demasiado seria. Sonríe en el tono, transmite cercanía y buen rollo, pero sin perder claridad. Responde de forma útil, clara y conversacional. Si el usuario pide ayuda para estudiar o explicar algo, enséñalo paso a paso con tono didáctico y cercano.",

        audio: {
          input: {
            transcription: {
              model: realtimeTranscriptionModel,
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
            voice: realtimeVoice,
          },
        },
      },
    };

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

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

    return NextResponse.json(
      {
        ...data,
        usage: {
          plan_id: planId,
          realtime_seconds_used: realtimeSecondsUsed,
          realtime_seconds_limit: realtimeSecondsLimit,
          realtime_seconds_left: realtimeSecondsLeft,
          base_realtime_seconds_limit: baseRealtimeSecondsLimit,
          extra_realtime_seconds: extraRealtimeSeconds,
        },
      },
      { status: 200 }
    );
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