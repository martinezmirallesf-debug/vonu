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
  openBoard: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        strokeWidth="2.2"
      />
      <path
        d="M5.5 11.8c0 4.1 3 7 6.5 7s6.5-2.9 6.5-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 19.3v2.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9 21.6h6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
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
  openBoard,
  fileInputRef,
  onSelectImage,
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
            <div className="absolute left-2.5 bottom-2.5 z-10 flex items-center gap-1.5">
              <button
                onClick={openBoard}
                disabled={!!isTyping}
                className="h-8 w-8 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                aria-label="Pizarra"
                title="Pizarra"
              >
                <PencilIcon className="h-[17px] w-[17px]" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!!isTyping}
                className="h-8 w-8 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                aria-label="Adjuntar"
                title="Adjuntar imagen"
              >
                <PlusIcon className="h-[17px] w-[17px]" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSelectImage}
                className="hidden"
              />
            </div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta a Vonu..."}
              disabled={isTyping}
              rows={1}
              className="w-full resize-none overflow-y-auto bg-transparent outline-none text-[15px] text-zinc-900 placeholder:text-zinc-500 pl-[58px] pr-[88px] pt-3 pb-12 leading-6 min-h-[50px] max-h-[180px] md:pl-[56px]"
            />

            <div className="absolute right-2.5 bottom-2.5 z-10 flex items-center gap-1.5">
              <button
                onClick={toggleConversation}
                disabled={!!isTyping || !isLoggedIn}
                className={[
                  "relative h-8 w-8 rounded-full",
                  "transition-all duration-300",
                  voiceUiState === "idle"
                    ? "text-zinc-700 hover:bg-zinc-100"
                    : "text-white shadow-[0_8px_24px_rgba(26,115,232,0.30)]",
                  !!isTyping || !isLoggedIn
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer",
                ].join(" ")}
                style={
                  voiceUiState === "idle"
                    ? undefined
                    : {
                        background:
                          "linear-gradient(135deg, #1a73e8 0%, #3b82f6 45%, #60a5fa 100%)",
                      }
                }
                aria-label={voiceMode ? "Desactivar conversación" : "Hablar con Vonu"}
                title={voiceMode ? "Modo conversación activo" : "Hablar con Vonu"}
              >
                {voiceUiState !== "idle" ? (
                  <span
                    className="absolute inset-[-2px] rounded-full bg-blue-400/20 animate-pulse pointer-events-none"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="relative z-10 flex h-full w-full items-center justify-center">
                  <MicIcon className="h-[19px] w-[19px]" />
                </span>
              </button>

              <button
                onClick={sendMessage}
                disabled={!canSend}
                className={[
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
                    strokeWidth="3.1"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 10.7 12 5.7l5 5"
                    stroke="currentColor"
                    strokeWidth="3.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-1.5 text-center text-[11.5px] text-zinc-500">
            Orientación preventiva · No sustituye profesionales.
          </div>
        </div>
      </div>
    </div>
  );
}