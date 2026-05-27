"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 30 }: VonuThinkingProps) {
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
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -44%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(26, 115, 232, 0.26) 0%,
              rgba(26, 115, 232, 0.13) 35%,
              rgba(26, 115, 232, 0.00) 72%
            );
          opacity: 0.55;
          animation: vonuThinkingAura 2400ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-logo {
          position: absolute;
          inset: 0;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.96;
          filter:
            drop-shadow(0 2px 5px rgba(26, 115, 232, 0.22))
            drop-shadow(0 0 8px rgba(26, 115, 232, 0.10));
          animation: vonuThinkingBreathe 2400ms ease-in-out infinite;
          will-change: transform, opacity, filter;
        }

        .vonu-thinking-light {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              115deg,
              rgba(255, 255, 255, 0) 10%,
              rgba(255, 255, 255, 0.20) 30%,
              rgba(255, 255, 255, 0.58) 46%,
              rgba(255, 255, 255, 0.16) 62%,
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
          animation: vonuThinkingLight 3200ms ease-in-out infinite;
          will-change: opacity, background-position;
        }

        @keyframes vonuThinkingAura {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.92);
          }

          50% {
            opacity: 0.78;
            transform: scale(1.16);
          }
        }

        @keyframes vonuThinkingBreathe {
          0%,
          100% {
            opacity: 0.9;
            transform: scale(0.985) rotate(-0.25deg);
            filter:
              drop-shadow(0 2px 5px rgba(26, 115, 232, 0.18))
              drop-shadow(0 0 7px rgba(26, 115, 232, 0.08));
          }

          50% {
            opacity: 1;
            transform: scale(1.045) rotate(0.25deg);
            filter:
              drop-shadow(0 2px 7px rgba(26, 115, 232, 0.28))
              drop-shadow(0 0 12px rgba(26, 115, 232, 0.14));
          }
        }

        @keyframes vonuThinkingLight {
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
          .vonu-thinking-aura {
            inset: -36%;
            animation-duration: 2800ms;
          }

          .vonu-thinking-logo {
            animation-duration: 2800ms;
            filter:
              drop-shadow(0 1px 4px rgba(26, 115, 232, 0.18))
              drop-shadow(0 0 6px rgba(26, 115, 232, 0.08));
          }

          .vonu-thinking-light {
            animation-duration: 3600ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-aura,
          .vonu-thinking-logo,
          .vonu-thinking-light {
            animation: none !important;
          }

          .vonu-thinking-aura {
            opacity: 0.38;
          }

          .vonu-thinking-logo {
            opacity: 1;
            transform: none;
          }

          .vonu-thinking-light {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}