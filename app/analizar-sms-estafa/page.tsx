import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo saber si un SMS es una estafa — Analízalo con VonuAI",
  description:
    "Aprende a detectar SMS sospechosos, enlaces falsos, phishing y mensajes de bancos, Correos o paquetes. Pega el SMS y analízalo con VonuAI antes de pulsar o pagar.",
  alternates: {
    canonical: "/analizar-sms-estafa",
  },
  openGraph: {
    title: "Cómo saber si un SMS es una estafa — VonuAI",
    description:
      "Revisa un SMS sospechoso antes de pulsar un enlace, pagar o compartir tus datos.",
    url: `${siteUrl}/analizar-sms-estafa`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo saber si un SMS es una estafa — VonuAI",
    description:
      "Detecta señales de phishing, enlaces falsos y mensajes sospechosos antes de actuar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Te mete prisa",
    text: "Frases como “último aviso”, “pago inmediato”, “su cuenta será bloqueada” o “entrega retenida” buscan que actúes sin pensar.",
  },
  {
    title: "Incluye un enlace raro",
    text: "Muchos fraudes usan enlaces acortados, dominios extraños o páginas que imitan bancos, Correos, Hacienda, empresas de paquetería o plataformas conocidas.",
  },
  {
    title: "Te pide pagar poco dinero",
    text: "Importes pequeños como 1,99€, 2,95€ o 4,99€ se usan para que bajes la guardia y metas la tarjeta en una web falsa.",
  },
  {
    title: "Te pide códigos o claves",
    text: "Ningún banco o servicio serio debería pedirte códigos SMS, contraseñas completas o claves de acceso por un enlace recibido en un mensaje.",
  },
  {
    title: "El remitente no encaja",
    text: "Puede aparecer como un número desconocido, un nombre parecido al real o incluso dentro de un hilo que parece legítimo.",
  },
  {
    title: "El texto suena genérico",
    text: "Errores raros, traducciones extrañas, amenazas vagas o mensajes sin datos concretos suelen ser señales de alerta.",
  },
];

const whatToDo = [
  "No pulses el enlace todavía.",
  "No introduzcas tarjeta, DNI, contraseñas ni códigos.",
  "Busca la web oficial desde Google o escribiendo la dirección manualmente.",
  "Comprueba el aviso desde la app oficial del banco, tienda o empresa.",
  "Si ya has pagado o compartido datos, contacta cuanto antes con tu banco.",
  "Pega el SMS en Vonu para revisar señales de riesgo antes de actuar.",
];

const commonExamples = [
  {
    title: "SMS de paquete retenido",
    text: "Te dicen que tu paquete no se puede entregar y que debes pagar una pequeña cantidad para liberarlo.",
  },
  {
    title: "SMS del banco",
    text: "Te avisan de un bloqueo, acceso sospechoso o cargo extraño y te piden entrar en un enlace.",
  },
  {
    title: "SMS de Hacienda o multa",
    text: "Te hablan de una devolución, sanción, multa o trámite urgente para llevarte a una web falsa.",
  },
  {
    title: "SMS de Bizum o compraventa",
    text: "Te piden confirmar una operación, aceptar un pago o entrar en una página para recibir dinero.",
  },
];

const mistakes = [
  "Pulsar el enlace por curiosidad y rellenar datos “solo para ver”.",
  "Confiar en el SMS porque aparece el nombre de una empresa conocida.",
  "Pagar una cantidad pequeña sin comprobar la web.",
  "Dar códigos de verificación pensando que son para confirmar identidad.",
  "Reenviar capturas con datos personales sin tapar información sensible.",
];

