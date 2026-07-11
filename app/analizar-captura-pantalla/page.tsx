import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

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

function RedXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UseCaseTitle({ title }: { title: string }) {
  if (title === "SMS o WhatsApp sospechoso") {
    return (
      <>
        SMS o WhatsApp <GradientText tone="orangeRed">sospechoso</GradientText>
      </>
    );
  }

  if (title === "Perfil de Tinder, Badoo o Instagram") {
    return (
      <>
        Perfil de <GradientText tone="purplePink">Tinder o Instagram</GradientText>
      </>
    );
  }

  if (title === "Tienda online o web rara") {
    return (
      <>
        Tienda online o <GradientText tone="blueGreen">web rara</GradientText>
      </>
    );
  }

  if (title === "Factura, recibo o cobro extraño") {
    return (
      <>
        Factura o <GradientText tone="amberOrange">cobro extraño</GradientText>
      </>
    );
  }

  if (title === "Contrato o cláusula") {
    return (
      <>
        Contrato o <GradientText tone="blueCyan">cláusula</GradientText>
      </>
    );
  }

  if (title === "Conversación con presión") {
    return (
      <>
        Conversación con <GradientText tone="orangeRed">presión</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function WarningTitle({ title }: { title: string }) {
  if (title === "Urgencia o miedo") {
    return (
      <>
        Urgencia o <GradientText tone="orangeRed">miedo</GradientText>
      </>
    );
  }

  if (title === "Dinero, inversión o cripto") {
    return (
      <>
        Dinero, inversión o <GradientText tone="green">cripto</GradientText>
      </>
    );
  }

  if (title === "Enlaces o dominios raros") {
    return (
      <>
        Enlaces o <GradientText tone="blueCyan">dominios raros</GradientText>
      </>
    );
  }

  if (title === "Capturas demasiado perfectas") {
    return (
      <>
        Capturas demasiado <GradientText tone="purplePink">perfectas</GradientText>
      </>
    );
  }

  if (title === "Datos que no cuadran") {
    return (
      <>
        Datos que <GradientText tone="amberOrange">no cuadran</GradientText>
      </>
    );
  }

  if (title === "Presión emocional") {
    return (
      <>
        Presión <GradientText tone="orangeRed">emocional</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function AnalizarCapturaPantallaPage() {

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
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1080px] text-[52px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Analiza{" "}
              <GradientText tone="blueCyan">capturas</GradientText>
              <span className="block text-zinc-500">antes de actuar.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Sube una captura de un SMS, WhatsApp, perfil, web, factura,
              contrato o conversación. Vonu te ayuda a revisar señales de riesgo
              antes de pagar, contestar, firmar o confiar.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Analizar captura</span>
                <ArrowIcon />
              </Link>

              <a
                href="#casos"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver casos</span>
                <span className="hidden sm:inline">Ver qué revisar</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Captura revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me ha llegado este SMS del banco con un enlace. Dice que me
                    bloquean la cuenta si no entro hoy. ¿Lo revisas?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no entraría desde ese enlace. Tiene señales claras de phishing.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que me hace dudar:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Hay urgencia: te empuja a actuar hoy.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Te pide entrar desde un enlace recibido por SMS.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Mezcla miedo, cuenta bancaria y acción inmediata.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          No pulsaría el enlace. Entraría manualmente en la app
                          oficial del banco o llamaría al número oficial. Guardaría
                          la captura por si hace falta reportarlo.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_13px_rgba(0,0,0,0.135),0_3px_8px_rgba(0,0,0,0.085)]">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full text-zinc-900">
                        <span className="text-[25px] leading-none">+</span>
                      </div>

                      <div className="min-w-0 flex-1 truncate whitespace-nowrap text-left text-[13.5px] text-zinc-400 sm:text-[16px]">
                        Sube una captura o pregunta algo
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <span className="text-[18px] font-semibold leading-none">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · No sustituye profesionales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[42px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Respuesta rápida
                </p>

                <h2 className="mt-4 text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Si dudas,
                  <span className="block text-zinc-500">
                    <GradientText tone="blueGreen">revisa antes</GradientText> de actuar.
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Una captura puede parecer normal, pero esconder señales de
                  urgencia, estafa, manipulación, suplantación, cobro raro o
                  presión. Lo importante es mirar el contexto antes de dar el
                  siguiente paso.
                </p>
              </div>

              <div className="grid gap-4">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-[30px] border border-zinc-200 bg-[#f5f5f7] p-5 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="shrink-0 text-zinc-950">
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

      <section id="casos" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Qué puedes revisar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Una captura
                <span className="block text-zinc-500">
                  puede <GradientText tone="purplePink">contar mucho.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Vonu no se limita a describir la imagen: analiza señales visibles,
              contexto, presión, dinero, enlaces, identidad y próximos pasos.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
                  <UseCaseTitle title={item.title} />
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              No todo lo sospechoso parece sospechoso al principio.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Muchos fraudes, perfiles falsos o mensajes manipuladores se
              apoyan en pequeños detalles: prisa, dinero, enlaces, miedo o
              confianza fabricada.
            </p>
          </div>

          <div className="grid gap-4">
            {warningSigns.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <WarningTitle title={item.title} />
                </h3>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Errores a evitar
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Una captura sola
                <span className="block text-zinc-500">
                  no siempre <GradientText tone="amberOrange">confirma todo.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Pero sí puede darte suficientes señales para decidir si conviene
                parar, comprobar por otro canal, guardar pruebas o pedir más
                contexto antes de avanzar.
              </p>
            </div>

            <div className="grid gap-4">
              {mistakes.map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[30px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)]"
                >
                  <span className="shrink-0 text-red-600">
                    <RedXIcon />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Preguntas frecuentes
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-[54px] font-semibold leading-[0.9] tracking-[-0.075em] text-zinc-950 sm:text-[82px]">
              Dudas sobre
              <span className="block text-zinc-500">analizar capturas</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_12px_30px_rgba(0,0,0,0.045)] transition hover:-translate-y-[2px] hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[20px] font-semibold leading-tight tracking-[-0.04em] text-zinc-950 sm:text-[24px]">
                      {faq.q}
                    </span>

                    <span className="text-[38px] font-light leading-none text-zinc-500 transition group-open:rotate-45 group-open:text-zinc-950 sm:text-[44px]">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-4 text-[15.5px] leading-7 text-zinc-600">
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
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de pagar, contestar o confiar, revisa la captura.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Sube la imagen, explica qué te preocupa y Vonu te ayuda a detectar
            señales de riesgo, entender el contexto y decidir el siguiente paso
            con más calma.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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