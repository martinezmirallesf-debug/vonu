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
  title: "Analizar link sospechoso — Revísalo con VonuAI antes de pulsar",
  description:
    "Revisa enlaces sospechosos recibidos por SMS, WhatsApp, email, redes sociales o códigos QR antes de pulsar, pagar o compartir datos.",
  alternates: {
    canonical: "/analizar-link-sospechoso",
  },
  openGraph: {
    title: "Analizar link sospechoso — VonuAI",
    description:
      "Comprueba señales de phishing, suplantación, urgencia y riesgo antes de abrir un enlace sospechoso.",
    url: `${siteUrl}/analizar-link-sospechoso`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analizar link sospechoso — VonuAI",
    description:
      "Revisa un enlace raro antes de pulsar, pagar o meter tus datos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Te mete urgencia",
    text: "Mensajes como “último aviso”, “cuenta bloqueada”, “pago pendiente” o “entrega retenida” buscan que pulses sin pensar.",
  },
  {
    title: "El dominio no encaja",
    text: "Puede parecerse al nombre real de una empresa, pero tener letras cambiadas, palabras extrañas, guiones, subdominios raros o extensiones poco habituales.",
  },
  {
    title: "Promete algo demasiado bueno",
    text: "Premios, descuentos enormes, devoluciones, regalos o beneficios rápidos suelen usarse para que abras el enlace y bajes la guardia.",
  },
  {
    title: "Pide datos o códigos",
    text: "Si después de pulsar te pide tarjeta, DNI, contraseña, códigos SMS o acceso bancario, conviene parar y verificar por otro canal.",
  },
  {
    title: "Viene de un canal inesperado",
    text: "Un enlace recibido por SMS, WhatsApp, Telegram, email o redes puede suplantar a una empresa conocida aunque el mensaje parezca profesional.",
  },
  {
    title: "No sabes a dónde lleva",
    text: "Los acortadores, botones ambiguos o códigos QR pueden ocultar el destino real. Antes de abrir, conviene revisar el contexto.",
  },
];

const checklist = [
  "No pulses el enlace si el mensaje te mete prisa.",
  "No introduzcas tarjeta, claves, DNI ni códigos SMS.",
  "Comprueba la dirección oficial escribiéndola tú en el navegador.",
  "Revisa si el dominio coincide exactamente con la empresa real.",
  "Desconfía si el enlace llega por un canal inesperado.",
  "Pega el enlace o sube una captura en Vonu antes de actuar.",
];

const commonExamples = [
  {
    title: "Link de paquete retenido",
    text: "Te dicen que hay una incidencia con una entrega y que debes pagar una pequeña cantidad para recibir el paquete.",
  },
  {
    title: "Link del banco",
    text: "Te avisan de un acceso sospechoso, bloqueo de cuenta, cargo extraño o verificación urgente.",
  },
  {
    title: "Link de premio o descuento",
    text: "Te ofrecen un regalo, sorteo, cupón o promoción demasiado buena para llevarte a una web falsa.",
  },
  {
    title: "Link por WhatsApp o Telegram",
    text: "Una persona desconocida, un supuesto soporte o un contacto comprometido te manda una URL para entrar, votar, invertir o confirmar algo.",
  },
];

const mistakes = [
  "Abrir el enlace solo por curiosidad y acabar rellenando datos.",
  "Confiar porque aparece el logo de una empresa conocida.",
  "Creer que un enlace es seguro solo porque empieza por https.",
  "Pagar una cantidad pequeña sin comprobar la web oficial.",
  "Dar códigos SMS pensando que son una simple verificación.",
  "Escanear un QR sin saber realmente a qué página te lleva.",
];

