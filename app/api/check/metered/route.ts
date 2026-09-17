import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { POST as checkWeb } from "../web/route";
import { POST as checkImage } from "../image/route";
import { POST as checkText } from "../text/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = new Set(["web", "image", "text"]);

function isUuid(value: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function reserve(deviceId: string, reservationId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("reserve_vonu_device_analysis", {
    p_device_id: deviceId,
    p_reservation_id: reservationId,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data[0] : data;
}

async function commit(reservationId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("commit_vonu_device_analysis", {
    p_reservation_id: reservationId,
  });
  if (error) throw new Error(error.message);
}

async function release(reservationId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("release_vonu_device_analysis", {
    p_reservation_id: reservationId,
  });
  if (error) throw new Error(error.message);
}

export async function POST(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("target") || "";
  const deviceId = req.headers.get("x-vonu-device-id");

  if (!TARGETS.has(target)) {
    return NextResponse.json({ error: "invalid_check_target" }, { status: 400 });
  }
  if (!isUuid(deviceId)) {
    return NextResponse.json({ error: "device_id_missing" }, { status: 400 });
  }

  const rawBody = await req.arrayBuffer();
  const reservationId = crypto.randomUUID();
  let access: any = null;

  try {
    access = await reserve(deviceId!, reservationId);
  } catch {
    return NextResponse.json({ error: "entitlement_unavailable" }, { status: 503 });
  }

  if (!access?.allowed) {
    return NextResponse.json(
      {
        error: "payment_required",
        offer: { analyses: 3, amount: 399, currency: "EUR" },
        credits_remaining: Number(access?.credits_remaining || 0),
      },
      { status: 402 },
    );
  }

  const headers = new Headers(req.headers);
  headers.set("content-type", req.headers.get("content-type") || "application/json");
  headers.set("x-vonu-access-source", String(access.access_source || "unknown"));
  headers.set("x-vonu-credits-remaining", String(access.credits_remaining ?? 0));
  headers.set("x-vonu-reservation-id", reservationId);

  const internalRequest = new NextRequest(new URL(`/api/check/${target}`, req.url), {
    method: "POST",
    headers,
    body: rawBody,
  });

  try {
    const response =
      target === "web"
        ? await checkWeb(internalRequest)
        : target === "image"
          ? await checkImage(internalRequest)
          : await checkText(internalRequest);

    const explicitlyNonBillable = response.headers.get("x-vonu-analysis-billable") === "0";

    if (response.ok && !explicitlyNonBillable) {
      try {
        await commit(reservationId);
      } catch (error) {
        console.error("[vonu-meter] failed to commit reservation", reservationId, error);
      }
      return response;
    }

    try {
      await release(reservationId);
    } catch (error) {
      console.error("[vonu-meter] failed to release reservation", reservationId, error);
    }
    return response;
  } catch (error) {
    try {
      await release(reservationId);
    } catch (releaseError) {
      console.error("[vonu-meter] failed to release thrown reservation", reservationId, releaseError);
    }
    console.error("[vonu-meter] analysis execution failed", target, error);
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }
}
