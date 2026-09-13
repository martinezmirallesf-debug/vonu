"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function LanguageSelectorCustom({ locale }: { locale: SupportedLocale }) {
  const [mobileHost, setMobileHost] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const select = document.querySelector<HTMLSelectElement>('nav select[aria-label="Language"]');
    if (!select) return;

    const onChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const nextLocale = target.value as SupportedLocale;
      if (!supportedLocales.includes(nextLocale) || nextLocale === locale) return;

      event.stopImmediatePropagation();
      const next = new URL(window.location.href);
      next.pathname = `/${nextLocale}/check`;
      window.location.assign(next.toString());
    };

    select.addEventListener("change", onChange, true);
    return () => select.removeEventListener("change", onChange, true);
  }, [locale]);

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
    if (!mobileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!mobileRootRef.current?.contains(target)) setMobileOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  function goToLocale(item: SupportedLocale) {
    setMobileOpen(false);
    if (item === locale) return;

    const next = new URL(window.location.href);
    next.pathname = `/${item}/check`;
    window.location.assign(next.toString());
  }

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

  return mobileSelector;
}
