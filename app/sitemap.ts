import type { MetadataRoute } from "next";

const BASE_URL = "https://vonuai.com";
const UPDATED_AT = new Date("2026-09-14T00:00:00.000Z");

const localizedCheckRoutes = ["es", "en", "fr", "de", "ar"].map((locale) => ({
  url: `${BASE_URL}/${locale}/check`,
  lastModified: UPDATED_AT,
  changeFrequency: "weekly" as const,
  priority: 1,
}));

const coreRoutes = [
  { path: "/producto", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/casos-de-uso", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/como-funciona", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/precios", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/recursos", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contacto", priority: 0.55, changeFrequency: "yearly" as const },

  { path: "/comprobar-web-fiable", priority: 0.95, changeFrequency: "monthly" as const },
  { path: "/comprobar-tienda-online", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/analizar-link-sospechoso", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/analizar-captura-pantalla", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/analizar-sms-estafa", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/email-sospechoso-estafa", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/detectar-perfil-falso", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/comprobar-inversion-estafa", priority: 0.8, changeFrequency: "monthly" as const },

  { path: "/legal/aviso-legal", priority: 0.25, changeFrequency: "yearly" as const },
  { path: "/legal/privacidad", priority: 0.25, changeFrequency: "yearly" as const },
  { path: "/legal/terminos", priority: 0.25, changeFrequency: "yearly" as const },
  { path: "/legal/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/legal/uso-responsable", priority: 0.35, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localizedCheckRoutes,
    ...coreRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      lastModified: UPDATED_AT,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  ];
}
