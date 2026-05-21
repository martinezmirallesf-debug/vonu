import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Producto — VonuAI",
  description:
    "VonuAI es un asistente para tomar decisiones seguras antes de firmar, pagar, contestar o decidir. Revisa mensajes, webs, contratos, facturas, documentos y situaciones delicadas.",
  alternates: {
    canonical: "/producto",
  },
  openGraph: {
    title: "Producto — VonuAI",
    description:
      "Descubre cómo funciona VonuAI: análisis de mensajes, webs, contratos, facturas, documentos, situaciones sensibles y decisiones importantes.",
    url: `${siteUrl}/producto`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Producto — VonuAI",
    description:
      "VonuAI te ayuda a revisar lo importante antes de actuar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const productPillars = [
  {
    title: "Revisa antes de actuar",
    text: "Pega un mensaje, enlace, cláusula, factura o situación y Vonu te ayuda a detectar señales importantes antes de responder, pagar o firmar.",
  },
  {
    title: "Entiende el riesgo real",
    text: "Vonu no solo dice si algo parece raro. Te explica qué señales ve, por qué importan y qué deberías comprobar antes de decidir.",
  },
  {
    title: "Decide con más calma",
    text: "Cuando hay presión, urgencia o dudas, Vonu te ayuda a ordenar la información y preparar el siguiente paso con más claridad.",
  },
];

const capabilities = [
  {
    title: "Mensajes sospechosos",
    text: "SMS, WhatsApp, emails, enlaces raros, supuestos bancos, paquetería, Hacienda, Bizum o compras entre particulares.",
    href: "/analizar-sms-estafa",
  },
  {
    title: "Webs y tiendas online",
    text: "Revisa si una web parece fiable antes de pagar, meter tarjeta, dejar datos o confiar en una oferta demasiado buena.",
    href: "/comprobar-web-fiable",
  },
  {
    title: "Contratos y documentos",
    text: "Entiende cláusulas, obligaciones, permanencias, penalizaciones, renovaciones y puntos delicados antes de firmar.",
    href: "/revisar-contrato",
  },
  {
    title: "Facturas y cobros",
    text: "Detecta conceptos raros, cargos duplicados, servicios no contratados o importes que no cuadran.",
    href: "/comprobar-factura",
  },
  {
    title: "Presión y manipulación",
    text: "Analiza mensajes o situaciones donde sientes culpa, urgencia, ansiedad, presión o confusión antes de contestar.",
    href: "/detectar-manipulacion",
  },
  {
    title: "Estudio y explicación",
    text: "Vonu también puede ayudarte a entender ejercicios, resumir apuntes, estudiar mejor y preparar explicaciones claras.",
    href: "/chat",
  },
];

const workflow = [
  {
    step: "01",
    title: "Cuéntale qué pasa",
    text: "Escribe la situación, pega el mensaje o comparte el enlace. No hace falta que lo expliques perfecto: Vonu te ayuda a ordenar el caso.",
  },
  {
    step: "02",
    title: "Vonu revisa señales",
    text: "Analiza contexto, tono, urgencia, datos, posibles contradicciones, señales de riesgo y qué puntos conviene comprobar.",
  },
  {
    step: "03",
    title: "Recibes próximos pasos",
    text: "No solo una respuesta. Vonu te propone qué mirar, qué evitar, qué preguntar y cómo avanzar con más seguridad.",
  },
];

const principles = [
  "No sustituye a profesionales cuando el caso requiere ayuda legal, médica, psicológica o financiera cualificada.",
  "No necesitas compartir contraseñas, códigos, datos bancarios completos ni información innecesariamente sensible.",
  "Está pensado para ayudarte a frenar, entender y decidir mejor antes de cometer un error importante.",
  "Combina análisis práctico, tono cercano y orientación responsable para situaciones reales.",
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

export default function ProductoPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px]"
          style={{
            background:
              "linear-gradient(to bottom, #ffffff 0%, #ffffff 20%, rgba(248,249,250,0.98) 45%, rgba(239,246,255,0.86) 72%, rgba(248,249,250,0) 100%)",
          }}
        />
        <div className="absolute left-1/2 top-[84px] h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-blue-500/16 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">

            <h1 className="mx-auto max-w-6xl text-[52px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[82px] lg:text-[112px]">
              Un asistente para revisar lo importante antes de decidir.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              VonuAI te ayuda a analizar mensajes, webs, contratos, facturas,
              documentos y situaciones delicadas antes de firmar, pagar,
              contestar o tomar una decisión importante.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-[650px] flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-4 text-[17px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99] sm:min-w-[260px] sm:flex-1 sm:py-3.5 sm:text-[15px]"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>

              <Link
                href="/recursos"
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-4 text-[17px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:min-w-[260px] sm:flex-1 sm:py-3.5 sm:text-[15px]"
              >
                Ver recursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {productPillars.map((item) => (
              <article
                key={item.title}
                className="rounded-[34px] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-[34px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950">
                  {item.title}
                </h2>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué puede revisar
              </p>

              <h2 className="mt-3 max-w-4xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Vonu entiende problemas reales, no solo preguntas sueltas.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Puedes usarlo cuando algo no encaja, cuando tienes prisa, cuando
              te presionan o cuando necesitas entender mejor antes de actuar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[34px] border border-zinc-200 bg-[#f8f9fa] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950">
                  Ver más
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-4xl">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Cómo funciona
            </p>

            <h2 className="mt-3 text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              De una duda confusa a un siguiente paso más claro.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflow.map((item) => (
              <article
                key={item.step}
                className="rounded-[34px] border border-white/10 bg-white/[0.06] p-6"
              >
                <p className="text-[14px] font-semibold text-blue-300">
                  {item.step}
                </p>

                <h3 className="mt-8 text-[32px] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
                  {item.title}
                </h3>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Uso responsable
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
              Ayuda práctica, con límites claros.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para ayudarte a ganar claridad, no para sustituir
              decisiones profesionales cuando hay consecuencias importantes.
            </p>
          </div>

          <div className="grid gap-3">
            {principles.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-sm"
              >
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="producto" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de firmar, pagar, contestar o decidir… consúltalo con Vonu.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Abre el chat, cuenta qué pasa y revisa la situación con más calma
            antes de dar el siguiente paso.
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