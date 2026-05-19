import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

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
    description: "Para uso intensivo, más voz y más margen mensual.",
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

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px]"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 22%, rgba(248,249,250,0.98) 45%, rgba(239,246,255,0.82) 70%, rgba(248,249,250,0) 100%)",
          }}
        />
        <div className="absolute left-1/2 top-[74px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-500/16 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mx-auto max-w-4xl text-[52px] font-semibold leading-[0.92] tracking-[-0.075em] text-zinc-950 sm:text-[78px] lg:text-[104px]">
              Elige cómo quieres usar Vonu.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Empieza gratis y mejora cuando necesites más mensajes, voz,
              análisis de archivos y margen para decisiones importantes.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
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
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "flex h-full flex-col rounded-[34px] border p-6 shadow-sm",
                  plan.highlighted
                    ? "border-blue-200 bg-blue-50 shadow-[0_20px_52px_rgba(26,115,232,0.14)]"
                    : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[30px] font-semibold tracking-[-0.055em] text-zinc-950">
                      {plan.name}
                    </h2>
                    <p className="mt-2 text-[15.5px] leading-7 text-zinc-600">
                      {plan.description}
                    </p>
                  </div>

                  {plan.badge && (
                    <span className="rounded-full bg-[#1a73e8] px-3 py-1 text-[12px] font-semibold text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mt-7 flex items-end gap-1">
                  <span className="text-[52px] font-semibold tracking-[-0.07em] text-zinc-950">
                    {plan.price}
                  </span>
                  <span className="pb-2 text-[14px] text-zinc-500">
                    {plan.period}
                  </span>
                </div>

                <div className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-[15px] text-zinc-700"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-blue-600 shadow-sm">
                        <CheckIcon />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href="/chat"
                  className={[
                    "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition",
                    plan.highlighted
                      ? "bg-[#1a73e8] text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] hover:scale-[1.01]"
                      : "bg-zinc-950 text-white shadow-sm hover:scale-[1.01]",
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

      <section className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Recargas
              </p>
              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Para cuando necesitas seguir usando Vonu.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Si agotas tu plan mensual, podrás añadir mensajes o minutos extra
              sin tener que esperar al siguiente ciclo.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
  {topups.map((topup) => (
    <article
      key={topup.name}
      className={[
        "flex h-full flex-col rounded-[34px] border p-6 shadow-sm",
        topup.highlighted
          ? "border-blue-200 bg-blue-50 shadow-[0_20px_52px_rgba(26,115,232,0.12)]"
          : "border-zinc-200 bg-[#f8f9fa]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[25px] font-semibold tracking-[-0.045em] text-zinc-950">
            {topup.name}
          </h3>

          <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
            {topup.description}
          </p>
        </div>

        {topup.highlighted && (
          <span className="rounded-full bg-[#1a73e8] px-3 py-1 text-[12px] font-semibold text-white">
            Equilibrada
          </span>
        )}
      </div>

      <div className="mt-6 text-[44px] font-semibold tracking-[-0.065em] text-zinc-950">
        {topup.price}
      </div>

      <div className="mt-6 flex-1 space-y-3">
        {topup.features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 text-[15px] text-zinc-700"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-blue-600 shadow-sm">
              <CheckIcon />
            </span>
            {feature}
          </div>
        ))}
      </div>

      <Link
        href="/chat"
        className={[
          "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition",
          topup.highlighted
            ? "bg-[#1a73e8] text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] hover:scale-[1.01]"
            : "bg-zinc-950 text-white shadow-sm hover:scale-[1.01]",
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
            <h2 className="mt-3 text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Claridad cuando más cuesta decidir.
            </h2>
          </div>

          <div className="grid gap-3">
            {[
  "Te ayuda a detectar señales de riesgo antes de tomar una decisión importante.",
  "Te acompaña con próximos pasos claros cuando no sabes si frenar, revisar o actuar.",
  "Puede ayudarte a preparar preguntas, ordenar información y entender mejor una situación.",
  "Está pensado para darte claridad sin sustituir a profesionales cuando el caso lo requiera.",
].map((item) => (
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

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Dudas frecuentes
            </p>
            <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-zinc-950 sm:text-[58px]">
              Precios y suscripción
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm"
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


      <ResourceSignup page="precios" />
            <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-4xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] text-zinc-950 sm:text-[74px]">
  Empieza gratis. Desbloquea más cuando lo necesites.
</h2>

<p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-600">
  Prueba Vonu con una duda real. Si te ayuda a ganar claridad, puedes ampliar
  mensajes, voz y análisis para seguir revisando lo importante con más calma.
</p>

          <Link
            href="/chat"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] active:scale-[0.99]"
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