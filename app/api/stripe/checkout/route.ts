import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";
import { checkPath } from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export const runtime = "nodejs";

const supportedLocales = new Set<SupportedLocale>(["es", "en", "fr", "de", "ar"]);

function getAppUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = req.headers.get("origin") || "";
  return (envUrl || origin || "http://localhost:3000").replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedLocale = (body?.locale ?? "es").toString().toLowerCase() as SupportedLocale;
    const locale: SupportedLocale = supportedLocales.has(requestedLocale) ? requestedLocale : "es";

    const { user, error } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const sbAdmin = getSupabaseAdmin();
    const { data: profile, error: profileError } = await sbAdmin
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let customerId = profile?.stripe_customer_id ?? null;
    if (!customerId) {
      const created = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = created.id;

      const { error: upsertError } = await sbAdmin.from("profiles").upsert(
        {
          id: user.id,
          stripe_customer_id: customerId,
          email: user.email ?? profile?.email ?? null,
        },
        { onConflict: "id" },
      );

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
      }
    }

    const appUrl = getAppUrl(req);
    const pricingPath = localizedPublicPath(locale, "precios");
    const successPath = `${checkPath(locale)}?checkout=success&credits=3`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: 399,
            product_data: {
              name: "Vonu — 3 análisis adicionales",
              description: "Pack de 3 análisis adicionales de URLs, mensajes o capturas.",
            },
          },
        },
      ],
      success_url: `${appUrl}${successPath}`,
      cancel_url: `${appUrl}${pricingPath}?checkout=cancel`,
      customer_update: { address: "auto", name: "auto" },
      metadata: {
        kind: "analysis_pack",
        analysis_pack: "three",
        analyses: "3",
        amount_eur: "3.99",
        supabase_user_id: user.id,
        locale,
      },
      payment_intent_data: {
        metadata: {
          kind: "analysis_pack",
          analysis_pack: "three",
          analyses: "3",
          supabase_user_id: user.id,
          locale,
        },
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 500 });
  }
}
