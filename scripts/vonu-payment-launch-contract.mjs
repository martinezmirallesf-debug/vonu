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

const [middleware, button, gate, entitlement, checkout, webhook, pricing, terms, privacy, cookies] = await Promise.all([
  read("middleware.ts"),
  read("app/components/DevicePackCheckoutButton.tsx"),
  read("app/components/DeviceAccessGate.tsx"),
  read("app/api/check/entitlement/route.ts"),
  read("app/api/stripe/checkout/route.ts"),
  read("app/api/stripe/webhook/route.ts"),
  read("app/components/DevicePricingPage.tsx"),
  read("app/legal/terminos/page.tsx"),
  read("app/legal/privacidad/page.tsx"),
  read("app/legal/cookies/page.tsx"),
]);

requireText(middleware, 'const DEVICE_COOKIE = "vonu_device_id"', "device cookie");
requireText(middleware, "consume_vonu_device_analysis", "atomic device consumption");
requireText(middleware, "status: 402", "paywall response");
requireText(middleware, 'analyses: 3, amount: 399, currency: "EUR"', "paywall offer");

requireText(button, 'fetch("/api/stripe/checkout"', "device pack checkout button");
forbidText(button, "supabaseBrowser.auth.getSession", "checkout must not require login");
forbidText(button, "Authorization: `Bearer", "checkout must not require bearer auth");

requireText(gate, 'fetch("/api/check/entitlement"', "post-payment entitlement polling");
requireText(gate, 'credits_remaining || 0) > 0', "credit activation confirmation");
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
forbidText(pricing, "Plus", "no Plus plan");
forbidText(pricing, "Max", "no Max plan");

requireText(terms, "un análisis gratuito por navegador o dispositivo", "terms free analysis");
requireText(terms, "3 análisis adicionales por 3,99 €", "terms pack offer");
requireText(terms, "no crea una suscripción", "terms no subscription");
requireText(terms, "Stripe", "payment processor terms");
requireText(privacy, "Identificador técnico del dispositivo", "privacy device identifier");
requireText(privacy, "vonu_device_id", "privacy device cookie");
requireText(privacy, "pago confirmado", "privacy payment-to-credit flow");
requireText(cookies, "vonu_device_id", "cookie disclosure");

console.log("VONU_PAYMENT_LAUNCH_CONTRACT_GREEN model=device free=1 pack=3 price=399 activation=poll");
