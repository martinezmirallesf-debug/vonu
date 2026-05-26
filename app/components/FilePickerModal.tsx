"use client";

import React from "react";

type FilePickerType =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "url"
  | "phone"
  | "board";

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
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3.5h6l4 4V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8.5 15.8h7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M8.5 12.5h5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function AudioIcon({ className }: { className?: string }) {
  const bar = "w-[2.4px] rounded-full bg-current";

  return (
    <span
      className={["flex h-6 w-6 items-center justify-center gap-[2.5px]", className ?? ""].join(" ")}
      aria-hidden="true"
    >
      <span className={[bar, "h-[9px]"].join(" ")} />
      <span className={[bar, "h-[17px]"].join(" ")} />
      <span className={[bar, "h-[11px]"].join(" ")} />
      <span className={[bar, "h-[19px]"].join(" ")} />
      <span className={[bar, "h-[8px]"].join(" ")} />
    </span>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="6" width="12" height="12" rx="2.8" stroke="currentColor" strokeWidth="1.9" />
      <path d="m15.5 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      <path d="M8.0 15.7 16.0 8.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.8 4.5h2.1c.5 0 .9.34 1.02.83l.56 2.24c.09.36 0 .73-.26 1.01l-1.1 1.2a14.3 14.3 0 0 0 5.61 5.61l1.2-1.1c.28-.26.65-.35 1.01-.26l2.24.56c.49.12.83.52.83 1.02v2.1c0 .6-.49 1.09-1.09 1.09C10.91 19 5 13.09 5 5.59c0-.6.49-1.09 1.09-1.09Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoardIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 5.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M7 15.5c2.2-4 4.2-4 6 0 1.2-2.2 2.5-2.2 4 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 9h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9-5.7-1.8L10.2 9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9" />
      <path d="M3.8 12h16.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M12 3.5c2.2 2.4 3.2 5.1 3.2 8.5s-1 6.1-3.2 8.5c-2.2-2.4-3.2-5.1-3.2-8.5s1-6.1 3.2-8.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function OptionRow({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group flex w-full items-center gap-4 rounded-[22px] px-3 py-2.5 text-left",
        "transition-colors duration-150",
        disabled
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer hover:bg-zinc-100 active:bg-zinc-100",
      ].join(" ")}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-950 transition-colors group-hover:bg-white">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold tracking-[-0.025em] text-zinc-950">
          {label}
        </span>
      </span>
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
        className="absolute inset-0 bg-white/78 backdrop-blur-[7px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
        <div
          className="mx-auto w-full max-w-[500px] overflow-hidden rounded-[34px] border border-zinc-200 bg-white/96 shadow-[0_24px_90px_rgba(0,0,0,0.14)] backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative px-5 pb-3 pt-5">
            <div className="text-[25px] font-semibold tracking-[-0.055em] text-zinc-950">
              ¿Qué quieres añadir?
            </div>

            <button
  type="button"
  onClick={onClose}
  className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
  aria-label="Cerrar"
  title="Cerrar"
>
  <CloseIcon className="h-5 w-5" />
</button>
          </div>

          <div className="max-h-[min(68dvh,620px)] overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
            <OptionRow
              icon={<ImageIcon />}
              label="Imagen"
              onClick={() => onPickType("image")}
            />

            <OptionRow
              icon={<PdfIcon />}
              label="PDF o documento"
              onClick={() => onPickType("pdf")}
            />

            <OptionRow
              icon={<AudioIcon />}
              label="Audio"
              onClick={() => onPickType("audio")}
            />

            <OptionRow
              icon={<VideoIcon />}
              label="Vídeo"
              onClick={() => onPickType("video")}
            />

            <OptionRow
              icon={<LinkIcon />}
              label="Enlace"
              onClick={() => onPickType("url")}
            />

            <OptionRow
              icon={<PhoneIcon />}
              label="Nº teléfono"
              onClick={() => onPickType("phone")}
            />

            <OptionRow
              icon={<BoardIcon />}
              label="Pizarra / ayuda visual"
              onClick={() => onPickType("board")}
            />

            <div className="my-2 border-t border-zinc-100" />

            <OptionRow
              icon={<SparkIcon />}
              label="Crear imagen"
              onClick={() => {}}
              disabled
            />

            <OptionRow
              icon={<GlobeIcon />}
              label="Búsqueda en Internet"
              onClick={() => {}}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}