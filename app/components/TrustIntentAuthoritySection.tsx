import type { SupportedLocale } from "@/lib/vonu-check/types";

type TrustIntent = "comprobar-web-fiable" | "comprobar-tienda-online" | "es-fiable";

type Source = {
  name: string;
  text: string;
  href: string;
};

const COPY: Record<SupportedLocale, {
  eyebrow: string;
  title: Record<TrustIntent, string>;
  text: Record<TrustIntent, string>;
  sources: Source[];
  reviewed: string;
}> = {
  es: {
    eyebrow: "Fuentes y método",
    title: {
      "comprobar-web-fiable": "Comprueba señales que puedas contrastar.",
      "comprobar-tienda-online": "Una tienda fiable se contrasta fuera de su propia web.",
      "es-fiable": "La fiabilidad se decide con varias señales, no con una sola.",
    },
    text: {
      "comprobar-web-fiable": "Vonü combina señales técnicas, identidad, contexto y comportamiento. HTTPS o un diseño profesional no certifican por sí solos que una web sea legítima.",
      "comprobar-tienda-online": "Antes de pagar, contrasta vendedor, dominio, métodos de pago, condiciones y reputación externa. Una señal aislada nunca debe convertirse en un veredicto.",
      "es-fiable": "Primero define qué estás verificando y qué riesgo asumirías si te equivocas. Después contrasta identidad, petición, presión y señales externas.",
    },
    sources: [
      { name: "INCIBE", text: "Recomendaciones públicas sobre fraude, phishing y compra segura.", href: "https://www.incibe.es/ciudadania/tematicas/fraudes-online" },
      { name: "Centro Europeo del Consumidor", text: "Información pública sobre compras y fraudes online.", href: "https://portal-cec.consumo.gob.es/es/informacion-general/compras-online/fraudes-online" },
    ],
    reviewed: "Fuentes revisadas el 6 de octubre de 2026",
  },
  en: {
    eyebrow: "Sources and method",
    title: {
      "comprobar-web-fiable": "Check signals you can independently verify.",
      "comprobar-tienda-online": "A trustworthy store should stand up to checks outside its own website.",
      "es-fiable": "Trustworthiness comes from several independent signals, not one badge.",
    },
    text: {
      "comprobar-web-fiable": "Vonü combines technical, identity, context and behavioural signals. HTTPS or professional design alone does not prove that a website is legitimate.",
      "comprobar-tienda-online": "Before paying, verify the seller, domain, payment method, terms and external reputation. Treat unusually strong discounts and urgency as reasons to check more, not as proof by themselves.",
      "es-fiable": "Start by defining what you are checking and what you could lose if you are wrong. Then verify identity, the requested action, pressure and independent evidence.",
    },
    sources: [
      { name: "UK NCSC", text: "Official guidance on shopping and paying safely online, including fake shops and suspicious links.", href: "https://www.ncsc.gov.uk/guidance/shopping-online-securely" },
      { name: "UK NCSC", text: "Official reporting and recovery guidance for online shopping fraud.", href: "https://www.ncsc.gov.uk/section/respond-recover/citizen-shopping-online" },
    ],
    reviewed: "Sources reviewed 6 October 2026",
  },
  fr: {
    eyebrow: "Sources et méthode",
    title: {
      "comprobar-web-fiable": "Vérifiez des signaux que vous pouvez recouper.",
      "comprobar-tienda-online": "Une boutique fiable doit résister à des vérifications extérieures à son propre site.",
      "es-fiable": "La fiabilité repose sur plusieurs signaux indépendants, pas sur un seul indice.",
    },
    text: {
      "comprobar-web-fiable": "Vonü combine signaux techniques, identité, contexte et comportement. HTTPS ou un design professionnel ne prouvent pas à eux seuls qu’un site est légitime.",
      "comprobar-tienda-online": "Avant de payer, vérifiez vendeur, domaine, paiement, conditions et réputation externe. Une promotion extrême ou l’urgence justifient davantage de vérifications.",
      "es-fiable": "Commencez par définir ce que vous vérifiez et ce que vous risquez en cas d’erreur, puis recoupez identité, demande, pression et preuves externes.",
    },
    sources: [
      { name: "Cybermalveillance.gouv.fr", text: "Conseils publics français pour sécuriser les achats en ligne et éviter les sites frauduleux.", href: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/comment-securiser-ses-achats-sur-internet" },
      { name: "Cybermalveillance.gouv.fr", text: "Ressources officielles consacrées aux achats en ligne et aux cyber-arnaques.", href: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/zoom-sur-les-achats-en-ligne" },
    ],
    reviewed: "Sources vérifiées le 6 octobre 2026",
  },
  de: {
    eyebrow: "Quellen und Methode",
    title: {
      "comprobar-web-fiable": "Prüfe Signale, die sich unabhängig bestätigen lassen.",
      "comprobar-tienda-online": "Ein seriöser Shop sollte auch außerhalb seiner eigenen Website überprüfbar sein.",
      "es-fiable": "Seriosität ergibt sich aus mehreren unabhängigen Signalen, nicht aus einem einzelnen Merkmal.",
    },
    text: {
      "comprobar-web-fiable": "Vonü kombiniert technische Signale, Identität, Kontext und Verhalten. HTTPS oder professionelles Design beweisen allein nicht, dass eine Website legitim ist.",
      "comprobar-tienda-online": "Prüfe vor der Zahlung Anbieter, Domain, Zahlungsart, Bedingungen und externe Reputation. Extrem niedrige Preise oder künstlicher Zeitdruck sind Gründe für zusätzliche Prüfung.",
      "es-fiable": "Definiere zuerst, was du prüfst und welches Risiko ein Fehler hätte. Danach vergleichst du Identität, geforderte Handlung, Druck und unabhängige Hinweise.",
    },
    sources: [
      { name: "BSI", text: "Bundesamt für Sicherheit in der Informationstechnik: Hinweise zu sicheren Onlineshops und Fake-Shops.", href: "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Basisschutz-fuer-Computer-Mobilgeraete/Basisschutz-fuer-Computer/basisschutz-fuer-computer.html?nn=131600" },
      { name: "Verbraucherzentrale", text: "Fakeshop-Finder und Kriterien zur Prüfung unbekannter Onlineshops.", href: "https://www.verbraucherzentrale.de/fakeshopfinder-71560" },
    ],
    reviewed: "Quellen geprüft am 6. Oktober 2026",
  },
  ar: {
    eyebrow: "المصادر والمنهج",
    title: {
      "comprobar-web-fiable": "تحقّق من إشارات يمكنك تأكيدها من مصادر مستقلة.",
      "comprobar-tienda-online": "المتجر الموثوق يجب أن يصمد أمام التحقق خارج موقعه نفسه.",
      "es-fiable": "الموثوقية تُبنى من عدة إشارات مستقلة، لا من علامة واحدة.",
    },
    text: {
      "comprobar-web-fiable": "يجمع Vonü بين الإشارات التقنية والهوية والسياق والسلوك. وجود HTTPS أو تصميم احترافي وحده لا يثبت أن الموقع شرعي.",
      "comprobar-tienda-online": "قبل الدفع تحقّق من البائع والنطاق وطريقة الدفع والشروط والسمعة الخارجية. السعر المنخفض جدًا أو الاستعجال سبب لمزيد من التحقق وليس حكمًا نهائيًا.",
      "es-fiable": "ابدأ بتحديد ما الذي تتحقق منه وما الذي قد تخسره إذا أخطأت، ثم قارن الهوية والإجراء المطلوب والضغط والأدلة الخارجية.",
    },
    sources: [
      { name: "الهيئة الوطنية للأمن السيبراني", text: "حملة «اطلب بأمان» للتوعية بممارسات التسوق الإلكتروني الآمن.", href: "https://nca.gov.sa/ar/cyber-awareness/awareness-campaigns/online-shopping/" },
      { name: "الهيئة الوطنية للأمن السيبراني", text: "إرشادات الأمن السيبراني لمستهلكي وموفري خدمات التجارة الإلكترونية.", href: "https://nca.gov.sa/ar/regulatory-documents/guidelines-list/cgec/" },
    ],
    reviewed: "تمت مراجعة المصادر في 6 أكتوبر 2026",
  },
};

export default function TrustIntentAuthoritySection({
  locale,
  slug,
}: {
  locale: SupportedLocale;
  slug: TrustIntent;
}) {
  const t = COPY[locale];

  return (
    <section className="border-b border-white/[0.06] bg-[#0a0d15]">
      <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          {t.eyebrow}
        </p>
        <div className="mt-4 grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-[36px] font-semibold leading-[1.03] tracking-[-0.05em] text-white sm:text-[52px]">
              {t.title[slug]}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-400">
              {t.text[slug]}
            </p>
            <p className="mt-4 text-[11px] text-slate-600">{t.reviewed}</p>
          </div>

          <div className="grid gap-3">
            {t.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-5 transition hover:-translate-y-[1px] hover:border-sky-300/20 hover:bg-white/[0.05]"
              >
                <p className="text-[15px] font-semibold text-white">{source.name}</p>
                <p className="mt-2 text-[13px] leading-6 text-slate-400">{source.text}</p>
                <span className="mt-3 inline-block text-[12px] font-semibold text-sky-300">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
