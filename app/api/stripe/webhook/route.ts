// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-12-15.clover",
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

    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message ?? "Unknown"}` },
        { status: 400 }
      );
    }

    // Helpers para logs (muy útil en Vercel)
    const log = (msg: string, extra?: any) => {
      if (extra) console.log(`[stripe-webhook] ${msg}`, extra);
      else console.log(`[stripe-webhook] ${msg}`);
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId =
          (session.metadata?.supabase_user_id as string | undefined) ?? null;

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        const stripeSubscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        log("checkout.session.completed", {
          userId,
          stripeCustomerId,
          stripeSubscriptionId,
        });

        // Si aún no pasas metadata.supabase_user_id, aquí verás null y NO se insertará nada
        if (!stripeSubscriptionId) break;

        // Traer subscription real para status/period_end/price
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        // OJO: typings pueden variar según evento/apiVersion -> leemos seguro
        const status = (stripeSub as any).status ?? null;
        const currentPeriodEndSec = (stripeSub as any).current_period_end ?? null;

        // price_id
        const priceId =
          (stripeSub as any)?.items?.data?.[0]?.price?.id ??
          (stripeSub as any)?.plan?.id ??
          null;

        const payload = {
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status,
          current_period_end: toISOFromUnixSeconds(currentPeriodEndSec),
          price_id: priceId,
        };

        log("upsert subscriptions (checkout)", payload);

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(payload, { onConflict: "stripe_subscription_id" });

        if (error) {
          log("supabase upsert error (checkout)", error);
          return NextResponse.json(
            { error: `Supabase upsert failed: ${error.message}` },
            { status: 500 }
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // En deleted puede venir DeletedSubscription (y faltar campos)
        const stripeSub = event.data.object as any;

        const stripeSubscriptionId = stripeSub?.id ?? null;
        const stripeCustomerId =
          typeof stripeSub?.customer === "string" ? stripeSub.customer : null;

        const status = stripeSub?.status ?? null;
        const currentPeriodEndSec = stripeSub?.current_period_end ?? null;

        const priceId =
          stripeSub?.items?.data?.[0]?.price?.id ??
          stripeSub?.plan?.id ??
          null;

        const payload = {
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status,
          current_period_end: toISOFromUnixSeconds(currentPeriodEndSec),
          price_id: priceId,
        };

        log(`subscription event: ${event.type}`, payload);

        if (!stripeSubscriptionId) break;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(payload, { onConflict: "stripe_subscription_id" });

        if (error) {
          log("supabase upsert error (subscription event)", error);
          return NextResponse.json(
            { error: `Supabase upsert failed: ${error.message}` },
            { status: 500 }
          );
        }

        break;
      }

      default:
        // No hacemos nada
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    console.error("[stripe-webhook] fatal", e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
