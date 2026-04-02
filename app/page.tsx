// app/page.tsx


"use client";

import React, { Children, Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import PaywallModal from "@/app/components/PaywallModal";
import LoginModal from "@/app/components/LoginModal";
import ChatInputBar from "@/app/components/ChatInputBar";
import TopBar from "@/app/components/TopBar";
import Sidebar from "@/app/components/Sidebar";
import VonuThinking from "@/app/components/VonuThinking";

import ChalkboardTutorBoard from "@/app/components/ChalkboardTutorBoard";
import {
  startRealtimeVoice,
  type RealtimeVoiceConnection,
  type RealtimeVoiceStatus,
} from "@/app/lib/realtimeVoice";
import { makeVoiceWriteGuard } from "@/app/lib/voiceWriteIntent";


type Placement = { x: number; y: number; w: number; h: number };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;

  // extras para pizarra
  pizarra?: string | null;
  boardImageB64?: string | null;
  boardImagePlacement?: Placement | null;
};


type WhiteboardBlockProps = {
  value: string;
  onOpenCanvas?: () => void;
};

/**
 * Pizarra "tipo cole" (solo visual):
 * - Fondo oscuro (pizarra)
 * - Letras tipo "tiza"
 * - Animación línea a línea (como si escribiera el profe)
 */

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  image?: string;
  streaming?: boolean;
  pizarra?: string | null;
  boardImageB64?: string | null;
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null;
  revealMs?: number;
};

type ThreadMode = "chat" | "tutor";
type TutorLevel = "kid" | "teen" | "adult" | "unknown";

type TutorProfile = {
  level: TutorLevel;
};

type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  mode: ThreadMode; // 👈 modo por conversación
  tutorProfile?: TutorProfile;
  messages: Message[];
};

function smoothScrollToBottom(el: HTMLElement, duration = 380) {
  const start = el.scrollTop;
  const end = el.scrollHeight - el.clientHeight;
  const distance = end - start;

  if (distance <= 2) return;

  const startTime = performance.now();

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    el.scrollTop = start + distance * eased;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function smoothScrollToPosition(el: HTMLElement, target: number, duration = 420) {
  const start = el.scrollTop;
  const end = Math.max(0, target);
  const distance = end - start;

  if (Math.abs(distance) <= 2) return;

  const startTime = performance.now();

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    el.scrollTop = start + distance * eased;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getAdaptiveRevealTimings(text: string) {
  const len = (text || "").trim().length;

  const thinkMs =
    len < 120 ? 420 :
    len < 280 ? 650 :
    len < 600 ? 950 :
    len < 1100 ? 1300 :
    1700;

  const revealMs =
    len < 120 ? 260 :
    len < 280 ? 420 :
    len < 600 ? 700 :
    len < 1100 ? 1000 :
    1400;

  return { thinkMs, revealMs };
}

function splitTextForProgressiveReveal(text: string) {
  const clean = normalizeAssistantText(text || "").trim();
  if (!clean) return [];

  const blocks = clean
    .split(/\n\s*\n/g)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length >= 2) return blocks;

  // fallback: si no hay párrafos claros, partir por frases
  const sentences = clean
    .split(/(?<=[\.\?\!])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return [clean];

  const chunks: string[] = [];
  let buf = "";

  for (const s of sentences) {
    const next = buf ? `${buf} ${s}` : s;
    if (next.length < 220) {
      buf = next;
    } else {
      if (buf) chunks.push(buf);
      buf = s;
    }
  }

  if (buf) chunks.push(buf);

  return chunks.length ? chunks : [clean];
}

function getProgressiveChunkDelay(index: number, total: number) {
  if (total <= 1) return 0;
  if (index === 0) return 0;
  if (index === 1) return 220;
  if (index === 2) return 300;
  return 360;
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
    mode: "chat",
    tutorProfile: { level: "adult" },
    messages: [initialAssistantMessage()],
  };
}

function makeTitleFromText(text: string) {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "Nueva consulta";
  return t.length > 34 ? t.slice(0, 34) + "…" : t;
}

const STORAGE_KEY = "vonu_threads_v2";
const HOME_URL = "https://vonuai.com";

// ✅ regla: tras 1 mensaje, pedir login/pago
const GUEST_MESSAGE_LIMIT = 1;

function isDesktopPointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(pointer: fine)")?.matches ?? true;
}

function Fraction({ a, b }: { a: string; b: string }) {
  const top = String(a ?? "").trim();
  const bottom = String(b ?? "").trim();

  const maxLen = Math.max(top.length, bottom.length);
  const dynamicWidth = Math.max(24, Math.min(88, maxLen * 7.5));

  return (
    <span
      className="inline-flex align-middle mx-[5px]"
      style={{ transform: "translateY(3px)" }}
    >
      <span
        className="inline-flex flex-col items-center justify-center"
        style={{ lineHeight: 1.18, minWidth: `${dynamicWidth}px` }}
      >
        <span className="text-[0.92em] font-semibold text-center px-[3px] pb-[1px]">
          {top}
        </span>
        <span
  className="h-[1.5px] my-[3px] rounded-full bg-current"
  style={{ width: `${dynamicWidth}px`, opacity: 0.9 }}
/>
        <span className="text-[0.92em] font-semibold text-center px-[3px] pt-[1px]">
          {bottom}
        </span>
      </span>
    </span>
  );
}

function renderTextWithFractions(text: string) {
  const s = String(text ?? "");
  if (!s) return s;

  // ✅ SOLO convierte fracciones matemáticas reales:
  // - 1/4
  // - 21/36
  // - (1 × 9)/(4 × 9)
  // - (9 + 12)/36
  //
  // ❌ NO convierte unidades o ratios tipo:
  // - km/h
  // - m/s
  // - kg/m3
  // - N/m
  const re = /(\([^()\n]+\)|\d+)\s*\/\s*(\([^()\n]+\)|\d+)/g;

  const parts: Array<string | { a: string; b: string }> = [];

  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    const start = m.index;
    const end = re.lastIndex;

    if (start > last) parts.push(s.slice(last, start));

    const a = String(m[1] ?? "").trim();
    const b = String(m[2] ?? "").trim();

    const isPureNumericOrParen =
      (/^\d+$/.test(a) || /^\([^()\n]+\)$/.test(a)) &&
      (/^\d+$/.test(b) || /^\([^()\n]+\)$/.test(b));

    if (isPureNumericOrParen) {
      parts.push({ a, b });
    } else {
      parts.push(s.slice(start, end));
    }

    last = end;
  }

  if (last < s.length) parts.push(s.slice(last));

  return parts.map((p, i) => {
    if (typeof p === "string") return <span key={i}>{p}</span>;
    return <Fraction key={i} a={p.a} b={p.b} />;
  });
}

function renderChildrenWithFractions(children: ReactNode): ReactNode {
  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return <Fragment key={index}>{renderTextWithFractions(child)}</Fragment>;
    }

    if (typeof child === "number") {
      return <Fragment key={index}>{renderTextWithFractions(String(child))}</Fragment>;
    }

    if (!child || typeof child !== "object") {
      return child;
    }

    // ✅ Si es un elemento React con hijos, recorremos también sus hijos
    if (React.isValidElement(child)) {
      const el = child as React.ReactElement<any>;

      if (!el.props?.children) return child;

      return React.cloneElement(el, {
        children: renderChildrenWithFractions(el.props.children),
      });
    }

    return child;
  });
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ✅ Indicador "pensando": 3 puntos (solo cuando aún NO hay texto)
// Reservamos ancho fijo para que no "mueva" el layout al aparecer/desaparecer
function TypingDots() {
  return (
    <span className="ml-1 inline-flex items-center gap-1 align-middle" style={{ width: 18, justifyContent: "flex-start" }} aria-hidden="true">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600/70 animate-pulse" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600/70 animate-pulse" style={{ animationDelay: "180ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600/70 animate-pulse" style={{ animationDelay: "360ms" }} />
    </span>
  );
}

// ✅ Indicador "escribiendo": cursor fijo (SIN parpadeo) para que no “titile”
function TypingCaret() {
  return (
    <span
      aria-hidden="true"
      className="inline-block align-baseline"
      style={{
        marginLeft: 2,
        width: 8,
        height: "1em",
        backgroundColor: "rgba(24,24,27,0.85)",
        borderRadius: 2,
        transform: "translateY(2px)",
      }}
    />
  );
}

function OAuthLogo({ src, alt, invert }: { src: string; alt: string; invert?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-5 w-5"
      style={{
        display: "block",
        filter: invert ? "invert(1)" : undefined,
      }}
      draggable={false}
    />
  );
}

type AuthCardMode = "signin" | "signup";

type IdentityData = {
  email?: string;
  preferred_username?: string;
  name?: string;
  full_name?: string;
  displayName?: string;
  given_name?: string;
  family_name?: string;
};

function pickFirstNonEmpty(...vals: Array<string | null | undefined>) {
  for (const v of vals) {
    const t = (v ?? "").trim();
    if (t) return t;
  }
  return null;
}

function buildNameFromParts(given?: string, family?: string) {
  const g = (given ?? "").trim();
  const f = (family ?? "").trim();
  const both = `${g} ${f}`.trim();
  return both || null;
}

function bestIdentityFromUser(u: any): { identityData: IdentityData | null; provider: string | null } {
  const identities = (u as any)?.identities ?? [];
  if (!Array.isArray(identities) || identities.length === 0) return { identityData: null, provider: null };
  // Preferimos azure si existe, si no el primero
  const azure = identities.find((x: any) => x?.provider === "azure");
  const chosen = azure ?? identities[0];
  const identityData = (chosen?.identity_data ?? null) as IdentityData | null;
  const provider = (chosen?.provider ?? null) as string | null;
  return { identityData, provider };
}

// ✅ FIX: soportar nombre/email desde Microsoft (identity_data / user_metadata) y persistirlo
function deriveName(email: string | null, metaName?: string | null, identityName?: string | null) {
  const n = pickFirstNonEmpty(metaName, identityName);
  if (n) return n;
  if (!email) return null;
  const base = email.split("@")[0] || "";
  if (!base) return null;
  const cleaned = base.replace(/[._-]+/g, " ").trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : null;
}

// ✅ IMPORTANT: normalizamos el texto del assistant SIEMPRE (streaming y final)
// para que NO haya “salto raro” al terminar (mismo layout antes y después).
function normalizeAssistantText(text: string) {
  const raw = text ?? "";
  return raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

function sanitizeTutorLikeImage(text: string) {
  let s = String(text ?? "");

  // Normalizar saltos
  s = s.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

function normalizeMathMarkdown(text: string) {
  let s = String(text ?? "");

  // Normalizar saltos
  s = s.replace(/\r\n/g, "\n");

  // \[ ... \]  -> $$ ... $$
  s = s.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, expr) => {
    return `\n$$\n${String(expr).trim()}\n$$\n`;
  });

  // \( ... \) -> $ ... $
  s = s.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_match, expr) => {
    return `$${String(expr).trim()}$`;
  });

  // Si a veces llega como [ ... ] y dentro hay LaTeX claro, también lo convertimos
  s = s.replace(/^\[\s*(\\[\s\S]+?)\s*\]$/gm, (_match, expr) => {
    return `$$${String(expr).trim()}$$`;
  });

  // compactar saltos excesivos
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}


// ===== TUTOR (detección ligera frontend) =====
function looksLikeTutorIntent(text: string) {
  const t = (text || "").toLowerCase();

  const strong = [
    "explícame",
    "explicar",
"explicación",
"explicacion",
"puedes explicar",
"me puedes explicar",
"podrías explicar",
"podrias explicar",
    "explicame",
    "paso a paso",
    "ejercicio",
    "problema",
    "ecuación",
    "ecuaciones",
    "derivada",
    "integral",
    "mates",
    "matem",
    "física",
    "química",
    "historia",
    "geografía",
    "resumen",
    "repaso",
    "examen",
    "selectividad",
    "vocabulario",
    "inglés",
    "grammar",
    "gramática",
    "traduce",
    "pronunciación",
    "hazme preguntas",
    "test",
    "quiz",
    "flashcards",
  ];

  return strong.some((k) => t.includes(k));
}

function inferTutorLevel(text: string): TutorLevel {
  const t = (text || "").toLowerCase();

  const kid = ["primaria", "tabla", "sumas", "restas", "multiplic", "divisiones", "dictado", "ortografía", "deberes"];
  if (kid.some((k) => t.includes(k))) return "kid";

  const teen = ["eso", "bachiller", "selectividad", "evau", "trigonometr", "derivad", "integral", "funciones", "química", "física"];
  if (teen.some((k) => t.includes(k))) return "teen";

  const adult = ["universidad", "ingeniería", "álgebra lineal", "calculo", "estadística", "programación", "finanzas", "contabilidad"];
  if (adult.some((k) => t.includes(k))) return "adult";

  return "unknown";
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* cápsula superior */}
      <rect
        x="9"
        y="3.6"
        width="6"
        height="10.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* arco más abierto */}
      <path
        d="M5.5 11.8c0 4.1 3 7 6.5 7s6.5-2.9 6.5-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* palo ligeramente más largo */}
      <path
        d="M12 19.3v2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* base */}
      <path
        d="M9 21.8h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TalkIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* Altavoz */}
      <path
        d="M4 10v4h3l4 3V7L7 10H4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Ondas */}
      <path d="M16 9.5c1.2 1.2 1.2 3.8 0 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 7c2.6 2.6 2.6 7.4 0 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}




