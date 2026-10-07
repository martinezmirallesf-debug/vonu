"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import type { DocumentCheckResult } from "@/lib/vonu-check/document-types";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type Intent = "contract" | "rental_contract";

const COPY: Record<SupportedLocale, {
  eyebrow: string;
  title: Record<Intent, string>;
  text: string;
  drop: string;
  hint: string;
  choose: string;
  change: string;
  jurisdiction: string;
  jurisdictionPlaceholder: string;
  jurisdictionHelp: string;
  analyze: string;
  analysing: string;
  invalid: string;
  unreadable: string;
  error: string;
  result: string;
  score: string;
  detectedJurisdiction: string;
  legalSources: string;
  findings: string;
  actions: string;
  limitations: string;
  source: string;
  reviewed: string;
  noJurisdiction: string;
  privacy: string;
}> = {
  es: {
    eyebrow: "Vonü Check · analiza gratis",
    title: {
      contract: "Entiende tu contrato antes de firmarlo.",
      rental_contract: "Entiende tu contrato de alquiler antes de firmarlo.",
    },
    text: "Vonü identifica cláusulas, importes, fechas, obligaciones y jurisdicción. Si encuentra referencias legales oficiales verificadas para ese país o región, las incorpora al análisis con cautela.",
    drop: "Arrastra un PDF aquí o selecciónalo",
    hint: "PDF · máximo 8 MB",
    choose: "Elegir PDF",
    change: "Cambiar PDF",
    jurisdiction: "País o región que crees que aplica",
    jurisdictionPlaceholder: "Opcional · p. ej. España, Cataluña, England…",
    jurisdictionHelp: "Indica tu país o región para ayudar a Vonü a interpretar mejor la jurisdicción aplicable y los matices legales de esa zona. El contrato seguirá siendo la referencia principal del análisis.",
    analyze: "Analizar ahora",
    analysing: "Revisando contrato…",
    invalid: "Sube un PDF válido de hasta 8 MB.",
    unreadable: "No hemos podido extraer suficiente texto del PDF. Si es un escaneo, prueba con una versión con texto seleccionable.",
    error: "No hemos podido completar el análisis. Inténtalo de nuevo.",
    result: "Resultado",
    score: "Prioridad de revisión",
    detectedJurisdiction: "Jurisdicción detectada",
    legalSources: "Fuentes legales oficiales aplicadas",
    findings: "Puntos encontrados",
    actions: "Qué revisar ahora",
    limitations: "Límites del análisis",
    source: "Abrir fuente",
    reviewed: "Perfil legal revisado",
    noJurisdiction: "No se ha confirmado una jurisdicción suficiente para aplicar reglas legales específicas.",
    privacy: "Sube solo la información necesaria para revisar el documento.\nEvita contraseñas, códigos de acceso o datos que no sean relevantes.",
  },
  en: {
    eyebrow: "Vonü Check · analyse for free",
    title: {
      contract: "Understand your contract before you sign it.",
      rental_contract: "Understand your rental agreement before you sign it.",
    },
    text: "Vonü identifies clauses, amounts, dates, obligations and jurisdiction. When it finds verified official legal references for that country or region, it incorporates them into the analysis with caution.",
    drop: "Drop a PDF here or choose one",
    hint: "PDF · up to 8 MB",
    choose: "Choose PDF",
    change: "Change PDF",
    jurisdiction: "Country or region you believe applies",
    jurisdictionPlaceholder: "Optional · e.g. England, Spain, France…",
    jurisdictionHelp: "Enter your country or region to help Vonü interpret the applicable jurisdiction and local legal nuances more accurately. The contract itself remains the main reference for the analysis.",
    analyze: "Analyse now",
    analysing: "Reviewing contract…",
    invalid: "Upload a valid PDF up to 8 MB.",
    unreadable: "We could not extract enough text from the PDF. If it is scanned, try a version with selectable text.",
    error: "We could not complete the analysis. Please try again.",
    result: "Result",
    score: "Review priority",
    detectedJurisdiction: "Detected jurisdiction",
    legalSources: "Official legal sources applied",
    findings: "What we found",
    actions: "What to review now",
    limitations: "Analysis limits",
    source: "Open source",
    reviewed: "Legal profile reviewed",
    noJurisdiction: "No jurisdiction was confirmed strongly enough to apply country-specific legal rules.",
    privacy: "Upload only the information needed to review the document.\nAvoid passwords, access codes or unrelated sensitive data.",
  },
  fr: {
    eyebrow: "Vonü Check · analyse gratuite",
    title: {
      contract: "Comprenez votre contrat avant de le signer.",
      rental_contract: "Comprenez votre bail avant de le signer.",
    },
    text: "Vonü identifie les clauses, montants, dates, obligations et la juridiction. Lorsqu’il trouve des références juridiques officielles vérifiées pour ce pays ou cette région, il les intègre à l’analyse avec prudence.",
    drop: "Déposez un PDF ici ou sélectionnez-le",
    hint: "PDF · 8 Mo maximum",
    choose: "Choisir un PDF",
    change: "Changer de PDF",
    jurisdiction: "Pays ou région que vous pensez applicable",
    jurisdictionPlaceholder: "Facultatif · ex. France, England, Espagne…",
    jurisdictionHelp: "Indiquez votre pays ou votre région pour aider Vonü à mieux interpréter la juridiction applicable et les particularités juridiques locales. Le contrat reste la référence principale de l’analyse.",
    analyze: "Analyser",
    analysing: "Analyse du contrat…",
    invalid: "Importez un PDF valide de 8 Mo maximum.",
    unreadable: "Nous n’avons pas pu extraire suffisamment de texte du PDF. S’il est scanné, essayez une version avec du texte sélectionnable.",
    error: "Impossible de terminer l’analyse. Réessayez.",
    result: "Résultat",
    score: "Priorité de vérification",
    detectedJurisdiction: "Juridiction détectée",
    legalSources: "Sources juridiques officielles appliquées",
    findings: "Points détectés",
    actions: "À vérifier maintenant",
    limitations: "Limites de l’analyse",
    source: "Ouvrir la source",
    reviewed: "Profil juridique vérifié",
    noJurisdiction: "Aucune juridiction n’a été confirmée avec assez de certitude pour appliquer des règles juridiques propres à un pays.",
    privacy: "Importez uniquement les informations nécessaires à la vérification du document.\nÉvitez les mots de passe, codes d’accès ou données sensibles non pertinentes.",
  },
  de: {
    eyebrow: "Vonü Check · kostenlos analysieren",
    title: {
      contract: "Verstehe deinen Vertrag, bevor du unterschreibst.",
      rental_contract: "Verstehe deinen Mietvertrag, bevor du unterschreibst.",
    },
    text: "Vonü erkennt Klauseln, Beträge, Daten, Pflichten und die anwendbare Rechtsordnung. Wenn verifizierte offizielle Rechtsquellen für dieses Land oder diese Region vorliegen, werden sie mit Vorsicht in die Analyse einbezogen.",
    drop: "PDF hier ablegen oder auswählen",
    hint: "PDF · maximal 8 MB",
    choose: "PDF auswählen",
    change: "PDF ändern",
    jurisdiction: "Land oder Region, die deiner Meinung nach gilt",
    jurisdictionPlaceholder: "Optional · z. B. Deutschland, England, Frankreich…",
    jurisdictionHelp: "Gib dein Land oder deine Region an, damit Vonü die anwendbare Rechtsordnung und lokale rechtliche Besonderheiten besser einordnen kann. Der Vertrag selbst bleibt die wichtigste Grundlage der Analyse.",
    analyze: "Jetzt analysieren",
    analysing: "Vertrag wird geprüft…",
    invalid: "Lade eine gültige PDF-Datei bis 8 MB hoch.",
    unreadable: "Aus der PDF konnte nicht genug Text gelesen werden. Bei einem Scan versuche eine Version mit auswählbarem Text.",
    error: "Die Analyse konnte nicht abgeschlossen werden. Bitte erneut versuchen.",
    result: "Ergebnis",
    score: "Prüfpriorität",
    detectedJurisdiction: "Erkannte Rechtsordnung",
    legalSources: "Angewendete offizielle Rechtsquellen",
    findings: "Gefundene Punkte",
    actions: "Was jetzt zu prüfen ist",
    limitations: "Grenzen der Analyse",
    source: "Quelle öffnen",
    reviewed: "Rechtsprofil geprüft",
    noJurisdiction: "Es wurde keine Rechtsordnung sicher genug bestätigt, um länderspezifische Rechtsregeln anzuwenden.",
    privacy: "Lade nur die Informationen hoch, die für die Prüfung des Dokuments nötig sind.\nVermeide Passwörter, Zugangscodes oder andere nicht relevante sensible Daten.",
  },
  ar: {
    eyebrow: "Vonü Check · حلّل مجانًا",
    title: {
      contract: "افهم عقدك قبل أن توقّعه.",
      rental_contract: "افهم عقد الإيجار قبل أن توقّعه.",
    },
    text: "يحدّد Vonü البنود والمبالغ والتواريخ والالتزامات والولاية القضائية. وعندما يجد مراجع قانونية رسمية موثّقة لذلك البلد أو الإقليم، يضمّنها في التحليل بحذر.",
    drop: "اسحب ملف PDF هنا أو اختر ملفًا",
    hint: "PDF · حتى 8 ميغابايت",
    choose: "اختيار PDF",
    change: "تغيير PDF",
    jurisdiction: "البلد أو الإقليم الذي تعتقد أنه ينطبق",
    jurisdictionPlaceholder: "اختياري · مثال: السعودية، فرنسا، England…",
    jurisdictionHelp: "حدّد بلدك أو منطقتك لمساعدة Vonü على تفسير الولاية القضائية المطبقة وفهم الفروقات القانونية المحلية بشكل أدق. يظل العقد نفسه المرجع الأساسي في التحليل.",
    analyze: "حلّل الآن",
    analysing: "جارٍ مراجعة العقد…",
    invalid: "ارفع ملف PDF صالحًا بحجم لا يتجاوز 8 ميغابايت.",
    unreadable: "لم نتمكن من استخراج نص كافٍ من ملف PDF. إذا كان ممسوحًا ضوئيًا، جرّب نسخة تحتوي على نص قابل للتحديد.",
    error: "تعذر إكمال التحليل. حاول مرة أخرى.",
    result: "النتيجة",
    score: "أولوية المراجعة",
    detectedJurisdiction: "الولاية القضائية المكتشفة",
    legalSources: "المصادر القانونية الرسمية المطبقة",
    findings: "ما تم العثور عليه",
    actions: "ما الذي يجب مراجعته الآن",
    limitations: "حدود التحليل",
    source: "فتح المصدر",
    reviewed: "تمت مراجعة الملف القانوني",
    noJurisdiction: "لم يتم تأكيد ولاية قضائية بدرجة كافية لتطبيق قواعد قانونية خاصة ببلد معين.",
    privacy: "ارفع فقط المعلومات اللازمة لمراجعة المستند.\nتجنّب كلمات المرور أو رموز الدخول أو أي بيانات حساسة غير مرتبطة بالمراجعة.",
  },
};