const faqs = [
  {
    q: "¿Cómo saber si un link es sospechoso?",
    a: "Desconfía si llega con urgencia, promete algo demasiado bueno, usa un dominio raro, te pide datos sensibles o suplanta a una empresa conocida. Lo más prudente es no pulsar y comprobar la dirección oficial por separado.",
  },
  {
    q: "¿Puedo analizar un enlace con VonuAI?",
    a: "Sí. Puedes pegar el enlace, copiar el mensaje recibido o subir una captura. Vonu te ayuda a revisar señales de phishing, suplantación, urgencia y riesgo antes de actuar.",
  },
  {
    q: "¿Es seguro abrir un enlace si tiene https?",
    a: "No necesariamente. HTTPS solo indica que la conexión está cifrada. Una web falsa también puede tener candado. Hay que revisar el dominio, el contexto y lo que la página te pide.",
  },
  {
    q: "¿Qué hago si ya he pulsado un link sospechoso?",
    a: "Si no has introducido datos, cierra la página. Si has puesto tarjeta, claves, DNI o códigos, contacta cuanto antes con tu banco o servicio afectado, cambia contraseñas y activa medidas de seguridad.",
  },
  {
    q: "¿Un código QR también puede ser peligroso?",
    a: "Sí. Un QR puede llevarte a una web falsa igual que un enlace normal. Si el QR aparece en un sitio inesperado o te pide datos, conviene comprobarlo antes.",
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
  if (title === "Te mete urgencia") {
    return (
      <>
        Te mete <GradientText tone="orangeRed">urgencia</GradientText>
      </>
    );
  }

  if (title === "El dominio no encaja") {
    return (
      <>
        El dominio
        <span className="block">
          no <GradientText tone="blueCyan">encaja</GradientText>
        </span>
      </>
    );
  }

  if (title === "Promete algo demasiado bueno") {
    return (
      <>
        Promete algo
        <span className="block">
          demasiado <GradientText tone="amberOrange">bueno</GradientText>
        </span>
      </>
    );
  }

  if (title === "Pide datos o códigos") {
    return (
      <>
        Pide datos
        <span className="block">
          o <GradientText tone="purplePink">códigos</GradientText>
        </span>
      </>
    );
  }

  if (title === "Viene de un canal inesperado") {
    return (
      <>
        Canal
        <span className="block">
          <GradientText tone="green">inesperado</GradientText>
        </span>
      </>
    );
  }

  if (title === "No sabes a dónde lleva") {
    return (
      <>
        No sabes
        <span className="block">
          a dónde <GradientText tone="blueGreen">lleva</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title === "Link de paquete retenido") {
    return (
      <>
        Link de paquete <GradientText tone="amberOrange">retenido</GradientText>
      </>
    );
  }

  if (title === "Link del banco") {
    return (
      <>
        Link del <GradientText tone="blueCyan">banco</GradientText>
      </>
    );
  }

  if (title === "Link de premio o descuento") {
    return (
      <>
        Link de premio o <GradientText tone="orangeRed">descuento</GradientText>
      </>
    );
  }

  if (title === "Link por WhatsApp o Telegram") {
    return (
      <>
        Link por WhatsApp o <GradientText tone="green">Telegram</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function AnalizarLinkSospechosoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/analizar-link-sospechoso#webpage`,
        url: `${siteUrl}/analizar-link-sospechoso`,
        name: "Analizar link sospechoso",
        description:
          "Herramienta de orientación para revisar enlaces sospechosos recibidos por SMS, WhatsApp, email, redes sociales o códigos QR antes de pulsar o compartir datos.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/analizar-link-sospechoso#faq`,
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
              ¿Te han enviado
              <span className="block text-zinc-500">
                un <GradientText tone="orangeRed">link sospechoso?</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si has recibido un enlace por SMS, WhatsApp, email, redes sociales
              o código QR y no sabes si pulsar, revísalo antes de meter datos,
              pagar o iniciar sesión.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Analizar link</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver señales de alerta</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Link revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me ha llegado un enlace por SMS diciendo que mi paquete está
                    retenido y tengo que pagar 2,99€. La página parece real. ¿Lo
                    abro o puede ser una estafa?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pulsaría todavía. Paquete retenido + pago pequeño +
                        enlace externo es una combinación típica de smishing.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si el dominio coincide exactamente con la empresa real.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si te pide tarjeta o datos para resolver algo urgente.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si puedes comprobar el envío desde la app o web oficial.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No abriría el enlace desde el mensaje. Buscaría la web
                          oficial por mi cuenta y revisaría el seguimiento desde
                          ahí, sin meter tarjeta ni códigos en la página recibida.
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
                        Pega un link o sube una captura
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
                  Antes de pulsar,
                  <span className="block text-zinc-500">
                    <GradientText tone="blueGreen">verifica.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un enlace sospechoso suele buscar una reacción rápida: miedo,
                  curiosidad, premio, urgencia o una pequeña cantidad de dinero.
                  La mejor primera decisión suele ser no tocar nada.
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
                Pistas típicas
                <span className="block text-zinc-500">
                  de un <GradientText tone="orangeRed">enlace peligroso.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una señal aislada no siempre confirma una estafa, pero varias
              juntas son motivo suficiente para parar y comprobar el destino.
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
              Cambia el mensaje,
              <span className="block text-zinc-400">
                pero el <GradientText tone="blueCyan">patrón se repite.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Paquetes, bancos, premios, QR, redes sociales o supuestos soportes.
              Casi siempre intentan llevarte a una página donde pierdes control.
            </p>
          </div>

          <div className="grid gap-4">
            {commonExamples.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <ExampleTitle title={item.title} />
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
                Lo peligroso no es recibirlo.
                <span className="block text-zinc-500">
                  Es pulsar <GradientText tone="amberOrange">demasiado rápido.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Muchos enlaces falsos están diseñados para parecer normales. La
                diferencia suele estar en el contexto, la urgencia y lo que te
                piden después.
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
              <span className="block text-zinc-500">links sospechosos</span>
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

      <ResourceSignup page="analizar-link-sospechoso" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de pulsar el enlace, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el link, sube una captura o explica qué te ha llegado. Vonu te
            ayuda a revisar señales de riesgo antes de abrir, pagar o compartir
            datos.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Analizar link con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}