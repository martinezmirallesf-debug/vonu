// app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  image?: string;
  streaming?: boolean;
};

type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function initialAssistantMessage(): Message {
  return {
    id: "init",
    role: "assistant",
    text:
      "Hola 👋 Soy **Vonu**.\n\n" +
      "Cuéntame tu situación (o adjunta una captura) y te digo **qué pinta tiene**, el **riesgo real** y **qué haría ahora** para decidir con calma.\n\n" +
      "_Importante: no compartas contraseñas, códigos ni datos bancarios._",
  };
}

function makeNewThread(): ChatThread {
  const id = crypto.randomUUID();
  return {
    id,
    title: "Nueva consulta",
    updatedAt: Date.now(),
    messages: [initialAssistantMessage()],
  };
}

function makeTitleFromText(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "Nueva consulta";
  return t.length > 34 ? t.slice(0, 34) + "…" : t;
}

const STORAGE_KEY = "vonu_threads_v1";
const HOME_URL = "https://vonuai.com";

// ✅ regla: tras 2 análisis, pedir login/pago
const FREE_MESSAGE_LIMIT = 2;

function isDesktopPointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(pointer: fine)")?.matches ?? true;
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OAuthLogo({ src, alt, invert }: { src: string; alt: string; invert?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-5"
      style={{
        display: "block",
        filter: invert ? "invert(1)" : undefined,
      }}
      draggable={false}
    />
  );
}

