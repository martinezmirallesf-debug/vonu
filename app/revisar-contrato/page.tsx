import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Qué revisar antes de firmar un contrato — Revísalo con VonuAI",
  description:
    "Aprende qué mirar antes de firmar un contrato: cláusulas, permanencias, penalizaciones, pagos, obligaciones y señales de alerta. Revisa contratos con VonuAI.",
  alternates: {
    canonical: "/revisar-contrato",
  },
  openGraph: {
    title: "Qué revisar antes de firmar un contrato — VonuAI",
    description:
      "Revisa un contrato, cláusula o documento antes de firmar para detectar puntos delicados y entender mejor tus obligaciones.",
    url: `${siteUrl}/revisar-contrato`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qué revisar antes de firmar un contrato — VonuAI",
    description:
      "Detecta cláusulas delicadas, obligaciones, pagos y riesgos antes de firmar un contrato.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Permanencias o penalizaciones",
    text: "Revisa si el contrato te obliga a permanecer un tiempo mínimo o pagar una penalización si cancelas antes.",
  },
  {
    title: "Pagos poco claros",
    text: "Importes, cuotas, subidas, gastos extra, renovaciones automáticas o cargos futuros deberían quedar explicados sin ambigüedad.",
  },
  {
    title: "Obligaciones desequilibradas",
    text: "Cuidado si tú asumes muchas obligaciones y la otra parte apenas asume compromisos concretos.",
  },
  {
    title: "Renovación automática",
    text: "Algunos contratos se renuevan solos si no avisas con antelación. Mira fechas, plazos y forma de cancelación.",
  },
  {
    title: "Cláusulas difíciles de entender",
    text: "Si una parte suena confusa, demasiado técnica o contradictoria, conviene pedir aclaración antes de firmar.",
  },
  {
    title: "Renuncias o límites de responsabilidad",
    text: "Revisa si te hacen renunciar a derechos, aceptar limitaciones fuertes o asumir riesgos que no esperabas.",
  },
];

const checklist = [
  "Comprueba quién firma y con qué datos.",
  "Revisa precio, pagos, gastos, comisiones y posibles subidas.",
  "Mira duración, renovación, permanencia y cancelación.",
  "Lee penalizaciones, obligaciones y límites de responsabilidad.",
  "Detecta cláusulas ambiguas o difíciles de entender.",
  "Sube el contrato a Vonu para resumirlo y revisar puntos delicados.",
];

const commonCases = [
  {
    title: "Contrato de alquiler",
    text: "Duración, fianza, gastos, reparaciones, actualización de renta, penalizaciones y condiciones de salida.",
  },
  {
    title: "Contrato de trabajo",
    text: "Jornada, salario, funciones, periodo de prueba, exclusividad, confidencialidad y condiciones especiales.",
  },
  {
    title: "Contrato de servicios",
    text: "Qué incluye, qué no incluye, plazos, pagos, cancelación, soporte y responsabilidad de cada parte.",
  },
  {
    title: "Condiciones online",
    text: "Suscripciones, renovaciones, uso de datos, cancelación, pagos recurrentes y cambios futuros del servicio.",
  },
];

const mistakes = [
  "Firmar porque “parece estándar” sin leer las condiciones importantes.",
  "Mirar solo el precio y no los gastos, permanencias o penalizaciones.",
  "No comprobar cómo se cancela o cuándo se renueva.",
  "Aceptar cláusulas que no entiendes sin pedir explicación.",
  "No guardar copia del contrato firmado y comunicaciones relacionadas.",
];

