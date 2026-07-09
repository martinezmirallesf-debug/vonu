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
      className="inline-block whitespace-nowrap align-baseline"
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

function MainCaseTitle({ title }: { title: string }) {
  if (title === "SMS, WhatsApp o email sospechoso") {
    return (
      <>
        SMS, WhatsApp o email{" "}
        <GradientText tone="orangeRed">sospechoso</GradientText>
      </>
    );
  }

  if (title === "Web o enlace antes de pagar") {
    return (
      <>
        Web o enlace{" "}
        <GradientText tone="blueCyan">antes de pagar</GradientText>
      </>
    );
  }

  if (title === "Tienda online que no conoces") {
    return (
      <>
        Tienda online que{" "}
        <GradientText tone="blueGreen">no conoces</GradientText>
      </>
    );
  }

  if (title === "Contrato antes de firmar") {
    return (
      <>
        Contrato{" "}
        <GradientText tone="amberOrange">antes de firmar</GradientText>
      </>
    );
  }

  if (title === "Factura, recibo o cobro raro") {
    return (
      <>
        Factura, recibo o{" "}
        <GradientText tone="green">cobro raro</GradientText>
      </>
    );
  }

  if (title === "Mensaje que te presiona o te hace dudar") {
    return (
      <>
        Mensaje que te{" "}
        <GradientText tone="purplePink">hace dudar</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function ExtraCaseTitle({ title }: { title: string }) {
  if (title === "Analizar un PDF o documento") {
    return (
      <>
        Analizar un <GradientText tone="blueCyan">PDF o documento</GradientText>
      </>
    );
  }

  if (title === "Preparar una respuesta difícil") {
    return (
      <>
        Preparar una <GradientText tone="purplePink">respuesta difícil</GradientText>
      </>
    );
  }

  if (title === "Estudiar o entender un ejercicio") {
    return (
      <>
        Estudiar o entender un <GradientText tone="green">ejercicio</GradientText>
      </>
    );
  }

  if (title === "Revisar una decisión importante") {
    return (
      <>
        Revisar una <GradientText tone="amberOrange">decisión importante</GradientText>
      </>
    );
  }

  if (title === "Orientación responsable en salud") {
    return (
      <>
        Orientación responsable en <GradientText tone="blueGreen">salud</GradientText>
      </>
    );
  }

  if (title === "Ayuda a familiares o mayores") {
    return (
      <>
        Ayuda a familiares o <GradientText tone="orangeRed">mayores</GradientText>
      </>
    );
  }

  return <>{title}</>;
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
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1180px] text-center">
            <h1 className="mx-auto max-w-[1120px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[122px]">
              Casos reales
              <span className="block text-zinc-500">
                donde <GradientText tone="blueCyan">Vonu puede ayudarte.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Usa VonuAI cuando tengas dudas antes de abrir un enlace, pagar,
              firmar, contestar, reclamar o tomar una decisión importante.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Probar Vonu</span>
                <ArrowIcon />
              </Link>

              <a
                href="#principales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver casos</span>
                <span className="hidden sm:inline">Ver casos principales</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 md:grid-cols-3">
            <div className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Antes de pagar
              </p>
              <p className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                Comprueba <GradientText tone="blueGreen">webs</GradientText>.
              </p>
            </div>

            <div className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Antes de contestar
              </p>
              <p className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                Revisa <GradientText tone="orangeRed">mensajes</GradientText>.
              </p>
            </div>

            <div className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Antes de firmar
              </p>
              <p className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                Entiende <GradientText tone="amberOrange">contratos</GradientText>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="principales" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Casos principales
              </p>

              <h2 className="mt-3 max-w-4xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Para cuando algo no encaja
                <span className="block text-zinc-500">
                  y prefieres <GradientText tone="blueGreen">revisar antes.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Cada caso lleva a una guía práctica y a un CTA para analizarlo
              directamente con Vonu.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mainCases.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[340px] flex-col rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  {item.eyebrow}
                </p>

                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <MainCaseTitle title={item.title} />
                </h3>

                <p className="mt-5 flex-1 text-[15.5px] leading-7 text-zinc-600">
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

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Más situaciones
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
              No todo es fraude.
              <span className="block text-zinc-500">
                A veces solo necesitas <GradientText tone="purplePink">claridad.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para esos momentos en los que una decisión parece
              pequeña, pero equivocarte puede complicarte mucho la vida.
            </p>
          </div>

          <div className="grid gap-4">
            {extraCases.map((item) => (
              <article
                key={item.title}
                className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)] transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.045em] text-zinc-950">
                  <ExtraCaseTitle title={item.title} />
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Una pausa antes de actuar
              <span className="block text-zinc-400">
                puede <GradientText tone="green">ahorrarte un problema.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Vonu no pretende decidir por ti. Te ayuda a ver mejor qué tienes
              delante antes de dar el siguiente paso.
            </p>
          </div>

          <div className="grid gap-4">
            {moments.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[30px] border border-white/10 bg-white/[0.06] p-5 text-[15.5px] leading-7 text-zinc-200 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <span className="shrink-0 text-white">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Preguntas frecuentes
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[54px] font-semibold leading-[0.9] tracking-[-0.075em] text-zinc-950 sm:text-[82px]">
              Dudas sobre
              <span className="block text-zinc-500">casos de uso</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)] transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[20px] font-semibold leading-tight tracking-[-0.04em] text-zinc-950 sm:text-[24px]">
                      {faq.q}
                    </span>

                    <span className="text-[38px] font-light leading-none text-zinc-500 transition group-open:rotate-45 group-open:text-zinc-950 sm:text-[44px]">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
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
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            ¿Tienes una situación concreta?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Cuéntasela a Vonu. Puede ayudarte a revisar señales, ordenar el
            contexto y decidir con más calma.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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