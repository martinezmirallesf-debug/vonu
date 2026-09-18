import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";
import { legalAlternates } from "@/lib/vonu-legal/routes";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aviso legal — Vonu",
  description:
    "Aviso legal de Vonu: titularidad, objeto del servicio, propiedad intelectual, límites de responsabilidad y contacto.",
  alternates: { canonical: "/legal/aviso-legal", languages: legalAlternates("legal-notice") },
  openGraph: {
    title: "Aviso legal — Vonu",
    description: "Información legal sobre la titularidad y el uso de Vonu.",
    url: `${siteUrl}/legal/aviso-legal`,
    siteName: "Vonu",
    locale: "es_ES",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AvisoLegalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/aviso-legal#webpage`,
    url: `${siteUrl}/legal/aviso-legal`,
    name: "Aviso legal — Vonu",
    description: "Información legal sobre la titularidad y el uso de Vonu.",
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "Vonu", url: siteUrl },
  };

  return (
    <main className="min-h-screen bg-[#0d101b] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHeader />

      <LegalPage locale="es" title="Aviso legal" description="Información legal del servicio Vonu y del sitio vonuai.com.">
        <h2>1. Titularidad del servicio</h2>
        <p>
          Este sitio web y el servicio <strong>Vonu</strong>, disponible en <strong>vonuai.com</strong>, son titularidad de <strong>Francisco Luis Martínez Miralles</strong>.
        </p>
        <ul>
          <li><strong>Titular:</strong> Francisco Luis Martínez Miralles</li>
          <li><strong>NIF:</strong> 74235561W</li>
          <li><strong>Domicilio de contacto:</strong> Calle Velarde, 55, 03203 Elche, Alicante, España</li>
          <li><strong>Email general:</strong> hello@vonuai.com</li>
          <li><strong>Email legal:</strong> legal@vonuai.com</li>
          <li><strong>Dominio:</strong> vonuai.com y sus subdominios asociados</li>
        </ul>

        <h2>2. Objeto de Vonu</h2>
        <p>
          Vonu es una herramienta de comprobación preventiva que ayuda a revisar mensajes, capturas de pantalla, enlaces y sitios web antes de confiar, responder, facilitar datos o realizar un pago.
        </p>
        <p>
          El servicio combina análisis automatizado, modelos de inteligencia artificial, reglas internas de detección y, para determinados enlaces, comprobaciones técnicas y de reputación. Sus resultados describen señales observadas y un índice de riesgo orientativo; no certifican que una persona, empresa, mensaje o web sea legítima o fraudulenta.
        </p>

        <h2>3. Acceso y uso</h2>
        <p>
          El usuario debe utilizar Vonu de forma lícita y responsable, respetando la normativa aplicable y los derechos de terceros. No está permitido utilizar el servicio para fraude, suplantación, abuso, obtención indebida de credenciales, ataque a sistemas o vulneración de derechos de terceros.
        </p>

        <h2>4. Límites del servicio</h2>
        <p>
          Vonu puede cometer errores, no disponer de contexto suficiente o no detectar amenazas nuevas. Una puntuación baja no constituye una garantía de seguridad y una puntuación alta no constituye por sí sola una prueba de delito o fraude.
        </p>
        <p>
          Si existe una pérdida económica, una posible suplantación, acceso no autorizado, amenaza o cualquier situación urgente, el usuario debe recurrir también al banco, plataforma, proveedor, autoridad o profesional competente según el caso.
        </p>

        <h2>5. Propiedad intelectual e industrial</h2>
        <p>
          La marca, diseño, textos propios, software, estructura, elementos visuales y demás materiales originales de Vonu están protegidos por la normativa aplicable. El uso del servicio no transfiere al usuario derechos de propiedad sobre esos elementos.
        </p>
        <p>
          El usuario mantiene los derechos que le correspondan sobre el contenido que aporta y autoriza únicamente el tratamiento necesario para prestar las funciones solicitadas, de acuerdo con los Términos y la Política de privacidad.
        </p>

        <h2>6. Servicios y fuentes de terceros</h2>
        <p>
          Algunas funciones dependen de proveedores tecnológicos, servicios de inteligencia artificial, infraestructura, bases de datos o fuentes técnicas de terceros. Vonu no controla la disponibilidad permanente de esos servicios ni puede garantizar que sus datos estén siempre completos o actualizados.
        </p>

        <h2>7. Responsabilidad</h2>
        <p>
          Vonu aplica medidas razonables para ofrecer resultados útiles y comprensibles, pero no garantiza exactitud absoluta, disponibilidad ininterrumpida ni ausencia total de errores. El usuario debe valorar el contexto y verificar por canales oficiales antes de realizar acciones sensibles.
        </p>
        <p>
          Nada de lo indicado en este aviso excluye o limita derechos o responsabilidades que no puedan excluirse conforme a la legislación aplicable.
        </p>

        <h2>8. Legislación y consumidores</h2>
        <p>
          Este sitio se gestiona desde España. La relación con los usuarios se regirá por la normativa aplicable, sin perjuicio de las normas imperativas de protección de consumidores y de los fueros que correspondan legalmente al usuario.
        </p>

        <h2>9. Actualizaciones</h2>
        <p>
          Este aviso puede actualizarse para reflejar cambios legales, técnicos o de producto. La versión vigente será la publicada en esta página con su fecha de actualización.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para cuestiones legales puedes escribir a <strong>legal@vonuai.com</strong>. Para soporte o consultas generales, utiliza <strong>hello@vonuai.com</strong> o la página de contacto.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
