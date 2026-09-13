"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { copy, localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { CaptureCheckResult, CaptureKind } from "@/lib/vonu-check/capture-types";
import type { RiskLevel, SignalTone, SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type InputMode = "url" | "capture";

type UiCopy = {
  analyzer: string;
  urlMode: string;
  imageMode: string;
  textMode: string;
  soon: string;
  menu: string;
  method: string;
  privacyMenu: string;
  scanWebTitle: string;
  scanCaptureTitle: string;
  webSteps: string[];
  captureSteps: string[];
  report: string;
  technicalSummary: string;
  confidence: string;
  limited: string;
  medium: string;
  highConfidence: string;
  evidence: string;
  recommendation: string;
  lowAdvice: string;
  cautionAdvice: string;
  highAdvice: string;
  newCheck: string;
  engine: string;
  noHistory: string;
  analyzedUrl: string;
  strongestSignals: string;
  cautionIndex: string;
  chooseScreenshot: string;
  dropScreenshot: string;
  screenshotHint: string;
  analyzeScreenshot: string;
  changeScreenshot: string;
  imageError: string;
  imageTooLarge: string;
  captureSummary: string;
  detectedContext: string;
  extracted: string;
  urls: string;
  phones: string;
  emails: string;
  brands: string;
  actions: string;
  linkedUrl: string;
  linkedUrlChecked: string;
  active: string;
};

const ui: Record<SupportedLocale, UiCopy> = {
  es: {
    analyzer: "ANALIZAR",
    urlMode: "URL o enlace",
    imageMode: "Captura de pantalla",
    textMode: "Mensaje o texto",
    soon: "Próximamente",
    menu: "Menú",
    method: "Metodología",
    privacyMenu: "Privacidad",
    scanWebTitle: "Escaneando señales de riesgo",
    scanCaptureTitle: "Analizando la captura",
    webSteps: [
      "Resolviendo dominio y destino final…",
      "Comprobando HTTPS y respuesta HTTP…",
      "Revisando redirecciones y formularios…",
      "Analizando señales legales y de contacto…",
      "Calculando el índice de precaución…",
    ],
    captureSteps: [
      "Leyendo el contenido visible…",
      "Clasificando el contexto de la captura…",
      "Detectando urgencia, suplantación y señales de fraude…",
      "Extrayendo enlaces, teléfonos y marcas visibles…",
      "Contrastando enlaces visibles cuando es posible…",
    ],
    report: "INFORME VONU CHECK",
    technicalSummary: "Resumen técnico",
    confidence: "Confianza del análisis",
    limited: "Limitada",
    medium: "Media",
    highConfidence: "Alta",
    evidence: "Señales y evidencias",
    recommendation: "Qué haría Vonu",
    lowAdvice: "No vemos señales fuertes de riesgo en esta primera capa. Antes de un pago importante, todavía conviene verificar identidad y reputación.",
    cautionAdvice: "Hay señales que merecen revisión. No pagaríamos todavía sin comprobar mejor quién está detrás.",
    highAdvice: "Hay varias señales relevantes de riesgo. No introduciríamos datos sensibles ni realizaríamos el pago hasta verificarlo por otras vías.",
    newCheck: "Hacer otra comprobación",
    engine: "Motor Vonu Check activo",
    noHistory: "Sin registro · Esta preview no guarda historial",
    analyzedUrl: "Web analizada",
    strongestSignals: "Puntos clave del diagnóstico",
    cautionIndex: "Índice de precaución",
    chooseScreenshot: "Elegir captura",
    dropScreenshot: "Sube una captura de lo que te genera dudas",
    screenshotHint: "SMS, WhatsApp, email, perfil social, vendedor, web o pantalla de pago",
    analyzeScreenshot: "Analizar captura",
    changeScreenshot: "Cambiar imagen",
    imageError: "No hemos podido leer esta imagen. Prueba con PNG, JPG o WEBP.",
    imageTooLarge: "La captura es demasiado grande. Prueba con un pantallazo más corto.",
    captureSummary: "Diagnóstico visual",
    detectedContext: "Contexto detectado",
    extracted: "Datos visibles extraídos",
    urls: "Enlaces",
    phones: "Teléfonos",
    emails: "Emails",
    brands: "Marcas",
    actions: "Siguientes pasos",
    linkedUrl: "Enlace visible comprobado",
    linkedUrlChecked: "Además del análisis visual, Vonu ha podido ejecutar la capa técnica sobre un enlace visible en la captura.",
    active: "Activo",
  },
  en: {
    analyzer: "ANALYZE",
    urlMode: "URL or link",
    imageMode: "Screenshot",
    textMode: "Message or text",
    soon: "Coming soon",
    menu: "Menu",
    method: "Method",
    privacyMenu: "Privacy",
    scanWebTitle: "Scanning risk signals",
    scanCaptureTitle: "Analysing screenshot",
    webSteps: ["Resolving domain and destination…", "Checking HTTPS and HTTP response…", "Reviewing redirects and forms…", "Inspecting legal and contact signals…", "Calculating caution index…"],
    captureSteps: ["Reading visible content…", "Classifying screenshot context…", "Detecting urgency, impersonation and fraud signals…", "Extracting visible links, phones and brands…", "Cross-checking visible links when possible…"],
    report: "VONU CHECK REPORT",
    technicalSummary: "Technical summary",
    confidence: "Analysis confidence",
    limited: "Limited",
    medium: "Medium",
    highConfidence: "High",
    evidence: "Signals and evidence",
    recommendation: "What Vonu would do",
    lowAdvice: "We do not see strong risk signals in this first layer. Before an important payment, identity and reputation should still be verified.",
    cautionAdvice: "Some signals deserve review. We would not pay yet without checking who is behind it.",
    highAdvice: "Several relevant risk signals were found. We would not enter sensitive data or pay until independently verified.",
    newCheck: "Run another check",
    engine: "Vonu Check engine active",
    noHistory: "No account · This preview stores no history",
    analyzedUrl: "Analysed website",
    strongestSignals: "Key diagnostic points",
    cautionIndex: "Caution index",
    chooseScreenshot: "Choose screenshot",
    dropScreenshot: "Upload a screenshot of what worries you",
    screenshotHint: "SMS, WhatsApp, email, social profile, seller, website or payment screen",
    analyzeScreenshot: "Analyse screenshot",
    changeScreenshot: "Change image",
    imageError: "We could not read this image. Try PNG, JPG or WEBP.",
    imageTooLarge: "The screenshot is too large. Try a shorter screenshot.",
    captureSummary: "Visual diagnosis",
    detectedContext: "Detected context",
    extracted: "Visible data extracted",
    urls: "Links",
    phones: "Phones",
    emails: "Emails",
    brands: "Brands",
    actions: "Next steps",
    linkedUrl: "Visible link checked",
    linkedUrlChecked: "In addition to visual analysis, Vonu ran the technical layer on a visible link from the screenshot.",
    active: "Active",
  },
  fr: {
    analyzer: "ANALYSER",
    urlMode: "URL ou lien",
    imageMode: "Capture d’écran",
    textMode: "Message ou texte",
    soon: "Bientôt",
    menu: "Menu",
    method: "Méthode",
    privacyMenu: "Confidentialité",
    scanWebTitle: "Analyse des signaux de risque",
    scanCaptureTitle: "Analyse de la capture",
    webSteps: ["Résolution du domaine…", "Vérification HTTPS et HTTP…", "Analyse des redirections et formulaires…", "Recherche des mentions légales et contacts…", "Calcul de l’indice de prudence…"],
    captureSteps: ["Lecture du contenu visible…", "Classification du contexte…", "Détection de l’urgence et de l’usurpation…", "Extraction des liens, téléphones et marques…", "Vérification des liens visibles si possible…"],
    report: "RAPPORT VONU CHECK",
    technicalSummary: "Résumé technique",
    confidence: "Confiance de l’analyse",
    limited: "Limitée",
    medium: "Moyenne",
    highConfidence: "Élevée",
    evidence: "Signaux et preuves",
    recommendation: "Ce que ferait Vonu",
    lowAdvice: "Nous ne voyons pas de signal fort dans cette première couche. Avant un paiement important, vérifiez tout de même identité et réputation.",
    cautionAdvice: "Certains signaux méritent une vérification. Nous ne paierions pas encore.",
    highAdvice: "Plusieurs signaux importants ont été détectés. Nous ne saisirions aucune donnée sensible et ne paierions pas avant vérification.",
    newCheck: "Faire une autre vérification",
    engine: "Moteur Vonu Check actif",
    noHistory: "Sans compte · Cette preview ne conserve pas l’historique",
    analyzedUrl: "Site analysé",
    strongestSignals: "Points clés du diagnostic",
    cautionIndex: "Indice de prudence",
    chooseScreenshot: "Choisir une capture",
    dropScreenshot: "Importez une capture de ce qui vous inquiète",
    screenshotHint: "SMS, WhatsApp, email, profil social, vendeur, site ou écran de paiement",
    analyzeScreenshot: "Analyser la capture",
    changeScreenshot: "Changer l’image",
    imageError: "Impossible de lire cette image. Essayez PNG, JPG ou WEBP.",
    imageTooLarge: "La capture est trop grande. Essayez une capture plus courte.",
    captureSummary: "Diagnostic visuel",
    detectedContext: "Contexte détecté",
    extracted: "Données visibles extraites",
    urls: "Liens",
    phones: "Téléphones",
    emails: "Emails",
    brands: "Marques",
    actions: "Étapes suivantes",
    linkedUrl: "Lien visible vérifié",
    linkedUrlChecked: "En plus de l’analyse visuelle, Vonu a exécuté la couche technique sur un lien visible dans la capture.",
    active: "Actif",
  },
  de: {
    analyzer: "ANALYSIEREN",
    urlMode: "URL oder Link",
    imageMode: "Screenshot",
    textMode: "Nachricht oder Text",
    soon: "Demnächst",
    menu: "Menü",
    method: "Methodik",
    privacyMenu: "Datenschutz",
    scanWebTitle: "Risikosignale werden geprüft",
    scanCaptureTitle: "Screenshot wird analysiert",
    webSteps: ["Domain und Ziel werden aufgelöst…", "HTTPS und HTTP werden geprüft…", "Weiterleitungen und Formulare werden analysiert…", "Rechtliche Angaben und Kontakt werden geprüft…", "Vorsichtsindex wird berechnet…"],
    captureSteps: ["Sichtbarer Inhalt wird gelesen…", "Screenshot-Kontext wird klassifiziert…", "Dringlichkeit und Identitätsmissbrauch werden geprüft…", "Links, Telefonnummern und Marken werden extrahiert…", "Sichtbare Links werden wenn möglich geprüft…"],
    report: "VONU CHECK BERICHT",
    technicalSummary: "Technische Zusammenfassung",
    confidence: "Analysevertrauen",
    limited: "Begrenzt",
    medium: "Mittel",
    highConfidence: "Hoch",
    evidence: "Signale und Belege",
    recommendation: "Was Vonu tun würde",
    lowAdvice: "In dieser ersten Schicht sehen wir keine starken Risikosignale. Vor größeren Zahlungen sollten Identität und Reputation dennoch geprüft werden.",
    cautionAdvice: "Einige Signale sollten genauer geprüft werden. Wir würden noch nicht zahlen.",
    highAdvice: "Mehrere relevante Risikosignale wurden erkannt. Wir würden keine sensiblen Daten eingeben und nicht zahlen, bevor dies unabhängig geprüft wurde.",
    newCheck: "Weitere Prüfung",
    engine: "Vonu Check Engine aktiv",
    noHistory: "Ohne Konto · Diese Preview speichert keinen Verlauf",
    analyzedUrl: "Analysierte Website",
    strongestSignals: "Wichtigste Diagnosepunkte",
    cautionIndex: "Vorsichtsindex",
    chooseScreenshot: "Screenshot auswählen",
    dropScreenshot: "Lade einen Screenshot von dem hoch, was dir verdächtig vorkommt",
    screenshotHint: "SMS, WhatsApp, E-Mail, Social-Profil, Verkäufer, Website oder Zahlungsseite",
    analyzeScreenshot: "Screenshot analysieren",
    changeScreenshot: "Bild ändern",
    imageError: "Dieses Bild konnte nicht gelesen werden. Versuche PNG, JPG oder WEBP.",
    imageTooLarge: "Der Screenshot ist zu groß. Versuche einen kürzeren Screenshot.",
    captureSummary: "Visuelle Diagnose",
    detectedContext: "Erkannter Kontext",
    extracted: "Extrahierte sichtbare Daten",
    urls: "Links",
    phones: "Telefonnummern",
    emails: "E-Mails",
    brands: "Marken",
    actions: "Nächste Schritte",
    linkedUrl: "Sichtbarer Link geprüft",
    linkedUrlChecked: "Zusätzlich zur visuellen Analyse hat Vonu die technische Ebene für einen sichtbaren Link geprüft.",
    active: "Aktiv",
  },
  ar: {
    analyzer: "تحليل",
    urlMode: "رابط أو URL",
    imageMode: "لقطة شاشة",
    textMode: "رسالة أو نص",
    soon: "قريباً",
    menu: "القائمة",
    method: "المنهجية",
    privacyMenu: "الخصوصية",
    scanWebTitle: "جارٍ فحص إشارات المخاطر",
    scanCaptureTitle: "جارٍ تحليل لقطة الشاشة",
    webSteps: ["جارٍ التحقق من النطاق…", "جارٍ فحص HTTPS وHTTP…", "جارٍ مراجعة التحويلات والنماذج…", "جارٍ تحليل المعلومات القانونية…", "جارٍ حساب مؤشر الحذر…"],
    captureSteps: ["جارٍ قراءة المحتوى الظاهر…", "جارٍ تصنيف سياق الصورة…", "جارٍ فحص الاستعجال والانتحال…", "جارٍ استخراج الروابط والأرقام والعلامات…", "جارٍ فحص الروابط الظاهرة عند الإمكان…"],
    report: "تقرير VONU CHECK",
    technicalSummary: "الملخص التقني",
    confidence: "ثقة التحليل",
    limited: "محدودة",
    medium: "متوسطة",
    highConfidence: "عالية",
    evidence: "الإشارات والأدلة",
    recommendation: "ماذا سيفعل Vonu",
    lowAdvice: "لم نرصد إشارات قوية في هذه الطبقة الأولى، لكن ننصح بالتحقق من الهوية والسمعة قبل أي دفعة مهمة.",
    cautionAdvice: "هناك إشارات تستحق مزيداً من التحقق. لن ندفع بعد.",
    highAdvice: "تم رصد عدة إشارات مهمة للمخاطر. لن ندخل بيانات حساسة أو نجري دفعاً قبل التحقق بشكل مستقل.",
    newCheck: "إجراء فحص آخر",
    engine: "محرك Vonu Check نشط",
    noHistory: "بدون تسجيل · النسخة التجريبية لا تحفظ السجل",
    analyzedUrl: "الموقع الذي تم تحليله",
    strongestSignals: "أهم نقاط التشخيص",
    cautionIndex: "مؤشر الحذر",
    chooseScreenshot: "اختيار لقطة شاشة",
    dropScreenshot: "ارفع لقطة شاشة للشيء الذي يثير شكك",
    screenshotHint: "رسالة SMS أو WhatsApp أو بريد أو ملف اجتماعي أو بائع أو موقع أو شاشة دفع",
    analyzeScreenshot: "تحليل لقطة الشاشة",
    changeScreenshot: "تغيير الصورة",
    imageError: "تعذر قراءة هذه الصورة. جرّب PNG أو JPG أو WEBP.",
    imageTooLarge: "لقطة الشاشة كبيرة جداً. جرّب لقطة أقصر.",
    captureSummary: "التشخيص البصري",
    detectedContext: "السياق المكتشف",
    extracted: "البيانات الظاهرة المستخرجة",
    urls: "الروابط",
    phones: "أرقام الهاتف",
    emails: "البريد الإلكتروني",
    brands: "العلامات",
    actions: "الخطوات التالية",
    linkedUrl: "تم فحص الرابط الظاهر",
    linkedUrlChecked: "بالإضافة إلى التحليل البصري، شغّل Vonu الطبقة التقنية على رابط ظاهر في الصورة.",
    active: "نشط",
  },
};

function riskTheme(level: RiskLevel) {
  if (level === "high") return { accent: "#fb5b67", soft: "rgba(251,91,103,.09)", border: "rgba(251,91,103,.24)" };
  if (level === "caution") return { accent: "#f5b84b", soft: "rgba(245,184,75,.09)", border: "rgba(245,184,75,.24)" };
  if (level === "low") return { accent: "#49d79c", soft: "rgba(73,215,156,.09)", border: "rgba(73,215,156,.24)" };
  return { accent: "#8fa0b3", soft: "rgba(143,160,179,.08)", border: "rgba(143,160,179,.22)" };
}

function signalColors(tone: SignalTone) {
  if (tone === "negative") return { dot: "#fb5b67", bg: "rgba(251,91,103,.05)", border: "rgba(251,91,103,.16)" };
  if (tone === "warning") return { dot: "#f5b84b", bg: "rgba(245,184,75,.05)", border: "rgba(245,184,75,.16)" };
  if (tone === "positive") return { dot: "#49d79c", bg: "rgba(73,215,156,.05)", border: "rgba(73,215,156,.16)" };
  return { dot: "#8fa0b3", bg: "rgba(143,160,179,.04)", border: "rgba(143,160,179,.13)" };
}

function kindLabel(kind: CaptureKind, locale: SupportedLocale) {
  const labels: Record<SupportedLocale, Record<CaptureKind, string>> = {
    es: { message: "Mensaje / chat", email: "Email", social_profile: "Perfil social", marketplace: "Vendedor / marketplace", website_or_checkout: "Web / pago", other: "Otro contenido" },
    en: { message: "Message / chat", email: "Email", social_profile: "Social profile", marketplace: "Seller / marketplace", website_or_checkout: "Website / checkout", other: "Other content" },
    fr: { message: "Message / chat", email: "Email", social_profile: "Profil social", marketplace: "Vendeur / marketplace", website_or_checkout: "Site / paiement", other: "Autre contenu" },
    de: { message: "Nachricht / Chat", email: "E-Mail", social_profile: "Social-Profil", marketplace: "Verkäufer / Marktplatz", website_or_checkout: "Website / Zahlung", other: "Andere Inhalte" },
    ar: { message: "رسالة / محادثة", email: "بريد إلكتروني", social_profile: "ملف اجتماعي", marketplace: "بائع / سوق", website_or_checkout: "موقع / دفع", other: "محتوى آخر" },
  };
  return labels[locale][kind];
}

async function compressScreenshot(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("invalid_image");
  if (file.size > 14 * 1024 * 1024) throw new Error("image_too_large");

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("invalid_image"));
      img.src = objectUrl;
    });

    const maxWidth = 1600;
    const maxHeight = 3200;
    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("invalid_image");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    let dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    if (dataUrl.length > 3_200_000) {
      dataUrl = canvas.toDataURL("image/jpeg", 0.76);
    }
    if (dataUrl.length > 3_450_000) throw new Error("image_too_large");
    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function ExtractedGroup({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="max-w-full break-all rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-xs text-slate-300">{value}</span>
        ))}
      </dd>
    </div>
  );
}

