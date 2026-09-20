"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";
import { localeMeta } from "@/lib/vonu-check/i18n";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import { legalPath } from "@/lib/vonu-legal/routes";
import { friendlyHttpStatus, humanizeLimitation, humanizeWebSignal } from "@/lib/vonu-check/presentation";
import { riskBandFromScore } from "@/lib/vonu-check/risk-score";
import type { CaptureCheckResult } from "@/lib/vonu-check/capture-types";
import type { TextCheckResult } from "@/lib/vonu-check/text-types";
import type { DocumentCheckResult, DocumentKind } from "@/lib/vonu-check/document-types";
import type { RiskBand, RiskLevel, SignalTone, SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type Mode = "url" | "capture" | "text" | "document";
type Result = WebCheckResult | CaptureCheckResult | TextCheckResult | DocumentCheckResult;

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
  aiNotice: string;
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
    sub: "Analiza URLs, capturas de pantalla, mensajes y documentos desde un único escáner.",
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
    aiNotice: "Vonu utiliza IA y comprobaciones automatizadas. Puede equivocarse y el resultado no es un veredicto.",
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
    sub: "Analyse URLs, screenshots, messages and documents from one scanner.",
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
    aiNotice: "Vonu uses AI and automated checks. It can make mistakes and the result is not a verdict.",
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
    sub: "Analysez URLs, captures d’écran, messages et documents depuis un seul scanner.",
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
    aiNotice: "Vonu utilise l’IA et des vérifications automatisées. Il peut se tromper et le résultat n’est pas un verdict.",
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
    sub: "Analysiere URLs, Screenshots, Nachrichten und Dokumente mit einem Scanner.",
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
    aiNotice: "Vonu nutzt KI und automatisierte Prüfungen. Fehler sind möglich; das Ergebnis ist kein Urteil.",
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
    sub: "حلّل الروابط ولقطات الشاشة والرسائل والمستندات من ماسح واحد.",
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
    aiNotice: "يستخدم Vonu الذكاء الاصطناعي وفحوصاً آلية. قد يخطئ والنتيجة ليست حكماً نهائياً.",
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

const DOCUMENT_UI: Record<SupportedLocale, {
  label: string;
  dropTitle: string;
  dropHint: string;
  choose: string;
  change: string;
  invalid: string;
  unreadable: string;
  scan: string[];
  type: string;
  pages: string;
  parties: string;
  amounts: string;
  dates: string;
  payment: string;
  clauses: string;
  reviewLevel: string;
  keyData: string;
  disclaimer: string;
}> = {
  es: {
    label: "Documento",
    dropTitle: "Sube un documento PDF",
    dropHint: "Facturas, presupuestos, contratos, alquileres, servicios o financiación",
    choose: "Elegir PDF",
    change: "Cambiar PDF",
    invalid: "Sube un PDF válido de hasta 8 MB.",
    unreadable: "No hemos podido leer texto suficiente en este PDF. Si es un escaneado, de momento prueba con capturas de sus páginas.",
    scan: ["Leyendo el documento…", "Identificando el tipo de documento…", "Extrayendo importes, fechas y partes…", "Revisando condiciones y cláusulas…", "Calculando el nivel de cautela…"],
    type: "Tipo de documento",
    pages: "Páginas",
    parties: "Partes",
    amounts: "Importes",
    dates: "Fechas",
    payment: "Pago",
    clauses: "Cláusulas clave",
    reviewLevel: "Nivel de revisión",
    keyData: "Datos clave del documento",
    disclaimer: "La puntuación resume puntos que conviene revisar. No certifica la autenticidad del documento, su validez legal ni que los datos reflejen una operación real.",
  },
  en: {
    label: "Document",
    dropTitle: "Upload a PDF document",
    dropHint: "Invoices, quotes, contracts, rentals, services or financing",
    choose: "Choose PDF",
    change: "Change PDF",
    invalid: "Upload a valid PDF up to 8 MB.",
    unreadable: "We could not read enough text from this PDF. If it is a scanned document, try screenshots of its pages for now.",
    scan: ["Reading the document…", "Identifying the document type…", "Extracting amounts, dates and parties…", "Reviewing terms and clauses…", "Calculating the caution level…"],
    type: "Document type",
    pages: "Pages",
    parties: "Parties",
    amounts: "Amounts",
    dates: "Dates",
    payment: "Payment",
    clauses: "Key clauses",
    reviewLevel: "Review level",
    keyData: "Key document details",
    disclaimer: "The score summarises points worth reviewing. It does not certify document authenticity, legal validity or that the data reflects a real transaction.",
  },
  fr: {
    label: "Document",
    dropTitle: "Importez un document PDF",
    dropHint: "Factures, devis, contrats, locations, services ou financement",
    choose: "Choisir un PDF",
    change: "Changer le PDF",
    invalid: "Importez un PDF valide de 8 Mo maximum.",
    unreadable: "Nous n’avons pas pu lire assez de texte dans ce PDF. S’il s’agit d’un scan, essayez pour l’instant des captures de ses pages.",
    scan: ["Lecture du document…", "Identification du type de document…", "Extraction des montants, dates et parties…", "Vérification des conditions et clauses…", "Calcul du niveau de prudence…"],
    type: "Type de document",
    pages: "Pages",
    parties: "Parties",
    amounts: "Montants",
    dates: "Dates",
    payment: "Paiement",
    clauses: "Clauses clés",
    reviewLevel: "Niveau de vérification",
    keyData: "Données clés du document",
    disclaimer: "Le score résume les points à vérifier. Il ne certifie ni l’authenticité du document, ni sa validité juridique, ni la réalité de l’opération.",
  },
  de: {
    label: "Dokument",
    dropTitle: "PDF-Dokument hochladen",
    dropHint: "Rechnungen, Angebote, Verträge, Miete, Dienstleistungen oder Finanzierung",
    choose: "PDF auswählen",
    change: "PDF ändern",
    invalid: "Lade eine gültige PDF-Datei bis 8 MB hoch.",
    unreadable: "Wir konnten nicht genügend Text aus dieser PDF lesen. Wenn es ein Scan ist, nutze vorerst Screenshots der Seiten.",
    scan: ["Dokument wird gelesen…", "Dokumenttyp wird erkannt…", "Beträge, Daten und Parteien werden extrahiert…", "Bedingungen und Klauseln werden geprüft…", "Vorsichtsstufe wird berechnet…"],
    type: "Dokumenttyp",
    pages: "Seiten",
    parties: "Parteien",
    amounts: "Beträge",
    dates: "Daten",
    payment: "Zahlung",
    clauses: "Wichtige Klauseln",
    reviewLevel: "Prüfstufe",
    keyData: "Wichtige Dokumentdaten",
    disclaimer: "Der Wert fasst Punkte zusammen, die geprüft werden sollten. Er bestätigt weder die Echtheit des Dokuments noch seine rechtliche Wirksamkeit oder die tatsächliche Durchführung einer Transaktion.",
  },
  ar: {
    label: "مستند",
    dropTitle: "ارفع مستند PDF",
    dropHint: "فواتير أو عروض أسعار أو عقود أو إيجار أو خدمات أو تمويل",
    choose: "اختيار PDF",
    change: "تغيير PDF",
    invalid: "ارفع ملف PDF صالحًا بحجم لا يتجاوز 8 ميغابايت.",
    unreadable: "لم نتمكن من قراءة نص كافٍ من ملف PDF. إذا كان المستند ممسوحًا ضوئيًا، جرّب حاليًا لقطات لصفحاته.",
    scan: ["جارٍ قراءة المستند…", "جارٍ تحديد نوع المستند…", "جارٍ استخراج المبالغ والتواريخ والأطراف…", "جارٍ مراجعة الشروط والبنود…", "جارٍ حساب مستوى الحذر…"],
    type: "نوع المستند",
    pages: "الصفحات",
    parties: "الأطراف",
    amounts: "المبالغ",
    dates: "التواريخ",
    payment: "الدفع",
    clauses: "البنود الرئيسية",
    reviewLevel: "مستوى المراجعة",
    keyData: "البيانات الأساسية للمستند",
    disclaimer: "تلخص الدرجة النقاط التي تستحق المراجعة. وهي لا تثبت أصالة المستند أو صلاحيته القانونية أو أن البيانات تعكس معاملة حقيقية.",
  },
};

const unknownSummary: Record<SupportedLocale, string> = {
  es: "No hemos podido revisar suficiente contenido para dar una conclusión fiable. Esto no significa que sea una estafa: algunas webs bloquean las comprobaciones automáticas.",
  en: "We could not review enough content to give a reliable conclusion. This does not mean the site is a scam: some websites block automated checks.",
  fr: "Nous n’avons pas pu examiner assez de contenu pour donner une conclusion fiable. Cela ne signifie pas qu’il s’agit d’une arnaque : certains sites bloquent les vérifications automatiques.",
  de: "Wir konnten nicht genug Inhalt prüfen, um eine verlässliche Schlussfolgerung zu geben. Das bedeutet nicht, dass die Website betrügerisch ist: Manche Seiten blockieren automatische Prüfungen.",
  ar: "لم نتمكن من مراجعة محتوى كافٍ لإعطاء نتيجة موثوقة. هذا لا يعني أن الموقع احتيالي؛ فبعض المواقع تمنع الفحوصات الآلية.",
};

const subjectCopy: Record<SupportedLocale, { analysed: string; url: string; capture: string; text: string; document: string }> = {
  es: { analysed: "Analizado", url: "Enlace analizado", capture: "Captura analizada", text: "Mensaje analizado", document: "Documento analizado" },
  en: { analysed: "Analysed", url: "Analysed link", capture: "Analysed screenshot", text: "Analysed message", document: "Analysed document" },
  fr: { analysed: "Analysé", url: "Lien analysé", capture: "Capture analysée", text: "Message analysé", document: "Document analysé" },
  de: { analysed: "Analysiert", url: "Analysierter Link", capture: "Analysierter Screenshot", text: "Analysierte Nachricht", document: "Analysiertes Dokument" },
  ar: { analysed: "تم التحليل", url: "الرابط الذي تم تحليله", capture: "لقطة الشاشة التي تم تحليلها", text: "الرسالة التي تم تحليلها", document: "المستند الذي تم تحليله" },
};

function VonuMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
      <g fill="#7bb7ff">
        <circle cx="24.6" cy="8.7" r="7.2" />
        <circle cx="8.6" cy="20.1" r="7.2" />
        <circle cx="25.1" cy="31.1" r="7.2" />
        <circle cx="18.7" cy="20.1" r="5.9" />
        <path d="M12.8 16.3 19.7 10.9 24.8 15.4 20.8 20.1 25.4 25.5 20.7 30.1 14.2 23.8Z" />
      </g>
    </svg>
  );
}

