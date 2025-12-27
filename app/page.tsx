"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

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
const USAGE_KEY = "vonu_daily_usage";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false); // Cambiar a true manualmente para pruebas

  // UI States
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

  useEffect(() => {
    setMounted(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
        }
      } catch (e) { console.error(e); }
    }
    // Cargar uso diario
    const usage = window.localStorage.getItem(USAGE_KEY);
    if (usage) setUsageCount(parseInt(usage));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  const activeThread = useMemo(() => threads.find((t) => t.id === activeThreadId) ?? threads[0], [threads, activeThreadId]);
  const messages = activeThread?.messages ?? [];
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

  async function sendMessage() {
    if (!canSend || !activeThread) return;

    // FREEMIUM LOGIC: Límite de 1 consulta gratis
    if (usageCount >= 1 && !isPremium) {
      setUiError("HAS AGOTADO TU ANÁLISIS GRATIS. Pásate a Vonu Pro (3,99€) para consultas ilimitadas.");
      return;
    }

    const userText = input.trim();
    const imageBase64 = imagePreview;
    setUiError(null);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: userText || "Imagen adjunta", image: imageBase64 || undefined };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", text: "", streaming: true };

    setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { 
      ...t, 
      title: t.messages.length <= 1 ? makeTitleFromText(userText || "Imagen") : t.title,
      updatedAt: Date.now(), 
      messages: [...t.messages, userMsg, assistantMsg] 
    } : t));

    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...activeThread.messages, userMsg].map(m => ({ role: m.role, content: m.text ?? "" })), userText, imageBase64 }),
      });

      if (!res.ok) throw new Error("Error en la conexión con la IA");

      const data = await res.json();
      const fullText = data?.text || "Lo siento, no he podido procesar eso.";
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const partial = fullText.slice(0, i);
        setThreads(prev => prev.map(t => t.id === activeThread.id ? {
          ...t, messages: t.messages.map(m => m.id === assistantId ? { ...m, text: partial } : m)
        } : t));

        if (i >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);
          setThreads(prev => prev.map(t => t.id === activeThread.id ? {
            ...t, messages: t.messages.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
          } : t));
          
          // Incrementar contador si no es premium
          if (!isPremium) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            window.localStorage.setItem(USAGE_KEY, newCount.toString());
          }
        }
      }, 10);
    } catch (err: any) {
      setUiError(err.message);
      setIsTyping(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="h-screen bg-white flex overflow-hidden font-sans">
      {/* SIDEBAR */}
      <div className={`fixed inset-0 z-40 transition-all ${menuOpen ? "bg-black/20 backdrop-blur-sm" : "pointer-events-none"}`} onClick={() => setMenuOpen(false)}>
        <aside className={`absolute left-3 top-3 bottom-3 w-80 bg-white rounded-3xl shadow-xl border border-zinc-200 p-4 transform transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-[110%]"}`} onClick={e => e.stopPropagation()}>
          <div className="pt-16 space-y-4">
            <button onClick={() => { setThreads([makeNewThread(), ...threads]); setMenuOpen(false); }} className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold">Nueva consulta</button>
            <div className="overflow-y-auto h-[60vh] space-y-2">
              {threads.map(t => (
                <button key={t.id} onClick={() => { setActiveThreadId(t.id); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-2xl border ${t.id === activeThreadId ? "border-zinc-900 bg-zinc-50" : "border-zinc-100"}`}>
                  <div className="text-sm font-medium truncate">{t.title}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} className="fixed left-5 top-5 z-50 flex items-center gap-2">
        <img src="/vonu-icon.png" className="h-7 w-7" alt="Logo" />
        <img src="/vonu-wordmark.png" className="h-5 w-auto" alt="Vonu" />
      </button>

      <div className="flex-1 flex flex-col">
        {uiError && (
          <div className="mx-auto max-w-3xl w-full px-6 mt-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-red-700 text-sm font-bold mb-2">{uiError}</p>
              {!isPremium && usageCount >= 1 && (
                <button className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">Suscribirme por 3,99€/mes</button>
              )}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto pt-20 pb-10">
          <div className="max-w-3xl mx-auto px-6 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "assistant" ? "prose prose-zinc" : "bg-zinc-900 text-white p-4 rounded-3xl text-sm"}`}>
                  {msg.image && <img src={msg.image} className="rounded-2xl mb-2 max-h-60" alt="SMS" />}
                  <ReactMarkdown components={{ p: ({children}) => <span className="inline leading-relaxed">{children}</span> }}>
                    {msg.text || ""}
                  </ReactMarkdown>
                  {msg.streaming && <span className="inline-block ml-1 animate-pulse">▍</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-zinc-100">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 border border-zinc-200 rounded-full hover:bg-zinc-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <div className="flex-1 bg-zinc-50 rounded-3xl p-2 border border-zinc-200">
              {imagePreview && <div className="relative inline-block mb-2"><img src={imagePreview} className="h-20 rounded-lg" /><button onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 text-xs">×</button></div>}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe o pega el SMS sospechoso..."
                className="w-full bg-transparent border-none outline-none text-sm p-2 resize-none max-h-32"
                rows={1}
              />
            </div>
            <button onClick={sendMessage} disabled={!canSend} className="bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-bold disabled:opacity-30">Enviar</button>
          </div>
          <p className="text-[10px] text-center text-zinc-400 mt-4">Vonu es orientación preventiva. En caso de estafa confirmada, contacta con tu banco y autoridades.</p>
        </div>
      </div>
    </div>
  );
}