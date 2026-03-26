// app/layout.tsx
import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vonu — tu asistente para tomar decisiones seguras",
  description:
    "Analiza mensajes, enlaces y situaciones para decidir con calma. Vonu te ayuda a detectar riesgos y actuar de forma segura.",
  metadataBase: new URL("https://app.vonuai.com"),
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}