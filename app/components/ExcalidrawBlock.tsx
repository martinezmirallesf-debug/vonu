"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

// Import dinámico (Excalidraw no debe renderizarse en SSR)
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, { ssr: false });

type Props = {
  sceneJSON?: string; // ✅ soporta sceneJSON
  value?: string;     // ✅ y soporta value (por si algún sitio lo llama así)
  className?: string;
};

function safeJsonParse(input: string): any | null {
  try {
    const trimmed = (input || "").trim();
    if (!trimmed) return null;
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export default function ExcalidrawBlock({ sceneJSON, value, className }: Props) {
  const raw = (sceneJSON ?? value ?? "").trim();

  const parsed = useMemo(() => safeJsonParse(raw), [raw]);

  const initialData = useMemo(() => {
    if (!parsed) return null;

    const elements = Array.isArray(parsed?.elements)
      ? parsed.elements
      : Array.isArray(parsed)
      ? parsed
      : [];

    const appState = typeof parsed?.appState === "object" && parsed.appState ? parsed.appState : {};

    return {
      elements,
      appState: {
        viewBackgroundColor: "#0b0f0d",
        zenModeEnabled: true,
        gridSize: null,
        ...appState,
      },
      scrollToContent: true,
    } as any;
  }, [parsed]);

  return (
    <div className={className ?? ""}>
      <div
        className="rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{
          background: "linear-gradient(135deg, rgba(107,86,60,0.90), rgba(78,62,44,0.95))",
          padding: 10,
        }}
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/85 backdrop-blur-xl border-b border-white/20">
          <div className="text-[12px] font-semibold text-zinc-900">✍️ Pizarra (Excalidraw)</div>
          <div className="text-[11px] text-zinc-600">solo lectura</div>
        </div>

        <div
          className="rounded-[18px] border border-white/10 overflow-hidden"
          style={{
            backgroundColor: "#0b0f0d",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 18px 40px rgba(0,0,0,0.45)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "26px 26px, 38px 38px",
            backgroundPosition: "0 0, 13px 19px",
          }}
        >
          <div style={{ height: 380 }}>
            {initialData ? (
              <Excalidraw
                initialData={initialData}
                viewModeEnabled={true}
                zenModeEnabled={true}
                gridModeEnabled={false}
                theme="dark"
              />
            ) : (
              <div className="p-4 text-[12.5px] text-white/80">
                No se pudo leer el JSON de Excalidraw.
                <br />
                Asegúrate de que el bloque <b>```excalidraw```</b> contenga un JSON válido con <code>elements</code>.
                <div className="mt-3 text-white/60 break-words whitespace-pre-wrap">{raw.slice(0, 600)}</div>
              </div>
            )}
          </div>

          <div className="px-3 pb-3">
            <div
              className="h-6 rounded-full border border-white/10"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.35))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 18px rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
