import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

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

function WarningTitle({ title }: { title: string }) {
  if (title === "Te piden un código SMS") {
    return (
      <>
        Te piden un
        <span className="block">
          <GradientText tone="orangeRed">código SMS</GradientText>
        </span>
      </>
    );
  }

  if (title === "Dicen que hay un cargo urgente") {
    return (
      <>
        Dicen que hay
        <span className="block">
          un cargo <GradientText tone="amberOrange">urgente</GradientText>
        </span>
      </>
    );
  }

  if (title === "Insisten en que no cuelgues") {
    return (
      <>
        Insisten en que
        <span className="block">
          no <GradientText tone="purplePink">cuelgues</GradientText>
        </span>
      </>
    );
  }

  if (title === "Parecen saber datos tuyos") {
    return (
      <>
        Parecen saber
        <span className="block">
          datos <GradientText tone="blueCyan">tuyos</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te llevan a WhatsApp o a otra app") {
    return (
      <>
        Te llevan a WhatsApp
        <span className="block">
          o a otra <GradientText tone="green">app</GradientText>
        </span>
      </>
    );
  }

  if (title === "Te piden instalar algo") {
    return (
      <>
        Te piden instalar
        <span className="block">
          <GradientText tone="orangeRed">algo</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function ExampleTitle({ title }: { title: string }) {
  if (title.includes("cargo")) {
    return (
      <>
        “Hay un cargo <GradientText tone="orangeRed">sospechoso</GradientText>”
      </>
    );
  }

  if (title.includes("peligro")) {
    return (
      <>
        “Tu cuenta está en <GradientText tone="amberOrange">peligro</GradientText>”
      </>
    );
  }

  if (title.includes("seguridad")) {
    return (
      <>
        “Departamento de <GradientText tone="blueCyan">seguridad</GradientText>”
      </>
    );
  }

  if (title.includes("llamada")) {
    return (
      <>
        “Sigue conmigo en la <GradientText tone="purplePink">llamada</GradientText>”
      </>
    );
  }

  return <>{title}</>;
}

export default function LlamadaBancoCodigoSmsPage() {

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
              ¿Te llama el banco
              <span className="block text-zinc-500">
                y te pide un <GradientText tone="orangeRed">código SMS?</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si alguien te llama diciendo que es tu banco y te pide un código,
              una clave temporal o confirmar una operación, frena antes de
              actuar. Puede ser una señal clara de vishing.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href="/chat"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Revisar llamada</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver señales de vishing</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Llamada revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    Me han llamado diciendo que son del banco. Dicen que hay un
                    cargo raro y me piden el código SMS para bloquearlo.
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                      <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no daría ese código. Un banco no debería pedirte un SMS
                        para “bloquear” una operación por teléfono.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si te meten prisa para que no cuelgues.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si te piden códigos, claves, enlaces o acceso remoto.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si intentan impedir que compruebes desde la app o el teléfono oficial.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Colgaría. Entraría yo en la app oficial del banco o
                          llamaría al número oficial. Si ya has dado el código,
                          contactaría urgentemente con el banco.
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
                        Describe la llamada o pega el SMS
                      </div>

                      <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-white">
                        <span className="text-[18px] font-semibold leading-none">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[11.5px] text-zinc-500">
                    Orientación preventiva · Si ya has dado datos, contacta con tu banco.
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
                  No des
                  <span className="block text-zinc-500">
                    el <GradientText tone="orangeRed">código.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Un código SMS no es un simple dato. Puede servir para autorizar
                  una operación, cambiar acceso o confirmar algo que no entiendes
                  del todo. Si te lo piden por teléfono, lo prudente es parar.
                </p>
              </div>

              <div className="grid gap-4">
                {whatToDo.map((item) => (
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

      <section id="senales" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[1.06] tracking-[-0.058em] sm:leading-[0.98] sm:tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas típicas
                <span className="block text-zinc-500">
                  de una llamada falsa del <GradientText tone="blueCyan">banco.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Una llamada puede sonar profesional y aun así ser peligrosa. Lo
              importante no es solo quién dice llamar, sino qué te pide hacer.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-zinc-950">
                  <WarningTitle title={item.title} />
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

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Cambia el guion,
              <span className="block text-zinc-400">
                pero la <GradientText tone="orangeRed">presión se repite.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Los estafadores pueden cambiar el banco, el motivo o el número
              desde el que llaman. Pero suelen buscar lo mismo: que actúes rápido
              y compartas algo sensible.
            </p>
          </div>

          <div className="grid gap-4">
            {commonExamples.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">
                  <ExampleTitle title={item.title} />
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
                El error suele ser
                <span className="block text-zinc-500">
                  obedecer antes de <GradientText tone="purplePink">comprobar.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                En una llamada de este tipo, la mejor defensa es cortar la
                urgencia. No tienes que demostrar nada a quien te llama.
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
              <span className="block text-zinc-500">llamadas del banco</span>
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

      <ResourceSignup page="llamada-banco-codigo-sms" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de dar un código, revísalo.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Describe la llamada, pega el SMS o explica qué te han pedido. Vonu
            te ayuda a revisar señales de riesgo antes de compartir códigos,
            datos o dinero.
          </p>

          <Link
            href="/chat"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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