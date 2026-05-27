"use client";

import React, { useEffect, useState } from "react";

type VonuThinkingProps = {
  size?: number;
  isThinking?: boolean; // Nueva prop para controlar el estado externamente
};

const LOGO_SRC = "/logo/vonu-cube-blue.png";

export default function AdvancedVonuThinking({ 
  size = 32, 
  isThinking = true // Por defecto lo dejamos en true por si lo usas directamente
}: VonuThinkingProps) {
  
  // Estado local para manejar el renderizado durante la animación de salida
  const [shouldRender, setShouldRender] = useState(isThinking);

  useEffect(() => {
    if (isThinking) {
      setShouldRender(true);
    }
  }, [isThinking]);

  // Si no está pensando y terminó la animación de desvanecimiento, no renderizamos el plasma
  if (!shouldRender && !isThinking) {
    // Aquí puedes renderizar simplemente tu logo estático normal si quieres
    return (
      <span 
        className="vonu-static-logo" 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url("${LOGO_SRC}")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'inline-flex'
        }}
      />
    );
  }

  return (
    <span
      className={`vonu-container ${isThinking ? "state-thinking" : "state-fading-out"}`}
      style={
        {
          "--v-size": `${size}px`,
          "--v-logo": `url("${LOGO_SRC}")`,
          "--v-offset-x": "4px", 
          "--v-offset-y": "6px", 
        } as React.CSSProperties
      }
      aria-hidden="true"
      onAnimationEnd={(e) => {
        // Cuando la animación de desvanecimiento ("vonuPresenceOut") termina, limpiamos el componente
        if (e.animationName === "vonuPresenceOut") {
          setShouldRender(false);
        }
      }}
    >
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
          transform: translateZ(0) translate(var(--v-offset-x), var(--v-offset-y));
          isolation: isolate;
        }

        /* --- CONTROL DE ANIMACIONES POR ESTADO --- */
        
        /* Estado 1: Pensando (Entrada y Loop Orgánico) */
        .state-thinking .vonu-presence {
          animation: vonuPresenceIn 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        /* Estado 2: Desvanecimiento (Salida fluida) */
        .state-fading-out .vonu-presence {
          /* Hacemos un fade out un poco más largo (800ms) para que sea súper suave */
          animation: vonuPresenceOut 800ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Reducimos la intensidad de los bucles de plasma durante la salida para que mueran gradualmente */
        .state-fading-out .vonu-plasma,
        .state-fading-out .vonu-quantum-aura,
        .state-fading-out .vonu-logo-chromatic {
          transition: opacity 600ms ease;
          opacity: 0 !important;
        }

        /* --- RESTO DE CAPAS --- */
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

        .state-fading-out .vonu-logo-wrapper {
          /* En la salida, estabilizamos el logo suavemente quitándole el balanceo */
          animation: vonuLogoStabilize 800ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
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

        /* --- KEYFRAMES --- */
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

        /* Entrada: Fade-in rápido con un sutil escalado hacia arriba */
        @keyframes vonuPresenceIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* NUEVA: Salida cinematográfica (Fade-out del aura y el plasma) */
        @keyframes vonuPresenceOut {
          0% { opacity: 1; }
          100% { 
            opacity: 1; /* El contenedor se queda visible pero el CSS interno apaga las luces */
          }
        }

        /* NUEVA: Devuelve el logo a su posición y tamaño base sin saltos */
        @keyframes vonuLogoStabilize {
          0% { transform: translateY(0) scale(0.96); }
          100% { transform: translateY(0) scale(1); }
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