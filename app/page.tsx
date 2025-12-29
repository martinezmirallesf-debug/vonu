// app/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

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

// Header móvil (premium, fino)
const MOBILE_HEADER_H = 56;

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- VisualViewport fix (Android) para evitar saltos / header que desaparece
  useEffect(() => {
    if (typeof window === "undefined") return;

    const vv = window.visualViewport;

    const setVvh = () => {
      const h = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${h}px`);
    };

    setVvh();
    vv?.addEventListener("resize", setVvh);
    vv?.addEventListener("scroll", setVvh);
    window.addEventListener("resize", setVvh);

    return () => {
      vv?.removeEventListener("resize", setVvh);
      vv?.removeEventListener("scroll", setVvh);
      window.removeEventListener("resize", setVvh);
    };
  }, []);

  // -------- Persistencia local (localStorage) --------
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
            Array.isArray(t.messages) && t.messages.length ? t.messages : [initialAssistantMessage()],
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

  // Renombrar / borrar
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Input shape en móvil cuando crece
  const [inputExpanded, setInputExpanded] = useState(false);

  // Keyboard / focus (para que el header no “desaparezca para siempre”)
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Altura del composer para padding del chat (evita que se “corten” burbujas/último mensaje)
  const [composerH, setComposerH] = useState(140);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

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

  const canSend = useMemo(() => {
    return !isTyping && (!!input.trim() || !!imagePreview);
  }, [isTyping, input, imagePreview]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  // Medir composer height
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setComposerH(el.getBoundingClientRect().height);
    });

    ro.observe(el);
    setComposerH(el.getBoundingClientRect().height);

    return () => ro.disconnect();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";

    setInputExpanded(next > 52);
  }, [input]);

  // NO auto-focus agresivo en móvil (evita “teclado sube/baja y pantalla baila”)
  useEffect(() => {
    if (!mounted) return;
    if (renameOpen) return;
    if (menuOpen) return;
    if (isTyping) return;

    const isMobile = window.matchMedia?.("(max-width: 767px)")?.matches ?? false;
    if (isMobile) return;

    const t = setTimeout(() => textareaRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [mounted, renameOpen, menuOpen, isTyping, activeThreadId]);

  // Keyboard open/close (Android + iOS)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      // si el viewport baja mucho, consideramos teclado abierto
      const open = vv.height < window.innerHeight - 120;
      setKeyboardOpen(open);
    };

    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

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

    // nuevo chat: arriba para ver saludo inicial
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    // al abrir un chat existente, vamos al final
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    });
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
      prev.map((t) => (t.id === activeThread.id ? { ...t, title: name, updatedAt: Date.now() } : t))
    );
    setRenameOpen(false);
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
      });
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
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
    });
  }

  // Auto-scroll inteligente (solo si estás cerca del final)
  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    const threshold = 140;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  useEffect(() => {
    if (!mounted) return;
    if (!isNearBottom()) return;
    requestAnimationFrame(() => scrollToBottom("smooth"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isTyping, mounted]);

  async function sendMessage() {
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

    // Antes de actualizar, forzamos scroll a bottom (envío)
    requestAnimationFrame(() => scrollToBottom("auto"));

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

    // En móvil: cerrar teclado tras enviar (para que vuelva header + no “baile”)
    const isMobile = window.matchMedia?.("(max-width: 767px)")?.matches ?? false;
    if (isMobile) {
      textareaRef.current?.blur();
      setKeyboardOpen(false);
    }

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

        // mientras escribe, autoscroll si estás cerca del final
        if (isNearBottom()) requestAnimationFrame(() => scrollToBottom("auto"));

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

          // en desktop sí re-enfocamos suave
          const isMobileNow = window.matchMedia?.("(max-width: 767px)")?.matches ?? false;
          if (!isMobileNow) setTimeout(() => textareaRef.current?.focus(), 60);
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
    }
  }

  function HomeLink({
    className,
    label = "Home",
  }: {
    className?: string;
    label?: string;
  }) {
    return (
      <a
        href={HOME_URL}
        className={
          className ??
          "inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 transition-colors"
        }
      >
        <span className="text-[16px]" aria-hidden="true">
          🏠
        </span>
        <span className="font-medium">{label}</span>
      </a>
    );
  }

  // WhatsApp-like tail (SVG) — evita “rombo”
  function BubbleTail({
    side,
    color,
  }: {
    side: "left" | "right";
    color: string;
  }) {
    // path simple tipo “coma” para efecto WhatsApp
    // (lo colocamos pegado al borde y abajo)
    const common = "absolute bottom-2";
    const pos = side === "right" ? "-right-[6px]" : "-left-[6px]";
    const flip = side === "right" ? "" : "scale-x-[-1]";
    return (
      <svg
        className={`${common} ${pos} ${flip}`}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
      >
        <path
          d="M3 2c7 1 11 6 12 12-4-2-7-2-12 0V2z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <div
      className="bg-white flex overflow-hidden"
      style={{
        height: "var(--vvh, 100dvh)",
        // variable para padding del chat (último mensaje nunca queda detrás del input)
        // @ts-ignore
        ["--composer-h" as any]: `${composerH}px`,
      }}
    >
      {/* ===== MOBILE HEADER ===== */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-opacity ${
          keyboardOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ height: MOBILE_HEADER_H }}
      >
        <div className="h-full px-4 flex items-center bg-white/90 backdrop-blur-xl">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            title={menuOpen ? "Cerrar menú" : "Menú"}
          >
            <img
              src={"/vonu-icon.png?v=2"}
              alt="Menú"
              className={`h-7 w-7 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`}
              draggable={false}
            />
          </button>

          <a href={HOME_URL} className="ml-2 flex items-center" aria-label="Ir a la home" title="Ir a la home">
            <img src={"/vonu-wordmark.png?v=2"} alt="Vonu" className="h-5 w-auto" draggable={false} />
          </a>

          <div className="flex-1" />
        </div>
      </div>

      {/* ===== OVERLAY + SIDEBAR ===== */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen ? "bg-black/20 backdrop-blur-sm pointer-events-auto" : "pointer-events-none bg-transparent"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:block absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ espacio para que NO se solape con logo/burger */}
          <div className="pt-14">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-zinc-800">Historial</div>
                <div className="text-xs text-zinc-500">Tus consultas recientes</div>
              </div>

              <button
                onClick={createThreadAndActivate}
                className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Nueva
              </button>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={openRename}
                className="flex-1 text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50"
              >
                Renombrar
              </button>
              <button
                onClick={deleteActiveThread}
                className="flex-1 text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 text-red-600"
              >
                Borrar
              </button>
            </div>

            <div className="mb-3">
              <HomeLink className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors" />
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-220px)]">
              {sortedThreads.map((t) => {
                const active = t.id === activeThreadId;
                const when = mounted ? new Date(t.updatedAt).toLocaleString() : "";

                return (
                  <button
                    key={t.id}
                    onClick={() => activateThread(t.id)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors ${
                      active ? "border-blue-600 bg-blue-50" : "border-zinc-200 hover:bg-zinc-50"
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

        {/* Mobile sidebar */}
        <aside
          className={`md:hidden absolute left-0 top-0 bottom-0 w-[86vw] max-w-[360px] bg-white/92 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ paddingTop: MOBILE_HEADER_H }} className="px-4 pb-4 h-full">
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-800">Historial</div>
                  <div className="text-xs text-zinc-500">Tus consultas recientes</div>
                </div>

                <button
                  onClick={createThreadAndActivate}
                  className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Nueva
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={openRename}
                  className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50"
                >
                  Renombrar
                </button>
                <button
                  onClick={deleteActiveThread}
                  className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-600"
                >
                  Borrar
                </button>
              </div>

              <div className="mb-3">
                <HomeLink className="w-full inline-flex items-center justify-center gap-2 text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 transition-colors" />
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-240px)]">
                {sortedThreads.map((t) => {
                  const active = t.id === activeThreadId;
                  const when = mounted ? new Date(t.updatedAt).toLocaleString() : "";

                  return (
                    <button
                      key={t.id}
                      onClick={() => activateThread(t.id)}
                      className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors ${
                        active ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-zinc-900">{t.title}</div>
                      <div className="text-xs text-zinc-500 mt-1">{when}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Desktop top-left (logo + burger) */}
      <div className="hidden md:flex fixed left-5 top-5 z-50 items-center gap-2 select-none">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          title={menuOpen ? "Cerrar menú" : "Menú"}
        >
          <img
            src={"/vonu-icon.png?v=2"}
            alt="Menú"
            className={`h-7 w-7 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`}
            draggable={false}
          />
        </button>

        <a href={HOME_URL} className="flex items-center" aria-label="Ir a la home">
          <img src={"/vonu-wordmark.png?v=2"} alt="Vonu" className="h-5 w-auto" draggable={false} />
        </a>
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
              <div className="text-xs text-zinc-500 mb-3">Ponle un nombre para encontrarlo rápido.</div>

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
                  className="h-10 px-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRename}
                  className="h-10 px-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-sm transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR BAR */}
        {uiError && (
          <div className="mx-auto max-w-3xl px-4 md:px-6 mt-3 pt-4">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Ha fallado la llamada a la IA. (Error: {uiError})
            </div>
          </div>
        )}

        {/* CHAT (scrollable) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <div
            className="mx-auto max-w-3xl px-4 md:px-6"
            style={{
              paddingTop: MOBILE_HEADER_H + 14, // reserva en móvil para header fijo
              paddingBottom: `calc(var(--composer-h, 140px) + 20px)`,
            }}
          >
            <div className="space-y-3 md:space-y-4 py-4">
              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  const mdText = (msg.text || "") + (msg.streaming ? " ▍" : "");
                  return (
                    <div key={msg.id} className="w-full">
                      <div className="max-w-[92%] md:max-w-[78%]">
                        <div className="relative rounded-[24px] bg-emerald-50 border border-emerald-100 px-4 py-3 shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
                          <div
                            className={[
                              "prose prose-zinc max-w-none",
                              "text-[15px] md:text-[15.5px]",
                              "leading-[1.65]",
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

                // USER
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[86%] md:max-w-[70%] space-y-2">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Adjunto"
                          className="rounded-3xl border border-zinc-200 max-h-64 object-contain"
                        />
                      )}

                      {msg.text && (
                        <div className="relative inline-block">
                          <div
                            className={[
                              "bg-blue-600 text-white",
                              "text-[14.5px] md:text-[14.75px]",
                              "leading-relaxed",
                              "px-4 py-2.5",
                              "break-words",
                              "shadow-[0_1px_10px_rgba(0,0,0,0.08)]",
                              // Forma WhatsApp-like: muy redonda en 1 línea, y “squircle” al crecer
                              msg.text.length < 22 ? "rounded-full" : "rounded-[22px]",
                              "pr-5", // aire para el tail
                            ].join(" ")}
                          >
                            {msg.text}
                          </div>

                          {/* Tail curvo (no rombo), pegado abajo a la derecha */}
                          <BubbleTail side="right" color="#2563eb" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INPUT + DISCLAIMER (sticky para PC y móvil) */}
        <div ref={composerRef} className="sticky bottom-0 z-30 bg-white">
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-3 pb-2 flex items-end gap-2 md:gap-3">
            {/* + */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-colors"
              aria-label="Adjuntar imagen"
              disabled={isTyping}
              title={isTyping ? "Espera a que Vonu responda…" : "Adjuntar imagen"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectImage} className="hidden" />

            {/* input */}
            <div className="flex-1">
              {imagePreview && (
                <div className="mb-2 relative w-fit">
                  <img src={imagePreview} alt="Preview" className="rounded-3xl border border-zinc-200 max-h-40" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors"
                    aria-label="Quitar imagen"
                  >
                    ×
                  </button>
                </div>
              )}

              <div
                className={[
                  "w-full min-h-12 px-4 py-3 flex items-center",
                  "bg-zinc-100 border border-zinc-200",
                  inputExpanded ? "rounded-3xl" : "rounded-full",
                  "focus-within:border-zinc-300",
                ].join(" ")}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setKeyboardOpen(true)}
                  onBlur={() => setKeyboardOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isTyping}
                  placeholder={isTyping ? "Vonu está respondiendo…" : "Escribe tu mensaje…"}
                  className="w-full resize-none bg-transparent text-[15px] outline-none leading-6 overflow-y-auto"
                  rows={1}
                />
              </div>
            </div>

            {/* enviar */}
            <button
              onClick={sendMessage}
              disabled={!canSend}
              className="h-12 w-12 md:w-auto rounded-full md:rounded-3xl bg-blue-600 hover:bg-blue-700 text-white md:px-6 flex items-center justify-center text-sm font-medium disabled:opacity-40 transition-colors"
              aria-label="Enviar"
              title={canSend ? "Enviar" : "Escribe un mensaje para enviar"}
            >
              <span className="md:hidden" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5l6 6M12 5l-6 6M12 5v14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="hidden md:inline">Enviar</span>
            </button>
          </div>

          {/* DISCLAIMER */}
          <div className="mx-auto max-w-3xl px-4 md:px-6 pb-3 pb-[env(safe-area-inset-bottom)]">
            <p className="text-center text-[12px] text-zinc-500 leading-5">
              Orientación y prevención. No sustituye profesionales. Si hay riesgo inmediato, contacta con emergencias.
            </p>

            {/* espacio extra cuando el teclado está abierto para que no “muerda” el contenido */}
            <div className={keyboardOpen ? "h-2" : "h-0"} />
            {!hasUserMessage && <div className="h-0" />}
          </div>
        </div>
      </div>
    </div>
  );
}
