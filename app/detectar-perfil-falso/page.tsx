import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo detectar un perfil falso — Tinder, Badoo, Instagram y catfishing",
  description:
    "Aprende a detectar perfiles falsos en Tinder, Badoo, Bumble, Instagram o redes sociales. Revisa fotos reutilizadas, catfishing, romance scam, cripto, presión y señales de alerta.",
  alternates: {
    canonical: "/detectar-perfil-falso",
  },
  openGraph: {
    title: "Cómo detectar un perfil falso — VonuAI",
    description:
      "Sube una captura de un perfil, foto o conversación y revisa señales de perfil falso, catfishing, romance scam, presión o intento de estafa.",
    url: `${siteUrl}/detectar-perfil-falso`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo detectar un perfil falso — VonuAI",
    description:
      "Revisa capturas de perfiles y conversaciones para detectar señales de catfishing, fotos reutilizadas o estafas en apps de citas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const useCases = [
  {
    title: "Perfil de Tinder, Badoo o Bumble",
    text: "Revisa si hay señales de perfil falso, foto demasiado perfecta, bio genérica, falta de coherencia o intento de llevarte rápido a WhatsApp o Telegram.",
  },
  {
    title: "Perfil de Instagram o redes sociales",
    text: "Mira si la cuenta parece tener vida real: publicaciones antiguas, comentarios naturales, seguidores coherentes, etiquetas, fotos variadas y actividad normal.",
  },
  {
    title: "Foto reutilizada o robada",
    text: "Una foto puede parecer real y aun así estar reutilizada en varios sitios. Eso baja mucho la confianza en el perfil que la usa.",
  },
  {
    title: "Conversación demasiado intensa",
    text: "Love bombing, cariño exagerado muy rápido, historias tristes, urgencia o presión emocional pueden formar parte de una estafa amorosa.",
  },
  {
    title: "Cripto, inversión o trading",
    text: "Si alguien de una app de citas empieza a hablar de invertir, criptomonedas, beneficios fáciles o plataformas desconocidas, conviene parar.",
  },
  {
    title: "Dinero, códigos o documentos",
    text: "Pedir dinero, códigos, fotos íntimas, documentos, tarjetas regalo o datos personales es una señal clara para ir con mucha precaución.",
  },
];

const checklist = [
  "Sube una captura del perfil, foto o conversación si quieres revisarlo.",
  "Comprueba si hay más fotos variadas y una biografía coherente.",
  "Revisa si aparece verificación visible, pero sin confiarte solo por eso.",
  "Desconfía si intenta moverte rápido a WhatsApp o Telegram.",
  "No envíes dinero, códigos, documentos ni fotos íntimas si hay presión.",
  "Si la conversación avanza, una videollamada corta puede darte más tranquilidad.",
];

const warningSigns = [
  {
    title: "Quiere sacarte rápido de la app",
    text: "Mover la conversación enseguida a WhatsApp, Telegram u otra plataforma puede ser una forma de evitar controles o reportes.",
  },
  {
    title: "Habla de dinero o inversión",
    text: "En una app de citas, una persona que de verdad quiere conocerte no debería meterte prisa para invertir dinero.",
  },
  {
    title: "Evita verificarse",
    text: "Si evita videollamada, cambia de tema, pone excusas constantes o no puede demostrar mínimamente quién es, conviene ir despacio.",
  },
  {
    title: "La foto aparece en otros sitios",
    text: "Una imagen reutilizada no confirma por sí sola una estafa, pero sí puede indicar foto robada, perfil reciclado o catfishing.",
  },
  {
    title: "Demasiada confianza demasiado rápido",
    text: "Mensajes muy intensos, promesas rápidas o vínculo emocional acelerado pueden buscar que bajes la guardia.",
  },
  {
    title: "Pide datos o material sensible",
    text: "Códigos, documentos, dinero, tarjetas regalo o fotos íntimas nunca deberían pedirse con presión o urgencia.",
  },
];

const mistakes = [
  "Creer que una foto bonita significa que el perfil es real.",
  "Confiar solo porque aparece un check o una verificación.",
  "Enviar dinero por una historia urgente o emocional.",
  "Mover la conversación demasiado rápido fuera de la app.",
  "Compartir documentos, códigos o fotos íntimas por presión.",
  "Ignorar contradicciones porque la conversación parece agradable.",
];

