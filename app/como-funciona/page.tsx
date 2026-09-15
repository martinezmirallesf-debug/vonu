import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo funciona — VonuAI",
  description:
    "Centro de ayuda de VonuAI: qué es, cómo funciona, qué puede analizar, planes, voz, archivos, privacidad y soporte.",
  alternates: {
    canonical: "/como-funciona",
  },
  openGraph: {
    title: "Cómo funciona — VonuAI",
    description:
      "Resuelve dudas sobre cómo usar VonuAI, subir archivos, usar voz, gestionar planes y entender sus límites.",
    url: `${siteUrl}/como-funciona`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo funciona — VonuAI",
    description:
      "Cómo funciona VonuAI y cómo puede ayudarte antes de firmar, pagar, contestar o decidir.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const helpBlocks = [
  {
    title: "Primeros pasos",
    text: "Aprende qué es Vonu, cómo empezar a usarlo y qué tipo de dudas puedes revisar antes de actuar.",
    href: "#primeros-pasos",
  },
  {
    title: "Archivos y documentos",
    text: "Sube imágenes o PDFs para que Vonu te ayude a entender lo importante y qué conviene revisar.",
    href: "#archivos",
  },
  {
    title: "Voz y conversación",
    text: "Usa el modo conversación para explicar una situación con más naturalidad cuando escribir se queda corto.",
    href: "#voz",
  },
  {
    title: "Planes y uso",
    text: "Consulta cómo funcionan los mensajes, minutos de voz, recargas, suscripción y cancelación.",
    href: "#planes",
  },
];

