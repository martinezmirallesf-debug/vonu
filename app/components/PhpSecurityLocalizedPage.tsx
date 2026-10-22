import type { Metadata } from "next";
import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import InlineTrustAnalyzer from "@/app/components/InlineTrustAnalyzer";
import { phpSecurityLanguageAlternates, phpSecurityPath } from "@/lib/vonu-global/php-security";
import { PHP_GUIDE_FULL } from "@/lib/vonu-global/php-security-full";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import DeviceAccessGate from "@/app/components/DeviceAccessGate";

const BASE = "https://vonuai.com";
type PhpLocale = Exclude<SupportedLocale, "es">;

export const PHP_SECURITY_TRANSLATIONS = {
  "en": {
    "title": "PHP security: understand website vulnerabilities",
    "hero": "PHP security, explained.",
    "subtitle": "What can you really check?",
    "intro": "Many websites use PHP. Learn what a vulnerability means, which warning signs you can review and why an external check cannot certify a server.",
    "checks": [
      "Check visible website signals",
      "Understand the limits of PHP checks",
      "Verify your PHP version with your host",
      "Review official security notices"
    ],
    "faq": [
      [
        "Does Vonü detect PHP vulnerabilities?",
        "Vonü checks public website signals and can compare an openly reported PHP version with published vulnerability notices. It cannot confirm internal vulnerabilities or prove they are exploitable."
      ],
      [
        "Does HTTPS prove a site is safe?",
        "No. HTTPS encrypts the connection but does not prove the server is updated."
      ],
      [
        "What should a website owner do?",
        "Check the installed PHP version with the hosting provider, review official security advisories, back up the site and plan updates."
      ]
    ],
    "cta": "Check a website",
    "guide": "PHP versions and official security information"
  },
  "fr": {
    "title": "Sécurité PHP : comprendre les vulnérabilités web",
    "hero": "La sécurité PHP, simplement.",
    "subtitle": "Que peut-on vraiment vérifier ?",
    "intro": "De nombreux sites utilisent PHP. Découvrez les risques possibles, les signes visibles et pourquoi un contrôle externe ne peut pas certifier un serveur.",
    "checks": [
      "Examiner les signaux visibles",
      "Comprendre les limites du contrôle PHP",
      "Vérifier la version chez l’hébergeur",
      "Consulter les avis officiels"
    ],
    "faq": [
      [
        "Vonü détecte-t-il les failles PHP ?",
        "Vonü contrôle des indices publics et peut comparer une version PHP déclarée aux avis de sécurité publiés. Il ne peut pas confirmer les vulnérabilités internes."
      ],
      [
        "HTTPS garantit-il la sécurité ?",
        "Non. HTTPS chiffre la connexion sans prouver que le serveur est à jour."
      ],
      [
        "Que faire si je gère un site ?",
        "Vérifiez la version PHP chez l’hébergeur, consultez les avis officiels, sauvegardez le site et préparez les mises à jour."
      ]
    ],
    "cta": "Vérifier un site",
    "guide": "Versions PHP et avis officiels"
  },
  "de": {
    "title": "PHP-Sicherheit: Website-Schwachstellen verstehen",
    "hero": "PHP-Sicherheit einfach erklärt.",
    "subtitle": "Was lässt sich wirklich prüfen?",
    "intro": "Viele Websites nutzen PHP. Erfahre, welche Risiken bestehen, welche sichtbaren Hinweise du prüfen kannst und warum ein externer Check keine Server-Sicherheitsprüfung ersetzt.",
    "checks": [
      "Sichtbare Website-Signale prüfen",
      "Grenzen eines PHP-Checks verstehen",
      "PHP-Version beim Hoster prüfen",
      "Offizielle Sicherheitshinweise lesen"
    ],
    "faq": [
      [
        "Erkennt Vonü PHP-Schwachstellen?",
        "Vonü prüft öffentliche Signale und gleicht eine öffentlich gemeldete PHP-Version mit bekannten Sicherheitsmeldungen ab. Interne Schwachstellen bestätigt dies nicht."
      ],
      [
        "Ist eine HTTPS-Website sicher?",
        "Nein. HTTPS verschlüsselt die Verbindung, sagt aber nichts über Server-Updates aus."
      ],
      [
        "Was sollten Betreiber tun?",
        "PHP-Version beim Hoster prüfen, offizielle Hinweise lesen, Backups erstellen und Updates planen."
      ]
    ],
    "cta": "Website prüfen",
    "guide": "PHP-Versionen und offizielle Hinweise"
  },
  "ar": {
    "title": "أمان PHP: فهم ثغرات المواقع",
    "hero": "أمان PHP ببساطة.",
    "subtitle": "ما الذي يمكن فحصه فعلاً؟",
    "intro": "تستخدم مواقع كثيرة PHP. تعرّف على المخاطر والإشارات الظاهرة ولماذا لا يمكن لفحص خارجي ضمان سلامة الخادم.",
    "checks": [
      "فحص الإشارات الظاهرة للموقع",
      "فهم حدود فحص PHP",
      "التحقق من إصدار PHP لدى الاستضافة",
      "مراجعة التنبيهات الأمنية الرسمية"
    ],
    "faq": [
      [
        "هل يكتشف Vonü ثغرات PHP؟",
        "يفحص Vonü الإشارات العامة ويمكنه مقارنة إصدار PHP المعلن بالتنبيهات المنشورة. ولا يمكنه تأكيد الثغرات الداخلية أو إثبات إمكانية استغلالها."
      ],
      [
        "هل HTTPS يعني أن الموقع آمن؟",
        "لا. يشفر HTTPS الاتصال لكنه لا يثبت تحديث الخادم."
      ],
      [
        "ماذا يفعل مالك الموقع؟",
        "يتحقق من إصدار PHP لدى الاستضافة ويراجع التنبيهات الرسمية ويأخذ نسخة احتياطية قبل التحديث."
      ]
    ],
    "cta": "فحص موقع",
    "guide": "إصدارات PHP والمعلومات الرسمية"
  }
} as const;

