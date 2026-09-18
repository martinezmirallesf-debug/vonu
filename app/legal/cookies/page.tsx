import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cookies y almacenamiento local — Vonu",
  description: "Información sobre cookies, identificación técnica del dispositivo, almacenamiento y analítica en Vonu.",
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
    description: "Información sobre cookies, identificación técnica del dispositivo, almacenamiento y analítica en Vonu.",
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
              Una explicación concreta del almacenamiento técnico que permite ofrecer el análisis gratuito y mantener los packs comprados sin crear una cuenta.
            </p>
            <p className="mt-5 text-[13px] text-zinc-500">Última actualización: 18 de septiembre de 2026</p>
          </div>
        </div>
      </section>

      <LegalPage locale="es" title="Cookies y almacenamiento local" description="Tecnologías técnicas y de medición utilizadas por Vonu.">
        <h2>1. Estado actual</h2>
        <p>
          En la versión pública actual, Vonu <strong>no utiliza Google Analytics ni cookies publicitarias</strong>. La medición principal se realiza mediante Vercel Web Analytics y eventos técnicos de producto.
        </p>
        <p>
          Vonu tampoco necesita una cuenta para utilizar Vonu Check. El control del análisis gratuito y de los análisis comprados se realiza mediante un identificador técnico pseudónimo del navegador o dispositivo.
        </p>

        <h2>2. Cookie técnica de dispositivo</h2>
        <p>
          Vonu utiliza una cookie estrictamente necesaria llamada <strong>vonu_device_id</strong>. Contiene un identificador aleatorio y no incluye tu nombre, email, documento de identidad ni el contenido que analizas.
        </p>
        <p>
          Esta cookie permite reconocer que ese navegador o dispositivo ya ha utilizado su análisis gratuito y mantener el saldo de análisis comprados. Se configura como cookie HTTP-only, segura y de primera parte, con una duración técnica máxima aproximada de un año salvo que la elimines antes.
        </p>

        <h2>3. Qué ocurre si borras el almacenamiento</h2>
        <p>
          Si borras cookies o datos del navegador, utilizas navegación privada, cambias de navegador o cambias de dispositivo, Vonu puede dejar de reconocer el identificador anterior. Esto puede hacer que el saldo comprado no aparezca automáticamente en el nuevo entorno.
        </p>
        <p>
          Si has realizado una compra, conserva el recibo de Stripe. Puede ayudarnos a localizar la operación si necesitas soporte.
        </p>

        <h2>4. Analítica de Vercel</h2>
        <p>
          Utilizamos Vercel Web Analytics para conocer de forma agregada páginas vistas, procedencia, país o región aproximada, navegador, sistema operativo, tipo de dispositivo y eventos técnicos o de producto. También podemos utilizar Vercel Speed Insights para medir rendimiento y experiencia técnica.
        </p>
        <p>
          Estas herramientas se configuran para evitar incluir intencionadamente el texto, la imagen o captura, el email del usuario o la URL completa introducida para una comprobación como propiedades de analítica.
        </p>

        <h2>5. Servicios externos</h2>
        <p>
          Cuando accedes voluntariamente a servicios externos, como la pasarela de pago de Stripe, esos proveedores pueden utilizar sus propias cookies o tecnologías conforme a sus políticas para seguridad, prevención de fraude y ejecución del pago.
        </p>

        <h2>6. Si incorporamos cookies no necesarias</h2>
        <p>
          Si en el futuro activamos herramientas que requieran cookies o tecnologías no necesarias —por ejemplo, determinadas soluciones de publicidad o medición que exijan consentimiento— se mostrará un mecanismo para aceptar o rechazar esas categorías antes de activarlas cuando la normativa lo requiera.
        </p>

        <h2>7. Control desde el navegador</h2>
        <p>
          Puedes consultar, bloquear o eliminar cookies y almacenamiento desde la configuración de tu navegador. Ten en cuenta que eliminar <strong>vonu_device_id</strong> puede impedir que Vonu reconozca el análisis gratuito ya utilizado o los créditos asociados a ese navegador.
        </p>

        <h2>8. Cambios y contacto</h2>
        <p>
          Actualizaremos esta página si cambia la configuración de medición o se incorporan nuevas tecnologías de seguimiento. Para cualquier duda de privacidad puedes escribir a <strong>privacy@vonuai.com</strong>.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
