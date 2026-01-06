"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Si en algún momento quieres mandar a otra ruta, cambia aquí:
    router.replace("/");
  }, [router]);

  return null;
}
