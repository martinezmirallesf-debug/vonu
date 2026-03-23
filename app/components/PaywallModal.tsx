"use client";

import React from "react";

type PaywallModalProps = {
  paywallOpen: boolean;
  closePaywall: () => void;
};

export default function PaywallModal({
  paywallOpen,
  closePaywall,
}: PaywallModalProps) {
  if (!paywallOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closePaywall}
        aria-hidden="true"
      />

      <div
        className="relative h-full w-full flex items-center justify-center px-3 py-3"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui" }}
      >
        <div
          className="w-full max-w-[980px] rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)] border border-zinc-200 overflow-hidden"
          style={{ maxHeight: "calc(var(--vvh, 100dvh) - 24px)" }}
        >
          <div className="flex max-h-[calc(var(--vvh,100dvh)-24px)] flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/vonu-icon.png?v=2"
                  alt="Vonu"
                  className="h-7 w-7 shrink-0"
                  draggable={false}
                />
                <img
                  src="/vonu-wordmark.png?v=2"
                  alt="Vonu"
                  className="h-4 w-auto"
                  draggable={false}
                />
              </div>

              <button
                onClick={closePaywall}
                className="h-10 w-10 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 cursor-pointer shrink-0 p-0 grid place-items-center"
                aria-label="Cerrar"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 text-sm text-zinc-500">
              Aquí seguirá el contenido del paywall.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}