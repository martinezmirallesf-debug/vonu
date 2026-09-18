import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { checkPath } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export const runtime = "nodejs";

const supportedLocales = new Set<SupportedLocale>(["es", "en", "fr", "de", "ar"]);
const DEVICE_HEADER = "x-vonu-device-id";
const PACK_PRICE_ID = process.env.STRIPE_PRICE_DEVICE_PACK_3 || "price_1UGKu8Bmg4sO36zcKMqrlWQ4";
const LEGAL_VERSION = "2026-09-18";

function getAppUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = req.headers.get("origin") || "";
  return (envUrl || origin || "http://localhost:3000").replace(/\/$/, "");
}

function isUuid(value: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedLocale = (body?.locale ?? "es").toString().toLowerCase() as SupportedLocale;
    const locale: SupportedLocale = supportedLocales.has(requestedLocale) ? requestedLocale : "es";
    const consent = body?.legalConsent || {};
    const validLegalConsent =
      consent?.termsAccepted === true &&
      consent?.immediatePerformance === true &&
      consent?.withdrawalAcknowledged === true &&
      consent?.version === LEGAL_VERSION;
    const deviceId = req.headers.get(DEVICE_HEADER);

    if (!validLegalConsent) {
      return NextResponse.json({ error: "legal_consent_required" }, { status: 400 });
    }

    if (!isUuid(deviceId)) {
      return NextResponse.json({ error: "device_id_missing" }, { status: 400 });
    }

    const stripe = getStripe();
    const appUrl = getAppUrl(req);
    const pricingPath = localizedPublicPath(locale, "precios");
    const successPath = `${checkPath(locale)}?checkout=success&pack=3`;
    const acceptedAt = new Date().toISOString();

    const legalMetadata = {
      legal_version: LEGAL_VERSION,
      terms_accepted: "true",
      immediate_performance_requested: "true",
      withdrawal_acknowledged: "true",
      legal_accepted_at: acceptedAt,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: PACK_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}${successPath}`,
      cancel_url: `${appUrl}${pricingPath}?checkout=cancel`,
      customer_creation: "always",
      allow_promotion_codes: false,
      metadata: {
        kind: "device_pack",
        device_id: deviceId!,
        analyses: "3",
        locale,
        ...legalMetadata,
      },
      payment_intent_data: {
        metadata: {
          kind: "device_pack",
          device_id: deviceId!,
          analyses: "3",
          locale,
          ...legalMetadata,
        },
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 500 });
  }
}
