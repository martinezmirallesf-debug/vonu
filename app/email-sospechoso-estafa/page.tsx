import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const emailExample =
  "Voy a pasarte un email sospechoso que he recibido. Quiero que revises si puede ser phishing, una estafa o un intento de robar datos. Te lo envío en el siguiente mensaje.";

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

export default function EmailSospechosoEstafaPage() {
  const chatHref = `/chat?example=${encodeURIComponent(emailExample)}`;

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
              Email sospechoso o phishing.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si has recibido un correo raro de un banco, pago, factura, paquete
              o aviso urgente, no pulses todavía. Revisa señales de phishing
              antes de compartir datos o descargar archivos.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Revisar email con Vonu
                <ArrowIcon />
              </Link>
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
                  Si duda, no pulses.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un email falso no necesita convencerte durante horas. A veces
                  solo necesita que pulses un botón, abras un archivo o metas un
                  dato en una web que parece oficial.
                </p>
              </div>

              <div className="grid gap-3">
                {whatToDo.map((item) => (
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
                Pistas típicas de un email fraudulento.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una marca conocida, un logo bien puesto o un diseño profesional no
              bastan para confiar. Lo importante es comprobar qué te pide hacer.
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
              Ejemplos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Cambia el remitente, pero el patrón se repite.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Bancos, facturas, paquetes, pagos, multas o devoluciones. Muchos
              correos falsos buscan llevarte a una web externa o hacer que abras
              un archivo.
            </p>
          </div>

          <div className="grid gap-3">
            {commonExamples.map((item) => (
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
                Lo peligroso no es recibirlo. Es obedecerlo.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Un correo sospechoso puede quedarse en nada si no pulsas,
                descargas ni introduces datos. El margen de seguridad está en
                frenar antes de actuar.
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
              Dudas habituales sobre emails sospechosos
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

      <ResourceSignup page="email-sospechoso-estafa" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de pulsar, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el email, sube una captura o explica qué te ha llegado. Vonu te
            ayuda a revisar señales de phishing antes de abrir enlaces,
            descargar archivos o compartir datos.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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