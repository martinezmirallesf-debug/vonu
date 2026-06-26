import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const bankCallExample =
  "Me han llamado diciendo que eran de mi banco y me han pedido un código SMS para bloquear un cargo. ¿Esto puede ser una estafa?";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Me llama el banco y me pide un código SMS — ¿Es una estafa?",
  description:
    "Si te llaman diciendo que son tu banco y te piden un código SMS, una clave o una confirmación urgente, revisa las señales con VonuAI antes de compartir datos.",
  alternates: {
    canonical: "/llamada-banco-codigo-sms",
  },
  openGraph: {
    title: "Me llama el banco y me pide un código SMS — VonuAI",
    description:
      "Revisa señales de vishing, llamadas falsas del banco y peticiones de códigos SMS antes de actuar.",
    url: `${siteUrl}/llamada-banco-codigo-sms`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Me llama el banco y me pide un código SMS — VonuAI",
    description:
      "Antes de dar un código SMS por teléfono, revisa las señales con VonuAI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Te piden un código SMS",
    text: "Una llamada que te pide un código de verificación, OTP o clave temporal debe hacerte frenar. Ese código puede servir para autorizar operaciones o cambios en tu cuenta.",
  },
  {
    title: "Dicen que hay un cargo urgente",
    text: "Los fraudes suelen usar miedo: un cargo sospechoso, una cuenta bloqueada, una operación pendiente o una amenaza de pérdida inmediata.",
  },
  {
    title: "Insisten en que no cuelgues",
    text: "Si intentan mantenerte en la llamada, evitar que abras la app oficial o impedir que llames tú al banco, es una señal de presión.",
  },
  {
    title: "Parecen saber datos tuyos",
    text: "Que mencionen tu nombre, parte de tu email, tu banco o algún dato personal no demuestra que sean realmente tu entidad.",
  },
  {
    title: "Te llevan a WhatsApp o a otra app",
    text: "Si la conversación pasa a WhatsApp, Telegram, acceso remoto o enlaces externos, el riesgo aumenta mucho.",
  },
  {
    title: "Te piden instalar algo",
    text: "Nunca instales apps, herramientas de control remoto o certificados porque alguien te lo pida por teléfono.",
  },
];

const whatToDo = [
  "No compartas el código SMS, OTP o clave de verificación.",
  "Cuelga aunque la llamada parezca urgente.",
  "Abre tú la app oficial del banco o llama al número oficial.",
  "No pulses enlaces que te dicten o te envíen durante la llamada.",
  "Si ya has dado un código, contacta urgentemente con tu banco.",
  "Describe la llamada en Vonu para revisar señales antes de actuar.",
];

const commonExamples = [
  {
    title: "“Hay un cargo sospechoso”",
    text: "Te dicen que necesitan un código para bloquear una operación que tú no reconoces.",
  },
  {
    title: "“Tu cuenta está en peligro”",
    text: "Usan miedo para que confirmes datos, claves o códigos sin pensarlo.",
  },
  {
    title: "“Te llamamos del departamento de seguridad”",
    text: "Suenan profesionales, pero te piden acciones que un banco no debería pedirte por teléfono.",
  },
  {
    title: "“Sigue conmigo en la llamada”",
    text: "Intentan que no cuelgues ni verifiques desde la app oficial o el teléfono real del banco.",
  },
];

const mistakes = [
  "Dar el código SMS pensando que sirve para cancelar una operación.",
  "Confiar porque la persona conoce tu nombre o tu banco.",
  "Seguir en la llamada mientras abres la app bancaria.",
  "Instalar una aplicación o permitir acceso remoto.",
  "Llamar al número que te da la propia persona en vez de buscar el oficial.",
];

const faqs = [
  {
    q: "¿Mi banco puede pedirme un código SMS por teléfono?",
    a: "Lo prudente es no compartir nunca códigos SMS, OTP, claves de verificación o contraseñas con alguien que te llama. Si hay una alerta real, entra tú desde la app oficial o llama al número oficial del banco.",
  },
  {
    q: "¿Qué hago si me llaman diciendo que son del banco?",
    a: "Cuelga, no compartas códigos ni datos, y comprueba la situación desde la app oficial, la web escrita manualmente o el teléfono oficial que aparece en tu tarjeta o banca online.",
  },
  {
    q: "¿Qué es el vishing?",
    a: "El vishing es una estafa por llamada telefónica en la que alguien intenta hacerse pasar por una empresa, banco u organismo para conseguir datos, códigos, pagos o acceso a tus cuentas.",
  },
  {
    q: "¿Y si ya he dado el código SMS?",
    a: "Contacta urgentemente con tu banco, revisa movimientos, cambia claves si procede y bloquea tarjetas o accesos si te lo recomiendan desde el canal oficial.",
  },
  {
    q: "¿VonuAI puede saber quién me ha llamado?",
    a: "VonuAI no identifica titulares de números ni confirma identidades absolutas. Te ayuda a revisar señales de riesgo, presión, urgencia, petición de códigos y pasos seguros antes de actuar.",
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

export default function LlamadaBancoCodigoSmsPage() {
  const chatHref = `/chat?example=${encodeURIComponent(bankCallExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/llamada-banco-codigo-sms#webpage`,
        url: `${siteUrl}/llamada-banco-codigo-sms`,
        name: "Me llama el banco y me pide un código SMS",
        description:
          "Guía para detectar señales de llamada falsa del banco, vishing y peticiones sospechosas de códigos SMS.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/llamada-banco-codigo-sms#faq`,
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
              Me llama el banco y me pide un código SMS.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si alguien te llama diciendo que es tu banco y te pide un código,
              una clave temporal o confirmar una operación, frena antes de
              actuar. Puede ser una señal clara de vishing.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Revisar llamada con Vonu
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
                  No des el código.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un código SMS no es un simple dato. Puede servir para autorizar
                  una operación, cambiar acceso o confirmar algo que no entiendes
                  del todo. Si te lo piden por teléfono, lo prudente es parar.
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
                Pistas típicas de una llamada falsa del banco.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una llamada puede sonar profesional y aun así ser peligrosa. Lo
              importante no es solo quién dice llamar, sino qué te pide hacer.
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
              Cambia el guion, pero la presión se repite.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Los estafadores pueden cambiar el banco, el motivo o el número
              desde el que llaman. Pero suelen buscar lo mismo: que actúes rápido
              y compartas algo sensible.
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
                El error suele ser obedecer antes de comprobar.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                En una llamada de este tipo, la mejor defensa es cortar la
                urgencia. No tienes que demostrar nada a quien te llama.
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
              Dudas habituales sobre llamadas del banco
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

      <ResourceSignup page="llamada-banco-codigo-sms" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de dar un código, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Describe la llamada, pega el SMS o explica qué te han pedido. Vonu
            te ayuda a revisar señales de riesgo antes de compartir códigos,
            datos o dinero.
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