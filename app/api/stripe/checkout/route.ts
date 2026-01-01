// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan ?? "monthly").toString(); // "monthly" | "yearly"

    if (plan !== "monthly" && plan !== "yearly") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // ✅ Tus envs (como me dijiste):
    // STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY
    const priceMonthly = process.env.STRIPE_PRICE_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_YEARLY;

    if (!priceMonthly || !priceYearly) {
      return NextResponse.json(
        {
          error:
            "Missing STRIPE_PRICE_MONTHLY or STRIPE_PRICE_YEARLY in env (Vercel + .env.local)",
        },
        { status: 500 }
      );
    }

    const priceId = plan === "yearly" ? priceYearly : priceMonthly;

    // ✅ Auth real
    const { user, error } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const stripe = getStripe();
    const sbAdmin = getSupabaseAdmin();

    // 1) Leer profile para stripe_customer_id
    const { data: profile, error: pErr } = await sbAdmin
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    // 2) Si no hay customer, crearlo y guardarlo
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

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // 3) Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancel`,
      allow_promotion_codes: true,
      metadata: { supabase_user_id: user.id, plan },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
