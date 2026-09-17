"use client";

import { useEffect } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type Snapshot = {
  freeUsed: boolean;
  creditsRemaining: number;
  lifetimeAnalyses: number;
};

type Copy = {
  freeAvailable: string;
  freeUsed: string;
  creditsAvailable: (count: number) => string;
};

const balanceCopy: Record<SupportedLocale, Copy> = {
  es: {
    freeAvailable: "1 análisis gratuito disponible",
    freeUsed: "Análisis gratuito utilizado",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "análisis disponible" : "análisis disponibles"}`,
  },
  en: {
    freeAvailable: "1 free analysis available",
    freeUsed: "Free analysis used",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analysis available" : "analyses available"}`,
  },
  fr: {
    freeAvailable: "1 analyse gratuite disponible",
    freeUsed: "Analyse gratuite utilisée",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analyse disponible" : "analyses disponibles"}`,
  },
  de: {
    freeAvailable: "1 kostenlose Analyse verfügbar",
    freeUsed: "Kostenlose Analyse genutzt",
    creditsAvailable: (count) => `${count}/3 Analysen verfügbar`,
  },
  ar: {
    freeAvailable: "تحليل مجاني واحد متاح",
    freeUsed: "تم استخدام التحليل المجاني",
    creditsAvailable: (count) => `${count}/3 تحليلات متاحة`,
  },
};

const analyzeLabels = new Set([
  "Analizar ahora",
  "Analizar gratis",
  "Analyse now",
  "Analyse for free",
  "Analyser",
  "Analyser gratuitement",
  "Jetzt analysieren",
  "Kostenlos analysieren",
  "حلّل الآن",
  "حلّل مجانًا",
]);

const subjectModeByLabel = new Map<string, "url" | "capture" | "text">([
  ["Enlace analizado", "url"],
  ["Analysed link", "url"],
  ["Lien analysé", "url"],
  ["Analysierter Link", "url"],
  ["الرابط الذي تم تحليله", "url"],
  ["Captura analizada", "capture"],
  ["Analysed screenshot", "capture"],
  ["Capture analysée", "capture"],
  ["Analysierter Screenshot", "capture"],
  ["لقطة الشاشة التي تم تحليلها", "capture"],
  ["Mensaje analizado", "text"],
  ["Analysed message", "text"],
  ["Message analysé", "text"],
  ["Analysierte Nachricht", "text"],
  ["الرسالة التي تم تحليلها", "text"],
]);

const runtimeCss = `
.vonu-check-page main > section[data-vonu-runtime-subject-mode]::before {
  content: none !important;
  display: none !important;
}

.vonu-check-page main > section[data-vonu-runtime-subject-mode] > :first-child {
  display: grid !important;
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px !important;
  place-items: center !important;
  align-self: center !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1px solid rgba(123,183,255,.28) !important;
  background-color: rgba(123,183,255,.065) !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: 22px 22px !important;
  box-shadow: inset 0 0 0 1px rgba(123,183,255,.025) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}

.vonu-check-page main > section[data-vonu-runtime-subject-mode="url"] > :first-child {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
}

.vonu-check-page main > section[data-vonu-runtime-subject-mode="text"] > :first-child {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M7.5 8.5h9M7.5 12.5h6' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round'/%3E%3C/svg%3E") !important;
}

.vonu-check-page main > section[data-vonu-runtime-subject-mode="capture"] > img:first-child {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Crect x='3' y='3' width='18' height='18' rx='2.5' stroke='%237bb7ff' stroke-width='1.9'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%237bb7ff' stroke-width='1.8'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
  object-fit: contain !important;
  padding: 13px !important;
}

.vonu-check-page [data-vonu-radar-runtime="true"] > div:last-child {
  display: none !important;
}

.vonu-check-page [data-vonu-radar-runtime="true"]::before,
.vonu-check-page [data-vonu-radar-runtime="true"]::after {
  content: "" !important;
  position: absolute !important;
  z-index: 5 !important;
  width: 7px !important;
  height: 7px !important;
  border-radius: 999px !important;
  pointer-events: none !important;
  animation: vonuRuntimeRadarBlip 1.55s ease-in-out infinite !important;
}

.vonu-check-page [data-vonu-radar-runtime="true"]::before {
  left: 31% !important;
  top: 27% !important;
  background: #7bb7ff !important;
  box-shadow: 55px 24px 0 -1px rgba(123,183,255,.82), -13px 58px 0 -1px rgba(52,211,153,.78) !important;
}

.vonu-check-page [data-vonu-radar-runtime="true"]::after {
  left: 69% !important;
  top: 63% !important;
  background: #34d399 !important;
  animation-delay: .46s !important;
  box-shadow: -64px -18px 0 -1px rgba(52,211,153,.78), -26px 35px 0 -1px rgba(123,183,255,.72) !important;
}

.vonu-check-page [data-vonu-progress-runtime="true"] {
  position: relative !important;
}

.vonu-check-page [data-vonu-progress-runtime="true"] > div {
  position: absolute !important;
  inset-block: 0 !important;
  inset-inline-start: 0 !important;
  width: 38% !important;
  animation: vonuRuntimeProgress 1.18s ease-in-out infinite !important;
  will-change: transform, opacity !important;
}

html[dir="rtl"] .vonu-check-page [data-vonu-progress-runtime="true"] > div {
  animation-name: vonuRuntimeProgressRtl !important;
}

@keyframes vonuRuntimeRadarBlip {
  0%,100% { opacity:.18; transform:scale(.68); filter:drop-shadow(0 0 0 rgba(123,183,255,0)); }
  42% { opacity:1; transform:scale(1); filter:drop-shadow(0 0 7px rgba(123,183,255,.72)); }
  70% { opacity:.48; transform:scale(.84); }
}

@keyframes vonuRuntimeProgress {
  0% { transform:translateX(-135%); opacity:.35; }
  48% { opacity:1; }
  100% { transform:translateX(305%); opacity:.5; }
}

@keyframes vonuRuntimeProgressRtl {
  0% { transform:translateX(135%); opacity:.35; }
  48% { opacity:1; }
  100% { transform:translateX(-305%); opacity:.5; }
}
`;

