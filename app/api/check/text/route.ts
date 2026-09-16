import { NextRequest, NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";
import { pickEmbeddedUrls } from "@/lib/vonu-check/embedded-url";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";
import type { CaptureKind } from "@/lib/vonu-check/capture-types";
import type { TextCheckResult } from "@/lib/vonu-check/text-types";
import type { RiskLevel, SignalTone, SupportedLocale } from "@/lib/vonu-check/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 20_000;

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

function combineIndependentScores(a: number, b: number) {
  if (a <= 0) return clampScore(b);
  if (b <= 0) return clampScore(a);
  const strongest = Math.max(a, b);
  const supporting = Math.min(a, b);
  return clampScore(strongest + Math.round(supporting * 0.2));
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

function promptFor(locale: SupportedLocale, userText: string) {
  return `
You are VONU TEXT, a conservative fraud-risk analysis engine.

Analyse the user-provided text below. It may be an SMS, WhatsApp/Telegram message, email, marketplace conversation, social-profile bio, suspicious offer or another digital interaction.
The interface language for all human-readable output is: ${locale}.

Goals:
1. Classify the context.
2. Detect concrete phishing, impersonation, manipulation, urgency and fraud-risk signals.
3. Extract visible URLs, phone numbers, emails and brand names exactly when present.
4. Explain the strongest evidence briefly.
5. Give practical, non-legal next actions.

Rules:
- Be conservative. Never state that a person is a criminal or scammer as a fact.
- The score is a CAUTION INDEX, not a probability that a crime occurred.
- Do not invent sender identity, account age, domain reputation, hidden links or external facts.
- If context is incomplete, lower confidence and say so.
- Legitimate-looking language, logos or spelling are not proof of legitimacy.
- Keep signals concise and useful on mobile.

Return ONLY valid JSON, no markdown.
Schema:
{
  "kind": "message|email|social_profile|marketplace|website_or_checkout|other",
  "risk": { "score": 0, "confidence": "limited|medium|high" },
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
  "extracted": { "urls": [], "phones": [], "emails": [], "brands": [] },
  "recommendedActions": ["short practical action in ${locale}"],
  "limitations": ["short limitation in ${locale}"]
}

Use weight 0-30 only for genuinely risk-increasing signals; positive/neutral signals should normally have weight 0.

USER TEXT:
---
${userText}
---
`.trim();
}

const linkedCopy: Record<SupportedLocale, { high: [string, string]; caution: [string, string]; low: [string, string] }> = {
  es: {
    high: ["El enlace incluido añade riesgo técnico", "Vonu comprobó el enlace visible en el texto y encontró señales técnicas o de reputación relevantes."],
    caution: ["El enlace incluido merece revisión", "Vonu comprobó el enlace visible en el texto y encontró señales técnicas que aconsejan precaución."],
    low: ["El enlace incluido no muestra alertas técnicas fuertes", "La comprobación técnica y de reputación disponible no encontró señales fuertes, aunque esto no certifica que sea legítimo."],
  },
  en: {
    high: ["The included link adds technical risk", "Vonu checked the visible link in the text and found relevant technical or reputation risk signals."],
    caution: ["The included link deserves review", "Vonu checked the visible link and found technical signals that warrant caution."],
    low: ["The included link has no strong technical alerts", "The available technical and reputation checks found no strong signals, although this does not certify legitimacy."],
  },
  fr: {
    high: ["Le lien inclus ajoute un risque technique", "Vonu a vérifié le lien visible dans le texte et a trouvé des signaux techniques ou de réputation importants."],
    caution: ["Le lien inclus mérite une vérification", "Vonu a vérifié le lien visible et a trouvé des signaux techniques qui appellent à la prudence."],
    low: ["Le lien inclus ne présente pas d’alerte technique forte", "Les vérifications techniques et de réputation disponibles n’ont pas trouvé de signal fort, sans certifier la légitimité."],
  },
  de: {
    high: ["Der enthaltene Link erhöht das technische Risiko", "Vonu hat den sichtbaren Link im Text geprüft und relevante technische oder Reputationssignale gefunden."],
    caution: ["Der enthaltene Link sollte geprüft werden", "Vonu hat den sichtbaren Link geprüft und technische Signale gefunden, die Vorsicht nahelegen."],
    low: ["Der enthaltene Link zeigt keine starken technischen Warnungen", "Die verfügbaren technischen und Reputationsprüfungen fanden keine starken Signale; das bestätigt jedoch nicht die Seriosität."],
  },
  ar: {
    high: ["الرابط المضمن يضيف خطراً تقنياً", "فحص Vonu الرابط الظاهر في النص ووجد إشارات تقنية أو إشارات سمعة مهمة للمخاطر."],
    caution: ["الرابط المضمن يستحق مزيداً من التحقق", "فحص Vonu الرابط الظاهر ووجد إشارات تقنية تستدعي الحذر."],
    low: ["لا توجد إنذارات تقنية قوية في الرابط المضمن", "لم تجد الفحوص التقنية وفحوص السمعة المتاحة إشارات قوية، لكن ذلك لا يثبت أن الموقع شرعي."],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const localeValue = typeof body?.locale === "string" ? body.locale : "es";
    const locale: SupportedLocale = isSupportedLocale(localeValue) ? localeValue : "es";

    if (!text || text.length > MAX_TEXT_CHARS) {
      return NextResponse.json({ error: "invalid_text" }, { status: 400 });
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
      return NextResponse.json({ error: "text_analysis_not_configured" }, { status: 500 });
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
        userText: promptFor(locale, text),
        imageBase64: null,
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
        { error: "text_analysis_failed", details: edgeData ?? edgeRaw ?? null },
        { status: 502 },
      );
    }

    const parsed = parseJsonText(edgeData.text);
    const baseScore = clampScore(parsed?.risk?.score);
    const signals = Array.isArray(parsed?.signals)
      ? parsed.signals
          .slice(0, 10)
          .map((signal: any, index: number) => ({
            id: safeString(signal?.id, 80) || `signal_${index + 1}`,
            tone: normalizeTone(signal?.tone),
            title: safeString(signal?.title, 140),
            detail: safeString(signal?.detail, 700),
            weight: Math.max(0, Math.min(30, clampScore(signal?.weight))),
          }))
          .filter((signal: any) => signal.title && signal.detail)
      : [];

    const extracted = {
      urls: safeStringArray(parsed?.extracted?.urls, 5, 500),
      phones: safeStringArray(parsed?.extracted?.phones, 5, 80),
      emails: safeStringArray(parsed?.extracted?.emails, 5, 180),
      brands: safeStringArray(parsed?.extracted?.brands, 6, 100),
    };

    let linkedUrlCheck: TextCheckResult["linkedUrlCheck"] = null;
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
        // Keep the AI analysis even when a linked URL cannot be fetched safely.
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
    const finalScore = combineIndependentScores(baseScore, linkedScore);
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
          : linkedUrlCheck || modelConfidence === "medium"
            ? "medium"
            : "limited";

    const result: TextCheckResult = {
      version: "vonu-text-v1",
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
    console.error("[vonu-check/text]", error);
    return NextResponse.json({ error: "text_check_failed" }, { status: 500 });
  }
}
