import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ContactForm from "../components/ContactForm";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Contacto — VonuAI",
  description:
    "Contacta con VonuAI para soporte, dudas sobre planes, colaboración, privacidad o información general.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto — VonuAI",
    description:
      "Contacta con VonuAI para soporte, dudas, colaboración o información sobre el producto.",
    url: `${siteUrl}/contacto`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto — VonuAI",
    description:
      "Soporte, colaboración, privacidad y contacto general de VonuAI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactReasons = [
  {
    title: "Soporte",
    text: "Dudas sobre tu cuenta, suscripción, pagos, recargas o funcionamiento de Vonu.",
  },
  {
    title: "Producto",
    text: "Ideas, feedback, errores o sugerencias para mejorar la experiencia.",
  },
  {
    title: "Privacidad",
    text: "Consultas sobre datos, uso responsable, documentos o seguridad.",
  },
  {
    title: "Colaboración",
    text: "Propuestas, medios, partners o proyectos relacionados con decisiones seguras.",
  },
];

const resourceTopics = [
  "Estafas y mensajes sospechosos",
  "Contratos y documentos",
  "Voz y nuevas funciones",
  "Tutor, estudio y explicaciones",
  "Decisiones digitales",
  "Uso responsable de IA",
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
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
            <h1 className="mx-auto max-w-4xl text-[52px] font-semibold leading-[0.92] tracking-[-0.075em] text-zinc-950 sm:text-[78px] lg:text-[104px]">
              Hablemos de lo que necesitas.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Escríbenos si tienes una duda sobre Vonu, necesitas soporte, quieres
              colaborar o quieres contarnos algo que pueda ayudarnos a mejorar.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Contacto
            </p>

            <h2 className="mt-3 max-w-xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
              Cuéntanos en qué podemos ayudarte.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Elige el motivo, deja tus datos y explícanos brevemente la situación.
              Te responderemos con la información más útil posible.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contactReasons.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-[19px] font-semibold tracking-[-0.03em] text-zinc-950">
                    {reason.title}
                  </h3>

                  <p className="mt-2 text-[14.5px] leading-6 text-zinc-600">
                    {reason.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <ResourceSignup page="contacto" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            ¿Quieres probarlo antes?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            La forma más rápida de entender Vonu es abrir el chat y probarlo con
            una duda real.
          </p>

          <Link
            href="/chat"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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