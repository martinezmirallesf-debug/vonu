// app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { getUserFromRequest } from "@/app/lib/authServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: error ?? "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const sbAdmin = getSupabaseAdmin();

    const { data: profile, error: pErr } = await sbAdmin
      .from("profiles")
      .select("stripe_customer_id,email")
      .eq("id", user.id)
      .maybeSingle();

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const created = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });

      customerId = created.id;

      await sbAdmin
        .from("profiles")
        .upsert(
          { id: user.id, stripe_customer_id: customerId, email: user.email ?? profile?.email ?? null },
          { onConflict: "id" }
        );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/`,
    });

    return NextResponse.json({ url: portal.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Portal error" }, { status: 500 });
  }
}
