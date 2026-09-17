"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type EntitlementSnapshot = {
  freeUsed: boolean;
  creditsRemaining: number;
  lifetimeAnalyses: number;
};

const copy: Record<SupportedLocale, {
  loading: string;
  freeAvailable: string;
  freeUsed: string;
  creditsAvailable: (count: number) => string;
}> = {
  es: {
    loading: "Comprobando análisis disponibles…",
    freeAvailable: "1 análisis gratuito disponible",
    freeUsed: "Análisis gratuito utilizado",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "análisis disponible" : "análisis disponibles"}`,
  },
  en: {
    loading: "Checking available analyses…",
    freeAvailable: "1 free analysis available",
    freeUsed: "Free analysis used",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analysis available" : "analyses available"}`,
  },
  fr: {
    loading: "Vérification des analyses disponibles…",
    freeAvailable: "1 analyse gratuite disponible",
    freeUsed: "Analyse gratuite utilisée",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analyse disponible" : "analyses disponibles"}`,
  },
  de: {
    loading: "Verfügbare Analysen werden geprüft…",
    freeAvailable: "1 kostenlose Analyse verfügbar",
    freeUsed: "Kostenlose Analyse genutzt",
    creditsAvailable: (count) => `${count}/3 Analysen verfügbar`,
  },
  ar: {
    loading: "جارٍ التحقق من التحليلات المتاحة…",
    freeAvailable: "تحليل مجاني واحد متاح",
    freeUsed: "تم استخدام التحليل المجاني",
    creditsAvailable: (count) => `${count}/3 تحليلات متاحة`,
  },
};

function fromApi(data: any): EntitlementSnapshot {
  return {
    freeUsed: Boolean(data?.free_used),
    creditsRemaining: Math.max(0, Number(data?.credits_remaining ?? 0)),
    lifetimeAnalyses: Math.max(0, Number(data?.lifetime_analyses ?? 0)),
  };
}

function statusText(snapshot: EntitlementSnapshot, locale: SupportedLocale) {
  const t = copy[locale];
  if (!snapshot.freeUsed && snapshot.creditsRemaining <= 0) return t.freeAvailable;
  if (snapshot.creditsRemaining > 0) return t.creditsAvailable(snapshot.creditsRemaining);
  if (snapshot.lifetimeAnalyses >= 4) return t.creditsAvailable(0);
  return t.freeUsed;
}

export default function DeviceEntitlementStatus({ locale }: { locale: SupportedLocale }) {
  const [entitlement, setEntitlement] = useState<EntitlementSnapshot | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/check/entitlement", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) return;
      setEntitlement(fromApi(data));
    } catch {
      // Keep the last known balance if the status endpoint is temporarily unavailable.
    }
  }, []);

  useEffect(() => {
    const handleEntitlement = (event: Event) => {
      const detail = (event as CustomEvent<EntitlementSnapshot>).detail;
      if (!detail) return;
      setEntitlement({
        freeUsed: Boolean(detail.freeUsed),
        creditsRemaining: Math.max(0, Number(detail.creditsRemaining ?? 0)),
        lifetimeAnalyses: Math.max(0, Number(detail.lifetimeAnalyses ?? 0)),
      });
    };

    const handlePageVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener("vonu:entitlement", handleEntitlement as EventListener);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handlePageVisible);
    void refresh();

    return () => {
      window.removeEventListener("vonu:entitlement", handleEntitlement as EventListener);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handlePageVisible);
    };
  }, [refresh]);

  return (
    <span data-vonu-entitlement-status="true" aria-live="polite">
      {entitlement ? statusText(entitlement, locale) : copy[locale].loading}
    </span>
  );
}
