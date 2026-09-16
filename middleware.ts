import { NextRequest, NextResponse } from "next/server";

const DEVICE_COOKIE = "vonu_device_id";
const DEVICE_HEADER = "x-vonu-device-id";
const ONE_YEAR = 60 * 60 * 24 * 365;
const METERED_CHECK_PATHS = new Set([
  "/api/check/web",
  "/api/check/image",
  "/api/check/text",
]);

function isUuid(value: string | null | undefined) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function withDeviceCookie(response: NextResponse, deviceId: string, shouldSet: boolean) {
  if (shouldSet) {
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
    });
  }
  return response;
}

async function consumeAnalysis(deviceId: string) {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRole) throw new Error("device_entitlement_not_configured");

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_vonu_device_analysis`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
    },
    body: JSON.stringify({ p_device_id: deviceId }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("device_entitlement_failed");
  const rows = await response.json().catch(() => []);
  return Array.isArray(rows) ? rows[0] : null;
}

export async function middleware(req: NextRequest) {
  const cookieId = req.cookies.get(DEVICE_COOKIE)?.value ?? null;
  const suppliedId = req.headers.get(DEVICE_HEADER);
  const existingId = isUuid(cookieId) ? cookieId : isUuid(suppliedId) ? suppliedId : null;
  const deviceId = existingId || crypto.randomUUID();
  const shouldSetCookie = cookieId !== deviceId;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(DEVICE_HEADER, deviceId);

  if (req.method === "POST" && METERED_CHECK_PATHS.has(req.nextUrl.pathname)) {
    try {
      const access = await consumeAnalysis(deviceId);
      if (!access?.allowed) {
        return withDeviceCookie(
          NextResponse.json(
            {
              error: "payment_required",
              offer: { analyses: 3, amount: 399, currency: "EUR" },
              credits_remaining: Number(access?.credits_remaining || 0),
            },
            { status: 402 },
          ),
          deviceId,
          shouldSetCookie,
        );
      }

      requestHeaders.set("x-vonu-access-source", String(access.access_source || "unknown"));
      requestHeaders.set("x-vonu-credits-remaining", String(access.credits_remaining ?? 0));
    } catch {
      return withDeviceCookie(
        NextResponse.json({ error: "entitlement_unavailable" }, { status: 503 }),
        deviceId,
        shouldSetCookie,
      );
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withDeviceCookie(response, deviceId, shouldSetCookie);
}

export const config = {
  matcher: ["/api/check/:path*", "/api/stripe/checkout"],
};
