"use client";

const sparks = Array.from({ length: 16 }, (_, index) => index + 1);

export default function VonuAmbientAura() {
  return (
    <div className="vonu-ambient-aura" aria-hidden="true">
      <div className="vonu-aura-wash" />
      <div className="vonu-aura-ribbon ribbon-a" />
      <div className="vonu-aura-ribbon ribbon-b" />
      <div className="vonu-aura-edge edge-a" />
      <div className="vonu-aura-edge edge-b" />
      <div className="vonu-aura-edge edge-c" />

      <div className="vonu-aura-sparks">
        {sparks.map((n) => (
          <span key={n} className={`spark spark-${n}`} />
        ))}
      </div>

      <style jsx>{`
        .vonu-ambient-aura {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          transform: translateZ(0);
          opacity: 1;
          background:
            radial-gradient(circle at 8% 18%, rgba(26, 115, 232, 0.13), transparent 34%),
            radial-gradient(circle at 88% 18%, rgba(123, 92, 255, 0.11), transparent 34%),
            radial-gradient(circle at 18% 86%, rgba(0, 201, 131, 0.1), transparent 32%),
            radial-gradient(circle at 84% 82%, rgba(255, 138, 0, 0.09), transparent 34%);
        }

        .vonu-aura-wash {
          position: absolute;
          inset: -18%;
          background:
            radial-gradient(circle at 12% 24%, rgba(26, 115, 232, 0.18), transparent 33%),
            radial-gradient(circle at 82% 22%, rgba(123, 92, 255, 0.15), transparent 32%),
            radial-gradient(circle at 18% 78%, rgba(0, 201, 131, 0.13), transparent 34%),
            radial-gradient(circle at 82% 80%, rgba(255, 138, 0, 0.11), transparent 34%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.72), transparent 56%);
          filter: blur(28px) saturate(1.12);
          opacity: 0.94;
          animation: vonuAuraWash 18s ease-in-out infinite;
        }

        .vonu-aura-ribbon {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(1180px, 130vw);
          height: min(820px, 94vh);
          border-radius: 42% 58% 52% 48% / 45% 48% 52% 55%;
          background:
            conic-gradient(
              from 120deg,
              rgba(26, 115, 232, 0) 0deg,
              rgba(26, 115, 232, 0.2) 58deg,
              rgba(0, 201, 131, 0.15) 130deg,
              rgba(255, 138, 0, 0.12) 205deg,
              rgba(123, 92, 255, 0.18) 282deg,
              rgba(26, 115, 232, 0) 360deg
            );
          filter: blur(46px) saturate(1.28);
          opacity: 0.34;
          mix-blend-mode: multiply;
          mask-image: radial-gradient(circle at 50% 50%, black 0%, black 54%, transparent 76%);
          transform: translate(-50%, -50%) rotate(0deg) scale(1);
        }

        .ribbon-a {
          animation: vonuRibbonA 26s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .ribbon-b {
          width: min(980px, 116vw);
          height: min(700px, 82vh);
          opacity: 0.22;
          filter: blur(58px) saturate(1.18);
          animation: vonuRibbonB 32s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }

        .vonu-aura-edge {
          position: absolute;
          border-radius: 9999px;
          filter: blur(34px);
          opacity: 0.34;
          transform: translateZ(0);
        }

        .edge-a {
          left: -10%;
          top: 10%;
          width: 420px;
          height: 420px;
          background: rgba(26, 115, 232, 0.2);
          animation: vonuEdgeA 18s ease-in-out infinite;
        }

        .edge-b {
          right: -10%;
          top: 8%;
          width: 400px;
          height: 400px;
          background: rgba(123, 92, 255, 0.18);
          animation: vonuEdgeB 20s ease-in-out infinite;
        }

        .edge-c {
          left: 38%;
          bottom: -16%;
          width: 520px;
          height: 520px;
          background:
            radial-gradient(circle, rgba(0, 201, 131, 0.18), transparent 62%),
            radial-gradient(circle at 70% 40%, rgba(255, 138, 0, 0.13), transparent 58%);
          animation: vonuEdgeC 22s ease-in-out infinite;
        }

        .vonu-aura-sparks {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: 0.72;
          mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%);
        }

        .spark {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: rgba(26, 115, 232, 0.34);
          box-shadow: 0 0 18px rgba(26, 115, 232, 0.22);
          opacity: 0;
          transform: translate3d(0, 0, 0) scale(0.6);
          animation-name: vonuSparkFloat;
          animation-timing-function: cubic-bezier(0.45, 0, 0.2, 1);
          animation-iteration-count: infinite;
        }

        .spark-1 {
          left: 8%;
          top: 22%;
          background: rgba(26, 115, 232, 0.42);
          animation-duration: 9s;
          animation-delay: 0s;
        }

        .spark-2 {
          left: 18%;
          top: 72%;
          background: rgba(0, 201, 131, 0.36);
          animation-duration: 11s;
          animation-delay: 1.4s;
        }

        .spark-3 {
          left: 28%;
          top: 18%;
          background: rgba(255, 138, 0, 0.34);
          animation-duration: 10.5s;
          animation-delay: 2.1s;
        }

        .spark-4 {
          left: 38%;
          top: 82%;
          background: rgba(123, 92, 255, 0.36);
          animation-duration: 12s;
          animation-delay: 0.7s;
        }

        .spark-5 {
          left: 48%;
          top: 24%;
          background: rgba(0, 201, 131, 0.32);
          animation-duration: 10s;
          animation-delay: 3.2s;
        }

        .spark-6 {
          left: 58%;
          top: 70%;
          background: rgba(26, 115, 232, 0.36);
          animation-duration: 12.5s;
          animation-delay: 1.8s;
        }

        .spark-7 {
          left: 70%;
          top: 16%;
          background: rgba(255, 138, 0, 0.32);
          animation-duration: 9.8s;
          animation-delay: 2.6s;
        }

        .spark-8 {
          left: 84%;
          top: 68%;
          background: rgba(123, 92, 255, 0.34);
          animation-duration: 11.4s;
          animation-delay: 0.9s;
        }

        .spark-9 {
          left: 92%;
          top: 34%;
          background: rgba(0, 201, 131, 0.3);
          animation-duration: 10.8s;
          animation-delay: 3.7s;
        }

        .spark-10 {
          left: 12%;
          top: 46%;
          background: rgba(123, 92, 255, 0.32);
          animation-duration: 13s;
          animation-delay: 4.1s;
        }

        .spark-11 {
          left: 34%;
          top: 52%;
          background: rgba(26, 115, 232, 0.28);
          animation-duration: 12.2s;
          animation-delay: 5s;
        }

        .spark-12 {
          left: 76%;
          top: 48%;
          background: rgba(255, 138, 0, 0.3);
          animation-duration: 10.2s;
          animation-delay: 4.6s;
        }

        .spark-13 {
          left: 5%;
          top: 84%;
          background: rgba(0, 201, 131, 0.28);
          animation-duration: 13.5s;
          animation-delay: 2.9s;
        }

        .spark-14 {
          left: 96%;
          top: 78%;
          background: rgba(26, 115, 232, 0.3);
          animation-duration: 12.8s;
          animation-delay: 1.1s;
        }

        .spark-15 {
          left: 52%;
          top: 8%;
          background: rgba(123, 92, 255, 0.3);
          animation-duration: 11.7s;
          animation-delay: 6s;
        }

        .spark-16 {
          left: 62%;
          top: 90%;
          background: rgba(255, 138, 0, 0.3);
          animation-duration: 13.2s;
          animation-delay: 3.4s;
        }

        @keyframes vonuAuraWash {
          0%,
          100% {
            transform: scale(1) translate3d(0, 0, 0);
            filter: blur(28px) saturate(1.08) hue-rotate(0deg);
          }

          35% {
            transform: scale(1.04) translate3d(1.5%, -1%, 0);
            filter: blur(30px) saturate(1.18) hue-rotate(10deg);
          }

          70% {
            transform: scale(1.02) translate3d(-1.2%, 1.4%, 0);
            filter: blur(29px) saturate(1.14) hue-rotate(-8deg);
          }
        }

        @keyframes vonuRibbonA {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }

          50% {
            transform: translate(-50%, -50%) rotate(24deg) scale(1.08);
          }

          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
          }
        }

        @keyframes vonuRibbonB {
          0% {
            transform: translate(-50%, -50%) rotate(180deg) scale(1.08);
          }

          50% {
            transform: translate(-50%, -50%) rotate(142deg) scale(0.98);
          }

          100% {
            transform: translate(-50%, -50%) rotate(-180deg) scale(1.08);
          }
        }

        @keyframes vonuEdgeA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.3;
          }

          50% {
            transform: translate3d(60px, 34px, 0) scale(1.18);
            opacity: 0.43;
          }
        }

        @keyframes vonuEdgeB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.28;
          }

          50% {
            transform: translate3d(-54px, 44px, 0) scale(1.16);
            opacity: 0.4;
          }
        }

        @keyframes vonuEdgeC {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.28;
          }

          50% {
            transform: translate3d(22px, -54px, 0) scale(1.14);
            opacity: 0.38;
          }
        }

        @keyframes vonuSparkFloat {
          0% {
            opacity: 0;
            transform: translate3d(0, 26px, 0) scale(0.45);
          }

          18% {
            opacity: 0.75;
            transform: translate3d(10px, 0, 0) scale(1);
          }

          62% {
            opacity: 0.58;
            transform: translate3d(-12px, -44px, 0) scale(0.9);
          }

          100% {
            opacity: 0;
            transform: translate3d(22px, -86px, 0) scale(0.4);
          }
        }

        @media (max-width: 767px) {
          .vonu-ambient-aura {
            opacity: 1;
            background:
              radial-gradient(circle at 0% 12%, rgba(26, 115, 232, 0.16), transparent 34%),
              radial-gradient(circle at 100% 12%, rgba(123, 92, 255, 0.14), transparent 35%),
              radial-gradient(circle at 10% 88%, rgba(0, 201, 131, 0.13), transparent 36%),
              radial-gradient(circle at 92% 82%, rgba(255, 138, 0, 0.12), transparent 36%);
          }

          .vonu-aura-wash {
            inset: -24%;
            opacity: 1;
            filter: blur(26px) saturate(1.1);
          }

          .vonu-aura-ribbon {
            width: 150vw;
            height: 95vh;
            opacity: 0.34;
            filter: blur(42px) saturate(1.2);
          }

          .ribbon-b {
            width: 135vw;
            height: 84vh;
            opacity: 0.22;
          }

          .edge-a {
            left: -34%;
            top: 10%;
            width: 330px;
            height: 330px;
          }

          .edge-b {
            right: -34%;
            top: 14%;
            width: 320px;
            height: 320px;
          }

          .edge-c {
            left: 18%;
            bottom: -24%;
            width: 420px;
            height: 420px;
          }

          .spark {
            width: 6px;
            height: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vonu-aura-wash,
          .vonu-aura-ribbon,
          .vonu-aura-edge,
          .spark {
            animation: none !important;
          }

          .spark {
            opacity: 0.32;
          }
        }
      `}</style>
    </div>
  );
}