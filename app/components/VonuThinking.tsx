"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 24 }: VonuThinkingProps) {
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
      <span className="vonu-thinking-spectrum" />
      <span className="vonu-thinking-aura" />
      <span className="vonu-thinking-logo" />
      <span className="vonu-thinking-light" />

      <style jsx>{`
        .vonu-thinking {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--vonu-thinking-size);
          height: var(--vonu-thinking-size);
          flex: 0 0 auto;
          transform: translateZ(0);
          isolation: isolate;
        }

        .vonu-thinking-spectrum {
          position: absolute;
          inset: -42%;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              rgba(66, 133, 244, 0.00) 0deg,
              rgba(66, 133, 244, 0.22) 45deg,
              rgba(52, 168, 83, 0.18) 110deg,
              rgba(251, 188, 5, 0.20) 180deg,
              rgba(234, 67, 53, 0.18) 250deg,
              rgba(66, 133, 244, 0.22) 320deg,
              rgba(66, 133, 244, 0.00) 360deg
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.22));
          opacity: 0.42;
          transform: scale(0.9);
          animation:
            vonuSpectrumSpin 4200ms linear infinite,
            vonuSpectrumPulse 2400ms ease-in-out infinite;
          will-change: transform, opacity;
          z-index: 0;
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -26%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(26, 115, 232, 0.18) 0%,
              rgba(26, 115, 232, 0.10) 38%,
              rgba(26, 115, 232, 0.04) 58%,
              rgba(26, 115, 232, 0) 78%
            );
          opacity: 0.7;
          animation: vonuAuraPulse 2400ms ease-in-out infinite;
          will-change: transform, opacity;
          z-index: 1;
        }

        .vonu-thinking-logo {
          position: absolute;
          inset: 0;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.98;
          transform: scale(0.94);
          filter:
            drop-shadow(0 1px 4px rgba(26, 115, 232, 0.18))
            drop-shadow(0 0 8px rgba(26, 115, 232, 0.10));
          animation: vonuLogoBreathe 2400ms ease-in-out infinite;
          will-change: transform, filter, opacity;
          z-index: 2;
        }

        .vonu-thinking-light {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              115deg,
              rgba(255, 255, 255, 0) 10%,
              rgba(255, 255, 255, 0.22) 30%,
              rgba(255, 255, 255, 0.62) 46%,
              rgba(255, 255, 255, 0.18) 62%,
              rgba(255, 255, 255, 0) 82%
            );
          background-size: 260% 260%;
          background-position: 135% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
          opacity: 0;
          mix-blend-mode: screen;
          animation: vonuLogoSweep 3200ms ease-in-out infinite;
          will-change: opacity, background-position;
          z-index: 3;
        }

        @keyframes vonuSpectrumSpin {
          from {
            transform: scale(0.9) rotate(0deg);
          }
          to {
            transform: scale(0.9) rotate(360deg);
          }
        }

        @keyframes vonuSpectrumPulse {
          0%,
          100% {
            opacity: 0.26;
            transform: scale(0.86);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.08);
          }
        }

        @keyframes vonuAuraPulse {
          0%,
          100% {
            opacity: 0.42;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.82;
            transform: scale(1.12);
          }
        }

        @keyframes vonuLogoBreathe {
          0%,
          100% {
            opacity: 0.96;
            transform: scale(0.93);
            filter:
              drop-shadow(0 1px 4px rgba(26, 115, 232, 0.16))
              drop-shadow(0 0 6px rgba(26, 115, 232, 0.08));
          }
          50% {
            opacity: 1;
            transform: scale(1);
            filter:
              drop-shadow(0 2px 7px rgba(26, 115, 232, 0.24))
              drop-shadow(0 0 12px rgba(26, 115, 232, 0.14));
          }
        }

        @keyframes vonuLogoSweep {
          0%,
          38% {
            opacity: 0;
            background-position: 135% 50%;
          }
          48% {
            opacity: 0.42;
          }
          66% {
            opacity: 0;
            background-position: -35% 50%;
          }
          100% {
            opacity: 0;
            background-position: -35% 50%;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking-spectrum {
            inset: -34%;
            filter: blur(calc(var(--vonu-thinking-size) * 0.18));
            animation-duration: 4800ms, 2800ms;
            opacity: 0.34;
          }

          .vonu-thinking-aura {
            inset: -22%;
            animation-duration: 2800ms;
          }

          .vonu-thinking-logo {
            animation-duration: 2800ms;
          }

          .vonu-thinking-light {
            animation-duration: 3600ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-spectrum,
          .vonu-thinking-aura,
          .vonu-thinking-logo,
          .vonu-thinking-light {
            animation: none !important;
          }

          .vonu-thinking-spectrum {
            opacity: 0.22;
          }

          .vonu-thinking-aura {
            opacity: 0.35;
          }

          .vonu-thinking-logo {
            transform: scale(0.96);
            opacity: 1;
          }

          .vonu-thinking-light {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}