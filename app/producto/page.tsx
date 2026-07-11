import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

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
    description: "VonuAI te ayuda a revisar lo importante antes de actuar.",
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
    title: "Entiende mejor el riesgo",
    text: "Vonu no solo dice si algo parece raro. Te explica qué señales ve, por qué importan y qué conviene comprobar antes de decidir.",
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

function PillarTitle({ title }: { title: string }) {
  if (title === "Revisa antes de actuar") {
    return (
      <>
        Revisa antes
        <span className="block">
          de <GradientText tone="blueCyan">actuar</GradientText>
        </span>
      </>
    );
  }

  if (title === "Entiende mejor el riesgo") {
    return (
      <>
        Entiende mejor
        <span className="block">
          el <GradientText tone="orangeRed">riesgo</GradientText>
        </span>
      </>
    );
  }

  if (title === "Decide con más calma") {
    return (
      <>
        Decide con
        <span className="block">
          más <GradientText tone="green">calma</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function CapabilityTitle({ title }: { title: string }) {
  if (title === "Mensajes sospechosos") {
    return (
      <>
        Mensajes <GradientText tone="orangeRed">sospechosos</GradientText>
      </>
    );
  }

  if (title === "Webs y tiendas online") {
    return (
      <>
        Webs y tiendas <GradientText tone="blueCyan">online</GradientText>
      </>
    );
  }

  if (title === "Contratos y documentos") {
    return (
      <>
        Contratos y <GradientText tone="purplePink">documentos</GradientText>
      </>
    );
  }

  if (title === "Facturas y cobros") {
    return (
      <>
        Facturas y <GradientText tone="amberOrange">cobros</GradientText>
      </>
    );
  }

  if (title === "Presión y manipulación") {
    return (
      <>
        Presión y <GradientText tone="orangeRed">manipulación</GradientText>
      </>
    );
  }

  if (title === "Estudio y explicación") {
    return (
      <>
        Estudio y <GradientText tone="green">explicación</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function ProductoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/producto#webpage`,
    url: `${siteUrl}/producto`,
    name: "Producto — VonuAI",
    description:
      "VonuAI es un asistente para revisar mensajes, webs, contratos, facturas, documentos y situaciones delicadas antes de firmar, pagar, contestar o decidir.",
    inLanguage: "es-ES",
    isPartOf: {
      "@type": "WebSite",
      name: "VonuAI",
      url: siteUrl,
    },
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
          <div className="mx-auto max-w-[1160px] text-center">
            <h1 className="mx-auto max-w-[1120px] text-[52px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Un asistente para revisar
              <span className="block text-zinc-500">
                lo importante antes de <GradientText tone="blueGreen">decidir.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              VonuAI te ayuda a analizar mensajes, webs, contratos, facturas,
              documentos y situaciones delicadas antes de firmar, pagar,
              contestar o tomar una decisión importante.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Probar Vonu</span>
                <ArrowIcon />
              </Link>

              <Link
                href="/recursos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Ver recursos
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Análisis preventivo
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me han enviado una web, una factura y un mensaje raro. No sé
                    si responder, pagar o esperar. ¿Lo revisas?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Antes de actuar, yo revisaría señales de riesgo, contexto,
                        urgencia y próximos pasos seguros.
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {["Fraude", "Contrato", "Decisión"].map((item) => (
                          <div
                            key={item}
                            className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm"
                          >
                            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Revisión
                            </p>
                            <p className="mt-2 text-[24px] font-semibold tracking-[-0.055em] text-zinc-950">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <p className="font-semibold text-zinc-950">
                          Qué devuelve Vonu:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Qué señales importan y cuáles no son concluyentes.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Qué evitar mientras compruebas la situación.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Qué siguiente paso tiene más sentido.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_13px_rgba(0,0,0,0.135),0_3px_8px_rgba(0,0,0,0.085)]">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full text-zinc-900">
                        <span className="text-[25px] leading-none">+</span>
                      </div>

                      <div className="min-w-0 flex-1 truncate whitespace-nowrap text-left text-[13.5px] text-zinc-400 sm:text-[16px]">
                        Pega un mensaje, web, factura o contrato
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
          <div className="grid gap-5 lg:grid-cols-3">
            {productPillars.map((item) => (
              <article
                key={item.title}
                className="min-h-[300px] rounded-[38px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]"
              >
                <h2 className="mt-12 text-[38px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[44px]">
                  <PillarTitle title={item.title} />
                </h2>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué puede revisar
              </p>

              <h2 className="mt-3 max-w-4xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Vonu entiende problemas reales,
                <span className="block text-zinc-500">
                  no solo preguntas <GradientText tone="blueCyan">sueltas.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Puedes usarlo cuando algo no encaja, cuando tienes prisa, cuando
              te presionan o cuando necesitas entender mejor antes de actuar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group min-h-[330px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
                  <CapabilityTitle title={item.title} />
                </h3>

                <p className="mt-5 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950">
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

            <h2 className="mt-3 text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              De una duda confusa
              <span className="block text-zinc-400">
                a un siguiente paso <GradientText tone="blueGreen">más claro.</GradientText>
              </span>
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {workflow.map((item) => (
              <article
                key={item.step}
                className="min-h-[320px] rounded-[34px] border border-white/10 bg-white/[0.06] p-7 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <p className="text-[14px] font-semibold text-blue-300">
                  {item.step}
                </p>

                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
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

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Uso responsable
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
              Ayuda práctica,
              <span className="block text-zinc-500">
                con límites <GradientText tone="purplePink">claros.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Vonu está pensado para ayudarte a ganar claridad, no para sustituir
              decisiones profesionales cuando hay consecuencias importantes.
            </p>
          </div>

          <div className="grid gap-4">
            {principles.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[30px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)]"
              >
                <span className="shrink-0 text-zinc-950">
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
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de firmar, pagar, contestar o decidir… consúltalo con Vonu.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Abre el chat, cuenta qué pasa y revisa la situación con más calma
            antes de dar el siguiente paso.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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