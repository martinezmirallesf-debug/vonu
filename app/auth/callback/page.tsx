"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  useEffect(() => {
    (async () => {
      // Supabase-js normalmente captura la sesión automáticamente al volver.
      // Esto fuerza a leer sesión y luego manda al home/chat.
      try {
        await supabaseBrowser.auth.getSession();
      } catch {}
      window.location.replace("/");
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-zinc-600">
      Finalizando inicio de sesión…
    </div>
  );
}
