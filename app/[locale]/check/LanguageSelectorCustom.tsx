"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function LanguageSelectorCustom({ locale }: { locale: SupportedLocale }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!host) return null;

  return createPortal(
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
              onClick={() => {
                setOpen(false);
                if (item !== locale) window.location.href = `/${item}/check`;
              }}
            >
              {localeMeta[item].label}
            </button>
          ))}
        </div>
      )}
    </div>,
    host,
  );
}
