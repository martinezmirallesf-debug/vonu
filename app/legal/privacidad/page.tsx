import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Política de privacidad — Vonu",
  description:
    "Política de privacidad de Vonu: datos tratados, análisis con IA, comprobación de enlaces, proveedores, conservación y derechos.",
  alternates: { canonical: "/legal/privacidad" },
  openGraph: {
    title: "Política de privacidad — Vonu",
    description: "Cómo trata Vonu los datos personales y el contenido enviado para análisis.",
    url: `${siteUrl}/legal/privacidad`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/privacidad#webpage`,
    url: `${siteUrl}/legal/privacidad`,
    name: "Política de privacidad — Vonu",
    description: "Cómo trata Vonu los datos personales y el contenido enviado para análisis.",
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
            <h1 className="mt-4 text-[50px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[82px]">Política de privacidad.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Qué recibe Vonu cuando haces una comprobación, para qué se utiliza y qué control tienes sobre tus datos.
            </p>
            <p className="mt-5 text-[13px] text-zinc-500">Última actualización: 16 de septiembre de 2026</p>
          </div>
        </div>
      </section>

      <LegalPage title="Política de privacidad" description="Información sobre el tratamiento de datos personales y contenido en Vonu.">
        <h2>1. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento es <strong>Francisco Luis Martínez Miralles</strong>, titular de Vonu y del dominio vonuai.com.
        </p>
        <ul>
          <li><strong>Domicilio de contacto:</strong> Calle Velarde, 55, 03203 Elche, Alicante, España</li>
          <li><strong>Email general:</strong> hello@vonuai.com</li>
          <li><strong>Email de privacidad:</strong> privacy@vonuai.com</li>
        </ul>

        <h2>2. Qué datos puede tratar Vonu</h2>
        <p>Dependiendo de la función que utilices, podemos tratar:</p>
        <ul>
          <li><strong>Contenido de una comprobación:</strong> texto, mensajes, capturas o imágenes, URL y los datos visibles que contengan.</li>
          <li><strong>Datos técnicos de análisis:</strong> tipo de comprobación, señales detectadas, puntuación de riesgo, tiempos de respuesta, estado técnico de una URL y datos públicos del dominio.</li>
          <li><strong>Datos de cuenta:</strong> identificador de usuario, email y datos necesarios para autenticación, plan y uso cuando utilizas una cuenta.</li>
          <li><strong>Contacto:</strong> nombre, email, motivo y mensaje cuando utilizas el formulario de contacto.</li>
          <li><strong>Newsletter o recursos:</strong> email, página de origen y fuente del alta cuando solicitas recibir recursos o novedades.</li>
          <li><strong>Pagos:</strong> identificadores de cliente, suscripción, plan, estado de pago y datos de facturación necesarios. Vonu no necesita almacenar el número completo de tu tarjeta.</li>
          <li><strong>Medición agregada:</strong> páginas visitadas, eventos de producto y datos técnicos agregados mediante herramientas de analítica respetuosas con la privacidad.</li>
        </ul>

        <h2>3. Finalidades y bases jurídicas</h2>
        <p>Tratamos los datos, según el caso, para:</p>
        <ul>
          <li>prestar la comprobación solicitada y mostrar el resultado;</li>
          <li>gestionar cuentas, límites, planes, suscripciones y soporte;</li>
          <li>responder a mensajes de contacto;</li>
          <li>enviar recursos o novedades cuando lo hayas solicitado;</li>
          <li>mantener la seguridad, prevenir abusos y diagnosticar errores;</li>
          <li>medir de forma agregada el funcionamiento y uso del producto;</li>
          <li>cumplir obligaciones legales, contables o fiscales cuando proceda.</li>
        </ul>
        <p>
          Las bases jurídicas pueden ser la ejecución del servicio o de medidas precontractuales, tu consentimiento, el cumplimiento de obligaciones legales y, cuando proceda y tras valorar los derechos de los usuarios, el interés legítimo en proteger y mejorar el servicio.
        </p>

        <h2>4. Análisis con inteligencia artificial</h2>
        <p>
          Las comprobaciones de texto o imagen pueden requerir que el contenido se procese mediante proveedores de modelos de inteligencia artificial. Actualmente la infraestructura de Vonu puede utilizar servicios de <strong>OpenAI</strong> y <strong>Google Gemini</strong>, según la función y configuración activa.
        </p>
        <p>
          Vonu pide a estos sistemas una evaluación estructurada de señales de riesgo y aplica después reglas propias de calibración. La puntuación final es un índice orientativo de riesgo, no una probabilidad de fraude ni una decisión con efectos jurídicos sobre el usuario.
        </p>

        <h2>5. Comprobación técnica de enlaces y webs</h2>
        <p>
          Cuando introduces una URL, Vonu puede solicitar la página desde su infraestructura para revisar señales técnicas como HTTPS, redirecciones, formularios o determinados patrones visibles. El servidor del sitio analizado puede recibir datos técnicos propios de esa conexión, pero no necesita recibir la identidad de tu cuenta de Vonu.
        </p>
        <p>
          Para algunas comprobaciones de reputación o antigüedad, la URL o el dominio pueden consultarse mediante servicios externos como <strong>URLhaus de abuse.ch</strong> y servicios públicos de <strong>RDAP</strong>. Por este motivo, evita incluir en la URL tokens, contraseñas o parámetros secretos que no sean necesarios para el análisis.
        </p>

        <h2>6. Proveedores</h2>
        <p>Según las funciones activas, Vonu utiliza categorías de proveedores como:</p>
        <ul>
          <li><strong>Vercel:</strong> alojamiento, ejecución y analítica web agregada.</li>
          <li><strong>Supabase:</strong> base de datos, autenticación y funciones de backend.</li>
          <li><strong>OpenAI y Google:</strong> procesamiento mediante modelos de IA.</li>
          <li><strong>Stripe:</strong> pagos y suscripciones cuando estén habilitados.</li>
          <li><strong>Resend:</strong> entrega de mensajes relacionados con el formulario de contacto.</li>
          <li><strong>abuse.ch/URLhaus y servicios RDAP:</strong> inteligencia técnica y datos públicos de dominios para determinadas comprobaciones de URL.</li>
        </ul>
        <p>
          Cuando un proveedor actúe como encargado del tratamiento, se utilizará para las funciones necesarias del servicio y bajo las condiciones y garantías aplicables.
        </p>

        <h2>7. Transferencias internacionales</h2>
        <p>
          Algunos proveedores tecnológicos pueden tratar datos fuera del Espacio Económico Europeo. Cuando resulte aplicable, dichas transferencias deberán apoyarse en los mecanismos reconocidos por la normativa de protección de datos, como decisiones de adecuación o cláusulas contractuales tipo.
        </p>

        <h2>8. Conservación</h2>
        <p>
          Conservamos los datos solo durante el tiempo necesario para la finalidad correspondiente y para atender obligaciones legales o posibles responsabilidades.
        </p>
        <ul>
          <li>Los datos de contacto se conservan mientras sea necesario atender y documentar la solicitud.</li>
          <li>El email de recursos se conserva hasta que solicites la baja o deje de ser necesario para esa finalidad.</li>
          <li>Los datos de cuenta se conservan mientras la cuenta esté activa y posteriormente durante los plazos legalmente necesarios.</li>
          <li>Los datos vinculados a pagos y facturación se conservan durante los plazos exigidos por la normativa aplicable.</li>
          <li>El contenido enviado a una comprobación se procesa para generar el resultado. Si una función concreta ofrece historial o guardado asociado a cuenta, se indicará en la propia función y quedará sujeto a esta política.</li>
        </ul>

        <h2>9. Analítica y eventos de producto</h2>
        <p>
          La web utiliza Vercel Web Analytics y eventos de producto para conocer de forma agregada qué páginas o funciones funcionan mejor. No enviamos el texto, la imagen, la URL analizada ni tu email como propiedad de esos eventos.
        </p>
        <p>
          En la configuración pública actual no utilizamos Google Analytics ni cookies publicitarias. Si esto cambia, se actualizará la información y se solicitará consentimiento cuando sea necesario.
        </p>

        <h2>10. Datos sensibles y de terceros</h2>
        <p>
          No compartas contraseñas, códigos de verificación, números completos de tarjeta, documentos identificativos completos, datos médicos innecesarios ni otra información especialmente sensible si no es imprescindible. Si una captura contiene datos ajenos al análisis, ocúltalos antes de subirla.
        </p>
        <p>
          Si introduces datos de otra persona, eres responsable de contar con una base legítima para hacerlo y de limitar la información a lo estrictamente necesario.
        </p>

        <h2>11. Tus derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación, supresión, portabilidad, limitación u oposición cuando proceda, y retirar un consentimiento sin que ello afecte a la licitud del tratamiento previo. Escribe a <strong>privacy@vonuai.com</strong> indicando tu solicitud y la información necesaria para identificar los datos afectados.
        </p>
        <p>
          También puedes presentar una reclamación ante la Agencia Española de Protección de Datos u otra autoridad de control competente.
        </p>

        <h2>12. Seguridad y cambios</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger la información y reducir el acceso no autorizado, pérdida o uso indebido. Ningún sistema conectado a Internet puede garantizar seguridad absoluta.
        </p>
        <p>
          Esta política puede actualizarse cuando cambien el producto, sus proveedores o la normativa. La fecha de la versión vigente aparecerá en la parte superior.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
