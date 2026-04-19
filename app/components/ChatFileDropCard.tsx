"use client";

import React from "react";

type ChatFileDropCardProps = {
  onClick: () => void;
  compact?: boolean;
};

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatFileDropCard({
  onClick,
  compact = false,
}: ChatFileDropCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full rounded-[28px] border border-zinc-200/90",
        "bg-white/88 backdrop-blur-xl",
        "shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
        "transition-all duration-200",
        "hover:bg-white hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]",
        "active:scale-[0.995]",
        "cursor-pointer text-center",
        compact ? "px-5 py-5" : "px-6 py-6 md:px-7 md:py-7",
      ].join(" ")}
      aria-label="Sube un archivo para analizar"
      title="Sube un archivo para analizar"
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={[
            "rounded-[18px] border border-zinc-200 bg-zinc-50/95",
            "grid place-items-center text-zinc-800",
            "transition-colors duration-200",
            "group-hover:bg-zinc-100",
            compact ? "h-12 w-12" : "h-13 w-13 md:h-14 md:w-14",
          ].join(" ")}
        >
          <PlusIcon className={compact ? "h-[20px] w-[20px]" : "h-[22px] w-[22px]"} />
        </div>

        <div className="mt-4 text-[16px] md:text-[17px] font-semibold tracking-[-0.02em] text-zinc-900">
          Sube un archivo para analizar
        </div>

        <div className="mt-1.5 text-[12.5px] md:text-[13px] text-zinc-500">
          Imagen, PDF, audio, vídeo o enlace
        </div>
      </div>
    </button>
  );
}