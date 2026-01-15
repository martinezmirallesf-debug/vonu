"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Excalidraw no puede renderizar en SSR
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

    // A veces llegan fences o backticks accidentales: los quitamos si viniesen
    const cleaned = trimmed
      .replace(/^```[a-zA-Z0-9_-]*\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function isFiniteNumber(n: any) {
  return typeof n === "number" && Number.isFinite(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sanitizePoints(points: any, MAX: number) {
  if (!Array.isArray(points) || points.length < 2) {
    return [
      [0, 0],
      [120, 0],
    ];
  }

  const fixed = points
    .filter((p) => Array.isArray(p) && p.length >= 2)
    .map((p) => {
      const x = isFiniteNumber(p[0]) ? clamp(p[0], -MAX, MAX) : 0;
      const y = isFiniteNumber(p[1]) ? clamp(p[1], -MAX, MAX) : 0;
      return [x, y];
    });

  if (fixed.length < 2) {
    return [
      [0, 0],
      [120, 0],
    ];
  }
  return fixed;
}

// Normaliza elementos para que Excalidraw NO calcule un “contenido infinito”
// (que es lo que te está creando el canvas 33 millones px)
function normalizeElements(raw: any[]): any[] {
  if (!Array.isArray(raw)) return [];

  const MAX_POS = 1200; // límites razonables
  const MAX_W = 1400;
  const MAX_H = 900;

  const cleaned = raw
    .filter((el) => el && typeof el === "object")
    .filter((el) => typeof el.type === "string")
    .filter((el) => !el.isDeleted)
    .slice(0, 120) // limita cantidad por seguridad
    .map((el, i) => {
      // x/y
      const x0 = isFiniteNumber(el.x) ? clamp(el.x, -MAX_POS, MAX_POS) : 0;
      const y0 = isFiniteNumber(el.y) ? clamp(el.y, -MAX_POS, MAX_POS) : 0;

      // width/height
      const w0 = isFiniteNumber(el.width) ? clamp(el.width, 20, MAX_W) : 300;
      const h0 = isFiniteNumber(el.height) ? clamp(el.height, 20, MAX_H) : 60;

      // puntos (líneas, flechas, free draw, etc.)
      const hasPoints = Array.isArray(el.points);
      const points = hasPoints ? sanitizePoints(el.points, MAX_POS) : undefined;

      // recolocación en “stack” visible para evitar que algo quede fuera
      const safeX = 60;
      const safeY = 70 + i * 36;

      const out: any = {
        ...el,
        x: safeX,
        y: safeY,
        width: w0,
        height: h0,
      };

      if (hasPoints) out.points = points;

      // si trae coords raras en boundElements, frameId, etc no pasa nada
      // lo importante es x/y/points/size en rango.

      return out;
    });

  return cleaned;
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  // 1) Parsear JSON
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  // 2) Montar SOLO cuando el contenedor tenga tamaño real
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      // necesitamos ancho real para evitar cálculos raros en Excalidraw
      if (r.width > 240) setReady(true);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 3) Preparar initialData SIEMPRE “limpio”
  const initialData = useMemo(() => {
    if (!parsed) return null;

    const rawElements = Array.isArray(parsed?.elements) ? parsed.elements : [];
    let elements = normalizeElements(rawElements);

    // Debug visible si llegan 0 elementos
    if (!elements.length) {
      elements = [
        {
          id: "debug-1",
          type: "text",
          x: 60,
          y: 90,
          width: 520,
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
          text: "⚠️ DEBUG: JSON leído, pero elements venía vacío.",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: "⚠️ DEBUG: JSON leído, pero elements venía vacío.",
          lineHeight: 1.25,
        },
      ];
    }

    const incomingAppState =
      typeof parsed?.appState === "object" && parsed.appState ? parsed.appState : {};

    // IMPORTANTE:
    // - metemos primero lo que venga del JSON
    // - y DESPUÉS pisamos con valores seguros (para que no nos cuelen scroll/zoom basura)
    const safeAppState = {
      ...incomingAppState,
      viewBackgroundColor: "#0b0f0d",
      zenModeEnabled: true,
      gridSize: null,
      // valores seguros (pisan lo anterior)
      scrollX: 0,
      scrollY: 0,
      zoom: { value: 1 },
    };

    return {
      elements,
      appState: safeAppState,
      // MUY IMPORTANTE: esto es lo que suele disparar “canvas infinito” si el contenido está raro
      // Lo dejamos en false y ya tienes el stack visible.
      scrollToContent: false,
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
          {/* contenedor medible */}
          <div ref={wrapRef} style={{ height: 380, width: "100%" }}>
            {initialData && ready ? (
              <>
                {/* FIX CSS: aunque Excalidraw intente pintar enorme, lo recortamos SIEMPRE */}
                <style jsx>{`
                  :global(.excalidraw__canvas-wrapper) {
                    height: 380px !important;
                    max-height: 380px !important;
                    overflow: hidden !important;
                  }
                  :global(canvas.excalidraw__canvas) {
                    max-height: 380px !important;
                  }
                `}</style>

                <Excalidraw
                  initialData={initialData}
                  viewModeEnabled={true}
                  zenModeEnabled={true}
                  gridModeEnabled={false}
                  theme="dark"
                />
              </>
            ) : (
              <div className="p-4 text-[12.5px] text-white/80">
                {parsed ? "Cargando pizarra…" : "No se pudo leer el JSON de Excalidraw."}
                <br />
                <span className="text-white/70">
                  Asegúrate de que el bloque <code>```excalidraw```</code> contenga un JSON válido con <code>elements</code>.
                </span>
              </div>
            )}
          </div>

          {/* Posatizas */}
          <div className="px-3 pb-3 pt-3">
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
