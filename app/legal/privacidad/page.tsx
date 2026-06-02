import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Política de privacidad — VonuAI",
  description:
    "Política de privacidad de VonuAI: datos tratados, finalidades, bases legales, conservación, proveedores, derechos y contacto.",
  alternates: {
    canonical: "/legal/privacidad",
  },
  openGraph: {
    title: "Política de privacidad — VonuAI",
    description:
      "Información sobre cómo VonuAI trata los datos personales y cómo puedes ejercer tus derechos.",
    url: `${siteUrl}/legal/privacidad`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <LegalPage
        title="Política de privacidad"
        description="Cómo tratamos los datos personales cuando usas VonuAI, contactas con nosotros o te apuntas a recursos."
      >
        <h2>1. Responsable del tratamiento</h2>

        <p>
          El responsable del tratamiento de los datos personales tratados a
          través de VonuAI es <strong>Francisco Luis Martínez Miralles</strong>,
          actuando bajo el nombre comercial <strong>VonuAI</strong>.
        </p>

        <ul>
          <li>
            <strong>Nombre comercial:</strong> VonuAI
          </li>
          <li>
            <strong>Responsable:</strong> Francisco Luis Martínez Miralles
          </li>
          <li>
            <strong>Domicilio de contacto:</strong> Calle Velarde, 55, 03203
            Elche, Alicante, España
          </li>
          <li>
            <strong>Email general:</strong> hello@vonuai.com
          </li>
          <li>
            <strong>Email privacidad:</strong> privacy@vonuai.com
          </li>
          <li>
            <strong>Dominios asociados:</strong> vonuai.com y sus subdominios asociados
          </li>
        </ul>

        <h2>2. Qué datos podemos tratar</h2>

        <p>
          Los datos tratados dependen de cómo uses VonuAI. Podemos tratar las
          siguientes categorías de información:
        </p>

        <ul>
          <li>
            <strong>Datos de contacto:</strong> nombre, email, motivo de
            contacto y mensaje enviado mediante formularios.
          </li>
          <li>
            <strong>Datos de suscripción a recursos:</strong> email y página
            desde la que se solicitó recibir recursos o novedades.
          </li>
          <li>
            <strong>Datos de cuenta:</strong> información necesaria para crear,
            autenticar o gestionar una cuenta de usuario cuando esa función esté
            disponible.
          </li>
          <li>
            <strong>Datos de uso:</strong> información técnica básica sobre el
            uso del servicio, límites, plan contratado, consumo de mensajes,
            recargas o minutos de voz.
          </li>
          <li>
            <strong>Contenido enviado por el usuario:</strong> mensajes,
            consultas, archivos, imágenes, PDFs, textos, capturas, documentos u
            otra información que el usuario decida introducir o subir para su
            análisis.
          </li>
          <li>
            <strong>Datos de pago:</strong> información necesaria para gestionar
            suscripciones, pagos o recargas. Los datos completos de tarjeta o
            medios de pago son gestionados por proveedores de pago externos.
          </li>
        </ul>

        <h2>3. Para qué usamos los datos</h2>

        <p>Tratamos los datos personales con estas finalidades:</p>

        <ul>
          <li>Prestar el servicio de chat, análisis y orientación de VonuAI.</li>
          <li>Responder consultas enviadas mediante formularios de contacto.</li>
          <li>
            Gestionar solicitudes de recursos, guías, avances de producto o
            comunicaciones similares.
          </li>
          <li>Gestionar cuentas, acceso, planes, límites de uso y recargas.</li>
          <li>Procesar pagos, facturación y suscripciones cuando proceda.</li>
          <li>
            Mejorar la seguridad, prevenir abusos, detectar errores y mantener
            el correcto funcionamiento del servicio.
          </li>
          <li>
            Mejorar la experiencia de usuario, la calidad de las respuestas y
            la utilidad del producto.
          </li>
          <li>
            Cumplir obligaciones legales, fiscales, contables o de seguridad
            aplicables.
          </li>
        </ul>

        <h2>4. Base jurídica del tratamiento</h2>

        <p>
          Según el caso, el tratamiento de datos puede basarse en una o varias
          de estas bases:
        </p>

        <ul>
          <li>
            <strong>Ejecución de un contrato o medidas precontractuales:</strong>{" "}
            para prestar el servicio solicitado, gestionar una cuenta o tramitar
            una suscripción.
          </li>
          <li>
            <strong>Consentimiento:</strong> para recibir recursos,
            comunicaciones o enviar información mediante formularios cuando sea
            necesario.
          </li>
          <li>
            <strong>Interés legítimo:</strong> para mejorar el servicio,
            prevenir fraude, mantener seguridad, analizar errores y responder a
            solicitudes.
          </li>
          <li>
            <strong>Obligación legal:</strong> para cumplir obligaciones
            fiscales, contables, administrativas o requerimientos legalmente
            exigibles.
          </li>
        </ul>

        <h2>5. Contenido sensible y responsabilidad del usuario</h2>

        <p>
          VonuAI puede analizar mensajes, documentos o situaciones delicadas. El
          usuario debe evitar compartir información que no sea necesaria para el
          análisis, especialmente contraseñas, códigos de verificación, datos
          bancarios completos, datos de salud extremadamente sensibles o
          información de terceros sin base legítima.
        </p>

        <p>
          Si necesitas analizar una situación sensible, procura eliminar o tapar
          datos innecesarios antes de enviar capturas, documentos o textos.
        </p>

        <h2>6. Proveedores y encargados del tratamiento</h2>

        <p>
          Para prestar VonuAI podemos utilizar proveedores tecnológicos que
          actúan como encargados del tratamiento o prestadores de servicios. Entre
          ellos pueden encontrarse proveedores de infraestructura, base de datos,
          autenticación, pagos, correo electrónico, analítica técnica y modelos
          de inteligencia artificial.
        </p>

        <p>
          Actualmente, el servicio puede apoyarse en proveedores como Supabase,
          Vercel, Stripe, Google Workspace, Resend y OpenAI, entre otros, según
          las funciones disponibles en cada momento.
        </p>

        <p>
          Estos proveedores solo deben tratar los datos conforme a las
          instrucciones necesarias para prestar el servicio y bajo sus propias
          condiciones de seguridad y tratamiento.
        </p>

        <h2>7. Inteligencia artificial y análisis de contenido</h2>

        <p>
          Cuando utilizas VonuAI, el contenido que introduces puede ser enviado a
          proveedores de inteligencia artificial para generar respuestas,
          explicaciones, análisis o resúmenes. Esto puede incluir texto, imágenes,
          archivos, transcripciones o información contextual que decidas aportar.
        </p>

        <p>
          VonuAI está diseñado para ayudarte a entender riesgos, ordenar
          información y preparar próximos pasos, pero sus respuestas tienen
          carácter orientativo y deben ser revisadas por el usuario,
          especialmente en asuntos legales, médicos, psicológicos, financieros o
          de seguridad.
        </p>

        <h2>8. Casos, patrones anonimizados y mejora de la detección</h2>

<p>
  Cuando utilizas VonuAI para analizar posibles fraudes, mensajes
  sospechosos, webs, contratos, facturas, situaciones de presión,
  manipulación u otros riesgos, el sistema puede generar registros internos
  de revisión para mejorar la seguridad, calidad y utilidad del servicio.
</p>

<p>
  Estos registros no tienen como finalidad identificar al usuario, sino
  detectar señales repetidas, patrones de riesgo, abusos, errores, campañas
  fraudulentas o casos similares. Para ello, VonuAI puede aplicar procesos
  automáticos de revisión, limpieza, anonimización, deduplicación y
  clasificación antes de conservar o reutilizar información como patrón
  interno.
</p>

<p>
  En la medida de lo posible, VonuAI evita conservar información sensible
  innecesaria como contraseñas, códigos de verificación, datos bancarios
  completos, documentos identificativos completos, información médica
  detallada, datos de menores o datos de terceros que no sean necesarios para
  entender el riesgo.
</p>

<p>
  Algunas señales anonimizadas o agregadas pueden utilizarse para mejorar la
  detección de fraudes, riesgos legales o de consumo, patrones de presión
  emocional, seguridad personal u otras situaciones similares. Este uso ayuda
  a que VonuAI pueda reconocer mejor casos parecidos en el futuro, sin vender
  datos personales ni convertir la información original del usuario en una
  base pública.
</p>

        <h2>9. Conservación de los datos</h2>

        <p>
          Los datos se conservarán durante el tiempo necesario para cumplir la
          finalidad para la que fueron recogidos, prestar el servicio, gestionar
          solicitudes, mantener seguridad, cumplir obligaciones legales o resolver
          posibles responsabilidades.
        </p>

        <p>
          Los mensajes de contacto y suscripciones a recursos podrán conservarse
          mientras exista una relación o interés legítimo en atender la solicitud
          o mantener la comunicación, salvo que el usuario solicite su supresión
          cuando proceda.
        </p>

        <h2>10. Comunicación de datos a terceros</h2>

        <p>
          No vendemos tus datos personales a terceros. Podemos comunicar datos a
          proveedores necesarios para prestar el servicio, a administraciones
          públicas cuando exista obligación legal, a entidades de pago para
          gestionar transacciones o a terceros cuando sea necesario para proteger
          derechos, seguridad o prevenir fraude.
        </p>

        <h2>11. Transferencias internacionales</h2>

        <p>
          Algunos proveedores tecnológicos pueden estar ubicados fuera del Espacio
          Económico Europeo o tratar datos desde otros países. En esos casos, se
          procurará que existan garantías adecuadas conforme a la normativa
          aplicable, como cláusulas contractuales tipo, decisiones de adecuación u
          otros mecanismos reconocidos por la normativa de protección de datos.
        </p>

        <h2>12. Derechos de las personas usuarias</h2>

        <p>
          Puedes ejercer los derechos reconocidos por la normativa de protección
          de datos, incluyendo acceso, rectificación, supresión, oposición,
          limitación del tratamiento, portabilidad y, cuando proceda, retirada
          del consentimiento.
        </p>

        <p>
          Para ejercer tus derechos, escribe a{" "}
          <strong>privacy@vonuai.com</strong> indicando el derecho que deseas
          ejercer y aportando la información necesaria para identificar tu
          solicitud.
        </p>

        <p>
          También puedes presentar una reclamación ante la Agencia Española de
          Protección de Datos si consideras que el tratamiento de tus datos no se
          ajusta a la normativa aplicable.
        </p>

        <h2>13. Seguridad</h2>

        <p>
          VonuAI aplica medidas técnicas y organizativas razonables para proteger
          la información frente a accesos no autorizados, pérdida, alteración o
          uso indebido. Aun así, ningún sistema conectado a Internet puede
          garantizar una seguridad absoluta.
        </p>

        <h2>14. Menores de edad</h2>

        <p>
          VonuAI puede utilizarse para apoyo educativo o de estudio, pero el uso
          por menores debe realizarse bajo supervisión de padres, madres, tutores
          o responsables legales cuando proceda. No está pensado para que menores
          faciliten datos personales sensibles sin acompañamiento adulto.
        </p>

        <h2>15. Cambios en esta política</h2>

        <p>
          Esta política de privacidad podrá actualizarse para reflejar cambios
          normativos, técnicos, operativos o de producto. La versión vigente será
          siempre la publicada en esta página.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}