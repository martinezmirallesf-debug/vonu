"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  const uid = React.useId().replace(/:/g, "");
  const beamGradientId = `${uid}-beam-gradient`;
  const glowFilterId = `${uid}-glow-filter`;
  const softGlowFilterId = `${uid}-soft-glow-filter`;

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
      <span className="vonu-thinking-logo-base" />

      <svg
        className="vonu-thinking-beam-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={beamGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="22%" stopColor="#f97316" />
            <stop offset="46%" stopColor="#3b82f6" />
            <stop offset="72%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <filter id={glowFilterId} x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id={softGlowFilterId}
            x="-250%"
            y="-250%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="4.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow más grande y suave */}
        <g filter={`url(#${softGlowFilterId})`} opacity="0.32">
          <ellipse rx="14" ry="8.5" fill={`url(#${beamGradientId})`}>
            <animateMotion
              dur="1.85s"
              repeatCount="indefinite"
              rotate="auto"
              path="M 18 16 C 24 34, 29 54, 37 73 C 40 80, 44 84, 49 84 C 54 84, 58 79, 63 69 C 72 49, 77 28, 86 12"
            />
          </ellipse>
        </g>

        {/* Haz principal */}
        <g filter={`url(#${glowFilterId})`} opacity="0.98">
          <ellipse rx="10.5" ry="4.8" fill={`url(#${beamGradientId})`}>
            <animateMotion
              dur="1.85s"
              repeatCount="indefinite"
              rotate="auto"
              path="M 18 16 C 24 34, 29 54, 37 73 C 40 80, 44 84, 49 84 C 54 84, 58 79, 63 69 C 72 49, 77 28, 86 12"
            />
          </ellipse>

          <ellipse rx="8.2" ry="3.9" fill={`url(#${beamGradientId})`} opacity="0.72">
            <animateMotion
              dur="1.85s"
              begin="-0.10s"
              repeatCount="indefinite"
              rotate="auto"
              path="M 18 16 C 24 34, 29 54, 37 73 C 40 80, 44 84, 49 84 C 54 84, 58 79, 63 69 C 72 49, 77 28, 86 12"
            />
          </ellipse>

          <ellipse rx="6" ry="2.9" fill={`url(#${beamGradientId})`} opacity="0.50">
            <animateMotion
              dur="1.85s"
              begin="-0.18s"
              repeatCount="indefinite"
              rotate="auto"
              path="M 18 16 C 24 34, 29 54, 37 73 C 40 80, 44 84, 49 84 C 54 84, 58 79, 63 69 C 72 49, 77 28, 86 12"
            />
          </ellipse>
        </g>
      </svg>

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

        .vonu-thinking-aura {
          position: absolute;
          inset: -28%;
          border-radius: 999px;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.18) 0%,
            rgba(59, 130, 246, 0.09) 38%,
            rgba(59, 130, 246, 0.03) 56%,
            rgba(59, 130, 246, 0) 76%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.10));
          opacity: 0.72;
          animation: vonuAuraPulse 1900ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-thinking-logo-base {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-size: contain;
          background-position: calc(50% + 1px) 50%;
          opacity: 0.98;
          transform: translateX(1px) scale(0.96);
          filter:
            drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08))
            drop-shadow(0 0 6px rgba(59, 130, 246, 0.10));
          animation: vonuLogoPulse 1900ms ease-in-out infinite;
          will-change: transform, opacity, filter;
        }

        .vonu-thinking-beam-layer {
          position: absolute;
          inset: -2%;
          z-index: 2;
          overflow: visible;
          pointer-events: none;
          transform: translateX(1px) scale(1.02);

          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-position: calc(50% + 1px) 50%;
          mask-position: calc(50% + 1px) 50%;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(
            118deg,
            rgba(255, 255, 255, 0) 10%,
            rgba(255, 255, 255, 0.10) 30%,
            rgba(255, 255, 255, 0.62) 46%,
            rgba(255, 255, 255, 0.14) 62%,
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
          -webkit-mask-position: calc(50% + 1px) 50%;
          mask-position: calc(50% + 1px) 50%;
          opacity: 0;
          mix-blend-mode: screen;
          animation: vonuSheenSweep 3200ms ease-in-out infinite;
          will-change: opacity, background-position;
        }

        @keyframes vonuAuraPulse {
          0%,
          100% {
            opacity: 0.54;
            transform: scale(0.94);
          }

          50% {
            opacity: 0.88;
            transform: scale(1.08);
          }
        }

        @keyframes vonuLogoPulse {
          0%,
          100% {
            opacity: 0.97;
            transform: translateX(1px) scale(0.95);
            filter:
              drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08))
              drop-shadow(0 0 6px rgba(59, 130, 246, 0.10));
          }

          50% {
            opacity: 1;
            transform: translateX(1px) scale(1.01);
            filter:
              drop-shadow(0 2px 4px rgba(15, 23, 42, 0.10))
              drop-shadow(0 0 10px rgba(59, 130, 246, 0.18));
          }
        }

        @keyframes vonuSheenSweep {
          0%,
          44% {
            opacity: 0;
            background-position: 140% 50%;
          }

          54% {
            opacity: 0.28;
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
          .vonu-thinking-aura {
            inset: -22%;
            opacity: 0.62;
          }

          .vonu-thinking-beam-layer {
            inset: -1%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-aura,
          .vonu-thinking-logo-base,
          .vonu-thinking-sheen {
            animation: none !important;
          }

          .vonu-thinking-aura {
            opacity: 0.56;
            transform: scale(1);
          }

          .vonu-thinking-logo-base {
            opacity: 1;
            transform: translateX(1px) scale(0.97);
          }

          .vonu-thinking-sheen {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}