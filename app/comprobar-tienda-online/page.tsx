import Link from "next/link";
import type { Metadata } from "next";
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

            <h1 className="mx-auto max-w-5xl text-[50px] font-semibold leading-[0.94] tracking-[-0.075em] text-zinc-950 sm:text-[76px] lg:text-[104px]">
              Cómo saber si una tienda online es fiable.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Antes de comprar en una tienda que no conoces, revisa precios,
datos legales, métodos de pago, reseñas, devoluciones y señales de
alerta. Esta guía te ayuda a comprobar la fiabilidad de una tienda
online antes de meter tarjeta o compartir tus datos.
            </p>

            <div className="mt-8 flex justify-center">
  <Link
    href={chatHref}
    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(26,115,232,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
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
          <div className="rounded-[38px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Respuesta rápida
                </p>

                <h2 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                  Antes de pagar, mira quién está detrás.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Una tienda puede parecer profesional y aun así no ser segura.
                  Lo importante es comprobar si hay empresa real, forma de
                  reclamar, métodos de pago protegidos y condiciones claras.
                </p>
              </div>

              <div className="grid gap-3">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-[24px] border border-zinc-200 bg-[#f8f9fa] p-5 text-[15.5px] leading-7 text-zinc-700"
                  >
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
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

      <section id="senales" className="bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Señales de alerta
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                Pistas de una tienda online poco fiable.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No se trata de desconfiar de todo. Se trata de comprobar lo básico
              antes de meter tarjeta, datos personales o hacer una transferencia.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
              <article
                key={item.title}
                className="min-h-[280px] rounded-[34px] border border-zinc-200 bg-[#f8f9fa] p-6 shadow-sm"
              >
                <h3 className="text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title}
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

            <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-[64px]">
              Muchas tiendas dudosas siguen el mismo patrón.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Productos atractivos, precio irresistible, urgencia y métodos de
              pago con poca protección. Ahí conviene parar y revisar.
            </p>
          </div>

          <div className="grid gap-3">
            {commonCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5"
              >
                <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-[15.5px] leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Errores a evitar
              </p>

              <h2 className="mt-3 max-w-3xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
                El diseño bonito no es una garantía.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Una tienda falsa puede tener fotos buenas, textos cuidados y
                aspecto profesional. La confianza se comprueba en los detalles.
              </p>
            </div>

            <div className="grid gap-3">
              {mistakes.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 text-[15.5px] leading-7 text-zinc-700 shadow-sm"
                >
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-zinc-950" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Preguntas frecuentes
            </p>

            <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-zinc-950 sm:text-[58px]">
              Dudas habituales sobre tiendas online
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[26px] border border-zinc-200 bg-[#f8f9fa] p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none text-[18px] font-semibold tracking-[-0.025em] text-zinc-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{faq.q}</span>
                    <span className="text-zinc-400 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-3 text-[15.5px] leading-7 text-zinc-600">
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
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de comprar, comprueba la tienda.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el enlace, explica qué producto quieres comprar o sube una
            captura. Vonu te ayuda a revisar señales antes de pagar o compartir
            datos.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
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