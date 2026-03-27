"use client";

import React from "react";

type TopBarProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  HOME_URL: string;
  handleOpenPlansCTA: () => void;
  authLoading: boolean;
  isPro: boolean;
  isLoggedIn: boolean;
  topPlanLabel: string;
  openLoginModal: (mode: "signin" | "signup") => void;
  authUserEmail: string | null;
  proLoading: boolean;
  planLabelText: string;
  userInitial: string;
  UserIcon: React.ComponentType<{ className?: string }>;
};

export default function TopBar({
  menuOpen,
  setMenuOpen,
  HOME_URL,
  handleOpenPlansCTA,
  authLoading,
  isPro,
  isLoggedIn,
  topPlanLabel,
  openLoginModal,
  authUserEmail,
  proLoading,
  planLabelText,
  userInitial,
  UserIcon,
}: TopBarProps) {
  return (
    <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
  <div className="h-11 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm flex items-center overflow-hidden pl-1 pr-4">
    <button
  onClick={() => setMenuOpen((v) => !v)}
  className="h-11 w-11 flex items-center justify-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95 p-0"
  aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
  title={menuOpen ? "Cerrar menú" : "Menú"}
>
  <span className="relative block h-5 w-5">
    <span
      className={[
        "absolute left-0 top-[5px] block h-[2.8px] w-[16px] rounded-full bg-zinc-900 transition-all duration-300 ease-out origin-center",
        menuOpen ? "top-[8px] rotate-45" : "",
      ].join(" ")}
    />
    <span
      className={[
        "absolute left-0 top-[11px] block h-[2.8px] w-[16px] rounded-full bg-zinc-900 transition-all duration-300 ease-out origin-center",
        menuOpen ? "top-[8px] -rotate-45" : "",
      ].join(" ")}
    />
  </span>
</button>

    <a
      href={HOME_URL}
      className="h-11 flex items-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95"
      aria-label="Ir a la home"
      title="Ir a la home"
    >
      <span className="font-sans text-[19px] leading-none tracking-[-0.03em] text-zinc-900 font-semibold">
  VonuAI
</span>
    </a>
  </div>
</div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={handleOpenPlansCTA}
          disabled={authLoading}
          className={[
            "h-11 px-4 rounded-full transition-colors cursor-pointer shadow-sm border",
            authLoading
              ? "bg-zinc-200 text-zinc-500 border-zinc-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 border-blue-700/10",
          ].join(" ")}
          title={
            authLoading
              ? "Cargando…"
              : isPro
              ? "Tienes Plus+"
              : isLoggedIn
              ? "Plan Gratis"
              : "Ver planes"
          }
        >
          {topPlanLabel}
        </button>

        <button
          onClick={() => openLoginModal("signin")}
          disabled={authLoading}
          className={[
            "relative h-11 w-11",
            "bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm",
            "grid place-items-center text-zinc-900 hover:bg-white transition-colors cursor-pointer",
            "rounded-full p-0",
            authLoading ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
          aria-label={isLoggedIn ? "Ver cuenta" : "Iniciar sesión"}
          title={
            authLoading
              ? "Cargando…"
              : isLoggedIn
              ? `Sesión: ${authUserEmail ?? "activa"} · Plan: ${
                  proLoading ? "..." : planLabelText
                }`
              : "Iniciar sesión"
          }
        >
          <span
            className={[
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
              authLoading
                ? "bg-zinc-300"
                : isLoggedIn
                ? "bg-emerald-500"
                : "bg-zinc-300",
            ].join(" ")}
            aria-hidden="true"
          />

          {isLoggedIn ? (
            <span className="text-[13px] font-semibold">{userInitial}</span>
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}