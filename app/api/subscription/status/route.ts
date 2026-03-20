// app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/authServer";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        {
          active: false,
          plan: "free",
          subscription_status: null,
          current_period_end: null,
          cancel_at_period_end: false,
        },
        { status: 200 }
      );
    }

    const sbAdmin = getSupabaseAdmin();

    const { data: profile, error: profileErr } = await sbAdmin
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }

    const { data: sub, error: subErr } = await sbAdmin
      .from("subscriptions")
      .select("status,current_period_end,cancel_at_period_end")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subErr) {
      return NextResponse.json({ error: subErr.message }, { status: 500 });
    }

    const plan = profile?.plan || "free";
    const subscriptionStatus = sub?.status ?? null;
    const active =
      plan !== "free" &&
      (subscriptionStatus === "active" || subscriptionStatus === "trialing");

    return NextResponse.json(
      {
        active,
        plan,
        subscription_status: subscriptionStatus,
        current_period_end: sub?.current_period_end ?? null,
        cancel_at_period_end: sub?.cancel_at_period_end ?? false,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}