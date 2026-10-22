import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

import InlineTrustAnalyzer from "../components/InlineTrustAnalyzer";
import DeviceAccessGate from "../components/DeviceAccessGate";
import TrustSeoAuthoritySection from "../components/TrustSeoAuthoritySection";
import { phpSecurityLanguageAlternates } from "@/lib/vonu-global/php-security";


const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Seguridad PHP: ¿tu web utiliza una versión vulnerable? | Vonü",
  description: "Seguridad PHP explicada: qué vulnerabilidades pueden existir, cómo comprobar versiones y qué señales externas revisa Vonü.",
  alternates: {
    canonical: "/seguridad-php",
    languages: phpSecurityLanguageAlternates(),
    
  },
  openGraph: {
    title: "Seguridad PHP: riesgos, versiones y qué comprobar | Vonü",
    description: "Guía de seguridad PHP y comprobación de señales externas sin prometer un escaneo de vulnerabilidades.",
    url: `${siteUrl}/seguridad-php`,
    siteName: "VonüAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seguridad PHP: riesgos, versiones y qué comprobar | Vonü",
    description: "Comprende las vulnerabilidades PHP y revisa señales externas con Vonü.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  { title: "PHP sin actualizar", text: "Las versiones de PHP sin soporte pueden acumular fallos conocidos. Comprueba la versión desde el panel del alojamiento." },
  { title: "Versión no visible", text: "Desde fuera normalmente no podemos saber qué versión utiliza una web. No conocerla no significa que sea segura ni vulnerable." },
  { title: "HTTPS no es suficiente", text: "El candado cifra la conexión, pero no demuestra que PHP o las aplicaciones estén actualizados." },
  { title: "Plugins y extensiones", text: "Una web puede usar PHP actualizado y tener fallos en plugins, temas o dependencias." },
  { title: "Avisos virales", text: "Una noticia sobre una vulnerabilidad no significa que todas las webs PHP estén afectadas. Contrasta las condiciones oficiales." },
  { title: "Datos personales", text: "Antes de pagar o introducir contraseñas, comprueba identidad y reputación, además de las señales técnicas." },
];

const checklist = [
  "PHP es una tecnología habitual: usarla no significa ser vulnerable.",
  "Vonü revisa señales externas, no versiones internas de PHP.",
  "HTTPS no garantiza que el servidor esté actualizado.",
  "No aparecer en una lista de malware no descarta vulnerabilidades.",
  "Si administras la web, consulta la versión de PHP en el hosting.",
  "Contrasta las versiones soportadas y avisos en PHP.net.",
  "Antes de actualizar, haz copias de seguridad y pruebas.",
];

const commonCases = [
  { title: "Compras en una tienda", text: "Revisa quién está detrás, contacto y medios de pago. Un análisis de fraude no certifica el servidor." },
  { title: "Administras WordPress", text: "Comprueba PHP, plugins, temas y actualizaciones en el panel de alojamiento." },
  { title: "Lees una noticia viral", text: "Consulta la fuente oficial, las versiones afectadas y las medidas de tu proveedor." },
  { title: "Recibes un enlace sospechoso", text: "Revisa el dominio y el contexto antes de compartir datos. Phishing y fallos PHP son riesgos distintos." },
];

const mistakes = [
  "Afirmar que una web es vulnerable sin conocer versión y configuración.",
  "Confundir ausencia de malware conocido con una auditoría PHP.",
  "Pensar que HTTPS protege contra todos los fallos internos.",
  "Actualizar sin copia de seguridad ni pruebas.",
  "Suponer que una noticia viral afecta a todos los sitios PHP.",
];

const faqs = [
  { q: "¿Qué es PHP?", a: "PHP es una tecnología utilizada para crear páginas y aplicaciones web. Como cualquier software, puede contener fallos de seguridad." },
  { q: "¿Vonü detecta vulnerabilidades PHP?", a: "Vonü comprueba señales visibles y, si la web publica una versión completa de PHP, puede contrastarla con avisos CVE conocidos. Son coincidencias potenciales, no vulnerabilidades confirmadas. No verifica la versión instalada internamente ni realiza pruebas de explotación." },
  { q: "¿Cómo sé si una web utiliza PHP vulnerable?", a: "Si la administras, consulta la versión en tu hosting y compárala con los avisos oficiales. Como visitante normalmente no puedes verificarlo desde fuera." },
  { q: "¿HTTPS garantiza que una web sea segura?", a: "No. HTTPS cifra la conexión, pero no demuestra que el servidor o sus componentes estén actualizados." },
  { q: "¿Riesgo bajo significa que no hay vulnerabilidades?", a: "No. La puntuación de Vonü refleja señales externas observables, no una auditoría de seguridad interna." },
  { q: "¿Qué hago si tengo PHP sin soporte?", a: "Consulta con tu proveedor, haz una copia de seguridad, planifica una actualización y comprueba que la web funciona después." },
];

