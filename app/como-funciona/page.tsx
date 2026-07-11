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
    id: "privacidad-patrones",
    label: "Privacidad y patrones",
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
      className="inline align-baseline"
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

function HelpBlockTitle({ title }: { title: string }) {
  if (title === "Primeros pasos") {
    return (
      <>
        Primeros <GradientText tone="blueCyan">pasos</GradientText>
      </>
    );
  }

  if (title === "Archivos y documentos") {
    return (
      <>
        Archivos y <GradientText tone="blueGreen">documentos</GradientText>
      </>
    );
  }

  if (title === "Voz y conversación") {
    return (
      <>
        Voz y <GradientText tone="purplePink">conversación</GradientText>
      </>
    );
  }

  if (title === "Planes y uso") {
    return (
      <>
        Planes y <GradientText tone="amberOrange">uso</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function SectionHeading({ id }: { id: string }) {
  if (id === "primeros-pasos") {
    return (
      <>
        Empieza con una
        <span className="block text-zinc-500">
          <GradientText tone="blueCyan">duda real.</GradientText>
        </span>
      </>
    );
  }

  if (id === "archivos") {
    return (
      <>
        Sube capturas, PDFs
        <span className="block text-zinc-500">
          y <GradientText tone="blueGreen">documentos.</GradientText>
        </span>
      </>
    );
  }

  if (id === "voz") {
    return (
      <>
        Habla cuando escribir
        <span className="block text-zinc-500">
          se queda <GradientText tone="purplePink">corto.</GradientText>
        </span>
      </>
    );
  }

  if (id === "planes") {
    return (
      <>
        Uso claro,
        <span className="block text-zinc-500">
          sin <GradientText tone="amberOrange">complicarte.</GradientText>
        </span>
      </>
    );
  }

  if (id === "privacidad-patrones") {
    return (
      <>
        Aprende de señales,
        <span className="block text-zinc-500">
          no de <GradientText tone="green">datos sensibles.</GradientText>
        </span>
      </>
    );
  }

  if (id === "limites") {
    return (
      <>
        Orientación responsable,
        <span className="block text-zinc-500">
          no <GradientText tone="orangeRed">sustitución profesional.</GradientText>
        </span>
      </>
    );
  }

  return null;
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
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1040px] text-[52px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Cómo funciona
              <span className="block text-zinc-500">
                <GradientText tone="blueCyan">VonuAI.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Entiende cómo Vonu analiza mensajes, archivos, voz y situaciones
              delicadas para ayudarte a decidir con más claridad.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Probar Vonu</span>
                <ArrowIcon />
              </Link>

              <a
                href="#primeros-pasos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver ayuda</span>
                <span className="hidden sm:inline">Ver cómo funciona</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
            {helpBlocks.map((block) => (
              <a
                key={block.title}
                href={block.href}
                className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h2 className="text-[28px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <HelpBlockTitle title={block.title} />
                </h2>

                <p className="mt-5 text-[15px] leading-7 text-zinc-600">
                  {block.text}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-[42px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14"
              >
                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                  <div>
                    <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                      {section.label}
                    </p>

                    <h2 className="mt-4 text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                      <SectionHeading id={section.id} />
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((item) => (
                      <details
                        key={item.q}
                        className="group rounded-[30px] border border-zinc-200 bg-[#f5f5f7] p-6 transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
                      >
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-[20px] font-semibold leading-tight tracking-[-0.04em] text-zinc-950 sm:text-[24px]">
                              {item.q}
                            </span>

                            <span className="text-[38px] font-light leading-none text-zinc-500 transition group-open:rotate-45 group-open:text-zinc-950 sm:text-[44px]">
                              +
                            </span>
                          </div>
                        </summary>

                        <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="como-funciona" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            ¿Tienes una situación concreta?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            La forma más rápida de entender Vonu es probarlo con una duda real:
            un mensaje, una web, una factura, un contrato o una decisión que no
            tienes clara.
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