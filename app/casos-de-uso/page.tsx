import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Casos de uso — VonuAI",
  description:
    "Descubre casos de uso de VonuAI: analizar SMS sospechosos, comprobar webs y tiendas online, revisar contratos, facturas, documentos, presión emocional y situaciones delicadas.",
  alternates: {
    canonical: "/casos-de-uso",
  },
  openGraph: {
    title: "Casos de uso — VonuAI",
    description:
      "Situaciones reales donde VonuAI te ayuda a revisar antes de firmar, pagar, contestar o decidir.",
    url: `${siteUrl}/casos-de-uso`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casos de uso — VonuAI",
    description:
      "Casos prácticos para usar VonuAI antes de tomar decisiones importantes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const mainCases = [
  {
    title: "SMS, WhatsApp o email sospechoso",
    eyebrow: "Estafas y phishing",
    text: "Cuando recibes un mensaje raro de un banco, paquete, Hacienda, Bizum, una tienda o alguien que te pide actuar rápido.",
    href: "/analizar-sms-estafa",
    cta: "Analizar mensaje",
  },
  {
    title: "Web o enlace antes de pagar",
    eyebrow: "Seguridad digital",
    text: "Cuando una web parece fiable pero no estás seguro de si conviene meter tarjeta, pagar, registrarte o compartir datos.",
    href: "/comprobar-web-fiable",
    cta: "Comprobar web",
  },
  {
    title: "Tienda online que no conoces",
    eyebrow: "Compras online",
    text: "Cuando ves una oferta demasiado buena, una tienda nueva, un anuncio o una página con métodos de pago poco claros.",
    href: "/comprobar-tienda-online",
    cta: "Comprobar tienda",
  },
  {
    title: "Contrato antes de firmar",
    eyebrow: "Documentos y legal cotidiano",
    text: "Cuando necesitas entender cláusulas, permanencias, penalizaciones, pagos, renovaciones o condiciones importantes.",
    href: "/revisar-contrato",
    cta: "Revisar contrato",
  },
  {
    title: "Factura, recibo o cobro raro",
    eyebrow: "Cobros y reclamaciones",
    text: "Cuando una factura ha subido, aparece un cargo duplicado, un servicio no contratado o un concepto que no entiendes.",
    href: "/comprobar-factura",
    cta: "Comprobar factura",
  },
  {
    title: "Mensaje que te presiona o te hace dudar",
    eyebrow: "Psicología aplicada",
    text: "Cuando alguien te mete culpa, urgencia, miedo o confusión antes de contestar, aceptar o tomar una decisión.",
    href: "/detectar-manipulacion",
    cta: "Analizar situación",
  },
];

const extraCases = [
  {
    title: "Analizar un PDF o documento",
    text: "Sube o pega un texto largo para entender qué dice, qué puntos importan y qué deberías revisar antes de aceptar.",
  },
  {
    title: "Preparar una respuesta difícil",
    text: "Cuando quieres contestar con calma, poner límites, pedir aclaraciones o evitar responder desde presión o enfado.",
  },
  {
    title: "Estudiar o entender un ejercicio",
    text: "Vonu puede ayudarte a explicar conceptos, resolver dudas, resumir apuntes o practicar paso a paso.",
  },
  {
    title: "Revisar una decisión importante",
    text: "Cuando tienes varias opciones y necesitas ordenar riesgos, señales, dudas y próximos pasos antes de actuar.",
  },
  {
    title: "Orientación responsable en salud",
    text: "Para ordenar síntomas o dudas generales con sentido común, detectando señales de urgencia y sin sustituir a profesionales.",
  },
  {
    title: "Ayuda a familiares o mayores",
    text: "Cuando alguien cercano recibe mensajes raros, llamadas sospechosas, facturas confusas o presión para pagar.",
  },
];

const moments = [
  "Antes de pulsar un enlace.",
  "Antes de pagar o meter tarjeta.",
  "Antes de firmar un contrato.",
  "Antes de responder a un mensaje delicado.",
  "Antes de aceptar una oferta.",
  "Antes de reclamar una factura.",
  "Antes de compartir datos personales.",
  "Antes de tomar una decisión con presión.",
];