function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ FIX: usar el origin real del navegador para evitar PKCE cross-domain (vonuai.com vs app.vonuai.com vs preview)
  const SITE_URL =
    typeof window !== "undefined"
      ? window.location.origin.replace(/\/$/, "")
      : ((process.env.NEXT_PUBLIC_SITE_URL as string | undefined) || "https://app.vonuai.com").replace(/\/$/, "");

  // ===== AUTH =====
  const [authLoading, setAuthLoading] = useState(true);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUserName, setAuthUserName] = useState<string | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthCardMode>("signin");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginSending, setLoginSending] = useState(false);
  const [loginMsg, setLoginMsg] = useState<string | null>(null);
  const loginEmailRef = useRef<HTMLInputElement>(null);

  // ===== PAYWALL / PRO (interno) =====
  const [proLoading, setProLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

// ✅ Paywall final: plan + facturación
const [billing, setBilling] = useState<"monthly" | "yearly" | "topup">("monthly");
const [plan, setPlan] = useState<"plus" | "max" | "free">("plus");
const [payLoading, setPayLoading] = useState(false);
const [payMsg, setPayMsg] = useState<string | null>(null);

// ✅ Si el usuario intenta pagar estando logout, guardamos plan + billing y tras login lanzamos checkout
const [pendingCheckout, setPendingCheckout] = useState<{
  plan: "plus" | "max";
  billing: "monthly" | "yearly";
} | null>(null);

  // Mensaje post-checkout
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isLoggedIn = !authLoading && !!authUserId;
  const isBlockedByPaywall = false;

  // ===== Copy marketing (visible) =====
  const PLUS_TEXT = "Plus+";
  const PLUS_NODE = (
    <span className="inline-flex items-baseline">
      Plus
      <sup className="ml-[1px] text-[12px] font-bold leading-none relative -top-[5px]">+</sup>
    </span>
  );

  function WhiteboardBlock({ value, onOpenCanvas }: { value: string; onOpenCanvas: () => void }) {
    const lines = (value || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trimEnd());

    // ✅ animación: ir revelando líneas (como “profe escribiendo”)
    const [shown, setShown] = useState(0);

    useEffect(() => {
      setShown(0);
      const total = lines.length;

      // si es muy largo, aceleramos un poco
      const speed = total > 14 ? 70 : 110;

      const t = setInterval(() => {
        setShown((s) => {
          const next = Math.min(total, s + 1);
          if (next >= total) clearInterval(t);
          return next;
        });
      }, speed);

      return () => clearInterval(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <div className="my-2 rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-200 bg-white">
          <div className="text-[12px] font-semibold text-zinc-900">🧑‍🏫 Pizarra</div>

          <button onClick={onOpenCanvas} className="h-8 px-3 rounded-full bg-black hover:bg-zinc-900 text-white text-[12px] font-semibold">
            Abrir pizarra
          </button>
        </div>

        <div
          className="px-4 py-4 text-[14px] leading-7"
          style={{
            backgroundColor: "#0b0f0d",
            color: "#f8fafc",
            fontFamily: '"Chalkboard SE","Bradley Hand","Comic Sans MS","Segoe Print",ui-sans-serif,system-ui',
            textShadow: "0 0 1px rgba(255,255,255,.20)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "26px 26px, 38px 38px",
            backgroundPosition: "0 0, 13px 19px",
          }}
        >
          {lines.slice(0, shown).map((l, i) => (
            <div
              key={`${i}-${l?.slice?.(0, 10) ?? ""}`}
              className="whitespace-pre-wrap break-words"
              style={{
                opacity: 0.92,
                animation: "chalkIn 240ms ease-out both",
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))"
              }}
            >
              {l || " "}
            </div>
          ))}
          {/* cursor “tiza” al final mientras escribe */}
          {shown < lines.length ? (
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 10,
                height: 18,
                marginLeft: 4,
                background: "rgba(248,250,252,0.85)",
                borderRadius: 2,
                transform: "translateY(3px)",
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // ✅ FIX CLAVE: refreshProStatus NO depende de authUserId.
  async function refreshProStatus() {
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
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      setIsPro(!!json?.active);
    } catch {
      setIsPro(false);
    } finally {
      setProLoading(false);
    }
  }

  async function refreshUsageInfo() {
  try {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data?.session?.access_token;

    if (!token) {
      setUsageInfo(null);
      return;
    }

    const res = await fetch("/api/usage/status", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setUsageInfo(null);
      return;
    }

    if (json?.usage) {
      setUsageInfo(json.usage);
    } else {
      setUsageInfo(null);
    }
  } catch {
    setUsageInfo(null);
  }
}

  function computeProfileFromUser(u: any) {
    const { identityData } = bestIdentityFromUser(u);

    const metaName = pickFirstNonEmpty(u?.user_metadata?.full_name, u?.user_metadata?.name) as string | null;
    const metaEmail = pickFirstNonEmpty(u?.user_metadata?.email) as string | null;

    const identityEmail = pickFirstNonEmpty(identityData?.email, identityData?.preferred_username) as string | null;

    const identityName =
      pickFirstNonEmpty(
        identityData?.name,
        identityData?.full_name,
        identityData?.displayName,
        buildNameFromParts(identityData?.given_name, identityData?.family_name)
      ) ?? null;

    const email = (u?.email ?? metaEmail ?? identityEmail ?? null) as string | null;
    const id = (u?.id ?? null) as string | null;

    const name = deriveName(email, metaName, identityName);

    return { id, email, name, metaName, identityName };
  }

  // ✅ Persistimos nombre en user_metadata si Azure no lo guarda (muy común)
  async function persistNameIfMissing(u: any) {
    try {
      const { name, metaName } = computeProfileFromUser(u);
      if (!name) return;

      const existing = (metaName ?? "").trim();
      if (existing) return; // ya hay nombre en metadata

      await supabaseBrowser.auth.updateUser({
        data: {
          full_name: name,
          name,
        },
      });
    } catch {
      // no romper UI
    }
  }

  async function refreshAuthSession() {
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const u = data?.session?.user;

      if (!u) {
        setAuthUserEmail(null);
        setAuthUserId(null);
        setAuthUserName(null);
        return;
      }

      const profile = computeProfileFromUser(u);

      setAuthUserEmail(profile.email);
      setAuthUserId(profile.id);
      setAuthUserName(profile.name);
    } catch {
      setAuthUserEmail(null);
      setAuthUserId(null);
      setAuthUserName(null);
    } finally {
      setAuthLoading(false);
    }
  }

  function decodeMaybe(x: string) {
    try {
      return decodeURIComponent(x);
    } catch {
      return x;
    }
  }

  // ✅ CLAVE: capturar retorno de OAuth (Google/Microsoft) y guardar sesión (Supabase v2)
  async function handleOAuthReturnIfPresent() {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);

      const checkout = url.searchParams.get("checkout"); // preservar Stripe

      // ✅ Supabase puede devolver error / error_description O error_code / error_message
      const qError = url.searchParams.get("error");
      const qErrorDesc = url.searchParams.get("error_description");
      const qErrorCode = url.searchParams.get("error_code");
      const qErrorMsg = url.searchParams.get("error_message");

      const hash = typeof window.location.hash === "string" ? window.location.hash : "";
      const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);

      const hError = hashParams.get("error");
      const hErrorDesc = hashParams.get("error_description");
      const hErrorCode = hashParams.get("error_code");
      const hErrorMsg = hashParams.get("error_message");

      const errorRaw = qError ?? hError ?? qErrorCode ?? hErrorCode;
      const errorDescRaw = qErrorDesc ?? hErrorDesc ?? qErrorMsg ?? hErrorMsg;

      if (errorRaw || errorDescRaw) {
        const desc = decodeMaybe(errorDescRaw || "") || decodeMaybe(errorRaw || "") || "Error de OAuth.";
        const extra = qErrorCode || hErrorCode ? `\n\nCódigo: ${qErrorCode || hErrorCode}` : "";

        setLoginMsg(desc + extra);
        setLoginOpen(true);

        // limpiar params OAuth (preservando checkout)
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        url.searchParams.delete("error_code");
        url.searchParams.delete("error_message");
        if (checkout) url.searchParams.set("checkout", checkout);

        const cleanUrl = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`;
        window.history.replaceState({}, "", cleanUrl);
        return;
      }

      const code = url.searchParams.get("code");
      const hasCode = !!code;

      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      const hasHashTokens = !!access_token && !!refresh_token;

      if (!hasCode && !hasHashTokens) return;

      // 1) PKCE: ?code=...
      if (hasCode && code) {
        const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);
        if (error) {
          setLoginOpen(true);
          setLoginMsg(error.message);
        }
      }

      // 2) Implicit: #access_token=...&refresh_token=...
      if (!hasCode && hasHashTokens && access_token && refresh_token) {
        const { error } = await supabaseBrowser.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          setLoginOpen(true);
          setLoginMsg(error.message);
        }
      }

      // limpiar params OAuth (preservando checkout)
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      url.searchParams.delete("error_code");
      url.searchParams.delete("error_message");
      if (checkout) url.searchParams.set("checkout", checkout);

      const clean = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`;
      window.history.replaceState({}, "", clean);

      // ✅ Verificación explícita: ¿hay sesión de verdad?
      const { data: after } = await supabaseBrowser.auth.getSession();
      if (!after?.session?.user) {
        setLoginOpen(true);
        setLoginMsg(
          "No se pudo completar el login.\n\n" +
            "Si Google vuelve con error_code, suele ser configuración del provider o un trigger/constraint en DB.\n" +
            "Revisa Supabase Auth (Google), URL Configuration y logs de DB."
        );
        return;
      }

      await persistNameIfMissing(after.session.user);

      await refreshAuthSession();
      await refreshProStatus();

      setLoginOpen(false);
      setLoginMsg(null);
    } catch {
      // no romper UI
    }
  }

 

  // Cargar sesión + escuchar cambios
  useEffect(() => {
    let unsub: (() => void) | null = null;

    (async () => {
      await handleOAuthReturnIfPresent();
await refreshAuthSession();
await refreshProStatus();
await refreshUsageInfo();

      const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user;

        // ✅ FIX: aseguramos que authLoading se apaga también aquí (evita estados “colgados” tras OAuth)
        setAuthLoading(false);

        if (!u) {
          setAuthUserEmail(null);
          setAuthUserId(null);
          setAuthUserName(null);
          setIsPro(false);
          return;
        }

        await persistNameIfMissing(u);

        const profile = computeProfileFromUser(u);

        setAuthUserEmail(profile.email);
        setAuthUserId(profile.id);
        setAuthUserName(profile.name);

        setTimeout(() => {
  refreshProStatus();
  refreshUsageInfo();
}, 80);
      });

      unsub = () => sub.subscription.unsubscribe();
    })();

    return () => {
      try {
        unsub?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ FIX: al volver al tab/app, refrescar sesión Y pro
  useEffect(() => {
    if (typeof window === "undefined") return;

    let busy = false;

    const refreshAll = async () => {
      if (busy) return;
      busy = true;
      try {
        await refreshAuthSession();
await refreshProStatus();
await refreshUsageInfo();
      } finally {
        busy = false;
      }
    };

    const onFocus = () => refreshAll();
    const onVis = () => {
      if (document.visibilityState === "visible") refreshAll();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refrescar pro al cambiar user
  useEffect(() => {
    if (authLoading) return;
    refreshProStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserId, authLoading]);

  // ✅ Si acabamos de loguearnos y había un checkout pendiente, lanzarlo automáticamente
  useEffect(() => {
  if (authLoading) return;
  if (!isLoggedIn) return;
  if (!pendingCheckout) return;

  setLoginOpen(false);

  const chosen = pendingCheckout;
  setPendingCheckout(null);

  setTimeout(() => {
    startCheckout(chosen);
  }, 120);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authLoading, isLoggedIn, pendingCheckout]);

async function startTopupCheckout(pack: "basic" | "medium" | "large") {
  try {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data?.session?.access_token;

    if (!token) {
      setPayMsg("Para comprar una recarga, inicia sesión.");
      openLoginModal("signin");
      return;
    }

    const res = await fetch("/api/stripe/topup/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({ pack }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json?.url) {
      throw new Error(json?.error || "No se pudo iniciar la recarga.");
    }

    window.location.href = json.url;
  } catch (e: any) {
    setPayMsg(e?.message ?? "No se pudo iniciar la recarga.");
  }
}

  // Detectar retorno de Stripe (?checkout=success|cancel)
  useEffect(() => {
    if (!mounted) return;
    try {
      const url = new URL(window.location.href);
      const checkout = url.searchParams.get("checkout");
      if (!checkout) return;

      if (checkout === "success") {
        setToastMsg(`✅ Pago completado. Activando tu cuenta ${PLUS_TEXT}…`);
        url.searchParams.delete("checkout");
        window.history.replaceState({}, "", url.toString());

        refreshProStatus().finally(() => {
          setToastMsg(`✅ Listo. Ya tienes ${PLUS_TEXT} activo.`);
          setTimeout(() => setToastMsg(null), 3500);
        });
      } else if (checkout === "cancel") {
        setToastMsg("Pago cancelado. Puedes intentarlo cuando quieras.");
        url.searchParams.delete("checkout");
        window.history.replaceState({}, "", url.toString());
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // ✅ móvil: NO autofocus al abrir login
  useEffect(() => {
    if (!loginOpen) return;
    if (!isDesktopPointer()) return;
    const t = setTimeout(() => loginEmailRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [loginOpen]);

  function openLoginModal(mode: AuthCardMode = "signin") {
  setLoginMsg(null);
  setAuthMode(mode);
  setLoginOpen(true);

  if (isLoggedIn) {
    refreshUsageInfo();
  }
}

  function openPlansModal() {
  setPayMsg(null);
  setBilling("monthly");
  setPlan(isPro ? "free" : "plus");
  setPaywallOpen(true);
}

  function handleOpenPlansCTA() {
    openPlansModal();
  }

  async function startCheckout(chosen: {
  plan: "plus" | "max";
  billing: "monthly" | "yearly";
}) {
  setPayLoading(true);
  setPayMsg(null);

  try {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data?.session?.access_token;

    if (!token) {
      setPayLoading(false);
      setPayMsg("Para continuar al pago, inicia sesión.");
      setPendingCheckout(chosen);
      openLoginModal("signin");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify(chosen),
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

  async function cancelSubscriptionFromHere() {
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

      const ok = window.confirm("¿Seguro que quieres cancelar tu suscripción?\n\nSeguirás teniendo acceso hasta el final del periodo ya pagado.");
      if (!ok) {
        setPayLoading(false);
        return;
      }

      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
        body: JSON.stringify({}),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPayMsg(json?.error || "No se pudo cancelar la suscripción.");
        setPayLoading(false);
        return;
      }

      setToastMsg("✅ Suscripción cancelada. Mantienes acceso hasta el final del periodo.");
      setTimeout(() => setToastMsg(null), 4500);

      await refreshProStatus();
      setPayLoading(false);
    } catch (e: any) {
      setPayMsg(e?.message ?? "Error cancelando suscripción.");
      setPayLoading(false);
    }
  }

  async function signInWithOAuth(provider: "google" | "azure") {
    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${SITE_URL}/`,

          ...(provider === "google"
            ? {
                queryParams: { prompt: "select_account" },
                scopes: "openid email profile",
              }
            : {}),

          ...(provider === "azure"
            ? {
                queryParams: { prompt: "select_account" },
                scopes: "openid email profile",
              }
            : {}),
        },
      });

      if (error) setLoginMsg(error.message);
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error iniciando sesión con OAuth.");
    } finally {
      setLoginSending(false);
    }
  }

  async function signInWithPassword() {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !email.includes("@")) return setLoginMsg("Escribe un email válido.");
    if (!password || password.length < 6) return setLoginMsg("La contraseña debe tener al menos 6 caracteres.");

    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginMsg(error.message);
        return;
      }

      setLoginOpen(false);
      setLoginPassword("");
      setLoginMsg(null);

      setTimeout(() => {
        refreshProStatus();
      }, 300);
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error iniciando sesión con contraseña.");
    } finally {
      setLoginSending(false);
    }
  }

  async function signUpWithPassword() {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword;

    if (!email || !email.includes("@")) return setLoginMsg("Escribe un email válido.");
    if (!password || password.length < 6) return setLoginMsg("La contraseña debe tener al menos 6 caracteres.");

    setLoginSending(true);
    setLoginMsg(null);
    try {
      const { error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${SITE_URL}/`,
        },
      });
      if (error) {
        setLoginMsg(error.message);
        return;
      }

      setLoginMsg("✅ Cuenta creada. Si te pedimos confirmación, revisa tu email para activarla.");
      setAuthMode("signin");
    } catch (e: any) {
      setLoginMsg(e?.message ?? "Error creando cuenta.");
    } finally {
      setLoginSending(false);
    }
  }

  async function logout() {
  try {
    await supabaseBrowser.auth.signOut();
    setAuthUserEmail(null);
    setAuthUserId(null);
    setAuthUserName(null);
    setIsPro(false);
    setPaywallOpen(false);
    setPendingCheckout(null);
    setAuthLoading(false);
  } catch {}
}

  // -------- Persistencia local --------
const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
const threadsRef = useRef<ChatThread[]>([]);
const [activeThreadId, setActiveThreadId] = useState<string>("");
const activeThreadIdRef = useRef<string>("");

useEffect(() => {
  threadsRef.current = threads;
}, [threads]);


  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as any[];
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const clean: ChatThread[] = parsed
        .filter((t) => t && typeof t.id === "string")
        .map((t) => ({
          id: String(t.id),
          title: typeof t.title === "string" ? t.title : "Consulta",
          updatedAt: typeof t.updatedAt === "number" ? t.updatedAt : Date.now(),

          mode: (t?.mode === "tutor" ? "tutor" : "chat") as ThreadMode,

          tutorProfile: {
            level:
              t?.tutorProfile?.level === "kid" || t?.tutorProfile?.level === "teen" || t?.tutorProfile?.level === "adult"
                ? (t.tutorProfile.level as TutorLevel)
                : ("adult" as TutorLevel),
          },

          messages: Array.isArray(t.messages) && t.messages.length ? (t.messages as Message[]) : [initialAssistantMessage()],
        }));

      if (clean.length) {
        setThreads(clean);
        setActiveThreadId(clean[0].id);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch {}
  }, [threads, mounted]);

  // -------- UI --------
  const [input, setInput] = useState("");
  // =======================
// 🔊 VOZ (Text-to-Speech) — premium: habla + escribe
// =======================
const [ttsEnabled, setTtsEnabled] = useState(false);
const [ttsSpeaking, setTtsSpeaking] = useState(false);

// ✅ Modo conversación (nuevo: OpenAI Realtime)
const [voiceMode, setVoiceMode] = useState(false);
const [realtimeStatus, setRealtimeStatus] = useState<RealtimeVoiceStatus>("idle");
const realtimeConnRef = useRef<RealtimeVoiceConnection | null>(null);
const realtimeLastUserTextRef = useRef<string>("");
const realtimeWriteBusyRef = useRef(false);
const voiceWriteGuardRef = useRef(makeVoiceWriteGuard());
const realtimeManualCloseRef = useRef(false);

// ✅ Anti-eco: tras hablar (TTS), esperamos antes de escuchar
const ttsCooldownUntilRef = useRef<number>(0);

// helper
function inTtsCooldown() {
  return Date.now() < (ttsCooldownUntilRef.current || 0);
}


const voiceModeRef = useRef(false);

useEffect(() => {
  voiceModeRef.current = voiceMode;
}, [voiceMode]);

useEffect(() => {
  return () => {
    try {
      realtimeConnRef.current?.stop();
    } catch {}
    realtimeConnRef.current = null;
  };
}, []);

function appendRealtimeUserMessage(text: string) {
  const clean = String(text ?? "").trim();
  console.log("[VOICE] appendRealtimeUserMessage", clean);

  if (!clean) return;
  if (clean.length < 2) return;

  const threadId = activeThread?.id;
  if (!threadId) return;

  const newUserMessageId = crypto.randomUUID();

  setThreads((prev) =>
    prev.map((t) => {
      if (t.id !== threadId) return t;

      const last = t.messages[t.messages.length - 1];
      const lastText = (last?.text ?? "").trim();

      if (last?.role === "user") {
        const normLast = normalizeSendText(lastText);
        const normClean = normalizeSendText(clean);

        if (normLast === normClean) return t;

        // Si el nuevo texto contiene al anterior, sustituimos el último en vez de añadir otro
        if (normLast && normClean.includes(normLast)) {
          return {
            ...t,
            updatedAt: Date.now(),
            messages: [
              ...t.messages.slice(0, -1),
              {
                ...last,
                text: clean,
              },
            ],
          };
        }
      }

      return {
        ...t,
        updatedAt: Date.now(),
        messages: [
          ...t.messages,
          {
            id: newUserMessageId,
            role: "user",
            text: clean,
            streaming: false,
            pizarra: null,
            boardImageB64: null,
            boardImagePlacement: null,
          },
        ],
      };
    })
  );

  if (!isDesktopPointer()) {
    textareaRef.current?.blur();
  }

  pinUserMessageNearTop(newUserMessageId);
}

function appendRealtimeAssistantMessage(text: string) {
  const clean = normalizeAssistantText(String(text ?? "").trim());

  console.log("[VOICE] appendRealtimeAssistantMessage IN", {
    raw: text,
    clean,
    activeThreadIdRef: activeThreadIdRef.current,
    activeThreadIdState: activeThread?.id,
  });

  if (!clean) return;

  const threadId = activeThread?.id;
  if (!threadId) {
    console.log("[VOICE] appendRealtimeAssistantMessage NO_THREAD");
    return;
  }

  setThreads((prev) => {
    console.log(
      "[VOICE] appendRealtimeAssistantMessage setThreads BEFORE",
      prev.map((t) => ({
        id: t.id,
        count: t.messages.length,
      }))
    );

    const next = prev.map((t) => {
      if (t.id !== threadId) return t;

      const last = t.messages[t.messages.length - 1];
      const lastText = (last?.text ?? "").trim();

      if (last?.role === "assistant" && lastText === clean) {
        console.log("[VOICE] appendRealtimeAssistantMessage BLOCK_DUPLICATE", {
          threadId,
          clean,
        });
        return t;
      }

      const updated = {
        ...t,
        updatedAt: Date.now(),
        messages: [
          ...t.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            text: clean,
            streaming: false,
            pizarra: null,
            boardImageB64: null,
            boardImagePlacement: null,
          },
        ],
      };

      console.log("[VOICE] appendRealtimeAssistantMessage APPENDED", {
        threadId,
        newCount: updated.messages.length,
        text: clean,
      });

      return updated;
    });

    return next;
  });
}

async function createWrittenReplyFromVoice(_userText: string) {
  // ✅ Desactivado:
  // en modo conversación usamos la respuesta nativa de Realtime,
  // y esa misma se pinta en el chat con onAssistantFinalText.
  return;
}

function handleVoiceMessageForChat(text: string) {
  const clean = (text ?? "").trim();
  console.log("[VOICE] handleVoiceMessageForChat IN", clean);

  if (!voiceModeRef.current) return;
  if (!clean) return;

  const prev = normalizeSendText(realtimeLastUserTextRef.current || "");
  const next = normalizeSendText(clean);

  if (prev && prev === next) {
    console.log("[VOICE] blocked duplicate", { prev, next });
    return;
  }

  realtimeLastUserTextRef.current = clean;

  // ✅ Solo pintamos en chat lo que tú has dicho.
  // ❌ NO pedimos una segunda respuesta escrita por /api/chat.
  appendRealtimeUserMessage(clean);
}

function sendTextToRealtime(text: string) {
  const clean = String(text ?? "").trim();
  if (!clean) return;

  try {
    realtimeLastUserTextRef.current = clean;
    realtimeConnRef.current?.sendText(clean);
  } catch (e) {
    console.error("Error enviando texto a realtime:", e);
  }
}


function setVoiceModeOff() {
  voiceModeRef.current = false;
  setVoiceMode(false);
  setRealtimeStatus("closed");

  try {
    realtimeConnRef.current?.stop();
  } catch {}
  realtimeConnRef.current = null;

  try {
    stopMic();
  } catch {}

  stopTTS();
  clearSilenceTimer();

  realtimeLastUserTextRef.current = "";
  realtimeManualCloseRef.current = false;
}

function stopConversationModeBeforeTypedSend() {
  if (!voiceModeRef.current) return;

  realtimeManualCloseRef.current = true;

  try {
    realtimeConnRef.current?.stop();
  } catch {}
  realtimeConnRef.current = null;

  try {
    stopMic();
  } catch {}

  voiceModeRef.current = false;
  setVoiceMode(false);
  setRealtimeStatus("closed");

  stopTTS();
  clearSilenceTimer();

  realtimeLastUserTextRef.current = "";

  setMicMsg("Modo conversación desactivado para continuar por escrito.");
  setTimeout(() => setMicMsg(null), 1800);
}

function toggleDictation() {
  // Solo dictado (micro) — si no hay soporte, avisamos
  if (!speechSupported) {
    setMicMsg("Tu navegador no soporta dictado por voz. Prueba Chrome/Edge.");
    setTimeout(() => setMicMsg(null), 2400);
    return;
  }
  // ✅ Si estás en modo conversación, el dictado no se usa (evita conflicto)
  if (voiceModeRef.current) {
    setMicMsg("Apaga el modo conversación para usar dictado.");
    setTimeout(() => setMicMsg(null), 2200);
    return;
  }

  // Si Vonu está hablando, cortamos para no pisar
  stopTTS();

  // Encender/apagar micro
  toggleMic();
}

async function toggleConversation() {
  const supportsMic =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;



  // ✅ SI YA ESTÁ ACTIVO, PRIMERO APAGAR SIEMPRE
  if (voiceModeRef.current) {
    realtimeManualCloseRef.current = true;

    try {
      realtimeConnRef.current?.stop();
    } catch {}
    realtimeConnRef.current = null;

    voiceModeRef.current = false;
    setVoiceMode(false);
    setRealtimeStatus("closed");

    setTtsEnabled(false);
    stopTTS();
    clearSilenceTimer();

    setMicMsg("Modo conversación desactivado.");
    setTimeout(() => setMicMsg(null), 1800);
    return;
  }

  // ✅ A partir de aquí solo estamos intentando ENCENDERLO
  if (!isLoggedIn) {
    setMicMsg("Debes iniciar sesión para usar el modo conversación.");
    setTimeout(() => setMicMsg(null), 2400);
    openLoginModal("signin");
    return;
  }

  if (usageInfo && !["plus", "max"].includes(usageInfo.plan_id)) {
  setMicMsg("El modo conversación por voz no está disponible en tu plan actual.");
  setTimeout(() => setMicMsg(null), 2800);
  handleOpenPlansCTA();
  return;
}

  if (!supportsMic) {
    setMicMsg("Tu navegador no soporta micrófono en este modo.");
    setTimeout(() => setMicMsg(null), 2400);
    return;
  }

  try {
    stopTTS();
  } catch {}

  try {
    stopMic();
  } catch {}

  setListeningPurpose(null);
  setIsListening(false);
  clearSilenceTimer();

  realtimeLastUserTextRef.current = "";

  setMicMsg("Conectando con Vonu por voz…");
  setRealtimeStatus("connecting");

  try {
    const conn = await startRealtimeVoice({
      onStatus: (status) => {
        setRealtimeStatus(status);

        if (status === "connected") {
          setMicMsg("🟢 Conectado. Habla cuando quieras.");
        }

        if (status === "listening") {
          setMicMsg("🎙️ Te estoy escuchando…");
        }

        if (status === "speaking") {
          setMicMsg("🗣️ Vonu está respondiendo…");
        }

        if (status === "closed") {
          if (realtimeManualCloseRef.current) {
            setMicMsg("Modo conversación desactivado.");
          }
        }
      },

      onError: (message) => {
        realtimeManualCloseRef.current = false;
        setMicMsg(message || "Error en el modo conversación.");

        console.error("[Realtime UI error]", message);

        try {
          realtimeConnRef.current?.stop();
        } catch {}
        realtimeConnRef.current = null;

        voiceModeRef.current = false;
        setVoiceMode(false);
        setRealtimeStatus("error");
      },

      onUserFinalTranscript: (text) => {
        console.log("[VOICE] onUserFinalTranscript", text);
        handleVoiceMessageForChat(text);
      },

      onAssistantFinalText: (text) => {
        console.log("[VOICE] onAssistantFinalText", text);
        appendRealtimeAssistantMessage(text);
      },

      onEvent: (event) => {
        try {
          const type = String(event?.type ?? "");
          console.log("[VOICE] raw event", type, event);
        } catch {}
      },
    });

    realtimeConnRef.current = conn;
    voiceModeRef.current = true;
    setVoiceMode(true);
    setTtsEnabled(false);
    setMicMsg("✅ Conectando modo conversación…");
  } catch (e: any) {
    try {
      realtimeConnRef.current?.stop();
    } catch {}
    realtimeConnRef.current = null;

    voiceModeRef.current = false;
    setVoiceMode(false);
    setRealtimeStatus("closed");
    voiceWriteGuardRef.current.reset();

    setMicMsg(e?.message ?? "No se pudo iniciar el modo conversación.");
    setTimeout(() => setMicMsg(null), 3200);
  }
}


function toggleReadAloud() {
  // Solo lectura (TTS)
  if (!supportsTTS()) return;

  setTtsEnabled((v) => {
    const next = !v;
    if (!next) stopTTS();
    return next;
  });
}


// =======================
// 🔊 TTS helpers
// =======================
function supportsTTS() {
  if (typeof window === "undefined") return false;
  return typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
}

// ✅ Cargar voces de forma fiable (algunos navegadores las cargan tarde)
function getVoicesAsync(timeoutMs = 900): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined") return Promise.resolve([]);
  const synth = window.speechSynthesis;

  // por si el motor queda “pausado”
  try { synth.resume?.(); } catch {}

  try {
    const existing = synth.getVoices?.() ?? [];
    if (existing.length) return Promise.resolve(existing);
  } catch {}

  return new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      try { synth.onvoiceschanged = null; } catch {}
      try { resolve(synth.getVoices?.() ?? []); } catch { resolve([]); }
    };

    try {
      synth.onvoiceschanged = () => finish();
    } catch {}

    setTimeout(() => finish(), timeoutMs);
  });
}

// ✅ “Unlock” de TTS SIN timer que cancele tu voz real
// Devuelve una promesa para poder esperar a que termine.
function primeTTSAsync(opts?: { hardCancel?: boolean }) {
  if (typeof window === "undefined") return Promise.resolve();
  if (!supportsTTS()) return Promise.resolve();

  const hardCancel = !!opts?.hardCancel;

  return new Promise<void>((resolve) => {
    try {
      const synth = window.speechSynthesis;

      // ✅ Solo cancel “duro” cuando vienes de un click (unlock).
      // Antes de hablar respuesta real, NO cancel agresivo.
      try {
        if (hardCancel) synth.cancel();
        synth.resume?.();
      } catch {}

      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0; // silencioso
      u.rate = 1;
      u.pitch = 1;

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      u.onend = finish;
      u.onerror = finish;

      setTimeout(finish, 250);

      synth.speak(u);
    } catch {
      resolve();
    }
  });
}



// Limpia markdown a texto “hablable”
function stripMarkdownForTTS(md: string) {
  let s = String(md ?? "");

  // quitar bloques de código
  s = s.replace(/```[\s\S]*?```/g, " ");
  // quitar inline code
  s = s.replace(/`([^`]+)`/g, "$1");

  // links [texto](url) -> texto
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // negritas/itálicas
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/_([^_]+)_/g, "$1");

  // bullets raros
  s = s.replace(/^\s*[-*•]\s+/gm, "");
  s = s.replace(/\n{3,}/g, "\n\n");
  // ✅ quitar emojis (evita "cara sonriente", etc.)
  // Extended_Pictographic funciona en navegadores modernos (Chrome/Edge/Safari recientes)
  try {
    s = s.replace(/\p{Extended_Pictographic}+/gu, " ");
  } catch {
    // fallback básico si el navegador no soporta unicode property escapes
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/gu, " ");
  }

  // limpiar dobles espacios tras quitar emojis
  s = s.replace(/\s{2,}/g, " ");
  // ✅ Matemáticas "hablables"
  // fracciones simples 12/5 -> "12 entre 5"
  s = s.replace(/(\b\d+)\s*\/\s*(\d+\b)/g, "$1 entre $2");

  // raíz: √9 -> "raíz de 9"
  s = s.replace(/√\s*([0-9a-zA-Z]+)/g, "raíz de $1");

  // exponentes estilo x^2, a^n
  s = s.replace(/([a-zA-Z0-9\)\]])\s*\^\s*2\b/g, "$1 al cuadrado");
  s = s.replace(/([a-zA-Z0-9\)\]])\s*\^\s*3\b/g, "$1 al cubo");
  s = s.replace(/([a-zA-Z0-9\)\]])\s*\^\s*(\d+)\b/g, "$1 elevado a $2");

  // superscripts comunes ² ³ (y algunos más)
  s = s.replace(/([a-zA-Z0-9\)\]])\s*²/g, "$1 al cuadrado");
  s = s.replace(/([a-zA-Z0-9\)\]])\s*³/g, "$1 al cubo");

  // pi aproximado
  s = s.replace(/\bπ\b/g, "pi");

  return s.trim();
}

function shortenForVoice(text: string, maxChars = 420) {
  const t = stripMarkdownForTTS(text);
  if (!t) return "";

  // corta por frases, y se queda con 2-3 frases
  const sentences = t.split(/(?<=[\.\?\!])\s+/g).filter(Boolean);

  let out = "";
  for (const s of sentences) {
    if (!s.trim()) continue;
    const next = (out ? out + " " : "") + s.trim();
    if (next.length > maxChars) break;
    out = next;
    if ((out.match(/[.!?]/g) || []).length >= 3) break;
  }

  // fallback si no hay puntuación
  if (!out) out = t.slice(0, maxChars);

  // si hemos recortado, rematamos
  if (out.length < t.length) out = out.trim() + "… Si quieres, te lo amplío.";
  return out.trim();
}

// Partir en trozos para que el motor no se “atragante”
function chunkForTTS(text: string, maxLen = 220) {
  const t = stripMarkdownForTTS(text);
  if (!t) return [];

  // corta muy largo para evitar locuras
  const clipped = t.length > 2200 ? t.slice(0, 2200) + "…" : t;

  // troceo por frases
  const parts: string[] = [];
  const sentences = clipped.split(/(?<=[\.\?\!])\s+/g);

  let buf = "";
  for (const s of sentences) {
    const next = (buf ? buf + " " : "") + s;
    if (next.length <= maxLen) {
      buf = next;
    } else {
      if (buf) parts.push(buf);
      buf = s;
    }
  }
  if (buf) parts.push(buf);

  // fallback si no hay puntuación
  if (!parts.length) {
    for (let i = 0; i < clipped.length; i += maxLen) {
      parts.push(clipped.slice(i, i + maxLen));
    }
  }

  return parts.map((x) => x.trim()).filter(Boolean);
}

function stopTTS() {
  if (typeof window === "undefined") return;
  try {
    window.speechSynthesis?.cancel?.();
  } catch {}
  setTtsSpeaking(false);
}

async function speakTTS(text: string) {
  // ✅ MUY IMPORTANTE:
  // En modo conversación NO usamos nunca la voz del navegador.
  // La voz la pone OpenAI Realtime.
  if (voiceModeRef.current) return;

  // ✅ Solo leer en voz alta fuera del modo conversación
  if (!supportsTTS()) return;
  if (!ttsEnabled) return;

  const clean = stripMarkdownForTTS(text);
  if (!clean) return;

  stopTTS();

  try {
    await primeTTSAsync({ hardCancel: false });
  } catch {}

  const chunks = chunkForTTS(clean);
  if (!chunks.length) return;

  setTtsSpeaking(true);

  const synth = window.speechSynthesis;
  try {
    synth.resume?.();
  } catch {}

  const pickVoiceLive = () => {
    let vs: SpeechSynthesisVoice[] = [];
    try {
      vs = synth.getVoices?.() ?? [];
    } catch {}
    const es = vs.find((v) => (v.lang || "").toLowerCase().startsWith("es"));
    return es ?? vs[0] ?? null;
  };

  try {
    await getVoicesAsync(900);
  } catch {}

  await new Promise((r) => setTimeout(r, 30));

  for (const ch of chunks) {
    const u = new SpeechSynthesisUtterance(ch);

    const voice = pickVoiceLive();
    if (voice) u.voice = voice;

    u.lang = voice?.lang || "es-ES";
    u.rate = 1.02;
    u.pitch = 1.0;
    u.volume = 1.0;

    await new Promise<void>((resolve) => {
      u.onend = () => resolve();
      u.onerror = () => resolve();
      try {
        synth.resume?.();
        synth.speak(u);
      } catch {
        resolve();
      }
    });

    if (!ttsEnabled) break;
  }

  setTtsSpeaking(false);
}

    const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const [usageInfo, setUsageInfo] = useState<{
  plan_id: string;
  messages_used: number;
  messages_limit: number;
  messages_left: number;
  realtime_seconds_used: number;
  realtime_seconds_limit: number;
  realtime_seconds_left: number;
} | null>(null);

  // =========================
  // ✅ ANTI-DUPLICADO / SEND LOCK
  // Evita que el mismo mensaje se envíe 2-3 veces por:
  // - doble click / Enter
  // - modo conversación (SpeechRecognition onend duplicado)
  // - carrera antes de que isTyping pase a true
  // =========================
  const sendGuardRef = useRef<{
    busy: boolean;
    last: { threadId: string; text: string; ts: number };
  }>({
    busy: false,
    last: { threadId: "", text: "", ts: 0 },
  });

  function normalizeSendText(t: string) {
    return (t ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }



  function shouldBlockDuplicateSend(threadId: string, rawText: string) {
    const now = Date.now();
    const text = normalizeSendText(rawText);

    if (!threadId || !text) return false;

    const last = sendGuardRef.current.last;
    // ventana anti-duplicado (ajústala si quieres)
    const WINDOW_MS = 1800;

    if (last.threadId === threadId && last.text === text && now - last.ts < WINDOW_MS) {
      return true;
    }

    sendGuardRef.current.last = { threadId, text, ts: now };
    return false;
  }


  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [inputExpanded, setInputExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
const inputBarRef = useRef<HTMLDivElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);
const headerRef = useRef<HTMLDivElement>(null);


  function pinUserMessageNearTop(messageId: string) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const container = scrollRef.current;
      if (!container) return;

      const msgEl = container.querySelector(
        `[data-msg-id="${messageId}"]`
      ) as HTMLElement | null;

      if (!msgEl) return;

      const containerRect = container.getBoundingClientRect();
      const msgRect = msgEl.getBoundingClientRect();

      const topGap = isDesktopPointer() ? 92 : 125;

      const targetTop =
        container.scrollTop + (msgRect.top - containerRect.top) - topGap;

      smoothScrollToPosition(container, Math.max(0, targetTop), 420);
    });
  });
}

  const [inputBarH, setInputBarH] = useState<number>(140);
  const shouldStickToBottomRef = useRef(true);

 // =======================
// 🎙️ MIC (SpeechRecognition) — SIN DUPLICADOS
// =======================
function cleanRepeatedWords(text: string) {
  const words = text.split(" ");
  const result: string[] = [];

  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i].toLowerCase() !== words[i - 1].toLowerCase()) {
      result.push(words[i]);
    }
  }

  return result.join(" ");
}

function dedupeGrowingTranscript(prev: string, next: string) {
  const p = (prev ?? "").replace(/\s+/g, " ").trim();
  const n = (next ?? "").replace(/\s+/g, " ").trim();

  if (!p) return n;
  if (!n) return p;

  // típico móvil: el nuevo contiene al anterior (va “creciendo”)
  if (n.toLowerCase().startsWith(p.toLowerCase())) return n;
  // raro: llega uno más corto después
  if (p.toLowerCase().startsWith(n.toLowerCase())) return p;

  // merge por solape: sufijo de prev == prefijo de next
  const pl = p.toLowerCase();
  const nl = n.toLowerCase();
  const max = Math.min(pl.length, nl.length);

  for (let len = max; len >= 12; len--) {
    if (pl.slice(-len) === nl.slice(0, len)) {
      return (p + " " + n.slice(len)).replace(/\s+/g, " ").trim();
    }
  }

  // si no hay solape claro, nos quedamos con el más largo
  return n.length >= p.length ? n : p;
}

function beepReady() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880; // beep agudo corto
    g.gain.value = 0.03;

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    setTimeout(() => {
      try { o.stop(); } catch {}
      try { ctx.close(); } catch {}
    }, 90);
  } catch {}
}

const [speechSupported, setSpeechSupported] = useState(false);
const [isListening, setIsListening] = useState(false);
const [micMsg, setMicMsg] = useState<string | null>(null);
type MicPurpose = "dictation" | "conversation";

const [listeningPurpose, setListeningPurpose] = useState<MicPurpose | null>(null);

const micPurposeRef = useRef<MicPurpose>("dictation");

// ✅ refs internas del motor de reconocimiento
const recognitionRef = useRef<any | null>(null);
const micStoppingRef = useRef(false); // ✅ evita onend fantasma (stop/abort programático)
const micBaseRef = useRef<string>("");
const micFinalRef = useRef<string>("");
const micInterimRef = useRef<string>("");
const micLastFullRef = useRef<string>("");

// ✅ evita duplicados en Android Chrome: recuerda el último índice final ya procesado
const micLastFinalIndexRef = useRef<number>(-1);
// ✅ Android: guarda cada trozo final por índice y reconstruye (evita repeticiones bestia)
const micFinalByIndexRef = useRef<Record<number, string>>({});


// ✅ anti-duplicado de envíos en conversación
const lastMicSendRef = useRef<{ text: string; ts: number }>({ text: "", ts: 0 });
function normalizeVoiceSendText(s: string) {
  return (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?¡¿]+/g, "")
    .replace(/["'`()\[\]{}]/g, "");
}

