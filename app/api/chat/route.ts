// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanUrl(u: string) {
  return (u || "").trim().replace(/\/$/, "");
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// -----------------------------
// ✅ FÚTBOL: detección rápida
// -----------------------------
function looksLikeFootballIntent(text: string) {
  const t = (text || "").toLowerCase();

  // patrones típicos de pedir partido
  const hasVs = /\b(vs|v|contra|-\s*)\b/.test(t);

  // palabras de apuestas/mercados
  const hasMarkets =
    /\b(1x2|doble oportunidad|dnb|empate|cuota|pron[oó]stico|apuesta|pick|stake|value|valor)\b/.test(t) ||
    /\b(over|under|m[aá]s de|menos de|btts|ambos marcan)\b/.test(t) ||
    /\b(c[oó]rners?|tarjetas?|disparos?|tiros?|remates?|a puerta|sot)\b/.test(t);

  // si contiene vs o habla de mercados, lo tratamos como fútbol
  return hasVs || hasMarkets;
}

function pickUserTextFromBody(body: any): string {
  // prioridad: userText explícito
  const direct = typeof body?.userText === "string" ? body.userText : "";
  if (direct.trim()) return direct.trim();

  // fallback: último mensaje del array messages
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    const c = typeof m?.content === "string" ? m.content : "";
    if (c.trim()) return c.trim();
  }
  return "";
}

