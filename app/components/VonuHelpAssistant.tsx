"use client";

import { useEffect, useRef, useState } from "react";
import HomeHeader from "@/app/components/HomeHeader";
import VonuMark from "@/app/components/VonuMark";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import { legalPath } from "@/lib/vonu-legal/routes";

type Topic = "how" | "buy" | "privacy" | "scam" | "contact" | "unknown";

type AssistantCopy = {
  title: string;
  subtitle: string;
  intro: string;
  question: string;
  input: string;
  send: string;
  close: string;
  notAnalysis: string;
  options: Record<Exclude<Topic, "unknown">, { title: string; description: string }>;
  replies: Record<Topic, { title: string; body: string; cta?: string }>;
  howSteps: string[];
};

const COPY: Record<SupportedLocale, AssistantCopy> = {
  es: {
    title: "Ayuda Vonü",
    subtitle: "¿En qué podemos ayudarte?",
    intro: "Hola 👋 Soy el asistente de Vonü.",
    question: "Puedo ayudarte con el funcionamiento de la web, pagos, privacidad y dudas habituales.",
    input: "Escribe tu mensaje…",
    send: "Enviar",
    close: "Cerrar ayuda",
    notAnalysis: "Este asistente no analiza enlaces, imágenes, mensajes ni documentos. Para eso, utiliza las pestañas de Vonü Check.",
    options: {
      how: { title: "Cómo usar Vonü", description: "Te explicamos qué pestaña utilizar en cada caso." },
      buy: { title: "Comprar más análisis", description: "Packs, precios y cómo ampliar tus análisis." },
      privacy: { title: "Privacidad y seguridad", description: "Cómo tratamos tus datos y archivos." },
      scam: { title: "Creo que he sido víctima de una estafa", description: "Te orientamos sobre qué hacer ahora." },
      contact: { title: "Contactar con el equipo", description: "¿No encontraste la respuesta? Te ayudamos." },
    },
    replies: {
      how: { title: "Cómo usar Vonü", body: "Elige la pestaña según lo que quieras comprobar:" },
      buy: { title: "Comprar más análisis", body: "Puedes consultar el pack disponible y ampliar tus análisis desde la página de precios.", cta: "Ver precios" },
      privacy: { title: "Privacidad y seguridad", body: "Puedes consultar cómo tratamos los datos, archivos y la información que envías a Vonü en nuestra política de privacidad.", cta: "Ver privacidad" },
      scam: { title: "Creo que he sido víctima de una estafa", body: "Si ya has hecho clic, compartido datos o realizado un pago, no sigas interactuando con el mensaje o la persona. Utiliza los canales oficiales del banco o servicio implicado. Vonü Check puede ayudarte a revisar el contenido, pero no recupera cuentas ni fondos.", cta: "Contactar con el equipo" },
      contact: { title: "Contactar con el equipo", body: "Si tu duda no está cubierta aquí, puedes escribirnos desde la página de contacto.", cta: "Ir a contacto" },
      unknown: { title: "Puedo ayudarte con el funcionamiento de Vonü", body: "Todavía no tengo una respuesta automática para esa consulta. Puedes elegir una de las opciones anteriores o contactar con el equipo.", cta: "Ir a contacto" },
    },
    howSteps: [
      "Enlace: toca “Enlace” y pega la URL que quieres comprobar.",
      "Captura: toca “Captura” y sube una imagen o captura de pantalla.",
      "Mensaje: toca “Mensaje” y pega el SMS, email o conversación.",
      "Documento: toca “Documento” y sube el PDF que quieres revisar.",
    ],
  },
  en: {
    title: "Vonü Help",
    subtitle: "How can we help?",
    intro: "Hi 👋 I’m the Vonü assistant.",
    question: "I can help with using the website, payments, privacy and common questions.",
    input: "Type your message…",
    send: "Send",
    close: "Close help",
    notAnalysis: "This assistant does not analyse links, images, messages or documents. Use the Vonü Check tabs for that.",
    options: {
      how: { title: "How to use Vonü", description: "We’ll show you which tab to use." },
      buy: { title: "Buy more analyses", description: "Packs, pricing and how to add more analyses." },
      privacy: { title: "Privacy and security", description: "How we handle your data and files." },
      scam: { title: "I think I’ve been scammed", description: "Guidance on what to do next." },
      contact: { title: "Contact the team", description: "Couldn’t find the answer? We can help." },
    },
    replies: {
      how: { title: "How to use Vonü", body: "Choose the tab that matches what you want to check:" },
      buy: { title: "Buy more analyses", body: "You can see the available pack and add more analyses from the pricing page.", cta: "View pricing" },
      privacy: { title: "Privacy and security", body: "You can read how Vonü handles the data, files and information you submit in our privacy policy.", cta: "View privacy" },
      scam: { title: "I think I’ve been scammed", body: "If you already clicked, shared information or made a payment, stop interacting with the message or person. Use the official channels of the bank or service involved. Vonü Check can help you review the content, but it does not recover accounts or funds.", cta: "Contact the team" },
      contact: { title: "Contact the team", body: "If your question is not covered here, you can write to us from the contact page.", cta: "Go to contact" },
      unknown: { title: "I can help with using Vonü", body: "I don’t have an automatic answer for that yet. Choose one of the options above or contact the team.", cta: "Go to contact" },
    },
    howSteps: [
      "Link: tap “Link” and paste the URL you want to check.",
      "Screenshot: tap “Screenshot” and upload an image or screenshot.",
      "Message: tap “Message” and paste the SMS, email or conversation.",
      "Document: tap “Document” and upload the PDF you want to review.",
    ],
  },
  fr: {
    title: "Aide Vonü",
    subtitle: "Comment pouvons-nous vous aider ?",
    intro: "Bonjour 👋 Je suis l’assistant Vonü.",
    question: "Je peux vous aider à utiliser le site, les paiements, la confidentialité et les questions fréquentes.",
    input: "Écrivez votre message…",
    send: "Envoyer",
    close: "Fermer l’aide",
    notAnalysis: "Cet assistant n’analyse pas les liens, images, messages ou documents. Utilisez les onglets de Vonü Check pour cela.",
    options: {
      how: { title: "Comment utiliser Vonü", description: "Nous vous indiquons quel onglet utiliser." },
      buy: { title: "Acheter plus d’analyses", description: "Packs, tarifs et analyses supplémentaires." },
      privacy: { title: "Confidentialité et sécurité", description: "Comment nous traitons vos données et fichiers." },
      scam: { title: "Je pense avoir été victime d’une arnaque", description: "Des indications sur les prochaines étapes." },
      contact: { title: "Contacter l’équipe", description: "Vous n’avez pas trouvé la réponse ? Nous vous aidons." },
    },
    replies: {
      how: { title: "Comment utiliser Vonü", body: "Choisissez l’onglet correspondant à ce que vous souhaitez vérifier :" },
      buy: { title: "Acheter plus d’analyses", body: "Consultez le pack disponible et ajoutez des analyses depuis la page des tarifs.", cta: "Voir les tarifs" },
      privacy: { title: "Confidentialité et sécurité", body: "Consultez notre politique de confidentialité pour savoir comment Vonü traite les données, fichiers et informations envoyés.", cta: "Voir la confidentialité" },
      scam: { title: "Je pense avoir été victime d’une arnaque", body: "Si vous avez déjà cliqué, partagé des données ou effectué un paiement, cessez d’interagir avec le message ou la personne. Utilisez les canaux officiels de la banque ou du service concerné. Vonü Check peut examiner le contenu, mais ne récupère ni comptes ni fonds.", cta: "Contacter l’équipe" },
      contact: { title: "Contacter l’équipe", body: "Si votre question n’est pas couverte ici, écrivez-nous depuis la page de contact.", cta: "Aller au contact" },
      unknown: { title: "Je peux vous aider à utiliser Vonü", body: "Je n’ai pas encore de réponse automatique à cette question. Choisissez une option ci-dessus ou contactez l’équipe.", cta: "Aller au contact" },
    },
    howSteps: [
      "Lien : touchez « Lien » et collez l’URL à vérifier.",
      "Capture : touchez « Capture » et importez une image ou capture d’écran.",
      "Message : touchez « Message » et collez le SMS, l’email ou la conversation.",
      "Document : touchez « Document » et importez le PDF à examiner.",
    ],
  },
  de: {
    title: "Vonü Hilfe",
    subtitle: "Wie können wir helfen?",
    intro: "Hallo 👋 Ich bin der Vonü-Assistent.",
    question: "Ich helfe bei der Nutzung der Website, Zahlungen, Datenschutz und häufigen Fragen.",
    input: "Nachricht eingeben…",
    send: "Senden",
    close: "Hilfe schließen",
    notAnalysis: "Dieser Assistent analysiert keine Links, Bilder, Nachrichten oder Dokumente. Nutze dafür die Vonü-Check-Tabs.",
    options: {
      how: { title: "Vonü verwenden", description: "Wir zeigen dir, welchen Tab du nutzen solltest." },
      buy: { title: "Mehr Analysen kaufen", description: "Pakete, Preise und zusätzliche Analysen." },
      privacy: { title: "Datenschutz und Sicherheit", description: "Wie wir deine Daten und Dateien behandeln." },
      scam: { title: "Ich glaube, ich wurde betrogen", description: "Orientierung zu den nächsten Schritten." },
      contact: { title: "Team kontaktieren", description: "Keine Antwort gefunden? Wir helfen." },
    },
    replies: {
      how: { title: "Vonü verwenden", body: "Wähle den Tab passend zu dem, was du prüfen möchtest:" },
      buy: { title: "Mehr Analysen kaufen", body: "Auf der Preisseite findest du das verfügbare Paket und kannst weitere Analysen hinzufügen.", cta: "Preise ansehen" },
      privacy: { title: "Datenschutz und Sicherheit", body: "In unserer Datenschutzerklärung erfährst du, wie Vonü mit Daten, Dateien und eingesendeten Informationen umgeht.", cta: "Datenschutz ansehen" },
      scam: { title: "Ich glaube, ich wurde betrogen", body: "Wenn du bereits geklickt, Daten geteilt oder bezahlt hast, interagiere nicht weiter mit der Nachricht oder Person. Nutze die offiziellen Kanäle der betroffenen Bank oder des Dienstes. Vonü Check kann Inhalte prüfen, stellt aber keine Konten oder Gelder wieder her.", cta: "Team kontaktieren" },
      contact: { title: "Team kontaktieren", body: "Wenn deine Frage hier nicht beantwortet wird, kannst du uns über die Kontaktseite schreiben.", cta: "Zum Kontakt" },
      unknown: { title: "Ich helfe bei der Nutzung von Vonü", body: "Dafür habe ich noch keine automatische Antwort. Wähle eine Option oben oder kontaktiere das Team.", cta: "Zum Kontakt" },
    },
    howSteps: [
      "Link: Tippe auf „Link“ und füge die URL ein.",
      "Screenshot: Tippe auf „Screenshot“ und lade ein Bild hoch.",
      "Nachricht: Tippe auf „Nachricht“ und füge SMS, E-Mail oder Chat ein.",
      "Dokument: Tippe auf „Dokument“ und lade die PDF-Datei hoch.",
    ],
  },
  ar: {
    title: "مساعدة Vonü",
    subtitle: "كيف يمكننا مساعدتك؟",
    intro: "مرحبًا 👋 أنا مساعد Vonü.",
    question: "يمكنني مساعدتك في استخدام الموقع والدفع والخصوصية والأسئلة الشائعة.",
    input: "اكتب رسالتك…",
    send: "إرسال",
    close: "إغلاق المساعدة",
    notAnalysis: "هذا المساعد لا يحلل الروابط أو الصور أو الرسائل أو المستندات. استخدم تبويبات Vonü Check لذلك.",
    options: {
      how: { title: "كيفية استخدام Vonü", description: "نوضح لك أي تبويب تستخدمه." },
      buy: { title: "شراء تحليلات إضافية", description: "الحزم والأسعار وإضافة تحليلات جديدة." },
      privacy: { title: "الخصوصية والأمان", description: "كيف نتعامل مع بياناتك وملفاتك." },
      scam: { title: "أعتقد أنني تعرضت للاحتيال", description: "إرشادات حول ما يمكنك فعله الآن." },
      contact: { title: "التواصل مع الفريق", description: "لم تجد الإجابة؟ يمكننا مساعدتك." },
    },
    replies: {
      how: { title: "كيفية استخدام Vonü", body: "اختر التبويب المناسب لما تريد التحقق منه:" },
      buy: { title: "شراء تحليلات إضافية", body: "يمكنك الاطلاع على الحزمة المتاحة وإضافة تحليلات من صفحة الأسعار.", cta: "عرض الأسعار" },
      privacy: { title: "الخصوصية والأمان", body: "يمكنك معرفة كيفية تعامل Vonü مع البيانات والملفات والمعلومات المرسلة في سياسة الخصوصية.", cta: "عرض الخصوصية" },
      scam: { title: "أعتقد أنني تعرضت للاحتيال", body: "إذا كنت قد نقرت بالفعل أو شاركت بيانات أو أجريت دفعة، فتوقف عن التفاعل مع الرسالة أو الشخص. استخدم القنوات الرسمية للبنك أو الخدمة المعنية. يمكن لـ Vonü Check مساعدتك في مراجعة المحتوى، لكنه لا يستعيد الحسابات أو الأموال.", cta: "التواصل مع الفريق" },
      contact: { title: "التواصل مع الفريق", body: "إذا لم تجد إجابتك هنا، يمكنك مراسلتنا من صفحة التواصل.", cta: "الانتقال إلى التواصل" },
      unknown: { title: "يمكنني مساعدتك في استخدام Vonü", body: "لا توجد لدي إجابة تلقائية لهذا السؤال بعد. اختر أحد الخيارات أعلاه أو تواصل مع الفريق.", cta: "الانتقال إلى التواصل" },
    },
    howSteps: [
      "الرابط: اضغط على «الرابط» والصق عنوان URL الذي تريد فحصه.",
      "لقطة الشاشة: اضغط على «لقطة» وارفع الصورة.",
      "الرسالة: اضغط على «رسالة» والصق الرسالة أو المحادثة.",
      "المستند: اضغط على «مستند» وارفع ملف PDF.",
    ],
  },
};

