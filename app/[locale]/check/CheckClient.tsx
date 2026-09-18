"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";
import { localeMeta } from "@/lib/vonu-check/i18n";
import { friendlyHttpStatus, humanizeLimitation, humanizeWebSignal } from "@/lib/vonu-check/presentation";
import { riskBandFromScore } from "@/lib/vonu-check/risk-score";
import type { CaptureCheckResult } from "@/lib/vonu-check/capture-types";
import type { TextCheckResult } from "@/lib/vonu-check/text-types";
import type { RiskBand, RiskLevel, SignalTone, SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type Mode = "url" | "capture" | "text";
type Result = WebCheckResult | CaptureCheckResult | TextCheckResult;

type EntitlementSnapshot = {
  freeUsed: boolean;
  creditsRemaining: number;
  lifetimeAnalyses: number;
};

const BALANCE_COPY: Record<SupportedLocale, {
  checking: string;
  freeAvailable: string;
  freeUsed: string;
  creditsAvailable: (count: number) => string;
}> = {
  es: {
    checking: "Comprobando análisis disponibles…",
    freeAvailable: "1 análisis gratuito disponible",
    freeUsed: "Análisis gratuito utilizado",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "análisis disponible" : "análisis disponibles"}`,
  },
  en: {
    checking: "Checking available analyses…",
    freeAvailable: "1 free analysis available",
    freeUsed: "Free analysis used",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analysis available" : "analyses available"}`,
  },
  fr: {
    checking: "Vérification des analyses disponibles…",
    freeAvailable: "1 analyse gratuite disponible",
    freeUsed: "Analyse gratuite utilisée",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analyse disponible" : "analyses disponibles"}`,
  },
  de: {
    checking: "Verfügbare Analysen werden geprüft…",
    freeAvailable: "1 kostenlose Analyse verfügbar",
    freeUsed: "Kostenlose Analyse genutzt",
    creditsAvailable: (count) => `${count}/3 Analysen verfügbar`,
  },
  ar: {
    checking: "جارٍ التحقق من التحليلات المتاحة…",
    freeAvailable: "تحليل مجاني واحد متاح",
    freeUsed: "تم استخدام التحليل المجاني",
    creditsAvailable: (count) => `${count}/3 تحليلات متاحة`,
  },
};

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
    scanUrl: ["Comprobando a qué página lleva…", "Revisando si la conexión es segura…", "Comprobando cambios de dirección…", "Buscando señales sospechosas…", "Calculando el nivel de riesgo…"],
    scanCapture: ["Leyendo el contenido visible…", "Entendiendo qué aparece en la imagen…", "Buscando presión, urgencia o suplantación…", "Revisando enlaces y datos visibles…", "Calculando el nivel de riesgo…"],
    scanText: ["Entendiendo el mensaje…", "Buscando presión o urgencia…", "Comprobando posibles suplantaciones…", "Revisando enlaces y contactos…", "Calculando el nivel de riesgo…"],
    report: "Resultado del análisis",
    cautionIndex: "Nivel de riesgo",
    confidence: "Fiabilidad del análisis",
    limited: "Limitada",
    medium: "Media",
    highConfidence: "Alta",
    evidence: "Qué hemos encontrado",
    technical: "Qué hemos comprobado",
    extracted: "Datos detectados",
    actions: "Qué hacer ahora",
    limitations: "Qué no hemos podido comprobar",
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
    lowSummary: "No hemos encontrado señales importantes de riesgo con las comprobaciones realizadas. Aun así, ninguna comprobación puede garantizar al 100 % que una web sea legítima.",
    cautionSummary: "Hemos encontrado algunos indicios que conviene revisar antes de pagar, responder o compartir datos personales.",
    highSummary: "Hemos encontrado varias señales preocupantes. No continúes sin confirmar por otra vía que la web o la persona son realmente quienes dicen ser.",
    noCertification: "La puntuación resume las señales detectadas. No representa la probabilidad exacta de que sea una estafa ni garantiza que una web sea segura.",
    finalUrl: "Página final",
    httpStatus: "Respuesta de la web",
    redirects: "Cambios de dirección",
    https: "Conexión cifrada",
    forms: "Formularios encontrados",
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
    scanUrl: ["Checking where the link leads…", "Checking whether the connection is secure…", "Reviewing changes of destination…", "Looking for suspicious signs…", "Calculating the risk level…"],
    scanCapture: ["Reading visible content…", "Understanding what is shown…", "Looking for pressure, urgency or impersonation…", "Reviewing visible links and details…", "Calculating the risk level…"],
    scanText: ["Understanding the message…", "Looking for pressure or urgency…", "Checking for impersonation…", "Reviewing links and contacts…", "Calculating the risk level…"],
    report: "Analysis result",
    cautionIndex: "Risk level",
    confidence: "Analysis reliability",
    limited: "Limited",
    medium: "Medium",
    highConfidence: "High",
    evidence: "What we found",
    technical: "What we checked",
    extracted: "Detected data",
    actions: "What to do now",
    limitations: "What we could not check",
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
    lowSummary: "We did not find major risk signs in the checks we were able to perform. Even so, no check can guarantee that a website is legitimate.",
    cautionSummary: "We found some signs worth checking before paying, replying or sharing personal information.",
    highSummary: "We found several worrying signs. Do not continue until you independently confirm that the site or person is really who they claim to be.",
    noCertification: "The score summarises the signs we detected. It is not the exact probability of fraud and does not guarantee that a website is safe.",
    finalUrl: "Final page",
    httpStatus: "Website response",
    redirects: "Changes of destination",
    https: "Encrypted connection",
    forms: "Forms found",
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
    scanUrl: ["Vérification de la destination du lien…", "Vérification de la sécurité de la connexion…", "Analyse des changements de destination…", "Recherche de signes suspects…", "Calcul du niveau de risque…"],
    scanCapture: ["Lecture du contenu visible…", "Compréhension de l’image…", "Recherche de pression, urgence ou usurpation…", "Vérification des liens et données visibles…", "Calcul du niveau de risque…"],
    scanText: ["Compréhension du message…", "Recherche de pression ou d’urgence…", "Vérification d’une éventuelle usurpation…", "Vérification des liens et contacts…", "Calcul du niveau de risque…"],
    report: "Résultat de l’analyse",
    cautionIndex: "Niveau de risque",
    confidence: "Fiabilité de l’analyse",
    limited: "Limitée",
    medium: "Moyenne",
    highConfidence: "Élevée",
    evidence: "Ce que nous avons trouvé",
    technical: "Ce que nous avons vérifié",
    extracted: "Données détectées",
    actions: "Que faire maintenant",
    limitations: "Ce que nous n’avons pas pu vérifier",
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
    lowSummary: "Nous n’avons pas trouvé de signal de risque important dans les vérifications effectuées. Aucune vérification ne peut toutefois garantir qu’un site est légitime.",
    cautionSummary: "Nous avons trouvé quelques éléments à vérifier avant de payer, répondre ou partager des données personnelles.",
    highSummary: "Nous avons trouvé plusieurs signaux préoccupants. Ne continuez pas sans confirmer par une autre voie que le site ou la personne est bien qui il prétend être.",
    noCertification: "Le score résume les signaux détectés. Il ne représente pas la probabilité exacte d’une fraude et ne garantit pas qu’un site est sûr.",
    finalUrl: "Page finale",
    httpStatus: "Réponse du site",
    redirects: "Changements de destination",
    https: "Connexion chiffrée",
    forms: "Formulaires trouvés",
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
    scanUrl: ["Prüfen, wohin der Link führt…", "Prüfen, ob die Verbindung sicher ist…", "Prüfen von Zielwechseln…", "Suchen nach verdächtigen Hinweisen…", "Berechnen des Risikoniveaus…"],
    scanCapture: ["Sichtbaren Inhalt lesen…", "Bildinhalt verstehen…", "Nach Druck, Dringlichkeit oder Identitätsmissbrauch suchen…", "Sichtbare Links und Daten prüfen…", "Risikostufe berechnen…"],
    scanText: ["Nachricht verstehen…", "Nach Druck oder Dringlichkeit suchen…", "Auf Identitätsmissbrauch prüfen…", "Links und Kontakte prüfen…", "Risikostufe berechnen…"],
    report: "Analyseergebnis",
    cautionIndex: "Risikostufe",
    confidence: "Zuverlässigkeit der Analyse",
    limited: "Begrenzt",
    medium: "Mittel",
    highConfidence: "Hoch",
    evidence: "Was wir gefunden haben",
    technical: "Was wir geprüft haben",
    extracted: "Erkannte Daten",
    actions: "Was jetzt zu tun ist",
    limitations: "Was wir nicht prüfen konnten",
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
    lowSummary: "Bei den durchgeführten Prüfungen haben wir keine wichtigen Risikosignale gefunden. Keine Prüfung kann jedoch garantieren, dass eine Website seriös ist.",
    cautionSummary: "Wir haben einige Hinweise gefunden, die du vor einer Zahlung, Antwort oder Weitergabe persönlicher Daten prüfen solltest.",
    highSummary: "Wir haben mehrere besorgniserregende Hinweise gefunden. Fahre erst fort, wenn du unabhängig bestätigt hast, dass Website oder Person wirklich die behauptete Identität haben.",
    noCertification: "Der Wert fasst die erkannten Hinweise zusammen. Er ist nicht die genaue Betrugswahrscheinlichkeit und garantiert nicht, dass eine Website sicher ist.",
    finalUrl: "Endseite",
    httpStatus: "Antwort der Website",
    redirects: "Zielwechsel",
    https: "Verschlüsselte Verbindung",
    forms: "Gefundene Formulare",
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
    scanUrl: ["جارٍ التحقق من وجهة الرابط…", "جارٍ التحقق من أمان الاتصال…", "جارٍ مراجعة تغيّر الوجهة…", "جارٍ البحث عن إشارات مريبة…", "جارٍ حساب مستوى المخاطر…"],
    scanCapture: ["جارٍ قراءة المحتوى الظاهر…", "جارٍ فهم محتوى الصورة…", "جارٍ البحث عن الضغط أو الاستعجال أو الانتحال…", "جارٍ مراجعة الروابط والبيانات الظاهرة…", "جارٍ حساب مستوى المخاطر…"],
    scanText: ["جارٍ فهم الرسالة…", "جارٍ البحث عن الضغط أو الاستعجال…", "جارٍ التحقق من الانتحال…", "جارٍ مراجعة الروابط وبيانات الاتصال…", "جارٍ حساب مستوى المخاطر…"],
    report: "نتيجة التحليل",
    cautionIndex: "مستوى المخاطر",
    confidence: "موثوقية التحليل",
    limited: "محدودة",
    medium: "متوسطة",
    highConfidence: "عالية",
    evidence: "ما الذي وجدناه",
    technical: "ما الذي تحققنا منه",
    extracted: "البيانات المكتشفة",
    actions: "ماذا تفعل الآن",
    limitations: "ما الذي لم نتمكن من التحقق منه",
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
    lowSummary: "لم نجد إشارات خطر مهمة في الفحوصات التي أجريناها. ومع ذلك لا يمكن لأي فحص أن يضمن أن الموقع شرعي بنسبة 100٪.",
    cautionSummary: "وجدنا بعض الإشارات التي تستحق التحقق قبل الدفع أو الرد أو مشاركة البيانات الشخصية.",
    highSummary: "وجدنا عدة إشارات مقلقة. لا تتابع قبل أن تؤكد بشكل مستقل أن الموقع أو الشخص هو فعلاً من يدّعي أنه.",
    noCertification: "تلخص الدرجة الإشارات التي اكتشفناها. وهي ليست الاحتمال الدقيق للاحتيال ولا تضمن أن الموقع آمن.",
    finalUrl: "الصفحة النهائية",
    httpStatus: "استجابة الموقع",
    redirects: "تغيّر الوجهة",
    https: "اتصال مشفّر",
    forms: "النماذج الموجودة",
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
  es: "No hemos podido revisar suficiente contenido para dar una conclusión fiable. Esto no significa que sea una estafa: algunas webs bloquean las comprobaciones automáticas.",
  en: "We could not review enough content to give a reliable conclusion. This does not mean the site is a scam: some websites block automated checks.",
  fr: "Nous n’avons pas pu examiner assez de contenu pour donner une conclusion fiable. Cela ne signifie pas qu’il s’agit d’une arnaque : certains sites bloquent les vérifications automatiques.",
  de: "Wir konnten nicht genug Inhalt prüfen, um eine verlässliche Schlussfolgerung zu geben. Das bedeutet nicht, dass die Website betrügerisch ist: Manche Seiten blockieren automatische Prüfungen.",
  ar: "لم نتمكن من مراجعة محتوى كافٍ لإعطاء نتيجة موثوقة. هذا لا يعني أن الموقع احتيالي؛ فبعض المواقع تمنع الفحوصات الآلية.",
};

