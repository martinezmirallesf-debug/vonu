import type { SupportedLocale } from "@/lib/vonu-check/types";

export type LegalDocument =
  | "legal-notice"
  | "privacy"
  | "terms"
  | "cookies"
  | "responsible-use";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  "legal-notice",
  "privacy",
  "terms",
  "cookies",
  "responsible-use",
];

const ES_PATHS: Record<LegalDocument, string> = {
  "legal-notice": "/legal/aviso-legal",
  privacy: "/legal/privacidad",
  terms: "/legal/terminos",
  cookies: "/legal/cookies",
  "responsible-use": "/legal/uso-responsable",
};

export function legalPath(locale: SupportedLocale, document: LegalDocument) {
  if (locale === "es") return ES_PATHS[document];
  return `/${locale}/legal/${document}`;
}

export function legalAlternates(document: LegalDocument) {
  const base = "https://vonuai.com";
  return {
    es: `${base}${legalPath("es", document)}`,
    en: `${base}${legalPath("en", document)}`,
    fr: `${base}${legalPath("fr", document)}`,
    de: `${base}${legalPath("de", document)}`,
    ar: `${base}${legalPath("ar", document)}`,
    "x-default": `${base}${legalPath("es", document)}`,
  };
}

export function isLegalDocument(value: string): value is LegalDocument {
  return LEGAL_DOCUMENTS.includes(value as LegalDocument);
}