export function phpSecurityLocalizedMetadata(locale: PhpLocale): Metadata {
  const copy = PHP_SECURITY_TRANSLATIONS[locale];
  const url = `${BASE}${phpSecurityPath(locale)}`;
  return {
    metadataBase: new URL(BASE),
    title: `${copy.title} | Vonü`,
    description: copy.intro,
    alternates: { canonical: url, languages: phpSecurityLanguageAlternates() },
    openGraph: { title: copy.title, description: copy.intro, url, siteName: "Vonü", type: "article", locale: locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "ar" },
    robots: { index: true, follow: true },
  };
}


const gradient = "bg-gradient-to-r from-[#1a73e8] to-[#06b6d4] bg-clip-text text-transparent";

export default function PhpSecurityLocalizedPage({ locale }: { locale: PhpLocale }) {
  const content = PHP_GUIDE_FULL[locale];
  const info = PHP_SECURITY_TRANSLATIONS[locale];
  const url = `${BASE}${phpSecurityPath(locale)}`;
  const resourcesUrl = `${BASE}${localizedPublicPath(locale, "recursos")}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: info.title,
        description: info.intro,
        inLanguage: locale,
        dateModified: "2026-10-22",
        isPartOf: { "@id": `${BASE}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vonü", item: BASE },
          { "@type": "ListItem", position: 2, name: "Resources", item: resourcesUrl },
          { "@type": "ListItem", position: 3, name: info.title, item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#checks`,
        name: content.stepsTitle,
        numberOfItems: content.checks.length,
        itemListElement: content.checks.map((check, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: check.title,
          description: check.text,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: content.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#030b25] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomeHeader />

      <section className="relative overflow-hidden bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="mx-auto max-w-[1080px] text-[clamp(2.65rem,9vw,7.25rem)] font-semibold leading-[1.04] tracking-[-0.065em] sm:text-[86px] sm:leading-[0.98] lg:text-[118px]">
              {content.heroLead}
              <span className={`block ${gradient}`}>{content.heroAccent}</span>
              <span className="mt-3 block text-[0.55em] leading-[1.1] tracking-[-0.04em] text-slate-300">{content.heroLast}</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-[18px] leading-8 text-slate-300 sm:text-[21px]">{content.intro}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-9">
              <a href="#analizador" className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[#1a73e8] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1264cb]">
                {content.cta} →
              </a>
              <a href="#senales" className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-white/10 bg-[#101c3c] px-6 py-3 text-[14px] font-semibold text-white transition hover:border-white/30">
                {content.secondaryCta}
              </a>
            </div>
          </div>
          <InlineTrustAnalyzer locale={locale} intent="website" />
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-[#101c3c] p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.quickLabel}</p>
                <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.055em]">
                  {content.quickTitle}
                  <span className={`mt-2 block ${gradient}`}>{content.quickAccent}</span>
                </h2>
                <p className="mt-6 text-[17px] leading-8 text-slate-300">{content.quickIntro}</p>
              </div>
              <div className="grid gap-3">
                {content.checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#030b25] p-5 text-[15px] leading-7 text-slate-200">
                    <span aria-hidden="true" className="mt-0.5 shrink-0 text-[20px] font-semibold text-[#79b4ff]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="senales" className="scroll-mt-20 bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.warningLabel}</p>
              <h2 className="mt-3 max-w-3xl text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
                {content.warningTitle}
                <span className={`block ${gradient}`}>{content.warningAccent}</span>
              </h2>
            </div>
            <p className="max-w-md text-[17px] leading-8 text-slate-300">{content.warningIntro}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.warnings.map((item) => (
              <article key={item.title} className="min-h-[240px] rounded-[24px] border border-white/10 bg-[#101c3c] p-7">
                <h3 className="text-[27px] font-semibold leading-[1.12] tracking-[-0.04em] text-white">{item.title}</h3>
                <p className="mt-5 text-[15.5px] leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.casesLabel}</p>
            <h2 className="mt-3 text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
              {content.casesTitle}
              <span className={`block ${gradient}`}>{content.casesAccent}</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-slate-300">{content.casesIntro}</p>
          </div>
          <div className="grid gap-4">
            {content.cases.map((item) => (
              <article key={item.title} className="rounded-[22px] border border-white/10 bg-[#101c3c] p-6">
                <h3 className="text-[25px] font-semibold tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-3 text-[15.5px] leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.mistakesLabel}</p>
            <h2 className="mt-3 text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.055em]">
              {content.mistakesTitle}
              <span className={`block ${gradient}`}>{content.mistakesAccent}</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-8 text-slate-300">{content.mistakesIntro}</p>
          </div>
          <div className="grid gap-4">
            {content.mistakes.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-[#101c3c] p-5 text-[15px] leading-7 text-slate-200">
                <span aria-hidden="true" className="shrink-0 text-[22px] text-[#79b4ff]">×</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-[#101c3c] p-6 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.stepsLabel}</p>
                <h2 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.05em]">{content.stepsTitle}</h2>
                <p className="mt-5 text-[17px] leading-8 text-slate-300">{content.stepsIntro}</p>
                <p className="mt-4 text-[12px] font-medium text-slate-400">{content.dateLabel}</p>
              </div>
              <ol className="grid gap-3">
                {content.checks.map((item, index) => (
                  <li key={item.title} className="grid grid-cols-[40px_1fr] items-start gap-4 rounded-[20px] border border-white/10 bg-[#030b25] p-5">
                    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-[#1a73e8] text-[13px] font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[19px] font-semibold leading-snug">{item.title}</h3>
                      <p className="mt-2 text-[14px] leading-7 text-slate-300">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#79b4ff]">{content.sourcesLabel}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {content.sources.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-[18px] border border-white/10 bg-[#030b25] p-5 transition hover:border-[#1a73e8]/40">
                    <span className="text-[16px] font-semibold">{item.title}</span>
                    <p className="mt-2 text-[14px] leading-6 text-slate-300">{item.text}</p>
                    <span className="mt-3 inline-block text-[13px] font-semibold text-[#79b4ff]">{content.sourceAction} ↗</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#79b4ff]">{content.relatedLabel}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {content.related.map((item) => (
                  <Link key={item.slug} href={localizedPublicPath(locale, item.slug)} className="rounded-[18px] border border-white/10 bg-[#030b25] p-5 transition hover:border-[#1a73e8]/40">
                    <span className="text-[17px] font-semibold">{item.title}</span>
                    <p className="mt-2 text-[14px] leading-6 text-slate-300">{item.text}</p>
                    <span className="mt-3 inline-block text-[13px] font-semibold text-[#79b4ff]">{content.relatedAction} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.13em] text-[#79b4ff]">{content.faqLabel}</p>
            <h2 className="mt-3 text-[clamp(2.9rem,6vw,5rem)] font-semibold leading-[1.03] tracking-[-0.055em]">
              {content.faqTitle}
              <span className={`block ${gradient}`}>{content.faqAccent}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {content.faqs.map((item) => (
              <details key={item.q} className="group rounded-[22px] border border-white/10 bg-[#101c3c] p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5">
                  <span className="text-[20px] font-semibold leading-snug">{item.q}</span>
                  <span aria-hidden="true" className="text-[30px] text-[#79b4ff] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-[15px] leading-7 text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030b25]">
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-5xl text-[clamp(2.9rem,6vw,5.2rem)] font-semibold leading-[1.04] tracking-[-0.06em]">{content.finalTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-slate-300">{content.finalIntro}</p>
          <a href="#analizador" className="mt-9 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[#101c3c] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#172b58]">{content.finalCta} →</a>
        </div>
      </section>

      <DeviceAccessGate locale={locale} />
      <HomeFooter />
    </main>
  );
}
