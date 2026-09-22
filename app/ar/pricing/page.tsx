import type { Metadata } from "next";
import GlobalPublicHeader from "@/app/components/GlobalPublicHeader";
import HomeFooter from "@/app/components/HomeFooter";
import DevicePricingPage from "@/app/components/DevicePricingPage";

const siteUrl = "https://vonuai.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "الأسعار — Vonü",
  description: "تحليل مجاني واحد لكل متصفح أو جهاز، ثم 3 تحليلات إضافية مقابل 3.99 € بدفعة واحدة.",
  alternates: {
    canonical: "/ar/pricing",
    languages: { es: `${siteUrl}/precios`, en: `${siteUrl}/en/pricing`, fr: `${siteUrl}/fr/tarifs`, de: `${siteUrl}/de/preise`, ar: `${siteUrl}/ar/pricing`, "x-default": `${siteUrl}/precios` },
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <><GlobalPublicHeader locale="ar" slug="precios" /><DevicePricingPage locale="ar" /><HomeFooter /></>;
}
