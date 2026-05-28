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
      {/* 1. Nubes de fondo (Auroras de color muy difuminadas) */}
      <span className="vonu-thinking-cloud vonu-thinking-cloud-a" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-b" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-c" />
      <span className="vonu-thinking-cloud vonu-thinking-cloud-d" />

      {/* 2. El rastro / Estela de la imagen (Efecto Eco de atrás hacia adelante) */}
      <span className="vonu-trail vonu-trail-1" />
      <span className="vonu-trail vonu-trail-2" />
      <span className="vonu-trail vonu-trail-3" />

      {/* 3. Núcleo central de luz */}
      <span className="vonu-thinking-soft-core" />

      {/* 4. Logo principal al frente */}
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

        /* --- NUBES / AURORAS DE FONDO --- */
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
          background: radial-gradient(
            circle at 30% 38%,
            rgba(37, 99, 235, 0.35) 0%,
            rgba(244, 63, 94, 0.2) 40%,
            rgba(37, 99, 235, 0) 74%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.34));
          opacity: 0.4;
          animation: vonuCloudA 4800ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-b {
          inset: -112%;
          background: radial-gradient(
            circle at 68% 34%,
            rgba(16, 185, 129, 0.3) 0%,
            rgba(245, 158, 11, 0.15) 45%,
            rgba(16, 185, 129, 0) 76%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.38));
          opacity: 0.3;
          animation: vonuCloudB 5800ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-c {
          inset: -118%;
          background: radial-gradient(
            circle at 42% 72%,
            rgba(245, 158, 11, 0.35) 0%,
            rgba(244, 63, 94, 0.2) 40%,
            rgba(244, 63, 94, 0) 76%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.42));
          opacity: 0.25;
          animation: vonuCloudC 6600ms ease-in-out infinite;
        }

        .vonu-thinking-cloud-d {
          inset: -96%;
          background: radial-gradient(
            circle at 58% 56%,
            rgba(14, 165, 233, 0.25) 0%,
            rgba(37, 99, 235, 0.1) 50%,
            rgba(14, 165, 233, 0) 78%
          );
          filter: blur(calc(var(--vonu-thinking-size) * 0.30));
          opacity: 0.2;
          animation: vonuCloudD 7500ms ease-in-out infinite;
        }

        /* --- EFECTO ECO / RASTRO (LA MAGIA DE LA IMAGEN) --- */
        .vonu-trail {
          position: absolute;
          inset: 0;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          will-change: transform, opacity, filter;
          z-index: 2;
        }

        /* Clon más lejano (Izquierda, pequeño, muy difuminado y colorido) */
        .vonu-trail-1 {
          opacity: 0.4;
          filter: 
            drop-shadow(-15px -10px 12px rgba(244, 63, 94, 0.6)) 
            drop-shadow(-5px 5px 8px rgba(16, 185, 129, 0.5))
            blur(2px);
          animation: vonuTrail1 3200ms ease-in-out infinite;
        }

        /* Clon intermedio (Transición de tamaño y posición) */
        .vonu-trail-2 {
          opacity: 0.6;
          filter: 
            drop-shadow(-10px -5px 10px rgba(245, 158, 11, 0.5)) 
            drop-shadow(-2px 4px 6px rgba(14, 165, 233, 0.5))
            blur(1px);
          animation: vonuTrail2 3200ms ease-in-out infinite;
        }

        /* Clon más cercano (Casi acoplado al principal, azulado/verdoso) */
        .vonu-trail-3 {
          opacity: 0.75;
          filter: 
            drop-shadow(-5px -2px 8px rgba(37, 99, 235, 0.4))
            drop-shadow(-1px 3px 5px rgba(16, 185, 129, 0.4));
          animation: vonuTrail3 3200ms ease-in-out infinite;
        }

        /* --- NÚCLEO Y LOGO PRINCIPAL --- */
        .vonu-thinking-soft-core {
          position: absolute;
          inset: -20%;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(14, 165, 233, 0.2) 40%,
            rgba(37, 99, 235, 0) 70%
          );
          opacity: 0.6;
          animation: vonuCoreBreathe 2600ms ease-in-out infinite;
          z-index: 3;
        }

        .vonu-thinking-logo {
          position: absolute;
          inset: 0;
          background-image: var(--vonu-thinking-logo);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 1;
          filter:
            drop-shadow(0 2px 4px rgba(15, 23, 42, 0.15))
            drop-shadow(0 0 12px rgba(37, 99, 235, 0.3));
          animation: vonuLogoMain 3200ms cubic-bezier(0.45, 0, 0.55, 1) infinite;
          will-change: transform, filter;
          z-index: 4;
        }

        .vonu-thinking-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            118deg,
            rgba(255, 255, 255, 0) 15%,
            rgba(255, 255, 255, 0.6) 46%,
            rgba(255, 255, 255, 0) 75%
          );
          background-size: 200% 200%;
          background-position: 140% 50%;
          -webkit-mask-image: var(--vonu-thinking-logo);
          mask-image: var(--vonu-thinking-logo);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
          mix-blend-mode: screen;
          animation: vonuSheenSweep 3200ms ease-in-out infinite;
          z-index: 5;
        }

        /* --- ANIMACIONES (KEYFRAMES) --- */
        
        /* Movimiento sincronizado del rastro (De atrás hacia adelante) */
        @keyframes vonuTrail1 {
          0%, 100% { transform: translate3d(-32px, -14px, 0) scale(0.55); }
          50%      { transform: translate3d(-26px, -10px, 0) scale(0.60); }
        }

        @keyframes vonuTrail2 {
          0%, 100% { transform: translate3d(-18px, -8px, 0) scale(0.72); }
          50%      { transform: translate3d(-14px, -5px, 0) scale(0.76); }
        }

        @keyframes vonuTrail3 {
          0%, 100% { transform: translate3d(-8px, -3px, 0) scale(0.86); }
          50%      { transform: translate3d(-5px, -1px, 0) scale(0.89); }
        }

        @keyframes vonuLogoMain {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.98); }
          50%      { transform: translate3d(2px, 2px, 0) scale(1.02); }
        }

        /* Respiración de las nubes y el núcleo */
        @keyframes vonuCloudA {
          0%, 100% { transform: scale(0.8) translate3d(-4%, 2%, 0); opacity: 0.25; }
          50%      { transform: scale(1.1) translate3d(2%, -2%, 0); opacity: 0.45; }
        }
        @keyframes vonuCloudB {
          0%, 100% { transform: scale(0.85) translate3d(3%, -2%, 0); opacity: 0.2; }
          50%      { transform: scale(1.15) translate3d(-2%, 3%, 0); opacity: 0.35; }
        }
        @keyframes vonuCloudC {
          0%, 100% { transform: scale(0.8) translate3d(-2%, -3%, 0); opacity: 0.18; }
          50%      { transform: scale(1.2) translate3d(3%, 1%, 0); opacity: 0.3; }
        }
        @keyframes vonuCloudD {
          0%, 100% { transform: scale(0.9); opacity: 0.15; }
          50%      { transform: scale(1.1); opacity: 0.25; }
        }

        @keyframes vonuCoreBreathe {
          0%, 100% { transform: scale(0.92); opacity: 0.4; }
          50%      { transform: scale(1.08); opacity: 0.7; }
        }

        @keyframes vonuSheenSweep {
          0%, 30% { background-position: 140% 50%; opacity: 0; }
          50%     { opacity: 0.5; }
          70%, 100% { background-position: -40% 50%; opacity: 0; }
        }

        /* --- RESPONSIVE Y ACCESIBILIDAD --- */
        @media (max-width: 767px) {
          .vonu-trail-1 { transform: translate3d(-22px, -10px, 0) scale(0.6); }
          .vonu-trail-2 { transform: translate3d(-12px, -5px, 0) scale(0.75); }
          .vonu-trail-3 { transform: translate3d(-5px, -2px, 0) scale(0.88); }
          @keyframes vonuTrail1 { 0%, 100%{transform: translate3d(-22px,-10px,0) scale(0.6);} 50%{transform: translate3d(-18px,-7px,0) scale(0.65);} }
          @keyframes vonuTrail2 { 0%, 100%{transform: translate3d(-12px,-5px,0) scale(0.75);} 50%{transform: translate3d(-9px,-3px,0) scale(0.79);} }
          @keyframes vonuTrail3 { 0%, 100%{transform: translate3d(-5px,-2px,0) scale(0.88);} 50%{transform: translate3d(-3px,-1px,0) scale(0.91);} }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-thinking-cloud, .vonu-trail, .vonu-thinking-soft-core, .vonu-thinking-logo, .vonu-thinking-sheen {
            animation: none !important;
          }
          .vonu-trail-1 { transform: translate3d(-30px, -12px, 0) scale(0.6); }
          .vonu-trail-2 { transform: translate3d(-18px, -7px, 0) scale(0.75); }
          .vonu-trail-3 { transform: translate3d(-8px, -3px, 0) scale(0.88); }
        }
      `}</style>
    </span>
  );
}