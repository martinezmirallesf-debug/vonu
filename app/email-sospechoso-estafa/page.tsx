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
  title: "Email sospechoso o phishing — Cómo saber si un correo es una estafa",
  description:
    "Aprende a detectar emails sospechosos, phishing, correos falsos de bancos, pagos, facturas, paquetes o avisos urgentes antes de pulsar enlaces o compartir datos.",
  alternates: {
    canonical: "/email-sospechoso-estafa",
  },
  openGraph: {
    title: "Email sospechoso o phishing — VonuAI",
    description:
      "Revisa señales de phishing, enlaces falsos, adjuntos sospechosos y correos urgentes antes de actuar.",
    url: `${siteUrl}/email-sospechoso-estafa`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email sospechoso o phishing — VonuAI",
    description:
      "Detecta correos falsos, phishing y señales de riesgo antes de pulsar enlaces o compartir datos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Te pide actuar rápido",
    text: "Correos con frases como “último aviso”, “cuenta bloqueada”, “pago pendiente” o “acción requerida” buscan que pulses sin revisar.",
  },
  {
    title: "El remitente no encaja",
    text: "Puede parecer una empresa conocida, pero el email real puede tener dominios raros, letras cambiadas o direcciones que no corresponden.",
  },
  {
    title: "Incluye enlaces sospechosos",
    text: "El texto puede decir una cosa, pero el enlace llevarte a otra. También pueden usar botones bonitos para ocultar una dirección falsa.",
  },
  {
    title: "Trae adjuntos inesperados",
    text: "Facturas, justificantes, documentos comprimidos o archivos que no esperabas pueden ser una vía para engañarte o infectar el dispositivo.",
  },
  {
    title: "Te pide datos sensibles",
    text: "Desconfía si solicita contraseña, tarjeta, DNI, códigos SMS, claves de acceso o confirmaciones desde un enlace recibido.",
  },
  {
    title: "Imita una marca conocida",
    text: "Bancos, paquetería, plataformas de pago, Hacienda, tiendas online o servicios de suscripción son cebos habituales.",
  },
];

const whatToDo = [
  "No pulses enlaces ni botones del correo todavía.",
  "No descargues adjuntos que no esperabas.",
  "No introduzcas contraseñas, tarjeta, DNI ni códigos SMS.",
  "Comprueba el remitente real y el dominio del enlace.",
  "Entra desde la app oficial o escribiendo tú la web manualmente.",
  "Pega el email en Vonu para revisar señales antes de actuar.",
];

const commonExamples = [
  {
    title: "Email del banco",
    text: "Te avisan de un acceso sospechoso, una cuenta bloqueada o una operación pendiente y te llevan a un enlace.",
  },
  {
    title: "Factura o pago pendiente",
    text: "Recibes una supuesta factura, recibo, devolución o aviso de pago con urgencia para que abras el archivo o pagues.",
  },
  {
    title: "Paquete o entrega",
    text: "Te dicen que hay un problema con un envío, una tasa pendiente o una dirección que debes confirmar.",
  },
  {
    title: "Hacienda, multa o trámite",
    text: "El correo habla de devolución, sanción, notificación o documento oficial para llevarte a una web falsa.",
  },
];

const mistakes = [
  "Pulsar el botón del email porque el diseño parece profesional.",
  "Confiar solo porque aparece el logo de una empresa conocida.",
  "Abrir adjuntos inesperados sin comprobar el remitente.",
  "Responder al correo con datos personales o bancarios.",
  "Entrar en una cuenta desde el enlace del email en vez de ir a la app oficial.",
];

