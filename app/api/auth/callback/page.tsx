// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const [msg, setMsg] = useState("Finalizando inicio de sesión…");

  useEffect(() => {
    (async () => {
      try {
        // Supabase v2: procesa code/verifier de la URL
        const { error } = await supabaseBrowser.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          setMsg("No he podido completar el login. Vuelve a intentarlo.");
          return;
        }
        setMsg("✅ Sesión iniciada. Ya puedes volver al chat.");
        setTimeout(() => {
          window.location.href = "/"; // vuelve al chat
        }, 800);
      } catch {
        setMsg("No he podido completar el login. Vuelve a intentarlo.");
      }
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 text-center">
        <div className="text-sm text-zinc-800">{msg}</div>
      </div>
    </div>
  );
}
