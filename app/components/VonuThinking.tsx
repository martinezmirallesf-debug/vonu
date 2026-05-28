"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  return (
    <span
      className="vonu-thinking"
      style={
        {
          "--vonu-thinking-size": `${size}px`,
          "--vonu-thinking-logo": `url("${LOGO_SRC}")`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="vonu-thinking-orbit-glow" />
      <span className="vonu-thinking-orbit-trace" />
      <span className="vonu-thinking-soft-aura" />
      <span className="vonu-thinking-logo" />
      <span className="vonu-thinking-sheen" />

      <style jsx>{`
        .vonu-thinking {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--vonu-thinking-size);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          isolation: isolate;
          overflow: visible;
          transform: translateZ(0);
        }

        .vonu-thinking-orbit-glow {
          position: absolute;
          inset: -62%;
          border-radius: 999px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.72;
          background: conic-gradient(
            from 0deg,
            rgba(239, 68, 68, 0) 0deg,
            rgba(239, 68, 68, 0.72) 28deg,
            rgba(249, 115, 22, 0.68) 78deg,
            rgba(59, 130, 246, 0.72) 154deg,
            rgba(250, 204, 21, 0.66) 228deg,
            rgba(34, 197, 94, 0.66) 302deg,
            rgba(239, 68, 68, 0) 360deg
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.18));
          -webkit-mask-image: radial-gradient(
            farthest-side,
            transparent calc(100% - 9px),
            #000 calc(100% - 6px)
          );
          mask-image: radial-gradient(
            farthest-side,
            transparent calc(100% - 9px),
            #000 calc(100% - 6px)
          );
          animation: vonuOrbitSpin 2400ms linear infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-orbit-trace {
          position: absolute;
          inset: -36%;
          border-radius: 999px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.52;
          background: conic-gradient(
            from 40deg,
            rgba(255, 255, 255, 0) 0deg,
            rgba(59, 130, 246, 0.65) 54deg,
            rgba(250, 204, 21, 0.46) 118deg,
            rgba(34, 197, 94, 0.40) 186deg,
            rgba(239, 68, 68, 0.44) 260deg,
            rgba(255, 255, 255, 0) 360deg
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.09));
          -webkit-mask-image: radial-gradient(
            farthest-side,
            transparent calc(100% - 5px),
            #000 calc(100% - 3px)
          );
          mask-image: radial-gradient(
            farthest-side,
            transparent calc(100% - 5px),
            #000 calc(100% - 3px)
          );
          animation: vonuOrbitSpin 1700ms linear infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-soft-aura {
          position: absolute;
          inset: -14%;
          border-radius: 999px;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.90) 0%,
            rgba(255, 255, 255, 0.54) 34%,
            rgba(59, 130, 246, 0.12) 58%,
            rgba(59, 130, 246, 0) 78%
          );
          opacity: 0.80;
          transform: scale(0.96);
          animation: vonuAuraPulse 2200ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-logo {
          position: absolute;
          inset: 0;
          z-index: 3;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-size: contain;
          background-position: calc(50% + 1px) calc(50% + 1px);
          opacity: 0.99;
          transform: translate(1px, 1px) scale(0.95);
          filter:
            drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08))
            drop-shadow(0 0 8px rgba(59, 130, 246, 0.18));
          animation: vonuLogoPulse 2200ms cubic-bezier(0.22, 1, 0.36, 1)
            infinite;
          will-change: transform, opacity, filter;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(
            118deg,
            rgba(255, 255, 255, 0) 10%,
            rgba(255, 255, 255, 0.10) 30%,
            rgba(255, 255, 255, 0.65) 46%,
            rgba(255, 255, 255, 0.16) 62%,
            rgba(255, 255, 255, 0) 84%
          );
          background-size: 280% 280%;
          background-position: 140% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-position: calc(50% + 1px) calc(50% + 1px);
          mask-position: calc(50% + 1px) calc(50% + 1px);
          opacity: 0;
          mix-blend-mode: screen;
          animation: vonuSheenSweep 3400ms ease-in-out infinite;
          will-change: opacity, background-position;
        }

        @keyframes vonuOrbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes vonuAuraPulse {
          0%,
          100% {
            opacity: 0.60;
            transform: scale(0.92);
          }

          50% {
            opacity: 0.90;
            transform: scale(1.08);
          }
        }

        @keyframes vonuLogoPulse {
          0%,
          100% {
            opacity: 0.96;
            transform: translate(1px, 1px) scale(0.93);
            filter:
              drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08))
              drop-shadow(0 0 6px rgba(59, 130, 246, 0.14));
          }

          48% {
            opacity: 1;
            transform: translate(1px, 1px) scale(1.03);
            filter:
              drop-shadow(0 2px 5px rgba(15, 23, 42, 0.10))
              drop-shadow(0 0 12px rgba(59, 130, 246, 0.24));
          }

          68% {
            opacity: 1;
            transform: translate(1px, 1px) scale(0.99);
          }
        }

        @keyframes vonuSheenSweep {
          0%,
          44% {
            opacity: 0;
            background-position: 140% 50%;
          }

          54% {
            opacity: 0.34;
          }

          70% {
            opacity: 0;
            background-position: -36% 50%;
          }

          100% {
            opacity: 0;
            background-position: -36% 50%;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking-orbit-glow {
            inset: -56%;
            opacity: 0.56;
            filter: blur(calc(var(--vonu-thinking-size) * 0.15));
          }

          .vonu-thinking-orbit-trace {
            inset: -32%;
            opacity: 0.40;
            filter: blur(calc(var(--vonu-thinking-size) * 0.07));
          }

          .vonu-thinking-soft-aura {
            inset: -10%;
            opacity: 0.70;
          }

          .vonu-thinking-orbit-glow {
            animation-duration: 2600ms;
          }

          .vonu-thinking-orbit-trace {
            animation-duration: 1800ms;
          }

          .vonu-thinking-logo {
            animation-duration: 2400ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-orbit-glow,
          .vonu-thinking-orbit-trace,
          .vonu-thinking-soft-aura,
          .vonu-thinking-logo,
          .vonu-thinking-sheen {
            animation: none !important;
          }

          .vonu-thinking-orbit-glow {
            opacity: 0.40;
          }

          .vonu-thinking-orbit-trace {
            opacity: 0.24;
          }

          .vonu-thinking-soft-aura {
            opacity: 0.52;
            transform: scale(1);
          }

          .vonu-thinking-logo {
            opacity: 1;
            transform: translate(1px, 1px) scale(0.97);
          }

          .vonu-thinking-sheen {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}