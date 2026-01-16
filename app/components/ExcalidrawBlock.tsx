"use client";

import React, { useMemo, useRef, memo } from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => <div className="h-[380px] w-full rounded-[18px] bg-[#1e3d33] animate-pulse" />,
});

// ✅ Usamos memo para que la pizarra NO se actualice por culpa del texto del chat
const ExcalidrawBlock = memo(({ sceneJSON, height = 380 }: { sceneJSON: string; height?: number }) => {
  const lastValidScene = useRef<any>(null);

  const scene = useMemo(() => {
    try {
      const raw = sceneJSON.trim();
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) return lastValidScene.current;

      const parsed = JSON.parse(raw.slice(start, end + 1));
      const elements = Array.isArray(parsed?.elements) ? parsed.elements : Array.isArray(parsed) ? parsed : null;

      if (elements) {
        lastValidScene.current = {
          elements: elements.map((el: any) => ({ ...el, roughness: 1.2 })),
          appState: { viewModeEnabled: true, zenModeEnabled: true, theme: "dark", viewBackgroundColor: "#1e3d33" },
        };
      }
      return lastValidScene.current;
    } catch {
      return lastValidScene.current;
    }
  }, [sceneJSON]);

  if (!scene) return null;

  return (
    <div className="my-6 rounded-[20px] border-[10px] border-[#5d4037] shadow-2xl overflow-hidden bg-[#5d4037]">
      <div className="h-6 bg-black/10 flex items-center px-4 text-[10px] text-white/40 uppercase tracking-widest">
        VONUAI PIZARRA ESCOLAR
      </div>
      <div style={{ height }} className="relative bg-[#1e3d33]">
        <Excalidraw initialData={scene} viewModeEnabled zenModeEnabled theme="dark" />
      </div>
      <div className="h-3 bg-[#4e342e] border-t border-black/20 flex items-center px-8 gap-4">
        <div className="w-6 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
});

export default ExcalidrawBlock;