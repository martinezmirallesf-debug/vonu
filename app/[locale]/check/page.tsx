import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CheckClient from "./CheckClient";
import LanguageSelectorCustom from "./LanguageSelectorCustom";
import HeroTitleAccent from "./HeroTitleAccent";
import "./check.css";
import "./check-polish.css";
import "./language-tight.css";
import "./language-custom.css";
import "./hero-title-fix.css";
import { isSupportedLocale, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const siteUrl = "https://vonuai.com";

type Props = {
  params: Promise<{ locale: string }>;
};

const meta: Record<SupportedLocale, { title: string; description: string }> = {
  es: {
    title: "Analizar URL, captura o mensaje — Vonu Check",
    description: "Comprueba URLs, capturas de pantalla y mensajes sospechosos para detectar señales de phishing, fraude y suplantación antes de actuar.",
  },
  en: {
    title: "Check a URL, screenshot or message — Vonu Check",
    description: "Analyse URLs, screenshots and suspicious messages for phishing, fraud and impersonation signals before you act.",
  },
  fr: {
    title: "Analyser une URL, capture ou message — Vonu Check",
    description: "Analysez URLs, captures d’écran et messages suspects pour repérer des signaux de phishing, fraude et usurpation avant d’agir.",
  },
  de: {
    title: "URL, Screenshot oder Nachricht prüfen — Vonu Check",
    description: "Analysiere URLs, Screenshots und verdächtige Nachrichten auf Phishing-, Betrugs- und Identitätsmissbrauchssignale, bevor du handelst.",
  },
  ar: {
    title: "فحص رابط أو لقطة شاشة أو رسالة — Vonu Check",
    description: "حلّل الروابط ولقطات الشاشة والرسائل المشبوهة لاكتشاف إشارات التصيد والاحتيال والانتحال قبل أن تتصرف.",
  },
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
      title: selected.title,
      description: selected.description,
    },
    twitter: {
      card: "summary_large_image",
      title: selected.title,
      description: selected.description,
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

  return (
    <>
      <CheckClient locale={locale} />
      <LanguageSelectorCustom locale={locale} />
      <HeroTitleAccent locale={locale} />
    </>
  );
}
