"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 34 }: VonuThinkingProps) {
  return (
    <div className="flex items-center py-2">
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
            className="h-[20px] w-[20px] object-contain"
            draggable={false}
          />
        </span>
      </div>
    </div>
  );
}