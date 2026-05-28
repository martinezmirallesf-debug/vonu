"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  const uid = React.useId().replace(/:/g, "");
  const beamGradientId = `${uid}-beam-gradient`;
  const beamGlowId = `${uid}-beam-glow`;
  const beamSoftGlowId = `${uid}-beam-soft-glow`;

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

          <filter
            id={beamGlowId}
            x="-250%"
            y="-250%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id={beamSoftGlowId}
            x="-300%"
            y="-300%"
            width="600%"
            height="600%"
          >
            <feGaussianBlur stdDeviation="5.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/*
          Path pegado al contorno exterior de la V.
          Si luego queremos afinar aún más, lo podremos hacer,
          pero esta versión ya evita pasar por el centro.
        */}

        {/* Glow grande y suave */}
        <path
          className="beam beam-soft"
          d="M 15 15
             C 18 25, 20 37, 23 49
             C 26 63, 29 75, 36 83
             C 40 87, 45 88, 50 86
             C 58 83, 64 72, 69 59
             C 75 44, 79 28, 86 13"
          pathLength="100"
          fill="none"
          stroke={`url(#${beamGradientId})`}
          filter={`url(#${beamSoftGlowId})`}
        />

        {/* Haz principal brillante */}
        <path
          className="beam beam-main"
          d="M 15 15
             C 18 25, 20 37, 23 49
             C 26 63, 29 75, 36 83
             C 40 87, 45 88, 50 86
             C 58 83, 64 72, 69 59
             C 75 44, 79 28, 86 13"
          pathLength="100"
          fill="none"
          stroke={`url(#${beamGradientId})`}
          filter={`url(#${beamGlowId})`}
        />

        {/* Núcleo más definido */}
        <path
          className="beam beam-core"
          d="M 15 15
             C 18 25, 20 37, 23 49
             C 26 63, 29 75, 36 83
             C 40 87, 45 88, 50 86
             C 58 83, 64 72, 69 59
             C 75 44, 79 28, 86 13"
          pathLength="100"
          fill="none"
          stroke={`url(#${beamGradientId})`}
        />
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
          inset: -30%;
          border-radius: 999px;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.20) 0%,
            rgba(59, 130, 246, 0.10) 38%,
            rgba(59, 130, 246, 0.03) 58%,
            rgba(59, 130, 246, 0) 78%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.12));
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
            drop-shadow(0 0 7px rgba(59, 130, 246, 0.12));
          animation: vonuLogoPulse 1900ms ease-in-out infinite;
          will-change: transform, opacity, filter;
        }

        .vonu-thinking-beam-layer {
          position: absolute;
          inset: -3%;
          z-index: 2;
          pointer-events: none;
          overflow: visible;
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

        .beam {
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }

        .beam-soft {
          stroke-width: 13;
          opacity: 0.55;
          stroke-dasharray: 24 130;
          stroke-dashoffset: 124;
          animation: vonuBeamTravel 1700ms linear infinite;
        }

        .beam-main {
          stroke-width: 7.2;
          opacity: 1;
          stroke-dasharray: 17 130;
          stroke-dashoffset: 117;
          animation: vonuBeamTravel 1700ms linear infinite;
        }

        .beam-core {
          stroke-width: 4.6;
          opacity: 0.98;
          stroke-dasharray: 11 130;
          stroke-dashoffset: 111;
          animation: vonuBeamTravel 1700ms linear infinite;
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

        @keyframes vonuBeamTravel {
          from {
            stroke-dashoffset: 124;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes vonuAuraPulse {
          0%,
          100% {
            opacity: 0.56;
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
              drop-shadow(0 0 7px rgba(59, 130, 246, 0.12));
          }

          50% {
            opacity: 1;
            transform: translateX(1px) scale(1.01);
            filter:
              drop-shadow(0 2px 4px rgba(15, 23, 42, 0.10))
              drop-shadow(0 0 12px rgba(59, 130, 246, 0.20));
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
            opacity: 0.64;
          }

          .vonu-thinking-beam-layer {
            inset: -2%;
          }

          .beam-soft {
            stroke-width: 11.5;
          }

          .beam-main {
            stroke-width: 6.4;
          }

          .beam-core {
            stroke-width: 4.1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-aura,
          .vonu-thinking-logo-base,
          .vonu-thinking-sheen {
            animation: none !important;
          }

          .beam-soft,
          .beam-main,
          .beam-core {
            animation: none !important;
            stroke-dashoffset: 46;
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