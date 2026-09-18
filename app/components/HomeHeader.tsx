"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CoreUseCaseCheckDemo from "./CoreUseCaseCheckDemo";
import VonuMark from "./VonuMark";
import PublicRouteScrollReset from "./PublicRouteScrollReset";
import {
  GLOBAL_LOCALES,
  checkPath,
  getTopic,
  isGlobalLocale,
  localeInfo,
  navCopy,
  type IndexedPublicSlug,
} from "@/lib/vonu-global/i18n";
import { localizedPublicPath, resolveInternalSlug } from "@/lib/vonu-global/routes";
import { legalDocumentFromPath, legalPath } from "@/lib/vonu-legal/routes";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import "./use-case-product-theme.css";

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

const coreUseCasePaths = new Set(caseSlugs.map((slug) => `/${slug}`));

export default function HomeHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const first = pathname.split("/").filter(Boolean)[0] || "";
  const locale: SupportedLocale = isGlobalLocale(first) ? first : "es";
  const t = navCopy[locale];
  const isCheckHome = pathname === "/check" || /^\/(es|en|fr|de|ar)\/check$/.test(pathname);
  const isCoreUseCase = coreUseCasePaths.has(pathname);

  const pathParts = pathname.split("/").filter(Boolean);
  const currentRouteSlug = (isGlobalLocale(pathParts[0] || "") ? pathParts[1] : pathParts[0]) || "";
  const currentSlug = currentRouteSlug ? resolveInternalSlug(locale, currentRouteSlug) : null;
  const currentLegalDocument = legalDocumentFromPath(pathname);

  const mainLinks = [
    { label: t.product, slug: "producto" as const },
    { label: t.cases, slug: "casos-de-uso" as const, hasMenu: true },
    { label: t.resources, slug: "recursos" as const },
    { label: t.pricing, slug: "precios" as const },
    { label: t.how, slug: "como-funciona" as const },
  ];

  const secondaryLinks = [
    { label: t.privacy, href: legalPath(locale, "privacy") },
    { label: t.terms, href: legalPath(locale, "terms") },
    { label: t.responsible, href: legalPath(locale, "responsible-use") },
    { label: t.contact, href: localizedPublicPath(locale, "contacto") },
  ];

  function localeTarget(next: SupportedLocale) {
    if (isCheckHome) return checkPath(next);
    if (currentLegalDocument) return legalPath(next, currentLegalDocument);
    if (currentSlug) return localizedPublicPath(next, currentSlug);
    return checkPath(next);
  }

  function closeMenu() {
    setOpen(false);
    setCasesOpen(false);
    setLanguageOpen(false);
  }

  return (
    <>
      <PublicRouteScrollReset />
      <header
      data-vonu-use-case={isCoreUseCase ? "core" : undefined}
      className="sticky top-0 z-50 isolate overflow-visible border-b border-white/[0.08] bg-[#0b0e17]/95 text-white backdrop-blur-xl max-md:backdrop-blur-none"
    >
      <div className={["relative z-[10020] mx-auto flex h-[68px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8", isCheckHome ? "relative" : ""].join(" ")}>
        <Link href={checkPath(locale)} className="flex items-center gap-3" aria-label="Vonu">
          <VonuMark className="h-7 w-7" framed />
          <span className="text-[21px] font-semibold tracking-[-0.045em]">Vonu</span>
        </Link>

        <nav className={["hidden items-center gap-7 text-[14px] font-medium text-slate-300 md:flex", isCheckHome ? "md:absolute md:left-1/2 md:-translate-x-1/2" : ""].join(" ")}>
          {mainLinks.map((item) =>
            item.hasMenu ? (
              <div key={item.slug} className="group relative py-5">
                <Link href={localizedPublicPath(locale, item.slug)} className="inline-flex items-center gap-1.5 transition hover:text-white group-focus-within:text-white">
                  {item.label}
                  <span className="text-[10px] text-slate-500">⌄</span>
                </Link>
                <div className="pointer-events-none invisible absolute left-1/2 top-[58px] w-[620px] -translate-x-1/2 translate-y-1 rounded-[20px] border border-white/[0.09] bg-[#101522]/98 p-3 opacity-0 shadow-[0_28px_80px_rgba(0,0,0,.38)] transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
              className="inline-flex h-10 min-w-[52px] items-center justify-center gap-1 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-[12px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              aria-label={t.language}
            >
              {localeInfo[locale].label}
              <span className="text-[10px] text-slate-500">⌄</span>
            </button>
            <div className="pointer-events-none invisible absolute right-0 top-[44px] w-[180px] translate-y-1 rounded-[16px] border border-white/[0.09] bg-[#101522]/98 p-2 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,.4)] transition group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {GLOBAL_LOCALES.map((item) => (
                <Link
                  key={item}
                  href={localeTarget(item)}
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

          {!isCheckHome && (
            <Link href={checkPath(locale)} className="rounded-xl bg-[#7bb7ff] px-4 py-2.5 text-[14px] font-bold text-[#07142f] transition hover:bg-[#a3ceff]">
              {t.analyze}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group relative z-[10040] grid h-12 w-12 min-w-12 touch-manipulation place-items-center border-0 bg-transparent p-0 md:hidden"
          aria-label={open ? "Close" : "Menu"}
          aria-expanded={open}
        >
          <span className="relative block h-6 w-8" aria-hidden="true">
            <span className={["absolute top-[7px] h-[2px] rounded-full bg-emerald-300 transition-transform duration-300 ease-out", open ? "left-[2px] w-[28px] translate-y-[5px] rotate-45" : "right-0 w-[28px] translate-y-0 rotate-0"].join(" ")} />
            <span className={["absolute top-[17px] h-[2px] rounded-full bg-emerald-300 transition-transform duration-300 ease-out", open ? "left-[2px] w-[28px] -translate-y-[5px] -rotate-45" : "right-0 w-[22px] translate-y-0 rotate-0"].join(" ")} />
          </span>
        </button>
      </div>

      <div className={["fixed inset-0 z-[10010] h-[100dvh] min-h-[100dvh] w-screen overflow-hidden bg-[#0b0e17] transition-[opacity,transform] duration-300 ease-out md:hidden", open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-5 opacity-0"].join(" ")}>
        <div className="flex h-full min-h-full w-full flex-col overflow-y-auto overscroll-contain px-6 pb-5 pt-[88px]">
          <nav className="grid gap-0">
            {mainLinks.map((item) =>
              item.hasMenu ? (
                <div key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setCasesOpen((value) => !value)}
                    data-current={currentSlug === item.slug ? "true" : "false"}
                    className="flex min-h-[60px] w-full items-center justify-between py-3 text-left text-[26px] font-semibold leading-none tracking-[-0.045em] text-white"
                    aria-expanded={casesOpen}
                  >
                    <span>{item.label}</span>
                    <span className="text-[26px] font-light leading-none text-emerald-300">{casesOpen ? "−" : "+"}</span>
                  </button>
                  {casesOpen && (
                    <div className="mb-3 grid gap-0 border-l border-emerald-400/25 pl-3">
                      {caseSlugs.map((caseSlug) => (
                        <Link key={caseSlug} href={localizedPublicPath(locale, caseSlug)} onClick={closeMenu} className="py-2.5 text-[14px] font-medium text-slate-400 transition hover:text-emerald-300">
                          {getTopic(locale, caseSlug).eyebrow}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.slug}
                  href={localizedPublicPath(locale, item.slug)}
                  onClick={closeMenu}
                  data-current={currentSlug === item.slug ? "true" : "false"}
                  className="flex min-h-[60px] items-center py-3 text-[26px] font-semibold leading-none tracking-[-0.045em] text-white transition hover:text-emerald-300"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Link href={checkPath(locale)} onClick={closeMenu} className="mx-auto mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-5 text-[13px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:bg-emerald-300 active:scale-[.99]">
            {t.analyze}
          </Link>

          <div className="mt-auto border-t border-white/[0.10] pt-5">
            <div className="mb-5 grid grid-cols-2 gap-x-5 gap-y-3">
              {secondaryLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenu} className="text-[13px] font-medium text-slate-500 transition hover:text-emerald-300">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="vonu-mobile-language mt-4 border-t border-white/[0.10] pt-3">
              {languageOpen && (
                <div className="vonu-mobile-language-popover grid gap-1 p-2">
                  {GLOBAL_LOCALES.map((item) => (
                    <Link
                      key={item}
                      href={localeTarget(item)}
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

        <CoreUseCaseCheckDemo pathname={pathname} />
      </header>
    </>
  );
}
