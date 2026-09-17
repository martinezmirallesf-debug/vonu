"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import VonuMark from "./VonuMark";

const supported = new Set<SupportedLocale>(["es", "en", "fr", "de", "ar"]);
const cookies: Record<SupportedLocale, string> = {
  es: "Cookies",
  en: "Cookies",
  fr: "Cookies",
  de: "Cookies",
  ar: "ملفات تعريف الارتباط",
};

function localeFromPath(pathname: string): SupportedLocale {
  const first = pathname.split("/").filter(Boolean)[0] as SupportedLocale | undefined;
  return first && supported.has(first) ? first : "es";
}

export default function HomeFooter() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname || "/");
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
