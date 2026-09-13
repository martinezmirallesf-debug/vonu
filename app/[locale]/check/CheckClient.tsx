"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { copy, localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type ExtraCopy = {
  navProduct: string;
  navMethod: string;
  navPrivacy: string;
  analyzer: string;
  urlMode: string;
  imageMode: string;
  textMode: string;
  soon: string;
  scanTitle: string;
  scanSteps: string[];
  reportLabel: string;
  confidence: string;
  confidenceLimited: string;
  confidenceMedium: string;
  evidence: string;
  technical: string;
  recommendation: string;
  recommendationLow: string;
  recommendationCaution: string;
  recommendationHigh: string;
  newCheck: string;
  activeEngine: string;
  privacyNote: string;
};

const extra: Record<SupportedLocale, ExtraCopy> = {
  es: {
    navProduct: "Vonu Check",
    navMethod: "Metodología",
    navPrivacy: "Privacidad",
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
    reportLabel: "INFORME VONU CHECK",
    confidence: "Confianza del análisis",
    confidenceLimited: "Limitada",
    confidenceMedium: "Media",
    evidence: "Señales y evidencias",
    technical: "Ficha técnica",
    recommendation: "Qué haría Vonu",
    recommendationLow: "No vemos señales técnicas fuertes de riesgo en esta primera capa. Aun así, comprueba identidad y reputación antes de un pago importante.",
    recommendationCaution: "Hay señales que merecen revisión. No pagaríamos todavía sin comprobar mejor quién está detrás de la web.",
    recommendationHigh: "Hay varias señales relevantes de riesgo. No introduciríamos datos sensibles ni realizaríamos el pago hasta verificar la web por otras vías.",
    newCheck: "Analizar otra web",
    activeEngine: "Motor técnico activo",
    privacyNote: "Sin registro · La preview todavía no guarda historial de análisis",
  },
  en: {
    navProduct: "Vonu Check",
    navMethod: "Method",
    navPrivacy: "Privacy",
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
    reportLabel: "VONU CHECK REPORT",
    confidence: "Analysis confidence",
    confidenceLimited: "Limited",
    confidenceMedium: "Medium",
    evidence: "Signals and evidence",
    technical: "Technical sheet",
    recommendation: "What Vonu would do",
    recommendationLow: "We do not see strong technical risk signals in this first layer. Still verify identity and reputation before an important payment.",
    recommendationCaution: "Some signals deserve review. We would not pay yet without checking who is behind the website.",
    recommendationHigh: "Several relevant risk signals were found. We would not enter sensitive data or pay until the website is independently verified.",
    newCheck: "Check another site",
    activeEngine: "Technical engine active",
    privacyNote: "No account · This preview does not store analysis history yet",
  },
  fr: {
    navProduct: "Vonu Check",
    navMethod: "Méthode",
    navPrivacy: "Confidentialité",
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
    reportLabel: "RAPPORT VONU CHECK",
    confidence: "Confiance de l’analyse",
    confidenceLimited: "Limitée",
    confidenceMedium: "Moyenne",
    evidence: "Signaux et preuves",
    technical: "Fiche technique",
    recommendation: "Ce que ferait Vonu",
    recommendationLow: "Nous ne voyons pas de signal technique fort de risque dans cette première couche. Vérifiez tout de même l’identité et la réputation avant un paiement important.",
    recommendationCaution: "Certains signaux méritent une vérification. Nous ne paierions pas avant de mieux identifier qui se trouve derrière le site.",
    recommendationHigh: "Plusieurs signaux de risque importants ont été détectés. Nous n’entrerions aucune donnée sensible et ne paierions pas avant une vérification indépendante.",
    newCheck: "Analyser un autre site",
    activeEngine: "Moteur technique actif",
    privacyNote: "Sans compte · Cette preview ne conserve pas encore l’historique",
  },
  de: {
    navProduct: "Vonu Check",
    navMethod: "Methodik",
    navPrivacy: "Datenschutz",
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
    reportLabel: "VONU CHECK BERICHT",
    confidence: "Analysevertrauen",
    confidenceLimited: "Begrenzt",
    confidenceMedium: "Mittel",
    evidence: "Signale und Belege",
    technical: "Technische Daten",
    recommendation: "Was Vonu tun würde",
    recommendationLow: "In dieser ersten technischen Schicht sehen wir keine starken Risikosignale. Vor größeren Zahlungen sollten Identität und Reputation dennoch geprüft werden.",
    recommendationCaution: "Einige Signale sollten genauer geprüft werden. Wir würden noch nicht zahlen, ohne den Betreiber besser zu verifizieren.",
    recommendationHigh: "Mehrere relevante Risikosignale wurden erkannt. Wir würden keine sensiblen Daten eingeben und nicht zahlen, bevor die Website unabhängig geprüft wurde.",
    newCheck: "Andere Website prüfen",
    activeEngine: "Technischer Motor aktiv",
    privacyNote: "Ohne Konto · Diese Preview speichert noch keinen Analyseverlauf",
  },
  ar: {
    navProduct: "Vonu Check",
    navMethod: "المنهجية",
    navPrivacy: "الخصوصية",
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
    reportLabel: "تقرير VONU CHECK",
    confidence: "ثقة التحليل",
    confidenceLimited: "محدودة",
    confidenceMedium: "متوسطة",
    evidence: "الإشارات والأدلة",
    technical: "البيانات التقنية",
    recommendation: "ماذا سيفعل Vonu",
    recommendationLow: "لم نرصد إشارات تقنية قوية للمخاطر في هذه الطبقة الأولى، لكن ننصح بالتحقق من الهوية والسمعة قبل أي دفعة مهمة.",
    recommendationCaution: "هناك إشارات تستحق مزيداً من التحقق. لن ندفع قبل التأكد بشكل أفضل ممن يقف خلف الموقع.",
    recommendationHigh: "تم رصد عدة إشارات مهمة للمخاطر. لن ندخل بيانات حساسة أو نجري دفعاً قبل التحقق من الموقع بشكل مستقل.",
    newCheck: "تحليل موقع آخر",
    activeEngine: "المحرك التقني نشط",
    privacyNote: "بدون تسجيل · النسخة التجريبية لا تحفظ سجل التحليلات بعد",
  },
};

