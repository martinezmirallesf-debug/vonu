"use client";

import Link from "next/link";
import { useState } from "react";

function LogoMark() {
  return (
    <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
      VonuAI
    </span>
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
  { label: "Producto", href: "/#producto" },
  { label: "Casos de uso", href: "/#casos" },
  { label: "Precios", href: "/precios" },
  { label: "Cómo funciona", href: "/como-funciona" },
];

const secondaryLinks = [
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
  { label: "Contacto", href: "/contacto" },
];

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
  <div className="mx-auto max-w-[1500px] px-6 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden h-16 items-center justify-between md:flex">
          <Link href="/" aria-label="VonuAI inicio">
            <LogoMark />
          </Link>

          <nav className="flex items-center gap-8 text-[14px] font-medium text-zinc-600">
            {homeLinks.map((item) => (
  <Link key={item.href} href={item.href} className="hover:text-zinc-950">
    {item.label}
  </Link>
))}
          </nav>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] transition hover:scale-[1.02] active:scale-[0.99]"
          >
            Probar Vonu
            <ArrowIcon />
          </Link>
        </div>

        {/* Mobile top bar */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <button
  type="button"
  onClick={() => setMobileMenuOpen((v) => !v)}
  className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition active:scale-95"
  aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={mobileMenuOpen}
>
            <span className="relative block h-5 w-6">
              <span
                className={[
                  "absolute left-0 top-[6px] h-[2.4px] rounded-full bg-current transition-all duration-200",
                  mobileMenuOpen
                    ? "w-6 translate-y-[4px] rotate-45"
                    : "w-6",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[14px] h-[2.4px] rounded-full bg-current transition-all duration-200",
                  mobileMenuOpen
                    ? "w-6 -translate-y-[4px] -rotate-45"
                    : "w-[17px]",
                ].join(" ")}
              />
            </span>
          </button>

          <Link href="/" aria-label="VonuAI inicio" onClick={closeMenu}>
  <LogoMark />
</Link>
        </div>
      </div>

      {/* Mobile menu estilo OpenAI */}
      <div
        className={[
          "fixed inset-x-0 top-16 z-40 md:hidden",
          "bg-white transition-all duration-300",
          mobileMenuOpen
            ? "pointer-events-auto h-[calc(100dvh-64px)] opacity-100"
            : "pointer-events-none h-0 opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-full flex-col justify-between overflow-y-auto px-5 pb-7 pt-3",
            "transition-transform duration-300",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-3",
          ].join(" ")}
        >
          <nav className="grid gap-1">
            {homeLinks.map((item) => (
  <Link
    key={item.href}
    href={item.href}
    onClick={closeMenu}
    className="block rounded-2xl px-1 py-4 text-[28px] font-semibold leading-none tracking-[-0.055em] text-zinc-950"
  >
    {item.label}
  </Link>
))}
          </nav>

          <div className="mt-8">
            <div className="mb-5 grid gap-3 border-t border-zinc-200 pt-5">
              {secondaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-[15px] font-medium text-zinc-500"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/chat"
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.16)] active:scale-[0.99]"
            >
              Probar Vonu
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}