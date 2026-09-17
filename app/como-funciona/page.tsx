import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo funciona Vonu — Comprueba antes de confiar",
  description:
    "Cómo funciona Vonu Check: analiza enlaces, mensajes y capturas, separa señales de riesgo de hechos observables y propone qué verificar antes de actuar.",
  alternates: { canonical: "/como-funciona" },
  openGraph: {
    title: "Cómo funciona Vonu — Comprueba antes de confiar",
    description: "De una duda a señales claras, nivel de riesgo y próximos pasos antes de actuar.",
    url: `${siteUrl}/como-funciona`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo funciona Vonu",
    description: "Analiza enlaces, mensajes y capturas antes de confiar, pagar o compartir datos.",
  },
  robots: { index: true, follow: true },
};

const steps = [
  {
    number: "01",
    title: "Envía lo que te genera dudas",
    text: "Pega un enlace o mensaje, o sube una captura. No necesitas explicar la estafa ni saber qué tipo de fraude podría ser.",
  },
  {
    number: "02",
    title: "Vonu busca señales",
    text: "Analiza contexto, identidad aparente, urgencia, peticiones de dinero o datos, enlaces y señales técnicas disponibles.",
  },
  {
    number: "03",
    title: "Recibes riesgo y evidencia",
    text: "La puntuación de 0 a 100 resume la evidencia disponible y se acompaña de las señales que han pesado en el resultado.",
  },
  {
    number: "04",
    title: "Verifica antes de actuar",
    text: "Vonu propone próximos pasos: qué no hacer todavía y qué confirmar por un canal independiente u oficial.",
  },
];

const modes = [
  {
    label: "URL",
    title: "Enlaces y webs",
    text: "Vonu revisa la URL final, HTTPS, redirecciones, formularios, antigüedad del dominio, señales visibles y reputación técnica disponible.",
  },
  {
    label: "Mensaje",
    title: "SMS, WhatsApp y texto",
    text: "Busca patrones de phishing, suplantación, urgencia, presión, pagos, códigos, secretos y otras señales de ingeniería social.",
  },
  {
    label: "Captura",
    title: "Lo que ves en pantalla",
    text: "Analiza el texto y el contexto visibles de una captura para aplicar los mismos criterios de riesgo que a un mensaje escrito.",
  },
];

const faq = [
  {
    q: "¿Qué significa la puntuación de 0 a 100?",
    a: "Es un índice orientativo de riesgo basado en las señales que Vonu ha podido observar. No es una probabilidad matemática de fraude ni una prueba de que alguien haya cometido un delito.",
  },
  {
    q: "¿Una puntuación baja significa que es seguro?",
    a: "No. Significa que no se han detectado señales fuertes en lo analizado. Si el contexto externo sigue siendo extraño, verifica igualmente por un canal oficial o independiente.",
  },
  {
    q: "¿Vonu reconoce solo estafas que ya conoce?",
    a: "No. El sistema utiliza patrones conocidos como referencia, pero también puntúa señales observables y combinaciones de riesgo para poder detectar variantes nuevas.",
  },
  {
    q: "¿Qué comprueba de una URL?",
    a: "Entre otras cosas, protocolo, redirecciones, formularios, contenido visible, edad del dominio y fuentes técnicas de reputación cuando están disponibles. Ninguna de estas señales, por sí sola, certifica legitimidad.",
  },
  {
    q: "¿Qué datos no debo enviar?",
    a: "No envíes contraseñas, códigos OTP o SMS, PIN, claves de recuperación, números completos de tarjeta ni otra información secreta que no sea necesaria para entender el caso.",
  },
  {
    q: "¿Necesito una cuenta?",
    a: "El primer análisis puede probarse sin registro. Los límites y capacidades adicionales dependen del plan disponible en cada momento.",
  },
];

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline"
      style={{
        backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
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
      <path d="M5 12h13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ComoFuncionaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/como-funciona#webpage`,
        url: `${siteUrl}/como-funciona`,
        name: "Cómo funciona Vonu",
        description: "Cómo Vonu analiza enlaces, mensajes y capturas y explica señales de riesgo antes de actuar.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/como-funciona#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-190px] -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[120px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[320px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Cómo funciona</p>
            <h1 className="mx-auto mt-5 max-w-[1050px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              De una duda a una
              <span className="block text-slate-400">decisión más <GradientText>segura.</GradientText></span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Vonu Check convierte un enlace, mensaje o captura sospechosa en señales comprensibles, un nivel de riesgo y pasos concretos para verificar antes de actuar.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/es/check" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
                Probar Vonu Check <ArrowIcon />
              </Link>
              <Link href="/casos-de-uso" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:bg-white/[0.07]">
                Ver casos de uso
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Proceso</p>
          <h2 className="mt-4 max-w-[820px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Cuatro pasos. Sin obligarte a confiar en una caja negra.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6">
                <p className="text-[12px] font-bold tracking-[0.14em] text-emerald-300">{step.number}</p>
                <h3 className="mt-10 text-[23px] font-semibold leading-[1.05] tracking-[-0.04em] text-white">{step.title}</h3>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Qué puedes comprobar</p>
              <h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Tres entradas. Una misma lógica de riesgo.</h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">El objetivo no es adivinar. Es reunir señales, explicar sus límites y darte una forma práctica de verificar.</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {modes.map((mode) => (
              <article key={mode.label} className="min-h-[280px] rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{mode.label}</p>
                <h3 className="mt-12 text-[30px] font-semibold tracking-[-0.05em] text-white">{mode.title}</h3>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{mode.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <article className="rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-sky-300">Señales conocidas + variantes nuevas</p>
            <h2 className="mt-5 text-[36px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">Fraud Atlas no es una lista cerrada de estafas.</h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-400">Vonu utiliza patrones de fraude conocidos como contexto, pero la puntuación se apoya también en evidencia observable: suplantación, urgencia, petición de dinero, bloqueo de verificación, credenciales, enlaces y combinaciones de señales.</p>
          </article>
          <article className="rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Límites responsables</p>
            <h2 className="mt-5 text-[36px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">Una señal no debe convertirse en una sentencia.</h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-400">Una palabra, un Bizum, un dominio nuevo o una petición urgente pueden ser legítimos. Vonu intenta valorar combinaciones y contexto para evitar tanto falsas alarmas como falsa tranquilidad.</p>
          </article>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Preguntas frecuentes</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Qué significa realmente el resultado.</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5"><span className="text-[17px] font-semibold text-slate-100 sm:text-[19px]">{item.q}</span><span className="text-[30px] font-light text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span></div>
                </summary>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <h2 className="mx-auto max-w-[900px] text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">¿Algo no te cuadra? Compruébalo antes de actuar.</h2>
          <Link href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d]">Analizar ahora <ArrowIcon /></Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
