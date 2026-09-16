"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const fallback: Record<SupportedLocale, string> = {
  es: "Inicia sesión para comprar 3 análisis más",
  en: "Sign in to buy 3 more analyses",
  fr: "Connectez-vous pour acheter 3 analyses supplémentaires",
  de: "Melde dich an, um 3 weitere Analysen zu kaufen",
  ar: "سجّل الدخول لشراء 3 تحليلات إضافية",
};

const unavailable: Record<SupportedLocale, string> = {
  es: "El pago no está disponible ahora mismo. Inténtalo de nuevo en unos instantes.",
  en: "Payment is unavailable right now. Please try again in a moment.",
  fr: "Le paiement est momentanément indisponible. Réessayez dans un instant.",
  de: "Die Zahlung ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal.",
  ar: "الدفع غير متاح حالياً. حاول مرة أخرى بعد قليل.",
};

export default function PlanCheckoutButton({
  locale,
  label,
  className,
}: {
  locale: SupportedLocale;
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    track("analysis_pack_selected", { analyses: 3, amount_eur: 3.99, locale });

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token ?? null;

      if (!token) {
        track("analysis_pack_login_required", { locale });
        setMessage(fallback[locale]);
        window.location.href = `/${locale}/check?purchase=3-analyses&login=required`;
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ locale }),
      });

      if (response.status === 401) {
        track("analysis_pack_login_required", { locale });
        setMessage(fallback[locale]);
        window.location.href = `/${locale}/check?purchase=3-analyses&login=required`;
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout unavailable");
      }

      window.location.href = data.url;
    } catch {
      setMessage(unavailable[locale]);
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={start} disabled={loading} className={className}>
        {loading ? "…" : label}
      </button>
      {message && <p className="mt-2 text-center text-[11px] text-slate-500">{message}</p>}
    </div>
  );
}
