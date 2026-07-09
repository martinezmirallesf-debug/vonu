import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

const storeExample =
  "Ahora te voy a pasar una tienda online para comprobar si parece fiable antes de comprar o meter mis datos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo saber si una tienda online es fiable — Compruébala con VonuAI",
  description:
    "Aprende cómo saber si una tienda online es fiable o confiable antes de comprar: datos legales, métodos de pago, precios sospechosos, reseñas, devoluciones y señales de estafa.",
  alternates: {
    canonical: "/comprobar-tienda-online",
  },
  openGraph: {
    title: "Cómo saber si una tienda online es fiable — VonuAI",
    description:
      "Revisa una tienda online antes de pagar o introducir tus datos. Detecta señales de riesgo, precios sospechosos y métodos de pago poco seguros.",
    url: `${siteUrl}/comprobar-tienda-online`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo saber si una tienda online es fiable — VonuAI",
    description:
      "Comprueba tiendas online sospechosas antes de comprar, pagar o compartir datos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Precios demasiado bajos",
    text: "Si el producto cuesta mucho menos que en tiendas conocidas, conviene revisar si la oferta tiene sentido o si busca que compres rápido.",
  },
  {
    title: "No hay datos claros de empresa",
    text: "Una tienda fiable debería mostrar información legal, contacto real, condiciones, devoluciones, privacidad y datos básicos del vendedor.",
  },
  {
    title: "Solo permite pagos poco seguros",
    text: "Desconfía si solo acepta transferencia, Bizum a particulares, criptomonedas o métodos difíciles de reclamar.",
  },
  {
    title: "Reseñas extrañas o inexistentes",
    text: "Opiniones perfectas, repetidas, genéricas o solo dentro de la propia tienda pueden no ser suficientes para confiar.",
  },
  {
    title: "Urgencia artificial",
    text: "Contadores, últimas unidades, descuentos que terminan ya o mensajes de presión pueden buscar que no revises con calma.",
  },
  {
    title: "Política de devoluciones confusa",
    text: "Antes de comprar, revisa cómo devolver, quién paga el envío, plazos, garantías y si existe una vía real de reclamación.",
  },
];

const checklist = [
  "Busca el nombre de la tienda fuera de su propia web.",
  "Revisa aviso legal, contacto, política de devoluciones y privacidad.",
  "Comprueba si el método de pago permite reclamar si algo sale mal.",
  "Desconfía de precios demasiado buenos para ser verdad.",
  "Mira si las reseñas existen también en sitios externos.",
  "Pega la tienda en Vonu para revisar señales antes de comprar.",
];

const commonCases = [
  {
    title: "Ropa o zapatillas con descuentos enormes",
    text: "Tiendas que prometen productos de marcas conocidas con rebajas muy agresivas y stock limitado.",
  },
  {
    title: "Tecnología muy barata",
    text: "Móviles, consolas, auriculares o dispositivos con precios muy por debajo del mercado.",
  },
  {
    title: "Tienda creada desde un anuncio",
    text: "Páginas que llegan desde anuncios, redes sociales o mensajes y no tienen historial claro.",
  },
  {
    title: "Pago fuera de la web",
    text: "Vendedores que te llevan a transferencia, Bizum, mensajes privados o métodos sin protección.",
  },
];

const mistakes = [
  "Comprar solo porque la web parece bonita.",
  "Confiar en el candado HTTPS como prueba de que la tienda es fiable.",
  "No revisar quién está detrás de la tienda.",
  "Pagar por transferencia sin tener garantías.",
  "No guardar capturas, pedido, justificante y condiciones de compra.",
];

