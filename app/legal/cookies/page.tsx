import type { Metadata } from "next";
import type { ReactNode } from "react";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Política de cookies — VonuAI",
  description:
    "Política de cookies de VonuAI: qué son las cookies, qué tipos pueden utilizarse, cómo gestionarlas y cómo retirar el consentimiento.",
  alternates: {
    canonical: "/legal/cookies",
  },
  openGraph: {
    title: "Política de cookies — VonuAI",
    description:
      "Información sobre el uso de cookies y tecnologías similares en VonuAI.",
    url: `${siteUrl}/legal/cookies`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type GradientTone = "blueCyan" | "blueGreen" | "purplePink" | "amberOrange";

const gradientMap: Record<GradientTone, string> = {
  blueCyan: "linear-gradient(90deg, #1A73E8 0%, #06B6D4 100%)",
  blueGreen: "linear-gradient(90deg, #0A84FF 0%, #22C55E 100%)",
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

const cookieHighlights = [
  {
    title: "Cookies necesarias",
    tone: "blueCyan" as const,
    text: "Permiten que la web, la sesión, la seguridad y las funciones básicas funcionen correctamente.",
  },
  {
    title: "Preferencias y medición",
    tone: "blueGreen" as const,
    text: "Pueden ayudar a recordar ajustes y entender cómo se usa VonuAI para mejorar la experiencia.",
  },
  {
    title: "Control del usuario",
    tone: "purplePink" as const,
    text: "El usuario puede gestionar cookies desde el navegador y, cuando esté disponible, desde el panel de configuración.",
  },
];

export default function CookiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/cookies#webpage`,
    url: `${siteUrl}/legal/cookies`,
    name: "Política de cookies — VonuAI",
    description:
      "Política de cookies de VonuAI: qué son las cookies, qué tipos pueden utilizarse, cómo gestionarlas y cómo retirar el consentimiento.",
    inLanguage: "es-ES",
    isPartOf: {
      "@type": "WebSite",
      name: "VonuAI",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Legal
            </p>

            <h1 className="mx-auto mt-4 max-w-[1040px] text-[52px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Política de
              <span className="block text-zinc-500">
                <GradientText tone="amberOrange">cookies.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Información sobre el uso de cookies y tecnologías similares en
              VonuAI, qué tipos pueden utilizarse y cómo puedes gestionarlas.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 md:grid-cols-3">
            {cookieHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]"
              >
                <h2 className="text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  <GradientText tone={item.tone}>{item.title}</GradientText>
                </h2>

                <p className="mt-5 text-[15px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LegalPage
        title="Política de cookies"
        description="Información sobre el uso de cookies y tecnologías similares en VonuAI."
      >
        <h2>1. Qué son las cookies</h2>

        <p>
          Las cookies son pequeños archivos que se almacenan en el dispositivo
          del usuario cuando visita una página web. Pueden servir para recordar
          preferencias, mantener una sesión iniciada, mejorar la seguridad,
          medir el uso del sitio o personalizar determinadas funciones.
        </p>

        <p>
          Además de cookies, pueden utilizarse tecnologías similares como
          almacenamiento local, píxeles, identificadores técnicos o herramientas
          equivalentes.
        </p>

        <h2>2. Responsable del uso de cookies</h2>

        <p>
          El responsable de este sitio web y del uso de cookies propias es{" "}
          <strong>Francisco Luis Martínez Miralles</strong>, actuando bajo el
          nombre comercial <strong>VonuAI</strong>.
        </p>

        <ul>
          <li>
            <strong>Nombre comercial:</strong> VonuAI
          </li>
          <li>
            <strong>Email general:</strong> hello@vonuai.com
          </li>
          <li>
            <strong>Email privacidad:</strong> privacy@vonuai.com
          </li>
          <li>
            <strong>Dominios asociados:</strong> vonuai.com y sus subdominios
            asociados
          </li>
        </ul>

        <h2>3. Qué tipos de cookies pueden utilizarse</h2>

        <p>
          VonuAI puede utilizar cookies propias o de terceros según las funciones
          disponibles en cada momento. De forma general, las cookies pueden
          agruparse en estas categorías:
        </p>

        <h3>Cookies técnicas o necesarias</h3>

        <p>
          Son necesarias para que la web o la aplicación funcione correctamente.
          Pueden utilizarse para mantener una sesión, recordar ajustes básicos,
          proteger el servicio, prevenir abusos o permitir funciones solicitadas
          por el usuario.
        </p>

        <h3>Cookies de preferencias</h3>

        <p>
          Permiten recordar determinadas elecciones del usuario, como ajustes de
          interfaz, preferencias de uso o configuraciones que mejoran la
          experiencia.
        </p>

        <h3>Cookies de análisis o medición</h3>

        <p>
          Ayudan a entender cómo se utiliza la web, qué páginas se visitan, qué
          errores aparecen o qué partes del producto necesitan mejorar. Cuando no
          estén exceptuadas de consentimiento, se solicitará autorización antes
          de utilizarlas.
        </p>

        <h3>Cookies de marketing o publicidad</h3>

        <p>
          Pueden utilizarse para medir campañas, mostrar contenido relevante o
          analizar conversiones. Actualmente VonuAI no tiene como prioridad el
          uso de cookies publicitarias invasivas, pero si se incorporan en el
          futuro se informará y se solicitará el consentimiento cuando sea
          necesario.
        </p>

        <h2>4. Cookies propias y de terceros</h2>

        <p>
          Las cookies propias son gestionadas directamente por VonuAI. Las
          cookies de terceros son gestionadas por proveedores externos que pueden
          prestar servicios de infraestructura, autenticación, pagos, analítica,
          seguridad, correo electrónico, funcionalidades de IA o herramientas
          similares.
        </p>

        <p>
          Entre los proveedores que podrían intervenir en el funcionamiento de
          VonuAI se encuentran, según las funciones activas en cada momento,
          servicios como Supabase, Vercel, Stripe, Google Workspace, Resend,
          OpenAI u otros proveedores tecnológicos necesarios.
        </p>

        <h2>5. Consentimiento</h2>

        <p>
          Las cookies técnicas o necesarias pueden utilizarse sin consentimiento
          cuando sean imprescindibles para prestar el servicio solicitado por el
          usuario. Para cookies no necesarias, como determinadas cookies de
          análisis, marketing o publicidad, se solicitará consentimiento cuando
          la normativa lo exija.
        </p>

        <p>
          El usuario podrá aceptar, rechazar o configurar las cookies mediante
          las opciones disponibles en la web cuando se habilite el panel de
          gestión correspondiente.
        </p>

        <h2>6. Cómo cambiar o retirar el consentimiento</h2>

        <p>
          Cuando VonuAI incorpore un panel de configuración de cookies, podrás
          modificar o retirar tu consentimiento desde ese panel. También puedes
          bloquear o eliminar cookies desde la configuración de tu navegador.
        </p>

        <p>
          Ten en cuenta que bloquear ciertas cookies técnicas puede afectar al
          funcionamiento de la web o de algunas funciones de la aplicación.
        </p>

        <h2>7. Gestión de cookies desde el navegador</h2>

        <p>
          Los navegadores permiten bloquear, eliminar o limitar cookies desde sus
          ajustes de privacidad. Las opciones concretas dependen del navegador y
          del dispositivo utilizado.
        </p>

        <p>
          Puedes revisar la configuración de cookies en navegadores como Chrome,
          Safari, Firefox, Edge u otros desde sus propios menús de privacidad y
          seguridad.
        </p>

        <h2>8. Estado actual de cookies en VonuAI</h2>

        <p>
          VonuAI se encuentra en evolución. Actualmente pueden utilizarse cookies
          o tecnologías similares necesarias para el funcionamiento técnico de la
          web, la autenticación, la seguridad, el mantenimiento de sesión, la
          gestión de pagos, el análisis técnico del servicio o la mejora de la
          experiencia.
        </p>

        <p>
          A medida que se incorporen herramientas adicionales de analítica,
          medición, publicidad o personalización, esta política se actualizará y,
          cuando sea necesario, se habilitará un sistema de consentimiento y
          configuración.
        </p>

        <h2>9. Actualizaciones de esta política</h2>

        <p>
          VonuAI podrá actualizar esta política de cookies para adaptarla a
          cambios normativos, técnicos, operativos o de producto. La versión
          vigente será siempre la publicada en esta página.
        </p>

        <h2>10. Contacto</h2>

        <p>
          Para cualquier duda relacionada con esta política de cookies o con el
          tratamiento de datos personales, puedes escribir a{" "}
          <strong>privacy@vonuai.com</strong>.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}