// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function toISOFromUnixSeconds(sec?: number | null) {
  if (!sec) return null;
  return new Date(sec * 1000).toISOString();
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY in env");
  // ✅ Importante: NO fijamos apiVersion para evitar errores de types en build
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
    // ✅ Esto evita que el build “reviente” por envs: solo se valida al recibir request real
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET in env" },
        { status: 500 }
      );
    }

    const sig = (await headers()).get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const rawBody = await req.text();

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` },
        { status: 400 }
      );
    }

    // ✅ Creamos Supabase admin SOLO aquí (runtime), no al importar el módulo
    const supabaseAdmin = getSupabaseAdmin();

    // ---- Helpers de upsert ----
    async function upsertSubscriptionRow(params: {
      userId: string | null;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string;
      status: string | null;
      currentPeriodEndIso: string | null;
      priceId: string | null;
    }) {
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: params.userId,
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
          // No es suscripción (o no venía), ignoramos sin fallar
          return NextResponse.json({ ok: true, ignored: "no_subscription_in_session" });
        }

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        // 🟦 Esto será null hasta que metas metadata en el checkout (lo hacemos después)
        const userId = (session.metadata?.supabase_user_id as string) || null;

        // Recuperamos la subscripción real para sacar status/period_end/price_id
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        const currentPeriodEndIso = toISOFromUnixSeconds((sub as any).current_period_end ?? null);

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

        return NextResponse.json({ ok: true, event: event.type, userId, subscriptionId });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const stripeSubscriptionId = sub.id;
        const stripeCustomerId = typeof sub.customer === "string" ? sub.customer : null;

        const currentPeriodEndIso = toISOFromUnixSeconds((sub as any).current_period_end ?? null);

        const priceId =
          (sub.items?.data?.[0]?.price?.id as string | undefined) ?? null;

        // Aquí normalmente no tenemos userId si no lo guardas tú
        await upsertSubscriptionRow({
          userId: null,
          stripeCustomerId,
          stripeSubscriptionId,
          status: sub.status ?? null,
          currentPeriodEndIso,
          priceId,
        });

        return NextResponse.json({ ok: true, event: event.type, subscriptionId: stripeSubscriptionId });
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
