"use client";

import React from "react";

type FilePickerType = "image" | "pdf" | "audio" | "video" | "url" | "phone";

type FilePickerModalProps = {
  open: boolean;
  onClose: () => void;
  onPickType: (type: FilePickerType) => void;
};

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6 18 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <path
        d="M6.5 16.2 10.2 12.6l2.5 2.5 2.5-2.5 2.3 3.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3.5h6l4 4V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8.5 15.8h7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M8.5 12.5h5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function AudioIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 13v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 18v-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 16v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 13v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="6" width="12" height="12" rx="2.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="m15.5 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8.1 9.25 11.9 12l-3.8 2.75V9.25Z" fill="currentColor" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.9 13.9 8.2 15.6a3.35 3.35 0 1 1-4.74-4.74l2.7-2.7a3.35 3.35 0 0 1 4.74 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 10.1 15.8 8.4a3.35 3.35 0 1 1 4.74 4.74l-2.7 2.7a3.35 3.35 0 0 1-4.74 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.0 15.7 16.0 8.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-9 w-9"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.8 4.5h2.1c.5 0 .9.34 1.02.83l.56 2.24c.09.36 0 .73-.26 1.01l-1.1 1.2a14.3 14.3 0 0 0 5.61 5.61l1.2-1.1c.28-.26.65-.35 1.01-.26l2.24.56c.49.12.83.52.83 1.02v2.1c0 .6-.49 1.09-1.09 1.09C10.91 19 5 13.09 5 5.59c0-.6.49-1.09 1.09-1.09Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OptionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "aspect-square w-full rounded-[24px]",
        "border border-zinc-200 bg-white",
        "hover:bg-zinc-50 active:bg-zinc-100",
        "transition-colors duration-150 cursor-pointer",
      ].join(" ")}
    >
      <div className="flex h-full flex-col items-center justify-center px-3">
        <div className="text-zinc-900">
          {icon}
        </div>

        <div className="mt-4 text-[13px] md:text-[14px] font-medium tracking-[-0.01em] text-zinc-900 text-center">
          {label}
        </div>
      </div>
    </button>
  );
}

export default function FilePickerModal({
  open,
  onClose,
  onPickType,
}: FilePickerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[6px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
        <div
          className="mx-auto w-full max-w-[420px] rounded-[30px] border border-zinc-200 bg-white/92 backdrop-blur-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="relative px-4 pt-5 pb-2">
  <div className="text-[17px] md:text-[18px] font-semibold tracking-[-0.02em] text-zinc-900">
    Subir para analizar
  </div>

  <button
    type="button"
    onClick={onClose}
    className="absolute top-4 right-4 h-9 w-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 transition-colors grid place-items-center text-zinc-700 cursor-pointer shrink-0"
    aria-label="Cerrar"
    title="Cerrar"
  >
    <CloseIcon className="h-[18px] w-[18px]" />
  </button>
</div>

          <div className="p-3 pt-2 grid grid-cols-2 gap-3">
            <OptionButton
              icon={<ImageIcon className="h-[42px] w-[42px]" />}
              label="Imagen"
              onClick={() => onPickType("image")}
            />
            <OptionButton
              icon={<PdfIcon className="h-[42px] w-[42px]" />}
              label="PDF"
              onClick={() => onPickType("pdf")}
            />
            <OptionButton
              icon={<AudioIcon className="h-[42px] w-[42px]" />}
              label="Audio"
              onClick={() => onPickType("audio")}
            />
            <OptionButton
              icon={<VideoIcon className="h-[42px] w-[42px]" />}
              label="Vídeo"
              onClick={() => onPickType("video")}
            />
            <OptionButton
              icon={<LinkIcon className="h-[42px] w-[42px]" />}
              label="Enlace"
              onClick={() => onPickType("url")}
            />
            <OptionButton
              icon={<PhoneIcon className="h-[42px] w-[42px]" />}
              label="Nº teléfono"
              onClick={() => onPickType("phone")}
            />
          </div>

          <div className="pb-3" />
        </div>
      </div>
    </div>
  );
}