function formatKickoffES(iso?: string | null) {
  if (!iso) return "Fecha no disponible";
  try {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function chooseBestSinglePick(markets: any): { label: string; p: number; fairOdd: number | null } | null {
  // Elegimos 1 solo pick “seguro” para no apelotonar:
  // buscamos prob >= 0.72 y nos quedamos con el mayor p (el más “cercano al 100%”)
  const candidates: Array<{ label: string; p: number; fairOdd: number | null }> = [];

  const addFromLines = (title: string, lines: any[]) => {
    if (!Array.isArray(lines)) return;
    for (const ln of lines) {
      const overP = typeof ln?.over?.p === "number" ? ln.over.p : null;
      const underP = typeof ln?.under?.p === "number" ? ln.under.p : null;

      if (typeof overP === "number") {
        candidates.push({
          label: `${title} Over ${ln.line}`,
          p: overP,
          fairOdd: ln?.over?.fairOdd ?? null,
        });
      }
      if (typeof underP === "number") {
        candidates.push({
          label: `${title} Under ${ln.line}`,
          p: underP,
          fairOdd: ln?.under?.fairOdd ?? null,
        });
      }
    }
  };

  addFromLines("⚽ Goles", markets?.goals?.lines);
  addFromLines("🚩 Córners", markets?.corners?.lines);
  addFromLines("🟨 Tarjetas", markets?.cards?.lines);
  addFromLines("🥅 Tiros a puerta", markets?.shotsOnTarget?.lines);
  addFromLines("🎯 Disparos", markets?.shots?.lines);

  // filtrar por prob mínima
  const good = candidates.filter((c) => (c.p ?? 0) >= 72);

  if (!good.length) return null;

  good.sort((a, b) => (b.p ?? 0) - (a.p ?? 0));
  return good[0] ?? null;
}

function pct(n: any) {
  const x = typeof n === "number" ? n : null;
  if (x === null) return "—";
  return `${Math.round(x * 10) / 10}%`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    // ✅ Normalizamos campos clave (tu versión original)
    const normalized = {
      messages: Array.isArray(body?.messages) ? body.messages : [],
      userText: typeof body?.userText === "string" ? body.userText : "",
      imageBase64: typeof body?.imageBase64 === "string" ? body.imageBase64 : null,
      mode: body?.mode === "tutor" ? "tutor" : "chat",
      tutorLevel:
        body?.tutorLevel === "kid" || body?.tutorLevel === "teen" || body?.tutorLevel === "adult"
          ? body.tutorLevel
          : "adult",

      footballProfile: body?.footballProfile === "wide" || body?.footballProfile === "normal" ? body.footballProfile : "normal",

      ...Object.fromEntries(
        Object.entries(body || {}).filter(
          ([k]) => !["messages", "userText", "imageBase64", "mode", "tutorLevel", "footballProfile"].includes(k)
        )
      ),
    };

    // ==========================================================
    // ✅ 1) INTERCEPTOR FÚTBOL (ANTES de Supabase Edge Function)
    // ==========================================================
    const userText = pickUserTextFromBody(body);
    const isTutor = normalized.mode === "tutor";

    // Solo si parece fútbol, no hay imagen, y no es tutor:
    if (!isTutor && !normalized.imageBase64 && looksLikeFootballIntent(userText)) {
      const origin = req.nextUrl.origin;

      // 1) Resolver fixture por nombres
      const fxRes = await fetch(
        `${origin}/api/football/fixtures?q=${encodeURIComponent(userText)}&next=80`,
        { cache: "no-store" }
      );

      const fxJson = await fxRes.json().catch(() => null);

      if (fxRes.ok && fxJson?.bestFixtureId) {
        const fixtureId = fxJson.bestFixtureId;

        // 2) Llamar a predicción
        const predRes = await fetch(
          `${origin}/api/football/predict/match?fixture=${encodeURIComponent(String(fixtureId))}&profile=${encodeURIComponent(
            normalized.footballProfile
          )}`,
          { cache: "no-store" }
        );

        const pred = await predRes.json().catch(() => null);

        if (!predRes.ok || !pred) {
          return json(
            {
              text:
                `⚠️ He encontrado el partido (fixture=${fixtureId}) pero falló la predicción.\n\n` +
                `Prueba a pegar esto: **fixture=${fixtureId}**`,
              debug: { fixtureId, predStatus: predRes.status, pred },
            },
            200
          );
        }

        const home = pred?.fixture?.teams?.home?.name ?? "Local";
        const away = pred?.fixture?.teams?.away?.name ?? "Visitante";
        const kickoff = formatKickoffES(pred?.fixture?.date);

        const exp = pred?.summary?.expected || {};
        const q = pred?.quiniela || {};
        const one = q?.["1"] || {};
        const draw = q?.["X"] || {};
        const two = q?.["2"] || {};

        const bestPick = chooseBestSinglePick(pred?.markets);

        const pickLine = bestPick
          ? `✅ **Pick recomendado (1 solo, limpio):**\n- **${bestPick.label}** → **${pct(bestPick.p)}** · cuota justa **${bestPick.fairOdd ?? "—"}**`
          : `✅ **Pick recomendado:**\n- No he encontrado una línea con probabilidad ≥ 72% en los rangos actuales.`;

        const text =
          `🏟️ **${home} vs ${away}**\n` +
          `🗓️ ${kickoff}\n\n` +
          `**📌 Resumen esperado**\n` +
          `- ⚽ Goles totales: **${exp.goalsTotal ?? "—"}** (Local ${exp.goalsHome ?? "—"} · Visit ${exp.goalsAway ?? "—"})\n` +
          `- 🎯 Disparos totales: **${exp.shotsTotal ?? "—"}**\n` +
          `- 🥅 Tiros a puerta: **${exp.sotTotal ?? "—"}**\n` +
          `- 🚩 Córners: **${exp.cornersTotal ?? "—"}**\n` +
          `- 🟨 Tarjetas: **${exp.cardsTotal ?? "—"}**\n\n` +
          `**🎲 1X2 (probabilidades modelo)**\n` +
          `- 1: **${pct(one?.p)}** · justa ${one?.fairOdd ?? "—"}\n` +
          `- X: **${pct(draw?.p)}** · justa ${draw?.fairOdd ?? "—"}\n` +
          `- 2: **${pct(two?.p)}** · justa ${two?.fairOdd ?? "—"}\n\n` +
          `${pickLine}\n\n` +
          `🧠 _Nota_: “cuota justa” = mínima para que tenga valor matemático. Si tu book ofrece menos, puede seguir acertándose… pero ya no hay ventaja matemática.\n` +
          `_Disclaimer_: modelo orientativo, no certeza.`;

        return json({ text, source: "football-interceptor", fixtureId }, 200);
      }

      // Si no pudo resolver: devolvemos ayuda (sin análisis genérico)
      const candidates = Array.isArray(fxJson?.fixtures) ? fxJson.fixtures : [];
      const preview = candidates.slice(0, 6).map((f: any) => {
        const h = f?.teams?.home?.name ?? "Home";
        const a = f?.teams?.away?.name ?? "Away";
        const d = f?.date ? formatKickoffES(f.date) : "—";
        const l = f?.league?.name ?? "—";
        const id = f?.fixtureId ?? "—";
        return `- fixture=${id} · ${d} · ${h} vs ${a} · ${l}`;
      });

      return json(
        {
          text:
            `⚠️ No he podido elegir el partido con seguridad a partir de: **"${userText}"**.\n\n` +
            (preview.length
              ? `📋 He encontrado estos candidatos (elige uno y pégalo tal cual):\n${preview.join("\n")}\n\n✅ Ejemplo: **fixture=12345**`
              : `✅ Solución rápida: pega el que toque como **fixture=12345** (si lo tienes).`),
          source: "football-interceptor",
          debug: { fxJson },
        },
        200
      );
    }

    // ==========================================================
    // ✅ 2) SI NO ES FÚTBOL: tu flujo original con Supabase Edge
    // ==========================================================
    const supabaseUrl = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "");

    const supabaseAnonKey = (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY_FALLBACK ||
      ""
    ).trim();

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
          hint:
            "Verifica tu .env.local. Recomendado: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. (SUPABASE_EDGE_FUNCTION_URL es opcional).",
        },
        500
      );
    }

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
