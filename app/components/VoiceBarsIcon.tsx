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
      className={[
        "voice-bars-icon",
        active ? "voice-bars-icon-active" : "",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="voice-bars-icon-bar voice-bars-icon-bar-1" />
      <span className="voice-bars-icon-bar voice-bars-icon-bar-2" />
      <span className="voice-bars-icon-bar voice-bars-icon-bar-3" />
      <span className="voice-bars-icon-bar voice-bars-icon-bar-4" />
      <span className="voice-bars-icon-bar voice-bars-icon-bar-5" />
    </span>
  );
}