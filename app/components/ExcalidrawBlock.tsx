"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function ExcalidrawBlock({ sceneJSON }: { sceneJSON: string }) {
  const initialData = useMemo(() => {
    try {
      const parsed = JSON.parse(sceneJSON);

      // Excalidraw suele esperar { elements, appState, files }
      if (!parsed || typeof parsed !== "object") {
        return { elements: [], appState: { viewBackgroundColor: "#0b0f0d" }, files: {} };
      }

      // si te llega solo "elements", lo adaptamos
      if (Array.isArray((parsed as any).elements)) {
        return {
          elements: (parsed as any).elements,
          appState: (parsed as any).appState ?? { viewBackgroundColor: "#0b0f0d" },
          files: (parsed as any).files ?? {},
        };
      }

      return parsed;
    } catch {
      return { elements: [], appState: { viewBackgroundColor: "#0b0f0d" }, files: {} };
    }
  }, [sceneJSON]);

  return (
    <div className="my-3 rounded-[26px] overflow-hidden border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
      <div className="px-3 py-2 bg-white/85 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between">
        <div className="text-[12px] font-semibold text-zinc-900">🧑‍🏫 Pizarra</div>
        <div className="text-[11px] text-zinc-600">diagrama</div>
      </div>

      <div className="h-[360px] bg-[#0b0f0d]">
        <Excalidraw
          initialData={initialData as any}
          viewModeEnabled={true}
          zenModeEnabled={true}
          gridModeEnabled={false}
          theme="dark"
        />
      </div>
    </div>
  );
}
