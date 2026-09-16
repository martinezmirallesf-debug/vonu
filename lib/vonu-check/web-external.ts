import type { SupportedLocale, WebCheckSignal } from "./types";

const URLHAUS_ENDPOINT = "https://urlhaus-api.abuse.ch/v1/url/";
const URLHAUS_TIMEOUT_MS = 1_800;
const RDAP_TIMEOUT_MS = 2_200;

export type UrlhausLookup = {
  configured: boolean;
  attempted: boolean;
  matched: boolean | null;
  queryStatus: string | null;
  urlStatus: string | null;
  threat: string | null;
  reference: string | null;
  tags: string[];
};

export type DomainAgeLookup = {
  attempted: boolean;
  registeredDomain: string | null;
  registeredAt: string | null;
  ageDays: number | null;
};

const copy: Record<
  SupportedLocale,
  {
    urlhausMatch: [string, string];
    urlhausClear: [string, string];
    veryNewDomain: [string, string];
    newDomain: [string, string];
    establishedDomain: [string, string];
  }
> = {
  es: {
    urlhausMatch: [
      "Coincidencia en URLhaus",
      "La URL aparece en URLhaus, una base de inteligencia de abuse.ch centrada en URLs usadas para distribuir malware. No demuestra quién controla la web, pero es una señal técnica de riesgo muy fuerte.",
    ],
    urlhausClear: [
      "Sin coincidencia en URLhaus",
      "La URL no aparece en la consulta de URLhaus. Esto solo descarta una coincidencia conocida en esa base de malware; no descarta phishing, fraude, suplantación ni una amenaza nueva.",
    ],
    veryNewDomain: [
      "Dominio registrado muy recientemente",
      "El registro público del dominio indica una antigüedad inferior a 30 días. Un dominio nuevo puede ser legítimo, pero exige más verificación cuando se combina con pagos, credenciales o presión.",
    ],
    newDomain: [
      "Dominio de creación reciente",
      "El registro público del dominio indica una antigüedad inferior a 90 días. Es una señal contextual que conviene valorar junto con el resto de evidencias.",
    ],
    establishedDomain: [
      "Dominio con antigüedad",
      "El registro público indica que el dominio lleva más de un año registrado. Es una señal contextual positiva, aunque por sí sola no garantiza legitimidad.",
    ],
  },
  en: {
    urlhausMatch: [
      "URLhaus match",
      "The URL appears in URLhaus, abuse.ch threat intelligence focused on URLs used to distribute malware. It does not prove who controls the site, but it is a very strong technical risk signal.",
    ],
    urlhausClear: [
      "No URLhaus match",
      "The URL was not found in the URLhaus lookup. This only rules out a known match in that malware database; it does not rule out phishing, fraud, impersonation or a new threat.",
    ],
    veryNewDomain: [
      "Very recently registered domain",
      "Public registration data indicates the domain is less than 30 days old. A new domain can be legitimate, but it deserves extra verification when combined with payments, credentials or pressure.",
    ],
    newDomain: [
      "Recently created domain",
      "Public registration data indicates the domain is less than 90 days old. Treat it as contextual evidence alongside the other signals.",
    ],
    establishedDomain: [
      "Established domain age",
      "Public registration data indicates the domain has been registered for more than a year. This is useful context, but it does not guarantee legitimacy by itself.",
    ],
  },
  fr: {
    urlhausMatch: [
      "Correspondance URLhaus",
      "L’URL apparaît dans URLhaus, la base de renseignement d’abuse.ch consacrée aux URL utilisées pour diffuser des logiciels malveillants. Cela ne prouve pas qui contrôle le site, mais constitue un signal technique de risque très fort.",
    ],
    urlhausClear: [
      "Aucune correspondance URLhaus",
      "L’URL n’a pas été trouvée dans URLhaus. Cela exclut seulement une correspondance connue dans cette base de malware et n’exclut pas le phishing, la fraude, l’usurpation ou une menace récente.",
    ],
    veryNewDomain: [
      "Domaine enregistré très récemment",
      "Les données publiques indiquent que le domaine a moins de 30 jours. Un domaine récent peut être légitime, mais mérite davantage de vérifications lorsqu’il est associé à des paiements, identifiants ou pressions.",
    ],
    newDomain: [
      "Domaine de création récente",
      "Les données publiques indiquent que le domaine a moins de 90 jours. Il s’agit d’un signal contextuel à combiner avec les autres éléments.",
    ],
    establishedDomain: [
      "Domaine ancien",
      "Les données publiques indiquent que le domaine est enregistré depuis plus d’un an. C’est un contexte positif, sans garantie de légitimité.",
    ],
  },
  de: {
    urlhausMatch: [
      "Treffer bei URLhaus",
      "Die URL erscheint in URLhaus, der Threat-Intelligence-Datenbank von abuse.ch für URLs, die Malware verbreiten. Das beweist nicht, wer die Website kontrolliert, ist aber ein sehr starkes technisches Risikosignal.",
    ],
    urlhausClear: [
      "Kein URLhaus-Treffer",
      "Die URL wurde bei URLhaus nicht gefunden. Das schließt nur einen bekannten Treffer in dieser Malware-Datenbank aus; Phishing, Betrug, Identitätsmissbrauch oder neue Bedrohungen bleiben möglich.",
    ],
    veryNewDomain: [
      "Sehr kürzlich registrierte Domain",
      "Öffentliche Registrierungsdaten zeigen, dass die Domain jünger als 30 Tage ist. Eine neue Domain kann legitim sein, sollte bei Zahlungen, Zugangsdaten oder Druck aber besonders geprüft werden.",
    ],
    newDomain: [
      "Kürzlich erstellte Domain",
      "Öffentliche Registrierungsdaten zeigen, dass die Domain jünger als 90 Tage ist. Dieses Signal sollte zusammen mit den übrigen Hinweisen bewertet werden.",
    ],
    establishedDomain: [
      "Domain mit längerer Historie",
      "Öffentliche Registrierungsdaten zeigen, dass die Domain seit mehr als einem Jahr registriert ist. Das ist hilfreicher Kontext, garantiert aber keine Seriosität.",
    ],
  },
  ar: {
    urlhausMatch: [
      "تطابق في URLhaus",
      "يظهر الرابط في URLhaus، وهي قاعدة معلومات تهديدات تابعة لـ abuse.ch وتركز على الروابط المستخدمة لتوزيع البرمجيات الخبيثة. هذا لا يثبت من يسيطر على الموقع، لكنه إشارة تقنية قوية جداً للمخاطر.",
    ],
    urlhausClear: [
      "لا يوجد تطابق في URLhaus",
      "لم يظهر الرابط في استعلام URLhaus. هذا يستبعد فقط تطابقاً معروفاً في قاعدة البرمجيات الخبيثة تلك، ولا يستبعد التصيد أو الاحتيال أو انتحال الهوية أو تهديداً جديداً.",
    ],
    veryNewDomain: [
      "نطاق مسجل حديثاً جداً",
      "تشير بيانات التسجيل العامة إلى أن عمر النطاق أقل من 30 يوماً. قد يكون النطاق الجديد مشروعاً، لكنه يحتاج تحققاً إضافياً عند اقترانه بالدفع أو بيانات الدخول أو الضغط.",
    ],
    newDomain: [
      "نطاق حديث الإنشاء",
      "تشير بيانات التسجيل العامة إلى أن عمر النطاق أقل من 90 يوماً. هذه إشارة سياقية يجب تقييمها مع بقية الأدلة.",
    ],
    establishedDomain: [
      "نطاق ذو سجل أقدم",
      "تشير بيانات التسجيل العامة إلى أن النطاق مسجل منذ أكثر من عام. هذه إشارة سياقية إيجابية لكنها لا تضمن الشرعية بمفردها.",
    ],
  },
};

