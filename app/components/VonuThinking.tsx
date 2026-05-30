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
          width: calc(var(--vonu-thinking-size) * 1.9);
          height: calc(var(--vonu-thinking-size) * 1.15);
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

        .vonu-thinking-high .dot-a,
        .vonu-thinking-high .dot-b {
          background: #ff5a5f;
        }

        .vonu-thinking-high .dot-c {
          background: #ff8a00;
        }

        .vonu-thinking-danger .dot-a,
        .vonu-thinking-danger .dot-b,
        .vonu-thinking-danger .dot-c {
          background: #ff3b30;
        }

        .is-active .dot-a {
          animation: vonuDotA 2400ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-b {
          animation: vonuDotB 2400ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-c {
          animation: vonuDotC 2400ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-still .dot-a {
          transform: translate(-165%, -50%) scale(1);
          opacity: 0.96;
        }

        .is-still .dot-b {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.96;
        }

        .is-still .dot-c {
          transform: translate(65%, -50%) scale(1);
          opacity: 0.96;
        }

        /*
          Animación simétrica:
          0% línea normal
          20% intercambio horizontal compacto
          40% triángulo arriba
          60% línea invertida
          80% triángulo abajo
          100% línea normal
        */

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translate(-165%, -50%) scale(0.95);
            opacity: 0.62;
          }

          20% {
            transform: translate(-50%, -50%) scale(1.22);
            opacity: 0.96;
          }

          40% {
            transform: translate(-50%, -118%) scale(1.12);
            opacity: 0.92;
          }

          60% {
            transform: translate(65%, -50%) scale(1.05);
            opacity: 0.84;
          }

          80% {
            transform: translate(-108%, 18%) scale(1.24);
            opacity: 0.96;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.76;
          }

          20% {
            transform: translate(65%, -50%) scale(1.12);
            opacity: 0.88;
          }

          40% {
            transform: translate(-108%, 18%) scale(1.26);
            opacity: 1;
          }

          60% {
            transform: translate(-165%, -50%) scale(1.05);
            opacity: 0.84;
          }

          80% {
            transform: translate(-50%, -118%) scale(1.12);
            opacity: 0.92;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translate(65%, -50%) scale(0.95);
            opacity: 0.62;
          }

          20% {
            transform: translate(-165%, -50%) scale(1.05);
            opacity: 0.84;
          }

          40% {
            transform: translate(8%, 18%) scale(1.24);
            opacity: 0.96;
          }

          60% {
            transform: translate(-50%, -50%) scale(1.22);
            opacity: 0.96;
          }

          80% {
            transform: translate(8%, 18%) scale(1.24);
            opacity: 0.96;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.76);
            height: calc(var(--vonu-thinking-size) * 1.05);
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
            transform: translate(-165%, -50%) scale(1) !important;
          }

          .dot-b {
            transform: translate(-50%, -50%) scale(1) !important;
          }

          .dot-c {
            transform: translate(65%, -50%) scale(1) !important;
          }
        }
      `}</style>
    </span>
  );
}