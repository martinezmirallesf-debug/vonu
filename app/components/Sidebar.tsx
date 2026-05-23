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

const secondaryLinks = [
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
  { label: "Contacto", href: "/contacto" },
];

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m21 21-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
      <path
        d="M9.5 4.5h5a1 1 0 0 1 1 1V7h-7V5.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
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
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 12h13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

  function handleCreateThread() {
    createThreadAndActivate();
    setMenuOpen(false);
  }

  function openPlansFromMenu() {
    handleOpenPlansCTA();
    setMenuOpen(false);
  }

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-[80] transition-all duration-300",
          menuOpen
            ? "pointer-events-auto bg-white md:bg-black/20 md:backdrop-blur-sm"
            : "pointer-events-none bg-transparent",
        ].join(" ")}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={[
            "absolute z-[81] overflow-hidden bg-white",
            "transform transition-all duration-300 ease-out",
            "inset-0 md:inset-y-auto md:left-3 md:right-auto md:rounded-[30px]",
            "md:border md:border-zinc-200/80 md:bg-white/94 md:shadow-[0_18px_60px_rgba(0,0,0,0.18)] md:backdrop-blur-xl",
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
          ].join(" ")}
          style={{
            top: desktop ? SIDEBAR_TOP : 0,
            bottom: desktop ? 12 : 0,
            width: desktop ? 370 : undefined,
            maxWidth: desktop ? "calc(100vw - 24px)" : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex h-full flex-col px-7 pb-7 md:px-4 md:pb-4"
            style={{
              paddingTop: desktop ? 18 : "calc(env(safe-area-inset-top, 0px) + 92px)",
            }}
          >
            {desktop ? (
              <div className="mb-4 flex items-center justify-between px-1">
                <a
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-[22px] font-semibold tracking-[-0.045em] text-zinc-950"
                >
                  VonuAI
                </a>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100"
                  aria-label="Cerrar menú"
                >
                  ×
                </button>
              </div>
            ) : null}

            <div className="shrink-0">
              <button
                onClick={handleCreateThread}
                className="flex w-full items-center gap-5 rounded-[28px] bg-transparent py-4 text-left transition active:scale-[0.99] md:gap-4 md:py-3"
              >
                <span className="grid h-[62px] w-[62px] shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-950 md:h-12 md:w-12">
                  <PlusIcon className="h-7 w-7 md:h-5 md:w-5" />
                </span>

                <span className="text-[28px] font-semibold leading-none tracking-[-0.055em] text-zinc-950 md:text-[20px]">
                  Nueva conversación
                </span>
              </button>

              <div className="mt-3 flex items-center gap-4 rounded-full border border-zinc-200 bg-white px-5 py-4 shadow-sm md:px-4 md:py-3">
                <SearchIcon className="h-5 w-5 shrink-0 text-zinc-400" />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar conversaciones"
                  className="min-w-0 flex-1 bg-transparent text-[17px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400 md:text-[14px]"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-200 pt-5 md:mt-4 md:pt-4" />

            <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
              <div className="space-y-1">
                {filteredThreads.map((t) => {
                  const active = t.id === activeThreadId;
                  const pinned = pinnedIds.includes(t.id);

                  return (
                    <div
                      key={t.id}
                      className={[
                        "group relative rounded-[20px] transition-colors",
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
                        className="w-full cursor-pointer px-1 py-3 text-left md:px-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div
                              className={[
                                "truncate text-[25px] leading-tight tracking-[-0.05em] md:text-[15px] md:tracking-normal",
                                active
                                  ? "font-semibold text-zinc-950"
                                  : "font-semibold text-zinc-900 md:font-medium",
                              ].join(" ")}
                            >
                              {t.title}
                            </div>

                            {pinned ? (
                              <div className="mt-1 text-[12px] font-medium text-blue-600">
                                Fijada
                              </div>
                            ) : null}
                          </div>

                          {active ? (
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: BRAND_BLUE }}
                            />
                          ) : null}
                        </div>
                      </button>

                      {desktop ? (
                        <button
                          onClick={() => openThreadActions(t.id)}
                          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-transparent text-zinc-500 opacity-0 transition-all hover:border-zinc-200 hover:bg-white group-hover:opacity-100"
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
                  <div className="px-2 py-10 text-center text-[15px] text-zinc-500 md:text-[13px]">
                    No he encontrado conversaciones con ese texto.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="shrink-0 border-t border-zinc-200 pt-5 md:pt-4">
              <div className="mb-5 grid gap-3 md:mb-4 md:gap-2">
                {secondaryLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-[18px] font-medium text-zinc-500 transition hover:text-zinc-950 md:text-[14px]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              {accountOpen ? (
                <div className="mb-3 rounded-[26px] border border-zinc-200 bg-white p-3 shadow-sm">
                  {isLoggedIn ? (
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[14px] font-semibold text-white"
                        style={{ backgroundColor: BRAND_BLUE }}
                      >
                        {userInitial}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold text-zinc-900">
                          {authUserName ?? "Usuario"}
                        </div>
                        <div className="truncate text-[11px] text-zinc-500">
                          {authUserEmail ?? "Email no disponible"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-700">
                        <UserIcon className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-zinc-900">
                          Sin iniciar sesión
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          Guarda y sincroniza tus consultas
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-1">
                    <div className="flex items-center justify-between rounded-[18px] px-3 py-2 text-[14px] text-zinc-700">
                      <span>Plan actual</span>
                      <span className="font-semibold text-zinc-950">
                        {currentPlanLabel === "Max"
                          ? "Max"
                          : currentPlanLabel === "Plus"
                          ? PLUS_NODE
                          : currentPlanLabel}
                      </span>
                    </div>

                    <button
                      onClick={openPlansFromMenu}
                      className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      <span>Planes</span>
                      <ArrowIcon className="h-4 w-4 text-zinc-400" />
                    </button>

                    <button
                      onClick={openPlansFromMenu}
                      className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      <span>Recargas</span>
                      <ArrowIcon className="h-4 w-4 text-zinc-400" />
                    </button>

                    <a
                      href="/recursos"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      <span>Recursos</span>
                      <ArrowIcon className="h-4 w-4 text-zinc-400" />
                    </a>

                    <button
                      onClick={openPlansFromMenu}
                      className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      <span>Gestionar suscripción</span>
                      <ArrowIcon className="h-4 w-4 text-zinc-400" />
                    </button>

                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="mt-1 flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-medium text-red-600 hover:bg-red-50"
                      >
                        <span>Cerrar sesión</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openLoginModal("signin");
                          setMenuOpen(false);
                        }}
                        className="mt-1 flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left text-[14px] font-semibold"
                        style={{ color: BRAND_BLUE }}
                      >
                        <span>Iniciar sesión</span>
                        <ArrowIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setAccountOpen((v) => !v)}
                disabled={authLoading}
                className={[
                  "flex w-full items-center justify-between rounded-full border border-zinc-200 bg-white px-5 py-4 shadow-sm transition active:scale-[0.99]",
                  authLoading ? "opacity-60" : "hover:bg-zinc-50",
                ].join(" ")}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={[
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold",
                      isLoggedIn ? "text-white" : "bg-zinc-100 text-zinc-700",
                    ].join(" ")}
                    style={isLoggedIn ? { backgroundColor: BRAND_BLUE } : undefined}
                  >
                    {isLoggedIn ? userInitial : <UserIcon className="h-[18px] w-[18px]" />}
                  </span>

                  <span className="min-w-0 text-left">
                    <span className="block truncate text-[15px] font-semibold text-zinc-950">
                      {isLoggedIn ? userLabel : "Cuenta"}
                    </span>
                    <span className="block truncate text-[12px] text-zinc-500">
                      Plan {currentPlanLabel === "Plus" ? "Plus" : currentPlanLabel}
                    </span>
                  </span>
                </span>

                <span
                  className={[
                    "text-[22px] leading-none text-zinc-400 transition",
                    accountOpen ? "rotate-45" : "",
                  ].join(" ")}
                >
                  +
                </span>
              </button>
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
            className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.20)] md:bottom-6 md:left-6 md:w-[360px] md:inset-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
            </div>

            <div className="border-b border-zinc-100 px-5 pb-3 pt-4">
              <div className="truncate text-[15px] font-semibold text-zinc-900">
                {currentThread.title}
              </div>
              <div className="mt-1 text-[12px] text-zinc-500">
                Acciones para esta conversación
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={togglePinFromMenu}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[20px] px-4 py-3 transition-colors hover:bg-zinc-50"
              >
                <PinIcon className="h-[18px] w-[18px] text-zinc-900" />
                <span className="text-[15px] font-medium text-zinc-900">
                  {selectedIsPinned ? "Quitar de fijadas" : "Fijar"}
                </span>
              </button>

              <button
                onClick={handleRenameFromMenu}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[20px] px-4 py-3 transition-colors hover:bg-zinc-50"
              >
                <EditIcon className="h-[18px] w-[18px] text-zinc-700" />
                <span className="text-[15px] font-medium text-zinc-900">
                  Cambiar nombre
                </span>
              </button>

              <button
                onClick={handleDeleteFromMenu}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[20px] px-4 py-3 transition-colors hover:bg-red-50"
              >
                <TrashIcon className="h-[18px] w-[18px] text-red-600" />
                <span className="text-[15px] font-medium text-red-600">
                  Eliminar
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}