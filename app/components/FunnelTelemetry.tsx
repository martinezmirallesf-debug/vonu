"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

function emit(name: string, data: Record<string, string | number | boolean | undefined> = {}) {
  track(name, data);
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", name, data);
  }
}

function classify(url: string) {
  if (url.includes("/api/check/web")) return "url";
  if (url.includes("/api/check/image")) return "capture";
  if (url.includes("/api/check/text")) return "text";
  return null;
}

export default function FunnelTelemetry() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const raw = typeof args[0] === "string"
        ? args[0]
        : args[0] instanceof Request
          ? args[0].url
          : String(args[0]);
      const absolute = raw.startsWith("http") ? raw : new URL(raw, window.location.origin).toString();
      const analysisMode = classify(absolute);
      const isPlanCheckout = absolute.includes("/api/stripe/checkout");
      const isTopupCheckout = absolute.includes("/api/stripe/topup/checkout");

      if (analysisMode) {
        emit("analysis_started", {
          mode: analysisMode,
          locale: document.documentElement.lang || "unknown",
          path: window.location.pathname,
        });
      }
      if (isPlanCheckout || isTopupCheckout) {
        emit("checkout_started", {
          kind: isTopupCheckout ? "topup" : "subscription",
          path: window.location.pathname,
        });
      }

      const started = performance.now();
      try {
        const response = await originalFetch(...args);

        if (analysisMode) {
          emit("analysis_completed", {
            mode: analysisMode,
            ok: response.ok,
            status: response.status,
            duration_ms: Math.round(performance.now() - started),
            locale: document.documentElement.lang || "unknown",
          });
        }
        if ((isPlanCheckout || isTopupCheckout) && response.ok) {
          emit("checkout_session_created", {
            kind: isTopupCheckout ? "topup" : "subscription",
            status: response.status,
          });
        }

        return response;
      } catch (error) {
        if (analysisMode) {
          emit("analysis_failed", {
            mode: analysisMode,
            duration_ms: Math.round(performance.now() - started),
          });
        }
        if (isPlanCheckout || isTopupCheckout) {
          emit("checkout_failed", { kind: isTopupCheckout ? "topup" : "subscription" });
        }
        throw error;
      }
    };

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";

      if (/\/(?:es|en|fr|de|ar)?\/?precios$/.test(href) || href === "/precios") {
        emit("pricing_clicked", { from: window.location.pathname, to: href });
      }
      if (href.includes("/check")) {
        emit("check_cta_clicked", { from: window.location.pathname, to: href });
      }
    };

    document.addEventListener("click", clickHandler, true);

    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (gaId && !(window as any).__vonuGaBooted) {
      (window as any).__vonuGaBooted = true;
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function gtag(...payload: any[]) {
        (window as any).dataLayer.push(payload);
      };
      (window as any).gtag("js", new Date());
      (window as any).gtag("config", gaId, { send_page_view: true });
    }

    return () => {
      window.fetch = originalFetch;
      document.removeEventListener("click", clickHandler, true);
    };
  }, []);

  return null;
}
