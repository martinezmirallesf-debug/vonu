"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

const LOGO_SRC = "/logo/vonu-cube-black.png";

export default function VonuThinking({ size = 26 }: VonuThinkingProps) {
  const uid = React.useId().replace(/:/g, "");
  const beamGradientId = `${uid}-beam-gradient`;
  const sparkGlowId = `${uid}-spark-glow`;

  // Path curvado de precisión que emula exactamente la silueta exterior e interior del logo VonuAI
  const vonuLogoPath = "M 16,27 C 22,27 28,34 33,45 C 39,59 44,73 50,73 C 54,73 56,69 58,63 L 84,27 C 78,28 72,35 67,46 C 61,58 56,66 52,62 L 31,33 C 26,29 21,27 16,27 Z";

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
      {/* Aura sutil de fondo */}
      <span className="vonu-thinking-aura" />
      
      {/* Isotipo Oficial VonuAI */}
      <span className="vonu-thinking-logo-base" />

      {/* Capa del haz de luz y destello camaleónico */}
      <svg
        className="vonu-thinking-beam-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Gradiente cromático continuo para el cambio de color ambiental */}
          <linearGradient id={beamGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Filtro premium de súper destello: genera el resplandor de alta intensidad */}
          <filter id={sparkGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="bigBlur" />
            <feGaussianBlur stdDeviation="1.5" result="intenseBlur" />
            <feComponentTransfer in="bigBlur" result="boostGlow">
              <feFuncA type="linear" slope="2.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boostGlow" />
              <feMergeNode in="intenseBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Micro-estela trasera para evitar cortes abruptos de luz */}
        <path
          className="spark spark-trail"
          d={vonuLogoPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
        />

        {/* 2. El punto de luz: Ahora híper concentrado con un glow envolvente */}
        <path
          className="spark spark-flare"
          d={vonuLogoPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
          filter={`url(#${sparkGlowId})`}
        />

        {/* 3. Núcleo incandescente: Centro blanco puro, diminuto y súper brillante */}
        <path
          className="spark spark-core"
          d={vonuLogoPath}
          pathLength="100"
          stroke="#ffffff"
        />
      </svg>

      {/* Brillo de barrido interno opcional */}
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
          /* AJUSTE FINAL SOLICITADO: Desplaza todo el componente un pelito más (un pixel más) a la derecha y abajo */
          transform: translate3d(2.5px, 2.5px, 0);
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -10%;
          border-radius: 50%;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.12) 0%,
            rgba(59, 130, 246, 0) 70%
          );
          mix-blend-mode: plus-lighter;
        }

        .vonu-thinking-logo-base {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }

        .vonu-thinking-beam-layer {
          position: absolute;
          /* Ampliado el margen exterior para que el nuevo mega-glow no sufra recortes en las cajas contenedoras */
          inset: -40%;
          width: 180%;
          height: 180%;
          z-index: 2;
          pointer-events: none;
          overflow: visible;
          mix-blend-mode: screen;
        }

        .spark {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          will-change: stroke-dashoffset;
          animation: vonuSparkFlight 2200ms linear infinite;
        }

        /* Estela ultracorta que evita el efecto gusano alargado */
        .spark-trail {
          stroke-width: 2.5;
          stroke-dasharray: 4 96;
          opacity: 0.35;
        }

        /* El punto de luz principal: Ahora es una chispa esférica densa */
        .spark-flare {
          stroke-width: 6.5;
          /* Al bajar a 1.5, la energía se concentra en un píxel esférico hiperbrillante */
          stroke-dasharray: 1.5 98.5;
          opacity: 1;
        }

        /* Núcleo blanco del centro del orbe */
        .spark-core {
          stroke-width: 2.8;
          stroke-dasharray: 0.1 99.9;
          opacity: 1;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 60%
          );
          background-size: 300% 300%;
          background-position: 150% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-size: contain;
          -webkit-mask-position: center;
          mix-blend-mode: overlay;
          animation: vonuSheenSweep 4000ms ease-in-out infinite;
        }

        @keyframes vonuSparkFlight {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes vonuSheenSweep {
          0%, 70% {
            background-position: 150% 50%;
          }
          100% {
            background-position: -50% 50%;
          }
        }

        @media (max-width: 768px) {
          .vonu-thinking-beam-layer {
            inset: -30%;
            width: 160%;
            height: 160%;
          }
          .spark-flare {
            stroke-width: 5;
            filter: drop-shadow(0 0 6px rgba(255,255,255,0.9));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spark, .vonu-thinking-sheen {
            animation: none !important;
          }
          .spark-flare, .spark-core, .spark-trail {
            stroke-dashoffset: 38;
          }
        }
      `}</style>
    </span>
  );
}