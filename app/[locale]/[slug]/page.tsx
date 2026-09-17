import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalizedPublicPage from "@/app/components/LocalizedPublicPage";
import IntentPublicPage from "@/app/components/IntentPublicPage";
import DevicePricingPage from "@/app/components/DevicePricingPage";
import PricingStructuredData from "@/app/components/PricingStructuredData";
import GlobalPublicHeader from "@/app/components/GlobalPublicHeader";
import HomeFooter from "@/app/components/HomeFooter";
import {
  INDEXED_PUBLIC_SLUGS,
  getTopic,
  isGlobalLocale,
} from "@/lib/vonu-global/i18n";
import { isIntentSlug } from "@/lib/vonu-global/intent-content";
import {
  localizedLanguageAlternates,
  localizedPublicPath,
  localizedRouteSlug,
  resolveInternalSlug,
} from "@/lib/vonu-global/routes";

const SITE_URL = "https://vonuai.com";
const NON_SPANISH = ["en", "fr", "de", "ar"] as const;

const pricingMeta = {
  en: {
    title: "Pricing — Vonu",
    description: "1 free analysis per browser or device, then 3 additional analyses for €3.99 as a one-time payment. No subscription.",
  },
  fr: {
    title: "Tarifs — Vonu",
    description: "1 analyse gratuite par navigateur ou appareil, puis 3 analyses supplémentaires pour 3,99 € en paiement unique. Sans abonnement.",
  },
  de: {
    title: "Preise — Vonu",
    description: "1 kostenlose Analyse pro Browser oder Gerät, danach 3 zusätzliche Analysen für 3,99 € als Einmalzahlung. Kein Abo.",
  },
  ar: {
    title: "الأسعار — Vonu",
    description: "تحليل مجاني واحد لكل متصفح أو جهاز، ثم 3 تحليلات إضافية مقابل 3.99 € بدفعة واحدة، بدون اشتراك.",
  },
} as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return NON_SPANISH.flatMap((locale) =>
    INDEXED_PUBLIC_SLUGS.map((slug) => ({
      locale,
      slug: localizedRouteSlug(locale, slug),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug: routeSlug } = await params;
  if (!isGlobalLocale(locale) || locale === "es") return {};

  const slug = resolveInternalSlug(locale, routeSlug);
  if (!slug) return {};

  const canonical = localizedPublicPath(locale, slug);
  const ogLocale = locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "ar";
  const selected = slug === "precios" ? pricingMeta[locale] : getTopic(locale, slug);

  return {
    metadataBase: new URL(SITE_URL),
    title: selected.title,
    description: selected.description,
    alternates: {
      canonical,
      languages: localizedLanguageAlternates(slug),
    },
    openGraph: {
      type: "website",
      siteName: "Vonu",
      url: `${SITE_URL}${canonical}`,
      locale: ogLocale,
      title: selected.title,
      description: selected.description,
      images: [{ url: "/api/og", width: 1200, height: 630, alt: selected.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: selected.title,
      description: selected.description,
      images: ["/api/og"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function GlobalLocalizedPage({ params }: Props) {
  const { locale, slug: routeSlug } = await params;

  if (!isGlobalLocale(locale) || locale === "es") {
    notFound();
  }

  const slug = resolveInternalSlug(locale, routeSlug);
  if (!slug) notFound();

  if (slug === "precios") {
    return (
      <>
        <PricingStructuredData locale={locale} />
        <GlobalPublicHeader locale={locale} slug="precios" />
        <DevicePricingPage locale={locale} />
        <HomeFooter />
      </>
    );
  }

  if (isIntentSlug(slug)) {
    return <IntentPublicPage locale={locale} slug={slug} />;
  }

  return <LocalizedPublicPage locale={locale} slug={slug} />;
}