const faqs = [
  {
    q: "¿Cómo saber si un perfil de Tinder es falso?",
    a: "Revisa si tiene fotos variadas, biografía coherente, verificación visible, conversación natural y ausencia de señales raras como dinero, inversión, enlaces, presión o evasión de una videollamada sencilla.",
  },
  {
    q: "¿Un perfil verificado siempre es fiable?",
    a: "No. La verificación suma confianza sobre la foto o identidad, pero no garantiza intenciones. Si después aparecen dinero, cripto, presión, códigos o enlaces raros, hay que ir con cuidado.",
  },
  {
    q: "¿Una foto real puede pertenecer a un perfil falso?",
    a: "Sí. Una foto puede ser real, estar robada o reutilizada de otra persona. Por eso no basta con que la imagen parezca natural.",
  },
  {
    q: "¿Qué es catfishing?",
    a: "Catfishing es cuando alguien usa una identidad falsa o fotos de otra persona para engañar, manipular o ganar confianza en internet.",
  },
  {
    q: "¿Qué hago si alguien de una app de citas me habla de invertir?",
    a: "Para y no envíes dinero. Las estafas de romance e inversión suelen empezar con confianza emocional y acaban llevando a plataformas de trading, cripto o pagos difíciles de recuperar.",
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

function UseCaseTitle({ title }: { title: string }) {
  if (title === "Perfil de Tinder, Badoo o Bumble") {
    return (
      <>
        Perfil de <GradientText tone="purplePink">Tinder o Badoo</GradientText>
      </>
    );
  }

  if (title === "Perfil de Instagram o redes sociales") {
    return (
      <>
        Perfil de <GradientText tone="blueCyan">Instagram</GradientText>
      </>
    );
  }

  if (title === "Foto reutilizada o robada") {
    return (
      <>
        Foto <GradientText tone="orangeRed">reutilizada</GradientText> o robada
      </>
    );
  }

  if (title === "Conversación demasiado intensa") {
    return (
      <>
        Conversación demasiado{" "}
        <GradientText tone="amberOrange">intensa</GradientText>
      </>
    );
  }

  if (title === "Cripto, inversión o trading") {
    return (
      <>
        Cripto, inversión o <GradientText tone="green">trading</GradientText>
      </>
    );
  }

  if (title === "Dinero, códigos o documentos") {
    return (
      <>
        Dinero, códigos o{" "}
        <GradientText tone="orangeRed">documentos</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function WarningTitle({ title }: { title: string }) {
  if (title === "Quiere sacarte rápido de la app") {
    return (
      <>
        Quiere sacarte rápido
        <span className="block">
          de la <GradientText tone="orangeRed">app</GradientText>
        </span>
      </>
    );
  }

  if (title === "Habla de dinero o inversión") {
    return (
      <>
        Habla de dinero
        <span className="block">
          o <GradientText tone="green">inversión</GradientText>
        </span>
      </>
    );
  }

  if (title === "Evita verificarse") {
    return (
      <>
        Evita <GradientText tone="blueCyan">verificarse</GradientText>
      </>
    );
  }

  if (title === "La foto aparece en otros sitios") {
    return (
      <>
        La foto aparece
        <span className="block">
          en <GradientText tone="purplePink">otros sitios</GradientText>
        </span>
      </>
    );
  }

  if (title === "Demasiada confianza demasiado rápido") {
    return (
      <>
        Demasiada confianza
        <span className="block">
          demasiado <GradientText tone="amberOrange">rápido</GradientText>
        </span>
      </>
    );
  }

  if (title === "Pide datos o material sensible") {
    return (
      <>
        Pide datos o
        <span className="block">
          material <GradientText tone="orangeRed">sensible</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

export default function DetectarPerfilFalsoPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/detectar-perfil-falso#webpage`,
        url: `${siteUrl}/detectar-perfil-falso`,
        name: "Cómo detectar un perfil falso",
        description:
          "Guía para detectar perfiles falsos en apps de citas y redes sociales: Tinder, Badoo, Bumble, Instagram, catfishing, romance scam, fotos reutilizadas y presión para invertir.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/detectar-perfil-falso#faq`,
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
            <h1 className="mx-auto max-w-[1080px] text-[52px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Cómo detectar un{" "}
              <GradientText tone="purplePink">perfil falso.</GradientText>
              <span className="block text-zinc-500">Antes de confiar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Revisa perfiles de Tinder, Badoo, Bumble, Instagram o redes
              sociales antes de confiar, enviar datos, mover la conversación o
              seguir hablando con alguien que te genera dudas.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Revisar perfil</span>
                <ArrowIcon />
              </Link>

              <a
                href="#casos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver qué revisar</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Perfil revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Este perfil parece muy perfecto y quiere pasar rápido a
                    WhatsApp. También ha mencionado invertir en cripto. ¿Lo revisas?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo iría con cuidado. Citas + salida rápida de la app +
                        inversión es una combinación delicada.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si tiene verificación visible y fotos variadas.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si evita una videollamada corta o pone excusas.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si aparece dinero, inversión, códigos o presión.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No enviaría dinero, documentos ni fotos íntimas. Mantendría
                          la conversación en la app y pediría una videollamada breve
                          si realmente quieres seguir hablando.
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
                        Sube un perfil o una conversación
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

                <h2 className="mt-4 text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Una foto bonita
                  <span className="block text-zinc-500">
                    no confirma una <GradientText tone="purplePink">identidad.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un perfil puede parecer normal y aun así usar fotos
                  reutilizadas, una identidad falsa o una conversación diseñada
                  para ganarse tu confianza. Lo importante es mirar señales en
                  conjunto, no una sola foto.
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

      <section id="casos" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué puedes revisar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Señales que conviene mirar
                <span className="block text-zinc-500">
                  antes de <GradientText tone="blueCyan">confiar.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu puede ayudarte a revisar capturas de perfiles, fotos,
              biografías o conversaciones para separar dudas normales de señales
              realmente preocupantes.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
                  <UseCaseTitle title={item.title} />
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
              Señales de alerta
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              El riesgo suele aparecer
              <span className="block text-zinc-400">
                en la <GradientText tone="orangeRed">conversación.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Una foto puede parecer real. Por eso hay que mirar también la
              urgencia, el dinero, los enlaces, la presión, las excusas y la
              coherencia del perfil.
            </p>
          </div>

          <div className="grid gap-4">
            {warningSigns.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <WarningTitle title={item.title} />
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                No investigues con miedo.
                <span className="block text-zinc-500">
                  Revisa con <GradientText tone="green">calma.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La idea no es desconfiar de todo el mundo. Es detectar señales
                concretas cuando algo no encaja y protegerte antes de compartir
                dinero, datos o intimidad.
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
              <span className="block text-zinc-500">perfiles falsos</span>
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

      <ResourceSignup page="detectar-perfil-falso" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de confiar, revisa el perfil.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube una captura del perfil, foto o conversación. Vonu te ayuda a
            revisar señales de catfishing, foto reutilizada, presión, dinero o
            incoherencias antes de seguir adelante.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar perfil con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}