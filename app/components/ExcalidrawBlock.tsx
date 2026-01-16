"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

// ✅ Import dinámico para evitar SSR/hydration flicker
const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false }
);

type Props = {
  sceneJSON: string; // viene del markdown ```excalidraw ... ```
};

function safeParse(json: string): any | null {
  try {
    const t = (json || "").trim();
    if (!t) return null;
    return JSON.parse(t);
  } catch {
    return null;
  }
}

export default function ExcalidrawBlock({ sceneJSON }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ Parse UNA vez por cambio real de texto
  const parsed = useMemo(() => safeParse(sceneJSON), [sceneJSON]);

  // ✅ Guardamos initialData en state para que NO se regenere cada render
  const [initialData, setInitialData] = useState<any | null>(null);

  useEffect(() => {
    if (!parsed) {
      setInitialData(null);
      return;
    }

    // Excalidraw espera { elements, appState, files }
    const next = {
      elements: Array.isArray(parsed.elements) ? parsed.elements : [],
      appState: {
        viewBackgroundColor: "#0b0f0d",
        ...((parsed.appState && typeof parsed.appState === "object") ? parsed.appState : {}),
      },
      files: (parsed.files && typeof parsed.files === "object") ? parsed.files : {},
    };

    setInitialData(next);
  }, [parsed]);

  // ✅ Key estable: solo cambia si cambia el JSON
  const stableKey = useMemo(() => {
    const s = (sceneJSON || "").trim();
    if (!s) return "excalidraw-empty";
    // hash simple (suficiente para key)
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return `excalidraw-${h}`;
  }, [sceneJSON]);

  return (
    <div className="my-2 rounded-2xl border border-zinc-200 overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-200 bg-white">
        <div className="text-[12px] font-semibold text-zinc-900">🧑‍🏫 Pizarra (Excalidraw)</div>
        <div className="text-[12px] text-zinc-500">solo lectura</div>
      </div>

      {/* ✅ Altura ESTABLE para que Excalidraw no mida infinito */}
      <div
        className="w-full"
        style={{
          height: 420,
          backgroundColor: "#0b0f0d",
        }}
      >
        {!mounted ? null : !initialData ? (
          <div className="h-full w-full grid place-items-center text-[12px] text-white/70">
            Cargando pizarra…
          </div>
        ) : (
          <div className="h-full w-full" key={stableKey}>
            <Excalidraw
              initialData={initialData}
              viewModeEnabled
              zenModeEnabled
              gridModeEnabled={false}
              theme="dark"
              
            />
          </div>
        )}
      </div>
    </div>
  );
}
