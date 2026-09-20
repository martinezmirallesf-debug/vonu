import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";
import { legalAlternates } from "@/lib/vonu-legal/routes";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Política de privacidad — Vonu",
  description: "Política de privacidad de Vonu: análisis con IA, identificador técnico de dispositivo, pagos, proveedores, conservación y derechos.",
  alternates: { canonical: "/legal/privacidad", languages: legalAlternates("privacy") },
  openGraph: {
    title: "Política de privacidad — Vonu",
    description: "Cómo trata Vonu el contenido enviado, el identificador técnico del dispositivo y los datos de pago necesarios.",
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
    <main className="min-h-screen bg-[#0d101b] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <LegalPage locale="es" title="Política de privacidad" description="Información sobre el tratamiento de datos personales, contenido y acceso por dispositivo en Vonu." updatedAt="Última actualización: 20 de septiembre de 2026">
        <h2>1. Responsable del tratamiento</h2>
        <p>
          El responsable del tratamiento es <strong>Francisco Luis Martínez Miralles</strong>, titular de Vonu y del dominio vonuai.com.
        </p>
        <ul>
          <li><strong>NIF:</strong> 74235561W</li>
          <li><strong>Domicilio de contacto:</strong> Calle Velarde, 55, 03203 Elche, Alicante, España</li>
          <li><strong>Email general:</strong> hello@vonuai.com</li>
          <li><strong>Email de privacidad:</strong> privacy@vonuai.com</li>
        </ul>

        <h2>2. Qué datos puede tratar Vonu</h2>
        <p>Dependiendo de la función que utilices, podemos tratar:</p>
        <ul>
          <li><strong>Contenido de una comprobación:</strong> texto, mensajes, capturas o imágenes, URL, documentos PDF, el texto extraído de esos documentos y los datos que contengan.</li>
          <li><strong>Datos técnicos de análisis:</strong> tipo de comprobación, señales detectadas, puntuación de riesgo, tiempos de respuesta, estado técnico de una URL y datos públicos del dominio.</li>
          <li><strong>Identificador técnico del dispositivo:</strong> un UUID aleatorio pseudónimo asociado al navegador o dispositivo para controlar el análisis gratuito y los análisis comprados. No contiene tu nombre, email ni el contenido analizado.</li>
          <li><strong>Estado de uso:</strong> si el análisis gratuito ya se utilizó, número de análisis restantes y contador agregado de análisis realizados por ese identificador.</li>
          <li><strong>Contacto:</strong> nombre, email, motivo y mensaje cuando utilizas el formulario de contacto.</li>
          <li><strong>Newsletter o recursos:</strong> email, página de origen y fuente del alta cuando solicitas recibir recursos o novedades.</li>
          <li><strong>Pagos:</strong> identificador de sesión de Stripe, importe, moneda, estado del pago, identificador de Payment Intent y, cuando Stripe lo recoja, datos de contacto o facturación necesarios para la compra. Vonu no necesita almacenar el número completo de tu tarjeta.</li>
          <li><strong>Medición agregada:</strong> páginas visitadas, eventos de producto y datos técnicos agregados mediante herramientas de analítica respetuosas con la privacidad.</li>
        </ul>

        <h2>3. Finalidades y bases jurídicas</h2>
        <p>Tratamos los datos, según el caso, para:</p>
        <ul>
          <li>prestar la comprobación solicitada y mostrar el resultado;</li>
          <li>recordar de forma técnica si un navegador o dispositivo ha usado el análisis gratuito y qué saldo comprado conserva;</li>
          <li>procesar compras puntuales de packs y resolver incidencias de pago;</li>
          <li>responder a mensajes de contacto;</li>
          <li>enviar recursos o novedades cuando lo hayas solicitado;</li>
          <li>mantener la seguridad, prevenir abusos y diagnosticar errores;</li>
          <li>medir de forma agregada el funcionamiento y uso del producto;</li>
          <li>cumplir obligaciones legales, contables o fiscales cuando proceda.</li>
        </ul>
        <p>
          Las bases jurídicas pueden ser la ejecución del servicio o de medidas precontractuales, la ejecución de la compra solicitada, tu consentimiento, el cumplimiento de obligaciones legales y, cuando proceda y tras valorar los derechos de los usuarios, el interés legítimo en proteger y mejorar el servicio.
        </p>

        <h2>4. Análisis con inteligencia artificial</h2>
        <p>
          Las comprobaciones de texto, imagen o documento PDF pueden requerir que el contenido o el texto extraído se procese mediante proveedores de modelos de inteligencia artificial. Actualmente la infraestructura de Vonu puede utilizar servicios de <strong>OpenAI</strong> y <strong>Google Gemini</strong>, según la función y configuración activa.
        </p>
        <p>
          Vonu pide a estos sistemas una evaluación estructurada de señales de riesgo o puntos de revisión y aplica después reglas propias de calibración. En documentos, el sistema puede extraer partes, importes, fechas, cláusulas y referencias de jurisdicción para ayudar a organizar la revisión. La puntuación es un índice orientativo y no una probabilidad de fraude, una certificación de autenticidad, un dictamen jurídico ni una decisión con efectos jurídicos sobre el usuario.
        </p>

        <h2>5. Comprobación técnica de enlaces y webs</h2>
        <p>
          Cuando introduces una URL, Vonu puede solicitar la página desde su infraestructura para revisar señales técnicas como HTTPS, redirecciones, formularios o determinados patrones visibles. El servidor del sitio analizado puede recibir datos técnicos propios de esa conexión, pero no necesita recibir tu identificador técnico de Vonu.
        </p>
        <p>
          Para algunas comprobaciones de reputación o antigüedad, la URL o el dominio pueden consultarse mediante servicios externos como <strong>URLhaus de abuse.ch</strong> y servicios públicos de <strong>RDAP</strong>. Por este motivo, evita incluir en la URL tokens, contraseñas o parámetros secretos que no sean necesarios para el análisis.
        </p>

        <h2>6. Acceso sin cuenta</h2>
        <p>
          Vonu Check está diseñado para poder usarse sin crear una cuenta. El identificador técnico del dispositivo se genera aleatoriamente y se guarda mediante una cookie de primera parte llamada <strong>vonu_device_id</strong>. La base de datos conserva el estado mínimo asociado a ese identificador para aplicar el límite gratuito y los créditos comprados.
        </p>
        <p>
          No utilizamos este identificador para intentar averiguar tu identidad real. Si eliminas la cookie, utilizas navegación privada o cambias de navegador o dispositivo, podemos dejar de reconocer el saldo anterior.
        </p>

        <h2>7. Pagos con Stripe</h2>
        <p>
          El pack de 3 análisis se procesa mediante <strong>Stripe</strong>. Vonu envía a Stripe el identificador técnico del dispositivo y metadatos mínimos de la operación para poder conceder los créditos al pago confirmado. Stripe puede recoger un email u otros datos necesarios para el recibo, prevención de fraude y pago.
        </p>
        <p>
          Al recibir una confirmación firmada de Stripe, Vonu registra de forma idempotente la sesión de Checkout y añade los créditos al identificador correspondiente. No almacenamos el número completo de la tarjeta.
        </p>

        <h2>8. Proveedores</h2>
        <p>Según las funciones activas, Vonu utiliza categorías de proveedores como:</p>
        <ul>
          <li><strong>Vercel:</strong> alojamiento, ejecución y analítica web agregada.</li>
          <li><strong>Supabase:</strong> base de datos y funciones de backend.</li>
          <li><strong>OpenAI y Google:</strong> procesamiento mediante modelos de IA.</li>
          <li><strong>Stripe:</strong> pagos puntuales, recibos y prevención de fraude en la operación de pago.</li>
          <li><strong>Resend:</strong> entrega de mensajes relacionados con el formulario de contacto.</li>
          <li><strong>abuse.ch/URLhaus y servicios RDAP:</strong> inteligencia técnica y datos públicos de dominios para determinadas comprobaciones de URL.</li>
        </ul>
        <p>
          Cuando un proveedor actúe como encargado del tratamiento, se utilizará para las funciones necesarias del servicio y bajo las condiciones y garantías aplicables.
        </p>

        <h2>9. Transferencias internacionales</h2>
        <p>
          Algunos proveedores tecnológicos pueden tratar datos fuera del Espacio Económico Europeo. Cuando resulte aplicable, dichas transferencias deberán apoyarse en los mecanismos reconocidos por la normativa de protección de datos, como decisiones de adecuación o cláusulas contractuales tipo.
        </p>

        <h2>10. Conservación</h2>
        <p>
          Conservamos los datos solo durante el tiempo necesario para la finalidad correspondiente y para atender obligaciones legales o posibles responsabilidades.
        </p>
        <ul>
          <li>La cookie técnica de dispositivo tiene una duración máxima aproximada de un año salvo que la elimines antes.</li>
          <li>El estado del identificador técnico y los créditos se conserva mientras sea necesario para reconocer el uso gratuito, mantener saldo comprado, atender incidencias y prevenir abuso razonable.</li>
          <li>Los registros de compras y facturación se conservan durante los plazos exigidos por la normativa aplicable.</li>
          <li>Los datos de contacto se conservan mientras sea necesario atender y documentar la solicitud.</li>
          <li>El email de recursos se conserva hasta que solicites la baja o deje de ser necesario para esa finalidad.</li>
          <li>El contenido enviado a una comprobación —incluidos documentos PDF y su texto extraído— se procesa para generar el resultado. No se envía como contenido bruto a la analítica de producto. Si una función operativa de seguridad o calidad conserva un informe derivado o enmascarado, se limitará a la finalidad para la que esté activada y deberá evitar secretos o datos innecesarios.</li>
        </ul>

        <h2>11. Analítica y eventos de producto</h2>
        <p>
          Utilizamos Vercel Web Analytics y eventos de producto para conocer de forma agregada el uso del servicio. La medición puede incluir páginas visitadas, procedencia, país o región aproximada, tipo de navegador o dispositivo y eventos como modo de análisis, idioma, categoría técnica, nivel o banda de riesgo, duración, éxito o error.
        </p>
        <p>
          No enviamos intencionadamente el texto del mensaje, la imagen o captura, el contenido o texto extraído de un PDF, el email del usuario ni la URL completa analizada como propiedad de esos eventos. En la configuración pública actual no utilizamos Google Analytics ni cookies publicitarias.
        </p>

        <h2>12. Datos sensibles y de terceros</h2>
        <p>
          No compartas contraseñas, códigos de verificación u OTP, PIN, números completos de tarjeta, credenciales bancarias, documentos identificativos completos, datos médicos innecesarios ni otra información especialmente sensible si no es imprescindible. Si una captura o documento contiene datos personales de terceros que no son necesarios para la revisión, ocúltalos o elimina esas páginas antes de subirlo.
        </p>
        <p>
          Si introduces datos de otra persona, eres responsable de contar con una base legítima para hacerlo y de limitar la información a lo estrictamente necesario.
        </p>

        <h2>13. Menores</h2>
        <p>
          Vonu no pretende recopilar de forma consciente datos personales innecesarios de menores. Cuando un menor utilice el servicio deberá existir la supervisión o autorización que corresponda conforme a la normativa aplicable. No deben subirse datos íntimos, identificativos o especialmente sensibles de un menor que no sean necesarios para la comprobación, y los menores no deben realizar compras sin la autorización legalmente exigible.
        </p>

        <h2>14. Tus derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación, supresión, portabilidad, limitación u oposición cuando proceda, y retirar un consentimiento sin que ello afecte a la licitud del tratamiento previo. Escribe a <strong>privacy@vonuai.com</strong> indicando tu solicitud y la información necesaria para localizar los datos afectados. Si la solicitud se refiere a una compra sin cuenta, puede ser necesario aportar el recibo o identificador de la operación para poder localizarla.
        </p>
        <p>
          También puedes presentar una reclamación ante la Agencia Española de Protección de Datos u otra autoridad de control competente.
        </p>

        <h2>15. Seguridad y cambios</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger la información y reducir el acceso no autorizado, pérdida o uso indebido. Ningún sistema conectado a Internet puede garantizar seguridad absoluta.
        </p>
        <p>
          Esta política puede actualizarse cuando cambien el producto, sus proveedores, las categorías de analítica o la normativa. La fecha de la versión vigente aparecerá en la parte superior.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