function riskTheme(level: WebCheckResult["risk"]["level"]) {
  if (level === "high") {
    return {
      accent: "#fb5b67",
      soft: "rgba(251,91,103,0.10)",
      border: "rgba(251,91,103,0.26)",
      glow: "rgba(251,91,103,0.16)",
    };
  }
  if (level === "caution") {
    return {
      accent: "#f6b84a",
      soft: "rgba(246,184,74,0.10)",
      border: "rgba(246,184,74,0.26)",
      glow: "rgba(246,184,74,0.14)",
    };
  }
  if (level === "low") {
    return {
      accent: "#49d79c",
      soft: "rgba(73,215,156,0.10)",
      border: "rgba(73,215,156,0.26)",
      glow: "rgba(73,215,156,0.14)",
    };
  }
  return {
    accent: "#8b9aaa",
    soft: "rgba(139,154,170,0.10)",
    border: "rgba(139,154,170,0.24)",
    glow: "rgba(139,154,170,0.10)",
  };
}

function signalTheme(tone: WebCheckResult["signals"][number]["tone"]) {
  if (tone === "negative") return { dot: "#fb5b67", border: "rgba(251,91,103,.18)", bg: "rgba(251,91,103,.055)" };
  if (tone === "warning") return { dot: "#f6b84a", border: "rgba(246,184,74,.18)", bg: "rgba(246,184,74,.055)" };
  if (tone === "positive") return { dot: "#49d79c", border: "rgba(73,215,156,.18)", bg: "rgba(73,215,156,.055)" };
  return { dot: "#8291a3", border: "rgba(130,145,163,.16)", bg: "rgba(130,145,163,.04)" };
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.8 12h16.4M12 3.5c2.15 2.35 3.25 5.18 3.25 8.5S14.15 18.15 12 20.5M12 3.5C9.85 5.85 8.75 8.68 8.75 12s1.1 6.15 3.25 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M5 7.5h2.1l1.35-2h7.1l1.35 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4.5 3v-3.4A2 2 0 0 1 3 14.7V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7.5 9.5h9M7.5 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M12 3.4 19 6v5.1c0 4.35-2.72 7.48-7 9.5-4.28-2.02-7-5.15-7-9.5V6l7-2.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.7 12 2.1 2.1 4.6-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Radar({ compact = false }: { compact?: boolean }) {
  const size = compact ? "h-32 w-32" : "h-56 w-56 sm:h-64 sm:w-64";
  return (
    <div className={`relative ${size} shrink-0`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-emerald-300/15" />
      <div className="absolute inset-[14%] rounded-full border border-emerald-300/12" />
      <div className="absolute inset-[28%] rounded-full border border-emerald-300/10" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-300/10" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-emerald-300/10" />
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          animationDuration: "3.4s",
          background: "conic-gradient(from 0deg, rgba(70,220,166,.30), rgba(70,220,166,0) 24%, rgba(70,220,166,0) 100%)",
          maskImage: "radial-gradient(circle, transparent 0 8%, #000 9% 100%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 0 8%, #000 9% 100%)",
        }}
      />
      <div className="absolute left-[63%] top-[23%] h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_22px_rgba(110,255,198,.9)]" />
      <div className="absolute left-[25%] top-[62%] h-1.5 w-1.5 rounded-full bg-emerald-200/80 shadow-[0_0_16px_rgba(110,255,198,.7)]" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200" />
    </div>
  );
}

