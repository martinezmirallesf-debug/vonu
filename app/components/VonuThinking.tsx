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

        {/* núcleo */}
        <span className="absolute inset-[6px] rounded-full bg-white shadow-[0_0_0_1px_rgba(37,99,235,0.10)]" />

        {/* símbolo Vonu */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-[15px] font-semibold text-blue-600 leading-none tracking-[-0.02em]">
            ()
          </span>
        </span>
      </div>
    </div>
  );
}