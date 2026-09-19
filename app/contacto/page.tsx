import type { Metadata } from "next";
import ContactPublicPage from "../components/ContactPublicPage";
import { getTopic } from "@/lib/vonu-global/i18n";
import { localizedLanguageAlternates, localizedPublicPath } from "@/lib/vonu-global/routes";

const siteUrl = "https://vonuai.com";
const selected = getTopic("es", "contacto");
const canonical = localizedPublicPath("es", "contacto");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: selected.title,
  description: selected.description,
  alternates: {
    canonical,
    languages: localizedLanguageAlternates("contacto"),
  },
  openGraph: {
    title: selected.title,
    description: selected.description,
    url: `${siteUrl}${canonical}`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: selected.title,
    description: selected.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactPublicPage locale="es" />;
}
