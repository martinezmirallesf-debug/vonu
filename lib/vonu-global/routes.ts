import type { SupportedLocale } from "@/lib/vonu-check/types";
import type { IndexedPublicSlug } from "./i18n";

const EN: Record<IndexedPublicSlug, string> = {
  producto: "product",
  "casos-de-uso": "use-cases",
  recursos: "resources",
  precios: "pricing",
  "como-funciona": "how-it-works",
  contacto: "contact",
  "comprobar-web-fiable": "is-this-website-safe",
  "comprobar-tienda-online": "check-online-store",
  "analizar-link-sospechoso": "check-suspicious-link",
  "analizar-captura-pantalla": "analyse-screenshot",
  "analizar-sms-estafa": "is-this-text-a-scam",
  "email-sospechoso-estafa": "phishing-email-check",
  "detectar-perfil-falso": "detect-fake-profile",
  "comprobar-inversion-estafa": "investment-scam-check",
  "revisar-contrato": "review-contract",
  "revisar-contrato-alquiler": "review-rental-agreement",
  "comprobar-factura": "check-invoice",
  "revisar-presupuesto": "review-quote-proforma",
  "revisar-contrato-servicios": "review-service-contract",
  "revisar-prestamo-financiacion": "review-loan-financing",
  "detectar-manipulacion": "detect-manipulation",
  "estafas-criptomonedas": "crypto-scams",
  "llamada-banco-codigo-sms": "bank-sms-code-scam",
  "es-fiable": "is-it-trustworthy",
};

const FR: Record<IndexedPublicSlug, string> = {
  producto: "produit",
  "casos-de-uso": "cas-utilisation",
  recursos: "ressources",
  precios: "tarifs",
  "como-funciona": "comment-ca-marche",
  contacto: "contact",
  "comprobar-web-fiable": "site-est-il-fiable",
  "comprobar-tienda-online": "verifier-boutique-en-ligne",
  "analizar-link-sospechoso": "analyser-lien-suspect",
  "analizar-captura-pantalla": "analyser-capture-ecran",
  "analizar-sms-estafa": "sms-arnaque",
  "email-sospechoso-estafa": "email-phishing",
  "detectar-perfil-falso": "detecter-faux-profil",
  "comprobar-inversion-estafa": "investissement-arnaque",
  "revisar-contrato": "reviser-contrat",
  "revisar-contrato-alquiler": "reviser-bail-location",
  "comprobar-factura": "verifier-facture",
  "revisar-presupuesto": "verifier-devis-proforma",
  "revisar-contrato-servicios": "verifier-contrat-services",
  "revisar-prestamo-financiacion": "verifier-pret-financement",
  "detectar-manipulacion": "detecter-manipulation",
  "estafas-criptomonedas": "arnaques-crypto",
  "llamada-banco-codigo-sms": "appel-banque-code-sms",
  "es-fiable": "est-ce-fiable",
};

const DE: Record<IndexedPublicSlug, string> = {
  producto: "produkt",
  "casos-de-uso": "anwendungsfaelle",
  recursos: "ressourcen",
  precios: "preise",
  "como-funciona": "so-funktionierts",
  contacto: "kontakt",
  "comprobar-web-fiable": "website-serioes-pruefen",
  "comprobar-tienda-online": "onlineshop-serioes-pruefen",
  "analizar-link-sospechoso": "verdaechtigen-link-pruefen",
  "analizar-captura-pantalla": "screenshot-analysieren",
  "analizar-sms-estafa": "sms-betrug-pruefen",
  "email-sospechoso-estafa": "phishing-email-pruefen",
  "detectar-perfil-falso": "fake-profil-erkennen",
  "comprobar-inversion-estafa": "investitionsbetrug-pruefen",
  "revisar-contrato": "vertrag-pruefen",
  "revisar-contrato-alquiler": "mietvertrag-pruefen",
  "comprobar-factura": "rechnung-pruefen",
  "revisar-presupuesto": "angebot-proforma-pruefen",
  "revisar-contrato-servicios": "dienstleistungsvertrag-pruefen",
  "revisar-prestamo-financiacion": "darlehen-finanzierung-pruefen",
  "detectar-manipulacion": "manipulation-erkennen",
  "estafas-criptomonedas": "krypto-betrug",
  "llamada-banco-codigo-sms": "bankanruf-sms-code-betrug",
  "es-fiable": "ist-es-serioes",
};

// Arabic search intent is expressed in titles, headings and copy. Latin route slugs keep
// links easy to share across keyboards while the document itself is fully Arabic/RTL.
const AR: Record<IndexedPublicSlug, string> = {
  producto: "product",
  "casos-de-uso": "use-cases",
  recursos: "resources",
  precios: "pricing",
  "como-funciona": "how-it-works",
  contacto: "contact",
  "comprobar-web-fiable": "check-website",
  "comprobar-tienda-online": "check-online-store",
  "analizar-link-sospechoso": "check-link",
  "analizar-captura-pantalla": "analyse-screenshot",
  "analizar-sms-estafa": "check-sms",
  "email-sospechoso-estafa": "check-email",
  "detectar-perfil-falso": "fake-profile",
  "comprobar-inversion-estafa": "investment-scam",
  "revisar-contrato": "review-contract",
  "revisar-contrato-alquiler": "rental-contract",
  "comprobar-factura": "check-invoice",
  "detectar-manipulacion": "detect-manipulation",
  "estafas-criptomonedas": "crypto-scams",
  "llamada-banco-codigo-sms": "bank-sms-code",
  "es-fiable": "trust-check",
};

const LOCALIZED: Record<Exclude<SupportedLocale, "es">, Record<IndexedPublicSlug, string>> = {
  en: EN,
  fr: FR,
  de: DE,
  ar: AR,
};

export function localizedRouteSlug(locale: SupportedLocale, slug: IndexedPublicSlug) {
  return locale === "es" ? slug : LOCALIZED[locale][slug];
}

export function localizedPublicPath(locale: SupportedLocale, slug: IndexedPublicSlug) {
  return locale === "es" ? `/${slug}` : `/${locale}/${localizedRouteSlug(locale, slug)}`;
}

export function localizedLanguageAlternates(slug: IndexedPublicSlug) {
  return {
    es: `https://vonuai.com${localizedPublicPath("es", slug)}`,
    en: `https://vonuai.com${localizedPublicPath("en", slug)}`,
    fr: `https://vonuai.com${localizedPublicPath("fr", slug)}`,
    de: `https://vonuai.com${localizedPublicPath("de", slug)}`,
    ar: `https://vonuai.com${localizedPublicPath("ar", slug)}`,
    "x-default": `https://vonuai.com${localizedPublicPath("es", slug)}`,
  };
}

export function resolveInternalSlug(locale: SupportedLocale, routeSlug: string): IndexedPublicSlug | null {
  if (locale === "es") return routeSlug as IndexedPublicSlug;
  const map = LOCALIZED[locale];
  const match = (Object.entries(map) as Array<[IndexedPublicSlug, string]>).find(([, value]) => value === routeSlug);
  return match?.[0] ?? null;
}
