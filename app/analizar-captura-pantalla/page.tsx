import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const screenshotExample =
  "Voy a subir una captura de pantalla para que la revises. Puede ser un SMS, WhatsApp, perfil, factura, web o conversación, y quiero saber si hay señales de riesgo antes de actuar.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Analizar captura de pantalla online — Revisa SMS, chats, webs y perfiles",
  description:
    "Sube una captura de pantalla y revisa señales de riesgo en SMS, WhatsApp, perfiles de apps de citas, webs, facturas, contratos o conversaciones antes de actuar.",
  alternates: {
    canonical: "/analizar-captura-pantalla",
  },
  openGraph: {
    title: "Analizar captura de pantalla online — VonuAI",
    description:
      "Revisa capturas de SMS, WhatsApp, perfiles, webs, facturas o conversaciones para detectar señales de estafa, manipulación o riesgo.",
    url: `${siteUrl}/analizar-captura-pantalla`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analizar captura de pantalla online — VonuAI",
    description:
      "Sube una captura y VonuAI te ayuda a revisar señales de riesgo antes de pagar, contestar, firmar o confiar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const useCases = [
  {
    title: "SMS o WhatsApp sospechoso",
    text: "Mensajes de bancos, Correos, paquetería, DGT, Hacienda, Bizum o supuestos soportes que te piden pulsar, pagar o dar datos.",
  },
  {
    title: "Perfil de Tinder, Badoo o Instagram",
    text: "Capturas de perfiles, fotos, bios o conversaciones para revisar si hay señales de catfishing, foto reutilizada, presión o intento de estafa.",
  },
  {
    title: "Tienda online o web rara",
    text: "Capturas de una web, checkout, métodos de pago, descuentos agresivos o páginas que no sabes si son fiables antes de comprar.",
  },
  {
    title: "Factura, recibo o cobro extraño",
    text: "Importes que no cuadran, cargos duplicados, conceptos confusos, servicios no contratados o recibos que quieres entender antes de reclamar.",
  },
  {
    title: "Contrato o cláusula",
    text: "Capturas de condiciones, permanencias, penalizaciones, alquileres, contratos de trabajo o textos difíciles antes de firmar.",
  },
  {
    title: "Conversación con presión",
    text: "Mensajes donde te hacen sentir culpa, urgencia, miedo o confusión antes de contestar, pagar, enviar fotos o tomar una decisión.",
  },
];

const checklist = [
  "Sube una captura nítida, sin datos sensibles si puedes taparlos.",
  "Explica en una frase qué te preocupa de esa captura.",
  "No metas tarjeta, códigos ni contraseñas si algo te parece raro.",
  "Si hay enlace, no lo abras desde el mensaje: compruébalo antes.",
  "Si hay presión, dinero, urgencia o amenazas, guarda pruebas.",
  "Vonu revisa señales y te ayuda a decidir el siguiente paso.",
];

const warningSigns = [
  {
    title: "Urgencia o miedo",
    text: "Frases como “último aviso”, “tu cuenta será bloqueada” o “paga ya” buscan que actúes sin pensar.",
  },
  {
    title: "Dinero, inversión o cripto",
    text: "Si alguien de redes o apps de citas te lleva hacia inversión, trading, criptomonedas o plataformas externas, conviene ir con mucho cuidado.",
  },
  {
    title: "Enlaces o dominios raros",
    text: "URLs acortadas, dominios que imitan marcas o páginas que piden datos bancarios pueden ser señales de phishing.",
  },
  {
    title: "Capturas demasiado perfectas",
    text: "Fotos o perfiles muy pulidos pueden ser reales, editados o reutilizados. La apariencia no confirma la identidad.",
  },
  {
    title: "Datos que no cuadran",
    text: "Importes, fechas, logos, nombres de empresa, condiciones o textos incoherentes pueden indicar error, abuso o falsificación.",
  },
  {
    title: "Presión emocional",
    text: "Si te hacen sentir culpable, te meten prisa o te empujan a contestar algo que no quieres, conviene parar y revisar.",
  },
];

