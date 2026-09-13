import { NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await collectWebSignals("https://example.com", "es");
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "smoke_failed" },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}
