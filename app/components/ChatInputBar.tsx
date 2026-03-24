"use client";

import React from "react";

type ChatInputBarProps = {
  inputBarRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChatInputBar({
  inputBarRef,
}: ChatInputBarProps) {
  return (
    <div
      ref={inputBarRef}
      className="fixed left-0 right-0 z-30 bg-transparent"
      style={{
        bottom: "var(--vvb, 0px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto max-w-3xl px-3 md:px-6 pt-3 pb-2">
        <div
          className={[
            "relative w-full rounded-3xl",
            "bg-white",
            "border border-zinc-200/70",
            "ring-1 ring-zinc-900/[0.03]",
            "shadow-[0_22px_70px_rgba(0,0,0,0.18)]",
            "px-3 pt-2 pb-2",
          ].join(" ")}
        >
          <div
            className={[
              "absolute left-0 right-0 bottom-0",
              "px-4 py-2",
              "text-center text-[11.5px] md:text-[12px]",
              "text-zinc-500",
              "bg-white",
              "rounded-b-3xl",
            ].join(" ")}
          >
            Orientación preventiva · No sustituye profesionales.
          </div>

          <div className="min-h-[120px] flex items-center justify-center text-sm text-zinc-400">
            Aquí irá el input real de Vonu
          </div>
        </div>
      </div>
    </div>
  );
}