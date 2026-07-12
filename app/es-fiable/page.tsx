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
  title: "¿Es fiable? — Compruébalo con VonuAI antes de actuar",
  description:
    "Comprueba si una web, tienda online, mensaje, perfil, inversión, factura o contrato parece fiable antes de pagar, firmar, contestar o compartir datos.",
  alternates: {
    canonical: "/es-fiable",
  },
  openGraph: {
    title: "¿Es fiable? — Compruébalo con VonuAI",
    description:
      "Revisa señales de riesgo antes de confiar en una web, tienda, mensaje, perfil, oferta, inversión o documento.",
    url: `${siteUrl}/es-fiable`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Es fiable? — VonuAI",
    description:
      "Comprueba si algo parece fiable antes de pagar, firmar, contestar o decidir.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const trustAreas = [
  {
    title: "Web o tienda online",
    text: "Revisa si una página tiene datos legales claros, métodos de pago seguros, opiniones externas, política de devoluciones y señales coherentes antes de comprar.",
  },
  {
    title: "Mensaje o enlace",
    text: "Comprueba SMS, WhatsApps, emails o links que te piden actuar rápido, pagar, meter datos o entrar en una web que no terminas de ver clara.",
  },
  {
    title: "Perfil o conversación",
    text: "Analiza perfiles de redes o apps de citas cuando hay fotos perfectas, presión, excusas, dinero, inversión o dudas sobre si la persona es real.",
  },
  {
    title: "Inversión u oportunidad",
    text: "Revisa propuestas de trading, criptomonedas, beneficios rápidos o plataformas desconocidas antes de enviar dinero o seguir instrucciones.",
  },
  {
    title: "Factura o cobro",
    text: "Comprueba recibos, facturas, cargos raros, suscripciones o importes que no entiendes antes de pagar, reclamar o aceptar el cobro.",
  },
  {
    title: "Contrato o documento",
    text: "Entiende cláusulas, permanencias, penalizaciones, pagos, obligaciones y condiciones antes de firmar o comprometerte.",
  },
];

const checklist = [
  "Comprueba quién está detrás y si hay datos reales.",
  "Mira si te están metiendo prisa para actuar.",
  "Revisa si te piden dinero, códigos, tarjeta o documentos.",
  "Busca señales externas fuera de la propia web o mensaje.",
  "Desconfía de precios, beneficios o promesas demasiado buenos.",
  "Pega el caso en Vonu para revisarlo antes de decidir.",
];

const warningSigns = [
  {
    title: "Demasiado bueno para ser verdad",
    text: "Precios imposibles, rentabilidades garantizadas, descuentos enormes o promesas perfectas suelen merecer una revisión antes de actuar.",
  },
  {
    title: "Te mete prisa",
    text: "La urgencia busca que no pienses: últimos minutos, cuenta bloqueada, oferta limitada, cargo sospechoso o firma inmediata.",
  },
  {
    title: "Pide datos sensibles",
    text: "Tarjeta, DNI, contraseñas, códigos SMS, documentos, IBAN o fotos privadas no deberían pedirse sin un contexto claro y seguro.",
  },
  {
    title: "No queda claro quién responde",
    text: "Si no hay empresa identificable, contacto real, condiciones claras o forma sencilla de reclamar, conviene ir con cuidado.",
  },
  {
    title: "Solo hay señales dentro de su web",
    text: "Las reseñas, testimonios o garantías dentro de la propia página no bastan. Lo útil es comprobar fuentes externas.",
  },
  {
    title: "Te empuja a otro canal",
    text: "Moverte rápido a WhatsApp, Telegram, transferencia, una plataforma desconocida o un enlace externo puede aumentar el riesgo.",
  },
];

const commonExamples = [
  {
    title: "¿Es fiable esta web?",
    text: "Has encontrado una tienda con buen diseño y precios muy bajos, pero no sabes si comprar o meter la tarjeta.",
  },
  {
    title: "¿Es fiable este mensaje?",
    text: "Te llega un SMS, email o WhatsApp urgente con un enlace, un pago pendiente o una supuesta alerta.",
  },
  {
    title: "¿Es fiable esta inversión?",
    text: "Alguien te promete beneficios altos, te guía por Telegram o te pide ingresar dinero en una plataforma.",
  },
  {
    title: "¿Es fiable este contrato?",
    text: "Te piden firmar o pagar una señal y hay cláusulas, gastos, permanencias o condiciones que no entiendes bien.",
  },
];