export default function CheckClient({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const x = ui[locale];
  const meta = localeMeta[locale];
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [webResult, setWebResult] = useState<WebCheckResult | null>(null);
  const [captureData, setCaptureData] = useState<string | null>(null);
  const [captureName, setCaptureName] = useState("");
  const [captureResult, setCaptureResult] = useState<CaptureCheckResult | null>(null);
  const [loadingMode, setLoadingMode] = useState<InputMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const activeResult = inputMode === "url" ? webResult : captureResult;
  const activeRisk = activeResult?.risk ?? null;
  const riskLabel = activeRisk ? t[activeRisk.level] : "";
  const theme = riskTheme(activeRisk?.level ?? "unknown");
  const steps = loadingMode === "capture" ? x.captureSteps : x.webSteps;

  useEffect(() => {
    if (!loadingMode) return;
    setScanStep(0);
    const timer = window.setInterval(() => {
      setScanStep((current) => Math.min(current + 1, steps.length - 1));
    }, 650);
    return () => window.clearInterval(timer);
  }, [loadingMode, steps.length]);

  const webRecommendation = useMemo(() => {
    if (!webResult) return "";
    if (webResult.risk.level === "high") return x.highAdvice;
    if (webResult.risk.level === "caution") return x.cautionAdvice;
    return x.lowAdvice;
  }, [webResult, x]);

  const webDiagnosticSignals = webResult
    ? [...webResult.signals].sort((a, b) => b.weight - a.weight).slice(0, 4)
    : [];

  function switchMode(next: InputMode) {
    setInputMode(next);
    setError(null);
    setMenuOpen(false);
  }

  async function submitWeb(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim() || loadingMode) return;
    setLoadingMode("url");
    setError(null);
    setWebResult(null);

    try {
      const response = await fetch("/api/check/web", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, locale }),
      });
      if (!response.ok) throw new Error("check_failed");
      setWebResult((await response.json()) as WebCheckResult);
    } catch {
      setError(t.error);
    } finally {
      setLoadingMode(null);
    }
  }

  async function selectImage(file: File | null) {
    if (!file) return;
    setError(null);
    setCaptureResult(null);
    try {
      const dataUrl = await compressScreenshot(file);
      setCaptureData(dataUrl);
      setCaptureName(file.name || "screenshot.jpg");
      setInputMode("capture");
    } catch (err) {
      setCaptureData(null);
      setCaptureName("");
      setError(err instanceof Error && err.message === "image_too_large" ? x.imageTooLarge : x.imageError);
    }
  }

  async function submitCapture() {
    if (!captureData || loadingMode) return;
    setLoadingMode("capture");
    setError(null);
    setCaptureResult(null);

    try {
      const response = await fetch("/api/check/image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64: captureData, locale }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (response.status === 413 || body?.error === "image_too_large") throw new Error("image_too_large");
        throw new Error("check_failed");
      }
      setCaptureResult((await response.json()) as CaptureCheckResult);
    } catch (err) {
      setError(err instanceof Error && err.message === "image_too_large" ? x.imageTooLarge : t.error);
    } finally {
      setLoadingMode(null);
    }
  }

  function resetAll() {
    setWebResult(null);
    setCaptureResult(null);
    setError(null);
    setScanStep(0);
  }

  const hasExtracted = captureResult
    ? captureResult.extracted.urls.length + captureResult.extracted.phones.length + captureResult.extracted.emails.length + captureResult.extracted.brands.length > 0
    : false;

  return (
    <main dir={meta.dir} className="min-h-screen overflow-hidden bg-[#070a0f] text-[#f5f8fb]">
      <div className="pointer-events-none fixed inset-0 opacity-80" style={{ background: "radial-gradient(circle at 50% 12%, rgba(26,190,132,.12), transparent 30%), radial-gradient(circle at 85% 28%, rgba(44,126,161,.10), transparent 24%)" }} />
      <div className="pointer-events-none fixed inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />

      <header className="relative z-30 border-b border-white/[0.07] bg-[#070a0f]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/${locale}/check`} className="flex items-center gap-2.5 font-black tracking-[-0.04em]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-400/10 text-lg text-emerald-300 shadow-[inset_0_0_18px_rgba(52,211,153,.06)]">V</span>
            <span className="text-xl">VONU</span>
          </Link>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setLanguageOpen((v) => !v); setMenuOpen(false); }}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3 text-xs font-bold text-slate-200 transition hover:bg-white/[0.07]"
              aria-expanded={languageOpen}
            >
              {localeMeta[locale].label}<span className="text-[10px] text-slate-500">⌄</span>
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen((v) => !v); setLanguageOpen(false); }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.07]"
              aria-label={x.menu}
              aria-expanded={menuOpen}
            >
              <span className="text-xl leading-none">☰</span>
            </button>

            {languageOpen && (
              <div className="absolute end-12 top-12 min-w-[150px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c1118] p-1.5 shadow-2xl">
                {supportedLocales.map((item) => (
                  <Link key={item} href={`/${item}/check`} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${item === locale ? "bg-emerald-400/10 text-emerald-300" : "text-slate-300 hover:bg-white/[0.05]"}`}>
                    {localeMeta[item].label}
                  </Link>
                ))}
              </div>
            )}

            {menuOpen && (
              <div className="absolute end-0 top-12 min-w-[190px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c1118] p-1.5 shadow-2xl">
                <button onClick={() => { switchMode("url"); setMenuOpen(false); }} className="block w-full rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">Vonu Check</button>
                <Link href="/como-funciona" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">{x.method}</Link>
                <Link href="/legal/privacidad" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05]">{x.privacyMenu}</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.75)]" />VONU CHECK
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[.95] tracking-[-0.065em] text-white sm:text-7xl">{t.heading}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{t.subheading}</p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2">
            <button onClick={() => switchMode("url")} className={`rounded-2xl border p-3 transition sm:p-4 ${inputMode === "url" ? "border-emerald-300/24 bg-emerald-400/[0.07] text-emerald-200" : "border-white/[0.07] bg-white/[0.025] text-slate-400 hover:bg-white/[0.04]"}`}>
              <div className="text-xl">◎</div><div className="mt-2 text-[11px] font-bold sm:text-xs">{x.urlMode}</div>
            </button>
            <button onClick={() => switchMode("capture")} className={`rounded-2xl border p-3 transition sm:p-4 ${inputMode === "capture" ? "border-emerald-300/24 bg-emerald-400/[0.07] text-emerald-200" : "border-white/[0.07] bg-white/[0.025] text-slate-400 hover:bg-white/[0.04]"}`}>
              <div className="text-xl">▣</div><div className="mt-2 text-[11px] font-bold sm:text-xs">{x.imageMode}</div>
            </button>
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 text-slate-600 sm:p-4">
              <span className="absolute end-2 top-2 rounded-full border border-white/[0.07] px-1.5 py-0.5 text-[8px] font-bold uppercase">{x.soon}</span>
              <div className="text-xl">▤</div><div className="mt-2 text-[11px] font-bold sm:text-xs">{x.textMode}</div>
            </div>
          </div>
        </div>

        {!loadingMode && !webResult && !captureResult && inputMode === "url" && (
          <div className="relative mx-auto mt-6 max-w-3xl">
            <div className="absolute -inset-8 -z-10 rounded-full bg-emerald-400/[0.045] blur-3xl" />
            <form onSubmit={submitWeb} className="group rounded-[28px] border border-emerald-300/15 bg-[#0c1118]/90 p-2 shadow-[0_28px_100px_rgba(0,0,0,.42)] transition focus-within:border-emerald-300/45 focus-within:shadow-[0_0_0_1px_rgba(110,231,183,.12),0_28px_100px_rgba(0,0,0,.48),0_0_42px_rgba(52,211,153,.08)]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-h-16 flex-1 items-center rounded-[21px] border border-white/[0.06] bg-white/[0.035] px-4 transition group-focus-within:bg-white/[0.05]">
                  <span className="me-3 font-mono text-[11px] font-bold tracking-[0.12em] text-emerald-300/80">{x.analyzer}:</span>
                  <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder={t.placeholder} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-slate-600 sm:text-base" />
                </div>
                <button type="submit" disabled={!url.trim()} className="min-h-16 rounded-[21px] bg-emerald-300 px-7 text-sm font-black text-[#07110d] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-[155px]">{t.button}</button>
              </div>
            </form>
          </div>
        )}

        {!loadingMode && !webResult && !captureResult && inputMode === "capture" && (
          <div className="relative mx-auto mt-6 max-w-3xl">
            <div className="absolute -inset-8 -z-10 rounded-full bg-emerald-400/[0.045] blur-3xl" />
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => void selectImage(event.target.files?.[0] ?? null)} />

            {!captureData ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => { event.preventDefault(); setDragging(false); void selectImage(event.dataTransfer.files?.[0] ?? null); }}
                className={`w-full rounded-[30px] border border-dashed bg-[#0c1118]/90 px-6 py-12 text-center shadow-[0_28px_100px_rgba(0,0,0,.38)] transition ${dragging ? "border-emerald-300/60 bg-emerald-400/[0.06]" : "border-emerald-300/22 hover:border-emerald-300/45 hover:bg-white/[0.025]"}`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] text-2xl text-emerald-300">▣</div>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-white">{x.dropScreenshot}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{x.screenshotHint}</p>
                <span className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-emerald-300 px-5 text-sm font-black text-[#07110d]">{x.chooseScreenshot}</span>
              </button>
            ) : (
              <div className="rounded-[30px] border border-emerald-300/18 bg-[#0c1118]/92 p-3 shadow-[0_28px_100px_rgba(0,0,0,.4)] sm:p-5">
                <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-black/30">
                  <img src={captureData} alt={captureName} className="mx-auto max-h-[520px] w-auto max-w-full object-contain" />
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => fileRef.current?.click()} className="min-h-13 flex-1 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-bold text-slate-300 hover:bg-white/[0.06]">{x.changeScreenshot}</button>
                  <button type="button" onClick={() => void submitCapture()} className="min-h-13 flex-[1.4] rounded-xl bg-emerald-300 px-5 text-sm font-black text-[#07110d] hover:bg-emerald-200">{x.analyzeScreenshot}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {!loadingMode && !webResult && !captureResult && (
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span>◉ {t.privacy}</span><span>✓ {t.firstFree}</span></div>
        )}

        {error && !loadingMode && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-5 py-4 text-sm font-medium text-red-200">{error}</div>
        )}

        {loadingMode && (
          <section className="mx-auto mt-8 max-w-3xl rounded-[32px] border border-emerald-300/18 bg-[#0b1117]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,.5)] sm:p-9">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border border-emerald-300/15 bg-emerald-400/[0.025]">
                <div className="absolute inset-[18px] rounded-full border border-emerald-300/10" />
                <div className="absolute inset-[40px] rounded-full border border-emerald-300/10" />
                <div className="absolute left-1/2 top-1/2 h-[1px] w-[78%] origin-left -translate-y-1/2 bg-gradient-to-r from-emerald-300/80 to-transparent animate-spin" style={{ animationDuration: "1.7s" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(110,231,183,.08),transparent_60%)]" />
                <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,.9)]" />
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">{loadingMode === "capture" ? x.scanCaptureTitle : x.scanWebTitle}</p>
              <h2 className="mt-3 min-h-14 text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">{steps[scanStep]}</h2>
              <div className="mt-5 flex gap-1.5">
                {steps.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index <= scanStep ? "w-7 bg-emerald-300" : "w-2 bg-white/10"}`} />)}
              </div>
            </div>
          </section>
        )}

        {webResult && !loadingMode && (
          <section className="mx-auto mt-10 max-w-5xl space-y-5">
            <div className="rounded-[32px] border p-6 sm:p-8" style={{ borderColor: theme.border, background: `linear-gradient(135deg, ${theme.soft}, rgba(12,17,24,.96) 55%)` }}>
              <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-black tracking-[0.2em] text-slate-500">{x.report}</p>
                  <div className="mt-3 flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 20px ${theme.accent}` }} /><h2 className="text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">{riskLabel}</h2></div>
                  <p className="mt-3 break-all text-sm text-slate-400">{webResult.facts.hostname}</p>
                </div>
                <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-black/20 px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{x.cautionIndex}</p><div className="mt-1 text-5xl font-black tracking-[-0.07em]" style={{ color: theme.accent }}>{webResult.risk.score}<span className="text-base text-slate-600">/100</span></div></div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6 sm:p-7"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{x.technicalSummary}</p><h3 className="mt-3 text-xl font-bold text-white">{x.strongestSignals}</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{webDiagnosticSignals.map((item) => { const c = signalColors(item.tone); return <div key={`${item.id}-${item.detail}`} className="rounded-2xl border p-4" style={{ borderColor: c.border, background: c.bg }}><div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} /><div><h4 className="font-bold text-slate-100">{item.title}</h4><p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p></div></div></div>; })}</div></div>
              <aside className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6 sm:p-7"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{x.confidence}</p><p className="mt-2 text-2xl font-black text-white">{webResult.risk.confidence === "medium" ? x.medium : x.limited}</p><dl className="mt-6 space-y-4 text-sm"><div><dt className="font-semibold text-slate-500">HTTP</dt><dd className="mt-1 font-bold text-slate-200">{webResult.facts.httpStatus ?? "—"}</dd></div><div><dt className="font-semibold text-slate-500">HTTPS</dt><dd className="mt-1 font-bold text-slate-200">{webResult.facts.usesHttps ? "✓" : "✕"}</dd></div><div><dt className="font-semibold text-slate-500">{t.redirects}</dt><dd className="mt-1 font-bold text-slate-200">{webResult.facts.redirects}</dd></div></dl></aside>
            </div>

            <div className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6 sm:p-7"><h3 className="text-xl font-bold text-white">{x.evidence}</h3><div className="mt-5 space-y-3">{webResult.signals.map((item) => { const c = signalColors(item.tone); return <article key={`${item.id}-${item.detail}`} className="rounded-2xl border p-4" style={{ borderColor: c.border, background: c.bg }}><div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} /><div><h4 className="font-bold text-slate-100">{item.title}</h4><p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p></div></div></article>; })}</div></div>

            <div className="rounded-[28px] border border-emerald-300/15 bg-emerald-400/[0.045] p-6 sm:p-7"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">{x.recommendation}</p><p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">{webRecommendation}</p></div>
            <button type="button" onClick={() => { resetAll(); setUrl(""); }} className="mx-auto block min-h-12 rounded-xl border border-white/[0.09] bg-white/[0.035] px-5 text-sm font-bold text-slate-300 hover:bg-white/[0.06]">{x.newCheck}</button>
          </section>
        )}

        {captureResult && !loadingMode && (
          <section className="mx-auto mt-10 max-w-5xl space-y-5">
            <div className="rounded-[32px] border p-6 sm:p-8" style={{ borderColor: theme.border, background: `linear-gradient(135deg, ${theme.soft}, rgba(12,17,24,.96) 55%)` }}>
              <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-black tracking-[0.2em] text-slate-500">{x.report}</p>
                  <div className="mt-3 flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 20px ${theme.accent}` }} /><h2 className="text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">{riskLabel}</h2></div>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{captureResult.summary}</p>
                </div>
                <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-black/20 px-5 py-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{x.cautionIndex}</p><div className="mt-1 text-5xl font-black tracking-[-0.07em]" style={{ color: theme.accent }}>{captureResult.risk.score}<span className="text-base text-slate-600">/100</span></div></div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6 sm:p-7"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{x.captureSummary}</p><h3 className="mt-3 text-xl font-bold text-white">{x.evidence}</h3><div className="mt-5 space-y-3">{captureResult.signals.map((item) => { const c = signalColors(item.tone); return <article key={`${item.id}-${item.detail}`} className="rounded-2xl border p-4" style={{ borderColor: c.border, background: c.bg }}><div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: c.dot }} /><div><h4 className="font-bold text-slate-100">{item.title}</h4><p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p></div></div></article>; })}</div></div>

              <aside className="space-y-5">
                <div className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{x.detectedContext}</p><p className="mt-2 text-xl font-black text-white">{kindLabel(captureResult.kind, locale)}</p><div className="mt-5 border-t border-white/[0.07] pt-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{x.confidence}</p><p className="mt-2 text-xl font-black text-white">{captureResult.risk.confidence === "high" ? x.highConfidence : captureResult.risk.confidence === "medium" ? x.medium : x.limited}</p></div></div>

                {hasExtracted && <div className="rounded-[28px] border border-white/[0.08] bg-[#0c1118]/90 p-6"><h3 className="font-bold text-white">{x.extracted}</h3><dl className="mt-5 space-y-5"><ExtractedGroup label={x.urls} values={captureResult.extracted.urls} /><ExtractedGroup label={x.phones} values={captureResult.extracted.phones} /><ExtractedGroup label={x.emails} values={captureResult.extracted.emails} /><ExtractedGroup label={x.brands} values={captureResult.extracted.brands} /></dl></div>}
              </aside>
            </div>

            {captureResult.linkedUrlCheck && (
              <div className="rounded-[28px] border border-cyan-300/15 bg-cyan-300/[0.035] p-6 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">{x.linkedUrl}</p><p className="mt-2 break-all font-bold text-slate-100">{captureResult.linkedUrlCheck.url}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{x.linkedUrlChecked}</p></div><div className="rounded-xl border border-cyan-300/15 bg-black/20 px-4 py-3 text-center"><div className="text-2xl font-black text-cyan-200">{captureResult.linkedUrlCheck.risk.score}<span className="text-xs text-slate-600">/100</span></div></div></div></div>
            )}

            {!!captureResult.recommendedActions.length && (
              <div className="rounded-[28px] border border-emerald-300/15 bg-emerald-400/[0.045] p-6 sm:p-7"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">{x.actions}</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{captureResult.recommendedActions.map((action, index) => <div key={`${index}-${action}`} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-black/10 p-4"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300/10 text-xs font-black text-emerald-300">{index + 1}</span><p className="text-sm leading-6 text-slate-300">{action}</p></div>)}</div></div>
            )}

            <div className="flex flex-col justify-center gap-2 sm:flex-row"><button type="button" onClick={() => { resetAll(); setCaptureData(null); setCaptureName(""); }} className="min-h-12 rounded-xl border border-white/[0.09] bg-white/[0.035] px-5 text-sm font-bold text-slate-300 hover:bg-white/[0.06]">{x.newCheck}</button><button type="button" onClick={() => fileRef.current?.click()} className="min-h-12 rounded-xl border border-emerald-300/16 bg-emerald-400/[0.05] px-5 text-sm font-bold text-emerald-200 hover:bg-emerald-400/[0.08]">{x.changeScreenshot}</button></div>
          </section>
        )}

        <footer className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-6 text-[11px] font-medium text-slate-600"><span>● {x.engine}</span><span>{x.noHistory}</span></footer>
      </section>
    </main>
  );
}
