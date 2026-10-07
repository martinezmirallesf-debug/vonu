import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const rootLayout = read("app/layout.tsx");
const header = read("app/components/GlobalPublicHeader.tsx");
const checkHeader = read("app/components/HomeHeader.tsx");
const localizedPage = read("app/components/LocalizedPublicPage.tsx");
const publicFooter = read("app/components/GlobalPublicFooter.tsx");
const checkFooter = read("app/components/HomeFooter.tsx");
const intentPage = read("app/components/IntentPublicPage.tsx");
const intentContent = read("lib/vonu-global/intent-content.ts");
const localizedRoute = read("app/[locale]/[slug]/page.tsx");
const checkPage = read("app/[locale]/check/page.tsx");
const devicePricing = read("app/components/DevicePricingPage.tsx");
const pricingSchema = read("app/components/PricingStructuredData.tsx");
const routes = read("lib/vonu-global/routes.ts");
const llms = read("public/llms.txt");
const trustWebPage = read("app/comprobar-web-fiable/page.tsx");
const trustShopPage = read("app/comprobar-tienda-online/page.tsx");
const trustHubPage = read("app/es-fiable/page.tsx");
const trustAuthoritySection = read("app/components/TrustSeoAuthoritySection.tsx");
const inlineDocumentAnalyzer = read("app/components/InlineDocumentAnalyzer.tsx");
const legalIntentAuthority = read("app/components/LegalIntentAuthoritySection.tsx");
const jurisdictionProfiles = read("lib/vonu-check/jurisdiction-profiles.ts");
const documentRoute = read("app/api/check/document/route.ts");
const globalI18n = read("lib/vonu-global/i18n.ts");
const trustIntentAuthority = read("app/components/TrustIntentAuthoritySection.tsx");
const inlineTrustAnalyzer = read("app/components/InlineTrustAnalyzer.tsx");
const checkClient = read("app/[locale]/check/CheckClient.tsx");
const coreUseCaseDemo = read("app/components/CoreUseCaseCheckDemo.tsx");
const homeHeader = read("app/components/HomeHeader.tsx");

