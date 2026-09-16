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
    "Prueba Vonu con 1 análisis gratuito. Si quieres seguir, compra 3 análisis adicionales por 3,99 €.",
  alternates: { canonical: "/precios" },
  openGraph: {
    title: "Precios — Vonu",
    description: "1 análisis gratis. Después, 3 análisis adicionales por 3,99 €.",
    url: `${siteUrl}/precios`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    q: "¿Puedo probar Vonu sin pagar?",
    a: "Sí. Tu primer análisis es gratuito y no necesitas introducir una tarjeta para probar Vonu.",
  },
  {
    q: "¿Qué pasa después del análisis gratuito?",
    a: "Si quieres seguir usando Vonu, puedes comprar un pack de 3 análisis adicionales por 3,99 €. Es un pago único, no una suscripción.",
  },
  {
    q: "¿Los 3 análisis caducan cada mes?",
    a: "No. Este lanzamiento no usa una suscripción mensual: compras 3 análisis adicionales y se añaden a tu cuenta.",
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
    a: "El pago único se procesa mediante Stripe. Vonu recibe los datos necesarios para acreditar tus 3 análisis, pero no necesita almacenar el número completo de tu tarjeta.",
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
    description: "1 análisis gratis y, después, 3 análisis adicionales por 3,99 €.",
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
              Prueba Vonu gratis.
              <span className="block text-slate-400">Paga solo si quieres seguir.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Tienes 1 análisis gratuito. Después puedes comprar 3 análisis adicionales por 3,99 €, sin suscripción mensual.
            </p>
          </div>
        </div>
      </section>

      <section id="planes" className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[980px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="flex min-h-[430px] flex-col rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Prueba gratis</p>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-[54px] font-semibold leading-none tracking-[-0.07em] text-white">0€</span>
              </div>
              <p className="mt-5 text-[14px] leading-7 text-slate-400">Comprueba una situación real antes de decidir si Vonu te resulta útil.</p>
              <div className="mt-7 space-y-3">
                {["1 análisis gratuito", "URL, mensaje o captura", "Índice de riesgo y señales detectadas", "Sin tarjeta para empezar"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-[13px] leading-6 text-slate-300">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/es/check" className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[14px] font-bold text-white transition hover:bg-white/[0.07]">
                Hacer mi análisis gratis
              </Link>
            </article>

            <article className="relative flex min-h-[430px] flex-col rounded-[26px] border border-emerald-400/30 bg-emerald-400/[0.055] p-6 shadow-[0_26px_80px_rgba(16,185,129,.08)]">
              <span className="absolute right-5 top-5 rounded-full border border-emerald-300/20 bg-emerald-400/[0.10] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200">Pago único</span>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Pack de análisis</p>
              <div className="mt-8 flex items-end gap-2">
                <span className="text-[54px] font-semibold leading-none tracking-[-0.07em] text-white">3,99€</span>
              </div>
              <p className="mt-5 text-[14px] leading-7 text-slate-400">Cuando gastes tu análisis gratuito, añade 3 análisis más a tu cuenta.</p>
              <div className="mt-7 space-y-3">
                {["3 análisis adicionales", "URL, mensaje o captura", "Sin renovación automática", "Compra única mediante Stripe"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-[13px] leading-6 text-slate-300">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <PlanCheckoutButton
                locale="es"
                label="Comprar 3 análisis"
                className="mt-auto h-12 w-full rounded-xl bg-emerald-400 px-5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-70"
              />
            </article>
          </div>

          <p className="mx-auto mt-8 max-w-[760px] text-center text-[12px] leading-6 text-slate-500">
            3,99 € es un pago único por 3 análisis adicionales. No hay renovación automática ni suscripción mensual en esta fase de lanzamiento.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Preguntas frecuentes</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Simple desde el principio.</h2>
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
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-8 text-slate-400">Empieza con tu análisis gratuito. Si necesitas seguir, añade 3 análisis por 3,99 €.</p>
          <Link href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300">Analizar ahora</Link>
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
