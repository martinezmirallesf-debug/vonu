import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

function forbidText(source, needle, label) {
  if (source.toLowerCase().includes(needle.toLowerCase())) {
    throw new Error(`${label}: legacy text still present ${JSON.stringify(needle)}`);
  }
}

const [middleware, metered, button, gate, checkClient, checkPage, checkCss, entitlement, checkout, webhook, pricing, terms, privacy, cookies] = await Promise.all([
  read("middleware.ts"),
  read("app/api/check/metered/route.ts"),
  read("app/components/DevicePackCheckoutButton.tsx"),
  read("app/components/DeviceAccessGate.tsx"),
  read("app/[locale]/check/CheckClient.tsx"),
  read("app/[locale]/check/page.tsx"),
  read("app/[locale]/check/submission-notice.css"),
  read("app/api/check/entitlement/route.ts"),
  read("app/api/stripe/checkout/route.ts"),
  read("app/api/stripe/webhook/route.ts"),
  read("app/components/DevicePricingPage.tsx"),
  read("app/legal/terminos/page.tsx"),
  read("app/legal/privacidad/page.tsx"),
  read("app/legal/cookies/page.tsx"),
]);

requireText(middleware, 'const DEVICE_COOKIE = "vonu_device_id"', "device cookie");
requireText(middleware, 'meteredUrl.pathname = "/api/check/metered"', "metered rewrite");
requireText(middleware, 'requestHeaders.set(DEVICE_HEADER, deviceId)', "device header propagation");

requireText(metered, "reserve_vonu_device_analysis", "atomic analysis reservation");
requireText(metered, "commit_vonu_device_analysis", "successful analysis commit");
requireText(metered, "release_vonu_device_analysis", "failed analysis refund");
requireText(metered, "status: 402", "paywall response");
requireText(metered, 'analyses: 3, amount: 399, currency: "EUR"', "paywall offer");
requireText(metered, 'target === "web"', "web handler execution");
requireText(metered, 'target === "image"', "image handler execution");
requireText(metered, "await checkText", "text handler execution");

requireText(button, 'fetch("/api/stripe/checkout"', "device pack checkout button");
forbidText(button, "supabaseBrowser.auth.getSession", "checkout must not require login");
forbidText(button, "Authorization: `Bearer", "checkout must not require bearer auth");

requireText(gate, 'originalFetch("/api/check/entitlement"', "post-payment entitlement polling");
requireText(gate, "entitlement.creditsRemaining > 0", "credit activation confirmation");
requireText(gate, "response.status === 402", "exhausted-credit paywall trigger");
requireText(gate, 'analyzeFree: "Analizar gratis"', "Spanish free CTA");
requireText(gate, 'analyzeFree: "Analyse for free"', "English free CTA");
requireText(gate, 'analyzeFree: "Analyser gratuitement"', "French free CTA");
requireText(gate, 'analyzeFree: "Kostenlos analysieren"', "German free CTA");
requireText(gate, 'analyzeFree: "حلّل مجانًا"', "Arabic free CTA");
requireText(gate, "publishEntitlement", "single-source entitlement publication");
requireText(gate, '"vonu:entitlement"', "entitlement UI event");
requireText(gate, '"vonu:entitlement:request"', "entitlement refresh request");
requireText(checkClient, "BALANCE_COPY", "localized paid balance display");
requireText(checkClient, "balanceText", "reactive paid balance state");
requireText(checkClient, 'data-vonu-entitlement-status="true"', "stable scanner balance target");
requireText(checkClient, '"vonu:entitlement"', "scanner entitlement subscription");
requireText(checkClient, 'fetch("/api/check/entitlement"', "scanner direct entitlement refresh");
requireText(checkClient, 'cache: "no-store"', "scanner no-store entitlement refresh");
requireText(checkPage, 'export const dynamic = "force-dynamic"', "device-specific check page");
requireText(checkPage, "export const revalidate = 0", "check page no static revalidation");
requireText(checkCss, 'span[data-vonu-entitlement-status="true"]', "live entitlement css target");
if (/content:\s*["']1\s+(?:análisis gratuito|free analysis|analyse gratuite|kostenlose Analyse)/i.test(checkCss)) {
  throw new Error("legacy fixed free-analysis pseudo-label must not override live balance");
}
requireText(gate, "no vuelvas a pagar", "duplicate-payment warning");
requireText(entitlement, "get_vonu_device_entitlement", "entitlement status RPC");

requireText(checkout, 'mode: "payment"', "one-time checkout mode");
requireText(checkout, 'kind: "device_pack"', "device checkout metadata");
requireText(checkout, 'analyses: "3"', "three-analysis pack metadata");
requireText(checkout, 'price_1UGKu8Bmg4sO36zcKMqrlWQ4', "launch Stripe price");
requireText(checkout, 'customer_creation: "always"', "receipt customer collection");
requireText(checkout, 'localizedPublicPath(locale, "precios")', "localized checkout cancel path");
requireText(checkout, "checkPath(locale)", "localized checkout success path");
forbidText(checkout, 'mode: "subscription"', "no recurring checkout");
forbidText(checkout, "getUserFromRequest", "no account checkout");

requireText(webhook, "grant_vonu_device_pack", "idempotent device grant");
requireText(webhook, 'case "checkout.session.completed"', "checkout completion event");
requireText(webhook, 'case "checkout.session.async_payment_succeeded"', "async payment event");
requireText(webhook, 'amountTotal !== 399', "amount validation");
requireText(webhook, 'currency !== "eur"', "currency validation");

requireText(pricing, "1 análisis gratuito por navegador/dispositivo", "Spanish device free offer");
requireText(pricing, "3 análisis adicionales", "three analysis offer");
requireText(pricing, "3,99 €", "public launch price");
requireText(pricing, "Pago único", "one-time payment copy");
requireText(pricing, "Sin suscripción", "no subscription copy");
forbidText(pricing, 'plan="plus"', "no Plus checkout");
forbidText(pricing, 'plan="max"', "no Max checkout");
forbidText(pricing, "9,99€", "no legacy Plus price");
forbidText(pricing, "19,99€", "no legacy Max price");

requireText(terms, "un análisis gratuito por navegador o dispositivo", "terms free analysis");
requireText(terms, "3 análisis adicionales por 3,99 €", "terms pack offer");
requireText(terms, "no crea una suscripción", "terms no subscription");
requireText(terms, "Stripe", "payment processor terms");
requireText(privacy, "Identificador técnico del dispositivo", "privacy device identifier");
requireText(privacy, "vonu_device_id", "privacy device cookie");
requireText(privacy, "pago confirmado", "privacy payment-to-credit flow");
requireText(cookies, "vonu_device_id", "cookie disclosure");

console.log("VONU_PAYMENT_LAUNCH_CONTRACT_GREEN model=device free=1 pack=3 price=399 activation=poll balance=localized-live refunds=failed-analysis");
