import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://app.vonuai.com";

const webExample =
  "Ahora te voy a pasar una web o enlace para comprobar si parece fiable antes de comprar o meter mis datos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cómo saber si una web es fiable — Compruébala con VonuAI",
  description:
    "Aprende a comprobar si una web o tienda online es fiable antes de comprar, pagar por transferencia o introducir tus datos. Analiza enlaces sospechosos con VonuAI.",
  alternates: {
    canonical: "/comprobar-web-fiable",
  },
  openGraph: {
    title: "Cómo saber si una web es fiable — VonuAI",
    description:
      "Revisa señales de riesgo en webs, tiendas online, ofertas demasiado buenas y páginas sospechosas antes de pagar.",
    url: `${siteUrl}/comprobar-web-fiable`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo saber si una web es fiable — VonuAI",
    description:
      "Comprueba una web sospechosa antes de comprar, pagar o compartir datos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warningSigns = [
  {
    title: "Descuento demasiado agresivo",
    text: "Ofertas con rebajas enormes, precios muy por debajo de lo normal o urgencia para comprar pueden ser una señal de riesgo.",
  },
  {
    title: "Pago con poca protección",
    text: "Si solo aceptan transferencia, Bizum a particulares, criptomonedas o métodos difíciles de reclamar, conviene frenar.",
  },
  {
    title: "Datos legales confusos",
    text: "Una tienda fiable debería mostrar información clara sobre empresa, contacto, política de devoluciones, privacidad y condiciones.",
  },
  {
    title: "Dominio extraño o reciente",
    text: "Dominios con nombres raros, errores, imitaciones de marcas o webs recién creadas pueden usarse para campañas de fraude.",
  },
  {
    title: "Opiniones poco naturales",
    text: "Muchas reseñas perfectas, repetidas, genéricas o sin rastro fuera de la propia web pueden estar fabricadas.",
  },
  {
    title: "Presión para decidir rápido",
    text: "Contadores, “últimas unidades”, mensajes de urgencia o amenazas de perder la oferta buscan que no compruebes con calma.",
  },
];

const checklist = [
  "Busca el nombre de la tienda fuera de su propia web.",
  "Comprueba si tiene datos fiscales, contacto real y política de devoluciones.",
  "Mira si el método de pago permite reclamar si algo sale mal.",
  "Revisa si el dominio parece imitar a otra marca conocida.",
  "Desconfía de precios demasiado buenos para ser verdad.",
  "Pega la web en Vonu para revisar señales antes de pagar.",
];

const commonCases = [
  {
    title: "Tienda con descuentos enormes",
    text: "Webs que venden ropa, zapatillas, tecnología o productos populares a precios imposibles durante poco tiempo.",
  },
  {
    title: "Pago solo por transferencia",
    text: "Tiendas o vendedores que evitan tarjeta, PayPal u otros métodos con protección para el comprador.",
  },
  {
    title: "Web parecida a una marca conocida",
    text: "Dominios que imitan nombres, logos o estética de marcas reales para parecer oficiales.",
  },
  {
  title: "Tienda de redes sociales o anuncio",
  text: "Páginas que llegan desde redes sociales, anuncios o mensajes directos y no tienen historial claro.",
},
];

const mistakes = [
  "Comprar solo porque la web tiene candado HTTPS.",
  "Confiar en una página porque aparece en un anuncio.",
  "Pagar por transferencia sin comprobar datos de la empresa.",
  "Fiarse solo de reseñas dentro de la propia tienda.",
  "Meter tarjeta o DNI antes de revisar quién está detrás.",
];

const faqs = [
  {
    q: "¿Cómo saber si una web es fiable?",
    a: "Revisa si tiene datos legales claros, contacto real, métodos de pago seguros, opiniones externas, política de devoluciones coherente y un dominio que no imite a otra marca. Si hay urgencia, descuentos exagerados o solo aceptan transferencia, conviene desconfiar.",
  },
  {
    q: "¿El candado HTTPS significa que una web es segura?",
    a: "No necesariamente. El candado indica que la conexión está cifrada, pero no garantiza que la tienda sea legítima ni que vaya a enviar el producto.",
  },
  {
    q: "¿Qué hago si una web solo acepta transferencia?",
    a: "Frena y revisa bien. La transferencia suele ofrecer menos protección que otros métodos de pago. Comprueba datos fiscales, opiniones externas, antigüedad del dominio y si hay formas reales de reclamar.",
  },
  {
    q: "¿Puedo analizar una web con VonuAI?",
    a: "Sí. Puedes pegar el enlace o explicar lo que ves en la web para que Vonu revise señales de riesgo, métodos de pago, urgencia, datos legales y qué comprobar antes de comprar.",
  },
  {
    q: "¿Qué hago si ya he comprado en una web sospechosa?",
    a: "Guarda capturas, justificantes y correos. Contacta con tu banco si has metido tarjeta o pagado, cambia contraseñas si reutilizaste alguna y revisa si puedes reclamar el cargo.",
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

export default function ComprobarWebFiablePage() {
  const chatHref = `/chat?example=${encodeURIComponent(webExample)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/comprobar-web-fiable#webpage`,
        url: `${siteUrl}/comprobar-web-fiable`,
        name: "Cómo saber si una web es fiable",
        description:
          "Guía para comprobar si una web o tienda online parece fiable antes de comprar, pagar o introducir datos.",
        inLanguage: "es-ES",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/comprobar-web-fiable#faq`,
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
              Cómo saber si una web es fiable.
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Si una tienda online tiene un descuento enorme, te pide pagar por
              transferencia o algo no termina de encajar, revisa la web antes de
              meter tus datos o comprar.
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
                  Si parece demasiado bueno, revísalo.
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-zinc-600">
                  Una web puede tener buen diseño, candado HTTPS y fotos
                  profesionales, pero seguir siendo poco fiable. Lo importante
                  es comprobar quién está detrás, cómo cobra y qué garantías da.
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
                Pistas de una web o tienda poco fiable.
              </h2>
            </div>

            <p className="max-w-md text-[17px] leading-8 text-zinc-600">
              No hay una sola prueba mágica. Lo útil es mirar varias señales
              juntas antes de pagar o introducir datos.
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
              Muchas webs dudosas siguen patrones parecidos.
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-300">
              Cambian los productos y el diseño, pero se repiten las prisas, los
              precios imposibles y los pagos con poca protección.
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
                El diseño bonito no garantiza que sea segura.
              </h2>

              <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
                Una web falsa puede parecer profesional. Por eso conviene mirar
                señales externas, métodos de pago y datos reales antes de actuar.
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
              Dudas habituales sobre webs fiables
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

      <ResourceSignup page="comprobar-web-fiable" />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[46px] font-semibold leading-[0.96] tracking-[-0.07em] sm:text-[74px]">
            Antes de comprar, comprueba la web.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-zinc-300">
            Pega el enlace, explica qué te pide la página o sube una captura.
            Vonu te ayuda a revisar señales de riesgo antes de pagar o compartir
            datos.
          </p>

          <Link
            href={chatHref}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-950 shadow-[0_14px_32px_rgba(255,255,255,0.12)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Comprobar web con Vonu
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}