const verificationChecks = [
  { title: "Comprueba si administras la web", text: "Un visitante revisa señales externas; un administrador puede consultar la configuración real." },
  { title: "Identifica la versión de PHP", text: "Utiliza el panel del alojamiento o pide ayuda al proveedor; evita exponer archivos de diagnóstico." },
  { title: "Consulta el soporte oficial", text: "Comprueba versiones soportadas y avisos en php.net." },
  { title: "Revisa todo el software", text: "Incluye CMS, plugins, extensiones, temas y dependencias." },
  { title: "Actualiza con precaución", text: "Realiza copias de seguridad y pruebas de compatibilidad." },
  { title: "Interpreta bien Vonü", text: "Una conexión cifrada y una lista de malware sin coincidencias no prueban ausencia de vulnerabilidades." },
  { title: "Actúa según tu situación", text: "Si visitas la web, verifica identidad y pagos. Si la administras, consulta a tu proveedor." },
];

const officialSources = [
  { name: "PHP.net · versiones soportadas", text: "Tabla oficial de versiones y soporte de PHP.", href: "https://www.php.net/supported-versions.php" },
  { name: "PHP.net · seguridad", text: "Información oficial de seguridad de PHP.", href: "https://www.php.net/security" },
  { name: "INCIBE-CERT", text: "Avisos y recursos de ciberseguridad.", href: "https://www.incibe.es/incibe-cert" },
];

const relatedGuides = [
  { title: "Cómo saber si una web es fiable", text: "Señales de fraude y reputación.", href: "/comprobar-web-fiable" },
  { title: "Analizar un enlace sospechoso", text: "Revisa enlaces recibidos por mensajes.", href: "/analizar-link-sospechoso" },
  { title: "Comprobar una tienda online", text: "Comprueba antes de comprar.", href: "/comprobar-tienda-online" },
];

type GradientTone =
  | "blueGreen"
  | "blueCyan"
  | "green"
  | "orangeRed"
  | "purplePink"
  | "amberOrange";

const gradientMap: Record<GradientTone, string> = {
  blueGreen: "linear-gradient(90deg, #0A84FF 0%, #22C55E 100%)",
  blueCyan: "linear-gradient(90deg, #1A73E8 0%, #06B6D4 100%)",
  green: "linear-gradient(90deg, #0A8F3C 0%, #34D399 100%)",
  orangeRed: "linear-gradient(90deg, #F97316 0%, #EF4444 100%)",
  purplePink: "linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)",
  amberOrange: "linear-gradient(90deg, #F59E0B 0%, #F97316 100%)",
};

