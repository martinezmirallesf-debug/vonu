"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { copy, localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type UiCopy = {
  analyzer: string;
  urlMode: string;
  imageMode: string;
  textMode: string;
  soon: string;
  scanTitle: string;
  scanSteps: string[];
  report: string;
  forensicSummary: string;
  confidence: string;
  limited: string;
  medium: string;
  evidence: string;
  recommendation: string;
  lowAdvice: string;
  cautionAdvice: string;
  highAdvice: string;
  newCheck: string;
  engine: string;
  noHistory: string;
  analyzedUrl: string;
  strongestSignals: string;
};

const ui: Record<SupportedLocale, UiCopy> = {
  es: {
    analyzer: "ANALIZAR",
    urlMode: "URL o enlace",
    imageMode: "Captura de pantalla",
    textMode: "Mensaje o texto",
    soon: "Próximamente",
    scanTitle: "Escaneando señales de riesgo",
    scanSteps: [
      "Resolviendo dominio y destino final…",
      "Comprobando HTTPS y respuesta HTTP…",
      "Revisando redirecciones y formularios…",
      "Analizando señales legales y de contacto…",
      "Calculando el índice de precaución…",
    ],
    report: "INFORME VONU CHECK",
    forensicSummary: "Resumen técnico",
    confidence: "Confianza del análisis",
    limited: "Limitada",
    medium: "Media",
    evidence: "Señales y evidencias",
    recommendation: "Qué haría Vonu",
    lowAdvice: "No vemos señales técnicas fuertes de riesgo en esta primera capa. Antes de un pago importante, todavía conviene verificar identidad y reputación.",
    cautionAdvice: "Hay señales que merecen revisión. No pagaríamos todavía sin comprobar mejor quién está detrás de la web.",
    highAdvice: "Hay varias señales relevantes de riesgo. No introduciríamos datos sensibles ni realizaríamos el pago hasta verificar la web por otras vías.",
    newCheck: "Analizar otra web",
    engine: "Motor técnico activo",
    noHistory: "Sin registro · Esta preview no guarda historial",
    analyzedUrl: "Web analizada",
    strongestSignals: "Puntos clave del diagnóstico",
  },
  en: {
    analyzer: "ANALYZE",
    urlMode: "URL or link",
    imageMode: "Screenshot",
    textMode: "Message or text",
    soon: "Coming soon",
    scanTitle: "Scanning risk signals",
    scanSteps: [
      "Resolving domain and final destination…",
      "Checking HTTPS and HTTP response…",
      "Reviewing redirects and forms…",
      "Inspecting legal and contact signals…",
      "Calculating caution index…",
    ],
    report: "VONU CHECK REPORT",
    forensicSummary: "Technical summary",
    confidence: "Analysis confidence",
    limited: "Limited",
    medium: "Medium",
    evidence: "Signals and evidence",
    recommendation: "What Vonu would do",
    lowAdvice: "We do not see strong technical risk signals in this first layer. Before an important payment, identity and reputation should still be verified.",
    cautionAdvice: "Some signals deserve review. We would not pay yet without checking who is behind the website.",
    highAdvice: "Several relevant risk signals were found. We would not enter sensitive data or pay until the website is independently verified.",
    newCheck: "Check another site",
    engine: "Technical engine active",
    noHistory: "No account · This preview stores no history",
    analyzedUrl: "Analysed website",
    strongestSignals: "Key diagnostic points",
  },
  fr: {
    analyzer: "ANALYSER",
    urlMode: "URL ou lien",
    imageMode: "Capture d’écran",
    textMode: "Message ou texte",
    soon: "Bientôt",
    scanTitle: "Analyse des signaux de risque",
    scanSteps: [
      "Résolution du domaine et de la destination finale…",
      "Vérification HTTPS et réponse HTTP…",
      "Analyse des redirections et formulaires…",
      "Recherche des mentions légales et contacts…",
      "Calcul de l’indice de prudence…",
    ],
    report: "RAPPORT VONU CHECK",
    forensicSummary: "Résumé technique",
    confidence: "Confiance de l’analyse",
    limited: "Limitée",
    medium: "Moyenne",
    evidence: "Signaux et preuves",
    recommendation: "Ce que ferait Vonu",
    lowAdvice: "Nous ne voyons pas de signal technique fort de risque dans cette première couche. Avant un paiement important, vérifiez tout de même identité et réputation.",
    cautionAdvice: "Certains signaux méritent une vérification. Nous ne paierions pas avant de mieux identifier qui se trouve derrière le site.",
    highAdvice: "Plusieurs signaux importants ont été détectés. Nous n’entrerions aucune donnée sensible et ne paierions pas avant une vérification indépendante.",
    newCheck: "Analyser un autre site",
    engine: "Moteur technique actif",
    noHistory: "Sans compte · Cette preview ne conserve pas l’historique",
    analyzedUrl: "Site analysé",
    strongestSignals: "Points clés du diagnostic",
  },
  de: {
    analyzer: "ANALYSIEREN",
    urlMode: "URL oder Link",
    imageMode: "Screenshot",
    textMode: "Nachricht oder Text",
    soon: "Demnächst",
    scanTitle: "Risikosignale werden geprüft",
    scanSteps: [
      "Domain und Zieladresse werden aufgelöst…",
      "HTTPS und HTTP-Antwort werden geprüft…",
      "Weiterleitungen und Formulare werden analysiert…",
      "Rechtliche Angaben und Kontaktsignale werden geprüft…",
      "Vorsichtsindex wird berechnet…",
    ],
    report: "VONU CHECK BERICHT",
    forensicSummary: "Technische Zusammenfassung",
    confidence: "Analysevertrauen",
    limited: "Begrenzt",
    medium: "Mittel",
    evidence: "Signale und Belege",
    recommendation: "Was Vonu tun würde",
    lowAdvice: "In dieser ersten technischen Schicht sehen wir keine starken Risikosignale. Vor größeren Zahlungen sollten Identität und Reputation dennoch geprüft werden.",
    cautionAdvice: "Einige Signale sollten genauer geprüft werden. Wir würden noch nicht zahlen, ohne den Betreiber besser zu verifizieren.",
    highAdvice: "Mehrere relevante Risikosignale wurden erkannt. Wir würden keine sensiblen Daten eingeben und nicht zahlen, bevor die Website unabhängig geprüft wurde.",
    newCheck: "Andere Website prüfen",
    engine: "Technischer Motor aktiv",
    noHistory: "Ohne Konto · Diese Preview speichert keinen Verlauf",
    analyzedUrl: "Analysierte Website",
    strongestSignals: "Wichtigste Diagnosepunkte",
  },
  ar: {
    analyzer: "تحليل",
    urlMode: "رابط أو URL",
    imageMode: "لقطة شاشة",
    textMode: "رسالة أو نص",
    soon: "قريباً",
    scanTitle: "جارٍ فحص إشارات المخاطر",
    scanSteps: [
      "جارٍ التحقق من النطاق والوجهة النهائية…",
      "جارٍ فحص HTTPS واستجابة HTTP…",
      "جارٍ مراجعة عمليات إعادة التوجيه والنماذج…",
      "جارٍ تحليل المعلومات القانونية وبيانات الاتصال…",
      "جارٍ حساب مؤشر الحذر…",
    ],
    report: "تقرير VONU CHECK",
    forensicSummary: "الملخص التقني",
    confidence: "ثقة التحليل",
    limited: "محدودة",
    medium: "متوسطة",
    evidence: "الإشارات والأدلة",
    recommendation: "ماذا سيفعل Vonu",
    lowAdvice: "لم نرصد إشارات تقنية قوية للمخاطر في هذه الطبقة الأولى، لكن ننصح بالتحقق من الهوية والسمعة قبل أي دفعة مهمة.",
    cautionAdvice: "هناك إشارات تستحق مزيداً من التحقق. لن ندفع قبل التأكد بشكل أفضل ممن يقف خلف الموقع.",
    highAdvice: "تم رصد عدة إشارات مهمة للمخاطر. لن ندخل بيانات حساسة أو نجري دفعاً قبل التحقق من الموقع بشكل مستقل.",
    newCheck: "تحليل موقع آخر",
    engine: "المحرك التقني نشط",
    noHistory: "بدون تسجيل · النسخة التجريبية لا تحفظ السجل",
    analyzedUrl: "الموقع الذي تم تحليله",
    strongestSignals: "أهم نقاط التشخيص",
  },
};

