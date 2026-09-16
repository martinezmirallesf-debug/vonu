import { NextRequest, NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";
import { pickEmbeddedUrls } from "@/lib/vonu-check/embedded-url";
import { extractReverseImageEvidence, reverseImageSignal } from "@/lib/vonu-check/reverse-image";
import { lookupSupabaseReverseImage } from "@/lib/vonu-check/supabase-evidence";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";
import {
  calibrateModelRiskScore,
  clampRiskScore,
  combineIndependentRiskScores,
  riskBandFromScore,
  riskLevelFromScore,
} from "@/lib/vonu-check/risk-score";
import type { CaptureCheckResult, CaptureKind } from "@/lib/vonu-check/capture-types";
import type { SignalTone, SupportedLocale } from "@/lib/vonu-check/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DATA_URL_CHARS = 3_500_000;

function cleanUrl(value: string) {
  return (value || "").trim().replace(/\/$/, "");
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
    if (first >= 0 && last > first) return JSON.parse(clean.slice(first, last + 1));
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

VONU RISK SCORE:
- Return a score from 0 to 100 where 0 means no risk signals were detected in the available evidence and 100 means maximum risk evidence.
- Use the same calibration for every analysis: 0-19 very low, 20-39 low, 40-59 moderate, 60-79 high, 80-100 very high.
- The score is a risk index, NOT a probability that fraud or a crime occurred.
- Strong, specific evidence must move the score more than visual polish, vague suspicion or missing information.
- Missing context should reduce confidence, not automatically increase the score.
- The summary must describe the evidence and recommended caution, not repeat a numeric score or a risk-band label.

Important rules:
- Be conservative. Do not call a person a scammer or criminal.
- HTTPS, logos, follower counts, spelling, verification badges or visual polish are never proof by themselves.
- Do not invent account age, follower metrics, domain age, hidden URLs, reputation results or external facts that are not visible in the screenshot or explicitly supplied by the analysis backend.
- If evidence is incomplete, say so and lower confidence.
- A screenshot alone cannot verify that an identity is genuine.
- For social profiles, distinguish visible anomalies from facts that require external verification.
- For links visible in the image, copy the visible URL as accurately as possible. Do not invent missing characters.
- Keep signals concise and useful on mobile.

Return ONLY valid JSON. No markdown and no prose outside JSON.

Schema:
{
  "kind": "message|email|social_profile|marketplace|website_or_checkout|other",
  "risk": { "score": 0, "confidence": "limited|medium|high" },
  "summary": "one short evidence-based conclusion in ${locale}, without a score or risk-band label",
  "signals": [{
    "id": "short_machine_id",
    "tone": "positive|warning|negative|neutral",
    "title": "short title in ${locale}",
    "detail": "brief evidence-based explanation in ${locale}",
    "weight": 0
  }],
  "extracted": { "urls": [], "phones": [], "emails": [], "brands": [] },
  "recommendedActions": ["short practical action in ${locale}"],
  "limitations": ["short limitation in ${locale}"]
}

Use weight 0-30 only for genuinely risk-increasing signals; positive/neutral signals should normally have weight 0.
`.trim();
}

const linkedCopy: Record<SupportedLocale, { high: [string, string]; caution: [string, string]; low: [string, string] }> = {
  es: {
    high: ["El enlace visible añade riesgo técnico", "Vonu comprobó el enlace extraído de la captura y encontró señales técnicas o de reputación relevantes."],
    caution: ["El enlace visible merece revisión", "Vonu comprobó el enlace extraído y encontró señales técnicas que aconsejan precaución."],
    low: ["El enlace visible no muestra alertas técnicas fuertes", "La comprobación técnica y de reputación disponible no encontró señales fuertes, aunque esto no certifica que sea legítimo."],
  },
  en: {
    high: ["The visible link adds technical risk", "Vonu checked the link extracted from the screenshot and found relevant technical or reputation risk signals."],
    caution: ["The visible link deserves review", "Vonu checked the extracted link and found technical signals that warrant caution."],
    low: ["The visible link has no strong technical alerts", "The available technical and reputation checks found no strong signals, although this does not certify legitimacy."],
  },
  fr: {
    high: ["Le lien visible ajoute un risque technique", "Vonu a vérifié le lien extrait de la capture et a trouvé des signaux techniques ou de réputation importants."],
    caution: ["Le lien visible mérite une vérification", "Vonu a vérifié le lien extrait et a trouvé des signaux techniques qui appellent à la prudence."],
    low: ["Le lien visible ne présente pas d’alerte technique forte", "Les vérifications techniques et de réputation disponibles n’ont pas trouvé de signal fort, sans pour autant certifier la légitimité."],
  },
  de: {
    high: ["Der sichtbare Link erhöht das technische Risiko", "Vonu hat den aus dem Screenshot extrahierten Link geprüft und relevante technische oder Reputationssignale gefunden."],
    caution: ["Der sichtbare Link sollte geprüft werden", "Vonu hat den extrahierten Link geprüft und technische Signale gefunden, die Vorsicht nahelegen."],
    low: ["Der sichtbare Link zeigt keine starken technischen Warnungen", "Die verfügbaren technischen und Reputationsprüfungen fanden keine starken Signale; das bestätigt jedoch nicht die Seriosität."],
  },
  ar: {
    high: ["الرابط الظاهر يضيف خطراً تقنياً", "فحص Vonu الرابط المستخرج من الصورة ووجد إشارات تقنية أو إشارات سمعة مهمة للمخاطر."],
    caution: ["الرابط الظاهر يستحق مزيداً من التحقق", "فحص Vonu الرابط المستخرج ووجد إشارات تقنية تستدعي الحذر."],
    low: ["لا توجد إنذارات تقنية قوية في الرابط الظاهر", "لم تجد الفحوص التقنية وفحوص السمعة المتاحة إشارات قوية، لكن ذلك لا يثبت أن الموقع شرعي."],
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
    const edgeUrl = cleanUrl(process.env.SUPABASE_EDGE_FUNCTION_URL || "") ||
      (supabaseUrl ? `${supabaseUrl}/functions/v1/quick-service` : "");

    if (!supabaseAnonKey || !edgeUrl) {
      return NextResponse.json({ error: "vision_not_configured" }, { status: 500 });
    }

    // Structured reverse-image evidence runs independently. It explains/corroborates
    // the result but is not added again to the score because quick-service already
    // consumes reverse-image context internally.
    const reverseEvidencePromise = lookupSupabaseReverseImage(imageBase64);

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
    const rawBaseScore = clampRiskScore(parsed?.risk?.score);
    const kind = normalizeKind(parsed?.kind);
    const signals = Array.isArray(parsed?.signals)
      ? parsed.signals
          .slice(0, 10)
          .map((signal: any, index: number) => ({
            id: safeString(signal?.id, 80) || `signal_${index + 1}`,
            tone: normalizeTone(signal?.tone),
            title: safeString(signal?.title, 140),
            detail: safeString(signal?.detail, 700),
            weight: Math.max(0, Math.min(30, clampRiskScore(signal?.weight))),
          }))
          .filter((signal: any) => signal.title && signal.detail)
      : [];
    const baseScore = calibrateModelRiskScore(rawBaseScore, signals);

    const extracted = {
      urls: safeStringArray(parsed?.extracted?.urls, 5, 500),
      phones: safeStringArray(parsed?.extracted?.phones, 5, 80),
      emails: safeStringArray(parsed?.extracted?.emails, 5, 180),
      brands: safeStringArray(parsed?.extracted?.brands, 6, 100),
    };

    const evidenceData = await reverseEvidencePromise;
    const reverseEvidence = extractReverseImageEvidence(evidenceData ?? edgeData);
    const reuseSignal = reverseImageSignal(locale, reverseEvidence, kind);
    if (reuseSignal) signals.push({ ...reuseSignal, weight: 0 });

    let linkedUrlCheck: CaptureCheckResult["linkedUrlCheck"] = null;
    const candidateUrls = pickEmbeddedUrls(extracted.urls, 2);

    for (const candidateUrl of candidateUrls) {
      try {
        const baseWeb = await collectWebSignals(candidateUrl, locale);
        const web = await enrichWebResult(baseWeb);
        if (!linkedUrlCheck || web.risk.score > linkedUrlCheck.risk.score) {
          linkedUrlCheck = {
            url: web.facts.finalUrl || candidateUrl,
            risk: web.risk,
            signals: web.signals.slice(0, 8),
          };
        }
      } catch {
        // Screenshot analysis remains useful if a visible URL cannot be fetched safely.
      }
    }

    if (linkedUrlCheck && linkedUrlCheck.risk.level !== "unknown") {
      const key = linkedUrlCheck.risk.level === "high"
        ? "high"
        : linkedUrlCheck.risk.level === "caution"
          ? "caution"
          : "low";
      const [title, detail] = linkedCopy[locale][key];
      signals.push({
        id: "linked_url_check",
        tone: linkedUrlCheck.risk.level === "high"
          ? "negative"
          : linkedUrlCheck.risk.level === "caution"
            ? "warning"
            : "positive",
        title,
        detail,
        weight: linkedUrlCheck.risk.level === "high" ? 24 : linkedUrlCheck.risk.level === "caution" ? 12 : 0,
      });
    }

    const linkedScore = linkedUrlCheck?.risk?.score ?? 0;
    const finalScore = combineIndependentRiskScores(baseScore, linkedScore);

    const confidenceValue = parsed?.risk?.confidence;
    const modelConfidence: "limited" | "medium" | "high" =
      confidenceValue === "high" || confidenceValue === "medium" || confidenceValue === "limited"
        ? confidenceValue
        : "limited";
    const confidence: "limited" | "medium" | "high" =
      linkedUrlCheck?.risk?.confidence === "high"
        ? "high"
        : modelConfidence === "high"
          ? "high"
          : linkedUrlCheck || reverseEvidence.available || modelConfidence === "medium"
            ? "medium"
            : "limited";

    const result: CaptureCheckResult = {
      version: "vonu-capture-v1",
      checkedAt: new Date().toISOString(),
      locale,
      kind,
      risk: {
        level: riskLevelFromScore(finalScore),
        band: riskBandFromScore(finalScore),
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

    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[vonu-check/image]", error);
    return NextResponse.json({ error: "capture_check_failed" }, { status: 500 });
  }
}
