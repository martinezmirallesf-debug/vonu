// app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET in env" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` },
      { status: 400 }
    );
  }

  // ✅ Aquí manejaremos eventos (de momento, log básico)
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          mode: session.mode,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`🔔 ${event.type}`, {
          id: sub.id,
          status: sub.status,
          customer: sub.customer,
          current_period_end: sub.current_period_end,
        });
        break;
      }

      default:
        console.log("ℹ️ Unhandled event:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    console.error("Webhook handler error:", e?.message ?? e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