// Similaridad simple: bloquea si uno contiene al otro (muy útil con motores móviles)
function isNearlySameVoice(a: string, b: string) {
  const A = normalizeVoiceSendText(a);
  const B = normalizeVoiceSendText(b);
  if (!A || !B) return false;
  if (A === B) return true;
  if (A.length >= 8 && (B.includes(A) || A.includes(B))) return true;
  return false;
}

function getLastUserTextInThread(threadId: string) {
  try {
    const t = threadsRef.current.find((x) => x.id === threadId);
    if (!t) return "";
    for (let i = (t.messages?.length ?? 0) - 1; i >= 0; i--) {
      const m = t.messages[i];
      if (m?.role === "user" && typeof m.text === "string" && m.text.trim()) {
        return m.text.trim();
      }
    }
  } catch {}
  return "";
}



// ✅ NUEVO: control de sesión + silencios (evita “colgados” y timeouts huérfanos)
const micSessionIdRef = useRef<number>(0);
const silenceTimeoutRef = useRef<any>(null);
const micHadSpeechRef = useRef<boolean>(false);

function clearSilenceTimer() {
  try {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
  } catch {}
  silenceTimeoutRef.current = null;
}



useEffect(() => {
  if (typeof window === "undefined") return;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  setSpeechSupported(!!SR);
}, []);