const faqs = [
  {
    q: "¿Cómo saber si un SMS es una estafa?",
    a: "Desconfía si el SMS mete prisa, incluye un enlace raro, pide pagar una cantidad pequeña, solicita claves o códigos, amenaza con bloquear una cuenta o imita a una empresa conocida. Lo más prudente es no pulsar el enlace y comprobarlo desde la web o app oficial.",
  },
  {
    q: "¿Qué hago si he pulsado un enlace de un SMS sospechoso?",
    a: "Si solo has abierto la página, ciérrala y no introduzcas datos. Si has puesto tarjeta, claves o códigos, contacta cuanto antes con tu banco, cambia contraseñas y activa medidas de seguridad.",
  },
  {
    q: "¿Es peligroso abrir un SMS?",
    a: "Leer un SMS normalmente no es el problema. El riesgo suele estar en pulsar enlaces, descargar archivos, introducir datos o llamar a números indicados en el mensaje.",
  },
  {
    q: "¿Los bancos envían SMS con enlaces?",
    a: "Algunas entidades pueden enviar avisos por SMS, pero no deberías introducir claves, códigos o datos sensibles desde un enlace recibido. Entra siempre desde la app oficial o escribiendo tú la dirección web.",
  },
  {
    q: "¿Puedo analizar un SMS con VonuAI?",
    a: "Sí. Puedes pegar el texto del SMS o subir una captura para que Vonu te ayude a revisar señales de riesgo, qué comprobar y qué pasos dar antes de actuar.",
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
      className="inline-block whitespace-nowrap align-baseline"
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
  if (title === "Te mete prisa") {
    return (
      <>
        Te mete <GradientText tone="orangeRed">prisa</GradientText>
      </>
    );
  }

  if (title === "Incluye un enlace raro") {
    return (
      <>
        Incluye un <GradientText tone="blueCyan">enlace raro</GradientText>
      </>
    );
  }

  if (title === "Te pide pagar poco dinero") {
    return (
      <>
        Te pide pagar <GradientText tone="amberOrange">poco dinero</GradientText>
      </>
    );
  }

  if (title === "Te pide códigos o claves") {
    return (
      <>
        Te pide <GradientText tone="purplePink">códigos o claves</GradientText>
      </>
    );
  }

  if (title === "El remitente no encaja") {
    return (
      <>
        El remitente <GradientText tone="blueGreen">no encaja</GradientText>
      </>
    );
  }

  if (title === "El texto suena genérico") {
    return (
      <>
        El texto suena <GradientText tone="green">genérico</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title === "SMS de paquete retenido") {
    return (
      <>
        SMS de paquete <GradientText tone="amberOrange">retenido</GradientText>
      </>
    );
  }

  if (title === "SMS del banco") {
    return (
      <>
        SMS del <GradientText tone="blueCyan">banco</GradientText>
      </>
    );
  }

  if (title === "SMS de Hacienda o multa") {
    return (
      <>
        SMS de Hacienda o <GradientText tone="orangeRed">multa</GradientText>
      </>
    );
  }

  if (title === "SMS de Bizum o compraventa") {
    return (
      <>
        SMS de Bizum o <GradientText tone="green">compraventa</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function AnalizarSmsEstafaPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/analizar-sms-estafa#webpage`,
        url: `${siteUrl}/analizar-sms-estafa`,
        name: "Cómo saber si un SMS es una estafa",
        description:
          "Guía para detectar SMS sospechosos, phishing, enlaces falsos y mensajes fraudulentos antes de pulsar o pagar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/analizar-sms-estafa#faq`,
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
            <h1 className="mx-auto max-w-[1080px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[118px]">
              Cómo saber si un{" "}
              <GradientText tone="orangeRed">SMS es una estafa.</GradientText>
              <span className="block text-zinc-500">Revísalo antes de pulsar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si te ha llegado un SMS raro de un banco, paquete, multa, Hacienda
              o una oferta urgente, no pulses el enlace todavía. Revisa las
              señales antes de pagar o compartir datos.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Analizar SMS</span>
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
                    SMS revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me acaba de llegar un SMS que dice que mi paquete está
                    retenido y tengo que pagar 2,99€ en un enlace. ¿Es seguro?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pagaría desde ese enlace. Tiene varias señales típicas de SMS fraudulento.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que me hace dudar:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Te mete prisa para resolverlo ahora.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>El importe pequeño busca que bajes la guardia.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Te lleva a un enlace externo en vez de a la app oficial.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No pulsaría el enlace ni metería tarjeta. Revisaría el envío
                          desde la web oficial de la empresa o desde el número de seguimiento
                          que ya tenía antes.
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
                        Pega un SMS o sube una captura
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

                <h2 className="mt-4 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Antes de pulsar,
                  <span className="block text-zinc-500">
                    <GradientText tone="blueGreen">verifica.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un SMS sospechoso suele buscar una reacción rápida: miedo,
                  urgencia, curiosidad o una pequeña cantidad de dinero. La mejor
                  primera decisión suele ser no tocar nada hasta verificarlo.
                </p>
              </div>

              <div className="grid gap-4">
                {whatToDo.map((item) => (
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas típicas
                <span className="block text-zinc-500">
                  de un <GradientText tone="orangeRed">SMS fraudulento.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una sola señal no siempre confirma una estafa, pero varias juntas
              son motivo suficiente para parar y comprobar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
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
              Ejemplos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Los fraudes cambian,
              <span className="block text-zinc-400">
                pero el <GradientText tone="blueCyan">patrón se repite.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Paquetes retenidos, bancos, multas, devoluciones, Bizum o
              compraventas. Casi siempre intentan llevarte fuera del canal
              oficial.
            </p>
          </div>

          <div className="grid gap-4">
            {commonExamples.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.045em] text-white">
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Lo peligroso no es recibirlo.
                <span className="block text-zinc-500">
                  Es actuar <GradientText tone="amberOrange">demasiado rápido.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La mayoría de SMS fraudulentos no necesitan que hagas mucho:
                solo que pulses, pagues o introduzcas un dato en el momento
                equivocado.
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
              <span className="block text-zinc-500">SMS sospechosos</span>
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

      <ResourceSignup page="analizar-sms-estafa" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de pulsar el enlace, analízalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el SMS, sube una captura o explica qué te ha llegado. Vonu te
            ayuda a revisar señales de riesgo antes de pagar, contestar o
            compartir datos.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Analizar SMS con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}