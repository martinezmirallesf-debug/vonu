"use client";

import { useEffect } from "react";

export default function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js?v=20260919-pwa2", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        // Installation remains non-blocking if a browser disables service workers.
      });
  }, []);

  return null;
}
