import type { ReactNode } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { checkPath } from "@/lib/vonu-global/i18n";
import { legalPath, type LegalDocument } from "@/lib/vonu-legal/routes";
import BrandedHeadlineText from "./BrandedHeadlineText";

type LegalPageProps = {
  title: string;
  description: string;
  locale?: SupportedLocale;
  updatedAt?: string;
  children: ReactNode;
};

const legalLabels: Record<SupportedLocale, Record<LegalDocument, string>> = {
  es: { "legal-notice": "Aviso legal", privacy: "Privacidad", terms: "Términos", cookies: "Cookies", "responsible-use": "Uso responsable" },
  en: { "legal-notice": "Legal notice", privacy: "Privacy", terms: "Terms", cookies: "Cookies", "responsible-use": "Responsible use" },
  fr: { "legal-notice": "Mentions légales", privacy: "Confidentialité", terms: "Conditions", cookies: "Cookies", "responsible-use": "Usage responsable" },
  de: { "legal-notice": "Impressum", privacy: "Datenschutz", terms: "Bedingungen", cookies: "Cookies", "responsible-use": "Verantwortungsvolle Nutzung" },
  ar: { "legal-notice": "إشعار قانوني", privacy: "الخصوصية", terms: "الشروط", cookies: "ملفات تعريف الارتباط", "responsible-use": "الاستخدام المسؤول" },
};

const backLabels: Record<SupportedLocale, string> = {
  es: "Volver a Vonu Check",
  en: "Back to Vonu Check",
  fr: "Retour à Vonu Check",
  de: "Zurück zu Vonu Check",
  ar: "العودة إلى Vonu Check",
};

const legalBadges: Record<SupportedLocale, string> = {
  es: "Legal",
  en: "Legal",
  fr: "Juridique",
  de: "Rechtliches",
  ar: "قانوني",
};

export default function LegalPage({
  title,
  description,
  locale = "es",
  updatedAt = "Última actualización: septiembre de 2026",
  children,
}: LegalPageProps) {
  const legalLinks = (Object.keys(legalLabels[locale]) as LegalDocument[]).map((document) => ({
    label: legalLabels[locale][document],
    href: legalPath(locale, document),
  }));

  return (
    <section lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0d101b] text-slate-200">
      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.30fr_0.70fr] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {legalBadges[locale]} · Vonu
            </div>

            <h1 className="mt-5 max-w-xl text-[42px] font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-[58px]">
              {locale === "es" ? title : <BrandedHeadlineText text={title} />}
            </h1>

            <p className="mt-5 max-w-md text-[16px] leading-7 text-slate-400">
              {description}
            </p>

            <p className="mt-4 text-[12px] text-slate-600">{updatedAt}</p>

            <nav className="mt-7 grid gap-1 rounded-[22px] border border-white/[0.08] bg-[#141927] p-2 text-[14px]">
              {legalLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href={checkPath(locale)}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300"
            >
              {backLabels[locale]}
            </a>
          </aside>

          <article className="rounded-[28px] border border-white/[0.08] bg-[#141927] p-5 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-8 lg:p-10">
            <div className="prose prose-invert max-w-none prose-headings:tracking-[-0.035em] prose-h2:mt-10 prose-h2:text-[28px] prose-h2:leading-tight prose-h2:text-white prose-h3:text-[20px] prose-h3:text-slate-100 prose-p:text-[15px] prose-p:leading-7 prose-p:text-slate-400 prose-li:text-[15px] prose-li:leading-7 prose-li:text-slate-400 prose-strong:text-slate-100 prose-a:text-emerald-300 prose-a:no-underline hover:prose-a:text-emerald-200">
              {children}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