function stopMic() {
  // ✅ marcamos stop “programático” para ignorar el onend que llega tarde
  micStoppingRef.current = true;

  // ✅ invalidar sesión para que callbacks viejos no toquen estado actual
  micSessionIdRef.current += 1;

  // ✅ limpiar silencio SIEMPRE (antes de tocar el motor)
  clearSilenceTimer();
  micHadSpeechRef.current = false;

  // ✅ limpiar buffers (evita que onend mande texto viejo)
  micBaseRef.current = "";
  micFinalRef.current = "";
  micInterimRef.current = "";
  micLastFinalIndexRef.current = -1;
  micFinalByIndexRef.current = {};

  try {
    const rec = recognitionRef.current;
    if (rec) {
      // evitar callbacks tardíos
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
      rec.onnomatch = null;

      // ✅ abort es más “duro” y evita estados colgados en Chrome Android
      try {
        rec.abort?.();
      } catch {}

      try {
        rec.stop?.();
      } catch {}
    }
  } catch {}

  recognitionRef.current = null;
  setIsListening(false);
  setListeningPurpose(null);

  // ✅ liberamos el flag un pelín después (por si entra un onend tardío)
  setTimeout(() => {
    micStoppingRef.current = false;
  }, 250);
}


async function startMic(purpose: MicPurpose) {
  if (isTyping) return;
  // ✅ Anti-eco: no arrancar escucha mientras acaba de hablar Vonu
if (purpose === "conversation" && inTtsCooldown()) {
  setTimeout(() => {
    if (!voiceModeRef.current) return;
    if (isTyping) return;
    if (inTtsCooldown()) return;
    if (recognitionRef.current) return;
    startMic("conversation");
  }, isDesktopPointer() ? 700 : 1100);
  return;
}


  const SR = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;
  if (!SR) {
    setMicMsg("Tu navegador no soporta dictado por voz. Prueba Chrome/Edge en Android o Desktop.");
    setTimeout(() => setMicMsg(null), 2400);
    return;
  }

  // si ya está escuchando, primero paramos (evita estados raros)
  if (isListening) {
    stopMic();
  }

  try {
    setMicMsg(null);

    // ✅ si el usuario empieza a hablar, cortamos TTS
    stopTTS();

    micPurposeRef.current = purpose;
setListeningPurpose(purpose);

    const rec = new SR();
    recognitionRef.current = rec;

    if (purpose === "conversation") {
  setMicMsg("Preparando micrófono…");
}

    rec.lang = "es-ES";
    rec.continuous = purpose === "conversation"; // ✅ conversación tolera pausas
rec.interimResults = true;
rec.maxAlternatives = 1;


    // base: para dictado conservamos lo que había escrito; en conversación empezamos “limpio”
    micFinalRef.current = "";
micInterimRef.current = "";
micLastFinalIndexRef.current = -1;
micFinalByIndexRef.current = {}; // ✅ reset del mapa
// ✅ Para dictado: conserva lo que había escrito antes de empezar a dictar
micBaseRef.current = purpose === "dictation" ? ((input ?? "").trim() ? (input.trim() + " ") : "") : "";
micLastFullRef.current = micBaseRef.current.trim();


// ✅ NUEVO: “sesión” del micro (evita eventos viejos tocando el estado actual)
micSessionIdRef.current += 1;
const mySessionId = micSessionIdRef.current;

// ✅ En PC cortamos antes (se siente más rápido). En móvil dejamos más margen.
const SILENCE_MS = isDesktopPointer() ? 1100 : 2300;

const armSilence = () => {
  if (purpose !== "conversation") return;

  clearSilenceTimer();

  silenceTimeoutRef.current = setTimeout(() => {
    // si la sesión cambió, ignorar
    if (micSessionIdRef.current !== mySessionId) return;

    // Si se apagó el modo conversación o cambió el rec actual, no hacemos nada
    if (!voiceModeRef.current) return;
    if (recognitionRef.current !== rec) return;

    // ✅ Si NO hubo voz real, NO forzamos stop (evita bucle en móvil)
    if (!micHadSpeechRef.current) return;

    try {
      rec.stop?.();
    } catch {}
  }, SILENCE_MS);
};



    rec.onstart = () => {
  // si es un evento viejo, ignorar
  if (micSessionIdRef.current !== mySessionId) return;

  setIsListening(true);
  micHadSpeechRef.current = false;
  if (purpose === "conversation") {
  beepReady();
  setMicMsg("🎙️ Tu turno");
  setTimeout(() => setMicMsg(null), 650);
}
  armSilence();
};




    rec.onerror = (ev: any) => {
  if (micSessionIdRef.current !== mySessionId) return;

  setIsListening(false);

  const code = String(ev?.error ?? "").toLowerCase();

  let msg = "No se pudo usar el micrófono. Revisa permisos del navegador.";
  if (code === "not-allowed" || code === "permission-denied") {
    msg = "Permiso denegado. Activa el micrófono en el navegador (icono del candado) y recarga.";
  } else if (code === "no-speech") {
    msg = "No te he escuchado. Prueba a hablar más cerca del micro o en un sitio más silencioso.";
  } else if (code === "audio-capture") {
    msg = "No se detecta micrófono. Revisa que esté conectado o permitido.";
  } else if (code === "network") {
    msg = "Error de red del reconocimiento de voz. Prueba de nuevo.";
  } else if (code) {
    msg = `Error del micrófono (${code}). Revisa permisos y prueba otra vez.`;
  }

  setMicMsg(msg);
  setTimeout(() => setMicMsg(null), 3200);

  stopMic();
};


    rec.onend = () => {
  // ✅ si es un evento viejo, ignorar (evita “dobles onend”)
  if (micSessionIdRef.current !== mySessionId) return;
  // ✅ si hemos parado nosotros el micro, ignorar este onend (móvil lo dispara tarde)
if (micStoppingRef.current) return;


  setIsListening(false);
  setListeningPurpose(null);
  recognitionRef.current = null;

  const combined = `${micFinalRef.current || ""} ${micInterimRef.current || ""}`.replace(/\s+/g, " ").trim();

let finalText = cleanRepeatedWords(combined);
finalText = dedupeGrowingTranscript("", finalText);

// ✅ ANDROID: si el motor devuelve “frase frase”, nos quedamos con la primera
function cutRepeatedSentence(text: string) {
  const t = (text || "").trim();
  if (!t) return t;

  // caso típico: el texto es literalmente el mismo 2 veces
  const half = Math.floor(t.length / 2);
  const first = t.slice(0, half).trim();
  const second = t.slice(half).trim();

  if (first && second && second.startsWith(first)) return first;

  // fallback: cortar repetición por palabras (último recurso)
  const words = t.split(/\s+/g);
  const midWords = Math.floor(words.length / 2);
  if (midWords >= 3) {
    const left = words.slice(0, midWords).join(" ");
    const right = words.slice(midWords).join(" ");
    if (right.toLowerCase().startsWith(left.toLowerCase())) return left;
  }

  return t;
}

finalText = cutRepeatedSentence(finalText);

micInterimRef.current = "";
clearSilenceTimer();

const purposeAtStart = purpose; // snapshot


    // ✅ conversación: enviar automático al chat escrito si hay texto
  if (purposeAtStart === "conversation" && voiceModeRef.current) {
    if (finalText) {
      const now = Date.now();
      const prev = lastMicSendRef.current;

      const curNorm = normalizeVoiceSendText(finalText);
      const prevNorm = normalizeVoiceSendText(prev.text);

      const WINDOW_MS = isDesktopPointer() ? 2500 : 4200;

      if (curNorm && prevNorm === curNorm && now - prev.ts < WINDOW_MS) {
        // duplicado reciente: ignorar
      } else if (!isTyping) {
        const threadId = activeThread?.id;
        const lastUser = threadId ? getLastUserTextInThread(threadId) : "";

        if (!isNearlySameVoice(finalText, lastUser)) {
          lastMicSendRef.current = { text: finalText, ts: now };
          handleVoiceMessageForChat(finalText);
        }
      }

      return;
    }

    // Si no hubo texto final, rearmamos escucha suave
    const waitMs = isDesktopPointer() ? 450 : 1200;

    setTimeout(() => {
  if (!voiceModeRef.current) return;
  if (isTyping) return;
  if (recognitionRef.current) return;
  if (micSessionIdRef.current !== mySessionId) return;
  startMic("conversation");
}, waitMs);
  }
};



    rec.onresult = (event: any) => {
  if (micSessionIdRef.current !== mySessionId) return;

  // ✅ Anti-eco: si Vonu acaba de hablar, ignoramos lo que “oye” el micro
  if (micPurposeRef.current === "conversation" && inTtsCooldown()) return;

  const results = event?.results ?? [];

  let finalText = "";
  let interimText = "";

  // ✅ Construimos transcript completo de forma estable (Android)
  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const txt = (res?.[0]?.transcript ?? "").trim();
    if (!txt) continue;

    if (res.isFinal) {
      finalText += txt + " ";
    } else {
      // en móvil el interim suele ser “el que crece”
      interimText = txt;
    }
  }

  const finalClean = finalText.replace(/\s+/g, " ").trim();
  const interimClean = interimText.replace(/\s+/g, " ").trim();


  micFinalRef.current = finalClean;
  micInterimRef.current = interimClean;

  if (finalClean || interimClean) {
    micHadSpeechRef.current = true;
    armSilence();
  }

  // ✅ Texto completo
  const rawFull =
    (micPurposeRef.current === "dictation" ? micBaseRef.current : "") +
    (finalClean ? finalClean + " " : "") +
    (interimClean ? interimClean : "");

  let full = rawFull.replace(/\s+/g, " ").trim();
  full = cleanRepeatedWords(full);

  // ✅ Clave: dedupe por crecimiento/solape
  full = dedupeGrowingTranscript(micLastFullRef.current, full);
  micLastFullRef.current = full;

  // ✅ dictado: usar SIEMPRE los “clean” (evita repeticiones por espacios / parciales)
let dictationText = `${finalClean}${interimClean ? " " + interimClean : ""}`.replace(/\s+/g, " ").trim();

// ✅ limpieza ligera (solo palabras consecutivas idénticas)
dictationText = cleanRepeatedWords(dictationText);

// ✅ dedupe por crecimiento (Android repite el inicio al ampliar)
dictationText = dedupeGrowingTranscript(micLastFullRef.current, dictationText);
micLastFullRef.current = dictationText;

if (micPurposeRef.current === "dictation") {
  setInput(dictationText);
}
};

    rec.start();
  } catch {
    setIsListening(false);
    setMicMsg("No se pudo iniciar el micrófono. Revisa permisos del navegador.");
    setTimeout(() => setMicMsg(null), 2600);
    stopMic();
  }
}

