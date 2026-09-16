import type { MetadataRoute } from "next";
import {
  GLOBAL_LOCALES,
  INDEXED_PUBLIC_SLUGS,
  languageAlternates,
  publicPath,
} from "@/lib/vonu-global/i18n";

const BASE_URL = "https://vonuai.com";
const UPDATED_AT = new Date("2026-09-16T00:00:00.000Z");

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
    url: `${BASE_URL}${publicPath(locale, slug)}`,
    lastModified: UPDATED_AT,
    changeFrequency: slug === "recursos" ? ("weekly" as const) : ("monthly" as const),
    priority:
      slug === "comprobar-web-fiable" || slug === "es-fiable"
        ? 0.95
        : slug === "producto" || slug === "casos-de-uso" || slug === "precios"
          ? 0.9
          : 0.82,
    alternates: { languages: languageAlternates(slug) },
  })),
);

const legalRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/legal/aviso-legal`, lastModified: UPDATED_AT, changeFrequency: "yearly", priority: 0.25 },
  { url: `${BASE_URL}/legal/privacidad`, lastModified: UPDATED_AT, changeFrequency: "yearly", priority: 0.25 },
  { url: `${BASE_URL}/legal/terminos`, lastModified: UPDATED_AT, changeFrequency: "yearly", priority: 0.25 },
  { url: `${BASE_URL}/legal/cookies`, lastModified: UPDATED_AT, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE_URL}/legal/uso-responsable`, lastModified: UPDATED_AT, changeFrequency: "yearly", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...localizedCheckRoutes, ...publicRoutes, ...legalRoutes];
}
