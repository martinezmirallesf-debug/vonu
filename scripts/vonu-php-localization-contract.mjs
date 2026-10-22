import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function read(path) { return fs.readFileSync(path, "utf8"); }
function assert(ok, description) {
  if (!ok) throw Error("VONU_PHP_LOCALIZATION_FAILED: " + description);
}
const helper = read("lib/vonu-global/php-security.ts");
const compiled = ts.transpileModule(helper, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports, Object });
const { phpSecurityPath, isPhpSecurityRoute, phpSecurityLanguageAlternates, PHP_SECURITY_SLUGS } = module.exports;

const expected = {
  es: "/seguridad-php",
  en: "/en/php-security",
  fr: "/fr/securite-php",
  de: "/de/php-sicherheit",
  ar: "/ar/aman-php",
};
const alternates = phpSecurityLanguageAlternates();
for (const [locale, path] of Object.entries(expected)) {
  assert(phpSecurityPath(locale) === path, locale + " canonical path");
  assert(alternates[locale] === "https://vonuai.com" + path, locale + " hreflang path");
  assert(isPhpSecurityRoute(locale, PHP_SECURITY_SLUGS[locale]), locale + " language selector detection");
  if (locale !== "es") assert(isPhpSecurityRoute(locale, "seguridad-php"), locale + " legacy path recognized");
}
assert(alternates["x-default"] === alternates.es, "Spanish default alternate");
const header = read("app/components/HomeHeader.tsx");
assert(header.includes("isPhpSecurityRoute(locale, currentRouteSlug)"), "header language selector preserves guide");
assert(header.includes("return phpSecurityPath(next)"), "locale target is translated");
assert((header.match(/phpSecurityPath\(locale\)/g) || []).length >= 2, "mobile and desktop menus have localized PHP links");
const globalHeader = read("app/components/GlobalPublicHeader.tsx");
assert((globalHeader.match(/phpSecurityPath\(locale\)/g) || []).length >= 2, "global menu parity");
const localized = read("app/[locale]/[slug]/page.tsx");
assert(localized.includes("slug: PHP_SECURITY_SLUGS[locale]"), "PHP paths statically generated");
assert(localized.includes("return <PhpSecurityLocalizedPage locale={locale} />"), "PHP pages render localized content");
assert(localized.includes("phpSecurityLocalizedMetadata(locale)"), "localized SEO metadata");
const legacy = read("app/[locale]/seguridad-php/page.tsx");
assert(legacy.includes("permanentRedirect(phpSecurityPath(locale))"), "old URLs permanently redirect");
const spanish = read("app/seguridad-php/page.tsx");
assert(spanish.includes("phpSecurityLanguageAlternates()"), "Spanish SEO alternates");
const sitemap = read("app/sitemap.ts");
assert(sitemap.includes("phpSecurityPath(locale)") && sitemap.includes("phpSecurityLanguageAlternates()"), "sitemap canonical routes");
const technical = read("app/components/WebSecurityFindings.tsx");
assert(technical.includes("href={phpSecurityPath(locale)}"), "technical report links localized");
console.log("VONU_PHP_LOCALIZATION_GREEN locales=5 switch=1 menus=2 seo=1 redirects=1");
