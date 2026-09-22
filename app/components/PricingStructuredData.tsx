import type { SupportedLocale } from "@/lib/vonu-check/types";
import { checkPath } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";

const SITE_URL = "https://vonuai.com";

const copy: Record<SupportedLocale, { service: string; free: string; paid: string; description: string }> = {
  es: { service: "Vonü Check", free: "Primer análisis gratuito", paid: "Pack de 3 análisis", description: "Análisis preventivo de URLs, mensajes y capturas para ordenar señales de riesgo antes de actuar." },
  en: { service: "Vonü Check", free: "First free analysis", paid: "3-analysis pack", description: "Preventive analysis of URLs, messages and screenshots to organise risk signals before you act." },
  fr: { service: "Vonü Check", free: "Première analyse gratuite", paid: "Pack de 3 analyses", description: "Analyse préventive d’URLs, messages et captures pour organiser les signaux de risque avant d’agir." },
  de: { service: "Vonü Check", free: "Erste kostenlose Analyse", paid: "3-Analysen-Paket", description: "Präventive Analyse von URLs, Nachrichten und Screenshots, um Risikosignale vor einer Handlung zu ordnen." },
  ar: { service: "Vonü Check", free: "التحليل المجاني الأول", paid: "حزمة 3 تحليلات", description: "تحليل وقائي للروابط والرسائل ولقطات الشاشة لتنظيم إشارات المخاطر قبل التصرف." },
};

export default function PricingStructuredData({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const pricingUrl = `${SITE_URL}${localizedPublicPath(locale, "precios")}`;
  const checkUrl = `${SITE_URL}${checkPath(locale)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pricingUrl}#webpage`,
        url: pricingUrl,
        name: t.service,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: { "@id": `${pricingUrl}#service` },
      },
      {
        "@type": "Service",
        "@id": `${pricingUrl}#service`,
        name: t.service,
        description: t.description,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
        availableLanguage: ["es", "en", "fr", "de", "ar"],
        url: checkUrl,
        offers: [
          {
            "@type": "Offer",
            name: t.free,
            price: "0",
            priceCurrency: "EUR",
            url: checkUrl,
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: t.paid,
            price: "3.99",
            priceCurrency: "EUR",
            url: pricingUrl,
            availability: "https://schema.org/InStock",
          },
        ],
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
