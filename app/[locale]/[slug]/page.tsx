import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalizedPublicPage from "@/app/components/LocalizedPublicPage";
import {
  INDEXED_PUBLIC_SLUGS,
  getTopic,
  isGlobalLocale,
  isIndexedPublicSlug,
  languageAlternates,
  publicPath,
} from "@/lib/vonu-global/i18n";

const SITE_URL = "https://vonuai.com";
const NON_SPANISH = ["en", "fr", "de", "ar"] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return NON_SPANISH.flatMap((locale) =>
    INDEXED_PUBLIC_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isGlobalLocale(locale) || locale === "es" || !isIndexedPublicSlug(slug)) return {};

  const topic = getTopic(locale, slug);
  const canonical = publicPath(locale, slug);
  const ogLocale = locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "ar";

  return {
    metadataBase: new URL(SITE_URL),
    title: topic.title,
    description: topic.description,
    alternates: {
      canonical,
      languages: languageAlternates(slug),
    },
    openGraph: {
      type: "website",
      siteName: "Vonu",
      url: `${SITE_URL}${canonical}`,
      locale: ogLocale,
      title: topic.title,
      description: topic.description,
      images: [{ url: "/api/og", width: 1200, height: 630, alt: topic.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: topic.title,
      description: topic.description,
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
  const { locale, slug } = await params;

  if (!isGlobalLocale(locale) || locale === "es" || !isIndexedPublicSlug(slug)) {
    notFound();
  }

  return <LocalizedPublicPage locale={locale} slug={slug} />;
}
