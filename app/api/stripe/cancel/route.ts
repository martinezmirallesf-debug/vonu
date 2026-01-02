// app/api/stripe/cancel/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req);
    if (!token) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Falta STRIPE_SECRET_KEY en el servidor." }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Faltan variables de Supabase en el servidor." }, { status: 500 });
    }

    // Cliente admin (service role) para validar usuario y leer perfil
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verificar usuario a partir del access token
    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user?.id) {
      return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
    }

    const userId = userRes.user.id;

    // Buscar stripe_customer_id en profiles
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .maybeSingle();

    if (profErr) {
      return NextResponse.json({ error: "No se pudo leer el perfil." }, { status: 500 });
    }

    const customerId = profile?.stripe_customer_id as string | null;
    if (!customerId) {
      // No hay customer asociado => no hay nada que cancelar
      return NextResponse.json({ ok: true, message: "No tienes una suscripción activa." }, { status: 200 });
    }

    // Stripe (sin apiVersion para evitar errores de typings según versión instalada)
    const stripe = new Stripe(stripeSecretKey);

    // Buscar suscripción activa / trial / etc.
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 20,
    });

    const active = subs.data.find((s) => ["active", "trialing", "past_due", "unpaid"].includes(s.status));

    if (!active) {
      return NextResponse.json({ ok: true, message: "No tienes una suscripción activa." }, { status: 200 });
    }

    // Cancelación transparente: al final del periodo
    const updated = await stripe.subscriptions.update(active.id, {
      cancel_at_period_end: true,
    });

    // Si tu versión de types no expone current_period_end, lo leemos “seguro”
    const currentPeriodEnd = (updated as any)?.current_period_end ?? null;

    return NextResponse.json(
      {
        ok: true,
        subscriptionId: updated.id,
        status: updated.status,
        cancel_at_period_end: updated.cancel_at_period_end,
        current_period_end: currentPeriodEnd,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error cancelando suscripción." }, { status: 500 });
  }
}
