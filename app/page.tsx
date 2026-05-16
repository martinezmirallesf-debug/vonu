import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "./components/HomeHeader";

export const metadata: Metadata = {
  title: "VonuAI — Antes de firmar, pagar, contestar o decidir… consúltalo con Vonu",
  description:
    "VonuAI te ayuda a revisar mensajes, webs, documentos, facturas, contratos y situaciones delicadas antes de tomar una decisión importante.",
};

const quickPrompts = [
  "¿Este SMS es una estafa?",
  "¿Esta web es fiable?",
  "Revisa esta factura",
  "¿Puedo firmar este contrato?",
  "¿Me están manipulando?",
];

const useCases = [
  {
    title: "Posibles estafas",
    kicker: "Frena antes de caer",
    text: "Analiza SMS, WhatsApps, emails, enlaces y mensajes sospechosos antes de pulsar, pagar o compartir datos.",
  },
  {
    title: "Webs y compras online",
    kicker: "Comprueba antes de pagar",
    text: "Revisa señales de riesgo en tiendas, webs, ofertas, dominios raros o páginas que no terminan de darte confianza.",
  },
  {
    title: "Documentos y PDFs",
    kicker: "Entiende lo importante",
    text: "Sube facturas, contratos, recibos o documentos para saber qué contienen, qué revisar y qué conviene guardar.",
  },
  {
    title: "Contratos y decisiones",
    kicker: "No firmes a ciegas",
    text: "Detecta cláusulas delicadas, dudas, condiciones confusas o riesgos antes de aceptar algo importante.",
  },
  {
    title: "Presión o manipulación",
    kicker: "Recupera claridad",
    text: "Ordena situaciones donde alguien te insiste, te mete prisa, te hace sentir culpable o no sabes si estás exagerando.",
  },
  {
    title: "Tutor y estudio",
    kicker: "Aprende paso a paso",
    text: "Pide explicaciones claras, resúmenes, preguntas, ayuda con ejercicios o apoyo para estudiar con voz natural.",
  },
];

const productFeatures = [
  "Analiza mensajes, enlaces y situaciones sospechosas.",
  "Lee documentos, PDFs, facturas y contratos.",
  "Puede revisar imágenes y capturas.",
  "Conversa por voz cuando necesitas explicarte mejor.",
  "Te dice qué haría ahora, no solo qué ve.",
];

const principles = [
  "No decidas bajo presión.",
  "No firmes sin entender.",
  "No pagues sin comprobar.",
  "No contestes si algo no encaja.",
];

const plans = [
  {
    name: "Free",
    price: "0€",
    description: "Para probar Vonu y resolver dudas puntuales.",
    features: ["Mensajes limitados", "Chat preventivo", "Análisis básico"],
  },
  {
    name: "Plus",
    price: "9,99€",
    description: "Para usar Vonu con más frecuencia y acceso a voz.",
    features: ["Más mensajes al mes", "Modo conversación", "Análisis de archivos"],
    featured: true,
  },
  {
    name: "Max",
    price: "19,99€",
    description: "Para uso intensivo, más voz y más margen mensual.",
    features: ["Más mensajes", "Más minutos de voz", "Funciones avanzadas"],
  },
];

const faqs = [
  {
    q: "¿Vonu sustituye a un abogado, médico o psicólogo?",
    a: "No. Vonu es una herramienta de orientación preventiva. Ayuda a entender riesgos, ordenar ideas y detectar señales importantes, pero no sustituye a profesionales cualificados.",
  },
  {
    q: "¿Puedo subir documentos o capturas?",
    a: "Sí. Vonu puede ayudarte a revisar imágenes y PDFs para extraer lo importante y orientarte de forma práctica.",
  },
  {
    q: "¿Sirve para detectar estafas?",
    a: "Sí. Puede revisar mensajes, enlaces, webs y situaciones sospechosas para ayudarte a decidir si conviene frenar, verificar o no compartir datos.",
  },
  {
    q: "¿Qué datos no debería compartir?",
    a: "No compartas contraseñas, códigos de verificación, datos bancarios completos ni información extremadamente sensible que no sea necesaria para analizar la situación.",
  },
];

function LogoMark() {
  return (
    <div className="flex items-center gap-1">
      <img
        src="/logo/vonu-cube-black.png"
        alt="VonuAI"
        className="h-[23px] w-[23px] object-contain"
      />

      <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
        VonuAI
      </span>
    </div>
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

function VoiceBarsIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center gap-[2px]" aria-hidden="true">
      <span className="h-[8px] w-[2px] rounded-full bg-current" />
<span className="h-[14px] w-[2px] rounded-full bg-current" />
<span className="h-[8px] w-[2px] rounded-full bg-current" />
<span className="h-[12px] w-[2px] rounded-full bg-current" />
    </span>
  );
}

