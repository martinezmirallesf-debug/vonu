"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { legalPath } from "@/lib/vonu-legal/routes";

const LEGAL_VERSION = "2026-09-18";

const copy: Record<SupportedLocale, {
  loading: string;
  unavailable: string;
  title: string;
  summary: string;
  terms: string;
  immediate: string;
  privacyNote: string;
  continue: string;
  cancel: string;
}> = {
  es: {
    loading: "Abriendo pago…",
    unavailable: "El pago no está disponible ahora mismo. Inténtalo de nuevo en unos instantes.",
    title: "Antes de continuar al pago",
    summary: "3 análisis adicionales · 3,99 € · pago único · sin suscripción ni renovación automática.",
    terms: "He leído y acepto los Términos y condiciones y he podido consultar la Política de privacidad.",
    immediate: "Solicito que los análisis queden disponibles inmediatamente durante el plazo de desistimiento y reconozco que mi derecho puede verse afectado conforme se ejecute el servicio, únicamente según permita la ley aplicable.",
    privacyNote: "El pago se confirma en Stripe. Vonu guarda en la operación la versión legal y la fecha de estas confirmaciones para poder acreditar la contratación.",
    continue: "Continuar a Stripe · 3,99 €",
    cancel: "Cancelar",
  },
  en: {
    loading: "Opening payment…",
    unavailable: "Payment is unavailable right now. Please try again in a moment.",
    title: "Before continuing to payment",
    summary: "3 additional analyses · €3.99 · one-time payment · no subscription or automatic renewal.",
    terms: "I have read and accept the Terms and Conditions and have been able to review the Privacy Policy.",
    immediate: "I request that the analyses become available immediately during the withdrawal period and acknowledge that my withdrawal right may be affected as the service is performed, only to the extent permitted by applicable law.",
    privacyNote: "Payment is confirmed in Stripe. Vonu records the legal version and time of these confirmations with the transaction as evidence of the purchase process.",
    continue: "Continue to Stripe · €3.99",
    cancel: "Cancel",
  },
  fr: {
    loading: "Ouverture du paiement…",
    unavailable: "Le paiement est momentanément indisponible. Réessayez dans un instant.",
    title: "Avant de continuer vers le paiement",
    summary: "3 analyses supplémentaires · 3,99 € · paiement unique · sans abonnement ni renouvellement automatique.",
    terms: "J’ai lu et j’accepte les Conditions générales et j’ai pu consulter la Politique de confidentialité.",
    immediate: "Je demande que les analyses soient disponibles immédiatement pendant le délai de rétractation et reconnais que mon droit peut être affecté au fur et à mesure de l’exécution, uniquement dans la mesure permise par la loi applicable.",
    privacyNote: "Le paiement est confirmé dans Stripe. Vonu associe à l’opération la version juridique et l’heure de ces confirmations afin de documenter la commande.",
    continue: "Continuer vers Stripe · 3,99 €",
    cancel: "Annuler",
  },
  de: {
    loading: "Zahlung wird geöffnet…",
    unavailable: "Die Zahlung ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal.",
    title: "Vor der Weiterleitung zur Zahlung",
    summary: "3 zusätzliche Analysen · 3,99 € · Einmalzahlung · kein Abo und keine automatische Verlängerung.",
    terms: "Ich habe die Nutzungs- und Kaufbedingungen gelesen und akzeptiere sie und konnte die Datenschutzerklärung einsehen.",
    immediate: "Ich wünsche die sofortige Bereitstellung der Analysen während der Widerrufsfrist und nehme zur Kenntnis, dass mein Widerrufsrecht durch die Leistungserbringung nur im gesetzlich zulässigen Umfang beeinflusst werden kann.",
    privacyNote: "Die Zahlung wird in Stripe bestätigt. Vonu speichert bei der Transaktion Rechtsversion und Zeitpunkt dieser Bestätigungen, um den Bestellvorgang nachweisen zu können.",
    continue: "Weiter zu Stripe · 3,99 €",
    cancel: "Abbrechen",
  },
  ar: {
    loading: "جارٍ فتح الدفع…",
    unavailable: "الدفع غير متاح حالياً. حاول مرة أخرى بعد قليل.",
    title: "قبل الانتقال إلى الدفع",
    summary: "3 تحليلات إضافية · 3.99 € · دفعة واحدة · بدون اشتراك أو تجديد تلقائي.",
    terms: "قرأت الشروط والأحكام وأوافق عليها وتمكنت من مراجعة سياسة الخصوصية.",
    immediate: "أطلب إتاحة التحليلات فوراً خلال مدة الانسحاب وأقر بأن حق الانسحاب قد يتأثر مع تنفيذ الخدمة، فقط في الحدود التي يسمح بها القانون المنطبق.",
    privacyNote: "يتم تأكيد الدفع في Stripe. يسجل Vonu مع المعاملة النسخة القانونية ووقت هذه التأكيدات لتوثيق عملية الشراء.",
    continue: "المتابعة إلى Stripe · 3.99 €",
    cancel: "إلغاء",
  },
};

