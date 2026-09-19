"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PromptWindow = typeof window & {
  __vonuInstallPrompt?: InstallPromptEvent;
};

function report(state: string) {
  fetch(
    "/api/pwa-diagnostic?state=" +
      encodeURIComponent(state) +
      "&controller=" +
      (navigator.serviceWorker?.controller ? "yes" : "no"),
    { cache: "no-store" },
  ).catch(() => {});
}

export default function PwaInstallPromptBar() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    if (standalone) return;

    const sync = () => {
      const hasPrompt = Boolean((window as PromptWindow).__vonuInstallPrompt);
      setAvailable(hasPrompt);
      report(hasPrompt ? "install-bar-ready" : "install-bar-waiting");
    };

    sync();
    window.addEventListener("vonu-install-ready", sync);
    window.addEventListener("pageshow", sync);

    return () => {
      window.removeEventListener("vonu-install-ready", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);

  if (!available) return null;

  function install() {
    const deferred = (window as PromptWindow).__vonuInstallPrompt;
    if (!deferred) {
      report("install-bar-prompt-missing");
      setAvailable(false);
      return;
    }

    try {
      // Must stay synchronous with the user's tap.
      deferred.prompt();
      report("install-bar-prompt-called");

      deferred.userChoice
        .then((choice) => {
          report("install-bar-" + choice.outcome);
          (window as PromptWindow).__vonuInstallPrompt = undefined;
          setAvailable(false);
        })
        .catch((error) => {
          const name = error instanceof DOMException ? error.name : "unknown";
          report("install-bar-choice-error-" + name);
        });
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "unknown";
      report("install-bar-sync-error-" + name);
    }
  }

  return (
    <button
      type="button"
      onClick={install}
      className="fixed bottom-5 left-1/2 z-[20000] -translate-x-1/2 rounded-2xl border border-[#7bb7ff]/30 bg-[#091632]/95 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-md"
      aria-label="Instalar Vonu"
    >
      Instalar Vonu
    </button>
  );
}
