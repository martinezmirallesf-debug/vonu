import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

const smsExample =
  "Voy a pasarte ahora un SMS, web o enlace sospechoso para que lo revises conmigo. Te lo envío en el siguiente mensaje.";

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

export default function AnalizarSmsEstafaPage() {
  const chatHref = `/chat?example=${encodeURIComponent(smsExample)}`;

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
            <p className="mb-5 inline-flex rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-[13.5px] font-semibold text-zinc-600 shadow-sm">
              SMS sospechoso · Phishing · Enlaces falsos
            </p>

            <h1 className="mx-auto max-w-5xl text-[50px] font-semibold leading-[0.94] tracking-[-0.075em] text-zinc-950 sm:text-[76px] lg:text-[104px]">
              Cómo saber si un SMS es una estafa.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si te ha llegado un SMS raro de un banco, paquete, multa, Hacienda
              o una oferta urgente, no pulses el enlace todavía. Revisa las
              señales antes de pagar o compartir datos.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={chatHref}
                className="inline-flex min-w-[260px] items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Analizar mi SMS
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-[260px] items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
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
                  Si duda, frena.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un SMS sospechoso suele buscar una reacción rápida: miedo,
                  urgencia, curiosidad o una pequeña cantidad de dinero. La mejor
                  primera decisión suele ser no tocar nada hasta verificarlo.
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
                Pistas típicas de un SMS fraudulento.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una sola señal no siempre confirma una estafa, pero varias juntas
              son motivo suficiente para parar y comprobar.
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
              Los fraudes cambian, pero el patrón se repite.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Paquetes retenidos, bancos, multas, devoluciones, Bizum o
              compraventas. Casi siempre intentan llevarte fuera del canal
              oficial.
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
                Lo peligroso no es recibirlo. Es actuar demasiado rápido.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La mayoría de SMS fraudulentos no necesitan que hagas mucho:
                solo que pulses, pagues o introduzcas un dato en el momento
                equivocado.
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
              Dudas habituales sobre SMS sospechosos
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

      <ResourceSignup page="analizar-sms-estafa" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de pulsar el enlace, analízalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el SMS, sube una captura o explica qué te ha llegado. Vonu te
            ayuda a revisar señales de riesgo antes de pagar, contestar o
            compartir datos.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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