// ✅ Dictado = toggle (enciende/apaga) pero solo para escribir
function toggleMic() {
  if (isListening) {
    stopMic();
    return;
  }
  startMic("dictation");
}





  // ===== WHITEBOARD =====
  const [boardOpen, setBoardOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const [boardTool, setBoardTool] = useState<"pen" | "eraser">("pen");
  const BOARD_BG = "#0b0f0d"; // negro pizarra
  const [boardColor, setBoardColor] = useState<string>("#f8fafc"); // blanco tiza

  const [boardSize, setBoardSize] = useState<number>(6);
  const [boardMsg, setBoardMsg] = useState<string | null>(null);

  const isDrawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const hasInitRef = useRef(false);

  function getCtx() {
    const c = canvasRef.current;
    if (!c) return null;
    return c.getContext("2d");
  }

  function resetCanvasWhite() {
    const c = canvasRef.current;
    const ctx = getCtx();
    if (!c || !ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);

    // ✅ fondo negro pizarra
    ctx.fillStyle = BOARD_BG;
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.restore();
  }

  function pushHistory() {
    const c = canvasRef.current;
    const ctx = getCtx();
    if (!c || !ctx) return;

    try {
      const img = ctx.getImageData(0, 0, c.width, c.height);
      historyRef.current.push(img);
      if (historyRef.current.length > 30) historyRef.current.shift();
    } catch {}
  }

  function undoBoard() {
    const c = canvasRef.current;
    const ctx = getCtx();
    if (!c || !ctx) return;

    if (historyRef.current.length <= 1) {
      resetCanvasWhite();
      historyRef.current = [];
      pushHistory();
      return;
    }

    historyRef.current.pop();
    const prev = historyRef.current[historyRef.current.length - 1];
    if (!prev) return;

    try {
      ctx.putImageData(prev, 0, 0);
    } catch {}
  }

  function clearBoard() {
    resetCanvasWhite();
    historyRef.current = [];
    pushHistory();
  }

  function resizeBoardCanvas() {
    const c = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!c || !wrap) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));

    const nextW = Math.max(280, Math.floor(rect.width));
    const nextH = Math.max(320, Math.floor(rect.height));

    const ctx = getCtx();
    const prev = ctx
      ? (() => {
          try {
            return ctx.getImageData(0, 0, c.width, c.height);
          } catch {
            return null;
          }
        })()
      : null;

    c.width = Math.floor(nextW * dpr);
    c.height = Math.floor(nextH * dpr);
    c.style.width = `${nextW}px`;
    c.style.height = `${nextH}px`;

    const ctx2 = getCtx();
    if (!ctx2) return;

    ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2.lineCap = "round";
    ctx2.lineJoin = "round";

    if (!prev || !hasInitRef.current) {
      resetCanvasWhite();
      hasInitRef.current = true;
      historyRef.current = [];
      pushHistory();
      return;
    }

    try {
      const tmp = document.createElement("canvas");
      tmp.width = prev.width;
      tmp.height = prev.height;
      const tctx = tmp.getContext("2d");
      if (tctx) {
        tctx.putImageData(prev, 0, 0);
        ctx2.save();
        ctx2.fillStyle = BOARD_BG; // ✅ negro pizarra
        ctx2.fillRect(0, 0, nextW, nextH);
        ctx2.drawImage(tmp, 0, 0, nextW, nextH);
        ctx2.restore();
      }
    } catch {
      resetCanvasWhite();
    }

    historyRef.current = [];
    pushHistory();
  }

  const openBoard = useCallback(() => {
    setBoardMsg(null);
    setBoardOpen(true);
  }, []);

    function makeMdComponents(
  boardImageB64?: string | null,
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null,
  pizarraValue?: string | null
) {
  function extractPlainText(node: any): string {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractPlainText).join("");
    if (node && typeof node === "object" && "props" in node) {
      return extractPlainText((node as any).props?.children);
    }
    return "";
  }

  function looksLikeEquationLine(text: string) {
    const t = String(text ?? "").trim();
    if (!t) return false;
    if (t.length > 120) return false;

    // Si lleva encabezados o frases largas, no lo tratamos como ecuación
    if (/^#{1,6}\s/.test(t)) return false;
    if (/^[A-ZÁÉÍÓÚÑa-záéíóúñ]+\:$/.test(t)) return false;

    const hasOperator =
      t.includes("=") ||
      t.includes("≈") ||
      t.includes("≃") ||
      t.includes("≤") ||
      t.includes("≥") ||
      t.includes("<") ||
      t.includes(">");

    if (!hasOperator) return false;

    // Evita párrafos demasiado narrativos
    const words = t.split(/\s+/).length;
    if (words > 12 && !/[0-9xXyYa-zA-Z]/.test(t)) return false;

    return true;
  }

  function splitEquation(text: string) {
    const t = String(text ?? "").trim();

    const match = t.match(/^(.*?)(≈|≃|=|≤|≥|<|>)(.*)$/);
    if (!match) return null;

    return {
      left: match[1].trim(),
      op: match[2].trim(),
      right: match[3].trim(),
    };
  }

  function renderEquationLine(text: string) {
  const parts = splitEquation(text);
  if (!parts) return renderTextWithFractions(text);

  return (
  <div className="my-3 w-full overflow-visible py-[2px]">
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 w-full text-zinc-900 font-medium text-[1.04em] leading-[2.1]">
        <span className="min-w-0 break-words">{renderTextWithFractions(parts.left)}</span>
        <span className="font-semibold shrink-0">{parts.op}</span>
        <span className="min-w-0 break-words">{renderTextWithFractions(parts.right)}</span>
      </div>
    </div>
  );
}

  return {

  // ✅ Lista ordenada con contador “badge” (como tu captura)
      ol({ children, ...props }: any) {
    return (
      <ol
        className="my-3 pl-6 list-decimal space-y-2 text-zinc-900 marker:text-blue-700 marker:font-bold"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </ol>
    );
  },

      ul({ children, ...props }: any) {
    return (
      <ul className="my-3 space-y-2 text-zinc-900" {...props}>
        {renderChildrenWithFractions(children)}
      </ul>
    );
  },

      li({ children, ...props }: any) {
    return (
      <li className="leading-relaxed text-zinc-900" {...props}>
        {renderChildrenWithFractions(children)}
      </li>
    );
  },

    // ✅ Títulos y negritas más potentes
    h1({ children, ...props }: any) {
    return (
      <h1
        className="mt-4 mb-2 text-[24px] md:text-[28px] leading-tight font-extrabold tracking-tight text-zinc-900"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </h1>
    );
  },

  h2({ children, ...props }: any) {
    return (
      <h2
        className="mt-4 mb-2 text-[20px] md:text-[23px] leading-tight font-extrabold tracking-tight text-zinc-900"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </h2>
    );
  },

  h3({ children, ...props }: any) {
    return (
      <h3
        className="mt-3 mb-1.5 text-[17px] md:text-[19px] leading-snug font-bold text-zinc-900"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </h3>
    );
  },

        p({ children, ...props }: any) {
      const raw = extractPlainText(children).trim();

      const looksMathLine =
        /[=≈≃≤≥<>×÷]/.test(raw) || /[0-9]+\s*\/\s*[0-9]+/.test(raw);

      const isEquation = looksLikeEquationLine(raw);

      if (isEquation) {
        return (
          <div className="my-2 text-zinc-900" {...props}>
            {renderEquationLine(raw)}
          </div>
        );
      }

      return (
        <p
          className={
            looksMathLine
              ? "my-4 leading-8 text-zinc-900 font-medium"
              : "my-2 leading-7 text-zinc-900"
          }
          {...props}
        >
          {renderChildrenWithFractions(children)}
        </p>
      );
    },

  // ✅ Negritas más visibles
  strong({ children, ...props }: any) {
  return (
    <strong className="font-extrabold text-zinc-900" {...props}>
      {renderChildrenWithFractions(children)}
    </strong>
  );
},

  // ✅ Bloques de código
  code({ inline, className, children, ...props }: any) {
    const isInline = !!inline;

    const cn = typeof className === "string" ? className : "";
    const match = cn.match(/language-([a-zA-Z0-9_-]+)/);
    const lang = (match?.[1] || "").toLowerCase();

    const content = Array.isArray(children) ? children.join("") : String(children ?? "");
    const clean = content.replace(/\n$/, "");

    // ✅ PIZARRA: si viene ```pizarra``` o ```whiteboard``` => texto "cuaderno", NO código
    if (!isInline && (lang === "pizarra" || lang === "whiteboard")) {
      const boardValue = pizarraValue && String(pizarraValue).trim() ? String(pizarraValue) : clean;

      return (
        <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-zinc-900 font-sans">
          {boardValue}
        </div>
      );
    }

      // ✅ inline code: útil también para fórmulas cortas
  if (isInline) {
    const looksMathInline =
      /[=+\-×÷<>≈]/.test(clean) || /\d+\s*\/\s*\d+/.test(clean);

    return (
      <code
        className={
          looksMathInline
            ? "px-1.5 py-[2px] rounded-md bg-blue-50 border border-blue-200 text-[13px] font-semibold text-zinc-900"
            : "px-1 py-[1px] rounded bg-zinc-100 border border-zinc-200 text-[12.5px]"
        }
        style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui" }}
      >
        {clean}
      </code>
    );
  }

    // ✅ code block normal: SOLO para modo chat real (esto sí puede ser monospace)
    return (
      <pre className="rounded-xl bg-zinc-900 text-white p-3 overflow-x-auto">
        <code className="text-[12.5px]" {...props}>
          {clean}
        </code>
      </pre>
    );
  },

  // ✅ Por si el Markdown mete <pre> directo (dependiendo del parser)
    pre({ children }: any) {
    return <>{children}</>;
  },

  span({ className, children, ...props }: any) {
    const cn = typeof className === "string" ? className : "";
    const isKatexTree =
      cn.includes("katex") ||
      cn.includes("mord") ||
      cn.includes("mfrac") ||
      cn.includes("msupsub") ||
      cn.includes("sqrt") ||
      cn.includes("root") ||
      cn.includes("vlist") ||
      cn.includes("vlist-t") ||
      cn.includes("base") ||
      cn.includes("strut");

    // ✅ MUY IMPORTANTE:
    // si el span pertenece al árbol interno de KaTeX, NO lo tocamos
    if (isKatexTree) {
      return (
        <span className={className} {...props}>
          {children}
        </span>
      );
    }

    return (
      <span className={className} {...props}>
        {renderChildrenWithFractions(children)}
      </span>
    );
  },

  div({ className, children, ...props }: any) {
    const cn = typeof className === "string" ? className : "";

if (cn.includes("katex-display")) {
  return (
    <div
      className={`${className ?? ""} my-4 rounded-2xl bg-white/45 px-2 py-2 text-left`}
      style={{
        overflow: "visible",
        maxWidth: "100%",
        WebkitOverflowScrolling: "auto",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
} as any;
}


  function closeBoard() {
    setBoardOpen(false);
    setBoardMsg(null);
    isDrawingRef.current = false;
    lastPtRef.current = null;

    if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
  }

  useEffect(() => {
    if (!boardOpen) return;
    if (typeof window === "undefined") return;

    const t = setTimeout(() => {
      resizeBoardCanvas();
    }, 30);

    const onResize = () => resizeBoardCanvas();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [boardOpen]);

  function canvasPointFromEvent(e: any) {
    const c = canvasRef.current;
    if (!c) return null;
    const rect = c.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y };
  }

  function drawLine(a: { x: number; y: number }, b: { x: number; y: number }, pressure?: number) {
    const ctx = getCtx();
    if (!ctx) return;

    const p = typeof pressure === "number" ? Math.max(0.2, Math.min(1, pressure)) : 1;

    // ✅ tamaño más “chalk”
    const base = boardTool === "eraser" ? Math.max(14, boardSize * 2.2) : Math.max(3, boardSize);
    const size = base * p;

    ctx.save();

    // ✅ en pizarra negra: la goma pinta negro (NO destination-out)
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = boardTool === "eraser" ? BOARD_BG : boardColor;
    ctx.lineWidth = size;

    // ✅ efecto tiza (ligero glow + textura)
    if (boardTool !== "eraser") {
      ctx.globalAlpha = 0.92;
      ctx.shadowColor = "rgba(255,255,255,0.35)";
      ctx.shadowBlur = 1.6;
    } else {
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // ✅ “polvo de tiza” sutil (micro puntos)
    if (boardTool !== "eraser") {
      const dust = Math.max(1, Math.floor(size / 5));
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = boardColor;
      for (let i = 0; i < dust; i++) {
        const rx = b.x + (Math.random() - 0.5) * (size * 1.2);
        const ry = b.y + (Math.random() - 0.5) * (size * 1.2);
        ctx.fillRect(rx, ry, 1, 1);
      }
    }

    ctx.restore();
  }

  function onCanvasPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current;
    if (!c) return;

    e.preventDefault();
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);

    const pt = canvasPointFromEvent(e);
    if (!pt) return;

    isDrawingRef.current = true;
    lastPtRef.current = pt;

    drawLine(pt, { x: pt.x + 0.01, y: pt.y + 0.01 }, (e as any).pressure);
  }

  function onCanvasPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const pt = canvasPointFromEvent(e);
    const last = lastPtRef.current;
    if (!pt || !last) return;

    drawLine(last, pt, (e as any).pressure);
    lastPtRef.current = pt;
  }

  function endStroke() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPtRef.current = null;
    pushHistory();
  }

  function exportBoardToChat() {
    const c = canvasRef.current;
    if (!c) return;

    try {
      const dataUrl = c.toDataURL("image/png");
      setImagePreview(dataUrl);
      setBoardMsg("✅ Añadida al chat como imagen.");
      setTimeout(() => {
        setBoardOpen(false);
        setBoardMsg(null);
        if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
      }, 450);
    } catch {
      setBoardMsg("No se pudo exportar la pizarra.");
      setTimeout(() => setBoardMsg(null), 1800);
    }
  }

  // VisualViewport (altura visible + inset inferior cuando aparece teclado)
useEffect(() => {
  if (typeof window === "undefined") return;
  const vv = window.visualViewport;
  if (!vv) return;

  const setVars = () => {
    // altura visible real
    document.documentElement.style.setProperty("--vvh", `${vv.height}px`);

    // cuánto “tapa” el teclado (inset inferior)
    const bottomInset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty("--vvb", `${bottomInset}px`);
  };

  setVars();
  vv.addEventListener("resize", setVars);
  vv.addEventListener("scroll", setVars);

  window.addEventListener("resize", setVars);
  window.addEventListener("orientationchange", setVars);

  return () => {
    vv.removeEventListener("resize", setVars);
    vv.removeEventListener("scroll", setVars);
    window.removeEventListener("resize", setVars);
    window.removeEventListener("orientationchange", setVars);
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

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
  }, [activeThreadId]);

  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) ?? threads[0];
  }, [threads, activeThreadId]);

  const messages = activeThread?.messages ?? [];

  const showSoftLimitWarning =
  !!usageInfo &&
  usageInfo.messages_left > 0 &&
  usageInfo.messages_left <= 5;

