import { NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";
import type { SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPLICIT_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const TRANSIENT_NETWORK_MARKERS = [
  "EBUSY",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "ECONNRESET",
  "ENETDOWN",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "UND_ERR_CONNECT_TIMEOUT",
];
const NON_BILLABLE_RESULT_ERRORS = new Set([
  "dns_not_found",
  "dns_temporarily_unavailable",
  "target_timeout",
  "target_unreachable",
  "too_many_redirects",
  "unsupported_redirect",
]);

type UnavailableReason =
  | "dns_not_found"
  | "dns_temporarily_unavailable"
  | "target_timeout"
  | "target_unreachable"
  | "too_many_redirects"
  | "unsupported_redirect";

const unavailableCopy: Record<SupportedLocale, Record<UnavailableReason, [string, string]>> = {
  es: {
    dns_not_found: ["El dominio no está disponible", "No hemos encontrado una dirección DNS pública para este dominio. Puede estar mal escrito, haber caducado o no estar publicado en este momento."],
    dns_temporarily_unavailable: ["No hemos podido consultar el dominio temporalmente", "Nuestro servidor no ha podido completar la consulta DNS tras varios intentos. No hemos sacado conclusiones sobre la seguridad del enlace; vuelve a intentarlo en unos segundos."],
    target_timeout: ["La web tarda demasiado en responder", "La página no respondió dentro del tiempo de seguridad del análisis. Esto puede deberse a una caída, saturación o bloqueo de comprobaciones automáticas."],
    target_unreachable: ["No hemos podido conectar con la web", "El dominio existe, pero el servidor no ha aceptado o completado la conexión. No podemos sacar una conclusión fiable sobre su seguridad."],
    too_many_redirects: ["El enlace cambia de destino demasiadas veces", "La comprobación se detuvo porque el enlace encadenó más redirecciones de las permitidas. Conviene revisar con cuidado la dirección final antes de continuar."],
    unsupported_redirect: ["La web redirige a un destino no compatible", "Durante la comprobación apareció una redirección que no utiliza HTTP o HTTPS. No la hemos seguido por seguridad."],
  },
  en: {
    dns_not_found: ["The domain is not available", "We could not find a public DNS address for this domain. It may be mistyped, expired or not currently published."],
    dns_temporarily_unavailable: ["We could not query the domain temporarily", "Our server could not complete the DNS lookup after several attempts. We have not drawn any safety conclusion about the link; please retry in a few seconds."],
    target_timeout: ["The website took too long to respond", "The page did not respond within the scanner safety timeout. It may be down, overloaded or blocking automated checks."],
    target_unreachable: ["We could not connect to the website", "The domain exists, but its server did not accept or complete the connection. We cannot draw a reliable safety conclusion."],
    too_many_redirects: ["The link changes destination too many times", "The check stopped because the link chained more redirects than allowed. Review the final destination carefully before continuing."],
    unsupported_redirect: ["The website redirects to an unsupported destination", "The check encountered a redirect that does not use HTTP or HTTPS. We did not follow it for safety."],
  },
  fr: {
    dns_not_found: ["Le domaine n’est pas disponible", "Nous n’avons trouvé aucune adresse DNS publique pour ce domaine. Il peut être mal saisi, expiré ou non publié actuellement."],
    dns_temporarily_unavailable: ["Impossible d’interroger temporairement le domaine", "Notre serveur n’a pas pu terminer la requête DNS après plusieurs tentatives. Nous ne tirons aucune conclusion sur la sécurité du lien ; réessayez dans quelques secondes."],
    target_timeout: ["Le site met trop de temps à répondre", "La page n’a pas répondu dans le délai de sécurité de l’analyse. Elle peut être indisponible, saturée ou bloquer les vérifications automatiques."],
    target_unreachable: ["Impossible de se connecter au site", "Le domaine existe, mais le serveur n’a pas accepté ou terminé la connexion. Nous ne pouvons pas conclure de façon fiable sur sa sécurité."],
    too_many_redirects: ["Le lien change trop souvent de destination", "La vérification s’est arrêtée car le lien a enchaîné trop de redirections. Vérifiez soigneusement la destination finale avant de continuer."],
    unsupported_redirect: ["Le site redirige vers une destination non prise en charge", "Une redirection n’utilisant ni HTTP ni HTTPS a été détectée. Nous ne l’avons pas suivie par sécurité."],
  },
  de: {
    dns_not_found: ["Die Domain ist nicht verfügbar", "Für diese Domain wurde keine öffentliche DNS-Adresse gefunden. Sie kann falsch geschrieben, abgelaufen oder derzeit nicht veröffentlicht sein."],
    dns_temporarily_unavailable: ["Die Domain konnte vorübergehend nicht abgefragt werden", "Unser Server konnte die DNS-Abfrage nach mehreren Versuchen nicht abschließen. Wir ziehen daraus keine Sicherheitsbewertung; versuche es in einigen Sekunden erneut."],
    target_timeout: ["Die Website antwortet zu langsam", "Die Seite hat nicht innerhalb des Sicherheitszeitlimits geantwortet. Sie kann offline, überlastet oder gegen automatische Prüfungen geschützt sein."],
    target_unreachable: ["Die Website konnte nicht erreicht werden", "Die Domain existiert, aber der Server hat die Verbindung nicht angenommen oder abgeschlossen. Eine verlässliche Sicherheitsbewertung ist nicht möglich."],
    too_many_redirects: ["Der Link wechselt zu oft das Ziel", "Die Prüfung wurde beendet, weil der Link mehr Weiterleitungen als erlaubt verwendet. Prüfe das endgültige Ziel sorgfältig."],
    unsupported_redirect: ["Die Website leitet zu einem nicht unterstützten Ziel weiter", "Bei der Prüfung wurde eine Weiterleitung erkannt, die weder HTTP noch HTTPS verwendet. Aus Sicherheitsgründen wurde ihr nicht gefolgt."],
  },
  ar: {
    dns_not_found: ["النطاق غير متاح", "لم نعثر على عنوان DNS عام لهذا النطاق. قد يكون مكتوباً بشكل خاطئ أو منتهي الصلاحية أو غير منشور حالياً."],
    dns_temporarily_unavailable: ["تعذر الاستعلام عن النطاق مؤقتاً", "لم يتمكن خادمنا من إكمال استعلام DNS بعد عدة محاولات. لم نستنتج شيئاً عن أمان الرابط؛ حاول مرة أخرى بعد بضع ثوانٍ."],
    target_timeout: ["استغرق الموقع وقتاً طويلاً للرد", "لم تستجب الصفحة خلال مهلة الأمان الخاصة بالفحص. قد يكون الموقع متوقفاً أو مزدحماً أو يمنع الفحوصات الآلية."],
    target_unreachable: ["تعذر الاتصال بالموقع", "النطاق موجود لكن الخادم لم يقبل الاتصال أو يكمله. لا يمكننا إعطاء نتيجة موثوقة حول أمانه."],
    too_many_redirects: ["الرابط يغيّر الوجهة مرات كثيرة", "توقف الفحص لأن الرابط استخدم عدداً من عمليات إعادة التوجيه أكبر من المسموح. تحقق بعناية من الوجهة النهائية قبل المتابعة."],
    unsupported_redirect: ["الموقع يعيد التوجيه إلى وجهة غير مدعومة", "ظهر أثناء الفحص تحويل لا يستخدم HTTP أو HTTPS. لم نتبعه لأسباب أمنية."],
  },
};

function errorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { code: "check_failed", causeCode: "", causeMessage: "", combined: "check_failed" };
  }

  const parts: string[] = [];
  let causeCode = "";
  let causeMessage = "";
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth += 1) {
    const item = current as { message?: unknown; name?: unknown; code?: unknown; cause?: unknown };
    if (item.message) parts.push(String(item.message));
    if (item.name) parts.push(String(item.name));
    if (item.code) {
      const value = String(item.code);
      parts.push(value);
      if (!causeCode && current !== error) causeCode = value;
    }
    if (!causeMessage && current !== error && item.message) causeMessage = String(item.message);
    current = item.cause;
  }

  return {
    code: error.message || error.name || "check_failed",
    causeCode,
    causeMessage,
    combined: parts.join(" "),
  };
}

