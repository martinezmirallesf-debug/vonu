"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 32 }: VonuThinkingProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-[-6px] rounded-full vonu-thinking-halo" />
        <span className="absolute inset-[-1px] rounded-full vonu-thinking-ring" />

        <span className="absolute inset-0 flex items-center justify-center vonu-thinking-logo">
          <img
            src="/logo/vonu-cube-black.png?v=3"
            alt="Vonu"
            className="h-[18px] w-[18px] object-contain"
            draggable={false}
          />
        </span>
      </div>

      <span className="font-mono text-[12px] text-zinc-400 tracking-[-0.01em]">
        Vonu está pensando...
      </span>
    </div>
  );
}