import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const profileExample =
  "Voy a subir una captura para que la revises. Quiero que me ayudes a entender qué conviene comprobar antes de seguir hablando con esa persona.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo detectar un perfil falso — Tinder, Badoo, Instagram y catfishing",
  description:
    "Aprende a detectar perfiles falsos en Tinder, Badoo, Bumble, Instagram o redes sociales. Revisa fotos reutilizadas, catfishing, romance scam, cripto, presión y señales de alerta.",
  alternates: {
    canonical: "/detectar-perfil-falso",
  },
  openGraph: {
    title: "Cómo detectar un perfil falso — VonuAI",
    description:
      "Sube una captura de un perfil, foto o conversación y revisa señales de perfil falso, catfishing, romance scam, presión o intento de estafa.",
    url: `${siteUrl}/detectar-perfil-falso`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo detectar un perfil falso — VonuAI",
    description:
      "Revisa capturas de perfiles y conversaciones para detectar señales de catfishing, fotos reutilizadas o estafas en apps de citas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const useCases = [
  {
    title: "Perfil de Tinder, Badoo o Bumble",
    text: "Revisa si hay señales de perfil falso, foto demasiado perfecta, bio genérica, falta de coherencia o intento de llevarte rápido a WhatsApp o Telegram.",
  },
  {
    title: "Perfil de Instagram o redes sociales",
    text: "Mira si la cuenta parece tener vida real: publicaciones antiguas, comentarios naturales, seguidores coherentes, etiquetas, fotos variadas y actividad normal.",
  },
  {
    title: "Foto reutilizada o robada",
    text: "Una foto puede parecer real y aun así estar reutilizada en varios sitios. Eso baja mucho la confianza en el perfil que la usa.",
  },
  {
    title: "Conversación demasiado intensa",
    text: "Love bombing, cariño exagerado muy rápido, historias tristes, urgencia o presión emocional pueden formar parte de una estafa amorosa.",
  },
  {
    title: "Cripto, inversión o trading",
    text: "Si alguien de una app de citas empieza a hablar de invertir, criptomonedas, beneficios fáciles o plataformas desconocidas, conviene parar.",
  },
  {
    title: "Dinero, códigos o documentos",
    text: "Pedir dinero, códigos, fotos íntimas, documentos, tarjetas regalo o datos personales es una señal clara para ir con mucha precaución.",
  },
];

const checklist = [
  "Sube una captura del perfil, foto o conversación si quieres revisarlo.",
  "Comprueba si hay más fotos variadas y una biografía coherente.",
  "Revisa si aparece verificación visible, pero sin confiarte solo por eso.",
  "Desconfía si intenta moverte rápido a WhatsApp o Telegram.",
  "No envíes dinero, códigos, documentos ni fotos íntimas si hay presión.",
  "Si la conversación avanza, una videollamada corta puede darte más tranquilidad.",
];

const warningSigns = [
  {
    title: "Quiere sacarte rápido de la app",
    text: "Mover la conversación enseguida a WhatsApp, Telegram u otra plataforma puede ser una forma de evitar controles o reportes.",
  },
  {
    title: "Habla de dinero o inversión",
    text: "En una app de citas, una persona que de verdad quiere conocerte no debería meterte prisa para invertir dinero.",
  },
  {
    title: "Evita verificarse",
    text: "Si evita videollamada, cambia de tema, pone excusas constantes o no puede demostrar mínimamente quién es, conviene ir despacio.",
  },
  {
    title: "La foto aparece en otros sitios",
    text: "Una imagen reutilizada no confirma por sí sola una estafa, pero sí puede indicar foto robada, perfil reciclado o catfishing.",
  },
  {
    title: "Demasiada confianza demasiado rápido",
    text: "Mensajes muy intensos, promesas rápidas o vínculo emocional acelerado pueden buscar que bajes la guardia.",
  },
  {
    title: "Pide datos o material sensible",
    text: "Códigos, documentos, dinero, tarjetas regalo o fotos íntimas nunca deberían pedirse con presión o urgencia.",
  },
];

