import Link from "next/link";
import VonuMark from "./VonuMark";

const productLinks = [
  { label: "Vonu Check", href: "/check" },
  { label: "Comprobar una web", href: "/comprobar-web-fiable" },
  { label: "Comprobar tienda online", href: "/comprobar-tienda-online" },
  { label: "Analizar enlace sospechoso", href: "/analizar-link-sospechoso" },
  { label: "Analizar una captura", href: "/analizar-captura-pantalla" },
  { label: "SMS o WhatsApp sospechoso", href: "/analizar-sms-estafa" },
  { label: "Email sospechoso", href: "/email-sospechoso-estafa" },
  { label: "Detectar perfil falso", href: "/detectar-perfil-falso" },
];

const trustLinks = [
  { label: "Producto", href: "/producto" },
  { label: "Casos de uso", href: "/casos-de-uso" },
  { label: "Recursos", href: "/recursos" },
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
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_1fr_.75fr_.75fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <VonuMark className="h-7 w-7" framed />
            <span className="text-[20px] font-semibold tracking-[-0.04em] text-white">VONU</span>
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-7 text-slate-500">
            Comprueba webs, capturas y mensajes antes de pagar, responder o compartir datos.
          </p>
          <Link href="/check" className="mt-5 inline-flex rounded-xl bg-emerald-400 px-4 py-2.5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300">
            Analizar ahora
          </Link>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Analizar</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {productLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">{link.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Vonu</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {trustLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">{link.label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.13em] text-slate-500">Legal</h3>
          <div className="mt-4 grid gap-3 text-[14px]">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-slate-400 transition hover:text-white">{link.label}</Link>
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
