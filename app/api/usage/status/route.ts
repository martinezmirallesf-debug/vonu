// app/api/usage/status/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getBearer(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function GET(req: Request) {
  try {
    const token = getBearer(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase env vars" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = getCurrentMonth();

    let { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from("usage")
        .insert({
          user_id: user.id,
          month,
          messages_used: 0,
          realtime_seconds: 0,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      usage = newUsage;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const planId = profile?.plan || "free";

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError) {
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }

    const messagesLimit = plan?.messages_limit ?? 20;
    const realtimeSecondsLimit = plan?.realtime_seconds_limit ?? 0;

    return NextResponse.json({
      usage: {
        plan_id: planId,
        messages_used: usage?.messages_used ?? 0,
        messages_limit: messagesLimit,
        messages_left: Math.max(0, messagesLimit - (usage?.messages_used ?? 0)),
        realtime_seconds_used: usage?.realtime_seconds ?? 0,
        realtime_seconds_limit: realtimeSecondsLimit,
        realtime_seconds_left: Math.max(
          0,
          realtimeSecondsLimit - (usage?.realtime_seconds ?? 0)
        ),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}