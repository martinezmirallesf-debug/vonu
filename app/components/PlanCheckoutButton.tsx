"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const fallback: Record<SupportedLocale, string> = {
  es: "Inicia sesión para continuar",
  en: "Sign in to continue",
  fr: "Connectez-vous pour continuer",
  de: "Zum Fortfahren anmelden",
  ar: "سجّل الدخول للمتابعة",
};

export default function PlanCheckoutButton({
  plan,
  locale,
  label,
  className,
}: {
  plan: "plus" | "max";
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
    track("pricing_plan_selected", { plan, billing: "monthly", locale });

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, billing: "monthly", locale }),
      });

      if (response.status === 401) {
        track("checkout_login_required", { plan, locale });
        setMessage(fallback[locale]);
        window.location.href = `/chat?upgrade=${plan}&locale=${locale}`;
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout unavailable");
      }

      window.location.href = data.url;
    } catch {
      setMessage(fallback[locale]);
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
