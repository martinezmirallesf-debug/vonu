import type { MetadataRoute } from "next";

const BASE_URL = "https://vonuai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/chat",
    "/producto",
    "/casos-de-uso",
    "/precios",
    "/como-funciona",
    "/recursos",
    "/contacto",
    "/analizar-sms-estafa",
    "/comprobar-web-fiable",
    "/revisar-contrato",
    "/comprobar-factura",
    "/comprobar-tienda-online",
    "/detectar-manipulacion",
    "/legal/aviso-legal",
    "/legal/privacidad",
    "/legal/terminos",
    "/legal/cookies",
    "/legal/uso-responsable",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/recursos" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/chat"
        ? 0.95
        : route === "/producto" || route === "/casos-de-uso"
        ? 0.85
        : route === "/recursos"
        ? 0.8
        : route.startsWith("/legal")
        ? 0.3
        : 0.75,
  }));
}