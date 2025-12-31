// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs"; // Stripe webhook necesita body raw y crypto Node
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-01-27.acacia",
});

function toISOFromUnixSeconds(sec?: number | null) {
  if (!sec || typeof sec !== "number") return null;
  return new Date(sec * 1000).toISOString();
}

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    // IMPORTANTE: Stripe requiere el body en texto raw para verificar la firma
    const body = await req.text();

    const sig =
      req.headers.get("stripe-signature") ??
      req.headers.get("Stripe-Signature") ??
      "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` },
        { status: 400 }
      );
    }

    // ===== Manejo de eventos =====
    switch (event.type) {
      case "checkout.session.completed": {
        // Si lo estás usando para crear la suscripción, aquí normalmente solo logueamos.
        // La “verdad” de la suscripción la tratamos en customer.subscription.created/updated
        return NextResponse.json({ received: true, type: event.type }, { status: 200 });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // 👇 SOLUCIÓN: casteamos el objeto como Stripe.Subscription (evita el error TS)
        const sub = event.data.object as unknown as Stripe.Subscription;

        const stripeSubscriptionId = sub.id;
        const stripeCustomerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

        const priceId =
          sub.items?.data?.[0]?.price?.id ?? null;

        const currentPeriodEndISO = toISOFromUnixSeconds(
          // en Stripe es unix seconds
          (sub as any).current_period_end ?? null
        );

        // 👇 Si estás pasando metadata.supabase_user_id en el checkout, lo recogemos aquí:
        const userId =
          (sub.metadata?.supabase_user_id as string | undefined) ?? null;

        // Si aún no hay userId (porque todavía no lo metes en metadata), no insertamos:
        if (!userId) {
          // No lo consideramos error para no romper el webhook
          return NextResponse.json(
            { received: true, warning: "Missing sub.metadata.supabase_user_id (no DB upsert done)" },
            { status: 200 }
          );
        }

        // Upsert en public.subscriptions
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              status: sub.status ?? null,
              current_period_end: currentPeriodEndISO,
              price_id: priceId,
            },
            { onConflict: "stripe_subscription_id" }
          );

        if (error) {
          return NextResponse.json(
            { error: `Supabase upsert failed: ${error.message}` },
            { status: 500 }
          );
        }

        return NextResponse.json({ received: true, type: event.type }, { status: 200 });
      }

      default:
        // No hacemos nada con otros eventos
        return NextResponse.json({ received: true, type: event.type }, { status: 200 });
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown webhook error" },
      { status: 500 }
    );
  }
}
