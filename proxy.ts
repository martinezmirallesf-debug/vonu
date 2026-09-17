import { NextRequest, NextResponse } from "next/server";

const supported = new Set(["es", "en", "fr", "de", "ar"]);
const localizedSpanishPaths = new Set([
  "/producto",
  "/casos-de-uso",
  "/recursos",
  "/precios",
  "/como-funciona",
  "/contacto",
  "/comprobar-web-fiable",
  "/comprobar-tienda-online",
  "/analizar-link-sospechoso",
  "/analizar-captura-pantalla",
  "/analizar-sms-estafa",
  "/email-sospechoso-estafa",
  "/detectar-perfil-falso",
  "/comprobar-inversion-estafa",
  "/revisar-contrato",
  "/revisar-contrato-alquiler",
  "/comprobar-factura",
  "/detectar-manipulacion",
  "/estafas-criptomonedas",
  "/llamada-banco-codigo-sms",
  "/es-fiable",
]);

const crawlerPattern = /(bot|crawler|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|semrush|ahrefs)/i;

function preferredLocale(header: string | null) {
  if (!header) return "es";

  const candidates = header
    .split(",")
    .map((part) => {
      const [tagPart, ...params] = part.trim().split(";");
      const tag = tagPart.toLowerCase();
      const qParam = params.find((item) => item.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { base: tag.split("-")[0], q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const candidate of candidates) {
    if (supported.has(candidate.base)) return candidate.base;
  }

  return "es";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!localizedSpanishPaths.has(pathname)) return NextResponse.next();

  // Search crawlers must always receive the stable Spanish canonical instead of
  // locale-adaptive redirects. Hreflang + sitemap expose the other languages.
  if (crawlerPattern.test(request.headers.get("user-agent") || "")) {
    return NextResponse.next();
  }

  const stored = request.cookies.get("vonu_locale")?.value?.toLowerCase();
  const locale = stored && supported.has(stored)
    ? stored
    : preferredLocale(request.headers.get("accept-language"));

  if (locale === "es") {
    const response = NextResponse.next();
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  const destination = request.nextUrl.clone();
  destination.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(destination, 307);
  response.cookies.set("vonu_locale", locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  matcher: [
    "/producto",
    "/casos-de-uso",
    "/recursos",
    "/precios",
    "/como-funciona",
    "/contacto",
    "/comprobar-web-fiable",
    "/comprobar-tienda-online",
    "/analizar-link-sospechoso",
    "/analizar-captura-pantalla",
    "/analizar-sms-estafa",
    "/email-sospechoso-estafa",
    "/detectar-perfil-falso",
    "/comprobar-inversion-estafa",
    "/revisar-contrato",
    "/revisar-contrato-alquiler",
    "/comprobar-factura",
    "/detectar-manipulacion",
    "/estafas-criptomonedas",
    "/llamada-banco-codigo-sms",
    "/es-fiable",
  ],
};
