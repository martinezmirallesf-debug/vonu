import type { SupportedLocale } from "@/lib/vonu-check/types";
import type { IndexedPublicSlug } from "@/lib/vonu-global/i18n";
import {
  checkPath,
  getTopic,
  templateCopy,
} from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import GlobalPublicHeader from "./GlobalPublicHeader";
import FunnelLink from "./FunnelLink";
import PlanCheckoutButton from "./PlanCheckoutButton";
import ResourceSignup from "./ResourceSignup";
import GlobalPublicFooter from "./GlobalPublicFooter";

const SITE_URL = "https://vonuai.com";

const DOCUMENT_RESOURCE_SLUGS: IndexedPublicSlug[] = [
  "revisar-contrato",
  "revisar-contrato-alquiler",
  "comprobar-factura",
  "revisar-presupuesto",
  "revisar-contrato-servicios",
  "revisar-prestamo-financiacion",
];

const resourceDocumentCopy: Record<SupportedLocale, { eyebrow: string; title: string; intro: string }> = {
  es: {
    eyebrow: "Documentos",
    title: "Revisa antes de firmar o pagar.",
    intro: "Contratos, alquileres, facturas, presupuestos, servicios y financiación con una ruta directa al análisis de documentos.",
  },
  en: {
    eyebrow: "Documents",
    title: "Review before you sign or pay.",
    intro: "Contracts, rentals, invoices, quotes, services and financing with a direct path to document analysis.",
  },
  fr: {
    eyebrow: "Documents",
    title: "Vérifiez avant de signer ou payer.",
    intro: "Contrats, locations, factures, devis, services et financement avec un accès direct à l’analyse documentaire.",
  },
  de: {
    eyebrow: "Dokumente",
    title: "Prüfen, bevor du unterschreibst oder zahlst.",
    intro: "Verträge, Miete, Rechnungen, Angebote, Dienstleistungen und Finanzierung mit direktem Zugang zur Dokumentprüfung.",
  },
  ar: {
    eyebrow: "المستندات",
    title: "راجع قبل التوقيع أو الدفع.",
    intro: "العقود والإيجار والفواتير وعروض الأسعار والخدمات والتمويل مع وصول مباشر إلى تحليل المستندات.",
  },
};

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

      <section className="overflow-hidden border-b border-white/[0.06] bg-[#080b12]">

        <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-[1020px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{topic.eyebrow}</p>
            <h1 className="mx-auto mt-5 max-w-[1050px] text-[48px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[74px] sm:leading-[0.94] lg:text-[90px]">
              {topic.hero}
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">{topic.description}</p>
            <p className="mx-auto mt-4 max-w-[740px] text-[14px] leading-7 text-slate-500">{t.intro}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <FunnelLink href={checkPath(locale)} event="localized_primary_cta" properties={{ locale, slug }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-6 text-[14px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.20)] transition hover:-translate-y-0.5 hover:bg-[#a3ceff] hover:shadow-[0_14px_34px_rgba(123,183,255,.24)] active:translate-y-0">
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

      {isResources && (
        <section className="border-b border-white/[0.06] bg-[#080b12]">
          <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{resourceDocumentCopy[locale].eyebrow}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className="max-w-[760px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">{resourceDocumentCopy[locale].title}</h2>
              <p className="max-w-xl text-[16px] leading-8 text-slate-400 lg:justify-self-end">{resourceDocumentCopy[locale].intro}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {DOCUMENT_RESOURCE_SLUGS.map((documentSlug) => {
                const item = getTopic(locale, documentSlug);
                return (
                  <a
                    key={documentSlug}
                    href={localizedPublicPath(locale, documentSlug)}
                    className="group rounded-[24px] border border-white/[0.07] bg-white/[0.03] p-6 transition hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/[0.045]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-300">{item.eyebrow}</p>
                    <h3 className="mt-3 text-[22px] font-semibold leading-7 text-white">{item.hero}</h3>
                    <p className="mt-4 text-[13px] leading-6 text-slate-500 transition group-hover:text-slate-400">{item.description}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
            <FunnelLink href={checkPath(locale)} event="localized_final_cta" properties={{ locale, slug }} className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-6 text-[14px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.20)] transition hover:-translate-y-0.5 hover:bg-[#a3ceff] hover:shadow-[0_14px_34px_rgba(123,183,255,.24)] active:translate-y-0">{t.cta} <Arrow /></FunnelLink>
          </div>
        </div>
      </section>

      <GlobalPublicFooter locale={locale} />
    </main>
  );
}
