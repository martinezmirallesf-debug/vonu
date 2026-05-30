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
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          width: calc(var(--vonu-thinking-size) * 1.95);
          height: calc(var(--vonu-thinking-size) * 0.95);
          flex: 0 0 auto;
          gap: calc(var(--vonu-thinking-size) * 0.24);
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
          background: var(--dot-a);
        }

        .dot-b {
          background: var(--dot-b);
        }

        .dot-c {
          background: var(--dot-c);
        }

        .is-static .vonu-thinking-dot {
          opacity: 1;
          transform: none;
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

        @keyframes vonuDotA {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.95;
          }

          20% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.18), 0)
              scale(1);
            opacity: 0.95;
          }

          40% {
            transform: translate(
                calc(var(--vonu-thinking-size) * 0.22),
                calc(var(--vonu-thinking-size) * -0.18)
              )
              scale(1);
            opacity: 0.95;
          }

          60% {
            transform: translate(0, calc(var(--vonu-thinking-size) * -0.22))
              scale(1);
            opacity: 0.95;
          }

          80% {
            transform: translate(calc(var(--vonu-thinking-size) * -0.18), 0)
              scale(1);
            opacity: 0.95;
          }
        }

        @keyframes vonuDotB {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.95;
          }

          20% {
            transform: translate(0, calc(var(--vonu-thinking-size) * -0.18))
              scale(1);
            opacity: 0.95;
          }

          40% {
            transform: translate(calc(var(--vonu-thinking-size) * -0.18), 0)
              scale(1);
            opacity: 0.95;
          }

          60% {
            transform: translate(
                calc(var(--vonu-thinking-size) * -0.22),
                calc(var(--vonu-thinking-size) * 0.18)
              )
              scale(1);
            opacity: 0.95;
          }

          80% {
            transform: translate(0, calc(var(--vonu-thinking-size) * 0.22))
              scale(1);
            opacity: 0.95;
          }
        }

        @keyframes vonuDotC {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.95;
          }

          20% {
            transform: translate(calc(var(--vonu-thinking-size) * -0.18), 0)
              scale(1);
            opacity: 0.95;
          }

          40% {
            transform: translate(0, calc(var(--vonu-thinking-size) * 0.18))
              scale(1);
            opacity: 0.95;
          }

          60% {
            transform: translate(
                calc(var(--vonu-thinking-size) * 0.18),
                calc(var(--vonu-thinking-size) * 0.18)
              )
              scale(1);
            opacity: 0.95;
          }

          80% {
            transform: translate(calc(var(--vonu-thinking-size) * 0.22), 0)
              scale(1);
            opacity: 0.95;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking {
            width: calc(var(--vonu-thinking-size) * 1.85);
            gap: calc(var(--vonu-thinking-size) * 0.22);
          }

          .vonu-thinking-dot {
            width: calc(var(--vonu-thinking-size) * 0.28);
            height: calc(var(--vonu-thinking-size) * 0.28);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .is-active .vonu-thinking-dot {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </span>
  );
}