"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const LOCALES = new Set(["es", "en", "fr", "de", "ar"]);

function localeFromPath(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && LOCALES.has(first) ? first : "es";
}

export default function DocumentLocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const locale = localeFromPath(pathname || "/");
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  useEffect(() => {
    function goHomeFromLogo(event: MouseEvent) {
      const origin = event.target;
      const logoLink = origin instanceof Element
        ? origin.closest<HTMLAnchorElement>('a[aria-label="Vonu"]')
        : null;
      if (!logoLink) return;

      const locale = localeFromPath(window.location.pathname);
      const home = `/${locale}/check`;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // A full navigation intentionally clears any in-memory analysis result.
      // This keeps every header logo consistent: it always returns to the
      // localized Vonu home/scanner, even when clicked from a result screen.
      window.location.assign(home);
    }

    document.addEventListener("click", goHomeFromLogo, true);
    return () => document.removeEventListener("click", goHomeFromLogo, true);
  }, []);

  return null;
}
