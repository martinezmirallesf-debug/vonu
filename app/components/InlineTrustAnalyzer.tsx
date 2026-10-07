import CheckClient from "@/app/[locale]/check/CheckClient";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export type TrustAnalyzerIntent = "website" | "online_store" | "generic";

type Copy = {
  eyebrow: string;
  title: Record<TrustAnalyzerIntent, string>;
  description: Record<TrustAnalyzerIntent, string>;
};

const COPY: Record<SupportedLocale, Copy> = {
  es: {
    eyebrow: "Vonü Check · analiza gratis",
    title: {
      website: "Comprueba una web antes de confiar.",
      online_store: "Comprueba una tienda antes de pagar.",
      generic: "Comprueba lo que te genera dudas.",
    },
    description: {
      website: "Pega la URL y Vonü revisará dominio, conexión, redirecciones, antigüedad, reputación disponible, identidad visible y otras señales antes de que introduzcas datos o pagues.",
      online_store: "Pega la URL de la tienda y Vonü revisará dominio, identidad visible, contacto, señales de pago, reputación disponible y otros indicadores útiles antes de comprar.",
      generic: "Pega un enlace, sube una captura, añade un mensaje o carga un documento. Vonü revisará las señales disponibles antes de que pagues, respondas, firmes o compartas datos.",
    },
  },
  en: {
    eyebrow: "Vonü Check · analyse for free",
    title: {
      website: "Check a website before you trust it.",
      online_store: "Check an online store before you pay.",
      generic: "Check what is making you unsure.",
    },
    description: {
      website: "Paste the URL and Vonü will review the domain, connection, redirects, domain age, available reputation data, visible identity and other signals before you enter data or pay.",
      online_store: "Paste the store URL and Vonü will review the domain, visible identity, contact details, payment signals, available reputation data and other useful indicators before you buy.",
      generic: "Paste a link, upload a screenshot, add a message or load a document. Vonü will review the available signals before you pay, reply, sign or share data.",
    },
  },
  fr: {
    eyebrow: "Vonü Check · analyse gratuite",
    title: {
      website: "Vérifiez un site avant de lui faire confiance.",
      online_store: "Vérifiez une boutique avant de payer.",
      generic: "Vérifiez ce qui vous fait douter.",
    },
    description: {
      website: "Collez l’URL et Vonü vérifiera le domaine, la connexion, les redirections, l’ancienneté du domaine, les données de réputation disponibles, l’identité visible et d’autres signaux avant de saisir des données ou de payer.",
      online_store: "Collez l’URL de la boutique et Vonü vérifiera le domaine, l’identité visible, les contacts, les signaux de paiement, les données de réputation disponibles et d’autres indicateurs utiles avant d’acheter.",
      generic: "Collez un lien, importez une capture, ajoutez un message ou chargez un document. Vonü vérifiera les signaux disponibles avant que vous payiez, répondiez, signiez ou partagiez des données.",
    },
  },
  de: {
    eyebrow: "Vonü Check · kostenlos analysieren",
    title: {
      website: "Prüfe eine Website, bevor du ihr vertraust.",
      online_store: "Prüfe einen Onlineshop, bevor du zahlst.",
      generic: "Prüfe, was dir Zweifel macht.",
    },
    description: {
      website: "Füge die URL ein. Vonü prüft Domain, Verbindung, Weiterleitungen, Domainalter, verfügbare Reputationsdaten, sichtbare Identität und weitere Signale, bevor du Daten eingibst oder zahlst.",
      online_store: "Füge die Shop-URL ein. Vonü prüft Domain, sichtbare Identität, Kontaktangaben, Zahlungssignale, verfügbare Reputationsdaten und weitere hilfreiche Hinweise, bevor du kaufst.",
      generic: "Füge einen Link ein, lade einen Screenshot hoch, füge eine Nachricht hinzu oder lade ein Dokument. Vonü prüft die verfügbaren Signale, bevor du zahlst, antwortest, unterschreibst oder Daten teilst.",
    },
  },
  ar: {
    eyebrow: "Vonü Check · حلّل مجانًا",
    title: {
      website: "تحقّق من الموقع قبل أن تثق به.",
      online_store: "تحقّق من المتجر قبل أن تدفع.",
      generic: "تحقّق مما يثير شكك.",
    },
    description: {
      website: "الصق الرابط وسيقوم Vonü بمراجعة النطاق والاتصال وإعادة التوجيه وعمر النطاق وبيانات السمعة المتاحة والهوية الظاهرة وإشارات أخرى قبل إدخال بياناتك أو الدفع.",
      online_store: "الصق رابط المتجر وسيقوم Vonü بمراجعة النطاق والهوية الظاهرة وبيانات الاتصال وإشارات الدفع وبيانات السمعة المتاحة ومؤشرات أخرى مفيدة قبل الشراء.",
      generic: "الصق رابطًا أو ارفع لقطة شاشة أو أضف رسالة أو حمّل مستندًا. سيراجع Vonü الإشارات المتاحة قبل أن تدفع أو ترد أو توقّع أو تشارك بيانات.",
    },
  },
};

export default function InlineTrustAnalyzer({
  locale,
  intent,
}: {
  locale: SupportedLocale;
  intent: TrustAnalyzerIntent;
}) {
  const t = COPY[locale];
  const generic = intent === "generic";

  return (
    <div id="analizador" className="vonu-check-page mx-auto mt-10 max-w-[1040px] scroll-mt-24 sm:mt-14">
      <CheckClient
        locale={locale}
        initialMode="url"
        embedded
        allowedModes={generic ? ["url", "capture", "text", "document"] : ["url"]}
        embeddedEyebrow={t.eyebrow}
        embeddedTitle={t.title[intent]}
        embeddedDescription={t.description[intent]}
      />
    </div>
  );
}