export default function CheckClient({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const x = extra[locale];
  const meta = localeMeta[locale];
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<WebCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    setScanStage(0);
    const timer = window.setInterval(() => {
      setScanStage((current) => Math.min(current + 1, x.scanSteps.length - 1));
    }, 720);
    return () => window.clearInterval(timer);
  }, [loading, x.scanSteps.length]);

  const riskLabel = useMemo(() => {
    if (!result) return "";
    return t[result.risk.level];
  }, [result, t]);

  const recommendation = useMemo(() => {
    if (!result) return "";
    if (result.risk.level === "high") return x.recommendationHigh;
    if (result.risk.level === "caution") return x.recommendationCaution;
    return x.recommendationLow;
  }, [result, x]);

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

  function reset() {
    setResult(null);
    setError(null);
    setUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const backgroundStyle = {
    backgroundColor: "#070a0f",
    backgroundImage:
      "radial-gradient(circle at 70% 6%, rgba(16,118,96,.18), transparent 31%), radial-gradient(circle at 15% 35%, rgba(39,74,105,.12), transparent 26%), linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px)",
    backgroundSize: "auto, auto, 44px 44px, 44px 44px",
  } as const;

  return (
    <main dir={meta.dir} className="min-h-screen overflow-hidden text-white" style={backgroundStyle}>
      <header className="relative z-30 border-b border-white/[0.06] bg-[#080c12]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}/check`} className="group flex items-center gap-2.5">
            <span className="relative block h-7 w-7 rotate-45 rounded-[7px] border border-emerald-300/40 bg-emerald-300/10 shadow-[0_0_28px_rgba(62,220,157,.12)]">
              <span className="absolute inset-[6px] rounded-[3px] bg-gradient-to-br from-emerald-300 to-teal-500" />
            </span>
            <span className="text-lg font-black tracking-[-0.045em]">VONU</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden items-center gap-6 text-xs font-semibold text-slate-400 md:flex">
              <span className="text-slate-200">{x.navProduct}</span>
              <span className="cursor-default">{x.navMethod}</span>
              <span className="cursor-default">{x.navPrivacy}</span>
            </nav>
            <div className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.025] p-1 text-[11px] font-bold text-slate-400">
              {supportedLocales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}/check`}
                  className={`rounded-full px-2.5 py-1.5 transition ${item === locale ? "bg-white/[0.10] text-white" : "hover:text-white"}`}
                >
                  {localeMeta[item].label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {!result && !loading && (
        <section className="relative mx-auto max-w-[1240px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="pointer-events-none absolute left-1/2 top-12 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-500/[0.035] blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.045] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              {t.eyebrow}
            </div>
            <h1 className="mx-auto mt-6 max-w-4xl text-[46px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[68px] lg:text-[82px]">
              {t.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-7 text-slate-400 sm:text-[18px]">
              {t.subheading}
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
            <div className="absolute -inset-px rounded-[34px] bg-gradient-to-b from-emerald-300/25 via-cyan-300/[0.04] to-transparent blur-[1px]" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/[0.09] bg-[#0c121b]/95 shadow-[0_34px_100px_rgba(0,0,0,.5),0_0_80px_rgba(37,201,145,.035)]">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(89,236,182,.06), transparent)", backgroundSize: "45% 100%" }} />
              <div className="relative p-4 sm:p-7 lg:p-9">
                <form onSubmit={submit}>
                  <div className="flex items-center gap-3 rounded-[18px] border border-white/[0.08] bg-[#070b11] px-4 py-2 shadow-inner shadow-black/40 focus-within:border-emerald-300/30">
                    <span className="hidden text-[11px] font-black tracking-[0.15em] text-emerald-300/75 sm:block">{x.analyzer}:</span>
                    <input
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder={t.placeholder}
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="min-h-12 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-white outline-none placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={!url.trim()}
                      className="shrink-0 rounded-[13px] bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-3 text-xs font-black text-[#04100c] shadow-[0_0_28px_rgba(64,224,163,.13)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {t.button}
                    </button>
                  </div>
                </form>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button type="button" className="group rounded-[20px] border border-emerald-300/18 bg-emerald-300/[0.045] p-5 text-start transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.065]" onClick={() => document.querySelector<HTMLInputElement>('input[inputmode="url"]')?.focus()}>
                    <span className="text-emerald-300"><GlobeIcon /></span>
                    <span className="mt-4 block text-sm font-bold text-white">{x.urlMode}</span>
                    <span className="mt-1 block text-xs text-emerald-300/65">{x.activeEngine}</span>
                  </button>
                  <button type="button" disabled className="relative rounded-[20px] border border-white/[0.065] bg-white/[0.018] p-5 text-start opacity-60">
                    <span className="text-slate-400"><CameraIcon /></span>
                    <span className="mt-4 block text-sm font-bold text-slate-200">{x.imageMode}</span>
                    <span className="mt-1 block text-xs text-slate-500">{x.soon}</span>
                  </button>
                  <button type="button" disabled className="relative rounded-[20px] border border-white/[0.065] bg-white/[0.018] p-5 text-start opacity-60">
                    <span className="text-slate-400"><MessageIcon /></span>
                    <span className="mt-4 block text-sm font-bold text-slate-200">{x.textMode}</span>
                    <span className="mt-1 block text-xs text-slate-500">{x.soon}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldIcon /> {t.privacy}</span>
              <span>✓ {t.firstFree}</span>
              <span>{x.privacyNote}</span>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-[1100px] items-center justify-center px-4 py-14 sm:px-6">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.045] blur-3xl" />
          <div className="relative w-full overflow-hidden rounded-[34px] border border-emerald-300/15 bg-[#0a1017]/95 p-6 shadow-[0_34px_100px_rgba(0,0,0,.5)] sm:p-10 lg:p-14">
            <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
              <div className="flex justify-center"><Radar /></div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.045] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                  {x.activeEngine}
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{x.scanTitle}</h2>
                <p className="mt-3 break-all text-sm text-slate-500">{url}</p>

                <div className="mt-8 space-y-3">
                  {x.scanSteps.map((step, index) => {
                    const active = index === scanStage;
                    const done = index < scanStage;
                    return (
                      <div key={step} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${active ? "border-emerald-300/25 bg-emerald-300/[0.055] text-slate-100" : done ? "border-white/[0.05] bg-white/[0.018] text-slate-500" : "border-transparent text-slate-700"}`}>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${active ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-300" : done ? "border-emerald-300/15 text-emerald-300/55" : "border-white/[0.07] text-slate-700"}`}>
                          {done ? "✓" : index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {error && !loading && (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-[26px] border border-red-400/20 bg-red-400/[0.06] p-6 text-sm text-red-100">
            {error}
          </div>
        </section>
      )}

      {result && !loading && (() => {
        const theme = riskTheme(result.risk.level);
        const confidenceText = result.risk.confidence === "medium" ? x.confidenceMedium : x.confidenceLimited;
        return (
          <section className="relative mx-auto max-w-[1240px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[520px] rounded-full blur-3xl" style={{ background: theme.glow }} />

            <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{x.reportLabel}</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-300">{result.facts.hostname}</p>
              </div>
              <button onClick={reset} className="rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                {x.newCheck}
              </button>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-[32px] border p-6 sm:p-8 lg:p-10" style={{ borderColor: theme.border, background: `linear-gradient(120deg, ${theme.soft}, rgba(12,18,27,.94) 45%, rgba(8,12,18,.98))`, boxShadow: `0 30px 100px rgba(0,0,0,.42), 0 0 90px ${theme.glow}` }}>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_20px_currentColor]" style={{ backgroundColor: theme.accent, color: theme.accent }} />
                    <span className="text-xs font-black uppercase tracking-[0.19em]" style={{ color: theme.accent }}>{t.result}</span>
                  </div>
                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">{riskLabel}</h2>
                  <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-300 sm:text-base">{recommendation}</p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-black/15 px-3 py-2 text-[11px] font-semibold text-slate-400">
                    <ShieldIcon />
                    {x.confidence}: <span className="text-slate-200">{confidenceText}</span>
                  </div>
                </div>

                <div className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full sm:h-52 sm:w-52" style={{ background: `conic-gradient(${theme.accent} ${result.risk.score * 3.6}deg, rgba(255,255,255,.055) 0deg)` }}>
                  <div className="absolute inset-[8px] rounded-full border border-white/[0.06] bg-[#090e15]" />
                  <div className="relative text-center">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{t.score}</div>
                    <div className="mt-1 text-5xl font-black tracking-[-0.07em] text-white">{result.risk.score}<span className="text-base text-slate-600">/100</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[28px] border border-white/[0.07] bg-[#0a1017]/88 p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold tracking-[-0.025em] text-white">{x.evidence}</h3>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[10px] font-bold text-slate-500">{result.signals.length} SIGNALS</span>
                </div>
                <div className="mt-5 space-y-3">
                  {result.signals.map((item) => {
                    const itemTheme = signalTheme(item.tone);
                    return (
                      <article key={`${item.id}-${item.detail}`} className="rounded-[20px] border p-4 sm:p-5" style={{ borderColor: itemTheme.border, background: itemTheme.bg }}>
                        <div className="flex items-start gap-3.5">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: itemTheme.dot, boxShadow: `0 0 14px ${itemTheme.dot}` }} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="font-bold text-slate-100">{item.title}</h4>
                              {item.weight > 0 && <span className="shrink-0 rounded-full border border-white/[0.06] bg-black/20 px-2 py-1 text-[10px] font-bold text-slate-500">+{item.weight}</span>}
                            </div>
                            <p className="mt-1.5 text-sm leading-6 text-slate-400">{item.detail}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[28px] border border-white/[0.07] bg-[#0a1017]/88 p-5 sm:p-7">
                  <h3 className="text-lg font-bold tracking-[-0.025em] text-white">{x.technical}</h3>
                  <dl className="mt-5 space-y-0 text-sm">
                    {[
                      [t.finalUrl, result.facts.finalUrl],
                      [t.httpStatus, result.facts.httpStatus ?? "—"],
                      [t.redirects, result.facts.redirects],
                      [t.https, result.facts.usesHttps ? "✓" : "✕"],
                      [t.pageTitleLabel, result.facts.title || "—"],
                      [t.forms, result.facts.formCount],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="border-b border-white/[0.055] py-3.5 last:border-0">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.11em] text-slate-600">{label}</dt>
                        <dd className="mt-1 break-all font-medium text-slate-300">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-[28px] border border-emerald-300/12 bg-emerald-300/[0.035] p-5 sm:p-7">
                  <div className="flex items-center gap-2 text-emerald-300"><ShieldIcon /><h3 className="text-sm font-black uppercase tracking-[0.12em]">{x.recommendation}</h3></div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{recommendation}</p>
                </div>
              </aside>
            </div>

            <div className="relative mt-6 rounded-[24px] border border-white/[0.055] bg-white/[0.018] p-5 text-xs leading-5 text-slate-600 sm:p-6">
              <p>{t.disclaimer}</p>
              <p className="mt-2 text-slate-500">{t.noCertification}</p>
            </div>
          </section>
        );
      })()}
    </main>
  );
}
