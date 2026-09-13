"use client";

import Link from "next/link";
import { useState } from "react";

function Mark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/10">
      <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M20 3.8 33.8 11v18L20 36.2 6.2 29V11L20 3.8Z" stroke="rgb(110 231 183)" strokeWidth="2" />
        <path d="m12.7 14.2 7.3 13 7.3-13" stroke="rgb(110 231 183)" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const mainLinks = [
  { label: "Vonu Check", href: "/es/check" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Precios", href: "/precios" },
  { label: "Privacidad", href: "/legal/privacidad" },
];

const secondaryLinks = [
  { label: "Aviso legal", href: "/legal/aviso-legal" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
  { label: "Contacto", href: "/contacto" },
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0b0e17]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/es/check" className="flex items-center gap-3" aria-label="Vonu inicio">
          <Mark />
          <span className="text-[21px] font-bold tracking-[-0.045em]">VONU</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] font-medium text-slate-300 md:flex">
          {mainLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/es/check"
          className="hidden rounded-xl bg-emerald-400 px-4 py-2.5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300 md:inline-flex"
        >
          Analizar ahora
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-[#0b0e17] px-4 pb-6 pt-3 md:hidden">
          <nav className="mx-auto grid max-w-[1320px] gap-1">
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[16px] font-semibold text-slate-200 hover:bg-white/[0.04]"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-white/[0.08]" />
            {secondaryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[14px] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/es/check"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-[14px] font-bold text-[#07110d]"
            >
              Analizar ahora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
