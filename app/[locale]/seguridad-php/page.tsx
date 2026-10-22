import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "@/app/components/HomeHeader";
import HomeFooter from "@/app/components/HomeFooter";
import InlineTrustAnalyzer from "@/app/components/InlineTrustAnalyzer";

const BASE = "https://vonuai.com";
const translations = {
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
        "No. Vonü reviews external signals and known malware URL matches, not server software versions or exploitable PHP vulnerabilities."
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
        "Non. Vonü examine des signaux externes et des correspondances avec des URL malveillantes connues, pas les versions internes du serveur."
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
        "Nein. Vonü prüft äußere Signale und bekannte Malware-URLs, nicht die interne PHP-Version oder ausnutzbare Sicherheitslücken."
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
        "لا. يفحص Vonü إشارات خارجية وروابط معروفة مرتبطة بالبرمجيات الضارة، ولا يفحص إصدار PHP الداخلي أو الثغرات القابلة للاستغلال."
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
type Locale = keyof typeof translations;
type Props = { params: Promise<{ locale: string }> };
const languages = { es: `${BASE}/seguridad-php`, en: `${BASE}/en/seguridad-php`, fr: `${BASE}/fr/seguridad-php`, de: `${BASE}/de/seguridad-php`, ar: `${BASE}/ar/seguridad-php`, "x-default": `${BASE}/seguridad-php` };
export const dynamicParams = false;
export function generateStaticParams() { return (Object.keys(translations) as Locale[]).map(locale => ({ locale })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!(locale in translations)) return {};
  const copy = translations[locale as Locale];
  const url = `${BASE}/${locale}/seguridad-php`;
  return { metadataBase: new URL(BASE), title: copy.title + " | Vonü", description: copy.intro, alternates: { canonical: url, languages }, openGraph: { title: copy.title, description: copy.intro, url, siteName: "Vonü", type: "article" }, robots: { index: true, follow: true } };
}
export default async function PhpSecurityLocalizedPage({ params }: Props) {
  const { locale } = await params;
  if (!(locale in translations)) notFound();
  const copy = translations[locale as Locale];
  const url = `${BASE}/${locale}/seguridad-php`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url + "#webpage", url, name: copy.title, description: copy.intro, inLanguage: locale, dateModified: "2026-10-22" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Vonü", item: BASE }, { "@type": "ListItem", position: 2, name: copy.title, item: url }] },
    { "@type": "FAQPage", mainEntity: copy.faq.map(([q,a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] };
  return <main dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#030b25] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <HomeHeader />
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:pt-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#79b4ff]">Vonü · PHP</p>
      <h1 className="mx-auto mt-5 max-w-5xl text-[clamp(2.6rem,8vw,6.6rem)] font-semibold leading-[1.04] tracking-[-0.06em]">{copy.hero}<span className="mt-3 block text-[#79b4ff]">{copy.subtitle}</span></h1>
      <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>
      <Link href="#analyzer" className="mt-8 inline-flex rounded-[14px] bg-[#1a73e8] px-7 py-4 font-semibold text-white">{copy.cta} ↓</Link>
    </section>
    <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2">{copy.checks.map((item,i) => <article key={item} className="rounded-[22px] border border-white/10 bg-[#101c3c] p-7"><span className="text-sm font-semibold text-[#79b4ff]">0{i+1}</span><h2 className="mt-3 text-xl font-semibold">{item}</h2></article>)}</section>
    <section id="analyzer" className="mx-auto max-w-6xl px-4 py-16"><InlineTrustAnalyzer locale={locale as Locale} intent="website" /></section>
    <section className="mx-auto max-w-5xl px-4 pb-20"><h2 className="mb-8 text-4xl font-semibold">{copy.guide}</h2><div className="grid gap-4">{copy.faq.map(([q,a])=><article key={q} className="rounded-[22px] border border-white/10 bg-[#101c3c] p-7"><h3 className="text-xl font-semibold">{q}</h3><p className="mt-3 leading-7 text-slate-300">{a}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-4"><a className="text-[#79b4ff] underline" href="https://www.php.net/supported-versions.php">PHP supported versions ↗</a><a className="text-[#79b4ff] underline" href="https://www.php.net/security">PHP security ↗</a></div></section>
    <HomeFooter />
  </main>;
}