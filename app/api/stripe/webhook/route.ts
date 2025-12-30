// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/app/lib/stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripe = getStripe();

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET in env" },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // IMPORTANTE: el webhook necesita el RAW body
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err?.message ?? String(err)}` },
      { status: 400 }
    );
  }

  try {
    // 1) Checkout completado (normalmente crea la suscripción)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.supabase_user_id || null;
      const priceId = session.metadata?.price_id || null;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : (session.customer as any)?.id || null;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : (session.subscription as any)?.id || null;

      if (userId && customerId && subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        const currentPeriodEnd =
          (sub as any).current_period_end
            ? new Date((sub as any).current_period_end * 1000).toISOString()
            : null;

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: (sub as any).status ?? "unknown",
            current_period_end: currentPeriodEnd,
            price_id: priceId,
          },
          { onConflict: "stripe_subscription_id" }
        );
      }

      return NextResponse.json({ received: true });
    }

    // 2) Suscripción actualizada (renovaciones, cancelaciones, etc.)
    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.created"
    ) {
      const sub = event.data.object as Stripe.Subscription;

      const subscriptionId = (sub as any).id ?? null;
      const customerId =
        typeof (sub as any).customer === "string"
          ? (sub as any).customer
          : (sub as any).customer?.id ?? null;

      const currentPeriodEnd =
        (sub as any).current_period_end
          ? new Date((sub as any).current_period_end * 1000).toISOString()
          : null;

      // OJO: aquí Stripe no trae tu user_id si no lo guardas tú.
      // Por eso el "source of truth" para user_id lo ponemos en checkout.session.completed.
      // En updates posteriores, hacemos update por stripe_subscription_id.
      if (subscriptionId) {
        await supabaseAdmin.from("subscriptions").upsert(
          {
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: (sub as any).status ?? "unknown",
            current_period_end: currentPeriodEnd,
            price_id: (sub as any).items?.data?.[0]?.price?.id ?? null,
          },
          { onConflict: "stripe_subscription_id" }
        );
      }

      return NextResponse.json({ received: true });
    }

    // Otros eventos: los aceptamos para que Stripe no reintente
    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Webhook handler error" },
      { status: 500 }
    );
  }
}
