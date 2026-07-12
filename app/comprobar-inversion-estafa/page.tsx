import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";
import VoiceBarsIcon from "../components/VoiceBarsIcon";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Comprobar si una inversión es estafa — Revísala con VonuAI",
  description:
    "Revisa una inversión, plataforma de trading, criptomonedas, supuestos beneficios rápidos o propuesta por WhatsApp antes de enviar dinero.",
  alternates: {
    canonical: "/comprobar-inversion-estafa",
  },
  openGraph: {
    title: "Comprobar si una inversión es estafa — VonuAI",
    description:
      "Analiza señales de riesgo en inversiones, trading, criptomonedas, plataformas desconocidas y promesas de ganancias rápidas.",
    url: `${siteUrl}/comprobar-inversion-estafa`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprobar si una inversión es estafa — VonuAI",
    description:
      "Revísala antes de transferir dinero, registrarte o seguir instrucciones.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Rentabilidad garantizada",
    text: "Promesas de beneficios fijos, altos y sin riesgo suelen ser una señal muy delicada. En inversión real siempre existe riesgo.",
  },
  {
    title: "Te contactan por WhatsApp",
    text: "Muchos fraudes empiezan con un mensaje, grupo, supuesto asesor, contacto de redes o una persona que dice ayudarte paso a paso.",
  },
  {
    title: "Te piden ingresar rápido",
    text: "La urgencia para transferir, aprovechar una oportunidad limitada o no perder una supuesta ganancia busca que no compruebes.",
  },
  {
    title: "La plataforma no está clara",
    text: "Si no sabes quién gestiona la plataforma, dónde está registrada, cómo retirar dinero o quién responde legalmente, hay que frenar.",
  },
  {
    title: "Primero ganas fácil",
    text: "Algunas estafas muestran ganancias iniciales para que confíes, inviertas más y luego te pidan comisiones, impuestos o desbloqueos.",
  },
  {
    title: "Retirar dinero se complica",
    text: "Si para retirar te piden más ingresos, verificaciones extrañas, tasas o nuevos pagos, es una señal de riesgo importante.",
  },
];

const checklist = [
  "No transfieras dinero por presión o urgencia.",
  "No compartas DNI, tarjeta, claves ni códigos.",
  "Comprueba si la empresa está identificada y regulada.",
  "Desconfía de rentabilidades garantizadas o muy altas.",
  "Revisa si puedes retirar dinero sin pagar más.",
  "Pega la propuesta en Vonu antes de enviar dinero.",
];

const commonExamples = [
  {
    title: "Inversión por WhatsApp",
    text: "Una persona o supuesto asesor te guía paso a paso para registrarte, ingresar dinero y seguir operaciones.",
  },
  {
    title: "Plataforma de trading",
    text: "La web parece profesional, muestra gráficos y beneficios, pero no sabes si la empresa existe realmente.",
  },
  {
    title: "Criptomonedas rápidas",
    text: "Te prometen multiplicar dinero, recuperar pérdidas o entrar en una oportunidad limitada con beneficios muy altos.",
  },
  {
    title: "Retirada bloqueada",
    text: "Intentas sacar dinero y te piden pagar tasas, impuestos, comisiones o hacer otro depósito para desbloquear la cuenta.",
  },
];

const mistakes = [
  "Enviar dinero porque al principio parece que ganas.",
  "Confiar en capturas de beneficios o testimonios del propio grupo.",
  "Instalar apps o entrar en plataformas enviadas por un supuesto asesor.",
  "Pagar una comisión para desbloquear una retirada.",
  "Compartir documentos personales antes de saber quién está detrás.",
  "Creer que una web profesional prueba que la inversión es real.",
];

