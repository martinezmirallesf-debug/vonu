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
        "group w-full text-center cursor-pointer transition-all duration-200",
        "hover:opacity-100 active:scale-[0.995]",
        compact ? "px-4 py-4" : "px-5 py-5 md:px-6 md:py-6",
      ].join(" ")}
      aria-label="Sube un archivo para analizar"
      title="Sube un archivo para analizar"
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={[
            "grid place-items-center text-zinc-800 bg-white/88 backdrop-blur-md border border-zinc-200 transition-colors duration-200",
            "group-hover:bg-white",
            compact ? "h-11 w-11 rounded-[14px]" : "h-12 w-12 rounded-[15px] md:h-[52px] md:w-[52px] md:rounded-[16px]",
          ].join(" ")}
        >
          <PlusIcon className={compact ? "h-[19px] w-[19px]" : "h-[20px] w-[20px]"} />
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