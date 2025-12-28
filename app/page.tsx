"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

// ... (Tipos y funciones auxiliares se mantienen igual)
type Message = { id: string; role: "user" | "assistant"; text?: string; image?: string; streaming?: boolean; };
type ChatThread = { id: string; title: string; updatedAt: number; messages: Message[]; };
function initialAssistantMessage(): Message { return { id: "init", role: "assistant", text: "Hola 👋 Soy **Vonu**.\n\nAnalizo tus capturas para decirte si son estafas. ¿Qué te preocupa hoy?" }; }
function makeNewThread(): ChatThread { return { id: crypto.randomUUID(), title: "Nueva consulta", updatedAt: Date.now(), messages: [initialAssistantMessage()] }; }
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) try { setThreads(JSON.parse(raw)); } catch(e){}
    const usage = window.localStorage.getItem(USAGE_KEY);
    if (usage) setUsageCount(parseInt(usage));
  }, []);

  const activeThread = useMemo(() => threads.find(t => t.id === activeThreadId) ?? threads[0], [threads, activeThreadId]);

  async function sendMessage() {
    if (!input.trim() || isTyping) return;

    // BLOQUEO BONITO: Si ya usó el gratis, abrimos el Modal en lugar de enviar
    if (usageCount >= 1) {
      setShowPaywall(true);
      return;
    }

    // ... lógica de envío normal (resumida para el ejemplo)
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: input };
    setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, messages: [...t.messages, userMsg] } : t));
    setInput("");
    
    // Simulamos fin de respuesta para sumar uso
    setTimeout(() => {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      window.localStorage.setItem(USAGE_KEY, newCount.toString());
    }, 1000);
  }

  if (!mounted) return null;

  return (
    <div className="h-screen bg-zinc-50 flex flex-col font-sans overflow-hidden">
      
      {/* MODAL DE PAGO (PAYWALL) */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-zinc-100 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Protección Ilimitada</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              Has agotado tu análisis gratuito. Únete a **Vonu Pro** para protegerte de todas las estafas sin límites.
            </p>
            
            <div className="space-y-3 mb-8">
              {['Análisis ilimitados', 'Soporte legal básico', 'Alertas en tiempo real'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-700 justify-center font-medium">
                  <span className="text-green-500">✓</span> {item}
                </div>
              ))}
            </div>

            <button 
              onClick={() => window.location.href = 'https://buy.stripe.com/TU_ENLACE_AQUI'}
              className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
            >
              Activar Pro por 3,99€
            </button>
            
            <button onClick={() => setShowPaywall(false)} className="mt-4 text-xs text-zinc-400 hover:text-zinc-600 font-medium">
              Quizás más tarde
            </button>
          </div>
        </div>
      )}

      {/* CABECERA */}
      <header className="p-5 flex items-center justify-center bg-white border-b border-zinc-100">
        <img src="/vonu-icon.png" className="h-6 w-6 mr-2" />
        <span className="font-bold text-zinc-900 tracking-tight">VONU</span>
      </header>

      {/* CHAT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {activeThread.messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-[24px] text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-zinc-900 text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-800 shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white border-t border-zinc-100">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe aquí..."
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-sm outline-none focus:border-zinc-400 transition-all"
          />
          <button onClick={sendMessage} className="bg-zinc-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}