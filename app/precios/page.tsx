import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Precios — VonuAI",
  description:
    "Planes de VonuAI: empieza gratis y mejora cuando necesites más mensajes, voz y análisis de documentos.",
  alternates: {
    canonical: "/precios",
  },
  openGraph: {
    title: "Precios — VonuAI",
    description:
      "Elige el plan de VonuAI que mejor encaje contigo: Free, Plus o Max.",
    url: `${siteUrl}/precios`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precios — VonuAI",
    description:
      "Planes para usar VonuAI con mensajes, voz y análisis de archivos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const plans = [
  {
    name: "Free",
    price: "0€",
    period: "/ mes",
    description: "Para probar Vonu y resolver dudas puntuales.",
    badge: null,
    cta: "Empezar gratis",
    highlighted: false,
    features: [
      "Mensajes limitados",
      "Acceso al chat",
      "Análisis preventivo básico",
      "Ideal para probar Vonu",
    ],
  },
  {
    name: "Plus",
    price: "9,99€",
    period: "/ mes",
    description: "Para usar Vonu con más frecuencia y acceso a voz.",
    badge: "Popular",
    cta: "Probar Plus",
    highlighted: true,
    features: [
      "Más mensajes al mes",
      "Modo conversación",
      "Análisis de imágenes y PDFs",
      "Más margen para dudas importantes",
    ],
  },
  {
    name: "Max",
    price: "19,99€",
    period: "/ mes",
    description: "Más margen para documentos y análisis dentro de los límites del plan",
    badge: null,
    cta: "Probar Max",
    highlighted: false,
    features: [
      "Más mensajes mensuales",
      "Más minutos de voz",
      "Uso intensivo de documentos",
      "Prioridad en nuevas funciones",
    ],
  },
];