function GradientText({
  children,
  tone,
}: {
  children: ReactNode;
  tone: GradientTone;
}) {
  return (
    <span
      className="inline align-baseline"
      style={{
        backgroundImage: gradientMap[tone],
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 12h13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningTitle({ title }: { title: string }) { return <>{title}</>; }

function CommonCaseTitle({ title }: { title: string }) { return <>{title}</>; }

export default function SeguridadPhpPage() {

  const pageUrl = `${siteUrl}/seguridad-php`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Seguridad PHP: guía para usuarios",
        description: "Guía práctica de seguridad PHP, versiones, riesgos y límites de las comprobaciones externas.",
        inLanguage: "es-ES",
        dateModified: "2026-10-22",
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#checks` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vonü", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Recursos", item: `${siteUrl}/recursos` },
          { "@type": "ListItem", position: 3, name: "Seguridad PHP: guía para usuarios", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#checks`,
        name: "7 pasos para revisar la seguridad PHP",
        numberOfItems: verificationChecks.length,
        itemListElement: verificationChecks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#030b25] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .php-authority-theme section { background: #030b25; }
        .php-authority-theme section > div > div { background: #101c3c; border-color: #273858; border-radius: 28px; }
        .php-authority-theme h2, .php-authority-theme h3 { color: #fff; }
        .php-authority-theme p { color: #cbd5e1; }
        .php-authority-theme li, .php-authority-theme a { background: #172448; border-color: #273858; border-radius: 18px; }
        .php-authority-theme li > span { background: #1a73e8; border-radius: 12px; color: #fff; }
        .php-authority-theme a span:first-child { color: #fff; }
        .php-authority-theme a span:last-child { color: #79b4ff; }
        .php-authority-theme .border-t { border-color: #273858; }
      `}</style>
      <HomeHeader />

      <section className="relative overflow-hidden bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1080px] text-[clamp(2.65rem,9vw,7.25rem)] font-semibold leading-[1.04] tracking-[-0.065em] text-white sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Seguridad web.
              <span className="block"><GradientText tone="blueCyan">¿PHP vulnerable?</GradientText></span>
              <span className="mt-3 block text-[0.55em] leading-[1.1] tracking-[-0.04em] text-slate-300">Qué puedes comprobar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-slate-300 sm:text-[21px]">
              Muchas webs utilizan PHP. Aprende a reconocer los riesgos de versiones desactualizadas, qué puede comprobarse desde fuera y cómo actuar sin falsas alarmas.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="#analizador"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[14px] bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Comprobar web</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-[14px] border border-white/10 bg-[#101c3c] px-4 py-3 text-[14px] font-semibold text-slate-100 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver qué revisar</span>
              </a>
            </div>
          </div>

          <InlineTrustAnalyzer locale="es" intent="website" />
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-[#101c3c] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#79b4ff]">
                  Respuesta rápida
                </p>

                <h2 className="mt-4 text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-white sm:text-[72px]">
                  ¿Tu web usa PHP?
                  <span className="block text-slate-400">
                    <GradientText tone="blueCyan">No significa que sea vulnerable.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-slate-300">
                  Una vulnerabilidad depende de la versión, la configuración y otros componentes. Vonü analiza señales externas, pero no identifica de forma fiable la versión interna de PHP.
                </p>
              </div>

              <div className="grid gap-4">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-[22px] border border-white/10 bg-[#030b25] p-5 text-[15.5px] leading-7 text-slate-200"
                  >
                    <span className="shrink-0 text-white">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="senales" className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#79b4ff]">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-white sm:text-[72px]">
                Seguridad PHP:
                <span className="block text-slate-400">
                  <GradientText tone="blueCyan">6 claves importantes.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-slate-300">
              Una noticia viral no demuestra que todas las webs PHP estén afectadas. Hay que contrastar fuentes y versiones.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[240px] rounded-[24px] border border-white/10 bg-[#101c3c] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
                  <WarningTitle title={item.title} />
                </h3>

                <p className="mt-5 text-[15.5px] leading-7 text-slate-300">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25] text-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Casos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Cada situación
              <span className="block text-zinc-400">
                necesita <GradientText tone="blueCyan">una respuesta.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Un visitante y un administrador necesitan comprobaciones diferentes. Aquí explicamos cuáles.
            </p>
          </div>

          <div className="grid gap-4">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-[#101c3c] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <CommonCaseTitle title={item.title} />
                </h3>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#79b4ff]">
                Errores a evitar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-white sm:text-[72px]">
                Una buena puntuación
                <span className="block text-slate-400">
                  no es una <GradientText tone="blueCyan">auditoría PHP.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-slate-300">
                Un resultado de riesgo bajo puede coexistir con problemas internos que Vonü no puede ver desde fuera.
              </p>
            </div>

            <div className="grid gap-4">
              {mistakes.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[22px] border border-white/10 bg-[#101c3c] p-5 text-[15.5px] leading-7 text-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)]"
                >
                  <span className="shrink-0 text-[#79b4ff]">
                    <RedXIcon />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="php-authority-theme">
      <TrustSeoAuthoritySection
        eyebrow="Comprobación verificable"
        title="Cómo revisar la seguridad PHP, paso a paso."
        intro="Los propietarios deben consultar las versiones y los avisos oficiales. Vonü revisa señales externas, pero no realiza un escaneo de vulnerabilidades PHP."
        updatedAt="22 de octubre de 2026"
        checks={verificationChecks}
        sources={officialSources}
        related={relatedGuides}
      />
      </div>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#79b4ff]">
              Preguntas frecuentes
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[54px] font-semibold leading-[0.9] tracking-[-0.075em] text-white sm:text-[82px]">
              Dudas sobre
              <span className="block text-slate-400">seguridad PHP</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[22px] border border-white/10 bg-[#101c3c] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)] transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[20px] font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[24px]">
                      {faq.q}
                    </span>

                    <span className="text-[38px] font-light leading-none text-slate-400 transition group-open:rotate-45 group-open:text-white sm:text-[44px]">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-4 text-[15.5px] leading-7 text-slate-300">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      

      <section className="bg-[#030b25] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Comprueba las señales. Entiende sus límites.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega una URL para revisar señales externas. Para saber si PHP está actualizado, consulta el servidor o pregunta a tu proveedor.
          </p>

          <Link
            href="#analizador"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#101c3c] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar una URL con Vonü
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <DeviceAccessGate locale="es" />
      <HomeFooter />
    </main>
  );
}