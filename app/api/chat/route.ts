import { NextResponse } from "next/server";

export const runtime = "nodejs"; // (puedes cambiar a "edge" si quieres, pero Node va bien)

function getEnv(name: string) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function buildSupabaseFunctionUrl() {
  const supabaseUrl =
    getEnv("NEXT_PUBLIC_SUPABASE_URL") ||
    getEnv("SUPABASE_URL"); // por si lo tienes duplicado en server env

  if (!supabaseUrl) return { url: "", supabaseUrl: "" };

  const base = supabaseUrl.replace(/\/$/, "");
  // Supabase Edge Functions endpoint:
  // https://<project>.supabase.co/functions/v1/<function-name>
  const url = `${base}/functions/v1/quick-service`;
  return { url, supabaseUrl: base };
}

export async function POST(req: Request) {
  try {
    const SUPABASE_ANON_KEY =
      getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY");

    const { url: EDGE_URL, supabaseUrl } = buildSupabaseFunctionUrl();

    const missing: string[] = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    if (missing.length) {
      return NextResponse.json(
        {
          error: "Error de configuración",
          message: `Faltan variables de entorno: ${missing.join(", ")}`,
          hint:
            "Verifica tus env vars en .env.local (local) y en Vercel (Production/Preview).",
        },
        { status: 500 }
      );
    }

    if (!EDGE_URL) {
      return NextResponse.json(
        {
          error: "Configuración incompleta",
          message: "No se pudo construir la URL de la Edge Function.",
          hint:
            "Asegúrate de que NEXT_PUBLIC_SUPABASE_URL sea algo tipo https://xxxx.supabase.co",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const userText = typeof body?.userText === "string" ? body.userText : "";
    const imageBase64 =
      typeof body?.imageBase64 === "string" ? body.imageBase64 : null;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Llamada a Supabase Edge Function
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userText, imageBase64, messages }),
      cache: "no-store",
    });

    const raw = await res.text().catch(() => "");

    // Intentar parsear JSON
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      // Pasamos el error de Supabase/OpenAI tal cual (pero controlado)
      return NextResponse.json(
        {
          error: "Edge Function error",
          status: res.status,
          statusText: res.statusText,
          details: data ?? raw ?? "Sin detalles",
          hint:
            "Revisa los logs de la Edge Function en Supabase (Logs) y confirma que existe el secret OPENAI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // Edge debería devolver: { text, mode, pillar, model, tokens_used }
    const text =
      typeof data?.text === "string" && data.text.trim()
        ? data.text
        : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

    return NextResponse.json(
      {
        ...data,
        text,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: e?.message ?? String(e),
      },
      { status: 500 }
    );
  }
}
