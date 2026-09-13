"use client";

import Link from "next/link";
import { useState } from "react";
import VonuMark from "./VonuMark";

const mainLinks = [
  { label: "Producto", href: "/producto" },
  { label: "Casos de uso", href: "/casos-de-uso", hasMenu: true },
  { label: "Recursos", href: "/recursos" },
  { label: "Precios", href: "/precios" },
  { label: "Cómo funciona", href: "/como-funciona" },
];

const survivingCases = [
  { label: "Comprobar una web", href: "/comprobar-web-fiable", hint: "Dominio, HTTPS, señales y reputación" },
  { label: "Comprobar tienda online", href: "/comprobar-tienda-online", hint: "Antes de pagar o dejar tus datos" },
  { label: "Analizar enlace sospechoso", href: "/analizar-link-sospechoso", hint: "Phishing, redirecciones y destino" },
  { label: "Analizar captura", href: "/analizar-captura-pantalla", hint: "WhatsApp, SMS, perfiles y pantallas" },
  { label: "Analizar SMS o WhatsApp", href: "/analizar-sms-estafa", hint: "Urgencia, suplantación y enlaces" },
  { label: "Analizar email sospechoso", href: "/email-sospechoso-estafa", hint: "Remitente, presión y phishing" },
  { label: "Detectar perfil falso", href: "/detectar-perfil-falso", hint: "Perfiles, vendedores y señales de riesgo" },
  { label: "Comprobar inversión", href: "/comprobar-inversion-estafa", hint: "Promesas, presión y señales de fraude" },
];

const secondaryLinks = [
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
  { label: "Contacto", href: "/contacto" },
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
    setCasesOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0b0e17]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/check" className="flex items-center gap-3" aria-label="Vonu inicio">
          <VonuMark className="h-7 w-7" framed />
          <span className="text-[21px] font-bold tracking-[-0.045em]">VONU</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[14px] font-medium text-slate-300 md:flex">
          {mainLinks.map((item) =>
            item.hasMenu ? (
              <div key={item.href} className="group relative py-5">
                <Link href={item.href} className="inline-flex items-center gap-1.5 transition hover:text-white group-focus-within:text-white">
                  {item.label}
                  <span className="text-[10px] text-slate-500">⌄</span>
                </Link>
                <div className="pointer-events-none invisible absolute left-1/2 top-[58px] w-[620px] -translate-x-1/2 translate-y-1 rounded-[20px] border border-white/[0.09] bg-[#101522]/98 p-3 opacity-0 shadow-[0_28px_80px_rgba(0,0,0,.38)] transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="grid grid-cols-2 gap-1">
                    {survivingCases.map((caseItem) => (
                      <Link key={caseItem.href} href={caseItem.href} className="rounded-2xl px-4 py-3 transition hover:bg-white/[0.045]">
                        <span className="block text-[14px] font-semibold text-slate-100">{caseItem.label}</span>
                        <span className="mt-1 block text-[12px] leading-5 text-slate-500">{caseItem.hint}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Link
          href="/check"
          className="hidden rounded-xl bg-emerald-400 px-4 py-2.5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300 md:inline-flex"
        >
          Analizar ahora
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="relative z-[70] grid h-12 w-12 touch-manipulation place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      <div
        className={[
          "fixed inset-x-0 top-[68px] z-[60] bg-[#0b0e17] transition-all duration-200 md:hidden",
          open ? "pointer-events-auto h-[calc(100dvh-68px)] opacity-100" : "pointer-events-none h-0 opacity-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-4">
          <nav className="grid gap-1">
            {mainLinks.map((item) =>
              item.hasMenu ? (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setCasesOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-2xl py-3 text-left text-[27px] font-semibold leading-none tracking-[-0.05em] text-white"
                    aria-expanded={casesOpen}
                  >
                    <span>{item.label}</span>
                    <span className="text-[18px] font-normal text-slate-500">{casesOpen ? "−" : "+"}</span>
                  </button>
                  {casesOpen && (
                    <div className="mb-3 grid gap-1 border-l border-emerald-400/20 pl-3">
                      {survivingCases.map((caseItem) => (
                        <Link key={caseItem.href} href={caseItem.href} onClick={closeMenu} className="rounded-xl px-2 py-2.5 text-[15px] font-medium text-slate-300 hover:bg-white/[0.04]">
                          {caseItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} onClick={closeMenu} className="rounded-2xl py-3 text-[27px] font-semibold leading-none tracking-[-0.05em] text-white">
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-auto pt-8">
            <div className="mb-5 grid gap-3 border-t border-white/[0.08] pt-5">
              {secondaryLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu} className="text-[14px] font-medium text-slate-500 hover:text-slate-300">
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/check" onClick={closeMenu} className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3.5 text-[15px] font-bold text-[#07110d]">
              Analizar ahora
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
