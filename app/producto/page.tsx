import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Producto — VonuAI",
  description:
    "VonuAI analiza URLs, capturas y mensajes sospechosos para ayudarte a detectar señales de fraude, phishing y suplantación antes de actuar.",
  alternates: {
    canonical: "/producto",
  },
  openGraph: {
    title: "Producto — VonuAI",
    description:
      "Comprueba señales de riesgo en URLs, capturas y mensajes antes de pagar, responder o compartir datos.",
    url: `${siteUrl}/producto`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Producto — VonuAI",
    description:
      "Detecta señales de fraude, phishing y suplantación antes de actuar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const pillars = [
  {
    number: "01",
    title: "Detecta señales",
    text: "Vonu revisa contexto, urgencia, identidad aparente, enlaces, dominios y patrones habituales de fraude sin convertir una sola señal en una sentencia.",
  },
  {
    number: "02",
    title: "Entiende el riesgo",
    text: "No te devuelve solo un semáforo. Te explica qué ha encontrado, qué pesa de verdad y qué parte sigue siendo incierta.",
  },
  {
    number: "03",
    title: "Actúa con criterio",
    text: "Recibes próximos pasos concretos: qué no hacer todavía, qué comprobar por otra vía y cómo reducir el riesgo antes de continuar.",
  },
];

const capabilities = [
  {
    eyebrow: "URL",
    title: "Webs y enlaces",
    text: "Dominios, redirecciones, HTTPS, formularios y señales visibles que merecen revisión antes de introducir datos o pagar.",
    href: "/comprobar-web-fiable",
    accent: "from-sky-400 to-cyan-300",
  },
  {
    eyebrow: "Captura",
    title: "Pantallas sospechosas",
    text: "SMS, WhatsApp, emails, perfiles, vendedores o pantallas de pago cuando lo importante está en una imagen.",
    href: "/analizar-captura-pantalla",
    accent: "from-violet-400 to-fuchsia-300",
  },
  {
    eyebrow: "Mensaje",
    title: "Texto y conversaciones",
    text: "Presión, urgencia, suplantación, peticiones extrañas y patrones típicos de ingeniería social antes de responder.",
    href: "/analizar-sms-estafa",
    accent: "from-emerald-400 to-cyan-300",
  },
  {
    eyebrow: "Identidad",
    title: "Perfiles falsos",
    text: "Señales que pueden indicar una identidad inventada, una cuenta clonada o una persona que no es quien dice ser.",
    href: "/detectar-perfil-falso",
    accent: "from-amber-300 to-orange-400",
  },
  {
    eyebrow: "Dinero",
    title: "Inversiones y cobros",
    text: "Promesas de rentabilidad, presión para transferir, facturas dudosas y situaciones donde equivocarse puede salir caro.",
    href: "/comprobar-inversion-estafa",
    accent: "from-lime-300 to-emerald-400",
  },
  {
    eyebrow: "Cripto",
    title: "Estafas cripto",
    text: "Wallets, oportunidades irreales, soportes falsos, recuperadores de fondos y mensajes diseñados para provocar una acción rápida.",
    href: "/estafas-criptomonedas",
    accent: "from-orange-400 to-rose-400",
  },
];

