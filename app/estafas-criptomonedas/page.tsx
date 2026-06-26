import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const cryptoExample =
  "Me han ofrecido una inversión en criptomonedas por WhatsApp o Telegram. Prometen beneficios altos y me piden registrarme o ingresar dinero. Quiero saber si puede ser una estafa.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Estafas con criptomonedas — Cómo detectar una inversión falsa",
  description:
    "Aprende a detectar estafas con criptomonedas, falsas plataformas de inversión, supuestos expertos en trading y promesas de beneficios rápidos antes de enviar dinero.",
  alternates: {
    canonical: "/estafas-criptomonedas",
  },
  openGraph: {
    title: "Estafas con criptomonedas — VonuAI",
    description:
      "Revisa señales de riesgo antes de invertir en una plataforma crypto, enviar dinero o seguir instrucciones por Telegram o WhatsApp.",
    url: `${siteUrl}/estafas-criptomonedas`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estafas con criptomonedas — VonuAI",
    description:
      "Detecta promesas sospechosas, falsas plataformas crypto y señales de inversión fraudulenta antes de pagar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Prometen ganancias rápidas",
    text: "Si te aseguran beneficios altos, rentabilidad diaria o ingresos casi garantizados, conviene parar. En inversión real no hay beneficios seguros.",
  },
  {
    title: "Te contactan por redes o Telegram",
    text: "Muchas estafas empiezan con un mensaje amable, una supuesta oportunidad o alguien que dice ganar mucho con trading o crypto.",
  },
  {
    title: "Te meten prisa para ingresar",
    text: "Frases como “últimas plazas”, “entra hoy”, “si esperas pierdes la oportunidad” buscan que no revises con calma.",
  },
  {
    title: "La plataforma parece profesional",
    text: "Una web bonita, gráficos, paneles y números en verde no demuestran que el dinero sea real ni que puedas retirarlo.",
  },
  {
    title: "Primero te dejan ganar",
    text: "Algunas estafas muestran beneficios falsos al principio para que metas más dinero o confíes en la persona que te guía.",
  },
  {
    title: "Te piden pagar para retirar",
    text: "Si para sacar tu dinero te piden pagar impuestos, desbloqueos, comisiones o verificaciones extra, es una señal muy peligrosa.",
  },
];

const whatToDo = [
  "No envíes más dinero hasta comprobarlo.",
  "No compartas claves, semillas, códigos ni capturas sensibles.",
  "No instales apps ni herramientas que te pidan por chat.",
  "Busca el nombre de la plataforma, dominio y empresa con calma.",
  "Si ya has pagado, guarda conversaciones, justificantes y direcciones.",
  "Pega el caso en Vonu para revisar señales antes de seguir.",
];

const commonExamples = [
  {
    title: "Supuesto experto en trading",
    text: "Alguien te promete ayudarte a invertir y te guía paso a paso para registrarte, ingresar dinero o mover crypto.",
  },
  {
    title: "Grupo de Telegram",
    text: "Ves capturas de beneficios, testimonios y mensajes que presionan para entrar cuanto antes.",
  },
  {
    title: "Plataforma con beneficios falsos",
    text: "El panel muestra que ganas dinero, pero cuando quieres retirar aparecen pagos, bloqueos o excusas.",
  },
  {
    title: "Romance o amistad que acaba en inversión",
    text: "Una persona cercana o de una app de citas empieza hablando normal y termina recomendando una oportunidad crypto.",
  },
];

const mistakes = [
  "Invertir porque alguien parece amable, paciente o experto.",
  "Creer que una web profesional significa que la empresa es real.",
  "Meter más dinero para intentar recuperar lo perdido.",
  "Pagar comisiones o impuestos para desbloquear una retirada.",
  "Enviar capturas de wallet, documentos o códigos de verificación.",
];

