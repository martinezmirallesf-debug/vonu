// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body?.plan ?? "basic").toString();

    // Por ahora solo "basic"
    if (plan !== "basic") {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_BASIC;
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_BASIC in env" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/?checkout=cancel`,
      // Luego (cuando metamos auth) aquí meteremos:
      // customer_email, client_reference_id, metadata.user_id, etc.
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
