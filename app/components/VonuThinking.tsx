"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  return (
    <span
      className="vonu-thinking"
      style={
        {
          "--vonu-thinking-size": `${size}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="vonu-thinking-dot dot-a" />
      <span className="vonu-thinking-dot dot-b" />
      <span className="vonu-thinking-dot dot-c" />

      <style jsx>{`
        .vonu-thinking {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: calc(var(--vonu-thinking-size) * 1.75);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          gap: calc(var(--vonu-thinking-size) * 0.16);
          transform: translateZ(0);
          overflow: visible;
        }

        .vonu-thinking-dot {
          width: calc(var(--vonu-thinking-size) * 0.30);
          height: calc(var(--vonu-thinking-size) * 0.30);
          border-radius: 9999px;
          display: block;
          transform-origin: center;
          opacity: 0.9;
          filter:
            blur(0.05px)
            drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.18) rgba(59, 130, 246, 0.22));
          will-change: transform, opacity, background, filter;
          mix-blend-mode: multiply;
        }

        .dot-a {
          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.36) 22%,
              rgba(239, 68, 68, 0.86) 52%,
              rgba(239, 68, 68, 0.52) 100%
            );
          animation: vonuDotA 1850ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .dot-b {
          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.34) 22%,
              rgba(250, 204, 21, 0.92) 52%,
              rgba(245, 158, 11, 0.50) 100%
            );
          animation: vonuDotB 1850ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .dot-c {
          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.34) 22%,
              rgba(34, 197, 94, 0.88) 52%,
              rgba(16, 185, 129, 0.50) 100%
            );
          animation: vonuDotC 1850ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translateX(0) scale(0.84);
            opacity: 0.42;
            filter:
              blur(0.1px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.10) rgba(239, 68, 68, 0.16));
          }

          22% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.12)) scale(1.18);
            opacity: 0.94;
            filter:
              blur(0.05px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.22) rgba(239, 68, 68, 0.34));
          }

          48% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.54)) scale(1.42);
            opacity: 0.82;
            filter:
              blur(0.35px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.30) rgba(249, 115, 22, 0.32));
          }

          72% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.10)) scale(1.02);
            opacity: 0.62;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translateX(0) scale(1.02);
            opacity: 0.62;
            filter:
              blur(0.05px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.14) rgba(250, 204, 21, 0.20));
          }

          26% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.18)) scale(1.22);
            opacity: 0.88;
          }

          50% {
            transform: translateX(0) scale(1.52);
            opacity: 0.96;
            filter:
              blur(0.32px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.34) rgba(250, 204, 21, 0.38));
          }

          76% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.18)) scale(1.12);
            opacity: 0.72;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translateX(0) scale(0.86);
            opacity: 0.44;
            filter:
              blur(0.1px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.10) rgba(34, 197, 94, 0.16));
          }

          24% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.10)) scale(1.04);
            opacity: 0.62;
          }

          50% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.54)) scale(1.42);
            opacity: 0.84;
            filter:
              blur(0.35px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.30) rgba(34, 197, 94, 0.34));
          }

          78% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.12)) scale(1.18);
            opacity: 0.94;
            filter:
              blur(0.05px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.22) rgba(34, 197, 94, 0.34));
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.62);
            gap: calc(var(--vonu-thinking-size) * 0.14);
          }

          .vonu-thinking-dot {
            width: calc(var(--vonu-thinking-size) * 0.28);
            height: calc(var(--vonu-thinking-size) * 0.28);
            filter:
              blur(0.08px)
              drop-shadow(0 0 calc(var(--vonu-thinking-size) * 0.12) rgba(59, 130, 246, 0.16));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-dot {
            animation: none !important;
            transform: none !important;
            opacity: 0.85;
          }
        }
      `}</style>
    </span>
  );
}