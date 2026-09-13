import { NextRequest, NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";
import type { CaptureCheckResult, CaptureKind } from "@/lib/vonu-check/capture-types";
import type { RiskLevel, SignalTone, SupportedLocale } from "@/lib/vonu-check/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DATA_URL_CHARS = 3_500_000;

function cleanUrl(value: string) {
  return (value || "").trim().replace(/\/$/, "");
}

function clampScore(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function riskFromScore(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 35) return "caution";
  return "low";
}

function safeString(value: unknown, max = 800) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeStringArray(value: unknown, maxItems = 8, maxLength = 300) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => safeString(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeKind(value: unknown): CaptureKind {
  const allowed: CaptureKind[] = [
    "message",
    "email",
    "social_profile",
    "marketplace",
    "website_or_checkout",
    "other",
  ];
  return allowed.includes(value as CaptureKind) ? (value as CaptureKind) : "other";
}

function normalizeTone(value: unknown): SignalTone {
  if (value === "negative" || value === "warning" || value === "positive" || value === "neutral") {
    return value;
  }
  return "neutral";
}

function parseJsonText(text: string) {
  const clean = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const first = clean.indexOf("{");
    const last = clean.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(clean.slice(first, last + 1));
    }
    throw new Error("invalid_model_json");
  }
}

function promptFor(locale: SupportedLocale) {
  return `
You are VONU CAPTURE, a conservative screenshot fraud-risk analysis engine.

Analyse ONLY what is visible or reasonably inferable from the screenshot. The user interface language for all human-readable output is: ${locale}.

The screenshot may contain an SMS, WhatsApp/Telegram chat, email, social profile, marketplace seller, website, checkout/payment page or another digital situation.

Goals:
1. Classify the screenshot context.
2. Detect concrete fraud/phishing/social-engineering risk signals.
3. Extract visible URLs, phone numbers, emails and brand names exactly when legible.
4. Explain the strongest evidence briefly.
5. Give practical, non-legal next actions.

Important rules:
- Be conservative. Do not call a person a scammer or criminal.
- Risk score is a CAUTION INDEX, not a probability that a crime occurred.
- HTTPS, logos, follower counts, spelling, verification badges or visual polish are never proof by themselves.
- Do not invent account age, follower metrics, domain age, hidden URLs, reputation results or external facts that are not visible in the screenshot.
- If evidence is incomplete, say so and lower confidence.
- A screenshot alone cannot verify that an identity is genuine.
- For social profiles, distinguish visible anomalies from facts that require external verification.
- For links visible in the image, copy the visible URL as accurately as possible. Do not invent missing characters.
- Keep signals concise and useful on mobile.

Return ONLY valid JSON. No markdown and no prose outside JSON.

Schema:
{
  "kind": "message|email|social_profile|marketplace|website_or_checkout|other",
  "risk": {
    "score": 0,
    "confidence": "limited|medium|high"
  },
  "summary": "one short conclusion in ${locale}",
  "signals": [
    {
      "id": "short_machine_id",
      "tone": "positive|warning|negative|neutral",
      "title": "short title in ${locale}",
      "detail": "brief evidence-based explanation in ${locale}",
      "weight": 0
    }
  ],
  "extracted": {
    "urls": [],
    "phones": [],
    "emails": [],
    "brands": []
  },
  "recommendedActions": ["short practical action in ${locale}"],
  "limitations": ["short limitation in ${locale}"]
}

Use weight 0-30 only for genuinely risk-increasing signals; positive/neutral signals should normally have weight 0.
`.trim();
}