const faqs = [
  {
    q: "¿Cómo saber si un email es phishing?",
    a: "Desconfía si el correo mete prisa, tiene remitente extraño, incluye enlaces o adjuntos inesperados, pide datos sensibles o imita a una marca conocida. Lo prudente es no pulsar y comprobar desde la web o app oficial.",
  },
  {
    q: "¿Es peligroso abrir un email sospechoso?",
    a: "Abrir un email normalmente no suele ser el mayor riesgo. El peligro está en pulsar enlaces, descargar adjuntos, introducir datos, responder con información sensible o seguir instrucciones del mensaje.",
  },
  {
    q: "¿Qué hago si he pulsado un enlace de un email sospechoso?",
    a: "Si no has introducido datos, cierra la página y no sigas. Si has puesto tarjeta, contraseña, DNI o códigos, contacta con tu banco o servicio afectado, cambia claves y activa medidas de seguridad.",
  },
  {
    q: "¿Cómo compruebo el remitente real?",
    a: "Mira la dirección completa del remitente, no solo el nombre visible. Revisa si el dominio coincide con la empresa real y desconfía de variaciones raras, letras añadidas o dominios que no encajan.",
  },
  {
    q: "¿Puedo analizar un email con VonuAI?",
    a: "Sí. Puedes pegar el texto del email, describir el remitente o subir una captura para que Vonu te ayude a revisar señales de phishing, enlaces sospechosos y pasos prudentes antes de actuar.",
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
  if (title === "Te pide actuar rápido") {
    return (
      <>
        Te pide actuar
        <span className="block">
          <GradientText tone="orangeRed">rápido</GradientText>
        </span>
      </>
    );
  }

  if (title === "El remitente no encaja") {
    return (
      <>
        El remitente
        <span className="block">
          no <GradientText tone="blueCyan">encaja</GradientText>
        </span>
      </>
    );
  }

  if (title === "Incluye enlaces sospechosos") {
    return (
      <>
        Incluye enlaces
        <span className="block">
          <GradientText tone="amberOrange">sospechosos</GradientText>
        </span>
      </>
    );
  }

  if (title === "Trae adjuntos inesperados") {
    return (
      <>
        Trae adjuntos
        <span className="block">
          <GradientText tone="purplePink">inesperados</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te pide datos sensibles") {
    return (
      <>
        Te pide datos
        <span className="block">
          <GradientText tone="orangeRed">sensibles</GradientText>
        </span>
      </>
    );
  }

  if (title === "Imita una marca conocida") {
    return (
      <>
        Imita una marca
        <span className="block">
          <GradientText tone="green">conocida</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title === "Email del banco") {
    return (
      <>
        Email del <GradientText tone="blueCyan">banco</GradientText>
      </>
    );
  }

  if (title === "Factura o pago pendiente") {
    return (
      <>
        Factura o pago <GradientText tone="amberOrange">pendiente</GradientText>
      </>
    );
  }

  if (title === "Paquete o entrega") {
    return (
      <>
        Paquete o <GradientText tone="green">entrega</GradientText>
      </>
    );
  }

  if (title === "Hacienda, multa o trámite") {
    return (
      <>
        Hacienda, multa o <GradientText tone="orangeRed">trámite</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function EmailSospechosoEstafaPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/email-sospechoso-estafa#webpage`,
        url: `${siteUrl}/email-sospechoso-estafa`,
        name: "Email sospechoso o phishing",
        description:
          "Guía para detectar emails sospechosos, phishing, correos falsos, enlaces peligrosos y adjuntos inesperados antes de actuar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/email-sospechoso-estafa#faq`,
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
              Email sospechoso
              <span className="block text-zinc-500">
                o <GradientText tone="orangeRed">phishing.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si has recibido un correo raro de un banco, pago, factura, paquete
              o aviso urgente, no pulses todavía. Revisa señales de phishing
              antes de compartir datos o descargar archivos.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Revisar email</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver señales de phishing</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Email revisado
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me ha llegado un email del banco diciendo que mi cuenta será
                    bloqueada. Tiene un botón para verificar mis datos. ¿Lo revisas?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pulsaría ese botón. Bloqueo de cuenta + enlace +
                        datos sensibles es una combinación típica de phishing.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>La dirección completa del remitente, no solo el nombre visible.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>El dominio real al que lleva el botón o enlace.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si pide contraseña, tarjeta, DNI o códigos desde una web externa.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No pulsaría el botón. Entraría manualmente en la app
                          oficial del banco o llamaría al número oficial si tengo dudas.
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
                        Pega un email o sube una captura
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
                    no <GradientText tone="orangeRed">pulses.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un email falso no necesita convencerte durante horas. A veces
                  solo necesita que pulses un botón, abras un archivo o metas un
                  dato en una web que parece oficial.
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas típicas
                <span className="block text-zinc-500">
                  de un email <GradientText tone="orangeRed">fraudulento.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una marca conocida, un logo bien puesto o un diseño profesional no
              bastan para confiar. Lo importante es comprobar qué te pide hacer.
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
              Ejemplos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Cambia el remitente,
              <span className="block text-zinc-400">
                pero el <GradientText tone="blueCyan">patrón se repite.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Bancos, facturas, paquetes, pagos, multas o devoluciones. Muchos
              correos falsos buscan llevarte a una web externa o hacer que abras
              un archivo.
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
                  Es <GradientText tone="purplePink">obedecerlo.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Un correo sospechoso puede quedarse en nada si no pulsas,
                descargas ni introduces datos. El margen de seguridad está en
                frenar antes de actuar.
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
              <span className="block text-zinc-500">emails sospechosos</span>
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

      <ResourceSignup page="email-sospechoso-estafa" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de pulsar, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el email, sube una captura o explica qué te ha llegado. Vonu te
            ayuda a revisar señales de phishing antes de abrir enlaces,
            descargar archivos o compartir datos.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}