export default function HomePage() {
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
        <div className="absolute right-[-160px] top-[340px] h-[340px] w-[340px] rounded-full bg-emerald-400/12 blur-3xl" />
<div className="absolute left-[-160px] top-[500px] h-[340px] w-[340px] rounded-full bg-amber-300/18 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:px-8">
          <div className="mx-auto max-w-[1180px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-[13px] font-medium text-zinc-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(26,115,232,0.7)]" />
              Asistente para decisiones seguras
            </div>

            <h1 className="mx-auto max-w-[1120px] text-[52px] font-semibold leading-[1.0] tracking-[-0.056em] text-zinc-950 sm:text-[78px] lg:text-[112px]">
  Antes de actuar, pregúntale a Vonu.
</h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Revisa mensajes, webs, documentos, facturas, contratos y situaciones delicadas
              antes de firmar, pagar, contestar o decidir.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_34px_rgba(26,115,232,0.26)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Analizar ahora
                <ArrowIcon />
              </Link>

              <a
                href="#casos"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                Ver casos de uso
              </a>
            </div>

            <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
              {quickPrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/chat?example=${encodeURIComponent(prompt)}`}
                  className="rounded-full border border-zinc-200 bg-white/80 px-3.5 py-2 text-[13.5px] font-medium text-zinc-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f8f9fa] p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Vonu analiza
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[28px] bg-zinc-950 p-5 text-white">
                    <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-blue-300">
                      Consulta
                    </p>

                    <h2 className="mt-4 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[44px]">
                      “Me piden pagar hoy o pierdo la oferta.”
                    </h2>

                    <p className="mt-5 text-[15px] leading-7 text-zinc-300">
                      Vonu detecta presión, urgencia, señales de riesgo y te ayuda a decidir
                      con más calma antes de actuar.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="ml-auto max-w-[86%] rounded-[24px] bg-[#e9edf1] px-4 py-3 text-[15px] leading-6 text-zinc-900">
                      Me ha llegado una web con un descuento enorme y me piden pagar por transferencia. ¿Lo ves fiable?
                    </div>

                    <div className="max-w-[92%] rounded-[24px] bg-white px-4 py-3 text-[15px] leading-6 text-zinc-800 shadow-sm">
                      <p className="font-semibold text-zinc-950">⚠️ Riesgo alto</p>
                      <p className="mt-1 text-zinc-600">
                        Hay varias señales que conviene revisar antes de pagar: urgencia,
                        descuento agresivo y método de pago con poca protección.
                      </p>
                    </div>

                    <div className="max-w-[94%] rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] leading-6 text-amber-950">
                      <p className="font-semibold">Qué haría ahora</p>
                      <p className="mt-1">
                        No pagaría todavía. Buscaría datos fiscales, opiniones externas,
                        antigüedad del dominio y formas de pago con protección.
                      </p>
                    </div>

                    <div className="rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_13px_rgba(0,0,0,0.135),0_3px_8px_rgba(0,0,0,0.085)]">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full text-zinc-800">
                          +
                        </div>
                        <div className="min-w-0 flex-1 text-[15px] text-zinc-400">
                          Pregunta lo que quieras
                        </div>
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-white">
                          <VoiceBarsIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {principles.map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-white/10 bg-white/[0.06] px-5 py-6 text-[28px] font-semibold leading-[1.05] tracking-[-0.048em] text-white sm:text-[34px]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="casos" className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Casos de uso
              </p>
              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[1.02] tracking-[-0.052em] text-zinc-950 sm:text-[64px]">
                Para los momentos donde un error sale caro.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para dudas reales: cuando algo no encaja,
              cuando hay presión o cuando necesitas entender antes de actuar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="group min-h-[290px] rounded-[34px] border border-zinc-200 bg-[#f8f9fa] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {item.kicker}
                </p>

                <h3 className="mt-16 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="producto" className="bg-[#f8f9fa]">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-18 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-[38px] bg-zinc-950 p-7 text-white sm:p-10">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Producto
            </p>

            <h2 className="mt-5 text-[42px] font-semibold leading-[1.0] tracking-[-0.056em] sm:text-[68px]">
              Un chat, sí. Pero diseñado para ayudarte a no equivocarte.
            </h2>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-zinc-300">
              Vonu no busca entretenerte ni darte respuestas genéricas. Busca ayudarte
              a revisar una situación, entender el riesgo y decidir el siguiente paso.
            </p>

            <Link
              href="/chat"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-zinc-950 transition hover:scale-[1.02] active:scale-[0.99]"
            >
              Probar Vonu
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid content-center gap-3">
            {productFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <CheckIcon />
                </div>
                <p className="text-[18px] font-medium leading-7 tracking-[-0.025em] text-zinc-850">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[42px] bg-[#f8f9fa] p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Confianza
                </p>

                <h2 className="mt-4 text-[42px] font-semibold leading-[1.0] tracking-[-0.056em] text-zinc-950 sm:text-[64px]">
                  Claridad antes de la acción.
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Vonu te ayuda a frenar, revisar y entender. No toma decisiones por ti,
                  pero puede ayudarte a ver señales que bajo presión se pasan por alto.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "No pide contraseñas, códigos ni datos bancarios completos.",
                  "No sustituye a profesionales cualificados.",
                  "Te orienta con pasos concretos, no con respuestas vacías.",
                  "Está pensado para situaciones sensibles, dudas y prevención.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-sm"
                  >
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
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

      <section id="precios" className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Planes
            </p>

            <h2 className="mt-3 text-[42px] font-semibold leading-[1.02] tracking-[-0.052em] text-zinc-950 sm:text-[64px]">
              Empieza gratis. Mejora cuando Vonu te aporte valor.
            </h2>

            <p className="mt-5 text-[17px] leading-8 text-zinc-600">
              Los planes ayudan a mantener una herramienta potente, sostenible y preparada
              para análisis reales, voz y documentos.
            </p>
          </div>

          <div className="mt-11 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
  key={plan.name}
  className={[
    "flex h-full flex-col rounded-[34px] border p-6 shadow-sm",
    plan.featured
      ? "border-blue-200 bg-blue-50 shadow-[0_20px_52px_rgba(26,115,232,0.14)]"
      : "border-zinc-200 bg-white",
  ].join(" ")}
>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[28px] font-semibold tracking-[-0.05em] text-zinc-950">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-zinc-600">
                      {plan.description}
                    </p>
                  </div>

                  {plan.featured && (
                    <span className="rounded-full bg-[#1a73e8] px-3 py-1 text-[12px] font-semibold text-white">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-7 flex items-end gap-1">
                  <span className="text-[48px] font-semibold tracking-[-0.065em] text-zinc-950">
                    {plan.price}
                  </span>
                  <span className="pb-2 text-[14px] text-zinc-500">/ mes</span>
                </div>

                <div className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-[15px] text-zinc-700">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-blue-600 shadow-sm">
                        <CheckIcon />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
  href="/chat"
  className={[
    "mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[15px] font-semibold transition",
                    plan.featured
                      ? "bg-[#1a73e8] text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] hover:scale-[1.01]"
                      : "bg-zinc-950 text-white shadow-sm hover:scale-[1.01]",
                  ].join(" ")}
                >
                  Probar Vonu
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Ayuda
            </p>
            <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-zinc-950 sm:text-[58px]">
              Preguntas frecuentes
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

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Para cuando no estás seguro y no quieres equivocarte.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega tu duda, sube un documento o explica la situación. Vonu te ayuda
            a verla con más claridad antes de actuar.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Empezar ahora
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-[#f8f9fa]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <LogoMark />

            <p className="mt-4 max-w-sm text-[14px] leading-7 text-zinc-600">
              VonuAI ayuda a revisar decisiones importantes antes de firmar,
              pagar, contestar o decidir.
            </p>

            <p className="mt-4 text-[14px] text-zinc-500">
              Contacto:{" "}
              <a href="mailto:hello@vonuai.com" className="font-medium text-zinc-800 hover:text-blue-700">
                hello@vonuai.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-zinc-950">Producto</h3>
            <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
              <a href="#producto" className="hover:text-zinc-950">Producto</a>
              <a href="#precios" className="hover:text-zinc-950">Precios</a>
              <Link href="/chat" className="hover:text-zinc-950">Probar Vonu</Link>
              <Link href="/ayuda" className="hover:text-zinc-950">Ayuda</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-zinc-950">Casos de uso</h3>
            <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
              <Link href="/analizar-sms-estafa" className="hover:text-zinc-950">Analizar SMS sospechoso</Link>
              <Link href="/comprobar-web-fiable" className="hover:text-zinc-950">Comprobar web fiable</Link>
              <Link href="/revisar-contrato" className="hover:text-zinc-950">Revisar contrato</Link>
              <Link href="/comprobar-factura" className="hover:text-zinc-950">Comprobar factura</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-zinc-950">Legal</h3>
            <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
              <Link href="/legal/aviso-legal" className="hover:text-zinc-950">Aviso legal</Link>
              <Link href="/legal/privacidad" className="hover:text-zinc-950">Privacidad</Link>
              <Link href="/legal/terminos" className="hover:text-zinc-950">Términos</Link>
              <Link href="/legal/cookies" className="hover:text-zinc-950">Cookies</Link>
              <Link href="/legal/uso-responsable" className="hover:text-zinc-950">Uso responsable</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-4 py-5 text-center text-[13px] text-zinc-500">
          © {new Date().getFullYear()} VonuAI. Orientación preventiva. No sustituye profesionales.
        </div>
      </footer>
    </main>
  );
}