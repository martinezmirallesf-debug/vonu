"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full rounded-[18px] bg-[#1e3d33] flex items-center justify-center text-white/60 text-sm">
      Cargando pizarra…
    </div>
  ),
});

type Props = {
  sceneJSON: string;
  className?: string;
  height?: number;
};

function safeParseScene(sceneJSON: string) {
  try {
    const raw = (sceneJSON || "").trim();
    if (!raw) return null;
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const jsonStr = (start !== -1 && end !== -1) ? raw.slice(start, end + 1) : raw;
    const parsed = JSON.parse(jsonStr);
    const elements = Array.isArray(parsed?.elements) ? parsed.elements : Array.isArray(parsed) ? parsed : null;
    if (!elements) return null;

    return {
      elements: elements.map((el: any) => ({ ...el, roughness: 1.2 })),
      appState: {
        viewModeEnabled: true,
        zenModeEnabled: true,
        theme: "dark",
        viewBackgroundColor: "#1e3d33", // Verde pizarra
        scrollX: 0,
        scrollY: 0,
        zoom: { value: 1 },
      },
    };
  } catch { return null; }
}

export default function ExcalidrawBlock({ sceneJSON, className, height = 380 }: Props) {
  const parsed = useMemo(() => safeParseScene(sceneJSON), [sceneJSON]);
  const lastValidRef = useRef<any>(null);
  if (parsed) lastValidRef.current = parsed;
  const stableScene = lastValidRef.current;

  return (
    <div className={`my-4 ${className ?? ""}`}>
      {/* Marco de madera */}
      <div className="rounded-[20px] border-[10px] border-[#5d4037] shadow-2xl bg-[#5d4037] overflow-hidden">
        <div className="h-[25px] bg-black/10 flex items-center px-4 text-[10px] text-white/40 uppercase tracking-widest">
          VonuAI Pizarra Escolar
        </div>
        
        <div style={{ height }} className="relative bg-[#1e3d33]">
          {stableScene ? (
            <Excalidraw 
              initialData={stableScene} 
              viewModeEnabled 
              zenModeEnabled 
              theme="dark" 
            />
          ) : (
            <div className="h-full flex items-center justify-center text-white/40 text-xs px-10 text-center">
              Esperando que el tutor termine de dibujar...
            </div>
          )}
        </div>

        {/* Repisa de tizas */}
        <div className="h-4 bg-[#4e342e] border-t border-black/20 flex items-center px-8 gap-4">
          <div className="w-6 h-1.5 bg-white/60 rounded-full rotate-2"></div>
          <div className="w-4 h-1.5 bg-blue-300/40 rounded-full -rotate-1"></div>
        </div>
      </div>
    </div>
  );
}