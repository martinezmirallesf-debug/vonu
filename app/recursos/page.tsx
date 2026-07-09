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

function ResourceTitle({ title }: { title: string }) {
  if (title.includes("SMS")) {
    return (
      <>
        SMS puede ser una <GradientText tone="orangeRed">estafa</GradientText>
      </>
    );
  }

  if (title.includes("web es fiable")) {
    return (
      <>
        Comprobar si una web es <GradientText tone="blueCyan">fiable</GradientText>
      </>
    );
  }

  if (title.includes("firmar un contrato")) {
    return (
      <>
        Antes de firmar un <GradientText tone="purplePink">contrato</GradientText>
      </>
    );
  }

  if (title.includes("banco")) {
    return (
      <>
        Banco y código <GradientText tone="orangeRed">SMS</GradientText>
      </>
    );
  }

  if (title.includes("criptomonedas")) {
    return (
      <>
        Estafas con <GradientText tone="green">criptomonedas</GradientText>
      </>
    );
  }

  if (title.includes("Email")) {
    return (
      <>
        Email sospechoso o <GradientText tone="orangeRed">phishing</GradientText>
      </>
    );
  }

  if (title.includes("factura")) {
    return (
      <>
        Comprobar una <GradientText tone="amberOrange">factura</GradientText>
      </>
    );
  }

  if (title.includes("manipulación")) {
    return (
      <>
        Detectar <GradientText tone="purplePink">manipulación</GradientText>
      </>
    );
  }

  if (title.includes("tienda online")) {
    return (
      <>
        Tienda online <GradientText tone="blueCyan">fiable</GradientText>
      </>
    );
  }

  if (title.includes("captura")) {
    return (
      <>
        Analizar <GradientText tone="blueGreen">captura</GradientText>
      </>
    );
  }

  if (title.includes("perfil falso")) {
    return (
      <>
        Detectar perfil <GradientText tone="orangeRed">falso</GradientText>
      </>
    );
  }

  if (title.includes("alquiler")) {
    return (
      <>
        Contrato de <GradientText tone="purplePink">alquiler</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

function CategoryTitle({ title }: { title: string }) {
  if (title === "Seguridad digital") {
    return (
      <>
        Seguridad <GradientText tone="blueCyan">digital</GradientText>
      </>
    );
  }

  if (title === "Documentos y contratos") {
    return (
      <>
        Documentos y <GradientText tone="purplePink">contratos</GradientText>
      </>
    );
  }

  if (title === "Voz y producto") {
    return (
      <>
        Voz y <GradientText tone="blueGreen">producto</GradientText>
      </>
    );
  }

  if (title === "Tutor y estudio") {
    return (
      <>
        Tutor y <GradientText tone="green">estudio</GradientText>
      </>
    );
  }

  if (title === "Psicología aplicada") {
    return (
      <>
        Psicología <GradientText tone="amberOrange">aplicada</GradientText>
      </>
    );
  }

  if (title === "Uso responsable") {
    return (
      <>
        Uso <GradientText tone="blueCyan">responsable</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function RecursosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/recursos#webpage`,
        url: `${siteUrl}/recursos`,
        name: "Recursos Vonu — Guías, avances y decisiones seguras",
        description:
          "Guías prácticas, avances de producto y recursos para usar VonuAI con más claridad.",
        inLanguage: "es-ES",
        isPartOf: {
          "@type": "WebSite",
          name: "VonuAI",
          url: siteUrl,
        },
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
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative overflow-hidden bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1080px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[118px]">
              Guías y avances
              <span className="block text-zinc-500">
                para decidir <GradientText tone="blueGreen">mejor.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Recursos prácticos sobre seguridad digital, documentos, estudio,
              voz, IA responsable y nuevas formas de usar Vonu con claridad.
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
                href="#guias"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                Ver guías
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-5 sm:p-7">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Seguridad
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em] text-zinc-950">
                      Estafas
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-600">
                      SMS, email, llamadas, webs, tiendas y perfiles falsos.
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-zinc-950 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                      Decisiones
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em]">
                      Claridad
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-300">
                      Contratos, facturas, manipulación y próximos pasos.
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Producto
                    </p>
                    <p className="mt-4 text-[38px] font-semibold leading-none tracking-[-0.07em] text-zinc-950">
                      Vonu
                    </p>
                    <p className="mt-4 text-[15px] leading-7 text-zinc-600">
                      Guías, avances y formas de usarlo mejor.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center text-[12px] leading-6 text-zinc-500">
                  Un centro vivo para revisar antes de firmar, pagar, contestar o decidir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="guias" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Destacados
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Primeras guías
                <span className="block text-zinc-500">
                  para revisar antes de <GradientText tone="blueCyan">actuar.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              Empezamos por las dudas más comunes: mensajes raros, webs poco
              claras, llamadas urgentes y documentos que conviene entender antes
              de aceptar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredResources.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[340px] flex-col rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  {item.category}
                </p>

                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <ResourceTitle title={item.title} />
                </h3>

                <p className="mt-5 flex-1 text-[15.5px] leading-7 text-zinc-600">
                  {item.text}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-zinc-950">
                  Ver recurso
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Explorar
            </p>

            <h2 className="mt-3 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
              No solo seguridad.
              <span className="block text-zinc-500">
                También <GradientText tone="purplePink">claridad.</GradientText>
              </span>
            </h2>

            <p className="mt-5 text-[17px] leading-8 text-zinc-600">
              Vonu no se queda en detectar estafas. También ayuda a entender,
              estudiar, revisar documentos y preparar mejores decisiones.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => (
              <article
                key={item.title}
                className="min-h-[240px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]"
              >
                <h3 className="mt-8 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <CategoryTitle title={item.title} />
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
              Próximamente
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Un centro vivo
              <span className="block text-zinc-400">
                de guías, producto y <GradientText tone="blueGreen">seguridad.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Esta sección crecerá con nuevas guías, actualizaciones, ejemplos
              prácticos y recursos para usar Vonu mejor.
            </p>
          </div>

          <div className="grid gap-4">
            {upcoming.map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[30px] border border-white/10 bg-white/[0.06] p-6 text-[15.5px] leading-7 text-zinc-200 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <span className="shrink-0 text-white">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResourceSignup page="recursos" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            ¿Tienes una duda real ahora?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Abre Vonu, pega el mensaje, sube el archivo o explica la situación.
            Lo importante es revisar antes de actuar.
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