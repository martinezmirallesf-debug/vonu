import { resolveCaa, resolveNs } from "node:dns/promises";
import type { SupportedLocale, WebCheckResult, WebCheckSignal } from "./types";
import {
  domainAgeSignal,
  lookupDomainAge,
  urlhausSignal,
  type UrlhausLookup,
} from "./web-external";
import { lookupSupabaseUrlReputation } from "./supabase-evidence";

const HEADER_TIMEOUT_MS = 4_500;

const copy: Record<SupportedLocale, Record<string, [string, string]>> = {
  es: {
    hsts: ["Protección HSTS activa", "El servidor exige conexiones HTTPS en navegadores compatibles, una señal positiva de configuración de seguridad."],
    csp: ["Política de seguridad de contenido", "El servidor publica una política CSP para limitar qué recursos y scripts puede cargar la página."],
    caa: ["Emisión de certificados restringida", "El dominio publica registros CAA que limitan qué autoridades pueden emitir certificados para él."],
    dns: ["DNS con redundancia", "El dominio utiliza varios servidores DNS autoritativos. Es una señal de infraestructura estable, aunque no demuestra legitimidad."],
    securityTxt: ["Canal de seguridad publicado", "El dominio publica un archivo security.txt accesible para comunicar vulnerabilidades de seguridad."],
  },
  en: {
    hsts: ["HSTS protection enabled", "The server requires HTTPS in compatible browsers, a positive security-configuration signal."],
    csp: ["Content Security Policy", "The server publishes a CSP policy to limit which resources and scripts the page can load."],
    caa: ["Certificate issuance restricted", "The domain publishes CAA records limiting which authorities may issue certificates for it."],
    dns: ["Redundant DNS", "The domain uses multiple authoritative DNS servers. This suggests stable infrastructure but does not prove legitimacy."],
    securityTxt: ["Security contact published", "The domain publishes an accessible security.txt file for vulnerability reporting."],
  },
  fr: {
    hsts: ["Protection HSTS active", "Le serveur impose HTTPS aux navigateurs compatibles, un signal positif de configuration de sécurité."],
    csp: ["Politique de sécurité du contenu", "Le serveur publie une politique CSP limitant les ressources et scripts que la page peut charger."],
    caa: ["Émission de certificats restreinte", "Le domaine publie des enregistrements CAA limitant les autorités pouvant émettre ses certificats."],
    dns: ["DNS redondant", "Le domaine utilise plusieurs serveurs DNS faisant autorité. Cela suggère une infrastructure stable sans prouver sa légitimité."],
    securityTxt: ["Canal de sécurité publié", "Le domaine publie un fichier security.txt accessible pour le signalement de vulnérabilités."],
  },
  de: {
    hsts: ["HSTS-Schutz aktiv", "Der Server erzwingt HTTPS in kompatiblen Browsern, ein positives Signal für die Sicherheitskonfiguration."],
    csp: ["Content-Security-Policy", "Der Server veröffentlicht eine CSP, die geladene Ressourcen und Skripte einschränkt."],
    caa: ["Zertifikatsausstellung eingeschränkt", "Die Domain veröffentlicht CAA-Einträge, die erlaubte Zertifizierungsstellen begrenzen."],
    dns: ["Redundantes DNS", "Die Domain nutzt mehrere autoritative DNS-Server. Das spricht für stabile Infrastruktur, beweist aber keine Seriosität."],
    securityTxt: ["Sicherheitskontakt veröffentlicht", "Die Domain stellt eine erreichbare security.txt-Datei für Sicherheitsmeldungen bereit."],
  },
  ar: {
    hsts: ["حماية HSTS مفعّلة", "يفرض الخادم استخدام HTTPS في المتصفحات المتوافقة، وهي إشارة إيجابية إلى إعدادات الأمان."],
    csp: ["سياسة أمان المحتوى", "ينشر الخادم سياسة CSP للحد من الموارد والبرامج النصية التي يمكن للصفحة تحميلها."],
    caa: ["تقييد إصدار الشهادات", "ينشر النطاق سجلات CAA التي تحدد الجهات المسموح لها بإصدار شهاداته."],
    dns: ["DNS متعدد الخوادم", "يستخدم النطاق عدة خوادم DNS موثوقة. هذه إشارة إلى بنية مستقرة لكنها لا تثبت الشرعية."],
    securityTxt: ["قناة أمان منشورة", "ينشر النطاق ملف security.txt متاحاً للإبلاغ عن الثغرات الأمنية."],
  },
};

function positiveSignal(locale: SupportedLocale, id: string): WebCheckSignal {
  const [title, detail] = copy[locale][id];
  return { id: `infra-${id}`, tone: "positive", weight: 0, title, detail };
}

async function safeDns<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

async function inspectHeaders(url: string) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(HEADER_TIMEOUT_MS),
      headers: {
        "user-agent": "VonuCheck/1.0 (+https://vonuai.com)",
        accept: "text/html,*/*;q=0.5",
      },
    });
    return {
      hsts: Boolean(response.headers.get("strict-transport-security")),
      csp: Boolean(response.headers.get("content-security-policy")),
    };
  } catch {
    return { hsts: false, csp: false };
  }
}

