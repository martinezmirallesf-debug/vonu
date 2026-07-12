import Link from "next/link";

const productLinks = [
  { label: "Producto", href: "/producto" },
  { label: "Casos de uso", href: "/casos-de-uso" },
  { label: "Precios", href: "/precios" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Contacto", href: "/contacto" },
];

const resourceLinks = [
  { label: "Recursos Vonu", href: "/recursos" },
  { label: "¿Es fiable?", href: "/es-fiable" },
  { label: "Analizar link sospechoso", href: "/analizar-link-sospechoso" },
  { label: "Comprobar inversión", href: "/comprobar-inversion-estafa" },
  { label: "Analizar SMS sospechoso", href: "/analizar-sms-estafa" },
  { label: "Email sospechoso", href: "/email-sospechoso-estafa" },
  { label: "Comprobar web fiable", href: "/comprobar-web-fiable" },
  { label: "Comprobar tienda online", href: "/comprobar-tienda-online" },
  { label: "Comprobar factura", href: "/comprobar-factura" },
  { label: "Revisar contrato", href: "/revisar-contrato" },
  { label: "Revisar contrato de alquiler", href: "/revisar-contrato-alquiler" },
  { label: "Detectar manipulación", href: "/detectar-manipulacion" },
  { label: "Detectar perfil falso", href: "/detectar-perfil-falso" },
  { label: "Analizar captura de pantalla", href: "/analizar-captura-pantalla" },
  { label: "Estafas con criptomonedas", href: "/estafas-criptomonedas" },
];

const legalLinks = [
  { label: "Aviso legal", href: "/legal/aviso-legal" },
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
];

export default function HomeFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-[#f8f9fa]">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.05fr_0.75fr_1.45fr_0.75fr] lg:px-8">
        <div>
          <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
            VonuAI
          </span>

          <p className="mt-4 max-w-sm text-[14px] leading-7 text-zinc-600">
            VonuAI ayuda a revisar decisiones importantes antes de firmar,
            pagar, contestar o decidir.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/chat"
              className="inline-flex rounded-full bg-zinc-950 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:scale-[1.02] active:scale-[0.99]"
            >
              Probar Vonu
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Producto
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Recursos
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600 sm:grid-cols-2 sm:gap-x-8">
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Legal
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-5 text-center text-[13px] text-zinc-500">
        © {new Date().getFullYear()} VonuAI. Orientación preventiva. No
        sustituye profesionales.
      </div>
    </footer>
  );
}