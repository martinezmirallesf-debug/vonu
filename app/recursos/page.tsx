import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Recursos Vonu — Guías, avances y decisiones seguras",
  description:
    "Recursos VonuAI: guías prácticas, avances de producto, seguridad, estudio, voz, documentos y decisiones digitales.",
  alternates: {
    canonical: "/recursos",
  },
  openGraph: {
    title: "Recursos Vonu — Guías, avances y decisiones seguras",
    description:
      "Guías prácticas, avances de producto y recursos para usar VonuAI con más claridad.",
    url: `${siteUrl}/recursos`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos Vonu — Guías, avances y decisiones seguras",
    description: "Guías, avances y recursos para decidir mejor con VonuAI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const featuredResources = [
  {
    title: "¿Es fiable? Compruébalo antes de actuar",
    category: "Fiabilidad",
    text: "Revisa webs, tiendas, mensajes, perfiles, facturas, contratos u ofertas antes de pagar, firmar, contestar o compartir datos.",
    href: "/es-fiable",
  },
  {
    title: "Analizar link sospechoso",
    category: "Enlaces sospechosos",
    text: "Comprueba enlaces recibidos por SMS, WhatsApp, email, redes sociales o códigos QR antes de pulsar o introducir datos.",
    href: "/analizar-link-sospechoso",
  },
  {
    title: "Comprobar si una inversión es estafa",
    category: "Inversiones",
    text: "Revisa propuestas de trading, criptomonedas, plataformas raras o beneficios rápidos antes de enviar dinero.",
    href: "/comprobar-inversion-estafa",
  },
  {
    title: "Cómo saber si un SMS puede ser una estafa",
    category: "Estafas",
    text: "Señales habituales, errores comunes y pasos prudentes antes de pulsar un enlace o compartir datos.",
    href: "/analizar-sms-estafa",
  },
  {
    title: "Cómo comprobar si una web es fiable",
    category: "Webs",
    text: "Qué revisar antes de pagar: dominio, datos legales, métodos de pago, opiniones y señales de presión.",
    href: "/comprobar-web-fiable",
  },
  {
    title: "Qué mirar antes de firmar un contrato",
    category: "Documentos",
    text: "Puntos básicos para detectar cláusulas confusas, obligaciones, permanencias, penalizaciones y riesgos.",
    href: "/revisar-contrato",
  },
  {
    title: "Me llama el banco y me pide un código SMS",
    category: "Llamadas sospechosas",
    text: "Señales de vishing, llamadas falsas del banco y pasos prudentes antes de dar códigos, claves o datos.",
    href: "/llamada-banco-codigo-sms",
  },
  {
    title: "Estafas con criptomonedas",
    category: "Crypto",
    text: "Cómo detectar promesas de inversión, plataformas falsas, contactos por Telegram o supuestos expertos en trading.",
    href: "/estafas-criptomonedas",
  },
  {
    title: "Email sospechoso o phishing",
    category: "Email",
    text: "Revisa correos que imitan bancos, empresas, pagos, facturas, avisos urgentes o enlaces que piden datos.",
    href: "/email-sospechoso-estafa",
  },
  {
    title: "Cómo comprobar si una factura está bien",
    category: "Facturas",
    text: "Revisa importes, conceptos, cargos duplicados, servicios no contratados y qué hacer si crees que te han cobrado de más.",
    href: "/comprobar-factura",
  },
  {
    title: "Cómo detectar manipulación emocional",
    category: "Psicología aplicada",
    text: "Revisa mensajes o situaciones donde sientes culpa, presión, urgencia o confusión antes de contestar o decidir.",
    href: "/detectar-manipulacion",
  },
  {
    title: "Cómo comprobar si una tienda online es fiable",
    category: "Compras online",
    text: "Antes de pagar, revisa si la tienda muestra señales reales de confianza o posibles indicios de estafa.",
    href: "/comprobar-tienda-online",
  },
  {
    title: "Analizar captura de pantalla online",
    category: "Capturas",
    text: "Sube una captura de SMS, WhatsApp, perfil, web, factura o conversación para revisar señales antes de actuar.",
    href: "/analizar-captura-pantalla",
  },
  {
    title: "Cómo detectar un perfil falso",
    category: "Apps de citas y redes",
    text: "Revisa capturas de Tinder, Badoo, Bumble, Instagram o conversaciones para detectar catfishing, fotos reutilizadas o señales raras.",
    href: "/detectar-perfil-falso",
  },
  {
    title: "Revisar contrato de alquiler online",
    category: "Contratos",
    text: "Comprueba fianza, duración, gastos, reparaciones, penalizaciones y cláusulas delicadas antes de firmar.",
    href: "/revisar-contrato-alquiler",
  },
];