async function hasSecurityTxt(origin: string): Promise<boolean> {
  try {
    const url = new URL("/.well-known/security.txt", origin);
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(HEADER_TIMEOUT_MS),
      headers: {
        "user-agent": "VonuCheck/1.0 (+https://vonuai.com)",
        accept: "text/plain,*/*;q=0.3",
      },
    });
    if (!response.ok) return false;
    const type = response.headers.get("content-type") || "";
    return type.includes("text/plain") || type.includes("text/");
  } catch {
    return false;
  }
}

function levelFromScore(score: number): WebCheckResult["risk"]["level"] {
  if (score >= 45) return "high";
  if (score >= 20) return "caution";
  return "low";
}

async function lookupCentralUrlhaus(url: string): Promise<UrlhausLookup> {
  const payload: any = await lookupSupabaseUrlReputation(url);
  const raw = payload?.urlReputation;

  if (!raw || typeof raw !== "object") {
    return {
      configured: false,
      attempted: false,
      matched: null,
      queryStatus: null,
      urlStatus: null,
      threat: null,
      reference: null,
      tags: [],
    };
  }

  return {
    configured: true,
    attempted: Boolean(raw.checked) || typeof raw.match === "boolean",
    matched: typeof raw.match === "boolean" ? raw.match : null,
    queryStatus: typeof raw.status === "string" ? raw.status : null,
    urlStatus: null,
    threat: raw.match === true ? "known_malware_url" : null,
    reference: null,
    tags: [],
  };
}

export async function enrichWebResult(result: WebCheckResult): Promise<WebCheckResult> {
  const { hostname, finalUrl, usesHttps, httpStatus } = result.facts;
  const locale = result.locale;

  const [nameservers, caa, headers, securityTxt, urlhaus, domainAge] = await Promise.all([
    safeDns(() => resolveNs(hostname)),
    safeDns(() => resolveCaa(hostname)),
    inspectHeaders(finalUrl),
    usesHttps ? hasSecurityTxt(new URL(finalUrl).origin) : Promise.resolve(false),
    lookupCentralUrlhaus(finalUrl),
    lookupDomainAge(hostname),
  ]);

  const extraSignals: WebCheckSignal[] = [];
  let maturity = 0;

  if (headers.hsts) {
    extraSignals.push(positiveSignal(locale, "hsts"));
    maturity += 1;
  }
  if (headers.csp) {
    extraSignals.push(positiveSignal(locale, "csp"));
    maturity += 1;
  }
  if (Array.isArray(caa) && caa.length > 0) {
    extraSignals.push(positiveSignal(locale, "caa"));
    maturity += 1;
  }
  if (Array.isArray(nameservers) && nameservers.length >= 2) {
    extraSignals.push(positiveSignal(locale, "dns"));
    maturity += 1;
  }
  if (securityTxt) {
    extraSignals.push(positiveSignal(locale, "securityTxt"));
    maturity += 1;
  }

  const reputationSignal = urlhausSignal(locale, urlhaus);
  if (reputationSignal) extraSignals.push(reputationSignal);

  const ageSignal = domainAgeSignal(locale, domainAge);
  if (ageSignal) extraSignals.push(ageSignal);

  const hasStructuralWarning = result.signals.some((item) =>
    ["noHttps", "punycode", "hyphens", "externalForm"].includes(item.id),
  );
  const protectedAccess = [401, 403, 429].includes(httpStatus ?? 0);
  const ageRiskWeight = ageSignal && ageSignal.tone === "warning" ? ageSignal.weight : 0;

  let risk = result.risk;

  if (urlhaus.matched === true) {
    risk = {
      level: "high",
      score: Math.max(92, result.risk.score),
      confidence: "high",
    };
  } else {
    const combinedScore = Math.max(0, Math.min(100, result.risk.score + ageRiskWeight));
    risk = {
      ...result.risk,
      score: combinedScore,
      level: levelFromScore(combinedScore),
    };

    if (
      protectedAccess &&
      usesHttps &&
      !hasStructuralWarning &&
      ageRiskWeight === 0 &&
      maturity >= 3
    ) {
      risk = { level: "low", score: Math.min(combinedScore, 8), confidence: "limited" };
    } else if (risk.level === "low" && maturity >= 3) {
      risk = { ...risk, confidence: "medium" };
    }
  }

  let limitations = [...result.limitations];

  if (domainAge.ageDays != null) {
    limitations = limitations.filter((item) => item !== "no-domain-age-layer-yet");
  }

  if (urlhaus.attempted && urlhaus.matched !== null) {
    limitations = limitations.filter((item) => item !== "no-reputation-layer-yet");
    if (!limitations.includes("urlhaus-covers-known-malware-not-all-fraud")) {
      limitations.push("urlhaus-covers-known-malware-not-all-fraud");
    }
  }

  return {
    ...result,
    risk,
    facts: {
      ...result.facts,
      registeredDomain: domainAge.registeredDomain,
      domainRegisteredAt: domainAge.registeredAt,
      domainAgeDays: domainAge.ageDays,
      urlhausChecked: urlhaus.attempted,
      urlhausMatch: urlhaus.matched,
    },
    signals: [...result.signals, ...extraSignals],
    limitations,
  };
}
