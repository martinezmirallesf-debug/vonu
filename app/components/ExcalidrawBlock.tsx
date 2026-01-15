"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

// Import dinámico (Excalidraw no debe renderizarse en SSR)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

type Props = {
  sceneJSON: string;
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

// Normaliza elementos para evitar canvas gigantes
function normalizeElements(raw: any[]): any[] {
  if (!Array.isArray(raw)) return [];

  const MAX_W = 1200;
  const MAX_H = 800;

  // 1) Filtra cosas raras
  const cleaned = raw
    .filter((el) => el && typeof el === "object")
    .filter((el) => typeof (el as any).type === "string")
    .filter((el) => !(el as any).isDeleted)
    .map((el: any) => {
      const x = typeof el.x === "number" ? el.x : 0;
      const y = typeof el.y === "number" ? el.y : 0;
      const width = typeof el.width === "number" ? el.width : 300;
      const height = typeof el.height === "number" ? el.height : 28;
      return { ...el, x, y, width, height };
    })
    // 2) Si trae coords gigantes, fuera
    .filter((el: any) => Math.abs(el.x) < 100000 && Math.abs(el.y) < 100000)
    .filter((el: any) => el.width > 0 && el.height > 0);

  // 3) Recoloca todo visible en vertical
  return cleaned.slice(0, 80).map((el: any, i: number) => {
    const safeX = 60;
    const safeY = 80 + i * 36;

    return {
      ...el,
      x: safeX,
      y: safeY,
      width: Math.min(Math.max(el.width || 300, 80), MAX_W),
      height: Math.min(Math.max(el.height || 28, 20), MAX_H),
    };
  });
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  const initialData = useMemo(() => {
    if (!parsed) return null;

    // Formatos soportados:
    // { type:"excalidraw", elements:[...], appState:{...} }
    // { elements:[...], appState:{...} }
    const rawElements = Array.isArray(parsed?.elements) ? parsed.elements : [];
    let elements = normalizeElements(rawElements);

    // ✅ Si no vienen elementos, ponemos 1 texto de debug
    if (!elements.length) {
      elements = [
        {
          id: "debug-1",
          type: "text",
          x: 60,
          y: 80,
          width: 720,
          height: 28,
          angle: 0,
          strokeColor: "#e9efe9",
          backgroundColor: "transparent",
          fillStyle: "solid",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          groupIds: [],
          frameId: null,
          roundness: null,
          seed: 1,
          version: 1,
          versionNonce: 1,
          isDeleted: false,
          boundElements: null,
          updated: Date.now(),
          link: null,
          locked: true,
          text: "⚠️ DEBUG: El JSON llegó, pero elements está vacío (o inválido).",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: "⚠️ DEBUG: El JSON llegó, pero elements está vacío (o inválido).",
          lineHeight: 1.25,
        },
      ];
    }

    const appState =
      typeof parsed?.appState === "object" && parsed.appState ? parsed.appState : {};

    return {
      elements,
      appState: {
        viewBackgroundColor: "#0b0f0d",
        zenModeEnabled: true,
        gridSize: null,

        // ✅ forzamos vista segura (aunque TS se queje, va como any)
        scrollX: 0,
        scrollY: 0,
        zoom: { value: 1 },

        // lo del JSON al final
        ...appState,
      },
      scrollToContent: true,
    } as any;
  }, [parsed]);

  return (
    <div className={className ?? ""}>
      {/* Marco madera */}
      <div
        className="rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{
          background: "linear-gradient(135deg, rgba(107,86,60,0.90), rgba(78,62,44,0.95))",
          padding: 10,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/85 backdrop-blur-xl border-b border-white/20">
          <div className="text-[12px] font-semibold text-zinc-900">✍️ Pizarra (Excalidraw)</div>
          <div className="text-[11px] text-zinc-600">solo lectura</div>
        </div>

        {/* Pizarra */}
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
                Asegúrate de que el bloque <code>```excalidraw```</code> contenga un JSON válido con <code>elements</code>.
              </div>
            )}
          </div>

          {/* Posatizas */}
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
