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
      <div className="mx-auto max-w-3xl px-3 md:px-6 pt-2 pb-2">
        {imagePreview && (
          <div className="mb-2 relative w-fit">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-2xl border border-zinc-200 max-h-40"
            />
          </div>
        )}

        {micMsg && (
          <div className="mb-2 text-[12px] text-zinc-600 bg-white/95 border border-zinc-200 rounded-2xl px-3 py-2 shadow-sm">
            {micMsg}
          </div>
        )}

        {/* CONTENEDOR EXTERIOR TRANSPARENTE */}
        <div className="w-full bg-transparent border-none shadow-none">
          {/* INPUT REAL */}
          <div className="relative w-full rounded-[28px] bg-[#f1f3f4] px-3 pt-2 pb-2 shadow-[0_4px_14px_rgba(0,0,0,0.06)] md:rounded-[24px]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta a Vonu..."}
              disabled={isTyping}
              rows={1}
              className="w-full resize-none bg-transparent outline-none text-[15px] text-zinc-900 placeholder:text-zinc-500 px-3 pt-3 pb-12 pr-14 md:pb-11 md:pr-14"
            />

            {/* BOTÓN ENVIAR */}
            <button
              onClick={sendMessage}
              disabled={!canSend}
              className={[
                "absolute right-3 bottom-3",
                "h-9 w-9 rounded-full",
                "bg-blue-600 text-white",
                "flex items-center justify-center",
                "transition-all",
                canSend
                  ? "opacity-100 hover:scale-105 active:scale-[0.98]"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Enviar"
              title="Enviar"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 18V7"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M7.5 10.5 12 6l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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