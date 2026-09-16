import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const header = read("app/components/GlobalPublicHeader.tsx");
const localizedPage = read("app/components/LocalizedPublicPage.tsx");
const localizedRoute = read("app/[locale]/[slug]/page.tsx");
const checkPage = read("app/[locale]/check/page.tsx");
const routes = read("lib/vonu-global/routes.ts");

function requireText(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

function rejectText(source, needle, label) {
  if (source.includes(needle)) throw new Error(`${label}: forbidden ${JSON.stringify(needle)}`);
}

requireText(sitemap, "localizedPublicPath(locale, slug)", "sitemap localized URLs");
requireText(sitemap, "localizedLanguageAlternates(slug)", "sitemap hreflang");
rejectText(sitemap, "publicPath(locale, slug)", "sitemap legacy route helper");

requireText(header, "localizedPublicPath(locale, item.slug)", "desktop localized navigation");
requireText(header, "localizedPublicPath(item, slug)", "language switcher");
requireText(header, "localizedPublicPath(locale, caseSlug)", "localized case navigation");
rejectText(header, "publicPath(", "localized header legacy route helper");

requireText(localizedPage, "localizedPublicPath(locale, slug)", "localized structured data URL");
requireText(localizedPage, "localizedPublicPath(locale, \"precios\")", "localized pricing CTA");
requireText(localizedPage, "localizedPublicPath(locale, \"contacto\")", "localized contact link");
rejectText(localizedPage, "publicPath(", "localized page legacy route helper");

requireText(localizedRoute, "localizedLanguageAlternates(slug)", "page hreflang");
requireText(localizedRoute, "localizedPublicPath(locale, slug)", "page canonical");
requireText(checkPage, '"x-default": `${siteUrl}/check`', "check x-default");
requireText(checkPage, "supportedLocales.map", "check locale alternates");

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

console.log("VONU_GLOBAL_SEO_CONTRACT_GREEN routing=4 sitemap=1 hreflang=2 navigation=3 robots=3");
