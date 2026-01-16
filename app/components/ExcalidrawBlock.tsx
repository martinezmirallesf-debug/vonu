"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

// Excalidraw dinámico para evitar SSR/hidratación rara
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-[26px] overflow-hidden border border-zinc-200 bg-[#0b0f0d] flex items-center justify-center text-white/60 text-sm">
      Cargando pizarra…
    </div>
  ),
});

type Props = {
  sceneJSON: string;
  className?: string;
};

// Intentamos extraer un JSON aunque venga con “ruido”
// (por ejemplo texto antes/después)
function extractJsonObject(raw: string) {
  const s = (raw || "").trim();
  if (!s) return null;

  // Caso ideal
  if (s.startsWith("{") && s.endsWith("}")) return s;

  // Busca el primer { y el último }
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a >= 0 && b > a) return s.slice(a, b + 1);

  return null;
}

function safeParseScene(raw: string): any | null {
  const candidate = extractJsonObject(raw);
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate);

    // Validación mínima: elementos o appState (dependiendo del formato)
    const elements = parsed?.elements;
    const appState = parsed?.appState;

    const hasElements = Array.isArray(elements);
    const hasSomeShape = !!appState || hasElements;

    if (!hasSomeShape) return null;

    // Sanitizamos appState para modo “solo lectura”
    const safeAppState = {
      viewModeEnabled: true,
      zenModeEnabled: true,
      gridSize: null,
      theme: "dark",
      ...appState,
    };

    return {
      ...parsed,
      appState: safeAppState,
      elements: hasElements ? elements : [],
      files: parsed?.files ?? {},
    };
  } catch {
    return null;
  }
}

export default function ExcalidrawBlock({ sceneJSON, className }: Props) {
  const apiRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const parsed = useMemo(() => safeParseScene(sceneJSON), [sceneJSON]);

  // Initial data solo la primera vez que haya JSON válido
  const initialData = useMemo(() => {
    if (!parsed) return null;
    return parsed;
  }, [parsed]);

  // Si el JSON cambia, actualizamos la escena sin desmontar
  useEffect(() => {
    if (!ready) return;
    if (!apiRef.current) return;
    if (!parsed) return;

    try {
      apiRef.current.updateScene({
        elements: parsed.elements ?? [],
        appState: parsed.appState ?? {},
        files: parsed.files ?? {},
      });
    } catch {
      // si algo falla, no rompemos UI
    }
  }, [ready, parsed]);

  // Si no hay JSON válido, mostramos placeholder estable (no blanco)
  if (!parsed) {
    return (
      <div className={className ?? ""}>
        <div className="h-[380px] rounded-[26px] overflow-hidden border border-zinc-200 bg-[#0b0f0d] flex items-center justify-center text-white/60 text-sm">
          Generando pizarra…
        </div>
      </div>
    );
  }

  return (
    <div className={className ?? ""}>
      <div className="rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
        <div className="h-[380px] bg-[#0b0f0d]">
          <Excalidraw
            initialData={initialData as any}
            excalidrawAPI={(api: any) => {
              apiRef.current = api;
              setReady(true);
            }}
            viewModeEnabled
            zenModeEnabled
            theme="dark"
            gridModeEnabled={false}
          />
        </div>
      </div>
    </div>
  );
}
