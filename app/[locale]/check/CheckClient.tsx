"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";
import { localeMeta } from "@/lib/vonu-check/i18n";
import { riskBandFromScore } from "@/lib/vonu-check/risk-score";
import type { CaptureCheckResult } from "@/lib/vonu-check/capture-types";
import type { TextCheckResult } from "@/lib/vonu-check/text-types";
import type { RiskBand, RiskLevel, SignalTone, SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type Mode = "url" | "capture" | "text";
type Result = WebCheckResult | CaptureCheckResult | TextCheckResult;

type UiCopy = {
  hero: string;
  sub: string;
  url: string;
  capture: string;
  text: string;
  urlPlaceholder: string;
  textPlaceholder: string;
  dropTitle: string;
  dropHint: string;
  choose: string;
  change: string;
  analyze: string;
  privacy: string;
  firstFree: string;
  pasteImage: string;
  scanning: string;
  scanUrl: string[];
  scanCapture: string[];
  scanText: string[];
  report: string;
  cautionIndex: string;
  confidence: string;
  limited: string;
  medium: string;
  highConfidence: string;
  evidence: string;
  technical: string;
  extracted: string;
  actions: string;
  limitations: string;
  newCheck: string;
  invalidUrl: string;
  invalidText: string;
  invalidImage: string;
  genericError: string;
  veryLow: string;
  low: string;
  caution: string;
  high: string;
  veryHigh: string;
  unknown: string;
  lowSummary: string;
  cautionSummary: string;
  highSummary: string;
  noCertification: string;
  finalUrl: string;
  httpStatus: string;
  redirects: string;
  https: string;
  forms: string;
  context: string;
  urls: string;
  phones: string;
  emails: string;
  brands: string;
  legal: string;
  privacyMenu: string;
};

const UI: Record<SupportedLocale, UiCopy> = {
  es: {
    hero: "Detecta estafas, phishing y perfiles falsos en segundos",
    sub: "Analiza URLs, capturas de pantalla y mensajes desde un único escáner. Sin chat previo, sin registro.",
    url: "URL o enlace",
    capture: "Captura",
    text: "Mensaje o texto",
    urlPlaceholder: "https://ejemplo.com/enlace-sospechoso",
    textPlaceholder: "Pega aquí el SMS, email, WhatsApp o conversación que te genera dudas…",
    dropTitle: "Arrastra, pega o sube una captura",
    dropHint: "SMS, WhatsApp, email, perfil social, vendedor, web o pantalla de pago",
    choose: "Elegir imagen",
    change: "Cambiar imagen",
    analyze: "Analizar ahora",
    privacy: "Sin registro",
    firstFree: "Primer análisis gratuito",
    pasteImage: "También puedes pegar una captura con Ctrl+V",
    scanning: "Analizando señales de riesgo",
    scanUrl: ["Resolviendo dominio y destino…", "Comprobando HTTPS y respuesta…", "Revisando redirecciones y formularios…", "Analizando señales visibles…", "Calculando puntuación de riesgo…"],
    scanCapture: ["Leyendo el contenido visible…", "Clasificando el contexto…", "Detectando urgencia y suplantación…", "Extrayendo enlaces y datos visibles…", "Calculando puntuación de riesgo…"],
    scanText: ["Clasificando el mensaje…", "Detectando presión y urgencia…", "Buscando señales de suplantación…", "Extrayendo enlaces y contactos…", "Calculando puntuación de riesgo…"],
    report: "Informe Vonu Check",
    cautionIndex: "Puntuación de riesgo",
    confidence: "Confianza del análisis",
    limited: "Limitada",
    medium: "Media",
    highConfidence: "Alta",
    evidence: "Señales y evidencias",
    technical: "Resumen técnico",
    extracted: "Datos detectados",
    actions: "Qué hacer ahora",
    limitations: "Límites del análisis",
    newCheck: "Nueva comprobación",
    invalidUrl: "Introduce una URL válida.",
    invalidText: "Pega un mensaje o texto para analizar.",
    invalidImage: "Sube una imagen PNG, JPG o WEBP de tamaño razonable.",
    genericError: "No hemos podido completar el análisis. Inténtalo de nuevo.",
    veryLow: "Riesgo muy bajo",
    low: "Riesgo bajo",
    caution: "Riesgo moderado",
    high: "Riesgo alto",
    veryHigh: "Riesgo muy alto",
    unknown: "No concluyente",
    lowSummary: "No vemos señales fuertes de riesgo en esta primera capa. Aun así, una ausencia de alertas no certifica que sea legítimo.",
    cautionSummary: "Hay señales que merecen revisión antes de pagar, responder o compartir datos.",
    highSummary: "Hemos encontrado varias señales relevantes de riesgo. No continuaríamos sin verificarlo por otra vía.",
    noCertification: "La puntuación de Vonu es un índice de riesgo basado en las evidencias disponibles; no es una probabilidad de fraude ni certifica legitimidad.",
    finalUrl: "Destino final",
    httpStatus: "Estado HTTP",
    redirects: "Redirecciones",
    https: "HTTPS",
    forms: "Formularios",
    context: "Contexto",
    urls: "Enlaces",
    phones: "Teléfonos",
    emails: "Emails",
    brands: "Marcas",
    legal: "Legal",
    privacyMenu: "Privacidad",
  },
  en: {
    hero: "Detect scams, phishing and fake profiles in seconds",
    sub: "Analyse URLs, screenshots and messages from one scanner. No chat first, no account required.",
    url: "URL or link",
    capture: "Screenshot",
    text: "Message or text",
    urlPlaceholder: "https://example.com/suspicious-link",
    textPlaceholder: "Paste the SMS, email, WhatsApp message or conversation that worries you…",
    dropTitle: "Drag, paste or upload a screenshot",
    dropHint: "SMS, WhatsApp, email, social profile, seller, website or payment screen",
    choose: "Choose image",
    change: "Change image",
    analyze: "Analyse now",
    privacy: "No account required",
    firstFree: "First analysis free",
    pasteImage: "You can also paste a screenshot with Ctrl+V",
    scanning: "Analysing risk signals",
    scanUrl: ["Resolving domain and destination…", "Checking HTTPS and response…", "Reviewing redirects and forms…", "Inspecting visible signals…", "Calculating risk score…"],
    scanCapture: ["Reading visible content…", "Classifying context…", "Detecting urgency and impersonation…", "Extracting visible links and data…", "Calculating risk score…"],
    scanText: ["Classifying message…", "Detecting pressure and urgency…", "Checking impersonation signals…", "Extracting links and contacts…", "Calculating risk score…"],
    report: "Vonu Check report",
    cautionIndex: "Risk score",
    confidence: "Analysis confidence",
    limited: "Limited",
    medium: "Medium",
    highConfidence: "High",
    evidence: "Signals and evidence",
    technical: "Technical summary",
    extracted: "Detected data",
    actions: "What to do now",
    limitations: "Analysis limits",
    newCheck: "New check",
    invalidUrl: "Enter a valid URL.",
    invalidText: "Paste a message or text to analyse.",
    invalidImage: "Upload a reasonable-size PNG, JPG or WEBP image.",
    genericError: "We could not complete the analysis. Please try again.",
    veryLow: "Very low risk",
    low: "Low risk",
    caution: "Moderate risk",
    high: "High risk",
    veryHigh: "Very high risk",
    unknown: "Inconclusive",
    lowSummary: "We do not see strong risk signals in this first layer. A lack of alerts does not certify legitimacy.",
    cautionSummary: "Some signals deserve review before paying, replying or sharing data.",
    highSummary: "Several relevant risk signals were found. We would not continue without independent verification.",
    noCertification: "Vonu's score is a risk index based on the available evidence; it is not a probability of fraud and does not certify legitimacy.",
    finalUrl: "Final destination",
    httpStatus: "HTTP status",
    redirects: "Redirects",
    https: "HTTPS",
    forms: "Forms",
    context: "Context",
    urls: "Links",
    phones: "Phones",
    emails: "Emails",
    brands: "Brands",
    legal: "Legal",
    privacyMenu: "Privacy",
  },
  fr: {
    hero: "Détectez les arnaques, le phishing et les faux profils en quelques secondes",
    sub: "Analysez URLs, captures d’écran et messages depuis un seul scanner. Sans chat préalable ni inscription.",
    url: "URL ou lien",
    capture: "Capture",
    text: "Message ou texte",
    urlPlaceholder: "https://exemple.fr/lien-suspect",
    textPlaceholder: "Collez ici le SMS, l’email ou la conversation qui vous inquiète…",
    dropTitle: "Glissez, collez ou importez une capture",
    dropHint: "SMS, WhatsApp, email, profil social, vendeur, site ou écran de paiement",
    choose: "Choisir une image",
    change: "Changer l’image",
    analyze: "Analyser",
    privacy: "Sans inscription",
    firstFree: "Première analyse gratuite",
    pasteImage: "Vous pouvez aussi coller une capture avec Ctrl+V",
    scanning: "Analyse des signaux de risque",
    scanUrl: ["Résolution du domaine…", "Vérification HTTPS et réponse…", "Analyse des redirections…", "Inspection des signaux visibles…", "Calcul du score de risque…"],
    scanCapture: ["Lecture du contenu visible…", "Classification du contexte…", "Détection de l’urgence…", "Extraction des liens et données…", "Calcul du score de risque…"],
    scanText: ["Classification du message…", "Détection de la pression…", "Recherche d’usurpation…", "Extraction des liens…", "Calcul du score de risque…"],
    report: "Rapport Vonu Check",
    cautionIndex: "Score de risque",
    confidence: "Confiance de l’analyse",
    limited: "Limitée",
    medium: "Moyenne",
    highConfidence: "Élevée",
    evidence: "Signaux et preuves",
    technical: "Résumé technique",
    extracted: "Données détectées",
    actions: "Que faire maintenant",
    limitations: "Limites de l’analyse",
    newCheck: "Nouvelle vérification",
    invalidUrl: "Saisissez une URL valide.",
    invalidText: "Collez un message ou un texte à analyser.",
    invalidImage: "Importez une image PNG, JPG ou WEBP de taille raisonnable.",
    genericError: "Impossible de terminer l’analyse. Réessayez.",
    veryLow: "Risque très faible",
    low: "Risque faible",
    caution: "Risque modéré",
    high: "Risque élevé",
    veryHigh: "Risque très élevé",
    unknown: "Non concluant",
    lowSummary: "Nous ne voyons pas de signal fort dans cette première couche. L’absence d’alerte ne certifie pas la légitimité.",
    cautionSummary: "Certains signaux méritent une vérification avant de payer, répondre ou partager des données.",
    highSummary: "Plusieurs signaux importants ont été trouvés. Nous ne continuerions pas sans vérification indépendante.",
    noCertification: "Le score Vonu est un indice de risque fondé sur les preuves disponibles ; il ne s'agit pas d'une probabilité de fraude et il ne certifie pas la légitimité.",
    finalUrl: "Destination finale",
    httpStatus: "Statut HTTP",
    redirects: "Redirections",
    https: "HTTPS",
    forms: "Formulaires",
    context: "Contexte",
    urls: "Liens",
    phones: "Téléphones",
    emails: "Emails",
    brands: "Marques",
    legal: "Mentions légales",
    privacyMenu: "Confidentialité",
  },
  de: {
    hero: "Betrug, Phishing und Fake-Profile in Sekunden erkennen",
    sub: "Analysiere URLs, Screenshots und Nachrichten mit einem Scanner. Ohne vorherigen Chat und ohne Konto.",
    url: "URL oder Link",
    capture: "Screenshot",
    text: "Nachricht oder Text",
    urlPlaceholder: "https://beispiel.de/verdaechtiger-link",
    textPlaceholder: "Füge hier SMS, E-Mail, WhatsApp-Nachricht oder Gespräch ein…",
    dropTitle: "Screenshot ziehen, einfügen oder hochladen",
    dropHint: "SMS, WhatsApp, E-Mail, Social-Profil, Verkäufer, Website oder Zahlungsseite",
    choose: "Bild wählen",
    change: "Bild ändern",
    analyze: "Jetzt analysieren",
    privacy: "Ohne Konto",
    firstFree: "Erste Analyse kostenlos",
    pasteImage: "Screenshot auch mit Ctrl+V einfügen",
    scanning: "Risikosignale werden analysiert",
    scanUrl: ["Domain wird aufgelöst…", "HTTPS und Antwort werden geprüft…", "Weiterleitungen werden analysiert…", "Sichtbare Signale werden geprüft…", "Risikowert wird berechnet…"],
    scanCapture: ["Sichtbarer Inhalt wird gelesen…", "Kontext wird klassifiziert…", "Dringlichkeit wird geprüft…", "Links und Daten werden extrahiert…", "Risikowert wird berechnet…"],
    scanText: ["Nachricht wird klassifiziert…", "Druck und Dringlichkeit werden geprüft…", "Identitätsmissbrauch wird geprüft…", "Links werden extrahiert…", "Risikowert wird berechnet…"],
    report: "Vonu Check Bericht",
    cautionIndex: "Risikowert",
    confidence: "Analysevertrauen",
    limited: "Begrenzt",
    medium: "Mittel",
    highConfidence: "Hoch",
    evidence: "Signale und Belege",
    technical: "Technische Zusammenfassung",
    extracted: "Erkannte Daten",
    actions: "Was jetzt zu tun ist",
    limitations: "Grenzen der Analyse",
    newCheck: "Neue Prüfung",
    invalidUrl: "Gib eine gültige URL ein.",
    invalidText: "Füge eine Nachricht oder Text zur Analyse ein.",
    invalidImage: "Lade ein PNG-, JPG- oder WEBP-Bild in angemessener Größe hoch.",
    genericError: "Die Analyse konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    veryLow: "Sehr geringes Risiko",
    low: "Geringes Risiko",
    caution: "Mittleres Risiko",
    high: "Hohes Risiko",
    veryHigh: "Sehr hohes Risiko",
    unknown: "Nicht eindeutig",
    lowSummary: "In dieser ersten Schicht sehen wir keine starken Risikosignale. Das bestätigt jedoch keine Seriosität.",
    cautionSummary: "Einige Signale sollten geprüft werden, bevor du zahlst, antwortest oder Daten teilst.",
    highSummary: "Mehrere relevante Risikosignale wurden gefunden. Wir würden ohne unabhängige Prüfung nicht fortfahren.",
    noCertification: "Der Vonu-Wert ist ein Risikoindex auf Basis der verfügbaren Belege; er ist keine Betrugswahrscheinlichkeit und bestätigt keine Seriosität.",
    finalUrl: "Endziel",
    httpStatus: "HTTP-Status",
    redirects: "Weiterleitungen",
    https: "HTTPS",
    forms: "Formulare",
    context: "Kontext",
    urls: "Links",
    phones: "Telefonnummern",
    emails: "E-Mails",
    brands: "Marken",
    legal: "Impressum",
    privacyMenu: "Datenschutz",
  },
  ar: {
    hero: "اكتشف الاحتيال والتصيد والملفات المزيفة خلال ثوانٍ",
    sub: "حلّل الروابط ولقطات الشاشة والرسائل من ماسح واحد، دون محادثة مسبقة أو تسجيل.",
    url: "رابط أو URL",
    capture: "لقطة شاشة",
    text: "رسالة أو نص",
    urlPlaceholder: "https://example.com/suspicious-link",
    textPlaceholder: "الصق هنا الرسالة أو البريد أو المحادثة التي تثير شكك…",
    dropTitle: "اسحب أو الصق أو ارفع لقطة شاشة",
    dropHint: "SMS أو WhatsApp أو بريد أو ملف اجتماعي أو بائع أو صفحة دفع",
    choose: "اختيار صورة",
    change: "تغيير الصورة",
    analyze: "حلّل الآن",
    privacy: "بدون تسجيل",
    firstFree: "أول تحليل مجاني",
    pasteImage: "يمكنك أيضاً لصق لقطة باستخدام Ctrl+V",
    scanning: "جارٍ تحليل إشارات المخاطر",
    scanUrl: ["جارٍ التحقق من النطاق…", "جارٍ فحص HTTPS والاستجابة…", "جارٍ مراجعة التحويلات…", "جارٍ تحليل الإشارات الظاهرة…", "جارٍ حساب درجة المخاطر…"],
    scanCapture: ["جارٍ قراءة المحتوى…", "جارٍ تصنيف السياق…", "جارٍ فحص الاستعجال والانتحال…", "جارٍ استخراج الروابط والبيانات…", "جارٍ حساب درجة المخاطر…"],
    scanText: ["جارٍ تصنيف الرسالة…", "جارٍ فحص الضغط والاستعجال…", "جارٍ فحص الانتحال…", "جارٍ استخراج الروابط…", "جارٍ حساب درجة المخاطر…"],
    report: "تقرير Vonu Check",
    cautionIndex: "درجة المخاطر",
    confidence: "ثقة التحليل",
    limited: "محدودة",
    medium: "متوسطة",
    highConfidence: "عالية",
    evidence: "الإشارات والأدلة",
    technical: "الملخص التقني",
    extracted: "البيانات المكتشفة",
    actions: "ماذا تفعل الآن",
    limitations: "حدود التحليل",
    newCheck: "فحص جديد",
    invalidUrl: "أدخل رابطاً صالحاً.",
    invalidText: "الصق رسالة أو نصاً للتحليل.",
    invalidImage: "ارفع صورة PNG أو JPG أو WEBP بحجم مناسب.",
    genericError: "تعذر إكمال التحليل. حاول مرة أخرى.",
    veryLow: "مخاطر منخفضة جداً",
    low: "مخاطر منخفضة",
    caution: "مخاطر متوسطة",
    high: "مخاطر عالية",
    veryHigh: "مخاطر عالية جداً",
    unknown: "غير حاسم",
    lowSummary: "لا نرى إشارات خطر قوية في هذه الطبقة الأولى. غياب التنبيهات لا يثبت الشرعية.",
    cautionSummary: "هناك إشارات تستحق التحقق قبل الدفع أو الرد أو مشاركة البيانات.",
    highSummary: "تم العثور على عدة إشارات مهمة للمخاطر. لن نتابع دون تحقق مستقل.",
    noCertification: "درجة Vonu هي مؤشر للمخاطر قائم على الأدلة المتاحة؛ وليست احتمالاً للاحتيال ولا شهادة على الشرعية.",
    finalUrl: "الوجهة النهائية",
    httpStatus: "حالة HTTP",
    redirects: "التحويلات",
    https: "HTTPS",
    forms: "النماذج",
    context: "السياق",
    urls: "الروابط",
    phones: "الهواتف",
    emails: "البريد",
    brands: "العلامات",
    legal: "قانوني",
    privacyMenu: "الخصوصية",
  },
};

const unknownSummary: Record<SupportedLocale, string> = {
  es: "No hemos podido inspeccionar suficiente contenido para emitir un veredicto fiable. Esto no es una señal de fraude: algunos servicios bloquean las comprobaciones automatizadas.",
  en: "We could not inspect enough content to produce a reliable verdict. This is not a fraud signal: some services block automated checks.",
  fr: "Nous n’avons pas pu inspecter assez de contenu pour fournir un verdict fiable. Ce n’est pas un signal de fraude : certains services bloquent les vérifications automatisées.",
  de: "Wir konnten nicht genug Inhalt prüfen, um ein verlässliches Urteil abzugeben. Das ist kein Betrugssignal: Manche Dienste blockieren automatisierte Prüfungen.",
  ar: "لم نتمكن من فحص محتوى كافٍ لإصدار نتيجة موثوقة. هذا ليس مؤشر احتيال؛ بعض الخدمات تمنع الفحوصات الآلية.",
};

const subjectCopy: Record<SupportedLocale, { analysed: string; url: string; capture: string; text: string }> = {
  es: { analysed: "Analizado", url: "URL analizada", capture: "Captura analizada", text: "Mensaje analizado" },
  en: { analysed: "Analysed", url: "Analysed URL", capture: "Analysed screenshot", text: "Analysed message" },
  fr: { analysed: "Analysé", url: "URL analysée", capture: "Capture analysée", text: "Message analysé" },
  de: { analysed: "Analysiert", url: "Analysierte URL", capture: "Analysierter Screenshot", text: "Analysierte Nachricht" },
  ar: { analysed: "تم التحليل", url: "الرابط الذي تم تحليله", capture: "لقطة الشاشة التي تم تحليلها", text: "الرسالة التي تم تحليلها" },
};

const limitationCopy: Record<SupportedLocale, Record<string, string>> = {
  es: {
    "technical-signals-only": "Esta versión usa todavía una capa técnica inicial.",
    "no-reputation-layer-yet": "La reputación externa todavía no se contrasta en este informe.",
    "no-business-identity-layer-yet": "La identidad empresarial todavía no se verifica en esta versión.",
    "no-domain-age-layer-yet": "La antigüedad y registro del dominio todavía no se incorporan.",
    "page-content-not-inspectable": "El servidor no permitió inspeccionar el contenido completo de la página.",
  },
  en: {
    "technical-signals-only": "This version still uses an initial technical layer.",
    "no-reputation-layer-yet": "External reputation is not yet cross-checked in this report.",
    "no-business-identity-layer-yet": "Business identity is not yet verified in this version.",
    "no-domain-age-layer-yet": "Domain age and registration are not yet included.",
    "page-content-not-inspectable": "The server did not allow the full page content to be inspected.",
  },
  fr: {
    "technical-signals-only": "Cette version utilise encore une première couche technique.",
    "no-reputation-layer-yet": "La réputation externe n’est pas encore recoupée dans ce rapport.",
    "no-business-identity-layer-yet": "L’identité de l’entreprise n’est pas encore vérifiée dans cette version.",
    "no-domain-age-layer-yet": "L’ancienneté et l’enregistrement du domaine ne sont pas encore inclus.",
    "page-content-not-inspectable": "Le serveur n’a pas permis d’inspecter tout le contenu de la page.",
  },
  de: {
    "technical-signals-only": "Diese Version nutzt noch eine erste technische Ebene.",
    "no-reputation-layer-yet": "Externe Reputation wird in diesem Bericht noch nicht abgeglichen.",
    "no-business-identity-layer-yet": "Die Unternehmensidentität wird in dieser Version noch nicht verifiziert.",
    "no-domain-age-layer-yet": "Domainalter und Registrierung sind noch nicht enthalten.",
    "page-content-not-inspectable": "Der Server erlaubte keine vollständige Prüfung des Seiteninhalts.",
  },
  ar: {
    "technical-signals-only": "لا يزال هذا الإصدار يستخدم طبقة تقنية أولية.",
    "no-reputation-layer-yet": "لم تتم بعد مقارنة السمعة الخارجية في هذا التقرير.",
    "no-business-identity-layer-yet": "لم يتم بعد التحقق من هوية الشركة في هذا الإصدار.",
    "no-domain-age-layer-yet": "لم تتم بعد إضافة عمر النطاق وبيانات تسجيله.",
    "page-content-not-inspectable": "لم يسمح الخادم بفحص محتوى الصفحة بالكامل.",
  },
};

function VonuMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
      <path d="M20 3.8 33.8 11v18L20 36.2 6.2 29V11L20 3.8Z" stroke="rgb(52 211 153)" strokeWidth="2.35" strokeLinejoin="round" />
      <path d="M13.2 11.2 20 7.7l6.8 3.5M9.7 17.2 20 12l10.3 5.2M9.7 22.8 20 28l10.3-5.2M13.2 28.8 20 32.3l6.8-3.5" stroke="rgba(52,211,153,.38)" strokeWidth="1" />
    </svg>
  );
}

