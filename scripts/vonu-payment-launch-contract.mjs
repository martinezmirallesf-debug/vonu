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

const [middleware, metered, button, gate, checkClient, submissionNotice, vonuMark, socialLinks, brandAsset, checkPage, checkCss, experienceCss, desktopFitCss, entitlement, checkout, webhook, pricing, terms, privacy, cookies] = await Promise.all([
  read("middleware.ts"),
  read("app/api/check/metered/route.ts"),
  read("app/components/DevicePackCheckoutButton.tsx"),
  read("app/components/DeviceAccessGate.tsx"),
  read("app/[locale]/check/CheckClient.tsx"),
  read("app/[locale]/check/SubmissionNotice.tsx"),
  read("app/components/VonuMark.tsx"),
  read("app/components/VonuSocialLinks.tsx"),
  read("public/vonu-mark-official.svg"),
  read("app/[locale]/check/page.tsx"),
  read("app/[locale]/check/submission-notice.css"),
  read("app/check-experience-polish.css"),
  read("app/[locale]/check/desktop-home-fit.css"),
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
requireText(middleware, '["/api/check/document", "document"]', "document metered route");
requireText(middleware, 'requestHeaders.set(DEVICE_HEADER, deviceId)', "device header propagation");

requireText(metered, "reserve_vonu_device_analysis", "atomic analysis reservation");
requireText(metered, "commit_vonu_device_analysis", "successful analysis commit");
requireText(metered, "release_vonu_device_analysis", "failed analysis refund");
requireText(metered, "status: 402", "paywall response");
requireText(metered, 'analyses: 3, amount: 399, currency: "EUR"', "paywall offer");
requireText(metered, 'target === "web"', "web handler execution");
requireText(metered, 'target === "image"', "image handler execution");
requireText(metered, 'target === "document"', "document handler execution");
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
requireText(checkClient, 'data-vonu-document-thumbnail-style="page"', "document thumbnail page treatment");
requireText(checkClient, 'className="relative h-[58px] w-[44px] shrink-0"', "document thumbnail page proportions");
requireText(checkClient, 'data-vonu-analysis-step="true"', "stable analysis step slot");
requireText(checkClient, 'className="mx-auto mt-3 flex h-12', "fixed mobile analysis step height");
forbidText(checkClient, 'bg-[#dceaff] p-1 ring-1 ring-[#7bb7ff]/30', "legacy blue document thumbnail shell");
forbidText(checkClient, 'h-[7px] w-[31px] rounded-[2px] bg-[#eef5ff]', "legacy blue document thumbnail block");
forbidText(checkClient, 'animate-[pulse_1.4s_ease-in-out_infinite]', "document thumbnail blue scan accent");
forbidText(checkClient, 'M0 0h12v12L0 0Z', "document thumbnail corner fold");
requireText(checkClient, 'share: "Compartir resultado"', "Spanish result share action");
requireText(checkClient, 'share: "Share result"', "English result share action");
requireText(checkClient, 'share: "Partager le résultat"', "French result share action");
requireText(checkClient, 'share: "Ergebnis teilen"', "German result share action");
requireText(checkClient, 'share: "مشاركة النتيجة"', "Arabic result share action");
requireText(checkClient, 'typeof navigator.share === "function"', "native result sharing");
requireText(checkClient, 'https://wa.me/?text=', "WhatsApp share fallback");
requireText(checkClient, 'mailto:?subject=', "email share fallback");
requireText(checkClient, 'navigator.clipboard.writeText', "copy result fallback");
requireText(checkClient, 'bg-[#7bb7ff]', "blue new-analysis CTA");
requireText(desktopFitCss, 'padding: 96px 28px 18px !important;', "desktop home lowered spacing");
requireText(desktopFitCss, 'margin-top: 42px !important;', "desktop scanner separation");
requireText(checkClient, 'data-vonu-idle-mode={mode}', "stable idle mode marker");
requireText(checkClient, 'data-vonu-url-input-shell="true"', "stable desktop URL input marker");
requireText(checkClient, 'data-vonu-cta-stack="true"', "stable CTA stack marker");
requireText(submissionNotice, 'data-vonu-cta-stack="true"', "submission notice stable portal target");
requireText(submissionNotice, 'vonu-submission-notice__ai', "submission notice AI line");
requireText(submissionNotice, 'vonu-submission-notice__legal', "submission notice legal line");
requireText(checkClient, 'data-vonu-scanner-subtitle="true"', "localized scanner desktop title");
requireText(checkClient, 'SCANNER_HEADLINE', "five-locale scanner title copy");
requireText(checkClient, 'bg-gradient-to-r from-[#7bb7ff] to-emerald-300', "scanner title gradient accent");
requireText(desktopFitCss, 'font-size: 20px !important;', "desktop scanner title size");
requireText(desktopFitCss, 'max-width: 640px !important;', "desktop URL field centered single-line width");
requireText(desktopFitCss, 'border: 1px solid rgb(35, 59, 97) !important;', "desktop URL matches message border");
requireText(desktopFitCss, 'background: rgb(8, 22, 49) !important;', "desktop URL matches message surface");
requireText(desktopFitCss, '[data-vonu-url-icon="true"]', "desktop URL icon target");
requireText(desktopFitCss, 'display: none !important;', "desktop URL message-style icon removal");
requireText(vonuMark, 'OFFICIAL_VONU_PATH', "official Vonu mark geometry");
requireText(vonuMark, 'viewBox="0 0 2000 2000"', "official Vonu mark viewBox");
requireText(brandAsset, '<path d="M 1308 240', "official Vonu vector asset");
requireText(socialLinks, 'key: "youtube"', "YouTube social link");
requireText(socialLinks, 'https://www.youtube.com/@vonuai', "YouTube channel target");
requireText(socialLinks, 'network === "instagram"', "Instagram official-form icon");
requireText(socialLinks, 'x="2.9" y="2.9" width="18.2" height="18.2"', "Instagram icon proportions");
requireText(desktopFitCss, 'border-radius: 18px !important;', "desktop URL matches message field radius");
requireText(desktopFitCss, 'background: #0d1220 !important;', "desktop URL matches message field background");
requireText(desktopFitCss, 'margin-top: 30px !important;', "desktop URL CTA breathing room");
requireText(desktopFitCss, 'max-width: 840px !important;', "desktop two-line disclaimer width");
requireText(desktopFitCss, 'white-space: nowrap !important;', "desktop disclaimer fixed to two logical lines");
requireText(desktopFitCss, '[data-vonu-idle-mode="capture"] .vonu-submission-notice', "capture disclaimer parity");
requireText(desktopFitCss, '[data-vonu-idle-mode="document"] .vonu-submission-notice', "document disclaimer parity");
requireText(checkClient, 'data-vonu-result-actions="true"', "result action group");
requireText(checkClient, 'data-vonu-share-result="true"', "share result action");
requireText(checkClient, 'data-vonu-new-check="true"', "new analysis action");
requireText(checkClient, 'sm:grid-cols-2', "equal desktop result action columns");
requireText(checkClient, 'min-h-[52px] w-full', "equal result action sizing");
requireText(checkClient, '<circle cx="18" cy="5" r="2.5"', "refined share icon");
requireText(experienceCss, 'section[data-vonu-subject-mode]:not([data-vonu-subject-mode="document"]) > :first-child', "legacy subject icon styling excludes documents");
requireText(experienceCss, 'section[data-vonu-subject-mode="document"] > [data-vonu-document-thumbnail="true"]', "document thumbnail preserves page proportions");
requireText(experienceCss, 'section[data-vonu-subject-mode="document"]::before', "document subject overlay disabled");
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
requireText(checkout, "legal_consent_required", "legal consent required before checkout");
requireText(checkout, 'terms_accepted: "true"', "terms acceptance evidence");
requireText(checkout, 'immediate_performance_requested: "true"', "immediate performance evidence");
requireText(checkout, 'withdrawal_acknowledged: "true"', "withdrawal acknowledgement evidence");
requireText(button, "Antes de continuar al pago", "Spanish pre-checkout legal confirmation");
requireText(button, "Before continuing to payment", "English pre-checkout legal confirmation");
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

console.log("VONU_PAYMENT_LAUNCH_CONTRACT_GREEN model=device free=1 pack=3 price=399 activation=poll balance=localized-live refunds=failed-analysis legal-consent=versioned");
