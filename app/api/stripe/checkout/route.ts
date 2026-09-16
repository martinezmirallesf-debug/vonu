import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";

export const runtime = "nodejs";

const supportedLocales = new Set(["es", "en", "fr", "de", "ar"]);

function getAppUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const origin = req.headers.get("origin") || "";
  return (envUrl || origin || "http://localhost:3000").replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan ?? "").toString() as "plus" | "max";
    const billing = (body?.billing ?? "").toString() as "monthly" | "yearly";
    const requestedLocale = (body?.locale ?? "es").toString().toLowerCase();
    const locale = supportedLocales.has(requestedLocale) ? requestedLocale : "es";

    if (!["plus", "max"].includes(plan) || !["monthly", "yearly"].includes(billing)) {
      return NextResponse.json({ error: "Invalid checkout params" }, { status: 400 });
    }

    const priceMap = {
      plus: {
        monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY,
        yearly: process.env.STRIPE_PRICE_PLUS_YEARLY,
      },
      max: {
        monthly: process.env.STRIPE_PRICE_MAX_MONTHLY,
        yearly: process.env.STRIPE_PRICE_MAX_YEARLY,
      },
    } as const;

    const priceId = priceMap[plan][billing];
    if (!priceId) {
      return NextResponse.json({ error: "Missing Stripe price env vars for selected plan/billing" }, { status: 500 });
    }

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
    const pricingPath = locale === "es" ? "/precios" : `/${locale}/precios`;
    const successPath = `/${locale}/check?checkout=success&plan=${plan}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}${successPath}`,
      cancel_url: `${appUrl}${pricingPath}?checkout=cancel`,
      allow_promotion_codes: true,
      customer_update: { address: "auto", name: "auto" },
      metadata: {
        supabase_user_id: user.id,
        billing_cycle: billing,
        app_plan: plan,
        locale,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          billing_cycle: billing,
          app_plan: plan,
          locale,
        },
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 500 });
  }
}
