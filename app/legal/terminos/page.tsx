import type { Metadata } from "next";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import LegalPage from "../../components/LegalPage";

const siteUrl = "https://vonuai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Términos y condiciones — Vonu",
  description:
    "Términos de Vonu: uso del servicio, comprobaciones de riesgo, cuentas, planes, pagos, cancelación y límites de responsabilidad.",
  alternates: { canonical: "/legal/terminos" },
  openGraph: {
    title: "Términos y condiciones — Vonu",
    description: "Condiciones generales de uso del servicio Vonu.",
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
    description: "Condiciones generales de uso del servicio Vonu.",
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
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Condiciones</p>
            <h1 className="mt-4 text-[50px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[82px]">Términos y condiciones.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Reglas claras para utilizar Vonu y entender qué significa una comprobación de riesgo.
            </p>
            <p className="mt-5 text-[13px] text-zinc-500">Última actualización: 16 de septiembre de 2026</p>
          </div>
        </div>
      </section>

      <LegalPage title="Términos y condiciones" description="Condiciones generales para acceder y utilizar Vonu.">
        <h2>1. Titular y aceptación</h2>
        <p>
          Estos términos regulan el uso de <strong>Vonu</strong>, disponible en vonuai.com y prestado por <strong>Francisco Luis Martínez Miralles</strong>. Al utilizar el servicio aceptas estos términos, la Política de privacidad, la Política de cookies y las normas de Uso responsable aplicables.
        </p>

        <h2>2. Qué ofrece Vonu</h2>
        <p>
          Vonu permite comprobar mensajes, textos, capturas de pantalla, enlaces y sitios web para identificar señales compatibles con fraude, phishing, suplantación, presión, manipulación u otros riesgos digitales.
        </p>
        <p>
          El resultado puede combinar modelos de inteligencia artificial, reglas internas, un catálogo de patrones de fraude y verificaciones técnicas de enlaces. La puntuación de 0 a 100 es un <strong>índice de riesgo</strong>; no representa una probabilidad matemática de que exista fraude y no sustituye una verificación oficial.
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

        <h2>6. Cuentas y seguridad</h2>
        <p>
          Algunas funciones pueden requerir una cuenta. Eres responsable de proteger tus credenciales y de avisarnos si detectas acceso no autorizado. Podemos limitar temporalmente el acceso cuando sea necesario para prevenir abuso, fraude, sobrecarga o riesgos de seguridad.
        </p>

        <h2>7. Planes y límites</h2>
        <p>
          Vonu puede ofrecer un nivel gratuito y planes de pago con límites, capacidades o funcionalidades diferentes. Las características vigentes, el precio, la periodicidad y los límites aplicables serán los mostrados en la página de precios y en la pantalla de contratación antes de confirmar el pago.
        </p>
        <p>
          Podemos cambiar la oferta para nuevas contrataciones. Los cambios que afecten a una suscripción ya contratada se comunicarán cuando la normativa o la naturaleza del cambio lo exijan.
        </p>

        <h2>8. Pagos, renovación y cancelación</h2>
        <p>
          Cuando estén habilitados los planes de pago, los cobros se procesarán mediante un proveedor especializado como Stripe. Vonu no necesita almacenar el número completo de tu tarjeta. Antes del pago se mostrará el importe, la periodicidad y la información fiscal aplicable.
        </p>
        <p>
          Las suscripciones periódicas se renovarán conforme al ciclo indicado en la contratación hasta que sean canceladas. La cancelación impedirá futuras renovaciones y, salvo que se indique otra cosa o resulte exigible legalmente, el acceso de pago continuará hasta el final del periodo ya abonado.
        </p>

        <h2>9. Desistimiento y reembolsos de consumidores</h2>
        <p>
          Si contratas como consumidor a distancia, dispondrás de los derechos de desistimiento y reembolso que establezca la normativa aplicable. Con carácter general en España y la Unión Europea, determinados contratos de servicios cuentan con un plazo legal de desistimiento, salvo las excepciones y condiciones previstas por la ley.
        </p>
        <p>
          La información concreta sobre inicio inmediato del servicio, desistimiento, reembolso y cualquier consentimiento que sea necesario se mostrará en el proceso de contratación. Estos términos no limitan derechos imperativos del consumidor.
        </p>

        <h2>10. Disponibilidad y cambios técnicos</h2>
        <p>
          Podemos modificar, mantener, sustituir o retirar funciones por motivos de seguridad, calidad, costes, proveedores o evolución del producto. Intentaremos evitar interrupciones innecesarias, pero no garantizamos disponibilidad ininterrumpida.
        </p>

        <h2>11. Propiedad intelectual</h2>
        <p>
          La marca Vonu, el diseño, software, reglas internas, estructura, textos propios y demás elementos originales del servicio pertenecen a sus respectivos titulares y están protegidos por la normativa aplicable.
        </p>

        <h2>12. Limitación de responsabilidad</h2>
        <p>
          Vonu no será responsable de decisiones adoptadas ignorando información relevante disponible fuera del servicio, de un uso contrario a estos términos o de daños atribuibles exclusivamente a servicios de terceros fuera de nuestro control. Nada de lo anterior excluye responsabilidad que legalmente no pueda excluirse.
        </p>

        <h2>13. Legislación y resolución de conflictos</h2>
        <p>
          Estos términos se interpretarán conforme a la normativa aplicable en España, sin perjuicio de las normas imperativas del país de residencia del consumidor cuando correspondan y de los fueros legalmente reconocidos a los consumidores.
        </p>

        <h2>14. Contacto y modificaciones</h2>
        <p>
          Puedes contactar con nosotros en <strong>legal@vonuai.com</strong>. La versión vigente de estos términos será la publicada en esta página con su fecha de actualización.
        </p>
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
