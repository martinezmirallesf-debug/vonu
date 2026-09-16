import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cookies y almacenamiento local — Vonu",
  description:
    "Información sobre cookies, almacenamiento técnico y analítica en Vonu.",
  alternates: { canonical: "/legal/cookies" },
  openGraph: {
    title: "Cookies y almacenamiento local — Vonu",
    description: "Qué tecnologías de almacenamiento utiliza actualmente Vonu.",
    url: `${siteUrl}/legal/cookies`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/cookies#webpage`,
    url: `${siteUrl}/legal/cookies`,
    name: "Cookies y almacenamiento local — Vonu",
    description: "Información sobre cookies, almacenamiento técnico y analítica en Vonu.",
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "Vonu", url: siteUrl },
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[980px] text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Privacidad</p>
            <h1 className="mt-4 text-[50px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[82px]">Cookies y almacenamiento.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Una explicación concreta de la medición y el almacenamiento técnico que utiliza Vonu hoy.
            </p>
            <p className="mt-5 text-[13px] text-zinc-500">Última actualización: 16 de septiembre de 2026</p>
          </div>
        </div>
      </section>

      <LegalPage title="Cookies y almacenamiento local" description="Tecnologías técnicas y de medición utilizadas por Vonu.">
        <h2>1. Estado actual</h2>
        <p>
          En la versión pública actual, Vonu <strong>no utiliza Google Analytics ni cookies publicitarias</strong>. La medición principal se realiza mediante Vercel Web Analytics y eventos técnicos de producto.
        </p>
        <p>
          Según la documentación de Vercel, su Web Analytics no utiliza cookies para identificar visitantes y trabaja con datos agregados. Vonu no envía como propiedades de analítica el texto, la imagen o la URL que introduces para una comprobación, ni tu dirección de email.
        </p>

        <h2>2. Cookies y almacenamiento estrictamente necesarios</h2>
        <p>
          Algunas partes de la aplicación pueden necesitar almacenamiento técnico del navegador para mantener una sesión, conservar temporalmente el estado de una operación, evitar repetir eventos dentro de una misma sesión o aplicar medidas de seguridad.
        </p>
        <p>
          Este almacenamiento se utiliza para prestar funciones solicitadas por el usuario y no para crear perfiles publicitarios.
        </p>

        <h2>3. Analítica de Vercel</h2>
        <p>
          Utilizamos Vercel Web Analytics para conocer de forma agregada el uso de páginas y funciones, así como eventos como el inicio o finalización técnica de una comprobación. También podemos utilizar Vercel Speed Insights para medir rendimiento y experiencia técnica.
        </p>
        <p>
          Estas herramientas se configuran para evitar incluir intencionadamente contenido de las comprobaciones o identificadores directos del usuario en los eventos de producto.
        </p>

        <h2>4. Servicios externos</h2>
        <p>
          Cuando accedes voluntariamente a servicios externos, como una pasarela de pago, esos proveedores pueden utilizar sus propias cookies o tecnologías conforme a sus políticas. Por ejemplo, Stripe puede utilizar tecnologías necesarias para seguridad, prevención de fraude y ejecución del pago en sus propios dominios.
        </p>

        <h2>5. Si incorporamos cookies no necesarias</h2>
        <p>
          Si en el futuro activamos herramientas que requieran cookies o tecnologías no necesarias —por ejemplo, determinadas soluciones de publicidad o medición que exijan consentimiento— se mostrará un mecanismo para aceptar o rechazar esas categorías antes de activarlas cuando la normativa lo requiera.
        </p>
        <p>
          Las opciones de aceptar y rechazar se ofrecerán de forma clara y sin condicionar el acceso a las funciones que no dependan de esas tecnologías.
        </p>

        <h2>6. Control desde el navegador</h2>
        <p>
          Puedes consultar, bloquear o eliminar cookies y almacenamiento local desde la configuración de tu navegador. Eliminar almacenamiento estrictamente necesario puede cerrar sesiones o hacer que algunas funciones tengan que iniciarse de nuevo.
        </p>

        <h2>7. Cambios y contacto</h2>
        <p>
          Actualizaremos esta página si cambia la configuración de medición o se incorporan nuevas tecnologías de seguimiento. Para cualquier duda de privacidad puedes escribir a <strong>privacy@vonuai.com</strong>.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
