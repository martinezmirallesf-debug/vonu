"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const fallback: Record<SupportedLocale, string> = {
  es: "Inicia sesión para continuar",
  en: "Sign in to continue",
  fr: "Connectez-vous pour continuer",
  de: "Zum Fortfahren anmelden",
  ar: "سجّل الدخول للمتابعة",
};

const unavailable: Record<SupportedLocale, string> = {
  es: "El pago no está disponible ahora mismo. Inténtalo de nuevo en unos instantes.",
  en: "Payment is unavailable right now. Please try again in a moment.",
  fr: "Le paiement est momentanément indisponible. Réessayez dans un instant.",
  de: "Die Zahlung ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal.",
  ar: "الدفع غير متاح حالياً. حاول مرة أخرى بعد قليل.",
};

export default function PlanCheckoutButton({
  plan,
  locale,
  label,
  billing = "monthly",
  className,
}: {
  plan: "plus" | "max";
  locale: SupportedLocale;
  label: string;
  billing?: "monthly" | "yearly";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    track("pricing_plan_selected", { plan, billing, locale });

    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data.session?.access_token ?? null;

      if (!token) {
        track("checkout_login_required", { plan, billing, locale });
        setMessage(fallback[locale]);
        window.location.href = `/chat?upgrade=${plan}&billing=${billing}&locale=${locale}`;
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan, billing, locale }),
      });

      if (response.status === 401) {
        track("checkout_login_required", { plan, billing, locale });
        setMessage(fallback[locale]);
        window.location.href = `/chat?upgrade=${plan}&billing=${billing}&locale=${locale}`;
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
