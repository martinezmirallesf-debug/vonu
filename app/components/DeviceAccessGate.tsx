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

    function entitlementStatus(snapshot: EntitlementSnapshot) {
      if (!snapshot.freeUsed && snapshot.creditsRemaining <= 0) return t.freeAvailable;
      if (snapshot.creditsRemaining > 0) return t.creditsAvailable(snapshot.creditsRemaining);
      if (snapshot.lifetimeAnalyses >= 4) return t.creditsAvailable(0);
      return t.freeUsed;
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

      let status = document.querySelector<HTMLElement>('[data-vonu-entitlement-status="true"]');
      if (!status) {
        const expected = `✓ ${t.originalFreeLabel}`;
        status = Array.from(document.querySelectorAll<HTMLElement>("span")).find(
          (element) => (element.textContent || "").trim() === expected,
        ) || null;
        if (status) status.dataset.vonuEntitlementStatus = "true";
      }

      if (status) {
        const desiredStatus = entitlementStatus(entitlement);
        if ((status.textContent || "").trim() !== desiredStatus) status.textContent = desiredStatus;
      }
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
        applyEntitlementUi();
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
            applyEntitlementUi();

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
          applyEntitlementUi();
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

    const observer = new MutationObserver(() => applyEntitlementUi());
    observer.observe(document.body, { childList: true, subtree: true });

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

    document.addEventListener("click", preflightAnalysis, true);

    return () => {
      cancelled = true;
      observer.disconnect();
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
      {paymentMessage && (
        <div
          className={[
            "fixed inset-x-3 top-3 z-[90] mx-auto max-w-xl rounded-2xl px-4 py-3 text-center text-sm shadow-2xl backdrop-blur",
            paymentState === "delayed"
              ? "border border-amber-400/25 bg-[#1c1710]/95 text-amber-100"
              : "border border-emerald-400/25 bg-[#0d1620]/95 text-emerald-100",
          ].join(" ")}
        >
          {paymentMessage}
          {paymentState !== "activating" && (
            <button type="button" onClick={() => setPaymentState("idle")} className="ms-3 font-bold opacity-80">×</button>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
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
