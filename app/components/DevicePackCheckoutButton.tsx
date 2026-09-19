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
    terms: "Acepto las condiciones de compra y confirmo que he podido consultar la información de privacidad.",
    immediate: "Solicito acceso inmediato a los análisis y reconozco que, conforme se preste el servicio, mi derecho de desistimiento puede verse afectado en los límites previstos por la ley.",
    privacyNote: "Pago seguro procesado por Stripe. Vonu registra estas confirmaciones con la compra.",
    continue: "Continuar a Stripe · 3,99 €",
    cancel: "Cancelar",
  },
  en: {
    loading: "Opening payment…",
    unavailable: "Payment is unavailable right now. Please try again in a moment.",
    title: "Before continuing to payment",
    summary: "3 additional analyses · €3.99 · one-time payment · no subscription or automatic renewal.",
    terms: "I accept the purchase terms and confirm that I have been able to review the privacy information.",
    immediate: "I request immediate access to the analyses and acknowledge that, as the service is performed, my withdrawal right may be affected to the extent permitted by law.",
    privacyNote: "Secure payment processed by Stripe. Vonu records these confirmations with the purchase.",
    continue: "Continue to Stripe · €3.99",
    cancel: "Cancel",
  },
  fr: {
    loading: "Ouverture du paiement…",
    unavailable: "Le paiement est momentanément indisponible. Réessayez dans un instant.",
    title: "Avant de continuer vers le paiement",
    summary: "3 analyses supplémentaires · 3,99 € · paiement unique · sans abonnement ni renouvellement automatique.",
    terms: "J’accepte les conditions d’achat et confirme avoir pu consulter les informations de confidentialité.",
    immediate: "Je demande l’accès immédiat aux analyses et reconnais que mon droit de rétractation peut être affecté au fur et à mesure de l’exécution, dans les limites prévues par la loi.",
    privacyNote: "Paiement sécurisé traité par Stripe. Vonu enregistre ces confirmations avec l’achat.",
    continue: "Continuer vers Stripe · 3,99 €",
    cancel: "Annuler",
  },
  de: {
    loading: "Zahlung wird geöffnet…",
    unavailable: "Die Zahlung ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal.",
    title: "Vor der Weiterleitung zur Zahlung",
    summary: "3 zusätzliche Analysen · 3,99 € · Einmalzahlung · kein Abo und keine automatische Verlängerung.",
    terms: "Ich akzeptiere die Kaufbedingungen und bestätige, dass ich die Datenschutzinformationen einsehen konnte.",
    immediate: "Ich wünsche sofortigen Zugriff auf die Analysen und nehme zur Kenntnis, dass mein Widerrufsrecht mit der Leistungserbringung im gesetzlich zulässigen Umfang beeinflusst werden kann.",
    privacyNote: "Sichere Zahlung über Stripe. Vonu speichert diese Bestätigungen zusammen mit dem Kauf.",
    continue: "Weiter zu Stripe · 3,99 €",
    cancel: "Abbrechen",
  },
  ar: {
    loading: "جارٍ فتح الدفع…",
    unavailable: "الدفع غير متاح حالياً. حاول مرة أخرى بعد قليل.",
    title: "قبل الانتقال إلى الدفع",
    summary: "3 تحليلات إضافية · 3.99 € · دفعة واحدة · بدون اشتراك أو تجديد تلقائي.",
    terms: "أوافق على شروط الشراء وأؤكد أنني تمكنت من مراجعة معلومات الخصوصية.",
    immediate: "أطلب الوصول الفوري إلى التحليلات وأقر بأن حق الانسحاب قد يتأثر مع تنفيذ الخدمة، في الحدود التي يسمح بها القانون.",
    privacyNote: "دفع آمن تتم معالجته عبر Stripe. يسجل Vonu هذه التأكيدات مع عملية الشراء.",
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
        <div className="fixed inset-0 z-[11000] flex overflow-y-auto bg-[#020711]/80 p-3 backdrop-blur-sm sm:grid sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="vonu-checkout-legal-title">
          <div dir={locale === "ar" ? "rtl" : "ltr"} className="my-auto w-full max-w-[560px] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[24px] border border-white/[0.10] bg-[#101522] p-4 text-start text-slate-200 shadow-[0_32px_100px_rgba(0,0,0,.55)] sm:max-h-[calc(100dvh-32px)] sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8ec2ff] sm:text-[11px]">Vonu · Checkout</p>
            <h2 id="vonu-checkout-legal-title" className="mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.04em] text-white sm:mt-2 sm:text-[24px]">{t.title}</h2>
            <p className="mt-2 text-[12.5px] leading-5 text-slate-400 sm:mt-3 sm:text-[14px] sm:leading-6">{t.summary}</p>

            <div className="mt-3.5 space-y-2.5 sm:mt-5 sm:space-y-3">
              <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 sm:gap-3 sm:p-4">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#7bb7ff] sm:mt-1" />
                <span className="text-[12px] leading-5 text-slate-300 sm:text-[13px] sm:leading-6">
                  {t.terms}{" "}
                  <Link href={legalPath(locale, "terms")} target="_blank" className="font-semibold text-[#8ec2ff] hover:text-[#b8d9ff]">
                    {locale === "es" ? "Términos" : locale === "fr" ? "Conditions" : locale === "de" ? "Bedingungen" : locale === "ar" ? "الشروط" : "Terms"}
                  </Link>
                  {" · "}
                  <Link href={legalPath(locale, "privacy")} target="_blank" className="font-semibold text-[#8ec2ff] hover:text-[#b8d9ff]">
                    {locale === "es" ? "Privacidad" : locale === "fr" ? "Confidentialité" : locale === "de" ? "Datenschutz" : locale === "ar" ? "الخصوصية" : "Privacy"}
                  </Link>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 sm:gap-3 sm:p-4">
                <input type="checkbox" checked={immediatePerformance} onChange={(event) => setImmediatePerformance(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#7bb7ff] sm:mt-1" />
                <span className="text-[12px] leading-5 text-slate-300 sm:text-[13px] sm:leading-6">{t.immediate}</span>
              </label>
            </div>

            <p className="mt-3 text-[10px] leading-4 text-slate-500 sm:mt-4 sm:text-[11px] sm:leading-5">{t.privacyNote}</p>
            {message && <p className="mt-3 rounded-xl bg-rose-400/[0.08] px-3 py-2 text-[12px] text-rose-200">{message}</p>}

            <div className="mt-3.5 grid grid-cols-[0.72fr_1.28fr] gap-2 sm:mt-5 sm:flex sm:justify-end">
              <button type="button" onClick={closeConfirmation} disabled={loading} className="min-h-11 rounded-xl border border-white/[0.10] px-3 text-[12px] font-semibold text-slate-300 hover:bg-white/[0.04] disabled:opacity-60 sm:px-4 sm:text-[13px]">
                {t.cancel}
              </button>
              <button type="button" onClick={start} disabled={loading || !termsAccepted || !immediatePerformance} className="min-h-11 rounded-xl bg-[#7bb7ff] px-3 text-[12px] font-bold text-[#07142f] transition hover:bg-[#a3ceff] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-[13px]">
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
