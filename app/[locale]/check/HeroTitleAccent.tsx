"use client";

import { useEffect } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function HeroTitleAccent({ locale }: { locale: SupportedLocale }) {
  useEffect(() => {
    if (locale !== "es") return;

    const hero = document.querySelector<HTMLHeadingElement>("main > section.text-center > h1");
    if (!hero) return;

    const applyAccent = () => {
      if (hero.querySelector("[data-vonu-hero-accent]")) return;

      const prefix = document.createTextNode("Detecta estafas, phishing y perfiles falsos ");
      const accent = document.createElement("span");
      accent.textContent = "en segundos";
      accent.dataset.vonuHeroAccent = "true";
      accent.style.color = "rgb(52 211 153)";

      hero.replaceChildren(prefix, accent);
    };

    applyAccent();

    const observer = new MutationObserver(() => applyAccent());
    observer.observe(hero, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
