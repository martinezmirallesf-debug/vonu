import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Términos y condiciones — VonuAI",
  description:
    "Términos y condiciones de uso de VonuAI: acceso, uso responsable, planes, pagos, límites, propiedad intelectual y responsabilidades.",
  alternates: {
    canonical: "/legal/terminos",
  },
  openGraph: {
    title: "Términos y condiciones — VonuAI",
    description:
      "Condiciones generales de uso del servicio VonuAI.",
    url: `${siteUrl}/legal/terminos`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <LegalPage
        title="Términos y condiciones"
        description="Condiciones generales para acceder y usar VonuAI de forma segura, responsable y transparente."
      >
        <h2>1. Identificación del servicio</h2>

        <p>
          Estos términos regulan el acceso y uso de <strong>VonuAI</strong>, una
          herramienta de orientación preventiva titularidad de{" "}
          <strong>Francisco Luis Martínez Miralles</strong>, actuando bajo el
          nombre comercial <strong>VonuAI</strong>.
        </p>

        <ul>
          <li>
            <strong>Nombre comercial:</strong> VonuAI
          </li>
          <li>
            <strong>Titular:</strong> Francisco Luis Martínez Miralles
          </li>
          <li>
            <strong>Email general:</strong> hello@vonuai.com
          </li>
          <li>
            <strong>Email legal:</strong> legal@vonuai.com
          </li>
          <li>
            <strong>Dominios asociados:</strong> vonuai.com y sus subdominios asociados
          </li>
        </ul>

        <h2>2. Aceptación de los términos</h2>

        <p>
          Al acceder, registrarte o utilizar VonuAI, aceptas estos términos y el
          resto de documentos legales publicados en la web, incluyendo el aviso
          legal, la política de privacidad, la política de cookies y las normas
          de uso responsable.
        </p>

        <p>
          Si no estás de acuerdo con estas condiciones, no debes utilizar el
          servicio.
        </p>

        <h2>3. Qué es VonuAI</h2>

        <p>
          VonuAI es un asistente diseñado para ayudar a las personas a revisar
          mensajes, enlaces, webs, documentos, facturas, contratos, capturas,
          archivos y situaciones delicadas antes de firmar, pagar, contestar o
          decidir.
        </p>

        <p>
          El servicio puede ofrecer análisis, resúmenes, señales de riesgo,
          preguntas útiles, explicaciones, orientación práctica y próximos pasos.
          Su finalidad es aportar claridad en momentos de duda, presión o
          incertidumbre.
        </p>

        <h2>4. Naturaleza orientativa</h2>

        <p>
          VonuAI ofrece información y orientación preventiva, pero{" "}
          <strong>no sustituye</strong> el asesoramiento profesional cualificado.
          No actúa como abogado, médico, psicólogo, asesor fiscal, entidad
          financiera, fuerza de seguridad ni organismo público.
        </p>

        <p>
          En situaciones de urgencia, riesgo inmediato, emergencia médica, posible
          delito, amenaza, pérdida económica relevante o conflicto legal
          importante, debes contactar con los servicios de emergencia, autoridades
          competentes, tu banco o el profesional adecuado.
        </p>

        <h2>5. Registro y cuenta de usuario</h2>

        <p>
          Algunas funciones de VonuAI pueden requerir registro, autenticación o
          creación de cuenta. El usuario se compromete a proporcionar información
          veraz, mantener la confidencialidad de sus credenciales y comunicar
          cualquier uso no autorizado de su cuenta.
        </p>

        <p>
          VonuAI podrá limitar, suspender o cancelar el acceso a una cuenta si se
          detecta un uso abusivo, fraudulento, contrario a estos términos o que
          pueda afectar a la seguridad del servicio o de terceros.
        </p>

        <h2>6. Uso permitido</h2>

        <p>
          Puedes utilizar VonuAI para analizar dudas reales, revisar información,
          entender riesgos, preparar preguntas, ordenar situaciones y recibir
          orientación práctica antes de actuar.
        </p>

        <p>
          El usuario debe utilizar el servicio de forma lícita, responsable y
          respetuosa, evitando introducir información innecesariamente sensible o
          datos de terceros sin base legítima.
        </p>

        <h2>7. Usos prohibidos</h2>

        <p>No está permitido utilizar VonuAI para:</p>

        <ul>
          <li>Cometer, facilitar o encubrir actividades ilícitas.</li>
          <li>Suplantar identidades o vulnerar derechos de terceros.</li>
          <li>
            Obtener, compartir o solicitar contraseñas, códigos de verificación,
            datos bancarios completos o credenciales de acceso.
          </li>
          <li>
            Generar instrucciones para fraude, evasión, acoso, abuso, daño,
            manipulación o explotación de otras personas.
          </li>
          <li>
            Enviar contenido que vulnere derechos de propiedad intelectual,
            privacidad, honor, imagen o protección de datos.
          </li>
          <li>
            Saturar, interferir, atacar, automatizar de forma abusiva o intentar
            vulnerar el funcionamiento técnico del servicio.
          </li>
          <li>
            Utilizar VonuAI como sustituto directo de servicios profesionales en
            situaciones que requieran intervención cualificada.
          </li>
        </ul>

        <h2>8. Contenido enviado por el usuario</h2>

        <p>
          El usuario conserva los derechos que le correspondan sobre el contenido
          que introduzca o suba a VonuAI. Al usar el servicio, autoriza el
          tratamiento técnico de ese contenido en la medida necesaria para prestar
          la funcionalidad solicitada, generar respuestas, analizar archivos,
          mantener seguridad y mejorar la experiencia.
        </p>

        <p>
          El usuario es responsable de asegurarse de que tiene derecho a subir o
          compartir el contenido que introduce en VonuAI, especialmente cuando
          incluya datos personales, documentos, mensajes, imágenes o información
          de terceros.
        </p>

        <h2>9. Respuestas generadas por VonuAI</h2>

        <p>
          Las respuestas de VonuAI pueden contener errores, omisiones,
          interpretaciones incompletas o información no actualizada. Aunque el
          servicio está diseñado para aportar claridad y señalar riesgos, el
          usuario debe revisar, contrastar y valorar la información antes de
          tomar decisiones importantes.
        </p>

        <p>
          VonuAI puede formular preguntas de seguimiento cuando necesite más
          contexto. Si la información aportada es incompleta, ambigua o
          incorrecta, la respuesta puede ser menos precisa.
        </p>

        <h2>10. Planes, límites y recargas</h2>

        <p>
          VonuAI puede ofrecer planes gratuitos y de pago, límites de mensajes,
          minutos de voz, análisis de archivos, recargas u otras modalidades de
          uso. Las condiciones, precios y límites aplicables serán los mostrados
          en la página de precios o durante el proceso de contratación.
        </p>

        <p>
          Los planes pueden renovarse periódicamente según la modalidad
          contratada. Las recargas, si están disponibles, permiten ampliar el uso
          antes del siguiente ciclo de renovación.
        </p>

        <p>
          VonuAI podrá modificar planes, límites, funcionalidades o precios,
          informando cuando corresponda y respetando los derechos que resulten
          aplicables al usuario.
        </p>

        <h2>11. Pagos y gestión de suscripciones</h2>

        <p>
          Los pagos, suscripciones y recargas pueden gestionarse mediante
          proveedores externos de pago. VonuAI no almacena los datos completos de
          tarjetas bancarias. La gestión de cobros, facturación técnica y
          métodos de pago puede realizarse a través de plataformas especializadas.
        </p>

        <p>
          El usuario es responsable de mantener actualizada la información de
          pago y de cancelar o modificar su suscripción desde los canales
          habilitados si no desea continuar con el servicio.
        </p>

        <h2>12. Cancelación</h2>

        <p>
          El usuario podrá cancelar su suscripción desde la zona de usuario, el
          portal de pagos o los medios habilitados en cada momento. La cancelación
          evitará futuras renovaciones, sin perjuicio del acceso que pueda quedar
          disponible hasta el final del periodo ya abonado, salvo que se indique
          otra cosa durante el proceso.
        </p>

        <h2>13. Disponibilidad del servicio</h2>

        <p>
          VonuAI trabaja para mantener el servicio disponible y funcionando
          correctamente, pero no garantiza disponibilidad ininterrumpida. Pueden
          producirse interrupciones por mantenimiento, incidencias técnicas,
          proveedores externos, cambios de producto, límites de capacidad o
          causas ajenas al control de VonuAI.
        </p>

        <h2>14. Propiedad intelectual</h2>

        <p>
          La marca, diseño, textos, estructura, elementos visuales, código,
          logotipos y materiales propios de VonuAI están protegidos por la
          normativa de propiedad intelectual e industrial.
        </p>

        <p>
          El uso del servicio no otorga al usuario ningún derecho sobre la marca
          VonuAI ni sobre los elementos propios del producto, salvo el derecho de
          uso limitado conforme a estos términos.
        </p>

        <h2>15. Limitación de responsabilidad</h2>

        <p>
          VonuAI no será responsable de decisiones adoptadas exclusivamente a
          partir de sus respuestas, ni de daños derivados del uso indebido,
          abusivo, contrario a estos términos o descontextualizado del servicio.
        </p>

        <p>
          El usuario acepta que VonuAI es una herramienta de apoyo y que la
          decisión final sobre cómo actuar corresponde siempre al usuario.
        </p>

        <h2>16. Cambios en los términos</h2>

        <p>
          VonuAI podrá actualizar estos términos para adaptarlos a cambios
          normativos, técnicos, operativos, comerciales o de producto. La versión
          vigente será la publicada en esta página.
        </p>

        <h2>17. Legislación aplicable</h2>

        <p>
          Estos términos se rigen por la legislación española, sin perjuicio de
          los derechos imperativos que puedan corresponder a consumidores y
          usuarios conforme a la normativa aplicable.
        </p>

        <h2>18. Contacto</h2>

        <p>
          Para dudas sobre estos términos puedes escribir a{" "}
          <strong>legal@vonuai.com</strong>. Para soporte general, puedes usar la
          página de contacto o escribir a <strong>hello@vonuai.com</strong>.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}