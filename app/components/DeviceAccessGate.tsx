"use client";

import { useEffect, useState } from "react";
import DevicePackCheckoutButton from "./DevicePackCheckoutButton";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type PaymentState = "idle" | "activating" | "ready" | "delayed";
type EntitlementSnapshot = {
  freeUsed: boolean;
  creditsRemaining: number;
  lifetimeAnalyses: number;
};

const analyzeLabels = new Set([
  "Analizar ahora",
  "Analizar gratis",
  "Analyse now",
  "Analyse for free",
  "Analyser",
  "Analyser gratuitement",
  "Jetzt analysieren",
  "Kostenlos analysieren",
  "حلّل الآن",
  "حلّل مجانًا",
]);

const subjectModeByLabel = new Map<string, "url" | "capture" | "text">([
  ["Enlace analizado", "url"],
  ["Analysed link", "url"],
  ["Lien analysé", "url"],
  ["Analysierter Link", "url"],
  ["الرابط الذي تم تحليله", "url"],
  ["Captura analizada", "capture"],
  ["Analysed screenshot", "capture"],
  ["Capture analysée", "capture"],
  ["Analysierter Screenshot", "capture"],
  ["لقطة الشاشة التي تم تحليلها", "capture"],
  ["Mensaje analizado", "text"],
  ["Analysed message", "text"],
  ["Message analysé", "text"],
  ["Analysierte Nachricht", "text"],
  ["الرسالة التي تم تحليلها", "text"],
]);

