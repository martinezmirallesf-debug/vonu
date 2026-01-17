"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Architects_Daughter } from "next/font/google";

const chalkFont = Architects_Daughter({
  subsets: ["latin"],
  weight: "400",
});

export default function ChalkboardPretty({
  text,
  title = "🧑‍🏫 Pizarra",
  height = 380,
  speedMs = 95,
}: {
  text: string;
  title?: string;
  height?: number;
  speedMs?: number;
}) {
  const lines = useMemo(() => {
    return (text || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.replace(/\s+$/g, "")); // no toca espacios internos
  }, [text]);

  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const total = lines.length || 0;
    if (!total) return;

    const fast = total > 14 ? Math.max(45, Math.floor(speedMs * 0.65)) : speedMs;

    const t = setInterval(() => {
      setShown((s) => {
        const next = Math.min(total, s + 1);
        if (next >= total) clearInterval(t);
        return next;
      });
    }, fast);

    return () => clearInterval(t);
  }, [lines, speedMs]);

  return (
    <div className="my-3 w-full">
      {/* Marco */}
      <div
        className="relative rounded-[26px] overflow-hidden shadow-[0_26px_80px_rgba(0,0,0,0.22)] border border-zinc-200"
        style={{ height }}
      >
        {/* “Madera”/marco interior */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-[26px] border-[10px] border-[#5b3a2e] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08)]" />
          <div className="absolute inset-0 rounded-[26px] border-[2px] border-[#2d1b18]/60" />
        </div>

        {/* Barra superior */}
        <div className="absolute top-0 left-0 right-0 z-[3] h-10 px-4 flex items-center justify-between">
          <div className="text-[11px] font-semibold text-white/85 tracking-wide drop-shadow">
            {title}
          </div>
          <div className="text-[11px] text-white/60">solo lectura</div>
        </div>

        {/* Fondo pizarra (imagen realista + mancha) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#0b2f27",
            backgroundImage: `
              url('/boards/chalkboard-classic.webp'),
              radial-gradient(ellipse at 20% 18%, rgba(255,255,255,0.08), transparent 46%),
              radial-gradient(ellipse at 70% 62%, rgba(255,255,255,0.06), transparent 55%)
            `,
            backgroundSize: "cover, cover, cover",
            backgroundPosition: "center, center, center",
            filter: "saturate(1.05) contrast(1.03)",
          }}
        />

        {/* “Polvo” de tiza por encima (muy sutil) */}
        <div
          className="absolute inset-0 opacity-[0.22] mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0",
          }}
        />

        {/* Texto tiza */}
        <div className="absolute inset-0 z-[2] pt-12 pb-8 px-7">
          <div
            className={`${chalkFont.className} h-full overflow-hidden`}
            style={{
              color: "rgba(248,250,252,0.92)",
              fontSize: 24,
              lineHeight: 1.35,
              letterSpacing: "0.2px",
              textShadow:
                "0 0 0.6px rgba(255,255,255,0.55), 0 2px 10px rgba(0,0,0,0.28)",
              WebkitFontSmoothing: "antialiased",
              transform: "translateZ(0)",
            }}
          >
            {lines.slice(0, shown).map((l, i) => (
              <div
                key={`${i}-${l.slice(0, 10)}`}
                className="whitespace-pre-wrap break-words"
                style={{
                  opacity: 0.98,
                  filter: "drop-shadow(0 0 0.35px rgba(255,255,255,0.35))",
                  animation: "chalkLineIn 220ms ease-out both",
                  // micro “imperfección” para que no parezca computadora:
                  transform: `translateX(${(i % 3) - 1}px)`,
                }}
              >
                {l || " "}
              </div>
            ))}

            {/* “Tiza” al final mientras escribe */}
            {shown < lines.length ? (
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 18,
                  marginLeft: 4,
                  background: "rgba(248,250,252,0.85)",
                  borderRadius: 2,
                  transform: "translateY(3px)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.15)",
                }}
              />
            ) : null}
          </div>
        </div>

        {/* “Posatizas” */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] h-9">
          <div className="absolute left-0 right-0 bottom-0 h-9 bg-[#3b2620]/80 backdrop-blur-[1px]" />
          <div className="absolute left-5 bottom-[10px] h-[6px] w-24 rounded-full bg-white/18" />
          <div className="absolute right-6 bottom-[10px] h-[8px] w-12 rounded-full bg-white/12" />
        </div>
      </div>

      {/* Animación */}
      <style jsx global>{`
        @keyframes chalkLineIn {
          from {
            opacity: 0;
            transform: translateY(2px);
            filter: blur(0.35px);
          }
          to {
            opacity: 0.98;
            transform: translateY(0px);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  );
}
