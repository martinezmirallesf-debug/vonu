import { resolveCaa, resolveNs } from "node:dns/promises";
import type { SupportedLocale, WebCheckResult, WebCheckSignal } from "./types";

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
        "user-agent": "VonuCheck/0.2 (+https://vonuai.com)",
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
        "user-agent": "VonuCheck/0.2 (+https://vonuai.com)",
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

export async function enrichWebResult(result: WebCheckResult): Promise<WebCheckResult> {
  const { hostname, finalUrl, usesHttps, httpStatus } = result.facts;
  const locale = result.locale;

  const [nameservers, caa, headers, securityTxt] = await Promise.all([
    safeDns(() => resolveNs(hostname)),
    safeDns(() => resolveCaa(hostname)),
    inspectHeaders(finalUrl),
    usesHttps ? hasSecurityTxt(new URL(finalUrl).origin) : Promise.resolve(false),
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

  const hasStructuralWarning = result.signals.some((item) =>
    ["noHttps", "punycode", "hyphens", "externalForm"].includes(item.id),
  );
  const protectedAccess = [401, 403, 429].includes(httpStatus ?? 0);

  let risk = result.risk;
  if (protectedAccess && usesHttps && !hasStructuralWarning && maturity >= 3) {
    risk = {
      level: "low",
      score: Math.min(result.risk.score, 8),
      confidence: "limited",
    };
  } else if (result.risk.level === "low" && maturity >= 3) {
    risk = { ...result.risk, confidence: "medium" };
  }

  return {
    ...result,
    risk,
    signals: [...result.signals, ...extraSignals],
  };
}
