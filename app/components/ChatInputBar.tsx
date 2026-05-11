"use client";

import React, { useLayoutEffect } from "react";

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
  pdfPreview: {
    filename: string;
    pageCount: number | null;
    pdfText: string;
  } | null;
  micMsg: string | null;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
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
  clearPdfPreview: () => void;
};

function VoiceBarsIcon({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  const base = "w-[2px] rounded-full bg-current";

  return (
    <span
      className={["flex h-5 w-5 items-center justify-center gap-[2px]", className ?? ""].join(" ")}
      aria-hidden="true"
    >
      <span
        className={[
          base,
          "h-[8px]",
          animated ? "animate-[voiceBar_850ms_ease-in-out_infinite]" : "",
        ].join(" ")}
      />
      <span
        className={[
          base,
          "h-[14px]",
          animated ? "animate-[voiceBar_850ms_ease-in-out_120ms_infinite]" : "",
        ].join(" ")}
      />
      <span
        className={[
          base,
          "h-[18px]",
          animated ? "animate-[voiceBar_850ms_ease-in-out_240ms_infinite]" : "",
        ].join(" ")}
      />
      <span
        className={[
          base,
          "h-[12px]",
          animated ? "animate-[voiceBar_850ms_ease-in-out_360ms_infinite]" : "",
        ].join(" ")}
      />
    </span>
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
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2.45" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.45" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"} fill="none" aria-hidden="true">
      <path d="M12 18V7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M7 10.7 12 5.7l5 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <div className="h-16 w-16 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center leading-none">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-700 mb-1" fill="none" aria-hidden="true">
          <path
            d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <span className="text-[10px] font-semibold tracking-[0.08em] text-zinc-700">PDF</span>
      </div>
    </div>
  );
}

export default function ChatInputBar({
  inputBarRef,
  imagePreview,
  pdfPreview,
  micMsg,
  input,
  setInput,
  isTyping,
  textareaRef,
  handleKeyDown,
  handlePaste,
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
  clearPdfPreview,
}: ChatInputBarProps) {
  const hasText = input.trim().length > 0;
  const hasAttachment = !!imagePreview || !!pdfPreview;

  // Importante:
  // No expandimos con la primera letra para evitar el salto visual.
  // Solo expandimos si hay adjunto, salto de línea o texto ya largo.
  const shouldExpandForText = input.includes("\n") || input.length > 58;
  const isExpanded = hasAttachment || shouldExpandForText;

  const canUseVoice = !isTyping && isLoggedIn;
  const mainButtonIsSend = hasText || hasAttachment;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const minHeight = isExpanded ? 42 : 30;
    const maxHeight = 112;

    el.style.height = `${minHeight}px`;

    const nextHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);

    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input, textareaRef, isExpanded]);

  const voiceUiState: "idle" | "listening" | "speaking" = !voiceMode
    ? "idle"
    : realtimeStatus === "listening"
    ? "listening"
    : "speaking";

  const statusLabel =
    micMsg ||
    (isTyping
      ? "Pensando"
      : realtimeStatus === "connecting"
      ? "Conectando"
      : voiceMode && realtimeStatus === "listening"
      ? "Escuchando"
      : voiceMode && realtimeStatus === "speaking"
      ? "Hablando"
      : voiceMode
      ? "Conversación"
      : null);

  const shellShadow = voiceMode
    ? "0 -7px 24px rgba(26,115,232,0.15), 0 2px 11px rgba(0,0,0,0.055)"
    : isTyping || micMsg
    ? "0 -7px 24px rgba(26,115,232,0.11), 0 2px 11px rgba(0,0,0,0.055)"
    : "0 -5px 18px rgba(0,0,0,0.075), 0 2px 9px rgba(0,0,0,0.05)";

  const shellBorder = voiceMode || isTyping || micMsg ? "rgba(26,115,232,0.34)" : "rgba(212,212,216,0.95)";

  return (
    <div
      ref={inputBarRef}
      className="fixed left-0 right-0 z-[70] bg-transparent"
      style={{
        bottom: "calc(max(var(--vvb, 0px), 0px) + 8px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto max-w-3xl px-3 md:px-6 pt-0 md:pt-2 pb-1 md:pb-2">
        <div className="relative w-full">
          <div
            className="absolute inset-x-0 top-0 hidden md:block bg-[#f8f9fa] pointer-events-none z-0"
            style={{
              bottom: "-80px",
              borderTopLeftRadius: "28px",
              borderTopRightRadius: "28px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          />

          <div className="relative z-20 w-full bg-transparent border-none shadow-none">
            <div
              className={[
                "relative w-full overflow-hidden overscroll-none bg-white",
                "border transition-[box-shadow,border-color,background-color] duration-200",
                isExpanded
                  ? "rounded-[24px] px-3 pt-3 pb-2 md:rounded-[26px]"
                  : "rounded-full px-2.5 py-1.5 md:px-3 md:py-1.5",
              ].join(" ")}
              style={{
                borderColor: shellBorder,
                boxShadow: shellShadow,
              }}
            >
              {isExpanded ? (
                <div className="min-h-0 overflow-visible" style={{ WebkitOverflowScrolling: "touch" }}>
                  {(imagePreview || pdfPreview) && (
                    <div className="mb-2 px-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {imagePreview && (
                          <div className="relative inline-flex rounded-2xl bg-zinc-50/80 p-1.5 shadow-sm">
                            <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-xl object-cover" />

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
                        )}

                        {pdfPreview && (
                          <div className="relative inline-flex rounded-2xl bg-zinc-50/80 p-1.5 shadow-sm">
                            <PdfIcon />

                            <button
                              type="button"
                              onClick={clearPdfPreview}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white shadow-sm text-zinc-700 flex items-center justify-center"
                              aria-label="Quitar PDF"
                              title="Quitar PDF"
                            >
                              <span className="text-[14px] leading-none">×</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="px-1 max-h-[112px] overflow-hidden">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta a Vonu..."}
                      disabled={isTyping}
                      rows={1}
                      className="block w-full resize-none bg-transparent outline-none text-[18px] md:text-[17px] text-zinc-900 placeholder:text-zinc-500 px-[2px] py-2 leading-7 min-h-[42px] max-h-[112px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400/45"
                      style={{
                        height: "42px",
                        boxSizing: "border-box",
                        WebkitOverflowScrolling: "touch",
                        overscrollBehavior: "contain",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(113,113,122,0.45) transparent",
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex items-center justify-between bg-white px-0 pt-1.5 pb-0.5">
                    <div className="flex items-center gap-0.5 -ml-1">
                      <button
                        onClick={openFilePicker}
                        disabled={!!isTyping}
                        className="h-8 w-8 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                        aria-label="Adjuntar"
                        title="Subir archivo para analizar"
                      >
                        <PlusIcon className="h-[18px] w-[18px]" />
                      </button>

                      <button
                        onClick={openBoard}
                        disabled={!!isTyping}
                        className="h-8 w-8 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                        aria-label="Pizarra"
                        title="Pizarra"
                      >
                        <PencilIcon className="h-[17px] w-[17px]" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={onSelectImage}
                        className="hidden"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {statusLabel ? (
                        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12.5px] text-zinc-500">
                          <span>{statusLabel}</span>
                          <span className="text-zinc-400">⌄</span>
                        </div>
                      ) : null}

                      <button
                        onClick={mainButtonIsSend ? sendMessage : toggleConversation}
                        disabled={mainButtonIsSend ? !canSend : !canUseVoice}
                        className={[
                          "relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300",
                          mainButtonIsSend
                            ? "bg-[#1a73e8] text-white"
                            : voiceUiState === "idle"
                            ? "bg-black text-white"
                            : "text-white shadow-[0_8px_24px_rgba(26,115,232,0.30)]",
                          (mainButtonIsSend ? canSend : canUseVoice)
                            ? "cursor-pointer hover:scale-105 active:scale-[0.98]"
                            : "opacity-45 cursor-not-allowed",
                        ].join(" ")}
                        style={
                          !mainButtonIsSend && voiceUiState !== "idle"
                            ? {
                                background: "linear-gradient(135deg, #1a73e8 0%, #3b82f6 45%, #60a5fa 100%)",
                              }
                            : undefined
                        }
                        aria-label={mainButtonIsSend ? "Enviar" : voiceMode ? "Desactivar conversación" : "Hablar con Vonu"}
                        title={mainButtonIsSend ? "Enviar" : voiceMode ? "Modo conversación activo" : "Hablar con Vonu"}
                      >
                        {!mainButtonIsSend && voiceUiState !== "idle" ? (
                          <span className="absolute inset-[-2px] rounded-full bg-blue-400/20 animate-pulse pointer-events-none" aria-hidden="true" />
                        ) : null}

                        <span className="relative z-10 flex h-full w-full items-center justify-center">
                          {mainButtonIsSend ? (
                            <ArrowUpIcon className="h-[19px] w-[19px]" />
                          ) : (
                            <VoiceBarsIcon animated={voiceMode} />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[38px] items-center gap-1.5">
                  <div className="flex shrink-0 items-center gap-0.5 -ml-1">
                    <button
                      onClick={openFilePicker}
                      disabled={!!isTyping}
                      className="h-8 w-8 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                      aria-label="Adjuntar"
                      title="Subir archivo para analizar"
                    >
                      <PlusIcon className="h-[18px] w-[18px]" />
                    </button>

                    <button
                      onClick={openBoard}
                      disabled={!!isTyping}
                      className="h-8 w-8 rounded-full text-zinc-800 hover:bg-zinc-100 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0 border-none bg-transparent"
                      aria-label="Pizarra"
                      title="Pizarra"
                    >
                      <PencilIcon className="h-[17px] w-[17px]" />
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={onSelectImage}
                    className="hidden"
                  />

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={isTyping ? "Vonu está respondiendo…" : "Pregunta lo que quieras"}
                    disabled={isTyping}
                    rows={1}
                    className="min-w-0 flex-1 resize-none bg-transparent outline-none text-[17px] md:text-[16px] text-zinc-900 placeholder:text-zinc-500 px-0 py-0.5 leading-7 h-[30px] max-h-[30px] overflow-hidden"
                    style={{
                      height: "30px",
                      boxSizing: "border-box",
                    }}
                  />

                  {statusLabel ? (
                    <div className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full px-1.5 py-1 text-[12.5px] text-zinc-500">
                      <span>{statusLabel}</span>
                      <span className="text-zinc-400">⌄</span>
                    </div>
                  ) : null}

                  <button
                    onClick={mainButtonIsSend ? sendMessage : toggleConversation}
                    disabled={mainButtonIsSend ? !canSend : !canUseVoice}
                    className={[
                      "relative h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300",
                      mainButtonIsSend
                        ? "bg-[#1a73e8] text-white"
                        : voiceUiState === "idle"
                        ? "bg-black text-white"
                        : "text-white shadow-[0_8px_24px_rgba(26,115,232,0.30)]",
                      (mainButtonIsSend ? canSend : canUseVoice)
                        ? "cursor-pointer hover:scale-105 active:scale-[0.98]"
                        : "opacity-45 cursor-not-allowed",
                    ].join(" ")}
                    style={
                      !mainButtonIsSend && voiceUiState !== "idle"
                        ? {
                            background: "linear-gradient(135deg, #1a73e8 0%, #3b82f6 45%, #60a5fa 100%)",
                          }
                        : undefined
                    }
                    aria-label={mainButtonIsSend ? "Enviar" : voiceMode ? "Desactivar conversación" : "Hablar con Vonu"}
                    title={mainButtonIsSend ? "Enviar" : voiceMode ? "Modo conversación activo" : "Hablar con Vonu"}
                  >
                    {!mainButtonIsSend && voiceUiState !== "idle" ? (
                      <span className="absolute inset-[-2px] rounded-full bg-blue-400/20 animate-pulse pointer-events-none" aria-hidden="true" />
                    ) : null}

                    <span className="relative z-10 flex h-full w-full items-center justify-center">
                      {mainButtonIsSend ? (
                        <ArrowUpIcon className="h-[19px] w-[19px]" />
                      ) : (
                        <VoiceBarsIcon animated={voiceMode} />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="hidden md:block relative z-10 mt-2 px-3 pb-4 md:mx-0 md:px-3">
              <div className="text-center text-[11.5px] text-zinc-500">
                Orientación preventiva · No sustituye profesionales.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes voiceBar {
          0%,
          100% {
            transform: scaleY(0.55);
            opacity: 0.72;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}