const faqs = [
  {
    q: "¿Para qué sirve VonuAI?",
    a: "VonuAI sirve para revisar mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir. Ayuda a detectar señales de riesgo y ordenar los siguientes pasos.",
  },
  {
    q: "¿VonuAI solo detecta estafas?",
    a: "No. También puede ayudar con contratos, facturas, documentos, presión emocional, decisiones digitales, estudio y situaciones donde necesitas claridad antes de actuar.",
  },
  {
    q: "¿Puedo usar VonuAI para revisar una web antes de comprar?",
    a: "Sí. Puedes pegar el enlace o explicar lo que ves para que Vonu revise señales de confianza, métodos de pago, urgencia, datos legales y posibles riesgos.",
  },
  {
    q: "¿VonuAI sustituye a un profesional?",
    a: "No. Vonu ofrece orientación preventiva y práctica, pero no sustituye a abogados, médicos, psicólogos, asesores financieros ni servicios de emergencia cuando el caso lo requiere.",
  },
  {
    q: "¿Qué datos no debería compartir?",
    a: "No compartas contraseñas, códigos de verificación, datos bancarios completos, claves de acceso ni información innecesariamente sensible.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CasosDeUsoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/casos-de-uso#webpage`,
        url: `${siteUrl}/casos-de-uso`,
        name: "Casos de uso de VonuAI",
        description:
          "Casos reales para usar VonuAI antes de firmar, pagar, contestar o decidir.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/casos-de-uso#faq`,
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
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px]"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 20%, rgba(248,249,250,0.98) 45%, rgba(239,246,255,0.86) 72%, rgba(248,249,250,0) 100%)",
          }}
        />
        <div className="absolute left-1/2 top-[84px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-blue-500/16 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="mx-auto max-w-6xl text-[52px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[82px] lg:text-[112px]">
              Casos reales donde Vonu puede ayudarte.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Usa VonuAI cuando tengas dudas antes de abrir un enlace, pagar,
              firmar, contestar, reclamar o tomar una decisión importante.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Casos principales
              </p>

              <h2 className="mt-3 max-w-4xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Para cuando algo no encaja y prefieres revisar antes.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Cada caso lleva a una guía práctica y a un CTA para analizarlo
              directamente con Vonu.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mainCases.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[330px] flex-col rounded-[34px] border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  {item.eyebrow}
                </p>

                <h3 className="mt-10 text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950">
                  {item.cta}
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Más situaciones
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
              No todo es fraude. A veces solo necesitas claridad.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para esos momentos en los que una decisión parece
              pequeña, pero equivocarte puede complicarte mucho la vida.
            </p>
          </div>

          <div className="grid gap-3">
            {extraCases.map((item) => (
              <article
                key={item.title}
                className="rounded-[26px] border border-zinc-200 bg-[#f8f9fa] p-5 shadow-sm"
              >
                <h3 className="text-[24px] font-semibold tracking-[-0.045em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Momentos Vonu
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Una pausa antes de actuar puede ahorrarte un problema.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Vonu no pretende decidir por ti. Te ayuda a ver mejor qué tienes
              delante antes de dar el siguiente paso.
            </p>
          </div>

          <div className="grid gap-3">
            {moments.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-[15.5px] leading-7 text-zinc-200"
              >
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-400 text-zinc-950">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Preguntas frecuentes
            </p>

            <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-zinc-950 sm:text-[58px]">
              Dudas habituales sobre casos de uso
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[26px] border border-zinc-200 bg-[#f8f9fa] p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-[18px] font-semibold tracking-[-0.025em] text-zinc-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{faq.q}</span>
                    <span className="text-zinc-400 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="casos-de-uso" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            ¿Tienes una situación concreta?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Cuéntasela a Vonu. Puede ayudarte a revisar señales, ordenar el
            contexto y decidir con más calma.
          </p>

          <Link
            href="/chat"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Abrir Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}