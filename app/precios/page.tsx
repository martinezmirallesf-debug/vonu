import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import PlanCheckoutButton from "../components/PlanCheckoutButton";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Precios — Vonu",
  description:
    "Planes de Vonu para comprobar enlaces, mensajes y capturas antes de confiar, responder, compartir datos o pagar.",
  alternates: { canonical: "/precios" },
  openGraph: {
    title: "Precios — Vonu",
    description: "Empieza gratis y amplía tu capacidad de análisis cuando lo necesites.",
    url: `${siteUrl}/precios`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const plans = [
  {
    name: "Free",
    price: "0€",
    description: "Para probar Vonu con una comprobación real antes de decidir si necesitas más.",
    features: [
      "Primer análisis gratuito",
      "Enlaces, mensajes o capturas",
      "Señales de riesgo y próximos pasos",
      "Sin tarjeta para empezar",
    ],
  },
  {
    name: "Plus",
    price: "9,99€",
    description: "Para usar Vonu con frecuencia en situaciones cotidianas donde conviene comprobar antes de actuar.",
    features: [
      "Más análisis durante el mes",
      "Enlaces, mensajes y capturas",
      "Comprobaciones técnicas cuando aplican",
      "Fraud Atlas y calibración de riesgo",
    ],
  },
  {
    name: "Max",
    price: "19,99€",
    description: "Para quienes necesitan más capacidad y utilizan Vonu de forma intensiva.",
    features: [
      "Mayor capacidad mensual",
      "Enlaces, mensajes y capturas",
      "Mismas capas de análisis con más margen",
      "Pensado para uso intensivo",
    ],
  },
];

const faqs = [
  {
    q: "¿Puedo probar Vonu sin pagar?",
    a: "Sí. El primer análisis es gratuito y no necesitas introducir una tarjeta para probar Vonu.",
  },
  {
    q: "¿Qué analiza Vonu?",
    a: "Vonu está centrado en enlaces y webs, mensajes sospechosos y capturas de pantalla. Busca señales observables de phishing, suplantación, presión, fraude y otros patrones de riesgo.",
  },
  {
    q: "¿La puntuación significa que algo es una estafa?",
    a: "No. La puntuación es un índice orientativo de riesgo basado en las señales disponibles. No certifica que una persona, empresa, mensaje o web sea legítima o fraudulenta.",
  },
  {
    q: "¿Cómo se gestiona el pago?",
    a: "Las suscripciones se procesan mediante Stripe. Vonu recibe los datos necesarios para gestionar tu plan y estado de pago, pero no necesita almacenar el número completo de tu tarjeta.",
  },
  {
    q: "¿Puedo cancelar?",
    a: "Sí. Puedes gestionar la suscripción y su renovación desde el portal de facturación asociado a tu cuenta.",
  },
];

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
    "@type": "WebPage",
    "@id": `${siteUrl}/precios#webpage`,
    url: `${siteUrl}/precios`,
    name: "Precios — Vonu",
    description: "Planes de Vonu para comprobar enlaces, mensajes y capturas.",
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "Vonu", url: siteUrl },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-210px] -z-10 h-[660px] w-[960px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[130px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[330px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[980px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Precios</p>
            <h1 className="mx-auto mt-5 max-w-[980px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[90px]">
              Empieza gratis.
              <span className="block text-slate-400">Amplía cuando lo necesites.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Elige el margen que necesitas para comprobar enlaces, mensajes y capturas antes de confiar, responder, compartir datos o pagar.
            </p>
          </div>
        </div>
      </section>

      <section id="planes" className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const highlighted = plan.name === "Plus";
              return (
                <article
                  key={plan.name}
                  className={[
                    "relative flex min-h-[470px] flex-col rounded-[26px] border p-6",
                    highlighted
                      ? "border-emerald-400/30 bg-emerald-400/[0.055] shadow-[0_26px_80px_rgba(16,185,129,.08)]"
                      : "border-white/[0.07] bg-white/[0.03]",
                  ].join(" ")}
                >
                  {highlighted && (
                    <span className="absolute right-5 top-5 rounded-full border border-emerald-300/20 bg-emerald-400/[0.10] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                      Más elegido
                    </span>
                  )}
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{plan.name}</p>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-[54px] font-semibold leading-none tracking-[-0.07em] text-white">{plan.price}</span>
                    {plan.name !== "Free" && <span className="pb-1 text-[13px] text-slate-500">/ mes</span>}
                  </div>
                  <p className="mt-5 min-h-[84px] text-[14px] leading-7 text-slate-400">{plan.description}</p>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-[13px] leading-6 text-slate-300">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300">
                          <CheckIcon />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.name === "Free" ? (
                    <Link
                      href="/es/check"
                      className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[14px] font-bold text-white transition hover:bg-white/[0.07]"
                    >
                      Probar gratis
                    </Link>
                  ) : (
                    <PlanCheckoutButton
                      plan={plan.name === "Plus" ? "plus" : "max"}
                      locale="es"
                      label={plan.name === "Plus" ? "Elegir Plus" : "Elegir Max"}
                      className={[
                        "mt-auto h-12 w-full rounded-xl px-5 text-[14px] font-bold transition disabled:cursor-wait disabled:opacity-70",
                        highlighted
                          ? "bg-emerald-400 text-[#07110d] hover:bg-emerald-300"
                          : "border border-white/[0.10] bg-white/[0.045] text-white hover:bg-white/[0.07]",
                      ].join(" ")}
                    />
                  )}
                </article>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-[760px] text-center text-[12px] leading-6 text-slate-500">
            Las suscripciones de pago se procesan mediante Stripe. El importe y las condiciones de la compra se muestran antes de confirmar el pago.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Preguntas frecuentes</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Antes de elegir.</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[17px] font-semibold text-slate-100 sm:text-[19px]">{item.q}</span>
                    <span className="text-[30px] font-light text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span>
                  </div>
                </summary>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0d15]">
        <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Comprueba antes de confiar.</h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-8 text-slate-400">
            Puedes empezar con un análisis gratuito y ampliar tu plan solo cuando el uso real lo justifique.
          </p>
          <Link href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300">
            Analizar ahora
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] text-slate-600">
            <Link href="/legal/terminos" className="transition hover:text-slate-400">Términos</Link>
            <Link href="/legal/privacidad" className="transition hover:text-slate-400">Privacidad</Link>
            <Link href="/legal/aviso-legal" className="transition hover:text-slate-400">Aviso legal</Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
