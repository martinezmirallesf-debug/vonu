"use client";

import React from "react";

type FilePickerType = "image" | "pdf" | "audio" | "video" | "url";

type FilePickerModalProps = {
  open: boolean;
  onClose: () => void;
  onPickType: (type: FilePickerType) => void;
};

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="9" r="1.8" fill="currentColor" />
      <path d="m6.5 16 3.5-3.5 2.5 2.5 2.5-2.5 2.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3.5h6l4 4V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3.5v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.5 15.5h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 12.5h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AudioIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4v10.5a2.5 2.5 0 1 1-2-2.45V7l8-2v7.5a2.5 2.5 0 1 1-2-2.45V3.5L14 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="12" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="m15.5 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13.5 8 15.5a3.5 3.5 0 1 1-5-5l3-3a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10.5 16 8.5a3.5 3.5 0 1 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15 15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6 18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function OptionButton({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[22px] bg-white/92 border border-zinc-200 px-4 py-4 text-left shadow-sm hover:bg-white transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-[16px] bg-zinc-50 border border-zinc-200 text-zinc-800 grid place-items-center shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-[12.5px] leading-5 text-zinc-500">{subtitle}</div>
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
        className="absolute inset-0 bg-black/25 backdrop-blur-[6px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-x-3 bottom-3 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
        <div
          className="mx-auto w-full max-w-[620px] rounded-[30px] border border-zinc-200 bg-white/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.22)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 md:hidden">
            <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
          </div>

          <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-zinc-100">
            <div>
              <div className="text-[19px] md:text-[21px] font-semibold tracking-[-0.02em] text-zinc-900">
                ¿Qué quieres que analice?
              </div>
              <div className="mt-1 text-[13px] md:text-[14px] text-zinc-500">
                Elige lo que tengas y lo revisamos juntos.
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-zinc-100 transition-colors grid place-items-center text-zinc-700 cursor-pointer shrink-0"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <CloseIcon className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <OptionButton
              icon={<ImageIcon className="h-[19px] w-[19px]" />}
              title="Imagen o captura"
              subtitle="Revisar señales, contexto y detalles visuales."
              onClick={() => onPickType("image")}
            />

            <OptionButton
              icon={<PdfIcon className="h-[19px] w-[19px]" />}
              title="PDF o contrato"
              subtitle="Resumir y detectar puntos importantes."
              onClick={() => onPickType("pdf")}
            />

            <OptionButton
              icon={<AudioIcon className="h-[19px] w-[19px]" />}
              title="Audio"
              subtitle="Extraer lo importante y revisar tono o presión."
              onClick={() => onPickType("audio")}
            />

            <OptionButton
              icon={<VideoIcon className="h-[19px] w-[19px]" />}
              title="Vídeo"
              subtitle="Analizar contenido y posibles señales raras."
              onClick={() => onPickType("video")}
            />

            <div className="md:col-span-2">
              <OptionButton
                icon={<LinkIcon className="h-[19px] w-[19px]" />}
                title="Web o enlace"
                subtitle="Ver si inspira confianza o hay motivos para frenar."
                onClick={() => onPickType("url")}
              />
            </div>
          </div>

          <div className="px-5 pb-5 pt-1">
            <div className="text-[12px] leading-5 text-zinc-500">
              Vonu te ayudará a entender lo importante y a decidir el siguiente paso con más claridad.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}