"use client";

import React from "react";

type AssistantMessageActionsProps = {
  isLastAssistantMessage: boolean;
  isStreaming: boolean;
  hasText: boolean;
  onCopy: () => void;
  onShare: () => void;
  onDownloadPdf: () => void;
};

export default function AssistantMessageActions({
  isLastAssistantMessage,
  isStreaming,
  hasText,
  onCopy,
  onShare,
  onDownloadPdf,
}: AssistantMessageActionsProps) {
  if (isStreaming || !hasText) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Copiar"
          title="Copiar"
          onClick={onCopy}
          className="h-10 w-10 rounded-full grid place-items-center text-[#8a8f98] active:bg-zinc-200/70 transition-colors"
        >
          <svg
            className="h-[22px] w-[22px] translate-y-[0.5px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="9"
              y="9"
              width="10"
              height="10"
              rx="2.2"
              stroke="currentColor"
              strokeWidth="2.4"
            />
            <path
              d="M15 9V7.8A1.8 1.8 0 0 0 13.2 6H7.8A1.8 1.8 0 0 0 6 7.8v5.4A1.8 1.8 0 0 0 7.8 15H9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Compartir"
          title="Compartir"
          onClick={onShare}
          className="h-10 w-10 rounded-full grid place-items-center text-[#8a8f98] active:bg-zinc-200/70 transition-colors"
        >
          <svg
            className="h-[22px] w-[22px] translate-y-[0.5px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="2.6" fill="currentColor" />
            <circle cx="6" cy="12" r="2.6" fill="currentColor" />
            <circle cx="18" cy="19" r="2.6" fill="currentColor" />
            <path
              d="M7.9 11.1L16.1 6.2"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M7.9 12.9L16.1 17.8"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Descargar PDF"
          title="Descargar PDF"
          onClick={onDownloadPdf}
          className="h-10 w-10 rounded-full grid place-items-center text-[#8a8f98] active:bg-zinc-200/70 transition-colors"
        >
          <svg
            className="h-[22px] w-[22px] translate-y-[1px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 4v9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M8.5 10.5L12 14l3.5-3.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 18.5h14"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isLastAssistantMessage ? (
        <div className="text-[10.5px] leading-4 text-zinc-500 md:hidden">
          Orientación preventiva · No sustituye profesionales.
        </div>
      ) : null}
    </div>
  );
}