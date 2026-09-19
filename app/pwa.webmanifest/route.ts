const manifest = {
  id: "/vonu-app",
  name: "Vonu",
  short_name: "Vonu",
  description:
    "Analiza enlaces, capturas de pantalla y mensajes sospechosos antes de confiar, pagar o compartir datos.",
  start_url: "/es/check?source=pwa2",
  scope: "/",
  display: "standalone",
  orientation: "portrait-primary",
  background_color: "#020b24",
  theme_color: "#020b24",
  prefer_related_applications: false,
  categories: ["security", "utilities"],
  icons: [
    {
      src: "/api/icon?size=192&v=20260919-pwa6",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/api/icon?size=512&v=20260919-pwa6",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/api/icon?size=512&v=20260919-pwa6",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

export function GET() {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