function riskTheme(level: WebCheckResult["risk"]["level"]) {
  if (level === "high") return { accent: "#fb5b67", soft: "rgba(251,91,103,.09)", border: "rgba(251,91,103,.24)" };
  if (level === "caution") return { accent: "#f5b84b", soft: "rgba(245,184,75,.09)", border: "rgba(245,184,75,.24)" };
  if (level === "low") return { accent: "#49d79c", soft: "rgba(73,215,156,.09)", border: "rgba(73,215,156,.24)" };
  return { accent: "#8fa0b3", soft: "rgba(143,160,179,.08)", border: "rgba(143,160,179,.22)" };
}

function signalColors(tone: WebCheckResult["signals"][number]["tone"]) {
  if (tone === "negative") return { dot: "#fb5b67", bg: "rgba(251,91,103,.05)", border: "rgba(251,91,103,.16)" };
  if (tone === "warning") return { dot: "#f5b84b", bg: "rgba(245,184,75,.05)", border: "rgba(245,184,75,.16)" };
  if (tone === "positive") return { dot: "#49d79c", bg: "rgba(73,215,156,.05)", border: "rgba(73,215,156,.16)" };
  return { dot: "#8fa0b3", bg: "rgba(143,160,179,.04)", border: "rgba(143,160,179,.13)" };
}

