import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

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

function RedXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningTitle({ title }: { title: string }) {
  if (title === "Te mete culpa") {
    return (
      <>
        Te mete <GradientText tone="purplePink">culpa</GradientText>
      </>
    );
  }

  if (title === "Te exige respuesta inmediata") {
    return (
      <>
        Te exige respuesta
        <span className="block">
          <GradientText tone="orangeRed">inmediata</GradientText>
        </span>
      </>
    );
  }

  if (title === "Cambia la culpa de sitio") {
    return (
      <>
        Cambia la culpa
        <span className="block">
          de <GradientText tone="amberOrange">sitio</GradientText>
        </span>
      </>
    );
  }

  if (title === "Minimiza lo que sientes") {
    return (
      <>
        Minimiza lo que
        <span className="block">
          <GradientText tone="blueCyan">sientes</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te confunde con contradicciones") {
    return (
      <>
        Te confunde con
        <span className="block">
          <GradientText tone="purplePink">contradicciones</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te aísla o condiciona") {
    return (
      <>
        Te aísla o
        <span className="block">
          <GradientText tone="orangeRed">condiciona</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function CommonCaseTitle({ title }: { title: string }) {
  if (title === "Manipulación por mensajes") {
    return (
      <>
        Manipulación por{" "}
        <GradientText tone="purplePink">mensajes</GradientText>
      </>
    );
  }

  if (title === "Presión para decidir") {
    return (
      <>
        Presión para <GradientText tone="orangeRed">decidir</GradientText>
      </>
    );
  }

  if (title === "Culpa emocional") {
    return (
      <>
        Culpa <GradientText tone="amberOrange">emocional</GradientText>
      </>
    );
  }

  if (title === "Relación o familia") {
    return (
      <>
        Relación o <GradientText tone="blueCyan">familia</GradientText>
      </>
    );
  }

  return <>{title}</>;
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
              ¿Te están{" "}
              <GradientText tone="purplePink">manipulando?</GradientText>
              <span className="block text-zinc-500">Revísalo antes de contestar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si un mensaje te deja con culpa, ansiedad, prisa o confusión antes
              de contestar, conviene frenar y revisar qué está pasando antes de
              decidir.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href={chatHref}
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Analizar mensaje</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver señales de presión</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Mensaje revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me han mandado un mensaje que me hace sentir culpable y me
                    exige contestar ya. No sé si estoy exagerando o si hay presión.
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no contestaría en caliente. Primero separaría hechos,
                        culpa y presión.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si te empuja a responder ya, sin tiempo para pensar.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si usa culpa, miedo o deuda emocional para forzarte.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si respeta tus límites o intenta saltárselos.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Guardaría el mensaje, respiraría un momento y prepararía
                          una respuesta corta, tranquila y con límite claro. Si hay
                          amenaza o miedo real, pediría ayuda externa.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_13px_rgba(0,0,0,0.135),0_3px_8px_rgba(0,0,0,0.085)]">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full text-zinc-900">
                        <span className="text-[25px] leading-none">+</span>
                      </div>

                      <div className="min-w-0 flex-1 truncate whitespace-nowrap text-left text-[13.5px] text-zinc-400 sm:text-[16px]">
                        Pega un mensaje o explica la situación
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <span className="text-[18px] font-semibold leading-none">
                          →
                        </span>
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
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[42px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Respuesta rápida
                </p>

                <h2 className="mt-4 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Si te remueve demasiado,
                  <span className="block text-zinc-500">
                    no contestes <GradientText tone="purplePink">todavía.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un mensaje puede parecer normal por fuera y aun así empujarte
                  a actuar desde culpa, miedo o presión. Pausar ya es una forma
                  de recuperar claridad.
                </p>
              </div>

              <div className="grid gap-4">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-[30px] border border-zinc-200 bg-[#f5f5f7] p-5 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="shrink-0 text-zinc-950">
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

      <section id="senales" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas de presión
                <span className="block text-zinc-500">
                  o <GradientText tone="purplePink">manipulación emocional.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No se trata de etiquetar a nadie rápido. Se trata de entender si
              la conversación te está quitando libertad para decidir.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <WarningTitle title={item.title} />
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              A veces la presión
              <span className="block text-zinc-400">
                no parece presión <GradientText tone="blueCyan">al principio.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Puede aparecer como preocupación, cariño, enfado, urgencia o
              victimismo. Lo importante es cómo te deja y qué te empuja a hacer.
            </p>
          </div>

          <div className="grid gap-4">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.045em] text-white">
                  <CommonCaseTitle title={item.title} />
                </h3>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Errores a evitar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Contestar desde culpa
                <span className="block text-zinc-500">
                  suele dejarte <GradientText tone="orangeRed">peor.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La manipulación funciona mejor cuando te hace reaccionar rápido.
                Tomarte un momento para ordenar lo que pasa puede cambiarlo todo.
              </p>
            </div>

            <div className="grid gap-4">
              {mistakes.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[30px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)]"
                >
                  <span className="shrink-0 text-red-600">
                    <RedXIcon />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
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
              <span className="block text-zinc-500">manipulación</span>
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

      <ResourceSignup page="detectar-manipulacion" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de contestar, míralo con calma.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el mensaje o explica la situación. Vonu te ayuda a revisar si
            hay presión, culpa, urgencia o señales de manipulación antes de
            responder.
          </p>

          <Link
            href={chatHref}
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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