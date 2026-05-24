// app/api/stripe/topup/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";

export const runtime = "nodejs";

type TopupPack = "basic" | "medium" | "large";

function getAppUrl(req: NextRequest) {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  const origin = req.headers.get("origin") || "";

  return (envUrl || origin || "http://localhost:3000").replace(/\/$/, "");
}

function getTopupPriceId(pack: TopupPack) {
  const map: Record<TopupPack, string | undefined> = {
    basic: process.env.STRIPE_PRICE_TOPUP_BASIC,
    medium: process.env.STRIPE_PRICE_TOPUP_MEDIUM,
    large: process.env.STRIPE_PRICE_TOPUP_LARGE,
  };

  return map[pack] ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pack = String(body?.pack || "") as TopupPack;

    if (!["basic", "medium", "large"].includes(pack)) {
      return NextResponse.json({ error: "Invalid topup pack" }, { status: 400 });
    }

    const priceId = getTopupPriceId(pack);
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe topup price env var" },
        { status: 500 }
      );
    }

    const { user, error } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: error ?? "Unauthorized" },
        { status: 401 }
      );
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
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = created.id;

      const { error: upsertProfileError } = await sbAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            stripe_customer_id: customerId,
            email: user.email ?? profile?.email ?? null,
          },
          { onConflict: "id" }
        );

      if (upsertProfileError) {
        return NextResponse.json(
          { error: upsertProfileError.message },
          { status: 500 }
        );
      }
    }

    const appUrl = getAppUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancel`,
      allow_promotion_codes: true,
      customer_update: {
        address: "auto",
        name: "auto",
      },
      metadata: {
        kind: "topup",
        topup_pack: pack,
        supabase_user_id: user.id,
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