function snapshotFromData(data: any): Snapshot {
  return {
    freeUsed: Boolean(data?.free_used),
    creditsRemaining: Math.max(0, Number(data?.credits_remaining || 0)),
    lifetimeAnalyses: Math.max(0, Number(data?.lifetime_analyses || 0)),
  };
}

export default function CheckRuntimeFixes({ locale }: { locale: SupportedLocale }) {
  const t = balanceCopy[locale];

  useEffect(() => {
    let cancelled = false;
    let snapshot: Snapshot | null = null;
    let refreshTimer: number | null = null;
    let lastRequestAt = 0;

    function statusText(value: Snapshot) {
      if (!value.freeUsed && value.creditsRemaining <= 0) return t.freeAvailable;
      if (value.creditsRemaining > 0) return t.creditsAvailable(value.creditsRemaining);
      if (value.lifetimeAnalyses >= 4) return t.creditsAvailable(0);
      return t.freeUsed;
    }

    function findBalanceSpan() {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
      const analyzeButton = buttons.find((button) => analyzeLabels.has((button.textContent || "").trim()));
      const row = analyzeButton?.parentElement;
      const info = row?.firstElementChild;
      return info instanceof HTMLElement ? info.querySelector<HTMLElement>("span") : null;
    }

    function applyBalance() {
      if (!snapshot || cancelled) return;
      const target = findBalanceSpan();
      if (!target) return;
      const desired = statusText(snapshot);
      target.dataset.vonuEntitlementStatus = "true";
      if ((target.textContent || "").trim() !== desired) target.textContent = desired;
    }

    function markVisuals() {
      document.querySelectorAll<HTMLElement>("main > section").forEach((section) => {
        const label = section.querySelector<HTMLElement>(":scope > div:nth-child(2) > p:first-child");
        const mode = subjectModeByLabel.get((label?.textContent || "").trim());
        if (mode) section.dataset.vonuRuntimeSubjectMode = mode;
      });

      const radar = Array.from(document.querySelectorAll<HTMLElement>("main div")).find(
        (element) =>
          element.classList.contains("relative") &&
          element.classList.contains("mx-auto") &&
          element.classList.contains("h-40") &&
          element.classList.contains("w-40"),
      );

      if (radar) {
        radar.dataset.vonuRadarRuntime = "true";
        const panel = radar.parentElement;
        const progress = panel
          ? Array.from(panel.children).find(
              (child) =>
                child instanceof HTMLElement &&
                child.classList.contains("h-1") &&
                child.classList.contains("overflow-hidden"),
            )
          : null;
        if (progress instanceof HTMLElement) progress.dataset.vonuProgressRuntime = "true";
      }
    }

    async function refreshBalance() {
      if (cancelled) return null;
      lastRequestAt = Date.now();
      try {
        const response = await fetch("/api/check/entitlement", { method: "GET", cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (cancelled || !response.ok || !data) return null;
        snapshot = snapshotFromData(data);
        applyBalance();
        return snapshot;
      } catch {
        return null;
      }
    }

    function requestRefresh(force = false) {
      if (!findBalanceSpan()) return;
      if (refreshTimer !== null) return;
      const elapsed = Date.now() - lastRequestAt;
      const delay = force ? 0 : Math.max(0, 1200 - elapsed);
      refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        void refreshBalance();
      }, delay);
    }

    function syncRuntime() {
      markVisuals();
      applyBalance();
      requestRefresh(false);
    }

    const observer = new MutationObserver(syncRuntime);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const onFocus = () => requestRefresh(true);
    const onVisibility = () => {
      if (document.visibilityState === "visible") requestRefresh(true);
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    markVisuals();
    void refreshBalance();

    const params = new URLSearchParams(window.location.search);
    let activationPoll: number | null = null;
    if (params.get("checkout") === "success" && params.get("pack") === "3") {
      let attempts = 0;
      activationPoll = window.setInterval(() => {
        attempts += 1;
        void refreshBalance().then((value) => {
          if ((value?.creditsRemaining || 0) > 0 || attempts >= 14) {
            if (activationPoll !== null) window.clearInterval(activationPoll);
            activationPoll = null;
          }
        });
      }, 700);
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      if (activationPoll !== null) window.clearInterval(activationPoll);
    };
  }, [t]);

  return <style>{runtimeCss}</style>;
}
