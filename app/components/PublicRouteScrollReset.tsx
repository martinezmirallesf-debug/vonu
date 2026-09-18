"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicRouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;

    const previousRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : null;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Android Chrome can restore the previous scroll position after hydration.
    // Reset immediately and again after the browser's restoration window.
    reset();
    const frame = window.requestAnimationFrame(reset);
    const t0 = window.setTimeout(reset, 0);
    const t50 = window.setTimeout(reset, 50);
    const t150 = window.setTimeout(reset, 150);

    const onPageShow = () => reset();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(t0);
      window.clearTimeout(t50);
      window.clearTimeout(t150);
      window.removeEventListener("pageshow", onPageShow);

      if (previousRestoration && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousRestoration;
      }
    };
  }, [pathname]);

  return null;
}
