import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import ResourceSignup from "../components/ResourceSignup";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Recursos Vonu — Estafas, phishing y señales de riesgo",
  description:
    "Guías prácticas de Vonu para detectar phishing, suplantación, tiendas sospechosas, enlaces peligrosos, perfiles falsos, inversiones dudosas y otras señales de fraude.",
  alternates: { canonical: "/recursos" },
  openGraph: {
    title: "Recursos Vonu — Comprueba antes de confiar",
    description: "Guías prácticas para reconocer señales de fraude y verificar antes de pagar, responder o compartir datos.",
    url: `${siteUrl}/recursos`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recursos Vonu",
    description: "Guías para reconocer estafas, phishing, suplantación y riesgos digitales.",
  },
  robots: { index: true, follow: true },
};

const featuredResources = [
  { title: "¿Es fiable? Compruébalo antes de actuar", category: "Comprobación general", text: "Cuando una web, mensaje, perfil u oferta no termina de cuadrar, reúne las señales antes de tomar una decisión.", href: "/es-fiable" },
  { title: "Analizar un link sospechoso", category: "Enlaces", text: "Qué revisar en un enlace recibido por SMS, WhatsApp, email, redes o QR antes de abrirlo o introducir datos.", href: "/analizar-link-sospechoso" },
  { title: "Cómo saber si un SMS puede ser una estafa", category: "Mensajes", text: "Urgencia, suplantación, pagos, códigos y otros patrones que conviene comprobar antes de responder.", href: "/analizar-sms-estafa" },
  { title: "Email sospechoso o phishing", category: "Email", text: "Señales habituales en correos que imitan bancos, empresas, pagos, facturas o avisos urgentes.", href: "/email-sospechoso-estafa" },
  { title: "Cómo comprobar si una web es fiable", category: "Webs", text: "Dominio, formularios, redirecciones, reputación técnica y otras pistas que Vonu puede revisar antes de que confíes.", href: "/comprobar-web-fiable" },
  { title: "Cómo comprobar una tienda online", category: "Compras online", text: "Antes de pagar, revisa señales de identidad, dominio, métodos de pago, presión y coherencia de la tienda.", href: "/comprobar-tienda-online" },
  { title: "Analizar una captura de pantalla", category: "Capturas", text: "Sube una captura de un chat, SMS, perfil, web o pantalla de pago para revisar lo que se ve antes de actuar.", href: "/analizar-captura-pantalla" },
  { title: "Cómo detectar un perfil falso", category: "Identidad", text: "Revisa señales de cuentas clonadas, identidades inventadas, catfishing y conversaciones que intentan ganar confianza demasiado rápido.", href: "/detectar-perfil-falso" },
  { title: "Comprobar una inversión sospechosa", category: "Inversiones", text: "Promesas de rentabilidad, urgencia, plataformas raras, pagos en cripto y otras señales antes de enviar dinero.", href: "/comprobar-inversion-estafa" },
  { title: "Estafas con criptomonedas", category: "Cripto", text: "Oportunidades irreales, falsos soportes, recuperadores de fondos y presión para mover dinero o conectar una wallet.", href: "/estafas-criptomonedas" },
  { title: "El banco me pide un código SMS", category: "Suplantación bancaria", text: "Qué hacer cuando una llamada o mensaje que dice ser de tu banco te pide códigos, claves o una acción urgente.", href: "/llamada-banco-codigo-sms" },
];

const categories = [
  { title: "Mensajes y suplantación", text: "SMS, WhatsApp, email, llamadas, familiares, bancos y cuentas que intentan parecer otra persona o empresa." },
  { title: "Webs, enlaces y compras", text: "Dominios, tiendas, formularios, redirecciones, métodos de pago y señales técnicas antes de introducir datos." },
  { title: "Dinero e inversiones", text: "Transferencias, Bizum, cripto, promesas de rentabilidad y situaciones donde verificar antes puede evitar una pérdida." },
];

function GradientText({ children }: { children: ReactNode }) {
  return <span className="inline" style={{ backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>{children}</span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M5 12h13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function RecursosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${siteUrl}/recursos#webpage`, url: `${siteUrl}/recursos`, name: "Recursos Vonu", description: "Guías prácticas para detectar estafas, phishing, suplantación y señales de riesgo digital.", inLanguage: "es-ES" },
      { "@type": "ItemList", "@id": `${siteUrl}/recursos#resources`, itemListElement: featuredResources.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: `${siteUrl}${item.href}` })) },
    ],
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-190px] -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[120px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[300px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Recursos</p>
            <h1 className="mx-auto mt-5 max-w-[1020px] text-[50px] font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-[76px] sm:leading-[0.94] lg:text-[92px]">Aprende a revisar<span className="block text-slate-400">antes de <GradientText>confiar.</GradientText></span></h1>
            <p className="mx-auto mt-7 max-w-[780px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">Guías breves para reconocer señales de phishing, suplantación, tiendas sospechosas, inversiones dudosas y otras formas de fraude antes de pagar, responder o compartir datos.</p>
          </div>
          <div className="mx-auto mt-14 grid max-w-[1040px] gap-4 md:grid-cols-3">
            {categories.map((item) => <div key={item.title} className="min-h-[220px] rounded-[24px] border border-white/[0.07] bg-white/[0.035] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">Explora</p><h2 className="mt-10 text-[28px] font-semibold leading-[1.04] tracking-[-0.045em] text-white">{item.title}</h2><p className="mt-4 text-[14px] leading-7 text-slate-400">{item.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Guías destacadas</p><h2 className="mt-4 max-w-[700px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">Empieza por lo que tienes delante.</h2></div><p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">Cada guía explica qué señales importan, cuáles pueden ser inocentes y qué conviene verificar después.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredResources.map((item) => <Link key={item.href} href={item.href} className="group relative min-h-[285px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.05]"><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-300">{item.category}</p><h3 className="mt-8 max-w-[330px] text-[26px] font-semibold leading-[1.04] tracking-[-0.04em] text-white">{item.title}</h3><p className="mt-4 max-w-[350px] text-[14px] leading-7 text-slate-400">{item.text}</p><span className="absolute bottom-6 right-6 grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-400 transition group-hover:border-white/[0.14] group-hover:text-white"><ArrowIcon /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-sky-300">Una regla útil</p><h2 className="mt-5 text-[36px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">Verifica por otra vía.</h2><p className="mt-5 text-[15px] leading-8 text-slate-400">Si alguien dice ser tu banco, un familiar, una empresa o una plataforma y te pide dinero, códigos o datos, utiliza un canal que ya conocías o hayas obtenido de una fuente oficial.</p></div>
          <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Otra regla útil</p><h2 className="mt-5 text-[36px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">No compartas secretos para comprobarlos.</h2><p className="mt-5 text-[15px] leading-8 text-slate-400">No pegues contraseñas, OTP, PIN, claves de recuperación ni tarjetas completas. Normalmente basta con el mensaje, remitente, dominio, importe o fragmento relevante.</p></div>
        </div>
      </section>

      <ResourceSignup page="/recursos" locale="es" />

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8"><h2 className="mx-auto max-w-[900px] text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">¿Tienes algo sospechoso delante? Analízalo ahora.</h2><Link href="/es/check" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d]">Abrir Vonu Check <ArrowIcon /></Link></div>
      </section>

      <HomeFooter />
    </main>
  );
}
