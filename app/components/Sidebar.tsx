"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  currentPlanId: string | null;
};

const BRAND_BLUE = "#1a73e8";
const PINNED_STORAGE_KEY = "vonu_pinned_threads_v1";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 11v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6.5 7 7.2 19a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9L17.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 4.5h5a1 1 0 0 1 1 1V7h-7V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 3l7 7-2.8.8-3.4 3.4.8 2.8-1.4 1.4-4.2-4.2-4.9 4.9a1 1 0 0 1-1.4-1.4l4.9-4.9-4.2-4.2 1.4-1.4 2.8.8 3.4-3.4L14 3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
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

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
  currentPlanId,
}: SidebarProps) {
  const desktop = isDesktopPointer();
  const [query, setQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PINNED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPinnedIds(parsed.filter((x) => typeof x === "string"));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedIds));
    } catch {}
  }, [pinnedIds]);

  useEffect(() => {
    if (!menuOpen) {
      setThreadMenuOpen(false);
      setSelectedThreadId(null);
      setAccountOpen(false);
      setQuery("");
    }
  }, [menuOpen]);

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? sortedThreads
      : sortedThreads.filter((t) => t.title.toLowerCase().includes(q));

    const pinned = base.filter((t) => pinnedIds.includes(t.id));
    const normal = base.filter((t) => !pinnedIds.includes(t.id));

    return [...pinned, ...normal];
  }, [sortedThreads, query, pinnedIds]);

  const currentThread = useMemo(
    () => sortedThreads.find((t) => t.id === (selectedThreadId ?? activeThreadId)) ?? null,
    [sortedThreads, selectedThreadId, activeThreadId]
  );

  function openThreadActions(threadId: string) {
    setSelectedThreadId(threadId);
    setThreadMenuOpen(true);
  }

  function closeThreadActions() {
    setThreadMenuOpen(false);
    setSelectedThreadId(null);
  }

  function handleRenameFromMenu() {
    if (selectedThreadId && selectedThreadId !== activeThreadId) {
      activateThread(selectedThreadId);
      setTimeout(() => openRename(), 30);
    } else {
      openRename();
    }
    closeThreadActions();
    setMenuOpen(false);
  }

  function handleDeleteFromMenu() {
    if (selectedThreadId && selectedThreadId !== activeThreadId) {
      activateThread(selectedThreadId);
      setTimeout(() => deleteActiveThread(), 30);
    } else {
      deleteActiveThread();
    }
    closeThreadActions();
  }

  function togglePinFromMenu() {
    if (!selectedThreadId) return;

    setPinnedIds((prev) =>
      prev.includes(selectedThreadId)
        ? prev.filter((id) => id !== selectedThreadId)
        : [selectedThreadId, ...prev]
    );

    closeThreadActions();
  }

  function startLongPress(threadId: string) {
    if (desktop) return;
    clearLongPress();
    longPressTimerRef.current = window.setTimeout(() => {
      openThreadActions(threadId);
    }, 420);
  }

  function clearLongPress() {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  const userLabel = authUserName?.trim() || authUserEmail?.trim() || "Tu cuenta";
  const userInitial = userLabel.charAt(0).toUpperCase() || "U";

  const currentPlanLabel =
    currentPlanId === "max"
      ? "Max"
      : currentPlanId === "plus"
      ? "Plus"
      : currentPlanId === "free"
      ? "Gratis"
      : proLoading
      ? "comprobando…"
      : isPro
      ? "Plus"
      : "Gratis";

  const selectedIsPinned = !!selectedThreadId && pinnedIds.includes(selectedThreadId);

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] transition-all duration-300 ${
          menuOpen ? "bg-black/20 backdrop-blur-sm pointer-events-auto" : "pointer-events-none bg-transparent"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={[
            "absolute left-3 right-3 md:right-auto z-[81]",
            "bg-white/94 backdrop-blur-xl",
            "rounded-[30px] shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-zinc-200/80",
            "overflow-hidden",
            "transform transition-all duration-300 ease-out",
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
          ].join(" ")}
          style={{
            top: SIDEBAR_TOP,
            bottom: 12,
            width: desktop ? 370 : undefined,
            maxWidth: "calc(100vw - 24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    createThreadAndActivate();
                    setMenuOpen(false);
                  }}
                  className="flex-1 h-12 rounded-full text-white transition-colors px-4 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: BRAND_BLUE }}
                >
                  <PlusIcon className="h-[18px] w-[18px]" />
                  <span className="text-[14px] font-semibold">Nueva consulta</span>
                </button>

                <button
  onClick={() => setAccountOpen((v) => !v)}
  className="h-12 min-w-12 px-0 rounded-full bg-transparent hover:bg-zinc-100 active:bg-zinc-100 transition-colors flex items-center justify-center cursor-pointer shrink-0"
  aria-label="Cuenta"
  title="Cuenta"
>
                  <div
  className="h-12 w-12 rounded-full text-white text-[15px] font-semibold grid place-items-center"
  style={{ backgroundColor: BRAND_BLUE }}
>
  {userInitial}
</div>
                </button>
              </div>

              <div className="mt-3 relative">
                <SearchIcon className="h-[18px] w-[18px] text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar conversaciones"
                  className="w-full h-12 rounded-full border border-zinc-200 bg-zinc-50/80 pl-11 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-300"
                />
              </div>

              {accountOpen && !authLoading ? (
                <div className="mt-3 rounded-[24px] border border-zinc-200 bg-white p-3 shadow-sm">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full text-white text-[14px] font-semibold grid place-items-center shrink-0"
                          style={{ backgroundColor: BRAND_BLUE }}
                        >
                          {userInitial}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-zinc-900 truncate">{authUserName ?? "Usuario"}</div>
                          <div className="text-[11px] text-zinc-500 truncate">{authUserEmail ?? "Email no disponible"}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2 rounded-[18px] bg-zinc-50 px-3 py-2">
                        <div className="text-[12px] text-zinc-600">
                          Plan{" "}
                          <span className="font-semibold text-zinc-900">
                            {currentPlanLabel === "Max"
                              ? "Max"
                              : currentPlanLabel === "Plus"
                              ? PLUS_NODE
                              : currentPlanLabel}
                          </span>
                        </div>

                        <button
  onClick={() => {
    handleOpenPlansCTA();
    setMenuOpen(false);
  }}
  className="h-8 px-3 rounded-full bg-transparent hover:bg-zinc-100 active:bg-zinc-100 text-[12px] font-semibold transition-colors cursor-pointer"
  style={{ color: BRAND_BLUE }}
>
                          {currentPlanLabel === "Gratis" ? "Mejorar" : "Ver"}
                        </button>
                      </div>

                      <button
  onClick={() => {
    logout();
    setMenuOpen(false);
  }}
  className="mt-3 w-full h-10 rounded-full bg-transparent hover:bg-zinc-100 active:bg-zinc-100 text-[13px] font-semibold text-zinc-800 transition-colors cursor-pointer"
>
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 text-zinc-700 grid place-items-center shrink-0">
                          <UserIcon className="h-[18px] w-[18px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-zinc-900">Sin iniciar sesión</div>
                          <div className="text-[11px] text-zinc-500">Guarda y sincroniza tus consultas</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          openLoginModal("signin");
                          setMenuOpen(false);
                        }}
                        className="mt-3 w-full h-10 rounded-full text-white text-[13px] font-semibold transition-colors cursor-pointer"
                        style={{ backgroundColor: BRAND_BLUE }}
                      >
                        Iniciar sesión
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 [scrollbar-width:thin]">
              <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Recientes
              </div>

              <div className="space-y-1">
                {filteredThreads.map((t) => {
                  const active = t.id === activeThreadId;
                  const when = mounted ? new Date(t.updatedAt).toLocaleDateString() : "";
                  const pinned = pinnedIds.includes(t.id);

                  return (
                    <div
                      key={t.id}
                      className={[
                        "group relative w-full rounded-[20px] transition-colors",
                        active ? "bg-zinc-100" : "hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <button
                        onMouseDown={() => startLongPress(t.id)}
                        onMouseUp={clearLongPress}
                        onMouseLeave={clearLongPress}
                        onTouchStart={() => startLongPress(t.id)}
                        onTouchEnd={clearLongPress}
                        onTouchCancel={clearLongPress}
                        onClick={() => {
                          clearLongPress();
                          activateThread(t.id);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="min-w-0 flex-1">
                            <div
                              className={[
                                "truncate text-[15px]",
                                active ? "font-semibold text-zinc-900" : "font-medium text-zinc-800",
                              ].join(" ")}
                            >
                              {t.title}
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400 truncate">
                              <span>{when}</span>
                              {pinned ? <span style={{ color: BRAND_BLUE }}>• Fijada</span> : null}
                            </div>
                          </div>

                          {active ? (
                            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: BRAND_BLUE }} />
                          ) : null}
                        </div>
                      </button>

                      {desktop ? (
                        <button
                          onClick={() => openThreadActions(t.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white border border-transparent hover:border-zinc-200 text-zinc-500 transition-all cursor-pointer grid place-items-center"
                          aria-label="Acciones"
                          title="Acciones"
                        >
                          <DotsIcon className="h-[18px] w-[18px]" />
                        </button>
                      ) : null}
                    </div>
                  );
                })}

                {filteredThreads.length === 0 ? (
                  <div className="px-4 py-10 text-center text-[13px] text-zinc-500">
                    No he encontrado conversaciones con ese texto.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {threadMenuOpen && currentThread ? (
        <div
          className="fixed inset-0 z-[95] bg-black/28 backdrop-blur-[2px]"
          onClick={closeThreadActions}
        >
          <div
            className="absolute inset-x-3 bottom-3 md:left-6 md:bottom-6 md:inset-x-auto md:w-[360px] rounded-[30px] bg-white border border-zinc-200 shadow-[0_24px_70px_rgba(0,0,0,0.20)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
            </div>

            <div className="px-5 pt-4 pb-3 border-b border-zinc-100">
              <div className="text-[15px] font-semibold text-zinc-900 truncate">{currentThread.title}</div>
              <div className="mt-1 text-[12px] text-zinc-500">Acciones para esta conversación</div>
            </div>

            <div className="p-2">
              <button
                onClick={togglePinFromMenu}
                className="w-full flex items-center gap-3 rounded-[20px] px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <PinIcon className="h-[18px] w-[18px] text-zinc-900" />
                <span className="text-[15px] font-medium text-zinc-900">
  {selectedIsPinned ? "Quitar de fijadas" : "Fijar"}
</span>
              </button>

              <button
                onClick={handleRenameFromMenu}
                className="w-full flex items-center gap-3 rounded-[20px] px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <EditIcon className="h-[18px] w-[18px] text-zinc-700" />
                <span className="text-[15px] font-medium text-zinc-900">Cambiar nombre</span>
              </button>

              <button
                onClick={handleDeleteFromMenu}
                className="w-full flex items-center gap-3 rounded-[20px] px-4 py-3 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <TrashIcon className="h-[18px] w-[18px] text-red-600" />
                <span className="text-[15px] font-medium text-red-600">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}