import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { checkPath, getTopic } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import {
  getIntentContent,
  intentLabels,
  type IntentSlug,
} from "@/lib/vonu-global/intent-content";
import GlobalPublicHeader from "./GlobalPublicHeader";
import FunnelLink from "./FunnelLink";
import HomeFooter from "./HomeFooter";

const SITE_URL = "https://vonuai.com";

const ui: Record<SupportedLocale, {
  home: string;
  signalsEyebrow: string;
  stepsEyebrow: string;
  faqEyebrow: string;
  relatedEyebrow: string;
  finalTitle: string;
}> = {
  es: { home: "Vonu", signalsEyebrow: "Qué comprobar", stepsEyebrow: "Siguiente paso", faqEyebrow: "FAQ", relatedEyebrow: "Explora", finalTitle: "Comprueba las señales antes de actuar." },
  en: { home: "Vonu", signalsEyebrow: "What to check", stepsEyebrow: "Next step", faqEyebrow: "FAQ", relatedEyebrow: "Explore", finalTitle: "Check the signals before you act." },
  fr: { home: "Vonu", signalsEyebrow: "À vérifier", stepsEyebrow: "Étape suivante", faqEyebrow: "FAQ", relatedEyebrow: "Explorer", finalTitle: "Vérifiez les signaux avant d’agir." },
  de: { home: "Vonu", signalsEyebrow: "Was prüfen", stepsEyebrow: "Nächster Schritt", faqEyebrow: "FAQ", relatedEyebrow: "Entdecken", finalTitle: "Prüfe die Signale, bevor du handelst." },
  ar: { home: "Vonu", signalsEyebrow: "ما الذي تتحقق منه", stepsEyebrow: "الخطوة التالية", faqEyebrow: "الأسئلة الشائعة", relatedEyebrow: "استكشف", finalTitle: "تحقق من الإشارات قبل أن تتصرف." },
};

export default function IntentPublicPage({ locale, slug }: { locale: SupportedLocale; slug: IntentSlug }) {
  const topic = getTopic(locale, slug);
  const content = getIntentContent(locale, slug);
  const labels = intentLabels[locale];
  const t = ui[locale];
  const pagePath = localizedPublicPath(locale, slug);
  const pageUrl = `${SITE_URL}${pagePath}`;

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
        about: {
          "@type": "Thing",
          name: topic.eyebrow,
        },
        mainEntity: { "@id": `${pageUrl}#signals` },
        potentialAction: {
          "@type": "UseAction",
          target: `${SITE_URL}${checkPath(locale)}`,
          object: { "@id": `${SITE_URL}/#vonu-check` },
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#signals`,
        name: content.signalsTitle,
        numberOfItems: content.signals.length,
        itemListElement: content.signals.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vonu", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: topic.eyebrow, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: content.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[#080b12] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GlobalPublicHeader locale={locale} slug={slug} />

      <section className="overflow-hidden border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="mx-auto max-w-[1000px] text-[12px] text-slate-600">
            <a href={checkPath(locale)} className="transition hover:text-slate-300">{t.home}</a>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-slate-500">{topic.eyebrow}</span>
          </nav>

          <div className="mx-auto mt-12 max-w-[1040px] text-center sm:mt-16">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{topic.eyebrow}</p>
            <h1 className="mx-auto mt-5 max-w-[1050px] text-[48px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[72px] sm:leading-[0.95] lg:text-[86px]">
              {topic.hero}
            </h1>
            <p className="mx-auto mt-7 max-w-[800px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">{topic.description}</p>
          </div>

          <article id="answer" className="mx-auto mt-10 max-w-[900px] rounded-[28px] border border-sky-300/15 bg-sky-400/[0.055] p-6 text-start shadow-[0_24px_80px_rgba(14,116,144,.06)] sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300">{labels.answer}</p>
            <p className="mt-4 text-[18px] leading-8 text-slate-200 sm:text-[20px] sm:leading-9">{content.answer}</p>
          </article>

          <div className="mt-8 flex justify-center">
            <FunnelLink
              href={checkPath(locale)}
              event="intent_answer_cta"
              properties={{ locale, slug }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-6 text-[14px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.20)] transition hover:-translate-y-0.5 hover:bg-[#a3ceff] hover:shadow-[0_14px_34px_rgba(123,183,255,.24)] active:translate-y-0"
            >
              {labels.cta} <span aria-hidden="true">→</span>
            </FunnelLink>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1180px] px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.signalsEyebrow}</p>
          <h2 className="mt-4 max-w-[820px] text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[58px]">{content.signalsTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {content.signals.map((item, index) => (
              <article key={item} className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-400/[0.08] text-[12px] font-bold text-sky-300">{index + 1}</span>
                  <p className="text-[15px] leading-7 text-slate-300">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[1180px] px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.stepsEyebrow}</p>
          <h2 className="mt-4 max-w-[820px] text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[58px]">{content.stepsTitle}</h2>
          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {content.steps.map((item, index) => (
              <li key={item} className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-sky-300">0{index + 1}</p>
                <p className="mt-4 text-[15px] leading-7 text-slate-300">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:items-center">
          <h2 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.05em] text-white sm:text-[46px]">{labels.cautionTitle}</h2>
          <div className="rounded-[24px] border border-amber-300/10 bg-amber-300/[0.035] p-6">
            <p className="text-[15px] leading-7 text-slate-300">{labels.caution}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.faqEyebrow}</p>
            <h2 className="mt-4 text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[58px]">{labels.faq}</h2>
          </div>
          <div className="mt-10 space-y-3">
            {content.faqs.map((item) => (
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

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto max-w-[1180px] px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.relatedEyebrow}</p>
          <h2 className="mt-4 text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[54px]">{labels.related}</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {content.related.map((relatedSlug) => {
              const related = getTopic(locale, relatedSlug);
              return (
                <Link key={relatedSlug} href={localizedPublicPath(locale, relatedSlug)} className="group rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/[0.045]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-300">{related.eyebrow}</p>
                  <h3 className="mt-3 text-[20px] font-semibold leading-7 text-white">{related.hero}</h3>
                  <p className="mt-4 text-[13px] leading-6 text-slate-500 transition group-hover:text-slate-400">{related.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#080b12]">
        <div className="mx-auto max-w-[1000px] px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <h2 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[68px]">{t.finalTitle}</h2>
          <FunnelLink
            href={checkPath(locale)}
            event="intent_final_cta"
            properties={{ locale, slug }}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-6 text-[14px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.20)] transition hover:-translate-y-0.5 hover:bg-[#a3ceff] hover:shadow-[0_14px_34px_rgba(123,183,255,.24)] active:translate-y-0"
          >
            {labels.cta} <span aria-hidden="true">→</span>
          </FunnelLink>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
