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
          {/* Gradiente cromático continuo (Rojo -> Naranja -> Verde -> Amarillo -> Azul) */}
          <linearGradient id={beamGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Filtro premium de destello: expande el brillo e incrementa la saturación del color */}
          <filter id={sparkGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur1" />
            <feGaussianBlur stdDeviation="1.2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Estela de color trasera: cambia de tono según su posición en el gradiente */}
        <path
          className="spark spark-trail"
          d={vonuLogoPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
        />

        {/* 2. El punto hiperbrillante: un segmento muy corto con un glow masivo */}
        <path
          className="spark spark-flare"
          d={vonuLogoPath}
          pathLength="100"
          stroke={`url(#${beamGradientId})`}
          filter={`url(#${sparkGlowId})`}
        />

        {/* 3. Núcleo incandescente: el centro blanco puro que le da el aspecto de "estrella/cometa" */}
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
          /* Desplazamiento de 1px a la derecha solicitado para balancear el chat */
          transform: translate3d(1px, 0, 0);
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
          /* Dejamos margen exterior para que el punto brillante refleje fuera del contorno libremente */
          inset: -30%;
          width: 160%;
          height: 160%;
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
          /* Ajuste de velocidad: 2.2 segundos para mantener el tono premium e hipnótico */
          animation: vonuSparkFlight 2200ms linear infinite;
        }

        /* Estela sutil que va dejando el punto de luz */
        .spark-trail {
          stroke-width: 3.5;
          stroke-dasharray: 12 88;
          opacity: 0.45;
        }

        /* El haz/cometa brillante principal */
        .spark-flare {
          stroke-width: 5;
          /* Un dash corto (6 sobre 100) crea el efecto de un "punto" viajando en lugar de una línea larga */
          stroke-dasharray: 6 94;
          opacity: 1;
        }

        /* El núcleo blanco superbrillante */
        .spark-core {
          stroke-width: 1.8;
          stroke-dasharray: 3 97;
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

        /* Animación cíclica perfecta del punto de luz */
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

        /* Optimización de hardware para pantallas pequeñas / móviles */
        @media (max-width: 768px) {
          .vonu-thinking-beam-layer {
            inset: -20%;
            width: 140%;
            height: 140%;
          }
          .spark-flare {
            stroke-width: 4;
            filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
          }
        }

        /* Accesibilidad completa */
        @media (prefers-reduced-motion: reduce) {
          .spark, .vonu-thinking-sheen {
            animation: none !important;
          }
          .spark-flare, .spark-core, .spark-trail {
            /* Se detiene fijando el punto brillante justo en la curva inferior */
            stroke-dashoffset: 38;
          }
        }
      `}</style>
    </span>
  );
}