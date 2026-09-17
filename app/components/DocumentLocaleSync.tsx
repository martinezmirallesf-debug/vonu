"use client";

import { useLayoutEffect } from "react";
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

  return null;
}
