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
          width: calc(var(--vonu-thinking-size) * 1.7);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          gap: calc(var(--vonu-thinking-size) * 0.18);
          overflow: visible;
          transform: translateZ(0);
        }

        .vonu-thinking-dot {
          width: calc(var(--vonu-thinking-size) * 0.28);
          height: calc(var(--vonu-thinking-size) * 0.28);
          border-radius: 9999px;
          display: block;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .dot-a {
          background: #ff5a5f;
          animation: vonuDotA 1650ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .dot-b {
          background: #ffb000;
          animation: vonuDotB 1650ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .dot-c {
          background: #00c983;
          animation: vonuDotC 1650ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translateX(0) scale(0.86);
            opacity: 0.45;
          }

          28% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.10)) scale(1.08);
            opacity: 0.9;
          }

          52% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.42)) scale(1.28);
            opacity: 0.78;
          }

          76% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.08)) scale(0.98);
            opacity: 0.62;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translateX(0) scale(1);
            opacity: 0.64;
          }

          30% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.10)) scale(1.12);
            opacity: 0.86;
          }

          54% {
            transform: translateX(0) scale(1.34);
            opacity: 1;
          }

          78% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.10)) scale(1.06);
            opacity: 0.74;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translateX(0) scale(0.86);
            opacity: 0.45;
          }

          28% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.08)) scale(0.98);
            opacity: 0.62;
          }

          52% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.42)) scale(1.28);
            opacity: 0.78;
          }

          78% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.10)) scale(1.08);
            opacity: 0.9;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.58);
            gap: calc(var(--vonu-thinking-size) * 0.16);
          }

          .vonu-thinking-dot {
            width: calc(var(--vonu-thinking-size) * 0.26);
            height: calc(var(--vonu-thinking-size) * 0.26);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-dot {
            animation: none !important;
            transform: none !important;
            opacity: 0.9;
          }
        }
      `}</style>
    </span>
  );
}