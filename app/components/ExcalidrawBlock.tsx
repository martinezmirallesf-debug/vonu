"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// Import dinámico (evita SSR + reduce parpadeos raros)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

type Props = {
  sceneJSON: string;
  className?: string;
  height?: number; // por si quieres cambiarlo
};

function safeParseScene(raw: string): any | null {
  try {
    let s = (raw || "").trim();

    // Si viene con ```json o ```excalidraw, lo limpiamos
    s = s.replace(/^```[a-zA-Z0-9_-]*\n/, "");
    s = s.replace(/\n```$/, "");
    s = s.trim();

    if (!s) return null;

    const parsed = JSON.parse(s);

    // Excalidraw suele venir como { elements, appState, files }
    // o como objeto exportado con "type": "excalidraw"
    return parsed;
  } catch {
    return null;
  }
}

export default function ExcalidrawBlock({ sceneJSON, className, height = 380 }: Props) {
  const parsed = useMemo(() => safeParseScene(sceneJSON), [sceneJSON]);

  // Solo montamos Excalidraw cuando hay data válida (evita “flash”)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, [parsed]);

  const initialData = useMemo(() => {
    if (!parsed) return null;

    const elements = Array.isArray(parsed.elements) ? parsed.elements : [];
    const files = parsed.files && typeof parsed.files === "object" ? parsed.files : {};

    const appStateFromJson =
      parsed.appState && typeof parsed.appState === "object" ? parsed.appState : {};

    // ✅ IMPORTANTE: “pisamos” lo raro que puede venir del JSON y rompe el tamaño/zoom
    const appState = {
      ...appStateFromJson,
      viewModeEnabled: true,
      zenModeEnabled: true,
      gridSize: null,
      theme: "dark",
      // Estos 3 son CLAVE para que no se vuelva loco con “scroll/zoom”
      scrollX: 0,
      scrollY: 0,
      zoom: { value: 1 },
      // ✅ fondo oscuro estable (evita blanco/negro)
      viewBackgroundColor: "#0b0f0d",
    };

    return { elements, appState, files };
  }, [parsed]);

  if (!parsed) {
    // Fallback si el JSON está roto (no lo ocultamos para que puedas detectarlo)
    return (
      <div className={className ?? ""}>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] text-zinc-700">
          ⚠️ No se pudo leer el dibujo (JSON inválido).
        </div>
      </div>
    );
  }

  return (
    <div className={className ?? ""}>
      <div
        className="rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{
          height,
          background: "#0b0f0d",
        }}
      >
        {/* ✅ wrapper con altura real (esto evita el canvas gigante 33554432) */}
        <div className="h-full w-full" style={{ position: "relative" }}>
          {ready && initialData ? (
            <Excalidraw
              initialData={initialData}
              viewModeEnabled={true}
              zenModeEnabled={true}
              theme="dark"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-[12px] text-zinc-400">
              Cargando pizarra…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
