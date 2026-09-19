"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteScrollTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let cancelled = false;
    const reset = () => {
      if (!cancelled && window.scrollY !== 0) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    // Next/Android Chrome can restore the previous route position after the new
    // page has already painted. Keep the route pinned to the top briefly, but
    // stop immediately if the user starts interacting.
    reset();
    const frame = window.requestAnimationFrame(reset);
    const timers = [0, 60, 180, 420, 800].map((ms) => window.setTimeout(reset, ms));

    const stop = () => {
      cancelled = true;
    };
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    window.addEventListener("pointerdown", stop, { once: true, passive: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("wheel", stop);
    };
  }, [pathname]);

  return null;
}