function displayJurisdiction(result: DocumentCheckResult) {
  const parts = [
    result.jurisdiction.country,
    result.jurisdiction.region,
    result.jurisdiction.governingLaw,
  ].filter(Boolean);
  return Array.from(new Set(parts)).join(" · ");
}

export default function InlineDocumentAnalyzer({
  locale,
  intent,
}: {
  locale: SupportedLocale;
  intent: Intent;
}) {
  const t = COPY[locale];
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jurisdictionHint, setJurisdictionHint] = useState("");
  const [result, setResult] = useState<DocumentCheckResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function selectFile(next: File | null) {
    const valid =
      !!next &&
      (next.type === "application/pdf" || next.name.toLowerCase().endsWith(".pdf")) &&
      next.size > 0 &&
      next.size <= 8_000_000;
    if (!valid) {
      setFile(null);
      setError(t.invalid);
      return;
    }
    setFile(next);
    setResult(null);
    setError("");
  }

  async function analyse() {
    if (!file) {
      setError(t.invalid);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData();
    form.set("file", file);
    form.set("locale", locale);
    form.set("kindHint", intent);
    if (jurisdictionHint.trim()) form.set("jurisdictionHint", jurisdictionHint.trim());

    track("intent_document_analysis_started", { locale, intent });

    try {
      const response = await fetch("/api/check/document", {
        method: "POST",
        body: form,
      });
      const data = await response.json().catch(() => null);

      if (response.status === 402) return;
      if (!response.ok || !data) {
        if (data?.error === "document_text_unavailable") {
          setError(t.unreadable);
          return;
        }
        if (data?.error === "invalid_document" || data?.error === "document_too_large") {
          setError(t.invalid);
          return;
        }
        throw new Error("analysis_failed");
      }

      setResult(data as DocumentCheckResult);
      track("intent_document_analysis_completed", {
        locale,
        intent,
        legal_profile: Boolean(data.legalContext),
        jurisdiction: data.jurisdiction?.countryCode || "unknown",
      });
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  const jurisdiction = result ? displayJurisdiction(result) : "";

  return (
    <section
      className="mx-auto mt-10 max-w-[1040px] text-left sm:mt-12"
      aria-label={t.title[intent]}
    >
      <div className="rounded-[32px] border border-white/[0.09] bg-[#0b1020] p-5 shadow-[0_30px_90px_rgba(0,0,0,.22)] sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7bb7ff]">
          {t.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_.9fr] lg:items-end">
          <div>
            <h2 className="text-[28px] font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-[38px]">
              {t.title[intent]}
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-slate-400 sm:text-[15px]">
              {t.text}
            </p>
          </div>
          <p className="whitespace-pre-line text-[11px] leading-5 text-slate-500 lg:max-w-[430px] lg:justify-self-end lg:text-right">{t.privacy}</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectFile(event.dataTransfer.files?.[0] || null);
            }}
            className="grid min-h-[150px] place-items-center rounded-[22px] border border-dashed border-white/[0.14] bg-black/10 px-5 py-5 text-center"
          >
            {file ? (
              <div className="w-full min-w-0">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#7bb7ff]/10 text-[#7bb7ff] ring-1 ring-[#7bb7ff]/20">
                  <span className="text-[13px] font-bold">PDF</span>
                </div>
                <p className="mx-auto mt-3 max-w-full truncate text-[14px] font-semibold text-white">
                  {file.name}
                </p>
                <p className="mt-1 text-[12px] text-slate-500">
                  {(file.size / 1_000_000).toFixed(1)} MB
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 rounded-lg bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-slate-300 transition hover:bg-white/[0.1]"
                >
                  {t.change}
                </button>
              </div>
            ) : (
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#7bb7ff]/10 text-[#7bb7ff] ring-1 ring-[#7bb7ff]/20">
                  <span className="text-[13px] font-bold">PDF</span>
                </div>
                <p className="mt-3 text-[16px] font-semibold text-white">{t.drop}</p>
                <p className="mt-1 text-[12px] text-slate-500">{t.hint}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 rounded-xl bg-[#7bb7ff] px-4 py-2.5 text-[13px] font-bold text-[#07142f] transition hover:bg-[#a3ceff]"
                >
                  {t.choose}
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => selectFile(event.target.files?.[0] || null)}
            />
          </div>

          <div className="rounded-[22px] border border-white/[0.08] bg-black/10 p-5">
            <label className="text-[13px] font-semibold text-slate-200">
              {t.jurisdiction}
            </label>
            <input
              value={jurisdictionHint}
              onChange={(event) => setJurisdictionHint(event.target.value)}
              placeholder={t.jurisdictionPlaceholder}
              className="mt-3 h-12 w-full rounded-xl border border-white/[0.09] bg-[#080d18] px-4 text-[14px] text-white outline-none placeholder:text-slate-600 focus:border-[#7bb7ff]/45"
            />
            <p className="mt-2 text-[11px] leading-5 text-slate-500">{t.jurisdictionHelp}</p>
            <button
              data-vonu-analyze-cta="true"
              type="button"
              disabled={loading}
              onClick={() => void analyse()}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-400 px-5 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.14)] transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? t.analysing : t.analyze}
            </button>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-[13px] leading-5 text-rose-200">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-6 border-t border-white/[0.08] pt-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {t.result}
                </p>
                <p className="mt-2 text-[23px] font-semibold leading-tight tracking-[-0.035em] text-white">
                  {result.summary}
                </p>
              </div>
              <div className="min-w-[150px] rounded-[18px] border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{t.score}</p>
                <p className="mt-1 text-[30px] font-semibold tracking-[-0.05em] text-[#7bb7ff]">
                  {result.risk.score}<span className="text-[13px] text-slate-500">/100</span>
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[20px] border border-white/[0.07] bg-black/10 p-4">
                <h3 className="text-[14px] font-semibold text-white">{t.findings}</h3>
                <div className="mt-3 space-y-3">
                  {result.signals.slice(0, 5).map((signal) => (
                    <div key={signal.id} className="flex gap-3 text-[13px] leading-5 text-slate-300">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#7bb7ff]" />
                      <span><strong className="font-semibold text-slate-100">{signal.title}.</strong> {signal.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-[20px] border border-white/[0.07] bg-black/10 p-4">
                  <h3 className="text-[14px] font-semibold text-white">{t.detectedJurisdiction}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-slate-300">
                    {jurisdiction || t.noJurisdiction}
                  </p>
                  {result.legalContext ? (
                    <div className="mt-3 border-t border-white/[0.06] pt-3">
                      <p className="text-[11px] text-slate-500">
                        {t.reviewed}: {result.legalContext.reviewedAt}
                      </p>
                      <p className="mt-3 text-[12px] font-semibold text-slate-200">{t.legalSources}</p>
                      <div className="mt-2 space-y-2">
                        {result.legalContext.references.slice(0, 4).map((reference) => (
                          <a
                            key={reference.url}
                            href={reference.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="block rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-[12px] text-slate-300 transition hover:bg-white/[0.06]"
                          >
                            <span className="font-semibold text-slate-100">{reference.title}</span>
                            <span className="ms-2 text-[#7bb7ff]">{t.source} ↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {result.recommendedActions.length ? (
                  <div className="rounded-[20px] border border-white/[0.07] bg-black/10 p-4">
                    <h3 className="text-[14px] font-semibold text-white">{t.actions}</h3>
                    <ul className="mt-3 space-y-2 text-[13px] leading-5 text-slate-300">
                      {result.recommendedActions.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            {result.limitations.length ? (
              <details className="mt-4 rounded-[18px] border border-white/[0.07] bg-black/10 px-4 py-3">
                <summary className="cursor-pointer text-[12px] font-semibold text-slate-400">
                  {t.limitations}
                </summary>
                <ul className="mt-3 space-y-2 text-[12px] leading-5 text-slate-500">
                  {result.limitations.slice(0, 5).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
