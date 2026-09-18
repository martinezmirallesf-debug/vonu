import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalizedLegalDocument, { getLegalPageMeta } from "@/app/components/LocalizedLegalDocument";
import { isGlobalLocale } from "@/lib/vonu-global/i18n";
import { isLegalDocument, legalAlternates } from "@/lib/vonu-legal/routes";

const siteUrl = "https://vonuai.com";
type Props = { params: Promise<{ locale: string; document: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, document } = await params;
  if (!isGlobalLocale(locale) || locale === "es" || !isLegalDocument(document)) return {};
  const meta = getLegalPageMeta(locale, document);
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${locale}/legal/${document}`, languages: legalAlternates(document) },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { locale, document } = await params;
  if (!isGlobalLocale(locale) || locale === "es" || !isLegalDocument(document)) notFound();
  return <LocalizedLegalDocument locale={locale} document={document} />;
}
