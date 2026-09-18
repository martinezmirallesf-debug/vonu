"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicRouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;

    // Prevent the browser/Next client navigation from reusing an old vertical
    // offset on public pages. Run once synchronously and once on the next frame
    // so the first painted state is the real top of the route.
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0));

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
