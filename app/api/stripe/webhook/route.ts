// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toISOFromUnixSeconds(sec?: number | null) {
  if (!sec) return null;
  return new Date(sec * 1000).toISOString();
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY in env");
  // ✅ No fijamos apiVersion para evitar líos de types/build
  return new Stripe(key);
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in env");
  if (!service) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in env");

  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET in env" },
        { status: 500 }
      );
    }

    // ✅ FIX: headers() devuelve Promise en tu versión -> hay que await
    const sig = (await headers()).get("stripe-signature");
    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        {
          error: `Webhook signature verification failed: ${
            err?.message ?? "unknown"
          }`,
        },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ---- Helpers ----
    async function resolveUserIdFromCustomer(stripeCustomerId: string | null) {
      if (!stripeCustomerId) return null;

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", stripeCustomerId)
        .maybeSingle();

      if (error) return null;
      return (data?.id as string | undefined) ?? null;
    }

    async function getExistingUserIdBySubscription(stripeSubscriptionId: string) {
      const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", stripeSubscriptionId)
        .maybeSingle();

      if (error) return null;
      return (data?.user_id as string | null) ?? null;
    }

    async function upsertSubscriptionRow(params: {
      userId: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string;
      status: string | null;
      currentPeriodEndIso: string | null;
      priceId: string | null;
    }) {
      // ✅ Nunca machacamos user_id con null:
      // 1) si viene userId -> usamos ese
      // 2) si no viene, intentamos resolver por customer
      // 3) si tampoco, conservamos el existente (si lo hay)
      let userId = params.userId;

      if (!userId) {
        userId = await resolveUserIdFromCustomer(params.stripeCustomerId);
      }
      if (!userId) {
        userId = await getExistingUserIdBySubscription(params.stripeSubscriptionId);
      }

      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: userId, // 👈 ya NO será null si existía
            stripe_customer_id: params.stripeCustomerId,
            stripe_subscription_id: params.stripeSubscriptionId,
            status: params.status,
            current_period_end: params.currentPeriodEndIso,
            price_id: params.priceId,
          },
          { onConflict: "stripe_subscription_id" }
        );

      if (error) throw new Error(error.message);
    }

    // ---- Eventos ----
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;

        if (!subscriptionId) {
          return NextResponse.json({
            ok: true,
            ignored: "no_subscription_in_session",
          });
        }

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        // ✅ Aquí sí debe venir porque lo metes en /checkout
        const userId = (session.metadata?.supabase_user_id as string) || null;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        const currentPeriodEndIso = toISOFromUnixSeconds(
          (sub as any).current_period_end ?? null
        );
        const priceId =
          (sub.items?.data?.[0]?.price?.id as string | undefined) ?? null;

        await upsertSubscriptionRow({
          userId,
          stripeCustomerId,
          stripeSubscriptionId: subscriptionId,
          status: sub.status ?? null,
          currentPeriodEndIso,
          priceId,
        });

        return NextResponse.json({
          ok: true,
          event: event.type,
          userId,
          subscriptionId,
        });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const stripeSubscriptionId = sub.id;
        const stripeCustomerId =
          typeof sub.customer === "string" ? sub.customer : null;

        const currentPeriodEndIso = toISOFromUnixSeconds(
          (sub as any).current_period_end ?? null
        );
        const priceId =
          (sub.items?.data?.[0]?.price?.id as string | undefined) ?? null;

        await upsertSubscriptionRow({
          userId: null, // ✅ lo resolverá por customer o conservará el existente
          stripeCustomerId,
          stripeSubscriptionId,
          status: sub.status ?? null,
          currentPeriodEndIso,
          priceId,
        });

        return NextResponse.json({
          ok: true,
          event: event.type,
          subscriptionId: stripeSubscriptionId,
        });
      }

      default: {
        return NextResponse.json({ ok: true, ignored: event.type });
      }
    }
  } catch (e: any) {
    console.error("[webhook] fatal:", e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
