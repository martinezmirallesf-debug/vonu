import type { Metadata } from "next";
import GlobalPublicHeader from "@/app/components/GlobalPublicHeader";
import HomeFooter from "@/app/components/HomeFooter";
import DevicePricingPage from "@/app/components/DevicePricingPage";

const siteUrl = "https://vonuai.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pricing — Vonu",
  description: "1 free analysis per browser or device, then 3 additional analyses for €3.99 as a one-time payment.",
  alternates: {
    canonical: "/en/pricing",
    languages: { es: `${siteUrl}/precios`, en: `${siteUrl}/en/pricing`, fr: `${siteUrl}/fr/tarifs`, de: `${siteUrl}/de/preise`, ar: `${siteUrl}/ar/pricing`, "x-default": `${siteUrl}/precios` },
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <><GlobalPublicHeader locale="en" slug="precios" /><DevicePricingPage locale="en" /><HomeFooter /></>;
}
