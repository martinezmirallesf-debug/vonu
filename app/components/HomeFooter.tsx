import Link from "next/link";
import VonuMark from "./VonuMark";

export default function HomeFooter() {
  return (
    <footer className="border-t border-white/[0.055] bg-[#0b0e17]/72">
      <div className="mx-auto flex min-h-12 max-w-[1320px] items-center justify-between gap-3 px-4 text-[11px] text-slate-600 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <VonuMark className="h-5 w-5" />
          <span className="font-semibold tracking-[0.08em] text-slate-400">VONU</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/legal/aviso-legal" className="transition hover:text-slate-400">Legal</Link>
          <Link href="/legal/privacidad" className="transition hover:text-slate-400">Privacidad</Link>
          <Link href="/legal/cookies" className="transition hover:text-slate-400">Cookies</Link>
          <Link href="/legal/terminos" className="transition hover:text-slate-400">Términos</Link>
        </div>
      </div>
    </footer>
  );
}
