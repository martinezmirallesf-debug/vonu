import type { Metadata } from "next";
import GlobalPublicHeader from "@/app/components/GlobalPublicHeader";
import HomeFooter from "@/app/components/HomeFooter";
import DevicePricingPage from "@/app/components/DevicePricingPage";

const siteUrl = "https://vonuai.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Preise — Vonu",
  description: "1 kostenlose Analyse pro Browser oder Gerät, danach 3 zusätzliche Analysen für 3,99 € als Einmalzahlung.",
  alternates: {
    canonical: "/de/preise",
    languages: { es: `${siteUrl}/precios`, en: `${siteUrl}/en/pricing`, fr: `${siteUrl}/fr/tarifs`, de: `${siteUrl}/de/preise`, ar: `${siteUrl}/ar/pricing`, "x-default": `${siteUrl}/precios` },
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <><GlobalPublicHeader locale="de" slug="precios" /><DevicePricingPage locale="de" /><HomeFooter /></>;
}
