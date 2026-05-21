import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

const manipulationExample =
  "Ahora te voy a pasar un mensaje o una situación para ver si hay presión, manipulación o algo que debería revisar antes de contestar.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo saber si me están manipulando — Analízalo con VonuAI",
  description:
    "Aprende a detectar señales de manipulación emocional, presión, culpa, urgencia o control en mensajes y situaciones. Analízalo con VonuAI antes de contestar.",
  alternates: {
    canonical: "/detectar-manipulacion",
  },
  openGraph: {
    title: "Cómo saber si me están manipulando — VonuAI",
    description:
      "Revisa mensajes o situaciones donde sientes presión, culpa, urgencia o manipulación antes de responder o decidir.",
    url: `${siteUrl}/detectar-manipulacion`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo saber si me están manipulando — VonuAI",
    description:
      "Detecta señales de presión, culpa o manipulación emocional antes de contestar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Te mete culpa",
    text: "Frases como “si me quisieras…”, “después de todo lo que he hecho por ti” o “me estás fallando” pueden buscar que actúes desde la culpa.",
  },
  {
    title: "Te exige respuesta inmediata",
    text: "La urgencia emocional puede impedirte pensar con calma. Si alguien te presiona para contestar ya, conviene frenar.",
  },
  {
    title: "Cambia la culpa de sitio",
    text: "Puede hacer que acabes pidiendo perdón por algo que no era responsabilidad tuya o que dejes de hablar del problema inicial.",
  },
  {
    title: "Minimiza lo que sientes",
    text: "Mensajes como “estás exagerando”, “eres demasiado sensible” o “te lo inventas” pueden invalidar tu percepción.",
  },
  {
    title: "Te confunde con contradicciones",
    text: "Una persona puede alternar cariño, reproche, silencio, enfado o promesas para que pierdas claridad sobre lo que pasa.",
  },
  {
    title: "Te aísla o condiciona",
    text: "Si intenta controlar con quién hablas, qué haces o cómo decides, no es solo una discusión: puede haber dinámica de control.",
  },
];

const checklist = [
  "Lee el mensaje sin contestar inmediatamente.",
  "Pregúntate si te está dando miedo, culpa o ansiedad para que actúes.",
  "Separa hechos reales de interpretaciones o reproches.",
  "Mira si respeta tus límites o intenta saltárselos.",
  "No tomes decisiones importantes en caliente.",
  "Pega el mensaje en Vonu para analizar tono, presión y posibles señales de manipulación.",
];

const commonCases = [
  {
    title: "Manipulación por mensajes",
    text: "Mensajes largos, reproches, ultimátums, silencios o cambios de tono que te dejan confundido antes de responder.",
  },
  {
    title: "Presión para decidir",
    text: "Alguien insiste en que contestes, firmes, aceptes, pagues o te comprometas sin darte tiempo para pensar.",
  },
  {
    title: "Culpa emocional",
    text: "La otra persona usa pena, deuda emocional o victimismo para que hagas algo que no quieres hacer.",
  },
  {
    title: "Relación o familia",
    text: "Situaciones donde hay cariño, historia o dependencia emocional y por eso cuesta detectar si algo no está bien.",
  },
];

const mistakes = [
  "Responder en caliente solo para que pare la presión.",
  "Aceptar culpa sin revisar qué ha pasado realmente.",
  "Explicar demasiado tus límites a alguien que no quiere respetarlos.",
  "Tomar una decisión importante bajo amenaza, chantaje o urgencia.",
  "Pensar que si una persona te quiere, todo lo que hace está justificado.",
];

const faqs = [
  {
    q: "¿Cómo saber si me están manipulando?",
    a: "Algunas señales son sentir culpa intensa, miedo a decir que no, presión para contestar rápido, confusión después de hablar, invalidación de lo que sientes o sensación de que siempre acabas cediendo aunque algo no te encaje.",
  },
  {
    q: "¿Qué hago si me presionan para contestar?",
    a: "No tienes que responder inmediatamente. Puedes pausar, guardar el mensaje, leerlo con calma y contestar solo cuando tengas claro qué quieres decir. Si hay amenaza o riesgo, busca ayuda externa.",
  },
  {
    q: "¿VonuAI puede analizar si un mensaje es manipulador?",
    a: "Sí. Puedes pegar el mensaje o explicar la situación para que Vonu revise señales de presión, culpa, urgencia, control o manipulación. No sustituye a un profesional, pero puede ayudarte a ganar claridad.",
  },
  {
    q: "¿Manipulación significa que la otra persona es mala?",
    a: "No siempre. A veces una persona usa presión o culpa sin ser plenamente consciente. Lo importante es ver el efecto que tiene en ti, si respeta tus límites y si la dinámica se repite.",
  },
  {
    q: "¿Cuándo debería pedir ayuda profesional?",
    a: "Si hay miedo, control, amenazas, aislamiento, ansiedad intensa, violencia, chantaje o sientes que no puedes decidir libremente, conviene hablar con alguien de confianza o con un profesional cualificado.",
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

export default function DetectarManipulacionPage() {
  const chatHref = `/chat?example=${encodeURIComponent(manipulationExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/detectar-manipulacion#webpage`,
        url: `${siteUrl}/detectar-manipulacion`,
        name: "Cómo saber si me están manipulando",
        description:
          "Guía para detectar señales de manipulación emocional, presión, culpa, urgencia o control en mensajes y situaciones.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/detectar-manipulacion#faq`,
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
            <p className="mb-5 inline-flex rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-[13.5px] font-semibold text-zinc-600 shadow-sm">
              Manipulación · Presión · Antes de responder
            </p>

            <h1 className="mx-auto max-w-5xl text-[50px] font-semibold leading-[0.94] tracking-[-0.075em] text-zinc-950 sm:text-[76px] lg:text-[104px]">
              Cómo saber si me están manipulando.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si un mensaje te deja con culpa, ansiedad, prisa o confusión antes
              de contestar, conviene frenar y revisar qué está pasando antes de
              decidir.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={chatHref}
                className="inline-flex min-w-[260px] items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Analizar un mensaje
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-[260px] items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
              >
                Ver señales de alerta
              </a>
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
                  Si te remueve demasiado, no contestes todavía.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un mensaje puede parecer normal por fuera y aun así empujarte
                  a actuar desde culpa, miedo o presión. Pausar ya es una forma
                  de recuperar claridad.
                </p>
              </div>

              <div className="grid gap-3">
                {checklist.map((item) => (
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
                Pistas de presión o manipulación emocional.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No se trata de etiquetar a nadie rápido. Se trata de entender si
              la conversación te está quitando libertad para decidir.
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
              Casos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              A veces la presión no parece presión al principio.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Puede aparecer como preocupación, cariño, enfado, urgencia o
              victimismo. Lo importante es cómo te deja y qué te empuja a hacer.
            </p>
          </div>

          <div className="grid gap-3">
            {commonCases.map((item) => (
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
                Contestar desde culpa suele dejarte peor.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La manipulación funciona mejor cuando te hace reaccionar rápido.
                Tomarte un momento para ordenar lo que pasa puede cambiarlo todo.
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
              Dudas habituales sobre manipulación
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

      <ResourceSignup page="detectar-manipulacion" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de contestar, míralo con calma.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el mensaje o explica la situación. Vonu te ayuda a revisar si
            hay presión, culpa, urgencia o señales de manipulación antes de
            responder.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Analizar mensaje con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}