const mistakes = [
  "Creer que una foto bonita significa que el perfil es real.",
  "Confiar solo porque aparece un check o una verificación.",
  "Enviar dinero por una historia urgente o emocional.",
  "Mover la conversación demasiado rápido fuera de la app.",
  "Compartir documentos, códigos o fotos íntimas por presión.",
  "Ignorar contradicciones porque la conversación parece agradable.",
];

const faqs = [
  {
    q: "¿Cómo saber si un perfil de Tinder es falso?",
    a: "Revisa si tiene fotos variadas, biografía coherente, verificación visible, conversación natural y ausencia de señales raras como dinero, inversión, enlaces, presión o evasión de una videollamada sencilla.",
  },
  {
    q: "¿Un perfil verificado siempre es fiable?",
    a: "No. La verificación suma confianza sobre la foto o identidad, pero no garantiza intenciones. Si después aparecen dinero, cripto, presión, códigos o enlaces raros, hay que ir con cuidado.",
  },
  {
    q: "¿Una foto real puede pertenecer a un perfil falso?",
    a: "Sí. Una foto puede ser real, estar robada o reutilizada de otra persona. Por eso no basta con que la imagen parezca natural.",
  },
  {
    q: "¿Qué es catfishing?",
    a: "Catfishing es cuando alguien usa una identidad falsa o fotos de otra persona para engañar, manipular o ganar confianza en internet.",
  },
  {
    q: "¿Qué hago si alguien de una app de citas me habla de invertir?",
    a: "Para y no envíes dinero. Las estafas de romance e inversión suelen empezar con confianza emocional y acaban llevando a plataformas de trading, cripto o pagos difíciles de recuperar.",
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

export default function DetectarPerfilFalsoPage() {
  const chatHref = `/chat?example=${encodeURIComponent(profileExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/detectar-perfil-falso#webpage`,
        url: `${siteUrl}/detectar-perfil-falso`,
        name: "Cómo detectar un perfil falso",
        description:
          "Guía para detectar perfiles falsos en apps de citas y redes sociales: Tinder, Badoo, Bumble, Instagram, catfishing, romance scam, fotos reutilizadas y presión para invertir.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/detectar-perfil-falso#faq`,
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
              Cómo detectar un perfil falso.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Revisa perfiles de Tinder, Badoo, Bumble, Instagram o redes
              sociales antes de confiar, enviar datos, mover la conversación o
              seguir hablando con alguien que te genera dudas.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href={chatHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Revisar perfil con Vonu
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
                  Una foto bonita no confirma una identidad.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Un perfil puede parecer normal y aun así usar fotos
                  reutilizadas, una identidad falsa o una conversación diseñada
                  para ganarse tu confianza. Lo importante es mirar señales en
                  conjunto, no una sola foto.
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
                Señales que conviene mirar antes de confiar.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu puede ayudarte a revisar capturas de perfiles, fotos,
              biografías o conversaciones para separar dudas normales de señales
              realmente preocupantes.
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
              Señales de alerta
            </p>

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              El riesgo suele aparecer en la conversación.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Una foto puede parecer real. Por eso hay que mirar también la
              urgencia, el dinero, los enlaces, la presión, las excusas y la
              coherencia del perfil.
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
                No investigues con miedo, revisa con calma.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                La idea no es desconfiar de todo el mundo. Es detectar señales
                concretas cuando algo no encaja y protegerte antes de compartir
                dinero, datos o intimidad.
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
              Dudas habituales sobre perfiles falsos
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

      <ResourceSignup page="detectar-perfil-falso" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de confiar, revisa el perfil.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube una captura del perfil, foto o conversación. Vonu te ayuda a
            revisar señales de catfishing, foto reutilizada, presión, dinero o
            incoherencias antes de seguir adelante.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Revisar perfil con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}