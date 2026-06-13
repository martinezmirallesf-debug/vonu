import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const rentalContractExample =
  "Voy a subir un documento para que lo revises. Te lo paso ahora.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Revisar contrato de alquiler online — Cláusulas, fianza y condiciones",
  description:
    "Revisa un contrato de alquiler antes de firmar: fianza, duración, gastos, reparaciones, penalizaciones, cláusulas abusivas y puntos que conviene comprobar.",
  alternates: {
    canonical: "/revisar-contrato-alquiler",
  },
  openGraph: {
    title: "Revisar contrato de alquiler online — VonuAI",
    description:
      "Sube un contrato de alquiler o una cláusula y revisa puntos delicados antes de firmar: fianza, gastos, duración, penalizaciones y condiciones.",
    url: `${siteUrl}/revisar-contrato-alquiler`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revisar contrato de alquiler online — VonuAI",
    description:
      "Comprueba un contrato de alquiler antes de firmar o pagar una señal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const reviewAreas = [
  {
    title: "Fianza y garantías",
    text: "Comprueba cuánto te piden, en qué concepto, cuándo se devuelve y si aparecen garantías adicionales o pagos que conviene entender bien.",
  },
  {
    title: "Duración y prórrogas",
    text: "Revisa fecha de inicio, duración, renovación, preavisos, salida anticipada y qué ocurre si una parte quiere terminar el contrato.",
  },
  {
    title: "Gastos y suministros",
    text: "Mira quién paga comunidad, agua, luz, gas, internet, basuras, IBI, seguros u otros gastos que a veces aparecen poco claros.",
  },
  {
    title: "Reparaciones y mantenimiento",
    text: "Conviene entender qué reparaciones corresponden al propietario y cuáles podrían intentar trasladarte como inquilino.",
  },
  {
    title: "Penalizaciones",
    text: "Cuidado con permanencias, penalizaciones por marcharte antes, pagos por gestión, gastos de agencia o cargos que no esperabas.",
  },
  {
    title: "Inventario y estado de la vivienda",
    text: "Si hay muebles, electrodomésticos, desperfectos o fotos del estado inicial, conviene dejarlo documentado antes de entrar.",
  },
];

const checklist = [
  "Revisa el país o ciudad del contrato, porque la norma puede cambiar según el lugar.",
  "Comprueba fianza, garantías, señal, mensualidad y pagos antes de firmar.",
  "Mira duración, prórroga, preaviso y penalización por salida anticipada.",
  "Aclara qué gastos paga cada parte y qué servicios están incluidos.",
  "Guarda capturas, correos, justificantes y versiones del contrato.",
  "Si algo no entiendes, pide que te lo aclaren por escrito antes de firmar.",
];

const warningSigns = [
  {
    title: "Pagos antes de ver o firmar",
    text: "Si te piden señal, reserva o transferencia urgente sin contrato claro, sin visitar la vivienda o sin identificar bien a la otra parte, conviene ir con cuidado.",
  },
  {
    title: "Cláusulas poco claras",
    text: "Frases amplias como “todos los gastos serán del inquilino” o penalizaciones ambiguas pueden esconder obligaciones importantes.",
  },
  {
    title: "Fianza o garantías excesivas",
    text: "Si además de la fianza piden varios meses, avales, depósitos o pagos extra, hay que entender exactamente qué cubren y cuándo se devuelven.",
  },
  {
    title: "Reparaciones cargadas al inquilino",
    text: "Algunos contratos intentan pasar al inquilino reparaciones que quizá no deberían corresponderle, especialmente si son averías estructurales o de antigüedad.",
  },
  {
    title: "Preaviso o permanencia dura",
    text: "Un preaviso confuso o una penalización fuerte por irte antes puede tener impacto económico real.",
  },
  {
    title: "Datos o identidad poco claros",
    text: "Propietario, agencia, dirección, cuenta bancaria, referencia catastral o datos de contacto deberían estar bien identificados.",
  },
];