function ModeIcon({ mode }: { mode: Mode }) {
  if (mode === "url") return <span aria-hidden="true" className="text-[17px]">◎</span>;
  if (mode === "capture") return <span aria-hidden="true" className="text-[16px]">▣</span>;
  return <span aria-hidden="true" className="text-[17px]">≡</span>;
}

function riskStyles(level: RiskLevel) {
  if (level === "high") return { accent: "#fb7185", bg: "rgba(244,63,94,.10)", border: "rgba(251,113,133,.34)" };
  if (level === "caution") return { accent: "#fbbf24", bg: "rgba(245,158,11,.10)", border: "rgba(251,191,36,.32)" };
  if (level === "low") return { accent: "#34d399", bg: "rgba(16,185,129,.10)", border: "rgba(52,211,153,.30)" };
  return { accent: "#94a3b8", bg: "rgba(148,163,184,.08)", border: "rgba(148,163,184,.26)" };
}

function toneDot(tone: SignalTone) {
  if (tone === "negative") return "bg-rose-400";
  if (tone === "warning") return "bg-amber-300";
  if (tone === "positive") return "bg-emerald-400";
  return "bg-slate-400";
}

function contextLabel(kind: CaptureCheckResult["kind"], locale: SupportedLocale) {
  const labels: Record<SupportedLocale, Record<CaptureCheckResult["kind"], string>> = {
    es: { message: "Mensaje", email: "Email", social_profile: "Perfil social", marketplace: "Marketplace / vendedor", website_or_checkout: "Web / pago", other: "Otro" },
    en: { message: "Message", email: "Email", social_profile: "Social profile", marketplace: "Marketplace / seller", website_or_checkout: "Website / checkout", other: "Other" },
    fr: { message: "Message", email: "Email", social_profile: "Profil social", marketplace: "Marketplace / vendeur", website_or_checkout: "Site / paiement", other: "Autre" },
    de: { message: "Nachricht", email: "E-Mail", social_profile: "Social-Profil", marketplace: "Marketplace / Verkäufer", website_or_checkout: "Website / Zahlung", other: "Andere" },
    ar: { message: "رسالة", email: "بريد", social_profile: "ملف اجتماعي", marketplace: "سوق / بائع", website_or_checkout: "موقع / دفع", other: "آخر" },
  };
  return labels[locale][kind];
}

