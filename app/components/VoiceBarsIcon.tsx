"use client";

type VoiceBarsIconProps = {
  active?: boolean;
  className?: string;
};

export default function VoiceBarsIcon({
  active = false,
  className = "",
}: VoiceBarsIconProps) {
  return (
    <span
      className={["vonu-voice-icon", active ? "is-active" : "", className].join(" ")}
      aria-hidden="true"
    >
      <span className="vonu-voice-bar vonu-voice-bar-1" />
      <span className="vonu-voice-bar vonu-voice-bar-2" />
      <span className="vonu-voice-bar vonu-voice-bar-3" />
      <span className="vonu-voice-bar vonu-voice-bar-4" />
      <span className="vonu-voice-bar vonu-voice-bar-5" />

      <style jsx>{`
        .vonu-voice-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3.4px;
          width: 28px;
          height: 28px;
          color: currentColor;
        }

        .vonu-voice-bar {
          display: block;
          width: 3.2px;
          border-radius: 999px;
          background: currentColor;
          opacity: 1;
          transform-origin: center;
        }

        /* Reposo: punto · barra corta · barra central larga · barra corta · punto */
        .vonu-voice-bar-1,
        .vonu-voice-bar-5 {
          width: 4.2px;
          height: 4.2px;
        }

        .vonu-voice-bar-2,
        .vonu-voice-bar-4 {
          height: 11px;
        }

        .vonu-voice-bar-3 {
          height: 22px;
        }

        /* Activo: se rompe la simetría y cada barra respira a su ritmo */
        .is-active .vonu-voice-bar-1 {
          animation: vonuVoiceDotLeft 860ms ease-in-out infinite;
        }

        .is-active .vonu-voice-bar-2 {
          animation: vonuVoiceShortLeft 720ms ease-in-out infinite;
        }

        .is-active .vonu-voice-bar-3 {
          animation: vonuVoiceCenter 800ms ease-in-out infinite;
        }

        .is-active .vonu-voice-bar-4 {
          animation: vonuVoiceShortRight 910ms ease-in-out infinite;
        }

        .is-active .vonu-voice-bar-5 {
          animation: vonuVoiceDotRight 760ms ease-in-out infinite;
        }

        @keyframes vonuVoiceDotLeft {
          0%,
          100% {
            height: 4.2px;
          }
          35% {
            height: 9px;
          }
          62% {
            height: 5px;
          }
        }

        @keyframes vonuVoiceShortLeft {
          0%,
          100% {
            height: 11px;
          }
          32% {
            height: 17px;
          }
          70% {
            height: 8px;
          }
        }

        @keyframes vonuVoiceCenter {
          0%,
          100% {
            height: 22px;
          }
          28% {
            height: 14px;
          }
          55% {
            height: 24px;
          }
          82% {
            height: 18px;
          }
        }

        @keyframes vonuVoiceShortRight {
          0%,
          100% {
            height: 11px;
          }
          25% {
            height: 7px;
          }
          55% {
            height: 18px;
          }
          80% {
            height: 12px;
          }
        }

        @keyframes vonuVoiceDotRight {
          0%,
          100% {
            height: 4.2px;
          }
          30% {
            height: 8px;
          }
          64% {
            height: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .is-active .vonu-voice-bar {
            animation: none;
          }
        }
      `}</style>
    </span>
  );
}