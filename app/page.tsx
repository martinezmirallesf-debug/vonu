import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import ResourceSignup from "./components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "VonuAI — Antes de firmar, pagar, contestar o decidir… consúltalo con Vonu",
  description:
    "VonuAI te ayuda a revisar mensajes, webs, documentos, facturas, contratos y situaciones delicadas antes de tomar una decisión importante.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VonuAI — Antes de firmar, pagar, contestar o decidir…",
    description:
      "Revisa mensajes, webs, documentos, facturas, contratos y situaciones delicadas antes de cometer un error importante.",
    url: siteUrl,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VonuAI — Antes de firmar, pagar, contestar o decidir…",
    description:
      "Tu asistente para revisar decisiones importantes antes de actuar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const quickPrompts = [
  "¿SMS sospechoso?",
  "¿Web fiable?",
  "Revisa factura",
  "Revisar contrato",
  "¿Me manipulan?",
  "Analizar PDF",
  "Estudiar algo",
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

const confidenceItems = [
  "No pide contraseñas, códigos ni datos bancarios completos.",
  "No sustituye a profesionales cualificados.",
  "Te orienta con pasos concretos, no con respuestas vacías.",
  "Está pensado para situaciones sensibles, dudas y prevención.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "VonuAI",
      url: siteUrl,
      email: "hello@vonuai.com",
      logo: `${siteUrl}/logo/vonu-cube-black.png?v=4`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "VonuAI",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "es-ES",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#softwareapplication`,
      name: "VonuAI",
      applicationCategory: "AIApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        "VonuAI ayuda a revisar mensajes, webs, documentos, facturas, contratos y situaciones delicadas antes de tomar una decisión importante.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

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

function VoiceBarsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M5 12v0.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M8.5 8.5v7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 5.8v12.4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M15.5 8.5v7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M19 12v0.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function PrincipleText({ text }: { text: string }) {
  if (text === "No decidas bajo presión.") {
    return (
      <>
        No decidas <span className="gradient-text-orange-red">bajo presión</span>.
      </>
    );
  }

  if (text === "No firmes sin entender.") {
    return (
      <>
        No firmes <span className="gradient-text-blue-cyan">sin entender</span>.
      </>
    );
  }

  if (text === "No pagues sin comprobar.") {
    return (
      <>
        No pagues <span className="gradient-text-green">sin comprobar</span>.
      </>
    );
  }

  if (text === "No contestes si algo no encaja.") {
    return (
      <>
        No contestes si algo <span className="gradient-text-purple-pink">no encaja</span>.
      </>
    );
  }

  return <>{text}</>;
}

function UseCaseTitle({ title }: { title: string }) {
  if (title === "Posibles estafas") {
    return (
      <>
        Posibles <span className="gradient-text-orange-red">estafas</span>
      </>
    );
  }

  if (title === "Webs y compras online") {
    return (
      <>
        Webs y <span className="gradient-text-blue-green">compras online</span>
      </>
    );
  }

  if (title === "Documentos y PDFs") {
    return (
      <>
        Documentos y <span className="gradient-text-blue-cyan">PDFs</span>
      </>
    );
  }

  if (title === "Contratos y decisiones") {
    return (
      <>
        Contratos y <span className="gradient-text-amber-orange">decisiones</span>
      </>
    );
  }

  if (title === "Presión o manipulación") {
    return (
      <>
        Presión o <span className="gradient-text-purple-pink">manipulación</span>
      </>
    );
  }

  if (title === "Tutor y estudio") {
    return (
      <>
        Tutor y <span className="gradient-text-green">estudio</span>
      </>
    );
  }

  return <>{title}</>;
}

function FeatureText({ text }: { text: string }) {
  if (text === "Analiza mensajes, enlaces y situaciones sospechosas.") {
    return (
      <>
        Analiza mensajes, enlaces y{" "}
        <span className="gradient-text-orange-red">situaciones sospechosas</span>.
      </>
    );
  }

  if (text === "Lee documentos, PDFs, facturas y contratos.") {
    return (
      <>
        Lee <span className="gradient-text-blue-cyan">documentos, PDFs</span>, facturas y contratos.
      </>
    );
  }

  if (text === "Puede revisar imágenes y capturas.") {
    return (
      <>
        Puede revisar <span className="gradient-text-purple-pink">imágenes y capturas</span>.
      </>
    );
  }

  if (text === "Conversa por voz cuando necesitas explicarte mejor.") {
    return (
      <>
        Conversa por <span className="gradient-text-blue-green">voz</span> cuando necesitas explicarte mejor.
      </>
    );
  }

  if (text === "Te dice qué haría ahora, no solo qué ve.") {
    return (
      <>
        Te dice <span className="gradient-text-green">qué haría ahora</span>, no solo qué ve.
      </>
    );
  }

  return <>{text}</>;
}

function ConfidenceText({ text }: { text: string }) {
  if (text === "No pide contraseñas, códigos ni datos bancarios completos.") {
    return (
      <>
        No pide <span className="gradient-text-orange-red">contraseñas, códigos</span> ni datos bancarios completos.
      </>
    );
  }

  if (text === "No sustituye a profesionales cualificados.") {
    return (
      <>
        No sustituye a <span className="gradient-text-blue-cyan">profesionales cualificados</span>.
      </>
    );
  }

  if (text === "Te orienta con pasos concretos, no con respuestas vacías.") {
    return (
      <>
        Te orienta con <span className="gradient-text-green">pasos concretos</span>, no con respuestas vacías.
      </>
    );
  }

  if (text === "Está pensado para situaciones sensibles, dudas y prevención.") {
    return (
      <>
        Está pensado para <span className="gradient-text-purple-pink">situaciones sensibles</span>, dudas y prevención.
      </>
    );
  }

  return <>{text}</>;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="relative mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1180px] text-center">
            <h1 className="mx-auto max-w-[1120px] text-[56px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[128px]">
              Antes de actuar,
              <span className="block text-zinc-500">pregúntale a Vonu.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Revisa mensajes, webs, documentos, facturas, contratos y situaciones delicadas
              antes de firmar, pagar, contestar o decidir.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Analizar ahora</span>
                <ArrowIcon />
              </Link>

              <a
                href="#casos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver casos</span>
                <span className="hidden sm:inline">Ver casos de uso</span>
              </a>
            </div>

            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5 sm:mt-8 sm:gap-3.5">
              {quickPrompts.map((prompt) => (
                <Link
                  key={prompt}
                  href={`/chat?example=${encodeURIComponent(prompt)}`}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-[13.5px] font-medium text-zinc-600 shadow-sm transition hover:-translate-y-[1px] hover:border-zinc-300 hover:text-zinc-950 hover:shadow-md sm:px-4 sm:py-2.5 sm:text-[14px]"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Vonu analiza
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me escribe una chica en Tinder. Me manda fotos, dice que le gusto y
                    ahora quiere que invierta en una criptomoneda. ¿Me puedo fiar?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo frenaría: Tinder + inversión + cripto es una señal roja clara.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que me hace dudar:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>La inversión aparece demasiado pronto.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Quiere sacarte de la app y llevarte a otro canal.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              La mezcla de romance, confianza rápida y dinero es un patrón típico de estafa.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No enviaría dinero, códigos, documentos ni fotos íntimas.
                          Pediría una videollamada corta y natural. Si evita comprobar
                          quién es o insiste con la inversión, bloquearía/reportaría.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_13px_rgba(0,0,0,0.135),0_3px_8px_rgba(0,0,0,0.085)]">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full text-zinc-900">
                        <span className="text-[25px] leading-none">+</span>
                      </div>

                      <div className="min-w-0 flex-1 text-left text-[16px] text-zinc-400">
                        Pregunta lo que quieras
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <VoiceBarsIcon />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · No sustituye profesionales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-4">
            {principles.map((item, index) => (
              <div
                key={item}
                className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  0{index + 1}
                </p>

                <p className="mt-10 text-[28px] font-semibold leading-[1.03] tracking-[-0.055em] text-zinc-950 sm:text-[34px]">
  <PrincipleText text={item} />
</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="casos" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Casos de uso
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Para cuando
                <span className="text-zinc-500"> un error sale caro.</span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para dudas reales: cuando algo no encaja,
              cuando hay presión o cuando necesitas entender antes de actuar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {item.kicker}
                </p>

                <h3 className="mt-16 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
  <UseCaseTitle title={item.title} />
</h3>

                <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="producto" className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-[38px] bg-zinc-950 p-7 text-white shadow-[0_18px_48px_rgba(0,0,0,0.16)] sm:p-10">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Producto
            </p>

            <h2 className="mt-5 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] sm:text-[72px]">
              Un chat, sí.
              <span className="block text-zinc-400">Pero pensado para prevenir errores.</span>
            </h2>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-zinc-300">
              Vonu no busca entretenerte ni darte respuestas genéricas. Busca ayudarte
              a revisar una situación, entender el riesgo y decidir el siguiente paso.
            </p>

            <div className="mt-8 flex justify-center sm:justify-start">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-zinc-950 transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="grid content-center gap-4">
            {productFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-[30px] border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)] transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <span className="shrink-0 text-zinc-950">
                  <CheckIcon />
                </span>

                <p className="text-[18px] font-medium leading-7 tracking-[-0.025em] text-zinc-800">
  <FeatureText text={feature} />
</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[42px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Confianza
                </p>

                <h2 className="mt-4 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Claridad antes
                  <span className="text-zinc-500"> de la acción.</span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Vonu te ayuda a frenar, revisar y entender. No toma decisiones por ti,
                  pero puede ayudarte a ver señales que bajo presión se pasan por alto.
                </p>
              </div>

              <div className="grid gap-4">
                {confidenceItems.map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-[30px] border border-zinc-200 bg-[#f5f5f7] p-5 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="shrink-0 text-zinc-950">
                      <CheckIcon />
                    </span>
                    <span>
  <ConfidenceText text={item} />
</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Ayuda
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[54px] font-semibold leading-[0.9] tracking-[-0.075em] text-zinc-950 sm:text-[82px]">
              Preguntas frecuentes
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

      <ResourceSignup page="home" />

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

      <HomeFooter />
    </main>
  );
}