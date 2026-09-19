import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import { legalPath } from "@/lib/vonu-legal/routes";
import VonuMark from "./VonuMark";
import VonuSocialLinks from "./VonuSocialLinks";

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
    <footer className="bg-[#0b0e17]">
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6 lg:px-8">
        <div dir="ltr" className="flex h-11 items-center justify-between gap-2 whitespace-nowrap text-[9px] font-medium text-slate-500 md:hidden">
          <div className="flex shrink-0 items-center gap-1.5">
            <VonuMark className="h-[18px] w-[18px]" />
            <span className="font-semibold tracking-[0.06em] text-white">Vonu</span>
          </div>
          <div className="flex min-w-0 shrink-0 items-center gap-2.5">
            <Link href={legalPath(locale, "legal-notice")} className="transition hover:text-slate-300">{t.legal}</Link>
            <Link href={legalPath(locale, "privacy")} className="transition hover:text-slate-300">{t.privacy}</Link>
            <Link href={legalPath(locale, "terms")} className="transition hover:text-slate-300">{t.terms}</Link>
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
