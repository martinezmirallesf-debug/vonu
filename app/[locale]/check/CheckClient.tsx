"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { CaptureCheckResult } from "@/lib/vonu-check/capture-types";
import type { TextCheckResult } from "@/lib/vonu-check/text-types";
import type { RiskLevel, SignalTone, SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type Mode = "url" | "capture" | "text";
type Result = WebCheckResult | CaptureCheckResult | TextCheckResult;

type UiCopy = {
  hero: string;
  sub: string;
  engine: string;
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
  method: string;
  privacyMenu: string;
  pricing: string;
  menu: string;
  invalidUrl: string;
  invalidText: string;
  invalidImage: string;
  genericError: string;
  low: string;
  caution: string;
  high: string;
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
};

const UI: Record<SupportedLocale, UiCopy> = {
  es: {
    hero: "Detecta estafas, phishing y perfiles falsos en segundos",
    sub: "Analiza URLs, capturas de pantalla y mensajes desde un único escáner. Sin chat previo, sin registro.",
    engine: "Motor de riesgo activo",
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
    scanUrl: ["Resolviendo dominio y destino…", "Comprobando HTTPS y respuesta…", "Revisando redirecciones y formularios…", "Analizando señales visibles…", "Calculando índice de precaución…"],
    scanCapture: ["Leyendo el contenido visible…", "Clasificando el contexto…", "Detectando urgencia y suplantación…", "Extrayendo enlaces y datos visibles…", "Contrastando señales técnicas…"],
    scanText: ["Clasificando el mensaje…", "Detectando presión y urgencia…", "Buscando señales de suplantación…", "Extrayendo enlaces y contactos…", "Calculando índice de precaución…"],
    report: "Informe Vonu Check",
    cautionIndex: "Índice de precaución",
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
    method: "Metodología",
    privacyMenu: "Privacidad",
    pricing: "Precios",
    menu: "Menú",
    invalidUrl: "Introduce una URL válida.",
    invalidText: "Pega un mensaje o texto para analizar.",
    invalidImage: "Sube una imagen PNG, JPG o WEBP de tamaño razonable.",
    genericError: "No hemos podido completar el análisis. Inténtalo de nuevo.",
    low: "Sin alertas fuertes",
    caution: "Precaución",
    high: "Riesgo alto",
    unknown: "No concluyente",
    lowSummary: "No vemos señales fuertes de riesgo en esta primera capa. Aun así, una ausencia de alertas no certifica que sea legítimo.",
    cautionSummary: "Hay señales que merecen revisión antes de pagar, responder o compartir datos.",
    highSummary: "Hemos encontrado varias señales relevantes de riesgo. No continuaríamos sin verificarlo por otra vía.",
    noCertification: "Vonu identifica señales de riesgo; no certifica que una web, persona o mensaje sea legítimo o fraudulento.",
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
  },
  en: {
    hero: "Detect scams, phishing and fake profiles in seconds",
    sub: "Analyse URLs, screenshots and messages from one scanner. No chat first, no account required.",
    engine: "Risk engine active",
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
    scanUrl: ["Resolving domain and destination…", "Checking HTTPS and response…", "Reviewing redirects and forms…", "Inspecting visible signals…", "Calculating caution index…"],
    scanCapture: ["Reading visible content…", "Classifying context…", "Detecting urgency and impersonation…", "Extracting visible links and data…", "Cross-checking technical signals…"],
    scanText: ["Classifying message…", "Detecting pressure and urgency…", "Checking impersonation signals…", "Extracting links and contacts…", "Calculating caution index…"],
    report: "Vonu Check report",
    cautionIndex: "Caution index",
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
    method: "Method",
    privacyMenu: "Privacy",
    pricing: "Pricing",
    menu: "Menu",
    invalidUrl: "Enter a valid URL.",
    invalidText: "Paste a message or text to analyse.",
    invalidImage: "Upload a reasonable-size PNG, JPG or WEBP image.",
    genericError: "We could not complete the analysis. Please try again.",
    low: "No strong alerts",
    caution: "Caution",
    high: "High risk",
    unknown: "Inconclusive",
    lowSummary: "We do not see strong risk signals in this first layer. A lack of alerts does not certify legitimacy.",
    cautionSummary: "Some signals deserve review before paying, replying or sharing data.",
    highSummary: "Several relevant risk signals were found. We would not continue without independent verification.",
    noCertification: "Vonu identifies risk signals; it does not certify that a website, person or message is legitimate or fraudulent.",
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
  },
  fr: {
    hero: "Détectez les arnaques, le phishing et les faux profils en quelques secondes",
    sub: "Analysez URLs, captures d’écran et messages depuis un seul scanner. Sans chat préalable ni inscription.",
    engine: "Moteur de risque actif",
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
    scanUrl: ["Résolution du domaine…", "Vérification HTTPS et réponse…", "Analyse des redirections…", "Inspection des signaux visibles…", "Calcul de l’indice de prudence…"],
    scanCapture: ["Lecture du contenu visible…", "Classification du contexte…", "Détection de l’urgence…", "Extraction des liens et données…", "Vérification des signaux techniques…"],
    scanText: ["Classification du message…", "Détection de la pression…", "Recherche d’usurpation…", "Extraction des liens…", "Calcul de l’indice de prudence…"],
    report: "Rapport Vonu Check",
    cautionIndex: "Indice de prudence",
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
    method: "Méthode",
    privacyMenu: "Confidentialité",
    pricing: "Tarifs",
    menu: "Menu",
    invalidUrl: "Saisissez une URL valide.",
    invalidText: "Collez un message ou un texte à analyser.",
    invalidImage: "Importez une image PNG, JPG ou WEBP de taille raisonnable.",
    genericError: "Impossible de terminer l’analyse. Réessayez.",
    low: "Pas d’alerte forte",
    caution: "Prudence",
    high: "Risque élevé",
    unknown: "Non concluant",
    lowSummary: "Nous ne voyons pas de signal fort dans cette première couche. L’absence d’alerte ne certifie pas la légitimité.",
    cautionSummary: "Certains signaux méritent une vérification avant de payer, répondre ou partager des données.",
    highSummary: "Plusieurs signaux importants ont été trouvés. Nous ne continuerions pas sans vérification indépendante.",
    noCertification: "Vonu identifie des signaux de risque ; il ne certifie pas qu’un site, une personne ou un message est légitime ou frauduleux.",
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
  },
  de: {
    hero: "Betrug, Phishing und Fake-Profile in Sekunden erkennen",
    sub: "Analysiere URLs, Screenshots und Nachrichten mit einem Scanner. Ohne vorherigen Chat und ohne Konto.",
    engine: "Risiko-Engine aktiv",
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
    scanUrl: ["Domain wird aufgelöst…", "HTTPS und Antwort werden geprüft…", "Weiterleitungen werden analysiert…", "Sichtbare Signale werden geprüft…", "Vorsichtsindex wird berechnet…"],
    scanCapture: ["Sichtbarer Inhalt wird gelesen…", "Kontext wird klassifiziert…", "Dringlichkeit wird geprüft…", "Links und Daten werden extrahiert…", "Technische Signale werden abgeglichen…"],
    scanText: ["Nachricht wird klassifiziert…", "Druck und Dringlichkeit werden geprüft…", "Identitätsmissbrauch wird geprüft…", "Links werden extrahiert…", "Vorsichtsindex wird berechnet…"],
    report: "Vonu Check Bericht",
    cautionIndex: "Vorsichtsindex",
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
    method: "Methodik",
    privacyMenu: "Datenschutz",
    pricing: "Preise",
    menu: "Menü",
    invalidUrl: "Gib eine gültige URL ein.",
    invalidText: "Füge eine Nachricht oder Text zur Analyse ein.",
    invalidImage: "Lade ein PNG-, JPG- oder WEBP-Bild in angemessener Größe hoch.",
    genericError: "Die Analyse konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    low: "Keine starken Warnungen",
    caution: "Vorsicht",
    high: "Hohes Risiko",
    unknown: "Nicht eindeutig",
    lowSummary: "In dieser ersten Schicht sehen wir keine starken Risikosignale. Das bestätigt jedoch keine Seriosität.",
    cautionSummary: "Einige Signale sollten geprüft werden, bevor du zahlst, antwortest oder Daten teilst.",
    highSummary: "Mehrere relevante Risikosignale wurden gefunden. Wir würden ohne unabhängige Prüfung nicht fortfahren.",
    noCertification: "Vonu erkennt Risikosignale; es bestätigt nicht, dass eine Website, Person oder Nachricht legitim oder betrügerisch ist.",
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
  },
  ar: {
    hero: "اكتشف الاحتيال والتصيد والملفات المزيفة خلال ثوانٍ",
    sub: "حلّل الروابط ولقطات الشاشة والرسائل من ماسح واحد، دون محادثة مسبقة أو تسجيل.",
    engine: "محرك المخاطر نشط",
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
    scanUrl: ["جارٍ التحقق من النطاق…", "جارٍ فحص HTTPS والاستجابة…", "جارٍ مراجعة التحويلات…", "جارٍ تحليل الإشارات الظاهرة…", "جارٍ حساب مؤشر الحذر…"],
    scanCapture: ["جارٍ قراءة المحتوى…", "جارٍ تصنيف السياق…", "جارٍ فحص الاستعجال والانتحال…", "جارٍ استخراج الروابط والبيانات…", "جارٍ مطابقة الإشارات التقنية…"],
    scanText: ["جارٍ تصنيف الرسالة…", "جارٍ فحص الضغط والاستعجال…", "جارٍ فحص الانتحال…", "جارٍ استخراج الروابط…", "جارٍ حساب مؤشر الحذر…"],
    report: "تقرير Vonu Check",
    cautionIndex: "مؤشر الحذر",
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
    method: "المنهجية",
    privacyMenu: "الخصوصية",
    pricing: "الأسعار",
    menu: "القائمة",
    invalidUrl: "أدخل رابطاً صالحاً.",
    invalidText: "الصق رسالة أو نصاً للتحليل.",
    invalidImage: "ارفع صورة PNG أو JPG أو WEBP بحجم مناسب.",
    genericError: "تعذر إكمال التحليل. حاول مرة أخرى.",
    low: "لا توجد إنذارات قوية",
    caution: "الحذر",
    high: "مخاطر عالية",
    unknown: "غير حاسم",
    lowSummary: "لا نرى إشارات خطر قوية في هذه الطبقة الأولى. غياب التنبيهات لا يثبت الشرعية.",
    cautionSummary: "هناك إشارات تستحق التحقق قبل الدفع أو الرد أو مشاركة البيانات.",
    highSummary: "تم العثور على عدة إشارات مهمة للمخاطر. لن نتابع دون تحقق مستقل.",
    noCertification: "يحدد Vonu إشارات المخاطر ولا يشهد بأن الموقع أو الشخص أو الرسالة شرعية أو احتيالية.",
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
  },
};

function VonuMark() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 shadow-[0_0_28px_rgba(52,211,153,0.10)]" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
        <path d="M20 3.8 33.8 11v18L20 36.2 6.2 29V11L20 3.8Z" stroke="rgb(110 231 183)" strokeWidth="2" />
        <path d="m12.7 14.2 7.3 13 7.3-13" stroke="rgb(110 231 183)" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Icon({ mode }: { mode: Mode }) {
  if (mode === "url") {
    return <span aria-hidden="true" className="text-[18px]">◎</span>;
  }
  if (mode === "capture") {
    return <span aria-hidden="true" className="text-[17px]">▣</span>;
  }
  return <span aria-hidden="true" className="text-[18px]">≡</span>;
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
  const [mobileMenu, setMobileMenu] = useState(false);
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

  function changeLocale(next: string) {
    if (supportedLocales.includes(next as SupportedLocale)) {
      window.location.href = `/${next}/check`;
    }
  }

  const steps = mode === "url" ? t.scanUrl : mode === "capture" ? t.scanCapture : t.scanText;
  const activeStep = steps[scanIndex % steps.length];

  const risk = result?.risk;
  const styles = risk ? riskStyles(risk.level) : riskStyles("unknown");
  const riskLabel = risk
    ? risk.level === "high"
      ? t.high
      : risk.level === "caution"
        ? t.caution
        : risk.level === "low"
          ? t.low
          : t.unknown
    : t.unknown;

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
          : t.lowSummary
      : result.summary;

  return (
    <div
      dir={dir}
      onPaste={handlePaste}
      className="min-h-dvh bg-[#0d101b] text-slate-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 35%, rgba(16,185,129,.085), transparent 28%), radial-gradient(circle at 86% 70%, rgba(56,189,248,.05), transparent 28%), linear-gradient(180deg,#0b0e17 0%,#111523 100%)",
      }}
    >
      <header className="border-b border-white/[0.08] bg-[#0b0e17]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}/check`} className="flex items-center gap-3" aria-label="Vonu">
            <VonuMark />
            <span className="text-[22px] font-bold tracking-[-0.045em] text-white">VONU</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[14px] font-medium text-slate-300 md:flex">
            <Link href="/como-funciona" className="transition hover:text-white">{t.method}</Link>
            <Link href="/precios" className="transition hover:text-white">{t.pricing}</Link>
            <Link href="/legal/privacidad" className="transition hover:text-white">{t.privacyMenu}</Link>
            <select
              value={locale}
              onChange={(event) => changeLocale(event.target.value)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 outline-none"
              aria-label="Language"
            >
              {supportedLocales.map((item) => (
                <option key={item} value={item} className="bg-[#111523]">{localeMeta[item].label}</option>
              ))}
            </select>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenu((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white md:hidden"
            aria-label={t.menu}
            aria-expanded={mobileMenu}
          >
            <span className="text-xl leading-none">{mobileMenu ? "×" : "☰"}</span>
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-white/[0.08] bg-[#0b0e17] px-4 py-4 md:hidden">
            <div className="mx-auto grid max-w-[1320px] gap-2 text-sm text-slate-300">
              <Link href="/como-funciona" className="rounded-xl px-3 py-3 hover:bg-white/[0.04]">{t.method}</Link>
              <Link href="/precios" className="rounded-xl px-3 py-3 hover:bg-white/[0.04]">{t.pricing}</Link>
              <Link href="/legal/privacidad" className="rounded-xl px-3 py-3 hover:bg-white/[0.04]">{t.privacyMenu}</Link>
              <select
                value={locale}
                onChange={(event) => changeLocale(event.target.value)}
                className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-slate-200 outline-none"
              >
                {supportedLocales.map((item) => (
                  <option key={item} value={item} className="bg-[#111523]">{localeMeta[item].label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {!result && !loading && (
        <main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-[1080px] flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <section className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.75)]" />
              {t.engine}
            </div>
            <h1 className="mx-auto mt-6 max-w-[920px] text-balance text-[38px] font-bold leading-[1.03] tracking-[-0.055em] text-white sm:text-[54px] lg:text-[62px]">
              {t.hero}
            </h1>
            <p className="mx-auto mt-4 max-w-[720px] text-[16px] leading-7 text-slate-400 sm:text-[18px]">
              {t.sub}
            </p>
          </section>

          <section className="mx-auto mt-8 w-full max-w-[860px] overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#141927]/95 shadow-[0_28px_80px_rgba(0,0,0,.35)]">
            <div className="grid grid-cols-3 border-b border-white/[0.08] bg-black/10">
              {(["url", "capture", "text"] as Mode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => switchMode(item)}
                  className={[
                    "relative flex items-center justify-center gap-2 px-3 py-4 text-[13px] font-semibold transition sm:text-[14px]",
                    mode === item ? "text-emerald-300" : "text-slate-400 hover:text-slate-200",
                  ].join(" ")}
                >
                  <Icon mode={item} />
                  <span>{item === "url" ? t.url : item === "capture" ? t.capture : t.text}</span>
                  {mode === item && <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.65)]" />}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              {mode === "url" && (
                <div className="grid gap-4">
                  <div className="flex min-h-[86px] items-center rounded-2xl border border-white/[0.10] bg-[#0d1220] px-4 transition focus-within:border-emerald-400/40 focus-within:shadow-[0_0_0_3px_rgba(52,211,153,.06)]">
                    <span className="me-3 text-emerald-300">⌕</span>
                    <input
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") void analyze();
                      }}
                      placeholder={t.urlPlaceholder}
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full bg-transparent py-6 text-[16px] text-white outline-none placeholder:text-slate-600 sm:text-[17px]"
                    />
                  </div>
                </div>
              )}

              {mode === "text" && (
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder={t.textPlaceholder}
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-white/[0.10] bg-[#0d1220] p-4 text-[15px] leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:shadow-[0_0_0_3px_rgba(52,211,153,.06)] sm:min-h-[180px] sm:p-5 sm:text-[16px]"
                />
              )}

              {mode === "capture" && (
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    void handleFile(event.dataTransfer.files?.[0] || null);
                  }}
                  className="relative grid min-h-[210px] place-items-center overflow-hidden rounded-2xl border border-dashed border-emerald-400/25 bg-[#0d1220] p-5 text-center transition hover:border-emerald-400/45"
                >
                  {imageData ? (
                    <div className="grid w-full gap-4 sm:grid-cols-[140px_1fr] sm:items-center sm:text-start">
                      <img src={imageData} alt="Preview" className="mx-auto max-h-[150px] max-w-[140px] rounded-xl border border-white/10 object-contain" />
                      <div>
                        <p className="truncate text-[15px] font-semibold text-white">{imageName}</p>
                        <p className="mt-2 text-sm text-slate-400">{t.dropHint}</p>
                        <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/[0.07]">{t.change}</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] text-2xl text-emerald-300">▣</div>
                      <p className="mt-4 text-[17px] font-semibold text-white">{t.dropTitle}</p>
                      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">{t.dropHint}</p>
                      <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/[0.12]">{t.choose}</button>
                      <p className="mt-3 text-xs text-slate-600">{t.pasteImage}</p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => void handleFile(event.target.files?.[0] || null)}
                  />
                </div>
              )}

              {error && <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">{error}</p>}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  <span>● {t.privacy}</span>
                  <span>✓ {t.firstFree}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void analyze()}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_10px_32px_rgba(52,211,153,.18)] transition hover:bg-emerald-300 active:scale-[.99] sm:min-w-[170px]"
                >
                  {t.analyze}
                </button>
              </div>
            </div>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-slate-600">
            <Link href="/legal/aviso-legal" className="hover:text-slate-400">Legal</Link>
            <Link href="/legal/privacidad" className="hover:text-slate-400">{t.privacyMenu}</Link>
            <span>© {new Date().getFullYear()} Vonu</span>
          </div>
        </main>
      )}

      {loading && (
        <main className="mx-auto grid min-h-[calc(100dvh-68px)] max-w-[900px] place-items-center px-4 py-12">
          <section className="w-full rounded-[28px] border border-white/[0.10] bg-[#141927]/90 p-6 text-center shadow-[0_32px_90px_rgba(0,0,0,.38)] sm:p-10">
            <div className="relative mx-auto h-44 w-44">
              <div className="absolute inset-0 rounded-full border border-emerald-400/15" />
              <div className="absolute inset-5 rounded-full border border-emerald-400/20" />
              <div className="absolute inset-10 rounded-full border border-emerald-400/25" />
              <div className="absolute left-1/2 top-1/2 h-px w-[78px] origin-left -translate-y-1/2 bg-gradient-to-r from-emerald-300 to-transparent animate-[spin_1.45s_linear_infinite]" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_22px_rgba(52,211,153,.85)]" />
            </div>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {t.scanning}
            </div>
            <p className="mt-5 min-h-7 text-[16px] text-slate-300 sm:text-[18px]">{activeStep}</p>
            <div className="mx-auto mt-6 flex max-w-sm gap-1.5">
              {steps.map((_, index) => (
                <span key={index} className={[
                  "h-1.5 flex-1 rounded-full transition",
                  index <= scanIndex % steps.length ? "bg-emerald-400" : "bg-white/10",
                ].join(" ")} />
              ))}
            </div>
          </section>
        </main>
      )}

      {result && !loading && risk && (
        <main className="mx-auto max-w-[1080px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.report}</p>
              <p className="mt-2 text-sm text-slate-500">{new Date(result.checkedAt).toLocaleString()}</p>
            </div>
            <button type="button" onClick={reset} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.07]">{t.newCheck}</button>
          </div>

          <section
            className="mt-6 overflow-hidden rounded-[28px] border p-6 sm:p-8"
            style={{ background: styles.bg, borderColor: styles.border }}
          >
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: styles.accent, boxShadow: `0 0 18px ${styles.accent}` }} />
                  <h1 className="text-[30px] font-bold tracking-[-0.04em] text-white sm:text-[40px]">{riskLabel}</h1>
                </div>
                <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-300 sm:text-[16px]">{summary}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">{t.confidence}: {confidenceLabel}</span>
                  {result.version !== "vonu-check-v1" && (
                    <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">{t.context}: {contextLabel(result.kind, locale)}</span>
                  )}
                </div>
              </div>

              <div className="grid h-32 w-32 place-items-center rounded-full border border-white/10 bg-black/20" style={{ boxShadow: `inset 0 0 0 7px ${styles.bg}, 0 0 34px ${styles.bg}` }}>
                <div className="text-center">
                  <div className="text-[38px] font-bold leading-none" style={{ color: styles.accent }}>{risk.score}</div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t.cautionIndex}</div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <section className="rounded-[24px] border border-white/[0.09] bg-[#141927] p-5 sm:p-6">
              <h2 className="text-[18px] font-semibold text-white">{t.evidence}</h2>
              <div className="mt-4 grid gap-3">
                {result.signals.length ? result.signals.map((signal) => (
                  <article key={signal.id} className="rounded-2xl border border-white/[0.07] bg-[#0d1220] p-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot(signal.tone)}`} />
                      <div>
                        <h3 className="text-[14px] font-semibold text-slate-100">{signal.title}</h3>
                        <p className="mt-1.5 text-[13px] leading-6 text-slate-400">{signal.detail}</p>
                      </div>
                    </div>
                  </article>
                )) : <p className="text-sm text-slate-500">—</p>}
              </div>
            </section>

            <div className="grid content-start gap-6">
              {result.version === "vonu-check-v1" ? (
                <section className="rounded-[24px] border border-white/[0.09] bg-[#141927] p-5 sm:p-6">
                  <h2 className="text-[18px] font-semibold text-white">{t.technical}</h2>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3"><dt className="text-slate-500">{t.finalUrl}</dt><dd className="max-w-[60%] truncate text-slate-200">{result.facts.finalUrl}</dd></div>
                    <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3"><dt className="text-slate-500">{t.httpStatus}</dt><dd className="text-slate-200">{result.facts.httpStatus ?? "—"}</dd></div>
                    <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3"><dt className="text-slate-500">{t.redirects}</dt><dd className="text-slate-200">{result.facts.redirects}</dd></div>
                    <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-3"><dt className="text-slate-500">{t.https}</dt><dd className="text-slate-200">{result.facts.usesHttps ? "✓" : "—"}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.forms}</dt><dd className="text-slate-200">{result.facts.formCount}</dd></div>
                  </dl>
                </section>
              ) : (
                <>
                  <section className="rounded-[24px] border border-white/[0.09] bg-[#141927] p-5 sm:p-6">
                    <h2 className="text-[18px] font-semibold text-white">{t.extracted}</h2>
                    <div className="mt-4 grid gap-4 text-sm">
                      {([
                        [t.urls, result.extracted.urls],
                        [t.phones, result.extracted.phones],
                        [t.emails, result.extracted.emails],
                        [t.brands, result.extracted.brands],
                      ] as [string, string[]][]).map(([label, values]) => (
                        <div key={label}>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">{label}</p>
                          <p className="mt-1.5 break-words text-slate-300">{values.length ? values.join(" · ") : "—"}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {result.recommendedActions.length > 0 && (
                    <section className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.05] p-5 sm:p-6">
                      <h2 className="text-[18px] font-semibold text-white">{t.actions}</h2>
                      <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                        {result.recommendedActions.map((action, index) => <li key={`${action}-${index}`} className="flex gap-3"><span className="text-emerald-300">→</span><span>{action}</span></li>)}
                      </ul>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>

          <section className="mt-6 rounded-[20px] border border-white/[0.07] bg-white/[0.025] p-4 text-[12px] leading-6 text-slate-500">
            <p>{t.noCertification}</p>
            {result.limitations?.length > 0 && <p className="mt-2">{t.limitations}: {result.limitations.join(" · ")}</p>}
          </section>
        </main>
      )}
    </div>
  );
}
