"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 24 }: VonuThinkingProps) {
  return (
    <div
      className="relative shrink-0 vonu-dotmark-wrap"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 vonu-dotmark-base" />
      <span className="absolute inset-0 vonu-dotmark-fill" />
    </div>
  );
}