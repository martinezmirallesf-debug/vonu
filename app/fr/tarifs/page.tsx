import type { Metadata } from "next";
import GlobalPublicHeader from "@/app/components/GlobalPublicHeader";
import HomeFooter from "@/app/components/HomeFooter";
import DevicePricingPage from "@/app/components/DevicePricingPage";

const siteUrl = "https://vonuai.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tarifs — Vonu",
  description: "1 analyse gratuite par navigateur ou appareil, puis 3 analyses supplémentaires pour 3,99 € en paiement unique.",
  alternates: {
    canonical: "/fr/tarifs",
    languages: { es: `${siteUrl}/precios`, en: `${siteUrl}/en/pricing`, fr: `${siteUrl}/fr/tarifs`, de: `${siteUrl}/de/preise`, ar: `${siteUrl}/ar/pricing`, "x-default": `${siteUrl}/precios` },
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <><GlobalPublicHeader locale="fr" slug="precios" /><DevicePricingPage locale="fr" /><HomeFooter /></>;
}
