import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state") || "unknown";
  const controller = request.nextUrl.searchParams.get("controller") || "unknown";
  console.log("[vonu-pwa-diagnostic]", { state, controller });
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
