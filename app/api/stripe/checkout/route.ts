// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";

export const runtime = "nodejs";

function getAppUrl(req: NextRequest) {
  // Prioridad:
  // 1) NEXT_PUBLIC_APP_URL (ideal: https://app.vonuai.com)
  // 2) NEXT_PUBLIC_SITE_URL (si lo usas)
  // 3) Origin de la request (fallback útil para previews)
  // 4) localhost
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  const origin = req.headers.get("origin") || "";

  const base = (envUrl || origin || "http://localhost:3000").replace(/\/$/, "");
  return base;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

const plan = (body?.plan ?? "").toString() as "plus" | "max";
const billing = (body?.billing ?? "").toString() as "monthly" | "yearly";

if (!["plus", "max"].includes(plan) || !["monthly", "yearly"].includes(billing)) {
  return NextResponse.json({ error: "Invalid checkout params" }, { status: 400 });
}

// Env IDs
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
  return NextResponse.json(
    { error: "Missing Stripe price env vars for selected plan/billing" },
    { status: 500 }
  );
}

    // Auth
    const { user, error } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    const sbAdmin = getSupabaseAdmin();

    // Profile (stripe_customer_id + email)
    const { data: profile, error: pErr } = await sbAdmin
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    // Create customer if missing
    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const created = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });

      customerId = created.id;

      const { error: upErr } = await sbAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            stripe_customer_id: customerId,
            email: user.email ?? profile?.email ?? null,
          },
          { onConflict: "id" }
        );

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
    }

    const appUrl = getAppUrl(req);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancel`,
      allow_promotion_codes: true,

      // Esto ayuda con "pagar con Wallets" y datos de cliente (si Stripe lo necesita)
      customer_update: { address: "auto", name: "auto" },

      metadata: {
  supabase_user_id: user.id,
  billing_cycle: billing,
  app_plan: plan,
},
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
