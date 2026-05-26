"use client";

import React, { useEffect } from "react";

type BoardTool = "pen" | "eraser";

type ManualWhiteboardModalProps = {
  open: boolean;
  boardMsg: string | null;

  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasWrapRef: React.RefObject<HTMLDivElement | null>;

  boardTool: BoardTool;
  setBoardTool: React.Dispatch<React.SetStateAction<BoardTool>>;

  boardColor: string;
  setBoardColor: React.Dispatch<React.SetStateAction<string>>;

  boardSize: number;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;

  onClose: () => void;
  onClear: () => void;
  onUndo: () => void;
  onExport: () => void;

  onCanvasPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onCanvasPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onCanvasPointerEnd: () => void;
};

const INK_COLOR = "#111827";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.6 4.2a2.1 2.1 0 0 1 3 3L8.4 18.4 4 20l1.6-4.4L16.6 4.2Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="m14.8 6 3.2 3.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

function EraserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.7 14.2 13.4 5.5a2.2 2.2 0 0 1 3.1 0l2 2a2.2 2.2 0 0 1 0 3.1l-7.9 7.9H7.2l-2.5-2.5a1.3 1.3 0 0 1 0-1.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10.7 18.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9 8H5V4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.6 8.4A8 8 0 1 1 4 13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M6.5 7 7.2 19a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9L17.5 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 19V6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "grid h-10 w-10 shrink-0 place-items-center rounded-full transition active:scale-95 md:h-11 md:w-11",
        active
          ? "bg-zinc-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
          : "bg-transparent text-zinc-800 hover:bg-zinc-100",
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default function ManualWhiteboardModal({
  open,
  boardMsg,
  canvasRef,
  canvasWrapRef,
  boardTool,
  setBoardTool,
  boardColor,
  setBoardColor,
  boardSize,
  setBoardSize,
  onClose,
  onClear,
  onUndo,
  onExport,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerEnd,
}: ManualWhiteboardModalProps) {
  useEffect(() => {
    if (!open) return;

    setBoardColor(INK_COLOR);
    setBoardTool("pen");
  }, [open, setBoardColor, setBoardTool]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[115] bg-white/82 backdrop-blur-[10px]">
      <div className="flex h-full w-full items-center justify-center p-3 md:p-6">
        <div className="relative flex h-[calc(100dvh-24px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-[36px] border border-zinc-200 bg-[#f8f9fa] shadow-[0_28px_100px_rgba(15,23,42,0.16)] md:h-[calc(100dvh-48px)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(16,185,129,0.08),transparent_28%),radial-gradient(circle_at_50%_115%,rgba(245,158,11,0.08),transparent_34%)]" />

          <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200/80 bg-white/76 px-4 py-3 backdrop-blur-xl md:px-5">
            <div className="min-w-0">
  <div className="truncate text-[24px] font-semibold tracking-[-0.06em] text-zinc-950 md:text-[30px]">
    Pizarra / ayuda visual
  </div>
</div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
              aria-label="Cerrar pizarra"
              title="Cerrar"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col p-3 md:p-4">
            <div className="mb-3 shrink-0 rounded-[30px] border border-zinc-200 bg-white/82 px-3 py-3 shadow-[0_14px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl md:px-4">
  <div className="flex items-center gap-3">
    <input
      type="range"
      min={2}
      max={22}
      value={boardSize}
      onChange={(e) => setBoardSize(Number(e.target.value))}
      className="w-full accent-blue-600"
      aria-label="Grosor"
    />

    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-[13px] font-semibold text-zinc-700">
      {boardSize}
    </div>
  </div>

  <div className="mt-3 flex items-center justify-between gap-3">
    <button
      type="button"
      onClick={onExport}
      className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-blue-600 px-5 text-[14px] font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 active:scale-[0.98]"
      aria-label="Enviar al chat"
      title="Enviar al chat"
    >
      <span>Enviar al chat</span>
      <ArrowUpIcon className="h-5 w-5" />
    </button>

    <div className="flex min-w-0 items-center justify-end gap-1.5">
      <ToolButton
        active={boardTool === "pen"}
        onClick={() => {
          setBoardColor(INK_COLOR);
          setBoardTool("pen");
        }}
        label="Lápiz"
      >
        <PenIcon className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={boardTool === "eraser"}
        onClick={() => setBoardTool("eraser")}
        label="Borrador"
      >
        <EraserIcon className="h-5 w-5" />
      </ToolButton>

      <ToolButton onClick={onUndo} label="Deshacer">
        <UndoIcon className="h-5 w-5" />
      </ToolButton>

      <ToolButton onClick={onClear} label="Limpiar">
        <TrashIcon className="h-5 w-5" />
      </ToolButton>
    </div>
  </div>

  {boardMsg ? (
    <div className="mt-3 truncate rounded-full bg-zinc-100 px-3 py-2 text-[12px] text-zinc-600">
      {boardMsg}
    </div>
  ) : null}
</div>

            <div className="min-h-0 flex-1">
              <div
                ref={canvasWrapRef}
                className="h-full w-full overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_70px_rgba(15,23,42,0.08)]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(24,24,27,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(24,24,27,0.035) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="h-full w-full"
                  style={{ touchAction: "none", display: "block" }}
                  onPointerDown={onCanvasPointerDown}
                  onPointerMove={onCanvasPointerMove}
                  onPointerUp={onCanvasPointerEnd}
                  onPointerCancel={onCanvasPointerEnd}
                  onPointerLeave={onCanvasPointerEnd}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}