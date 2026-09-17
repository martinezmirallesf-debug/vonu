"use client";

import { useEffect } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { localeInfo } from "@/lib/vonu-global/i18n";

export default function DocumentLocale({ locale }: { locale: SupportedLocale }) {
  useEffect(() => {
    const html = document.documentElement;
    const previousLang = html.lang;
    const previousDir = html.dir;
    html.lang = localeInfo[locale].htmlLang;
    html.dir = localeInfo[locale].dir;
    return () => {
      html.lang = previousLang || "es";
      html.dir = previousDir || "ltr";
    };
  }, [locale]);

  return null;
}