const sections = [
  {
    id: "primeros-pasos",
    label: "Primeros pasos",
    heading: "Empieza con una duda real.",
    questions: [
      {
        q: "¿Qué es VonuAI?",
        a: "VonuAI es un asistente para tomar decisiones más seguras. Te ayuda a revisar mensajes, webs, documentos, facturas, contratos y situaciones delicadas antes de firmar, pagar, contestar o decidir.",
      },
      {
        q: "¿Para qué puedo usar Vonu?",
        a: "Puedes usarlo para analizar posibles estafas, revisar una web antes de comprar, entender una factura, detectar puntos delicados en un contrato, ordenar una situación confusa o pedir ayuda para estudiar paso a paso.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Entra en el chat, escribe tu duda con tus palabras o sube un archivo si lo necesitas. Vonu analizará el contexto y te dará una orientación clara con señales importantes y próximos pasos.",
      },
    ],
  },
  {
    id: "archivos",
    label: "Archivos y documentos",
    heading: "Sube capturas, PDFs y documentos.",
    questions: [
      {
        q: "¿Qué archivos puedo subir?",
        a: "Vonu puede ayudarte con imágenes y PDFs. Puedes subir capturas, facturas, recibos, documentos, contratos o material de estudio para extraer lo importante y entender qué revisar.",
      },
      {
        q: "¿Qué hace Vonu con un PDF?",
        a: "Lee el contenido disponible, identifica el tipo de documento, resume lo más relevante y te explica qué puntos conviene revisar según el caso. Si el archivo está borroso, incompleto, escaneado con mala calidad o contiene partes no legibles, el análisis puede ser limitado.",
      },
      {
        q: "¿Debo subir documentos sensibles?",
        a: "Comparte solo lo necesario para analizar la situación. Evita subir contraseñas, códigos de verificación, datos bancarios completos o información extremadamente sensible que no aporte valor al análisis.",
      },
    ],
  },
  {
    id: "voz",
    label: "Voz y conversación",
    heading: "Habla cuando escribir se queda corto.",
    questions: [
      {
        q: "¿Para qué sirve el modo conversación?",
        a: "Sirve para explicar una situación hablando de forma natural. Es útil cuando hay muchos detalles, cuando estás estudiando o cuando necesitas ordenar lo que ha pasado sin escribirlo todo.",
      },
      {
        q: "¿La voz está incluida en todos los planes?",
        a: "La voz está pensada para planes con más capacidad porque permite una experiencia más completa. Los minutos disponibles dependen del plan y pueden ampliarse con recargas si lo necesitas.",
      },
      {
        q: "¿Puedo escribir mientras uso voz?",
        a: "Sí. La idea de Vonu es combinar texto, voz y archivos para que puedas explicar mejor el contexto y recibir una orientación más precisa.",
      },
    ],
  },
  {
    id: "planes",
    label: "Planes y uso",
    heading: "Uso claro, sin complicarte.",
    questions: [
      {
        q: "¿Puedo usar Vonu gratis?",
        a: "Sí. Puedes empezar gratis para probar cómo analiza una duda real, un mensaje sospechoso o una situación que quieras entender mejor antes de actuar.",
      },
      {
        q: "¿Qué pasa si agoto mis mensajes?",
        a: "Si necesitas seguir usando Vonu antes de que se renueve tu plan, podrás añadir una recarga. Así no tienes que cambiar de plan si solo necesitas un extra puntual.",
      },
      {
        q: "¿Puedo cancelar mi suscripción?",
        a: "Sí. Podrás gestionar tu suscripción desde la zona de usuario o el portal de pagos. La idea es que tengas control claro sobre tu plan, sin complicaciones.",
      },
    ],
  },
  {
    id: "privacidad-patrones",
    label: "Privacidad y patrones",
    heading: "Aprende de señales, no de datos sensibles.",
    questions: [
      {
        q: "¿VonuAI aprende de los casos que analiza?",
        a: "VonuAI puede aprender de señales generales y patrones de riesgo, no de datos sensibles innecesarios. Por ejemplo, puede detectar que cierto tipo de SMS, web, factura, presión emocional o intento de inversión se parece a casos ya revisados.",
      },
      {
        q: "¿Qué pasa con los casos sospechosos?",
        a: "Algunos casos pueden generar registros internos de revisión. Antes de convertirse en patrones útiles, VonuAI puede limpiarlos, anonimizarlos, deduplicarlos y clasificarlos para evitar guardar información sensible que no haga falta.",
      },
      {
        q: "¿Esto significa que mis datos se venden o se hacen públicos?",
        a: "No. La finalidad es mejorar la protección y reconocer riesgos parecidos en el futuro. VonuAI no vende tus datos personales ni convierte tus conversaciones originales en una base pública.",
      },
    ],
  },
  {
    id: "limites",
    label: "Límites responsables",
    heading: "Orientación responsable, no sustitución profesional.",
    questions: [
      {
        q: "¿Vonu sustituye a profesionales?",
        a: "No. Vonu no sustituye a abogados, médicos, psicólogos, asesores fiscales ni otros profesionales. Lo que sí hace es ayudarte a identificar riesgos, ordenar la información, preparar mejores preguntas y acompañarte en los siguientes pasos.",
      },
      {
        q: "¿Qué hago si tengo una urgencia?",
        a: "Si hay riesgo inmediato para tu seguridad, salud, dinero o integridad, contacta con servicios de emergencia, tu banco, la policía o un profesional cualificado. Vonu puede ayudarte a ordenar los pasos, pero no debe retrasar una actuación urgente.",
      },
      {
        q: "¿Por qué Vonu hace preguntas a veces?",
        a: "Porque muchas situaciones necesitan contexto. Si faltan datos importantes, Vonu puede preguntarte detalles concretos para orientarte mejor y evitar una respuesta demasiado genérica.",
      },
    ],
  },
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

export default function HelpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/como-funciona#webpage`,
        url: `${siteUrl}/como-funciona`,
        name: "Cómo funciona VonuAI",
        description:
          "Centro de ayuda de VonuAI: qué es, cómo funciona, qué puede analizar, planes, voz, archivos, privacidad y límites responsables.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/como-funciona#faq`,
        mainEntity: sections.flatMap((section) =>
          section.questions.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          }))
        ),
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
            <h1 className="mx-auto mt-5 max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              Empieza con una duda.
              <span className="block text-slate-400">Vonu te ayuda a <GradientText>ordenarla.</GradientText></span>
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Texto, voz, capturas o documentos. El objetivo es el mismo: entender mejor qué tienes delante antes de actuar.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/chat" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0">
                Probar Vonu
                <ArrowIcon />
              </Link>
              <a href="#primeros-pasos" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.07] active:translate-y-0">
                Ver cómo funciona
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-[1040px] gap-4 md:grid-cols-2 lg:grid-cols-4">
            {helpBlocks.map((item, index) => (
              <a key={item.title} href={item.href} className="group min-h-[230px] rounded-[24px] border border-white/[0.07] bg-white/[0.035] p-6 transition hover:border-white/[0.12] hover:bg-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-300">0{index + 1}</span>
                  <ArrowIcon />
                </div>
                <h2 className="mt-10 text-[24px] font-semibold leading-[1.03] tracking-[-0.04em] text-white">{item.title}</h2>
                <p className="mt-4 text-[13px] leading-6 text-slate-400">{item.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className={["border-b border-white/[0.06]", index % 2 === 0 ? "bg-[#0a0d15]" : "bg-[#080b12]"].join(" ")}>
          <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{section.label}</p>
              <h2 className="mt-4 max-w-[600px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{section.heading}</h2>
            </div>
            <div className="space-y-3">
              {section.questions.map((item) => (
                <details key={item.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4 transition hover:border-white/[0.12] hover:bg-white/[0.045]">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[17px] font-semibold leading-tight tracking-[-0.025em] text-slate-100 sm:text-[19px]">{item.q}</span>
                      <span className="text-[30px] font-light leading-none text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span>
                    </div>
                  </summary>
                  <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <ResourceSignup page="como-funciona" />

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">
              La forma más fácil de entenderlo
              <span className="block text-slate-500">es probarlo con algo real.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-8 text-slate-400">Escribe una duda, pega un enlace o explica una situación concreta y comprueba cómo Vonu organiza las señales y los siguientes pasos.</p>
            <Link href="/chat" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0">
              Probar Vonu
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
