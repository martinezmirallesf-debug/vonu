"use client";

import Link from "next/link";
import { useState } from "react";
import VonuMark from "./VonuMark";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import {
  GLOBAL_LOCALES,
  type IndexedPublicSlug,
  checkPath,
  getTopic,
  localeInfo,
  navCopy,
} from "@/lib/vonu-global/i18n";
import { localizedPublicPath } from "@/lib/vonu-global/routes";

const caseSlugs: IndexedPublicSlug[] = [
  "comprobar-web-fiable",
  "comprobar-tienda-online",
  "analizar-link-sospechoso",
  "analizar-captura-pantalla",
  "analizar-sms-estafa",
  "email-sospechoso-estafa",
  "detectar-perfil-falso",
  "comprobar-inversion-estafa",
];

export default function GlobalPublicHeader({
  locale,
  slug,
}: {
  locale: SupportedLocale;
  slug: IndexedPublicSlug;
}) {
  const [open, setOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const t = navCopy[locale];

  const mainLinks = [
    { label: t.product, slug: "producto" as const },
    { label: t.cases, slug: "casos-de-uso" as const, hasMenu: true },
    { label: t.resources, slug: "recursos" as const },
    { label: t.pricing, slug: "precios" as const },
    { label: t.how, slug: "como-funciona" as const },
  ];

  function closeMenu() {
    setOpen(false);
    setCasesOpen(false);
    setLanguageOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 isolate overflow-visible border-b border-white/[0.08] bg-[#0b0e17]/95 text-white backdrop-blur-xl max-md:backdrop-blur-none">
      <div className="relative z-[10020] mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href={checkPath(locale)} className="flex shrink-0 items-center gap-3" aria-label="Vonu">
          <VonuMark className="h-7 w-7" framed />
          <span className="text-[21px] font-semibold tracking-[-0.045em]">VONU</span>
        </Link>

        <nav className="hidden items-center gap-6 text-[14px] font-medium text-slate-300 lg:flex">
          {mainLinks.map((item) =>
            item.hasMenu ? (
              <div key={item.slug} className="group relative py-5">
                <Link href={localizedPublicPath(locale, item.slug)} className="inline-flex items-center gap-1.5 transition hover:text-white">
                  {item.label}
                  <span className="text-[10px] text-slate-500">⌄</span>
                </Link>
                <div className="pointer-events-none invisible absolute left-1/2 top-[58px] w-[620px] -translate-x-1/2 translate-y-1 rounded-[20px] border border-white/[0.09] bg-[#101522]/98 p-3 opacity-0 shadow-[0_28px_80px_rgba(0,0,0,.38)] transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1">
                    {caseSlugs.map((caseSlug) => {
                      const topic = getTopic(locale, caseSlug);
                      return (
                        <Link key={caseSlug} href={localizedPublicPath(locale, caseSlug)} className="rounded-2xl px-4 py-3 transition hover:bg-white/[0.045]">
                          <span className="block text-[14px] font-semibold text-slate-100">{topic.eyebrow}</span>
                          <span className="mt-1 block text-[12px] leading-5 text-slate-500">{topic.hero}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.slug} href={localizedPublicPath(locale, item.slug)} className="transition hover:text-white">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="group relative">
            <button
              type="button"
              className="inline-flex h-10 min-w-[54px] items-center justify-center gap-1 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-[12px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              aria-label={t.language}
            >
              {localeInfo[locale].label}
              <span className="text-[10px] text-slate-500">⌄</span>
            </button>
            <div className="pointer-events-none invisible absolute right-0 top-[44px] w-[180px] translate-y-1 rounded-[16px] border border-white/[0.09] bg-[#101522]/98 p-2 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,.4)] transition group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {GLOBAL_LOCALES.map((item) => (
                <Link
                  key={item}
                  href={localizedPublicPath(item, slug)}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition",
                    item === locale ? "bg-emerald-400/[0.10] text-emerald-200" : "text-slate-400 hover:bg-white/[0.045] hover:text-white",
                  ].join(" ")}
                >
                  <span>{localeInfo[item].native}</span>
                  <span className="text-[10px] font-bold">{localeInfo[item].label}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={checkPath(locale)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#7bb7ff] px-4 text-[13px] font-bold text-[#07142f] transition hover:bg-[#a3ceff]"
          >
            {t.analyze}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="relative z-[10040] grid h-12 w-12 place-items-center md:hidden"
          aria-label={open ? "Close" : "Menu"}
          aria-expanded={open}
        >
          <span className="relative block h-6 w-8" aria-hidden="true">
            <span className={["absolute top-[7px] h-[2px] rounded-full bg-emerald-300 transition-transform", open ? "left-[2px] w-[28px] translate-y-[5px] rotate-45" : "right-0 w-[28px]"].join(" ")} />
            <span className={["absolute top-[17px] h-[2px] rounded-full bg-emerald-300 transition-transform", open ? "left-[2px] w-[28px] -translate-y-[5px] -rotate-45" : "right-0 w-[22px]"].join(" ")} />
          </span>
        </button>
      </div>

      <div className={["fixed inset-0 z-[10010] h-[100dvh] min-h-[100dvh] w-screen overflow-hidden bg-[#0b0e17] transition-[opacity,transform] duration-300 ease-out md:hidden", open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0"].join(" ")}>
        <div className="flex h-full min-h-full w-full flex-col overflow-y-auto overscroll-contain px-6 pb-5 pt-[88px]">
          <nav className="grid">
            {mainLinks.map((item) =>
              item.hasMenu ? (
                <div key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setCasesOpen((value) => !value)}
                    className="flex min-h-[60px] w-full items-center justify-between py-3 text-start text-[26px] font-semibold leading-none tracking-[-0.045em] text-white"
                    aria-expanded={casesOpen}
                  >
                    <span>{item.label}</span>
                    <span className="text-[26px] font-light leading-none text-emerald-300">{casesOpen ? "−" : "+"}</span>
                  </button>
                  {casesOpen && (
                    <div className="mb-3 grid border-s border-emerald-400/25 ps-3">
                      {caseSlugs.map((caseSlug) => (
                        <Link key={caseSlug} href={localizedPublicPath(locale, caseSlug)} onClick={closeMenu} className="py-2.5 text-[14px] text-slate-400">
                          {getTopic(locale, caseSlug).eyebrow}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.slug} href={localizedPublicPath(locale, item.slug)} onClick={closeMenu} className="flex min-h-[60px] items-center py-3 text-[26px] font-semibold leading-none tracking-[-0.045em] text-white">
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-auto border-t border-white/[0.10] pt-5">
            <Link href={checkPath(locale)} onClick={closeMenu} className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#7bb7ff] px-5 text-[15px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.22)] transition hover:bg-[#a3ceff]">
              {t.analyze}
            </Link>

            <div className="vonu-mobile-language mt-4 border-t border-white/[0.10] pt-3">
              {languageOpen && (
                <div className="vonu-mobile-language-popover grid gap-1 p-2">
                  {GLOBAL_LOCALES.map((item) => (
                    <Link
                      key={item}
                      href={localizedPublicPath(item, slug)}
                      onClick={closeMenu}
                      data-active={item === locale ? "true" : "false"}
                      className="flex min-h-[42px] items-center justify-between rounded-xl border border-transparent px-3 text-[13px] font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <span>{localeInfo[item].native}</span>
                      <span className="text-[11px] font-bold text-slate-500">{localeInfo[item].label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setLanguageOpen((value) => !value)}
                className="flex min-h-[38px] w-full items-center justify-between text-[13px] font-semibold text-slate-500"
                aria-expanded={languageOpen}
              >
                <span>{t.language}</span>
                <span className="text-[#8ec2ff]">{localeInfo[locale].label} {languageOpen ? "⌃" : "⌄"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
