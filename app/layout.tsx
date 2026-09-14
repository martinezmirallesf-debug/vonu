// app/layout.tsx
import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = "https://vonuai.com";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
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
    default: "Vonu — Comprueba antes de confiar",
    template: "%s | Vonu",
  },
  description:
    "Vonu analiza URLs, capturas de pantalla y mensajes sospechosos para detectar señales de phishing, fraude y suplantación antes de que pagues, respondas o compartas datos.",
  applicationName: "Vonu",
  authors: [{ name: "Vonu", url: BASE_URL }],
  creator: "Vonu",
  publisher: "Vonu",
  category: "security",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "Vonu",
    title: "Vonu — Comprueba antes de confiar",
    description: "Analiza URLs, capturas y mensajes sospechosos para detectar señales de riesgo antes de actuar.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Vonu — Comprueba antes de confiar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vonu — Comprueba antes de confiar",
    description: "Analiza URLs, capturas y mensajes sospechosos para detectar señales de riesgo antes de actuar.",
    images: ["/api/og"],
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
  themeColor: "#0b0e17",
};

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Vonu",
      alternateName: "VonuAI",
      url: BASE_URL,
      description:
        "Vonu desarrolla herramientas preventivas para analizar señales de riesgo en webs, enlaces, capturas y mensajes sospechosos.",
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/icon.svg`,
        contentUrl: `${BASE_URL}/icon.svg`,
        caption: "Vonu",
      },
      email: "hello@vonuai.com",
      knowsAbout: [
        "phishing",
        "online fraud",
        "website risk analysis",
        "suspicious links",
        "smishing",
        "impersonation scams",
        "fake profiles",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Vonu",
      alternateName: "VonuAI",
      url: BASE_URL,
      description:
        "Herramienta para analizar URLs, capturas de pantalla y mensajes sospechosos y detectar señales de phishing, fraude y suplantación.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: ["es", "en", "fr", "de", "ar"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceMono.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
