// app/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Architects_Daughter } from "next/font/google";

import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

import ReactMarkdown from "react-markdown";
import ExcalidrawBlock from "@/app/components/ExcalidrawBlock";

import type { Components } from "react-markdown";
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

// ✅ regla: tras 2 análisis, pedir login/pago
const FREE_MESSAGE_LIMIT = 2;

function isDesktopPointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(pointer: fine)")?.matches ?? true;
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
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, " ");
}

// ===== TUTOR (detección ligera frontend) =====
function looksLikeTutorIntent(text: string) {
  const t = (text || "").toLowerCase();

  // señales fuertes (estudio/explicación)
  const strong = [
    "explícame",
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

  // kid
  const kid = ["primaria", "tabla", "sumas", "restas", "multiplic", "divisiones", "dictado", "ortografía", "deberes"];
  if (kid.some((k) => t.includes(k))) return "kid";

  // teen
  const teen = ["eso", "bachiller", "selectividad", "evau", "trigonometr", "derivad", "integral", "funciones", "química", "física"];
  if (teen.some((k) => t.includes(k))) return "teen";

  // adult / unknown
  const adult = ["universidad", "ingeniería", "álgebra lineal", "calculo", "estadística", "programación", "finanzas", "contabilidad"];
  if (adult.some((k) => t.includes(k))) return "adult";

  return "unknown";
}


function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

  // ✅ Paywall como en la foto: anual / mensual / seguir gratis
  const [plan, setPlan] = useState<"monthly" | "yearly" | "free">("yearly");
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState<string | null>(null);

  // ✅ Si el usuario intenta pagar estando logout, guardamos el plan y tras login lanzamos checkout
  const [pendingCheckoutPlan, setPendingCheckoutPlan] = useState<"monthly" | "yearly" | null>(null);

  // Mensaje post-checkout
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isLoggedIn = !authLoading && !!authUserId;
  const isBlockedByPaywall = !authLoading && !!authUserId && !proLoading && !isPro;

  // ===== Copy marketing (visible) =====
  const PLUS_TEXT = "Plus+";
  const PLUS_NODE = (
    <span className="inline-flex items-baseline">
      Plus
      <sup className="ml-[1px] text-[12px] font-bold leading-none relative -top-[5px]">+</sup>
    </span>
  );
function WhiteboardBlock({
  value,
  onOpenCanvas,
}: {
  value: string;
  onOpenCanvas: () => void;
}) {
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

        <button
          onClick={onOpenCanvas}
          className="h-8 px-3 rounded-full bg-black hover:bg-zinc-900 text-white text-[12px] font-semibold"
        >
          Abrir pizarra
        </button>
      </div>

      <div
        className="px-4 py-4 text-[14px] leading-7"
        style={{
          backgroundColor: "#0b0f0d",
          color: "#f8fafc",
          fontFamily:
            '"Chalkboard SE","Bradley Hand","Comic Sans MS","Segoe Print",ui-sans-serif,system-ui',
          textShadow: "0 0 1px rgba(255,255,255,.20)",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "26px 26px, 38px 38px",
          backgroundPosition: "0 0, 13px 19px",
        }}
      >
        {lines.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap break-words"
            style={{
              opacity: 0.92,
              animation: "chalkIn 240ms ease-out both",
              filter: "drop-shadow(0px 0px 0.4px rgba(255,255,255,0.25))",
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

const mdComponents: Components = {
  code({ inline, className, children, ...props }: any) {
    const isInline = !!inline;

    // className a veces viene como string o como array
    const cn = Array.isArray(className) ? className.join(" ") : (className || "");

    // detectar language-xxxx de forma robusta
    const m = cn.match(/language-([a-zA-Z0-9_-]+)/);
    const lang = (m?.[1] || "").toLowerCase();

    // ✅ Convertimos children a string UNA sola vez
    const content = Array.isArray(children)
      ? children.join("")
      : String(children ?? "");
    
    // (quita el salto final si existe)
    const clean = content.replace(/\n$/, "");

    // ✅ EXCALIDRAW: ```excalidraw
if (!isInline && lang === "excalidraw") {
  return <ExcalidrawBlock sceneJSON={clean} />;
}


    // ✅ WHITEBOARD: ```whiteboard
    if (!isInline && lang === "whiteboard") {
      return (
        <WhiteboardBlock
          value={clean}
          onOpenCanvas={() => openBoard()}
        />
      );
    }

    // Bloques normales (código)
    if (!isInline) {
      return (
        <pre className="rounded-xl bg-zinc-900 text-white p-3 overflow-x-auto">
          <code className="text-[12.5px]" {...props}>
            {clean}
          </code>
        </pre>
      );
    }

    // Inline code
    return (
      <code className="px-1 py-[1px] rounded bg-zinc-100 border border-zinc-200 text-[12.5px]">
        {clean}
      </code>
    );
  },
};



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

  function computeProfileFromUser(u: any) {
    const { identityData } = bestIdentityFromUser(u);

    const metaName = pickFirstNonEmpty(u?.user_metadata?.full_name, u?.user_metadata?.name) as string | null;
    const metaEmail = pickFirstNonEmpty(u?.user_metadata?.email) as string | null;

    const identityEmail = pickFirstNonEmpty(identityData?.email, identityData?.preferred_username) as string | null;

    const identityName =
      pickFirstNonEmpty(identityData?.name, identityData?.full_name, identityData?.displayName, buildNameFromParts(identityData?.given_name, identityData?.family_name)) ??
      null;

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
    if (!pendingCheckoutPlan) return;

    setLoginOpen(false);

    const chosen = pendingCheckoutPlan;
    setPendingCheckoutPlan(null);

    setTimeout(() => {
      startCheckout(chosen);
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isLoggedIn, pendingCheckoutPlan]);

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
  }

  function openPlansModal() {
    setPayMsg(null);
    // si ya es Pro, por defecto marcamos "Seguir gratis" (como en la captura: plan actual arriba, pero selección en gratis)
    setPlan(isPro ? "free" : "yearly");
    setPaywallOpen(true);
  }

  function handleOpenPlansCTA() {
    openPlansModal();
  }

  async function startCheckout(chosen: "monthly" | "yearly") {
    setPayLoading(true);
    setPayMsg(null);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        setPayLoading(false);
        setPayMsg("Para continuar al pago, inicia sesión.");
        setPendingCheckoutPlan(chosen);
        openLoginModal("signin");
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
        body: JSON.stringify({ plan: chosen }),
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
      setPendingCheckoutPlan(null);
      setAuthLoading(false);
    } catch {}
  }

  // -------- Persistencia local --------
const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
const [activeThreadId, setActiveThreadId] = useState<string>("");
const activeThreadIdRef = useRef<string>("");

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

        // 🔒 tipado estricto
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [inputExpanded, setInputExpanded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputBarH, setInputBarH] = useState<number>(140);
  const shouldStickToBottomRef = useRef(true);

  // ===== MIC (SpeechRecognition) =====
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micMsg, setMicMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  function stopMic() {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
  }

  async function toggleMic() {
    if (isTyping) return;

    const SR = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    if (!SR) {
      setMicMsg("Tu navegador no soporta dictado por voz. Prueba Chrome/Edge en Android o Desktop.");
      setTimeout(() => setMicMsg(null), 2400);
      return;
    }

    if (isListening) {
      stopMic();
      return;
    }

    try {
      setMicMsg(null);

      const rec = new SR();
      recognitionRef.current = rec;

      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "es-ES";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (_e: any) => {
        setIsListening(false);
        setMicMsg("No se pudo usar el micrófono. Revisa permisos del navegador.");
        setTimeout(() => setMicMsg(null), 2600);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        let finalText = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const txt = res?.[0]?.transcript ?? "";
          if (res.isFinal) finalText += txt;
          else interim += txt;
        }

        const combined = (finalText || interim || "").trim();
        if (!combined) return;

        setInput((prev) => {
          const base = prev.trim();
          if (!base) return combined;
          return base + " " + combined;
        });
      };

      rec.start();
    } catch {
      setIsListening(false);
      setMicMsg("No se pudo iniciar el dictado. Revisa permisos del navegador.");
      setTimeout(() => setMicMsg(null), 2600);
    }
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

  function openBoard() {
    setBoardMsg(null);
    setBoardOpen(true);
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

  // VisualViewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;

    const setVvh = () => {
      document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
    };

    setVvh();
    vv.addEventListener("resize", setVvh);
    vv.addEventListener("scroll", setVvh);
    return () => {
      vv.removeEventListener("resize", setVvh);
      vv.removeEventListener("scroll", setVvh);
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

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [threads]);

  const userMsgCountInThread = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);

  const canSend = useMemo(() => {
    const basicReady = !isTyping && (!!input.trim() || !!imagePreview);
    if (isBlockedByPaywall) return false;
    return basicReady;
  }, [isTyping, input, imagePreview, isBlockedByPaywall]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  // textarea autoresize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = next + "px";
    setInputExpanded(next > 52);
  }, [input]);

  function handleChatScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 140;
    const distToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickToBottomRef.current = distToBottom < threshold;
  }

  // ✅ FIX: mientras streamea, NO usar smooth (evita el "bote" constante)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!shouldStickToBottomRef.current) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: isTyping ? "auto" : "smooth",
    });
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
    if (nextUserCount <= FREE_MESSAGE_LIMIT) return false;

    if (!isLoggedIn) {
      setLoginMsg("Para seguir, inicia sesión (y así guardas tu historial).");
      openLoginModal("signin");
      return true;
    }

    if (!isPro) {
      setPayMsg(`Has llegado al límite del plan Gratis. Desbloquea Plus+ para seguir usando Vonu.`);
      openPlansModal();
      return true;
    }

    return false;
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
    const targetThreadId = activeThread.id;