const faqs = [
  {
    q: "¿Cómo saber si una inversión en criptomonedas es una estafa?",
    a: "Desconfía si prometen beneficios garantizados, te contactan por redes, te meten prisa, te guían por Telegram o WhatsApp, la plataforma no es clara o te piden pagar para retirar dinero. Lo prudente es revisar señales antes de ingresar más.",
  },
  {
    q: "¿Es normal que me pidan pagar para retirar mis criptomonedas?",
    a: "Es una señal de alerta muy seria. Muchas estafas muestran beneficios falsos y luego piden pagos extra para desbloquear retiradas, impuestos o verificaciones.",
  },
  {
    q: "¿Qué hago si ya he enviado dinero?",
    a: "No envíes más para recuperar lo perdido. Guarda conversaciones, justificantes, direcciones de wallet, webs y datos disponibles. Contacta con tu banco o plataforma usada y valora denunciar.",
  },
  {
    q: "¿VonuAI puede recuperar mi dinero?",
    a: "No. VonuAI no recupera fondos ni sustituye a autoridades, bancos o asesores legales. Te ayuda a revisar señales, ordenar el caso y decidir próximos pasos con más calma.",
  },
  {
    q: "¿Puedo analizar una web o conversación crypto con VonuAI?",
    a: "Sí. Puedes pegar mensajes, explicar la situación o subir capturas para que Vonu te ayude a detectar señales de riesgo antes de pagar, invertir o seguir instrucciones.",
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

export default function EstafasCriptomonedasPage() {
  const chatHref = `/chat?example=${encodeURIComponent(cryptoExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/estafas-criptomonedas#webpage`,
        url: `${siteUrl}/estafas-criptomonedas`,
        name: "Estafas con criptomonedas",
        description:
          "Guía para detectar señales de inversión crypto falsa, falsas plataformas, supuestos expertos en trading y promesas de beneficios rápidos.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/estafas-criptomonedas#faq`,
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
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px]"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 22%, rgba(248,249,250,0.98) 45%, rgba(239,246,255,0.82) 70%, rgba(248,249,250,0) 100%)",
          }}
        />
        <div className="absolute left-1/2 top-[74px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-500/16 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mx-auto max-w-5xl text-[50px] font-semibold leading-[0.94] tracking-[-0.075em] text-zinc-950 sm:text-[76px] lg:text-[104px]">
              Estafas con criptomonedas.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si te prometen beneficios altos, te escriben por Telegram o te
              piden ingresar dinero en una plataforma crypto, revisa las señales
              antes de invertir o enviar más fondos.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Revisar inversión con Vonu
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[38px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Respuesta rápida
                </p>

                <h2 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                  Si prometen dinero fácil, frena.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  La señal más peligrosa no siempre es una web rara. A veces es
                  una promesa demasiado buena, una persona insistente y la idea
                  de que si no entras hoy perderás la oportunidad.
                </p>
              </div>

              <div className="grid gap-3">
                {whatToDo.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-[24px] border border-zinc-200 bg-[#f8f9fa] p-5 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
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

      <section id="senales" className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Pistas típicas de una inversión crypto falsa.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No hace falta que todas aparezcan a la vez. Si varias encajan, lo
              prudente es parar antes de enviar dinero o seguir instrucciones.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[280px] rounded-[34px] border border-zinc-200 bg-[#f8f9fa] p-6 shadow-sm"
              >
                <h3 className="text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Ejemplos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Puede parecer inversión, pero funcionar como trampa.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Las estafas crypto suelen mezclar confianza, promesas, pantallas
              de beneficios y presión para meter más dinero antes de que puedas
              pensar con claridad.
            </p>
          </div>

          <div className="grid gap-3">
            {commonExamples.map((item) => (
              <div
                key={item.title}
                className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5"
              >
                <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Errores a evitar
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Lo más peligroso suele ser intentar recuperar rápido.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Cuando ya has metido dinero, la trampa puede continuar: pagar
                más para retirar, desbloquear, verificar o recuperar lo perdido.
              </p>
            </div>

            <div className="grid gap-3">
              {mistakes.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-sm"
                >
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-zinc-950" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
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
              Dudas habituales sobre estafas crypto
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

      <ResourceSignup page="estafas-criptomonedas" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de enviar dinero, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega la conversación, describe la plataforma o sube una captura.
            Vonu te ayuda a revisar señales de riesgo antes de invertir, pagar o
            seguir instrucciones.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}