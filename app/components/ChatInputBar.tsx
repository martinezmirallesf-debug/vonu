"use client";

import React, { useEffect, useLayoutEffect } from "react";

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
  openFilePicker: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImagePreview: () => void;
};

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3.6" width="6" height="10.5" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M5.5 11.8c0 4.1 3 7 6.5 7s6.5-2.9 6.5-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M12 19.3v2.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9 21.6h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  openFilePicker,
  fileInputRef,
  onSelectImage,
  clearImagePreview,
}: ChatInputBarProps) {

  useLayoutEffect(() => {
  const el = textareaRef.current;
  if (!el) return;

  const maxHeight = 260;
  const bottomSafeGap = 76;

  el.style.height = "auto";
  const next = Math.min(el.scrollHeight, maxHeight);
  el.style.height = `${next}px`;

  const shouldScroll = el.scrollHeight > maxHeight;
  el.style.overflowY = shouldScroll ? "auto" : "hidden";

  if (shouldScroll) {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight + bottomSafeGap;
    });
  } else {
    el.scrollTop = 0;
  }
}, [input, textareaRef]);

  const voiceUiState: "idle" | "listening" | "speaking" = !voiceMode
    ? "idle"
    : realtimeStatus === "listening"
    ? "listening"
    : "speaking";

  return (
    <div
  ref={inputBarRef}
  className="fixed left-0 right-0 z-[70] bg-transparent"
  style={{
    bottom: "max(var(--vvb, 0px), 0px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) - 1px)",
  }}
>
      <div className="mx-auto max-w-3xl px-0 md:px-6 pt-0 md:pt-2 pb-0 md:pb-2 -mx-[3px] md:mx-auto">
        {micMsg && (
          <div className="mb-2 text-[12px] text-zinc-600 bg-white/95 border border-zinc-200 rounded-2xl px-3 py-2 shadow-sm">
            {micMsg}
          </div>
        )}

        <div className="relative w-full">
  <div
  className="absolute inset-x-0 top-0 hidden md:block bg-[#f8f9fa] pointer-events-none z-0"
  style={{
    bottom: "-80px",
    borderTopLeftRadius: "22px",
    borderTopRightRadius: "22px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
  }}
/>

  <div className="relative z-20 w-full bg-transparent border-none shadow-none">
            <div
  className="relative w-full overflow-hidden overscroll-none bg-white px-2.5 pt-1 pb-1.5 md:pb-1 transition-all duration-200 rounded-t-[22px] rounded-b-none md:rounded-[20px] border border-zinc-300/90 border-b-0 md:border md:border-zinc-300 md:border-b"
  style={{
    boxShadow: "0 -6px 20px rgba(0,0,0,0.085), 0 2px 10px rgba(0,0,0,0.055)",
  }}
>
              <div
  className="min-h-0 max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain [scrollbar-width:none]"
  style={{ WebkitOverflowScrolling: "touch" }}
>
  {imagePreview && (
    <div className="mb-2 px-1">
      <div className="relative inline-flex rounded-2xl bg-zinc-50/80 p-1.5 shadow-sm">
        <img
          src={imagePreview}
          alt="Preview"
          className="h-16 w-16 rounded-xl object-cover"
        />

        <button
  type="button"
  onClick={clearImagePreview}
  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white shadow-sm text-zinc-700 flex items-center justify-center"
  aria-label="Quitar imagen"
  title="Quitar imagen"
>
          <span className="text-[14px] leading-none">×</span>
        </button>
      </div>
    </div>
  )}

  <div className="px-1">
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta a Vonu..."}
      disabled={isTyping}
      rows={1}
      className="block w-full resize-none overflow-y-auto bg-transparent outline-none touch-pan-y overscroll-contain text-[16px] md:text-[15px] text-zinc-900 placeholder:text-zinc-500 px-[12px] pt-3 pb-10 leading-6 min-h-[28px] max-h-[260px] [scrollbar-width:none]"
      style={{
        boxSizing: "border-box",
        WebkitOverflowScrolling: "touch",
        scrollPaddingBottom: "84px",
        overscrollBehavior: "contain",
      }}
    />
  </div>
</div>
              <div className="relative z-10 flex items-center justify-between bg-white px-1 pt-0 pb-1.5 md:pb-1">
                <div className="flex items-center gap-1.5">
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
  onClick={openFilePicker}
  disabled={!!isTyping}
  className="h-8 w-8 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
  aria-label="Adjuntar"
  title="Subir archivo para analizar"
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

                <div className="flex items-center gap-1.5">
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
                    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
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
            </div>

            <div className="hidden md:block relative z-10 mt-2 px-3 pb-6 md:mx-0 md:px-3">
  <div className="text-center text-[11.5px] text-zinc-500">
    Orientación preventiva · No sustituye profesionales.
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}