import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Casos de uso — Vonu",
  description:
    "Casos reales para usar Vonu: familiares que piden dinero desde otro número, bancos que piden códigos, phishing, tiendas sospechosas, perfiles falsos, inversiones y enlaces dudosos.",
  alternates: { canonical: "/casos-de-uso" },
  openGraph: {
    title: "Casos de uso — Vonu",
    description: "Comprueba señales antes de pagar, responder, abrir un enlace o compartir datos.",
    url: `${siteUrl}/casos-de-uso`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casos de uso — Vonu",
    description: "Situaciones reales donde comprobar antes de confiar puede evitar un problema.",
  },
  robots: { index: true, follow: true },
};

const mainCases = [
  {
    eyebrow: "Familiares y WhatsApp",
    title: "“Mamá, este es mi nuevo número. Necesito un Bizum.”",
    text: "Un número nuevo, una identidad familiar, urgencia, dinero y excusas para no llamar forman una combinación que merece verificación independiente.",
    href: "/analizar-sms-estafa",
  },
  {
    eyebrow: "Suplantación bancaria",
    title: "“Te llamamos del banco. Dime el código SMS.”",
    text: "Códigos de un solo uso, presión y una identidad bancaria aparente son señales críticas. Comprueba antes de entregar cualquier código o clave.",
    href: "/llamada-banco-codigo-sms",
  },
  {
    eyebrow: "Paquetería y phishing",
    title: "“Tu paquete está retenido. Paga 1,99 € aquí.”",
    text: "Pequeños pagos, enlaces externos y urgencia se utilizan a menudo para robar credenciales o datos de tarjeta.",
    href: "/analizar-link-sospechoso",
  },
  {
    eyebrow: "Compras online",
    title: "Una tienda desconocida con una oferta demasiado buena",
    text: "Revisa dominio, antigüedad, formularios, métodos de pago, identidad y otras señales antes de introducir tarjeta o hacer una transferencia.",
    href: "/comprobar-tienda-online",
  },
  {
    eyebrow: "Marketplaces",
    title: "Un vendedor quiere sacar el pago fuera de la plataforma",
    text: "Excusas sobre fallos de la plataforma, enlaces externos, pagos directos o peticiones de datos pueden eliminar las protecciones del marketplace.",
    href: "/es-fiable",
  },
  {
    eyebrow: "Inversiones",
    title: "Rentabilidad garantizada y presión para entrar hoy",
    text: "Promesas poco realistas, urgencia, pagos en cripto y supuestos expertos o gestores son señales que conviene revisar juntas.",
    href: "/comprobar-inversion-estafa",
  },
  {
    eyebrow: "Perfiles y relaciones",
    title: "Una persona gana confianza y después pide dinero",
    text: "Identidad difícil de verificar, historias urgentes, bloqueo de videollamadas y peticiones económicas pueden formar un patrón de fraude afectivo.",
    href: "/detectar-perfil-falso",
  },
  {
    eyebrow: "Email y trabajo",
    title: "Un correo urgente pide cambiar una nómina o una cuenta bancaria",
    text: "Comprueba remitente, dominio, petición, urgencia y cualquier cambio de datos de pago mediante un canal independiente antes de ejecutarlo.",
    href: "/email-sospechoso-estafa",
  },
];

const moments = [
  "Antes de abrir un enlace que no esperabas.",
  "Antes de enviar dinero por Bizum, transferencia o cripto.",
  "Antes de compartir un código SMS, contraseña o dato bancario.",
  "Antes de pagar en una tienda que no conoces.",
  "Antes de seguir instrucciones de un supuesto banco o soporte.",
  "Antes de confiar en una identidad que no puedes verificar.",
  "Antes de sacar una conversación o pago fuera de una plataforma.",
  "Cuando la urgencia intenta impedirte comprobar.",
];

const faqs = [
  {
    q: "¿Vonu solo reconoce estafas conocidas?",
    a: "No. Utiliza patrones conocidos como contexto, pero también analiza señales observables y combinaciones de riesgo para detectar variantes nuevas.",
  },
  {
    q: "¿Puedo analizar un mensaje que parece normal?",
    a: "Sí. Muchas estafas empiezan con lenguaje cotidiano. El riesgo suele aparecer al combinar identidad aparente, nuevo número, petición de dinero, urgencia o bloqueo de una verificación independiente.",
  },
  {
    q: "¿Pedir un Bizum significa que es fraude?",
    a: "No. Un Bizum o una transferencia pueden ser totalmente legítimos. Vonu intenta valorar el contexto y la combinación de señales en lugar de tratar una sola palabra como prueba.",
  },
  {
    q: "¿Qué hago si el resultado es alto?",
    a: "Detén la acción sensible y verifica por otro canal. No envíes dinero, códigos ni credenciales hasta confirmar quién está detrás y por qué te lo pide.",
  },
  {
    q: "¿Y si el resultado es bajo?",
    a: "No lo interpretes como una garantía. Si hay algo extraño fuera del contenido analizado, como un cambio inesperado de cuenta o un remitente nuevo, verifica igualmente.",
  },
];

function GradientText({ children }: { children: ReactNode }) {
  return <span className="inline" style={{ backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>{children}</span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M5 12h13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function CasosDeUsoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${siteUrl}/casos-de-uso#webpage`, url: `${siteUrl}/casos-de-uso`, name: "Casos de uso de Vonu", description: "Situaciones reales para comprobar señales de fraude antes de actuar.", inLanguage: "es-ES" },
      { "@type": "FAQPage", "@id": `${siteUrl}/casos-de-uso#faq`, mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
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
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Casos de uso</p>
            <h1 className="mx-auto mt-5 max-w-[1050px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">La estafa cambia.<span className="block text-slate-400">Las señales dejan <GradientText>pistas.</GradientText></span></h1>
            <p className="mx-auto mt-7 max-w-[800px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">Vonu está pensado para el momento anterior a una acción difícil de deshacer: pagar, compartir un código, introducir datos o confiar en una identidad.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href="/es/check" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d]">Analizar ahora <ArrowIcon /></a><Link href="/como-funciona" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200">Cómo funciona</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {mainCases.map((item) => (
              <Link key={item.title} href={item.href} className="group rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{item.eyebrow}</p>
                <h2 className="mt-7 max-w-[560px] text-[30px] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-[34px]">{item.title}</h2>
                <p className="mt-4 max-w-[600px] text-[14px] leading-7 text-slate-400">{item.text}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-300 transition group-hover:text-emerald-300">Ver comprobación <ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">El momento importante</p><h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Antes, no después.</h2><p className="mt-5 max-w-[480px] text-[15px] leading-8 text-slate-400">Vonu tiene más valor antes de que una acción sensible sea irreversible.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{moments.map((moment) => <div key={moment} className="flex items-start gap-3 rounded-[18px] border border-white/[0.07] bg-white/[0.03] px-4 py-4 text-[14px] leading-6 text-slate-300"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>{moment}</div>)}</div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Preguntas frecuentes</p><h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Contexto antes que etiquetas.</h2></div>
          <div className="mt-10 space-y-3">{faqs.map((item) => <details key={item.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4"><summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-5"><span className="text-[17px] font-semibold text-slate-100 sm:text-[19px]">{item.q}</span><span className="text-[30px] font-light text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span></div></summary><p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p></details>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#080b12]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8"><h2 className="mx-auto max-w-[900px] text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">Si algo te hace dudar, compruébalo antes de confiar.</h2><a href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d]">Abrir Vonu Check <ArrowIcon /></a></div>
      </section>

      <HomeFooter />
    </main>
  );
}
