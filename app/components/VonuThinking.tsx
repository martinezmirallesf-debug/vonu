"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  return (
    <div
      className="vonu-thinking"
      style={
        {
          "--vonu-thinking-size": `${size}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="vonu-thinking-glow" />
      <span className="vonu-thinking-ring" />

      <span className="vonu-thinking-dot vonu-thinking-dot-a" />
      <span className="vonu-thinking-dot vonu-thinking-dot-b" />
      <span className="vonu-thinking-dot vonu-thinking-dot-c" />

      <style jsx>{`
        .vonu-thinking {
          position: relative;
          width: var(--vonu-thinking-size);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          display: inline-block;
          transform: translateZ(0);
        }

        .vonu-thinking-glow {
          position: absolute;
          inset: -34%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(26, 115, 232, 0.18) 0%,
              rgba(26, 115, 232, 0.10) 34%,
              rgba(26, 115, 232, 0.00) 72%
            );
          animation: vonuThinkingGlow 2100ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-ring {
          position: absolute;
          inset: 1px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.92) 46%, rgba(255, 255, 255, 0.00) 47%),
            conic-gradient(
              from 120deg,
              rgba(26, 115, 232, 0.00),
              rgba(26, 115, 232, 0.24),
              rgba(16, 185, 129, 0.16),
              rgba(245, 158, 11, 0.12),
              rgba(26, 115, 232, 0.00)
            );
          opacity: 0.9;
          animation: vonuThinkingRing 2400ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-dot {
          position: absolute;
          width: 31%;
          height: 31%;
          border-radius: 999px;
          background: #111827;
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.52) inset;
          will-change: transform, opacity;
        }

        .vonu-thinking-dot-a {
          left: 50%;
          top: 17%;
          transform: translate(-50%, -50%);
          animation: vonuThinkingDotA 1600ms ease-in-out infinite;
        }

        .vonu-thinking-dot-b {
          left: 26%;
          top: 68%;
          transform: translate(-50%, -50%);
          animation: vonuThinkingDotB 1600ms ease-in-out 130ms infinite;
        }

        .vonu-thinking-dot-c {
          left: 74%;
          top: 68%;
          transform: translate(-50%, -50%);
          animation: vonuThinkingDotC 1600ms ease-in-out 260ms infinite;
        }

        @keyframes vonuThinkingGlow {
          0%,
          100% {
            opacity: 0.42;
            transform: scale(0.92);
          }

          50% {
            opacity: 0.95;
            transform: scale(1.12);
          }
        }

        @keyframes vonuThinkingRing {
          0%,
          100% {
            opacity: 0.58;
            transform: rotate(0deg) scale(0.98);
          }

          50% {
            opacity: 0.92;
            transform: rotate(10deg) scale(1.03);
          }
        }

        @keyframes vonuThinkingDotA {
          0%,
          100% {
            opacity: 0.78;
            transform: translate(-50%, -50%) scale(0.9);
          }

          45% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.18);
          }
        }

        @keyframes vonuThinkingDotB {
          0%,
          100% {
            opacity: 0.76;
            transform: translate(-50%, -50%) scale(0.88);
          }

          45% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.14);
          }
        }

        @keyframes vonuThinkingDotC {
          0%,
          100% {
            opacity: 0.76;
            transform: translate(-50%, -50%) scale(0.88);
          }

          45% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.14);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-glow,
          .vonu-thinking-ring,
          .vonu-thinking-dot {
            animation: none !important;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking-glow {
            inset: -26%;
            animation-duration: 2400ms;
          }

          .vonu-thinking-ring {
            animation-duration: 2800ms;
          }

          .vonu-thinking-dot {
            box-shadow:
              0 1px 1px rgba(0, 0, 0, 0.10),
              0 0 0 1px rgba(255, 255, 255, 0.48) inset;
          }
        }
      `}</style>
    </div>
  );
}