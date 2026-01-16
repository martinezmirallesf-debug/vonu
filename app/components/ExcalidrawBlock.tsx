"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

type Props = {
  sceneJSON: string;
};

export default function ExcalidrawBlock({ sceneJSON }: Props) {
  const mountedRef = useRef(false);
  const [initialData, setInitialData] = useState<any | null>(null);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    try {
      const parsed = JSON.parse(sceneJSON);
      if (!parsed || !parsed.elements) return;

      setInitialData({
        elements: parsed.elements,
        appState: {
          viewBackgroundColor: "#0b0f0d",
          zenModeEnabled: true,
          gridSize: null,
          scrollX: 0,
          scrollY: 0,
          zoom: { value: 1 },
        },
      });
    } catch (e) {
      console.error("Invalid Excalidraw JSON", e);
    }
  }, [sceneJSON]);

  if (!initialData) {
    return (
      <div className="h-[380px] rounded-[18px] bg-[#0b0f0d] flex items-center justify-center text-white/60 text-sm">
        Cargando pizarra…
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full overflow-hidden rounded-[18px] bg-[#0b0f0d]">
      <Excalidraw
        initialData={initialData}
        viewModeEnabled
        zenModeEnabled
        gridModeEnabled={false}
        theme="dark"
      />
    </div>
  );
}
