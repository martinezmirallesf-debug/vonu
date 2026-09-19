"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import { legalPath } from "@/lib/vonu-legal/routes";
import VonuMark from "./VonuMark";

const supported = new Set<SupportedLocale>(["es", "en", "fr", "de", "ar"]);
const cookies: Record<SupportedLocale, string> = {
  es: "Cookies",
  en: "Cookies",
  fr: "Cookies",
  de: "Cookies",
  ar: "ملفات تعريف الارتباط",
};
const mobileLabels: Record<SupportedLocale, { legal: string; privacy: string; terms: string }> = {
  es: { legal: "Legal", privacy: "Privacidad", terms: "Términos" },
  en: { legal: "Legal", privacy: "Privacy", terms: "Terms" },
  fr: { legal: "Légal", privacy: "Vie privée", terms: "Conditions" },
  de: { legal: "Legal", privacy: "Datenschutz", terms: "Bedingungen" },
  ar: { legal: "قانوني", privacy: "الخصوصية", terms: "الشروط" },
};

function localeFromPath(pathname: string): SupportedLocale {
  const first = pathname.split("/").filter(Boolean)[0] as SupportedLocale | undefined;
  return first && supported.has(first) ? first : "es";
}

export default function HomeFooter() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname || "/");
  const t = navCopy[locale];
  const short = mobileLabels[locale];

  return (
    <footer className="border-t border-white/[0.055] bg-[#0b0e17]">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-10 items-center justify-center whitespace-nowrap text-[9px] font-medium text-slate-500 md:hidden">
          <span className="text-slate-400">© Vonu</span>
          <span className="mx-1.5 text-slate-700">·</span>
          <Link href={legalPath(locale, "legal-notice")} className="transition hover:text-slate-300">{short.legal}</Link>
          <span className="mx-1.5 text-slate-700">·</span>
          <Link href={legalPath(locale, "privacy")} className="transition hover:text-slate-300">{short.privacy}</Link>
          <span className="mx-1.5 text-slate-700">·</span>
          <Link href={legalPath(locale, "terms")} className="transition hover:text-slate-300">{short.terms}</Link>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