function cleanString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function uniqueStrings(value: unknown, maxItems = 10, maxLength = 100) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((item) => cleanString(item, maxLength)).filter(Boolean)),
  ).slice(0, maxItems);
}

export async function lookupUrlhaus(url: string): Promise<UrlhausLookup> {
  const authKey = (
    process.env.URLHAUS_AUTH_KEY ||
    process.env.URLHAUS_API_KEY ||
    ""
  ).trim();

  if (!authKey) {
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

  try {
    const response = await fetch(URLHAUS_ENDPOINT, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(URLHAUS_TIMEOUT_MS),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Auth-Key": authKey,
        "user-agent": "VonuCheck/1.0 (+https://vonuai.com)",
      },
      body: new URLSearchParams({ url }),
    });

    const raw = await response.text().catch(() => "");
    let data: any = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!response.ok || !data || typeof data !== "object") {
      return {
        configured: true,
        attempted: true,
        matched: null,
        queryStatus: null,
        urlStatus: null,
        threat: null,
        reference: null,
        tags: [],
      };
    }

    const queryStatus = cleanString(data.query_status, 80) || null;
    const matched = queryStatus === "ok"
      ? true
      : queryStatus === "no_results"
        ? false
        : Boolean(data.url_status || data.threat)
          ? true
          : null;

    return {
      configured: true,
      attempted: true,
      matched,
      queryStatus,
      urlStatus: cleanString(data.url_status, 80) || null,
      threat: cleanString(data.threat, 120) || null,
      reference: cleanString(data.urlhaus_reference, 500) || null,
      tags: uniqueStrings(data.tags),
    };
  } catch {
    return {
      configured: true,
      attempted: true,
      matched: null,
      queryStatus: null,
      urlStatus: null,
      threat: null,
      reference: null,
      tags: [],
    };
  }
}

