"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

// --- TIPOS ---
type Message = { id: string; role: "user" | "assistant"; text?: string; image?: string; streaming?: boolean; };
type ChatThread = { id: string; title: string; updatedAt: number; messages: Message[]; };

// --- CONFIGURACIÓN ---
const STORAGE_KEY = "vonu_threads_v1";
const USAGE_KEY = "vonu_daily_usage";
const STRIPE_LINK = "https://buy.stripe.com/TU_LINK_DE_STRIPE"; // Cambia esto por tu link real

function initialAssistantMessage(): Message {
  return {
    id: "init",
    role: "assistant",
    text: "Hola 👋 Soy **Vonu**. Cuéntame tu situación (o adjunta una captura) y te digo qué pinta tiene, el riesgo real y qué haría ahora. *Importante: no compartas contraseñas ni datos bancarios.*"
  };
}

function makeNewThread(): ChatThread {
  return { id: crypto.randomUUID(), title: "Nueva consulta", updatedAt: Date.now(), messages: [initialAssistantMessage()] };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carga inicial
  useEffect(() => {
    setMounted(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setThreads(parsed);
        if (parsed.length > 0) setActiveThreadId(parsed[0].id);
      } catch(e) { setThreads([makeNewThread()]); }
    } else {
      const first = makeNewThread();
      setThreads([first]);
      setActiveThreadId(first.id);
    }
    const usage = window.localStorage.getItem(USAGE_KEY);
    if (usage) setUsageCount(parseInt(usage));

    // Detectar si vuelve de pago con éxito
    if (window.location.search.includes("session=success")) {
      setUsageCount(0);
      window.localStorage.setItem(USAGE_KEY, "0");
    }
  }, []);

  // Guardado automático
  useEffect(() => {
    if (mounted) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [threads, activeThreadId]);

  const activeThread = useMemo(() => 
    threads.find(t => t.id === activeThreadId) || threads[0] || makeNewThread(), 
  [threads, activeThreadId]);

  const handleNewChat = () => {
    const nt = makeNewThread();
    setThreads([nt, ...threads]);
    setActiveThreadId(nt.id);
    setIsSidebarOpen(false);
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = threads.filter(t => t.id !== id);
    setThreads(filtered.length ? filtered : [makeNewThread()]);
    if (activeThreadId === id) setActiveThreadId(filtered[0]?.id || "");
  };

  async function sendMessage() {
    if (!input.trim() || isTyping) return;
    if (usageCount >= 1) { setShowPaywall(true); return; }

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: input.trim() };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", text: "", streaming: true };

    setThreads(prev => prev.map(t => t.id === activeThread.id ? { 
      ...t, messages: [...t.messages, userMsg, assistantMsg], updatedAt: Date.now() 
    } : t));

    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...activeThread.messages, userMsg].map(m => ({ role: m.role, content: m.text ?? "" })) }),
      });
      const data = await res.json();
      const fullText = data?.text || "Hubo un error al procesar tu consulta.";
      
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
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
          const newCount = usageCount + 1;
          setUsageCount(newCount);
          window.localStorage.setItem(USAGE_KEY, newCount.toString());
        }
      }, 5);
    } catch (e) { setIsTyping(false); }
  }

  if (!mounted) return null;

  return (
    <div className="h-screen bg-white flex overflow-hidden font-sans text-zinc-900">
      {/* PAYWALL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center border border-zinc-100">
            <div className="text-5xl mb-6">🛡️</div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">VONU PRO</h2>
            <p className="text-zinc-500 text-sm mb-8">Has agotado tu análisis gratis. Protégete sin límites por solo 3,99€.</p>
            <button onClick={() => window.location.href = STRIPE_LINK} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold shadow-lg">Activar Protección</button>
            <button onClick={() => setShowPaywall(false)} className="mt-5 text-xs text-zinc-400">Cerrar</button>
          </div>
        </div>
      )}

      {/* SIDEBAR (Funciones recuperadas) */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-72 h-full bg-zinc-50 border-r border-zinc-100 transition-transform duration-300 flex flex-col`}>
        <div className="p-6">
          <button onClick={handleNewChat} className="w-full py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-zinc-100 transition-all">+ Nuevo análisis</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {threads.map(t => (
            <div key={t.id} onClick={() => {setActiveThreadId(t.id); setIsSidebarOpen(false);}} className={`group p-4 rounded-2xl cursor-pointer transition-all ${activeThreadId === t.id ? 'bg-white shadow-sm ring-1 ring-zinc-200' : 'hover:bg-zinc-100'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold truncate pr-2">{t.messages[1]?.text?.slice(0, 30) || "Nueva consulta"}</span>
                <button onClick={(e) => deleteThread(t.id, e)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="p-5 flex items-center justify-between border-b border-zinc-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-zinc-400 text-xl">☰</button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-zinc-900 rounded-full" />
              <span className="font-black tracking-tighter text-xl">VONU</span>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 max-w-3xl mx-auto w-full scroll-smooth">
          {activeThread.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 rounded-[2rem] ${msg.role === 'user' ? 'bg-zinc-900 text-white shadow-blue-900/10' : 'bg-zinc-50 text-zinc-800'}`}>
                <div className="prose prose-sm prose-zinc">
                  <ReactMarkdown components={{ p: ({children}) => <p className="mb-0 inline">{children}</p> }}>
                    {msg.text || ""}
                  </ReactMarkdown>
                  {msg.streaming && <span className="inline-block ml-1 w-1.5 h-4 bg-zinc-400 animate-pulse align-middle" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 max-w-3xl mx-auto w-full bg-gradient-to-t from-white via-white pt-10">
          <div className="relative flex items-center bg-zinc-100 p-2 rounded-[2.5rem] shadow-inner focus-within:ring-2 ring-zinc-200 transition-all">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Analizar mensaje sospechoso..." className="flex-1 bg-transparent px-6 py-4 text-sm outline-none placeholder:text-zinc-400" />
            <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="bg-zinc-900 text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg">↑</button>
          </div>
          <p className="text-[10px] text-center text-zinc-400 mt-4 px-6 italic leading-tight">Vonu es una guía preventiva. Ante una estafa real, contacta con las autoridades.</p>
        </div>
      </main>
    </div>
  );
}