function ModeIcon({ mode }: { mode: Mode }) {
  if (mode === "url") return <span aria-hidden="true" className="text-[17px]">◎</span>;
  if (mode === "capture") return <span aria-hidden="true" className="text-[16px]">▣</span>;
  if (mode === "document") return <span aria-hidden="true" className="text-[16px]">▤</span>;
  return <span aria-hidden="true" className="text-[17px]">≡</span>;
}

function ScannerModeIcon({ mode }: { mode: Mode }) {
  if (mode === "url") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (mode === "capture") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (mode === "document") {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
        <path d="M6 2.75h7.5L19 8.25V21.25H6V2.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M13.5 2.75v5.5H19M9 12h7M9 15.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 8.5h9M7.5 12.5h6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
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

function documentKindLabel(kind: DocumentKind, locale: SupportedLocale) {
  const labels: Record<SupportedLocale, Record<DocumentKind, string>> = {
    es: {
      invoice: "Factura",
      quote_or_proforma: "Presupuesto / proforma",
      contract: "Contrato",
      rental_contract: "Contrato de alquiler",
      service_contract: "Contrato de servicios",
      loan_or_financing: "Préstamo / financiación",
      other: "Otro documento",
    },
    en: {
      invoice: "Invoice",
      quote_or_proforma: "Quote / pro forma",
      contract: "Contract",
      rental_contract: "Rental agreement",
      service_contract: "Service contract",
      loan_or_financing: "Loan / financing",
      other: "Other document",
    },
    fr: {
      invoice: "Facture",
      quote_or_proforma: "Devis / pro forma",
      contract: "Contrat",
      rental_contract: "Contrat de location",
      service_contract: "Contrat de services",
      loan_or_financing: "Prêt / financement",
      other: "Autre document",
    },
    de: {
      invoice: "Rechnung",
      quote_or_proforma: "Angebot / Proforma",
      contract: "Vertrag",
      rental_contract: "Mietvertrag",
      service_contract: "Dienstleistungsvertrag",
      loan_or_financing: "Darlehen / Finanzierung",
      other: "Anderes Dokument",
    },
    ar: {
      invoice: "فاتورة",
      quote_or_proforma: "عرض سعر / فاتورة مبدئية",
      contract: "عقد",
      rental_contract: "عقد إيجار",
      service_contract: "عقد خدمات",
      loan_or_financing: "قرض / تمويل",
      other: "مستند آخر",
    },
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
  const nav = navCopy[locale];
  const dir = localeMeta[locale].dir;
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanIndex, setScanIndex] = useState(0);
  const [entitlement, setEntitlement] = useState<EntitlementSnapshot | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const imagePreviewObjectUrlRef = useRef<string | null>(null);

  const refreshBalance = useCallback(async () => {
    try {
      const response = await fetch("/api/check/entitlement", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) return;

      setEntitlement({
        freeUsed: Boolean(data.free_used),
        creditsRemaining: Math.max(0, Number(data.credits_remaining || 0)),
        lifetimeAnalyses: Math.max(0, Number(data.lifetime_analyses || 0)),
      });
    } catch {
      // Keep the scanner usable; DeviceAccessGate remains the enforcement layer.
    }
  }, []);

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

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshBalance();
    };

    window.addEventListener("vonu:entitlement", onEntitlement as EventListener);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    void refreshBalance();

    return () => {
      window.removeEventListener("vonu:entitlement", onEntitlement as EventListener);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshBalance]);


  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => setScanIndex((value) => value + 1), 760);
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (imagePreviewObjectUrlRef.current) {
        URL.revokeObjectURL(imagePreviewObjectUrlRef.current);
        imagePreviewObjectUrlRef.current = null;
      }
    };
  }, []);

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
    if (imagePreviewObjectUrlRef.current) {
      URL.revokeObjectURL(imagePreviewObjectUrlRef.current);
    }
    const previewUrl = URL.createObjectURL(file);
    imagePreviewObjectUrlRef.current = previewUrl;

    setMode("capture");
    setImageData(dataUrl);
    setImagePreviewUrl(previewUrl);
    setImageName(file.name || "screenshot");
    setError("");
  }

  async function handleDocumentFile(file: File | null) {
    const looksLikePdf = !!file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
    if (!file || !looksLikePdf || file.size <= 0 || file.size > 8_000_000) {
      setError(DOCUMENT_UI[locale].invalid);
      return;
    }
    setMode("document");
    setDocumentFile(file);
    setDocumentName(file.name || "document.pdf");
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
    let documentBody: FormData | null = null;

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
    } else if (mode === "document") {
      if (!documentFile) {
        setError(DOCUMENT_UI[locale].invalid);
        return;
      }
      endpoint = "/api/check/document";
      documentBody = new FormData();
      documentBody.set("locale", locale);
      documentBody.set("file", documentFile);
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
      const response = await fetch(
        endpoint,
        documentBody
          ? { method: "POST", body: documentBody }
          : {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(body),
            },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        if (mode === "document" && data?.error === "document_text_unavailable") {
          setError(DOCUMENT_UI[locale].unreadable);
          return;
        }
        if (mode === "document" && (data?.error === "invalid_document" || data?.error === "document_too_large")) {
          setError(DOCUMENT_UI[locale].invalid);
          return;
        }
        throw new Error(data?.error || "analysis_failed");
      }
      setResult(data as Result);
      void refreshBalance();
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

  const steps = mode === "url"
    ? t.scanUrl
    : mode === "capture"
      ? t.scanCapture
      : mode === "document"
        ? DOCUMENT_UI[locale].scan
        : t.scanText;
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
        mode: "url" as const,
        label: subjectCopy[locale].url,
        primary: result.facts.hostname,
        detail: result.facts.finalUrl,
        image: null as string | null,
        icon: "◎",
      };
    }
    if (result?.version === "vonu-capture-v1" || mode === "capture") {
      return {
        mode: "capture" as const,
        label: subjectCopy[locale].capture,
        primary: imageName || subjectCopy[locale].capture,
        detail: result?.version === "vonu-capture-v1" ? contextLabel(result.kind, locale) : t.dropHint,
        image: imageData || imagePreviewUrl,
        icon: "▣",
      };
    }
    if (result?.version === "vonu-document-v1" || mode === "document") {
      return {
        mode: "document" as const,
        label: subjectCopy[locale].document,
        primary: result?.version === "vonu-document-v1" ? result.filename : documentName || DOCUMENT_UI[locale].label,
        detail: result?.version === "vonu-document-v1"
          ? documentKindLabel(result.kind, locale)
          : DOCUMENT_UI[locale].dropHint,
        image: null as string | null,
        icon: "PDF",
      };
    }
    if (result?.version === "vonu-text-v1" || mode === "text") {
      const preview = text.trim().replace(/\s+/g, " ");
      return {
        mode: "text" as const,
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
      mode: "url" as const,
      label: subjectCopy[locale].url,
      primary: host || subjectCopy[locale].url,
      detail: cleanUrl,
      image: null as string | null,
      icon: "◎",
    };
  })();

  function SubjectCard({ completed = false }: { completed?: boolean }) {
    return (
      <section data-vonu-subject-mode={subject.mode} className="mb-5 flex min-w-0 items-center gap-3 overflow-hidden rounded-[18px] border border-white/[0.075] bg-[#111725]/88 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,.18)]">
        {subject.image ? (
          <img
            src={subject.image}
            data-vonu-capture-thumbnail={subject.mode === "capture" ? "true" : undefined}
            alt=""
            onError={(event) => {
              if (subject.mode === "capture" && imagePreviewUrl && event.currentTarget.src !== imagePreviewUrl) {
                event.currentTarget.src = imagePreviewUrl;
              }
            }}
            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
          />
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
        "flex min-h-dvh w-full max-w-[100vw] overflow-x-clip flex-col bg-[#0d101b] text-slate-100",
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
              <div className="grid grid-cols-4 px-1 pt-1 sm:px-2">
                {(["url", "capture", "text", "document"] as Mode[]).map((item) => (
                  <button key={item} type="button" onClick={() => switchMode(item)} className={["relative flex h-[52px] items-center justify-center gap-1.5 px-1 text-[11px] font-semibold transition sm:gap-2 sm:px-2 sm:text-[14px]", mode === item ? "text-emerald-300" : "text-slate-400 hover:text-slate-200"].join(" ")}>
                    <ModeIcon mode={item} />
                    <span>{item === "url" ? t.url : item === "capture" ? t.capture : item === "text" ? t.text : DOCUMENT_UI[locale].label}</span>
                    {mode === item && <span className="absolute inset-x-[18%] bottom-[6px] h-[2px] rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.45)]" />}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                {mode === "url" && (
                  <div className="flex min-h-[72px] items-center rounded-[18px] bg-[#0d1220] px-4 ring-1 ring-white/[0.07] transition focus-within:ring-emerald-400/35">
                    <span className="me-3 text-emerald-300">⌕</span>
                    <input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void analyze(); }} placeholder={t.urlPlaceholder} type="url" inputMode="url" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" data-form-type="other" className="w-full scroll-mt-24 bg-transparent py-5 text-[15px] text-white outline-none placeholder:text-slate-600 sm:text-[16px]" />
                  </div>
                )}

                {mode === "text" && (
                  <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t.textPlaceholder} className="min-h-[118px] w-full resize-none rounded-[18px] bg-[#0d1220] p-4 text-[15px] leading-6 text-white outline-none ring-1 ring-white/[0.07] transition placeholder:text-slate-600 focus:ring-emerald-400/35 sm:min-h-[128px]" />
                )}

                {mode === "capture" && (
                  <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files?.[0] || null); }} className="grid min-h-[138px] place-items-center px-3 py-2 text-center">
                    {imageData ? (
                      <div className="grid w-full gap-3 sm:grid-cols-[110px_1fr] sm:items-center sm:text-start">
                        <img src={imagePreviewUrl || imageData} alt="Preview" className="mx-auto max-h-[112px] max-w-[110px] rounded-lg object-contain" />
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

                {mode === "document" && (
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      void handleDocumentFile(event.dataTransfer.files?.[0] || null);
                    }}
                    className="grid min-h-[138px] place-items-center px-3 py-2 text-center"
                  >
                    {documentFile ? (
                      <div className="grid w-full gap-3 sm:grid-cols-[72px_1fr] sm:items-center sm:text-start">
                        <div className="mx-auto grid h-16 w-14 place-items-center rounded-xl border border-[#7bb7ff]/25 bg-[#7bb7ff]/[0.06] text-[12px] font-bold tracking-[0.08em] text-[#7bb7ff]">PDF</div>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-white">{documentName}</p>
                          <p className="mt-1 text-[13px] text-slate-400">{DOCUMENT_UI[locale].dropHint}</p>
                          <button type="button" onClick={() => documentRef.current?.click()} className="mt-3 rounded-lg bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08]">{DOCUMENT_UI[locale].change}</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[16px] font-semibold text-white sm:text-[17px]">{DOCUMENT_UI[locale].dropTitle}</p>
                        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-5 text-slate-400 sm:text-sm">{DOCUMENT_UI[locale].dropHint}</p>
                        <button type="button" onClick={() => documentRef.current?.click()} className="mt-3 rounded-xl bg-emerald-400/[0.10] px-4 py-2 text-[13px] font-semibold text-emerald-200 ring-1 ring-emerald-400/25 hover:bg-emerald-400/[0.14]">{DOCUMENT_UI[locale].choose}</button>
                      </div>
                    )}
                    <input ref={documentRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => void handleDocumentFile(event.target.files?.[0] || null)} />
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

          <footer className="vonu-check-inner-footer shrink-0 bg-[#0b0e17]/55">
            <div className="mx-auto flex min-h-11 max-w-[1320px] items-center justify-between gap-3 px-4 text-[11px] text-slate-600 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-slate-500"><VonuMark /><span className="font-semibold tracking-[0.08em] text-white">Vonu</span></div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link href={localizedPublicPath(locale, "producto")} className="hidden hover:text-slate-400 sm:inline">{nav.product}</Link>
                <Link href={localizedPublicPath(locale, "casos-de-uso")} className="hidden hover:text-slate-400 sm:inline">{nav.cases}</Link>
                <Link href={legalPath(locale, "legal-notice")} className="hover:text-slate-400">{t.legal}</Link>
                <Link href={legalPath(locale, "privacy")} className="hover:text-slate-400">{t.privacyMenu}</Link>
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
                <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#07142f] text-emerald-300 shadow-[0_0_28px_rgba(123,183,255,.34)] ring-1 ring-emerald-400/25">
                  <ScannerModeIcon mode={mode} />
                </div>
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
                <div className="min-w-0 text-xs leading-5 text-slate-400">
                  <div>{result.version === "vonu-document-v1" ? DOCUMENT_UI[locale].reviewLevel : t.cautionIndex}</div>
                  <div className="mt-1 text-slate-300">{t.confidence}: {confidenceLabel}</div>
                  {result.version === "vonu-document-v1" && (
                    <p className="mt-1.5 max-w-[260px] text-[10px] leading-4 text-slate-500">{result.risk.confidenceReason}</p>
                  )}
                </div>
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
                    <h2 className="text-[17px] font-bold text-white">{result.version === "vonu-document-v1" ? DOCUMENT_UI[locale].keyData : t.extracted}</h2>
                    {result.version === "vonu-capture-v1" && <p className="mt-3 text-[13px] text-slate-400">{t.context}: <span className="text-slate-200">{contextLabel(result.kind, locale)}</span></p>}
                    {result.version === "vonu-document-v1" && (
                      <div className="mt-3 grid gap-2 text-[12px] leading-5 text-slate-400 [overflow-wrap:anywhere]">
                        <p><span className="text-slate-500">{DOCUMENT_UI[locale].type}: </span><span className="text-slate-200">{documentKindLabel(result.kind, locale)}</span></p>
                        {result.pageCount && <p><span className="text-slate-500">{DOCUMENT_UI[locale].pages}: </span>{result.pageCount}</p>}
                        {result.keyFacts.parties.length > 0 && <p><span className="text-slate-500">{DOCUMENT_UI[locale].parties}: </span>{result.keyFacts.parties.join(" · ")}</p>}
                        {result.keyFacts.amounts.length > 0 && <p><span className="text-slate-500">{DOCUMENT_UI[locale].amounts}: </span>{result.keyFacts.amounts.join(" · ")}</p>}
                        {result.keyFacts.dates.length > 0 && <p><span className="text-slate-500">{DOCUMENT_UI[locale].dates}: </span>{result.keyFacts.dates.join(" · ")}</p>}
                        {result.keyFacts.paymentDetails.length > 0 && <p><span className="text-slate-500">{DOCUMENT_UI[locale].payment}: </span>{result.keyFacts.paymentDetails.join(" · ")}</p>}
                        {result.keyFacts.keyClauses.length > 0 && (
                          <div>
                            <p className="text-slate-500">{DOCUMENT_UI[locale].clauses}:</p>
                            <ul className="mt-1 grid gap-1">{result.keyFacts.keyClauses.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul>
                          </div>
                        )}
                      </div>
                    )}
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
            <p className="max-w-2xl text-[12px] leading-5 text-slate-600">{result.version === "vonu-document-v1" ? DOCUMENT_UI[locale].disclaimer : t.noCertification}</p>
            <button type="button" onClick={reset} className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/[0.08] hover:bg-white/[0.09]">{t.newCheck}</button>
          </div>
        </main>
      )}
    </div>
  );
}