const mistakes = [
  "Firmar sin leer anexos, inventario o condiciones adicionales.",
  "Pagar una señal sin guardar justificante y condiciones por escrito.",
  "Dar por hecho que todos los gastos están incluidos.",
  "No hacer fotos del estado inicial de la vivienda.",
  "Aceptar cambios por WhatsApp sin que queden claros por escrito.",
  "No preguntar el país o normativa aplicable si el contrato no lo deja claro.",
];

const faqs = [
  {
    q: "¿Puedo revisar un contrato de alquiler online con VonuAI?",
    a: "Sí. Puedes subir el contrato, una foto o copiar una cláusula concreta. Vonu te ayuda a entender puntos delicados, obligaciones, pagos y señales que conviene aclarar antes de firmar.",
  },
  {
    q: "¿VonuAI sustituye a un abogado?",
    a: "No. Vonu ofrece orientación preventiva y ayuda a entender el documento, pero no sustituye asesoramiento legal profesional. Si hay mucho dinero, vivienda, conflicto o plazo importante, conviene consultar con un profesional.",
  },
  {
    q: "¿Qué datos debería tapar antes de subir el contrato?",
    a: "Puedes tapar DNI completo, firmas, teléfono, email, dirección exacta, IBAN completo o datos personales que no sean necesarios. Mantén visible la cláusula, importes, fechas y condiciones que quieres revisar.",
  },
  {
    q: "¿Qué cláusulas conviene revisar en un contrato de alquiler?",
    a: "Fianza, duración, prórroga, preaviso, gastos, reparaciones, penalizaciones, actualización de renta, inventario, entrada/salida de la vivienda y condiciones de devolución.",
  },
  {
    q: "¿Qué hago si una cláusula no me queda clara?",
    a: "Pide aclaración por escrito antes de firmar. Si la cláusula afecta a dinero, permanencia, fianza, gastos o penalizaciones, conviene entenderla bien y guardar prueba de lo acordado.",
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

export default function RevisarContratoAlquilerPage() {
  const chatHref = `/chat?example=${encodeURIComponent(rentalContractExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/revisar-contrato-alquiler#webpage`,
        url: `${siteUrl}/revisar-contrato-alquiler`,
        name: "Revisar contrato de alquiler online",
        description:
          "Guía para revisar contratos de alquiler antes de firmar: fianza, garantías, duración, gastos, reparaciones, penalizaciones y cláusulas delicadas.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/revisar-contrato-alquiler#faq`,
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
              Revisar contrato de alquiler online.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de firmar o pagar una señal, revisa fianza, duración,
              gastos, reparaciones, penalizaciones y cláusulas que pueden
              afectarte durante todo el alquiler.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Revisar contrato con Vonu
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
                  No firmes si no entiendes lo que aceptas.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  En un contrato de alquiler, una frase pequeña puede afectar a
                  dinero, permanencia, fianza o reparaciones. Vonu te ayuda a
                  detectar puntos que conviene aclarar antes de firmar.
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

      <section id="puntos" className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué revisar
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Puntos clave antes de firmar.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No todos los contratos son iguales. La validez y los límites
              dependen del país, del tipo de contrato y de la cláusula exacta.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviewAreas.map((item) => (
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
              Señales de cuidado
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Algunas cláusulas merecen una pausa.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              No significa que todo sea ilegal o abusivo, pero sí que conviene
              entenderlo, pedir aclaración por escrito y no firmar con prisa.
            </p>
          </div>

          <div className="grid gap-3">
            {warningSigns.map((item) => (
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
                Las prisas salen caras.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Antes de pagar una señal, enviar documentación o firmar, merece
                la pena revisar el texto exacto y guardar prueba de lo acordado.
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
              Dudas habituales sobre contratos de alquiler
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

      <ResourceSignup page="revisar-contrato-alquiler" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de firmar, revisa el contrato.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube el contrato, una cláusula o una captura. Vonu te ayuda a
            entender obligaciones, pagos, condiciones y puntos que conviene
            aclarar antes de aceptar.
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