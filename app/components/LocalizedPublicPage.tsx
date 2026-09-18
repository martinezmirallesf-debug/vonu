import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import type { IndexedPublicSlug } from "@/lib/vonu-global/i18n";
import {
  checkPath,
  getTopic,
  navCopy,
  templateCopy,
} from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import GlobalPublicHeader from "./GlobalPublicHeader";
import FunnelLink from "./FunnelLink";
import PlanCheckoutButton from "./PlanCheckoutButton";
import ResourceSignup from "./ResourceSignup";
import VonuMark from "./VonuMark";

const SITE_URL = "https://vonuai.com";

const pricingCopy: Record<SupportedLocale, {
  section: string;
  title: string;
  free: string;
  plus: string;
  max: string;
  freeText: string;
  plusText: string;
  maxText: string;
  start: string;
  choosePlus: string;
  chooseMax: string;
  perMonth: string;
}> = {
  es: { section: "Planes", title: "Elige cuánto margen necesitas", free: "Free", plus: "Plus", max: "Max", freeText: "Primer análisis y uso puntual para probar las comprobaciones de Vonu.", plusText: "Más comprobaciones de enlaces, mensajes y capturas para un uso frecuente.", maxText: "Mayor capacidad para un uso intensivo y más comprobaciones cada mes.", start: "Empezar gratis", choosePlus: "Elegir Plus", chooseMax: "Elegir Max", perMonth: "/ mes" },
  en: { section: "Plans", title: "Choose the capacity you need", free: "Free", plus: "Plus", max: "Max", freeText: "First analysis and occasional use to try Vonu checks.", plusText: "More link, message and screenshot checks for regular use.", maxText: "Higher capacity for intensive use and more checks each month.", start: "Start free", choosePlus: "Choose Plus", chooseMax: "Choose Max", perMonth: "/ month" },
  fr: { section: "Offres", title: "Choisissez la capacité dont vous avez besoin", free: "Free", plus: "Plus", max: "Max", freeText: "Première analyse et usage ponctuel pour découvrir les vérifications Vonu.", plusText: "Plus de vérifications de liens, messages et captures pour un usage régulier.", maxText: "Davantage de capacité pour un usage intensif et plus de vérifications chaque mois.", start: "Commencer gratuitement", choosePlus: "Choisir Plus", chooseMax: "Choisir Max", perMonth: "/ mois" },
  de: { section: "Pläne", title: "Wähle die Kapazität, die du brauchst", free: "Free", plus: "Plus", max: "Max", freeText: "Erste Analyse und gelegentliche Nutzung zum Testen der Vonu-Prüfungen.", plusText: "Mehr Link-, Nachrichten- und Screenshot-Prüfungen für regelmäßige Nutzung.", maxText: "Mehr Kapazität für intensive Nutzung und mehr Prüfungen pro Monat.", start: "Kostenlos starten", choosePlus: "Plus wählen", chooseMax: "Max wählen", perMonth: "/ Monat" },
  ar: { section: "الخطط", title: "اختر السعة التي تحتاجها", free: "مجاني", plus: "Plus", max: "Max", freeText: "التحليل الأول واستخدام محدود لتجربة فحوص Vonu.", plusText: "فحوص أكثر للروابط والرسائل ولقطات الشاشة للاستخدام المنتظم.", maxText: "سعة أكبر للاستخدام المكثف وعدد أكبر من الفحوص كل شهر.", start: "ابدأ مجانًا", choosePlus: "اختر Plus", chooseMax: "اختر Max", perMonth: "/ شهر" },
};

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function LocalizedPublicPage({
  locale,
  slug,
}: {
  locale: SupportedLocale;
  slug: IndexedPublicSlug;
}) {
  const topic = getTopic(locale, slug);
  const t = templateCopy[locale];
  const nav = navCopy[locale];
  const pageUrl = `${SITE_URL}${localizedPublicPath(locale, slug)}`;
  const isPricing = slug === "precios";
  const isResources = slug === "recursos";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: topic.title,
        description: topic.description,
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vonu", item: `${SITE_URL}${checkPath(locale)}` },
          { "@type": "ListItem", position: 2, name: topic.eyebrow, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: t.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const pc = pricingCopy[locale];

  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GlobalPublicHeader locale={locale} slug={slug} />

      <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[#080b12]" />
        <div className="pointer-events-none absolute left-1/2 top-[-210px] -z-10 h-[660px] w-[960px] -translate-x-1/2 rounded-full bg-sky-500/[0.10] blur-[130px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[330px] -z-10 h-[460px] w-[460px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{topic.eyebrow}</p>
            <h1 className="mx-auto mt-5 max-w-[1050px] text-[48px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[74px] sm:leading-[0.94] lg:text-[90px]">
              {topic.hero}
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">{topic.description}</p>
            <p className="mx-auto mt-4 max-w-[740px] text-[14px] leading-7 text-slate-500">{t.intro}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <FunnelLink href={checkPath(locale)} event="localized_primary_cta" properties={{ locale, slug }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:-translate-y-0.5 hover:bg-emerald-300">
                {t.cta} <Arrow />
              </FunnelLink>
              {!isPricing && (
                <FunnelLink href={localizedPublicPath(locale, "precios")} event="localized_pricing_cta" properties={{ locale, slug }} className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-6 text-[14px] font-semibold text-slate-200 transition hover:bg-white/[0.07]">
                  {t.ctaSecondary}
                </FunnelLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {isPricing && (
        <section className="border-b border-white/[0.06] bg-[#0a0d15]">
          <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{pc.section}</p>
              <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{pc.title}</h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <article className="flex min-h-[360px] flex-col rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{pc.free}</p>
                <p className="mt-7 text-[52px] font-semibold tracking-[-0.07em] text-white">0€</p>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{pc.freeText}</p>
                <FunnelLink href={checkPath(locale)} event="pricing_free_selected" properties={{ locale }} className="mt-auto inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[14px] font-bold text-white">{pc.start}</FunnelLink>
              </article>

              <article className="relative flex min-h-[360px] flex-col rounded-[26px] border border-emerald-400/30 bg-emerald-400/[0.055] p-6 shadow-[0_26px_80px_rgba(16,185,129,.08)]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{pc.plus}</p>
                <div className="mt-7 flex items-end gap-2"><span className="text-[52px] font-semibold tracking-[-0.07em] text-white">9,99€</span><span className="pb-2 text-[12px] text-slate-500">{pc.perMonth}</span></div>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{pc.plusText}</p>
                <PlanCheckoutButton plan="plus" locale={locale} label={pc.choosePlus} className="mt-auto h-12 w-full rounded-xl bg-emerald-400 px-5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300" />
              </article>

              <article className="flex min-h-[360px] flex-col rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{pc.max}</p>
                <div className="mt-7 flex items-end gap-2"><span className="text-[52px] font-semibold tracking-[-0.07em] text-white">19,99€</span><span className="pb-2 text-[12px] text-slate-500">{pc.perMonth}</span></div>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{pc.maxText}</p>
                <PlanCheckoutButton plan="max" locale={locale} label={pc.chooseMax} className="mt-auto h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[14px] font-bold text-white transition hover:bg-white/[0.07]" />
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.reviewEyebrow}</p>
              <h2 className="mt-4 max-w-[680px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{t.reviewTitle}</h2>
            </div>
            <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">{topic.description}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {t.reviewItems.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6">
                <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-white">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.processEyebrow}</p>
          <h2 className="mt-4 max-w-[820px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{t.processTitle}</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {t.processItems.map((item) => (
              <article key={item.title} className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6">
                <h3 className="text-[20px] font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.proofEyebrow}</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{t.proofTitle}</h2>
          </div>
          <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.03] p-7">
            <p className="text-[17px] leading-8 text-slate-300">{t.proofText}</p>
            <p className="mt-5 text-[12px] leading-6 text-slate-500">{t.disclaimer}</p>
          </div>
        </div>
      </section>

      {isResources && <ResourceSignup locale={locale} page={localizedPublicPath(locale, slug)} />}

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.faqEyebrow}</p>
            <h2 className="mt-4 text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{t.faqTitle}</h2>
          </div>
          <div className="mt-10 space-y-3">
            {t.faq.map((item) => (
              <details key={item.q} className="group rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-[17px] font-semibold text-slate-100 sm:text-[19px]">{item.q}</span>
                    <span className="text-[30px] font-light text-slate-500 transition group-open:rotate-45 group-open:text-emerald-300">+</span>
                  </div>
                </summary>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0d15]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.08] blur-[120px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[70px]">{topic.hero}</h2>
            <FunnelLink href={checkPath(locale)} event="localized_final_cta" properties={{ locale, slug }} className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-[14px] font-bold text-[#07110d]">{t.cta} <Arrow /></FunnelLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.055] bg-[#0b0e17]">
        <div className="mx-auto flex min-h-12 max-w-[1320px] flex-col items-center justify-between gap-3 px-4 py-3 text-[11px] text-slate-600 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-500"><VonuMark className="h-5 w-5" /><span className="font-semibold tracking-[0.08em] text-white">Vonu</span></div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/legal/aviso-legal" className="transition hover:text-slate-400">{nav.legal}</Link>
            <Link href="/legal/privacidad" className="transition hover:text-slate-400">{nav.privacy}</Link>
            <Link href="/legal/cookies" className="transition hover:text-slate-400">Cookies</Link>
            <Link href="/legal/terminos" className="transition hover:text-slate-400">{nav.terms}</Link>
            <Link href="/legal/uso-responsable" className="transition hover:text-slate-400">{nav.responsible}</Link>
            <Link href={localizedPublicPath(locale, "contacto")} className="transition hover:text-slate-400">{nav.contact}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
