"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

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

    // A veces viene con ``` o texto alrededor; intentamos extraer el primer { ... }
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const maybe = trimmed.slice(firstBrace, lastBrace + 1);
      return JSON.parse(maybe);
    }

    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function clamp(n: any, min: number, max: number) {
  const v = typeof n === "number" && isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, v));
}

function normalizeElements(raw: any[]): any[] {
  if (!Array.isArray(raw)) return [];

  const MAX = 2000; // coords máximas razonables
  const MAX_W = 1200;
  const MAX_H = 800;

  // Limpieza básica
  const cleaned = raw
    .filter((el) => el && typeof el === "object")
    .filter((el) => typeof el.type === "string")
    .filter((el) => !el.isDeleted);

  // Recolocamos en “stack” visible
  return cleaned.slice(0, 120).map((el, i) => {
    const w = clamp(el.width, 80, MAX_W);
    const h = clamp(el.height, 20, MAX_H);

    // ignoramos coords del JSON si son raras
    const safeX = 60;
    const safeY = 80 + i * 36;

    // Si el elemento es tipo flecha/linea puede necesitar puntos; no tocamos demás props
    return {
      ...el,
      x: clamp(safeX, -MAX, MAX),
      y: clamp(safeY, -MAX, MAX),
      width: w,
      height: h,
    };
  });
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  const debugRaw = useMemo(() => {
    const s = (sceneJSON || "").trim();
    return s.length > 1600 ? s.slice(0, 1600) + "\n…(cortado)" : s;
  }, [sceneJSON]);

  const initialData = useMemo(() => {
    if (!parsed) return null;

    const rawElements = Array.isArray(parsed?.elements) ? parsed.elements : [];
    let elements = normalizeElements(rawElements);

    // DEBUG VISIBLE si no vienen elements
    if (!elements.length) {
      elements = [
        {
          id: "debug-1",
          type: "text",
          x: 60,
          y: 80,
          width: 560,
          height: 40,
          angle: 0,
          strokeColor: "#e9efe9",
          backgroundColor: "transparent",
          fillStyle: "solid",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 0,
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
          text: "⚠️ DEBUG: llega JSON pero NO hay elements[]",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: "⚠️ DEBUG: llega JSON pero NO hay elements[]",
          lineHeight: 1.25,
        },
      ];
    }

    // IMPORTANTÍSIMO:
    // - NO usamos appState del JSON (puede traer scrollX/scrollY/zoom raros)
    // - NO usamos scrollToContent (es lo que suele provocar canvas gigante si hay coords absurdas)
    return {
      elements,
      appState: {
        viewBackgroundColor: "#0b0f0d",
        zenModeEnabled: true,
        gridSize: null,
        scrollX: 0,
        scrollY: 0,
        zoom: { value: 1 },
      },
      // ❌ NO scrollToContent
      // scrollToContent: true,
    } as any;
  }, [parsed]);

  return (
    <div className={className ?? ""}>
      <div
        className="rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(107,86,60,0.90), rgba(78,62,44,0.95))",
          padding: 10,
        }}
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/85 backdrop-blur-xl border-b border-white/20">
          <div className="text-[12px] font-semibold text-zinc-900">
            ✍️ Pizarra (Excalidraw)
          </div>
          <div className="text-[11px] text-zinc-600">solo lectura</div>
        </div>

        <div
          className="rounded-[18px] border border-white/10 overflow-hidden"
          style={{
            backgroundColor: "#0b0f0d",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 18px 40px rgba(0,0,0,0.45)",
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
                <div className="font-semibold mb-2">
                  No se pudo leer el JSON de Excalidraw.
                </div>

                <div className="mb-2">
                  Copia lo que hay dentro del bloque{" "}
                  <code>```excalidraw```</code>:
                </div>

                <pre className="mt-2 p-3 rounded-xl bg-black/40 overflow-auto text-[11px] leading-relaxed border border-white/10">
                  {debugRaw || "(vacío)"}
                </pre>
              </div>
            )}
          </div>

          <div className="px-3 pb-3">
            <div
              className="h-6 rounded-full border border-white/10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.35))",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 18px rgba(0,0,0,0.25)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
