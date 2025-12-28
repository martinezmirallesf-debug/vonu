"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = { id: string; role: "user" | "assistant"; text?: string; image?: string; streaming?: boolean; };
type ChatThread = { id: string; title: string; updatedAt: number; messages: Message[]; };

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function initialAssistantMessage(): Message {
  return {
    id: "init",
    role: "assistant",
    text: "Hola 👋 Soy **Vonu**.\n\nCuéntame tu situación (o adjunta una captura) y te digo **qué pinta tiene**, el **riesgo real** y **qué haría ahora** para decidir con calma.\n\n_Importante: no compartas contraseñas, códigos ni datos bancarios._",
  };
}

function makeNewThread(): ChatThread {
  const id = crypto.randomUUID();
  return { id, title: "Nueva consulta", updatedAt: Date.now(), messages: [initialAssistantMessage()], };
}

function makeTitleFromText(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "Nueva consulta";
  return t.length > 34 ? t.slice(0, 34) + "…" : t;
}

const STORAGE_KEY = "vonu_threads_v1";
const USAGE_KEY = "vonu_daily_usage";

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
        }
      }
      const usage = window.localStorage.getItem(USAGE_KEY);
      if (usage) setUsageCount(parseInt(usage));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = useMemo(() => threads.find((t) => t.id === activeThreadId) ?? threads[0], [threads, activeThreadId]);
  const messages = activeThread?.messages ?? [];
  const sortedThreads = useMemo(() => [...threads].sort((a, b) => b.updatedAt - a.updatedAt), [threads]);
  const canSend = useMemo(() => !isTyping && (!!input.trim() || !!imagePreview), [isTyping, input, imagePreview]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

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
    setInput("");
    setImagePreview(null);
  }

  function activateThread(id: string) {
    setActiveThreadId(id);
    setMenuOpen(false);
    setInput("");
    setImagePreview(null);
  }

  function openRename() { if (!activeThread) return; setRenameValue(activeThread.title); setRenameOpen(true); }
  function confirmRename() {
    if (!activeThread) return;
    const name = renameValue.trim() || "Consulta";
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? { ...t, title: name, updatedAt: Date.now() } : t)));
    setRenameOpen(false);
  }

  function deleteActiveThread() {
    if (!activeThread) return;
    const remaining = threads.filter((t) => t.id !== activeThread.id);
    const fresh = remaining.length ? remaining : [makeNewThread()];
    setThreads(fresh);
    setActiveThreadId(fresh[0].id);
    setMenuOpen(false);
  }

  async function sendMessage() {
    if (!canSend || !activeThread) return;
    
    // VERIFICACIÓN PREMIUM
    if (usageCount >= 1) {
      setShowPaywall(true);
      return;
    }

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
    const assistantMsg: Message = { id: assistantId, role: "assistant", text: "", streaming: true };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThread.id) return t;
        const hasUserAlready = t.messages.some((m) => m.role === "user");
        return {
          ...t,
          title: hasUserAlready ? t.title : makeTitleFromText(userText || "Imagen"),
          updatedAt: Date.now(),
          messages: [...t.messages, userMsg, assistantMsg],
        };
      })
    );

    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    try {
      const convoForApi = [...(activeThread?.messages ?? []), userMsg]
        .filter((m) => (m.role === "user" || m.role === "assistant") && (m.text || m.image))
        .map((m) => ({ role: m.role, content: m.text ?? "" }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: convoForApi, userText, imageBase64 }),
      });

      const data = await res.json();
      const fullText = data?.text || "Error en la respuesta.";
      
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const partial = fullText.slice(0, i);
        setThreads((prev) => prev.map((t) => {
          if (t.id !== activeThread.id) return t;
          return { ...t, messages: t.messages.map((m) => (m.id === assistantId ? { ...m, text: partial } : m)) };
        }));

        if (i >= fullText.length) {
          clearInterval(interval);
          setThreads((prev) => prev.map((t) => {
            if (t.id !== activeThread.id) return t;
            return { ...t, messages: t.messages.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)) };
          }));
          setIsTyping(false);
          
          // SUMAR USO
          const newCount = usageCount + 1;
          setUsageCount(newCount);
          window.localStorage.setItem(USAGE_KEY, newCount.toString());
        }
      }, 10);
    } catch (err: any) {
      setUiError(err.message);
      setIsTyping(false);
    }
  }

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* PAYWALL PREMIUM MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center border border-zinc-100 scale-in-center">
            <img src="/vonu-icon.png" className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" alt="Vonu Pro" />
            <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">EXPERIENCIA PRO</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Únete a la comunidad Vonu y disfruta de análisis ilimitados para proteger tus ahorros.</p>
            <button onClick={() => window.location.href='https://buy.stripe.com/TU_LINK'} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">Suscribirme por 3,99€</button>
            <button onClick={() => setShowPaywall(false)} className="mt-4 text-xs text-zinc-400 font-medium">Continuar más tarde</button>
          </div>
        </div>
      )}

      {/* TU SIDEBAR ORIGINAL */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? "bg-black/20 backdrop-blur-sm" : "pointer-events-none bg-transparent"}`} onClick={() => setMenuOpen(false)}>
        <aside className={`absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-[110%]"}`} onClick={(e) => e.stopPropagation()}>
          <div className="pt-16">
            <div className="flex items-center justify-between mb-3 text-sm font-semibold text-zinc-800">
              Historial <button onClick={createThreadAndActivate} className="text-xs px-3 py-2 rounded-full bg-zinc-900 text-white">Nueva</button>
            </div>
            <div className="flex gap-2 mb-3">
              <button onClick={openRename} className="flex-1 text-xs px-3 py-2 rounded-full border border-zinc-200">Renombrar</button>
              <button onClick={deleteActiveThread} className="flex-1 text-xs px-3 py-2 rounded-full border border-zinc-200 text-red-600">Borrar</button>
            </div>
            <div className="space-y-2 overflow-y-auto h-[calc(100vh-250px)]">
              {sortedThreads.map((t) => (
                <button key={t.id} onClick={() => activateThread(t.id)} className={`w-full text-left rounded-2xl px-3 py-3 border ${t.id === activeThreadId ? "border-zinc-900 bg-zinc-50" : "border-zinc-200"}`}>
                  <div className="text-sm font-medium">{t.title}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* TU HEADER ORIGINAL */}
      <button onClick={() => setMenuOpen((v) => !v)} className="fixed left-5 top-5 z-50 flex items-center gap-[4px]">
        <img src="/vonu-icon.png" className={`h-7 w-7 transition-transform ${menuOpen ? "rotate-90" : ""}`} />
        <img src="/vonu-wordmark.png" className="h-5 w-auto" />
      </button>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {renameOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl border border-zinc-200">
              <div className="text-sm font-semibold mb-1">Renombrar chat</div>
              <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="w-full h-11 rounded-2xl border border-zinc-300 px-4 mb-4 outline-none" autoFocus />
              <div className="flex justify-end gap-2">
                <button onClick={() => setRenameOpen(false)} className="px-4 py-2 text-sm rounded-xl border border-zinc-200">Cancelar</button>
                <button onClick={confirmRename} className="px-4 py-2 text-sm rounded-xl bg-zinc-900 text-white">Guardar</button>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pt-20 pb-10 space-y-10 max-w-3xl mx-auto w-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              <div className="max-w-xl space-y-2">
                {msg.image && <img src={msg.image} className="rounded-3xl border border-zinc-200 max-h-64 object-contain" />}
                <div className={`${msg.role === 'assistant' ? 'prose prose-zinc text-sm' : 'bg-zinc-900 text-white text-sm rounded-3xl px-5 py-3'}`}>
                  <ReactMarkdown>{msg.text || ""}</ReactMarkdown>
                  {msg.streaming && <span className="inline-block ml-1 animate-pulse">▍</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TU INPUT ORIGINAL */}
        <div className="flex-shrink-0 bg-white">
          <div className="mx-auto max-w-3xl px-6 pt-4 pb-2 flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()} className="h-12 w-12 rounded-full border border-zinc-300 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectImage} className="hidden" />
            <div className="flex-1">
              {imagePreview && (
                <div className="mb-2 relative w-fit">
                  <img src={imagePreview} className="rounded-3xl border border-zinc-200 max-h-40" />
                  <button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-zinc-900 text-white">×</button>
                </div>
              )}
              <div className="w-full min-h-12 rounded-3xl border border-zinc-300 px-4 py-3 flex items-center">
                <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder="Escribe tu mensaje…" className="w-full resize-none bg-transparent text-sm outline-none" rows={1} />
              </div>
            </div>
            <button onClick={sendMessage} disabled={!canSend} className="h-12 rounded-3xl bg-zinc-900 text-white px-6 text-sm font-medium disabled:opacity-40">Enviar</button>
          </div>
          <div className="mx-auto max-w-3xl px-6 pb-4 text-center text-[10px] text-zinc-400">Vonu es orientación preventiva; no sustituye asesoramiento profesional.</div>
        </div>
      </div>
    </div>
  );
}