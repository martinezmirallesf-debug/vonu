import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CheckClient from "./CheckClient";
import SubmissionNotice from "./SubmissionNotice";
import CheckCompactFooter from "./CheckCompactFooter";
import DeviceAccessGate from "@/app/components/DeviceAccessGate";
import CheckRuntimeFixes from "@/app/components/CheckRuntimeFixes";
import "./check.css";
import "./check-polish.css";
import "./url-search-icon-size.css";
import "./hero-title-fix.css";
import "./submission-notice.css";
import "./capture-breathe.css";
import "./mobile-header-fix.css";
import "./mobile-menu-visibility-fix.css";
import "./desktop-home-fit.css";
import "./mobile-capture-safe-area.css";
import { isSupportedLocale, localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { localizedPublicPath } from "@/lib/vonu-global/routes";

const siteUrl = "https://vonuai.com";
const BRAND_ASSET_VERSION = "20260917-blue";
const SOCIAL_IMAGE = `/api/og?v=${BRAND_ASSET_VERSION}`;
const isProduction = process.env.VERCEL_ENV === "production";

type Props = {
  params: Promise<{ locale: string }>;
};

const meta: Record<SupportedLocale, { title: string; description: string }> = {
  es: {
    title: "Analizar URL, captura o mensaje sospechoso — Vonu Check",
    description: "Comprueba URLs, capturas de pantalla y mensajes sospechosos para detectar señales de phishing, fraude y suplantación antes de actuar.",
  },
  en: {
    title: "Check a URL, screenshot or suspicious message — Vonu Check",
    description: "Analyse URLs, screenshots and suspicious messages for phishing, fraud and impersonation signals before you act.",
  },
  fr: {
    title: "Analyser une URL, capture ou message suspect — Vonu Check",
    description: "Analysez URLs, captures d’écran et messages suspects pour repérer des signaux de phishing, fraude et usurpation avant d’agir.",
  },
  de: {
    title: "URL, Screenshot oder verdächtige Nachricht prüfen — Vonu Check",
    description: "Analysiere URLs, Screenshots und verdächtige Nachrichten auf Phishing-, Betrugs- und Identitätsmissbrauchssignale, bevor du handelst.",
  },
  ar: {
    title: "فحص رابط أو لقطة شاشة أو رسالة مشبوهة — Vonu Check",
    description: "حلّل الروابط ولقطات الشاشة والرسائل المشبوهة لاكتشاف إشارات التصيد والاحتيال والانتحال قبل أن تتصرف.",
  },
};

const packNames: Record<SupportedLocale, { free: string; paid: string }> = {
  es: { free: "Primer análisis gratuito", paid: "Pack de 3 análisis" },
  en: { free: "First free analysis", paid: "3-analysis pack" },
  fr: { free: "Première analyse gratuite", paid: "Pack de 3 analyses" },
  de: { free: "Erste kostenlose Analyse", paid: "3-Analysen-Paket" },
  ar: { free: "التحليل المجاني الأول", paid: "حزمة 3 تحليلات" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const selected = meta[locale];
  const languages = Object.fromEntries(
    supportedLocales.map((item) => [item, `${siteUrl}/${item}/check`]),
  );

  return {
    title: selected.title,
    description: selected.description,
    category: "security",
    alternates: {
      canonical: `/${locale}/check`,
      languages: {
        ...languages,
        "x-default": `${siteUrl}/check`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Vonu",
      url: `${siteUrl}/${locale}/check`,
      title: selected.title,
      description: selected.description,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: selected.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: selected.title,
      description: selected.description,
      images: [SOCIAL_IMAGE],
    },
    robots: isProduction
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: false,
        },
  };
}

function getCheckJsonLd(locale: SupportedLocale) {
  const selected = meta[locale];
  const pageUrl = `${siteUrl}/${locale}/check`;
  const pricingUrl = `${siteUrl}${localizedPublicPath(locale, "precios")}`;
  const offerNames = packNames[locale];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: selected.title,
        description: selected.description,
        inLanguage: localeMeta[locale].htmlLang,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#vonu-check` },
        publisher: { "@id": `${siteUrl}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}${SOCIAL_IMAGE}`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#vonu-check`,
        name: "Vonu Check",
        url: `${siteUrl}/check`,
        description:
          "Web application that analyses suspicious URLs, screenshots and messages to surface technical and contextual risk signals before a user acts.",
        applicationCategory: "SecurityApplication",
        applicationSubCategory: "Fraud and phishing risk analysis",
        operatingSystem: "Any",
        browserRequirements: "Requires a modern web browser with JavaScript enabled.",
        provider: { "@id": `${siteUrl}/#organization` },
        isAccessibleForFree: true,
        inLanguage: ["es", "en", "fr", "de", "ar"],
        featureList: [
          "Website and URL risk analysis",
          "Screenshot analysis",
          "Suspicious message analysis",
          "Phishing and impersonation signal detection",
          "Technical web security signal analysis",
        ],
        offers: [
          {
            "@type": "Offer",
            name: offerNames.free,
            url: pageUrl,
            price: "0",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: offerNames.paid,
            url: pricingUrl,
            price: "3.99",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
          },
        ],
        potentialAction: {
          "@type": "UseAction",
          target: pageUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Vonu",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Vonu Check",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export default async function LocalizedCheckPage({ params }: Props) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const jsonLd = getCheckJsonLd(locale);

  return (
    <div
      className="vonu-check-page"
      lang={localeMeta[locale].htmlLang}
      dir={localeMeta[locale].dir}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: ".vonu-check-page footer:not(.vonu-check-compact-footer){display:none}" }} />
      <CheckClient locale={locale} />
      <DeviceAccessGate locale={locale} />
      <CheckRuntimeFixes locale={locale} />
      <SubmissionNotice locale={locale} />
      <CheckCompactFooter locale={locale} />
    </div>
  );
}
