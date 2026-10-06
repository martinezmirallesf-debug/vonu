import type { SupportedLocale } from "@/lib/vonu-check/types";
import {
  JURISDICTION_PROFILES,
  referencesForDocument,
} from "@/lib/vonu-check/jurisdiction-profiles";

type Intent = "contract" | "rental_contract";

const COPY: Record<SupportedLocale, {
  eyebrow: string;
  title: Record<Intent, string>;
  text: Record<Intent, string>;
  reviewed: string;
  source: string;
  scope: string;
  currentLaw: string;
  currentLawText: string;
}> = {
  es: {
    eyebrow: "Jurisdicción antes que idioma",
    title: {
      contract: "Un contrato no se revisa igual en todos los países.",
      rental_contract: "La ley del alquiler cambia según el país y, a veces, según la región.",
    },
    text: {
      contract: "Vonü separa el idioma del documento de la jurisdicción aplicable. Solo usa reglas jurídicas específicas cuando el propio contrato aporta evidencia suficiente y existe un perfil oficial verificado para ese país o región.",
      rental_contract: "Un alquiler en español no implica automáticamente ley española, y un contrato en inglés no implica Inglaterra. Vonü intenta identificar país, región, ley aplicable y tipo de arrendamiento antes de comparar cláusulas con fuentes oficiales.",
    },
    reviewed: "Fuentes revisadas",
    source: "Fuente oficial",
    scope: "Cobertura verificada",
    currentLaw: "Estado legal sensible · España",
    currentLawText: "Los RDL 26/2026 y 27/2026 del 29 de septiembre fueron derogados el 2 de octubre. Los nuevos decretos aprobados por el Gobierno el 6 de octubre no se incorporan como reglas vigentes en Vonü hasta verificar su texto oficial, entrada en vigor y situación parlamentaria.",
  },
  en: {
    eyebrow: "Jurisdiction before language",
    title: {
      contract: "A contract cannot be reviewed the same way in every country.",
      rental_contract: "Rental law changes by country and sometimes by region.",
    },
    text: {
      contract: "Vonü separates document language from governing jurisdiction. It uses country-specific rules only when the contract provides sufficient evidence and a verified official profile exists for that country or region.",
      rental_contract: "A Spanish-language lease does not automatically mean Spanish law, and an English-language lease does not automatically mean England. Vonü checks country, region, governing law and tenancy type before comparing clauses with official sources.",
    },
    reviewed: "Sources reviewed",
    source: "Official source",
    scope: "Verified coverage",
    currentLaw: "Fast-changing law · Spain",
    currentLawText: "Spain's RDL 26/2026 and 27/2026 of 29 September were repealed on 2 October. Replacement decrees approved by the Government on 6 October are not added as current Vonü rules until their official text, commencement and parliamentary status are verified.",
  },
  fr: {
    eyebrow: "La juridiction avant la langue",
    title: {
      contract: "Un contrat ne se vérifie pas de la même façon dans tous les pays.",
      rental_contract: "Le droit locatif varie selon le pays et parfois selon la région.",
    },
    text: {
      contract: "Vonü distingue la langue du document de la juridiction applicable. Les règles propres à un pays ne sont utilisées que si le contrat apporte suffisamment d’éléments et qu’un profil officiel vérifié existe.",
      rental_contract: "Un bail en espagnol ne relève pas automatiquement du droit espagnol, pas plus qu’un bail en anglais du droit anglais. Vonü vérifie pays, région, loi applicable et type de location avant de comparer les clauses.",
    },
    reviewed: "Sources vérifiées",
    source: "Source officielle",
    scope: "Couverture vérifiée",
    currentLaw: "Droit en évolution rapide · Espagne",
    currentLawText: "Les RDL espagnols 26/2026 et 27/2026 du 29 septembre ont été abrogés le 2 octobre. Les nouveaux décrets approuvés le 6 octobre ne sont pas intégrés comme règles en vigueur avant vérification du texte officiel, de l’entrée en vigueur et du statut parlementaire.",
  },
  de: {
    eyebrow: "Rechtsordnung vor Sprache",
    title: {
      contract: "Ein Vertrag lässt sich nicht in jedem Land gleich prüfen.",
      rental_contract: "Mietrecht unterscheidet sich je nach Land und teilweise je nach Region.",
    },
    text: {
      contract: "Vonü trennt Dokumentsprache und anwendbare Rechtsordnung. Länderspezifische Regeln werden nur genutzt, wenn der Vertrag genügend Belege liefert und ein verifiziertes offizielles Rechtsprofil vorhanden ist.",
      rental_contract: "Ein spanischsprachiger Mietvertrag unterliegt nicht automatisch spanischem Recht, ein englischsprachiger nicht automatisch englischem Recht. Vonü prüft Land, Region, Rechtswahl und Mietart vor dem Abgleich mit offiziellen Quellen.",
    },
    reviewed: "Quellen geprüft",
    source: "Offizielle Quelle",
    scope: "Verifizierte Abdeckung",
    currentLaw: "Schnell wechselnde Rechtslage · Spanien",
    currentLawText: "Die spanischen RDL 26/2026 und 27/2026 vom 29. September wurden am 2. Oktober aufgehoben. Am 6. Oktober neu beschlossene Dekrete werden erst als geltende Vonü-Regeln übernommen, wenn offizieller Text, Inkrafttreten und parlamentarischer Status geprüft sind.",
  },
  ar: {
    eyebrow: "الولاية القضائية قبل اللغة",
    title: {
      contract: "لا يمكن مراجعة العقد بالطريقة نفسها في كل بلد.",
      rental_contract: "قانون الإيجار يختلف حسب البلد وأحيانًا حسب الإقليم.",
    },
    text: {
      contract: "يفصل Vonü بين لغة المستند والولاية القضائية المطبقة. ولا يستخدم قواعد خاصة ببلد إلا عندما يقدم العقد أدلة كافية ويتوفر ملف قانوني رسمي موثَّق لذلك البلد أو الإقليم.",
      rental_contract: "العقد المكتوب بالإسبانية لا يعني تلقائيًا تطبيق القانون الإسباني، والعقد بالإنجليزية لا يعني تلقائيًا إنجلترا. يتحقق Vonü من البلد والإقليم والقانون الواجب التطبيق ونوع الإيجار قبل مقارنة البنود بالمصادر الرسمية.",
    },
    reviewed: "تاريخ مراجعة المصادر",
    source: "مصدر رسمي",
    scope: "التغطية الموثَّقة",
    currentLaw: "وضع قانوني سريع التغير · إسبانيا",
    currentLawText: "أُلغي المرسومان الإسبانيان RDL 26/2026 وRDL 27/2026 الصادران في 29 سبتمبر بتاريخ 2 أكتوبر. ولا يضيف Vonü المراسيم البديلة التي أقرّتها الحكومة في 6 أكتوبر كقواعد نافذة قبل التحقق من النص الرسمي وبدء النفاذ والوضع البرلماني.",
  },
};

