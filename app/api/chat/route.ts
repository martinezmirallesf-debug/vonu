// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import tutorExcalidrawInstructions from "@/app/lib/TutorExcalidrawPrompt";

export const runtime = "nodejs";

function cleanUrl(u: string) {
  return (u || "").trim().replace(/\/$/, "");
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "");

    const supabaseAnonKey = (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY_FALLBACK ||
      ""
    ).trim();

    // Si no defines SUPABASE_EDGE_FUNCTION_URL, lo construimos:
    // https://xxxx.supabase.co/functions/v1/quick-service
    const edgeUrl =
      cleanUrl(process.env.SUPABASE_EDGE_FUNCTION_URL || "") ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/quick-service` : "");

    const missing: string[] = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    if (!edgeUrl) missing.push("SUPABASE_EDGE_FUNCTION_URL (o NEXT_PUBLIC_SUPABASE_URL para construirla)");

    if (missing.length) {
      return json(
        {
          error: "Error de configuración",
          message: `Faltan variables de entorno: ${missing.join(", ")}`,
          hint: "Verifica tu .env.local. Recomendado: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. (SUPABASE_EDGE_FUNCTION_URL es opcional).",
        },
        500
      );
    }

    // body desde el cliente
    const body = (await req.json().catch(() => ({}))) as any;

    const mode = body?.mode === "tutor" ? "tutor" : "chat";
    const tutorLevel =
      body?.tutorLevel === "kid" || body?.tutorLevel === "teen" || body?.tutorLevel === "adult"
        ? body.tutorLevel
        : "adult";

    // ✅ Messages siempre array
    const incomingMessages = Array.isArray(body?.messages) ? body.messages : [];

    // ✅ Si estamos en tutor, metemos un "system" al principio con el contrato Excalidraw
    // (si el Edge Function respeta system messages, esto lo arregla de verdad)
    const messages =
      mode === "tutor"
        ? [
            {
  role: "system",
  content: tutorExcalidrawInstructions,
}
          ]
        : incomingMessages;

    // ✅ Normalizamos campos clave (para que quick-service reciba siempre algo consistente)
    const normalized = {
      messages,
      userText: typeof body?.userText === "string" ? body.userText : "",
      imageBase64: typeof body?.imageBase64 === "string" ? body.imageBase64 : null,
      mode,
      tutorLevel,
      // ✅ opcional: por si más adelante añades cosas
      ...Object.fromEntries(
        Object.entries(body || {}).filter(([k]) => !["messages", "userText", "imageBase64", "mode", "tutorLevel"].includes(k))
      ),
    };

    // Opcional: si quieres pasar el JWT del usuario (cuando esté logueado),
    // lo intentamos leer de Authorization, pero no es obligatorio.
    const authHeader = req.headers.get("authorization") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: authHeader.startsWith("Bearer ") ? authHeader : `Bearer ${supabaseAnonKey}`,
    };

    const resp = await fetch(edgeUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(normalized),
      cache: "no-store",
    });

    const raw = await resp.text().catch(() => "");
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!resp.ok) {
      return json(
        {
          error: "Edge Function error",
          status: resp.status,
          statusText: resp.statusText,
          details: data || raw || null,
        },
        500
      );
    }

    // Tu UI espera { text: string }
    if (!data || typeof data.text !== "string") {
      return json(
        {
          error: "Respuesta inválida del Edge Function",
          details: data ?? raw ?? null,
        },
        500
      );
    }

    return json(data, 200);
  } catch (e: any) {
    return json(
      {
        error: "Error interno /api/chat",
        message: e?.message ?? String(e),
      },
      500
    );
  }
}
