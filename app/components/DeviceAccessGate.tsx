"use client";

import { useEffect, useState } from "react";
import DevicePackCheckoutButton from "./DevicePackCheckoutButton";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const copy: Record<SupportedLocale, { eyebrow: string; title: string; text: string; cta: string; note: string; close: string; success: string }> = {
  es: { eyebrow: "Primer análisis agotado", title: "Sigue con 3 análisis más por 3,99 €", text: "Pago único. Sin registro, sin suscripción y sin renovación automática.", cta: "Comprar 3 análisis · 3,99 €", note: "Los 3 análisis quedan asociados a este navegador/dispositivo.", close: "Cerrar", success: "Pago confirmado. Ya tienes 3 análisis adicionales en este dispositivo." },
  en: { eyebrow: "Free analysis used", title: "Continue with 3 more analyses for €3.99", text: "One-time payment. No account, no subscription and no automatic renewal.", cta: "Buy 3 analyses · €3.99", note: "The 3 analyses stay linked to this browser/device.", close: "Close", success: "Payment confirmed. You now have 3 additional analyses on this device." },
  fr: { eyebrow: "Analyse gratuite utilisée", title: "Continuez avec 3 analyses de plus pour 3,99 €", text: "Paiement unique. Sans compte, sans abonnement et sans renouvellement automatique.", cta: "Acheter 3 analyses · 3,99 €", note: "Les 3 analyses restent liées à ce navigateur/appareil.", close: "Fermer", success: "Paiement confirmé. Vous disposez maintenant de 3 analyses supplémentaires sur cet appareil." },
  de: { eyebrow: "Kostenlose Analyse genutzt", title: "Weiter mit 3 weiteren Analysen für 3,99 €", text: "Einmalige Zahlung. Kein Konto, kein Abo und keine automatische Verlängerung.", cta: "3 Analysen kaufen · 3,99 €", note: "Die 3 Analysen bleiben mit diesem Browser/Gerät verknüpft.", close: "Schließen", success: "Zahlung bestätigt. Auf diesem Gerät stehen jetzt 3 zusätzliche Analysen bereit." },
  ar: { eyebrow: "تم استخدام التحليل المجاني", title: "تابع مع 3 تحليلات إضافية مقابل 3.99 €", text: "دفعة واحدة فقط. بدون حساب أو اشتراك أو تجديد تلقائي.", cta: "شراء 3 تحليلات · 3.99 €", note: "ترتبط التحليلات الثلاثة بهذا المتصفح/الجهاز.", close: "إغلاق", success: "تم تأكيد الدفع. لديك الآن 3 تحليلات إضافية على هذا الجهاز." },
};

export default function DeviceAccessGate({ locale }: { locale: SupportedLocale }) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success" && params.get("pack") === "3") {
      setSuccess(true);
      const clean = new URL(window.location.href);
      clean.searchParams.delete("checkout");
      clean.searchParams.delete("pack");
      window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
    }

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      const url = typeof input === "string" ? input : input instanceof URL ? input.pathname : input.url;
      if (response.status === 402 && /\/api\/check\/(web|image|text)(?:\?|$)/.test(url)) {
        setOpen(true);
      }
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      {success && (
        <div className="fixed inset-x-3 top-3 z-[90] mx-auto max-w-xl rounded-2xl border border-emerald-400/25 bg-[#0d1620]/95 px-4 py-3 text-center text-sm text-emerald-100 shadow-2xl backdrop-blur">
          {t.success}
          <button type="button" onClick={() => setSuccess(false)} className="ms-3 font-bold text-emerald-300">×</button>
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
