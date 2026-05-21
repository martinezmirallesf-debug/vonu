import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Recursos Vonu — Guías, avances y decisiones seguras",
  description:
    "Recursos VonuAI: guías prácticas, avances de producto, seguridad, estudio, voz, documentos y decisiones digitales.",
  alternates: {
    canonical: "/recursos",
  },
  openGraph: {
    title: "Recursos Vonu — Guías, avances y decisiones seguras",
    description:
      "Guías prácticas, avances de producto y recursos para usar VonuAI con más claridad.",
    url: `${siteUrl}/recursos`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos Vonu — Guías, avances y decisiones seguras",
    description:
      "Guías, avances y recursos para decidir mejor con VonuAI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const featuredResources = [
  {
    title: "Cómo saber si un SMS puede ser una estafa",
    category: "Estafas",
    text: "Señales habituales, errores comunes y pasos prudentes antes de pulsar un enlace o compartir datos.",
    href: "/analizar-sms-estafa",
  },
  {
    title: "Cómo comprobar si una web es fiable",
    category: "Webs",
    text: "Qué revisar antes de pagar: dominio, datos legales, métodos de pago, opiniones y señales de presión.",
    href: "/comprobar-web-fiable",
  },
  {
    title: "Qué mirar antes de firmar un contrato",
    category: "Documentos",
    text: "Puntos básicos para detectar cláusulas confusas, obligaciones, permanencias, penalizaciones y riesgos.",
    href: "/revisar-contrato",
  },
  {
  title: "Cómo comprobar si una factura está bien",
  category: "Facturas",
  text: "Revisa importes, conceptos, cargos duplicados, servicios no contratados y qué hacer si crees que te han cobrado de más.",
  href: "/comprobar-factura",
},
];

const categories = [
  {
    title: "Seguridad digital",
    text: "Mensajes sospechosos, enlaces, webs, pagos, fraudes y decisiones online.",
  },
  {
    title: "Documentos y contratos",
    text: "Facturas, PDFs, condiciones, cláusulas, recibos y textos difíciles de entender.",
  },
  {
    title: "Voz y producto",
    text: "Avances de Vonu, modo conversación, análisis de archivos y nuevas funciones.",
  },
  {
    title: "Tutor y estudio",
    text: "Explicaciones paso a paso, resúmenes, ejercicios, voz y ayudas visuales.",
  },
  {
    title: "Psicología aplicada",
    text: "Presión, manipulación, dudas antes de responder y claridad emocional.",
  },
  {
    title: "Uso responsable",
    text: "Buenas prácticas para usar IA con privacidad, criterio y seguridad.",
  },
];

const upcoming = [
  "Guías cortas para detectar estafas frecuentes.",
  "Explicaciones sobre nuevas funciones de Vonu.",
  "Casos prácticos de webs, contratos, facturas y mensajes.",
  "Recursos para estudiar mejor con voz, archivos e imágenes.",
  "Consejos de privacidad y uso responsable de IA.",
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

export default function RecursosPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
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
            <h1 className="mx-auto max-w-5xl text-[52px] font-semibold leading-[0.92] tracking-[-0.075em] text-zinc-950 sm:text-[78px] lg:text-[104px]">
              Guías y avances para decidir mejor.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Recursos prácticos sobre seguridad digital, documentos, estudio,
              voz, IA responsable y nuevas formas de usar Vonu con claridad.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Destacados
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Primeras guías para revisar antes de actuar.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Empezamos por las dudas más comunes: mensajes raros, webs poco
              claras y documentos que conviene entender antes de aceptar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredResources.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[320px] flex-col rounded-[34px] border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  {item.category}
                </p>

                <h3 className="mt-12 text-[32px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950">
                  Ver recurso
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Explorar
            </p>

            <h2 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
              No solo seguridad. También claridad.
            </h2>

            <p className="mt-5 text-[17px] leading-8 text-zinc-600">
              Vonu no se queda en detectar estafas. También ayuda a entender,
              estudiar, revisar documentos y preparar mejores decisiones.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => (
              <article
                key={item.title}
                className="rounded-[32px] border border-zinc-200 bg-[#f8f9fa] p-6 shadow-sm"
              >
                <h3 className="text-[28px] font-semibold tracking-[-0.05em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
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
              Próximamente
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Un centro vivo de guías, producto y seguridad.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Esta sección crecerá con nuevas guías, actualizaciones, ejemplos
              prácticos y recursos para usar Vonu mejor.
            </p>
          </div>

          <div className="grid gap-3">
            {upcoming.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-[15.5px] leading-7 text-zinc-200"
              >
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-400 text-zinc-950">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="recursos" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            ¿Tienes una duda real ahora?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Abre Vonu, pega el mensaje, sube el archivo o explica la situación.
            Lo importante es revisar antes de actuar.
          </p>

          <Link
            href="/chat"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Abrir Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}