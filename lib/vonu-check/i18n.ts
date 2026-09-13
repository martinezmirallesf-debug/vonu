import type { SupportedLocale } from "./types";

export const supportedLocales: SupportedLocale[] = ["es", "en", "fr", "de", "ar"];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export const localeMeta: Record<SupportedLocale, { label: string; dir: "ltr" | "rtl"; htmlLang: string }> = {
  es: { label: "ES", dir: "ltr", htmlLang: "es" },
  en: { label: "EN", dir: "ltr", htmlLang: "en" },
  fr: { label: "FR", dir: "ltr", htmlLang: "fr" },
  de: { label: "DE", dir: "ltr", htmlLang: "de" },
  ar: { label: "العربية", dir: "rtl", htmlLang: "ar" },
};

type Copy = {
  pageTitle: string;
  pageDescription: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  placeholder: string;
  button: string;
  privacy: string;
  firstFree: string;
  checking: string;
  result: string;
  score: string;
  low: string;
  caution: string;
  high: string;
  unknown: string;
  signals: string;
  facts: string;
  finalUrl: string;
  httpStatus: string;
  redirects: string;
  https: string;
  pageTitleLabel: string;
  forms: string;
  disclaimer: string;
  error: string;
  noCertification: string;
};

export const copy: Record<SupportedLocale, Copy> = {
  es: {
    pageTitle: "Comprobar una web — Vonu Check",
    pageDescription: "Pega una web o tienda online y revisa señales técnicas de riesgo antes de pagar o compartir datos.",
    eyebrow: "VONU CHECK · WEB",
    heading: "Comprueba antes de confiar.",
    subheading: "Pega una web o tienda online. Vonu revisa señales técnicas objetivas y te muestra qué merece atención.",
    placeholder: "https://tienda-ejemplo.com",
    button: "Comprobar gratis",
    privacy: "Sin registro",
    firstFree: "Primer análisis gratuito",
    checking: "Comprobando señales…",
    result: "Resultado",
    score: "Índice de precaución",
    low: "Sin alertas técnicas importantes",
    caution: "Precaución",
    high: "Riesgo técnico elevado",
    unknown: "No se pudo evaluar",
    signals: "Señales detectadas",
    facts: "Datos comprobados",
    finalUrl: "URL final",
    httpStatus: "Estado HTTP",
    redirects: "Redirecciones",
    https: "HTTPS",
    pageTitleLabel: "Título de la página",
    forms: "Formularios",
    disclaimer: "Este primer motor evalúa señales técnicas. La capa de reputación, identidad empresarial y antigüedad del dominio se añadirá antes del lanzamiento público.",
    error: "No hemos podido comprobar esa URL.",
    noCertification: "Vonu no certifica que una web sea segura; te ayuda a detectar señales que conviene revisar antes de actuar.",
  },
  en: {
    pageTitle: "Check a website — Vonu Check",
    pageDescription: "Paste a website or online store and review technical risk signals before paying or sharing data.",
    eyebrow: "VONU CHECK · WEB",
    heading: "Check before you trust.",
    subheading: "Paste a website or online store. Vonu reviews objective technical signals and shows what deserves attention.",
    placeholder: "https://example-store.com",
    button: "Check for free",
    privacy: "No account required",
    firstFree: "First analysis free",
    checking: "Checking signals…",
    result: "Result",
    score: "Caution score",
    low: "No major technical alerts",
    caution: "Caution",
    high: "High technical risk",
    unknown: "Could not evaluate",
    signals: "Detected signals",
    facts: "Verified facts",
    finalUrl: "Final URL",
    httpStatus: "HTTP status",
    redirects: "Redirects",
    https: "HTTPS",
    pageTitleLabel: "Page title",
    forms: "Forms",
    disclaimer: "This first engine evaluates technical signals. Reputation, business identity and domain-age layers will be added before public launch.",
    error: "We could not check that URL.",
    noCertification: "Vonu does not certify that a website is safe; it helps you spot signals worth reviewing before you act.",
  },
  fr: {
    pageTitle: "Vérifier un site — Vonu Check",
    pageDescription: "Collez un site ou une boutique en ligne et vérifiez des signaux techniques de risque avant de payer ou de partager des données.",
    eyebrow: "VONU CHECK · WEB",
    heading: "Vérifiez avant de faire confiance.",
    subheading: "Collez un site ou une boutique. Vonu analyse des signaux techniques objectifs et montre ce qui mérite votre attention.",
    placeholder: "https://boutique-exemple.fr",
    button: "Vérifier gratuitement",
    privacy: "Sans inscription",
    firstFree: "Première analyse gratuite",
    checking: "Analyse en cours…",
    result: "Résultat",
    score: "Indice de prudence",
    low: "Pas d’alerte technique majeure",
    caution: "Prudence",
    high: "Risque technique élevé",
    unknown: "Évaluation impossible",
    signals: "Signaux détectés",
    facts: "Données vérifiées",
    finalUrl: "URL finale",
    httpStatus: "Statut HTTP",
    redirects: "Redirections",
    https: "HTTPS",
    pageTitleLabel: "Titre de la page",
    forms: "Formulaires",
    disclaimer: "Ce premier moteur évalue des signaux techniques. La réputation, l’identité de l’entreprise et l’ancienneté du domaine seront ajoutées avant le lancement public.",
    error: "Impossible de vérifier cette URL.",
    noCertification: "Vonu ne certifie pas qu’un site est sûr ; il aide à repérer les signaux à vérifier avant d’agir.",
  },
  de: {
    pageTitle: "Website prüfen — Vonu Check",
    pageDescription: "Füge eine Website oder einen Onlineshop ein und prüfe technische Risikosignale, bevor du zahlst oder Daten teilst.",
    eyebrow: "VONU CHECK · WEB",
    heading: "Prüfen, bevor du vertraust.",
    subheading: "Füge eine Website oder einen Shop ein. Vonu prüft objektive technische Signale und zeigt, was Aufmerksamkeit verdient.",
    placeholder: "https://beispiel-shop.de",
    button: "Kostenlos prüfen",
    privacy: "Ohne Registrierung",
    firstFree: "Erste Analyse kostenlos",
    checking: "Signale werden geprüft…",
    result: "Ergebnis",
    score: "Vorsichtsindex",
    low: "Keine wichtigen technischen Warnungen",
    caution: "Vorsicht",
    high: "Hohes technisches Risiko",
    unknown: "Nicht bewertbar",
    signals: "Erkannte Signale",
    facts: "Geprüfte Daten",
    finalUrl: "Endgültige URL",
    httpStatus: "HTTP-Status",
    redirects: "Weiterleitungen",
    https: "HTTPS",
    pageTitleLabel: "Seitentitel",
    forms: "Formulare",
    disclaimer: "Diese erste Version bewertet technische Signale. Reputation, Unternehmensidentität und Domainalter kommen vor dem öffentlichen Start hinzu.",
    error: "Diese URL konnte nicht geprüft werden.",
    noCertification: "Vonu zertifiziert keine Website als sicher; es hilft, relevante Warnsignale vor einer Entscheidung zu erkennen.",
  },
  ar: {
    pageTitle: "تحقق من موقع — Vonu Check",
    pageDescription: "الصق موقعًا أو متجرًا إلكترونيًا وافحص إشارات الخطر التقنية قبل الدفع أو مشاركة بياناتك.",
    eyebrow: "VONU CHECK · WEB",
    heading: "تحقق قبل أن تثق.",
    subheading: "الصق موقعًا أو متجرًا إلكترونيًا. يفحص Vonu إشارات تقنية موضوعية ويعرض ما يستحق الانتباه.",
    placeholder: "https://example.com",
    button: "تحقق مجانًا",
    privacy: "بدون تسجيل",
    firstFree: "أول تحليل مجاني",
    checking: "جارٍ فحص الإشارات…",
    result: "النتيجة",
    score: "مؤشر الحذر",
    low: "لا توجد تنبيهات تقنية مهمة",
    caution: "الحذر",
    high: "مخاطر تقنية مرتفعة",
    unknown: "تعذر التقييم",
    signals: "الإشارات المكتشفة",
    facts: "البيانات التي تم التحقق منها",
    finalUrl: "الرابط النهائي",
    httpStatus: "حالة HTTP",
    redirects: "عمليات إعادة التوجيه",
    https: "HTTPS",
    pageTitleLabel: "عنوان الصفحة",
    forms: "النماذج",
    disclaimer: "هذا المحرك الأولي يقيّم الإشارات التقنية. ستُضاف طبقات السمعة وهوية الشركة وعمر النطاق قبل الإطلاق العام.",
    error: "تعذر فحص هذا الرابط.",
    noCertification: "لا يشهد Vonu بأن الموقع آمن؛ بل يساعدك على اكتشاف إشارات تستحق المراجعة قبل اتخاذ قرار.",
  },
};
