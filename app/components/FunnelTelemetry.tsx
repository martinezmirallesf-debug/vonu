"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

function emit(name: string, data: Record<string, string | number | boolean | undefined> = {}) {
  track(name, data);
}

function classify(url: string) {
  if (url.includes("/api/check/web")) return "url";
  if (url.includes("/api/check/image")) return "capture";
  if (url.includes("/api/check/text")) return "text";
  return null;
}

async function startSpanishPricingCheckout(anchor: HTMLAnchorElement) {
  if (window.location.pathname !== "/precios") return false;
  const href = anchor.getAttribute("href") || "";
  if (href !== "/chat") return false;

  const text = (anchor.textContent || "").trim().toLowerCase();
  const articleText = (anchor.closest("article")?.textContent || "").toLowerCase();

  let endpoint = "";
  let payload: Record<string, string> = {};
  let fallback = "/chat";

  if (text.includes("probar plus")) {
    endpoint = "/api/stripe/checkout";
    payload = { plan: "plus", billing: "monthly", locale: "es" };
    fallback = "/chat?upgrade=plus&locale=es";
    emit("pricing_plan_selected", { plan: "plus", billing: "monthly", locale: "es" });
  } else if (text.includes("probar max")) {
    endpoint = "/api/stripe/checkout";
    payload = { plan: "max", billing: "monthly", locale: "es" };
    fallback = "/chat?upgrade=max&locale=es";
    emit("pricing_plan_selected", { plan: "max", billing: "monthly", locale: "es" });
  } else if (text.includes("añadir recarga")) {
    const pack = articleText.includes("básica")
      ? "basic"
      : articleText.includes("media")
        ? "medium"
        : articleText.includes("grande")
          ? "large"
          : "";
    if (!pack) return false;
    endpoint = "/api/stripe/topup/checkout";
    payload = { pack };
    fallback = `/chat?topup=${pack}&locale=es`;
    emit("pricing_topup_selected", { pack, locale: "es" });
  } else {
    return false;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.status === 401) {
      window.location.href = fallback;
      return true;
    }
    const data = await response.json().catch(() => ({}));
    if (response.ok && data?.url) {
      window.location.href = data.url;
      return true;
    }
  } catch {
    // Fall back to the existing authenticated app flow.
  }

  window.location.href = fallback;
  return true;
}

export default function FunnelTelemetry() {
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const checkout = search.get("checkout");
    if (checkout === "success" || checkout === "cancel") {
      const eventKey = `vonu-checkout-return:${window.location.pathname}${window.location.search}`;
      if (!window.sessionStorage.getItem(eventKey)) {
        window.sessionStorage.setItem(eventKey, "1");
        emit(checkout === "success" ? "checkout_returned_success" : "checkout_returned_cancel", {
          plan: search.get("plan") || undefined,
          locale: document.documentElement.lang || undefined,
          path: window.location.pathname,
        });
      }
    }

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

    const clickHandler = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";

      if (window.location.pathname === "/precios" && href === "/chat") {
        const text = (anchor.textContent || "").toLowerCase();
        if (text.includes("probar plus") || text.includes("probar max") || text.includes("añadir recarga")) {
          event.preventDefault();
          event.stopPropagation();
          await startSpanishPricingCheckout(anchor);
          return;
        }
      }

      if (/\/(?:es|en|fr|de|ar)?\/?precios$/.test(href) || href === "/precios") {
        emit("pricing_clicked", { from: window.location.pathname, to: href });
      }
      if (href.includes("/check")) {
        emit("check_cta_clicked", { from: window.location.pathname, to: href });
      }
    };

    document.addEventListener("click", clickHandler, true);

    return () => {
      window.fetch = originalFetch;
      document.removeEventListener("click", clickHandler, true);
    };
  }, []);

  return null;
}
