import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isUuid(value: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(req: NextRequest) {
  const deviceId = req.headers.get("x-vonu-device-id");
  if (!isUuid(deviceId)) {
    return NextResponse.json({ error: "device_id_missing" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("get_vonu_device_entitlement", {
    p_device_id: deviceId,
  });

  if (error) {
    return NextResponse.json({ error: "entitlement_unavailable" }, { status: 503 });
  }

  const row = Array.isArray(data) ? data[0] : data;
  const snapshot = {
    free_used: !!row?.free_used,
    credits_remaining: Number(row?.credits_remaining ?? 0),
    lifetime_analyses: Number(row?.lifetime_analyses ?? 0),
  };

  console.info("[vonu-entitlement]", {
    device: deviceId!.slice(0, 8),
    freeUsed: snapshot.free_used,
    creditsRemaining: snapshot.credits_remaining,
    lifetimeAnalyses: snapshot.lifetime_analyses,
  });

  return NextResponse.json(snapshot);
}
