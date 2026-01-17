"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  value: string;
  onOpenCanvas?: () => void;
};

function normalizeBoardText(value: string) {
  return (value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function WhiteboardBlock({ value, onOpenCanvas }: Props) {
  const [open, setOpen] = useState(false);

  const text = useMemo(() => normalizeBoardText(value), [value]);

  // (Opcional) cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="my-3 rounded-2xl border border-zinc-200 overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-200 bg-white">
        <div className="text-[12px] font-semibold text-zinc-900">📋 Pizarra</div>

        <button
          onClick={() => {
            setOpen(true);
            onOpenCanvas?.();
          }}
          className="h-8 px-3 rounded-full bg-black hover:bg-zinc-900 text-white text-[12px] font-semibold"
        >
          Abrir pizarra
        </button>
      </div>

      {/* preview compacta */}
      <div className="px-4 py-3 text-[12.5px] text-zinc-600 bg-zinc-50">
        (Pulsa <b>Abrir pizarra</b> para ver la explicación en la pizarra)
      </div>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-[95]">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute inset-0 p-3 md:p-6 flex items-center justify-center">
            <div
              className="relative w-full max-w-6xl rounded-[24px] overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.45)] border border-white/10"
              style={{
                // ✅ ratio aproximado 2350x1500 -> 1.566
                aspectRatio: "2350 / 1500",
                maxHeight: "86vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* fondo imagen (tu pizarra) */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/boards/chalkboard-classic.webp)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              {/* overlay para que el texto se lea mejor (muy sutil) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(1200px 600px at 50% 45%, rgba(0,0,0,0.10), rgba(0,0,0,0.35))",
                }}
              />

              {/* contenido */}
              <div className="relative h-full w-full">
                {/* botón cerrar */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 h-10 px-4 rounded-full bg-white/90 hover:bg-white text-zinc-900 text-[12px] font-semibold border border-black/10 backdrop-blur-xl"
                >
                  Cerrar
                </button>

                {/* texto “tiza” */}
                <div
                  className="absolute inset-0"
                  style={{
                    padding: "7.5% 7%",
                    color: "rgba(246,250,246,0.92)",
                    fontFamily:
                      '"Chalkboard SE","Bradley Hand","Segoe Print","Comic Sans MS",ui-sans-serif,system-ui',
                    fontSize: "clamp(14px, 1.25vw, 22px)",
                    lineHeight: 1.45,
                    whiteSpace: "pre-wrap",
                    textShadow: "0 0 1px rgba(255,255,255,0.20)",
                    filter: "drop-shadow(0px 0px 0.6px rgba(255,255,255,0.25))",
                  }}
                >
                  {text || " "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
