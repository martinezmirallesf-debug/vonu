"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function LanguageSelectorCustom({ locale }: { locale: SupportedLocale }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [mobileHost, setMobileHost] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const mobileRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const select = document.querySelector<HTMLSelectElement>('nav select[aria-label="Language"]');
    const parent = select?.parentElement ?? null;
    if (!parent) return;

    parent.classList.add("language-custom-host");
    setHost(parent);

    return () => {
      parent.classList.remove("language-custom-host");
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
    if (!open && !mobileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (open && !rootRef.current?.contains(target)) setOpen(false);
      if (mobileOpen && !mobileRootRef.current?.contains(target)) setMobileOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open, mobileOpen]);

  function goToLocale(item: SupportedLocale) {
    setOpen(false);
    setMobileOpen(false);
    if (item === locale) return;

    const next = new URL(window.location.href);
    next.pathname = `/${item}/check`;
    window.location.assign(next.toString());
  }

  const desktopSelector = host
    ? createPortal(
        <div ref={rootRef} className="language-custom-root">
          <button
            type="button"
            className="language-custom-trigger"
            aria-label="Language"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{localeMeta[locale].label}</span>
            <span className="language-custom-chevron" aria-hidden="true">⌄</span>
          </button>

          {open && (
            <div className="language-custom-menu" role="menu">
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
        host,
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