const topups = [
  {
    name: "Recarga básica",
    price: "2,99€",
    description: "Para resolver unas cuantas dudas más sin cambiar de plan.",
    cta: "Añadir recarga",
    features: [
      "Ideal para consultas puntuales",
      "Más margen para mensajes importantes",
      "Útil si solo necesitas un pequeño extra",
    ],
    highlighted: false,
  },
  {
    name: "Recarga media",
    price: "6,99€",
    description: "Para seguir usando Vonu durante el mes con más tranquilidad.",
    cta: "Añadir recarga",
    features: [
      "Más margen para documentos y mensajes",
      "Pensada para varios análisis adicionales",
      "Buena opción si estás revisando varios temas",
    ],
    highlighted: true,
  },
  {
    name: "Recarga grande",
    price: "14,99€",
    description: "Para momentos en los que necesitas apoyarte más en Vonu.",
    cta: "Añadir recarga",
    features: [
      "Más margen para uso intensivo puntual",
      "Útil en semanas con muchas decisiones",
      "Más espacio para voz, archivos y análisis",
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    q: "¿Puedo usar Vonu gratis?",
    a: "Sí. Puedes empezar gratis para probar cómo analiza una duda real, un mensaje sospechoso o una situación que quieras entender mejor antes de actuar.",
  },
  {
    q: "¿Qué gano al mejorar a Plus o Max?",
    a: "Los planes de pago están pensados para usar Vonu con más calma: más mensajes, acceso a voz y más margen para revisar documentos, imágenes o situaciones importantes durante el mes.",
  },
  {
    q: "¿Qué pasa si agoto mis mensajes?",
    a: "Si necesitas seguir usando Vonu antes de que se renueve tu plan, podrás añadir una recarga. Así no tienes que cambiar de plan si solo necesitas un extra puntual.",
  },
  {
    q: "¿Cómo funciona la voz?",
    a: "La voz te permite explicar una situación de forma más natural, como si estuvieras hablando con alguien que te ayuda a ordenar lo que pasa. Es especialmente útil cuando hay muchos detalles o necesitas estudiar paso a paso.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Podrás gestionar tu suscripción desde la zona de usuario o el portal de pagos. La idea es que tengas control claro sobre tu plan, sin complicaciones.",
  },
  {
    q: "¿Vonu sustituye a profesionales?",
    a: "No. Vonu no sustituye a abogados, médicos, psicólogos, asesores fiscales ni otros profesionales. Lo que sí hace es ayudarte a identificar riesgos, ordenar la información, preparar mejores preguntas y acompañarte en los siguientes pasos.",
  },
];

const responsibleItems = [
  "Te ayuda a detectar señales de riesgo antes de tomar una decisión importante.",
  "Te acompaña con próximos pasos claros cuando no sabes si frenar, revisar o actuar.",
  "Puede ayudarte a preparar preguntas, ordenar información y entender mejor una situación.",
  "Está pensado para darte claridad sin sustituir a profesionales cuando el caso lo requiera.",
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

function PlanName({ name }: { name: string }) {
  if (name === "Free") {
    return <GradientText tone="blueCyan">Free</GradientText>;
  }

  if (name === "Plus") {
    return <GradientText tone="blueGreen">Plus</GradientText>;
  }

  if (name === "Max") {
    return <GradientText tone="purplePink">Max</GradientText>;
  }

  return <>{name}</>;
}

function TopupName({ name }: { name: string }) {
  if (name === "Recarga básica") {
    return (
      <>
        Recarga <GradientText tone="blueCyan">básica</GradientText>
      </>
    );
  }

  if (name === "Recarga media") {
    return (
      <>
        Recarga <GradientText tone="blueGreen">media</GradientText>
      </>
    );
  }

  if (name === "Recarga grande") {
    return (
      <>
        Recarga <GradientText tone="purplePink">grande</GradientText>
      </>
    );
  }

  return <>{name}</>;
}

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/precios#webpage`,
        url: `${siteUrl}/precios`,
        name: "Precios — VonuAI",
        description:
          "Planes de VonuAI para empezar gratis y mejorar cuando necesites más mensajes, voz y análisis de documentos.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/precios#faq`,
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
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1080px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[118px]">
              Elige cómo quieres
              <span className="block text-zinc-500">
                usar <GradientText tone="blueGreen">Vonu.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Empieza gratis y mejora cuando necesites más mensajes, voz,
              análisis de archivos y margen para decisiones importantes.
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
                href="#planes"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Ver planes
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-5 sm:p-7">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Empieza
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em] text-zinc-950">
                      Gratis
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-600">
                      Prueba Vonu con una duda real antes de elegir plan.
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-zinc-950 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                      Más usado
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em]">
                      Plus
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-300">
                      Más mensajes, voz y margen para revisar lo importante.
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Extra
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em] text-zinc-950">
                      Recargas
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-600">
                      Añade margen puntual sin cambiar de plan mensual.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center text-[12px] leading-6 text-zinc-500">
                  Los límites concretos de mensajes, voz y archivos se muestran durante
                  el proceso de contratación o dentro de tu zona de usuario.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Planes
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Empieza gratis.
                <span className="block text-zinc-500">
                  Amplía cuando lo <GradientText tone="blueGreen">necesites.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Elige el nivel de uso según cuántas decisiones, documentos,
              mensajes o conversaciones quieras revisar durante el mes.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "relative flex h-full flex-col overflow-hidden rounded-[38px] border p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]",
                  plan.highlighted
                    ? "border-zinc-900 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-950",
                ].join(" ")}
              >
                {plan.highlighted && (
                  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
                )}

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className={[
                        "text-[42px] font-semibold leading-none tracking-[-0.07em]",
                        plan.highlighted ? "text-white" : "text-zinc-950",
                      ].join(" ")}
                    >
                      <PlanName name={plan.name} />
                    </h3>

                    <p
                      className={[
                        "mt-4 text-[15.5px] leading-7",
                        plan.highlighted ? "text-zinc-300" : "text-zinc-600",
                      ].join(" ")}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {plan.badge && (
                    <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-zinc-950 shadow-sm">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="relative mt-8 flex items-end gap-1">
                  <span
                    className={[
                      "text-[58px] font-semibold leading-none tracking-[-0.078em]",
                      plan.highlighted ? "text-white" : "text-zinc-950",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={[
                      "pb-2 text-[14px]",
                      plan.highlighted ? "text-zinc-400" : "text-zinc-500",
                    ].join(" ")}
                  >
                    {plan.period}
                  </span>
                </div>

                <div className="relative mt-8 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className={[
                        "flex gap-4 text-[15.5px] leading-7",
                        plan.highlighted ? "text-zinc-200" : "text-zinc-700",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "shrink-0",
                          plan.highlighted ? "text-white" : "text-zinc-950",
                        ].join(" ")}
                      >
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/chat"
                  className={[
                    "relative mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-semibold transition hover:scale-[1.01] active:scale-[0.99]",
                    plan.highlighted
                      ? "bg-white text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)]"
                      : "bg-zinc-950 text-white shadow-sm",
                  ].join(" ")}
                >
                  {plan.cta}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Recargas
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Cuando necesitas
                <span className="block text-zinc-500">
                  seguir usando <GradientText tone="purplePink">Vonu.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Si agotas tu plan mensual, podrás añadir mensajes o minutos extra
              sin tener que esperar al siguiente ciclo.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {topups.map((topup) => (
              <article
                key={topup.name}
                className={[
                  "flex h-full flex-col rounded-[38px] border p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]",
                  topup.highlighted
                    ? "border-blue-200 bg-white"
                    : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[34px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950">
                      <TopupName name={topup.name} />
                    </h3>

                    <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
                      {topup.description}
                    </p>
                  </div>

                  {topup.highlighted && (
                    <span className="rounded-full bg-[#1a73e8] px-3 py-1 text-[12px] font-semibold text-white shadow-sm">
                      Equilibrada
                    </span>
                  )}
                </div>

                <div className="mt-8 text-[52px] font-semibold leading-none tracking-[-0.075em] text-zinc-950">
                  {topup.price}
                </div>

                <div className="mt-8 flex-1 space-y-4">
                  {topup.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-4 text-[15.5px] leading-7 text-zinc-700"
                    >
                      <span className="shrink-0 text-zinc-950">
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/chat"
                  className={[
                    "mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-semibold transition hover:scale-[1.01] active:scale-[0.99]",
                    topup.highlighted
                      ? "bg-[#1a73e8] text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)]"
                      : "bg-zinc-950 text-white shadow-sm",
                  ].join(" ")}
                >
                  {topup.cta}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Uso responsable
            </p>

            <h2 className="mt-3 text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Claridad cuando más
              <span className="block text-zinc-400">
                cuesta <GradientText tone="blueCyan">decidir.</GradientText>
              </span>
            </h2>
          </div>

          <div className="grid gap-4">
            {responsibleItems.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[30px] border border-white/10 bg-white/[0.06] p-6 text-[15.5px] leading-7 text-zinc-200 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
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
              Dudas frecuentes
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[54px] font-semibold leading-[0.9] tracking-[-0.075em] text-zinc-950 sm:text-[82px]">
              Precios y
              <span className="block text-zinc-500">suscripción</span>
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

      <ResourceSignup page="precios" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Empieza gratis. Desbloquea más cuando lo necesites.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Prueba Vonu con una duda real. Si te ayuda a ganar claridad, puedes
            ampliar mensajes, voz y análisis para seguir revisando lo importante
            con más calma.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Probar Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}