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

// Header móvil fino
const MOBILE_HEADER_H = 52;

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ----- Mobile detection -----
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
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

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Input shape
  const [inputExpanded, setInputExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // si el usuario está cerca del final, autoscroll; si está leyendo arriba, no lo rompas
  const nearBottomRef = useRef(true);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 140;
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      nearBottomRef.current = dist < threshold;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll as any);
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

  const canSend = useMemo(() => {
    return !isTyping && (!!input.trim() || !!imagePreview);
  }, [isTyping, input, imagePreview]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";
    setInputExpanded(next > 52);
  }, [input]);

  // Autoscroll anclado al final (más fiable que scrollHeight)
  useEffect(() => {
    const shouldStick = nearBottomRef.current || isTyping;
    if (!shouldStick) return;

    // rAF para que el DOM pinte antes
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages, isTyping]);

  // Focus: SOLO al entrar / cambiar conversación. En móvil NO re-focusear al terminar Vonu (evita “baile” teclado)
  useEffect(() => {
    if (!mounted) return;
    if (renameOpen || menuOpen) return;

    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 80);

    return () => clearTimeout(t);
  }, [mounted, renameOpen, menuOpen, activeThreadId]);

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

    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);

    setTimeout(() => textareaRef.current?.focus(), 80);
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
    setTimeout(() => textareaRef.current?.focus(), 80);
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

      setTimeout(() => textareaRef.current?.focus(), 80);
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

    setTimeout(() => textareaRef.current?.focus(), 80);
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

          // IMPORTANTE: no forzar focus en móvil (evita que el teclado suba/baje y “baile” la pantalla)
          if (!isMobile) {
            setTimeout(() => textareaRef.current?.focus(), 80);
          }
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
                    text:
                      "⚠️ No he podido conectar con la IA.\n\n**Detalles técnicos:**\n\n```\n" + msg + "\n```",
                  }
                : m
            ),
          };
        })
      );

      setUiError(msg);
      setIsTyping(false);
      if (!isMobile) setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }

  function HomeLink({ className, label = "Volver a la home" }: { className?: string; label?: string }) {
    return (
      <a
        href={HOME_URL}
        className={
          className ?? "inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-blue-700 transition-colors"
        }
      >
        <span className="text-[16px]" aria-hidden="true">
          ⟵
        </span>
        <span className="font-medium">{label}</span>
      </a>
    );
  }

  // padding para que el chat nunca quede tapado por el input fijo
  const CHAT_BOTTOM_PAD = 180;

  // Burbuja estilo WhatsApp: tail con cuadradito rotado
  function BubbleTail({
    side,
    colorClass,
    borderClass,
  }: {
    side: "left" | "right";
    colorClass: string;
    borderClass?: string;
  }) {
    return (
      <span
        aria-hidden="true"
        className={[
          "absolute bottom-[6px] h-3 w-3 rotate-45",
          colorClass,
          borderClass ? `border ${borderClass}` : "",
          side === "right" ? "right-[-5px]" : "left-[-5px]",
        ].join(" ")}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white flex overflow-hidden">
      {/* ===== MOBILE HEADER (fino, fijo) ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50" style={{ height: MOBILE_HEADER_H }}>
        <div className="h-full px-4 flex items-center bg-white/90 backdrop-blur-xl">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            title={menuOpen ? "Cerrar menú" : "Menú"}
          >
            <img
              src={"/vonu-icon.png?v=3"}
              alt="Menú"
              className={`h-7 w-7 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`}
              draggable={false}
            />
          </button>

          <a href={HOME_URL} className="ml-2 flex items-center" aria-label="Ir a la home" title="Ir a la home">
            <img src={"/vonu-wordmark.png?v=3"} alt="Vonu" className="h-5 w-auto" draggable={false} />
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
        {/* Desktop sidebar (ventana redondeada) */}
        <aside
          className={`hidden md:block absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-2">
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
              <HomeLink className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors" />
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-200px)]">
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
                <HomeLink className="w-full inline-flex items-center justify-center gap-2 text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 transition-colors" />
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

      {/* Desktop floating top-left (como antes, sin barra) */}
      <div className="hidden md:flex fixed left-5 top-5 z-50 items-center gap-2 select-none">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          title={menuOpen ? "Cerrar menú" : "Menú"}
        >
          <img
            src={"/vonu-icon.png?v=3"}
            alt="Menú"
            className={`h-7 w-7 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`}
            draggable={false}
          />
        </button>

        <a href={HOME_URL} className="flex items-center" aria-label="Ir a la home" title="Ir a la home">
          <img src={"/vonu-wordmark.png?v=3"} alt="Vonu" className="h-5 w-auto" draggable={false} />
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
          <div className="mx-auto max-w-3xl px-6 mt-3 pt-4">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Ha fallado la llamada a la IA. (Error: {uiError})
            </div>
          </div>
        )}

        {/* CHAT */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <div
            className="mx-auto max-w-3xl px-4 md:px-6 pb-10"
            style={{
              paddingTop: isMobile ? MOBILE_HEADER_H + 14 : 22,
              paddingBottom: CHAT_BOTTOM_PAD,
            }}
          >
            <div className="space-y-3">
              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  const mdText = (msg.text || "") + (msg.streaming ? " ▍" : "");

                  return (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[92%] md:max-w-[78%]">
                        {/* Burbuja Vonu (verde suave). Si la quieres SIN burbuja, borra este wrapper y deja solo el ReactMarkdown */}
                        <div className="relative bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                          <BubbleTail side="left" colorClass="bg-emerald-50" borderClass="border-emerald-100" />

                          <div
                            className={[
                              "prose prose-zinc max-w-none",
                              "text-[15px] md:text-[15.5px]",
                              "leading-[1.6]",
                              "prose-headings:font-semibold prose-headings:text-zinc-900",
                              "prose-h3:text-[17px] md:prose-h3:text-[18px]",
                              "prose-p:my-3",
                              "prose-ul:my-3 prose-ol:my-3",
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
                    <div className="max-w-[92%] md:max-w-[78%] space-y-2">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Adjunto"
                          className="rounded-2xl border border-zinc-200 max-h-64 object-contain"
                        />
                      )}

                      {msg.text && (
                        <div className="relative inline-block bg-blue-600 text-white text-[14.5px] leading-relaxed rounded-2xl px-4 py-2.5 break-words shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                          <BubbleTail side="right" colorClass="bg-blue-600" />
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* ancla final para autoscroll */}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>

        {/* INPUT + DISCLAIMER (fijo en TODAS las vistas para que no “salte” en PC) */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white">
          <div className="mx-auto max-w-3xl px-3 md:px-6 pt-3 pb-2 flex items-end gap-2 md:gap-3">
            {/* + */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 transition-colors"
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
                  <img src={imagePreview} alt="Preview" className="rounded-2xl border border-zinc-200 max-h-40" />
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
                  inputExpanded ? "rounded-2xl" : "rounded-full",
                  "focus-within:border-zinc-300",
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
                  disabled={isTyping}
                  placeholder={isTyping ? "Vonu está respondiendo…" : "Escribe tu mensaje…"}
                  className="w-full resize-none bg-transparent text-sm outline-none leading-5 overflow-hidden"
                  rows={1}
                />
              </div>
            </div>

            {/* enviar */}
            <button
              onClick={sendMessage}
              disabled={!canSend}
              className="h-12 w-12 md:w-auto rounded-full md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white md:px-6 flex items-center justify-center text-sm font-medium disabled:opacity-40 transition-colors"
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

            {/* en móvil solo muéstralo antes de la primera consulta (queda menos cargado) */}
            {isMobile && hasUserMessage && <div className="h-0.5" />}
          </div>
        </div>
      </div>
    </div>
  );
}