function requireText(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

function rejectText(source, needle, label) {
  if (source.includes(needle)) throw new Error(`${label}: forbidden ${JSON.stringify(needle)}`);
}

requireText(rootLayout, "vonu-client-recovery:", "stale client chunk recovery key");
requireText(rootLayout, "ChunkLoadError", "stale chunk error detection");
requireText(rootLayout, "window.location.reload()", "single stale chunk recovery reload");
requireText(rootLayout, "launch.style.display = 'none'", "launch overlay hidden without DOM removal");
rejectText(rootLayout, "parentNode.removeChild(launch)", "launch overlay must remain inside React DOM");
requireText(sitemap, "localizedPublicPath(locale, slug)", "sitemap localized URLs");
requireText(sitemap, "localizedLanguageAlternates(slug)", "sitemap hreflang");
rejectText(sitemap, "publicPath(locale, slug)", "sitemap legacy route helper");

requireText(header, "localizedPublicPath(locale, item.slug)", "desktop localized navigation");
requireText(header, "localizedPublicPath(item, slug)", "language switcher");
requireText(header, "localizedPublicPath(locale, caseSlug)", "localized case navigation");
const resourceMenu = header.match(/const resourceSlugs: IndexedPublicSlug\[\] = \[([\s\S]*?)\];/)?.[1] ?? "";
const requiredResourceMenuSlugs = [
  "es-fiable",
  "comprobar-web-fiable",
  "comprobar-tienda-online",
  "analizar-link-sospechoso",
  "analizar-captura-pantalla",
  "analizar-sms-estafa",
  "email-sospechoso-estafa",
  "detectar-perfil-falso",
  "comprobar-inversion-estafa",
  "estafas-criptomonedas",
  "llamada-banco-codigo-sms",
  "revisar-contrato",
  "revisar-contrato-alquiler",
  "comprobar-factura",
  "revisar-presupuesto",
  "revisar-contrato-servicios",
  "revisar-prestamo-financiacion",
];
for (const slug of requiredResourceMenuSlugs) {
  requireText(resourceMenu, `"${slug}"`, `resource menu coverage ${slug}`);
}
rejectText(header, "publicPath(", "localized header legacy route helper");
requireText(checkHeader, "localizedPublicPath(locale, item.slug)", "check/legal header localized navigation");
requireText(checkHeader, "localeTarget(item)", "check/legal locale switch routing");
requireText(checkHeader, 'legalPath(locale, "legal-notice")', "check/legal mobile legal notice");
requireText(checkHeader, 'legalPath(locale, "privacy")', "check/legal mobile privacy");
requireText(checkHeader, 'legalPath(locale, "terms")', "check/legal mobile terms");
requireText(checkFooter, 'legalPath(locale, "legal-notice")', "check footer legal notice");
requireText(checkFooter, 'legalPath(locale, "privacy")', "check footer privacy");
requireText(checkFooter, 'legalPath(locale, "terms")', "check footer terms");
requireText(checkFooter, 'localizedPublicPath(locale, "contacto")', "check footer localized contact");
rejectText(checkHeader, "publicPath(", "check/legal header legacy route helper");
rejectText(checkFooter, "publicPath(", "check footer legacy route helper");

requireText(localizedPage, "localizedPublicPath(locale, slug)", "localized structured data URL");
requireText(localizedPage, "localizedPublicPath(locale, \"precios\")", "localized pricing CTA");
requireText(localizedPage, "<GlobalPublicFooter locale={locale} />", "shared localized public footer");
requireText(publicFooter, "localizedPublicPath(locale, \"contacto\")", "localized footer contact link");
requireText(publicFooter, 'legalPath(locale, "legal-notice")', "localized footer legal notice");
requireText(publicFooter, 'legalPath(locale, "privacy")', "localized footer privacy");
requireText(publicFooter, 'legalPath(locale, "cookies")', "localized footer cookies");
requireText(publicFooter, 'legalPath(locale, "terms")', "localized footer terms");
requireText(publicFooter, 'legalPath(locale, "responsible-use")', "localized footer responsible use");
rejectText(localizedPage, "publicPath(", "localized page legacy route helper");

requireText(localizedRoute, "localizedLanguageAlternates(slug)", "page hreflang");
requireText(localizedRoute, "localizedPublicPath(locale, slug)", "page canonical");
requireText(localizedRoute, 'slug === "precios"', "localized pricing interception");
requireText(localizedRoute, "<DevicePricingPage locale={locale} />", "localized device pricing model");
requireText(localizedRoute, "<PricingStructuredData locale={locale} />", "localized pricing schema");
requireText(localizedRoute, "isIntentSlug(slug)", "intent routing");
requireText(localizedRoute, "<IntentPublicPage locale={locale} slug={slug} />", "deep intent template");

requireText(checkPage, '"x-default": `${siteUrl}/check`', "check x-default");
requireText(checkPage, "supportedLocales.map", "check locale alternates");
requireText(checkPage, '"@type": "WebApplication"', "check web application schema");
requireText(checkPage, 'price: "3.99"', "check paid offer price");
requireText(checkPage, 'price: "0"', "check free offer price");
requireText(checkPage, '"@type": "UseAction"', "check use action");

requireText(devicePricing, 'packPrice: "€3.99"', "English pack price");
requireText(devicePricing, 'packPrice: "3,99 €"', "European pack price");
requireText(devicePricing, 'packPrice: "3.99 €"', "Arabic pack price");
requireText(devicePricing, "No subscription", "English no-subscription copy");
requireText(devicePricing, "Sans abonnement", "French no-subscription copy");
requireText(devicePricing, "Kein Abo", "German no-subscription copy");
requireText(devicePricing, "بدون اشتراك", "Arabic no-subscription copy");
rejectText(devicePricing, "9,99€", "legacy Plus price");
rejectText(devicePricing, "19,99€", "legacy Max price");

requireText(pricingSchema, 'price: "0"', "pricing free offer schema");
requireText(pricingSchema, 'price: "3.99"', "pricing paid offer schema");
requireText(pricingSchema, 'priceCurrency: "EUR"', "pricing currency schema");

const requiredIntents = [
  "comprobar-web-fiable",
  "comprobar-tienda-online",
  "analizar-link-sospechoso",
  "analizar-captura-pantalla",
  "analizar-sms-estafa",
  "email-sospechoso-estafa",
  "detectar-perfil-falso",
  "comprobar-inversion-estafa",
  "revisar-contrato",
  "revisar-contrato-alquiler",
  "comprobar-factura",
  "revisar-presupuesto",
  "revisar-contrato-servicios",
  "revisar-prestamo-financiacion",
  "detectar-manipulacion",
  "estafas-criptomonedas",
  "llamada-banco-codigo-sms",
  "es-fiable",
];
for (const slug of requiredIntents) {
  requireText(intentContent, `"${slug}"`, `intent coverage ${slug}`);
}
for (const locale of ["es", "en", "fr", "de", "ar"]) {
  requireText(intentContent, `${locale}: {`, `intent locale ${locale}`);
}
requireText(intentPage, 'id="answer"', "answer-first block");
requireText(intentPage, '"@type": "ItemList"', "intent signal list schema");
requireText(intentPage, '"@type": "FAQPage"', "intent FAQ semantics");
requireText(intentPage, '"@type": "UseAction"', "intent conversion action");
requireText(intentPage, "content.related.map", "intent internal links");


for (const [source, slug, label] of [
  [trustWebPage, "comprobar-web-fiable", "web trust landing"],
  [trustShopPage, "comprobar-tienda-online", "shop trust landing"],
  [trustHubPage, "es-fiable", "trust intent hub"],
]) {
  requireText(source, `localizedLanguageAlternates("${slug}")`, `${label} hreflang metadata`);
  requireText(source, '"@type": "BreadcrumbList"', `${label} breadcrumb schema`);
  requireText(source, '"@type": "ItemList"', `${label} verification list schema`);
  requireText(source, 'dateModified: "2026-10-07"', `${label} freshness`);
  requireText(source, "<TrustSeoAuthoritySection", `${label} visible authority section`);
  requireText(source, 'isPartOf: { "@id": `${siteUrl}/#website` }', `${label} website entity relationship`);
}
requireText(trustWebPage, '<InlineTrustAnalyzer locale="es" intent="website" />', "Spanish web inline analyzer");
requireText(trustShopPage, '<InlineTrustAnalyzer locale="es" intent="online_store" />', "Spanish shop inline analyzer");
requireText(trustHubPage, '<InlineTrustAnalyzer locale="es" intent="generic" />', "Spanish trust hub inline analyzer");
rejectText(trustWebPage, "Web revisada", "Spanish web static demo removed");
rejectText(trustShopPage, "Tienda revisada", "Spanish shop static demo removed");
rejectText(trustHubPage, "Fiabilidad revisada", "Spanish trust hub static demo removed");
requireText(intentPage, "<InlineTrustAnalyzer", "international inline trust analyzer");
requireText(inlineTrustAnalyzer, '["url", "capture", "text", "document"]', "generic trust scanner parity");
requireText(inlineTrustAnalyzer, '["url"]', "focused URL trust scanner");
requireText(checkClient, "embeddedEyebrow", "embedded home scanner support");
rejectText(coreUseCaseDemo, '"/comprobar-web-fiable"', "legacy web trust demo removed");
rejectText(coreUseCaseDemo, '"/comprobar-tienda-online"', "legacy store trust demo removed");
requireText(coreUseCaseDemo, 'document.querySelector("#analizador")', "legacy demo real-analyzer guard");
requireText(homeHeader, "!hasInlineTrustAnalyzer ? <CoreUseCaseCheckDemo", "header demo guard for functional trust landings");

requireText(trustAuthoritySection, "Fuentes oficiales de referencia", "trust authority sources");
requireText(trustAuthoritySection, "Comprueba según tu caso", "trust landing intent links");
requireText(trustAuthoritySection, "Actualizado el", "trust landing visible freshness");
requireText(sitemap, "PRIORITY_INTENT_UPDATED_AT", "priority intent sitemap freshness");
requireText(sitemap, '"comprobar-tienda-online"', "shop trust landing sitemap priority");


requireText(intentPage, "<TrustIntentAuthoritySection", "international trust authority section");
requireText(intentPage, "ENHANCED_TRUST_INTENTS", "international trust intent routing");
requireText(trustIntentAuthority, "UK NCSC", "English trust authority source");
requireText(trustIntentAuthority, "Cybermalveillance.gouv.fr", "French trust authority source");
requireText(trustIntentAuthority, "BSI", "German trust authority source");
requireText(trustIntentAuthority, "الهيئة الوطنية للأمن السيبراني", "Arabic trust authority source");
requireText(trustIntentAuthority, "6 October 2026", "English trust source freshness");
requireText(intentContent, "7 checks to tell whether a website is trustworthy", "English web trust depth");
requireText(intentContent, "7 vérifications pour savoir si un site est fiable", "French web trust depth");
requireText(intentContent, "7 Prüfungen, um eine seriöse Website einzuschätzen", "German web trust depth");
requireText(intentContent, "7 فحوصات لمعرفة ما إذا كان الموقع موثوقًا", "Arabic web trust depth");

requireText(intentPage, "<InlineDocumentAnalyzer locale={locale} intent={documentIntent} />", "inline legal analyzer");
requireText(intentPage, "<LegalIntentAuthoritySection locale={locale} intent={documentIntent} />", "legal authority section");
requireText(intentPage, "<DeviceAccessGate locale={locale} />", "inline legal entitlement gate");
requireText(intentPage, 'dateModified: "2026-10-07"', "intent structured freshness");
requireText(inlineDocumentAnalyzer, 'form.set("jurisdictionHint"', "jurisdiction hint submission");
requireText(inlineDocumentAnalyzer, 'form.set("kindHint", intent)', "document intent hint submission");
requireText(inlineDocumentAnalyzer, 'fetch("/api/check/document"', "real inline document analysis");
requireText(inlineDocumentAnalyzer, 'data-vonu-analyze-cta="true"', "inline analyzer entitlement CTA");
requireText(legalIntentAuthority, "JURISDICTION_PROFILES", "visible legal source profiles");
requireText(legalIntentAuthority, "2026-10-06", "visible legal source review date");

for (const locale of ["es", "en", "fr", "de", "ar"]) {
  requireText(intentContent, `${locale}: {`, `legal intent locale override ${locale}`);
}
requireText(intentContent, "Qué revisar en un contrato de alquiler antes de firmar", "Spanish rental intent depth");
requireText(intentContent, "What to check in a rental agreement before signing", "English rental intent depth");
requireText(intentContent, "Que vérifier dans un bail avant de signer", "French rental intent depth");
requireText(intentContent, "Was du in einem Mietvertrag vor der Unterschrift prüfen solltest", "German rental intent depth");
requireText(intentContent, "ما الذي يجب مراجعته في عقد الإيجار قبل التوقيع", "Arabic rental intent depth");

requireText(jurisdictionProfiles, 'reviewedAt: "2026-10-06"', "jurisdiction profile freshness");
requireText(jurisdictionProfiles, "Real Decreto-ley 26/2026 and Real Decreto-ley 27/2026", "Spain repealed-law guard");
requireText(jurisdictionProfiles, 'rentalRegionRequirement: "England"', "England-only rental scope");
requireText(jurisdictionProfiles, "BGB §551", "German rental legal anchor");
requireText(jurisdictionProfiles, "Loi n° 89-462", "French rental legal anchor");
requireText(documentRoute, "hints.jurisdictionHint", "document jurisdiction hint is non-evidence");
requireText(documentRoute, "STATUS notes", "document current-law status guard");
requireText(documentRoute, "jurisdictionProfileAppliesToRental", "rental regional scope enforcement");
requireText(documentRoute, "legalProfileAvailable", "unsupported jurisdiction limitation");

for (const staleTitle of [
  "Review a rental agreement — Vonü",
  "Vérifier un contrat de location — Vonü",
  "Mietvertrag prüfen — Vonü",
  "مراجعة عقد إيجار — Vonü",
]) {
  rejectText(globalI18n, staleTitle, `duplicate-brand legal title ${staleTitle}`);
}
requireText(sitemap, '"revisar-contrato-alquiler"', "rental intent sitemap priority");
requireText(sitemap, '"revisar-contrato"', "contract intent sitemap priority");

requireText(rootLayout, "<DocumentLocaleSync />", "document locale synchronization");
rejectText(rootLayout, '<html lang="es"', "hardcoded Spanish document language");
requireText(rootLayout, "availableLanguage", "organization language support");
requireText(rootLayout, "knowsLanguage", "organization language graph");

requireText(robots, 'sitemap: `${BASE_URL}/sitemap.xml`', "robots sitemap");
requireText(robots, "allow: \"/\"", "robots crawl allow");
requireText(robots, 'disallow: ["/api/", "/auth/"]', "robots private paths");

for (const [locale, expected] of [
  ["en", 'producto: "product"'],
  ["fr", 'producto: "produit"'],
  ["de", 'producto: "produkt"'],
  ["ar", 'producto: "product"'],
]) {
  requireText(routes, expected, `${locale} route map`);
}
requireText(routes, '"x-default": `https://vonuai.com${localizedPublicPath("es", slug)}`', "public x-default");
requireText(routes, '"revisar-presupuesto": "review-quote-proforma"', "English quote route");
requireText(routes, '"revisar-contrato-servicios": "verifier-contrat-services"', "French service-contract route");
requireText(routes, '"revisar-prestamo-financiacion": "darlehen-finanzierung-pruefen"', "German financing route");
requireText(routes, '"revisar-presupuesto": "review-quote"', "Arabic quote route");

requireText(llms, "3 additional analyses for EUR 3.99", "llms current commercial model");
requireText(llms, "There is no subscription or automatic renewal", "llms no-subscription model");
requireText(llms, "https://vonuai.com/en/is-this-website-safe", "llms localized English route");
requireText(llms, "https://vonuai.com/fr/site-est-il-fiable", "llms localized French route");
requireText(llms, "https://vonuai.com/de/website-serioes-pruefen", "llms localized German route");
requireText(llms, "https://vonuai.com/ar/check-website", "llms localized Arabic route");
rejectText(llms, "Plus (€9.99", "llms legacy Plus model");
rejectText(llms, "Max (€19.99", "llms legacy Max model");

console.log(`VONU_GLOBAL_SEO_CONTRACT_GREEN intents=${requiredIntents.length} resources=${requiredResourceMenuSlugs.length} locales=5 pricing=2 schema=4 routing=4`);