const commonSecondLevelTlds = new Set([
  "co.uk",
  "org.uk",
  "me.uk",
  "com.au",
  "net.au",
  "org.au",
  "co.nz",
  "com.br",
  "com.mx",
  "com.ar",
  "co.jp",
  "co.kr",
  "co.in",
  "com.tr",
  "com.cn",
  "com.sg",
  "com.hk",
]);

function registeredDomainCandidate(hostname: string) {
  const clean = hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  const labels = clean.split(".").filter(Boolean);
  if (labels.length <= 2) return clean;

  const lastTwo = labels.slice(-2).join(".");
  if (commonSecondLevelTlds.has(lastTwo) && labels.length >= 3) {
    return labels.slice(-3).join(".");
  }
  return lastTwo;
}

export async function lookupDomainAge(hostname: string): Promise<DomainAgeLookup> {
  const registeredDomain = registeredDomainCandidate(hostname);
  if (!registeredDomain) {
    return { attempted: false, registeredDomain: null, registeredAt: null, ageDays: null };
  }

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(registeredDomain)}`, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(RDAP_TIMEOUT_MS),
      headers: {
        accept: "application/rdap+json,application/json;q=0.9",
        "user-agent": "VonuCheck/1.0 (+https://vonuai.com)",
      },
    });

    if (!response.ok) {
      return { attempted: true, registeredDomain, registeredAt: null, ageDays: null };
    }

    const data: any = await response.json().catch(() => null);
    const events = Array.isArray(data?.events) ? data.events : [];
    const registration = events.find((event: any) =>
      ["registration", "registered"].includes(String(event?.eventAction || "").toLowerCase()),
    );
    const registeredAt = cleanString(registration?.eventDate, 80) || null;
    if (!registeredAt) {
      return { attempted: true, registeredDomain, registeredAt: null, ageDays: null };
    }

    const timestamp = Date.parse(registeredAt);
    if (!Number.isFinite(timestamp)) {
      return { attempted: true, registeredDomain, registeredAt, ageDays: null };
    }

    const ageDays = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
    return { attempted: true, registeredDomain, registeredAt, ageDays };
  } catch {
    return { attempted: true, registeredDomain, registeredAt: null, ageDays: null };
  }
}

export function urlhausSignal(locale: SupportedLocale, result: UrlhausLookup): WebCheckSignal | null {
  if (result.matched === true) {
    const [title, detail] = copy[locale].urlhausMatch;
    const extra = [result.threat, result.urlStatus].filter(Boolean).join(" · ");
    return {
      id: "reputation-urlhaus-match",
      tone: "negative",
      weight: 55,
      title,
      detail: extra ? `${detail} (${extra})` : detail,
    };
  }

  if (result.matched === false) {
    const [title, detail] = copy[locale].urlhausClear;
    return {
      id: "reputation-urlhaus-clear",
      tone: "neutral",
      weight: 0,
      title,
      detail,
    };
  }

  return null;
}

export function domainAgeSignal(locale: SupportedLocale, result: DomainAgeLookup): WebCheckSignal | null {
  if (result.ageDays == null) return null;

  if (result.ageDays < 30) {
    const [title, detail] = copy[locale].veryNewDomain;
    return {
      id: "domain-age-very-new",
      tone: "warning",
      weight: 18,
      title,
      detail: `${detail} (${result.ageDays} d)`,
    };
  }

  if (result.ageDays < 90) {
    const [title, detail] = copy[locale].newDomain;
    return {
      id: "domain-age-new",
      tone: "warning",
      weight: 10,
      title,
      detail: `${detail} (${result.ageDays} d)`,
    };
  }

  if (result.ageDays >= 365) {
    const [title, detail] = copy[locale].establishedDomain;
    return {
      id: "domain-age-established",
      tone: "positive",
      weight: 0,
      title,
      detail,
    };
  }

  return null;
}
