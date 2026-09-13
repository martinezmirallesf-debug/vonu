import Link from "next/link";

const productLinks = [
  { label: "Vonu Check", href: "/es/check" },
  { label: "Comprobar una web", href: "/comprobar-web-fiable" },
  { label: "Analizar una captura", href: "/analizar-captura-pantalla" },
  { label: "Analizar SMS sospechoso", href: "/analizar-sms-estafa" },
  { label: "Detectar perfil falso", href: "/detectar-perfil-falso" },
];

const trustLinks = [
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Precios", href: "/precios" },
  { label: "Contacto", href: "/contacto" },
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
    <footer className="border-t border-white/[0.08] bg-[#0b0e17] text-slate-300">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_.8fr_.7fr_.8fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">V</span>
            <span className="text-[20px] font-bold tracking-[-0.04em] text-white">VONU</span>
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-7 text-slate-500">
            Comprueba webs, capturas y mensajes antes de pagar, responder o compartir datos.
          </p>
          <Link
            href="/es/check"
            className="mt-5 inline-flex rounded-xl bg-emerald-400 px-4 py-2.5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300"
          >
            Analizar ahora
          </Link>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Analizar</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {productLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Vonu</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {trustLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Legal</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] px-4 py-5 text-center text-[12px] leading-6 text-slate-600">
        © {new Date().getFullYear()} Vonu · Análisis preventivo de señales de riesgo. Un resultado no certifica legitimidad ni fraude.
      </div>
    </footer>
  );
}
