import { NextResponse } from "next/server";
import { collectWebSignals } from "@/lib/vonu-check/web-signals";
import { enrichWebResult } from "@/lib/vonu-check/web-enrichment";
import { isSupportedLocale } from "@/lib/vonu-check/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPLICIT_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function errorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { code: "check_failed", causeCode: "", causeMessage: "" };
  }

  const cause = error.cause && typeof error.cause === "object"
    ? error.cause as { code?: unknown; message?: unknown }
    : null;

  return {
    code: error.message || error.name || "check_failed",
    causeCode: cause?.code ? String(cause.code) : "",
    causeMessage: cause?.message ? String(cause.message) : "",
  };
}

function classifyFailure(error: unknown) {
  const { code, causeCode } = errorDetails(error);
  const normalized = code.toLowerCase();
  const normalizedCause = causeCode.toUpperCase();

  if (normalized.includes("invalid url") || normalized.includes("failed to parse url")) {
    return { error: "invalid_url", status: 422 };
  }

  if (
    normalized.includes("timeout") ||
    normalized.includes("timed out") ||
    normalized.includes("abort") ||
    normalizedCause === "ETIMEDOUT"
  ) {
    return { error: "target_timeout", status: 422 };
  }

  if (
    normalized === "fetch failed" ||
    ["ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ENETUNREACH", "EAI_AGAIN"].includes(normalizedCause)
  ) {
    return { error: "target_unreachable", status: 422 };
  }

  const clientErrors = new Set([
    "empty_url",
    "unsupported_protocol",
    "credentials_not_allowed",
    "private_target",
    "dns_not_found",
    "too_many_redirects",
    "unsupported_redirect",
  ]);

  if (clientErrors.has(code)) {
    return { error: code, status: 422 };
  }

  return { error: "check_failed", status: 500 };
}

export async function POST(request: Request) {
  let hostnameForLog = "unknown";

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

    try {
      const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      hostnameForLog = new URL(normalized).hostname || "unknown";
    } catch {
      // The main analyser will classify malformed URLs below.
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
    const details = errorDetails(error);
    const failure = classifyFailure(error);

    console.error("[vonu-check:web] analysis failed", {
      hostname: hostnameForLog,
      error: failure.error,
      code: details.code,
      causeCode: details.causeCode,
      causeMessage: details.causeMessage,
    });

    return NextResponse.json(
      { error: failure.error },
      { status: failure.status, headers: { "cache-control": "no-store" } },
    );
  }
}
