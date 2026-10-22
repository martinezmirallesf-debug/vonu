import type { SupportedLocale } from "@/lib/vonu-check/types";

export const PHP_SECURITY_SLUGS: Record<SupportedLocale, string> = {
  es: "seguridad-php",
  en: "php-security",
  fr: "securite-php",
  de: "php-sicherheit",
  ar: "aman-php",
};

export const PHP_SECURITY_LABELS: Record<SupportedLocale, string> = {
  es: "Seguridad PHP",
  en: "PHP security",
  fr: "Sécurité PHP",
  de: "PHP-Sicherheit",
  ar: "أمان PHP",
};

export function phpSecurityPath(locale: SupportedLocale): string {
  const slug = PHP_SECURITY_SLUGS[locale];
  return locale === "es" ? `/${slug}` : `/${locale}/${slug}`;
}

export function isPhpSecurityRoute(locale: SupportedLocale, slug: string): boolean {
  return slug === PHP_SECURITY_SLUGS[locale] || (locale !== "es" && slug === "seguridad-php");
}

export function phpSecurityLanguageAlternates() {
  const origin = "https://vonuai.com";
  return {
    es: origin + phpSecurityPath("es"),
    en: origin + phpSecurityPath("en"),
    fr: origin + phpSecurityPath("fr"),
    de: origin + phpSecurityPath("de"),
    ar: origin + phpSecurityPath("ar"),
    "x-default": origin + phpSecurityPath("es"),
  };
}
