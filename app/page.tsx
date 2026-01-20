// app/page.tsx
// ============================
// ✅ PARTE 1 / 4
// (NO PEGUES SOLO ESTA PARTE: es el inicio del archivo. Luego pegarás 2/4, 3/4 y 4/4 en orden.)
// ============================

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Architects_Daughter } from "next/font/google";

import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

import ReactMarkdown from "react-markdown";
import ChalkboardTutorBoard from "@/app/components/ChalkboardTutorBoard";

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

  // ✅ Tutor: JSON de pizarra (para render sin burbuja en modo tutor)
  pizarra?: string | null;

  // ✅ imagen de pizarra (IA) y su colocación
  boardImageB64?: string | null;
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null;
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
  return raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

// ===== TUTOR (detección ligera frontend) =====
function looksLikeTutorIntent(text: string) {
  const t = (text || "").toLowerCase();

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

  // ============================
  // ✅ PARTE 2/4 CONTINÚA AQUÍ
  // (pegaremos a partir del useEffect de auth + resto del archivo)
  // ============================

