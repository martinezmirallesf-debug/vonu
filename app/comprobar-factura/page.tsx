import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo comprobar si una factura está bien — Revísala con VonuAI",
  description:
    "Aprende a revisar una factura o recibo: importes, conceptos, cargos duplicados, fechas, impuestos, servicios no contratados y cobros de más. Compruébala con VonuAI.",
  alternates: {
    canonical: "/comprobar-factura",
  },
  openGraph: {
    title: "Cómo comprobar si una factura está bien — VonuAI",
    description:
      "Revisa facturas, recibos y cargos sospechosos antes de pagar o reclamar.",
    url: `${siteUrl}/comprobar-factura`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo comprobar si una factura está bien — VonuAI",
    description:
      "Detecta cargos raros, importes incorrectos y conceptos confusos en una factura.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Importe más alto de lo esperado",
    text: "Si la factura sube sin explicación clara, revisa cambios de tarifa, consumos, servicios añadidos, impuestos o cargos extraordinarios.",
  },
  {
    title: "Conceptos que no entiendes",
    text: "Una factura debería permitirte identificar qué te cobran, por qué periodo y bajo qué condiciones.",
  },
  {
    title: "Cargos duplicados",
    text: "Comprueba si aparecen dos veces el mismo servicio, cuota, suplemento, envío, comisión o producto.",
  },
  {
    title: "Servicios no contratados",
    text: "A veces aparecen extras, seguros, suscripciones, mantenimiento o servicios añadidos que no recuerdas haber aceptado.",
  },
  {
    title: "Fechas que no cuadran",
    text: "Revisa periodo facturado, fecha de emisión, vencimiento, renovaciones y si se solapa con otra factura.",
  },
  {
    title: "Datos fiscales o bancarios raros",
    text: "Si los datos de la empresa, número de factura, cuenta de pago o forma de cobro no encajan, conviene verificar antes de pagar.",
  },
];

const checklist = [
  "Comprueba emisor, fecha, número de factura y datos del cliente.",
  "Revisa periodo facturado y si coincide con lo contratado.",
  "Mira conceptos, unidades, precios, descuentos, impuestos y total.",
  "Busca cargos duplicados, extras o servicios no contratados.",
  "Compara con facturas anteriores si el importe ha subido.",
  "Sube la factura a Vonu para resumirla y detectar puntos raros.",
];

const commonCases = [
  {
    title: "Factura de luz o gas",
    text: "Consumo, potencia, peajes, impuestos, descuentos, regularizaciones y cambios de tarifa.",
  },
  {
    title: "Factura de teléfono o internet",
    text: "Líneas extra, permanencias, servicios añadidos, llamadas, roaming, cuotas y promociones caducadas.",
  },
  {
    title: "Recibo bancario o suscripción",
    text: "Cobros recurrentes, renovaciones automáticas, importes inesperados y servicios que ya no usas.",
  },
  {
    title: "Factura de compra o reparación",
    text: "Mano de obra, piezas, garantías, suplementos, envíos, descuentos y conceptos poco claros.",
  },
];

const mistakes = [
  "Pagar una factura rara sin revisar conceptos y fechas.",
  "Mirar solo el total y no los cargos pequeños.",
  "No comparar con meses anteriores cuando el importe sube.",
  "Reclamar sin guardar factura, capturas, contrato o justificantes.",
  "Ignorar cargos recurrentes pequeños porque parecen poco importantes.",
];

