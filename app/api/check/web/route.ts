import { NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPLICIT_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const locale = typeof body?.locale === "string" && isSupportedLocale(body.locale)
      ? body.locale
      : "es";

    if (!url || url.length > 2048) {
      return NextResponse.json({ error: "invalid_url" }, { status: 400 });
    }

    if (EXPLICIT_SCHEME.test(url) && !/^https?:/i.test(url)) {
      throw new Error("unsupported_protocol");
    }

    const baseResult = await collectWebSignals(url, locale);
    const result = await enrichWebResult(baseResult);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "check_failed";
    const clientErrors = new Set([
      "empty_url",
      "unsupported_protocol",
      "credentials_not_allowed",
      "private_target",
      "dns_not_found",
      "too_many_redirects",
      "unsupported_redirect",
    ]);

    return NextResponse.json(
      { error: clientErrors.has(code) ? code : "check_failed" },
      { status: clientErrors.has(code) ? 422 : 500, headers: { "cache-control": "no-store" } },
    );
  }
}