const showHardLimitWarning =
  !!usageInfo &&
  usageInfo.messages_left <= 0;

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [threads]);

  const userMsgCountInThread = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);

  const canSend = useMemo(() => {
  const basicReady = !isTyping && (!!input.trim() || !!imagePreview);
  if (isBlockedByPaywall) return false;
  return basicReady;
}, [isTyping, input, imagePreview, isBlockedByPaywall]);

const voiceUiState = useMemo<"idle" | "listening" | "speaking">(() => {
  if (!voiceMode) return "idle";
  if (realtimeStatus === "listening") return "listening";
  if (realtimeStatus === "speaking" || realtimeStatus === "connecting" || realtimeStatus === "connected") {
    return "speaking";
  }
  return "idle";
}, [voiceMode, realtimeStatus]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

const quickPrompts = useMemo(
  () => [
    { label: "Hacer deberes", mode: "tutor" as ThreadMode, text: "Tengo este ejercicio. Explícamelo paso a paso como profe:" },
    { label: "Analizar web", mode: "chat" as ThreadMode, text: "¿Esta web/enlace es fiable? Te lo paso:" },

    { label: "Estudiar", mode: "tutor" as ThreadMode, text: "Quiero estudiar esto. Explícamelo paso a paso:" },
    { label: "Revisar contrato", mode: "chat" as ThreadMode, text: "¿Me ayudas a revisar este contrato/cláusula? Te lo pego:" },

    { label: "Identificar posible estafa", mode: "chat" as ThreadMode, text: "Me han enviado este mensaje y no sé si es estafa. Te lo pego:" },
    { label: "Resumir audio", mode: "chat" as ThreadMode, text: "Voy a pegar la transcripción de un audio o nota de voz. Resúmelo claro y dime lo importante:" },
  ],
  []
);



// ✅ FIX: en pantalla inicial (sin mensajes del usuario) evitamos el auto-scroll “raro”
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  if (!hasUserMessage) {
    shouldStickToBottomRef.current = false;
    // forzamos arriba sin animación
    requestAnimationFrame(() => {
      el.scrollTo({ top: 0, behavior: "auto" });
    });
  }
}, [hasUserMessage]);

useEffect(() => {
  // intencionadamente vacío
  // No movemos el chat automáticamente cuando cambian los mensajes.
  // El scroll solo se recoloca cuando el usuario envía un mensaje.
}, [messages]);

function applyQuickPrompt(p: { label: string; mode: ThreadMode; text: string }) {
  // ✅ Envío inmediato: al mandar el primer mensaje, desaparece la pantalla inicial automáticamente
  sendQuickMessage(p.text, p.mode);
}


  // textarea autoresize (robusto)
useEffect(() => {
  const el = textareaRef.current;
  if (!el) return;

  const raf = requestAnimationFrame(() => {
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 220); // puedes subir a 260 si quieres
    el.style.height = next + "px";
    setInputExpanded(next > 60);
  });

  return () => cancelAnimationFrame(raf);
}, [input, imagePreview, isTyping]);


  function handleChatScroll() {
  // Lo dejamos vacío a propósito.
  // Más adelante, si quieres, montamos un autoseguimiento fino.
}

// ✅ Nuevo comportamiento:
// Solo recolocamos el chat cuando el usuario envía un mensaje.
// Mientras Vonu responde, NO perseguimos el final.
// Así evitamos el "bote" y dejamos que la respuesta crezca hacia abajo.
useEffect(() => {
  // intencionadamente vacío:
  // eliminamos el auto-scroll reactivo por cambios de mensajes/isTyping
}, [messages, isTyping]);

  // Autofocus (solo chat, solo escritorio)
  useEffect(() => {
    if (!mounted) return;
    if (renameOpen) return;
    if (menuOpen) return;
    if (isTyping) return;
    if (loginOpen) return;
    if (paywallOpen) return;
    if (boardOpen) return;
    if (!isDesktopPointer()) return;

    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);

    return () => clearTimeout(t);
  }, [mounted, renameOpen, menuOpen, isTyping, activeThreadId, loginOpen, paywallOpen, boardOpen]);

  async function onSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Limpiar input file para poder volver a elegir el mismo archivo
    e.target.value = "";

    // Solo imágenes
    if (!file.type.startsWith("image/")) {
      setMicMsg("Ese archivo no es una imagen.");
      setTimeout(() => setMicMsg(null), 2200);
      return;
    }

    // ✅ Comprimir: máx 1400px lado largo, JPEG calidad 0.82
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
      reader.readAsDataURL(file);
    });

    const img = document.createElement("img");
    img.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    });

    const MAX = 1400;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const scale = Math.min(1, MAX / Math.max(w, h));
    const nw = Math.max(1, Math.round(w * scale));
    const nh = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible.");

    ctx.drawImage(img, 0, 0, nw, nh);

    // JPEG reduce muchísimo tamaño (sobre todo fotos de móvil)
    const compressed = canvas.toDataURL("image/jpeg", 0.82);

    setImagePreview(compressed);
  } catch (err: any) {
    setMicMsg(err?.message || "No se pudo adjuntar la imagen.");
    setTimeout(() => setMicMsg(null), 2400);
  }
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
      const isFresh = (thread?.messages ?? []).filter((m) => m.role === "user").length === 0;

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
    setMenuOpen(false);
  }

  function confirmRename() {
    if (!activeThread) return;
    const name = renameValue.trim() || "Consulta";
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? { ...t, title: name, updatedAt: Date.now() } : t)));
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

  // ✅ regla: tras 2 mensajes, bloquear el siguiente y pedir login/pago
  function enforceLimitIfNeeded(): boolean {
  const nextUserCount = userMsgCountInThread + 1;

  // ✅ Invitado: solo 1 mensaje de prueba
  if (!isLoggedIn) {
    if (nextUserCount <= GUEST_MESSAGE_LIMIT) return false;

    setLoginMsg("Puedes probar Vonu con 1 mensaje. Para seguir, inicia sesión.");
    openLoginModal("signin");
    return true;
  }

  // ✅ Usuario loggeado: el límite real lo controla Supabase / analyze.ts
  return false;
}

  async function sendQuickMessage(textPreset: string, modePreset: ThreadMode) {

  if (authLoading) return;

    if (enforceLimitIfNeeded()) return;

    if (isBlockedByPaywall) {
      openPlansModal();
      return;
    }

    if (isTyping) return;
    if (!activeThread) return;

        // ✅ SEND LOCK (anti doble click / doble onend)
    if (sendGuardRef.current.busy) return;
    sendGuardRef.current.busy = true;

    const targetThreadId = activeThread.id;
    activeThreadIdRef.current = targetThreadId;

    const userText = (textPreset || "").trim();
    if (!userText) {
      sendGuardRef.current.busy = false;
      return;
    }

    // ✅ ANTI-DUPLICADO por texto en el mismo thread
    if (shouldBlockDuplicateSend(targetThreadId, userText)) {
      sendGuardRef.current.busy = false;
      return;
    }


    // ✅ Si el usuario escribe o lanza un quick prompt, salimos del modo conversación
if (voiceModeRef.current) {
  stopConversationModeBeforeTypedSend();
}


    // ✅ Guardamos modo en el thread (así el backend recibe el modo correcto)
    setThreads((prev) =>
      prev.map((t) =>
        t.id === targetThreadId
          ? {
              ...t,
              updatedAt: Date.now(),
              mode: modePreset,
              tutorProfile: t.tutorProfile ?? { level: "adult" },
            }
          : t
      )
    );

    const userMsg: Message = {
  id: crypto.randomUUID(),
  role: "user",
  text: userText,
};

// ✅ Si el modo conversación está activo, añadimos solo el mensaje del usuario
// ✅ y dejamos que la respuesta la genere exclusivamente realtime
if (voiceModeRef.current) {
  shouldStickToBottomRef.current = true;

  setThreads((prev) =>
    prev.map((t) => {
      if (t.id !== targetThreadId) return t;
      return {
        ...t,
        updatedAt: Date.now(),
        messages: [...t.messages, userMsg],
      };
    })
  );

  sendTextToRealtime(userText);
  sendGuardRef.current.busy = false;
  return;
}

const assistantId = crypto.randomUUID();
const assistantMsg: Message = {
  id: assistantId,
  role: "assistant",
  text: "",
  streaming: true,
  pizarra: null,
  boardImageB64: null,
  boardImagePlacement: null,
};

    setThreads((prev) =>
  prev.map((t) => {
    if (t.id !== targetThreadId) return t;
    return {
      ...t,
      updatedAt: Date.now(),
      messages: [...t.messages, userMsg],
    };
  })
);

pinUserMessageNearTop(userMsg.id);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetThreadId) return t;

        const alreadyExists = t.messages.some((m) => m.id === assistantId);
        if (alreadyExists) return t;

        return {
          ...t,
          updatedAt: Date.now(),
          messages: [...t.messages, assistantMsg],
        };
      })
    );
  });
});

    setInput(""); // por si había algo escrito
setImagePreview(null);
setIsTyping(true);

if (!isDesktopPointer()) {
  textareaRef.current?.blur();
}

    try {
      await sleep(200);

      // ⚠️ Importante: usamos el estado "prev" más fiable: leemos del localStorage state actual
      const threadNow = (threadsRef.current.find((x) => x.id === targetThreadId) ?? activeThread) as ChatThread;

      const convoForApi = [...(threadNow?.messages ?? []), userMsg]
        .filter((m) => (m.role === "user" || m.role === "assistant") && (m.text || m.image))
        .map((m) => ({
          role: m.role,
          content: m.text ?? "",
        }));

      const { data: sessionData } = await supabaseBrowser.auth.getSession();
const accessToken = sessionData?.session?.access_token ?? null;

const res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  },
  cache: "no-store",
  body: JSON.stringify({
    messages: convoForApi,
    userText,
    imageBase64: null,
    mode: modePreset,
    tutorLevel: threadNow?.tutorProfile?.level ?? "adult",
  }),
});

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
      }

      const data = await res.json().catch(() => ({} as any));

      if (data?.usage) {
  setUsageInfo(data.usage);
}

      const fullText =
        typeof data?.text === "string" && data.text.trim()
          ? data.text
          : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

      const boardImageB64 = typeof data?.boardImageB64 === "string" && data.boardImageB64 ? data.boardImageB64 : null;

      const boardImagePlacement =
        data?.boardImagePlacement &&
        typeof data.boardImagePlacement?.x === "number" &&
        typeof data.boardImagePlacement?.y === "number" &&
        typeof data.boardImagePlacement?.w === "number" &&
        typeof data.boardImagePlacement?.h === "number"
          ? (data.boardImagePlacement as { x: number; y: number; w: number; h: number })
          : null;

      const pizarraJson = typeof data?.pizarra === "string" && data.pizarra.trim() ? data.pizarra : null;

      await sleep(90);

      const isTutor = modePreset === "tutor";

      if (isTutor) {
        await sleep(220);

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== targetThreadId) return t;
            return {
              ...t,
              updatedAt: Date.now(),
              messages: t.messages.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      text: fullText,
                      streaming: false,
                      pizarra: pizarraJson,
                      boardImageB64,
                      boardImagePlacement,
                    }
                  : m
              ),
            };
          })
        );

        setIsTyping(false);
        sendGuardRef.current.busy = false;

// ✅ Solo usamos la voz del navegador fuera del modo conversación
if (!voiceModeRef.current) {
  speakTTS(fullText);
}

if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);

      } else {
  const { thinkMs, revealMs } = getAdaptiveRevealTimings(fullText);
  const chunks = splitTextForProgressiveReveal(fullText);

  await sleep(thinkMs);

  let built = "";

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    built = built ? `${built}\n\n${chunk}` : chunk;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetThreadId) return t;
        return {
          ...t,
          updatedAt: Date.now(),
          messages: t.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: built,
                  streaming: i < chunks.length - 1,
                  pizarra: pizarraJson,
                  boardImageB64,
                  boardImagePlacement,
                  revealMs,
                }
              : m
          ),
        };
      })
    );

    if (i < chunks.length - 1) {
      await sleep(getProgressiveChunkDelay(i + 1, chunks.length));
    }
  }

  setThreads((prev) =>
    prev.map((t) => {
      if (t.id !== targetThreadId) return t;
      return {
        ...t,
        updatedAt: Date.now(),
        messages: t.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: built,
                streaming: false,
                pizarra: pizarraJson,
                boardImageB64,
                boardImagePlacement,
                revealMs,
              }
            : m
        ),
      };
    })
  );

  setIsTyping(false);
  sendGuardRef.current.busy = false;

  if (!voiceModeRef.current) {
    speakTTS(fullText);
  }

  if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
}
    } catch (err: any) {
      const msg = typeof err?.message === "string" ? err.message : "Error desconocido conectando con la IA.";

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== targetThreadId) return t;
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
      sendGuardRef.current.busy = false;
      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }

  async function sendMessage() {
  if (authLoading) return;

    if (enforceLimitIfNeeded()) return;

    if (isBlockedByPaywall) {
      openPlansModal();
      return;
    }

    if (!canSend) return;
if (!activeThread) return;

// ✅ SEND LOCK (anti doble click / Enter repetido / carreras)
if (sendGuardRef.current.busy) return;
sendGuardRef.current.busy = true;

const targetThreadId = activeThread.id;
activeThreadIdRef.current = targetThreadId;

// ✅ ANTI-DUPLICADO por texto en el mismo thread
const previewText = (input || "").trim();
if (previewText && shouldBlockDuplicateSend(targetThreadId, previewText)) {
  sendGuardRef.current.busy = false;
  return;
}


    const userText = input.trim();
    const imageBase64 = imagePreview;

        setUiError(null);

// ===== Tutor auto-activación (DESACTIVADA) =====
const threadModeNow: ThreadMode = activeThread.mode ?? "chat";
let nextMode: ThreadMode = threadModeNow;

let nextTutorLevel: TutorLevel = activeThread.tutorProfile?.level ?? "adult";

// ✅ Ya NO forzamos modo tutor por intención.
// El modo lo decide el usuario (UI) y se guarda en el thread.
// nextMode y nextTutorLevel quedan como están.



    const userMsg: Message = {
  id: crypto.randomUUID(),
  role: "user",
  text: userText || (imageBase64 ? "He adjuntado una imagen." : undefined),
  image: imageBase64 || undefined,
};

// ✅ Si el modo conversación está activo, añadimos solo el mensaje del usuario
// ✅ y la respuesta la hará exclusivamente realtime

const assistantId = crypto.randomUUID();
const assistantMsg: Message = {
  id: assistantId,
  role: "assistant",
  text: "",
  streaming: true,
  pizarra: null,
  boardImageB64: null,
  boardImagePlacement: null,
};

    setThreads((prev) =>
  prev.map((t) => {
    if (t.id !== targetThreadId) return t;

    return {
      ...t,
      updatedAt: Date.now(),
      messages: [...t.messages, userMsg],
    };
  })
);

pinUserMessageNearTop(userMsg.id);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetThreadId) return t;

        const alreadyExists = t.messages.some((m) => m.id === assistantId);
        if (alreadyExists) return t;

        return {
          ...t,
          updatedAt: Date.now(),
          messages: [...t.messages, assistantMsg],
        };
      })
    );
  });
});

    setInput("");
