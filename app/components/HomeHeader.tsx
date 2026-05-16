"use client";

import Link from "next/link";
import { useState } from "react";

function LogoMark() {
  return (
    <div className="flex items-center gap-1">
      <img
        src="/logo/vonu-cube-black.png"
        alt="VonuAI"
        className="h-[23px] w-[23px] object-contain"
      />

      <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
        VonuAI
      </span>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
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

const homeLinks = [
  { label: "Producto", href: "#producto" },
  { label: "Casos de uso", href: "#casos" },
  { label: "Precios", href: "#precios" },
  { label: "Ayuda", href: "#faq" },
];

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden h-16 items-center justify-between md:flex">
          <Link href="/" aria-label="VonuAI inicio">
            <LogoMark />
          </Link>

          <nav className="flex items-center gap-8 text-[14px] font-medium text-zinc-600">
            {homeLinks.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-zinc-950">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Entrar
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] transition hover:scale-[1.02] active:scale-[0.99]"
            >
              Probar Vonu
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition active:scale-95"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="relative block h-4 w-5">
              <span
                className={[
                  "absolute left-0 top-[4px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
                  mobileMenuOpen ? "translate-y-[4px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[12px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
                  mobileMenuOpen ? "-translate-y-[4px] -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>

          <Link href="/" aria-label="VonuAI inicio" onClick={closeMenu}>
            <LogoMark />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "md:hidden overflow-hidden bg-white transition-[max-height,opacity] duration-300",
          mobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-[1500px] px-4 pb-5">
          <nav className="rounded-[28px] border border-zinc-200 bg-[#f8f9fa] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            {homeLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-[20px] px-4 py-3 text-[16px] font-medium text-zinc-850 transition hover:bg-white"
              >
                {item.label}
                <span className="text-zinc-400">→</span>
              </a>
            ))}

            <div className="mt-2 grid gap-2 border-t border-zinc-200 pt-2">
              <Link
                href="/chat"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-[20px] bg-zinc-950 px-4 py-3 text-[16px] font-semibold text-white"
              >
                Probar Vonu
                <ArrowIcon />
              </Link>

              <Link
                href="/chat"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3 text-[16px] font-medium text-zinc-800"
              >
                Entrar
                <span className="text-zinc-400">→</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}