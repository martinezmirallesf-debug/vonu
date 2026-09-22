import "./globals.css";
import "./global-navigation-fix.css";
import "katex/dist/katex.min.css";
import "./vonu-blue-theme.css";
import "./vonu-blue-uniform.css";
import "./check-experience-polish.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FunnelTelemetry from "./components/FunnelTelemetry";
import CheckResultConversion from "./components/CheckResultConversion";
import CheckExperienceController from "./components/CheckExperienceController";
import DocumentLocaleSync from "./components/DocumentLocaleSync";
import RouteScrollTop from "./components/RouteScrollTop";

const BASE_URL = "https://vonuai.com";
const BRAND_ASSET_VERSION = "20260918-trinode";
const FAVICON_VERSION = "20260918-trinode-v2";
const SOCIAL_IMAGE = `${BASE_URL}/api/og?v=${BRAND_ASSET_VERSION}`;

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
    default: "Vonü — Comprueba antes de confiar",
    template: "%s | Vonü",
  },
  description:
    "Vonü analiza URLs, capturas de pantalla y mensajes sospechosos para detectar señales de phishing, fraude y suplantación antes de que pagues, respondas o compartas datos.",
  applicationName: "Vonü",
  manifest: "/install-vonu.webmanifest?v=1",
  authors: [{ name: "Vonü", url: BASE_URL }],
  creator: "Vonü",
  publisher: "Vonü",
  category: "security",
  appleWebApp: {
    capable: true,
    title: "Vonü",
    statusBarStyle: "black-translucent",
  },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: `/icon.svg?v=${FAVICON_VERSION}`, type: "image/svg+xml" },
      { url: `/api/icon?v=${FAVICON_VERSION}`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `/icon.svg?v=${FAVICON_VERSION}`,
    apple: [{ url: `/api/icon?v=${FAVICON_VERSION}`, type: "image/png", sizes: "512x512" }],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "Vonü",
    title: "Vonü — Comprueba antes de confiar",
    description: "Analiza URLs, capturas y mensajes sospechosos para detectar señales de riesgo antes de actuar.",
    images: [
      {
        url: `/api/og?v=${BRAND_ASSET_VERSION}`,
        width: 1200,
        height: 630,
        alt: "Vonü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vonü — Comprueba antes de confiar",
    description: "Analiza URLs, capturas y mensajes sospechosos para detectar señales de riesgo antes de actuar.",
    images: [`/api/og?v=${BRAND_ASSET_VERSION}`],
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
  themeColor: "#020b24",
};

const entityGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Vonü",
      alternateName: "VonüAI",
      url: BASE_URL,
      description:
        "Vonü develops preventive tools that analyse risk signals in websites, links, screenshots and suspicious messages.",
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/icon.svg`,
        contentUrl: `${BASE_URL}/icon.svg`,
        caption: "Vonü",
      },
      email: "hello@vonuai.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@vonuai.com",
        availableLanguage: ["Spanish", "English", "French", "German", "Arabic"],
      },
      knowsLanguage: ["es", "en", "fr", "de", "ar"],
      knowsAbout: [
        "phishing",
        "online fraud",
        "website risk analysis",
        "suspicious links",
        "smishing",
        "impersonation scams",
        "fake profiles",
        "online shopping scams",
        "investment scams",
        "cryptocurrency scams",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Vonü",
      alternateName: "VonüAI",
      url: BASE_URL,
      description:
        "Preventive tool for analysing suspicious URLs, screenshots and messages before a user pays, replies or shares data.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: ["es", "en", "fr", "de", "ar"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${spaceMono.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta property="og:image" content={SOCIAL_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Vonü — comprueba antes de confiar" />
        <meta name="twitter:image" content={SOCIAL_IMAGE} />
        <meta name="twitter:image:alt" content="Vonü — comprueba antes de confiar" />
        <style>{`
          #vonu-app-launch { display: none; }
          @media (display-mode: standalone) {
            #vonu-app-launch {
              position: fixed;
              inset: 0;
              z-index: 2147483647;
              display: grid;
              place-items: center;
              background: #020b24;
              opacity: 1;
              pointer-events: none;
              transition: opacity 160ms ease-out;
            }
            #vonu-app-launch.vonu-app-launch--hide {
              opacity: 0;
            }
            #vonu-app-launch svg {
              width: 94px;
              height: 94px;
              display: block;
            }
          }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var retryKey = 'vonu-client-recovery:' + window.location.pathname;

  function recoveryMessage(value) {
    try {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (value.message) return String(value.message);
      return String(value);
    } catch (_) {
      return '';
    }
  }

  function isStaleAssetFailure(value) {
    var message = recoveryMessage(value);
    return /ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module|Importing a module script failed|_next\\/static\\/chunks/i.test(message);
  }

  function recoverOnce() {
    try {
      var now = Date.now();
      var previous = Number(window.sessionStorage.getItem(retryKey) || '0');
      if (previous && now - previous < 60000) return;
      window.sessionStorage.setItem(retryKey, String(now));
    } catch (_) {}

    window.setTimeout(function () {
      window.location.reload();
    }, 60);
  }

  function reportClientError(kind, value, source, line, column) {
    try {
      var message = recoveryMessage(value);
      var stack = value && value.stack ? String(value.stack) : '';
      var fingerprint = kind + ':' + window.location.pathname + ':' + message.slice(0, 180);
      var reportKey = 'vonu-client-error-reported:' + fingerprint;
      if (window.sessionStorage.getItem(reportKey)) return;
      window.sessionStorage.setItem(reportKey, '1');

      window.fetch('/api/client-error', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          message: message,
          stack: stack,
          path: window.location.pathname,
          source: source || '',
          line: line || null,
          column: column || null
        })
      }).catch(function () {});
    } catch (_) {}
  }

  window.addEventListener('error', function (event) {
    var target = event && event.target;
    var scriptSource = target && target.tagName === 'SCRIPT' ? target.src : '';
    var value = event && (event.error || event.message);
    reportClientError('error', value, event && event.filename, event && event.lineno, event && event.colno);
    if (isStaleAssetFailure(value) || /_next\\/static\\/chunks/.test(scriptSource || '')) {
      recoverOnce();
    }
  }, true);

  window.addEventListener('unhandledrejection', function (event) {
    reportClientError('rejection', event && event.reason, '', null, null);
    if (isStaleAssetFailure(event && event.reason)) recoverOnce();
  }, true);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js?v=clean-install-1', { scope: '/', updateViaCache: 'none' })
      .catch(function () {});
  }

  function finishLaunch() {
    var launch = document.getElementById('vonu-app-launch');
    if (!launch) return;
    launch.classList.add('vonu-app-launch--hide');
    window.setTimeout(function () {
      if (launch) {
        launch.style.display = 'none';
        launch.setAttribute('aria-hidden', 'true');
      }
    }, 180);
  }

  window.addEventListener('load', function () {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        window.setTimeout(finishLaunch, 80);
      });
    });
  }, { once: true });
})();
`,
          }}
        />
      </head>
      <body className="font-sans">
        <div id="vonu-app-launch" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" focusable="false">
            <g fill="#7bb7ff">
              <circle cx="24.6" cy="8.7" r="7.2" />
              <circle cx="8.6" cy="20.1" r="7.2" />
              <circle cx="25.1" cy="31.1" r="7.2" />
              <circle cx="18.7" cy="20.1" r="5.9" />
              <path d="M12.8 16.3 19.7 10.9 24.8 15.4 20.8 20.1 25.4 25.5 20.7 30.1 14.2 23.8Z" />
            </g>
          </svg>
        </div>
        <DocumentLocaleSync />
        <RouteScrollTop />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
        <FunnelTelemetry />
        <CheckResultConversion />
        {children}
        <CheckExperienceController />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
