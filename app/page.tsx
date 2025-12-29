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

// Header flotante (tipo ChatGPT)
const FLOAT_HEADER_H = 56;

// Fallback por si no podemos medir el footer
const FALLBACK_FOOTER_PAD = 190;

export default function Page() {
  const [mounted, setMounted] = useState(false);

  // Persistencia
  const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");

  // UI
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  // Rename
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Input shape
  const [inputExpanded, setInputExpanded] = useState(false);

  // “Header como ChatGPT”: visible siempre, pero si el input está enfocado (teclado) lo hacemos más sutil
  const [inputFocused, setInputFocused] = useState(false);

  // Medición del footer (input + disclaimer) para que NUNCA tape mensajes
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState<number>(FALLBACK_FOOTER_PAD);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ✅ refs para evitar closures “viejas” en listeners (teclado móvil)
  const inputFocusedRef = useRef(false);
  useEffect(() => {
    inputFocusedRef.current = inputFocused;
  }, [inputFocused]);

  // --- Mount + localStorage ---
  useEffect(() => setMounted(true), []);

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

  // Thread activo
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

  const hasUserMessage = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages]
  );

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";
    setInputExpanded(next > 52);
  }, [input]);

  const chatPadBottom = Math.max(footerH + 18, FALLBACK_FOOTER_PAD);

  // ✅ FIX: función de scroll robusta (respeta scrollPaddingBottom y evita “meterse debajo”)
  function scrollToBottom(behavior: ScrollBehavior = "auto") {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior, block: "end" });
      return;
    }
    const sc = scrollRef.current;
    if (!sc) return;
    sc.scrollTo({ top: sc.scrollHeight, behavior });
  }

  // --- VisualViewport: ayuda a que no “corte” cosas con teclado móvil ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const vv = window.visualViewport;
    const setVars = () => {
      const height = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${height}px`);

      // ✅ NUEVO: cuánto “tapa” el teclado (o barras) abajo
      // window.innerHeight (layout) - (vv.height + vv.offsetTop) ≈ zona “oculta” inferior
      const offsetTop = vv?.offsetTop ?? 0;
      const bottomCover = Math.max(0, window.innerHeight - (height + offsetTop));
      document.documentElement.style.setProperty("--vvb", `${bottomCover}px`);

      // Mantener el final visible cuando el teclado está abierto y el input enfocado
      if (inputFocusedRef.current) {
        requestAnimationFrame(() => scrollToBottom("auto"));
      }
    };

    setVars();
    vv?.addEventListener("resize", setVars);
    vv?.addEventListener("scroll", setVars);
    window.addEventListener("resize", setVars);

    return () => {
      vv?.removeEventListener("resize", setVars);
      vv?.removeEventListener("scroll", setVars);
      window.removeEventListener("resize", setVars);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Medir footer (para que el chat tenga padding exacto y nunca se esconda nada detrás)
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h && Math.abs(h - footerH) > 2) setFooterH(h);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ autoscroll estable (también mientras Vonu escribe y con teclado abierto)
  useEffect(() => {
    if (menuOpen || renameOpen) return;
    requestAnimationFrame(() => scrollToBottom("smooth"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isTyping, menuOpen, renameOpen, chatPadBottom]);

  // Focus: SOLO al abrir (no re-enfocar cada mensaje, para evitar “bailes” en móvil)
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => textareaRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [mounted]);

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
    });

    setTimeout(() => textareaRef.current?.focus(), 120);
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    setTimeout(() => scrollToBottom("auto"), 60);
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

      setTimeout(() => textareaRef.current?.focus(), 120);
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

    setTimeout(() => textareaRef.current?.focus(), 120);
  }

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

    // Oculta teclado al enviar (móvil)
    textareaRef.current?.blur();

    // Baja al final inmediatamente
    requestAnimationFrame(() => scrollToBottom("auto"));

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

      await sleep(80);

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

        // Mantener el final visible mientras escribe
        requestAnimationFrame(() => scrollToBottom("auto"));

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
          requestAnimationFrame(() => scrollToBottom("smooth"));
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
                      "⚠️ No he podido conectar con la IA.\n\nDetalles técnicos:\n\n" +
                      "```" +
                      "\n" +
                      msg +
                      "\n" +
                      "```",
                  }
                : m
            ),
          };
        })
      );

      setUiError(msg);
      setIsTyping(false);
      requestAnimationFrame(() => scrollToBottom("smooth"));
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
        <span aria-hidden="true">🏠</span>
        <span className="font-medium">{label}</span>
      </a>
    );
  }

  // Bubbles: sin pico, solo esquina exterior cuadrada
  const userBubble =
    "bg-[#2563eb] text-white rounded-[22px] rounded-tr-[6px] px-4 py-2.5 text-[14.5px] leading-relaxed break-words shadow-[0_1px_0_rgba(0,0,0,0.06)]";
  const assistantBubble =
    "bg-emerald-50 text-zinc-900 border border-emerald-100 rounded-[22px] rounded-tl-[6px] px-4 py-3 text-[15px] leading-[1.6] shadow-[0_1px_0_rgba(0,0,0,0.05)]";

  // Input shape
  const inputShell = [
    "w-full min-h-12 px-4 py-3 flex items-center",
    "bg-zinc-100",
    "border border-zinc-200",
    "focus-within:border-zinc-300",
    inputExpanded ? "rounded-3xl" : "rounded-full",
  ].join(" ");

  return (
    <div
      className="bg-white"
      style={{
        // En móvil con teclado: usamos visualViewport si existe
        height: "var(--vvh, 100dvh)" as any,
      }}
    >
      {/* ===== HEADER FLOTANTE (fijo, NO transparente) ===== */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className={[
            "pointer-events-none",
            "h-[72px]",
            "bg-gradient-to-b from-white via-white/85 to-transparent",
          ].join(" ")}
        />

        <div
          className={[
            "absolute top-3 left-3",
            "pointer-events-auto",
            "transition-all duration-300",
            inputFocused ? "opacity-70" : "opacity-100",
          ].join(" ")}
          style={{ height: FLOAT_HEADER_H }}
        >
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-11 px-3 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center gap-2"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            title={menuOpen ? "Cerrar menú" : "Menú"}
          >
            <img
              src={"/vonu-icon.png?v=2"}
              alt="Vonu"
              className={[
                "h-6 w-6",
                "transition-transform duration-300 ease-out",
                menuOpen ? "rotate-90" : "rotate-0",
              ].join(" ")}
              draggable={false}
            />
            <img
              src={"/vonu-wordmark.png?v=2"}
              alt="Vonu"
              className="h-4 w-auto"
              draggable={false}
            />
          </button>
        </div>
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
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:block absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-14">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-zinc-800">
                  Historial
                </div>
                <div className="text-xs text-zinc-500">
                  Tus consultas recientes
                </div>
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
              <HomeLink className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors" />
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-220px)]">
              {sortedThreads.map((t) => {
                const active = t.id === activeThreadId;
                const when = mounted
                  ? new Date(t.updatedAt).toLocaleString()
                  : "";

                return (
                  <button
                    key={t.id}
                    onClick={() => activateThread(t.id)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-900">
                      {t.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">{when}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <aside
          className={`md:hidden absolute left-0 top-0 bottom-0 w-[86vw] max-w-[360px] bg-white/90 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pb-4 h-full pt-16">
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-800">
                    Historial
                  </div>
                  <div className="text-xs text-zinc-500">
                    Tus consultas recientes
                  </div>
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
                <HomeLink className="w-full inline-flex items-center justify-center gap-2 text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 transition-colors" />
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-240px)]">
                {sortedThreads.map((t) => {
                  const active = t.id === activeThreadId;
                  const when = mounted
                    ? new Date(t.updatedAt).toLocaleString()
                    : "";

                  return (
                    <button
                      key={t.id}
                      onClick={() => activateThread(t.id)}
                      className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors ${
                        active
                          ? "border-blue-600 bg-blue-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-zinc-900">
                        {t.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{when}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== MAIN ===== */}
      <div className="h-full flex flex-col">
        {/* RENAME MODAL */}
        {renameOpen && (
          <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center px-6">
            <div
              className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-semibold text-zinc-900 mb-1">
                Renombrar chat
              </div>
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
          <div className="mx-auto max-w-3xl px-4 md:px-6 mt-3 pt-16">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Ha fallado la llamada a la IA. (Error: {uiError})
            </div>
          </div>
        )}

        {/* CHAT (solo esto hace scroll) */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            scrollPaddingBottom: chatPadBottom,
          }}
        >
          <div
            className="mx-auto max-w-3xl px-4 md:px-6"
            style={{
              paddingTop: 88,
              paddingBottom: chatPadBottom,
            }}
          >
            <div className="space-y-3">
              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  const mdText = (msg.text || "") + (msg.streaming ? " ▍" : "");
                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[92%] md:max-w-[80%]">
                        <div className={assistantBubble}>
                          <div
                            className={[
                              "prose prose-zinc max-w-none",
                              "prose-p:my-2",
                              "prose-headings:font-semibold prose-headings:text-zinc-900",
                              "prose-h3:text-[17px] md:prose-h3:text-[18px]",
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
                      {msg.text && <div className={userBubble}>{msg.text}</div>}
                    </div>
                  </div>
                );
              })}

              <div ref={endRef} style={{ scrollMarginBottom: chatPadBottom }} />
            </div>
          </div>
        </div>

        {/* INPUT + DISCLAIMER (fijo SIEMPRE abajo) */}
        <div
          ref={footerRef}
          className="fixed bottom-0 left-0 right-0 z-30 bg-white/92 backdrop-blur-xl"
          // ✅ NUEVO: sube el footer cuando aparece teclado (Android/iOS)
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + var(--vvb, 0px))",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-3 pb-2 flex items-end gap-2 md:gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors"
              aria-label="Adjuntar imagen"
              disabled={isTyping}
              title={isTyping ? "Espera a que Vonu responda…" : "Adjuntar imagen"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectImage}
              className="hidden"
            />

            <div className="flex-1">
              {imagePreview && (
                <div className="mb-2 relative w-fit">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-3xl border border-zinc-200 max-h-40"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors"
                    aria-label="Quitar imagen"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className={inputShell}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isTyping}
                  placeholder={
                    isTyping ? "Vonu está respondiendo…" : "Escribe tu mensaje…"
                  }
                  className="w-full resize-none bg-transparent text-sm outline-none leading-5 overflow-hidden"
                  rows={1}
                />
              </div>
            </div>

            <button
              onClick={sendMessage}
              disabled={!canSend}
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              aria-label="Enviar"
              title={canSend ? "Enviar" : "Escribe un mensaje para enviar"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 5l6 6M12 5l-6 6M12 5v14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mx-auto max-w-3xl px-4 md:px-6 pb-3 pb-[env(safe-area-inset-bottom)]">
            <p className="text-center text-[12px] text-zinc-500 leading-5">
              Orientación y prevención. No sustituye profesionales. Si hay riesgo
              inmediato, contacta con emergencias.
            </p>

            {!hasUserMessage && <div className="h-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