function labelForRiskBand(band: RiskBand, t: UiCopy) {
  if (band === "very_low") return t.veryLow;
  if (band === "low") return t.low;
  if (band === "moderate") return t.caution;
  if (band === "high") return t.high;
  if (band === "very_high") return t.veryHigh;
  return t.unknown;
}

export default function CheckClient({ locale }: { locale: SupportedLocale }) {
  const t = UI[locale];
  const dir = localeMeta[locale].dir;
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanIndex, setScanIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => setScanIndex((value) => value + 1), 760);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = localeMeta[locale].htmlLang;
  }, [dir, locale]);

  function switchMode(next: Mode) {
    if (loading) return;
    setMode(next);
    setError("");
    setResult(null);
  }

  async function handleFile(file: File | null) {
    if (!file || !/^image\/(png|jpe?g|webp)$/i.test(file.type) || file.size > 2_600_000) {
      setError(t.invalidImage);
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("file_read_failed"));
      reader.readAsDataURL(file);
    }).catch(() => "");
    if (!dataUrl) {
      setError(t.invalidImage);
      return;
    }
    setMode("capture");
    setImageData(dataUrl);
    setImageName(file.name || "screenshot");
    setError("");
  }

  async function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
    if (!imageItem) return;
    const file = imageItem.getAsFile();
    if (!file) return;
    event.preventDefault();
    await handleFile(file);
  }

  async function analyze() {
    setError("");
    setResult(null);
    let endpoint = "";
    let body: Record<string, unknown> = { locale };

    if (mode === "url") {
      const clean = url.trim();
      if (!clean || clean.length > 2048) {
        setError(t.invalidUrl);
        return;
      }
      endpoint = "/api/check/web";
      body = { ...body, url: clean };
    } else if (mode === "capture") {
      if (!imageData) {
        setError(t.invalidImage);
        return;
      }
      endpoint = "/api/check/image";
      body = { ...body, imageBase64: imageData };
    } else {
      const clean = text.trim();
      if (!clean || clean.length > 20_000) {
        setError(t.invalidText);
        return;
      }
      endpoint = "/api/check/text";
      body = { ...body, text: clean };
    }

    setLoading(true);
    setScanIndex(0);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.error || "analysis_failed");
      setResult(data as Result);
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
    setScanIndex(0);
  }

  const steps = mode === "url" ? t.scanUrl : mode === "capture" ? t.scanCapture : t.scanText;
  const activeStep = steps[scanIndex % steps.length];
  const risk = result?.risk;
  const styles = risk ? riskStyles(risk.level) : riskStyles("unknown");
  const riskBand: RiskBand = !risk || risk.level === "unknown"
    ? "unknown"
    : risk.band ?? riskBandFromScore(risk.score);
  const riskLabel = labelForRiskBand(riskBand, t);
  const confidenceLabel = risk
    ? risk.confidence === "high"
      ? t.highConfidence
      : risk.confidence === "medium"
        ? t.medium
        : t.limited
    : t.limited;
  const summary = !result
    ? ""
    : result.version === "vonu-check-v1"
      ? result.risk.level === "high"
        ? t.highSummary
        : result.risk.level === "caution"
          ? t.cautionSummary
          : result.risk.level === "unknown"
            ? unknownSummary[locale]
            : t.lowSummary
      : result.summary;
  const idle = !result && !loading;

  const subject = (() => {
    if (result?.version === "vonu-check-v1") {
      return {
        label: subjectCopy[locale].url,
        primary: result.facts.hostname,
        detail: result.facts.finalUrl,
        image: null as string | null,
        icon: "◎",
      };
    }
    if (result?.version === "vonu-capture-v1" || mode === "capture") {
      return {
        label: subjectCopy[locale].capture,
        primary: imageName || subjectCopy[locale].capture,
        detail: result?.version === "vonu-capture-v1" ? contextLabel(result.kind, locale) : t.dropHint,
        image: imageData,
        icon: "▣",
      };
    }
    if (result?.version === "vonu-text-v1" || mode === "text") {
      const preview = text.trim().replace(/\s+/g, " ");
      return {
        label: subjectCopy[locale].text,
        primary: preview.slice(0, 72) || subjectCopy[locale].text,
        detail: preview.length > 72 ? `${preview.slice(72, 150)}…` : "",
        image: null as string | null,
        icon: "≡",
      };
    }
    const cleanUrl = url.trim();
    let host = cleanUrl;
    try {
      host = new URL(/^https?:\/\//i.test(cleanUrl) ? cleanUrl : `https://${cleanUrl}`).hostname;
    } catch {
      // Keep the submitted value as the visible subject.
    }
    return {
      label: subjectCopy[locale].url,
      primary: host || subjectCopy[locale].url,
      detail: cleanUrl,
      image: null as string | null,
      icon: "◎",
    };
  })();

  function SubjectCard({ completed = false }: { completed?: boolean }) {
    return (
      <section className="mb-5 flex items-center gap-3 rounded-[18px] border border-white/[0.075] bg-[#111725]/88 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,.18)]">
        {subject.image ? (
          <img src={subject.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
        ) : (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-400/[0.08] text-[20px] text-emerald-300 ring-1 ring-emerald-400/20">{subject.icon}</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{subject.label}</p>
          <p className="mt-1 truncate text-[14px] font-semibold text-slate-100">{subject.primary}</p>
          {subject.detail && <p className="mt-0.5 truncate text-[11px] text-slate-500">{subject.detail}</p>}
        </div>
        {completed && (
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.10em] text-emerald-300 ring-1 ring-emerald-400/20 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {subjectCopy[locale].analysed}
          </span>
        )}
      </section>
    );
  }

  return (
    <div
      dir={dir}
      onPaste={handlePaste}
      className={[
        "flex min-h-dvh flex-col bg-[#0d101b] text-slate-100",
        idle ? "md:h-dvh md:overflow-hidden" : "",
      ].join(" ")}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 44%, rgba(16,185,129,.07), transparent 28%), radial-gradient(circle at 88% 68%, rgba(56,189,248,.035), transparent 24%), linear-gradient(180deg,#0b0e17 0%,#111523 100%)",
      }}
    >
      <HomeHeader />

      {idle && (
        <>
          <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col justify-center px-4 py-5 sm:px-6 md:min-h-0 md:py-3 lg:px-8">
            <section className="text-center">
              <h1 className="mx-auto max-w-[900px] text-balance text-[36px] font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-[48px] lg:text-[56px] xl:text-[60px]">{t.hero}</h1>
              <p className="mx-auto mt-3 max-w-[720px] text-[15px] leading-6 text-slate-400 sm:text-[16px] lg:text-[17px]">{t.sub}</p>
            </section>

            <section className="mx-auto mt-5 w-full max-w-[850px] rounded-[22px] bg-[#141927]/72 shadow-[0_26px_70px_rgba(0,0,0,.24)] backdrop-blur-sm sm:mt-6">
              <div className="grid grid-cols-3 px-2 pt-1">
                {(["url", "capture", "text"] as Mode[]).map((item) => (
                  <button key={item} type="button" onClick={() => switchMode(item)} className={["relative flex h-[52px] items-center justify-center gap-2 px-2 text-[12px] font-semibold transition sm:text-[14px]", mode === item ? "text-emerald-300" : "text-slate-400 hover:text-slate-200"].join(" ")}>
                    <ModeIcon mode={item} />
                    <span>{item === "url" ? t.url : item === "capture" ? t.capture : t.text}</span>
                    {mode === item && <span className="absolute inset-x-[18%] bottom-0 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.45)]" />}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                {mode === "url" && (
                  <div className="flex min-h-[72px] items-center rounded-[18px] bg-[#0d1220] px-4 ring-1 ring-white/[0.07] transition focus-within:ring-emerald-400/35">
                    <span className="me-3 text-emerald-300">⌕</span>
                    <input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void analyze(); }} placeholder={t.urlPlaceholder} inputMode="url" autoCapitalize="none" autoCorrect="off" className="w-full bg-transparent py-5 text-[15px] text-white outline-none placeholder:text-slate-600 sm:text-[16px]" />
                  </div>
                )}

                {mode === "text" && (
                  <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t.textPlaceholder} className="min-h-[118px] w-full resize-none rounded-[18px] bg-[#0d1220] p-4 text-[15px] leading-6 text-white outline-none ring-1 ring-white/[0.07] transition placeholder:text-slate-600 focus:ring-emerald-400/35 sm:min-h-[128px]" />
                )}

                {mode === "capture" && (
                  <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files?.[0] || null); }} className="grid min-h-[138px] place-items-center px-3 py-2 text-center">
                    {imageData ? (
                      <div className="grid w-full gap-3 sm:grid-cols-[110px_1fr] sm:items-center sm:text-start">
                        <img src={imageData} alt="Preview" className="mx-auto max-h-[112px] max-w-[110px] rounded-lg object-contain" />
                        <div>
                          <p className="truncate text-[14px] font-semibold text-white">{imageName}</p>
                          <p className="mt-1 text-[13px] text-slate-400">{t.dropHint}</p>
                          <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 rounded-lg bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08]">{t.change}</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[16px] font-semibold text-white sm:text-[17px]">{t.dropTitle}</p>
                        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-5 text-slate-400 sm:text-sm">{t.dropHint}</p>
                        <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 rounded-xl bg-emerald-400/[0.10] px-4 py-2 text-[13px] font-semibold text-emerald-200 ring-1 ring-emerald-400/25 hover:bg-emerald-400/[0.14]">{t.choose}</button>
                        <p className="mt-2 text-[11px] text-slate-600">{t.pasteImage}</p>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0] || null)} />
                  </div>
                )}

                {error && <p className="mt-3 rounded-lg bg-rose-400/[0.07] px-4 py-2.5 text-sm text-rose-200 ring-1 ring-rose-400/20">{error}</p>}

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 sm:text-xs">
                    <span>✓ {t.firstFree}</span>
                  </div>
                  <button type="button" onClick={() => void analyze()} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:bg-emerald-300 active:scale-[.99] sm:min-w-[160px]">{t.analyze}</button>
                </div>
              </div>
            </section>
          </main>

          <footer className="shrink-0 border-t border-white/[0.055] bg-[#0b0e17]/55">
            <div className="mx-auto flex min-h-11 max-w-[1320px] items-center justify-between gap-3 px-4 text-[11px] text-slate-600 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-slate-500"><VonuMark /><span className="font-semibold tracking-[0.08em] text-slate-400">VONU</span></div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link href="/producto" className="hidden hover:text-slate-400 sm:inline">Producto</Link>
                <Link href="/casos-de-uso" className="hidden hover:text-slate-400 sm:inline">Casos de uso</Link>
                <Link href="/legal/aviso-legal" className="hover:text-slate-400">{t.legal}</Link>
                <Link href="/legal/privacidad" className="hover:text-slate-400">{t.privacyMenu}</Link>
              </div>
            </div>
          </footer>
        </>
      )}

      {loading && (
        <main className="mx-auto grid min-h-[calc(100dvh-68px)] w-full max-w-[900px] place-items-center px-4 py-10">
          <section className="w-full">
            <SubjectCard />
            <div className="rounded-[26px] bg-[#141927]/86 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,.34)] ring-1 ring-white/[0.08] sm:p-9">
              <div className="relative mx-auto h-40 w-40">
                <div className="absolute inset-0 rounded-full border border-emerald-400/15" />
                <div className="absolute inset-5 rounded-full border border-emerald-400/20" />
                <div className="absolute inset-10 rounded-full border border-emerald-400/25" />
                <div className="absolute left-1/2 top-1/2 h-px w-[72px] origin-left -translate-y-1/2 bg-gradient-to-r from-emerald-300 to-transparent animate-[spin_1.45s_linear_infinite]" />
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_22px_rgba(52,211,153,.85)]" />
              </div>
              <h2 className="mt-6 text-[24px] font-bold tracking-[-0.035em] text-white">{t.scanning}</h2>
              <p className="mt-3 min-h-6 text-sm text-emerald-200/85">{activeStep}</p>
              <div className="mx-auto mt-6 h-1 max-w-sm overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-1/2 animate-[pulse_1.1s_ease-in-out_infinite] rounded-full bg-emerald-400" /></div>
            </div>
          </section>
        </main>
      )}

      {result && (
        <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <SubjectCard completed />

          <section className="rounded-[28px] p-5 shadow-[0_30px_90px_rgba(0,0,0,.35)] ring-1 sm:p-8" style={{ background: `linear-gradient(180deg, ${styles.bg}, rgba(20,25,39,.94))`, borderColor: styles.border }}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{t.report}</p>
                <h1 className="mt-3 text-[34px] font-bold tracking-[-0.05em] sm:text-[48px]" style={{ color: styles.accent }}>{riskLabel}</h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">{summary}</p>
              </div>
              <div className="flex min-w-[220px] items-center gap-4 rounded-2xl bg-black/15 p-4 ring-1 ring-white/[0.07]">
                <div className="whitespace-nowrap font-bold tracking-[-0.06em] text-white">
                  {risk?.level === "unknown" ? (
                    <span className="text-[42px]">—</span>
                  ) : (
                    <><span className="text-[42px]">{risk?.score ?? 0}</span><span className="ms-1 text-[20px] text-slate-400">/100</span></>
                  )}
                </div>
                <div className="text-xs leading-5 text-slate-400"><div>{t.cautionIndex}</div><div className="mt-1 text-slate-300">{t.confidence}: {confidenceLabel}</div></div>
              </div>
            </div>
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <section className="rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08] sm:p-6">
              <h2 className="text-[17px] font-bold text-white">{t.evidence}</h2>
              <div className="mt-4 grid gap-3">
                {result.signals.map((signal) => (
                  <div key={signal.id} className="rounded-2xl bg-black/10 p-4 ring-1 ring-white/[0.055]">
                    <div className="flex items-start gap-3">
                      <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneDot(signal.tone)}`} />
                      <div><h3 className="text-[14px] font-semibold text-white">{signal.title}</h3><p className="mt-1 text-[13px] leading-6 text-slate-400">{signal.detail}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid content-start gap-5">
              {result.version === "vonu-check-v1" ? (
                <section className="rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
                  <h2 className="text-[17px] font-bold text-white">{t.technical}</h2>
                  <dl className="mt-4 grid gap-3 text-[13px]">
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.finalUrl}</dt><dd className="max-w-[220px] truncate text-slate-300">{result.facts.finalUrl}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.httpStatus}</dt><dd className="text-slate-300">{result.facts.httpStatus ?? "—"}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.redirects}</dt><dd className="text-slate-300">{result.facts.redirects}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.https}</dt><dd className="text-slate-300">{result.facts.usesHttps ? "✓" : "—"}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.forms}</dt><dd className="text-slate-300">{result.facts.formCount}</dd></div>
                  </dl>
                </section>
              ) : (
                <>
                  <section className="rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
                    <h2 className="text-[17px] font-bold text-white">{t.extracted}</h2>
                    {result.version === "vonu-capture-v1" && <p className="mt-3 text-[13px] text-slate-400">{t.context}: <span className="text-slate-200">{contextLabel(result.kind, locale)}</span></p>}
                    <div className="mt-3 grid gap-2 text-[12px] text-slate-400">
                      {result.extracted.urls.length > 0 && <p><span className="text-slate-500">{t.urls}: </span>{result.extracted.urls.join(", ")}</p>}
                      {result.extracted.phones.length > 0 && <p><span className="text-slate-500">{t.phones}: </span>{result.extracted.phones.join(", ")}</p>}
                      {result.extracted.emails.length > 0 && <p><span className="text-slate-500">{t.emails}: </span>{result.extracted.emails.join(", ")}</p>}
                      {result.extracted.brands.length > 0 && <p><span className="text-slate-500">{t.brands}: </span>{result.extracted.brands.join(", ")}</p>}
                    </div>
                  </section>
                  {result.recommendedActions.length > 0 && (
                    <section className="rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
                      <h2 className="text-[17px] font-bold text-white">{t.actions}</h2>
                      <ul className="mt-3 grid gap-2 text-[13px] leading-6 text-slate-400">{result.recommendedActions.map((action, index) => <li key={`${action}-${index}`}>• {action}</li>)}</ul>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>

          {result.limitations.length > 0 && (
            <section className="mt-5 rounded-[22px] bg-white/[0.025] p-5 ring-1 ring-white/[0.06]">
              <h2 className="text-[14px] font-semibold text-slate-300">{t.limitations}</h2>
              <ul className="mt-2 grid gap-1.5 text-[12px] leading-5 text-slate-500">{result.limitations.map((item, index) => <li key={`${item}-${index}`}>• {limitationCopy[locale][item] || item}</li>)}</ul>
            </section>
          )}

          <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-[12px] leading-5 text-slate-600">{t.noCertification}</p>
            <button type="button" onClick={reset} className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/[0.08] hover:bg-white/[0.09]">{t.newCheck}</button>
          </div>
        </main>
      )}
    </div>
  );
}
