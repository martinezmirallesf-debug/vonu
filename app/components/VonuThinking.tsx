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

  // Path simétrico optimizado en una matriz de 100x100 que calca el contorno de una "V" estilizada.
  const vContourPath = "M 18,15 L 43,76 C 46,83 54,83 57,76 L 82,15";

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
      {/* Fondo de apoyo sutil sin saturar */}
      <span className="vonu-thinking-aura" />
      
      {/* Isotipo Base Limpio */}
      <span className="vonu-thinking-logo-base" />

      {/* Capa de Energía: Capas SVG superpuestas para intensidad lumínica y estela */}
      <svg
        className="vonu-thinking-beam-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          {/* Gradiente de alto contraste con los 5 colores solicitados */}
          <linearGradient
            id={beamGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ef4444" />    {/* Rojo */}
            <stop offset="25%" stopColor="#f97316" />   {/* Naranja */}
            <stop offset="50%" stopColor="#22c55e" />   {/* Verde */}
            <stop offset="75%" stopColor="#facc15" />   {/* Amarillo */}
            <stop offset="100%" stopColor="#3b82f6" />  {/* Azul */}
          </linearGradient>

          {/* Filtro de brillo avanzado de alto rendimiento */}
          <filter
            id={beamGlowId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="1.8" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Resplandor Exterior Suave (Estela de energía amplia) */}
        <path
          className="beam beam-glow"
          d={vContourPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
          filter={`url(#${beamGlowId})`}
        />

        {/* 2. Haz de Luz Principal (El cuerpo del cometa) */}
        <path
          className="beam beam-main"
          d={vContourPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
        />

        {/* 3. Núcleo Incandescente (Efecto premium hiper-brillante central) */}
        <path
          className="beam beam-core"
          d={vContourPath}
          pathLength="100"
          stroke="#ffffff"
        />
      </svg>

      {/* Destello metálico que barre el logo en sincronía */}
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
          /* Corrección de alineación del icono chat + 1px derecho */
          transform: translate3d(1px, 0, 0); 
        }

        .vonu-thinking-aura {
          position: absolute;
          inset: -15%;
          border-radius: 50%;
          z-index: 0;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(59, 130, 246, 0) 70%
          );
          opacity: 0.6;
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
          opacity: 1;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.16));
        }

        .vonu-thinking-beam-layer {
          position: absolute;
          inset: -20%; 
          width: 140%;
          height: 140%;
          z-index: 2;
          pointer-events: none;
          overflow: visible;
          mix-blend-mode: screen;
        }

        .beam {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          will-change: stroke-dashoffset;
          animation: vonuBeamMotion 1800ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .beam-glow {
          stroke-width: 10;
          stroke-dasharray: 25 100; 
          opacity: 0.65;
        }

        .beam-main {
          stroke-width: 5;
          stroke-dasharray: 20 100;
          opacity: 0.95;
          }

        .beam-core {
          stroke-width: 2;
          stroke-dasharray: 10 100;
          opacity: 1;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 70%
          );
          background-size: 300% 300%;
          background-position: 150% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-size: contain;
          -webkit-mask-position: center;
          mix-blend-mode: overlay;
          animation: vonuSheenSweep 3600ms ease-in-out infinite;
        }

        @keyframes vonuBeamMotion {
          0% {
            stroke-dashoffset: 125;
          }
          100% {
            stroke-dashoffset: -25;
          }
        }

        @keyframes vonuSheenSweep {
          0%, 60% {
            background-position: 150% 50%;
          }
          100% {
            background-position: -50% 50%;
          }
        }

        @media (max-width: 768px) {
          .vonu-thinking-beam-layer {
            inset: -10%;
            width: 120%;
            height: 120%;
          }
          .beam-glow {
            stroke-width: 8;
            filter: none; 
            opacity: 0.4;
          }
          .beam-main {
            stroke-width: 4.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .beam, .vonu-thinking-sheen {
            animation: none !important;
          }
          .beam-glow, .beam-main, .beam-core {
            stroke-dashoffset: 50; 
          }
          .beam-glow { opacity: 0.3; }
        }
      `}</style>
    </span>
  );
}