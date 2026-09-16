import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
  }
}

function forbidText(source, needle, label) {
  if (source.toLowerCase().includes(needle.toLowerCase())) {
    throw new Error(`${label}: legacy text still present ${JSON.stringify(needle)}`);
  }
}

const [button, checkout, webhook, pricing, terms] = await Promise.all([
  read("app/components/PlanCheckoutButton.tsx"),
  read("app/api/stripe/checkout/route.ts"),
  read("app/api/stripe/webhook/route.ts"),
  read("app/precios/page.tsx"),
  read("app/legal/terminos/page.tsx"),
]);

requireText(button, "supabaseBrowser.auth.getSession()", "public checkout auth");
requireText(button, "Authorization: `Bearer ${token}`", "public checkout bearer");
requireText(button, 'billing?: "monthly" | "yearly"', "checkout billing contract");

requireText(checkout, 'localizedPublicPath(locale, "precios")', "localized checkout cancel path");
requireText(checkout, "checkPath(locale)", "localized checkout success path");
requireText(checkout, "client_reference_id: user.id", "checkout user reference");
requireText(checkout, "allow_promotion_codes: true", "checkout promotions");

requireText(webhook, 'case "checkout.session.completed"', "webhook checkout completion");
requireText(webhook, 'case "customer.subscription.updated"', "webhook subscription updates");
requireText(webhook, 'case "customer.subscription.deleted"', "webhook subscription deletion");
requireText(webhook, "syncProfilePlan", "webhook profile plan sync");

requireText(pricing, "PlanCheckoutButton", "pricing checkout component");
requireText(pricing, 'price: "9,99€"', "plus public price");
requireText(pricing, 'price: "19,99€"', "max public price");
requireText(pricing, "Stripe", "pricing payment processor copy");
forbidText(pricing, "Modo conversación", "pricing scope");
forbidText(pricing, "Recarga", "pricing scope");
forbidText(pricing, "minutos de voz", "pricing scope");
forbidText(pricing, 'href="/chat"', "pricing legacy checkout");

requireText(terms, "Las suscripciones periódicas se renovarán", "subscription renewal terms");
requireText(terms, "La cancelación impedirá futuras renovaciones", "subscription cancellation terms");
requireText(terms, "Stripe", "payment processor terms");

console.log("VONU_PAYMENT_LAUNCH_CONTRACT_GREEN");
