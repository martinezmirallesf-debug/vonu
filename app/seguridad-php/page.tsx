import Link from "next/link";
import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import InlineTrustAnalyzer from "../components/InlineTrustAnalyzer";

const siteUrl = "https://vonuai.com";
const pageUrl = `${siteUrl}/seguridad-php`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Seguridad PHP: cómo saber si una web puede ser vulnerable | Vonü",
  description: "¿Una web usa PHP vulnerable? Aprende qué puede comprobarse desde fuera, qué significa una vulnerabilidad PHP y analiza señales de riesgo con Vonü sin falsas garantías.",
  alternates: { canonical: "/seguridad-php" },
  openGraph: { title: "Seguridad PHP: qué puedes comprobar realmente | Vonü", description: "Entiende los riesgos de PHP y revisa señales visibles de una web sin confundir reputación con un escaneo de vulnerabilidades.", url: pageUrl, type: "article", siteName: "Vonü" },
  robots: { index: true, follow: true },
};

const questions = [
  { q: "¿Qué es PHP y por qué importa?", a: "PHP es una tecnología que utilizan muchas páginas para generar contenido y gestionar funciones. Como cualquier software, puede tener fallos de seguridad. Que una web use PHP no significa que sea peligrosa." },
  { q: "¿Vonü detecta si una web tiene PHP vulnerable?", a: "No. El analizador actual comprueba señales externas como conexión, redirecciones, dominio y coincidencias con una fuente de URLs asociadas a malware. No identifica de forma fiable la versión interna de PHP ni verifica vulnerabilidades del servidor." },
  { q: "¿Si no hay coincidencias de malware, la web es segura?", a: "No. Que una URL no aparezca en la fuente consultada no descarta ataques, fraudes, phishing ni fallos internos del servidor." },
  { q: "¿Cómo puedo saber qué versión de PHP utiliza mi web?", a: "Si administras la web, revisa el panel de alojamiento, la configuración del servidor o consulta a tu proveedor técnico. No expongas archivos de diagnóstico al público." },
  { q: "¿Qué hago si mi web utiliza una versión vulnerable?", a: "Pide a tu administrador o proveedor que contraste los avisos oficiales, actualice PHP y sus dependencias, revise extensiones y aplicaciones, haga copias de seguridad y compruebe el funcionamiento tras actualizar." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: "Seguridad PHP: cómo saber si una web puede ser vulnerable", description: "Guía sobre PHP, riesgos y límites de las comprobaciones externas.", inLanguage: "es-ES", dateModified: "2026-10-22" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Vonü", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Seguridad PHP", item: pageUrl }] },
    { "@type": "FAQPage", mainEntity: questions.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
  ],
};

export default function SeguridadPhpPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />
      <section className="px-4 pb-12 pt-14 text-center sm:pb-20 sm:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1a73e8]">Seguridad web · Guía práctica</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.98] tracking-[-0.07em]">Seguridad <span className="text-[#1a73e8]">PHP.</span><span className="mt-2 block text-zinc-500">¿Es vulnerable una web?</span></h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-600">Una página puede parecer normal y tener problemas técnicos que no se ven. Te explicamos qué significa una vulnerabilidad de PHP, qué se puede revisar y qué no debemos dar por seguro.</p>
        <Link href="#analizador" className="mt-8 inline-flex rounded-full bg-[#1a73e8] px-8 py-4 font-semibold text-white shadow-lg">Analizar señales de una web ↓</Link>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-500">Vonü no realiza un escaneo de vulnerabilidades PHP. El análisis revisa señales externas y no certifica la seguridad del servidor.</p>
      </section>
      <section className="bg-[#080b12] px-4 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Lo que sí revisamos", body: "Conexión HTTPS, cambios de destino, respuesta de la página, información visible, antigüedad del dominio cuando está disponible y coincidencias con URLs de malware conocidas." },
              { title: "Lo que no podemos ver", body: "La versión real de PHP, las actualizaciones instaladas, los fallos internos del servidor o si una vulnerabilidad concreta puede explotarse." },
              { title: "Qué significa para ti", body: "No confundas una conexión cifrada ni una puntuación baja de fraude con una garantía de seguridad técnica. Si vas a pagar, comprueba también quién está detrás." },
            ].map((item) => <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7"><h2 className="text-xl font-semibold">{item.title}</h2><p className="mt-4 leading-7 text-slate-400">{item.body}</p></article>)}
          </div>
          <InlineTrustAnalyzer locale="es" intent="website" />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#1a73e8]">Sin tecnicismos</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Preguntas frecuentes sobre PHP y seguridad</h2>
        <div className="mt-10 space-y-4">
          {questions.map((item) => <article key={item.q} className="rounded-3xl border border-zinc-200 bg-white p-7"><h3 className="text-xl font-semibold">{item.q}</h3><p className="mt-3 leading-7 text-zinc-600">{item.a}</p></article>)}
        </div>
        <div className="mt-12 rounded-3xl bg-white p-8">
          <h2 className="text-2xl font-semibold">Fuentes oficiales para propietarios de webs</h2>
          <p className="mt-3 leading-7 text-zinc-600">Consulta los avisos de seguridad y las versiones soportadas antes de decidir si debes actualizar.</p>
          <div className="mt-5 flex flex-wrap gap-5 text-[#1a73e8] underline"><a href="https://www.php.net/supported-versions.php" rel="noopener noreferrer" target="_blank">Versiones soportadas de PHP</a><a href="https://www.php.net/security" rel="noopener noreferrer" target="_blank">Seguridad de PHP</a><a href="https://www.incibe.es/incibe-cert" rel="noopener noreferrer" target="_blank">INCIBE-CERT</a></div>
        </div>
      </section>
      <HomeFooter />
    </main>
  );
}
