"use client";

import React, { useEffect } from "react";

type RealtimeVoiceStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "speaking"
  | "closed"
  | "error";

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
  voiceMode: boolean;
  realtimeStatus: RealtimeVoiceStatus;
  isLoggedIn: boolean;
  toggleConversation: () => void;
};

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="3.6"
        width="6"
        height="10.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5.5 11.8c0 4.1 3 7 6.5 7s6.5-2.9 6.5-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 19.3v2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 21.8h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  voiceMode,
  realtimeStatus,
  isLoggedIn,
  toggleConversation,
}: ChatInputBarProps) {
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 180);
    el.style.height = `${next}px`;
  }, [input, textareaRef]);

  const voiceUiState: "idle" | "listening" | "speaking" = !voiceMode
    ? "idle"
    : realtimeStatus === "listening"
    ? "listening"
    : "speaking";

  return (
    <div
      ref={inputBarRef}
      className="fixed left-0 right-0 z-30 bg-transparent"
      style={{
        bottom: "var(--vvb, 0px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto max-w-3xl px-2 md:px-6 pt-2 pb-1 md:pb-2">
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

        <div className="w-full bg-transparent border-none shadow-none">
          <div className="relative w-full rounded-[22px] md:rounded-[20px] bg-white border border-zinc-200 px-2.5 pt-2 pb-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta a Vonu..."}
              disabled={isTyping}
              rows={1}
              className="w-full resize-none overflow-y-auto bg-transparent outline-none text-[15px] text-zinc-900 placeholder:text-zinc-500 px-3 pt-3 pb-12 pr-24 leading-6 min-h-[50px] max-h-[180px]"
            />

            {/* BOTÓN HABLAR CON VONU */}
            <button
              onClick={toggleConversation}
              disabled={!!isTyping || !isLoggedIn}
              className={[
                "absolute right-12 bottom-2.5",
                "h-8 w-8 rounded-full",
                "border transition-all duration-300",
                voiceUiState === "idle"
                  ? "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                  : voiceUiState === "listening"
                  ? "border-cyan-300 text-white shadow-[0_6px_20px_rgba(34,211,238,0.26)]"
                  : "border-blue-300 text-white shadow-[0_8px_22px_rgba(59,130,246,0.30)]",
                !!isTyping || !isLoggedIn
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
              style={
                voiceUiState === "idle"
                  ? undefined
                  : voiceUiState === "listening"
                  ? {
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #38bdf8 45%, #2563eb 100%)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #3b82f6 45%, #60a5fa 100%)",
                    }
              }
              aria-label={voiceMode ? "Desactivar conversación" : "Hablar con Vonu"}
              title={voiceMode ? "Modo conversación activo" : "Hablar con Vonu"}
            >
              <MicIcon className="h-4 w-4" />
            </button>

            {/* BOTÓN ENVIAR */}
            <button
              onClick={sendMessage}
              disabled={!canSend}
              className={[
                "absolute right-3 bottom-2.5",
                "h-8 w-8 rounded-full",
                "bg-[#1a73e8] text-white",
                "flex items-center justify-center",
                "transition-all",
                canSend
                  ? "opacity-100 hover:bg-[#1669c1] hover:scale-105 active:scale-[0.98]"
                  : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Enviar"
              title="Enviar"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[19px] w-[19px]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 18V7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M7 10.7 12 5.7l5 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-1.5 text-center text-[11.5px] text-zinc-500">
            Orientación preventiva · No sustituye profesionales.
          </div>
        </div>
      </div>
    </div>
  );
}