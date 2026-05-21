import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

const invoiceExample =
  "Ahora te voy a pasar una factura o recibo para comprobar si hay algo raro o si me han cobrado de más.";

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

export default function ComprobarFacturaPage() {
  const chatHref = `/chat?example=${encodeURIComponent(invoiceExample)}`;

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
              Cómo comprobar si una factura está bien.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si una factura ha subido, tiene conceptos raros o crees que te han
              cobrado de más, revisa importes, fechas, servicios y condiciones
              antes de pagar o reclamar.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[650px] flex-row justify-center gap-3">
              <Link
                href={chatHref}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Comprobar una factura
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3.5 text-[15px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
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
                  No reclames a ciegas. Primero localiza el cargo.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Una factura puede ser confusa sin estar mal, pero también
                  puede esconder extras, duplicados o cambios de tarifa. La clave
                  es saber qué concepto concreto no encaja.
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
                Puntos que conviene revisar en una factura.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No todos los errores son evidentes. A veces el problema está en un
              concepto pequeño, una fecha o un servicio añadido.
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
              Las facturas raras suelen repetirse por sectores.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Luz, teléfono, suscripciones, reparaciones o compras online. Cada
              factura tiene sus trampas habituales.
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
                El total importa, pero los detalles explican el problema.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Para reclamar bien, necesitas identificar qué cargo no encaja y
                guardar pruebas. Una queja genérica suele tener menos fuerza.
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
              Dudas habituales sobre facturas
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

      <ResourceSignup page="comprobar-factura" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de pagar o reclamar, revísala.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube la factura, pega los conceptos o explica qué cargo no entiendes.
            Vonu te ayuda a ordenar la información y preparar el siguiente paso.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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