const faqs = [
  {
    q: "¿Cómo saber si una inversión es una estafa?",
    a: "Desconfía si prometen beneficios altos o garantizados, te meten prisa, te contactan por WhatsApp o Telegram, no está claro quién está detrás, cuesta retirar dinero o te piden ingresar más para desbloquear ganancias.",
  },
  {
    q: "¿Puedo comprobar una plataforma de inversión con VonuAI?",
    a: "Sí. Puedes pegar el nombre, la web, el mensaje recibido o subir capturas. Vonu te ayuda a revisar señales de riesgo antes de enviar dinero o compartir datos.",
  },
  {
    q: "¿Es normal que me pidan pagar para retirar mis ganancias?",
    a: "Es una señal muy delicada. En muchas estafas, cuando intentas retirar, aparecen supuestas tasas, impuestos o comisiones. Antes de pagar más, conviene parar y revisar la situación.",
  },
  {
    q: "¿Qué hago si ya he enviado dinero?",
    a: "Guarda capturas, movimientos, conversaciones, webs y datos de pago. Contacta con tu banco cuanto antes y valora denunciar. No sigas enviando dinero para desbloquear supuestas ganancias.",
  },
  {
    q: "¿VonuAI da asesoramiento financiero?",
    a: "No. Vonu ofrece orientación preventiva para revisar señales de riesgo y ayudarte a decidir con más calma. No sustituye a asesores financieros, abogados, bancos, reguladores ni autoridades.",
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

function WarningTitle({ title }: { title: string }) {
  if (title === "Rentabilidad garantizada") {
    return (
      <>
        Rentabilidad
        <span className="block">
          <GradientText tone="orangeRed">garantizada</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te contactan por WhatsApp") {
    return (
      <>
        Te contactan
        <span className="block">
          por <GradientText tone="green">WhatsApp</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te piden ingresar rápido") {
    return (
      <>
        Te piden ingresar
        <span className="block">
          <GradientText tone="amberOrange">rápido</GradientText>
        </span>
      </>
    );
  }

  if (title === "La plataforma no está clara") {
    return (
      <>
        Plataforma
        <span className="block">
          poco <GradientText tone="blueCyan">clara</GradientText>
        </span>
      </>
    );
  }

  if (title === "Primero ganas fácil") {
    return (
      <>
        Primero ganas
        <span className="block">
          <GradientText tone="purplePink">fácil</GradientText>
        </span>
      </>
    );
  }

  if (title === "Retirar dinero se complica") {
    return (
      <>
        Retirar dinero
        <span className="block">
          se <GradientText tone="orangeRed">complica</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title === "Inversión por WhatsApp") {
    return (
      <>
        Inversión por <GradientText tone="green">WhatsApp</GradientText>
      </>
    );
  }

  if (title === "Plataforma de trading") {
    return (
      <>
        Plataforma de <GradientText tone="blueCyan">trading</GradientText>
      </>
    );
  }

  if (title === "Criptomonedas rápidas") {
    return (
      <>
        Criptomonedas <GradientText tone="orangeRed">rápidas</GradientText>
      </>
    );
  }

  if (title === "Retirada bloqueada") {
    return (
      <>
        Retirada <GradientText tone="purplePink">bloqueada</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function ComprobarInversionEstafaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/comprobar-inversion-estafa#webpage`,
        url: `${siteUrl}/comprobar-inversion-estafa`,
        name: "Comprobar si una inversión es estafa",
        description:
          "Herramienta de orientación para revisar inversiones, plataformas de trading, criptomonedas y propuestas de ganancias rápidas antes de enviar dinero.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/comprobar-inversion-estafa#faq`,
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
              ¿Esta inversión
              <span className="block text-zinc-500">
                puede ser una <GradientText tone="orangeRed">estafa?</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si te ofrecen invertir por WhatsApp, Telegram, una web desconocida,
              criptomonedas, trading o beneficios rápidos, revísalo antes de
              transferir dinero o compartir documentos.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Comprobar inversión</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver señales de alerta</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Inversión revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me han escrito por WhatsApp sobre una plataforma de trading.
                    Dicen que puedo ganar un 15% semanal y que me ayudan a retirar
                    el dinero cuando quiera. ¿Me puedo fiar?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo frenaría antes de ingresar dinero. Rentabilidad alta +
                        contacto por WhatsApp + ayuda guiada es una combinación
                        de riesgo.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si la empresa existe, está identificada y aparece en registros oficiales.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si prometen beneficios garantizados o demasiado altos.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si para retirar dinero luego piden tasas, comisiones o nuevos ingresos.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No enviaría dinero ni documentos todavía. Guardaría las
                          conversaciones, buscaría la empresa fuera de su web y
                          comprobaría si hay alertas, quejas o datos regulatorios.
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
                        Pega la inversión o sube capturas
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <VoiceBarsIcon />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · No es asesoramiento financiero.
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
                  Antes de transferir,
                  <span className="block text-zinc-500">
                    <GradientText tone="orangeRed">verifica.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Una inversión sospechosa no siempre parece falsa al principio.
                  Puede tener web profesional, gráficos, asesores, testimonios y
                  beneficios aparentes. Lo importante es revisar antes de enviar más.
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas típicas
                <span className="block text-zinc-500">
                  de una <GradientText tone="orangeRed">inversión peligrosa.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una sola señal no siempre confirma una estafa, pero varias juntas
              son motivo suficiente para no enviar dinero y comprobarlo mejor.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.96] sm:tracking-[-0.065em] sm:text-[72px]">
              Cambia la promesa,
              <span className="block text-zinc-400">
                pero el <GradientText tone="orangeRed">patrón se repite.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Trading, criptomonedas, gestores, plataformas, grupos privados o
              supuestos expertos. Casi siempre prometen control, beneficio y retirada fácil.
            </p>
          </div>

          <div className="grid gap-4">
            {commonExamples.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <ExampleTitle title={item.title} />
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
                Lo peligroso no es preguntar.
                <span className="block text-zinc-500">
                  Es enviar dinero <GradientText tone="amberOrange">sin comprobar.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Muchos fraudes de inversión están diseñados para parecer
                profesionales. El error suele ser confiar cuando todavía no has
                verificado quién está detrás.
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
              <span className="block text-zinc-500">inversiones sospechosas</span>
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

      <ResourceSignup page="comprobar-inversion-estafa" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de enviar dinero, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega la web, conversación, propuesta o capturas. Vonu te ayuda a
            revisar señales de riesgo antes de invertir, registrarte o transferir.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar inversión con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}