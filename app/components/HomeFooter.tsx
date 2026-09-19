"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import { legalPath } from "@/lib/vonu-legal/routes";
import VonuMark from "./VonuMark";
import VonuSocialLinks from "./VonuSocialLinks";

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
    <footer className="bg-[#0b0e17]">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2.5 py-3 text-[10px] font-medium text-slate-500 md:hidden">
          <div className="flex items-center gap-2">
            <VonuMark className="h-5 w-5" />
            <span className="font-semibold tracking-[0.08em] text-white">Vonu</span>
          </div>
          <div className="flex max-w-[370px] flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 leading-4">
            <Link href={legalPath(locale, "legal-notice")} className="transition hover:text-slate-300">{t.legal}</Link>
            <Link href={legalPath(locale, "privacy")} className="transition hover:text-slate-300">{t.privacy}</Link>
            <Link href={legalPath(locale, "cookies")} className="transition hover:text-slate-300">{cookies[locale]}</Link>
            <Link href={legalPath(locale, "terms")} className="transition hover:text-slate-300">{t.terms}</Link>
            <Link href={legalPath(locale, "responsible-use")} className="transition hover:text-slate-300">{t.responsible}</Link>
            <Link href={localizedPublicPath(locale, "contacto")} className="transition hover:text-slate-300">{t.contact}</Link>
          </div>
        </div>

        <div className="hidden min-h-12 items-center justify-between gap-5 py-3 text-[11px] text-slate-600 md:flex">
          <div className="flex shrink-0 items-center gap-2 text-slate-500">
            <VonuMark className="h-5 w-5" />
            <span className="font-semibold tracking-[0.08em] text-white">Vonu</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
            <Link href={legalPath(locale, "legal-notice")} className="transition hover:text-slate-400">{t.legal}</Link>
            <Link href={legalPath(locale, "privacy")} className="transition hover:text-slate-400">{t.privacy}</Link>
            <Link href={legalPath(locale, "cookies")} className="transition hover:text-slate-400">{cookies[locale]}</Link>
            <Link href={legalPath(locale, "terms")} className="transition hover:text-slate-400">{t.terms}</Link>
            <Link href={legalPath(locale, "responsible-use")} className="transition hover:text-slate-400">{t.responsible}</Link>
            <Link href={localizedPublicPath(locale, "contacto")} className="transition hover:text-slate-400">{t.contact}</Link>
            <VonuSocialLinks variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
