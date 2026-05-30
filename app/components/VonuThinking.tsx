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
  size = 30,
  status = "thinking",
  active = true,
}: VonuThinkingProps) {
  const palette =
    status === "danger"
      ? ["#ff3b30", "#ff3b30", "#ff3b30"]
      : status === "high"
      ? ["#ff5a5f", "#ff5a5f", "#ff8a00"]
      : status === "warning"
      ? ["#ff8a00", "#ffb000", "#ff8a00"]
      : status === "safe"
      ? ["#00c983", "#00c983", "#00c983"]
      : ["#ff5a5f", "#ffb000", "#00c983"];

  return (
    <span
      className={`vonu-thinking ${active ? "is-active" : "is-static"}`}
      style={
        {
          "--vonu-thinking-size": `${size}px`,
          "--dot-a": palette[0],
          "--dot-b": palette[1],
          "--dot-c": palette[2],
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
          width: calc(var(--vonu-thinking-size) * 2.28);
          height: calc(var(--vonu-thinking-size) * 1.28);
          flex: 0 0 auto;
          overflow: visible;
          transform: translateZ(0);
        }

        .vonu-thinking-dot {
  position: absolute;
  left: 0;
  top: 50%;
  width: calc(var(--vonu-thinking-size) * 0.40);
  height: calc(var(--vonu-thinking-size) * 0.40);
  border-radius: 9999px;
  display: block;
  transform-origin: center;
  will-change: transform, opacity;
}

        .dot-a {
          background: var(--dot-a);
        }

        .dot-b {
          background: var(--dot-b);
        }

        .dot-c {
          background: var(--dot-c);
        }

        .is-static .dot-a {
          transform: translate(0, -50%) scale(1);
          opacity: 1;
        }

        .is-static .dot-b {
          transform: translate(calc(var(--vonu-thinking-size) * 0.84), -50%) scale(1);
          opacity: 1;
        }

        .is-static .dot-c {
          transform: translate(calc(var(--vonu-thinking-size) * 1.68), -50%) scale(1);
          opacity: 1;
        }

        .is-active .dot-a {
          animation: vonuDotA 3600ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-b {
          animation: vonuDotB 3600ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .is-active .dot-c {
          animation: vonuDotC 3600ms cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        /*
          Ciclo en 4 gestos:
          1) intercambiar posiciones horizontalmente
          2) expandirse horizontalmente
          3) formar un triángulo y rotar
          4) expandirse y rotar en forma de triángulo
        */

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translate(0, -50%) scale(1);
            opacity: 0.92;
          }

          18% {
            transform: translate(calc(var(--vonu-thinking-size) * 1.68), -50%) scale(1.02);
            opacity: 1;
          }

          36% {
            transform: translate(calc(var(--vonu-thinking-size) * -0.12), -50%) scale(1.08);
            opacity: 1;
          }

          58% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), calc(var(--vonu-thinking-size) * -0.98)) scale(1.04);
            opacity: 0.96;
          }

          80% {
            transform: translate(calc(var(--vonu-thinking-size) * 1.86), calc(var(--vonu-thinking-size) * 0.18)) scale(1.12);
            opacity: 1;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), -50%) scale(1);
            opacity: 0.96;
          }

          18% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), -50%) scale(1.16);
            opacity: 1;
          }

          36% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), -50%) scale(1.22);
            opacity: 1;
          }

          58% {
            transform: translate(calc(var(--vonu-thinking-size) * 1.58), calc(var(--vonu-thinking-size) * 0.22)) scale(1.08);
            opacity: 0.98;
          }

          80% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), calc(var(--vonu-thinking-size) * -1.06)) scale(1.12);
            opacity: 1;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translate(calc(var(--vonu-thinking-size) * 1.68), -50%) scale(1);
            opacity: 0.92;
          }

          18% {
            transform: translate(0, -50%) scale(1.02);
            opacity: 1;
          }

          36% {
            transform: translate(calc(var(--vonu-thinking-size) * 1.80), -50%) scale(1.08);
            opacity: 1;
          }

          58% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.10), calc(var(--vonu-thinking-size) * 0.22)) scale(1.08);
            opacity: 0.98;
          }

          80% {
            transform: translate(calc(var(--vonu-thinking-size) * -0.18), calc(var(--vonu-thinking-size) * 0.18)) scale(1.12);
            opacity: 1;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 2.16);
            height: calc(var(--vonu-thinking-size) * 1.2);
          }

          .vonu-thinking-dot {
  width: calc(var(--vonu-thinking-size) * 0.38);
  height: calc(var(--vonu-thinking-size) * 0.38);
}
        }

        @media (prefers-reduced-motion: reduce) {
          .is-active .dot-a,
          .is-active .dot-b,
          .is-active .dot-c {
            animation: none !important;
          }

          .dot-a {
            transform: translate(0, -50%) scale(1) !important;
          }

          .dot-b {
            transform: translate(calc(var(--vonu-thinking-size) * 0.84), -50%) scale(1) !important;
          }

          .dot-c {
            transform: translate(calc(var(--vonu-thinking-size) * 1.68), -50%) scale(1) !important;
          }
        }
      `}</style>
    </span>
  );
}