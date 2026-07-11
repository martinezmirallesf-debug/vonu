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

function AreaTitle({ title }: { title: string }) {
  if (title === "Fianza y garantías") {
    return (
      <>
        Fianza y
        <span className="block">
          <GradientText tone="purplePink">garantías</GradientText>
        </span>
      </>
    );
  }

  if (title === "Duración y prórrogas") {
    return (
      <>
        Duración y
        <span className="block">
          <GradientText tone="blueCyan">prórrogas</GradientText>
        </span>
      </>
    );
  }

  if (title === "Gastos y suministros") {
    return (
      <>
        Gastos y
        <span className="block">
          <GradientText tone="amberOrange">suministros</GradientText>
        </span>
      </>
    );
  }

  if (title === "Reparaciones y mantenimiento") {
    return (
      <>
        Reparaciones y
        <span className="block">
          <GradientText tone="green">mantenimiento</GradientText>
        </span>
      </>
    );
  }

  if (title === "Penalizaciones") {
    return <GradientText tone="orangeRed">Penalizaciones</GradientText>;
  }

  if (title === "Inventario y estado de la vivienda") {
    return (
      <>
        Inventario y estado
        <span className="block">
          de la <GradientText tone="blueGreen">vivienda</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function WarningTitle({ title }: { title: string }) {
  if (title === "Pagos antes de ver o firmar") {
    return (
      <>
        Pagos antes
        <span className="block">
          de ver o <GradientText tone="orangeRed">firmar</GradientText>
        </span>
      </>
    );
  }

  if (title === "Cláusulas poco claras") {
    return (
      <>
        Cláusulas poco
        <span className="block">
          <GradientText tone="amberOrange">claras</GradientText>
        </span>
      </>
    );
  }

  if (title === "Fianza o garantías excesivas") {
    return (
      <>
        Fianza o garantías
        <span className="block">
          <GradientText tone="purplePink">excesivas</GradientText>
        </span>
      </>
    );
  }

  if (title === "Reparaciones cargadas al inquilino") {
    return (
      <>
        Reparaciones al
        <span className="block">
          <GradientText tone="blueCyan">inquilino</GradientText>
        </span>
      </>
    );
  }

  if (title === "Preaviso o permanencia dura") {
    return (
      <>
        Preaviso o
        <span className="block">
          permanencia <GradientText tone="orangeRed">dura</GradientText>
        </span>
      </>
    );
  }

  if (title === "Datos o identidad poco claros") {
    return (
      <>
        Datos o identidad
        <span className="block">
          poco <GradientText tone="blueGreen">claros</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

export default function RevisarContratoAlquilerPage() {

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
              Revisar contrato
              <span className="block text-zinc-500">
                de alquiler <GradientText tone="purplePink">online.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de firmar o pagar una señal, revisa fianza, duración,
              gastos, reparaciones, penalizaciones y cláusulas que pueden
              afectarte durante todo el alquiler.
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
                href="#puntos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Ver puntos
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Alquiler revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me piden pagar una señal y firmar el contrato de alquiler
                    hoy. Hay fianza, gastos y una cláusula de reparaciones.
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pagaría ni firmaría con prisa. Primero revisaría
                        fianza, gastos, duración, reparaciones y salida anticipada.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Qué pagas ahora y qué te devuelven al salir.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Quién paga suministros, comunidad, reparaciones y gastos extra.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Qué pasa si te vas antes, si renueva solo o si hay daños.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Pediría el contrato completo, aclaraciones por escrito
                          y justificante de cualquier pago. Si hay mucho dinero o
                          dudas importantes, consultaría con un profesional.
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
                        Sube contrato, cláusula o captura
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <VoiceBarsIcon />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · No sustituye asesoramiento legal.
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
                  No firmes si no entiendes
                  <span className="block text-zinc-500">
                    lo que <GradientText tone="orangeRed">aceptas.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  En un contrato de alquiler, una frase pequeña puede afectar a
                  dinero, permanencia, fianza o reparaciones. Vonu te ayuda a
                  detectar puntos que conviene aclarar antes de firmar.
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

      <section id="puntos" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué revisar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Puntos clave
                <span className="block text-zinc-500">
                  antes de <GradientText tone="blueCyan">firmar.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No todos los contratos son iguales. La validez y los límites
              dependen del país, del tipo de contrato y de la cláusula exacta.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviewAreas.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
                  <AreaTitle title={item.title} />
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Algunas cláusulas
              <span className="block text-zinc-400">
                merecen una <GradientText tone="orangeRed">pausa.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              No significa que todo sea ilegal o abusivo, pero sí que conviene
              entenderlo, pedir aclaración por escrito y no firmar con prisa.
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
                Las prisas
                <span className="block text-zinc-500">
                  salen <GradientText tone="orangeRed">caras.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Antes de pagar una señal, enviar documentación o firmar, merece
                la pena revisar el texto exacto y guardar prueba de lo acordado.
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
              <span className="block text-zinc-500">contratos de alquiler</span>
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

      <ResourceSignup page="revisar-contrato-alquiler" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de firmar, revisa el contrato.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube el contrato, una cláusula o una captura. Vonu te ayuda a
            entender obligaciones, pagos, condiciones y puntos que conviene
            aclarar antes de aceptar.
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