const linkedCopy: Record<SupportedLocale, { high: [string, string]; caution: [string, string]; low: [string, string] }> = {
  es: {
    high: ["El enlace visible añade riesgo técnico", "Vonu pudo comprobar el enlace extraído de la captura y encontró señales técnicas de riesgo relevantes."],
    caution: ["El enlace visible merece revisión", "Vonu pudo comprobar el enlace extraído y encontró señales técnicas que aconsejan precaución."],
    low: ["El enlace visible no muestra alertas técnicas fuertes", "La comprobación técnica básica del enlace visible no encontró señales fuertes, aunque esto no certifica que sea legítimo."],
  },
  en: {
    high: ["The visible link adds technical risk", "Vonu checked the link extracted from the screenshot and found relevant technical risk signals."],
    caution: ["The visible link deserves review", "Vonu checked the extracted link and found technical signals that warrant caution."],
    low: ["The visible link has no strong technical alerts", "The basic technical check found no strong signals, although this does not certify legitimacy."],
  },
  fr: {
    high: ["Le lien visible ajoute un risque technique", "Vonu a vérifié le lien extrait de la capture et a trouvé des signaux techniques de risque importants."],
    caution: ["Le lien visible mérite une vérification", "Vonu a vérifié le lien extrait et a trouvé des signaux techniques qui appellent à la prudence."],
    low: ["Le lien visible ne présente pas d’alerte technique forte", "La vérification technique de base n’a pas trouvé de signal fort, sans pour autant certifier la légitimité."],
  },
  de: {
    high: ["Der sichtbare Link erhöht das technische Risiko", "Vonu hat den aus dem Screenshot extrahierten Link geprüft und relevante technische Risikosignale gefunden."],
    caution: ["Der sichtbare Link sollte geprüft werden", "Vonu hat den extrahierten Link geprüft und technische Signale gefunden, die Vorsicht nahelegen."],
    low: ["Der sichtbare Link zeigt keine starken technischen Warnungen", "Die technische Basisprüfung fand keine starken Signale; das bestätigt jedoch nicht die Seriosität."],
  },
  ar: {
    high: ["الرابط الظاهر يضيف خطراً تقنياً", "تمكن Vonu من فحص الرابط المستخرج من الصورة ووجد إشارات تقنية مهمة للمخاطر."],
    caution: ["الرابط الظاهر يستحق مزيداً من التحقق", "تمكن Vonu من فحص الرابط المستخرج ووجد إشارات تقنية تستدعي الحذر."],
    low: ["لا توجد إنذارات تقنية قوية في الرابط الظاهر", "لم يجد الفحص التقني الأساسي إشارات قوية، لكن ذلك لا يثبت أن الموقع شرعي."],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const imageBase64 = typeof body?.imageBase64 === "string" ? body.imageBase64.trim() : "";
    const localeValue = typeof body?.locale === "string" ? body.locale : "es";
    const locale: SupportedLocale = isSupportedLocale(localeValue) ? localeValue : "es";

    if (!imageBase64 || !/^data:image\/(?:png|jpe?g|webp);base64,/i.test(imageBase64)) {
      return NextResponse.json({ error: "invalid_image" }, { status: 400 });
    }

    if (imageBase64.length > MAX_DATA_URL_CHARS) {
      return NextResponse.json({ error: "image_too_large" }, { status: 413 });
    }

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

    if (!supabaseAnonKey || !edgeUrl) {
      return NextResponse.json({ error: "vision_not_configured" }, { status: 500 });
    }

    const edgeResponse = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        messages: [],
        userText: promptFor(locale),
        imageBase64,
        pdfText: null,
        mode: "chat",
        tutorLevel: "adult",
        footballProfile: "normal",
        extraInstructions: "Return only the requested JSON object. Do not wrap it in markdown.",
      }),
      cache: "no-store",
    });

    const edgeRaw = await edgeResponse.text().catch(() => "");
    let edgeData: any = null;
    try {
      edgeData = edgeRaw ? JSON.parse(edgeRaw) : null;
    } catch {
      edgeData = null;
    }

    if (!edgeResponse.ok || !edgeData || typeof edgeData.text !== "string") {
      return NextResponse.json(
        { error: "vision_analysis_failed", details: edgeData ?? edgeRaw ?? null },
        { status: 502 },
      );
    }

    const parsed = parseJsonText(edgeData.text);
    const baseScore = clampScore(parsed?.risk?.score);
    const signals = Array.isArray(parsed?.signals)
      ? parsed.signals.slice(0, 10).map((signal: any, index: number) => ({
          id: safeString(signal?.id, 80) || `signal_${index + 1}`,
          tone: normalizeTone(signal?.tone),
          title: safeString(signal?.title, 140),
          detail: safeString(signal?.detail, 700),
          weight: Math.max(0, Math.min(30, clampScore(signal?.weight))),
        })).filter((signal: any) => signal.title && signal.detail)
      : [];

    const extracted = {
      urls: safeStringArray(parsed?.extracted?.urls, 5, 500),
      phones: safeStringArray(parsed?.extracted?.phones, 5, 80),
      emails: safeStringArray(parsed?.extracted?.emails, 5, 180),
      brands: safeStringArray(parsed?.extracted?.brands, 6, 100),
    };

    let linkedUrlCheck: CaptureCheckResult["linkedUrlCheck"] = null;
    const candidateUrl = extracted.urls.find((value) => /^https?:\/\//i.test(value));

    if (candidateUrl) {
      try {
        const web = await collectWebSignals(candidateUrl, locale);
        linkedUrlCheck = {
          url: web.facts.finalUrl || candidateUrl,
          risk: web.risk,
          signals: web.signals.slice(0, 5),
        };

        const [title, detail] = linkedCopy[locale][web.risk.level === "high" ? "high" : web.risk.level === "caution" ? "caution" : "low"];
        signals.push({
          id: "linked_url_check",
          tone: web.risk.level === "high" ? "negative" : web.risk.level === "caution" ? "warning" : "positive",
          title,
          detail,
          weight: web.risk.level === "high" ? 20 : web.risk.level === "caution" ? 10 : 0,
        });
      } catch {
        linkedUrlCheck = null;
      }
    }

    const linkedScore = linkedUrlCheck?.risk?.score ?? 0;
    const finalScore = Math.max(baseScore, linkedScore);
    const confidenceValue = parsed?.risk?.confidence;
    const confidence: "limited" | "medium" | "high" =
      confidenceValue === "high" || confidenceValue === "medium" || confidenceValue === "limited"
        ? confidenceValue
        : linkedUrlCheck
          ? "medium"
          : "limited";

    const result: CaptureCheckResult = {
      version: "vonu-capture-v1",
      checkedAt: new Date().toISOString(),
      locale,
      kind: normalizeKind(parsed?.kind),
      risk: {
        level: riskFromScore(finalScore),
        score: finalScore,
        confidence,
      },
      summary: safeString(parsed?.summary, 700),
      signals,
      extracted,
      recommendedActions: safeStringArray(parsed?.recommendedActions, 6, 450),
      linkedUrlCheck,
      limitations: safeStringArray(parsed?.limitations, 5, 400),
    };

    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("[vonu-check/image]", error);
    return NextResponse.json({ error: "capture_check_failed" }, { status: 500 });
  }
}