export default function LegalIntentAuthoritySection({
  locale,
  intent,
}: {
  locale: SupportedLocale;
  intent: Intent;
}) {
  const t = COPY[locale];
  const profiles = Object.values(JURISDICTION_PROFILES);

  return (
    <section className="bg-[#f5f5f7]">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-7 lg:px-10">
        <div className="rounded-[34px] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,.06)] sm:p-9">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-blue-600">
            {t.eyebrow}
          </p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <h2 className="max-w-3xl text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-zinc-950 sm:text-[58px]">
              {t.title[intent]}
            </h2>
            <p className="max-w-2xl text-[16px] leading-7 text-zinc-600">
              {t.text[intent]}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {profiles.map((profile) => {
              const refs = referencesForDocument(
                profile,
                intent,
                profile.rentalRegionRequirement || profile.name,
              );
              if (intent === "rental_contract" && refs.length === 0) return null;
              const label =
                intent === "rental_contract" && profile.rentalRegionRequirement
                  ? `${profile.rentalRegionRequirement} · ${profile.code}`
                  : `${profile.name} · ${profile.code}`;
              return (
                <article
                  key={profile.code}
                  className="rounded-[24px] border border-zinc-200 bg-[#f7f7f9] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-zinc-950">
                      {label}
                    </h3>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-zinc-500 ring-1 ring-zinc-200">
                      {profile.reviewedAt}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {t.scope}
                  </p>
                  <div className="mt-3 space-y-2">
                    {refs.slice(0, 3).map((reference) => (
                      <a
                        key={reference.url}
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block rounded-[16px] border border-zinc-200 bg-white px-4 py-3 transition hover:-translate-y-[1px] hover:shadow-sm"
                      >
                        <span className="text-[13px] font-semibold text-zinc-900">{reference.title}</span>
                        <span className="ms-2 text-[11px] font-semibold text-blue-600">{t.source} ↗</span>
                        <p className="mt-1.5 text-[12px] leading-5 text-zinc-500">{reference.scope}</p>
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {intent === "rental_contract" ? (
            <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-amber-800">
                {t.currentLaw}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-amber-950/80">{t.currentLawText}</p>
            </div>
          ) : null}

          <p className="mt-5 text-[11px] text-zinc-500">
            {t.reviewed}: 2026-10-06
          </p>
        </div>
      </div>
    </section>
  );
}
