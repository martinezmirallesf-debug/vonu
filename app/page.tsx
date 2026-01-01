// app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  image?: string; // data:image/...;base64,...
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

// 1 free/day (por usuario si logueado, si no por dispositivo)
const FREE_KEY_PREFIX = "vonu_free_used_";
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getFreeStorageKey(userId: string | null) {
  return `${FREE_KEY_PREFIX}${userId ?? "device"}_${todayKey()}`;
}
function markFreeUsed(userId: string | null) {
  try {
    window.localStorage.setItem(getFreeStorageKey(userId), "1");
  } catch {}
}
function isFreeUsed(userId: string | null) {
  try {
    return window.localStorage.getItem(getFreeStorageKey(userId)) === "1";
  } catch {
    return false;
  }
}

// Heurística: desktop = puntero fino (ratón/trackpad)
function isDesktopPointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(pointer: fine)")?.matches ?? true;
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 19V6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M7 10l5-5 5 5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ===== AUTH =====
  const [authLoading, setAuthLoading] = useState(true);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSending, setLoginSending] = useState(false);
  const [loginMsg, setLoginMsg] = useState<string | null>(null);

  // ===== PAYWALL / PRO =====
  const [proLoading, setProLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  // ===== Free/day =====
  const [freeUsedToday, setFreeUsedToday] = useState(false);

  function refreshFreeUsedNow(nextUserId: string | null) {
    // si es pro, no importa
    if (isPro) {
      setFreeUsedToday(false);
      return;
    }
    setFreeUsedToday(isFreeUsed(nextUserId));
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

  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      try {
        const { data } = await supabaseBrowser.auth.getSession();
        const uid = data?.session?.user?.id ?? null;
        setAuthUserEmail(data?.session?.user?.email ?? null);
        setAuthUserId(uid);
      } catch {
        setAuthUserEmail(null);
        setAuthUserId(null);
      } finally {
        setAuthLoading(false);
      }

      const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
        (_event, session) => {
          const uid = session?.user?.id ?? null;
          setAuthUserEmail(session?.user?.email ?? null);
          setAuthUserId(uid);
          // refrescar free/day en el cambio de sesión
          refreshFreeUsedNow(uid);
        }
      );

      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => {
      try {
        unsub?.();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // al montar, calculamos free/day con el user actual
    refreshFreeUsedNow(authUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (authLoading) return;
    refreshProStatus();
    refreshFreeUsedNow(authUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserId, authLoading]);

  useEffect(() => {
    // si pasa a Pro, ya no hay límite
    if (isPro) setFreeUsedToday(false);
  }, [isPro]);

  async function startCheckout(chosen: "monthly" | "yearly") {
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

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  async function openPortal() {
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

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPayMsg(json?.error || "No se pudo abrir el portal.");
        setPayLoading(false);
        return;
      }

      const url = json?.url as string | undefined;
      if (!url) {
        setPayMsg("Respuesta inválida del portal (sin URL).");
        setPayLoading(false);
        return;
      }

      window.location.href = url;
    } catch (e: any) {
      setPayMsg(e?.message ?? "Error abriendo portal.");
      setPayLoading(false);
    }
  }

  async function sendLoginEmail() {
    const email = loginEmail.trim();
    if (!email || !email.includes("@")) {
      setLoginMsg("Escribe un email válido.");
      return;
    }

    setLoginSending(true);
    setLoginMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const raw = await res.text().catch(() => "");
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const errMsg =
          data?.error ||
          data?.message ||
          raw ||
          `Error enviando email (HTTP ${res.status})`;
        setLoginMsg(errMsg);
        return;
      }

      setLoginMsg(
        "✅ Email enviado. Abre tu correo y pulsa el enlace para iniciar sesión."
      );
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error enviando email.");
    } finally {
      setLoginSending(false);
    }
  }

  async function logout() {
    try {
      await supabaseBrowser.auth.signOut();
      setAuthUserEmail(null);
      setAuthUserId(null);
      setIsPro(false);
      setPaywallOpen(false);
      refreshFreeUsedNow(null);
    } catch {
      // ignore
    }
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
          messages:
            Array.isArray(t.messages) && t.messages.length
              ? t.messages
              : [initialAssistantMessage()],
        }));

      if (clean.length) {
        setThreads(clean);
        setActiveThreadId(clean[0].id);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch {
      // ignore
    }
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

  // Altura dinámica del input bar para no tapar el chat
  const [inputBarH, setInputBarH] = useState<number>(140);

  // Autoscroll: solo si el usuario está cerca del final
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

  const userCanUseNow = useMemo(() => {
    if (authLoading || proLoading) return true; // no bloqueamos por estados intermedios
    if (isPro) return true;
    // Free: 1/día
    return !freeUsedToday;
  }, [authLoading, proLoading, isPro, freeUsedToday]);

  const canSend = useMemo(() => {
    const basicReady = !isTyping && (!!input.trim() || !!imagePreview);
    if (!basicReady) return false;
    if (!userCanUseNow) return false;
    return true;
  }, [isTyping, input, imagePreview, userCanUseNow]);

  const hasUserMessage = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages]
  );

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

  // Autofocus
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
      const isFresh =
        (thread?.messages ?? []).filter((m) => m.role === "user").length === 0;

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
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, title: name, updatedAt: Date.now() }
          : t
      )
    );
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

  async function sendMessage() {
    // Si ya gastó el free y no es Pro -> paywall
    if (!authLoading && !proLoading && !isPro && freeUsedToday) {
      setPayMsg(null);
      setPaywallOpen(true);
      return;
    }

    if (!canSend) {
      // si no puede por free y todavía no abrió paywall
      if (!userCanUseNow && !isPro) {
        setPayMsg(null);
        setPaywallOpen(true);
      }
      return;
    }

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
        const newTitle = hasUserAlready
          ? t.title
          : makeTitleFromText(userText || "Imagen");

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

      const threadNow =
        threads.find((x) => x.id === activeThread.id) ?? activeThread;

      const convoForApi = [...(threadNow?.messages ?? []), userMsg]
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") && (m.text || m.image)
        )
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
              messages: t.messages.map((m) =>
                m.id === assistantId ? { ...m, text: partial } : m
              ),
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
                messages: t.messages.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false } : m
                ),
              };
            })
          );

          setIsTyping(false);

          // ✅ Consumimos el free del día SOLO si no es pro y aún no estaba consumido
          if (!isPro && !freeUsedToday) {
            markFreeUsed(authUserId);
            refreshFreeUsedNow(authUserId);
          }

          if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
        }
      }, speedMs);
    } catch (err: any) {
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Error desconocido conectando con la IA.";

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
                    text:
                      "⚠️ No he podido conectar con la IA.\n\n**Detalles técnicos:**\n\n```\n" +
                      msg +
                      "\n```",
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
  const SIDEBAR_TOP = TOP_OFFSET_PX + TOP_BUBBLE_H + TOP_GAP_PX; // 66px

  const showProCTA = useMemo(() => {
    if (authLoading || proLoading) return false;
    if (isPro) return false;
    // si aún le queda free, podemos mostrar CTA más suave; si no, CTA fuerte
    return true;
  }, [authLoading, proLoading, isPro]);

  return (
    <div
      className="bg-white flex overflow-hidden"
      style={{ height: "calc(var(--vvh, 100dvh))" }}
    >
      {/* ===== PAYWALL MODAL (bonito) ===== */}
      {paywallOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-sm flex items-center justify-center px-5"
          onClick={() => {
            if (!payLoading) setPaywallOpen(false);
          }}
        >
          <div
            className="w-full max-w-xl rounded-[32px] bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.22)] p-4 md:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Desbloquear Vonu Pro
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Acceso completo al análisis, historial y mejoras continuas.
                </div>
              </div>

              <button
                onClick={() => {
                  if (!payLoading) setPaywallOpen(false);
                }}
                className="h-9 w-9 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer"
                aria-label="Cerrar"
                disabled={payLoading}
              >
                ×
              </button>
            </div>

            {/* selector plan */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPlan("monthly")}
                className={[
                  "rounded-3xl border p-4 text-left transition-all cursor-pointer",
                  plan === "monthly"
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                    : "border-zinc-200 bg-white hover:bg-zinc-50",
                ].join(" ")}
                disabled={payLoading}
              >
                <div className="text-xs font-semibold">Monthly</div>
                <div className="mt-1 text-2xl font-semibold leading-none">
                  4,99€
                  <span className={plan === "monthly" ? "text-white/80" : "text-zinc-500"}>
                    {" "}
                    /mes
                  </span>
                </div>
                <div
                  className={
                    plan === "monthly"
                      ? "text-white/80 text-xs mt-1"
                      : "text-zinc-500 text-xs mt-1"
                  }
                >
                  Flexible, cancela cuando quieras
                </div>
              </button>

              <button
                onClick={() => setPlan("yearly")}
                className={[
                  "rounded-3xl border p-4 text-left transition-all cursor-pointer relative overflow-hidden",
                  plan === "yearly"
                    ? "border-emerald-700 bg-emerald-50 shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
                    : "border-zinc-200 bg-white hover:bg-zinc-50",
                ].join(" ")}
                disabled={payLoading}
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-600 text-white">
                    Mejor valor
                  </span>
                </div>

                <div className="text-xs font-semibold text-zinc-900">Yearly</div>
                <div className="mt-1 text-2xl font-semibold leading-none text-zinc-900">
                  39,99€
                  <span className="text-zinc-500"> /año</span>
                </div>
                <div className="text-zinc-500 text-xs mt-1">Ahorra vs mensual</div>
              </button>
            </div>

            {/* incluye */}
            <div className="mt-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-zinc-800">Incluye</div>
                {!isPro && (
                  <div className="text-[11px] text-zinc-500">
                    {freeUsedToday
                      ? "Free usado hoy"
                      : "Te queda 1 análisis free hoy"}
                  </div>
                )}
              </div>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] text-zinc-700">
                {[
                  "Análisis completo de mensajes, webs e imágenes",
                  "Prioridad y mejoras continuas",
                  "Historial organizado",
                  "Acceso desde cualquier dispositivo",
                ].map((x) => (
                  <div key={x} className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-700">
                      <CheckIcon />
                    </span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>

            {payMsg && (
              <div className="mt-3 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-2xl px-3 py-2">
                {payMsg}
              </div>
            )}

            <div className="mt-4 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
              <button
                onClick={openPortal}
                className="h-11 px-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50"
                disabled={payLoading}
              >
                Gestionar suscripción
              </button>

              <button
                onClick={() => startCheckout(plan)}
                className={[
                  "h-11 px-5 rounded-2xl text-sm cursor-pointer transition-colors",
                  plan === "monthly"
                    ? "bg-black text-white hover:bg-zinc-900"
                    : "bg-emerald-600 text-white hover:bg-emerald-700",
                  "disabled:opacity-50",
                ].join(" ")}
                disabled={payLoading}
              >
                {payLoading ? "Redirigiendo…" : "Continuar al pago"}
              </button>
            </div>

            <div className="mt-3 text-[11px] text-zinc-500 leading-4">
              Pago seguro con Stripe. Puedes cancelar cuando quieras desde el portal.
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGIN MODAL ===== */}
      {loginOpen && (
        <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm flex items-center justify-center px-6">
          <div
            className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold text-zinc-900 mb-1">
              Iniciar sesión
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Te enviamos un enlace por email para entrar (sin contraseña).
            </div>

            <input
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full h-11 rounded-2xl border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
              placeholder="tuemail@ejemplo.com"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") sendLoginEmail();
                if (e.key === "Escape") {
                  setLoginOpen(false);
                  setLoginMsg(null);
                }
              }}
            />

            {loginMsg && (
              <div className="mt-3 text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2">
                {loginMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setLoginOpen(false);
                  setLoginMsg(null);
                }}
                className="h-10 px-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm cursor-pointer"
                disabled={loginSending}
              >
                Cerrar
              </button>
              <button
                onClick={sendLoginEmail}
                className="h-10 px-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-sm transition-colors disabled:opacity-50 cursor-pointer"
                disabled={loginSending}
              >
                {loginSending ? "Enviando…" : "Enviar enlace"}
              </button>
            </div>

            <div className="mt-3 text-[11px] text-zinc-500 leading-4">
              Si no te llega, mira Spam/Promociones.
            </div>
          </div>
        </div>
      )}

      {/* ===== TOP FADE ===== */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="h-[86px] bg-gradient-to-b from-white via-white/85 to-transparent" />
      </div>

      {/* ===== TOP BUBBLES (sin header) ===== */}
      <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: UNA burbuja con icono+logo dentro (NO TOCAR LOGO) */}
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
                className={`h-6 w-6 transition-transform duration-300 ease-out ${
                  menuOpen ? "rotate-90" : "rotate-0"
                }`}
                draggable={false}
              />
            </button>

            <a
              href={HOME_URL}
              className="h-11 -ml-0.5 pr-2 flex items-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95"
              aria-label="Ir a la home"
              title="Ir a la home"
            >
              <img
                src={"/vonu-wordmark.png?v=2"}
                alt="Vonu"
                className="h-4 w-auto"
                draggable={false}
              />
            </a>
          </div>
        </div>

        {/* Right */}
        {!authLoading && (
          <div className="pointer-events-auto flex items-center gap-2">
            {/* CTA Pro */}
            {showProCTA && (
              <button
                onClick={() => {
                  setPayMsg(null);
                  setPaywallOpen(true);
                }}
                className={[
                  "h-11 px-4 rounded-full transition-colors cursor-pointer shadow-sm border",
                  freeUsedToday
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700/10"
                    : "bg-white/95 text-zinc-900 hover:bg-white border-zinc-200",
                ].join(" ")}
                title={freeUsedToday ? "Desbloquear Pro" : "Ver planes Pro"}
              >
                {freeUsedToday ? "Desbloquear Pro" : "Pro"}
              </button>
            )}

            <button
              onClick={() => {
                if (authUserEmail) logout();
                else {
                  setLoginEmail("");
                  setLoginMsg(null);
                  setLoginOpen(true);
                }
              }}
              className={[
                "h-11 w-11",
                "bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm",
                "flex items-center justify-center text-zinc-900 hover:bg-white transition-colors cursor-pointer",
                "rounded-full",
              ].join(" ")}
              aria-label={authUserEmail ? "Cerrar sesión" : "Iniciar sesión"}
              title={authUserEmail ? authUserEmail : "Iniciar sesión"}
            >
              <UserIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ===== OVERLAY + SIDEBAR ===== */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? "bg-black/20 backdrop-blur-sm pointer-events-auto"
            : "pointer-events-none bg-transparent"
        }`}
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

              <button
                onClick={createThreadAndActivate}
                className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Nueva
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={openRename}
                className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
              >
                Renombrar
              </button>
              <button
                onClick={deleteActiveThread}
                className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-600 cursor-pointer"
              >
                Borrar
              </button>
            </div>

            {!authLoading && (
              <div className="mb-3 rounded-3xl border border-zinc-200 bg-white px-3 py-3">
                <div className="text-xs text-zinc-500 mb-2">Cuenta</div>
                {authUserEmail ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-zinc-800 truncate">{authUserEmail}</div>
                      <button
                        onClick={logout}
                        className="text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                      >
                        Salir
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] text-zinc-500">
                        Estado: {proLoading ? "comprobando…" : isPro ? "Pro" : "Free"}
                        {!isPro && (
                          <>
                            {" "}
                            ·{" "}
                            {freeUsedToday ? "Free usado hoy" : "1 free hoy disponible"}
                          </>
                        )}
                      </div>

                      {!proLoading && !isPro && (
                        <button
                          onClick={() => {
                            setPayMsg(null);
                            setPaywallOpen(true);
                            setMenuOpen(false);
                          }}
                          className="text-xs px-3 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Mejorar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setLoginEmail("");
                      setLoginMsg(null);
                      setLoginOpen(true);
                    }}
                    className="w-full text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
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
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors cursor-pointer ${
                      active
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
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
        {/* RENAME MODAL */}
        {renameOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-6">
            <div
              className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-semibold text-zinc-900 mb-1">Renombrar chat</div>
              <div className="text-xs text-zinc-500 mb-3">
                Ponle un nombre para encontrarlo rápido.
              </div>

              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full h-11 rounded-2xl border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                placeholder="Ej: SMS del banco"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") setRenameOpen(false);
                }}
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setRenameOpen(false)}
                  className="h-10 px-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRename}
                  className="h-10 px-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-sm transition-colors cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR BAR */}
        {uiError && (
          <div className="mx-auto max-w-3xl px-6 mt-3 pt-4">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Ha fallado la llamada a la IA. (Error: {uiError})
            </div>
          </div>
        )}

        {/* CHAT */}
        <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto min-h-0">
          <div
            className="mx-auto max-w-3xl px-3 md:px-6"
            style={{
              paddingTop: 92,
              paddingBottom: chatBottomPad,
            }}
          >
            <div className="space-y-3 py-8 md:pt-6">
              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  const mdText = (msg.text || "") + (msg.streaming ? " ▍" : "");
                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[92%] md:max-w-[80%]">
                        <div className="bg-emerald-50 text-zinc-900 border border-emerald-100 rounded-[22px] rounded-tl-[6px] px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                          <div
                            className={[
                              "prose prose-zinc max-w-none",
                              "text-[15px] md:text-[15.5px]",
                              "leading-[1.6]",
                              "prose-headings:font-semibold prose-headings:text-zinc-900",
                              "prose-h3:text-[17px] md:prose-h3:text-[18px]",
                              "prose-p:my-3",
                            ].join(" ")}
                          >
                            <ReactMarkdown>{mdText}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[92%] md:max-w-[80%] space-y-2">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Adjunto"
                          className="rounded-3xl border border-zinc-200 max-h-64 object-contain"
                        />
                      )}
                      {msg.text && (
                        <div className="bg-blue-600 text-white text-[14.5px] leading-relaxed rounded-[22px] rounded-tr-[6px] px-4 py-2.5 break-words shadow-[0_1px_0_rgba(0,0,0,0.06)]">
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INPUT + DISCLAIMER */}
        <div ref={inputBarRef} className="sticky bottom-0 left-0 right-0 z-30 bg-white/92 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl px-3 md:px-6 pt-3 pb-2 flex items-end gap-2 md:gap-3">
            {/* + */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-11 w-11 md:h-12 md:w-12 inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              aria-label="Adjuntar imagen"
              disabled={isTyping || (!userCanUseNow && !isPro)}
              title={
                isTyping
                  ? "Espera a que Vonu responda…"
                  : (!userCanUseNow && !isPro)
                  ? "Límite free alcanzado (1/día)"
                  : "Adjuntar imagen"
              }
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectImage}
              className="hidden"
            />

            {/* input */}
            <div className="flex-1 min-w-0">
              {imagePreview && (
                <div className="mb-2 relative w-fit">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-3xl border border-zinc-200 max-h-40"
                  />
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
                  disabled={isTyping || (!userCanUseNow && !isPro)}
                  placeholder={
                    isTyping
                      ? "Vonu está respondiendo…"
                      : (!userCanUseNow && !isPro)
                      ? "Has usado el análisis gratis de hoy. Hazte Pro para seguir…"
                      : "Escribe tu mensaje…"
                  }
                  className="w-full resize-none bg-transparent text-sm outline-none leading-5 overflow-hidden"
                  rows={1}
                />
              </div>
            </div>

            {/* enviar */}
            <button
              onClick={sendMessage}
              disabled={isTyping || (!input.trim() && !imagePreview)}
              className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-black hover:bg-zinc-900 text-white flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              aria-label="Enviar"
              title="Enviar"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto max-w-3xl px-3 md:px-6 pb-3 pb-[env(safe-area-inset-bottom)]">
            <p className="text-center text-[11.5px] md:text-[12px] text-zinc-500 leading-4 md:leading-5">
              Orientación preventiva. No sustituye profesionales.
            </p>

            {!hasUserMessage && <div className="h-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
