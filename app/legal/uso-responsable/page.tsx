import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";
import { legalAlternates } from "@/lib/vonu-legal/routes";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Uso responsable — Vonu",
  description:
    "Buenas prácticas para utilizar Vonu al comprobar mensajes, capturas, enlaces y webs sospechosas.",
  alternates: { canonical: "/legal/uso-responsable", languages: legalAlternates("responsible-use") },
  openGraph: {
    title: "Uso responsable — Vonu",
    description: "Cómo interpretar una comprobación de Vonu y actuar con seguridad.",
    url: `${siteUrl}/legal/uso-responsable`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function UsoResponsablePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/uso-responsable#webpage`,
    url: `${siteUrl}/legal/uso-responsable`,
    name: "Uso responsable — Vonu",
    description: "Buenas prácticas para utilizar Vonu al comprobar riesgos digitales.",
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "Vonu", url: siteUrl },
  };

  return (
    <main className="min-h-screen bg-[#0d101b] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <LegalPage locale="es" title="Uso responsable" description="Cómo interpretar y utilizar de forma segura las comprobaciones de Vonu." updatedAt="Última actualización: 18 de septiembre de 2026">
        <h2>1. Qué hace Vonu</h2>
        <p>
          Vonu revisa mensajes, textos, capturas, enlaces y sitios web para identificar señales de riesgo. Está pensado para ayudarte a frenar, entender qué llama la atención y decidir qué conviene verificar antes de confiar, responder o pagar.
        </p>

        <h2>2. Una puntuación no es un veredicto</h2>
        <p>
          El índice de riesgo de 0 a 100 resume la evidencia disponible. <strong>No es una probabilidad matemática de fraude</strong>, no certifica la identidad de una persona y no demuestra que se haya cometido un delito.
        </p>
        <p>
          Un resultado bajo tampoco garantiza seguridad. Algunas estafas son nuevas, utilizan cuentas legítimas comprometidas o esconden las señales importantes fuera del contenido que has enviado.
        </p>

        <h2>3. Verifica por un canal independiente</h2>
        <p>
          Si un mensaje afirma venir de un familiar, banco, empresa, marketplace, administración o soporte técnico y te pide dinero, credenciales, códigos o una acción urgente, verifica la solicitud utilizando un canal que ya conozcas o hayas obtenido de una fuente oficial, no el mismo enlace o teléfono que aparece en el mensaje sospechoso.
        </p>

        <h2>4. No compartas secretos para analizarlos</h2>
        <p>
          No introduzcas contraseñas, códigos OTP, claves de recuperación, números completos de tarjeta, PIN, credenciales de banca ni otros secretos. Para detectar el riesgo normalmente basta con el texto, remitente, dominio, importe o fragmento relevante.
        </p>
        <p>
          En capturas, oculta datos personales de terceros que no sean necesarios para entender el caso.
        </p>

        <h2>5. Enlaces y sitios web</h2>
        <p>
          Vonu puede revisar señales técnicas, reputación disponible y antigüedad del dominio, pero ningún indicador aislado certifica una web. HTTPS, un dominio antiguo o la ausencia de coincidencias en una base de amenazas no garantizan legitimidad.
        </p>
        <p>
          Evita pegar URLs que contengan tokens privados, claves de acceso o parámetros secretos. Algunas comprobaciones técnicas pueden consultar la URL o el dominio en servicios externos de reputación o registro.
        </p>

        <h2>6. Si Vonu detecta riesgo alto</h2>
        <p>
          No actúes únicamente por la puntuación. Detén la operación sensible y revisa las señales mostradas. Si existe una petición de dinero, credenciales o códigos, verifica primero por un canal oficial o independiente.
        </p>

        <h2>7. Si Vonu detecta riesgo bajo</h2>
        <p>
          Interprétalo como ausencia de señales fuertes en lo que se ha podido analizar, no como una certificación. Si el contexto externo sigue siendo extraño —por ejemplo, una petición inesperada, un cambio de cuenta bancaria o un remitente nuevo— verifica antes de actuar.
        </p>

        <h2>8. Si ya has pagado o compartido datos</h2>
        <p>
          Si crees que has enviado dinero o información sensible a un posible estafador, actúa cuanto antes: contacta con tu banco o proveedor de pago, cambia credenciales afectadas, protege tus cuentas y conserva pruebas. Cuando proceda, informa también a la plataforma y a las autoridades competentes.
        </p>

        <h2>9. Interacción con inteligencia artificial y sus limitaciones</h2>
        <p>
          Vonu utiliza inteligencia artificial y comprobaciones automatizadas. Al utilizar el servicio estás interactuando con un sistema que emplea IA para producir parte del análisis. Los modelos pueden interpretar mal un mensaje, inventar detalles o pasar por alto una señal. Vonu intenta reducir este riesgo mediante reglas de calibración, comprobaciones técnicas y evidencia visible, pero no puede eliminarlo por completo.
        </p>

        <h2>10. Usos prohibidos</h2>
        <p>No está permitido utilizar Vonu para:</p>
        <ul>
          <li>crear, mejorar o ensayar estafas, phishing o suplantaciones;</li>
          <li>obtener credenciales, códigos o datos sensibles de terceros;</li>
          <li>acosar, chantajear, extorsionar o manipular personas;</li>
          <li>atacar, saturar o explorar sistemas sin autorización;</li>
          <li>vulnerar privacidad, propiedad intelectual u otros derechos;</li>
          <li>presentar una puntuación de Vonu como prueba definitiva de culpabilidad o identidad.</li>
        </ul>

        <h2>11. Ayuda urgente</h2>
        <p>
          Vonu no sustituye a bancos, plataformas, profesionales ni autoridades. Si existe amenaza inmediata, acceso no autorizado, pérdida económica relevante, extorsión o cualquier otra emergencia, utiliza también los canales oficiales adecuados sin esperar a una respuesta de Vonu.
        </p>

        <h2>12. Contacto</h2>
        <p>
          Si detectas un resultado claramente incorrecto o un patrón de fraude que crees que Vonu debería reconocer, puedes escribir a <strong>hello@vonuai.com</strong> sin incluir secretos ni datos sensibles innecesarios.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
