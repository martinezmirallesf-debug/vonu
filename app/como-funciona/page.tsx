import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const siteUrl = "https://app.vonuai.com";

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
    questions: [
      {
        q: "¿Qué archivos puedo subir?",
        a: "Vonu puede ayudarte con imágenes y PDFs. Puedes subir capturas, facturas, recibos, documentos, contratos o material de estudio para extraer lo importante y entender qué revisar.",
      },
      {
        q: "¿Qué hace Vonu con un PDF?",
        a: "Lee el contenido disponible, identifica el tipo de documento, resume lo más relevante y te explica qué puntos conviene revisar según el caso.",
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
    id: "limites",
    label: "Límites responsables",
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

export default function HelpPage() {
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
              Cómo funciona VonuAI.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Entiende cómo Vonu analiza mensajes, archivos, voz y situaciones delicadas para ayudarte a decidir con más claridad.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {helpBlocks.map((block) => (
              <a
                key={block.title}
                href={block.href}
                className="rounded-[30px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.07)]"
              >
                <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-zinc-950">
                  {block.title}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                  {block.text}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  {section.label}
                </p>

                <div className="mt-4 space-y-3">
                  {section.questions.map((item) => (
                    <details
                      key={item.q}
                      className="group rounded-[26px] border border-zinc-200 bg-[#f8f9fa] p-5 shadow-sm"
                    >
                      <summary className="cursor-pointer list-none text-[18px] font-semibold tracking-[-0.025em] text-zinc-950">
                        <div className="flex items-center justify-between gap-4">
                          <span>{item.q}</span>
                          <span className="text-zinc-400 transition group-open:rotate-45">
                            +
                          </span>
                        </div>
                      </summary>

                      <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            ¿Tienes una situación concreta?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            La forma más rápida de entender Vonu es probarlo con una duda real:
            un mensaje, una web, una factura, un contrato o una decisión que no
            tienes clara.
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
      <ResourceSignup page="como-funciona" />
      <HomeFooter />
    </main>
  );
}