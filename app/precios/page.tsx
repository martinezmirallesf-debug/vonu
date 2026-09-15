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
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-190px] -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[120px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[320px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Precios</p>
            <h1 className="mx-auto mt-5 max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              Empieza gratis.
              <span className="block text-slate-400">Amplía cuando <GradientText>lo necesites.</GradientText></span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Elige el margen que necesitas para mensajes, voz, documentos y análisis sin pagar más de la cuenta desde el principio.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/chat" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0">
                Probar Vonu
                <ArrowIcon />
              </Link>
              <a href="#planes" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.07] active:translate-y-0">
                Ver planes
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Planes</p>
              <h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
                Tres niveles.
                <span className="block text-slate-500">La misma idea: claridad.</span>
              </h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">Empieza por lo que necesitas hoy y cambia de nivel cuando el uso real te lo pida.</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={["relative flex min-h-[520px] flex-col rounded-[26px] border p-6 transition", plan.highlighted ? "border-emerald-400/30 bg-emerald-400/[0.055] shadow-[0_26px_80px_rgba(16,185,129,.08)]" : "border-white/[0.07] bg-white/[0.03]"].join(" ")}>
                {plan.badge && <span className="absolute right-5 top-5 rounded-full border border-emerald-300/20 bg-emerald-400/[0.10] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">{plan.badge}</span>}
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{plan.name}</p>
                <div className="mt-8 flex items-end gap-2">
                  <span className="text-[54px] font-semibold leading-none tracking-[-0.07em] text-white">{plan.price}</span>
                  <span className="pb-1 text-[13px] text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-4 min-h-[56px] text-[14px] leading-7 text-slate-400">{plan.description}</p>
                <div className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-[13px] leading-6 text-slate-300">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/chat" className={["mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[14px] font-bold transition", plan.highlighted ? "bg-emerald-400 text-[#07110d] hover:bg-emerald-300" : "border border-white/[0.10] bg-white/[0.045] text-white hover:bg-white/[0.07]"].join(" ")}>
                  {plan.cta}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Recargas</p>
              <h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
                ¿Necesitas un extra?
                <span className="block text-slate-500">Sin cambiar de plan.</span>
              </h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">Añade margen puntual si ese mes tienes más documentos, mensajes o decisiones de lo habitual.</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {topups.map((topup) => (
              <article key={topup.name} className={["flex min-h-[390px] flex-col rounded-[24px] border p-6", topup.highlighted ? "border-sky-400/25 bg-sky-400/[0.045]" : "border-white/[0.07] bg-white/[0.03]"].join(" ")}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">{topup.name}</p>
                <p className="mt-7 text-[44px] font-semibold leading-none tracking-[-0.06em] text-white">{topup.price}</p>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{topup.description}</p>
                <div className="mt-6 space-y-3">
                  {topup.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-[13px] leading-6 text-slate-300">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/chat" className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[13px] font-semibold text-white transition hover:bg-white/[0.07]">
                  {topup.cta}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Uso responsable</p>
            <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Paga por más margen,
              <span className="block text-slate-500">no por falsas certezas.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">Los planes amplían capacidad y formatos. No cambian los límites responsables de Vonu ni sustituyen a profesionales.</p>
          </div>
          <div className="grid gap-3">
            {responsibleItems.map((item) => (
              <div key={item} className="flex gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5 text-[14px] leading-7 text-slate-300">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Preguntas frecuentes</p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Antes de elegir <span className="text-slate-500">tu plan.</span></h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-slate-100 sm:text-[19px]">{faq.q}</span>
                    <span className="text-[30px] font-light leading-none text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span>
                  </div>
                </summary>
                <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="precios" />

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">Empieza sin compromiso.<span className="block text-slate-500">Decide después con uso real.</span></h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-8 text-slate-400">Prueba Vonu con una duda concreta y comprueba si te aporta claridad antes de elegir un plan.</p>
            <Link href="/chat" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0">
              Probar Vonu
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
