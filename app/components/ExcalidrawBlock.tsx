"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
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

  const MAX_W = 1200;
  const MAX_H = 800;

  const cleaned = raw
    .filter((el) => el && typeof el === "object")
    .filter((el) => typeof el.type === "string")
    .filter((el) => !el.isDeleted);

  return cleaned.slice(0, 120).map((el, i) => {
    // Recolocamos en stack visible SIEMPRE (evitamos coords raras)
    const safeX = 60;
    const safeY = 80 + i * 36;

    return {
      ...el,
      x: safeX,
      y: safeY,
      width: clamp(el.width, 80, MAX_W),
      height: clamp(el.height, 20, MAX_H),
    };
  });
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const parsed = useMemo(() => safeJsonParse(sceneJSON), [sceneJSON]);

  const elements = useMemo(() => {
    const rawElements = Array.isArray(parsed?.elements) ? parsed.elements : [];
    const norm = normalizeElements(rawElements);

    // Si viniera vacío, metemos algo para comprobar que pinta
    if (!norm.length) {
      return [
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
          text: "⚠️ DEBUG: llega JSON pero elements[] vacío",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 18,
          containerId: null,
          originalText: "⚠️ DEBUG: llega JSON pero elements[] vacío",
          lineHeight: 1.25,
        },
      ];
    }

    return norm;
  }, [parsed]);

  const [api, setApi] = useState<any>(null);
  const didInitRef = useRef(false);

  // ✅ CLAVE: en vez de dejar que Excalidraw calcule el “infinite canvas” con initialData,
  // le metemos la escena y forzamos vista/zoom DESPUÉS de montar.
  useEffect(() => {
    if (!api) return;
    if (didInitRef.current) return;

    didInitRef.current = true;

    try {
      api.updateScene({ elements });

      // 🔥 Forzamos un estado “sano”
      api.updateScene({
        appState: {
          viewBackgroundColor: "#0b0f0d",
          zenModeEnabled: true,
          gridSize: null,
          scrollX: 0,
          scrollY: 0,
          zoom: { value: 1 },
        },
      });

      // ✅ centramos SOLO en un marco seguro (sin infinito)
      // Ojo: scrollToContent a veces es el detonante si hay bounds raros,
      // pero como YA recolocamos todo, aquí sí es seguro:
      setTimeout(() => {
        try {
          api.scrollToContent?.(api.getSceneElements?.(), { fitToViewport: true });
        } catch {}
      }, 50);
    } catch {}
  }, [api, elements]);

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

        {/* ✅ SUPER IMPORTANTE: recortar cualquier cosa gigante */}
        <div
          className="rounded-[18px] border border-white/10 overflow-hidden"
          style={{
            height: 380,
            backgroundColor: "#0b0f0d",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 18px 40px rgba(0,0,0,0.45)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "26px 26px, 38px 38px",
            backgroundPosition: "0 0, 13px 19px",
          }}
        >
          {parsed ? (
            <Excalidraw
              excalidrawAPI={(x: any) => setApi(x)}
              viewModeEnabled={true}
              zenModeEnabled={true}
              gridModeEnabled={false}
              theme="dark"
            />
          ) : (
            <div className="p-4 text-[12.5px] text-white/80">
              No se pudo leer el JSON de Excalidraw.
            </div>
          )}
        </div>

        <div className="px-3 pb-3 pt-3">
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
  );
}
