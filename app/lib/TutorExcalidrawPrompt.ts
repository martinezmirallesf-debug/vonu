"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

// Excalidraw no debe renderizarse en SSR
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, { ssr: false });

type Props = {
  sceneJSON: string;
  className?: string;
};

function safeJsonParse(input: string): any | null {
  try {
    const t = (input || "").trim();
    if (!t) return null;
    return JSON.parse(t);
  } catch {
    return null;
  }
}

const MAX_ABS = 2000; // coords seguras
const MAX_POINT = 2500; // para points internos (line/arrow/freedraw)
const MAX_W = 1400;
const MAX_H = 900;

function clampNum(n: any, min: number, max: number, fallback: number) {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(min, Math.min(max, v));
}

function safeString(x: any, fallback = "") {
  return typeof x === "string" ? x : fallback;
}

function sanitizePoints(points: any): [number, number][] | null {
  if (!Array.isArray(points) || points.length === 0) return null;

  const out: [number, number][] = [];
  for (const p of points) {
    if (!Array.isArray(p) || p.length < 2) continue;
    const px = clampNum(p[0], -MAX_POINT, MAX_POINT, 0);
    const py = clampNum(p[1], -MAX_POINT, MAX_POINT, 0);
    out.push([px, py]);
  }

  // Si se quedó sin puntos, mejor null
  return out.length ? out : null;
}

function sanitizeElement(el: any, i: number) {
  if (!el || typeof el !== "object") return null;

  const type = safeString(el.type, "");
  if (!type) return null;
  if (el.isDeleted) return null;

  // base coords/tamaño
  const x = clampNum(el.x, -MAX_ABS, MAX_ABS, 60);
  const y = clampNum(el.y, -MAX_ABS, MAX_ABS, 80 + i * 36);

  const width = clampNum(el.width, 20, MAX_W, 300);
  const height = clampNum(el.height, 20, MAX_H, 28);

  // ⚠️ clave: en elementos lineales, los "points" pueden ser gigantes aunque x/y no
  let points = el.points;
  if (type === "line" || type === "arrow" || type === "freedraw") {
    const sp = sanitizePoints(el.points);
    points = sp ?? [[0, 0], [120, 0]];
  }

  // limpieza de bindings que pueden generar bounds raros
  const cleaned = {
    ...el,
    x,
    y,
    width,
    height,
    // quitamos cosas que suelen romper bounds si vienen mal
    boundElements: null,
    containerId: null,
    frameId: null,
    startBinding: null,
    endBinding: null,
    points,
  };

  // asegura mínimos en texto
  if (type === "text") {
    cleaned.text = safeString(el.text, "");
    cleaned.originalText = safeString(el.originalText, cleaned.text);
    cleaned.fontSize = clampNum(el.fontSize, 10, 64, 20);
    cleaned.lineHeight = typeof el.lineHeight === "number" ? el.lineHeight : 1.25;
  }

  return cleaned;
}

function sanitizeScene(parsed: any) {
  const rawElements = Array.isArray(parsed?.elements) ? parsed.elements : [];
  const safeElements = rawElements
    .slice(0, 120)
    .map((el: any, i: number) => sanitizeElement(el, i))
    .filter(Boolean);

  // Si llega vacío, metemos un debug visible sí o sí
  const elements =
    safeElements.length > 0
      ? (safeElements as any[])
      : [
          {
            id: "debug-1",
            type: "text",
            x: 60,
            y: 90,
            width: 720,
            height: 36,
            angle: 0,
            strokeColor: "#e9efe9",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            groupIds: [],
            roundness: null,
            seed: 1,
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            boundElements: null,
            updated: 1,
            link: null,
            locked: true,
            text: "⚠️ DEBUG: El JSON llegó pero no hay elementos válidos para dibujar.",
            fontSize: 20,
            fontFamily: 1,
            textAlign: "left",
            verticalAlign: "top",
            baseline: 18,
            containerId: null,
            originalText: "⚠️ DEBUG: El JSON llegó pero no hay elementos válidos para dibujar.",
            lineHeight: 1.25,
          },
        ];

  // appState: IMPORTANTE -> primero lo del JSON y DESPUÉS forzamos lo seguro (para que no lo pise)
  const appStateFromJson = typeof parsed?.appState === "object" && parsed.appState ? parsed.appState : {};

  const appState = {
    ...appStateFromJson,
    viewBackgroundColor: "#0b0f0d",
    zenModeEnabled: true,
    gridSize: null,

    // ✅ estos SIEMPRE al final para ganar
    scrollX: 0,
    scrollY: 0,
    zoom: { value: 1 },
  };

  return { elements, appState };
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  const initialData = useMemo(() => {
    if (!parsed) return null;
    return sanitizeScene(parsed);
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
              <Excalidraw initialData={initialData as any} viewModeEnabled={true} zenModeEnabled={true} gridModeEnabled={false} theme="dark" />
            ) : (
              <div className="p-4 text-[12.5px] text-white/80">
                No se pudo leer el JSON de Excalidraw.
                <br />
                Asegúrate de que el bloque <code>```excalidraw```</code> contenga un JSON válido con <code>elements</code>.
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
