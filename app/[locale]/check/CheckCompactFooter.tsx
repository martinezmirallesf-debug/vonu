import Link from "next/link";
import VonuMark from "@/app/components/VonuMark";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { navCopy } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";

const privacyLabel: Record<SupportedLocale, string> = {
  es: "Privacidad",
  en: "Privacy",
  fr: "Confidentialité",
  de: "Datenschutz",
  ar: "الخصوصية",
};

const legalLabel: Record<SupportedLocale, string> = {
  es: "Legal",
  en: "Legal",
  fr: "Mentions légales",
  de: "Rechtliches",
  ar: "قانوني",
};

const cookiesLabel: Record<SupportedLocale, string> = {
  es: "Cookies",
  en: "Cookies",
  fr: "Cookies",
  de: "Cookies",
  ar: "ملفات الارتباط",
};

const termsLabel: Record<SupportedLocale, string> = {
  es: "Términos",
  en: "Terms",
  fr: "Conditions",
  de: "Bedingungen",
  ar: "الشروط",
};

export default function CheckCompactFooter({ locale }: { locale: SupportedLocale }) {
  const nav = navCopy[locale];
  return (
    <footer className="vonu-check-compact-footer border-t border-white/[0.055] bg-[#0b0e17]/72">
      <div className="mx-auto flex min-h-12 max-w-[1320px] items-center justify-between gap-3 px-4 text-[11px] text-slate-600 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <VonuMark className="h-5 w-5" />
          <span className="font-semibold tracking-[0.08em] text-slate-400">VONU</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <Link href={localizedPublicPath(locale, "producto")} className="hidden transition hover:text-slate-400 sm:inline">{nav.product}</Link>
          <Link href={localizedPublicPath(locale, "casos-de-uso")} className="hidden transition hover:text-slate-400 sm:inline">{nav.cases}</Link>
          <Link href="/legal/aviso-legal" className="transition hover:text-slate-400">{legalLabel[locale]}</Link>
          <Link href="/legal/privacidad" className="transition hover:text-slate-400">{privacyLabel[locale]}</Link>
          <Link href="/legal/cookies" className="transition hover:text-slate-400">{cookiesLabel[locale]}</Link>
          <Link href="/legal/terminos" className="transition hover:text-slate-400">{termsLabel[locale]}</Link>
        </div>
      </div>
    </footer>
  );
}
