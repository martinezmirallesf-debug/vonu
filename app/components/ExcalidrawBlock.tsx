"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Import dinámico para evitar líos de SSR/hidratación
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full rounded-[18px] bg-[#0b0f0d] flex items-center justify-center text-white/60 text-sm">
      Cargando pizarra…
    </div>
  ),
});

type Props = {
  sceneJSON: string; // contenido del ```excalidraw ... ```
  className?: string;
  height?: number; // por defecto 380
};

function safeParseScene(sceneJSON: string) {
  try {
    const raw = (sceneJSON || "").trim();
    if (!raw) return null;

    // A veces viene envuelto tipo: { "type":"excalidraw", "elements":[...], "appState":{...} }
    const parsed = JSON.parse(raw);

    // Aceptamos varios formatos
    const elements = Array.isArray(parsed?.elements) ? parsed.elements : Array.isArray(parsed) ? parsed : null;
    const appState = parsed?.appState && typeof parsed.appState === "object" ? parsed.appState : {};

    if (!elements) return null;

    // ✅ Forzamos defaults “pizarra bonita”
    const forcedAppState = {
      ...appState,
      viewModeEnabled: true, // solo lectura
      zenModeEnabled: true,
      gridSize: null,
      theme: "dark",
      // Fondo pizarra (si no lo pones, a veces queda gris/negro raro)
      viewBackgroundColor: "#0b0f0d",
      scrollX: 0,
      scrollY: 0,
      zoom: { value: 1 },
    };

    return {
      elements,
      appState: forcedAppState,
      files: parsed?.files && typeof parsed.files === "object" ? parsed.files : {},
    };
  } catch {
    return null;
  }
}

export default function ExcalidrawBlock({ sceneJSON, className, height = 380 }: Props) {
  // ✅ Parseamos una vez por cambio de string
  const parsed = useMemo(() => safeParseScene(sceneJSON), [sceneJSON]);

  // ✅ Guardamos el último scene válido para que NO vuelva a blanco
  const lastValidRef = useRef<ReturnType<typeof safeParseScene> | null>(null);
  if (parsed) lastValidRef.current = parsed;

  const stableScene = lastValidRef.current;

  // ✅ Montaje estable: si no hay scene válido, no montamos Excalidraw
  // (montarlo con null y luego setear es el origen típico del “flash blanco”)
  if (!stableScene) {
    return (
      <div className={className ?? ""}>
        <div
          className="rounded-[18px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
          style={{ height }}
        >
          <div className="h-full w-full bg-[#0b0f0d] flex items-center justify-center text-white/60 text-sm px-4 text-center">
            No se pudo cargar la pizarra (JSON inválido).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className ?? ""}>
      <div
        className="rounded-[18px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{ height }}
      >
        <div className="h-full w-full">
          <Excalidraw
            initialData={stableScene}
            viewModeEnabled
            zenModeEnabled
            gridModeEnabled={false}
            theme="dark"
            // ✅ IMPORTANTÍSIMO: Excalidraw necesita altura REAL del padre
            
          />
        </div>
      </div>
    </div>
  );
}
