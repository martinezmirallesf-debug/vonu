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
      <span className="vonu-thinking-blob vonu-thinking-blob-a" />
      <span className="vonu-thinking-blob vonu-thinking-blob-b" />
      <span className="vonu-thinking-blob vonu-thinking-blob-c" />

      <span className="vonu-thinking-ring" />
      <span className="vonu-thinking-aura" />
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
          contain: layout paint;
        }

        .vonu-thinking-blob {
          position: absolute;
          inset: -54%;
          border-radius: 999px;
          opacity: 0.55;
          filter: blur(calc(var(--vonu-thinking-size) * 0.28));
          transform-origin: center;
          will-change: transform, opacity;
          z-index: 0;
        }

        .vonu-thinking-blob-a {
          background:
            radial-gradient(
              circle at 34% 34%,
              rgba(37, 99, 235, 0.42) 0%,
              rgba(37, 99, 235, 0.18) 34%,
              rgba(37, 99, 235, 0) 68%
            );
          animation: vonuBlobA 4200ms ease-in-out infinite;
        }

        .vonu-thinking-blob-b {
          background:
            radial-gradient(
              circle at 68% 40%,
              rgba(16, 185, 129, 0.32) 0%,
              rgba(16, 185, 129, 0.13) 36%,
              rgba(16, 185, 129, 0) 70%
            );
          animation: vonuBlobB 5200ms ease-in-out infinite;
        }

        .vonu-thinking-blob-c {
          background:
            radial-gradient(
              circle at 48% 70%,
              rgba(245, 158, 11, 0.28) 0%,
              rgba(244, 63, 94, 0.13) 42%,
              rgba(244, 63, 94, 0) 72%
            );
          animation: vonuBlobC 6100ms ease-in-out infinite;
        }

        .vonu-thinking-ring {
          position: absolute;
          inset: -30%;
          border-radius: 999px;
          background:
            conic-gradient(
              from 160deg,
              rgba(37, 99, 235, 0) 0deg,
              rgba(37, 99, 235, 0.34) 54deg,
              rgba(16, 185, 129, 0.24) 116deg,
              rgba(245, 158, 11, 0.20) 184deg,
              rgba(244, 63, 94, 0.18) 252deg,
              rgba(37, 99, 235, 0.28) 318deg,
              rgba(37, 99, 235, 0) 360deg
            );
          filter: blur(calc(var(--vonu-thinking-size) * 0.12));
          opacity: 0.28;
          animation: vonuRingTurn 7200ms linear infinite;
          will-change: transform, opacity;
          z-index: 1;
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -18%;
          border-radius: 999px;
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.88) 0%,
              rgba(255, 255, 255, 0.46) 32%,
              rgba(37, 99, 235, 0.12) 54%,
              rgba(37, 99, 235, 0) 76%
            );
          opacity: 0.74;
          animation: vonuAuraBreathe 2600ms ease-in-out infinite;
          will-change: transform, opacity;
          z-index: 2;
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
            drop-shadow(0 1px 3px rgba(15, 23, 42, 0.10))
            drop-shadow(0 0 10px rgba(37, 99, 235, 0.18));
          animation: vonuLogoPulse 2600ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
          will-change: transform, filter, opacity;
          z-index: 3;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: -1%;
          background:
            linear-gradient(
              118deg,
              rgba(255, 255, 255, 0) 10%,
              rgba(255, 255, 255, 0.12) 31%,
              rgba(255, 255, 255, 0.78) 46%,
              rgba(255, 255, 255, 0.18) 62%,
              rgba(255, 255, 255, 0) 84%
            );
          background-size: 280% 280%;
          background-position: 140% 50%;
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
          animation: vonuSheenSweep 3600ms ease-in-out infinite;
          will-change: opacity, background-position;
          z-index: 4;
        }

        @keyframes vonuBlobA {
          0%,
          100% {
            transform: scale(0.82);
            opacity: 0.22;
          }

          42% {
            transform: scale(1.28);
            opacity: 0.42;
          }

          70% {
            transform: scale(1.08);
            opacity: 0.32;
          }
        }

        @keyframes vonuBlobB {
          0%,
          100% {
            transform: scale(0.76);
            opacity: 0.16;
          }

          48% {
            transform: scale(1.36);
            opacity: 0.34;
          }

          76% {
            transform: scale(1.02);
            opacity: 0.24;
          }
        }

        @keyframes vonuBlobC {
          0%,
          100% {
            transform: scale(0.72);
            opacity: 0.12;
          }

          52% {
            transform: scale(1.44);
            opacity: 0.27;
          }

          80% {
            transform: scale(1.04);
            opacity: 0.18;
          }
        }

        @keyframes vonuRingTurn {
          0% {
            transform: rotate(0deg) scale(0.94);
            opacity: 0.22;
          }

          50% {
            transform: rotate(180deg) scale(1.04);
            opacity: 0.34;
          }

          100% {
            transform: rotate(360deg) scale(0.94);
            opacity: 0.22;
          }
        }

        @keyframes vonuAuraBreathe {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.48;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.84;
          }
        }

        @keyframes vonuLogoPulse {
          0%,
          100% {
            opacity: 0.94;
            transform: scale(0.91);
            filter:
              drop-shadow(0 1px 3px rgba(15, 23, 42, 0.08))
              drop-shadow(0 0 7px rgba(37, 99, 235, 0.12));
          }

          46% {
            opacity: 1;
            transform: scale(1.04);
            filter:
              drop-shadow(0 2px 6px rgba(15, 23, 42, 0.10))
              drop-shadow(0 0 16px rgba(37, 99, 235, 0.26));
          }

          64% {
            opacity: 1;
            transform: scale(0.99);
          }
        }

        @keyframes vonuSheenSweep {
          0%,
          42% {
            opacity: 0;
            background-position: 140% 50%;
          }

          52% {
            opacity: 0.52;
          }

          68% {
            opacity: 0;
            background-position: -38% 50%;
          }

          100% {
            opacity: 0;
            background-position: -38% 50%;
          }
        }

        @media (max-width: 767px) {
          .vonu-thinking-blob {
            inset: -44%;
            filter: blur(calc(var(--vonu-thinking-size) * 0.22));
            opacity: 0.38;
          }

          .vonu-thinking-ring {
            inset: -24%;
            opacity: 0.22;
            filter: blur(calc(var(--vonu-thinking-size) * 0.10));
            animation-duration: 8200ms;
          }

          .vonu-thinking-aura {
            inset: -14%;
            animation-duration: 3100ms;
          }

          .vonu-thinking-logo {
            animation-duration: 3000ms;
          }

          .vonu-thinking-sheen {
            animation-duration: 4200ms;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-blob,
          .vonu-thinking-ring,
          .vonu-thinking-aura,
          .vonu-thinking-logo,
          .vonu-thinking-sheen {
            animation: none !important;
          }

          .vonu-thinking-blob-a {
            opacity: 0.18;
            transform: scale(1.05);
          }

          .vonu-thinking-blob-b {
            opacity: 0.14;
            transform: scale(1);
          }

          .vonu-thinking-blob-c {
            opacity: 0.10;
            transform: scale(0.96);
          }

          .vonu-thinking-ring {
            opacity: 0.20;
          }

          .vonu-thinking-aura {
            opacity: 0.42;
          }

          .vonu-thinking-logo {
            transform: scale(0.96);
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