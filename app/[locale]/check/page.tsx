import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CheckClient from "./CheckClient";
import { copy, isSupportedLocale, supportedLocales } from "@/lib/vonu-check/i18n";

const siteUrl = "https://vonuai.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const t = copy[locale];
  const languages = Object.fromEntries(
    supportedLocales.map((item) => [item, `${siteUrl}/${item}/check`]),
  );

  return {
    title: t.pageTitle,
    description: t.pageDescription,
    alternates: {
      canonical: `/${locale}/check`,
      languages: {
        ...languages,
        "x-default": `${siteUrl}/es/check`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Vonu",
      url: `${siteUrl}/${locale}/check`,
      title: t.pageTitle,
      description: t.pageDescription,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LocalizedCheckPage({ params }: Props) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  return <CheckClient locale={locale} />;
}