const principles = [
  "No certificamos que una web, persona o mensaje sea legítimo o fraudulento.",
  "No necesitas compartir contraseñas, códigos SMS ni datos bancarios completos.",
  "Diferenciamos señales observadas de conclusiones que no pueden demostrarse.",
  "Cuando el caso lo exige, recomendamos verificar por una segunda vía o acudir a un profesional.",
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
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3 19 6v5.1c0 4.6-2.9 8.2-7 9.9-4.1-1.7-7-5.3-7-9.9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8.8 12 2 2 4.5-4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UrlIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M9.7 14.3 14.3 9.7M8.1 16.7l-1.2 1.2a3.4 3.4 0 0 1-4.8-4.8l3.6-3.6a3.4 3.4 0 0 1 4.8 0M15.9 7.3l1.2-1.2a3.4 3.4 0 0 1 4.8 4.8l-3.6 3.6a3.4 3.4 0 0 1-4.8 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m5.5 17 4.2-4 3.1 2.7 2.3-2 3.4 3.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M5 5.5h14v10H9l-4 3v-13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/producto#webpage`,
    url: `${siteUrl}/producto`,
    name: "Producto — VonuAI",
    description:
      "VonuAI analiza URLs, capturas y mensajes sospechosos para detectar señales de fraude, phishing y suplantación antes de actuar.",
    inLanguage: "es-ES",
    isPartOf: {
      "@type": "WebSite",
      name: "VonuAI",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-180px] -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[120px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[320px] -z-10 h-[480px] w-[480px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <h1 className="mx-auto max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">
              Antes de actuar,
              <span className="block text-slate-400">
                entiende qué tienes <GradientText>delante.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">
              Vonu analiza URLs, capturas y mensajes sospechosos para separar señales reales de ruido y ayudarte a decidir qué comprobar antes de pagar, responder o compartir datos.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/es/check"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[14px] font-semibold text-[#0b0e17] shadow-[0_14px_40px_rgba(255,255,255,0.10)] transition hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
              >
                Probar Vonu Check
                <ArrowIcon />
              </Link>
              <Link
                href="/casos-de-uso"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.07] active:translate-y-0"
              >
                Ver casos de uso
              </Link>
            </div>

            <div className="mx-auto mt-8 flex max-w-[720px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-slate-500">
              <span>Sin registro</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Primer análisis gratuito</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>No certifica legitimidad</span>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[1040px] sm:mt-18">
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] shadow-[0_35px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[11px] font-medium tracking-[0.06em] text-slate-500">VONU CHECK</span>
              </div>

              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <div className="grid grid-cols-3 border-b border-white/[0.07] text-[12px] font-semibold text-slate-500 sm:text-[13px]">
                    <div className="flex items-center justify-center gap-2 border-b-2 border-sky-400 px-2 pb-4 text-slate-100">
                      <UrlIcon /> <span>Enlace</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-2 pb-4">
                      <CaptureIcon /> <span>Captura</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-2 pb-4">
                      <MessageIcon /> <span>Mensaje</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#070a11] px-4 py-4 text-left text-[14px] text-slate-500 shadow-inner">
                    https://ejemplo.com/enlace-sospechoso
                  </div>

                  <button
                    type="button"
                    className="mt-4 h-12 w-full rounded-xl bg-emerald-400 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:bg-emerald-300 active:scale-[.99]"
                  >
                    Analizar ahora
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                    Ejemplo visual · El análisis real se realiza en Vonu Check.
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Resultado</p>
                      <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.045em] text-white sm:text-[30px]">Precaución antes de continuar</h2>
                    </div>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.09] px-3 py-1.5 text-[11px] font-semibold text-amber-200">62 / 100</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {["Dominio reciente o poco establecido", "La urgencia del mensaje merece verificación", "No hay evidencia suficiente para certificar fraude"].map((item, index) => (
                      <div key={item} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3.5 text-left text-[13px] leading-6 text-slate-300">
                        <span className={index === 2 ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-500" : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-300"} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-left text-[13px] leading-6 text-slate-500">
                    Siguiente paso: entra por tu cuenta en la web oficial de la entidad y verifica la solicitud desde allí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-sky-300">Qué hace Vonu</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Menos intuición.
              <span className="block text-slate-500">Más señales útiles.</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pillars.map((item) => (
              <article key={item.number} className="group min-h-[300px] rounded-[26px] border border-white/[0.07] bg-white/[0.035] p-6 transition hover:border-white/[0.12] hover:bg-white/[0.05] sm:p-7">
                <p className="text-[12px] font-semibold text-sky-300">{item.number}</p>
                <h3 className="mt-14 text-[30px] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[34px]">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-7 text-slate-400 sm:text-[15px]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.06] bg-[#080b12]">
        <div className="pointer-events-none absolute left-[-220px] top-[180px] h-[420px] w-[420px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Qué puede revisar</p>
              <h2 className="mt-4 max-w-[680px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
                Un único punto de entrada para <GradientText>muchas dudas.</GradientText>
              </h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">
              El formato cambia, pero la pregunta es la misma: ¿hay algo aquí que debería comprobar antes de confiar?
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-[260px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${item.accent}`} />
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{item.eyebrow}</p>
                <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.045em] text-white">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.text}</p>
                <span className="absolute bottom-6 right-6 grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400 transition group-hover:border-white/[0.14] group-hover:text-white">
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Uso responsable</p>
            <h2 className="mt-4 max-w-[580px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
              Útil porque también sabe decir <GradientText>“no lo sé”.</GradientText>
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">
              Un producto de seguridad no debería fingir certeza. Vonu está diseñado para mostrar límites, separar hechos de inferencias y recomendar comprobaciones adicionales cuando hacen falta.
            </p>
          </div>

          <div className="grid gap-3">
            {principles.map((item) => (
              <div key={item} className="flex gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5 text-[14px] leading-7 text-slate-300 sm:text-[15px]">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.05] text-emerald-300">
              <ShieldIcon />
            </div>
            <h2 className="mt-7 text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">
              Si algo no te cuadra,
              <span className="block text-slate-500">compruébalo antes de confiar.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-8 text-slate-400">
              Una URL, una captura o un mensaje bastan para empezar. Vonu te ayuda a revisar señales de riesgo antes de que la urgencia decida por ti.
            </p>
            <Link
              href="/es/check"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300 active:translate-y-0"
            >
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
