"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 32 }: VonuThinkingProps) {
  return (
    <div className="flex items-start py-2">
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
      >
        {/* halo exterior */}
        <span className="absolute inset-[-6px] rounded-full vonu-thinking-halo" />

        {/* aro girando */}
        <span className="absolute inset-[-1px] rounded-full vonu-thinking-ring" />

        <span className="absolute inset-0 flex items-center justify-center">
  <img
    src="/logo/vonu-cube-black.png"
    alt="Vonu"
    className="h-[18px] w-[18px] object-contain"
    draggable={false}
  />
</span>
      </div>
    </div>
  );
}