import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supported = new Set(["es", "en", "fr", "de", "ar"]);

function preferredLocale(header: string | null) {
  if (!header) return "en";

  const candidates = header
    .split(",")
    .map((part) => {
      const [tagPart, ...params] = part.trim().split(";");
      const tag = tagPart.toLowerCase();
      const qParam = params.find((item) => item.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const candidate of candidates) {
    const base = candidate.tag.split("-")[0];
    if (supported.has(base)) return base;
  }

  return "en";
}

export async function GET(request: NextRequest) {
  const locale = preferredLocale(request.headers.get("accept-language"));
  const destination = request.nextUrl.clone();
  destination.pathname = `/${locale}/check`;

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Vary", "Accept-Language");
  return response;
}
