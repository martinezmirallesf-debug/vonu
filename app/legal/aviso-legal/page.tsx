import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aviso legal — VonuAI",
  description:
    "Aviso legal de VonuAI: titularidad del servicio, condiciones de acceso, propiedad intelectual, responsabilidades y contacto legal.",
  alternates: {
    canonical: "/legal/aviso-legal",
  },
  openGraph: {
    title: "Aviso legal — VonuAI",
    description:
      "Información legal sobre la titularidad, uso y condiciones generales de VonuAI.",
    url: `${siteUrl}/legal/aviso-legal`,
    siteName: "VonuAI",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-zinc-950">
      <HomeHeader />

      <LegalPage
        title="Aviso legal"
        description="Información básica sobre el titular de VonuAI, el uso de la web y las condiciones generales de acceso."
      >
        <h2>1. Titularidad del servicio</h2>

        <p>
          En cumplimiento de las obligaciones de información aplicables, se
          informa de que este sitio web y el servicio VonuAI son titularidad de{" "}
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
            <strong>Domicilio de contacto:</strong> Calle Velarde, 55, 03203
            Elche, Alicante, España
          </li>
          <li>
            <strong>Email general:</strong> hello@vonuai.com
          </li>
          <li>
            <strong>Email legal:</strong> legal@vonuai.com
          </li>
          <li>
            <strong>Dominios asociados:</strong> vonuai.com y app.vonuai.com
          </li>
        </ul>

        <h2>2. Objeto de VonuAI</h2>

        <p>
          VonuAI es una herramienta de orientación preventiva diseñada para
          ayudar a los usuarios a revisar mensajes, enlaces, webs, documentos,
          facturas, contratos, archivos y situaciones delicadas antes de firmar,
          pagar, contestar o decidir.
        </p>

        <p>
          El servicio puede ofrecer explicaciones, análisis de señales de
          riesgo, resúmenes, preguntas útiles, próximos pasos y orientación
          práctica. Su finalidad es ayudar al usuario a ganar claridad, no
          sustituir su criterio ni reemplazar servicios profesionales.
        </p>

        <h2>3. Acceso y uso del sitio web</h2>

        <p>
          El acceso a este sitio web implica la aceptación de este aviso legal y
          del resto de condiciones publicadas en la web. El usuario se compromete
          a utilizar VonuAI de forma lícita, responsable y respetuosa con la
          normativa aplicable, los derechos de terceros y el correcto
          funcionamiento del servicio.
        </p>

        <p>
          No está permitido utilizar VonuAI para actividades ilícitas, abusivas,
          fraudulentas, dañinas, discriminatorias, de acoso, de suplantación de
          identidad, de vulneración de derechos de terceros o de obtención de
          información sensible de manera indebida.
        </p>

        <h2>4. Naturaleza orientativa del servicio</h2>

        <p>
          VonuAI ofrece orientación preventiva y ayuda a analizar situaciones,
          pero <strong>no sustituye</strong> a abogados, médicos, psicólogos,
          asesores fiscales, fuerzas de seguridad, entidades financieras ni otros
          profesionales cualificados.
        </p>

        <p>
          En situaciones urgentes, de riesgo inmediato, emergencia médica,
          amenaza, delito, pérdida económica relevante o conflicto legal
          importante, el usuario debe contactar con los servicios de emergencia,
          autoridades competentes, su banco o el profesional adecuado.
        </p>

        <h2>5. Propiedad intelectual e industrial</h2>

        <p>
          Los contenidos, textos, diseño, elementos visuales, marca, estructura,
          código, logotipos y demás materiales propios de VonuAI están protegidos
          por la normativa de propiedad intelectual e industrial, salvo que se
          indique lo contrario.
        </p>

        <p>
          El usuario no adquiere ningún derecho de propiedad sobre la web, la
          marca o los elementos del servicio por el mero uso de VonuAI. Queda
          prohibida la reproducción, distribución, comunicación pública,
          transformación o explotación no autorizada de los contenidos propios de
          VonuAI.
        </p>

        <h2>6. Responsabilidad</h2>

        <p>
          VonuAI trabaja para ofrecer información útil, clara y razonable, pero
          no puede garantizar que todas las respuestas sean completas, exactas,
          actualizadas o adecuadas para cualquier situación concreta. El usuario
          debe valorar la información recibida, contrastarla cuando sea
          necesario y tomar sus propias decisiones con responsabilidad.
        </p>

        <p>
          VonuAI no será responsable de decisiones adoptadas exclusivamente a
          partir de la información generada por el servicio, ni de daños
          derivados de un uso indebido, descontextualizado o contrario a estas
          condiciones.
        </p>

        <h2>7. Enlaces a terceros</h2>

        <p>
          La web puede contener enlaces a sitios o servicios de terceros. VonuAI
          no controla ni responde por el contenido, disponibilidad, políticas,
          seguridad o prácticas de esos sitios externos.
        </p>

        <h2>8. Modificaciones</h2>

        <p>
          VonuAI podrá actualizar este aviso legal y el resto de documentos
          legales para adaptarlos a cambios normativos, técnicos, operativos o
          de producto. La versión vigente será la publicada en esta página.
        </p>

        <h2>9. Contacto</h2>

        <p>
          Para cualquier cuestión relacionada con este aviso legal, puedes
          escribir a <strong>legal@vonuai.com</strong>. Para consultas generales
          o soporte, puedes usar la página de contacto o escribir a{" "}
          <strong>hello@vonuai.com</strong>.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}