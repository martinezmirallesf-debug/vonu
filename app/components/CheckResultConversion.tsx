"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { publicPath } from "@/lib/vonu-global/i18n";

const copy: Record<SupportedLocale, { eyebrow: string; title: string; text: string; cta: string; free: string; newCheck: string[] }> = {
  es: {
    eyebrow: "Sigue protegido",
    title: "Haz de comprobar antes de actuar un hábito.",
    text: "Tu primer análisis es para probar Vonu. Plus y Max te dan más margen para revisar enlaces, capturas, mensajes y documentos cuando lo necesites.",
    cta: "Ver Plus y Max",
    free: "Seguir con Vonu",
    newCheck: ["Nueva comprobación"],
  },
  en: {
    eyebrow: "Stay protected",
    title: "Make checking before you act a habit.",
    text: "Your first analysis lets you try Vonu. Plus and Max give you more room to review links, screenshots, messages and documents whenever you need it.",
    cta: "See Plus and Max",
    free: "Keep using Vonu",
    newCheck: ["New check"],
  },
  fr: {
    eyebrow: "Restez protégé",
    title: "Prenez l’habitude de vérifier avant d’agir.",
    text: "Votre première analyse permet de découvrir Vonu. Plus et Max offrent davantage de marge pour vérifier liens, captures, messages et documents.",
    cta: "Voir Plus et Max",
    free: "Continuer avec Vonu",
    newCheck: ["Nouvelle vérification"],
  },
  de: {
    eyebrow: "Bleib geschützt",
    title: "Mach das Prüfen vor dem Handeln zur Gewohnheit.",
    text: "Mit der ersten Analyse testest du Vonu. Plus und Max geben dir mehr Spielraum für Links, Screenshots, Nachrichten und Dokumente.",
    cta: "Plus und Max ansehen",
    free: "Vonu weiter nutzen",
    newCheck: ["Neue Prüfung", "Neue Überprüfung"],
  },
  ar: {
    eyebrow: "ابقَ أكثر أمانًا",
    title: "اجعل التحقق قبل التصرف عادة.",
    text: "يسمح لك التحليل الأول بتجربة Vonu. تمنحك Plus وMax سعة أكبر لمراجعة الروابط ولقطات الشاشة والرسائل والمستندات عند الحاجة.",
    cta: "عرض Plus وMax",
    free: "متابعة استخدام Vonu",
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

  const pricingHref = publicPath(locale, "precios");

  return createPortal(
    <section className="mt-6 overflow-hidden rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.045] p-5 shadow-[0_22px_60px_rgba(0,0,0,.18)] sm:p-6" data-vonu-conversion-nudge="result">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-[680px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">{t.eyebrow}</p>
          <h2 className="mt-2 text-[21px] font-bold tracking-[-0.035em] text-white sm:text-[24px]">{t.title}</h2>
          <p className="mt-2 text-[13px] leading-6 text-slate-400">{t.text}</p>
        </div>
        <a
          href={pricingHref}
          onClick={() => track("result_upgrade_clicked", { locale, destination: pricingHref })}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] transition hover:bg-emerald-300"
        >
          {t.cta}
        </a>
      </div>
    </section>,
    target,
  );
}