const mistakes = [
  "Pensar que una captura bonita o profesional siempre es fiable.",
  "Pulsar un enlace desde un SMS antes de comprobarlo.",
  "Enviar códigos, documentos o fotos íntimas por presión.",
  "Comprar en una tienda solo porque aparece en un anuncio.",
  "Firmar o aceptar condiciones sin entender lo que implican.",
  "Borrar pruebas si crees que puede haber estafa, amenaza o abuso.",
];

const faqs = [
  {
    q: "¿Puedo analizar una captura de WhatsApp o SMS?",
    a: "Sí. Puedes subir una captura o copiar el texto del mensaje para revisar señales de phishing, estafa, urgencia, enlaces raros, suplantación o presión.",
  },
  {
    q: "¿Sirve para perfiles de Tinder, Badoo o Instagram?",
    a: "Sí. Vonu puede revisar capturas de perfiles, fotos o conversaciones para detectar señales de perfil falso, foto reutilizada, catfishing, presión para invertir o intentos de sacar la conversación fuera de la plataforma.",
  },
  {
    q: "¿Puedo subir una factura o contrato?",
    a: "Sí. Si la captura se ve bien, Vonu puede ayudarte a entender conceptos, importes, cláusulas o señales que conviene revisar antes de pagar, reclamar o firmar.",
  },
  {
    q: "¿Tengo que tapar datos personales?",
    a: "Es recomendable tapar datos sensibles como DNI completo, tarjeta, IBAN, teléfono, dirección, códigos, contraseñas o información íntima que no haga falta para el análisis.",
  },
  {
    q: "¿Vonu confirma al 100% si algo es falso?",
    a: "No siempre se puede confirmar al 100% solo con una captura. Lo útil es detectar señales, estimar el nivel de riesgo y decirte qué haría antes de pagar, contestar o seguir adelante.",
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

export default function AnalizarCapturaPantallaPage() {
  const chatHref = `/chat?example=${encodeURIComponent(screenshotExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/analizar-captura-pantalla#webpage`,
        url: `${siteUrl}/analizar-captura-pantalla`,
        name: "Analizar captura de pantalla online",
        description:
          "Página para analizar capturas de pantalla de SMS, WhatsApp, perfiles, webs, facturas, contratos o conversaciones antes de actuar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/analizar-captura-pantalla#faq`,
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
              Analizar captura de pantalla online.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Sube una captura de un SMS, WhatsApp, perfil, web, factura,
              contrato o conversación. Vonu te ayuda a revisar señales de riesgo
              antes de pagar, contestar, firmar o confiar.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Analizar captura con Vonu
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
                  Si dudas, revisa antes de actuar.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Una captura puede parecer normal, pero esconder señales de
                  urgencia, estafa, manipulación, suplantación, cobro raro o
                  presión. Lo importante es mirar el contexto antes de dar el
                  siguiente paso.
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

      <section id="casos" className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué puedes revisar
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Una captura puede contar mucho.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu no se limita a describir la imagen: analiza señales visibles,
              contexto, presión, dinero, enlaces, identidad y próximos pasos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
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
              Señales de riesgo
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              No todo lo sospechoso parece sospechoso al principio.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Muchos fraudes, perfiles falsos o mensajes manipuladores se
              apoyan en pequeños detalles: prisa, dinero, enlaces, miedo o
              confianza fabricada.
            </p>
          </div>

          <div className="grid gap-3">
            {warningSigns.map((item) => (
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
                Una captura sola no siempre confirma todo.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Pero sí puede darte suficientes señales para decidir si conviene
                parar, comprobar por otro canal, guardar pruebas o pedir más
                contexto antes de avanzar.
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
              Dudas habituales sobre analizar capturas
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

      <ResourceSignup page="analizar-captura-pantalla" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de pagar, contestar o confiar, revisa la captura.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube la imagen, explica qué te preocupa y Vonu te ayuda a detectar
            señales de riesgo, entender el contexto y decidir el siguiente paso
            con más calma.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Analizar captura con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}