const experienceCss = `
.vonu-check-page main > section[data-vonu-subject-mode] > :first-child {
  display: none !important;
}

.vonu-check-page main > section[data-vonu-subject-mode]::before {
  content: "";
  display: block;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  align-self: center;
  border-radius: 12px;
  border: 1px solid rgba(123, 183, 255, .28);
  background-color: rgba(123, 183, 255, .065);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 22px 22px;
  box-shadow: inset 0 0 0 1px rgba(123, 183, 255, .025);
}

.vonu-check-page main > section[data-vonu-subject-mode="url"]::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.vonu-check-page main > section[data-vonu-subject-mode="capture"]::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Crect x='3' y='3' width='18' height='18' rx='2.5' stroke='%237bb7ff' stroke-width='1.9'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%237bb7ff' stroke-width='1.8'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.vonu-check-page main > section[data-vonu-subject-mode="text"]::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M7.5 8.5h9M7.5 12.5h6' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round'/%3E%3C/svg%3E");
}

.vonu-check-page [data-vonu-radar="true"] {
  isolation: isolate;
}

.vonu-check-page [data-vonu-radar="true"]::before,
.vonu-check-page [data-vonu-radar="true"]::after {
  content: "";
  position: absolute;
  z-index: 4;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  pointer-events: none;
  animation: vonuRadarBlip 1.65s ease-in-out infinite;
}

.vonu-check-page [data-vonu-radar="true"]::before {
  left: 31%;
  top: 27%;
  background: #7bb7ff;
  box-shadow:
    55px 24px 0 -1px rgba(123, 183, 255, .82),
    -13px 58px 0 -1px rgba(52, 211, 153, .78);
}

.vonu-check-page [data-vonu-radar="true"]::after {
  left: 69%;
  top: 63%;
  background: #34d399;
  animation-delay: .48s;
  box-shadow:
    -64px -18px 0 -1px rgba(52, 211, 153, .78),
    -26px 35px 0 -1px rgba(123, 183, 255, .72);
}

.vonu-check-page [data-vonu-progress="true"] {
  position: relative !important;
}

.vonu-check-page [data-vonu-progress="true"] > div {
  position: absolute !important;
  inset-block: 0 !important;
  inset-inline-start: 0 !important;
  width: 38% !important;
  animation: vonuProgressSweep 1.25s ease-in-out infinite !important;
  will-change: transform, opacity;
}

html[dir="rtl"] .vonu-check-page [data-vonu-progress="true"] > div {
  animation-name: vonuProgressSweepRtl !important;
}

@keyframes vonuRadarBlip {
  0%, 100% { opacity: .22; transform: scale(.72); filter: drop-shadow(0 0 0 rgba(123,183,255,0)); }
  45% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 7px rgba(123,183,255,.7)); }
  68% { opacity: .55; transform: scale(.86); }
}

@keyframes vonuProgressSweep {
  0% { transform: translateX(-130%); opacity: .45; }
  45% { opacity: 1; }
  100% { transform: translateX(300%); opacity: .55; }
}

@keyframes vonuProgressSweepRtl {
  0% { transform: translateX(130%); opacity: .45; }
  45% { opacity: 1; }
  100% { transform: translateX(-300%); opacity: .55; }
}
`;

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  note: string;
  close: string;
  success: string;
  activating: string;
  delayed: string;
  analyze: string;
  analyzeFree: string;
  originalFreeLabel: string;
  freeAvailable: string;
  freeUsed: string;
  creditsAvailable: (count: number) => string;
}> = {
  es: {
    eyebrow: "Primer análisis agotado",
    title: "Sigue con 3 análisis más por 3,99 €",
    text: "Pago único. Sin registro, sin suscripción y sin renovación automática.",
    cta: "Comprar 3 análisis · 3,99 €",
    note: "Los 3 análisis quedan asociados a este navegador/dispositivo.",
    close: "Cerrar",
    success: "Pago confirmado. Tus análisis ya están disponibles en este dispositivo.",
    activating: "Pago recibido. Estamos activando tus análisis…",
    delayed: "El pago se ha completado, pero la activación está tardando unos segundos. Recarga esta página en un momento; no vuelvas a pagar.",
    analyze: "Analizar ahora",
    analyzeFree: "Analizar gratis",
    originalFreeLabel: "Primer análisis gratuito",
    freeAvailable: "1 análisis gratuito disponible",
    freeUsed: "Análisis gratuito utilizado",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "análisis disponible" : "análisis disponibles"}`,
  },
  en: {
    eyebrow: "Free analysis used",
    title: "Continue with 3 more analyses for €3.99",
    text: "One-time payment. No account, no subscription and no automatic renewal.",
    cta: "Buy 3 analyses · €3.99",
    note: "The 3 analyses stay linked to this browser/device.",
    close: "Close",
    success: "Payment confirmed. Your analyses are now available on this device.",
    activating: "Payment received. We are activating your analyses…",
    delayed: "Payment completed, but activation is taking a few seconds. Reload this page shortly; do not pay again.",
    analyze: "Analyse now",
    analyzeFree: "Analyse for free",
    originalFreeLabel: "First analysis free",
    freeAvailable: "1 free analysis available",
    freeUsed: "Free analysis used",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analysis available" : "analyses available"}`,
  },
  fr: {
    eyebrow: "Analyse gratuite utilisée",
    title: "Continuez avec 3 analyses de plus pour 3,99 €",
    text: "Paiement unique. Sans compte, sans abonnement et sans renouvellement automatique.",
    cta: "Acheter 3 analyses · 3,99 €",
    note: "Les 3 analyses restent liées à ce navigateur/appareil.",
    close: "Fermer",
    success: "Paiement confirmé. Vos analyses sont maintenant disponibles sur cet appareil.",
    activating: "Paiement reçu. Activation de vos analyses…",
    delayed: "Le paiement est terminé mais l’activation prend quelques secondes. Rechargez cette page dans un instant ; ne payez pas à nouveau.",
    analyze: "Analyser",
    analyzeFree: "Analyser gratuitement",
    originalFreeLabel: "Première analyse gratuite",
    freeAvailable: "1 analyse gratuite disponible",
    freeUsed: "Analyse gratuite utilisée",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analyse disponible" : "analyses disponibles"}`,
  },
  de: {
    eyebrow: "Kostenlose Analyse genutzt",
    title: "Weiter mit 3 weiteren Analysen für 3,99 €",
    text: "Einmalige Zahlung. Kein Konto, kein Abo und keine automatische Verlängerung.",
    cta: "3 Analysen kaufen · 3,99 €",
    note: "Die 3 Analysen bleiben mit diesem Browser/Gerät verknüpft.",
    close: "Schließen",
    success: "Zahlung bestätigt. Deine Analysen sind auf diesem Gerät verfügbar.",
    activating: "Zahlung erhalten. Deine Analysen werden aktiviert…",
    delayed: "Die Zahlung ist abgeschlossen, aber die Aktivierung dauert noch kurz. Lade die Seite gleich neu; zahle nicht erneut.",
    analyze: "Jetzt analysieren",
    analyzeFree: "Kostenlos analysieren",
    originalFreeLabel: "Erste Analyse kostenlos",
    freeAvailable: "1 kostenlose Analyse verfügbar",
    freeUsed: "Kostenlose Analyse genutzt",
    creditsAvailable: (count) => `${count}/3 Analysen verfügbar`,
  },
  ar: {
    eyebrow: "تم استخدام التحليل المجاني",
    title: "تابع مع 3 تحليلات إضافية مقابل 3.99 €",
    text: "دفعة واحدة فقط. بدون حساب أو اشتراك أو تجديد تلقائي.",
    cta: "شراء 3 تحليلات · 3.99 €",
    note: "ترتبط التحليلات الثلاثة بهذا المتصفح/الجهاز.",
    close: "إغلاق",
    success: "تم تأكيد الدفع. أصبحت تحليلاتك متاحة الآن على هذا الجهاز.",
    activating: "تم استلام الدفع. جارٍ تفعيل تحليلاتك…",
    delayed: "اكتمل الدفع لكن التفعيل يستغرق بضع ثوانٍ. أعد تحميل الصفحة بعد قليل ولا تدفع مرة أخرى.",
    analyze: "حلّل الآن",
    analyzeFree: "حلّل مجانًا",
    originalFreeLabel: "أول تحليل مجاني",
    freeAvailable: "تحليل مجاني واحد متاح",
    freeUsed: "تم استخدام التحليل المجاني",
    creditsAvailable: (count) => `${count}/3 تحليلات متاحة`,
  },
};

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function entitlementFromData(data: any): EntitlementSnapshot {
  return {
    freeUsed: Boolean(data?.free_used),
    creditsRemaining: Math.max(0, Number(data?.credits_remaining || 0)),
    lifetimeAnalyses: Math.max(0, Number(data?.lifetime_analyses || 0)),
  };
}

