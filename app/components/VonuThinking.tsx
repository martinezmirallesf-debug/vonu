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

        /* 1. SEPARACIÓN DE ANIMACIONES Y DESFASE DE TIEMPOS */
        .vonu-thinking-spectrum {
          position: absolute;
          inset: -42%;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            rgba(66, 133, 244, 0) 0deg,
            rgba(66, 133, 244, 0.3) 45deg,
            rgba(52, 168, 83, 0.25) 110deg,
            rgba(251, 188, 5, 0.28) 180deg,
            rgba(234, 67, 53, 0.25) 250deg,
            rgba(66, 133, 244, 0.3) 320deg,
            rgba(66, 133, 244, 0) 360deg
          );
          /* Incrementado un poco el desenfoque base estático */
          filter: blur(calc(var(--vonu-thinking-size) * 0.25));
          opacity: 0.5;
          /* Combinamos rotación continua y pulso con tiempos asíncronos (4200ms y 3100ms) */
          animation: 
            vonuSpectrumSpin 5000ms linear infinite,
            vonuSpectrumPulse 3100ms ease-in-out infinite;
          will-change: transform;
          z-index: 0;
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -26%;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(26, 115, 232, 0.22) 0%,
            rgba(26, 115, 232, 0.12) 40%,
            rgba(26, 115, 232, 0.04) 65%,
            rgba(26, 115, 232, 0) 80%
          );
          /* Tiempo desfasado (2700ms) para romper la simetría */
          animation: vonuAuraPulse 2700ms ease-in-out infinite;
          will-change: transform;
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
          /* Quitamos la animación de filtros pesados y usamos un drop-shadow fijo y limpio */
          filter: drop-shadow(0 2px 8px rgba(26, 115, 232, 0.16));
          animation: vonuLogoBreathe 2100ms ease-in-out infinite;
          will-change: transform;
          z-index: 2;
        }

        .vonu-thinking-light {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 15%,
            rgba(255, 255, 255, 0.25) 35%,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0.2) 65%,
            rgba(255, 255, 255, 0) 85%
          );
          background-size: 260% 260%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
          mix-blend-mode: overlay; /* 'overlay' o 'color-dodge' suelen integrarse mejor que 'screen' con fondos oscuros/claros */
          animation: vonuLogoSweep 4000ms cubic-bezier(0.25, 1, 0.5, 1) infinite;
          will-change: background-position;
          z-index: 3;
        }

        /* 2. OPTIMIZACIÓN DE KEYFRAMES (Sólo transformaciones de GPU) */
        @keyframes vonuSpectrumSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Separamos el cambio de escala del de rotación para evitar saltos bruscos */
        @keyframes vonuSpectrumPulse {
          0%, 100% {
            transform: scale(0.85);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes vonuAuraPulse {
          0%, 100% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes vonuLogoBreathe {
          0%, 100% {
            transform: scale(0.94);
          }
          50% {
            transform: scale(1.02);
          }
        }

        /* Un barrido con una curva bezier más elegante (rápido al principio, suave al final) */
        @keyframes vonuLogoSweep {
          0% {
            background-position: 150% 50%;
          }
          40%, 100% {
            background-position: -60% 50%;
          }
        }

        /* Responsive */
        @media (max-width: 767px) {
          .vonu-thinking-spectrum {
            inset: -34%;
            filter: blur(calc(var(--vonu-thinking-size) * 0.2));
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-spectrum,
          .vonu-thinking-aura,
          .vonu-thinking-logo,
          .vonu-thinking-light {
            animation: none !important;
          }
          .vonu-thinking-spectrum { opacity: 0.25; transform: scale(0.9); }
          .vonu-thinking-aura { opacity: 0.4; transform: scale(1); }
          .vonu-thinking-logo { transform: scale(1); }
          .vonu-thinking-light { display: none; }
        }
      `}</style>
    </span>
  );
}