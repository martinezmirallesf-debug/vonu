import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

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
    a: "VonuAI sirve para revisar mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir. Ayuda a detectar posibles señales de riesgo y ordenar los siguientes pasos.",
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

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline"
      style={{
        backgroundImage:
          "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
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
      <path d="M5 12h13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
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
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-190px] -z-10 h-[640px] w-[920px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[125px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[320px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1040px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Casos de uso
            </p>
            <h1 className="mx-auto mt-5 max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              Para cuando algo
              <span className="block text-slate-400">
                no encaja y quieres <GradientText>revisarlo.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Usa VonuAI antes de abrir un enlace, pagar, firmar, contestar, reclamar o tomar una decisión importante cuando todavía te quedan dudas.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>
              <a
                href="#principales"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.07] active:translate-y-0"
              >
                Ver casos principales
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-[1040px] gap-4 md:grid-cols-3">
            {[
              ["Antes de pagar", "Comprueba webs."],
              ["Antes de contestar", "Revisa mensajes."],
              ["Antes de firmar", "Entiende contratos."],
            ].map(([label, text]) => (
              <div
                key={label}
                className="min-h-[210px] rounded-[24px] border border-white/[0.07] bg-white/[0.035] p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                  {label}
                </p>
                <p className="mt-14 text-[30px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[34px]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principales" className="relative border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Casos principales
              </p>
              <h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
                Seis momentos para
                <span className="block text-slate-500">comprobar antes de confiar.</span>
              </h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">
              Cada caso parte de una situación cotidiana y te lleva a una guía práctica para revisar señales antes de actuar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mainCases.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
                    {item.eyebrow}
                  </p>
                  <span className="text-[11px] font-semibold text-slate-600">0{index + 1}</span>
                </div>
                <h3 className="mt-10 max-w-[300px] text-[28px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-[31px]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[340px] text-[14px] leading-7 text-slate-400">
                  {item.text}
                </p>
                <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300 transition group-hover:text-white">
                  {item.cta}
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] bg-[#080b12]">
        <div className="pointer-events-none absolute left-[-220px] top-[140px] h-[420px] w-[420px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Más situaciones
            </p>
            <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              No todo es fraude.
              <span className="block text-slate-500">A veces necesitas claridad.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">
              Vonu también sirve para ordenar decisiones, documentos y conversaciones cuando equivocarte puede complicarte el siguiente paso.
            </p>
          </div>

          <div className="grid gap-3">
            {extraCases.map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.045]"
              >
                <h3 className="text-[23px] font-semibold leading-tight tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-slate-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Momentos Vonu
            </p>
            <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Una pausa antes de actuar
              <span className="block text-slate-500">puede ahorrarte un problema.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">
              Vonu no pretende decidir por ti. Te ayuda a ver mejor qué tienes delante antes de dar el siguiente paso.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {moments.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5 text-[14px] leading-7 text-slate-300"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Preguntas frecuentes
            </p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Dudas sobre <span className="text-slate-500">casos de uso.</span>
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-slate-100 sm:text-[19px]">
                      {faq.q}
                    </span>
                    <span className="text-[30px] font-light leading-none text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">
                      +
                    </span>
                  </div>
                </summary>
                <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-slate-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="casos-de-uso" />

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">
              ¿Tienes una situación concreta?
              <span className="block text-slate-500">Revísala antes de actuar.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-8 text-slate-400">
              Cuéntasela a Vonu. Puede ayudarte a revisar señales, ordenar el contexto y decidir con más calma.
            </p>
            <Link
              href="/chat"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0"
            >
              Abrir Vonu
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