export default function DeviceAccessGate({ locale }: { locale: SupportedLocale }) {
  const [open, setOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const t = copy[locale];

  useEffect(() => {
    let cancelled = false;
    let replayingAnalysisClick = false;
    let entitlementCheckPending = false;
    let entitlement: EntitlementSnapshot | null = null;
    const originalFetch = window.fetch.bind(window);

    function publishEntitlement(snapshot: EntitlementSnapshot) {
      window.dispatchEvent(new CustomEvent<EntitlementSnapshot>("vonu:entitlement", { detail: snapshot }));
    }

    function applyEntitlementUi() {
      if (!entitlement || cancelled) return;

      const freeAvailable = !entitlement.freeUsed && entitlement.creditsRemaining <= 0;
      const desiredButtonLabel = freeAvailable ? t.analyzeFree : t.analyze;

      document.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        const current = (button.textContent || "").trim();
        if (button.dataset.vonuAnalyzeCta === "true" || analyzeLabels.has(current)) {
          button.dataset.vonuAnalyzeCta = "true";
          if (current !== desiredButtonLabel) button.textContent = desiredButtonLabel;
        }
      });

      publishEntitlement(entitlement);
    }

    function applyVisualMarkers() {
      document.querySelectorAll<HTMLElement>("main > section").forEach((section) => {
        const label = section.querySelector<HTMLElement>(":scope > div:nth-child(2) > p:first-child");
        const mode = subjectModeByLabel.get((label?.textContent || "").trim());
        if (mode && section.dataset.vonuSubjectMode !== mode) {
          section.dataset.vonuSubjectMode = mode;
        }
      });

      const radar = Array.from(document.querySelectorAll<HTMLElement>("main div")).find(
        (element) =>
          element.classList.contains("relative") &&
          element.classList.contains("mx-auto") &&
          element.classList.contains("h-40") &&
          element.classList.contains("w-40"),
      );

      if (radar) {
        radar.dataset.vonuRadar = "true";
        const panel = radar.parentElement;
        const progress = panel
          ? Array.from(panel.children).find(
              (child) =>
                child instanceof HTMLElement &&
                child.classList.contains("h-1") &&
                child.classList.contains("overflow-hidden"),
            )
          : null;
        if (progress instanceof HTMLElement) progress.dataset.vonuProgress = "true";
      }
    }

    function applyUi() {
      applyEntitlementUi();
      applyVisualMarkers();
    }

    async function refreshEntitlement() {
      try {
        const response = await originalFetch("/api/check/entitlement", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (cancelled || !response.ok || !data) return null;
        entitlement = entitlementFromData(data);
        publishEntitlement(entitlement);
        applyUi();
        return entitlement;
      } catch {
        return null;
      }
    }

    async function confirmCredits() {
      setPaymentState("activating");

      for (let attempt = 0; attempt < 12 && !cancelled; attempt += 1) {
        try {
          const response = await originalFetch("/api/check/entitlement", {
            method: "GET",
            cache: "no-store",
          });
          const data = await response.json().catch(() => null);

          if (response.ok && data) {
            entitlement = entitlementFromData(data);
            publishEntitlement(entitlement);
        applyUi();

            if (entitlement.creditsRemaining > 0) {
              setPaymentState("ready");
              const clean = new URL(window.location.href);
              clean.searchParams.delete("checkout");
              clean.searchParams.delete("pack");
              window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
              return;
            }
          }
        } catch {
          // Stripe webhooks and the entitlement endpoint can briefly race after redirect.
        }

        await wait(attempt < 3 ? 500 : 1000);
      }

      if (!cancelled) setPaymentState("delayed");
    }

    async function preflightAnalysis(event: MouseEvent) {
      const origin = event.target;
      const button = origin instanceof Element ? origin.closest("button") : null;
      if (!button || !analyzeLabels.has((button.textContent || "").trim())) return;

      if (replayingAnalysisClick) {
        replayingAnalysisClick = false;
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (entitlementCheckPending) return;
      entitlementCheckPending = true;

      let shouldOpenPaywall = false;
      try {
        const response = await originalFetch("/api/check/entitlement", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (response.ok && data) {
          entitlement = entitlementFromData(data);
          publishEntitlement(entitlement);
        applyUi();
          shouldOpenPaywall = entitlement.freeUsed && entitlement.creditsRemaining <= 0;
        }
      } catch {
        // Fail open: the metered endpoint remains the source of truth and the
        // fetch interceptor below still catches a 402 if entitlement changed.
      } finally {
        entitlementCheckPending = false;
      }

      if (shouldOpenPaywall) {
        setOpen(true);
        return;
      }

      replayingAnalysisClick = true;
      button.click();
    }

    const observer = new MutationObserver(applyUi);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    applyVisualMarkers();
    void refreshEntitlement();

    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success" && params.get("pack") === "3") {
      void confirmCredits();
    }

    // Keep the server response as a second line of defence for races, Enter-key
    // submissions and any future analysis trigger that does not use the CTA.
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      const url = typeof input === "string" ? input : input instanceof URL ? input.pathname : input.url;
      const isAnalysisRequest = /\/api\/check\/(web|image|text)(?:\?|$)/.test(url);

      if (isAnalysisRequest && response.status === 402) {
        setOpen(true);
        void refreshEntitlement();
      } else if (isAnalysisRequest && response.ok) {
        void refreshEntitlement();
      }

      return response;
    };

    const onEntitlementRequest = () => {
      void refreshEntitlement();
    };
    window.addEventListener("vonu:entitlement:request", onEntitlementRequest);
    document.addEventListener("click", preflightAnalysis, true);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("vonu:entitlement:request", onEntitlementRequest);
      document.removeEventListener("click", preflightAnalysis, true);
      window.fetch = originalFetch;
    };
  }, [locale, t]);

  const paymentMessage =
    paymentState === "ready"
      ? t.success
      : paymentState === "activating"
        ? t.activating
        : paymentState === "delayed"
          ? t.delayed
          : null;

  return (
    <>
      <style>{experienceCss}</style>

      {paymentMessage && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "fixed inset-x-3 top-[calc(env(safe-area-inset-top)+10px)] z-[10080] mx-auto flex max-w-xl items-center justify-center rounded-2xl px-12 py-3.5 text-center text-[13px] leading-5 shadow-2xl backdrop-blur sm:top-4 sm:text-sm",
            paymentState === "delayed"
              ? "border border-amber-400/25 bg-[#1c1710]/97 text-amber-100"
              : "border border-[#7bb7ff]/25 bg-[#0d1620]/97 text-slate-100",
          ].join(" ")}
        >
          <span>{paymentMessage}</span>
          {paymentState !== "activating" && (
            <button
              type="button"
              onClick={() => setPaymentState("idle")}
              aria-label={t.close}
              className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-white/[0.045] text-[18px] font-semibold leading-none text-slate-300 transition hover:bg-white/[0.09] hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[10070] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-[480px] rounded-[28px] border border-white/[0.09] bg-[#111725] p-6 shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:p-7" dir={locale === "ar" ? "rtl" : "ltr"}>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.eyebrow}</p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.045em] text-white">{t.title}</h2>
            <p className="mt-4 text-[14px] leading-7 text-slate-400">{t.text}</p>
            <DevicePackCheckoutButton locale={locale} label={t.cta} className="mt-6 h-12 w-full rounded-xl bg-emerald-400 px-5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:opacity-70" />
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">{t.note}</p>
            <button type="button" onClick={() => setOpen(false)} className="mt-4 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] text-[13px] font-semibold text-slate-300 hover:bg-white/[0.055]">{t.close}</button>
          </div>
        </div>
      )}
    </>
  );
}