activeThreadIdRef.current = targetThreadId;

    const userText = input.trim();
const imageBase64 = imagePreview;

setUiError(null);

// ===== Tutor auto-activación (solo si está en chat y la intención es fuerte) =====
const threadModeNow: ThreadMode = activeThread.mode ?? "chat";
let nextMode: ThreadMode = threadModeNow;

let nextTutorLevel: TutorLevel = activeThread.tutorProfile?.level ?? "adult";

if (threadModeNow === "chat" && looksLikeTutorIntent(userText)) {
  nextMode = "tutor";
  const inferred = inferTutorLevel(userText);
  nextTutorLevel = inferred === "unknown" ? (nextTutorLevel || "adult") : inferred;

  setThreads((prev) =>
    prev.map((t) =>
      t.id === targetThreadId
        ? {
            ...t,
            updatedAt: Date.now(),
            mode: "tutor",
            tutorProfile: { level: nextTutorLevel },
          }
        : t
    )
  );

  setToastMsg("✅ He activado Modo Tutor para esta conversación.");
  setTimeout(() => setToastMsg(null), 2200);
}


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

    shouldStickToBottomRef.current = true;

    setThreads((prev) =>
  prev.map((t) => {
    if (t.id !== targetThreadId) return t;

    return {
      ...t,
      updatedAt: Date.now(),
      // ✅ guardamos los mensajes en el thread
      messages: [...t.messages, userMsg, assistantMsg],
    };
  })
);



    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    try {
      await sleep(220);

      const threadNow = threads.find((x) => x.id === targetThreadId) ?? activeThread;

      const convoForApi = [...(threadNow?.messages ?? []), userMsg]
        .filter((m) => (m.role === "user" || m.role === "assistant") && (m.text || m.image))
        .map((m) => ({
          role: m.role,
          content: m.text ?? "",
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const data = await res.json();
      const fullText = typeof data?.text === "string" && data.text.trim() ? data.text : "He recibido una respuesta vacía. ¿Puedes repetirlo con un poco más de contexto?";

      await sleep(90);

      const isTutor = nextMode === "tutor";

if (isTutor) {
  // ✅ Tutor: menos streaming, más estable (mostramos dots y luego el bloque completo)
  await sleep(220);

  setThreads((prev) =>
    prev.map((t) => {
      if (t.id !== targetThreadId) return t;
      return {
        ...t,
        updatedAt: Date.now(),
        messages: t.messages.map((m) => (m.id === assistantId ? { ...m, text: fullText, streaming: false } : m)),
      };
    })
  );

  setIsTyping(false);
  if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
} else {
  // ✅ Chat normal: streaming letra a letra como ahora
  let i = 0;
  const speedMs = fullText.length > 900 ? 7 : 11;

  const interval = setInterval(() => {
    i++;
    const partial = fullText.slice(0, i);

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== targetThreadId) return t;
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
          if (t.id !== targetThreadId) return t;
          return {
            ...t,
            updatedAt: Date.now(),
            messages: t.messages.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
          };
        })
      );

      setIsTyping(false);
      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }, speedMs);
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
      if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }

  const chatBottomPad = inputBarH;

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
  const topPlanLabel = authLoading ? "…" : isPro ? PLUS_NODE : isLoggedIn ? "Gratis" : PLUS_NODE;
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

  return (
    <div className="bg-white flex overflow-hidden" style={{ height: "calc(var(--vvh, 100dvh))" }}>
      <style jsx global>{`
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
`}</style>

      {/* TOAST */}
      {toastMsg && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] px-3">
          <div className="rounded-full border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-sm px-4 py-2 text-xs text-zinc-800">{toastMsg}</div>
        </div>
      )}

      {/* ===== RENAME MODAL (FIX: ahora sí funciona) ===== */}
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
                    {/* ✅ FIX: tip en negro */}
                    <div className="text-[11px] text-zinc-900">Tip: escribe grande en tablet (dedo o lápiz). Puedes enviar varias pizarras seguidas.</div>

                    {/* Mobile: Enviar al chat abajo (y quitamos “Cerrar”) */}
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

      {/* ===== PAYWALL (FULLSCREEN TAKEOVER) ===== */}
      {paywallOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" onClick={closePaywall} aria-hidden="true" />

          <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[320px] w-[680px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute top-[26%] -left-28 h-[240px] w-[240px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute top-[48%] -right-24 h-[280px] w-[280px] rounded-full bg-zinc-900/5 blur-3xl pointer-events-none" />

          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            {/* ✅ SIN SCROLL: todo cabe */}
            <div className="mx-auto h-full w-full max-w-md px-3 pb-[env(safe-area-inset-bottom)] flex flex-col min-h-0">
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-xl border border-zinc-200 grid place-items-center shadow-sm">
                    <img src={"/vonu-icon.png?v=2"} alt="Vonu" className="h-6 w-6" draggable={false} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-zinc-900 leading-5">{payTitleNode}</div>
                    <div className="text-[11px] text-zinc-500 leading-4">
                      Plan: <span className="font-semibold text-zinc-900">{planLabel}</span>
                      {proLoading ? <span className="ml-2 text-zinc-400">· comprobando…</span> : null}
                    </div>
                  </div>
                </div>

                <button
                  onClick={closePaywall}
                  className={[
                    "h-10 w-10 aspect-square rounded-full",
                    "bg-white/90 backdrop-blur-xl border border-zinc-200",
                    "hover:bg-white transition-colors",
                    "grid place-items-center",
                    "cursor-pointer disabled:opacity-50 shadow-sm",
                    "p-0",
                  ].join(" ")}
                  aria-label="Cerrar"
                  disabled={!!payLoading}
                  title="Cerrar"
                >
                  <span className="text-zinc-700 text-[20px] leading-none relative top-[-0.5px]">×</span>
                </button>
              </div>

              <div className="mt-2 flex-1 min-h-0 rounded-[26px] border border-zinc-200 bg-white/85 backdrop-blur-xl shadow-[0_26px_80px_rgba(0,0,0,0.14)] overflow-hidden">
                <div className="h-full flex flex-col p-3">
                  {/* ===== como la foto: Elige tu plan + 3 opciones ===== */}
                  <div className="rounded-[20px] border border-zinc-200 bg-white p-3">
                    <div className="text-[12.5px] font-semibold text-zinc-900">Elige tu plan</div>

                    <div className="mt-2 grid gap-2">
                      {/* ANUAL */}
                      <button
                        onClick={() => setPlan("yearly")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[18px] border transition-colors text-left",
                          "px-3 py-2.5 flex items-start gap-3",
                          plan === "yearly" ? "border-blue-600 bg-blue-50/70" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        {/* radio */}
                        <div className="pt-[2px]">
                          <div className={["h-5 w-5 rounded-full border grid place-items-center", plan === "yearly" ? "border-blue-600" : "border-zinc-300"].join(" ")}>
                            {plan === "yearly" ? <div className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="text-[12.5px] font-semibold text-zinc-900">Anual</div>
                              <span className="text-[10px] px-2 py-[2px] rounded-full bg-blue-600 text-white font-semibold">{BEST_VALUE_BADGE}</span>
                            </div>
                            <div className="text-[11px] text-zinc-500">{YEAR_SAVE_BADGE}</div>
                          </div>

                          <div className="mt-1 flex items-baseline gap-2">
                            <div className="text-[20px] font-semibold text-zinc-900 leading-6">{PRICE_YEAR}</div>
                            <div className="text-[11px] text-zinc-600">≈ {PRICE_YEAR_PER_MONTH}/mes</div>
                          </div>
                        </div>
                      </button>

                      {/* MENSUAL */}
                      <button
                        onClick={() => setPlan("monthly")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[18px] border transition-colors text-left",
                          "px-3 py-2.5 flex items-start gap-3",
                          plan === "monthly" ? "border-blue-600 bg-blue-50/70" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        {/* radio */}
                        <div className="pt-[2px]">
                          <div className={["h-5 w-5 rounded-full border grid place-items-center", plan === "monthly" ? "border-blue-600" : "border-zinc-300"].join(" ")}>
                            {plan === "monthly" ? <div className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[12.5px] font-semibold text-zinc-900">Mensual</div>
                            <div className="text-[11px] text-zinc-500">Flexible</div>
                          </div>

                          <div className="mt-1 flex items-baseline gap-2">
                            <div className="text-[20px] font-semibold text-zinc-900 leading-6">{PRICE_MONTH}</div>
                            <div className="text-[11px] text-zinc-600">cancela cuando quieras</div>
                          </div>
                        </div>
                      </button>

                      {/* SEGUIR GRATIS */}
                      <button
                        onClick={() => setPlan("free")}
                        disabled={!!payLoading}
                        className={[
                          "w-full rounded-[18px] border transition-colors text-left",
                          "px-3 py-2.5 flex items-start gap-3",
                          plan === "free" ? "border-blue-600 bg-blue-50/70" : "border-zinc-200 bg-white hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        {/* radio */}
                        <div className="pt-[2px]">
                          <div className={["h-5 w-5 rounded-full border grid place-items-center", plan === "free" ? "border-blue-600" : "border-zinc-300"].join(" ")}>
                            {plan === "free" ? <div className="h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[12.5px] font-semibold text-zinc-900">Seguir gratis</div>
                            <div className="text-[12px] font-semibold text-zinc-900">0€</div>
                          </div>
                          <div className="mt-1 text-[11px] text-zinc-600">Análisis limitados.</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* ===== Bloque GRATIS como la foto ===== */}
                  <div className="mt-2 rounded-[20px] border border-zinc-200 bg-white p-3">
                    <div className="text-[12.5px] font-semibold text-zinc-900">Gratis</div>
                    <div className="mt-2 grid gap-1.5">
                      {["Análisis limitados", "Decidir con calma"].map((x) => (
                        <div key={x} className="flex items-start gap-2">
                          <span className="mt-[1px] text-blue-700">
                            <CheckIcon className="h-4 w-4" />
                          </span>
                          <div className="text-[12px] text-zinc-700 leading-5">{x}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mensaje error/pago (compacto) */}
                  {payMsg ? (
                    <div className="mt-2 rounded-[16px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] text-zinc-700 leading-5">{payMsg}</div>
                  ) : (
                    <div className="mt-2 opacity-0 select-none text-[12px] px-3 py-2">placeholder</div>
                  )}

                  {/* Footer fijo, sin scroll */}
                  <div className="mt-auto pt-1 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                    <button
                      onClick={() => {
                        if (payLoading) return;
                        if (plan === "free") {
                          closePaywall();
                          return;
                        }
                        // anual: yearly / mensual: monthly
                        startCheckout(plan);
                      }}
                      className={[
                        "w-full h-11 rounded-full text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-50",
                        "bg-black text-white hover:bg-zinc-900",
                      ].join(" ")}
                      disabled={!!payLoading}
                    >
                      {payLoading ? "Procesando…" : plan === "free" ? "Volver al chat" : "Continuar con el pago"}
                    </button>

                    <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                      <span className="text-blue-700">
                        <ShieldIcon className="h-4 w-4" />
                      </span>
                      <span>Pago seguro con Stripe.</span>
                    </div>

                    {isPro ? (
                      <button
                        onClick={cancelSubscriptionFromHere}
                        className="mt-2 w-full h-10 rounded-full border border-red-200 hover:bg-red-50 text-[12px] text-red-700 cursor-pointer disabled:opacity-50"
                        disabled={!!payLoading}
                      >
                        Cancelar suscripción
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="h-2" />
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGIN MODAL ===== */}
      {loginOpen && (
        <div className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-sm flex items-center justify-center px-6" onClick={() => (!loginSending ? setLoginOpen(false) : null)}>
          <div className="w-full max-w-[380px] rounded-[20px] bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.18)] p-6" onClick={(e) => e.stopPropagation()}>
            {isLoggedIn ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[18px] font-semibold text-zinc-900">Sesión iniciada</div>
                    <div className="text-[12.5px] text-zinc-500 mt-1">Estás dentro. Aquí tienes tu estado.</div>
                  </div>

                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                    aria-label="Cerrar"
                  >
                    <span className="text-[18px] leading-none relative top-[-0.5px]">×</span>
                  </button>
                </div>

                <div className="mt-5 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <div className="text-[12px] text-zinc-500">Cuenta</div>
                  <div className="mt-1 text-[14px] font-semibold text-zinc-900 truncate">{authUserName ?? "Usuario"}</div>
                  <div className="text-[12px] text-zinc-600 truncate">{authUserEmail ?? "Email no disponible"}</div>
                  <div className="mt-2 text-[12px] text-zinc-600">
                    Plan: <span className="font-semibold text-zinc-900">{proLoading ? "comprobando…" : isPro ? PLUS_NODE : "Gratis"}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      await logout();
                      setLoginMsg(null);
                      setLoginOpen(false);
                    }}
                    className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="flex-1 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Volver
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[18px] font-semibold text-zinc-900">{authMode === "signin" ? "Iniciar sesión" : "Crear cuenta"}</div>
                    <div className="text-[12.5px] text-zinc-500 mt-1">{authMode === "signin" ? "para continuar" : "crea tu cuenta para continuar"}</div>
                  </div>

                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }}
                    className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                    aria-label="Cerrar"
                    disabled={!!loginSending}
                  >
                    <span className="text-[18px] leading-none relative top-[-0.5px]">×</span>
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="text-[12px] text-zinc-600 mb-1">Email</div>
                    <input
                      ref={loginEmailRef}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                      placeholder="tuemail@ejemplo.com"
                      autoFocus={false}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setLoginOpen(false);
                          setLoginMsg(null);
                        }
                        if (e.key === "Enter") {
                          authMode === "signin" ? signInWithPassword() : signUpWithPassword();
                        }
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-[12px] text-zinc-600 mb-1">Contraseña</div>
                    <input
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      type="password"
                      className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                      placeholder="••••••••"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setLoginOpen(false);
                          setLoginMsg(null);
                        }
                        if (e.key === "Enter") {
                          authMode === "signin" ? signInWithPassword() : signUpWithPassword();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[12px] text-zinc-600 cursor-pointer select-none">
                      <input type="checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} className="h-4 w-4" />
                      Mantener sesión
                    </label>

                    <button
                      className="text-[12px] text-blue-700 hover:text-blue-800 cursor-pointer"
                      onClick={() => setLoginMsg("Si has olvidado tu contraseña, por ahora crea una cuenta nueva con otro email (lo mejoraremos).")}
                      disabled={!!loginSending}
                    >
                      ¿OLVIDASTE LA CONTRASEÑA?
                    </button>
                  </div>

                  {loginMsg && <div className="whitespace-pre-wrap text-[12px] text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-[14px] px-3 py-2">{loginMsg}</div>}

                  <button
                    onClick={authMode === "signin" ? signInWithPassword : signUpWithPassword}
                    className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={!!loginSending}
                  >
                    {loginSending ? "Procesando…" : authMode === "signin" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px flex-1 bg-zinc-200" />
                    <div className="text-[12px] text-zinc-500">o</div>
                    <div className="h-px flex-1 bg-zinc-200" />
                  </div>

                  <button
                    onClick={() => signInWithOAuth("google")}
                    className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!!loginSending}
                  >
                    <OAuthLogo src="/auth/Google.png" alt="Google" />
                    Continuar con Google
                  </button>

                  <button
                    onClick={() => signInWithOAuth("azure")}
                    className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!!loginSending}
                  >
                    <OAuthLogo src="/auth/Microsoft.png" alt="Microsoft" />
                    Continuar con Microsoft
                  </button>

                  <div className="text-[12px] text-zinc-600 text-center pt-1">
                    {authMode === "signin" ? (
                      <>
                        ¿No tienes cuenta?{" "}
                        <button
                          className="text-blue-700 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setAuthMode("signup");
                            setLoginMsg(null);
                          }}
                          disabled={!!loginSending}
                        >
                          Crear cuenta
                        </button>
                      </>
                    ) : (
                      <>
                        ¿Ya tienes cuenta?{" "}
                        <button
                          className="text-blue-700 hover:text-blue-800 cursor-pointer"
                          onClick={() => {
                            setAuthMode("signin");
                            setLoginMsg(null);
                          }}
                          disabled={!!loginSending}
                        >
                          Iniciar sesión
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== TOP FADE ===== */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="h-[86px] bg-gradient-to-b from-white via-white/85 to-transparent" />
      </div>

      {/* ===== TOP BUBBLES ===== */}
      <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <div className="h-11 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm flex items-center gap-0 overflow-hidden px-1">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 w-11 grid place-items-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95 p-0"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              title={menuOpen ? "Cerrar menú" : "Menú"}
            >
              <img src={"/vonu-icon.png?v=2"} alt="Menú" className={`h-6 w-6 transition-transform duration-300 ease-out ${menuOpen ? "rotate-90" : "rotate-0"}`} draggable={false} />
            </button>

            <a
              href={HOME_URL}
              className="h-11 -ml-0.5 pr-2 flex items-center transition-colors cursor-pointer rounded-full bg-white/95 hover:bg-white/95"
              aria-label="Ir a la home"
              title="Ir a la home"
            >
              <img src={"/vonu-wordmark.png?v=2"} alt="Vonu" className="h-4 w-auto" draggable={false} />
            </a>
          </div>
        </div>

        {/* ✅ CAMBIO: renderizar SIEMPRE (si authLoading, quedan deshabilitados) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleOpenPlansCTA}
            disabled={authLoading}
            className={[
              "h-11 px-4 rounded-full transition-colors cursor-pointer shadow-sm border",
              authLoading ? "bg-zinc-200 text-zinc-500 border-zinc-200 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 border-blue-700/10",
            ].join(" ")}
            title={authLoading ? "Cargando…" : isPro ? "Tienes Plus+" : isLoggedIn ? "Plan Gratis" : "Ver planes"}
          >
            {topPlanLabel}
          </button>

          <button
            onClick={() => openLoginModal("signin")}
            disabled={authLoading}
            className={[
              "relative h-11 w-11",
              "bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-sm",
              "grid place-items-center text-zinc-900 hover:bg-white transition-colors cursor-pointer",
              "rounded-full p-0",
              authLoading ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
            aria-label={isLoggedIn ? "Ver cuenta" : "Iniciar sesión"}
            title={authLoading ? "Cargando…" : isLoggedIn ? `Sesión: ${authUserEmail ?? "activa"} · Plan: ${proLoading ? "..." : planLabelText}` : "Iniciar sesión"}
          >
            <span
              className={[
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                authLoading ? "bg-zinc-300" : isLoggedIn ? "bg-emerald-500" : "bg-zinc-300",
              ].join(" ")}
              aria-hidden="true"
            />
            {isLoggedIn ? <span className="text-[13px] font-semibold">{userInitial}</span> : <UserIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ===== OVERLAY + SIDEBAR ===== */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? "bg-black/20 backdrop-blur-sm pointer-events-auto" : "pointer-events-none bg-transparent"}`}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={[
            "absolute left-3 right-3 md:right-auto",
            "bg-white/92 backdrop-blur-xl",
            "rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-zinc-200/80",
            "p-4",
            "transform transition-all duration-300 ease-out",
            menuOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0",
          ].join(" ")}
          style={{
            top: SIDEBAR_TOP,
            bottom: 12,
            width: isDesktopPointer() ? 360 : undefined,
            maxWidth: "calc(100vw - 24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-zinc-800">Historial</div>
                <div className="text-xs text-zinc-500">Tus consultas recientes</div>
              </div>

              <button onClick={createThreadAndActivate} className="text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                Nueva
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
  <button
    onClick={openRename}
    className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
  >
    Renombrar
  </button>

  <button
    onClick={() => {
      if (!activeThread) return;

      const current: ThreadMode = activeThread.mode ?? "chat";
      const next: ThreadMode = current === "tutor" ? "chat" : "tutor";

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== activeThread.id) return t;

          const nextLevel: TutorLevel =
            t.tutorProfile?.level && t.tutorProfile.level !== "unknown"
              ? t.tutorProfile.level
              : "adult";

          return {
            ...t,
            updatedAt: Date.now(),
            mode: next,
            tutorProfile: { level: nextLevel },
          };
        })
      );

      setToastMsg(
        next === "tutor"
          ? "✅ Modo Tutor activado para esta conversación."
          : "Modo Tutor desactivado."
      );
      setTimeout(() => setToastMsg(null), 2200);
      setMenuOpen(false);
    }}
    className={[
      "text-xs px-3 py-3 rounded-2xl border cursor-pointer transition-colors",
      activeThread?.mode === "tutor"
        ? "bg-blue-600 text-white border-blue-700/10 hover:bg-blue-700"
        : "bg-white border-zinc-200 hover:bg-zinc-50",
    ].join(" ")}
  >
    {activeThread?.mode === "tutor" ? "Tutor ✓" : "Tutor"}
  </button>

  <button
    onClick={deleteActiveThread}
    className="text-xs px-3 py-3 rounded-2xl bg-white border border-zinc-200 hover:bg-zinc-50 text-red-600 cursor-pointer"
  >
    Borrar
  </button>
</div>



            {/* LISTA (scroll) */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {sortedThreads.map((t) => {
                const active = t.id === activeThreadId;
                const when = mounted ? new Date(t.updatedAt).toLocaleString() : "";

                return (
                  <button
                    key={t.id}
                    onClick={() => activateThread(t.id)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition-colors cursor-pointer ${active ? "border-blue-600 bg-blue-50" : "border-zinc-200 bg-white hover:bg-zinc-50"}`}
                  >
                    <div className="text-sm font-medium text-zinc-900">{t.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{when}</div>
                  </button>
                );
              })}
            </div>

            {/* ✅ Cuenta al FINAL (abajo) con plan */}
            {!authLoading && (
              <div className="mt-3 rounded-3xl border border-zinc-200 bg-white px-3 py-3">
                <div className="text-xs text-zinc-500 mb-2">Cuenta</div>

                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900 truncate">{authUserName ?? "Usuario"}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{authUserEmail ?? "Email no disponible"}</div>
                      </div>

                      <button onClick={logout} className="text-xs px-3 py-2 rounded-full border border-zinc-200 hover:bg-zinc-50 cursor-pointer shrink-0">
                        Salir
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] text-zinc-500">
                        Plan: <span className="font-semibold text-zinc-900">{proLoading ? "comprobando…" : isPro ? PLUS_NODE : "Gratis"}</span>
                      </div>

                      <button
                        onClick={() => {
                          handleOpenPlansCTA();
                          setMenuOpen(false);
                        }}
                        className={["text-xs px-3 py-2 rounded-full transition-colors cursor-pointer", isPro ? "border border-zinc-200 hover:bg-zinc-50" : "bg-blue-600 text-white hover:bg-blue-700"].join(" ")}
                      >
                        {isPro ? "Ver" : "Mejorar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openLoginModal("signin")} className="w-full text-xs px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                    Iniciar sesión
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-0">
        {uiError && (
          <div className="mx-auto max-w-3xl px-6 mt-3 pt-4">
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Ha fallado la llamada a la IA. (Error: {uiError})</div>
          </div>
        )}

        <div ref={scrollRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto min-h-0">
          <div className="mx-auto max-w-3xl px-3 md:px-6" style={{ paddingTop: 92, paddingBottom: chatBottomPad }}>
            <div className="flex flex-col gap-4 py-8 md:pt-6">
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

  {messages.map((m) => {

                const isUser = m.role === "user";
                const rawText = isUser ? (m.text ?? "") : m.text || "";

                const isTutorThread = (activeThread?.mode ?? "chat") === "tutor";
const mdText = isUser ? rawText : isTutorThread ? rawText : normalizeAssistantText(rawText);


                const isStreaming = !!m.streaming;
                const hasText = (m.text ?? "").length > 0;

                return (
                  <div key={m.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={[
                        "relative min-w-0 max-w-[92%] md:max-w-[85%] px-3 py-2 shadow-sm text-[15px] leading-relaxed overflow-hidden break-words",
                        isUser ? "bg-[#dcf8c6] text-zinc-900 rounded-l-lg rounded-br-lg rounded-tr-none mr-2" : "bg-[#e8f0fe] text-zinc-900 rounded-r-lg rounded-bl-lg rounded-tl-none ml-2",
                        "after:content-[''] after:absolute after:w-3 after:h-3 after:rotate-45 after:top-[3px]",
                        isUser ? "after:right-[-6px] after:bg-[#dcf8c6]" : "after:left-[-6px] after:bg-[#e8f0fe]",
                      ].join(" ")}
                    >
                      {m.image && (
                        <div className="mb-2">
                          <img src={m.image} alt="Adjunto" className="rounded-md max-h-60 max-w-full object-cover" />
                        </div>
                      )}

                      {(m.text || m.streaming) && (
                        <div className="prose prose-sm max-w-none min-w-0 overflow-hidden break-words prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0">

                          {isStreaming ? (
                            <span
                              className="break-words"
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {mdText}
                              {!hasText ? <TypingDots /> : <TypingCaret />}
                            </span>
                          ) : (
                            <ReactMarkdown components={mdComponents}>
  {mdText}
</ReactMarkdown>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== INPUT BAR (nuevo estilo como tu captura) ===== */}
        <div ref={inputBarRef} className="sticky bottom-0 left-0 right-0 z-30 bg-white/92 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl px-3 md:px-6 pt-3 pb-2">
            {imagePreview && (
              <div className="mb-2 relative w-fit">
                <img src={imagePreview} alt="Preview" className="rounded-3xl border border-zinc-200 max-h-40" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors cursor-pointer grid place-items-center p-0"
                  aria-label="Quitar imagen"
                >
                  ×
                </button>
              </div>
            )}

            {micMsg && <div className="mb-2 text-[12px] text-zinc-600 bg-white border border-zinc-200 rounded-2xl px-3 py-2">{micMsg}</div>}

            {/* ✅ INPUT: textarea “tipo Gemini”: el TEXTO ocupa laterales; iconos anclados abajo */}
            <div className={["w-full", "relative rounded-[26px] border border-zinc-200 bg-white", "overflow-hidden"].join(" ")}>
              {/* LEFT ICONS (overlay) */}
              <div className="absolute left-2.5 bottom-2 flex items-center gap-1">
                <button
                  onClick={openBoard}
                  className="h-10 w-10 rounded-full hover:bg-zinc-50 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0"
                  aria-label="Pizarra"
                  title="Pizarra"
                  disabled={!!isTyping}
                >
                  <PencilIcon className="h-5 w-5 text-zinc-800" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10 rounded-full hover:bg-zinc-50 transition-colors grid place-items-center cursor-pointer disabled:opacity-50 p-0"
                  aria-label="Adjuntar"
                  title="Adjuntar imagen"
                  disabled={!!isTyping}
                >
                  <PlusIcon className="h-5 w-5 text-zinc-800" />
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectImage} className="hidden" />
              </div>

              {/* RIGHT ICONS (overlay) */}
              <div className="absolute right-2.5 bottom-2 flex items-center gap-2">
                <button
                  onClick={toggleMic}
                  disabled={!!isTyping || !speechSupported}
                  className={[
                    "h-10 w-10 rounded-full border transition-colors shrink-0 grid place-items-center p-0",
                    !speechSupported
                      ? "border-zinc-200 text-zinc-400 bg-white/60 cursor-not-allowed"
                      : isListening
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
                  ].join(" ")}
                  aria-label={isListening ? "Parar micrófono" : "Hablar"}
                  title={!speechSupported ? "Dictado no soportado en este navegador" : isListening ? "Parar" : "Dictar por voz"}
                >
                  <div className="relative">
                    <MicIcon className="h-5 w-5" />
                    {isListening && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />}
                  </div>
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!canSend}
                  className={[
                    "h-10 w-10 rounded-full shrink-0 transition-colors grid place-items-center p-0",
                    !canSend ? "bg-zinc-200 text-zinc-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer",
                  ].join(" ")}
                  aria-label="Enviar"
                  title="Enviar"
                >
                  <ArrowUpIcon className="h-5 w-5" />
                </button>
              </div>

              {/* TEXTAREA: full-width real (sin huecos laterales), con padding inferior para no pisar iconos */}
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
                disabled={!!isTyping}
                placeholder={isTyping ? "Vonu está respondiendo…" : isListening ? "Escuchando… habla ahora" : "Escribe tu mensaje…"}
                className={[
                  "block w-full resize-none bg-transparent outline-none",
                  "text-[15px] leading-5",
                  "px-4 pt-2",
                  "pb-[56px]", // espacio para iconos inferiores
                  "overflow-hidden",
                  inputExpanded ? "min-h-[56px]" : "min-h-[44px]",
                ].join(" ")}
                rows={1}
              />
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-3 md:px-6 pb-3 pb-[env(safe-area-inset-bottom)]">
            <p className="text-center text-[11.5px] md:text-[12px] text-zinc-500 leading-4 md:leading-5">Orientación preventiva · No sustituye profesionales.</p>
            {!hasUserMessage && <div className="h-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
