"use client";

import React from "react";

type Thread = {
  id: string;
  title: string;
  updatedAt: number;
};

type SidebarProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  SIDEBAR_TOP: number;
  sortedThreads: Thread[];
  activeThreadId: string | null;
  activateThread: (id: string) => void;
  createThreadAndActivate: () => void;
  openRename: () => void;
  deleteActiveThread: () => void;
  mounted: boolean;
  isDesktopPointer: () => boolean;
  authLoading: boolean;
  isLoggedIn: boolean;
  authUserName: string | null;
  authUserEmail: string | null;
  logout: () => void;
  isPro: boolean;
  proLoading: boolean;
  PLUS_NODE: React.ReactNode;
  handleOpenPlansCTA: () => void;
  openLoginModal: (mode: "signin" | "signup") => void;
};

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  SIDEBAR_TOP,
  sortedThreads,
  activeThreadId,
  activateThread,
  createThreadAndActivate,
  openRename,
  deleteActiveThread,
  mounted,
  isDesktopPointer,
  authLoading,
  isLoggedIn,
  authUserName,
  authUserEmail,
  logout,
  isPro,
  proLoading,
  PLUS_NODE,
  handleOpenPlansCTA,
  openLoginModal,
}: SidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-[80] transition-all duration-300 ${
        menuOpen
          ? "bg-black/20 backdrop-blur-sm pointer-events-auto"
          : "pointer-events-none bg-transparent"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <aside
  className={[
    "absolute left-3 right-3 md:right-auto z-[81]",
          "bg-white/92 backdrop-blur-xl",
          "rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-zinc-200/80",
          "p-4",
          "transform transition-all duration-300 ease-out",
          menuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
        ].join(" ")}
        style={{
          top: SIDEBAR_TOP,
          bottom: 12,
          width: isDesktopPointer() ? 360 : undefined,
          maxWidth: "calc(100vw - 24px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-zinc-800">
                Historial
              </div>
              <div className="text-xs text-zinc-500">
                Tus consultas recientes
              </div>
            </div>

            <button
              onClick={createThreadAndActivate}
              className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Nueva
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={openRename}
              className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
            >
              Renombrar
            </button>

            <button
              onClick={deleteActiveThread}
              className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-600 cursor-pointer"
            >
              Borrar
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {sortedThreads.map((t) => {
              const active = t.id === activeThreadId;
              const when = mounted
                ? new Date(t.updatedAt).toLocaleString()
                : "";

              return (
                <button
                  key={t.id}
                  onClick={() => activateThread(t.id)}
                  className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors cursor-pointer ${
                    active
                      ? "border-blue-600 bg-blue-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-900">
                    {t.title}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{when}</div>
                </button>
              );
            })}
          </div>

          {!authLoading && (
            <div className="mt-3 rounded-3xl border border-zinc-200 bg-white px-3 py-3">
              <div className="text-xs text-zinc-500 mb-2">Cuenta</div>

              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 truncate">
                        {authUserName ?? "Usuario"}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {authUserEmail ?? "Email no disponible"}
                      </div>
                    </div>

                    <button
                      onClick={logout}
                      className="text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 cursor-pointer shrink-0"
                    >
                      Salir
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] text-zinc-500">
                      Plan:{" "}
                      <span className="font-semibold text-zinc-900">
                        {proLoading
                          ? "comprobando…"
                          : isPro
                          ? PLUS_NODE
                          : "Gratis"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleOpenPlansCTA();
                        setMenuOpen(false);
                      }}
                      className="text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 cursor-pointer shrink-0"
                    >
                      {isPro ? "Ver" : "Mejorar"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openLoginModal("signin")}
                  className="w-full text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}