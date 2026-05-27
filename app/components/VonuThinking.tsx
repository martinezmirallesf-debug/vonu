"use client";

import React from "react";

type VonuThinkingProps = {
  size?: number;
};

// Asumiendo que esta es la ruta del logo azul que se ve en la imagen,
// para que el fade-in sea sobre el logo correcto.
const LOGO_SRC = "/logo/vonu-cube-blue.png";

export default function AdvancedVonuThinking({ size = 32 }: VonuThinkingProps) {
  return (
    <span
      className="vonu-container"
      style={
        {
          "--v-size": `${size}px`,
          "--v-logo": `url("${LOGO_SRC}")`,
          // --- PUNTO 1: AJUSTE DE POSICIÓN ---
          // Estos valores mueven el contenedor completo (plasma + logo)
          // hacia la derecha y hacia abajo para cuadrar con el estático.
          "--v-offset-x": "4px", // Ajuste hacia la derecha
          "--v-offset-y": "6px", // Ajuste hacia abajo
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {/* --- PUNTO 2: CONTENEDOR DE PRESENCIA --- */}
      {/* Esta nueva capa controla el efecto de entrada suave */}
      <span className="vonu-presence">
        {/* NÚCLEO BIOMÓRFICO */}
        <span className="vonu-plasma vonu-plasma-1" />
        <span className="vonu-plasma vonu-plasma-2" />
        <span className="vonu-plasma vonu-plasma-3" />

        {/* AURA CUÁNTICA */}
        <span className="vonu-quantum-aura" />

        {/* CONTENEDOR DEL LOGO REFRIGERADO POR LUZ */}
        <span className="vonu-logo-wrapper">
          <span className="vonu-logo-graphic" />
          <span className="vonu-logo-chromatic" />
        </span>
      </span>

      <style jsx>{`
        .vonu-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--v-size);
          height: var(--v-size);
          flex: 0 0 auto;
          /* --- APLICACIÓN DEL AJUSTE DE POSICIÓN --- */
          /* Mueve el punto de origen de la animación completa */
          transform: translateZ(0) translate(var(--v-offset-x), var(--v-offset-y));
          isolation: isolate;
        }

        /* --- ESTILO DE LA CAPA DE PRESENCIA (Entrada Suave) --- */
        .vonu-presence {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Animación de entrada única: 600ms de fade-in y escala */
          animation: vonuPresenceIn 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
          will-change: opacity, transform;
        }

        /* --- RESTO DEL CÓDIGO (Plasma, Aura, Logo, Animaciones base) SIN CAMBIOS --- */

        .vonu-plasma {
          position: absolute;
          inset: -50%;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          filter: blur(calc(var(--v-size) * 0.28));
          mix-blend-mode: screen;
          will-change: transform, border-radius;
        }

        .vonu-plasma-1 {
          background: conic-gradient(from 0deg, #4285f4, #1a73e8, transparent, #4285f4);
          animation: morphFluid 7000ms ease-in-out infinite alternate, rotateFluid 11000ms linear infinite;
          opacity: 0.55;
        }

        .vonu-plasma-2 {
          background: conic-gradient(from 120deg, #34a853, #00f2fe, transparent, #34a853);
          animation: morphFluid 5000ms ease-in-out infinite alternate-reverse, rotateFluid 8000ms linear infinite reverse;
          opacity: 0.45;
          scale: 0.95;
        }

        .vonu-plasma-3 {
          background: radial-gradient(circle, #ea4335 0%, #fbbc05 40%, transparent 70%);
          animation: quantumPulse 3300ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
          opacity: 0.35;
        }

        .vonu-quantum-aura {
          position: absolute;
          inset: -30%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,115,232,0.15) 0%, rgba(0,242,254,0.05) 50%, transparent 100%);
          animation: auraBreathe 4400ms ease-in-out infinite;
          will-change: transform, opacity;
        }

        .vonu-logo-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoFloat 3500ms ease-in-out infinite;
          will-change: transform;
          z-index: 5;
        }

        .vonu-logo-graphic {
          position: absolute;
          inset: 0;
          background-image: var(--v-logo);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          filter: drop-shadow(0 4px 12px rgba(26, 115, 232, 0.25));
          z-index: 2;
        }

        .vonu-logo-chromatic {
          position: absolute;
          inset: -2px;
          background-image: var(--v-logo);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          mix-blend-mode: color-dodge;
          opacity: 0;
          filter: brightness(2) blur(1px);
          animation: chromaticAberration 6000ms ease-in-out infinite;
          z-index: 1;
        }

        /* --- ANIMACIONES BASE --- */
        
        @keyframes morphFluid {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: scale(0.92); }
          50% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; transform: scale(1.08) skewX(3deg); }
          100% { border-radius: 50% 50% 30% 70% / 35% 65% 35% 65%; transform: scale(0.95) skewY(-2deg); }
        }

        @keyframes rotateFluid { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes quantumPulse { 0%, 100% { transform: scale(0.88); opacity: 0.25; } 50% { transform: scale(1.15); opacity: 0.5; } }
        @keyframes auraBreathe { 0%, 100% { transform: scale(0.95); opacity: 0.4; } 50% { transform: scale(1.08); opacity: 0.8; } }
        @keyframes logoFloat { 0%, 100% { transform: translateY(0) scale(0.96); } 50% { transform: translateY(-3%) scale(1.02); } }
        @keyframes chromaticAberration { 
          0%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
          30% { opacity: 0.7; transform: scale(1.04) translate(1px, -1px); filter: hue-rotate(90deg) brightness(2); }
          35% { opacity: 0.2; transform: scale(0.98) translate(-1px, 1px); }
          40% { opacity: 0.8; transform: scale(1.02) translate(0, 0); filter: hue-rotate(0deg) brightness(2.5); }
          45% { opacity: 0; transform: scale(1); }
        }

        /* --- NUEVA ANIMACIÓN DE ENTRADA --- */
        @keyframes vonuPresenceIn {
          0% {
            opacity: 0;
            transform: scale(0.8); /* Empieza más pequeño */
          }
          100% {
            opacity: 1;
            transform: scale(1); /* Escala normal final */
          }
        }

        /* Accesibilidad total */
        @media (prefers-reduced-motion: reduce) {
          .vonu-presence { animation: none !important; opacity: 1; transform: scale(1); }
          .vonu-plasma, .vonu-quantum-aura, .vonu-logo-wrapper, .vonu-logo-chromatic { animation: none !important; }
          .vonu-plasma-1 { opacity: 0.3; border-radius: 50%; transform: scale(1); }
          .vonu-plasma-2, .vonu-plasma-3, .vonu-logo-chromatic { display: none; }
        }
      `}</style>
    </span>
  );
}