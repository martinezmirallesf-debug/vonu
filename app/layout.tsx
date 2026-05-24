// app/layout.tsx
import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Playfair_Display } from "next/font/google";

const BASE_URL = "https://vonuai.com";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "VonuAI — Antes de actuar, pregúntale a Vonu",
    template: "%s | VonuAI",
  },

  description:
    "VonuAI te ayuda a revisar mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir.",

  applicationName: "VonuAI",

  keywords: [
    "VonuAI",
    "Vonu",
    "comprobar web fiable",
    "detectar estafa",
    "analizar SMS sospechoso",
    "revisar contrato",
    "comprobar factura",
    "detectar manipulación",
    "asistente decisiones seguras",
  ],

  authors: [{ name: "VonuAI" }],
  creator: "VonuAI",
  publisher: "VonuAI",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "VonuAI",
    title: "VonuAI — Antes de actuar, pregúntale a Vonu",
    description:
      "Revisa mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VonuAI — Antes de actuar, pregúntale a Vonu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VonuAI — Antes de actuar, pregúntale a Vonu",
    description:
      "Analiza dudas, riesgos y señales de alerta antes de firmar, pagar, contestar o decidir.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VonuAI",
  alternateName: "Vonu",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  email: "hello@vonuai.com",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VonuAI",
  alternateName: "Vonu",
  url: BASE_URL,
  description:
    "VonuAI te ayuda a revisar mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir.",
  inLanguage: "es",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/recursos?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceMono.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}