setImagePreview(null);
setIsTyping(true);

if (!isDesktopPointer()) {
  textareaRef.current?.blur();
}

    try {
      await sleep(220);

      const threadNow = threadsRef.current.find((x) => x.id === targetThreadId) ?? activeThread;

      const convoForApi = [...(threadNow?.messages ?? []), userMsg]
        .filter((m) => (m.role === "user" || m.role === "assistant") && (m.text || m.image))
        .map((m) => ({
          role: m.role,
          content: m.text ?? "",
        }));

      const { data: sessionData } = await supabaseBrowser.auth.getSession();
const accessToken = sessionData?.session?.access_token ?? null;

const res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  },
  cache: "no-store",
  body: JSON.stringify({
    messages: convoForApi,
    userText,
    imageBase64,
    mode: nextMode,
    tutorLevel: nextTutorLevel,
  }),
});

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
      }

      const data = await res.json().catch(() => ({} as any));

      if (data?.usage) {
  setUsageInfo(data.usage);
}

      const fullText =
        typeof data?.text === "string" && data.text.trim()
          ? data.text
          : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

      // ✅ NUEVO: imagen de pizarra (si viene)
      const boardImageB64 = typeof data?.boardImageB64 === "string" && data.boardImageB64 ? data.boardImageB64 : null;

      const boardImagePlacement =
        data?.boardImagePlacement &&
        typeof data.boardImagePlacement?.x === "number" &&
        typeof data.boardImagePlacement?.y === "number" &&
        typeof data.boardImagePlacement?.w === "number" &&
        typeof data.boardImagePlacement?.h === "number"
          ? (data.boardImagePlacement as { x: number; y: number; w: number; h: number })
          : null;

      // ✅ NUEVO: JSON de pizarra (si viene)
      const pizarraJson = typeof data?.pizarra === "string" && data.pizarra.trim() ? data.pizarra : null;

      await sleep(90);

      const isTutor = nextMode === "tutor";

      if (isTutor) {
        // ✅ Tutor: estable (no streaming letra a letra). Mostramos dots y luego el bloque completo.
        await sleep(220);

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== targetThreadId) return t;
            return {
              ...t,
              updatedAt: Date.now(),
              messages: t.messages.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      text: fullText,
                      streaming: false,
                      pizarra: pizarraJson,
                      boardImageB64,
                      boardImagePlacement,
                    }
                  : m
              ),
            };
          })
        );

        setIsTyping(false);
sendGuardRef.current.busy = false;

if (!voiceModeRef.current) {
  speakTTS(fullText);
}

if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
      } else {
  const { thinkMs, revealMs } = getAdaptiveRevealTimings(fullText);
  const chunks = splitTextForProgressiveReveal(fullText);

  await sleep(thinkMs);

  let built = "";

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    built = built ? `${built}\n\n${chunk}` : chunk;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetThreadId) return t;
        return {
          ...t,
          updatedAt: Date.now(),
          messages: t.messages.map((m) =>
  m.id === assistantId
    ? {
        ...m,
        text: built,
        streaming: false,
        pizarra: pizarraJson,
        boardImageB64,
        boardImagePlacement,
        revealMs,
      }
    : m
),
        };
      })
    );

    if (i < chunks.length - 1) {
      await sleep(getProgressiveChunkDelay(i + 1, chunks.length));
    }
  }

  setThreads((prev) =>
    prev.map((t) => {
      if (t.id !== targetThreadId) return t;
      return {
        ...t,
        updatedAt: Date.now(),
        messages: t.messages.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: built,
                streaming: false,
                pizarra: pizarraJson,
                boardImageB64,
                boardImagePlacement,
                revealMs,
              }
            : m
        ),
      };
    })
  );

  setIsTyping(false);
  sendGuardRef.current.busy = false;

  if (!voiceModeRef.current) {
    speakTTS(fullText);
  }

  if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
}
    } catch (err: any) {
      const msg = typeof err?.message === "string" ? err.message : "Error desconocido conectando con la IA.";

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== targetThreadId) return t;
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
      sendGuardRef.current.busy = false;
      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }


  // ✅ padding dinámico según la altura REAL del input bar (evita que se “corte” en PC)
const lastMsg = messages[messages.length - 1];
const isLastFromAssistant = lastMsg?.role === "assistant";
const isLastFromUser = lastMsg?.role === "user";

const chatBottomPad = hasUserMessage
  ? inputBarH + (
      isLastFromAssistant
        ? (isDesktopPointer() ? 260 : 140)
        : isLastFromUser
        ? (isDesktopPointer() ? 180 : 260) // ← MUY IMPORTANTE para móvil
        : 120
    )
  : 18;

  const TOP_OFFSET_PX = 12;
  const TOP_BUBBLE_H = 44;
  const TOP_GAP_PX = 10;
  const SIDEBAR_TOP = TOP_OFFSET_PX + TOP_BUBBLE_H + TOP_GAP_PX;

  const planLabel = !isLoggedIn ? "Sin sesión" : isPro ? PLUS_NODE : "Gratis";
  const planLabelText = !isLoggedIn ? "Sin sesión" : isPro ? PLUS_TEXT : "Gratis";

  const payTitleNode = (
    <span className="inline-flex items-center gap-1">
      Vonu {PLUS_NODE}
    </span>
  );

  // ✅ UI estado botones top-right (plan + cuenta)
  const currentPlanId = usageInfo?.plan_id ?? null;

const topPlanLabel =
  authLoading
    ? "…"
    : currentPlanId === "plus"
    ? "Plus"
    : currentPlanId === "max"
    ? "Max"
    : "Mejorar";

  const userInitial = (() => {
    const base = (authUserName ?? authUserEmail ?? "").trim();
    if (!base) return "U";
    return base.charAt(0).toUpperCase();
  })();

  // === PRICING COPY ===
  const PRICE_MONTH = "4,99€";
  const PRICE_YEAR = "39,99€";
  const PRICE_YEAR_PER_MONTH = "3,33€";
  const YEAR_SAVE_BADGE = "Ahorra 33%";
  const BEST_VALUE_BADGE = "Mejor valor";

  function closePaywall() {
    if (payLoading) return;
    setPaywallOpen(false);
    setPayMsg(null);
  }

  // ESC para cerrar paywall / board / rename
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (paywallOpen) closePaywall();
        if (boardOpen) closeBoard();
        if (renameOpen) setRenameOpen(false);
      }
      if (renameOpen && e.key === "Enter") {
        confirmRename();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paywallOpen, payLoading, boardOpen, renameOpen, renameValue, activeThreadId]);

  function Frac({ n, d }: { n: string; d: string }) {
  return (
    <span className="inline-flex flex-col items-center align-middle mx-1 my-[6px]">
      <span className="text-[0.9em] leading-tight mb-[2px]">{n}</span>

<span className="h-[1.5px] w-[1.6em] bg-current opacity-90 my-[3px]" />

<span className="text-[0.9em] leading-tight mt-[2px]">{d}</span>
    </span>
  );
}


  // ✅ PIQUITO WhatsApp PERFECTO
// - Triángulo rectángulo
// - Lado largo continúa el borde superior
// - SOLO la punta exterior suavizada
function BubbleTail({ side, color }: { side: "left" | "right"; color: string }) {
  const isRight = side === "right";

  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className={[
        "absolute pointer-events-none",
        "top-0",
        isRight ? "right-[-13px]" : "left-[-13px]",
        "z-0",
      ].join(" ")}
    >
      {isRight ? (
        // 👉 derecha (usuario) — redondeamos la punta EXTERIOR (14,0)
        <path
          d="
            M0 0
            L12.0 0
            Q14 0 14 2.0
            L0 14
            Z
          "
          fill={color}
        />
      ) : (
        // 👉 izquierda (Vonu) — redondeamos la punta EXTERIOR (0,0)
        <path
          d="
            M14 0
            L2.0 0
            Q0 0 0 2.0
            L14 14
            Z
          "
          fill={color}
        />
      )}
    </svg>
  );
}

function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!canSend) return;
    sendMessage();
  }
}

return (
    <div className="bg-[#f8f9fa] flex overflow-hidden" style={{ height: "calc(var(--vvh, 100dvh))" }}>
      <style jsx global>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @keyframes vonuRevealIn {
  0% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
    filter: blur(0);
  }
}

.vonu-reveal {
  animation: vonuRevealIn var(--vonu-reveal-ms, 520ms) ease-out both;
  will-change: opacity, clip-path, filter;
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn span {
  transform: translateY(-0.5px);
}

  @keyframes chalkIn {
    from {
      opacity: 0;
      transform: translateY(2px);
      filter: blur(0.4px);
    }
    to {
      opacity: 0.92;
      transform: translateY(0px);
      filter: blur(0px);
    }
  }

  @keyframes voicePulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.28);
    }
    70% {
      transform: scale(1.045);
      box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }

  /* Quitar azul de enlaces dentro del chat */
.prose a {
  color: #18181b !important;
  text-decoration: none !important;
}

/* Quitar numeración automática de listas */
.prose ol {
  list-style: none !important;
  padding-left: 0 !important;
}

.prose li::marker {
  content: "" !important;
}

  /* ===== KaTeX bonito y controlado ===== */
.prose .katex {
  font-size: 1.08em !important;
  line-height: 1.25 !important;
}

  .prose .katex-display {
  display: block;
  margin: 0.9rem 0 !important;
  text-align: left !important;
  overflow: visible !important;
  padding: 0.1rem 0;
  max-width: 100%;
}

.prose .katex-display > .katex {
  display: block;
  width: 100%;
  max-width: 100%;
  font-size: 1.05em !important;
  line-height: 1.15 !important;
  white-space: normal !important;
  word-break: break-word;
}

  /* Ajusta mejor raíces, fracciones y operadores altos */
  .prose .katex .sqrt > .root {
    margin-right: 0.12em !important;
  }

  .prose .katex .mfrac .frac-line {
    border-bottom-width: 0.06em !important;
  }

  .prose .katex .mord,
  .prose .katex .mop,
  .prose .katex .mbin,
  .prose .katex .mrel,
  .prose .katex .mopen,
  .prose .katex .mclose,
  .prose .katex .mpunct {
    vertical-align: middle;
  }

/* En móvil: matemáticas más legibles */
@media (max-width: 768px) {
  .prose .katex {
    font-size: 0.95em !important;
    line-height: 1.12 !important;
  }

  .prose .katex-display {
    margin: 0.6rem 0 !important;
    text-align: left !important;
    overflow: visible !important;
    padding: 0 !important;
  }

  .prose .katex-display > .katex {
    font-size: 0.98em !important;
    line-height: 1.1 !important;
    white-space: normal !important;
  }
}