type AuthCardMode = "signin" | "signup";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ URL canónica para redirects (evita errores en Supabase OAuth por preview/origin)
  const SITE_URL = ((process.env.NEXT_PUBLIC_SITE_URL as string | undefined) || "https://app.vonuai.com").replace(/\/$/, "");

  // ===== AUTH =====
  const [authLoading, setAuthLoading] = useState(true);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUserName, setAuthUserName] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthCardMode>("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginSending, setLoginSending] = useState(false);
  const [loginMsg, setLoginMsg] = useState<string | null>(null);

  const loginEmailRef = useRef<HTMLInputElement>(null);

  // ===== PAYWALL / PRO (interno) =====
  const [proLoading, setProLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [plan, setPlan] = useState<"free" | "monthly" | "yearly">("yearly");
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  // ✅ Si el usuario intenta pagar estando logout, guardamos el plan y tras login lanzamos checkout
  const [pendingCheckoutPlan, setPendingCheckoutPlan] = useState<"monthly" | "yearly" | null>(null);

  // Mensaje post-checkout
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isLoggedIn = !authLoading && !!authUserId;
  const isBlockedByPaywall = !authLoading && !!authUserId && !proLoading && !isPro;

  // ===== Copy marketing (visible) =====
  const PLUS_TEXT = "Plus+";
  const PLUS_NODE = (
    <span className="inline-flex items-baseline">
      Plus
      <sup className="ml-[1px] text-[12px] font-bold leading-none relative -top-[5px]">+</sup>
    </span>
  );

  // ✅ FIX: soportar nombre/email desde Microsoft (identity_data) si user_metadata viene vacío
  function deriveName(email: string | null, metaName?: string | null, identityName?: string | null) {
    const n = (metaName ?? "").trim() || (identityName ?? "").trim();
    if (n) return n;

    if (!email) return null;
    const base = email.split("@")[0] || "";
    if (!base) return null;
    const cleaned = base.replace(/[._-]+/g, " ").trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : null;
  }

  async function refreshProStatus() {
    if (!authUserId) {
      setIsPro(false);
      return;
    }
    setProLoading(true);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) {
        setIsPro(false);
        return;
      }

      const res = await fetch("/api/subscription/status", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));
      setIsPro(!!json?.active);
    } catch {
      setIsPro(false);
    } finally {
      setProLoading(false);
    }
  }

  async function refreshAuthSession() {
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const u = data?.session?.user;

      const identities = (u as any)?.identities ?? [];
      const identityData = identities?.[0]?.identity_data ?? null;

      const identityEmail =
        (identityData?.email as string | undefined) ??
        (identityData?.preferred_username as string | undefined) ??
        null;

      const identityName =
        (identityData?.name as string | undefined) ??
        (identityData?.full_name as string | undefined) ??
        (identityData?.displayName as string | undefined) ??
        null;

      const email = (u?.email ?? identityEmail ?? null) as string | null;
      const id = u?.id ?? null;
      const metaName = (u?.user_metadata?.full_name ?? u?.user_metadata?.name ?? null) as string | null;

      setAuthUserEmail(email);
      setAuthUserId(id);
      setAuthUserName(deriveName(email, metaName, identityName));
    } catch {
      setAuthUserEmail(null);
      setAuthUserId(null);
      setAuthUserName(null);
    } finally {
      setAuthLoading(false);
    }
  }

  function decodeMaybe(x: string) {
    try {
      return decodeURIComponent(x);
    } catch {
      return x;
    }
  }

  // ✅ CLAVE: capturar retorno de OAuth (Google/Microsoft) y guardar sesión (Supabase v2)
  async function handleOAuthReturnIfPresent() {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);

      const checkout = url.searchParams.get("checkout"); // preservar Stripe

      // errores pueden venir en query o en hash (depende del proveedor)
      const qError = url.searchParams.get("error");
      const qErrorDesc = url.searchParams.get("error_description");

      const hash = typeof window.location.hash === "string" ? window.location.hash : "";
      const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
      const hError = hashParams.get("error");
      const hErrorDesc = hashParams.get("error_description");

      const errorRaw = qError ?? hError;
      const errorDescRaw = qErrorDesc ?? hErrorDesc;

      // Si hay error OAuth, lo mostramos (AZURE suele devolver aquí el AADSTS....)
      if (errorRaw || errorDescRaw) {
        const desc = errorDescRaw || errorRaw || "Error de OAuth.";
        setLoginMsg(decodeMaybe(desc));

        // limpiar params OAuth (preservando checkout)
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        if (checkout) url.searchParams.set("checkout", checkout);

        const cleanUrl = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`;
        window.history.replaceState({}, "", cleanUrl);
        return;
      }

      const code = url.searchParams.get("code");
      const hasCode = !!code;

      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      const hasHashTokens = !!access_token && !!refresh_token;

      if (!hasCode && !hasHashTokens) return;

      // 1) PKCE: ?code=...
      if (hasCode && code) {
        const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);
        if (error) {
          setLoginMsg(error.message);
        }
      }

      // 2) Implicit: #access_token=...&refresh_token=...
      if (!hasCode && hasHashTokens && access_token && refresh_token) {
        const { error } = await supabaseBrowser.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          setLoginMsg(error.message);
        }
      }

      // limpiar params OAuth (preservando checkout)
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      if (checkout) url.searchParams.set("checkout", checkout);

      // reconstruir URL limpia (sin hash)
      const clean = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`;
      window.history.replaceState({}, "", clean);

      // ✅ Verificación explícita: ¿hay sesión de verdad?
      const { data: after } = await supabaseBrowser.auth.getSession();
      if (!after?.session?.user) {
        setLoginMsg(
          "No se pudo completar el login con Microsoft.\n\n" +
            "Casi siempre es un problema de configuración (Tenant/Redirect URI/Permisos).\n" +
            "Revisa Azure + Supabase y vuelve a probar."
        );
        return;
      }

      // refrescar estado
      await refreshAuthSession();
      await refreshProStatus();

      // si abrió login modal antes, lo cerramos
      setLoginOpen(false);
      setLoginMsg(null);
    } catch {
      // no romper UI
    }
  }

  // Cargar sesión + escuchar cambios
  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      // 1) absorber retorno OAuth si existe
      await handleOAuthReturnIfPresent();

      // 2) cargar sesión normal
      await refreshAuthSession();

      const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
        const u = session?.user;

        const identities = (u as any)?.identities ?? [];
        const identityData = identities?.[0]?.identity_data ?? null;

        const identityEmail =
          (identityData?.email as string | undefined) ??
          (identityData?.preferred_username as string | undefined) ??
          null;

        const identityName =
          (identityData?.name as string | undefined) ??
          (identityData?.full_name as string | undefined) ??
          (identityData?.displayName as string | undefined) ??
          null;

        const email = (u?.email ?? identityEmail ?? null) as string | null;
        const id = u?.id ?? null;
        const metaName = (u?.user_metadata?.full_name ?? u?.user_metadata?.name ?? null) as string | null;

        setAuthUserEmail(email);
        setAuthUserId(id);
        setAuthUserName(deriveName(email, metaName, identityName));

        // ⚡ cuando cambia sesión, re-chequeamos pro (así Google/Microsoft quedan iguales)
        setTimeout(() => {
          refreshProStatus();
        }, 80);
      });

      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => {
      try {
        unsub?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Refrescar sesión al volver al tab / focus (muy útil tras OAuth)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onFocus = () => refreshAuthSession();
    const onVis = () => {
      if (document.visibilityState === "visible") refreshAuthSession();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refrescar pro al cambiar user
  useEffect(() => {
    if (authLoading) return;
    refreshProStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserId, authLoading]);

  // ✅ Si acabamos de loguearnos y había un checkout pendiente, lanzarlo automáticamente
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) return;
    if (!pendingCheckoutPlan) return;

    setLoginOpen(false);

    const chosen = pendingCheckoutPlan;
    setPendingCheckoutPlan(null);

    setTimeout(() => {
      startCheckout(chosen);
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isLoggedIn, pendingCheckoutPlan]);

  // Detectar retorno de Stripe (?checkout=success|cancel)
  useEffect(() => {
    if (!mounted) return;
    try {
      const url = new URL(window.location.href);
      const checkout = url.searchParams.get("checkout");
      if (!checkout) return;

      if (checkout === "success") {
        setToastMsg(`✅ Pago completado. Activando tu cuenta ${PLUS_TEXT}…`);
        url.searchParams.delete("checkout");
        window.history.replaceState({}, "", url.toString());

        refreshProStatus().finally(() => {
          setToastMsg(`✅ Listo. Ya tienes ${PLUS_TEXT} activo.`);
          setTimeout(() => setToastMsg(null), 3500);
        });
      } else if (checkout === "cancel") {
        setToastMsg("Pago cancelado. Puedes intentarlo cuando quieras.");
        url.searchParams.delete("checkout");
        window.history.replaceState({}, "", url.toString());
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ✅ IMPORTANTE: en móvil NO hacemos autofocus al abrir login (para que no salga el teclado)
  useEffect(() => {
    if (!loginOpen) return;
    if (!isDesktopPointer()) return;
    const t = setTimeout(() => loginEmailRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [loginOpen]);

  function openLoginModal(mode: AuthCardMode = "signin") {
    setLoginMsg(null);
    setAuthMode(mode);
    setLoginOpen(true);
  }

  function openPlansModal() {
    setPayMsg(null);
    setPlan("yearly");
    setPaywallOpen(true);
  }

  function handleOpenPlansCTA() {
    openPlansModal();
  }

  async function startCheckout(chosen: "monthly" | "yearly") {
    setPayLoading(true);
    setPayMsg(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data?.session?.access_token;

      // ✅ Si no hay sesión: pedir login y reintentar luego
      if (!token) {
        setPayLoading(false);
        setPayMsg("Para continuar al pago, inicia sesión.");
        setPendingCheckoutPlan(chosen);
        openLoginModal("signin");
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: chosen }),
      });

      const raw = await res.text().catch(() => "");
      let json: any = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        setPayMsg(json?.error || raw || "Error creando checkout.");
        setPayLoading(false);
        return;
      }

      const url = json?.url as string | undefined;
      if (!url) {
        setPayMsg("Stripe devolvió una respuesta inválida (sin URL).");
        setPayLoading(false);
        return;
      }

      window.location.href = url;
    } catch (e: any) {
      setPayMsg(e?.message ?? "Error iniciando pago.");
      setPayLoading(false);
    }
  }

  async function cancelSubscriptionFromHere() {
    setPayLoading(true);
    setPayMsg(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) {
        setPayMsg("Necesitas iniciar sesión.");
        setPayLoading(false);
        return;
      }

      const ok = window.confirm("¿Seguro que quieres cancelar tu suscripción?\n\nSeguirás teniendo acceso hasta el final del periodo ya pagado.");
      if (!ok) {
        setPayLoading(false);
        return;
      }

      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPayMsg(json?.error || "No se pudo cancelar la suscripción.");
        setPayLoading(false);
        return;
      }

      setToastMsg("✅ Suscripción cancelada. Mantienes acceso hasta el final del periodo.");
      setTimeout(() => setToastMsg(null), 4500);

      await refreshProStatus();
      setPayLoading(false);
    } catch (e: any) {
      setPayMsg(e?.message ?? "Error cancelando suscripción.");
      setPayLoading(false);
    }
  }

  async function signInWithOAuth(provider: "google" | "azure") {
    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider,
        options: {
          // ✅ IMPORTANTÍSIMO: redirigir a la HOME (/) para que ESTA página absorba el callback
          redirectTo: `${SITE_URL}/`,
          // ✅ ayuda a Microsoft a elegir cuenta (si tienes varias)
          ...(provider === "azure" ? { queryParams: { prompt: "select_account" } } : {}),
        },
      });

      if (error) setLoginMsg(error.message);
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error iniciando sesión con OAuth.");
    } finally {
      setLoginSending(false);
    }
  }

  async function signInWithPassword() {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !email.includes("@")) return setLoginMsg("Escribe un email válido.");
    if (!password || password.length < 6) return setLoginMsg("La contraseña debe tener al menos 6 caracteres.");

    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginMsg(error.message);
        return;
      }
      setLoginOpen(false);
      setLoginPassword("");
      setLoginMsg(null);

      setTimeout(() => {
        refreshProStatus();
      }, 300);
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error iniciando sesión con contraseña.");
    } finally {
      setLoginSending(false);
    }
  }

  async function signUpWithPassword() {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !email.includes("@")) return setLoginMsg("Escribe un email válido.");
    if (!password || password.length < 6) return setLoginMsg("La contraseña debe tener al menos 6 caracteres.");

    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          // ✅ también lo llevamos a la home, por coherencia
          emailRedirectTo: `${SITE_URL}/`,
        },
      });
      if (error) {
        setLoginMsg(error.message);
        return;
      }

      setLoginMsg("✅ Cuenta creada. Si te pedimos confirmación, revisa tu email para activarla.");
      setAuthMode("signin");
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error creando cuenta.");
    } finally {
      setLoginSending(false);
    }
  }

  async function logout() {
    try {
      await supabaseBrowser.auth.signOut();
      setAuthUserEmail(null);
      setAuthUserId(null);
      setAuthUserName(null);
      setIsPro(false);
      setPaywallOpen(false);
      setPendingCheckoutPlan(null);
    } catch {}
  }

  // -------- Persistencia local --------
  const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as ChatThread[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const clean = parsed
        .filter((t) => t && typeof t.id === "string")
        .map((t) => ({
          id: t.id,
          title: typeof t.title === "string" ? t.title : "Consulta",
          updatedAt: typeof t.updatedAt === "number" ? t.updatedAt : Date.now(),
          messages: Array.isArray(t.messages) && t.messages.length ? t.messages : [initialAssistantMessage()],
        }));

      if (clean.length) {
        setThreads(clean);
        setActiveThreadId(clean[0].id);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch {}
  }, [threads, mounted]);

  // -------- UI --------
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [inputExpanded, setInputExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputBarH, setInputBarH] = useState<number>(140);
  const shouldStickToBottomRef = useRef(true);

  // VisualViewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;

    const setVvh = () => {
      document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
    };

    setVvh();
    vv.addEventListener("resize", setVvh);
    vv.addEventListener("scroll", setVvh);
    return () => {
      vv.removeEventListener("resize", setVvh);
      vv.removeEventListener("scroll", setVvh);
    };
  }, []);

  // Resize observer del input bar
  useEffect(() => {
    const el = inputBarRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      setInputBarH(Math.max(120, Math.ceil(h) + 8));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // asegurar thread activo
  useEffect(() => {
    if (!activeThreadId && threads[0]?.id) setActiveThreadId(threads[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads.length]);

  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) ?? threads[0];
  }, [threads, activeThreadId]);

  const messages = activeThread?.messages ?? [];

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [threads]);

  const userMsgCountInThread = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);

  const canSend = useMemo(() => {
    const basicReady = !isTyping && (!!input.trim() || !!imagePreview);
    if (isBlockedByPaywall) return false;
    return basicReady;
  }, [isTyping, input, imagePreview, isBlockedByPaywall]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  // textarea autoresize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";
    setInputExpanded(next > 52);
  }, [input]);

  function handleChatScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 140;
    const distToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickToBottomRef.current = distToBottom < threshold;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!shouldStickToBottomRef.current) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Autofocus (solo chat, solo escritorio)
  useEffect(() => {
    if (!mounted) return;
    if (renameOpen) return;
    if (menuOpen) return;
    if (isTyping) return;
    if (loginOpen) return;
    if (paywallOpen) return;
    if (!isDesktopPointer()) return;

    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);

    return () => clearTimeout(t);
  }, [mounted, renameOpen, menuOpen, isTyping, activeThreadId, loginOpen, paywallOpen]);

  function onSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  function createThreadAndActivate() {
    const t = makeNewThread();
    setThreads((prev) => [t, ...prev]);
    setActiveThreadId(t.id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      shouldStickToBottomRef.current = false;
    });

    if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;

      const thread = threads.find((x) => x.id === id);
      const isFresh = (thread?.messages ?? []).filter((m) => m.role === "user").length === 0;

      if (isFresh) {
        el.scrollTo({ top: 0, behavior: "auto" });
        shouldStickToBottomRef.current = false;
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
        shouldStickToBottomRef.current = true;
      }
    });

    if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function openRename() {
    if (!activeThread) return;
    setRenameValue(activeThread.title);
    setRenameOpen(true);
  }

  function confirmRename() {
    if (!activeThread) return;
    const name = renameValue.trim() || "Consulta";
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? { ...t, title: name, updatedAt: Date.now() } : t)));
    setRenameOpen(false);

    if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function deleteActiveThread() {
    if (!activeThread) return;

    if (threads.length === 1) {
      const fresh = makeNewThread();
      setThreads([fresh]);
      setActiveThreadId(fresh.id);
      setMenuOpen(false);
      setUiError(null);
      setInput("");
      setImagePreview(null);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
        shouldStickToBottomRef.current = false;
      });

      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
      return;
    }

    const remaining = threads.filter((t) => t.id !== activeThread.id);
    setThreads(remaining);

    const next = remaining[0];
    setActiveThreadId(next.id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      shouldStickToBottomRef.current = false;
    });

    if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
  }

  // ✅ regla: tras 2 mensajes, bloquear el siguiente y pedir login/pago
  function enforceLimitIfNeeded(): boolean {
    const nextUserCount = userMsgCountInThread + 1;
    if (nextUserCount <= FREE_MESSAGE_LIMIT) return false;

    if (!isLoggedIn) {
      setLoginMsg("Para seguir, inicia sesión (y así guardas tu historial).");
      openLoginModal("signin");
      return true;
    }

    if (!isPro) {
      setPayMsg(`Has llegado al límite del plan Gratis. Desbloquea ${PLUS_TEXT} para seguir usando Vonu.`);
      openPlansModal();
      return true;
    }

    return false;
  }

  async function sendMessage() {
    if (authLoading) return;

    if (enforceLimitIfNeeded()) return;

    if (isBlockedByPaywall) {
      openPlansModal();
      return;
    }

    if (!canSend) return;
    if (!activeThread) return;

    const userText = input.trim();
    const imageBase64 = imagePreview;

    setUiError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText || (imageBase64 ? "He adjuntado una imagen." : undefined),
      image: imageBase64 || undefined,
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      text: "",
      streaming: true,
    };

    shouldStickToBottomRef.current = true;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;

        const hasUserAlready = t.messages.some((m) => m.role === "user");
        const newTitle = hasUserAlready ? t.title : makeTitleFromText(userText || "Imagen");

        return {
          ...t,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...t.messages, userMsg, assistantMsg],
        };
      })
    );

    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    try {
      await sleep(220);

      const threadNow = threads.find((x) => x.id === activeThread.id) ?? activeThread;

      const convoForApi = [...(threadNow?.messages ?? []), userMsg]
        .filter((m) => (m.role === "user" || m.role === "assistant") && (m.text || m.image))
        .map((m) => ({
          role: m.role,
          content: m.text ?? "",
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: convoForApi,
          userText,
          imageBase64,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
      }

      const data = await res.json();
      const fullText =
        typeof data?.text === "string" && data.text.trim()
          ? data.text
          : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

      await sleep(90);

      let i = 0;
      const speedMs = fullText.length > 900 ? 7 : 11;

      const interval = setInterval(() => {
        i++;
        const partial = fullText.slice(0, i);

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== activeThread.id) return t;
            return {
              ...t,
              updatedAt: Date.now(),
              messages: t.messages.map((m) => (m.id === assistantId ? { ...m, text: partial } : m)),
            };
          })
        );

        if (i >= fullText.length) {
          clearInterval(interval);

          setThreads((prev) =>
            prev.map((t) => {
              if (t.id !== activeThread.id) return t;
              return {
                ...t,
                updatedAt: Date.now(),
                messages: t.messages.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
              };
            })
          );

          setIsTyping(false);
          if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
        }
      }, speedMs);
    } catch (err: any) {
      const msg = typeof err?.message === "string" ? err.message : "Error desconocido conectando con la IA.";

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== activeThread.id) return t;
          return {
            ...t,
            updatedAt: Date.now(),
            messages: t.messages.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    streaming: false,
                    text: "⚠️ No he podido conectar con la IA.\n\n**Detalles técnicos:**\n\n```\n" + msg + "\n```",
                  }
                : m
            ),
          };
        })
      );

      setUiError(msg);
      setIsTyping(false);
      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }

  const chatBottomPad = inputBarH;

  const TOP_OFFSET_PX = 12;
  const TOP_BUBBLE_H = 44;
  const TOP_GAP_PX = 10;
  const SIDEBAR_TOP = TOP_OFFSET_PX + TOP_BUBBLE_H + TOP_GAP_PX;

  const planLabel = !isLoggedIn ? "Sin sesión" : isPro ? PLUS_NODE : "Gratis";
  const planLabelText = !isLoggedIn ? "Sin sesión" : isPro ? PLUS_TEXT : "Gratis";
  const payTitleNode = (
    <span className="inline-flex items-center gap-1">
      Vonu {PLUS_NODE}
    </span>
  );
  const payTitleText = `Vonu ${PLUS_TEXT}`;

  // === PRICING COPY ===
  const PRICE_MONTH = "4,99€";
  const PRICE_YEAR = "39,99€";
  const PRICE_YEAR_PER_MONTH = "3,33€";
  const YEAR_SAVE_BADGE = "Ahorra 33%";

  function closePaywall() {
    if (payLoading) return;
    setPaywallOpen(false);
    setPayMsg(null);
  }

  // ESC para cerrar paywall
  useEffect(() => {
    if (!paywallOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePaywall();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paywallOpen, payLoading]);

  return (
    <div className="bg-white flex overflow-hidden" style={{ height: "calc(var(--vvh, 100dvh))" }}>
      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] px-3">
          <div className="rounded-full border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm px-4 py-2 text-xs text-zinc-800">
            {toastMsg}
          </div>
        </div>
      )}

      {/* ===== PAYWALL (FULLSCREEN TAKEOVER) ===== */}
      {paywallOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" onClick={closePaywall} aria-hidden="true" />

          {/* soft glows */}
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[320px] w-[680px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute top-[26%] -left-28 h-[240px] w-[240px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[48%] -right-24 h-[280px] w-[280px] rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

          {/* content */}
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-full w-full max-w-md px-4">
              {/* header */}
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-xl border border-zinc-200 grid place-items-center shadow-sm">
                    <img src={"/vonu-icon.png?v=2"} alt="Vonu" className="h-6 w-6" draggable={false} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-zinc-900 leading-5">{payTitleNode}</div>
                    <div className="text-[11px] text-zinc-500 leading-4">
                      Plan: <span className="font-semibold text-zinc-900">{planLabel}</span>
                      {proLoading ? <span className="ml-2 text-zinc-400">· comprobando…</span> : null}
                    </div>
                  </div>
                </div>

                <button
                  onClick={closePaywall}
                  className={[
                    "h-11 w-11 aspect-square rounded-full",
                    "bg-white/90 backdrop-blur-xl border border-zinc-200",
                    "hover:bg-white transition-colors",
                    "grid place-items-center",
                    "cursor-pointer disabled:opacity-50 shadow-sm",
                    "p-0",
                  ].join(" ")}
                  aria-label="Cerrar"
                  disabled={!!payLoading}
                  title="Cerrar"
                >
                  <span className="text-zinc-700 text-[20px] leading-none relative top-[-0.5px]">×</span>
                </button>
              </div>

              {/* body card (NO SCROLL) */}
              <div
                className="mt-4 rounded-[28px] border border-zinc-200 bg-white/85 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.14)] overflow-hidden"
                style={{ height: "calc(var(--vvh, 100dvh) - 92px)" }}
              >
                <div className="h-full flex flex-col p-4">
                  {/* plans */}
                  <div className="rounded-[22px] border border-zinc-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-semibold text-zinc-900">Elige tu plan</div>
                      <div className="opacity-0 select-none text-[10px] px-2 py-1 rounded-full">placeholder</div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {/* yearly */}
                      <button
                        onClick={() => setPlan("yearly")}
                        disabled={!!payLoading}
                        className={[
                          "w-full text-left rounded-[20px] border p-3 transition-colors cursor-pointer",
                          plan === "yearly" ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full border border-zinc-300 grid place-items-center bg-white">
                                <div className={["h-2.5 w-2.5 rounded-full", plan === "yearly" ? "bg-blue-600" : "bg-transparent"].join(" ")} />
                              </div>
                              <div className="text-[13px] font-semibold text-zinc-900">Anual</div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">Mejor valor</span>
                            </div>

                            <div className="mt-1 flex items-baseline gap-2">
                              <div className="text-[20px] font-semibold text-zinc-900 leading-6">{PRICE_YEAR}</div>
                              <div className="text-[12px] text-zinc-600">≈ {PRICE_YEAR_PER_MONTH}/mes</div>
                            </div>
                          </div>

                          <div className="shrink-0 text-[11px] text-zinc-500">
                            <span className="font-semibold text-zinc-800">{YEAR_SAVE_BADGE}</span>
                          </div>
                        </div>
                      </button>

                      {/* monthly */}
                      <button
                        onClick={() => setPlan("monthly")}
                        disabled={!!payLoading}
                        className={[
                          "w-full text-left rounded-[20px] border p-3 transition-colors cursor-pointer",
                          plan === "monthly" ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full border border-zinc-300 grid place-items-center bg-white">
                                <div className={["h-2.5 w-2.5 rounded-full", plan === "monthly" ? "bg-blue-600" : "bg-transparent"].join(" ")} />
                              </div>
                              <div className="text-[13px] font-semibold text-zinc-900">Mensual</div>
                            </div>

                            <div className="mt-1 flex items-baseline gap-2">
                              <div className="text-[20px] font-semibold text-zinc-900 leading-6">{PRICE_MONTH}</div>
                              <div className="text-[12px] text-zinc-600">cancela cuando quieras</div>
                            </div>
                          </div>

                          <div className="shrink-0 text-[11px] text-zinc-500">Flexible</div>
                        </div>
                      </button>

                      {/* free */}
                      <button
                        onClick={() => setPlan("free")}
                        disabled={!!payLoading}
                        className={[
                          "w-full text-left rounded-[20px] border p-3 transition-colors cursor-pointer",
                          plan === "free" ? "border-blue-200 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full border border-zinc-300 grid place-items-center bg-white">
                                <div className={["h-2.5 w-2.5 rounded-full", plan === "free" ? "bg-blue-600" : "bg-transparent"].join(" ")} />
                              </div>
                              <div className="text-[13px] font-semibold text-zinc-900">Seguir gratis</div>
                            </div>
                            <div className="mt-1 text-[12px] text-zinc-600">Análisis limitados.</div>
                          </div>
                          <div className="shrink-0 text-[12px] font-semibold text-zinc-900">0€</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* benefits */}
                  <div className="mt-3 rounded-[22px] border border-zinc-200 bg-white p-3">
                    <div className="text-[12px] font-semibold text-zinc-900">{plan === "free" ? "Gratis" : <>Lo que desbloqueas con {PLUS_NODE}</>}</div>
                    <div className="mt-2 space-y-2">
                      {(plan === "free" ? ["Analisis Limitados", "Decidir con calma"] : ["Análisis ilimitados", "Más consejos y contexto", "Decidir con calma"]).map((x) => (
                        <div key={x} className="flex items-start gap-2">
                          <span className="mt-[2px] text-blue-700">
                            <CheckIcon />
                          </span>
                          <div className="text-[12px] text-zinc-700 leading-5">{x}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* mensaje/error */}
                  <div className="mt-3 min-h-[42px]">
                    {payMsg ? (
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] text-zinc-700 leading-5">{payMsg}</div>
                    ) : (
                      <div className="opacity-0 select-none text-[12px] px-3 py-2">placeholder</div>
                    )}
                  </div>

                  {/* CTA bottom */}
                  <div className="mt-auto pt-3 pb-[calc(env(safe-area-inset-bottom)+6px)]">
                    <button
                      onClick={() => {
                        if (plan === "free") {
                          closePaywall();
                          return;
                        }
                        if (plan === "monthly" || plan === "yearly") startCheckout(plan);
                      }}
                      className={[
                        "w-full h-12 rounded-full text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-50",
                        plan === "free" ? "bg-zinc-900 text-white hover:bg-black" : "bg-blue-600 text-white hover:bg-blue-700",
                      ].join(" ")}
                      disabled={!!payLoading}
                    >
                      {payLoading ? "Procesando…" : plan === "free" ? "Volver al chat" : "Continuar con el pago"}
                    </button>

                    <div className="mt-2 min-h-[20px] flex items-center justify-center">
                      {plan !== "free" ? (
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                          <span className="text-blue-700">
                            <ShieldIcon className="h-4 w-4" />
                          </span>
                          <span>Pago seguro con Stripe.</span>
                        </div>
                      ) : (
                        <div className="opacity-0 select-none text-[11px]">placeholder</div>
                      )}
                    </div>

                    {isPro ? (
                      <button
                        onClick={cancelSubscriptionFromHere}
                        className="mt-2 w-full h-10 rounded-full border border-red-200 hover:bg-red-50 text-[12px] text-red-700 cursor-pointer disabled:opacity-50"
                        disabled={!!payLoading}
                      >
                        Cancelar suscripción
                      </button>
                    ) : (
                      <div className="mt-2 opacity-0 select-none h-10">placeholder</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-4" />
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGIN MODAL ===== */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-sm flex items-center justify-center px-6"
          onClick={() => (!loginSending ? setLoginOpen(false) : null)}
        >
          <div
            className="w-full max-w-[380px] rounded-[20px] bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.18)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ Si ya hay sesión, mostramos estado claro */}
            {isLoggedIn ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[18px] font-semibold text-zinc-900">Sesión iniciada</div>
                    <div className="text-[12.5px] text-zinc-500 mt-1">Estás dentro. Aquí tienes tu estado.</div>
                  </div>

                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                    aria-label="Cerrar"
                  >
                    <span className="text-[18px] leading-none relative top-[-0.5px]">×</span>
                  </button>
                </div>

                <div className="mt-5 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <div className="text-[12px] text-zinc-500">Cuenta</div>
                  <div className="mt-1 text-[14px] font-semibold text-zinc-900 truncate">{authUserName ?? "Usuario"}</div>
                  <div className="text-[12px] text-zinc-600 truncate">{authUserEmail ?? "Email no disponible"}</div>
                  <div className="mt-2 text-[12px] text-zinc-600">
                    Plan: <span className="font-semibold text-zinc-900">{proLoading ? "comprobando…" : isPro ? PLUS_NODE : "Gratis"}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      await logout();
                      setLoginMsg(null);
                      setLoginOpen(false);
                    }}
                    className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="flex-1 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Volver
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[18px] font-semibold text-zinc-900">{authMode === "signin" ? "Iniciar sesión" : "Crear cuenta"}</div>
                    <div className="text-[12.5px] text-zinc-500 mt-1">{authMode === "signin" ? "para continuar" : "crea tu cuenta para continuar"}</div>
                  </div>

                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                    aria-label="Cerrar"
                    disabled={!!loginSending}
                  >
                    <span className="text-[18px] leading-none relative top-[-0.5px]">×</span>
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="text-[12px] text-zinc-600 mb-1">Email</div>
                    <input
                      ref={loginEmailRef}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                      placeholder="tuemail@ejemplo.com"
                      autoFocus={false}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setLoginOpen(false);
                          setLoginMsg(null);
                        }
                        if (e.key === "Enter") {
                          authMode === "signin" ? signInWithPassword() : signUpWithPassword();
                        }
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-[12px] text-zinc-600 mb-1">Contraseña</div>
                    <input
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      type="password"
                      className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                      placeholder="••••••••"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setLoginOpen(false);
                          setLoginMsg(null);
                        }
                        if (e.key === "Enter") {
                          authMode === "signin" ? signInWithPassword() : signUpWithPassword();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[12px] text-zinc-600 cursor-pointer select-none">
                      <input type="checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} className="h-4 w-4" />
                      Mantener sesión
                    </label>

                    <button
                      className="text-[12px] text-blue-700 hover:text-blue-800 cursor-pointer"
                      onClick={() => setLoginMsg("Si has olvidado tu contraseña, por ahora crea una cuenta nueva con otro email (lo mejoraremos).")}
                      disabled={!!loginSending}
                    >
                      ¿OLVIDASTE LA CONTRASEÑA?
                    </button>
                  </div>

                  {loginMsg && <div className="whitespace-pre-wrap text-[12px] text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-[14px] px-3 py-2">{loginMsg}</div>}

                  <button
                    onClick={authMode === "signin" ? signInWithPassword : signUpWithPassword}
                    className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={!!loginSending}
                  >
                    {loginSending ? "Procesando…" : authMode === "signin" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-zinc-200" />
                    <div className="text-[12px] text-zinc-500">o</div>
                    <div className="h-px flex-1 bg-zinc-200" />
                  </div>

                  <button
                    onClick={() => signInWithOAuth("google")}
                    className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!!loginSending}
                  >
                    <OAuthLogo src="/auth/Google.png" alt="Google" />
                    Continuar con Google
                  </button>

                  <button
                    onClick={() => signInWithOAuth("azure")}
                    className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!!loginSending}
                  >
                    <OAuthLogo src="/auth/Microsoft.png" alt="Microsoft" />
                    Continuar con Microsoft
                  </button>

                  {/* ✅ Apple eliminado */}

                  <div className="text-[12px] text-zinc-600 text-center pt-1">
                    {authMode === "signin" ? (
                      <>
                        ¿No tienes cuenta?{" "}
                        <button
                          className="text-blue-700 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setAuthMode("signup");
                            setLoginMsg(null);
                          }}
                          disabled={!!loginSending}
                        >
                          Crear cuenta
                        </button>
                      </>
                    ) : (
                      <>
                        ¿Ya tienes cuenta?{" "}
                        <button
                          className="text-blue-700 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setAuthMode("signin");
                            setLoginMsg(null);
                          }}
                          disabled={!!loginSending}
                        >
                          Iniciar sesión
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== TOP FADE ===== */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="h-[86px] bg-gradient-to-b from-white via-white/85 to-transparent" />
      </div>

      {/* ===== TOP BUBBLES ===== */}
      <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <div className="h-11 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm flex items-center gap-0 overflow-hidden px-1">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 w-11 flex items-center justify-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              title={menuOpen ? "Cerrar menú" : "Menú"}
            >
              <img
                src={"/vonu-icon.png?v=2"}
                alt="Menú"
                className={`h-6 w-6 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`}
                draggable={false}
              />
            </button>

            <a
              href={HOME_URL}
              className="h-11 -ml-0.5 pr-2 flex items-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95"
              aria-label="Ir a la home"
              title="Ir a la home"
            >
              <img src={"/vonu-wordmark.png?v=2"} alt="Vonu" className="h-4 w-auto" draggable={false} />
            </a>
          </div>
        </div>

        {!authLoading && (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleOpenPlansCTA}
              className="h-11 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm border border-blue-700/10"
              title="Ver planes"
            >
              {isPro ? "Tu plan" : PLUS_NODE}
            </button>

            {/* ✅ CAMBIO: nunca desloguear al click. Siempre abrir modal */}
            <button
              onClick={() => openLoginModal("signin")}
              className={[
                "relative h-11 w-11",
                "bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm",
                "flex items-center justify-center text-zinc-900 hover:bg-white transition-colors cursor-pointer",
                "rounded-full",
              ].join(" ")}
              aria-label={isLoggedIn ? "Ver cuenta" : "Iniciar sesión"}
              title={isLoggedIn ? `Sesión: ${authUserEmail ?? "activa"} · Plan: ${proLoading ? "..." : planLabelText}` : "Iniciar sesión"}
            >
              {/* pequeño estado visual */}
              <span
                className={[
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                  isLoggedIn ? "bg-emerald-500" : "bg-zinc-300",
                ].join(" ")}
                aria-hidden="true"
              />
              <UserIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ===== OVERLAY + SIDEBAR ===== */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? "bg-black/20 backdrop-blur-sm pointer-events-auto" : "pointer-events-none bg-transparent"}`}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={[
            "absolute left-3 right-3 md:right-auto",
            "bg-white/92 backdrop-blur-xl",
            "rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-zinc-200/80",
            "p-4",
            "transform transition-all duration-300 ease-out",
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
          ].join(" ")}
          style={{
            top: SIDEBAR_TOP,
            bottom: 12,
            width: isDesktopPointer() ? 360 : undefined,
            maxWidth: "calc(100vw - 24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-zinc-800">Historial</div>
                <div className="text-xs text-zinc-500">Tus consultas recientes</div>
              </div>

              <button onClick={createThreadAndActivate} className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                Nueva
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={openRename} className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                Renombrar
              </button>
              <button onClick={deleteActiveThread} className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-600 cursor-pointer">
                Borrar
              </button>
            </div>

            {!authLoading && (
              <div className="mb-3 rounded-3xl border border-zinc-200 bg-white px-3 py-3">
                <div className="text-xs text-zinc-500 mb-2">Cuenta</div>

                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900 truncate">{authUserName ?? "Usuario"}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{authUserEmail ?? "Email no disponible"}</div>
                      </div>

                      <button onClick={logout} className="text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 cursor-pointer shrink-0">
                        Salir
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] text-zinc-500">
                        Plan: <span className="font-semibold text-zinc-900">{proLoading ? "comprobando…" : isPro ? PLUS_NODE : "Gratis"}</span>
                      </div>

                      <button
                        onClick={() => {
                          handleOpenPlansCTA();
                          setMenuOpen(false);
                        }}
                        className={[
                          "text-xs px-3 py-2 rounded-full transition-colors cursor-pointer",
                          isPro ? "border border-zinc-200 hover:bg-zinc-50" : "bg-blue-600 text-white hover:bg-blue-700",
                        ].join(" ")}
                      >
                        {isPro ? "Ver" : "Mejorar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openLoginModal("signin")} className="w-full text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                    Iniciar sesión
                  </button>
                )}
              </div>
            )}

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {sortedThreads.map((t) => {
                const active = t.id === activeThreadId;
                const when = mounted ? new Date(t.updatedAt).toLocaleString() : "";

                return (
                  <button
                    key={t.id}
                    onClick={() => activateThread(t.id)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors cursor-pointer ${active ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50"}`}
                  >
                    <div className="text-sm font-medium text-zinc-900">{t.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{when}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* ERROR BAR */}
        {uiError && (
          <div className="mx-auto max-w-3xl px-6 mt-3 pt-4">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Ha fallado la llamada a la IA. (Error: {uiError})</div>
          </div>
        )}

        {/* CHAT */}
        <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-3xl px-3 md:px-6" style={{ paddingTop: 92, paddingBottom: chatBottomPad }}>
            <div className="flex flex-col gap-4 py-8 md:pt-6">
              {messages.map((m) => {
                const isUser = m.role === "user";
                const mdText = isUser ? (m.text ?? "") : (m.text || "") + (m.streaming ? " ▍" : "");

                return (
                  <div key={m.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "relative max-w-[85%] px-3 py-2 shadow-sm text-[15px] leading-relaxed break-words",
                        isUser ? "bg-[#dcf8c6] text-zinc-900 rounded-l-lg rounded-br-lg rounded-tr-none mr-2" : "bg-[#e8f0fe] text-zinc-900 rounded-r-lg rounded-bl-lg rounded-tl-none ml-2",
                        "after:content-[''] after:absolute after:w-3 after:h-3 after:rotate-45 after:top-[3px]",
                        isUser ? "after:right-[-6px] after:bg-[#dcf8c6]" : "after:left-[-6px] after:bg-[#e8f0fe]",
                      ].join(" ")}
                    >
                      {m.image && (
                        <div className="mb-2">
                          <img src={m.image} alt="Adjunto" className="rounded-md max-h-60 object-cover" />
                        </div>
                      )}

                      {(m.text || m.streaming) && (
                        <div className="prose prose-sm max-w-none break-words">
                          <ReactMarkdown>{mdText}</ReactMarkdown>
                        </div>
                      )}

                      {m.streaming && <span className="inline-block w-1.5 h-1.5 ml-1 bg-zinc-400 rounded-full animate-pulse" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INPUT + DISCLAIMER */}
        <div ref={inputBarRef} className="sticky bottom-0 left-0 right-0 z-30 bg-white/92 backdrop-blur-xl">
          {/* ✅ móvil: menos margen lateral para que ocupe casi todo el ancho */}
          <div className="mx-auto max-w-3xl px-2 md:px-6 pt-3 pb-2 flex items-end gap-2 md:gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-11 w-11 md:h-12 md:w-12 inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              aria-label="Adjuntar imagen"
              disabled={!!isTyping}
              title={isTyping ? "Espera a que Vonu responda…" : "Adjuntar imagen"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectImage} className="hidden" />

            <div className="flex-1 min-w-0">
              {imagePreview && (
                <div className="mb-2 relative w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded-3xl border border-zinc-200 max-h-40" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors cursor-pointer"
                    aria-label="Quitar imagen"
                  >
                    ×
                  </button>
                </div>
              )}

              <div
                className={[
                  "w-full min-h-11 md:min-h-12 px-4 py-3 flex items-center",
                  "bg-zinc-100",
                  "border border-zinc-200 focus-within:border-zinc-300",
                  inputExpanded ? "rounded-3xl" : "rounded-full",
                ].join(" ")}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={!!isTyping}
                  placeholder={isTyping ? "Vonu está respondiendo…" : "Escribe tu mensaje…"}
                  className="w-full resize-none bg-transparent text-sm outline-none leading-5 overflow-hidden"
                  rows={1}
                />
              </div>
            </div>

            {/* ✅ ÚNICO CAMBIO: botón enviar en azul (tono web) */}
            <button
              onClick={sendMessage}
              disabled={!!(isTyping || (!input.trim() && !imagePreview))}
              className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              aria-label="Enviar"
              title="Enviar"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto max-w-3xl px-2 md:px-6 pb-3 pb-[env(safe-area-inset-bottom)]">
            <p className="text-center text-[11.5px] md:text-[12px] text-zinc-500 leading-4 md:leading-5">Orientación preventiva · No sustituye profesionales.</p>
            {!hasUserMessage && <div className="h-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
