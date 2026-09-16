"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const copy: Record<SupportedLocale, { loading: string; unavailable: string }> = {
  es: { loading: "Abriendo pago…", unavailable: "El pago no está disponible ahora mismo. Inténtalo de nuevo en unos instantes." },
  en: { loading: "Opening payment…", unavailable: "Payment is unavailable right now. Please try again in a moment." },
  fr: { loading: "Ouverture du paiement…", unavailable: "Le paiement est momentanément indisponible. Réessayez dans un instant." },
  de: { loading: "Zahlung wird geöffnet…", unavailable: "Die Zahlung ist momentan nicht verfügbar. Bitte versuche es gleich noch einmal." },
  ar: { loading: "جارٍ فتح الدفع…", unavailable: "الدفع غير متاح حالياً. حاول مرة أخرى بعد قليل." },
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
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    track("device_pack_checkout_started", { locale, analyses: 3, amount_eur: 3.99 });

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.url) throw new Error(data?.error || "checkout_unavailable");
      window.location.href = data.url;
    } catch {
      setMessage(copy[locale].unavailable);
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={start} disabled={loading} className={className}>
        {loading ? copy[locale].loading : label}
      </button>
      {message && <p className="mt-2 text-center text-[11px] text-rose-300">{message}</p>}
    </div>
  );
}