const subjectCopy: Record<SupportedLocale, { analysed: string; url: string; capture: string; text: string }> = {
  es: { analysed: "Analizado", url: "Enlace analizado", capture: "Captura analizada", text: "Mensaje analizado" },
  en: { analysed: "Analysed", url: "Analysed link", capture: "Analysed screenshot", text: "Analysed message" },
  fr: { analysed: "Analysé", url: "Lien analysé", capture: "Capture analysée", text: "Message analysé" },
  de: { analysed: "Analysiert", url: "Analysierter Link", capture: "Analysierter Screenshot", text: "Analysierte Nachricht" },
  ar: { analysed: "تم التحليل", url: "الرابط الذي تم تحليله", capture: "لقطة الشاشة التي تم تحليلها", text: "الرسالة التي تم تحليلها" },
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

function yesNoLabel(locale: SupportedLocale, value: boolean) {
  const labels: Record<SupportedLocale, [string, string]> = {
    es: ["Sí", "No"],
    en: ["Yes", "No"],
    fr: ["Oui", "Non"],
    de: ["Ja", "Nein"],
    ar: ["نعم", "لا"],
  };
  return value ? labels[locale][0] : labels[locale][1];
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
  const [entitlement, setEntitlement] = useState<EntitlementSnapshot | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onEntitlement(event: Event) {
      const detail = (event as CustomEvent<EntitlementSnapshot>).detail;
      if (!detail) return;
      setEntitlement({
        freeUsed: Boolean(detail.freeUsed),
        creditsRemaining: Math.max(0, Number(detail.creditsRemaining || 0)),
        lifetimeAnalyses: Math.max(0, Number(detail.lifetimeAnalyses || 0)),
      });
    }

    window.addEventListener("vonu:entitlement", onEntitlement as EventListener);
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("vonu:entitlement:request"));
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("vonu:entitlement", onEntitlement as EventListener);
    };
  }, []);


  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => setScanIndex((value) => value + 1), 760);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = localeMeta[locale].htmlLang;
  }, [dir, locale]);

  const balanceText = (() => {
    const labels = BALANCE_COPY[locale];
    if (!entitlement) return labels.checking;
    if (!entitlement.freeUsed && entitlement.creditsRemaining <= 0) return labels.freeAvailable;
    if (entitlement.creditsRemaining > 0) return labels.creditsAvailable(entitlement.creditsRemaining);
    if (entitlement.lifetimeAnalyses >= 4) return labels.creditsAvailable(0);
    return labels.freeUsed;
  })();

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
      <section className="mb-5 flex min-w-0 items-center gap-3 overflow-hidden rounded-[18px] border border-white/[0.075] bg-[#111725]/88 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,.18)]">
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
        "flex min-h-dvh w-full max-w-[100vw] overflow-x-hidden flex-col bg-[#0d101b] text-slate-100",
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
                        <div className="min-w-0">
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
                    <span data-vonu-entitlement-status="true">{balanceText}</span>
                  </div>
                  <button data-vonu-analyze-cta="true" type="button" onClick={() => void analyze()} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:bg-emerald-300 active:scale-[.99] sm:min-w-[160px]">{t.analyze}</button>
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
        <main className="mx-auto grid min-h-[calc(100dvh-68px)] w-full min-w-0 max-w-[900px] place-items-center overflow-x-hidden px-4 py-8 sm:py-10">
          <section className="w-full min-w-0 max-w-full overflow-hidden">
            <SubjectCard />
            <div className="w-full min-w-0 overflow-hidden rounded-[26px] bg-[#141927]/86 p-5 text-center shadow-[0_30px_80px_rgba(0,0,0,.34)] ring-1 ring-white/[0.08] sm:p-9">
              <div className="relative mx-auto h-40 w-40 max-h-[44vw] max-w-[44vw]">
                <div className="absolute inset-0 rounded-full border border-emerald-400/15" />
                <div className="absolute inset-5 rounded-full border border-emerald-400/20" />
                <div className="absolute inset-10 rounded-full border border-emerald-400/25" />
                <div className="absolute left-1/2 top-1/2 h-px w-[45%] origin-left -translate-y-1/2 bg-gradient-to-r from-emerald-300 to-transparent animate-[spin_1.45s_linear_infinite]" />
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_22px_rgba(52,211,153,.85)]" />
              </div>
              <h2 className="mt-6 text-[22px] font-bold tracking-[-0.035em] text-white sm:text-[24px]">{t.scanning}</h2>
              <p className="mx-auto mt-3 min-h-6 max-w-full break-words px-1 text-sm text-emerald-200/85">{activeStep}</p>
              <div className="mx-auto mt-6 h-1 max-w-sm overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-1/2 animate-[pulse_1.1s_ease-in-out_infinite] rounded-full bg-emerald-400" /></div>
            </div>
          </section>
        </main>
      )}

      {result && (
        <main className="mx-auto w-full min-w-0 max-w-[1080px] flex-1 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
          <SubjectCard completed />

          <section className="rounded-[28px] p-5 shadow-[0_30px_90px_rgba(0,0,0,.35)] ring-1 sm:p-8" style={{ background: `linear-gradient(180deg, ${styles.bg}, rgba(20,25,39,.94))`, borderColor: styles.border }}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{t.report}</p>
                <h1 className="mt-3 text-[34px] font-bold tracking-[-0.05em] sm:text-[48px]" style={{ color: styles.accent }}>{riskLabel}</h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">{summary}</p>
              </div>
              <div className="flex min-w-0 sm:min-w-[220px] items-center gap-4 rounded-2xl bg-black/15 p-4 ring-1 ring-white/[0.07]">
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

          <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <section className="min-w-0 rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08] sm:p-6">
              <h2 className="text-[17px] font-bold text-white">{t.evidence}</h2>
              <div className="mt-4 grid min-w-0 gap-3">
                {result.signals.map((signal) => {
                  const displaySignal = result.version === "vonu-check-v1" ? humanizeWebSignal(locale, signal) : signal;
                  return (
                    <div key={signal.id} className="min-w-0 rounded-2xl bg-black/10 p-4 ring-1 ring-white/[0.055]">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneDot(displaySignal.tone)}`} />
                        <div className="min-w-0"><h3 className="text-[14px] font-semibold text-white">{displaySignal.title}</h3><p className="mt-1 break-words text-[13px] leading-6 text-slate-400 [overflow-wrap:anywhere]">{displaySignal.detail}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid min-w-0 content-start gap-5">
              {result.version === "vonu-check-v1" ? (
                <section className="min-w-0 rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
                  <h2 className="text-[17px] font-bold text-white">{t.technical}</h2>
                  <dl className="mt-4 grid min-w-0 gap-3 text-[13px]">
                    <div className="flex min-w-0 justify-between gap-4"><dt className="shrink-0 text-slate-500">{t.finalUrl}</dt><dd className="min-w-0 max-w-[220px] truncate text-slate-300">{result.facts.finalUrl}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.httpStatus}</dt><dd className="text-slate-300">{friendlyHttpStatus(locale, result.facts.httpStatus)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.redirects}</dt><dd className="text-slate-300">{result.facts.redirects}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.https}</dt><dd className="text-slate-300">{yesNoLabel(locale, result.facts.usesHttps)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">{t.forms}</dt><dd className="text-slate-300">{result.facts.formCount}</dd></div>
                  </dl>
                </section>
              ) : (
                <>
                  <section className="min-w-0 rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
                    <h2 className="text-[17px] font-bold text-white">{t.extracted}</h2>
                    {result.version === "vonu-capture-v1" && <p className="mt-3 text-[13px] text-slate-400">{t.context}: <span className="text-slate-200">{contextLabel(result.kind, locale)}</span></p>}
                    <div className="mt-3 grid min-w-0 gap-2 text-[12px] text-slate-400 [overflow-wrap:anywhere]">
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
            <section className="mt-5 min-w-0 rounded-[22px] bg-white/[0.025] p-5 ring-1 ring-white/[0.06]">
              <h2 className="text-[14px] font-semibold text-slate-300">{t.limitations}</h2>
              <ul className="mt-2 grid gap-1.5 text-[12px] leading-5 text-slate-500">{result.limitations.map((item, index) => <li className="break-words [overflow-wrap:anywhere]" key={`${item}-${index}`}>• {humanizeLimitation(locale, item)}</li>)}</ul>
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