export default function DevicePackCheckoutButton({
  locale,
  label,
  className,
}: {
  locale: SupportedLocale;
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [immediatePerformance, setImmediatePerformance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const t = copy[locale];

  async function start() {
    if (loading || !termsAccepted || !immediatePerformance) return;
    setLoading(true);
    setMessage(null);
    track("device_pack_checkout_started", {
      locale,
      analyses: 3,
      amount_eur: 3.99,
      legal_version: LEGAL_VERSION,
    });

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          legalConsent: {
            termsAccepted: true,
            immediatePerformance: true,
            withdrawalAcknowledged: true,
            version: LEGAL_VERSION,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.url) throw new Error(data?.error || "checkout_unavailable");
      window.location.href = data.url;
    } catch {
      setMessage(t.unavailable);
      setLoading(false);
    }
  }

  function openConfirmation() {
    if (loading) return;
    setMessage(null);
    setConfirming(true);
  }

  function closeConfirmation() {
    if (loading) return;
    setConfirming(false);
  }

  return (
    <div>
      <button type="button" onClick={openConfirmation} disabled={loading} className={className}>
        {loading ? t.loading : label}
      </button>

      {confirming && (
        <div className="fixed inset-0 z-[11000] grid place-items-center bg-[#020711]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="vonu-checkout-legal-title">
          <div dir={locale === "ar" ? "rtl" : "ltr"} className="w-full max-w-[560px] rounded-[26px] border border-white/[0.10] bg-[#101522] p-5 text-start text-slate-200 shadow-[0_32px_100px_rgba(0,0,0,.55)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">Vonu · Checkout</p>
            <h2 id="vonu-checkout-legal-title" className="mt-2 text-[24px] font-bold tracking-[-0.04em] text-white">{t.title}</h2>
            <p className="mt-3 text-[14px] leading-6 text-slate-400">{t.summary}</p>

            <div className="mt-5 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-emerald-400" />
                <span className="text-[13px] leading-6 text-slate-300">
                  {t.terms}{" "}
                  <Link href={legalPath(locale, "terms")} target="_blank" className="font-semibold text-emerald-300 hover:text-emerald-200">
                    {locale === "es" ? "Términos" : locale === "fr" ? "Conditions" : locale === "de" ? "Bedingungen" : locale === "ar" ? "الشروط" : "Terms"}
                  </Link>
                  {" · "}
                  <Link href={legalPath(locale, "privacy")} target="_blank" className="font-semibold text-emerald-300 hover:text-emerald-200">
                    {locale === "es" ? "Privacidad" : locale === "fr" ? "Confidentialité" : locale === "de" ? "Datenschutz" : locale === "ar" ? "الخصوصية" : "Privacy"}
                  </Link>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <input type="checkbox" checked={immediatePerformance} onChange={(event) => setImmediatePerformance(event.target.checked)} className="mt-1 h-4 w-4 accent-emerald-400" />
                <span className="text-[13px] leading-6 text-slate-300">{t.immediate}</span>
              </label>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-slate-500">{t.privacyNote}</p>
            {message && <p className="mt-3 rounded-xl bg-rose-400/[0.08] px-3 py-2 text-[12px] text-rose-200">{message}</p>}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeConfirmation} disabled={loading} className="min-h-11 rounded-xl border border-white/[0.10] px-4 text-[13px] font-semibold text-slate-300 hover:bg-white/[0.04] disabled:opacity-60">
                {t.cancel}
              </button>
              <button type="button" onClick={start} disabled={loading || !termsAccepted || !immediatePerformance} className="min-h-11 rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40">
                {loading ? t.loading : t.continue}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && !confirming && <p className="mt-2 text-center text-[11px] text-rose-300">{message}</p>}
    </div>
  );
}
