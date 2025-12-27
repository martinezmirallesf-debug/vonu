"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = { id: string; role: "user" | "assistant"; text?: string; image?: string; streaming?: boolean; };
type ChatThread = { id: string; title: string; updatedAt: number; messages: Message[]; };

function initialAssistantMessage(): Message {
  return {
    id: "init",
    role: "assistant",
    text: "Hola 👋 Soy **Vonu**.\n\nAnalizo tus capturas para decirte si son estafas. ¿Qué te preocupa hoy? (Recuerda: no compartas datos bancarios)."
  };
}

function makeNewThread(): ChatThread {
  return { id: crypto.randomUUID(), title: "Nueva consulta", updatedAt: Date.now(), messages: [initialAssistantMessage()] };
}

const STORAGE_KEY = "vonu_threads_v1";
const USAGE_KEY = "vonu_daily_usage";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) try { setThreads(JSON.parse(raw)); } catch(e){}
    const usage = window.localStorage.getItem(USAGE_KEY);
    if (usage) setUsageCount(parseInt(usage));
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads, mounted]);

  const activeThread = useMemo(() => threads.find(t => t.id === activeThreadId) ?? threads[0], [threads, activeThreadId]);

  async function sendMessage() {
    if (!input.trim() || isTyping) return;
    if (usageCount >= 1) { setShowPaywall(true); return; }

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: input.trim() };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", text: "", streaming: true };

    setThreads(prev => prev.map(t => t.id === activeThread.id ? { 
      ...t, 
      messages: [...t.messages, userMsg, assistantMsg],
      updatedAt: Date.now() 
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
      const fullText = data?.text || "Lo siento, hubo un error.";
      
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
          const newCount = usageCount + 1;
          setUsageCount(newCount);
          window.localStorage.setItem(USAGE_KEY, newCount.toString());
        }
      }, 10);
    } catch (e) { setIsTyping(false); }
  }

  if (!mounted) return null;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center border border-zinc-100 animate-in zoom-in duration-300">
            <div className="text-5xl mb-6">🛡️</div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">VONU PRO</h2>
            <p className="text-zinc-500 text-sm mb-8">Has agotado tu análisis gratis. Protégete de estafas sin límites por solo 3,99€.</p>
            <button onClick={() => window.location.href='https://buy.stripe.com/TU_ENLACE_STRIPE'} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-zinc-800 transition-all">Activar Protección</button>
            <button onClick={() => setShowPaywall(false)} className="mt-5 text-xs text-zinc-400 font-medium">Cerrar</button>
          </div>
        </div>
      )}
      <header className="p-5 flex items-center justify-between border-b border-zinc-50">
        <div className="flex items-center gap-2"><img src="/vonu-icon.png" className="h-6 w-6" /><span className="font-black text-zinc-900 tracking-tighter">VONU</span></div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 max-w-2xl mx-auto w-full">
        {activeThread.messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white shadow-sm' : 'bg-zinc-50 text-zinc-800'}`}>
              <ReactMarkdown components={{ p: ({children}) => <span className="inline leading-relaxed">{children}</span> }}>{msg.text || ""}</ReactMarkdown>
              {msg.streaming && <span className="inline-block ml-1 animate-pulse">▍</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 bg-zinc-50 p-2 rounded-[32px] border border-zinc-100 focus-within:border-zinc-300 transition-all">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Analizar mensaje..." className="flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
          <button onClick={sendMessage} disabled={!input.trim()} className="bg-zinc-900 text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-20 shadow-md">↑</button>
        </div>
        <p className="text-[10px] text-center text-zinc-400 mt-4 px-4 leading-tight">Vonu es orientación preventiva. Consulta con profesionales ante riesgos reales.</p>
      </div>
    </div>
  );
}