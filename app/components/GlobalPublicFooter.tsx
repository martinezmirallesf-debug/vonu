import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import VonuMark from "./VonuMark";

const cookies: Record<SupportedLocale, string> = {
  es: "Cookies",
  en: "Cookies",
  fr: "Cookies",
  de: "Cookies",
  ar: "ملفات تعريف الارتباط",
};

export default function GlobalPublicFooter({ locale }: { locale: SupportedLocale }) {
  const t = navCopy[locale];
  return (
    <footer className="border-t border-white/[0.055] bg-[#0b0e17]">
      <div className="mx-auto flex min-h-12 max-w-[1320px] flex-col items-center justify-between gap-3 px-4 py-3 text-[11px] text-slate-600 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <VonuMark className="h-5 w-5" />
          <span className="font-semibold tracking-[0.08em] text-slate-400">VONU</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/legal/aviso-legal" className="transition hover:text-slate-400">{t.legal}</Link>
          <Link href="/legal/privacidad" className="transition hover:text-slate-400">{t.privacy}</Link>
          <Link href="/legal/cookies" className="transition hover:text-slate-400">{cookies[locale]}</Link>
          <Link href="/legal/terminos" className="transition hover:text-slate-400">{t.terms}</Link>
          <Link href="/legal/uso-responsable" className="transition hover:text-slate-400">{t.responsible}</Link>
          <Link href={localizedPublicPath(locale, "contacto")} className="transition hover:text-slate-400">{t.contact}</Link>
        </div>
      </div>
    </footer>
  );
}
