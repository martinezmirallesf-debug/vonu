"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import DevicePackCheckoutButton from "./DevicePackCheckoutButton";
import type { SupportedLocale } from "@/lib/vonu-check/types";

const copy: Record<SupportedLocale, { eyebrow: string; title: string; text: string; cta: string; newCheck: string[] }> = {
  es: {
    eyebrow: "Análisis adicionales",
    title: "Consigue 3 análisis más por 3,99 €",
    text: "Pago único. Sin registro, sin suscripción y sin renovación automática. Los 3 análisis quedan asociados a este navegador o dispositivo.",
    cta: "Comprar 3 análisis · 3,99 €",
    newCheck: ["Nueva comprobación"],
  },
  en: {
    eyebrow: "Additional analyses",
    title: "Get 3 more analyses for €3.99",
    text: "One-time payment. No account, no subscription and no automatic renewal. The 3 analyses stay linked to this browser or device.",
    cta: "Buy 3 analyses · €3.99",
    newCheck: ["New check"],
  },
  fr: {
    eyebrow: "Analyses supplémentaires",
    title: "Obtenez 3 analyses de plus pour 3,99 €",
    text: "Paiement unique. Sans compte, sans abonnement et sans renouvellement automatique. Les 3 analyses restent liées à ce navigateur ou appareil.",
    cta: "Acheter 3 analyses · 3,99 €",
    newCheck: ["Nouvelle vérification"],
  },
  de: {
    eyebrow: "Zusätzliche Analysen",
    title: "3 weitere Analysen für 3,99 €",
    text: "Einmalige Zahlung. Kein Konto, kein Abo und keine automatische Verlängerung. Die 3 Analysen bleiben mit diesem Browser oder Gerät verknüpft.",
    cta: "3 Analysen kaufen · 3,99 €",
    newCheck: ["Neue Prüfung", "Neue Überprüfung"],
  },
  ar: {
    eyebrow: "تحليلات إضافية",
    title: "احصل على 3 تحليلات إضافية مقابل 3.99 €",
    text: "دفعة واحدة فقط. بدون حساب أو اشتراك أو تجديد تلقائي. ترتبط التحليلات الثلاثة بهذا المتصفح أو الجهاز.",
    cta: "شراء 3 تحليلات · 3.99 €",
    newCheck: ["فحص جديد", "تحقق جديد"],
  },
};

function localeFromPath(): SupportedLocale {
  if (typeof window === "undefined") return "es";
  const candidate = window.location.pathname.split("/").filter(Boolean)[0];
  return candidate === "en" || candidate === "fr" || candidate === "de" || candidate === "ar" || candidate === "es"
    ? candidate
    : "es";
}

export default function CheckResultConversion() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const locale = useMemo(localeFromPath, []);
  const t = copy[locale];

  useEffect(() => {
    if (typeof window === "undefined" || !/^\/(es|en|fr|de|ar)\/check$/.test(window.location.pathname)) return;

    let tracked = false;

    const locate = () => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const reset = buttons.find((button) => t.newCheck.includes((button.textContent || "").trim()));
      const main = reset?.closest("main") as HTMLElement | null;

      if (reset && window.matchMedia("(max-width: 639px)").matches) {
        reset.style.alignSelf = "center";
      }

      if (main) {
        setTarget(main);
        if (!tracked) {
          tracked = true;
          track("result_viewed", { locale, path: window.location.pathname });
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "result_viewed", { locale, path: window.location.pathname });
          }
        }
      } else {
        setTarget(null);
      }
    };

    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale, t.newCheck]);

  if (!target) return null;

  return createPortal(
    <section className="mt-6 overflow-hidden rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.045] p-5 shadow-[0_22px_60px_rgba(0,0,0,.18)] sm:p-6" data-vonu-conversion-nudge="result">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[680px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.eyebrow}</p>
          <h2 className="mt-2 text-[21px] font-bold tracking-[-0.035em] text-white sm:text-[24px]">{t.title}</h2>
          <p className="mt-2 text-[13px] leading-6 text-slate-400">{t.text}</p>
        </div>
        <DevicePackCheckoutButton
          locale={locale}
          label={t.cta}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:opacity-70 sm:w-auto"
        />
      </div>
    </section>,
    target,
  );
}
