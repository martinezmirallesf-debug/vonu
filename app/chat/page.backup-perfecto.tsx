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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Burger */}
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={`origin-center transition-all duration-200 ease-out ${
          open ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
        }`}
      />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={`origin-center transition-all duration-200 ease-out ${
          open ? "opacity-0" : "opacity-90"
        }`}
      />
      <path
        d="M4 17H20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={`origin-center transition-all duration-200 ease-out ${
          open ? "opacity-0 translate-y-1" : "opacity-80 translate-y-0"
        }`}
      />

      {/* X */}
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={`origin-center transition-all duration-200 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={`origin-center transition-all duration-200 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function initialAssistantMessage(): Message {
  return {
    id: "init",
    role: "assistant",
    text:
      "Hola 👋 Soy **Vonu**.\n\nPuedes escribirme o adjuntar una captura y te explicaré **qué está pasando**, **por qué ocurre** y **qué decisión tomar**.",
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

export default function ChatPage() {
  /**
   * ✅ CLAVE PARA QUITAR HYDRATION:
   * 1) En SSR siempre renderizamos lo mismo (un placeholder)
   * 2) Solo montamos el chat real cuando ya estamos en el navegador
   */
  const [mounted, setMounted] = useState(false);

  // Estado base (determinista) para SSR
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "local",
      title: "Nueva consulta",
      updatedAt: 0,
      messages: [initialAssistantMessage()],
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState<string>("local");

  // UI
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  // Renombrar
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Montaje + cargar localStorage
  useEffect(() => {
    setMounted(true);

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
          updatedAt: typeof t.updatedAt === "number" ? t.updatedAt : 0,
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
      // si falla, no hacemos nada
    }
  }, []);

  // Guardar localStorage
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) ?? threads[0];
  }, [threads, activeThreadId]);

  const messages = activeThread?.messages ?? [];

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [threads]);

  const canSend = useMemo(() => {
    return !isTyping && (!!input.trim() || !!imagePreview);
  }, [isTyping, input, imagePreview]);

  // Scroll suave al final
  useEffect(() => {
    if (!mounted) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, mounted]);

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
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);
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
        t.id === activeThread.id ? { ...t, title: name, updatedAt: Date.now() } : t
      )
    );
    setRenameOpen(false);
  }

  function deleteActiveThread() {
    if (!activeThread) return;

    // si solo queda 1, lo reseteamos
    if (threads.length === 1) {
      const fresh = makeNewThread();
      setThreads([fresh]);
      setActiveThreadId(fresh.id);
      setMenuOpen(false);
      setUiError(null);
      setInput("");
      setImagePreview(null);
      return;
    }

    const remaining = threads.filter((t) => t.id !== activeThread.id);
    setThreads(remaining);

    // activar otro
    const next = remaining[0];
    setActiveThreadId(next.id);
    setMenuOpen(false);
    setUiError(null);
    setInput("");
    setImagePreview(null);
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

    // pintar en el thread activo
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
      await sleep(520);

      // Construimos conversación para API con un snapshot seguro
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

      await sleep(260);

      // typewriter visual
      let i = 0;
      const speedMs = fullText.length > 900 ? 7 : 12;

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
                messages: t.messages.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false } : m
                ),
              };
            })
          );

          setIsTyping(false);
        }
      }, speedMs);
    } catch (err: any) {
      const msg =
        typeof err?.message === "string" ? err.message : "Error desconocido conectando con la IA.";

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
                      "\n```\n\nMira también la terminal: debería aparecer `POST /api/chat` con el código (200/500).",
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

  /**
   * ✅ Esto mata el Hydration error:
   * En SSR y en el primer render del cliente mostramos exactamente lo mismo.
   */
  if (!mounted) {
    return <div className="h-screen bg-white" />;
  }

  return (
    <div className="h-screen bg-white flex">
      {/* OVERLAY + SIDEBAR */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen
            ? "bg-black/20 backdrop-blur-sm pointer-events-auto"
            : "pointer-events-none bg-transparent backdrop-blur-0"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={`absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-[110%]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* header sidebar */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-zinc-800">Historial</div>
              <div className="text-xs text-zinc-500">Tus consultas recientes</div>
            </div>

            <button
              onClick={createThreadAndActivate}
              className="text-xs px-3 py-2 rounded-full bg-zinc-900 text-white hover:opacity-90 transition-opacity"
            >
              Nueva
            </button>
          </div>

          {/* acciones del chat actual */}
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

          {/* lista */}
          <div className="space-y-2 overflow-y-auto pr-1 h-[calc(100%-110px)]">
            {sortedThreads.map((t) => {
              const active = t.id === activeThreadId;
              return (
                <button
                  key={t.id}
                  onClick={() => activateThread(t.id)}
                  className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors ${
                    active ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-900">{t.title}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER FIXED con BLUR */}
        <header className="fixed top-0 left-0 right-0 z-30">
          <div className="bg-white/60 backdrop-blur-lg">
            <div className="px-6 pt-4 pb-3 flex items-center">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="mr-4 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                title={menuOpen ? "Cerrar menú" : "Menú"}
              >
                <MenuIcon open={menuOpen} />
              </button>

              <div className="select-none">
                <h1 className="text-base font-semibold text-zinc-900">Vonu</h1>
                <p className="text-sm text-zinc-500">Tu asistente para tomar decisiones seguras</p>
              </div>
            </div>
          </div>
        </header>

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
                  className="h-10 px-4 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRename}
                  className="h-10 px-4 rounded-2xl bg-zinc-900 text-white hover:opacity-90 text-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR BAR */}
        {uiError && (
          <div className="mx-auto max-w-3xl px-6 mt-3 pt-[76px]">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 bubble-in">
              Ha fallado la llamada a la IA. Mira la terminal para ver el `POST /api/chat`. (Error:{" "}
              {uiError})
            </div>
          </div>
        )}

        {/* CHAT */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 pt-[92px] pb-10 space-y-10">
            {messages.map((msg) => {
              if (msg.role === "assistant") {
                return (
                  <div key={msg.id} className="bubble-in-slow">
                    <div className="prose prose-zinc max-w-none text-sm">
                      <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                      {msg.streaming && <span className="inline-block ml-1 animate-pulse">▍</span>}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-end bubble-in">
                  <div className="max-w-xl space-y-2">
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Adjunto"
                        className="rounded-3xl border border-zinc-200 max-h-64 object-contain"
                      />
                    )}
                    {msg.text && (
                      <div className="bg-zinc-900 text-white text-sm leading-relaxed rounded-3xl px-5 py-3">
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INPUT */}
        <div className="flex-shrink-0 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-4 flex items-end gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-12 w-12 inline-flex items-center justify-center rounded-full border border-zinc-300 text-zinc-800 hover:bg-zinc-100 transition-colors"
              aria-label="Adjuntar imagen"
              disabled={isTyping}
              title={isTyping ? "Espera a que Vonu responda…" : "Adjuntar imagen"}
            >
              <PlusIcon />
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
                <div className="mb-2 relative w-fit bubble-in">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-3xl border border-zinc-200 max-h-40"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-zinc-900 text-white text-xs"
                    aria-label="Quitar imagen"
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isTyping}
                placeholder={isTyping ? "Vonu está respondiendo…" : "Escribe tu mensaje…"}
                className="w-full h-12 rounded-3xl border border-zinc-300 px-5 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-100"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={!canSend}
              className="h-12 rounded-3xl bg-zinc-900 text-white px-6 text-sm font-medium disabled:opacity-40 transition-opacity"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
