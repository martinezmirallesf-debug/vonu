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
  recentlyRenamedThreadId?: string | null;
  activateThread: (id: string) => void;
  createThreadAndActivate: () => void;
  openRename: (threadId?: string) => void;
  deleteActiveThread: () => void;
  deleteThreadById?: (threadId: string) => void;
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
messagesLeft?: number | null;
realtimeSecondsLeft?: number | null;
subscriptionStatus?: string | null;
subscriptionCurrentPeriodEnd?: string | null;
subscriptionCancelAtPeriodEnd?: boolean;

billing: "monthly" | "yearly" | "topup";
setBilling: React.Dispatch<React.SetStateAction<"monthly" | "yearly" | "topup">>;

plan: "free" | "plus" | "max";
setPlan: React.Dispatch<React.SetStateAction<"free" | "plus" | "max">>;

payLoading: boolean;
payMsg: string | null;

startCheckout: (chosen: {
  plan: "plus" | "max";
  billing: "monthly" | "yearly";
}) => void;

startTopupCheckout: (pack: "basic" | "medium" | "large") => void;
cancelSubscriptionFromHere: () => void | Promise<void>;
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
        d="M15.2 4.2 19.8 8.8c.4.4.25 1.08-.28 1.25l-2.36.76-3.18 3.18.42 3.02c.08.58-.62.94-1.04.52L6.47 10.64c-.42-.42-.06-1.12.52-1.04l3.02.42 3.18-3.18.76-2.36c.17-.53.85-.68 1.25-.28Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 14.6 5 19"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
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
    <svg className={className ?? "h-4 w-4"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-6 w-6"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatVoiceSeconds(seconds?: number | null) {
  function formatPeriodEndDate(iso?: string | null) {
  if (!iso) return null;

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}
  if (typeof seconds !== "number" || Number.isNaN(seconds)) return "—";
  const minutes = Math.max(0, Math.floor(seconds / 60));
  const rest = Math.max(0, seconds % 60);

  if (minutes <= 0) return `${rest}s`;
  if (rest <= 0) return `${minutes} min`;
  return `${minutes} min ${rest}s`;
}

