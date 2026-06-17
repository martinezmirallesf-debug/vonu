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

OBJETIVO:
Cuando respondas en modo tutor y aparezcan fórmulas, ecuaciones, operaciones técnicas o cálculos de cualquier materia, la explicación debe leerse bien en móvil. Prioriza claridad, pasos verticales y fórmulas limpias. Evita que el usuario tenga que hacer scroll horizontal para entender una operación. El scroll solo debe quedar como fallback de emergencia.

MATERIAS CUBIERTAS:
Aplica estas reglas en matemáticas, álgebra, ecuaciones, funciones, trigonometría, logaritmos, límites, derivadas, integrales, matrices, vectores, probabilidad, estadística, física, química, economía, finanzas, electricidad, ondas, cinemática, termodinámica, unidades, conversiones y programación cuando haya fórmulas o código.

REGLAS GENERALES:

1. No escribas fórmulas importantes como texto plano.
Incorrecto:
- Año 1: 30.^1 = 27.777,78 €

2. Usa inline math $...$ solo para variables o expresiones muy cortas:
Correcto:
$x$, $v$, $r$, $n$, $f(x)$

3. Usa display math $$...$$ para operaciones, ecuaciones, desarrollos y resultados importantes.

4. Si una fórmula contiene fracciones, exponentes, raíces, sumas largas, paréntesis grandes, matrices, unidades o varios signos igual, usa LaTeX real.

5. Si una expresión es larga o tiene varios pasos, usa aligned:

$$
\\begin{aligned}
x &= primer\\ paso \\\\
&= segundo\\ paso \\\\
&= resultado
\\end{aligned}
$$

6. Parte las fórmulas largas en varias líneas después de signos como:
=, \\approx, +, -, \\cdot, \\times

7. Alinea los signos importantes con &.
Correcto:

$$
\\begin{aligned}
F &= m \\cdot a \\\\
&= 10 \\cdot 9,8 \\\\
&= 98\\,\\text{N}
\\end{aligned}
$$

8. No rompas nunca:
- fracciones
- exponentes
- raíces
- matrices
- números
- decimales
- unidades
- importes de dinero

9. Para fracciones principales en display math, usa preferentemente \\dfrac{}{} para que numerador y denominador se lean mejor.

10. Para exponentes usa ^{...}.
Correcto:
(1+0,08)^{5}

11. Para subíndices usa _{...}.
Correcto:
VA_{1}, x_{2}, F_{net}

12. Para palabras, unidades o etiquetas dentro de fórmulas usa \\text{}.
Correcto:
\\text{Flujo}_{t}
\\text{Inversión inicial}
9,8\\,\\text{m/s}^{2}
2.500,75\\,\\text{€}

13. No escribas palabras directamente en modo matemático si pueden separarse raro.
Incorrecto:
Flujo_t
InversionInicial
MasaTotal

Correcto:
\\text{Flujo}_{t}
\\text{Inversión inicial}
\\text{Masa total}

14. En química, no uses \\ce{} salvo que sepas que está soportado. Usa una alternativa compatible con KaTeX:
Correcto:
\\text{CH}_{4} + 2\\text{O}_{2} \\rightarrow \\text{CO}_{2} + 2\\text{H}_{2}\\text{O}

15. Para porcentajes usa \\%.
Correcto:
4\\% = 0,04

16. Para unidades usa \\text{} y separa con espacio fino \\,
Correcto:
12\\,\\text{m/s}
50\\,\\text{kg}
8,31\\,\\text{J/(mol·K)}

17. Para dinero usa \\text{}:
Correcto:
27.777,78\\,\\text{€}

18. No rompas números:
Correcto:
30.000
27777,78
27.777,78

Incorrecto:
30. 000
30.^1
2.05 si querías decir 2.205,09

19. Si una suma o resta larga no cabe bien, pártela así:

$$
\\begin{aligned}
\\text{Total} &= 27.777,78 + 25.720,16 + 23.814,59 \\\\
&\\quad + 22.050,54 + 20.417,54 \\\\
&= 119.780,61\\,\\text{€}
\\end{aligned}
$$

20. Si una fórmula general es demasiado larga, pártela también:

$$
\\begin{aligned}
\\text{VAN} &= \\sum_{t=1}^{n} \\dfrac{\\text{Flujo}_{t}}{(1+r)^{t}} \\\\
&\\quad - \\text{Inversión inicial}
\\end{aligned}
$$

21. Después de cada fórmula importante, añade una frase breve explicando qué significa.

