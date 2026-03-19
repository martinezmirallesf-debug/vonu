import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = getCurrentMonth();

    let { data: usage } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (!usage) {
      const { data: newUsage } = await supabase
        .from("usage")
        .insert({
          user_id: user.id,
          month,
          messages_used: 0,
          realtime_seconds: 0,
        })
        .select()
        .single();

      usage = newUsage;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const planId = profile?.plan || "free";

    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    const messagesLimit = plan?.messages_limit ?? 20;

    return NextResponse.json({
      usage: {
        plan_id: planId,
        messages_used: usage?.messages_used ?? 0,
        messages_limit: messagesLimit,
        messages_left: Math.max(0, messagesLimit - (usage?.messages_used ?? 0)),
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}