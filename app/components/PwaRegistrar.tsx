"use client";

import { useEffect } from "react";

export default function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // Installation remains non-blocking if a browser disables service workers.
      });
  }, []);

  return null;
}
