import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

const contractExample =
  "Ahora te voy a pasar un contrato o una cláusula para revisarlo conmigo antes de firmar.";

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

export default function RevisarContratoPage() {
  const chatHref = `/chat?example=${encodeURIComponent(contractExample)}`;

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
              Qué revisar antes de firmar un contrato.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de aceptar condiciones, pagar una señal o firmar un documento,
              revisa cláusulas, pagos, permanencias, penalizaciones y obligaciones
              que pueden darte problemas después.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[650px] flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={chatHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-4 text-[17px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99] sm:min-w-[260px] sm:flex-1 sm:py-3.5 sm:text-[15px]"
              >
                Revisar un contrato
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-4 text-[17px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:min-w-[260px] sm:flex-1 sm:py-3.5 sm:text-[15px]"
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
                  No firmes algo que no entiendes.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un contrato no solo importa por lo que dice en grande. Muchas
                  veces el riesgo está en condiciones pequeñas: plazos,
                  renovaciones, gastos, penalizaciones o renuncias.
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
                Puntos delicados que conviene mirar.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una cláusula aislada puede parecer normal, pero el conjunto del
              contrato puede dejarte en una posición poco clara o desequilibrada.
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
              No todos los contratos se revisan igual.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Un alquiler, un trabajo, un servicio o una suscripción tienen
              riesgos distintos. Lo importante es saber qué mirar en cada caso.
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
                Firmar rápido puede salir caro.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Muchas dudas aparecen después de firmar. Por eso conviene revisar
                antes, pedir aclaraciones y guardar todo por escrito.
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
              Dudas habituales antes de firmar
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

      <ResourceSignup page="revisar-contrato" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de firmar, revísalo con calma.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega una cláusula, sube el contrato o explica la situación. Vonu te
            ayuda a entender qué dice, qué revisar y qué preguntar antes de
            decidir.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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