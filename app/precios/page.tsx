import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import DevicePricingPage from "../components/DevicePricingPage";
import PricingStructuredData from "../components/PricingStructuredData";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Precios — Vonü",
  description: "1 análisis gratuito por navegador o dispositivo. Después, 3 análisis adicionales por 3,99 € con un pago único.",
  alternates: {
    canonical: "/precios",
    languages: {
      es: `${siteUrl}/precios`,
      en: `${siteUrl}/en/pricing`,
      fr: `${siteUrl}/fr/tarifs`,
      de: `${siteUrl}/de/preise`,
      ar: `${siteUrl}/ar/pricing`,
      "x-default": `${siteUrl}/precios`,
    },
  },
  openGraph: {
    title: "Precios — Vonü",
    description: "Prueba un análisis gratis. Si necesitas más, compra 3 análisis por 3,99 € sin suscripción.",
    url: `${siteUrl}/precios`,
    siteName: "Vonü",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PricingPage() {
  return (
    <>
      <PricingStructuredData locale="es" />
      <HomeHeader />
      <DevicePricingPage locale="es" />
      <HomeFooter />
    </>
  );
}