const faqs = [
  {
    q: "¿Cómo saber si una factura está bien?",
    a: "Revisa emisor, datos del cliente, fecha, número de factura, periodo facturado, conceptos, unidades, precio, impuestos, descuentos y total. También conviene comparar con facturas anteriores si el importe ha cambiado.",
  },
  {
    q: "¿Qué hago si una factura tiene un cargo que no entiendo?",
    a: "No pagues a ciegas si el cargo es importante. Pide desglose, revisa el contrato o condiciones del servicio, guarda capturas y solicita explicación por escrito.",
  },
  {
    q: "¿Cómo reclamar una factura incorrecta?",
    a: "Guarda la factura, contrato, justificantes y comunicaciones. Contacta con la empresa por un canal oficial, explica el cargo concreto que reclamas y pide número de incidencia o respuesta por escrito.",
  },
  {
    q: "¿Puede VonuAI revisar una factura?",
    a: "Sí. Puedes copiar los datos principales, subir una captura o adjuntar el documento cuando la función esté disponible. Vonu te ayuda a resumirla, detectar conceptos raros y preparar preguntas o reclamaciones.",
  },
  {
    q: "¿Qué hago si ya he pagado una factura incorrecta?",
    a: "Guarda el justificante de pago, revisa si puedes reclamar devolución o rectificación, contacta con la empresa y consulta con tu banco si el cobro fue no autorizado.",
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
  if (title === "Importe más alto de lo esperado") {
    return (
      <>
        Importe más alto
        <span className="block">
          de lo <GradientText tone="orangeRed">esperado</GradientText>
        </span>
      </>
    );
  }

  if (title === "Conceptos que no entiendes") {
    return (
      <>
        Conceptos que
        <span className="block">
          no <GradientText tone="blueCyan">entiendes</GradientText>
        </span>
      </>
    );
  }

  if (title === "Cargos duplicados") {
    return (
      <>
        Cargos <GradientText tone="amberOrange">duplicados</GradientText>
      </>
    );
  }

  if (title === "Servicios no contratados") {
    return (
      <>
        Servicios no
        <span className="block">
          <GradientText tone="purplePink">contratados</GradientText>
        </span>
      </>
    );
  }

  if (title === "Fechas que no cuadran") {
    return (
      <>
        Fechas que
        <span className="block">
          no <GradientText tone="green">cuadran</GradientText>
        </span>
      </>
    );
  }

  if (title === "Datos fiscales o bancarios raros") {
    return (
      <>
        Datos fiscales o
        <span className="block">
          bancarios <GradientText tone="blueGreen">raros</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function CommonCaseTitle({ title }: { title: string }) {
  if (title === "Factura de luz o gas") {
    return (
      <>
        Factura de <GradientText tone="amberOrange">luz o gas</GradientText>
      </>
    );
  }

  if (title === "Factura de teléfono o internet") {
    return (
      <>
        Factura de teléfono o <GradientText tone="blueCyan">internet</GradientText>
      </>
    );
  }

  if (title === "Recibo bancario o suscripción") {
    return (
      <>
        Recibo bancario o <GradientText tone="purplePink">suscripción</GradientText>
      </>
    );
  }

  if (title === "Factura de compra o reparación") {
    return (
      <>
        Factura de compra o <GradientText tone="green">reparación</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function ComprobarFacturaPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/comprobar-factura#webpage`,
        url: `${siteUrl}/comprobar-factura`,
        name: "Cómo comprobar si una factura está bien",
        description:
          "Guía para revisar facturas, recibos, cargos duplicados, servicios no contratados e importes sospechosos.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/comprobar-factura#faq`,
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
              Comprueba una{" "}
              <GradientText tone="green">factura.</GradientText>
              <span className="block text-zinc-500">Antes de pagar o reclamar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si una factura ha subido, tiene conceptos raros o crees que te han
              cobrado de más, revisa importes, fechas, servicios y condiciones
              antes de pagar o reclamar.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Comprobar factura</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
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
                    Factura revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Esta factura de internet me ha subido este mes y no entiendo
                    varios conceptos. ¿Puedes decirme qué revisar antes de reclamar?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Primero localizaría el cargo exacto que ha cambiado. Reclamar con un concepto concreto suele tener más fuerza.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si hay servicios añadidos o promociones caducadas.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si el periodo facturado coincide con lo contratado.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si el mismo concepto aparece duplicado o con otro nombre.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Guardaría la factura y compararía con la anterior.
                          Después pediría desglose por escrito del concepto que no
                          encaja y número de incidencia.
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
                        Sube una factura o pregunta algo
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
                  No reclames a ciegas.
                  <span className="block text-zinc-500">
                    Primero localiza el <GradientText tone="green">cargo.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Una factura puede ser confusa sin estar mal, pero también
                  puede esconder extras, duplicados o cambios de tarifa. La clave
                  es saber qué concepto concreto no encaja.
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
                Puntos que conviene
                <span className="block text-zinc-500">
                  revisar en una <GradientText tone="blueCyan">factura.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No todos los errores son evidentes. A veces el problema está en un
              concepto pequeño, una fecha o un servicio añadido.
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
              Las facturas raras
              <span className="block text-zinc-400">
                se repiten por <GradientText tone="amberOrange">sectores.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Luz, teléfono, suscripciones, reparaciones o compras online. Cada
              factura tiene sus puntos habituales de revisión.
            </p>
          </div>

          <div className="grid gap-4">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                El total importa.
                <span className="block text-zinc-500">
                  Pero los <GradientText tone="purplePink">detalles explican</GradientText> el problema.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Para reclamar bien, necesitas identificar qué cargo no encaja y
                guardar pruebas. Una queja genérica suele tener menos fuerza.
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
              <span className="block text-zinc-500">facturas</span>
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

      <ResourceSignup page="comprobar-factura" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de pagar o reclamar, revísala.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube la factura, pega los conceptos o explica qué cargo no entiendes.
            Vonu te ayuda a ordenar la información y preparar el siguiente paso.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Comprobar factura con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}