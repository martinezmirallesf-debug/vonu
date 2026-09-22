import type { Metadata } from "next";
import IntentPublicPage from "@/app/components/IntentPublicPage";
import { getTopic } from "@/lib/vonu-global/i18n";
import { localizedLanguageAlternates, localizedPublicPath } from "@/lib/vonu-global/routes";
import type { IntentSlug } from "@/lib/vonu-global/intent-content";

const SITE_URL = "https://vonuai.com";
const slug = "comprobar-factura" satisfies IntentSlug;
const topic = getTopic("es", slug);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: topic.title,
  description: topic.description,
  alternates: {
    canonical: localizedPublicPath("es", slug),
    languages: localizedLanguageAlternates(slug),
  },
  openGraph: {
    type: "website",
    siteName: "Vonü",
    url: `${SITE_URL}${localizedPublicPath("es", slug)}`,
    locale: "es_ES",
    title: topic.title,
    description: topic.description,
  },
  twitter: {
    card: "summary_large_image",
    title: topic.title,
    description: topic.description,
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <IntentPublicPage locale="es" slug={slug} />;
}