@keyframes vonuDotsBuild {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  70% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes vonuDotsPulse {
  0%, 100% {
    transform: scale(0.96);
    opacity: 0.92;
  }
  50% {
    transform: scale(1.03);
    opacity: 1;
  }
}

.vonu-dotmark-wrap {
  animation: vonuDotsPulse 1.6s ease-in-out infinite;
}

.vonu-dotmark-base,
.vonu-dotmark-fill {
  -webkit-mask: url("/logo/vonu-cube-black.png?v=1") center / contain no-repeat;
  mask: url("/logo/vonu-cube-black.png?v=1") center / contain no-repeat;
}

.vonu-dotmark-base {
  background-image: radial-gradient(circle, #cfd4dc 1.05px, transparent 1.15px);
  background-size: 5.5px 5.5px;
  background-position: center;
  opacity: 1;
}

.vonu-dotmark-fill {
  background-image: radial-gradient(circle, #111111 1.05px, transparent 1.15px);
  background-size: 5.5px 5.5px;
  background-position: center;
  animation: vonuDotsBuild 1.35s steps(8, end) infinite;
}

.assistant-md h1,
.assistant-md h2,
.assistant-md h3,
.assistant-md h4 {
  margin-top: 0 !important;
}


.paywall-scroll::-webkit-scrollbar {
  display: none;
}
`}</style>

      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] px-3">
          <div className="rounded-full border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm px-4 py-2 text-xs text-zinc-800">{toastMsg}</div>
        </div>
      )}

      {/* ===== RENAME MODAL ===== */}
      {renameOpen && (
        <div className="fixed inset-0 z-[85] bg-black/25 backdrop-blur-sm flex items-center justify-center px-6" onClick={() => setRenameOpen(false)}>
          <div
            className="w-full max-w-[420px] rounded-[20px] bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.18)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[16px] font-semibold text-zinc-900">Renombrar conversación</div>
                <div className="text-[12.5px] text-zinc-500 mt-1">Ponle un nombre para encontrarla rápido.</div>
              </div>

              <button
                onClick={() => setRenameOpen(false)}
                className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                aria-label="Cerrar"
              >
                <span className="text-[18px] leading-none relative top-[-0.5px]">×</span>
              </button>
            </div>

            <div className="mt-4">
              <div className="text-[12px] text-zinc-600 mb-1">Nombre</div>
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                placeholder="Ej: Estafa Wallapop, Inglés vocabulario…"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") setRenameOpen(false);
                  if (e.key === "Enter") confirmRename();
                }}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRenameOpen(false)}
                className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button onClick={confirmRename} className="flex-1 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== WHITEBOARD ===== */}
      {boardOpen && (
        <div className="fixed inset-0 z-[75]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeBoard} aria-hidden="true" />

          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-full w-full max-w-4xl px-3 md:px-6">
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 h-10 max-w-full">
                  <div className="hidden sm:block text-[11px] text-zinc-600">Grosor</div>
                  <input
                    type="range"
                    min={2}
                    max={18}
                    value={boardSize}
                    onChange={(e) => setBoardSize(parseInt(e.target.value || "6", 10))}
                    className="w-[86px] sm:w-[120px] md:w-[140px]"
                  />
                </div>

                <button
                  onClick={closeBoard}
                  className={[
                    "h-11 w-11 aspect-square rounded-full",
                    "bg-white/90 backdrop-blur-xl border border-zinc-200",
                    "hover:bg-white transition-colors",
                    "grid place-items-center",
                    "cursor-pointer disabled:opacity-50 shadow-sm",
                    "p-0",
                  ].join(" ")}
                  aria-label="Cerrar pizarra"
                  title="Cerrar"
                >
                  <span className="text-zinc-700 text-[20px] leading-none relative top-[-0.5px]">×</span>
                </button>
              </div>

              <div
                className="mt-4 rounded-[28px] border border-zinc-200 bg-white/90 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.14)] overflow-hidden"
                style={{ height: "calc(var(--vvh, 100dvh) - 92px)" }}
              >
                <div className="h-full flex flex-col p-3 md:p-4">
                  {/* Toolbar */}
                  <div className="rounded-[22px] border border-zinc-200 bg-white p-3">
                    <div className="flex items-center gap-2 justify-between md:flex-nowrap flex-wrap">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <button
                          onClick={() => setBoardTool("pen")}
                          className={[
                            "h-10 px-4 rounded-full text-[12px] font-semibold border transition-colors",
                            boardTool === "pen" ? "bg-blue-600 text-white border-blue-700/10" : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50",
                          ].join(" ")}
                        >
                          Lápiz
                        </button>

                        <button
                          onClick={() => setBoardTool("eraser")}
                          className={[
                            "h-10 px-4 rounded-full text-[12px] font-semibold border transition-colors",
                            boardTool === "eraser" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50",
                          ].join(" ")}
                        >
                          Goma
                        </button>

                        <button
                          onClick={undoBoard}
                          className="h-10 px-4 rounded-full text-[12px] font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
                          title="Deshacer"
                        >
                          Deshacer
                        </button>

                        <button
                          onClick={clearBoard}
                          className="h-10 px-4 rounded-full text-[12px] font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
                          title="Borrar todo"
                        >
                          Borrar
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Colores */}
                        <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 h-10">
                          {["#f8fafc", "#fde047", "#60a5fa", "#fb7185", "#4ade80"].map((c) => (
                            <button
                              key={c}
                              onClick={() => {
                                setBoardTool("pen");
                                setBoardColor(c);
                              }}
                              className={["h-7 w-7 rounded-full border grid place-items-center p-0", boardColor === c && boardTool === "pen" ? "border-zinc-900" : "border-zinc-200"].join(" ")}
                              style={{ backgroundColor: c }}
                              aria-label={`Color ${c}`}
                              title="Color"
                            />
                          ))}
                        </div>

                        {/* Grosor */}
                        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 sm:px-3 h-10">
                          <div className="text-[11px] text-zinc-600">Grosor</div>
                          <input
                            type="range"
                            min={2}
                            max={18}
                            value={boardSize}
                            onChange={(e) => setBoardSize(parseInt(e.target.value || "6", 10))}
                            className="w-[92px] sm:w-[120px]"
                          />
                        </div>

                        {/* Desktop: Enviar al chat aquí */}
                        <button
                          onClick={exportBoardToChat}
                          className="hidden md:inline-flex h-10 px-5 rounded-full text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors items-center justify-center"
                        >
                          Enviar al chat
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-3 min-h-0 md:min-h-[28px]">
                    {boardMsg ? (
                      <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-700">{boardMsg}</div>
                    ) : (
                      <div className="opacity-0 select-none text-[12px] px-3 py-2">placeholder</div>
                    )}
                  </div>

                  {/* Canvas */}
                  <div className="mt-2 flex-1 min-h-0">
                    <div
                      ref={canvasWrapRef}
                      className="h-full w-full rounded-[22px] border border-zinc-200 overflow-hidden"
                      style={{
                        backgroundColor: "#0b0f0d",
                        backgroundImage:
                          "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
                        backgroundSize: "26px 26px, 38px 38px",
                        backgroundPosition: "0 0, 13px 19px",
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        className="h-full w-full"
                        style={{ touchAction: "none", display: "block" }}
                        onPointerDown={onCanvasPointerDown}
                        onPointerMove={onCanvasPointerMove}
                        onPointerUp={endStroke}
                        onPointerCancel={endStroke}
                        onPointerLeave={endStroke}
                      />
                    </div>
                  </div>

                  <div className="pt-2 pb-[calc(env(safe-area-inset-bottom)+6px)] flex items-center justify-between gap-3">
                    <div className="text-[11px] text-zinc-900">Tip: escribe grande en tablet (dedo o lápiz). Puedes enviar varias pizarras seguidas.</div>

                    <button
                      onClick={exportBoardToChat}
                      className="md:hidden inline-flex h-10 px-5 rounded-full text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 items-center justify-center"
                    >
                      Enviar al chat
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-4" />
            </div>
          </div>
        </div>
      )}


      <PaywallModal
  paywallOpen={paywallOpen}
  closePaywall={closePaywall}
  billing={billing}
  setBilling={setBilling}
  plan={plan}
  setPlan={setPlan}
  payLoading={payLoading}
  payMsg={payMsg}
  isPro={isPro}
  startCheckout={startCheckout}
  startTopupCheckout={startTopupCheckout}
  cancelSubscriptionFromHere={cancelSubscriptionFromHere}
  ShieldIcon={ShieldIcon}
/>

<LoginModal
  loginOpen={loginOpen}
  setLoginOpen={setLoginOpen}
  isLoggedIn={isLoggedIn}
  loginSending={loginSending}
  loginMsg={loginMsg}
  setLoginMsg={setLoginMsg}
  authMode={authMode}
  setAuthMode={setAuthMode}
  loginEmail={loginEmail}
  setLoginEmail={setLoginEmail}
  loginPassword={loginPassword}
  setLoginPassword={setLoginPassword}
  keepSignedIn={keepSignedIn}
  setKeepSignedIn={setKeepSignedIn}
  authUserName={authUserName}
  authUserEmail={authUserEmail}
  authLoading={authLoading}
  proLoading={proLoading}
  usageInfo={usageInfo}
  loginEmailRef={loginEmailRef}
  signInWithPassword={signInWithPassword}
  signUpWithPassword={signUpWithPassword}
  signInWithOAuth={signInWithOAuth}
  logout={logout}
  OAuthLogo={OAuthLogo}
/>

<TopBar
  topBarRef={headerRef}
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  HOME_URL={HOME_URL}
  handleOpenPlansCTA={handleOpenPlansCTA}
  authLoading={authLoading}
  isPro={isPro}
  isLoggedIn={isLoggedIn}
  topPlanLabel={topPlanLabel}
  openLoginModal={openLoginModal}
  authUserEmail={authUserEmail}
  proLoading={proLoading}
  planLabelText={planLabelText}
  userInitial={userInitial}
  UserIcon={UserIcon}
/>

<div
  className="pointer-events-none fixed inset-x-0 top-0 z-[45] md:hidden"
  style={{
    height: "126px",
    background:
      "linear-gradient(to bottom, rgba(248,249,250,1) 0%, rgba(248,249,250,0.97) 42%, rgba(248,249,250,0.72) 72%, rgba(248,249,250,0) 100%)",
  }}
/>

<Sidebar
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  SIDEBAR_TOP={SIDEBAR_TOP}
  sortedThreads={sortedThreads}
  activeThreadId={activeThreadId}
  activateThread={activateThread}
  createThreadAndActivate={createThreadAndActivate}
  openRename={openRename}
  deleteActiveThread={deleteActiveThread}
  mounted={mounted}
  isDesktopPointer={isDesktopPointer}
  authLoading={authLoading}
  isLoggedIn={isLoggedIn}
  authUserName={authUserName}
  authUserEmail={authUserEmail}
  logout={logout}
  isPro={isPro}
  proLoading={proLoading}
  PLUS_NODE={PLUS_NODE}
  handleOpenPlansCTA={handleOpenPlansCTA}
  openLoginModal={openLoginModal}
/>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-0">
        {uiError && (
          <div className="mx-auto max-w-6xl px-2 md:px-6" style={{ paddingTop: 78, paddingBottom: chatBottomPad }}>
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Ha fallado la llamada a la IA. (Error: {uiError})</div>
          </div>
        )}


{/* ✅ CHAT / TUTOR RENDER     */}

<div
  ref={scrollRef}
  onScroll={handleChatScroll}
  className="flex-1 overflow-y-auto min-h-0 overscroll-contain px-4 md:px-6"
>
  <div
    className="mx-auto w-full max-w-3xl"
    style={{
      paddingTop: hasUserMessage ? 0 : 124,
      paddingBottom: hasUserMessage ? chatBottomPad : 18,
    }}
  >

{showSoftLimitWarning ? (
  <div className="flex justify-start">
    <div className="max-w-[92%] md:max-w-[85%] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-zinc-900 shadow-sm">
      <div className="text-[14px] font-semibold">
        Te quedan {usageInfo?.messages_left} mensajes este mes
      </div>
      <div className="mt-1 text-[13px] text-zinc-700 leading-6">
        Cuando quieras, puedes revisar tu plan o ampliarlo desde el botón de arriba.
      </div>
      <div className="mt-3">
        <button
          onClick={handleOpenPlansCTA}
          className="h-9 px-4 rounded-full bg-black hover:bg-zinc-900 text-white text-[12px] font-semibold"
        >
          Ver planes
        </button>
      </div>
    </div>
  </div>
) : null}

{showHardLimitWarning ? (
  <div className="flex justify-start">
    <div className="max-w-[92%] md:max-w-[85%] rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-zinc-900 shadow-sm">
      <div className="text-[15px] font-semibold">
        Has llegado al límite de mensajes de este mes
      </div>
      <div className="mt-1 text-[13px] text-zinc-700 leading-6">
        Puedes seguir usando Vonu mejorando tu plan y, más adelante, también podrás añadir mensajes extra si lo necesitas.
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={handleOpenPlansCTA}
          className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold"
        >
          Ver planes
        </button>
      </div>
    </div>
  </div>
) : null}

    <div className="flex flex-col gap-4 py-6 md:pt-6">
      {/* Badge modo tutor */}
      {activeThread?.mode === "tutor" ? (
        <div className="self-start ml-2 -mt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] text-blue-800 font-semibold">
            🎓 Modo Tutor
            <span className="text-[11px] font-normal text-blue-700/80">
              nivel: {activeThread?.tutorProfile?.level ?? "adult"}
            </span>
          </div>
        </div>
      ) : null}
{!hasUserMessage ? (
  <div className="px-1">
    <div className="pt-8 md:pt-10 ml-2">
  <div className="text-zinc-900 font-black tracking-tight leading-[0.92] text-[56px] md:text-[72px]">
        ¿Qué
        <br />
        quieres
        <br />
        hacer?
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
  {quickPrompts.map((p) => (
    <button
      key={p.label}
      onClick={() => applyQuickPrompt(p)}
      className={[
        "inline-flex items-center justify-center",
        "rounded-full border border-zinc-900/35 bg-white",
        "px-5 py-2.5 text-[13px] font-semibold text-zinc-900",
        "shadow-sm hover:bg-zinc-50 transition-colors",
        "active:scale-[0.99]",
        "whitespace-nowrap",
      ].join(" ")}
    >
      {p.label === "Identificar posible estafa" ? "Posible estafa" : p.label}
    </button>
  ))}
</div>


    </div>
  </div>
) : null}


      {/* ✅ Mensajes usuario / Vonu */}
      <div className="flex flex-col gap-4">
        {messages.map((m) => {
          const isUser = m.role === "user";

          if (!isUser && m.id === "init" && !m.pizarra) {
            return null;
          }

          const rawText = isUser ? (m.text ?? "") : (m.text ?? "");

          const mdTextRaw = isUser
            ? rawText
            : m.streaming
            ? rawText
            : normalizeAssistantText(rawText);

          const mdText = !isUser
            ? normalizeMathMarkdown(
                sanitizeTutorLikeImage(normalizeAssistantText(mdTextRaw))
              )
            : mdTextRaw;

          const isStreaming = !!m.streaming;
          const hasText = (m.text ?? "").length > 0;

          // ===== USUARIO =====
          if (isUser) {
            return (
              <div
  key={m.id}
  data-msg-id={m.id}
  className="flex w-full justify-end animate-[fadeIn_240ms_ease-out]"
>
                <div
                  className={[
                    "relative min-w-0 max-w-[92%] md:max-w-[85%] px-3 py-2 text-[15px] leading-relaxed overflow-visible break-words",
                    "md:shadow-sm bg-[#e9edf1] text-zinc-900 rounded-l-2xl rounded-br-2xl rounded-tr-none mr-2",
                  ].join(" ")}
                >
                  <BubbleTail side="right" color="#e9edf1" />

                  <div className="relative z-10">
                    {m.image && (
                      <div className="mb-2">
                        <img
                          src={m.image}
                          alt="Adjunto"
                          className="rounded-md max-h-60 max-w-full object-cover"
                        />
                      </div>
                    )}

                    {(m.text || m.streaming) && (
                      <div className="prose max-w-none min-w-0 overflow-visible break-words prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-headings:my-0 font-sans text-[18px] md:text-[19px] leading-8 md:leading-8 text-zinc-900">
                        <span className="whitespace-pre-wrap">{mdText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // ===== VONU PENSANDO (misma estructura que la respuesta para que no se mueva) =====
if (isStreaming && !((m.text ?? "").trim())) {
  return (
  <div
    key={m.id}
    className="flex w-full justify-start mt-3 md:mt-4 vonu-answer-in"
  >
      <div className="ml-2 flex w-full max-w-[96%] md:max-w-[88%] flex-col md:flex-row md:items-start gap-0.5 md:gap-1">
        <div
          className={[
  "shrink-0 flex h-7 w-7 md:h-8 md:w-8 items-start justify-center self-start",
  activeThread?.mode === "tutor"
    ? "mt-[22px] md:mt-[24px]"
    : "mt-[10px] md:mt-[12px]"
].join(" ")}
        >
          <VonuThinking />
        </div>

        <div className="min-w-0 flex-1" />
      </div>
    </div>
  );
}

          // ===== VONU RESPONDIENDO (sin burbuja) =====
                    return (
            <div
              key={m.id}
              className="flex w-full justify-start mt-3 md:mt-4"
style={{ ["--vonu-reveal-ms" as any]: `${m.revealMs ?? 520}ms` }}
            >
              <div className="ml-2 flex w-full max-w-[96%] md:max-w-[88%] flex-col md:flex-row md:items-start gap-0.5 md:gap-1">
                <div
  className={[
  "shrink-0 flex h-7 w-7 md:h-8 md:w-8 items-start justify-center self-start",
  activeThread?.mode === "tutor"
    ? "mt-[22px] md:mt-[24px]"
    : "mt-[10px] md:mt-[12px]"
].join(" ")}
>
  <img
    src="/logo/vonu-cube-black.png?v=3"
    alt="Vonu"
    className="block h-[20px] w-[20px] md:h-[21px] md:w-[21px] object-contain"
    draggable={false}
  />
</div>

                <div className="min-w-0 flex-1 vonu-reveal">
                  {m.image && (
                    <div className="mb-2">
                      <img
                        src={m.image}
                        alt="Adjunto"
                        className="rounded-md max-h-60 max-w-full object-cover"
                      />
                    </div>
                  )}

                  {(m.text || m.streaming) && (
                    <div className="prose max-w-none min-w-0 overflow-visible break-words prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-headings:my-0 font-sans text-[18px] md:text-[19px] leading-8 md:leading-8">
                      {isStreaming ? (
                        <span className="whitespace-pre-wrap">
                          {mdText.includes('"elements"') ||
                          mdText.includes("```excalidraw")
                            ? ""
                            : mdText}
                          {!hasText ? null : <TypingCaret />}
                        </span>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={makeMdComponents(
                            m.boardImageB64,
                            m.boardImagePlacement,
                            m.pizarra
                          )}
                        >
                          {mdText}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}

                  {activeThread?.mode === "tutor" && m.boardImageB64 ? (
                    <div className="mt-3">
                      <ChalkboardTutorBoard
                        className="w-full"
                        value={""}
                        boardImageB64={m.boardImageB64}
                        boardImagePlacement={m.boardImagePlacement}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>

            <ChatInputBar
  inputBarRef={inputBarRef}
  imagePreview={imagePreview}
  micMsg={micMsg}
  input={input}
  setInput={setInput}
  isTyping={isTyping}
  textareaRef={textareaRef}
  handleKeyDown={handleKeyDown}
  canSend={canSend}
  sendMessage={sendMessage}
  voiceMode={voiceMode}
  realtimeStatus={realtimeStatus}
  isLoggedIn={isLoggedIn}
  toggleConversation={toggleConversation}
  openBoard={openBoard}
  fileInputRef={fileInputRef}
  onSelectImage={onSelectImage}
/>
    </div>
  </div>
  );
}