const faqs = [
  {
    q: "¿Cómo saber si una tienda online es fiable?",
    a: "Revisa si tiene datos legales claros, contacto real, política de devoluciones, métodos de pago seguros, opiniones externas y precios coherentes. Si hay descuentos exagerados, urgencia o solo aceptan transferencia, conviene desconfiar.",
  },
  {
    q: "¿Una tienda con HTTPS es segura?",
    a: "No necesariamente. El candado HTTPS solo indica que la conexión está cifrada. No garantiza que la tienda sea legítima ni que vaya a enviar el producto.",
  },
  {
    q: "¿Qué método de pago es más seguro en una tienda online?",
    a: "Suelen ser más recomendables los métodos que permiten reclamar o disputar un cargo. Si una tienda solo acepta transferencia, Bizum a particulares o métodos sin protección, revisa muy bien antes de pagar.",
  },
  {
    q: "¿Puedo comprobar una tienda online con VonuAI?",
    a: "Sí. Puedes pegar el enlace o explicar lo que ves en la tienda para que Vonu revise señales de riesgo, métodos de pago, datos legales, urgencia y qué comprobar antes de comprar.",
  },
  {
    q: "¿Qué hago si ya he comprado en una tienda sospechosa?",
    a: "Guarda capturas, justificantes, emails y condiciones de compra. Contacta con tu banco si has pagado con tarjeta, revisa si puedes reclamar y cambia contraseñas si has usado datos que también utilizas en otros servicios.",
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
  if (title === "Precios demasiado bajos") {
    return (
      <>
        Precios demasiado
        <span className="block">
          <GradientText tone="orangeRed">bajos</GradientText>
        </span>
      </>
    );
  }

  if (title === "No hay datos claros de empresa") {
    return (
      <>
        No hay datos claros
        <span className="block">
          de <GradientText tone="blueCyan">empresa</GradientText>
        </span>
      </>
    );
  }

  if (title === "Solo permite pagos poco seguros") {
    return (
      <>
        Solo permite pagos
        <span className="block">
          poco <GradientText tone="amberOrange">seguros</GradientText>
        </span>
      </>
    );
  }

  if (title === "Reseñas extrañas o inexistentes") {
    return (
      <>
        Reseñas extrañas
        <span className="block">
          o <GradientText tone="purplePink">inexistentes</GradientText>
        </span>
      </>
    );
  }

  if (title === "Urgencia artificial") {
    return (
      <>
        Urgencia <GradientText tone="orangeRed">artificial</GradientText>
      </>
    );
  }

  if (title === "Política de devoluciones confusa") {
    return (
      <>
        Devoluciones
        <span className="block">
          <GradientText tone="green">confusas</GradientText>
        </span>
      </>
    );
  }

  return <>{title}</>;
}

function CommonCaseTitle({ title }: { title: string }) {
  if (title === "Ropa o zapatillas con descuentos enormes") {
    return (
      <>
        Ropa o zapatillas con{" "}
        <GradientText tone="orangeRed">descuentos enormes</GradientText>
      </>
    );
  }

  if (title === "Tecnología muy barata") {
    return (
      <>
        Tecnología muy <GradientText tone="blueCyan">barata</GradientText>
      </>
    );
  }

  if (title === "Tienda creada desde un anuncio") {
    return (
      <>
        Tienda creada desde un{" "}
        <GradientText tone="purplePink">anuncio</GradientText>
      </>
    );
  }

  if (title === "Pago fuera de la web") {
    return (
      <>
        Pago fuera de la <GradientText tone="amberOrange">web</GradientText>
      </>
    );
  }

  return <>{title}</>;
}

export default function ComprobarTiendaOnlinePage() {
  const chatHref = `/chat?example=${encodeURIComponent(storeExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/comprobar-tienda-online#webpage`,
        url: `${siteUrl}/comprobar-tienda-online`,
        name: "Cómo saber si una tienda online es fiable",
        description:
          "Guía para revisar tiendas online antes de comprar: precios, datos legales, métodos de pago, reseñas, devoluciones y señales de alerta.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/comprobar-tienda-online#faq`,
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
            <h1 className="mx-auto max-w-[1080px] text-[54px] font-semibold leading-[0.92] tracking-[-0.078em] text-zinc-950 sm:text-[86px] lg:text-[118px]">
              Comprueba una{" "}
              <GradientText tone="blueGreen">tienda online.</GradientText>
              <span className="block text-zinc-500">Antes de meter tarjeta.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de comprar en una tienda que no conoces, revisa precios,
              datos legales, métodos de pago, reseñas, devoluciones y señales de
              alerta.
            </p>

            <div className="mt-7 flex flex-row justify-center gap-2.5 sm:mt-9 sm:gap-3">
              <Link
                href={chatHref}
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(26,115,232,0.24)] transition hover:scale-[1.02] active:scale-[0.99] sm:flex-none sm:gap-2 sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="truncate">Comprobar tienda</span>
                <ArrowIcon />
              </Link>

              <a
                href="#senales"
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-3 text-[14px] font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:flex-none sm:px-7 sm:py-3.5 sm:text-[15px]"
              >
                <span className="sm:hidden">Ver señales</span>
                <span className="hidden sm:inline">Ver qué revisar</span>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
            <div className="rounded-[38px] border border-zinc-200 bg-white p-3 shadow-[0_2px_5px_rgba(0,0,0,0.04),0_28px_80px_rgba(0,0,0,0.12)]">
              <div className="rounded-[30px] bg-[#f5f5f7] p-4 sm:p-6">
                <div className="mb-6 flex justify-end">
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-500 shadow-sm">
                    Tienda revisada
                  </span>
                </div>

                <div className="mx-auto max-w-3xl">
                  <div className="ml-auto max-w-[88%] rounded-[26px] bg-[#e9edf1] px-5 py-4 text-left text-[16px] leading-7 text-zinc-900 sm:max-w-[78%]">
                    He visto una tienda con zapatillas muy rebajadas. La web parece
                    bonita, pero solo aceptan transferencia. ¿La revisas antes de comprar?
                  </div>

                  <div className="mt-7 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                      <span className="h-3.5 w-3.5 rounded-full bg-orange-400" />
                    </div>

                    <div className="text-[17px] leading-8 text-zinc-900">
                      <p className="text-[28px] font-semibold leading-[1.05] tracking-[-0.055em] text-zinc-950 sm:text-[38px]">
                        Yo no pagaría todavía. Precio muy bajo + transferencia es una combinación delicada.
                      </p>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Lo que revisaría:
                        </p>

                        <ul className="mt-3 space-y-3 text-zinc-700">
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si hay empresa real detrás y datos legales claros.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>Si las reseñas existen fuera de la propia tienda.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            <span>
                              Si el método de pago permite reclamar si no llega el pedido.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5">
                        <p className="font-semibold text-zinc-950">
                          Qué haría ahora:
                        </p>

                        <p className="mt-2 text-zinc-700">
                          Buscaría el dominio y el nombre de la tienda fuera de esa web.
                          Si no hay rastro claro o solo acepta transferencia, no compraría.
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
                        Pega una tienda o sube captura
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

                <h2 className="mt-4 text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                  Antes de pagar,
                  <span className="block text-zinc-500">
                    mira quién está <GradientText tone="blueGreen">detrás.</GradientText>
                  </span>
                </h2>

                <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                  Una tienda puede parecer profesional y aun así no ser segura.
                  Lo importante es comprobar si hay empresa real, forma de
                  reclamar, métodos de pago protegidos y condiciones claras.
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

      <section id="senales" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                Pistas de una tienda
                <span className="block text-zinc-500">
                  online <GradientText tone="orangeRed">poco fiable.</GradientText>
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No se trata de desconfiar de todo. Se trata de comprobar lo básico
              antes de meter tarjeta, datos personales o hacer una transferencia.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[320px] rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)] transition hover:-translate-y-1 hover:shadow-[0_2px_5px_rgba(0,0,0,0.045),0_24px_58px_rgba(0,0,0,0.075)]"
              >
                <h3 className="mt-12 text-[34px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
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
              Casos comunes
            </p>

            <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[72px]">
              Muchas tiendas dudosas
              <span className="block text-zinc-400">
                siguen el mismo <GradientText tone="blueCyan">patrón.</GradientText>
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Productos atractivos, precio irresistible, urgencia y métodos de
              pago con poca protección. Ahí conviene parar y revisar.
            </p>
          </div>

          <div className="grid gap-4">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.045em] text-white">
                  <CommonCaseTitle title={item.title} />
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

              <h2 className="mt-3 max-w-3xl text-[44px] font-semibold leading-[0.98] tracking-[-0.065em] text-zinc-950 sm:text-[72px]">
                El diseño bonito
                <span className="block text-zinc-500">
                  no es una <GradientText tone="purplePink">garantía.</GradientText>
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Una tienda falsa puede tener fotos buenas, textos cuidados y
                aspecto profesional. La confianza se comprueba en los detalles.
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
              <span className="block text-zinc-500">tiendas online</span>
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

      <ResourceSignup page="comprobar-tienda-online" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[48px] font-semibold leading-[0.98] tracking-[-0.064em] sm:text-[82px]">
            Antes de comprar, comprueba la tienda.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el enlace, explica qué producto quieres comprar o sube una
            captura. Vonu te ayuda a revisar señales antes de pagar o compartir
            datos.
          </p>

          <Link
            href={chatHref}
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Comprobar tienda con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}