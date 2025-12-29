// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Vonu — tu asistente para tomar decisiones seguras",
  description:
    "Analiza mensajes, enlaces y situaciones para decidir con calma. Vonu te ayuda a detectar riesgos y actuar de forma segura.",
  metadataBase: new URL("https://app.vonuai.com"),
  icons: {
    icon: "/icon.png", // debe existir en /public/icon.png
    apple: "/apple-touch-icon.png", // opcional
  },
  openGraph: {
    title: "Vonu — tu asistente para tomar decisiones seguras",
    description:
      "Analiza mensajes, enlaces y situaciones para decidir con calma. Vonu te ayuda a detectar riesgos y actuar de forma segura.",
    url: "https://app.vonuai.com",
    siteName: "Vonu",
    type: "website",
    images: [{ url: "/icon.png" }],
  },
  twitter: {
    card: "summary",
    title: "Vonu — decisiones seguras",
    description:
      "Analiza mensajes, enlaces y situaciones para decidir con calma.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
