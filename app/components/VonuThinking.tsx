"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 22 }: VonuThinkingProps) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/logo/vonu-cube-black.png?v=1"
        alt="Vonu"
        className="block h-full w-full object-contain vonu-thinking-logo"
        draggable={false}
      />
    </div>
  );
}