const KEYWORDS: Record<Exclude<Topic, "unknown">, string[]> = {
  how: ["usar", "funciona", "cómo", "como", "how", "use", "utiliser", "comment", "benutzen", "funktioniert", "استخدام", "كيف"],
  buy: ["comprar", "recargar", "recarga", "precio", "pack", "buy", "top up", "price", "pricing", "acheter", "tarif", "kaufen", "preis", "شراء", "سعر"],
  privacy: ["privacidad", "datos", "privacy", "data", "confidentialité", "données", "datenschutz", "daten", "خصوصية", "بيانات"],
  scam: ["estafa", "estafado", "estafada", "fraude", "he hecho clic", "he pagado", "scam", "scammed", "fraud", "already clicked", "made a payment", "arnaque", "cliqué", "payé", "betrug", "betrogen", "geklickt", "bezahlt", "احتيال", "نصب", "دفعت", "نقرت"],
  contact: ["contacto", "contactar", "equipo", "contact", "team", "contacter", "équipe", "kontakt", "team", "تواصل", "فريق"],
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function resolveTopic(value: string): Topic {
  const normalized = normalize(value);
  const ordered: Exclude<Topic, "unknown">[] = ["scam", "buy", "privacy", "contact", "how"];
  for (const topic of ordered) {
    if (KEYWORDS[topic].some((keyword) => normalized.includes(normalize(keyword)))) return topic;
  }
  return "unknown";
}

function ChatGlyph({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <path
        d="M15 10h34a9 9 0 0 1 9 9v20a9 9 0 0 1-9 9H30L16 56l3.4-8H15a9 9 0 0 1-9-9V19a9 9 0 0 1 9-9Z"
        stroke="currentColor"
        strokeWidth="3.3"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="2.7" fill="currentColor" />
      <circle cx="32" cy="30" r="2.7" fill="currentColor" />
      <circle cx="40" cy="30" r="2.7" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.9" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>;
}
function CartIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="20" r="1.4" fill="currentColor" /><circle cx="18" cy="20" r="1.4" fill="currentColor" /></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true"><path d="M12 3 20 6v5.5c0 4.8-3.2 8.1-8 10.5-4.8-2.4-8-5.7-8-10.5V6l8-3Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" /><path d="m8.8 12.2 2 2 4.5-4.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LifeRingIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.9" /><path d="m6 6 3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.9" /><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M22 2 11 13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function TopicIcon({ topic }: { topic: Exclude<Topic, "unknown"> }) {
  if (topic === "how") return <SearchIcon />;
  if (topic === "buy") return <CartIcon />;
  if (topic === "privacy") return <ShieldIcon />;
  if (topic === "scam") return <LifeRingIcon />;
  return <MailIcon />;
}

export default function VonuHelpAssistant({ locale }: { locale: SupportedLocale }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [value, setValue] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<
    | { id: number; role: "user"; text: string }
    | { id: number; role: "assistant"; topic: Topic }
  >>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [viewport, setViewport] = useState({
    height: 0,
    width: 0,
    offsetTop: 0,
    offsetLeft: 0,
    keyboardOpen: false,
  });
  const baselineViewportHeight = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const messageId = useRef(0);
  const copy = COPY[locale];
  const isRtl = locale === "ar";

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const visualViewport = window.visualViewport;
    const initialHeight = visualViewport?.height ?? window.innerHeight;
    baselineViewportHeight.current = initialHeight;

    const syncViewport = () => {
      const height = visualViewport?.height ?? window.innerHeight;
      const width = visualViewport?.width ?? window.innerWidth;
      const offsetTop = visualViewport?.offsetTop ?? 0;
      const offsetLeft = visualViewport?.offsetLeft ?? 0;
      const keyboardOpen = baselineViewportHeight.current - height > 120;

      setViewport({ height, width, offsetTop, offsetLeft, keyboardOpen });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    syncViewport();
    visualViewport?.addEventListener("resize", syncViewport);
    visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      visualViewport?.removeEventListener("resize", syncViewport);
      visualViewport?.removeEventListener("scroll", syncViewport);
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("keydown", onKeyDown);

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);

      baselineViewportHeight.current = 0;
      setViewport({ height: 0, width: 0, offsetTop: 0, offsetLeft: 0, keyboardOpen: false });
      setInputFocused(false);
    };
  }, [open]);

  function submitMessage() {
    const trimmed = value.trim();
    if (!trimmed) return;

    const resolved = resolveTopic(trimmed);
    const userId = ++messageId.current;
    const assistantId = ++messageId.current;

    setChatMessages((current) => [
      ...current,
      { id: userId, role: "user", text: trimmed },
      { id: assistantId, role: "assistant", topic: resolved },
    ]);
    setTopic(null);
    setValue("");
    setInputFocused(false);
    inputRef.current?.blur();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    window.setTimeout(() => {
      const main = mainRef.current;
      if (main) main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
    }, 180);
  }

  const selected = topic ? copy.replies[topic] : null;
  const ctaHref =
    topic === "buy"
      ? localizedPublicPath(locale, "precios")
      : topic === "privacy"
        ? legalPath(locale, "privacy")
        : topic === "contact" || topic === "scam" || topic === "unknown"
          ? localizedPublicPath(locale, "contacto")
          : null;

  const topics: Exclude<Topic, "unknown">[] = ["how", "buy", "privacy", "scam", "contact"];
  const compactComposer = inputFocused || viewport.keyboardOpen;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[72px] right-5 z-[70] grid h-16 w-16 place-items-center text-[#7bb7ff] transition hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
        aria-label={copy.title}
        title={copy.title}
      >
        <ChatGlyph className="h-[58px] w-[58px] drop-shadow-[0_0_10px_rgba(123,183,255,.25)]" />
      </button>

      {open ? (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="fixed z-[2147483000] flex flex-col overflow-hidden overscroll-none bg-[#071126] text-white"
          style={{
            top: viewport.height ? `${viewport.offsetTop}px` : 0,
            left: viewport.width ? `${viewport.offsetLeft}px` : 0,
            width: viewport.width ? `${viewport.width}px` : "100vw",
            height: viewport.height ? `${viewport.height}px` : "100dvh",
            backgroundImage:
              "radial-gradient(circle at 50% 22%, rgba(59,130,246,.12), transparent 30%), linear-gradient(180deg,#061027 0%,#07162f 100%)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
        >
          <HomeHeader overlayClose={() => setOpen(false)} solid />

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <main
              ref={mainRef}
              className={[
                "absolute inset-0 overflow-y-auto overscroll-contain px-5 pt-4 sm:px-8 sm:pt-6",
                compactComposer ? "pb-[76px] sm:pb-[82px]" : "pb-[118px] sm:pb-[126px]",
              ].join(" ")}
            >
              <div className="mx-auto flex w-full max-w-[760px] flex-col">
                <div className="flex items-center gap-3">
                  <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0b234a] text-[#7bb7ff] ring-1 ring-[#7bb7ff]/25 sm:grid">
                    <VonuMark className="h-8 w-8" />
                  </div>
                  <div className="w-full rounded-[24px] border border-[#7bb7ff]/20 bg-[#0a1a36] px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,.18)]">
                    <p className="text-[18px] font-medium text-slate-100">{copy.intro}</p>
                    <p className="mt-1 text-[15px] leading-6 text-slate-400">{copy.question}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2.5">
                  {topics.map((item) => {
                    const option = copy.options[item];
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTopic(item)}
                        className={[
                          "flex w-full items-center gap-4 rounded-[22px] border px-4 py-3.5 text-start transition active:scale-[.995]",
                          topic === item
                            ? "border-[#7bb7ff]/60 bg-[#10284f]"
                            : "border-[#7bb7ff]/25 bg-[#0a1b38] hover:border-[#7bb7ff]/45 hover:bg-[#0d2348]",
                        ].join(" ")}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center text-[#69a9ff]"><TopicIcon topic={item} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-semibold text-white sm:text-[17px]">{option.title}</span>
                          <span className="mt-0.5 block text-[13px] leading-5 text-slate-400 sm:text-[14px]">{option.description}</span>
                        </span>
                        <span className="text-[34px] font-light leading-none text-[#69a9ff]">{isRtl ? "‹" : "›"}</span>
                      </button>
                    );
                  })}
                </div>

                {selected ? (
                  <section className="mt-5 rounded-[24px] border border-[#7bb7ff]/25 bg-[#0c1e3e] px-5 py-5">
                    <h3 className="text-[18px] font-semibold text-white">{selected.title}</h3>
                    <p className="mt-2 text-[14px] leading-6 text-slate-300">{selected.body}</p>
                    {topic === "how" ? (
                      <div className="mt-3 grid gap-2">
                        {copy.howSteps.map((step) => (
                          <div key={step} className="rounded-xl bg-white/[0.035] px-3 py-2 text-[13px] leading-5 text-slate-400">{step}</div>
                        ))}
                      </div>
                    ) : null}
                    {ctaHref && selected.cta ? (
                      <a
                        href={ctaHref}
                        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#7bb7ff] px-4 text-[13px] font-bold text-[#07142f] transition hover:bg-[#9bc8ff]"
                      >
                        {selected.cta}
                      </a>
                    ) : null}
                  </section>
                ) : null}

                {chatMessages.length ? (
                  <div className="mt-5 grid gap-3">
                    {chatMessages.map((message) => {
                      if (message.role === "user") {
                        return (
                          <div key={message.id} className="flex justify-end">
                            <div className="max-w-[82%] rounded-[20px] rounded-br-md bg-[#7bb7ff] px-4 py-3 text-[14px] leading-5 text-[#07142f]">
                              {message.text}
                            </div>
                          </div>
                        );
                      }

                      const reply = copy.replies[message.topic];
                      const messageCtaHref =
                        message.topic === "buy"
                          ? localizedPublicPath(locale, "precios")
                          : message.topic === "privacy"
                            ? legalPath(locale, "privacy")
                            : message.topic === "contact" || message.topic === "scam" || message.topic === "unknown"
                              ? localizedPublicPath(locale, "contacto")
                              : null;

                      return (
                        <div key={message.id} className="flex justify-start">
                          <div className="max-w-[92%] rounded-[20px] rounded-bl-md border border-[#7bb7ff]/20 bg-[#0c1e3e] px-4 py-3">
                            <p className="text-[14px] font-semibold text-white">{reply.title}</p>
                            <p className="mt-1 text-[14px] leading-6 text-slate-300">{reply.body}</p>
                            {message.topic === "how" ? (
                              <div className="mt-3 grid gap-2">
                                {copy.howSteps.map((step) => (
                                  <div key={step} className="rounded-xl bg-white/[0.035] px-3 py-2 text-[13px] leading-5 text-slate-400">{step}</div>
                                ))}
                              </div>
                            ) : null}
                            {messageCtaHref && reply.cta ? (
                              <a
                                href={messageCtaHref}
                                className="mt-3 inline-flex min-h-9 items-center justify-center rounded-xl bg-[#7bb7ff] px-3 text-[12px] font-bold text-[#07142f] transition hover:bg-[#9bc8ff]"
                              >
                                {reply.cta}
                              </a>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <p className="mt-5 px-2 text-center text-[12px] leading-5 text-slate-500">{copy.notAnalysis}</p>
              </div>
            </main>

            <div
              className={[
                "absolute inset-x-0 bottom-0 z-20 sm:px-8",
                compactComposer
                  ? "bg-transparent px-2 py-1"
                  : "bg-[#071126] px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3",
              ].join(" ")}
            >
              <div
                className={[
                  "mx-auto flex w-full max-w-[760px] items-center gap-2 border border-[#7bb7ff]/25 bg-[#091a35] shadow-[0_-14px_40px_rgba(4,10,24,.34)]",
                  compactComposer ? "rounded-[17px] p-1" : "rounded-[22px] p-2",
                ].join(" ")}
              >
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitMessage();
                    }
                  }}
                  className={[
                    "min-w-0 flex-1 bg-transparent px-3 text-[15px] text-white outline-none placeholder:text-slate-600",
                    compactComposer ? "py-2" : "py-3",
                  ].join(" ")}
                  placeholder={copy.input}
                  aria-label={copy.input}
                  name="vonu-chat-message"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="sentences"
                  autoCorrect="on"
                  spellCheck
                  enterKeyHint="send"
                />
                <button
                  type="button"
                  onClick={submitMessage}
                  className={[
                    "grid shrink-0 place-items-center rounded-full bg-[#7bb7ff] text-[#07142f] transition hover:bg-[#9bc8ff] active:scale-95",
                    compactComposer ? "h-9 w-9" : "h-11 w-11",
                  ].join(" ")}
                  aria-label={copy.send}
                  title={copy.send}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
