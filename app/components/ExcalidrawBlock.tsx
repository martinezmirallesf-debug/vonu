"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

// Excalidraw debe ir sin SSR
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

function isNumber(n: any) {
  return typeof n === "number" && Number.isFinite(n);
}

// Normaliza y recoloca todo para que SIEMPRE sea visible
function normalizeElements(raw: any[]): any[] {
  if (!Array.isArray(raw)) return [];

  const MAX_ELEMS = 120;

  // 1) filtrar basura
  const cleaned = raw
    .filter((el) => el && typeof el === "object")
    .filter((el) => typeof el.type === "string")
    .filter((el) => !el.isDeleted)
    .slice(0, MAX_ELEMS)
    .map((el) => {
      const x = isNumber(el.x) ? el.x : 0;
      const y = isNumber(el.y) ? el.y : 0;
      const width = isNumber(el.width) && el.width > 0 ? el.width : 260;
      const height = isNumber(el.height) && el.height > 0 ? el.height : 48;

      return { ...el, x, y, width, height };
    });

  if (!cleaned.length) return [];

  // 2) calcular bounding box y trasladar a zona visible
  let minX = Infinity,
    minY = Infinity;

  for (const el of cleaned) {
    if (isNumber(el.x)) minX = Math.min(minX, el.x);
    if (isNumber(el.y)) minY = Math.min(minY, el.y);
  }

  // margen de seguridad dentro del viewport
  const OFFSET_X = 80;
  const OFFSET_Y = 90;

  const tx = isFinite(minX) ? OFFSET_X - minX : 0;
  const ty = isFinite(minY) ? OFFSET_Y - minY : 0;

  return cleaned.map((el) => ({
    ...el,
    x: (isNumber(el.x) ? el.x : 0) + tx,
    y: (isNumber(el.y) ? el.y : 0) + ty,
  }));
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  const initialData = useMemo(() => {
    if (!parsed) return null;

    // soporta:
    // - { elements:[...], appState:{...} }
    // - { type:"excalidraw", elements:[...], appState:{...} }
    // - [ ...elements ]
    const rawElements = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.elements)
      ? parsed.elements
      : [];

    let elements = normalizeElements(rawElements);

    // DEBUG visible si llega vacío
    if (!elements.length) {
      elements = [
        {
          id: "debug-1",
          type: "text",
          x: 80,
          y: 90,
          width: 520,
          height: 40,
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
          text: "⚠️ DEBUG: JSON ok, pero no hay elements visibles.",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: "⚠️ DEBUG: JSON ok, pero no hay elements visibles.",
          lineHeight: 1.25,
        },
      ];
    }

    const appState =
      typeof parsed?.appState === "object" && parsed.appState ? parsed.appState : {};

    // OJO: primero metemos appState del JSON y DESPUÉS forzamos lo nuestro
    return {
      elements,
      appState: {
        ...appState,

        viewBackgroundColor: "#0b0f0d",
        zenModeEnabled: true,
        gridSize: null,

        // blindaje anti “me manda fuera”
        scrollX: 0,
        scrollY: 0,
        zoom: { value: 1 },
      },
      scrollToContent: true,
    } as any;
  }, [parsed]);

  return (
    <div className={className ?? ""}>
      {/* ✅ fuerza CSS: el canvas NO puede ponerse gigante */}
      <style jsx global>{`
        .vonu-excalidraw-wrap .excalidraw,
        .vonu-excalidraw-wrap .excalidraw__container,
        .vonu-excalidraw-wrap .excalidraw__canvas-wrapper {
          height: 100% !important;
        }
        .vonu-excalidraw-wrap canvas.excalidraw__canvas {
          height: 100% !important;
          max-height: 100% !important;
        }
      `}</style>

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
          <div className="vonu-excalidraw-wrap" style={{ height: 380 }}>
            {initialData ? (
              <div style={{ height: "100%", width: "100%" }}>
                <Excalidraw
                  initialData={initialData}
                  viewModeEnabled={true}
                  zenModeEnabled={true}
                  gridModeEnabled={false}
                  theme="dark"
                />
              </div>
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
