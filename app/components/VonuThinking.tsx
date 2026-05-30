"use client";

import React from "react";

export type VonuThinkingStatus =
  | "thinking"
  | "safe"
  | "warning"
  | "high"
  | "danger";

type VonuThinkingProps = {
  size?: number;
  status?: VonuThinkingStatus;
  active?: boolean;
};

export default function VonuThinking({
  size = 34,
  status = "thinking",
  active = true,
}: VonuThinkingProps) {
  return (
    <span
      className={[
        "vonu-thinking",
        `vonu-thinking-${status}`,
        active ? "is-active" : "is-still",
      ].join(" ")}
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
          display: inline-block;
          width: calc(var(--vonu-thinking-size) * 1.85);
          height: calc(var(--vonu-thinking-size) * 1.12);
          flex: 0 0 auto;
          overflow: visible;
          transform: translateZ(0);
        }

        .vonu-thinking-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: calc(var(--vonu-thinking-size) * 0.31);
          height: calc(var(--vonu-thinking-size) * 0.31);
          border-radius: 9999px;
          display: block;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .dot-a {
          background: #ff5a5f;
        }

        .dot-b {
          background: #ffb000;
        }

        .dot-c {
          background: #00c983;
        }

        /* Estado final: bajo riesgo */
        .vonu-thinking-safe .dot-a,
        .vonu-thinking-safe .dot-b,
        .vonu-thinking-safe .dot-c {
          background: #00c983;
        }

        /* Estado final: precaución */
        .vonu-thinking-warning .dot-a,
        .vonu-thinking-warning .dot-b,
        .vonu-thinking-warning .dot-c {
          background: #ffb000;
        }

        /* Estado final: riesgo alto */
        .vonu-thinking-high .dot-a,
        .vonu-thinking-high .dot-b {
          background: #ff5a5f;
        }

        .vonu-thinking-high .dot-c {
          background: #ff8a00;
        }

        /* Estado final: peligro muy alto */
        .vonu-thinking-danger .dot-a,
        .vonu-thinking-danger .dot-b,
        .vonu-thinking-danger .dot-c {
          background: #ff3b30;
        }

        .is-active .dot-a {
          animation: vonuDotA 2200ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-b {
          animation: vonuDotB 2200ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-c {
          animation: vonuDotC 2200ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-still .dot-a {
          transform: translate(-160%, -50%) scale(1);
          opacity: 0.95;
        }

        .is-still .dot-b {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.95;
        }

        .is-still .dot-c {
          transform: translate(60%, -50%) scale(1);
          opacity: 0.95;
        }

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translate(-160%, -50%) scale(0.92);
            opacity: 0.58;
          }

          18% {
            transform: translate(-118%, -50%) scale(1.14);
            opacity: 0.96;
          }

          36% {
            transform: translate(-50%, -118%) scale(1.22);
            opacity: 0.92;
          }

          54% {
            transform: translate(60%, -50%) scale(1.05);
            opacity: 0.82;
          }

          72% {
            transform: translate(-50%, 22%) scale(1.28);
            opacity: 0.96;
          }

          88% {
            transform: translate(-132%, -50%) scale(1.02);
            opacity: 0.76;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.72;
          }

          18% {
            transform: translate(-50%, -50%) scale(1.32);
            opacity: 1;
          }

          36% {
            transform: translate(48%, 18%) scale(1.08);
            opacity: 0.88;
          }

          54% {
            transform: translate(-50%, -118%) scale(1.24);
            opacity: 0.96;
          }

          72% {
            transform: translate(-152%, -50%) scale(1.06);
            opacity: 0.82;
          }

          88% {
            transform: translate(-50%, -50%) scale(1.22);
            opacity: 0.92;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translate(60%, -50%) scale(0.92);
            opacity: 0.58;
          }

          18% {
            transform: translate(18%, -50%) scale(1.14);
            opacity: 0.96;
          }

          36% {
            transform: translate(-152%, 18%) scale(1.08);
            opacity: 0.88;
          }

          54% {
            transform: translate(-160%, -50%) scale(1.05);
            opacity: 0.82;
          }

          72% {
            transform: translate(48%, 18%) scale(1.28);
            opacity: 0.96;
          }

          88% {
            transform: translate(32%, -50%) scale(1.02);
            opacity: 0.76;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.72);
            height: calc(var(--vonu-thinking-size) * 1.02);
          }

          .vonu-thinking-dot {
            width: calc(var(--vonu-thinking-size) * 0.30);
            height: calc(var(--vonu-thinking-size) * 0.30);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-dot {
            animation: none !important;
          }

          .dot-a {
            transform: translate(-160%, -50%) scale(1) !important;
          }

          .dot-b {
            transform: translate(-50%, -50%) scale(1) !important;
          }

          .dot-c {
            transform: translate(60%, -50%) scale(1) !important;
          }
        }
      `}</style>
    </span>
  );
}