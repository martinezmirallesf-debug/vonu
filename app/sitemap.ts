import type { MetadataRoute } from "next";
import { GLOBAL_LOCALES, INDEXED_PUBLIC_SLUGS } from "@/lib/vonu-global/i18n";
import {
  localizedLanguageAlternates,
  localizedPublicPath,
} from "@/lib/vonu-global/routes";
import { LEGAL_DOCUMENTS, legalAlternates, legalPath } from "@/lib/vonu-legal/routes";

const BASE_URL = "https://vonuai.com";
const UPDATED_AT = new Date("2026-09-20T00:00:00.000Z");

const checkLanguages = {
  es: `${BASE_URL}/es/check`,
  en: `${BASE_URL}/en/check`,
  fr: `${BASE_URL}/fr/check`,
  de: `${BASE_URL}/de/check`,
  ar: `${BASE_URL}/ar/check`,
  "x-default": `${BASE_URL}/check`,
};

const localizedCheckRoutes: MetadataRoute.Sitemap = GLOBAL_LOCALES.map((locale) => ({
  url: `${BASE_URL}/${locale}/check`,
  lastModified: UPDATED_AT,
  changeFrequency: "weekly",
  priority: 1,
  alternates: { languages: checkLanguages },
}));

const publicRoutes: MetadataRoute.Sitemap = INDEXED_PUBLIC_SLUGS.flatMap((slug) =>
  GLOBAL_LOCALES.map((locale) => ({
    url: `${BASE_URL}${localizedPublicPath(locale, slug)}`,
    lastModified: UPDATED_AT,
    changeFrequency: slug === "recursos" ? ("weekly" as const) : ("monthly" as const),
    priority:
      slug === "comprobar-web-fiable" || slug === "es-fiable"
        ? 0.95
        : slug === "producto" || slug === "casos-de-uso" || slug === "precios"
          ? 0.9
          : 0.82,
    alternates: { languages: localizedLanguageAlternates(slug) },
  })),
);

const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCUMENTS.flatMap((document) =>
  GLOBAL_LOCALES.map((locale) => ({
    url: `${BASE_URL}${legalPath(locale, document)}`,
    lastModified: UPDATED_AT,
    changeFrequency: "yearly" as const,
    priority: document === "responsible-use" ? 0.35 : document === "cookies" ? 0.2 : 0.25,
    alternates: { languages: legalAlternates(document) },
  })),
);

export default function sitemap(): MetadataRoute.Sitemap {
  return [...localizedCheckRoutes, ...publicRoutes, ...legalRoutes];
}