function GlobeIcon() {
  return <span aria-hidden="true" className="text-xl">◎</span>;
}
function CameraIcon() {
  return <span aria-hidden="true" className="text-xl">▣</span>;
}
function MessageIcon() {
  return <span aria-hidden="true" className="text-xl">▤</span>;
}

export default function CheckClient({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const x = ui[locale];
  const meta = localeMeta[locale];
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<WebCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);

  const riskLabel = useMemo(() => {
    if (!result) return "";
    return t[result.risk.level];
  }, [result, t]);

  const theme = result ? riskTheme(result.risk.level) : riskTheme("unknown");

  useEffect(() => {
    if (!loading) return;
    setScanStep(0);
    const timer = window.setInterval(() => {
      setScanStep((current) => Math.min(current + 1, x.scanSteps.length - 1));
    }, 650);
    return () => window.clearInterval(timer);
  }, [loading, x.scanSteps.length]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/check/web", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, locale }),
      });
      if (!response.ok) throw new Error("check_failed");
      const data = (await response.json()) as WebCheckResult;
      setResult(data);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  const recommendation = result
    ? result.risk.level === "high"
      ? x.highAdvice
      : result.risk.level === "caution"
        ? x.cautionAdvice
        : x.lowAdvice
    : "";

  const diagnosticSignals = result
    ? [...result.signals].sort((a, b) => b.weight - a.weight).slice(0, 4)
    : [];

  return (
    <main dir={meta.dir} className="min-h-screen overflow-hidden bg-[#070a0f] text-[#f5f8fb]">
      <div className="pointer-events-none fixed inset-0 opacity-80" style={{ background: "radial-gradient(circle at 50% 12%, rgba(26,190,132,.12), transparent 30%), radial-gradient(circle at 85% 28%, rgba(44,126,161,.10), transparent 24%)" }} />
      <div className="pointer-events-none fixed inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />

      <header className="relative z-20 border-b border-white/[0.07] bg-[#070a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/${locale}/check`} className="flex items-center gap-2 font-black tracking-[-0.04em]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-400/10 text-emerald-300">V</span>
            <span>VONU</span>
          </Link>
          <nav className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 text-[11px] font-semibold text-slate-400">
            {supportedLocales.map((item) => (
              <Link key={item} href={`/${item}/check`} className={`rounded-full px-2.5 py-1.5 transition ${item === locale ? "bg-white text-slate-950" : "hover:bg-white/[0.06] hover:text-white"}`}>
                {localeMeta[item].label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
        {!result && !loading && (
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.75)]" />
              VONU CHECK · WEB
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[.95] tracking-[-0.065em] text-white sm:text-7xl">
              {t.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{t.subheading}</p>

            <div className="relative mx-auto mt-10 max-w-3xl">
              <div className="absolute -inset-8 -z-10 rounded-full bg-emerald-400/[0.045] blur-3xl" />
              <form onSubmit={submit} className="group rounded-[28px] border border-emerald-300/15 bg-[#0c1118]/90 p-2 shadow-[0_28px_100px_rgba(0,0,0,.42)] transition focus-within:border-emerald-300/45 focus-within:shadow-[0_0_0_1px_rgba(110,231,183,.12),0_28px_100px_rgba(0,0,0,.48),0_0_42px_rgba(52,211,153,.08)]">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-h-16 flex-1 items-center rounded-[21px] border border-white/[0.06] bg-white/[0.035] px-4 transition group-focus-within:bg-white/[0.05]">
                    <span className="me-3 font-mono text-[11px] font-bold tracking-[0.12em] text-emerald-300/80">{x.analyzer}:</span>
                    <input
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder={t.placeholder}
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-label={t.placeholder}
                      className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-slate-600 sm:text-base"
                    />
                  </div>
                  <button type="submit" disabled={!url.trim() || loading} className="min-h-16 rounded-[21px] bg-emerald-300 px-7 text-sm font-black text-[#07110d] shadow-[0_0_28px_rgba(110,231,183,.12)] transition hover:bg-emerald-200 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-[155px]">
                    {t.button}
                  </button>
                </div>
              </form>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.06] p-3 text-emerald-200 sm:p-4">
                  <div className="flex justify-center"><GlobeIcon /></div>
                  <div className="mt-2 text-[11px] font-bold sm:text-xs">{x.urlMode}</div>
                </div>
                <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 text-slate-500 sm:p-4">
                  <div className="absolute end-2 top-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-500">{x.soon}</div>
                  <div className="flex justify-center"><CameraIcon /></div>
                  <div className="mt-2 text-[11px] font-bold sm:text-xs">{x.imageMode}</div>
                </div>
                <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 text-slate-500 sm:p-4">
                  <div className="absolute end-2 top-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-500">{x.soon}</div>
                  <div className="flex justify-center"><MessageIcon /></div>
                  <div className="mt-2 text-[11px] font-bold sm:text-xs">{x.textMode}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span>◉ {t.privacy}</span>
                <span>✓ {t.firstFree}</span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mx-auto max-w-3xl pt-4 text-center">
            <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
              <div className="absolute inset-7 rounded-full border border-emerald-300/15" />
              <div className="absolute inset-14 rounded-full border border-emerald-300/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-t border-emerald-300/80 shadow-[0_-8px_30px_rgba(110,231,183,.12)] [animation-duration:2.8s]" />
              <div className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_26px_rgba(110,231,183,.9)]" />
            </div>
            <p className="mt-3 text-xs font-bold tracking-[0.2em] text-emerald-300">{x.scanTitle.toUpperCase()}</p>
            <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{x.scanSteps[scanStep]}</h2>
            <div className="mx-auto mt-7 flex max-w-md gap-1.5">
              {x.scanSteps.map((_, index) => (
                <span key={index} className={`h-1 flex-1 rounded-full transition-all duration-300 ${index <= scanStep ? "bg-emerald-300" : "bg-white/[0.08]"}`} />
              ))}
            </div>
            <p className="mt-6 break-all font-mono text-xs text-slate-600">{url}</p>
          </div>
        )}

        {error && !loading && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm font-medium text-red-200">{error}</div>
        )}

        {result && !loading && (
          <section className="mx-auto max-w-5xl space-y-5">
            <div className="rounded-[32px] border p-6 sm:p-8" style={{ borderColor: theme.border, background: `radial-gradient(circle at 88% 15%, ${theme.soft}, transparent 30%), #0b1016` }}>
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500">{x.report}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.accent, boxShadow: `0 0 22px ${theme.accent}` }} />
                    <h2 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl" style={{ color: theme.accent }}>{riskLabel}</h2>
                  </div>
                  <p className="mt-4 break-all font-mono text-xs text-slate-500">{result.facts.hostname}</p>
                </div>

                <div className="flex items-center gap-6 rounded-3xl border border-white/[0.07] bg-black/20 px-6 py-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{t.score}</div>
                    <div className="mt-1 text-5xl font-black tracking-[-0.07em] text-white">{result.risk.score}<span className="ms-1 text-lg text-slate-600">/100</span></div>
                  </div>
                  <div className="h-12 w-px bg-white/[0.08]" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{x.confidence}</div>
                    <div className="mt-2 text-sm font-bold text-slate-200">{result.risk.confidence === "medium" ? x.medium : x.limited}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
              <section className="rounded-[28px] border border-white/[0.07] bg-[#0b1016] p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold tracking-[-0.035em]">{x.strongestSignals}</h3>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 font-mono text-[10px] text-slate-500">{result.signals.length} SIGNALS</span>
                </div>
                <div className="mt-5 space-y-3">
                  {diagnosticSignals.map((item) => {
                    const c = signalColors(item.tone);
                    return (
                      <article key={`${item.id}-${item.detail}`} className="rounded-2xl border p-4" style={{ borderColor: c.border, backgroundColor: c.bg }}>
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.dot, boxShadow: `0 0 12px ${c.dot}` }} />
                          <div>
                            <h4 className="font-bold text-slate-100">{item.title}</h4>
                            <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="rounded-[28px] border border-white/[0.07] bg-[#0b1016] p-5 sm:p-7">
                <h3 className="text-xl font-bold tracking-[-0.035em]">{x.forensicSummary}</h3>
                <dl className="mt-5 divide-y divide-white/[0.06] text-sm">
                  <div className="py-3 first:pt-0"><dt className="text-xs font-semibold text-slate-600">{x.analyzedUrl}</dt><dd className="mt-1 break-all font-mono text-xs text-slate-300">{result.facts.finalUrl}</dd></div>
                  <div className="py-3"><dt className="text-xs font-semibold text-slate-600">{t.httpStatus}</dt><dd className="mt-1 font-bold text-slate-200">{result.facts.httpStatus ?? "—"}</dd></div>
                  <div className="py-3"><dt className="text-xs font-semibold text-slate-600">{t.redirects}</dt><dd className="mt-1 font-bold text-slate-200">{result.facts.redirects}</dd></div>
                  <div className="py-3"><dt className="text-xs font-semibold text-slate-600">HTTPS</dt><dd className={`mt-1 font-bold ${result.facts.usesHttps ? "text-emerald-300" : "text-red-300"}`}>{result.facts.usesHttps ? "✓" : "✕"}</dd></div>
                  <div className="py-3"><dt className="text-xs font-semibold text-slate-600">{t.pageTitleLabel}</dt><dd className="mt-1 text-slate-300">{result.facts.title || "—"}</dd></div>
                  <div className="pt-3"><dt className="text-xs font-semibold text-slate-600">{t.forms}</dt><dd className="mt-1 font-bold text-slate-200">{result.facts.formCount}</dd></div>
                </dl>
              </aside>
            </div>

            <section className="rounded-[28px] border p-5 sm:p-7" style={{ borderColor: theme.border, backgroundColor: theme.soft }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: theme.accent }}>{x.recommendation}</p>
                  <p className="mt-3 text-base font-medium leading-7 text-slate-200">{recommendation}</p>
                </div>
                <button onClick={() => { setResult(null); setUrl(""); setError(null); }} className="shrink-0 rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">{x.newCheck}</button>
              </div>
            </section>

            <div className="flex flex-col gap-2 px-1 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>● {x.engine}</span>
              <span>{x.noHistory}</span>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-xs leading-5 text-slate-600">
              {t.disclaimer} {t.noCertification}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
