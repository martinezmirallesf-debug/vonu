import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";
import { legalAlternates } from "@/lib/vonu-legal/routes";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Términos y condiciones — Vonu",
  description: "Términos de Vonu: uso del servicio, análisis gratuito por dispositivo, packs de análisis, pagos y límites de responsabilidad.",
  alternates: { canonical: "/legal/terminos", languages: legalAlternates("terms") },
  openGraph: {
    title: "Términos y condiciones — Vonu",
    description: "Condiciones generales de uso y compra de análisis en Vonu.",
    url: `${siteUrl}/legal/terminos`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/terminos#webpage`,
    url: `${siteUrl}/legal/terminos`,
    name: "Términos y condiciones — Vonu",
    description: "Condiciones generales de uso y compra de análisis en Vonu.",
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "Vonu", url: siteUrl },
  };

  return (
    <main className="min-h-screen bg-[#0d101b] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <LegalPage locale="es" title="Términos y condiciones" description="Condiciones generales para acceder y utilizar Vonu." updatedAt="Última actualización: 20 de septiembre de 2026">
        <h2>1. Titular y aceptación</h2>
        <p>
          Estos términos regulan el uso de <strong>Vonu</strong>, disponible en vonuai.com y prestado por <strong>Francisco Luis Martínez Miralles</strong>. Al utilizar el servicio aceptas estos términos, la Política de privacidad, la Política de cookies y las normas de Uso responsable aplicables.
        </p>

        <h2>2. Qué ofrece Vonu</h2>
        <p>
          Vonu permite comprobar mensajes, textos, capturas de pantalla, enlaces, sitios web y documentos PDF. En documentos puede organizar información, detectar condiciones que merecen revisión y señalar cláusulas, importes, fechas, pagos o referencias de jurisdicción antes de firmar o pagar.
        </p>
        <p>
          El resultado puede combinar modelos de inteligencia artificial, reglas internas, patrones de riesgo, comprobaciones técnicas y perfiles de revisión documental. En enlaces y mensajes, la puntuación funciona como un índice orientativo de riesgo. En documentos, funciona como un índice de prioridad de revisión. Ninguna de las dos representa una probabilidad matemática, una certificación oficial o un dictamen jurídico.
        </p>

        <h2>3. Uso responsable</h2>
        <p>
          Debes utilizar Vonu de forma lícita, responsable y de buena fe. No utilices el servicio para cometer fraude, suplantar identidades, obtener credenciales de terceros, evadir controles, atacar sistemas, acosar o facilitar actividades ilícitas.
        </p>

        <h2>4. Contenido aportado por el usuario</h2>
        <p>
          Conservas los derechos que te correspondan sobre el contenido que introduces. Nos autorizas a procesarlo, y a transmitirlo a los proveedores técnicos necesarios, únicamente en la medida necesaria para prestar, proteger y operar las funciones solicitadas conforme a la Política de privacidad.
        </p>
        <p>
          Debes tener derecho a compartir el contenido que envías y minimizar datos personales o sensibles de terceros que no sean necesarios para la comprobación.
        </p>

        <h2>5. Resultados y ausencia de garantía</h2>
        <p>
          Un resultado de Vonu debe utilizarse como apoyo para decidir qué verificar después. Una puntuación baja no garantiza que algo sea seguro y una puntuación alta no demuestra por sí sola que una persona haya cometido una estafa o delito.
        </p>
        <p>
          Las amenazas cambian con rapidez, los datos externos pueden ser incompletos y los modelos automáticos pueden equivocarse. Antes de enviar dinero, credenciales o documentación sensible, utiliza también canales oficiales de verificación cuando el contexto lo aconseje.
        </p>

        <h2>6. Revisión de documentos y jurisdicción</h2>
        <p>
          Vonu puede intentar identificar el tipo de documento, las partes, importes, fechas, condiciones de pago, cláusulas relevantes y la jurisdicción o ley aplicable cuando el propio documento aporta evidencia suficiente. El idioma del documento o de la interfaz no determina por sí solo la jurisdicción.
        </p>
        <p>
          La detección de jurisdicción y las referencias jurídicas se ofrecen como contexto para decidir qué revisar. Vonu no garantiza que una cláusula sea válida, inválida, abusiva, exigible o conforme a derecho. Cuando una condición tenga consecuencias relevantes, debe contrastarse con la normativa vigente y, si procede, con un profesional de la jurisdicción aplicable.
        </p>

        <h2>7. Acceso sin cuenta e identificación del dispositivo</h2>
        <p>
          La versión actual de Vonu Check no exige crear una cuenta. Para aplicar el análisis gratuito y mantener el saldo de análisis comprados, Vonu asigna al navegador o dispositivo un identificador aleatorio pseudónimo mediante almacenamiento técnico del navegador.
        </p>
        <p>
          Ese identificador no pretende revelar tu identidad real ni sustituye a una cuenta de usuario. Si borras cookies o datos del navegador, utilizas navegación privada, cambias de navegador o cambias de dispositivo, Vonu puede dejar de reconocer el saldo asociado anteriormente.
        </p>

        <h2>8. Análisis gratuito y packs</h2>
        <p>
          En el lanzamiento, Vonu ofrece <strong>un análisis gratuito por navegador o dispositivo</strong>. Una vez utilizado, puedes adquirir packs de <strong>3 análisis adicionales por 3,99 €</strong>, salvo que la página de precios muestre una oferta posterior diferente antes de la compra.
        </p>
        <p>
          Los packs son créditos de uso del servicio: cada comprobación realizada consume un análisis disponible. Los packs adquiridos se acumulan en el navegador o dispositivo reconocido por Vonu.
        </p>

        <h2>9. Pago único y Stripe</h2>
        <p>
          El pack de análisis se cobra mediante <strong>Stripe</strong>. Es un <strong>pago único</strong>: no crea una suscripción, no se renueva automáticamente y no genera cobros recurrentes por parte de Vonu.
        </p>
        <p>
          Antes de confirmar el pago se muestra de forma clara el importe total y las características principales del pack. El precio mostrado al consumidor incluye los impuestos cuando resulten aplicables. Stripe muestra el importe final y los medios de pago disponibles antes de la confirmación y puede solicitar un email para el recibo. Vonu no necesita almacenar el número completo de tu tarjeta.
        </p>

        <h2>10. Activación, incidencias y justificante de compra</h2>
        <p>
          Tras la confirmación del pago, Vonu añade los análisis comprados al identificador de dispositivo asociado a la operación. La integración utiliza controles de idempotencia para evitar conceder el mismo pack varias veces si Stripe reenvía una notificación técnica.
        </p>
        <p>
          Conserva el justificante o recibo de Stripe. Si el navegador pierde su identificador técnico después de una compra, el recibo puede ser necesario para revisar la incidencia y valorar la restauración del saldo pendiente.
        </p>

        <h2>11. Contratación electrónica y corrección de errores</h2>
        <p>
          El proceso de compra consiste en seleccionar el pack, revisar el precio y la información legal, confirmar las declaraciones requeridas, acceder a Stripe Checkout, revisar o corregir los datos de pago y facturación y confirmar finalmente el pago. Tras el pago correcto, el usuario vuelve a Vonu y los créditos se asocian al navegador o dispositivo reconocido.
        </p>
        <p>
          Antes de pagar puedes volver atrás o corregir los datos que Stripe permita editar. Vonu y Stripe conservan los registros electrónicos necesarios para pago, soporte, prevención de fraude, contabilidad y obligaciones fiscales. Stripe puede enviar un recibo al email facilitado. Si necesitas localizar una compra, puedes solicitar ayuda aportando el recibo o identificador de la operación.
        </p>
        <p>
          La contratación puede realizarse en español, inglés, francés, alemán o árabe mediante la versión correspondiente de Vonu. La información precontractual y estas condiciones permanecen accesibles para poder guardarlas o reproducirlas.
        </p>

        <h2>12. Ejecución inmediata y derecho de desistimiento</h2>
        <p>
          Cuando contratas como consumidor a distancia dispones del derecho de desistimiento que establezca la normativa aplicable, salvo que concurra legalmente una excepción. Como los análisis comprados pueden quedar disponibles inmediatamente, antes del pago Vonu solicitará que pidas expresamente el inicio de la prestación durante el plazo de desistimiento y que reconozcas que tu derecho puede verse afectado conforme se ejecute el servicio, únicamente en la medida permitida por la ley.
        </p>
        <p>
          Si ejerces válidamente el desistimiento después de que, a petición expresa tuya, se haya ejecutado parte del servicio, se aplicarán las consecuencias previstas por la normativa de consumo, incluido en su caso el importe proporcional correspondiente a la parte efectivamente prestada. Ninguna cláusula de Vonu pretende imponer una renuncia al desistimiento más amplia que la legalmente admisible.
        </p>

        <h2>13. Modelo de desistimiento</h2>
        <p>
          Si legalmente te corresponde y deseas desistir, puedes enviar una declaración inequívoca a <strong>legal@vonuai.com</strong>. Puedes utilizar este modelo:
        </p>
        <ul>
          <li>A la atención de Vonu / Francisco Luis Martínez Miralles — legal@vonuai.com.</li>
          <li>Por la presente comunico que desisto de mi contrato relativo a la siguiente compra de Vonu: [identificar compra o recibo de Stripe].</li>
          <li>Fecha de pedido: [fecha].</li>
          <li>Nombre del consumidor: [nombre].</li>
          <li>Domicilio: [solo cuando sea necesario para tramitar la solicitud].</li>
          <li>Fecha: [fecha]. Firma únicamente si el formulario se presenta en papel.</li>
        </ul>

        <h2>14. Reembolsos, incidencias y reclamaciones</h2>
        <p>
          Para incidencias de pago, créditos, reembolso o desistimiento, escribe a <strong>hello@vonuai.com</strong> o <strong>legal@vonuai.com</strong> e incluye el recibo o referencia de Stripe cuando sea posible. Las solicitudes se resolverán atendiendo al estado real de la prestación y a los derechos imperativos del consumidor que resulten aplicables.
        </p>

        <h2>15. Disponibilidad y cambios técnicos</h2>
        <p>
          Podemos modificar, mantener, sustituir o retirar funciones por motivos de seguridad, calidad, costes, proveedores o evolución del producto. Intentaremos evitar interrupciones innecesarias, pero no garantizamos disponibilidad ininterrumpida.
        </p>

        <h2>16. Prevención de abuso</h2>
        <p>
          Podemos aplicar límites técnicos razonables para impedir automatización abusiva, fraude de pagos, elusión sistemática del límite gratuito, sobrecarga o uso que comprometa la seguridad del servicio. Estas medidas no deben interpretarse como una garantía de identificación única de cada dispositivo.
        </p>

        <h2>16. Propiedad intelectual</h2>
        <p>
          La marca Vonu, el diseño, software, reglas internas, estructura, textos propios y demás elementos originales del servicio pertenecen a sus respectivos titulares y están protegidos por la normativa aplicable.
        </p>

        <h2>17. Limitación de responsabilidad</h2>
        <p>
          Vonu no sustituye la verificación independiente y no garantiza que detecte todas las amenazas. No será responsable de decisiones adoptadas ignorando información relevante disponible fuera del servicio, de usos contrarios a estas condiciones o de daños atribuibles exclusivamente a servicios de terceros fuera de nuestro control. Nada de lo anterior excluye responsabilidad ni derechos del consumidor que legalmente no puedan excluirse o limitarse.
        </p>

        <h2>18. Menores</h2>
        <p>
          Cuando una persona menor de edad utilice Vonu deberá contar con la supervisión o autorización que exija la normativa aplicable. No deben enviarse datos íntimos, identificativos o especialmente sensibles de menores que no sean estrictamente necesarios, y un menor no debe realizar una compra sin la autorización legalmente necesaria.
        </p>

        <h2>19. Legislación, jurisdicción e idiomas</h2>
        <p>
          Estas condiciones se interpretarán conforme a la normativa aplicable en España, sin perjuicio de las normas imperativas del país de residencia del consumidor y de los fueros legalmente reconocidos. Las versiones en español, inglés, francés, alemán y árabe pretenden comunicar las mismas condiciones y ninguna diferencia de traducción se interpretará para reducir un derecho imperativo del consumidor.
        </p>

        <h2>20. Contacto y modificaciones</h2>
        <p>
          Puedes contactar con nosotros en <strong>legal@vonuai.com</strong>. La versión vigente de estas condiciones será la publicada en esta página con su fecha de actualización. Los cambios materiales se reflejarán antes de aplicarse a nuevas compras cuando la normativa lo exija.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
