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

function LogoMark() {
  return (
    <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
      VonuAI
    </span>
  );
}

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
    <>
      <div
        ref={topBarRef}
        className={[
          "vonu-chat-topbar fixed inset-x-0 top-0 z-[95]",
          "pointer-events-none md:hidden",
        ].join(" ")}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 translate-x-[6px] items-center justify-between">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={[
                "-ml-2 grid h-10 w-10 place-items-center rounded-full text-zinc-950",
                "transition active:scale-95 pointer-events-auto",
                menuOpen
                  ? "border border-transparent bg-transparent shadow-none backdrop-blur-0"
                  : "border border-zinc-200/80 bg-white/92 shadow-sm backdrop-blur-xl",
              ].join(" ")}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              title={menuOpen ? "Cerrar menú" : "Menú"}
            >
              <BurgerIcon open={menuOpen} />
            </button>

            <a
  href={HOME_URL}
  className={[
    "pointer-events-auto translate-x-[2px] flex h-10 items-center rounded-full px-4",
                "transition active:scale-[0.99]",
                menuOpen
                  ? "border border-transparent bg-transparent shadow-none backdrop-blur-0"
                  : "border border-zinc-200/80 bg-white/92 shadow-sm backdrop-blur-xl",
              ].join(" ")}
              aria-label="Ir a la home"
              title="Ir a la home"
            >
              <LogoMark />
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html.vonu-account-menu-open .vonu-chat-topbar {
          display: none;
        }
      `}</style>
    </>
  );
}