const faqs = [
  {
    q: "¿Qué hay que revisar antes de firmar un contrato?",
    a: "Conviene revisar quién firma, objeto del contrato, precio, pagos, duración, renovación, cancelación, penalizaciones, obligaciones de cada parte, límites de responsabilidad y cualquier cláusula que no entiendas.",
  },
  {
    q: "¿VonuAI puede revisar un contrato?",
    a: "Sí. Puedes subir un contrato, pegar una cláusula o explicar la situación para que Vonu te ayude a resumirlo, detectar puntos delicados y preparar preguntas antes de firmar. No sustituye a un abogado.",
  },
  {
    q: "¿Qué hago si no entiendo una cláusula?",
    a: "No firmes con dudas importantes. Pide explicación por escrito, compárala con el resto del contrato y, si puede tener consecuencias relevantes, consulta con un profesional.",
  },
  {
    q: "¿Una cláusula abusiva invalida todo el contrato?",
    a: "Depende del tipo de contrato, la cláusula y la normativa aplicable. Vonu puede ayudarte a detectar posibles señales de alerta, pero una valoración jurídica definitiva debe hacerla un profesional.",
  },
  {
    q: "¿Puedo subir un PDF de contrato a Vonu?",
    a: "Sí, cuando la función esté disponible, podrás subir documentos o copiar el texto para que Vonu lo analice, resuma y te señale qué revisar antes de decidir.",
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
  if (title === "Permanencias o penalizaciones") {
    return (
      <>
        Permanencias o
        <span className="block">
          <GradientText tone="orangeRed">penalizaciones</GradientText>
        </span>
      </>
    );
  }

  if (title === "Pagos poco claros") {
    return (
      <>
        Pagos poco
        <span className="block">
          <GradientText tone="amberOrange">claros</GradientText>
        </span>
      </>
    );
  }

  if (title === "Obligaciones desequilibradas") {
    return (
      <>
        Obligaciones
        <span className="block">
          <GradientText tone="purplePink">desequilibradas</GradientText>
        </span>
      </>
    );
  }

  if (title === "Renovación automática") {
    return (
      <>
        Renovación
        <span className="block">
          <GradientText tone="blueCyan">automática</GradientText>
        </span>
      </>
    );
  }

  if (title === "Cláusulas difíciles de entender") {
    return (
      <>
        Cláusulas difíciles
        <span className="block">
          de <GradientText tone="green">entender</GradientText>
        </span>
      </>
    );
  }

  if (title === "Renuncias o límites de responsabilidad") {
    return (
      <>
        Renuncias o límites
        <span className="block">
          de <GradientText tone="orangeRed">responsabilidad</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function CaseTitle({ title }: { title: string }) {
  if (title === "Contrato de alquiler") {
    return (
      <>
        Contrato de <GradientText tone="purplePink">alquiler</GradientText>
      </>
    );
  }

  if (title === "Contrato de trabajo") {
    return (
      <>
        Contrato de <GradientText tone="blueCyan">trabajo</GradientText>
      </>
    );
  }

  if (title === "Contrato de servicios") {
    return (
      <>
        Contrato de <GradientText tone="blueGreen">servicios</GradientText>
      </>
    );
  }

  if (title === "Condiciones online") {
    return (
      <>
        Condiciones <GradientText tone="amberOrange">online</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function RevisarContratoPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/revisar-contrato#webpage`,
        url: `${siteUrl}/revisar-contrato`,
        name: "Qué revisar antes de firmar un contrato",
        description:
          "Guía para revisar contratos, cláusulas, pagos, permanencias, penalizaciones y obligaciones antes de firmar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/revisar-contrato#faq`,
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
              Qué revisar antes
              <span className="block text-zinc-500">
                de firmar un <GradientText tone="purplePink">contrato.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de aceptar condiciones, pagar una señal o firmar un documento,
              revisa cláusulas, pagos, permanencias, penalizaciones y obligaciones
              que pueden darte problemas después.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Revisar contrato</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Ver señales
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Contrato revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me han pasado un contrato y quieren que lo firme hoy. Hay
                    permanencia, gastos y una cláusula que no entiendo bien.
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no firmaría con dudas importantes. Primero revisaría
                        permanencia, pagos, cancelación y obligaciones reales.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Qué pagas ahora, después y en qué casos sube.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Cómo se cancela, cuándo se renueva y si hay penalización.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Qué obligaciones asume cada parte y qué pasa si algo falla.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Pediría aclaraciones por escrito. Si puede tener
                          consecuencias importantes, lo revisaría con un profesional
                          antes de firmar.
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
                        Pega una cláusula o sube el contrato
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <span className="text-[18px] font-semibold leading-none">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · No sustituye a un abogado.
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
                  No firmes algo
                  <span className="block text-zinc-500">
                    que no <GradientText tone="orangeRed">entiendes.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un contrato no solo importa por lo que dice en grande. Muchas
                  veces el riesgo está en condiciones pequeñas: plazos,
                  renovaciones, gastos, penalizaciones o renuncias.
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
                Puntos delicados
                <span className="block text-zinc-500">
                  que conviene <GradientText tone="blueCyan">mirar.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una cláusula aislada puede parecer normal, pero el conjunto del
              contrato puede dejarte en una posición poco clara o desequilibrada.
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              No todos los contratos
              <span className="block text-zinc-400">
                se revisan <GradientText tone="blueGreen">igual.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Un alquiler, un trabajo, un servicio o una suscripción tienen
              riesgos distintos. Lo importante es saber qué mirar en cada caso.
            </p>
          </div>

          <div className="grid gap-4">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <CaseTitle title={item.title} />
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
                Firmar rápido
                <span className="block text-zinc-500">
                  puede salir <GradientText tone="orangeRed">caro.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Muchas dudas aparecen después de firmar. Por eso conviene revisar
                antes, pedir aclaraciones y guardar todo por escrito.
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
              Dudas antes
              <span className="block text-zinc-500">de firmar</span>
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

      <ResourceSignup page="revisar-contrato" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de firmar, revísalo con calma.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega una cláusula, sube el contrato o explica la situación. Vonu te
            ayuda a entender qué dice, qué revisar y qué preguntar antes de
            decidir.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar contrato con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}