const categories = [
  {
    title: "Seguridad digital",
    text: "Mensajes sospechosos, enlaces, webs, pagos, fraudes y decisiones online.",
  },
  {
    title: "Documentos y contratos",
    text: "Facturas, PDFs, condiciones, cláusulas, recibos y textos difíciles de entender.",
  },
  {
    title: "Voz y producto",
    text: "Avances de Vonu, modo conversación, análisis de archivos y nuevas funciones.",
  },
  {
    title: "Tutor y estudio",
    text: "Explicaciones paso a paso, resúmenes, ejercicios, voz y ayudas visuales.",
  },
  {
    title: "Psicología aplicada",
    text: "Presión, manipulación, dudas antes de responder y claridad emocional.",
  },
  {
    title: "Uso responsable",
    text: "Buenas prácticas para usar IA con privacidad, criterio y seguridad.",
  },
];

const upcoming = [
  "Guías cortas para detectar estafas frecuentes.",
  "Explicaciones sobre nuevas funciones de Vonu.",
  "Casos prácticos de webs, contratos, facturas y mensajes.",
  "Recursos para estudiar mejor con voz, archivos e imágenes.",
  "Consejos de privacidad y uso responsable de IA.",
];

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline"
      style={{
        backgroundImage:
          "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RecursosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/recursos#webpage`,
        url: `${siteUrl}/recursos`,
        name: "Recursos Vonu",
        description:
          "Guías prácticas, avances de producto y recursos para usar VonuAI con más claridad.",
        inLanguage: "es-ES",
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/recursos#resources`,
        itemListElement: featuredResources.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: `${siteUrl}${item.href}`,
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
        <div className="pointer-events-none absolute right-[-180px] top-[300px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Recursos</p>
            <h1 className="mx-auto mt-5 max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              Aprende a revisar
              <span className="block text-slate-400">antes de <GradientText>confiar.</GradientText></span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Guías prácticas para webs, mensajes, contratos, facturas, inversiones y otras situaciones donde una comprobación a tiempo puede evitar un problema.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-[1040px] gap-4 md:grid-cols-3">
            {categories.slice(0, 3).map((item) => (
              <div key={item.title} className="min-h-[210px] rounded-[24px] border border-white/[0.07] bg-white/[0.035] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">Explora</p>
                <h2 className="mt-10 text-[28px] font-semibold leading-[1.04] tracking-[-0.045em] text-white">{item.title}</h2>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Guías destacadas</p>
              <h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
                Respuestas concretas para
                <span className="block text-slate-500">dudas muy reales.</span>
              </h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">
              Entra por el problema que tienes delante. Cada guía te ayuda a reconocer señales y a decidir qué comprobar después.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredResources.map((item) => (
              <Link key={item.href} href={item.href} className="group relative min-h-[285px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">{item.category}</p>
                <h3 className="mt-8 max-w-[330px] text-[26px] font-semibold leading-[1.04] tracking-[-0.04em] text-white">{item.title}</h3>
                <p className="mt-4 max-w-[350px] text-[14px] leading-7 text-slate-400">{item.text}</p>
                <span className="absolute bottom-6 right-6 grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400 transition group-hover:border-white/[0.14] group-hover:text-white"><ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Categorías</p>
            <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Una biblioteca para
              <span className="block text-slate-500">decidir con más criterio.</span>
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">Seguridad, documentos, producto, estudio y uso responsable reunidos en un mismo sitio.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((item) => (
              <article key={item.title} className="rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5">
                <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-white">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Lo que viene</p>
            <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Más recursos,
              <span className="block text-slate-500">menos ruido.</span>
            </h2>
          </div>
          <div className="grid gap-3">
            {upcoming.map((item) => (
              <div key={item} className="flex gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5 text-[14px] leading-7 text-slate-300">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="recursos" />

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">
              ¿No encuentras tu caso?
              <span className="block text-slate-500">Pregúntale directamente a Vonu.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-8 text-slate-400">Una URL, una captura, un mensaje o una explicación bastan para empezar a revisar lo que te preocupa.</p>
            <Link href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0">
              Analizar ahora
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
