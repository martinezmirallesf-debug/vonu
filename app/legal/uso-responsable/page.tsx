import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Uso responsable — VonuAI",
  description:
    "Normas de uso responsable de VonuAI: límites del servicio, situaciones sensibles, seguridad, privacidad y buenas prácticas.",
  alternates: {
    canonical: "/legal/uso-responsable",
  },
  openGraph: {
    title: "Uso responsable — VonuAI",
    description:
      "Buenas prácticas para utilizar VonuAI de forma segura, responsable y consciente.",
    url: `${siteUrl}/legal/uso-responsable`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function UsoResponsablePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <LegalPage
        title="Uso responsable"
        description="Buenas prácticas para utilizar VonuAI con seguridad, criterio y claridad en situaciones importantes."
      >
        <h2>1. Qué significa usar VonuAI de forma responsable</h2>

        <p>
          VonuAI está diseñado para ayudarte a revisar mensajes, webs,
          documentos, archivos, contratos, facturas y situaciones delicadas antes
          de firmar, pagar, contestar o decidir.
        </p>

        <p>
          Usar VonuAI de forma responsable significa entender que es una
          herramienta de apoyo y orientación preventiva, no una autoridad final ni
          un sustituto de profesionales cualificados.
        </p>

        <h2>2. VonuAI no sustituye a profesionales</h2>

        <p>
          VonuAI puede ayudarte a identificar señales de riesgo, ordenar
          información, preparar preguntas y entender mejor una situación. Sin
          embargo, <strong>no sustituye</strong> a abogados, médicos, psicólogos,
          asesores fiscales, fuerzas de seguridad, entidades financieras,
          administraciones públicas ni otros profesionales cualificados.
        </p>

        <p>
          Si tu caso tiene consecuencias legales, médicas, psicológicas,
          financieras, laborales, familiares o de seguridad importantes, debes
          contrastar la información con el profesional adecuado.
        </p>

        <h2>3. Situaciones urgentes o de riesgo inmediato</h2>

        <p>
          No utilices VonuAI como único recurso en situaciones urgentes. Si hay
          riesgo inmediato para tu salud, seguridad, integridad, dinero o la de
          otra persona, contacta directamente con servicios de emergencia,
          autoridades competentes, tu banco o un profesional cualificado.
        </p>

        <p>Por ejemplo, busca ayuda inmediata si:</p>

        <ul>
          <li>hay peligro físico o amenaza directa;</li>
          <li>has realizado un pago sospechoso o crees que te han estafado;</li>
          <li>alguien tiene acceso a tus cuentas, tarjetas o dispositivos;</li>
          <li>hay una urgencia médica o psicológica;</li>
          <li>existe riesgo de daño para ti o para otra persona;</li>
          <li>has recibido una amenaza, chantaje o extorsión.</li>
        </ul>

        <h2>4. No compartas información innecesariamente sensible</h2>

<p>
  Para que VonuAI pueda ayudarte, puedes aportar contexto, mensajes, capturas
  o documentos. Aun así, debes compartir solo la información necesaria para
  entender la situación.
</p>

<p>Evita introducir o subir:</p>

<ul>
  <li>contraseñas;</li>
  <li>códigos de verificación u OTP;</li>
  <li>números completos de tarjetas bancarias;</li>
  <li>credenciales de acceso;</li>
  <li>IBAN, cuentas bancarias o datos financieros completos;</li>
  <li>DNI, NIE, pasaporte u otros documentos identificativos completos;</li>
  <li>firmas, direcciones completas o matrículas si no son necesarias;</li>
  <li>historiales médicos completos o datos de salud muy sensibles;</li>
  <li>información íntima, sexual o especialmente delicada si no aporta al análisis;</li>
  <li>datos de menores o de terceros sin base legítima;</li>
  <li>documentación de terceros sin autorización o motivo válido.</li>
</ul>

<p>
  Cuando sea posible, tapa o elimina datos innecesarios antes de subir una
  captura, factura, contrato o documento. En muchos casos basta con dejar
  visible el texto sospechoso, la fecha, el remitente, el dominio, el importe o
  la parte concreta que quieres revisar.
</p>

<p>
  VonuAI puede extraer señales generales de algunos casos para mejorar la
  detección de riesgos futuros, pero la idea no es guardar tu vida privada:
  es aprender de patrones útiles minimizando datos sensibles innecesarios.
</p>

        <h2>5. Revisa las respuestas antes de actuar</h2>

        <p>
          VonuAI puede cometer errores, omitir matices o interpretar mal una
          situación si falta contexto. Las respuestas deben entenderse como una
          ayuda para pensar mejor, no como una instrucción obligatoria.
        </p>

        <p>
          Antes de tomar una decisión importante, revisa la respuesta, contrasta
          los datos relevantes y, si hace falta, consulta con una persona o
          profesional de confianza.
        </p>

        <h2>6. Uso en posibles estafas o fraudes</h2>

        <p>
          Si VonuAI detecta señales de posible estafa, fraude, manipulación o
          presión, tómalo como una señal para frenar y verificar. No envíes
          dinero, documentos, claves o códigos hasta haber comprobado la
          situación por canales oficiales.
        </p>

        <p>
          Si ya has compartido datos o realizado un pago, contacta cuanto antes
          con tu banco, cambia contraseñas, activa medidas de seguridad y, si
          procede, informa a las autoridades.
        </p>

        <h2>7. Uso en temas legales, contratos o documentos</h2>

        <p>
          VonuAI puede ayudarte a resumir documentos, detectar puntos delicados,
          preparar preguntas y entender cláusulas o condiciones generales. Pero
          no sustituye la revisión de un abogado ni garantiza que una
          interpretación sea completa o jurídicamente definitiva.
        </p>

        <p>
          Si vas a firmar un contrato importante, asumir una deuda, reclamar,
          denunciar, aceptar una condición legal o tomar una decisión con
          consecuencias relevantes, consulta con un profesional cualificado.
        </p>

        <h2>8. Uso en salud física o mental</h2>

        <p>
          VonuAI puede ofrecer orientación general, ayudarte a ordenar síntomas o
          explicar conceptos de forma sencilla. No emite diagnósticos médicos ni
          sustituye a personal sanitario, psicólogos, psiquiatras u otros
          profesionales de salud.
        </p>

        <p>
          Si tienes síntomas graves, dolor intenso, dificultad para respirar,
          riesgo de autolesión, crisis emocional, pensamientos de hacerte daño o
          cualquier urgencia, busca ayuda inmediata a través de servicios de
          emergencia o profesionales sanitarios.
        </p>

        <h2>9. Uso en educación y estudio</h2>

        <p>
          VonuAI puede ayudarte a estudiar, explicar conceptos, practicar
          ejercicios, resumir temas o preparar material de aprendizaje. El
          usuario debe usarlo como apoyo para aprender, no como herramienta para
          engañar, copiar o vulnerar normas académicas.
        </p>

        <p>
          En el caso de menores, el uso de VonuAI debería realizarse con
          acompañamiento o supervisión de madres, padres, tutores o responsables
          legales cuando proceda.
        </p>

        <h2>10. Uso de voz, imágenes, archivos y documentos</h2>

        <p>
          Algunas funciones de VonuAI pueden permitir analizar voz, imágenes,
          capturas, PDFs u otros archivos. El usuario debe asegurarse de que
          tiene derecho a subir ese contenido y de que no incluye información
          innecesariamente sensible.
        </p>

        <p>
          No subas archivos de terceros sin autorización o sin una base legítima.
          Tampoco uses VonuAI para analizar, difundir o explotar contenido que
          vulnere la privacidad, imagen, honor o derechos de otras personas.
        </p>

        <h2>11. Usos no permitidos</h2>

        <p>No está permitido usar VonuAI para:</p>

        <ul>
          <li>cometer o facilitar delitos, fraudes o abusos;</li>
          <li>suplantar identidades;</li>
          <li>acosar, amenazar, extorsionar o manipular a otras personas;</li>
          <li>obtener contraseñas, códigos o datos sensibles de terceros;</li>
          <li>
            generar instrucciones para evadir la ley, ocultar pruebas o dañar a
            otras personas;
          </li>
          <li>vulnerar derechos de privacidad, propiedad intelectual o imagen;</li>
          <li>atacar, saturar o interferir en el servicio;</li>
          <li>automatizar usos abusivos o contrarios a estos términos.</li>
        </ul>

        <h2>12. Buenas prácticas recomendadas</h2>

        <p>Para obtener mejores resultados:</p>

        <ul>
          <li>explica el contexto con claridad;</li>
          <li>indica qué te preocupa exactamente;</li>
          <li>no ocultes datos relevantes para el análisis;</li>
          <li>elimina datos personales innecesarios;</li>
          <li>contrasta decisiones importantes antes de actuar;</li>
          <li>usa la respuesta como ayuda para pensar, no como orden final;</li>
          <li>busca ayuda profesional cuando el caso lo requiera.</li>
        </ul>

        <h2>13. Cambios en estas normas</h2>

        <p>
          VonuAI podrá actualizar estas normas de uso responsable para adaptarlas
          a cambios legales, técnicos, de seguridad o de producto. La versión
          vigente será siempre la publicada en esta página.
        </p>

        <h2>14. Contacto</h2>

        <p>
          Si tienes dudas sobre el uso responsable de VonuAI, puedes escribir a{" "}
          <strong>legal@vonuai.com</strong> o utilizar la página de contacto.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}