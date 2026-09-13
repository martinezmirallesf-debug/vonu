"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function LanguageSelectorCustom({ locale }: { locale: SupportedLocale }) {
  const [desktopHost, setDesktopHost] = useState<HTMLElement | null>(null);
  const [mobileHost, setMobileHost] = useState<HTMLElement | null>(null);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopRootRef = useRef<HTMLDivElement>(null);
  const mobileRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("header nav");
    const select = nav?.querySelector<HTMLSelectElement>('select[aria-label="Language"]');
    const nativeWrapper = select?.parentElement ?? null;
    if (!nav || !nativeWrapper) return;

    nativeWrapper.classList.add("vonu-language-native-hidden");
    setDesktopHost(nav);

    return () => {
      nativeWrapper.classList.remove("vonu-language-native-hidden");
    };
  }, []);

  useEffect(() => {
    const locateMobileHost = () => {
      const select = document.querySelector<HTMLSelectElement>('header > div:nth-child(2) select');
      const parent = select?.parentElement ?? null;
      setMobileHost(parent);
      if (!parent) setMobileOpen(false);
    };

    locateMobileHost();
    const observer = new MutationObserver(locateMobileHost);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!desktopOpen && !mobileOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (desktopOpen && !desktopRootRef.current?.contains(target)) setDesktopOpen(false);
      if (mobileOpen && !mobileRootRef.current?.contains(target)) setMobileOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [desktopOpen, mobileOpen]);

  function goToLocale(item: SupportedLocale) {
    setDesktopOpen(false);
    setMobileOpen(false);
    if (item === locale) return;

    const next = new URL(window.location.href);
    next.pathname = `/${item}/check`;
    window.location.assign(next.toString());
  }

  const desktopSelector = desktopHost
    ? createPortal(
        <div ref={desktopRootRef} className="vonu-language-desktop-root">
          <button
            type="button"
            className="vonu-language-desktop-trigger"
            aria-label="Language"
            aria-haspopup="menu"
            aria-expanded={desktopOpen}
            onClick={() => setDesktopOpen((value) => !value)}
          >
            <span>{localeMeta[locale].label}</span>
            <span className="vonu-language-desktop-chevron" aria-hidden="true">⌄</span>
          </button>

          {desktopOpen && (
            <div className="vonu-language-desktop-menu" role="menu">
              {supportedLocales.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="menuitem"
                  className={item === locale ? "is-active" : ""}
                  aria-current={item === locale ? "page" : undefined}
                  onClick={() => goToLocale(item)}
                >
                  {localeMeta[item].label}
                </button>
              ))}
            </div>
          )}
        </div>,
        desktopHost,
      )
    : null;

  const mobileSelector = mobileHost
    ? createPortal(
        <div ref={mobileRootRef} className="language-mobile-root">
          <button
            type="button"
            className="language-mobile-trigger"
            aria-label="Language"
            aria-haspopup="menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span>{localeMeta[locale].label}</span>
            <span className="language-mobile-chevron" aria-hidden="true">⌄</span>
          </button>

          {mobileOpen && (
            <div className="language-mobile-menu" role="menu">
              {supportedLocales.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="menuitem"
                  className={item === locale ? "is-active" : ""}
                  aria-current={item === locale ? "page" : undefined}
                  onClick={() => goToLocale(item)}
                >
                  {localeMeta[item].label}
                </button>
              ))}
            </div>
          )}
        </div>,
        mobileHost,
      )
    : null;

  return (
    <>
      {desktopSelector}
      {mobileSelector}
    </>
  );
}