function formatPeriodEndDate(iso?: string | null) {
  if (!iso) return null;

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default function Sidebar({
  menuOpen,
  setMenuOpen,
  SIDEBAR_TOP,
    sortedThreads,
  activeThreadId,
  recentlyRenamedThreadId,
  activateThread,
  createThreadAndActivate,
  openRename,
  deleteActiveThread,
  deleteThreadById,
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
messagesLeft = null,
realtimeSecondsLeft = null,
subscriptionStatus = null,
subscriptionCurrentPeriodEnd = null,
subscriptionCancelAtPeriodEnd = false,
billing,
setBilling,
plan,
setPlan,
payLoading,
payMsg,
startCheckout,
startTopupCheckout,
cancelSubscriptionFromHere,
}: SidebarProps) {
  const desktop = isDesktopPointer();
  const [query, setQuery] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);
  const [accountScreen, setAccountScreen] = useState<"main" | "account" | "plans" | "subscription">("main");
  const visibleThreads = useMemo(() => {
  if (!isLoggedIn) return [];
  return sortedThreads;
}, [isLoggedIn, sortedThreads]);
useEffect(() => {
  if (isLoggedIn) return;

  setQuery("");
  setSelectedThreadId(null);
  setThreadMenuOpen(false);
  setAccountScreen("main");
}, [isLoggedIn]);
  useEffect(() => {
  if (typeof document === "undefined") return;

  const shouldHideTopBar = menuOpen && accountScreen !== "main";

  document.documentElement.classList.toggle(
    "vonu-account-menu-open",
    shouldHideTopBar
  );

  return () => {
    document.documentElement.classList.remove("vonu-account-menu-open");
  };
}, [menuOpen, accountScreen]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
const [animatedRenameTitle, setAnimatedRenameTitle] = useState<{
  id: string;
  text: string;
} | null>(null);

const longPressTimerRef = useRef<number | null>(null);
const longPressTriggeredRef = useRef(false);

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
    if (!recentlyRenamedThreadId) {
      setAnimatedRenameTitle(null);
      return;
    }

    const thread = visibleThreads.find((t) => t.id === recentlyRenamedThreadId);
    const finalTitle = thread?.title?.trim();

    if (!finalTitle) {
      setAnimatedRenameTitle(null);
      return;
    }

    let index = 0;
    setAnimatedRenameTitle({ id: recentlyRenamedThreadId, text: "" });

    const timer = window.setInterval(() => {
      index += 1;

      setAnimatedRenameTitle({
        id: recentlyRenamedThreadId,
        text: finalTitle.slice(0, index),
      });

      if (index >= finalTitle.length) {
        window.clearInterval(timer);
      }
    }, 24);

    return () => {
      window.clearInterval(timer);
    };
  }, [recentlyRenamedThreadId, visibleThreads]);

  useEffect(() => {
    if (!menuOpen) {
      setThreadMenuOpen(false);
      setSelectedThreadId(null);
      setAccountScreen("main");
      setQuery("");
    }
  }, [menuOpen]);

  const filteredThreads = useMemo(() => {
  const q = query.trim().toLowerCase();
  const base = !q
    ? visibleThreads
    : visibleThreads.filter((t) => t.title.toLowerCase().includes(q));

  const pinned = base.filter((t) => pinnedIds.includes(t.id));
  const normal = base.filter((t) => !pinnedIds.includes(t.id));

  return [...pinned, ...normal];
}, [visibleThreads, query, pinnedIds]);

  const currentThread = useMemo(
  () => visibleThreads.find((t) => t.id === (selectedThreadId ?? activeThreadId)) ?? null,
  [visibleThreads, selectedThreadId, activeThreadId]
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

  const subscriptionEndsAtLabel = formatPeriodEndDate(subscriptionCurrentPeriodEnd);

const planIsCanceledAtPeriodEnd =
  !!subscriptionCancelAtPeriodEnd &&
  currentPlanLabel !== "Gratis" &&
  (subscriptionStatus === "active" || subscriptionStatus === "trialing");

  function openThreadActions(threadId: string) {
    setSelectedThreadId(threadId);
    setThreadMenuOpen(true);
  }

  function closeThreadActions() {
    setThreadMenuOpen(false);
    setSelectedThreadId(null);
  }

  function handleRenameFromMenu() {
  if (!selectedThreadId) return;

  const idToRename = selectedThreadId;

  closeThreadActions();
  openRename(idToRename);

  // Importante:
  // No activamos la conversación y no cerramos el historial.
  // El usuario se queda en el menú viendo sus chats.
}

  function handleDeleteFromMenu() {
  if (!selectedThreadId) return;

  const idToDelete = selectedThreadId;

  setPinnedIds((prev) => prev.filter((id) => id !== idToDelete));
  closeThreadActions();

  // Nuevo flujo: borrar directamente por id.
  // Fallback para archivos antiguos/backup que todavía no pasan deleteThreadById.
  if (deleteThreadById) {
    deleteThreadById(idToDelete);
    return;
  }

  if (idToDelete && idToDelete !== activeThreadId) {
    activateThread(idToDelete);
    setTimeout(() => deleteActiveThread(), 30);
  } else {
    deleteActiveThread();
  }
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
  longPressTriggeredRef.current = false;

  longPressTimerRef.current = window.setTimeout(() => {
    longPressTriggeredRef.current = true;
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

  function openPlansFromMenu(mode: "plans" | "topup" | "manage" = "plans") {
  if (mode === "topup") {
    setBilling("topup");
  } else {
    setBilling("monthly");
  }

  if (mode === "manage") {
    setPlan("free");
  } else {
    setPlan(isPro ? "free" : "plus");
  }

  setAccountScreen("plans");
}

  function openResourcesFromMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div
  className={[
    "fixed inset-0 z-[80] transition-all duration-300",
    menuOpen
      ? "pointer-events-auto bg-white md:pointer-events-none md:bg-transparent"
      : "pointer-events-none bg-transparent md:pointer-events-none",
  ].join(" ")}
  onClick={() => setMenuOpen(false)}
>
        <aside
  className={[
    "absolute z-[81] overflow-hidden bg-white select-none",
    "transform transition-all duration-300 ease-out",
    "inset-0",
    "md:fixed md:left-0 md:top-0 md:bottom-0 md:right-auto md:w-[304px]",
    "md:border-r md:border-zinc-200 md:shadow-none md:pointer-events-auto",
    menuOpen
      ? "translate-x-0 opacity-100"
      : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100",
  ].join(" ")}
  onClick={(e) => e.stopPropagation()}
>
          <div
            className="flex h-full flex-col px-6 pb-6 md:px-4 md:pb-4"
            style={{
  paddingTop: desktop
    ? 18
    : accountScreen !== "main"
    ? "calc(env(safe-area-inset-top, 0px) + 18px)"
    : "calc(env(safe-area-inset-top, 0px) + 76px)",
}}
          >
            {desktop ? (
  <div className="mb-5 flex items-center px-1">
    <a
      href="/"
      className="text-[22px] font-semibold tracking-[-0.045em] text-zinc-950"
    >
      VonuAI
    </a>
  </div>
) : null}

            {accountScreen === "account" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0">
  <button
    type="button"
    onClick={() => setAccountScreen("main")}
    className="-ml-2 mb-4 grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
    aria-label="Volver al menú"
    title="Volver"
  >
    <BackIcon className="h-6 w-6" />
  </button>

  <div className="flex w-full items-center justify-between rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm">
  <span className="flex min-w-0 items-center gap-3">
    <span
      className={[
        "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
        isLoggedIn ? "text-white" : "bg-zinc-100 text-zinc-700",
      ].join(" ")}
      style={isLoggedIn ? { backgroundColor: BRAND_BLUE } : undefined}
    >
      {isLoggedIn ? userInitial : <UserIcon className="h-[17px] w-[17px]" />}
    </span>

    <span className="min-w-0 text-left">
      <span className="block truncate text-[14px] font-semibold text-zinc-950 md:text-[13px]">
        {isLoggedIn ? userLabel : "Sin iniciar sesión"}
      </span>

      <span className="block truncate text-[12px] text-zinc-500 md:text-[11px]">
  {isLoggedIn
    ? `${authUserEmail ?? "Email no disponible"} · Plan ${
        currentPlanLabel === "Plus" ? "Plus" : currentPlanLabel
      }`
    : `Plan ${currentPlanLabel === "Plus" ? "Plus" : currentPlanLabel}`}
</span>
    </span>
  </span>
</div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-3 md:p-3">
                      <div className="text-[12px] font-medium text-zinc-500">
                        Mensajes
                      </div>
                      <div className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-zinc-950 md:text-[19px]">
                        {typeof messagesLeft === "number" ? messagesLeft : "—"}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        restantes
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-3 md:p-3">
                      <div className="text-[12px] font-medium text-zinc-500">
                        Voz
                      </div>
                      <div className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-zinc-950 md:text-[19px]">
                        {formatVoiceSeconds(realtimeSecondsLeft)}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-500">
                        restantes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 shrink-0 pr-1">
  <div className="grid gap-1">
                    <button
                      onClick={() => openPlansFromMenu("plans")}
                      className="flex w-full items-center justify-between rounded-[22px] px-2 py-2.5 text-left text-[22px] font-semibold leading-none tracking-[-0.05em] text-zinc-950 transition hover:bg-zinc-50 md:text-[15px] md:tracking-[-0.025em]"
                    >
                      <span>Planes</span>
                      <ArrowIcon className="h-5 w-5 text-zinc-400 md:h-4 md:w-4" />
                    </button>

                    <button
                      onClick={() => openPlansFromMenu("topup")}
                      className="flex w-full items-center justify-between rounded-[22px] px-2 py-2.5 text-left text-[22px] font-semibold leading-none tracking-[-0.05em] text-zinc-950 transition hover:bg-zinc-50 md:text-[15px] md:tracking-[-0.025em]"
                    >
                      <span>Recargas</span>
                      <ArrowIcon className="h-5 w-5 text-zinc-400 md:h-4 md:w-4" />
                    </button>

                    <button
  onClick={() => setAccountScreen("subscription")}
  className="flex w-full items-center justify-between rounded-[22px] px-2 py-2.5 text-left text-[22px] font-semibold leading-none tracking-[-0.05em] text-zinc-950 transition hover:bg-zinc-50 md:text-[15px] md:tracking-[-0.025em]"
>
  <span>Gestionar suscripción</span>
  <ArrowIcon className="h-5 w-5 text-zinc-400 md:h-4 md:w-4" />
</button>

                    <a
                      href="/recursos"
                      onClick={openResourcesFromMenu}
                      className="flex w-full items-center justify-between rounded-[22px] px-2 py-2.5 text-left text-[22px] font-semibold leading-none tracking-[-0.05em] text-zinc-950 transition hover:bg-zinc-50 md:text-[15px] md:tracking-[-0.025em]"
                    >
                      <span>Recursos</span>
                      <ArrowIcon className="h-5 w-5 text-zinc-400 md:h-4 md:w-4" />
                    </a>

                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="mt-1 flex w-full items-center justify-between rounded-[22px] px-2 py-2.5 text-left text-[18px] font-semibold leading-none tracking-[-0.04em] text-red-600 transition hover:bg-red-50 md:text-[13px] md:tracking-normal"
                      >
                        <span>Cerrar sesión</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openLoginModal("signin");
                          setMenuOpen(false);
                        }}
                        className="mt-2 flex w-full items-center justify-between rounded-[22px] px-2 py-3 text-left text-[20px] font-semibold leading-none tracking-[-0.045em] md:text-[14px] md:tracking-normal"
                        style={{ color: BRAND_BLUE }}
                      >
                        <span>Iniciar sesión</span>
                        <ArrowIcon className="h-5 w-5 md:h-4 md:w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="shrink-0 border-t border-zinc-200 pt-5">
                  <div className="grid gap-3 md:gap-2">
                    {secondaryLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-[16px] font-medium text-zinc-500 transition hover:text-zinc-950 md:text-[13px]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
                        ) : accountScreen === "subscription" ? (
  <div className="flex min-h-0 flex-1 flex-col">
    <div className="shrink-0">
      <button
        type="button"
        onClick={() => setAccountScreen("account")}
        className="-ml-2 mb-4 grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
        aria-label="Volver a tu cuenta"
        title="Volver"
      >
        <BackIcon className="h-6 w-6" />
      </button>

      <div>
        <h2 className="text-[26px] font-semibold tracking-[-0.055em] text-zinc-950 md:text-[22px]">
          Gestionar suscripción
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-zinc-500 md:text-[13px]">
          Revisa tu plan actual y cancela tu suscripción cuando quieras.
        </p>
      </div>

      <div className="mt-5 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="text-[12px] font-medium text-zinc-500">
          Plan actual
        </div>

        <div className="mt-1 text-[28px] font-semibold tracking-[-0.06em] text-zinc-950 md:text-[24px]">
          {currentPlanLabel}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-[12px] font-medium text-zinc-500">
              Mensajes
            </div>
            <div className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-zinc-950 md:text-[19px]">
              {typeof messagesLeft === "number" ? messagesLeft : "—"}
            </div>
            <div className="mt-1 text-[11px] text-zinc-500">
              restantes
            </div>
          </div>

          <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-[12px] font-medium text-zinc-500">
              Voz
            </div>
            <div className="mt-1 text-[22px] font-semibold tracking-[-0.05em] text-zinc-950 md:text-[19px]">
              {formatVoiceSeconds(realtimeSecondsLeft)}
            </div>
            <div className="mt-1 text-[11px] text-zinc-500">
              restantes
            </div>
          </div>
        </div>
      </div>

      {planIsCanceledAtPeriodEnd ? (
  <div className="mt-5 rounded-[28px] border border-emerald-100 bg-emerald-50 p-4">
    <div className="text-[15px] font-semibold text-emerald-800">
      Plan cancelado
    </div>

    <p className="mt-2 text-[13px] leading-6 text-emerald-900/75">
      Mantienes tu acceso a {currentPlanLabel}
      {subscriptionEndsAtLabel ? ` hasta el ${subscriptionEndsAtLabel}` : " hasta que termine el periodo pagado"}.
      Después pasarás automáticamente al plan gratis.
    </p>

    {payMsg ? (
      <p className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-[13px] leading-5 text-zinc-700">
        {payMsg}
      </p>
    ) : null}
  </div>
) : currentPlanLabel !== "Gratis" ? (
  <div className="mt-5 rounded-[28px] border border-red-100 bg-red-50 p-4">
    <div className="text-[15px] font-semibold text-red-700">
      Cancelar plan
    </div>

    <p className="mt-2 text-[13px] leading-6 text-red-700/80">
      Si cancelas, mantendrás tu acceso hasta el final del periodo ya pagado.
      Después pasarás automáticamente al plan gratis.
    </p>

    <button
      type="button"
      onClick={() => cancelSubscriptionFromHere()}
      disabled={payLoading}
      className="mt-4 w-full rounded-full bg-red-600 px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {payLoading ? "Cancelando..." : "Cancelar plan"}
    </button>

    {payMsg ? (
      <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-[13px] leading-5 text-zinc-700">
        {payMsg}
      </p>
    ) : null}
  </div>
) : (
  <div className="mt-5 rounded-[28px] border border-zinc-200 bg-zinc-50 p-4">
    <div className="text-[15px] font-semibold text-zinc-900">
      Plan gratuito
    </div>

    <p className="mt-2 text-[13px] leading-6 text-zinc-600">
      Ahora estás en el plan gratis. Puedes mejorar tu plan o añadir recargas cuando lo necesites.
    </p>
  </div>
)}

      <button
        type="button"
        onClick={() => openPlansFromMenu("plans")}
        className="mt-4 w-full rounded-full border border-zinc-200 bg-white px-5 py-3 text-[14px] font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-50"
      >
        Ver planes y recargas
      </button>
    </div>
  </div>
) : accountScreen === "plans" ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setAccountScreen("account")}
                    className="-ml-2 mb-4 grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
                    aria-label="Volver al usuario"
                    title="Volver"
                  >
                    <BackIcon className="h-6 w-6" />
                  </button>

                  <div className="mb-3">
                    <div className="text-[32px] font-semibold leading-none tracking-[-0.06em] text-zinc-950 md:text-[24px]">
                      Planes y recargas
                    </div>
                    <div className="mt-1.5 text-[13px] leading-5 text-zinc-500">
                      Gestiona tu plan, añade recargas o vuelve al plan gratis.
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBilling("monthly")}
                      className={[
                        "h-9 rounded-full text-[12px] font-semibold transition",
                        billing === "monthly"
                          ? "bg-blue-600 text-white"
                          : "text-zinc-700 hover:bg-zinc-100",
                      ].join(" ")}
                    >
                      Mensual
                    </button>

                    <button
                      type="button"
                      onClick={() => setBilling("yearly")}
                      className={[
                        "h-9 rounded-full text-[12px] font-semibold transition",
                        billing === "yearly"
                          ? "bg-blue-600 text-white"
                          : "text-zinc-700 hover:bg-zinc-100",
                      ].join(" ")}
                    >
                      Anual
                    </button>

                    <button
                      type="button"
                      onClick={() => setBilling("topup")}
                      className={[
                        "h-9 rounded-full text-[12px] font-semibold transition",
                        billing === "topup"
                          ? "bg-blue-600 text-white"
                          : "text-zinc-700 hover:bg-zinc-100",
                      ].join(" ")}
                    >
                      Recargas
                    </button>
                  </div>
                </div>

                <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {billing !== "topup" ? (
                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() => setPlan("free")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[24px] border px-4 py-4 text-left transition",
                          plan === "free"
                            ? "border-blue-600 bg-blue-50"
                            : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[16px] font-semibold text-zinc-950">
                              Gratis
                            </div>
                            <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                              0€
                            </div>
                          </div>

                          {plan === "free" ? (
                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                              Seleccionado
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>20 mensajes al mes</div>
                          <div>Analiza mensajes y situaciones</div>
                          <div>Pruébalo sin compromiso</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlan("plus")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[24px] border px-4 py-4 text-left transition",
                          plan === "plus"
                            ? "border-blue-600 bg-blue-50"
                            : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[16px] font-semibold text-zinc-950">
                              Plus
                            </div>
                            <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                              {billing === "monthly" ? "9,99€" : "79,99€"}
                            </div>
                          </div>

                          {plan === "plus" ? (
                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                              Seleccionado
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>250 mensajes al mes</div>
                          <div>15 min de voz</div>
                          <div>Modo tutor</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPlan("max")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[24px] border px-4 py-4 text-left transition",
                          plan === "max"
                            ? "border-blue-600 bg-blue-50"
                            : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[16px] font-semibold text-zinc-950">
                              Max
                            </div>
                            <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                              {billing === "monthly" ? "19,99€" : "159,99€"}
                            </div>
                          </div>

                          {plan === "max" ? (
                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                              Seleccionado
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>800 mensajes al mes</div>
                          <div>45 min de voz</div>
                          <div>Uso intensivo</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <div className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4">
                        <div className="text-[16px] font-semibold text-zinc-950">
                          Recarga básica
                        </div>
                        <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                          2,99€
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>50 mensajes extra</div>
                          <div>5 min de voz</div>
                          <div>Pago único</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => startTopupCheckout("basic")}
                          disabled={!!payLoading}
                          className="mt-4 h-10 w-full rounded-full bg-blue-600 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Comprar
                        </button>
                      </div>

                      <div className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4">
                        <div className="text-[16px] font-semibold text-zinc-950">
                          Recarga media
                        </div>
                        <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                          6,99€
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>150 mensajes extra</div>
                          <div>15 min de voz</div>
                          <div>Pago único</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => startTopupCheckout("medium")}
                          disabled={!!payLoading}
                          className="mt-4 h-10 w-full rounded-full bg-blue-600 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Comprar
                        </button>
                      </div>

                      <div className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4">
                        <div className="text-[16px] font-semibold text-zinc-950">
                          Recarga grande
                        </div>
                        <div className="mt-1 text-[30px] font-extrabold leading-none tracking-[-0.06em] text-zinc-950">
                          14,99€
                        </div>

                        <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-zinc-700">
                          <div>400 mensajes extra</div>
                          <div>40 min de voz</div>
                          <div>Pago único</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => startTopupCheckout("large")}
                          disabled={!!payLoading}
                          className="mt-4 h-10 w-full rounded-full bg-blue-600 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  )}

                  {payMsg ? (
                    <div className="mt-4 rounded-[18px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] leading-5 text-zinc-700">
                      {payMsg}
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0 border-t border-zinc-200 pt-4">
                  {billing !== "topup" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (payLoading) return;

                        if (plan === "free") {
                          if (isPro) {
                            cancelSubscriptionFromHere();
                          } else {
                            setAccountScreen("account");
                          }
                          return;
                        }

                        startCheckout({ plan, billing });
                      }}
                      disabled={!!payLoading}
                      className="h-12 w-full rounded-full bg-blue-600 text-[15px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {payLoading
                        ? "Procesando…"
                        : plan === "free"
                        ? isPro
                          ? "Pasar a plan Gratis"
                          : "Volver"
                        : "Empezar ahora"}
                    </button>
                  ) : (
                    <div className="text-center text-[12px] leading-5 text-zinc-500">
                      Elige una recarga para continuar usando Vonu.
                    </div>
                  )}

                  <div className="mt-2 text-center text-[11px] text-zinc-500">
                    Pago seguro con Stripe.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="shrink-0">
                  <button
                    onClick={handleCreateThread}
                    className="flex w-full items-center gap-4 rounded-[24px] bg-transparent py-3 text-left transition active:scale-[0.99] md:gap-3 md:py-2.5"
                  >
                    <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-950 md:h-10 md:w-10">
                      <PlusIcon className="h-6 w-6 md:h-5 md:w-5" />
                    </span>

                    <span className="text-[24px] font-semibold leading-none tracking-[-0.05em] text-zinc-950 md:text-[16px] md:tracking-[-0.025em]">
                      Nueva conversación
                    </span>
                  </button>

                  <div className="mt-3 flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm md:px-3 md:py-2.5">
                    <SearchIcon className="h-5 w-5 shrink-0 text-zinc-400 md:h-4 md:w-4" />

                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar conversaciones"
                      className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400 md:text-[13px]"
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-zinc-200 pt-4 md:mt-4 md:pt-3" />

                <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  <div className="space-y-1">
                    {filteredThreads.map((t) => {
                      const active = t.id === activeThreadId;
                      const pinned = pinnedIds.includes(t.id);

                      return (
                        <div
  key={t.id}
  className={[
    "group relative rounded-[18px] transition-colors",
    active ? "bg-zinc-100" : "hover:bg-zinc-50",
  ].join(" ")}
>
  
                          <button
  onContextMenu={(e) => e.preventDefault()}
  onPointerDown={(e) => {
    if (e.pointerType === "touch") {
      e.preventDefault();
    }

    startLongPress(t.id);
  }}
  onPointerUp={clearLongPress}
  onPointerCancel={clearLongPress}
  onPointerLeave={clearLongPress}
  onClick={() => {
    clearLongPress();

    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    activateThread(t.id);
    setMenuOpen(false);
  }}
  className="w-full cursor-pointer select-none touch-manipulation px-1 py-2.5 text-left md:px-3 md:py-2"
>
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <div
                                  className={[
                                    "truncate text-[21px] leading-tight tracking-[-0.045em] md:text-[14px] md:tracking-normal",
                                    active
                                      ? "font-semibold text-zinc-950"
                                      : "font-semibold text-zinc-900 md:font-medium",
                                  ].join(" ")}
                                >
                                  <span className="flex min-w-0 items-center gap-2">
  {pinned ? (
    <PinIcon className="h-[13px] w-[13px] shrink-0 text-zinc-950" />
  ) : null}

  <span className="min-w-0 truncate">
    {animatedRenameTitle?.id === t.id ? (
      <span className="inline-flex min-w-0 max-w-full items-center">
        <span className="truncate">
          {animatedRenameTitle.text || " "}
        </span>
        <span className="ml-[2px] inline-block h-[1em] w-[2px] shrink-0 rounded-full bg-zinc-900 animate-pulse" />
      </span>
    ) : (
      t.title
    )}
  </span>
</span>
                                </div>
                                
                              </div>

                              {active ? (
                                <div
                                  className="h-2.5 w-2.5 shrink-0 rounded-full md:h-2 md:w-2"
                                  style={{ backgroundColor: BRAND_BLUE }}
                                />
                              ) : null}
                            </div>
                          </button>

                          {desktop ? (
  <button
    onClick={(event) => {
      event.stopPropagation();
      openThreadActions(t.id);
    }}
    className={[
      "absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full",
      "bg-white text-zinc-500 opacity-0 shadow-sm shadow-zinc-950/[0.06]",
      "transition-all duration-150",
      "group-hover:opacity-100",
      "hover:bg-white hover:text-zinc-700 hover:shadow-md hover:shadow-zinc-950/[0.08]",
      "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
    ].join(" ")}
    aria-label="Acciones"
    title="Acciones"
  >
    <DotsIcon className="h-[17px] w-[17px]" />
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

                <div className="shrink-0 border-t border-zinc-200 pt-4">
                  <div className="mb-4 grid gap-2.5 md:gap-1.5">
                    {secondaryLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-[16px] font-medium text-zinc-500 transition hover:text-zinc-950 md:text-[13px]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <button
                    onClick={() => setAccountScreen("account")}
                    disabled={authLoading}
                    className={[
                      "flex w-full items-center justify-between rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm transition active:scale-[0.99]",
                      authLoading ? "opacity-60" : "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
                          isLoggedIn ? "text-white" : "bg-zinc-100 text-zinc-700",
                        ].join(" ")}
                        style={isLoggedIn ? { backgroundColor: BRAND_BLUE } : undefined}
                      >
                        {isLoggedIn ? userInitial : <UserIcon className="h-[17px] w-[17px]" />}
                      </span>

                      <span className="min-w-0 text-left">
                        <span className="block truncate text-[14px] font-semibold text-zinc-950 md:text-[13px]">
                          {isLoggedIn ? userLabel : "Cuenta"}
                        </span>
                        <span className="block truncate text-[12px] text-zinc-500 md:text-[11px]">
  {isLoggedIn
    ? `${authUserEmail ?? "Email no disponible"} · Plan ${
        currentPlanLabel === "Plus" ? "Plus" : currentPlanLabel
      }`
    : `Plan ${currentPlanLabel === "Plus" ? "Plus" : currentPlanLabel}`}
</span>
                      </span>
                    </span>

                    <ArrowIcon className="h-4 w-4 shrink-0 text-zinc-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {threadMenuOpen && currentThread ? (
        <div
          className="fixed inset-0 z-[95] bg-black/28 backdrop-blur-[2px]"
          onClick={closeThreadActions}
        >
          <div
  className="absolute inset-x-3 bottom-3 select-none overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.20)] md:bottom-6 md:left-6 md:w-[360px] md:inset-x-auto"
  onClick={(e) => e.stopPropagation()}
  onContextMenu={(e) => e.preventDefault()}
>
  <button
    type="button"
    onClick={closeThreadActions}
    className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
    aria-label="Cerrar acciones"
    title="Cerrar"
  >
    <CloseIcon className="h-5 w-5" />
  </button>

  <div className="border-b border-zinc-100 px-5 pb-3 pt-5 pr-14">
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
  <PinIcon className="h-[18px] w-[18px] text-zinc-700" />

  <span className="text-[15px] font-medium text-zinc-900">
    {selectedIsPinned ? "Quitar de fijadas" : "Fijar conversación"}
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