"use client";

import React from "react";

type VonuThinkingStatus = "thinking" | "safe" | "warning" | "danger";

type VonuThinkingProps = {
  size?: number;
  status?: VonuThinkingStatus;
};

export default function VonuThinking({
  size = 34,
  status = "thinking",
}: VonuThinkingProps) {
  return (
    <span
      className={`vonu-thinking vonu-thinking-${status}`}
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
          width: calc(var(--vonu-thinking-size) * 1.72);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          gap: calc(var(--vonu-thinking-size) * 0.18);
          overflow: visible;
          transform: translateZ(0);
        }

        .vonu-thinking-dot {
          width: calc(var(--vonu-thinking-size) * 0.30);
          height: calc(var(--vonu-thinking-size) * 0.30);
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

        .vonu-thinking-safe .dot-a,
        .vonu-thinking-safe .dot-b,
        .vonu-thinking-safe .dot-c {
          background: #00c983;
        }

        .vonu-thinking-warning .dot-a,
        .vonu-thinking-warning .dot-b,
        .vonu-thinking-warning .dot-c {
          background: #ffb000;
        }

        .vonu-thinking-danger .dot-a,
        .vonu-thinking-danger .dot-b,
        .vonu-thinking-danger .dot-c {
          background: #ff5a5f;
        }

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translateX(0) scale(0.88);
            opacity: 0.50;
          }

          28% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.10)) scale(1.08);
            opacity: 0.92;
          }

          52% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.42)) scale(1.30);
            opacity: 0.82;
          }

          76% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.08)) scale(1);
            opacity: 0.66;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translateX(0) scale(1);
            opacity: 0.68;
          }

          30% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.10)) scale(1.12);
            opacity: 0.88;
          }

          54% {
            transform: translateX(0) scale(1.36);
            opacity: 1;
          }

          78% {
            transform: translateX(calc(var(--vonu-thinking-size) * 0.10)) scale(1.06);
            opacity: 0.76;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translateX(0) scale(0.88);
            opacity: 0.50;
          }

          28% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.08)) scale(1);
            opacity: 0.66;
          }

          52% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.42)) scale(1.30);
            opacity: 0.82;
          }

          78% {
            transform: translateX(calc(var(--vonu-thinking-size) * -0.10)) scale(1.08);
            opacity: 0.92;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.62);
            gap: calc(var(--vonu-thinking-size) * 0.16);
          }

          .vonu-thinking-dot {
            width: calc(var(--vonu-thinking-size) * 0.29);
            height: calc(var(--vonu-thinking-size) * 0.29);
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