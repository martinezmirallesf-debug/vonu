"use client";

import { useEffect, useState } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const labels: Record<SupportedLocale, string> = {
  es: "Instalar Vonu",
  en: "Install Vonu",
  fr: "Installer Vonu",
  de: "Vonu installieren",
  ar: "تثبيت Vonu",
};

function storedPrompt() {
  return (window as typeof window & { __vonuInstallPrompt?: InstallPromptEvent }).__vonuInstallPrompt;
}

export default function PwaInstallButton({ locale }: { locale: SupportedLocale }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    if (standalone) return;

    const sync = () => setAvailable(Boolean(storedPrompt()));
    sync();
    window.addEventListener("vonu-install-ready", sync);
    return () => window.removeEventListener("vonu-install-ready", sync);
  }, []);

  if (!available) return null;

  async function install() {
    const deferred = storedPrompt();
    if (!deferred) return;

    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      fetch("/api/pwa-diagnostic?state=prompt-" + encodeURIComponent(choice.outcome) + "&controller=" + (navigator.serviceWorker?.controller ? "yes" : "no"), { cache: "no-store" }).catch(() => {});
      if (choice.outcome === "accepted") {
        (window as typeof window & { __vonuInstallPrompt?: InstallPromptEvent }).__vonuInstallPrompt = undefined;
        setAvailable(false);
      }
    } catch (error) {
      fetch("/api/pwa-diagnostic?state=prompt-error&controller=" + (navigator.serviceWorker?.controller ? "yes" : "no"), { cache: "no-store" }).catch(() => {});
    }
  }

  return (
    <button
      type="button"
      onClick={install}
      className="mx-auto mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#7bb7ff]/25 bg-[#7bb7ff]/10 px-4 text-[12px] font-semibold text-[#a3ceff] transition hover:bg-[#7bb7ff]/15"
    >
      <span aria-hidden="true">↓</span>
      <span>{labels[locale]}</span>
    </button>
  );
}
