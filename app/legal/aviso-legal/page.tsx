import type { Metadata } from "next";
import type { ReactNode } from "react";
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

type GradientTone = "blueCyan" | "blueGreen" | "purplePink";

const gradientMap: Record<GradientTone, string> = {
  blueCyan: "linear-gradient(90deg, #1A73E8 0%, #06B6D4 100%)",
  blueGreen: "linear-gradient(90deg, #0A84FF 0%, #22C55E 100%)",
  purplePink: "linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)",
};

function GradientText({
  children,
  tone,
}: {
  children: ReactNode;
  tone: GradientTone;
}) {
  return (
    <span
      className="inline align-baseline"
      style={{
        backgroundImage: gradientMap[tone],
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

const legalHighlights = [
  {
    title: "Titularidad",
    text: "Información sobre el titular del servicio, nombre comercial y canales de contacto.",
  },
  {
    title: "Uso responsable",
    text: "Condiciones básicas para acceder y utilizar VonuAI de forma lícita y adecuada.",
  },
  {
    title: "Límites del servicio",
    text: "VonuAI ofrece orientación preventiva, pero no sustituye a profesionales cualificados.",
  },
];

export default function AvisoLegalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/legal/aviso-legal#webpage`,
    url: `${siteUrl}/legal/aviso-legal`,
    name: "Aviso legal — VonuAI",
    description:
      "Aviso legal de VonuAI con información sobre titularidad, condiciones de acceso, propiedad intelectual, responsabilidades y contacto legal.",
    inLanguage: "es-ES",
    isPartOf: {
      "@type": "WebSite",
      name: "VonuAI",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHeader />

      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Legal
            </p>

            <h1 className="mx-auto mt-4 max-w-[1040px] text-[48px] font-semibold leading-[1.02] tracking-[-0.065em] text-zinc-950 sm:text-[86px] sm:leading-[0.94] sm:tracking-[-0.078em] lg:text-[118px]">
              Aviso
              <span className="block text-zinc-500">
                <GradientText tone="blueCyan">legal.</GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-zinc-600 sm:text-[21px]">
              Información básica sobre el titular de VonuAI, el uso de la web,
              las condiciones generales de acceso y los límites responsables del
              servicio.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-14 md:grid-cols-3">
            {legalHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[34px] border border-zinc-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_40px_rgba(0,0,0,0.055)]"
              >
                <h2 className="text-[30px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
                  {item.title === "Titularidad" ? (
                    <GradientText tone="blueCyan">Titularidad</GradientText>
                  ) : item.title === "Uso responsable" ? (
                    <GradientText tone="blueGreen">Uso responsable</GradientText>
                  ) : (
                    <GradientText tone="purplePink">Límites del servicio</GradientText>
                  )}
                </h2>

                <p className="mt-5 text-[15px] leading-7 text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
            <strong>Dominios asociados:</strong> vonuai.com y sus subdominios
            asociados
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
          debe valorar la información recibida, contrastarla cuando sea necesario
          y tomar sus propias decisiones con responsabilidad.
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
          legales para adaptarlos a cambios normativos, técnicos, operativos o de
          producto. La versión vigente será la publicada en esta página.
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