const mistakes = [
  "Confiar solo porque una web tiene candado HTTPS.",
  "Pagar rápido porque el precio parece una oportunidad única.",
  "Dar códigos o datos pensando que es una comprobación normal.",
  "Creer que una reseña dentro de la propia web prueba que es real.",
  "Firmar o aceptar condiciones sin entender las partes importantes.",
  "Seguir hablando fuera del canal original cuando algo ya te genera dudas.",
];

const faqs = [
  {
    q: "¿Cómo saber si algo es fiable?",
    a: "No hay una sola prueba. Conviene revisar quién está detrás, si hay datos reales, si te meten prisa, si piden dinero o datos sensibles, si existen opiniones externas y si las condiciones son claras. Vonu puede ayudarte a mirar esas señales juntas.",
  },
  {
    q: "¿Puedo comprobar si una web es fiable con VonuAI?",
    a: "Sí. Puedes pegar la web, explicar qué te pide o subir una captura. Vonu revisa señales como dominio, método de pago, urgencia, datos legales, devoluciones y posibles riesgos antes de comprar.",
  },
  {
    q: "¿El candado HTTPS significa que una web es fiable?",
    a: "No necesariamente. El candado solo indica que la conexión está cifrada. Una web falsa también puede tener HTTPS. Para fiarte, hay que revisar más señales.",
  },
  {
    q: "¿Puedo analizar un mensaje, SMS o email sospechoso?",
    a: "Sí. Puedes pegar el texto o subir una captura para revisar si hay phishing, enlaces sospechosos, urgencia, petición de datos o suplantación de una empresa conocida.",
  },
  {
    q: "¿VonuAI sustituye a un profesional?",
    a: "No. Vonu ofrece orientación preventiva para ayudarte a decidir con más calma, pero no sustituye a abogados, asesores financieros, médicos, psicólogos ni autoridades.",
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
  if (title === "Web o tienda online") {
    return (
      <>
        Web o tienda <GradientText tone="blueGreen">online</GradientText>
      </>
    );
  }

  if (title === "Mensaje o enlace") {
    return (
      <>
        Mensaje o <GradientText tone="orangeRed">enlace</GradientText>
      </>
    );
  }

  if (title === "Perfil o conversación") {
    return (
      <>
        Perfil o <GradientText tone="purplePink">conversación</GradientText>
      </>
    );
  }

  if (title === "Inversión u oportunidad") {
    return (
      <>
        Inversión u <GradientText tone="green">oportunidad</GradientText>
      </>
    );
  }

  if (title === "Factura o cobro") {
    return (
      <>
        Factura o <GradientText tone="amberOrange">cobro</GradientText>
      </>
    );
  }

  if (title === "Contrato o documento") {
    return (
      <>
        Contrato o <GradientText tone="blueCyan">documento</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function WarningTitle({ title }: { title: string }) {
  if (title === "Demasiado bueno para ser verdad") {
    return (
      <>
        Demasiado bueno
        <span className="block">
          para ser <GradientText tone="orangeRed">verdad</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te mete prisa") {
    return (
      <>
        Te mete <GradientText tone="amberOrange">prisa</GradientText>
      </>
    );
  }

  if (title === "Pide datos sensibles") {
    return (
      <>
        Pide datos
        <span className="block">
          <GradientText tone="orangeRed">sensibles</GradientText>
        </span>
      </>
    );
  }

  if (title === "No queda claro quién responde") {
    return (
      <>
        No queda claro
        <span className="block">
          quién <GradientText tone="blueCyan">responde</GradientText>
        </span>
      </>
    );
  }

  if (title === "Solo hay señales dentro de su web") {
    return (
      <>
        Señales solo dentro
        <span className="block">
          de su <GradientText tone="purplePink">web</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te empuja a otro canal") {
    return (
      <>
        Te empuja a
        <span className="block">
          otro <GradientText tone="green">canal</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title === "¿Es fiable esta web?") {
    return (
      <>
        ¿Es fiable esta <GradientText tone="blueGreen">web?</GradientText>
      </>
    );
  }

  if (title === "¿Es fiable este mensaje?") {
    return (
      <>
        ¿Es fiable este <GradientText tone="orangeRed">mensaje?</GradientText>
      </>
    );
  }

  if (title === "¿Es fiable esta inversión?") {
    return (
      <>
        ¿Es fiable esta <GradientText tone="green">inversión?</GradientText>
      </>
    );
  }

  if (title === "¿Es fiable este contrato?") {
    return (
      <>
        ¿Es fiable este <GradientText tone="purplePink">contrato?</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function EsFiablePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/es-fiable#webpage`,
        url: `${siteUrl}/es-fiable`,
        name: "¿Es fiable?",
        description:
          "Herramienta de orientación para comprobar si una web, tienda, mensaje, perfil, inversión, factura o contrato parece fiable antes de actuar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/es-fiable#faq`,
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
              ¿Es fiable?
              <span className="block text-zinc-500">
                Compruébalo antes de <GradientText tone="blueCyan">actuar.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si tienes dudas sobre una web, tienda online, mensaje, perfil,
              inversión, factura o contrato, Vonu te ayuda a revisar señales de
              riesgo antes de pagar, firmar, contestar o compartir datos.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Comprobar ahora</span>
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
                    Fiabilidad revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    He encontrado una tienda online con unas zapatillas mucho más
                    baratas que en otros sitios. La web parece profesional, pero
                    no sé si es fiable. ¿La revisas antes de pagar?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pagaría todavía. Precio muy bajo + tienda
                        desconocida es una combinación que conviene revisar.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si la web tiene empresa, contacto y política de devoluciones claros.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si el método de pago permite reclamar si algo sale mal.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si hay opiniones externas reales fuera de la propia tienda.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Buscaría el nombre de la tienda fuera de su propia web.
                          Si solo acepta transferencia, no hay datos claros o todo
                          parece demasiado perfecto, no compraría todavía.
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
                        Pregunta si algo es fiable
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <VoiceBarsIcon />
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
                  Si dudas,
                  <span className="block text-zinc-500">
                    <GradientText tone="orangeRed">comprueba.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Muchas decisiones salen mal por actuar con prisa: pagar, pulsar,
                  firmar, contestar o compartir datos antes de revisar señales
                  básicas. Parar un minuto puede ahorrarte un problema grande.
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
                Qué puedes comprobar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Señales antes
                <span className="block text-zinc-500">
                  de <GradientText tone="blueCyan">confiar.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu no se queda en “sí” o “no”. Te ayuda a mirar el contexto, la
              presión, el dinero, los datos y las señales que normalmente se pasan
              por alto.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trustAreas.map((item) => (
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
              Señales de alerta
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Lo fiable no suele
              <span className="block text-zinc-400">
                presionarte para <GradientText tone="orangeRed">decidir.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Cuando algo necesita que pagues, firmes, pulses o respondas deprisa,
              merece una revisión extra antes de que el problema sea irreversible.
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
                Casos comunes
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                La duda aparece
                <span className="block text-zinc-500">
                  justo antes de <GradientText tone="green">actuar.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Comprar, contestar, invertir, firmar o pagar una señal. Si en ese
                momento algo no encaja, es buena idea revisarlo antes.
              </p>
            </div>

            <div className="grid gap-4">
              {commonExamples.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)]"
                >
                  <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-zinc-950">
                    <ExampleTitle title={item.title} />
                  </h3>

                  <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
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
                Confiar demasiado rápido
                <span className="block text-zinc-500">
                  puede salir <GradientText tone="orangeRed">caro.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La mayoría de errores importantes no vienen de una sola señal,
                sino de una mezcla de prisa, confianza, diseño bonito y poca
                comprobación.
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
              <span className="block text-zinc-500">fiabilidad</span>
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

      <ResourceSignup page="es-fiable" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de confiar, compruébalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega una web, mensaje, perfil, oferta, factura o contrato. Vonu te
            ayuda a revisar señales antes de pagar, firmar, contestar o compartir
            datos.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Comprobar con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}