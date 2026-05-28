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
      <span className="vonu-thinking-cloud vonu-thinking-cloud-a" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-b" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-c" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-d" />

      <span className="vonu-thinking-soft-core" />
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
          transform: translateZ(0);
          overflow: visible;
        }

        .vonu-thinking-cloud {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          transform-origin: center;
          will-change: transform, opacity;
          z-index: 0;
        }

        .vonu-thinking-cloud-a {
          inset: -92%;
          background:
            radial-gradient(
              circle at 30% 38%,
              rgba(37, 99, 235, 0.32) 0%,
              rgba(37, 99, 235, 0.18) 28%,
              rgba(37, 99, 235, 0.04) 58%,
              rgba(37, 99, 235, 0) 74%
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.34));
          opacity: 0.34;
          animation: vonuCloudA 4200ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-b {
          inset: -112%;
          background:
            radial-gradient(
              circle at 68% 34%,
              rgba(16, 185, 129, 0.30) 0%,
              rgba(16, 185, 129, 0.15) 30%,
              rgba(16, 185, 129, 0.035) 58%,
              rgba(16, 185, 129, 0) 76%
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.38));
          opacity: 0.26;
          animation: vonuCloudB 5200ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-c {
          inset: -118%;
          background:
            radial-gradient(
              circle at 42% 72%,
              rgba(245, 158, 11, 0.30) 0%,
              rgba(245, 158, 11, 0.13) 28%,
              rgba(244, 63, 94, 0.07) 54%,
              rgba(244, 63, 94, 0) 76%
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.42));
          opacity: 0.22;
          animation: vonuCloudC 6100ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-d {
          inset: -96%;
          background:
            radial-gradient(
              circle at 58% 56%,
              rgba(14, 165, 233, 0.24) 0%,
              rgba(14, 165, 233, 0.12) 32%,
              rgba(14, 165, 233, 0.03) 60%,
              rgba(14, 165, 233, 0) 78%
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.30));
          opacity: 0.18;
          animation: vonuCloudD 7000ms ease-in-out infinite;
        }

        .vonu-thinking-soft-core {
          position: absolute;
          inset: -16%;
          border-radius: 9999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.78) 0%,
              rgba(255, 255, 255, 0.38) 34%,
              rgba(37, 99, 235, 0.08) 58%,
              rgba(37, 99, 235, 0) 78%
            );
          opacity: 0.56;
          transform: scale(0.96);
          animation: vonuCoreBreathe 2600ms ease-in-out infinite;
          z-index: 1;
        }

        .vonu-thinking-logo {
          position: absolute;
          inset: 0;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;

          /* Ajuste fino: un pelín a la derecha y abajo */
          background-position: calc(50% + 1px) calc(50% + 1px);

          background-size: contain;
          opacity: 0.99;
          transform: translate(1px, 1px) scale(0.94);
          filter:
            drop-shadow(0 1px 3px rgba(15, 23, 42, 0.08))
            drop-shadow(0 0 9px rgba(37, 99, 235, 0.18));
          animation: vonuLogoBreathe 2600ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
          will-change: transform, filter, opacity;
          z-index: 3;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              118deg,
              rgba(255, 255, 255, 0) 10%,
              rgba(255, 255, 255, 0.10) 30%,
              rgba(255, 255, 255, 0.70) 46%,
              rgba(255, 255, 255, 0.16) 62%,
              rgba(255, 255, 255, 0) 84%
            );
          background-size: 280% 280%;
          background-position: 140% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;

          /* Mismo ajuste que el logo para que el brillo encaje */
          -webkit-mask-position: calc(50% + 1px) calc(50% + 1px);
          mask-position: calc(50% + 1px) calc(50% + 1px);

          -webkit-mask-size: contain;
          mask-size: contain;
          opacity: 0;
          mix-blend-mode: screen;
          animation: vonuSheenSweep 3600ms ease-in-out infinite;
          will-change: opacity, background-position;
          z-index: 4;
        }

        @keyframes vonuCloudA {
          0%,
          100% {
            transform: scale(0.76) translate3d(-3%, 2%, 0);
            opacity: 0.18;
          }

          46% {
            transform: scale(1.28) translate3d(2%, -2%, 0);
            opacity: 0.38;
          }

          72% {
            transform: scale(1.06) translate3d(1%, 1%, 0);
            opacity: 0.26;
          }
        }

        @keyframes vonuCloudB {
          0%,
          100% {
            transform: scale(0.72) translate3d(3%, -1%, 0);
            opacity: 0.14;
          }

          50% {
            transform: scale(1.36) translate3d(-2%, 2%, 0);
            opacity: 0.30;
          }

          78% {
            transform: scale(1.02) translate3d(1%, 0, 0);
            opacity: 0.22;
          }
        }

        @keyframes vonuCloudC {
          0%,
          100% {
            transform: scale(0.70) translate3d(0, 3%, 0);
            opacity: 0.12;
          }

          54% {
            transform: scale(1.42) translate3d(1%, -1%, 0);
            opacity: 0.26;
          }

          82% {
            transform: scale(1.04) translate3d(-1%, 1%, 0);
            opacity: 0.18;
          }
        }

        @keyframes vonuCloudD {
          0%,
          100% {
            transform: scale(0.72);
            opacity: 0.10;
          }

          48% {
            transform: scale(1.24);
            opacity: 0.20;
          }

          76% {
            transform: scale(0.98);
            opacity: 0.15;
          }
        }

        @keyframes vonuCoreBreathe {
          0%,
          100% {
            transform: scale(0.90);
            opacity: 0.36;
          }

          50% {
            transform: scale(1.10);
            opacity: 0.72;
          }
        }

        @keyframes vonuLogoBreathe {
          0%,
          100% {
            opacity: 0.94;
            transform: translate(1px, 1px) scale(0.92);
            filter:
              drop-shadow(0 1px 3px rgba(15, 23, 42, 0.07))
              drop-shadow(0 0 7px rgba(37, 99, 235, 0.12));
          }

          46% {
            opacity: 1;
            transform: translate(1px, 1px) scale(1.04);
            filter:
              drop-shadow(0 2px 6px rgba(15, 23, 42, 0.10))
              drop-shadow(0 0 15px rgba(37, 99, 235, 0.26));
          }

          66% {
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
            opacity: 0.42;
          }

          70% {
            opacity: 0;
            background-position: -38% 50%;
          }

          100% {
            opacity: 0;
            background-position: -38% 50%;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking-cloud-a,
          .vonu-thinking-cloud-b,
          .vonu-thinking-cloud-c,
          .vonu-thinking-cloud-d {
            filter: blur(calc(var(--vonu-thinking-size) * 0.30));
          }

          .vonu-thinking-cloud-a {
            inset: -78%;
            opacity: 0.24;
          }

          .vonu-thinking-cloud-b {
            inset: -86%;
            opacity: 0.18;
          }

          .vonu-thinking-cloud-c {
            inset: -90%;
            opacity: 0.15;
          }

          .vonu-thinking-cloud-d {
            inset: -76%;
            opacity: 0.13;
          }

          .vonu-thinking-soft-core {
            inset: -12%;
            animation-duration: 3100ms;
          }

          .vonu-thinking-logo {
            animation-duration: 3100ms;
          }

          .vonu-thinking-sheen {
            animation-duration: 4300ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-cloud,
          .vonu-thinking-soft-core,
          .vonu-thinking-logo,
          .vonu-thinking-sheen {
            animation: none !important;
          }

          .vonu-thinking-cloud-a {
            opacity: 0.20;
            transform: scale(1.12);
          }

          .vonu-thinking-cloud-b {
            opacity: 0.14;
            transform: scale(1.05);
          }

          .vonu-thinking-cloud-c {
            opacity: 0.12;
            transform: scale(1);
          }

          .vonu-thinking-cloud-d {
            opacity: 0.10;
            transform: scale(0.96);
          }

          .vonu-thinking-soft-core {
            opacity: 0.42;
            transform: scale(1);
          }

          .vonu-thinking-logo {
            transform: translate(1px, 1px) scale(0.96);
            opacity: 1;
          }

          .vonu-thinking-sheen {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}