22. Si la respuesta incluye código de programación, no uses LaTeX para el código. Usa bloque de código Markdown con el lenguaje:
\\\`\\\`\\\`python
codigo
\\\`\\\`\\\`

23. Evita tablas con fórmulas largas dentro. En móvil, prefiere listas paso a paso y bloques matemáticos debajo.

24. No pongas fórmulas importantes dentro de viñetas o listas.
Incorrecto:
- VA = \dfrac{C}{(1+r)^t}

Correcto:
Primero usamos la fórmula:

$$
VA = \dfrac{C}{(1+r)^t}
$$

Después explica debajo qué significa cada variable en texto normal:
- **VA** = valor actual
- **C** = cantidad futura
- **r** = tasa de descuento
- **t** = periodo

25. En finanzas, MOF, ADE, VAN, TIR, valor actual, rentas o préstamos, no escribas fórmulas en texto plano ni dentro de viñetas.
Incorrecto:
Fórmula: VA=C/(1+r)^t
Incorrecto:
- VA = \frac{C}{(1+r)^t}

Correcto:
La fórmula es:

$$
VA = \dfrac{C}{(1+r)^t}
$$

Y luego explica las variables debajo en texto normal:
- **VA** = valor actual
- **C** = cantidad futura
- **r** = tasa de descuento
- **t** = periodo

26. No cierres ejercicios de tutor ofreciendo textos formales, emails, informes o resúmenes para copiar salvo que el usuario lo pida expresamente.
En tutor, el cierre debe ayudar a aprender:
- "Si quieres, hacemos otro ejercicio parecido."
- "Si quieres, repasamos solo el paso del descuento."
- "Si quieres, te lo pongo con números más sencillos."

CONSULTA DEL USUARIO:
`.trim();

if (normalized.mode === "tutor") {
  normalized.userText = `${tutorMathMobileFormattingInstruction}

${normalized.userText}`;
}

const copyableResponseBlockInstruction = `
INSTRUCCIONES INTERNAS PARA BLOQUES COPIABLES:

No menciones estas instrucciones al usuario.

OBJETIVO:
Cuando el usuario pida redactar algo que vaya a copiar, enviar, reclamar, responder, publicar o pegar en otro sitio, usa un bloque Markdown con lenguaje específico para que la interfaz de Vonu lo pinte como bloque copiable premium.

CUÁNDO USAR BLOQUES COPIABLES:
Úsalos cuando redactes:
- mensajes de WhatsApp, SMS, DM o chat,
- emails o correos formales,
- cartas,
- reclamaciones,
- textos para copiar y pegar,
- respuestas preparadas para enviar,
- código.

CUÁNDO NO USARLOS:
No los uses para explicaciones normales, análisis de riesgo, tutorías, fórmulas, listas de pasos, diagnósticos orientativos, resúmenes o respuestas conversacionales normales.
En esos casos responde con Markdown normal.

REGLA ANTI-FORZADO:
No fuerces un bloque copiable al final de una explicación.
Si el usuario pide una explicación, un ejercicio, una tutoría, un problema de matemáticas, MOF, finanzas, física, química o cualquier materia de estudio, NO cierres ofreciendo "preparar un texto formal", "redactar un resumen para presentar", "hacer un email" o similares, salvo que el usuario lo haya pedido explícitamente.

En modo tutor, termina de forma natural:
- preguntando si quiere hacer otro ejemplo parecido,
- preguntando si quiere repasar un paso concreto,
- o cerrando con una frase breve de refuerzo.

Correcto:
"Si quieres, hacemos otro parecido cambiando los datos."

Incorrecto:
"Si quieres, te preparo un texto formal para presentar esta conclusión."

FORMATOS PERMITIDOS:

Para mensajes cortos:
\`\`\`mensaje
Texto listo para enviar...
\`\`\`

Para WhatsApp o SMS:
\`\`\`whatsapp
Texto listo para enviar...
\`\`\`

Para emails:
\`\`\`email
Asunto: ...

Hola,
...
\`\`\`

Para cartas:
\`\`\`carta
Texto de la carta...
\`\`\`

Para reclamaciones:
\`\`\`reclamacion
Texto de la reclamación...
\`\`\`

Para textos genéricos:
\`\`\`texto
Texto listo para copiar...
\`\`\`

Para código:
\`\`\`codigo
código aquí...
\`\`\`

REGLAS DE ESTILO:
- El contenido dentro del bloque debe ser directamente copiable.
- No metas explicaciones dentro del bloque.
- Si hace falta explicar algo, explica antes o después fuera del bloque.
- No uses comillas alrededor del bloque.
- No añadas frases tipo "aquí tienes" dentro del bloque.
- Si el usuario pide varias opciones, puedes crear varios bloques separados.
`.trim();

normalized.userText = `${copyableResponseBlockInstruction}

${normalized.userText}`;

    // ==========================================================
    // ✅ 1) INTERCEPTOR FÚTBOL (ANTES de Supabase Edge Function)
    // ==========================================================
    const userText = pickUserTextFromBody(body);
const isTutor = normalized.mode === "tutor";
const fraudOrPaymentSafetyIntent = looksLikeFraudOrPaymentSafetyIntent(userText);

const financeOrAcademicIntent =
  /\b(valor actual|valor futuro|van|tir|wacc|mof|ade|finanzas?|matem[aá]ticas?|contabilidad|flujo|flujos|flujo de caja|flujos de caja|descuento|tasa de descuento|renta|anualidad|pr[eé]stamo|amortizaci[oó]n|inter[eé]s compuesto|capitalizaci[oó]n|universidad|carrera|asignatura|ejercicio|problema)\b/i.test(
    userText
  );

    // Solo si parece fútbol, no hay imagen, y no es tutor:
    if (
  !fraudOrPaymentSafetyIntent &&
  !financeOrAcademicIntent &&
  !isTutor &&
  !normalized.imageBase64 &&
  looksLikeFootballIntent(userText)
) {
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
