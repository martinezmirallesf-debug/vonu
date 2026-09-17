import { NextRequest, NextResponse } from "next/server";

const DEVICE_COOKIE = "vonu_device_id_v2";
const LEGACY_DEVICE_COOKIE = "vonu_device_id";
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

function cookieDomainFor(hostname: string) {
  return hostname === "vonuai.com" || hostname.endsWith(".vonuai.com") ? "vonuai.com" : undefined;
}

function withDeviceCookie(
  response: NextResponse,
  deviceId: string,
  shouldSet: boolean,
  hostname: string,
) {
  if (shouldSet) {
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
      domain: cookieDomainFor(hostname),
    });
  }
  return response;
}

export function middleware(req: NextRequest) {
  const preferredCookieId = req.cookies.get(DEVICE_COOKIE)?.value ?? null;
  const legacyCookieId = req.cookies.get(LEGACY_DEVICE_COOKIE)?.value ?? null;
  const suppliedId = req.headers.get(DEVICE_HEADER);
  const existingId = isUuid(preferredCookieId)
    ? preferredCookieId
    : isUuid(legacyCookieId)
      ? legacyCookieId
      : isUuid(suppliedId)
        ? suppliedId
        : null;
  const deviceId = existingId || crypto.randomUUID();
  const shouldSetCookie = preferredCookieId !== deviceId;

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
    return withDeviceCookie(response, deviceId, shouldSetCookie, req.nextUrl.hostname);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return withDeviceCookie(response, deviceId, shouldSetCookie, req.nextUrl.hostname);
}

export const config = {
  matcher: [
    "/check",
    "/es/check",
    "/en/check",
    "/fr/check",
    "/de/check",
    "/ar/check",
    "/api/check/:path*",
    "/api/stripe/checkout",
  ],
};
