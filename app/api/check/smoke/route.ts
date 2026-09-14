import { NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const base = await collectWebSignals("https://bbva.es", "es");
  const result = await enrichWebResult(base);
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
