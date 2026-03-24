"use client";

import React from "react";

type ChatInputBarProps = {
  inputBarRef: React.RefObject<HTMLDivElement | null>;
  imagePreview: string | null;
  micMsg: string | null;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  canSend: boolean;
  sendMessage: () => void;
};

export default function ChatInputBar({
  inputBarRef,
  imagePreview,
  micMsg,
  input,
  setInput,
  isTyping,
  textareaRef,
  handleKeyDown,
  canSend,
  sendMessage,
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
        {imagePreview && (
          <div className="mb-2 relative w-fit">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-3xl border border-zinc-200 max-h-40"
            />
          </div>
        )}

        {micMsg && (
          <div className="mb-2 text-[12px] text-zinc-600 bg-white border border-zinc-200 rounded-2xl px-3 py-2">
            {micMsg}
          </div>
        )}

        <div
  className={[
    "relative w-full rounded-3xl",
    "bg-white",
    "border border-transparent",
    "shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
    "px-3 pt-2 pb-2",
  ].join(" ")}
>
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
  {/* TEXTAREA */}
  <textarea
    ref={textareaRef}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder={
      isTyping
        ? "Vonu está respondiendo…"
        : "Escribe tu duda, pega un mensaje, una web, una situación…"
    }
    disabled={isTyping}
    rows={1}
    className="w-full resize-none bg-transparent outline-none text-[15px] px-3 pt-2 pb-12 pr-12"
  />

  {/* BOTÓN ENVIAR */}
  <button
  onClick={sendMessage}
  disabled={!canSend}
  className={[
    "absolute right-3 bottom-3",
    "h-8 w-8 rounded-full",
    "bg-blue-600 text-white",
    "flex items-center justify-center",
    "transition-all",
    canSend
      ? "opacity-100 hover:scale-105"
      : "opacity-40 cursor-not-allowed",
  ].join(" ")}
  aria-label="Enviar"
>
  <span className="text-[14px] font-bold leading-none relative top-[-1px]">
    ↑
  </span>
</button>
</div>

{/* DISCLAIMER FUERA */}
<div className="mt-2 text-center text-[11.5px] text-zinc-500">
  Orientación preventiva · No sustituye profesionales.
</div>
        </div>
      </div>
    </div>
  );
}