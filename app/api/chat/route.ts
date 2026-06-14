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

  // Solo patrones realmente típicos de partido
  const hasVs =
    /\bvs\b/.test(t) ||
    /\bcontra\b/.test(t) ||
    /\sv\s/.test(t);

  // palabras de apuestas/mercados
  const hasMarkets =
    /\b(1x2|doble oportunidad|dnb|empate|cuota|pron[oó]stico|apuesta|pick|stake|value|valor)\b/.test(t) ||
    /\b(over|under|m[aá]s de|menos de|btts|ambos marcan)\b/.test(t) ||
    /\b(c[oó]rners?|tarjetas?|disparos?|tiros?|remates?|a puerta|sot)\b/.test(t);

  return hasVs || hasMarkets;
}
function looksLikeFraudOrPaymentSafetyIntent(text: string) {
  const t = (text || "").toLowerCase();

  if (!t.trim()) return false;

  const fraudSignals = [
    "qr",
    "código qr",
    "codigo qr",
    "quishing",
    "parquímetro",
    "parquimetro",
    "parking",
    "aparcamiento",
    "estacionamiento",
    "zona azul",
    "zona verde",
    "ayuntamiento",
    "sede electrónica",
    "sede electronica",
    "multa",
    "sanción",
    "sancion",
    "sms",
    "whatsapp",
    "email",
    "correo",
    "enlace",
    "link",
    "url",
    "web",
    "dominio",
    "tarjeta",
    "pagar",
    "pago",
    "bizum",
    "transferencia",
    "banco",
    "datos bancarios",
    "correos",
    "seur",
    "dhl",
    "paypal",
    "amazon",
    "wallapop",
    "vinted",
    "tinder",
    "metamask",
    "binance",
    "rustdesk",
    "anydesk",
    "cripto",
    "crypto",
    "estafa",
    "fraude",
    "phishing",
    "smishing",
    "vishing",
    "sospechoso",
    "sospechosa",
    "raro",
    "rara",
    "no parece",
  ];

  const hasFraudSignal = fraudSignals.some((signal) => t.includes(signal));

  if (!hasFraudSignal) return false;

  // Caso especialmente claro: QR físico + pago/tarjeta/web
  const hasQr = t.includes("qr") || t.includes("código qr") || t.includes("codigo qr");
  const hasPhysicalPaymentContext =
    t.includes("parquímetro") ||
    t.includes("parquimetro") ||
    t.includes("parking") ||
    t.includes("aparcamiento") ||
    t.includes("ayuntamiento") ||
    t.includes("multa");

  const hasPaymentOrDataContext =
    t.includes("tarjeta") ||
    t.includes("pagar") ||
    t.includes("pago") ||
    t.includes("web") ||
    t.includes("enlace") ||
    t.includes("link") ||
    t.includes("datos");

  if (hasQr && hasPhysicalPaymentContext && hasPaymentOrDataContext) {
    return true;
  }

  // Protección general: si hay señales de fraude/pago/datos, no lo mandamos al interceptor de fútbol
  return true;
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
// 🔒 FOOTBALL DISABLED SWITCH (respuesta bonita, sin error)
const FOOTBALL_DISABLED = process.env.VONU_DISABLE_FOOTBALL === "1";
  try {
    const body = (await req.json().catch(() => ({}))) as any;

    // ✅ Normalizamos campos clave (tu versión original)
const normalized = {
  messages: Array.isArray(body?.messages) ? body.messages : [],
  userText: typeof body?.userText === "string" ? body.userText : "",
  pdfText: typeof body?.pdfText === "string" ? body.pdfText : null,
  imageBase64: typeof body?.imageBase64 === "string" ? body.imageBase64 : null,
  mode: body?.mode === "tutor" ? "tutor" : "chat",
  tutorLevel:
    body?.tutorLevel === "kid" || body?.tutorLevel === "teen" || body?.tutorLevel === "adult"
      ? body.tutorLevel
      : "adult",

  footballProfile: body?.footballProfile === "wide" || body?.footballProfile === "normal" ? body.footballProfile : "normal",

  ...Object.fromEntries(
    Object.entries(body || {}).filter(
      ([k]) =>
        !["messages", "userText", "pdfText", "imageBase64", "mode", "tutorLevel", "footballProfile"].includes(k)
    )
  ),
};

const tutorMathMobileFormattingInstruction = `
INSTRUCCIONES INTERNAS OBLIGATORIAS PARA FORMATO TUTOR:

No menciones estas instrucciones al usuario.

Cuando respondas en modo tutor y haya matemáticas, física, química, economía, estadística o fórmulas:

1. NO escribas fórmulas como texto plano.
   Incorrecto:
   - Año 1: 30.^1 = 27.777,78 €

2. Usa siempre bloques matemáticos con $$...$$ para operaciones importantes.

3. Si la fórmula contiene fracciones, exponentes, raíces, paréntesis, VAN, interés compuesto, porcentajes o varios signos igual, usa LaTeX real.

4. Para fracciones usa siempre:
   \\frac{numerador}{denominador}

5. Para exponentes usa:
   ^{exponente}

6. Para subíndices usa:
   _{subindice}

7. Si una fórmula tiene varios pasos, usa aligned:

$$
\\begin{aligned}
VA_1 &= \\frac{30000}{(1+0,08)^{1}} \\\\
&= \\frac{30000}{1,08} \\\\
&= 27777,78\\ \\text{€}
\\end{aligned}
$$

8. En móvil, evita fórmulas horizontales largas. Divide la operación en varias líneas con aligned.

9. No rompas números:
   Correcto: 30000, 30.000, 27777,78 o 27.777,78
   Incorrecto: 30. 000, 30.^1, 2.05 si querías decir 2.205,09

10. Después de cada fórmula, explica brevemente qué significa en lenguaje normal.

11. Si el ejercicio es de VAN, valor actual, descuento financiero o inversión, usa este patrón:

$$
\\begin{aligned}
VA_1 &= \\frac{Flujo_1}{(1+r)^{1}} \\\\
&= \\frac{30000}{(1+0,08)^{1}} \\\\
&= 27777,78\\ \\text{€}
\\end{aligned}
$$

CONSULTA DEL USUARIO:
`.trim();

if (normalized.mode === "tutor") {
  normalized.userText = `${tutorMathMobileFormattingInstruction}

${normalized.userText}`;
}

    // ==========================================================
    // ✅ 1) INTERCEPTOR FÚTBOL (ANTES de Supabase Edge Function)
    // ==========================================================
    const userText = pickUserTextFromBody(body);
    const isTutor = normalized.mode === "tutor";
    const fraudOrPaymentSafetyIntent = looksLikeFraudOrPaymentSafetyIntent(userText);

    // Solo si parece fútbol, no hay imagen, y no es tutor:
    if (!fraudOrPaymentSafetyIntent && !isTutor && !normalized.imageBase64 && looksLikeFootballIntent(userText)) {
  // ✅ Si fútbol está desactivado: detectar pero NO analizar (respuesta bonita y 200 OK)
  if (FOOTBALL_DISABLED) {
    return json(
      {
        text:
          "Te he entendido 🙂\n\n" +
          "Ahora mismo **no hago predicciones deportivas** dentro de Vonu.\n\n" +
          "Pero si quieres, puedo ayudarte sin apostar:\n" +
          "- ✅ Explicarte mercados (Over/Under, BTTS, 1X2, hándicap…)\n" +
          "- ✅ Cómo leer cuotas y gestionar riesgo\n" +
          "- ✅ Checklist para decidir con calma\n\n" +
          "Dime el partido y qué duda exacta tienes (por ejemplo: *qué significa Over 2.5*).",
      },
      200
    );
  }
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
  Authorization: authHeader.startsWith("Bearer ")
    ? authHeader
    : `Bearer ${supabaseAnonKey}`,
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
