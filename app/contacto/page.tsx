import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
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

function ContactReasonTitle({ title }: { title: string }) {
  if (title === "Soporte") {
    return <GradientText tone="blueCyan">Soporte</GradientText>;
  }

  if (title === "Producto") {
    return <GradientText tone="blueGreen">Producto</GradientText>;
  }

  if (title === "Privacidad") {
    return <GradientText tone="purplePink">Privacidad</GradientText>;
  }

  if (title === "Colaboración") {
    return <GradientText tone="amberOrange">Colaboración</GradientText>;
  }

  return <>{title}</>;
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1040px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[118px]">
              Hablemos de lo que
              <span className="block text-zinc-500">
                <GradientText tone="blueCyan">necesitas.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Escríbenos si tienes una duda sobre Vonu, necesitas soporte,
              quieres colaborar o quieres contarnos algo que pueda ayudarnos a
              mejorar.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <a
                href="#contacto"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Escribir ahora</span>
                <ArrowIcon />
              </a>

              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Probar Vonu
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 md:grid-cols-4">
            {contactReasons.map((reason) => (
              <article
                key={reason.title}
                className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]"
              >
                <h2 className="text-[28px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <ContactReasonTitle title={reason.title} />
                </h2>

                <p className="mt-5 text-[15px] leading-7 text-zinc-600">
                  {reason.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Contacto
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
              Cuéntanos en qué
              <span className="block text-zinc-500">
                podemos <GradientText tone="blueGreen">ayudarte.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
              Elige el motivo, deja tus datos y explícanos brevemente la
              situación. Te responderemos con la información más útil posible.
            </p>

            <div className="mt-8 rounded-[34px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]">
              <p className="text-[24px] font-semibold leading-tight tracking-[-0.045em] text-zinc-950">
                También puedes escribirnos sobre:
              </p>

              <div className="mt-5 grid gap-4">
                {resourceTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex gap-4 rounded-[24px] bg-[#f5f5f7] p-4 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="shrink-0 text-zinc-950">
                      <CheckIcon />
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[42px] border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_20px_58px_rgba(0,0,0,0.075)] sm:p-6 lg:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <ResourceSignup page="contacto" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            ¿Quieres probarlo antes?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            La forma más rápida de entender Vonu es abrir el chat y probarlo con
            una duda real.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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