import { NextRequest, NextResponse } from "next/server";

const DEVICE_COOKIE = "vonu_device_id";
const DEVICE_HEADER = "x-vonu-device-id";
const ONE_YEAR = 60 * 60 * 24 * 365;
const METERED_CHECK_PATHS = new Map([
  ["/api/check/web", "web"],
  ["/api/check/image", "image"],
  ["/api/check/text", "text"],
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

export function middleware(req: NextRequest) {
  const cookieId = req.cookies.get(DEVICE_COOKIE)?.value ?? null;
  const suppliedId = req.headers.get(DEVICE_HEADER);
  const existingId = isUuid(cookieId) ? cookieId : isUuid(suppliedId) ? suppliedId : null;
  const deviceId = existingId || crypto.randomUUID();
  const shouldSetCookie = cookieId !== deviceId;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(DEVICE_HEADER, deviceId);

  const target = METERED_CHECK_PATHS.get(req.nextUrl.pathname);
  if (req.method === "POST" && target) {
    const meteredUrl = req.nextUrl.clone();
    meteredUrl.pathname = "/api/check/metered";
    meteredUrl.search = "";
    meteredUrl.searchParams.set("target", target);

    const response = NextResponse.rewrite(meteredUrl, {
      request: { headers: requestHeaders },
    });
    return withDeviceCookie(response, deviceId, shouldSetCookie);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withDeviceCookie(response, deviceId, shouldSetCookie);
}

export const config = {
  matcher: ["/api/check/:path*", "/api/stripe/checkout"],
};
