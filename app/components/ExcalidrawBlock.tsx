"use client";

import React, { useMemo, memo } from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="h-[380px] w-full bg-[#1e3d33] animate-pulse rounded-xl" />,
  }
);

const ExcalidrawBlock = memo(({ sceneJSON }: { sceneJSON: string }) => {
  const sceneData = useMemo(() => {
    try {
      const raw = sceneJSON.trim();
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1) return null;

      const parsed = JSON.parse(raw.slice(start, end + 1));
      // ✅ Extraemos elementos con fallback para evitar el error de tipado
      const elements = parsed.elements || (Array.isArray(parsed) ? parsed : []);

      return {
        elements: elements,
        appState: { 
          viewModeEnabled: true, 
          zenModeEnabled: true, 
          theme: "dark", 
          viewBackgroundColor: "#1e3d33",
          activeTool: { type: "selection" },
          isLoading: false
        },
      };
    } catch (e) {
      return null;
    }
  }, [sceneJSON]);

  // Si no hay datos válidos, no renderizamos nada para evitar el cuadro blanco
  if (!sceneData || !sceneData.elements.length) return null;

  return (
    <div className="my-8 w-full overflow-hidden rounded-[20px] border-[10px] border-[#5d4037] bg-[#5d4037] shadow-2xl">
      <div className="h-7 bg-black/20 flex items-center px-4">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Pizarra VonuAI</span>
      </div>

      <div className="h-[380px] w-full bg-[#1e3d33] relative">
        <Excalidraw 
          // @ts-ignore - ✅ Esto forzará a TypeScript a ignorar el error de la línea roja
          initialData={sceneData as any} 
          viewModeEnabled 
          zenModeEnabled 
          theme="dark"
        />
      </div>

      <div className="h-3 bg-[#4e342e] border-t border-black/20 flex items-center px-10">
        <div className="w-8 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
});

export default ExcalidrawBlock;