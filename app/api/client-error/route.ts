import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clean(value: unknown, max = 4000) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const payload = {
      message: clean(body?.message, 1200),
      stack: clean(body?.stack, 6000),
      path: clean(body?.path, 500),
      source: clean(body?.source, 1000),
      line: Number.isFinite(Number(body?.line)) ? Number(body.line) : null,
      column: Number.isFinite(Number(body?.column)) ? Number(body.column) : null,
      userAgent: clean(request.headers.get("user-agent"), 500),
    };

    console.error("[VONU_CLIENT_ERROR]", JSON.stringify(payload));
  } catch (error) {
    console.error("[VONU_CLIENT_ERROR_LOGGER_FAILED]", error);
  }

  return new NextResponse(null, { status: 204 });
}
