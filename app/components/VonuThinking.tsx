"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

export default function VonuThinking({ size = 28 }: VonuThinkingProps) {
  return (
    <span
      className="vonu-thinking"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="vonu-thinking-svg">
        <g className="vonu-thinking-mark">
          {/* 3 puntos ancla */}
          <circle className="vonu-anchor vonu-anchor-a" cx="16" cy="18" r="4.6" />
          <circle className="vonu-anchor vonu-anchor-b" cx="26" cy="42" r="4.9" />
          <circle className="vonu-anchor vonu-anchor-c" cx="48" cy="16" r="4.6" />

          {/* Halo suave del trazo */}
          <path
            className="vonu-mark-halo"
            d="M16 18 C18 26, 21 34, 26 42 C32 35, 38 25, 48 16"
          />

          {/* Trazo principal del logo */}
          <path
            className="vonu-mark-stroke"
            d="M16 18 C18 26, 21 34, 26 42 C32 35, 38 25, 48 16"
          />
        </g>
      </svg>

      <style jsx>{`
        .vonu-thinking {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          transform: translateZ(0);
        }

        .vonu-thinking-svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .vonu-thinking-mark {
          transform-origin: 50% 50%;
          animation: vonuMarkSettle 2200ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .vonu-anchor {
          fill: #1a73e8;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
        }

        .vonu-anchor-a {
          animation: vonuAnchorPulse 2200ms ease-in-out infinite;
        }

        .vonu-anchor-b {
          animation: vonuAnchorPulse 2200ms ease-in-out 90ms infinite;
        }

        .vonu-anchor-c {
          animation: vonuAnchorPulse 2200ms ease-in-out 180ms infinite;
        }

        .vonu-mark-halo,
        .vonu-mark-stroke {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 76;
          stroke-dashoffset: 76;
        }

        .vonu-mark-halo {
          stroke: rgba(26, 115, 232, 0.22);
          stroke-width: 11;
          opacity: 0;
          animation: vonuHaloDraw 2200ms ease-in-out infinite;
        }

        .vonu-mark-stroke {
          stroke: #1a73e8;
          stroke-width: 7.5;
          opacity: 0;
          animation: vonuStrokeDraw 2200ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes vonuAnchorPulse {
          0% {
            opacity: 0;
            transform: scale(0.72);
          }

          8% {
            opacity: 0.95;
            transform: scale(0.88);
          }

          18% {
            opacity: 1;
            transform: scale(1.14);
          }

          28% {
            opacity: 0.92;
            transform: scale(0.96);
          }

          38% {
            opacity: 0;
            transform: scale(0.72);
          }

          100% {
            opacity: 0;
            transform: scale(0.72);
          }
        }

        @keyframes vonuHaloDraw {
          0%,
          16% {
            opacity: 0;
            stroke-dashoffset: 76;
          }

          24% {
            opacity: 0.18;
          }

          54% {
            opacity: 0.28;
            stroke-dashoffset: 0;
          }

          76% {
            opacity: 0.18;
            stroke-dashoffset: 0;
          }

          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }

        @keyframes vonuStrokeDraw {
          0%,
          14% {
            opacity: 0;
            stroke-dashoffset: 76;
          }

          20% {
            opacity: 1;
          }

          54% {
            opacity: 1;
            stroke-dashoffset: 0;
          }

          78% {
            opacity: 1;
            stroke-dashoffset: 0;
          }

          100% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }

        @keyframes vonuMarkSettle {
          0%,
          18% {
            transform: scale(0.96);
          }

          54% {
            transform: scale(1.03);
          }

          72% {
            transform: scale(1);
          }

          86% {
            transform: scale(1.025);
          }

          100% {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-mark,
          .vonu-anchor,
          .vonu-mark-halo,
          .vonu-mark-stroke {
            animation: none !important;
          }

          .vonu-anchor {
            opacity: 0;
          }

          .vonu-mark-halo {
            opacity: 0.14;
            stroke-dashoffset: 0;
          }

          .vonu-mark-stroke {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </span>
  );
}