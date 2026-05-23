"use client";

import React from "react";

type TopBarProps = {
  topBarRef?: React.RefObject<HTMLDivElement | null>;
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

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6">
      <span
        className={[
          "absolute left-0 top-[6px] h-[2.4px] rounded-full bg-current transition-all duration-200",
          open ? "w-6 translate-y-[4px] rotate-45" : "w-6",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[14px] h-[2.4px] rounded-full bg-current transition-all duration-200",
          open ? "w-6 -translate-y-[4px] -rotate-45" : "w-[17px]",
        ].join(" ")}
      />
    </span>
  );
}

export default function TopBar({
  topBarRef,
  menuOpen,
  setMenuOpen,
  HOME_URL,
}: TopBarProps) {
  return (
    <div
      ref={topBarRef}
      className={`fixed ${
        menuOpen ? "z-[95]" : "z-50"
      } flex items-center justify-between pointer-events-none md:hidden`}
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 12px)",
        left: "max(24px, env(safe-area-inset-left, 0px))",
        right: "max(24px, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={[
            "grid h-11 w-11 place-items-center rounded-full",
            "border border-zinc-200/80 bg-white/92 text-zinc-950 shadow-sm",
            "backdrop-blur-xl transition active:scale-95",
          ].join(" ")}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          title={menuOpen ? "Cerrar menú" : "Menú"}
        >
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      <div className="pointer-events-auto">
        <a
          href={HOME_URL}
          className={[
            "flex h-11 items-center rounded-full px-4",
            "border border-zinc-200/80 bg-white/92 shadow-sm",
            "backdrop-blur-xl transition active:scale-[0.99]",
          ].join(" ")}
          aria-label="Ir a la home"
          title="Ir a la home"
        >
          <span className="font-sans text-[19px] font-semibold leading-none tracking-[-0.03em] text-zinc-900">
            VonuAI
          </span>
        </a>
      </div>
    </div>
  );
}