function isTransientNetworkFailure(error: unknown) {
  const { combined } = errorDetails(error);
  const haystack = combined.toUpperCase();
  return TRANSIENT_NETWORK_MARKERS.some((marker) => haystack.includes(marker));
}

async function collectWebSignalsWithRetry(url: string, locale: Parameters<typeof collectWebSignals>[1]) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await collectWebSignals(url, locale);
    } catch (error) {
      lastError = error;
      if (!isTransientNetworkFailure(error) || attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 240 * (attempt + 1)));
    }
  }

  throw lastError;
}

function classifyFailure(error: unknown) {
  const { code, causeCode, combined } = errorDetails(error);
  const normalized = code.toLowerCase();
  const normalizedCause = causeCode.toUpperCase();
  const upperCombined = combined.toUpperCase();

  if (normalized.includes("invalid url") || normalized.includes("failed to parse url")) {
    return { error: "invalid_url", status: 422 };
  }

  if (normalized === "dns_not_found" || upperCombined.includes("ENOTFOUND") || upperCombined.includes("ENODATA")) {
    return { error: "dns_not_found", status: 422 };
  }

  if (
    normalized.includes("timeout") ||
    normalized.includes("timed out") ||
    normalized.includes("abort") ||
    normalizedCause === "ETIMEDOUT" ||
    upperCombined.includes("UND_ERR_CONNECT_TIMEOUT")
  ) {
    return { error: "target_timeout", status: 422 };
  }

  if (upperCombined.includes("EBUSY") || upperCombined.includes("EAI_AGAIN") || upperCombined.includes("ETIMEOUT")) {
    return { error: "dns_temporarily_unavailable", status: 503 };
  }

  if (
    normalized === "fetch failed" ||
    ["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "ENETDOWN"].includes(normalizedCause) ||
    ["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "ENETDOWN"].some((item) => upperCombined.includes(item))
  ) {
    return { error: "target_unreachable", status: 422 };
  }

  const clientErrors = new Set([
    "empty_url",
    "unsupported_protocol",
    "credentials_not_allowed",
    "private_target",
    "too_many_redirects",
    "unsupported_redirect",
  ]);

  if (clientErrors.has(code)) {
    return { error: code, status: 422 };
  }

  return { error: "check_failed", status: 500 };
}

function buildUnavailableResult(
  submittedUrl: string,
  hostname: string,
  locale: SupportedLocale,
  reason: UnavailableReason,
): WebCheckResult {
  let normalizedUrl = submittedUrl;
  let finalHostname = hostname || "unknown";
  let usesHttps = false;

  try {
    const normalized = /^https?:\/\//i.test(submittedUrl) ? submittedUrl : `https://${submittedUrl}`;
    const parsed = new URL(normalized);
    normalizedUrl = parsed.toString();
    finalHostname = parsed.hostname || finalHostname;
    usesHttps = parsed.protocol === "https:";
  } catch {
    // The caller only uses this fallback after the URL parser has already accepted the input.
  }

  const [title, detail] = unavailableCopy[locale][reason];
  const warning = reason === "too_many_redirects" || reason === "unsupported_redirect";

  return {
    version: "vonu-check-v1",
    checkedAt: new Date().toISOString(),
    locale,
    risk: { level: "unknown", band: "unknown", score: 0, confidence: "limited" },
    facts: {
      hostname: finalHostname,
      normalizedUrl,
      finalUrl: normalizedUrl,
      httpStatus: null,
      redirects: 0,
      usesHttps,
      title: null,
      hasPasswordField: false,
      formCount: 0,
      externalFormActions: 0,
      legalTextDetected: false,
      contactTextDetected: false,
      paymentRiskTextDetected: false,
    },
    signals: [{
      id: `availability-${reason}`,
      tone: warning ? "warning" : "neutral",
      weight: 0,
      title,
      detail,
    }],
    limitations: [
      "page-content-not-inspectable",
      "technical-signals-only",
      "no-reputation-layer-yet",
      "no-business-identity-layer-yet",
      "no-domain-age-layer-yet",
    ],
  };
}

export async function POST(request: Request) {
  let hostnameForLog = "unknown";
  let submittedUrl = "";
  let submittedLocale: SupportedLocale = "es";

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const locale = typeof body?.locale === "string" && isSupportedLocale(body.locale)
      ? body.locale
      : "es";
    submittedUrl = url;
    submittedLocale = locale;

    if (!url || url.length > 2048) {
      return NextResponse.json({ error: "invalid_url" }, { status: 400 });
    }

    if (EXPLICIT_SCHEME.test(url) && !/^https?:/i.test(url)) {
      throw new Error("unsupported_protocol");
    }

    try {
      const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      hostnameForLog = new URL(normalized).hostname || "unknown";
    } catch {
      // The main analyser will classify malformed URLs below.
    }

    const baseResult = await collectWebSignalsWithRetry(url, locale);
    const result = await enrichWebResult(baseResult);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    const details = errorDetails(error);
    const failure = classifyFailure(error);

    console.error("[vonu-check:web] analysis failed", {
      hostname: hostnameForLog,
      error: failure.error,
      code: details.code,
      causeCode: details.causeCode,
      causeMessage: details.causeMessage,
    });

    if (NON_BILLABLE_RESULT_ERRORS.has(failure.error)) {
      const reason = failure.error as UnavailableReason;
      return NextResponse.json(
        buildUnavailableResult(submittedUrl, hostnameForLog, submittedLocale, reason),
        {
          status: 200,
          headers: {
            "cache-control": "no-store",
            "x-content-type-options": "nosniff",
            "x-vonu-analysis-billable": "0",
            "x-vonu-analysis-status": reason,
          },
        },
      );
    }

    return NextResponse.json(
      { error: failure.error },
      { status: failure.status, headers: { "cache-control": "no-store" } },
    );
  }
}
