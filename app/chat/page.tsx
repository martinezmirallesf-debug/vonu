// app/chat/page.tsx


"use client";

import React, { Children, Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { supabaseBrowser } from "@/app/lib/supabaseBrowser";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

import PaywallModal from "@/app/components/PaywallModal";
import LoginModal from "@/app/components/LoginModal";
import ChatInputBar from "@/app/components/ChatInputBar";
import TopBar from "@/app/components/TopBar";
import Sidebar from "@/app/components/Sidebar";
import VonuThinking from "@/app/components/VonuThinking";
import AssistantMessageActions from "@/app/components/AssistantMessageActions";
import { analyzeAttachment } from "@/app/lib/analysis/analyzeAttachment";
import FilePickerModal from "@/app/components/FilePickerModal";
import ChatFileDropCard from "@/app/components/ChatFileDropCard";
import ManualWhiteboardModal from "@/app/components/ManualWhiteboardModal";

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

  // Imagen completa: solo para el análisis en vivo, NO para persistir en localStorage.
  image?: string;

  // Miniatura ligera: sí se puede guardar en historial local.
  imageThumb?: string;

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

function looksLikeRiskAnalysis(text: string) {
  const t = String(text ?? "").toLowerCase();

  const riskWords = [
    "estafa",
    "fraude",
    "phishing",
    "smishing",
    "sms",
    "whatsapp",
    "telegram",
    "email",
    "correo sospechoso",
    "enlace",
    "link",
    "url",
    "web",
    "tienda online",
    "pagar",
    "transferencia",
    "bizum",
    "tarjeta",
    "banco",
    "correos",
    "seur",
    "dhl",
    "paquete",
    "envío",
    "envio",
    "aduanas",
    "factura",
    "contrato",
    "cláusula",
    "clausula",
    "me manipula",
    "manipulación",
    "manipulacion",
    "me presiona",
    "presión",
    "presion",
    "amenaza",
    "chantaje",
    "sextorsión",
    "sextorsion",
    "tinder",
    "badoo",
    "bumble",
    "instagram",
    "facebook",
    "app de citas",
    "red social",
    "perfil falso",
    "cripto",
    "crypto",
    "bitcoin",
    "trading",
    "inversión",
    "inversion",
    "invertir",
    "ganar dinero",
    "oportunidad única",
    "oportunidad unica",
    "urgente",
    "urgencia",
    "médico",
    "medico",
    "salud",
    "dolor",
    "síntoma",
    "sintoma",
    "urgencias",
        "cláusula abusiva",
    "clausula abusiva",
    "abusivo",
    "abusiva",
    "reclamable",
    "legal",
    "contrato de alquiler",
    "alquiler",
    "arrendamiento",
    "inquilino",
    "casero",
    "fianza",
    "permanencia",
    "penalización",
    "penalizacion",
    "cobro indebido",
    "cobro no reconocido",
    "me han cobrado",
    "servicio no contratado",
    "mantenimiento no contratado",
    "suscripción",
    "suscripcion",
    "darme de baja",
    "cancelar suscripción",
    "cancelar suscripcion",
    "garantía",
    "garantia",
    "devolución",
    "devolucion",
    "reembolso",
    "precaución media-alta",
    "precaucion media-alta",
    "riesgo medio-alto",
    "malware",
"script",
".sh",
"ip directa",
"puerto",
"infectar",
"robar información",
"robar informacion",
"amenaza conocida",
"comprobación de seguridad",
"comprobacion de seguridad",
"malware",
"script",
".sh",
"ip directa",
"puerto",
"infectar",
"robar información",
"robar informacion",
"amenaza conocida",
"comprobación de seguridad",
"comprobacion de seguridad",
  ];

  return riskWords.some((word) => t.includes(word));
}

function getPreviousUserMessage(messages: Message[], index: number) {
  for (let j = index - 1; j >= 0; j -= 1) {
    const candidate = messages[j];
    if (candidate?.role === "user") {
      return candidate;
    }
  }

  return null;
}

type RiskStatus = "safe" | "warning" | "high" | "danger";

function riskStatusFromScore(score: number): RiskStatus {
  if (score >= 85) return "danger";
  if (score >= 65) return "high";
  if (score >= 35) return "warning";
  return "safe";
}

function extractRiskPercentFromAssistantText(text: string): number | null {
  const t = String(text ?? "").toLowerCase();
  if (!t.trim()) return null;

  const riskContextWords = [
    "probabilidad estimada",
    "probabilidad de estafa",
    "probabilidad estimada de estafa",
    "probabilidad de riesgo",
    "probabilidad estimada de riesgo",
    "probabilidad de engaño",
    "probabilidad estimada de engaño",
    "probabilidad de phishing",
    "probabilidad de smishing",
    "riesgo estimado",
    "riesgo del perfil",
    "riesgo general",
    "nivel de riesgo",
    "estafa",
    "fraude",
    "phishing",
    "smishing",
    "malware",
    "engaño",
    "scam",
    "perfil falso",
    "ia",
    "inteligencia artificial",
    "manipulación",
    "manipulacion",
    "edición fuerte",
    "edicion fuerte",
  ];

  const hasRiskContext = riskContextWords.some((word) => t.includes(word));
  if (!hasRiskContext) return null;

  // Detecta rangos tipo 90-98%, 90–98%, 90 a 98%
  const rangeRegex =
    /(?:probabilidad estimada|probabilidad|riesgo estimado|riesgo|nivel de riesgo)[^%\n]{0,90}?(\d{1,3})\s*(?:-|–|—|a)\s*(\d{1,3})\s*%/gi;

  let rangeMatch: RegExpExecArray | null;
  let bestRange: number | null = null;

  while ((rangeMatch = rangeRegex.exec(t)) !== null) {
    const a = Number(rangeMatch[1]);
    const b = Number(rangeMatch[2]);

    if (Number.isFinite(a) && Number.isFinite(b)) {
      const avg = Math.max(0, Math.min(100, (a + b) / 2));
      bestRange = bestRange === null ? avg : Math.max(bestRange, avg);
    }
  }

  if (bestRange !== null) return bestRange;

  // Detecta porcentajes simples tipo 95%
  const singleRegex =
    /(?:probabilidad estimada|probabilidad|riesgo estimado|riesgo|nivel de riesgo)[^%\n]{0,90}?(\d{1,3})\s*%/gi;

  let singleMatch: RegExpExecArray | null;
  let bestSingle: number | null = null;

  while ((singleMatch = singleRegex.exec(t)) !== null) {
    const n = Number(singleMatch[1]);

    if (Number.isFinite(n)) {
      const score = Math.max(0, Math.min(100, n));
      bestSingle = bestSingle === null ? score : Math.max(bestSingle, score);
    }
  }

  const reverseRangeRegex =
  /(\d{1,3})\s*(?:-|–|—|a)\s*(\d{1,3})\s*%\s*(?:de\s+)?(?:probabilidad|riesgo|posibilidad)/gi;

let reverseRangeMatch: RegExpExecArray | null;
let bestReverseRange: number | null = null;

while ((reverseRangeMatch = reverseRangeRegex.exec(t)) !== null) {
  const a = Number(reverseRangeMatch[1]);
  const b = Number(reverseRangeMatch[2]);

  if (Number.isFinite(a) && Number.isFinite(b)) {
    const avg = Math.max(0, Math.min(100, (a + b) / 2));
    bestReverseRange =
      bestReverseRange === null ? avg : Math.max(bestReverseRange, avg);
  }
}

if (bestReverseRange !== null) return bestReverseRange;

const reverseSingleRegex =
  /(\d{1,3})\s*%\s*(?:de\s+)?(?:probabilidad|riesgo|posibilidad)/gi;

let reverseSingleMatch: RegExpExecArray | null;
let bestReverseSingle: number | null = null;

while ((reverseSingleMatch = reverseSingleRegex.exec(t)) !== null) {
  const n = Number(reverseSingleMatch[1]);

  if (Number.isFinite(n)) {
    const score = Math.max(0, Math.min(100, n));
    bestReverseSingle =
      bestReverseSingle === null ? score : Math.max(bestReverseSingle, score);
  }
}

if (bestReverseSingle !== null) return bestReverseSingle;

  return bestSingle;
}

function inferRiskStatusFromAssistantText(text: string): RiskStatus | null {
  const t = String(text ?? "").toLowerCase();

  if (!t.trim()) return null;

  // ✅ OVERRIDE ULTRA PRIORITARIO:
// Si la respuesta de Vonu dice que un perfil de citas no tiene banderas rojas
// y además menciona verificación/confianza, debe ser VERDE antes de mirar porcentajes,
// palabras sueltas como "inversión" en contexto negativo, o precaución normal.
const hasUltraSafeDatingProfileVerdict =
  (
    t.includes("tinder") ||
    t.includes("bumble") ||
    t.includes("badoo") ||
    t.includes("app de citas") ||
    t.includes("perfil de citas")
  ) &&
  (
    t.includes("no hay banderas rojas claras") ||
    t.includes("no se detectan señales claras") ||
    t.includes("no se detectan senales claras") ||
    t.includes("no veo señales claras de peligro") ||
    t.includes("no veo senales claras de peligro") ||
    t.includes("no hay señales claras de peligro") ||
    t.includes("no hay senales claras de peligro") ||
    t.includes("no hay señales visibles de urgencia") ||
    t.includes("no hay senales visibles de urgencia")
  ) &&
  (
    t.includes("verificación visible") ||
    t.includes("verificacion visible") ||
    t.includes("muestra una verificación visible") ||
    t.includes("muestra una verificacion visible") ||
    t.includes("perfil tiene una verificación visible") ||
    t.includes("perfil tiene una verificacion visible") ||
    t.includes("suma confianza") ||
    t.includes("buen indicio")
  ) &&
  !t.includes("aparece reutilizada") &&
  !t.includes("foto reutilizada") &&
  !t.includes("imagen reutilizada") &&
  !t.includes("foto robada") &&
  !t.includes("imagen robada") &&
  !t.includes("perfil falso") &&
  !t.includes("catfish") &&
  !t.includes("catfishing") &&
  !t.includes("pide dinero") &&
  !t.includes("pedir dinero") &&
  !t.includes("enviar dinero") &&
  !t.includes("envíes dinero") &&
  !t.includes("envies dinero") &&
  !t.includes("enlace sospechoso") &&
  !t.includes("enlaces sospechosos") &&
  !t.includes("amenaza") &&
  !t.includes("chantaje") &&
  !t.includes("presión fuerte") &&
  !t.includes("presion fuerte");

if (hasUltraSafeDatingProfileVerdict) {
  return "safe";
}

const percentScore = extractRiskPercentFromAssistantText(t);

if (typeof percentScore === "number") {
  return riskStatusFromScore(percentScore);
}

// ✅ BANCO + LLAMADA + CÓDIGO SMS/OTP = riesgo alto.
// Este patrón debe ganar antes que las reglas suaves de teléfono.
// Es vishing: phishing por llamada, normalmente usando códigos SMS/OTP.
const hasBankPhoneCodeFraud =
  (
    t.includes("vishing") ||
    t.includes("phishing por llamada") ||
    t.includes("phishing por voz") ||
    t.includes("llamada falsa") ||
    t.includes("llamada de banco") ||
    t.includes("llamada del banco") ||
    t.includes("diciendo que era del banco") ||
    t.includes("diciendo que era tu banco") ||
    t.includes("diciendo que era mi banco") ||
    t.includes("supuesto banco") ||
    t.includes("banco")
  ) &&
  (
    t.includes("código sms") ||
    t.includes("codigo sms") ||
    t.includes("código de verificación") ||
    t.includes("codigo de verificacion") ||
    t.includes("código de seguridad") ||
    t.includes("codigo de seguridad") ||
    t.includes("otp") ||
    t.includes("clave de un solo uso") ||
    t.includes("clave temporal") ||
    t.includes("no des ningún código") ||
    t.includes("no des ningun codigo") ||
    t.includes("no compartas el código") ||
    t.includes("no compartas el codigo") ||
    t.includes("no dar ningún código") ||
    t.includes("no dar ningun codigo")
  );

const hasCrossChannelPhoneFraud =
  (
    t.includes("vishing") ||
    t.includes("phishing por llamada") ||
    t.includes("llamada falsa") ||
    t.includes("llamada") ||
    t.includes("por teléfono") ||
    t.includes("por telefono")
  ) &&
  (
    t.includes("whatsapp") ||
    t.includes("seguir por whatsapp") ||
    t.includes("continuar por whatsapp") ||
    t.includes("llevarte a whatsapp") ||
    t.includes("sacarte del canal oficial")
  ) &&
  (
    t.includes("banco") ||
    t.includes("cargo") ||
    t.includes("operación") ||
    t.includes("operacion") ||
    t.includes("cuenta") ||
    t.includes("tarjeta")
  );

const hasStrongOtpFraudLanguage =
  (
    t.includes("riesgo alto") ||
    t.includes("intento de fraude") ||
    t.includes("intento de estafa") ||
    t.includes("señales claras de intento de fraude") ||
    t.includes("senales claras de intento de fraude") ||
    t.includes("señales claras de fraude") ||
    t.includes("senales claras de fraude")
  ) &&
  (
    t.includes("código sms") ||
    t.includes("codigo sms") ||
    t.includes("otp") ||
    t.includes("código de verificación") ||
    t.includes("codigo de verificacion")
  );

if (hasBankPhoneCodeFraud || hasCrossChannelPhoneFraud || hasStrongOtpFraudLanguage) {
  return "high";
}

// ✅ TELÉFONO: solo número válido + sin señal fuerte = verde/neutro.
// Evita puntos naranjas cuando Vonu solo dice prudencia normal
// ante un número de teléfono sin contexto peligroso.
const looksLikeLowRiskPhoneOnlyAnswer =
  (
    t.includes("número de teléfono") ||
    t.includes("numero de telefono") ||
    t.includes("llamada sospechosa") ||
    t.includes("móvil válido") ||
    t.includes("movil valido") ||
    t.includes("móvil español válido") ||
    t.includes("movil espanol valido") ||
    t.includes("móvil en españa") ||
    t.includes("movil en espana")
  ) &&
  (
    t.includes("solo por el número") ||
    t.includes("solo por el numero") ||
    t.includes("por sí solo") ||
    t.includes("por si solo") ||
    t.includes("no veo una señal técnica fuerte") ||
    t.includes("no veo una senal tecnica fuerte") ||
    t.includes("no se ve una señal técnica fuerte") ||
    t.includes("no se ve una senal tecnica fuerte") ||
    t.includes("no muestra señales claras") ||
    t.includes("no muestra senales claras") ||
    t.includes("no demuestra estafa") ||
    t.includes("no prueba una estafa") ||
    t.includes("riesgo bajo")
  );

const hasRealPhoneDangerContext =
  t.includes("riesgo alto") ||
  t.includes("riesgo muy alto") ||
  t.includes("riesgo crítico") ||
  t.includes("riesgo critico") ||
  t.includes("estafa clara") ||
  t.includes("intento de estafa") ||
  t.includes("suplantación clara") ||
  t.includes("suplantacion clara") ||
  t.includes("parece phishing") ||
  t.includes("parece vishing") ||
  t.includes("no des el código") ||
  t.includes("no des el codigo") ||
  t.includes("no compartas el código") ||
  t.includes("no compartas el codigo") ||
  t.includes("código sms") ||
  t.includes("codigo sms") ||
  t.includes("otp") ||
  t.includes("bizum") ||
  t.includes("transferencia") ||
  t.includes("datos bancarios") ||
  t.includes("instalar una app") ||
  t.includes("acceso remoto") ||
  t.includes("diciendo que era tu banco") ||
  t.includes("diciendo que era mi banco") ||
  t.includes("bloquear un cargo") ||
  t.includes("cargo no reconocido");

if (looksLikeLowRiskPhoneOnlyAnswer && !hasRealPhoneDangerContext) {
  return "safe";
}

  // ✅ OVERRIDE PRIORITARIO: perfil de citas tranquilo/verificado = verde.
// Esto debe ir arriba del todo, antes de cualquier regla de "precaución".
const hasLowRiskDatingProfileVerdict =
  (
    t.includes("tinder") ||
    t.includes("bumble") ||
    t.includes("badoo") ||
    t.includes("app de citas") ||
    t.includes("perfil de citas")
  ) &&
  (
    t.includes("no hay banderas rojas claras") ||
    t.includes("no se detectan señales claras") ||
    t.includes("no se detectan senales claras") ||
    t.includes("no veo señales claras de peligro") ||
    t.includes("no veo senales claras de peligro") ||
    t.includes("no veo señales claras de riesgo") ||
    t.includes("no veo senales claras de riesgo") ||
    t.includes("no hay señales claras de peligro") ||
    t.includes("no hay senales claras de peligro") ||
    t.includes("no hay señales visibles de urgencia") ||
    t.includes("no hay senales visibles de urgencia") ||
    t.includes("no hay señales visibles de urgencia, dinero") ||
    t.includes("no hay senales visibles de urgencia, dinero") ||
    t.includes("verificación visible") ||
    t.includes("verificacion visible") ||
    t.includes("perfil tiene una verificación visible") ||
    t.includes("perfil tiene una verificacion visible")
  );

const hasCalmVerifiedDatingAnswer =
  (
    t.includes("tinder") ||
    t.includes("bumble") ||
    t.includes("badoo") ||
    t.includes("app de citas") ||
    t.includes("perfil de citas")
  ) &&
  (
    t.includes("no hay banderas rojas claras") ||
    t.includes("no se detectan señales claras") ||
    t.includes("no se detectan senales claras") ||
    t.includes("no veo señales claras de peligro") ||
    t.includes("no veo senales claras de peligro") ||
    t.includes("no hay señales claras de peligro") ||
    t.includes("no hay senales claras de peligro")
  ) &&
  (
    t.includes("verificación visible") ||
    t.includes("verificacion visible") ||
    t.includes("perfil tiene una verificación visible") ||
    t.includes("perfil tiene una verificacion visible") ||
    t.includes("muestra una verificación visible") ||
    t.includes("muestra una verificacion visible") ||
    t.includes("suma confianza")
  );

const hasStrongDatingDanger =
  t.includes("aparece reutilizada") ||
  t.includes("foto reutilizada") ||
  t.includes("imagen reutilizada") ||
  t.includes("foto robada") ||
  t.includes("imagen robada") ||
  t.includes("perfil falso") ||
  t.includes("catfish") ||
  t.includes("catfishing") ||
  t.includes("pide dinero") ||
  t.includes("pedir dinero") ||
  t.includes("enviar dinero") ||
  t.includes("envíes dinero") ||
  t.includes("envies dinero") ||
  t.includes("cripto") ||
  t.includes("crypto") ||
  t.includes("bitcoin") ||
  t.includes("trading") ||
  t.includes("enlace sospechoso") ||
  t.includes("enlaces sospechosos") ||
  t.includes("amenaza") ||
  t.includes("chantaje") ||
  t.includes("presión fuerte") ||
  t.includes("presion fuerte");

// ✅ Este caso debe ganar sí o sí:
// Tinder/Bumble/Badoo + apertura tranquila + verificación visible = verde,
// salvo que haya señales fuertes reales.
if (hasCalmVerifiedDatingAnswer && !hasStrongDatingDanger) {
  return "safe";
}

const hasRealDatingDangerInVerdict = hasStrongDatingDanger;

if (hasLowRiskDatingProfileVerdict && !hasRealDatingDangerInVerdict) {
  return "safe";
}

  const isDatingOrSocialProfile =
    t.includes("tinder") ||
    t.includes("bumble") ||
    t.includes("badoo") ||
    t.includes("instagram") ||
    t.includes("facebook") ||
    t.includes("tiktok") ||
    t.includes("perfil") ||
    t.includes("app de citas") ||
    t.includes("red social");

  const isAiImageAnalysis =
    t.includes("ia") ||
    t.includes("inteligencia artificial") ||
    t.includes("generada por ia") ||
    t.includes("generado por ia") ||
    t.includes("imagen generada") ||
    t.includes("foto generada") ||
    t.includes("edición fuerte") ||
    t.includes("edicion fuerte") ||
    t.includes("manipulada") ||
    t.includes("manipulado") ||
    t.includes("deepfake");

  const hasReusedImageSignal =
    t.includes("aparece reutilizada") ||
    t.includes("aparece reutilizado") ||
    t.includes("foto reutilizada") ||
    t.includes("imagen reutilizada") ||
    t.includes("aparece en varias fuentes") ||
    t.includes("varias fuentes en la web") ||
    t.includes("varias fuentes distintas") ||
    t.includes("coincidencias completas") ||
    t.includes("foto reciclada") ||
    t.includes("imagen reciclada") ||
    t.includes("foto robada") ||
    t.includes("imagen robada") ||
    t.includes("no parece una foto única") ||
    t.includes("no parece una foto unica") ||
    t.includes("no parece una foto original") ||
    t.includes("no es una foto original") ||
    t.includes("procedencia dudosa");

  const hasMoneyCryptoOrRealDanger =
    t.includes("pide dinero") ||
    t.includes("pedir dinero") ||
    t.includes("enviar dinero") ||
    t.includes("envíes dinero") ||
    t.includes("envies dinero") ||
    t.includes("transferencia") ||
    t.includes("bizum") ||
    t.includes("tarjeta bancaria") ||
    t.includes("código") ||
    t.includes("codigo") ||
    t.includes("otp") ||
    t.includes("documento") ||
    t.includes("dni") ||
    t.includes("pasaporte") ||
    t.includes("cripto") ||
    t.includes("crypto") ||
    t.includes("bitcoin") ||
    t.includes("trading") ||
    t.includes("inversión") ||
    t.includes("inversion") ||
    t.includes("fotos íntimas") ||
    t.includes("fotos intimas") ||
    t.includes("sextorsión") ||
    t.includes("sextorsion") ||
    t.includes("amenaza") ||
    t.includes("chantaje") ||
    t.includes("presión fuerte") ||
    t.includes("presion fuerte") ||
    t.includes("urgencia sospechosa");

  const hasClearAiFakeConclusion =
    isAiImageAnalysis &&
    (
      t.includes("no parece una foto real") ||
      t.includes("no parece una imagen real") ||
      t.includes("no la daría por una foto real") ||
      t.includes("no la daria por una foto real") ||
      t.includes("no la daría por una foto real sin más") ||
      t.includes("no la daria por una foto real sin mas") ||
      t.includes("hay varias anomalías") ||
      t.includes("hay varias anomalias") ||
      t.includes("anomalías físicas") ||
      t.includes("anomalias fisicas") ||
      t.includes("generada o manipulada por ia") ||
      t.includes("generado o manipulado por ia") ||
      t.includes("generada o editada con ia") ||
      t.includes("generado o editado con ia") ||
      t.includes("sugieren que esta imagen está generada por ia") ||
      t.includes("sugieren que esta imagen esta generada por ia") ||
      t.includes("sugieren que es generada o manipulada por ia") ||
      t.includes("imagen está generada por ia") ||
      t.includes("imagen esta generada por ia") ||
      t.includes("señales compatibles con ia") ||
      t.includes("senales compatibles con ia") ||
      t.includes("señales claras de ia") ||
      t.includes("senales claras de ia") ||
      t.includes("postura físicamente improbable") ||
      t.includes("postura fisicamente improbable") ||
      t.includes("postura físicamente imposible") ||
      t.includes("postura fisicamente imposible") ||
      t.includes("postura antinatural") ||
      t.includes("proporciones inusuales") ||
      t.includes("extremidades deformes") ||
      t.includes("brazos y piernas deformes") ||
      t.includes("piernas en vez de brazos") ||
      t.includes("cabeza doblada") ||
      t.includes("pies deformes") ||
      t.includes("manos deformes") ||
      t.includes("calzado deformado") ||
      t.includes("zapatillas deformadas") ||
      t.includes("suelas imposibles") ||
      t.includes("apoyo poco realista") ||
      t.includes("no transmite un contacto real") ||
      t.includes("mal apoyado") ||
      t.includes("flotando") ||
      t.includes("sombras incoherentes") ||
      t.includes("sombra no corresponde") ||
      t.includes("contacto con el suelo no parece realista") ||
      t.includes("detalles visuales que me hacen dudar")
    );

  if (hasClearAiFakeConclusion) {
    return "warning";
  }

  const hasCalmDatingOpening =
    isDatingOrSocialProfile &&
    (
      t.includes("en principio, no se detectan señales claras") ||
      t.includes("en principio, no se detectan senales claras") ||
      t.includes("en principio, no veo indicios claros") ||
      t.includes("no hay banderas rojas claras") ||
      t.includes("no se detectan señales claras") ||
      t.includes("no se detectan senales claras") ||
      t.includes("no hay señales claras de riesgo") ||
      t.includes("no hay senales claras de riesgo") ||
      t.includes("no hay señales claras por las que preocuparse") ||
      t.includes("no hay senales claras por las que preocuparse") ||
      t.includes("no veo indicios claros de que este perfil sea peligroso") ||
      t.includes("no veo indicios claros de que este perfil de tinder sea peligroso") ||
      t.includes("no veo señales típicas de perfil falso") ||
      t.includes("no veo senales tipicas de perfil falso")
    );

  const hasVerifiedDatingSignal =
    isDatingOrSocialProfile &&
    (
      t.includes("perfil está verificado") ||
      t.includes("perfil esta verificado") ||
      t.includes("perfil verificado") ||
      t.includes("foto está verificada") ||
      t.includes("foto esta verificada") ||
      t.includes("foto verificada") ||
      t.includes("verificación visible") ||
      t.includes("verificacion visible") ||
      t.includes("la foto está verificada") ||
      t.includes("la foto esta verificada")
    );

  const hasDatingHardNegative =
    hasMoneyCryptoOrRealDanger ||
    hasReusedImageSignal ||
    t.includes("perfil falso") ||
    t.includes("catfish") ||
    t.includes("catfishing") ||
    t.includes("foto robada") ||
    t.includes("imagen robada") ||
    t.includes("aparece reutilizada") ||
    t.includes("aparece en varias fuentes") ||
    t.includes("precaución alta") ||
    t.includes("precaucion alta") ||
    t.includes("bastante precaución") ||
    t.includes("bastante precaucion");

  // ✅ Caso importante:
  // Perfil Tinder/Bumble/Badoo/Instagram normal o verificado, sin señales fuertes:
  // verde aunque Vonu recomiende prudencia normal.
  if (
    isDatingOrSocialProfile &&
    hasCalmDatingOpening &&
    !hasDatingHardNegative
  ) {
    return "safe";
  }

  if (
    isDatingOrSocialProfile &&
    hasVerifiedDatingSignal &&
    !hasDatingHardNegative
  ) {
    return "safe";
  }

  // ✅ Foto reutilizada: naranja.
  // No la subimos a rojo solo por reutilización.
  if (hasReusedImageSignal) {
    return "warning";
  }

  const hasLowRiskNormalImageTone =
    (
      t.includes("parece una selfie natural") ||
      t.includes("parece una foto natural") ||
      t.includes("parece una imagen natural") ||
      t.includes("parece una foto real") ||
      t.includes("parece una selfie real") ||
      t.includes("tomada al aire libre") ||
      t.includes("sin señales evidentes de manipulación") ||
      t.includes("sin senales evidentes de manipulacion") ||
      t.includes("sin señales claras de manipulación") ||
      t.includes("sin senales claras de manipulacion") ||
      t.includes("sin señales evidentes de edición fuerte") ||
      t.includes("sin senales evidentes de edicion fuerte") ||
      t.includes("sin anomalías visibles") ||
      t.includes("sin anomalias visibles") ||
      t.includes("no hay anomalías visibles") ||
      t.includes("no hay anomalias visibles") ||
      t.includes("no muestra señales claras de edición") ||
      t.includes("no muestra senales claras de edicion") ||
      t.includes("no parece generada por ia") ||
      t.includes("no parece generado por ia") ||
      t.includes("no parece ia pura")
    ) &&
    !hasReusedImageSignal &&
    !hasMoneyCryptoOrRealDanger &&
    !hasClearAiFakeConclusion &&
    !t.includes("perfil falso") &&
    !t.includes("catfish") &&
    !t.includes("estafa");

  if (hasLowRiskNormalImageTone) {
    return "safe";
  }

  const dangerSignals = [
    "riesgo crítico",
    "riesgo critico",
    "riesgo muy alto",
    "peligro muy alto",
    "probabilidad muy alta",
    "estafa confirmada",
    "fraude confirmado",
    "phishing confirmado",
    "smishing confirmado",
    "alerta máxima",
    "alerta maxima",
    "no pulses",
    "no abras el enlace",
    "no pagues",
    "no envíes dinero",
    "no envies dinero",
    "no compartas códigos",
    "no compartas codigos",
    "malware",
    "relacionado con malware",
    "asociado a malware",
    "amenaza conocida",
    "no lo abras",
    "no lo descargues",
    "no lo ejecutes",
    "no abras ni descargues",
    "podría infectar",
    "podria infectar",
    "robar información",
    "robar informacion",
    "script malicioso",
    "archivo .sh",
    "ip directa",
    "vishing confirmado",
"robo de cuenta bancaria",
"autorizar operaciones",
"autorizar una operación",
"autorizar una operacion",
  ];

  if (dangerSignals.some((s) => t.includes(s))) {
    return "danger";
  }

  const highSignals = [
    "riesgo alto",
    "alto riesgo",
    "intento de estafa",
    "huele a intento de estafa",
    "muy sospechoso",
    "parece phishing",
    "parece smishing",
    "parece una estafa",
    "huele a estafa",
    "yo no pagaría",
    "yo no pagaria",
    "yo no pulsaría",
    "yo no pulsaria",
    "señales de fraude",
    "senales de fraude",
    "señales claras de riesgo",
    "senales claras de riesgo",
    "riesgo medio-alto",
    "precaución media-alta",
    "precaucion media-alta",
    "puede ser abusivo",
    "puede ser abusiva",
    "puede ser reclamable",
    "cláusula abusiva",
    "clausula abusiva",
    "no firmaría",
    "no firmaria",
    "no firmes",
    "no pagaría",
    "no pagaria",
    "no pagues nada extra",
    "puede afectar a dinero",
    "obligación contractual",
    "obligacion contractual",
    "penalización económica",
    "penalizacion economica",
    "comprobación de seguridad",
    "comprobacion de seguridad",
    "enlace malicioso",
    "script para sistemas tipo linux",
    "puerto raro",
    "vishing",
"phishing por llamada",
"phishing por voz",
"llamada falsa",
"código sms",
"codigo sms",
"código de verificación",
"codigo de verificacion",
"otp",
"intento de fraude",
"señales claras de intento de fraude",
"senales claras de intento de fraude",
"no des ningún código",
"no des ningun codigo",
"no dar ningún código",
"no dar ningun codigo",
"no compartas el código",
"no compartas el codigo",
"supuesto banco",
"sacarte del canal oficial",
"seguir por whatsapp",
"continuar por whatsapp",
  ];

  if (highSignals.some((s) => t.includes(s))) {
    return "high";
  }

  if (
    isAiImageAnalysis &&
    (
      t.includes("edición fuerte") ||
      t.includes("edicion fuerte") ||
      t.includes("retoque digital") ||
      t.includes("retocada") ||
      t.includes("retocado") ||
      t.includes("probabilidad de edición") ||
      t.includes("probabilidad de edicion") ||
      t.includes("podría estar editada") ||
      t.includes("podria estar editada") ||
      t.includes("podría ser ia") ||
      t.includes("podria ser ia") ||
      t.includes("podría estar manipulada") ||
      t.includes("podria estar manipulada") ||
      t.includes("duda razonable") ||
      t.includes("demasiado perfecta") ||
      t.includes("demasiado pulida") ||
      t.includes("no puedo confirmarlo") ||
      t.includes("no se puede confirmar") ||
      t.includes("imagen sola no permite")
    )
  ) {
    return "warning";
  }

  const warningSignals = [
    "riesgo medio",
    "precaución",
    "precaucion",
    "cuidado",
    "no concluyente",
    "no puedo confirmarlo",
    "conviene revisar",
    "revisaría",
    "revisaria",
    "me haría comprobar",
    "me haria comprobar",
    "antes de seguir",
    "verifica",
    "compruébalo",
    "compruebalo",
    "merece revisarse",
    "merece mirarlo",
    "duda razonable",
    "confianza media",
    "confianza media-baja",
    "no se puede asegurar",
    "no se puede confirmar",
    "no significa que sea scam",
    "posible indicio",
    "no verificado",
    "no veo verificación",
    "no aparece verificación",
    "no aparece verificado",
    "no se ve verificación",
    "perfil no verificado",
    "guarda copia",
    "guarda pruebas",
    "pídelo por escrito",
    "pidelo por escrito",
  ];

  if (warningSignals.some((s) => t.includes(s))) {
    return "warning";
  }

  const safeSignals = [
    "riesgo bajo",
    "bajo riesgo",
    "probabilidad baja",
    "probabilidad estimada baja",
    "pinta bien",
    "parece fiable",
    "parece seguro",
    "parece segura",
    "parece legítima",
    "parece legitima",
    "parece legítimo",
    "parece legitimo",
    "parece oficial",
    "web oficial",
    "dominio oficial",
    "dominio reconocido",
    "marca conocida",
    "puedes usarla con confianza",
    "puedes usarlo con confianza",
    "puedes usarla con tranquilidad",
    "puedes usarlo con tranquilidad",
    "tranquilidad razonable",
    "confianza razonable",
    "no aparece marcada",
    "no aparece marcado",
    "no aparece marcada en esta primera revisión",
    "no aparece marcado en esta primera revisión",
    "no aparece relacionada con malware",
    "no aparece relacionado con malware",
    "no aparece como peligrosa",
    "no aparece como peligroso",
    "no parece una estafa",
    "no parece phishing",
    "no parece sospechoso",
    "es un buen indicio",
  ];

  if (safeSignals.some((s) => t.includes(s))) {
    return "safe";
  }

  return null;
}

function inferRiskStatusFromUserText(text: string): "safe" | "warning" | "high" | "danger" | null {
  const t = String(text ?? "").toLowerCase();

  if (!t.trim()) return null;

  const veryHighRisk = [
    "sms",
    "correos",
    "seur",
    "dhl",
    "aduanas",
    "pagar",
    "1,99",
    "1.99",
    "enlace",
    "link",
    "url",
    "banco",
    "bizum",
    "tarjeta",
    "código",
    "codigo",
    "whatsapp",
    "telegram",
    "cripto",
    "crypto",
    "bitcoin",
    "trading",
    "inversión",
    "inversion",
    "tinder",
    "app de citas",
    "instagram",
    "oportunidad única",
    "oportunidad unica",
    "urgente",
        "contrato",
    "cláusula",
    "clausula",
    "abusiva",
    "abusivo",
    "alquiler",
    "arrendamiento",
    "fianza",
    "permanencia",
    "penalización",
    "penalizacion",
    "pagar un año",
    "pagar todo el año",
    "factura",
    "recibo",
    "cobro",
    "me han cobrado",
    "servicio no contratado",
    "suscripción",
    "suscripcion",
    "darme de baja",
    "cancelar",
    "garantía",
    "garantia",
    "devolución",
    "devolucion",
  ];

  const score = veryHighRisk.reduce((acc, word) => acc + (t.includes(word) ? 1 : 0), 0);

  if (score >= 4) return "high";
  if (score >= 2) return "warning";

  return null;
}

function looksLikeNeutralIdentityLookupFromUserText(text: string): boolean {
  const t = String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!t.trim()) return false;

  const asksIdentity =
    t.includes("quien es") ||
    t.includes("quien era") ||
    t.includes("como se llama") ||
    t.includes("sabes quien") ||
    t.includes("sabes quien es") ||
    t.includes("cual es su nombre") ||
    t.includes("cual es el nombre") ||
    t.includes("identificar") ||
    t.includes("identificame") ||
    t.includes("nombre de esta persona") ||
    t.includes("nombre de la chica") ||
    t.includes("nombre de este chico");

  const looksLikePersonContext =
    t.includes("chica") ||
    t.includes("chico") ||
    t.includes("mujer") ||
    t.includes("hombre") ||
    t.includes("persona") ||
    t.includes("famosa") ||
    t.includes("famoso") ||
    t.includes("actriz") ||
    t.includes("actor") ||
    t.includes("cantante") ||
    t.includes("modelo") ||
    t.includes("influencer") ||
    t.includes("tiktoker") ||
    t.includes("instagram") ||
    t.includes("redes") ||
    t.includes("redes sociales") ||
    t.includes("estrella porno") ||
    t.includes("porno");

  const hasRealRiskContext =
    t.includes("estafa") ||
    t.includes("estaf") ||
    t.includes("scam") ||
    t.includes("fraude") ||
    t.includes("perfil falso") ||
    t.includes("fake") ||
    t.includes("catfish") ||
    t.includes("catfishing") ||
    t.includes("me pide dinero") ||
    t.includes("dinero") ||
    t.includes("inversion") ||
    t.includes("cripto") ||
    t.includes("bitcoin") ||
    t.includes("enlace") ||
    t.includes("link") ||
    t.includes("whatsapp") ||
    t.includes("telegram") ||
    t.includes("amenaza") ||
    t.includes("chantaje") ||
    t.includes("sextorsion") ||
    t.includes("extorsion") ||
    t.includes("menor") ||
    t.includes("grooming") ||
    t.includes("suplantacion") ||
    t.includes("ia") ||
    t.includes("generada por ia") ||
    t.includes("manipulada") ||
    t.includes("foto robada") ||
    t.includes("foto reutilizada");

  return asksIdentity && looksLikePersonContext && !hasRealRiskContext;
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

function makeSmartThreadTitle(text: string) {
  let t = String(text ?? "")
    .trim()
    .replace(/\s+/g, " ");

  if (!t) return "Nueva consulta";

  // Limpieza suave para que no empiece con frases demasiado genéricas.
  t = t
    .replace(/^hola[,!\s]*/i, "")
    .replace(/^buenas[,!\s]*/i, "")
    .replace(/^oye[,!\s]*/i, "")
    .replace(/^vale[,!\s]*/i, "")
    .replace(/^puedes\s+/i, "")
    .replace(/^me puedes\s+/i, "")
    .replace(/^podrías\s+/i, "")
    .replace(/^podrias\s+/i, "")
    .replace(/^quiero\s+/i, "")
    .replace(/^necesito\s+/i, "")
    .trim();

  if (!t) return makeTitleFromText(text);

  // Quitar dos puntos finales típicos de prompts:
  t = t.replace(/[:：]\s*$/g, "").trim();

  // Primera letra en mayúscula si procede.
  t = t.charAt(0).toUpperCase() + t.slice(1);

  return t.length > 44 ? t.slice(0, 44).trim() + "…" : t;
}

function shouldAutoTitleThread(title: string) {
  const t = String(title ?? "").trim().toLowerCase();

  return (
    !t ||
    t === "nueva consulta" ||
    t === "consulta" ||
    t === "nuevo chat" ||
    t === "chat nuevo"
  );
}

const STORAGE_KEY = "vonu_threads_v2";
const STORAGE_BACKUP_KEY = "vonu_threads_v2_backup";
const STORAGE_LAST_GOOD_KEY = "vonu_threads_v2_last_good";
const HOME_URL = "https://vonuai.com";

const MAX_STORED_THREADS = 24;
const MAX_STORED_MESSAGES_PER_THREAD = 80;

function stripHeavyMessageForStorage(message: Message): Message {
  const clean: Message = { ...message };

  // Evitamos guardar imágenes grandes en base64 dentro de localStorage.
  // La imagen completa se usa para el análisis en el momento, pero no debe romper el historial.
  if (typeof clean.image === "string" && clean.image.startsWith("data:")) {
    clean.image = undefined;
  }

  // La miniatura sí se guarda porque es ligera y mantiene el contexto visual del chat.
  if (
    typeof clean.imageThumb === "string" &&
    clean.imageThumb.startsWith("data:") &&
    clean.imageThumb.length > 220_000
  ) {
    clean.imageThumb = undefined;
  }

  // La pizarra/imagen de tutor también puede pesar mucho.
  if (typeof clean.boardImageB64 === "string" && clean.boardImageB64.startsWith("data:")) {
    clean.boardImageB64 = null;
    clean.boardImagePlacement = null;
  }

  return clean;
}

function sanitizeThreadsForStorage(threads: ChatThread[]): ChatThread[] {
  return threads
    .slice(0, MAX_STORED_THREADS)
    .map((thread) => ({
      ...thread,
      messages: (thread.messages ?? [])
        .slice(-MAX_STORED_MESSAGES_PER_THREAD)
        .map(stripHeavyMessageForStorage),
    }));
}

function looksLikeValidStoredThreads(value: unknown): value is ChatThread[] {
  if (!Array.isArray(value)) return false;
  if (!value.length) return false;

  return value.some((thread: any) => {
    if (!thread || typeof thread.id !== "string") return false;
    if (!Array.isArray(thread.messages)) return false;

    return thread.messages.some((message: any) => {
      return (
        message &&
        (message.role === "user" || message.role === "assistant") &&
        (
          typeof message.text === "string" ||
          typeof message.imageThumb === "string"
        )
      );
    });
  });
}

function readStoredThreadsFromLocalStorage() {
  if (typeof window === "undefined") return null;

  const keys = [STORAGE_KEY, STORAGE_LAST_GOOD_KEY, STORAGE_BACKUP_KEY];

  for (const key of keys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (looksLikeValidStoredThreads(parsed)) {
        return parsed;
      }
    } catch {
      // probamos la siguiente copia
    }
  }

  return null;
}

function normalizeRemoteThreadForClient(raw: any): ChatThread | null {
  if (!raw || typeof raw !== "object") return null;

  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : null;

  if (!id) return null;

  const rawMessages = Array.isArray(raw.messages) ? raw.messages : [];

  const messages: Message[] = rawMessages
    .map((m: any) => {
      const role =
        m?.role === "user" || m?.role === "assistant"
          ? m.role
          : null;

      if (!role) return null;

      const text =
        typeof m?.text === "string"
          ? m.text
          : typeof m?.content === "string"
            ? m.content
            : "";

      const imageThumb =
        typeof m?.imageThumb === "string" && m.imageThumb.startsWith("data:image")
          ? m.imageThumb
          : undefined;

      if (!text.trim() && !imageThumb) return null;

      const msg: Message = {
        id:
          typeof m?.id === "string" && m.id.trim()
            ? m.id.trim()
            : crypto.randomUUID(),
        role,
        text,
        imageThumb,
        streaming: false,
        pizarra: typeof m?.pizarra === "string" ? m.pizarra : null,
        boardImageB64: null,
        boardImagePlacement: null,
      };

      if (typeof m?.revealMs === "number" && Number.isFinite(m.revealMs)) {
        msg.revealMs = m.revealMs;
      }

      return msg;
    })
    .filter(Boolean) as Message[];

  if (!messages.length) return null;

  const rawTitle =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : "Nueva consulta";

  const firstUserText =
    messages.find((m) => m.role === "user" && typeof m.text === "string" && m.text.trim())
      ?.text ?? "";

  const title =
    shouldAutoTitleThread(rawTitle) && firstUserText.trim()
      ? makeSmartThreadTitle(firstUserText)
      : rawTitle;

  const updatedAt =
    typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt)
      ? raw.updatedAt
      : Date.now();

  const mode: ThreadMode = raw.mode === "tutor" ? "tutor" : "chat";

  const level =
    raw?.tutorProfile?.level === "kid" ||
    raw?.tutorProfile?.level === "teen" ||
    raw?.tutorProfile?.level === "adult"
      ? raw.tutorProfile.level
      : "adult";

  return {
    id,
    title,
    updatedAt,
    mode,
    tutorProfile: { level },
    messages,
  };
}

function pickBetterThread(localThread: ChatThread, cloudThread: ChatThread) {
  const localCount = localThread.messages?.length ?? 0;
  const cloudCount = cloudThread.messages?.length ?? 0;

  // Si uno tiene más mensajes, suele ser el más completo.
  if (cloudCount > localCount) return cloudThread;
  if (localCount > cloudCount) return localThread;

  const localTitleIsGeneric = shouldAutoTitleThread(localThread.title);
  const cloudTitleIsGeneric = shouldAutoTitleThread(cloudThread.title);

  // Si el remoto tiene buen título y local sigue genérico, gana remoto.
  if (localTitleIsGeneric && !cloudTitleIsGeneric) return cloudThread;

  // Si local tiene buen título y remoto sigue genérico, gana local.
  if (!localTitleIsGeneric && cloudTitleIsGeneric) return localThread;

  // Si tienen lo mismo, gana el más reciente.
  return cloudThread.updatedAt > localThread.updatedAt
    ? cloudThread
    : localThread;
}

function mergeLocalAndCloudThreads(
  localThreads: ChatThread[],
  cloudThreads: ChatThread[]
) {
  const byId = new Map<string, ChatThread>();

  for (const thread of localThreads) {
    if (!thread?.id) continue;
    byId.set(thread.id, thread);
  }

  for (const cloudThread of cloudThreads) {
    if (!cloudThread?.id) continue;

    const localThread = byId.get(cloudThread.id);

    if (!localThread) {
      byId.set(cloudThread.id, cloudThread);
      continue;
    }

    byId.set(
      cloudThread.id,
      pickBetterThread(localThread, cloudThread)
    );
  }

  return Array.from(byId.values())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_STORED_THREADS);
}

// ✅ regla: tras 1 mensaje, pedir login/pago
const GUEST_MESSAGE_LIMIT = 1;

const GUEST_FREE_MESSAGE_USED_KEY = "vonu_guest_free_message_used_v1";

function hasGuestFreeMessageBeenUsed() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(GUEST_FREE_MESSAGE_USED_KEY) === "1";
  } catch {
    return false;
  }
}

function markGuestFreeMessageAsUsed() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(GUEST_FREE_MESSAGE_USED_KEY, "1");
  } catch {
    // No rompemos el envío si localStorage falla.
  }
}

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

function normalizeRepeatedVariableText(text: string) {
  let s = String(text ?? "");

  // Variables de varias letras que a veces llegan repetidas:
  // VFVFVFVF -> VF
  // VPVPVPVP -> VP
  // VAVAVA -> VA
  // PVPVPV -> PV
  const multiLetterVariables = ["VA", "VF", "VP", "PV", "CF", "FV"];

  for (const variable of multiLetterVariables) {
    const re = new RegExp(`\\b(?:${variable}){2,}\\b`, "gi");

    s = s.replace(re, (match) => {
      return match.slice(0, variable.length);
    });
  }

  // Variables de una sola letra repetidas:
  // iii -> i
  // nnn -> n
  // CCC -> C
  // RRR -> R
  s = s.replace(/\b([A-Za-z])\1{1,}\b/g, "$1");

  return s;
}

function getVonuCopyBlockLabel(kind: string) {
  const k = String(kind ?? "").toLowerCase();

  if (k === "email" || k === "correo") return "Email para copiar";
  if (k === "mensaje" || k === "whatsapp" || k === "sms") return "Mensaje para copiar";
  if (k === "carta") return "Carta para copiar";
  if (k === "reclamacion" || k === "reclamación") return "Reclamación para copiar";
  if (k === "codigo" || k === "code") return "Código";
  if (k === "texto") return "Texto para copiar";

  return "Texto para copiar";
}

function VonuCopyBlock({ kind, text }: { kind: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const label = getVonuCopyBlockLabel(kind);
  const cleanText = String(text ?? "").replace(/\n+$/g, "");

  async function copyBlock() {
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch (err) {
      console.error("No se pudo copiar el bloque:", err);
    }
  }

  return (
    <div
  className="not-prose my-4 mx-px box-border w-[calc(100%-2px)] min-w-0 max-w-full overflow-hidden rounded-[22px] border border-transparent bg-[#fbfaf7] outline outline-1 -outline-offset-1 outline-zinc-200"
  style={{ boxShadow: "none" }}
>
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 bg-white/55 px-4 py-2.5">
        <div className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </div>

        <button
          type="button"
          onClick={copyBlock}
          className={[
            "shrink-0 rounded-full border px-3 py-1 text-[12px] font-semibold transition active:scale-95",
            copied
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50",
          ].join(" ")}
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <pre
  className="m-0 box-border w-full min-w-0 max-w-full overflow-x-hidden whitespace-pre-wrap break-words px-4 py-3.5 text-[13px] leading-[1.72] text-zinc-950 [overflow-wrap:anywhere] md:text-[13.5px]"
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      >
        {cleanText}
      </pre>
    </div>
  );
}

function renderTextWithInlineExponents(text: string, keyPrefix = "exp") {
  const s = String(text ?? "");
  if (!s) return s;

  // Convierte texto normal tipo:
  // (1+0,08)^2  -> (1+0,08)² visualmente como <sup>2</sup>
  // x^n         -> xⁿ visualmente como <sup>n</sup>
  // NO toca KaTeX porque renderChildrenWithFractions ya evita entrar en elementos .katex.
  const re = /\^(?:\{([^}\n]{1,12})\}|([A-Za-z0-9]{1,6}))/g;

  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let count = 0;

  while ((m = re.exec(s)) !== null) {
    const start = m.index;
    const end = re.lastIndex;

    if (start > last) {
      parts.push(s.slice(last, start));
    }

    const exp = String(m[1] ?? m[2] ?? "").trim();

    parts.push(
      <sup
        key={`${keyPrefix}-sup-${count}`}
        className="ml-[1px] align-super text-[0.72em] font-semibold leading-none"
      >
        {exp}
      </sup>
    );

    last = end;
    count++;
  }

  if (!parts.length) return s;

  if (last < s.length) {
    parts.push(s.slice(last));
  }

  return parts;
}

function renderTextWithFractions(text: string) {
  const s = normalizeRepeatedVariableText(String(text ?? ""));
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
  //
  // Además, si detecta algo tipo 30.000/(1+0,08), no fuerza fracción rara.
  const re = /(\([^()\n]+\)|\d+)\s*\/\s*(\([^()\n]+\)|\d+)/g;

  const parts: Array<
    | { type: "text"; value: string }
    | { type: "frac"; a: string; b: string }
  > = [];

  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    const start = m.index;
    const end = re.lastIndex;

    const before = s[start - 1] ?? "";
    const after = s[end] ?? "";

    const isInsideDecimalOrThousandsNumber =
      /[A-Za-z0-9.,]/.test(before) || /[A-Za-z0-9.,]/.test(after);

    if (isInsideDecimalOrThousandsNumber) {
      continue;
    }

    if (start > last) {
      parts.push({ type: "text", value: s.slice(last, start) });
    }

    parts.push({
      type: "frac",
      a: String(m[1] ?? "").trim(),
      b: String(m[2] ?? "").trim(),
    });

    last = end;
  }

  if (last < s.length) {
    parts.push({ type: "text", value: s.slice(last) });
  }

  if (!parts.length) {
    return renderTextWithInlineExponents(s, "plain");
  }

  return parts.map((part, index) => {
    if (part.type === "text") {
      return (
        <Fragment key={`txt-${index}`}>
          {renderTextWithInlineExponents(part.value, `txt-${index}`)}
        </Fragment>
      );
    }

    return (
      <span
        key={`frac-${index}`}
        className="mx-[2px] inline-flex translate-y-[0.06em] flex-col items-center align-middle text-[0.92em] leading-none"
      >
        <span className="border-b border-zinc-700 px-[2px] pb-[1px]">
          {renderTextWithInlineExponents(part.a, `frac-${index}-a`)}
        </span>
        <span className="px-[2px] pt-[1px]">
          {renderTextWithInlineExponents(part.b, `frac-${index}-b`)}
        </span>
      </span>
    );
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

      const className =
        typeof el.props?.className === "string" ? el.props.className : "";

      // ✅ MUY IMPORTANTE:
      // No tocar nunca el árbol interno de KaTeX.
      // Si renderChildrenWithFractions entra dentro de KaTeX,
      // puede duplicar variables como VA, VF, i, n -> VAVAVA, VFVFVF, iii, nnn.
      const isKatexInternalElement =
        className.includes("katex") ||
        className.includes("katex-mathml") ||
        className.includes("katex-html") ||
        className.includes("mord") ||
        className.includes("mop") ||
        className.includes("mbin") ||
        className.includes("mrel") ||
        className.includes("mopen") ||
        className.includes("mclose") ||
        className.includes("mpunct") ||
        className.includes("mfrac") ||
        className.includes("msupsub") ||
        className.includes("sqrt") ||
        className.includes("root") ||
        className.includes("vlist") ||
        className.includes("vlist-t") ||
        className.includes("base") ||
        className.includes("strut") ||
        className.includes("pstrut") ||
        className.includes("mspace");

      if (isKatexInternalElement) {
        return child;
      }

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

    // Corrige fórmulas trigonométricas que llegan como LaTeX suelto en viñetas:
  //
  // - \cos(\theta) =
  //   \dfrac{...}{...}
  //
  // pasa a:
  //
  // $$
  // \cos(\theta) = \dfrac{...}{...}
  // $$
  const trigFunctions = "sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan";

  const bareTrigTwoLineRegex = new RegExp(
    `^\\s*(?:[-*]|[•●])\\s*(\\\\(?:${trigFunctions})[^\\n]*?=\\s*)\\n+\\s*(\\\\(?:dfrac|frac)\\{[^\\n]+\\}\\{[^\\n]+\\})\\s*$`,
    "gim"
  );

  s = s.replace(bareTrigTwoLineRegex, (_match, left, right) => {
    return `\n$$\n${String(left).trim()}${String(right).trim()}\n$$\n`;
  });

  // También corrige si viene todo en una sola línea:
  // - \cos(\theta) = \dfrac{...}{...}
  const bareTrigOneLineRegex = new RegExp(
    `^\\s*(?:[-*]|[•●])\\s*(\\\\(?:${trigFunctions})[^\\n]*?=\\s*\\\\(?:dfrac|frac)\\{[^\\n]+\\}\\{[^\\n]+\\})\\s*$`,
    "gim"
  );

  s = s.replace(bareTrigOneLineRegex, (_match, formula) => {
    return `\n$$\n${String(formula).trim()}\n$$\n`;
  });

  // Convierte etiquetas matemáticas simples a texto legible.
  // Ejemplos:
  // VA -> VA
  // \vec{a} -> Vector a
  // \theta -> θ
  // C_0 -> C_0
  // a_x -> a_x
  //
  // Si detecta una fórmula real, devuelve null y NO la toca.
  const simpleMathLabelToText = (rawLabel: string) => {
    let label = String(rawLabel ?? "").trim();

    if (!label || label.length > 60) return null;

    // Si parece una fórmula real, no convertir.
    const looksLikeRealFormula =
      label.includes("=") ||
      label.includes("+") ||
      label.includes("-") ||
      label.includes("*") ||
      label.includes("/") ||
      label.includes("\\frac") ||
      label.includes("\\dfrac") ||
      label.includes("\\sum") ||
      label.includes("\\int") ||
      label.includes("\\sqrt") ||
      label.includes("\\lim");

    if (looksLikeRealFormula) return null;

    // Vectores
    label = label.replace(/\\vec\s*\{\s*([A-Za-z])\s*\}/g, "Vector $1");
    label = label.replace(/\\overrightarrow\s*\{\s*([A-Za-z])\s*\}/g, "Vector $1");
    label = label.replace(/\\mathbf\s*\{\s*([A-Za-z])\s*\}/g, "Vector $1");

    // Subíndices comunes: C_{0}, C_0, a_x...
    label = label.replace(/([A-Za-z])_\{?([A-Za-z0-9]+)\}?/g, "$1_$2");

    // Letras griegas más habituales en mates/física/estadística
    const greek: Record<string, string> = {
      alpha: "α",
      beta: "β",
      gamma: "γ",
      delta: "δ",
      Delta: "Δ",
      epsilon: "ε",
      theta: "θ",
      lambda: "λ",
      mu: "μ",
      pi: "π",
      rho: "ρ",
      sigma: "σ",
      Sigma: "Σ",
      tau: "τ",
      phi: "φ",
      omega: "ω",
      Omega: "Ω",
    };

    for (const [name, symbol] of Object.entries(greek)) {
      label = label.replace(new RegExp(`\\\\${name}\\b`, "g"), symbol);
    }

    label = label
      .replace(/\\,/g, " ")
      .replace(/[{}]/g, "")
      .replace(/\\/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!label || label.length > 40) return null;

    return label;
  };

  // Caso 1:
  // • \( \vec{a} = (3, 4) \)
  // -> • **Vector a** = (3, 4)
  s = s.replace(
    /^(\s*(?:[-*]|[•●])\s*)\\\(\s*([^=\n]{1,60})\s*=\s*([^\n]+?)\s*\\\)\s*$/gm,
    (_match, prefix, rawLabel, value) => {
      const label = simpleMathLabelToText(rawLabel);
      if (!label) return _match;
      return `${prefix}**${label}** = ${String(value).trim()}`;
    }
  );

  // Caso 2:
  // • $ \vec{a} = (3, 4) $
  // -> • **Vector a** = (3, 4)
  s = s.replace(
    /^(\s*(?:[-*]|[•●])\s*)\$\s*([^=$\n]{1,60})\s*=\s*([^$\n]+?)\s*\$\s*$/gm,
    (_match, prefix, rawLabel, value) => {
      const label = simpleMathLabelToText(rawLabel);
      if (!label) return _match;
      return `${prefix}**${label}** = ${String(value).trim()}`;
    }
  );

  // Caso 3:
  // • \( VA \) = valor actual
  // -> • **VA** = valor actual
  //
  // • \( \theta \) = ángulo
  // -> • **θ** = ángulo
  s = s.replace(
    /^(\s*(?:[-*]|[•●])\s*)\\\(\s*([^\n()]{1,60})\s*\\\)\s*=/gm,
    (_match, prefix, rawLabel) => {
      const label = simpleMathLabelToText(rawLabel);
      if (!label) return _match;
      return `${prefix}**${label}** =`;
    }
  );

  // Caso 4:
  // • $VA$ = valor actual
  // -> • **VA** = valor actual
  s = s.replace(
    /^(\s*(?:[-*]|[•●])\s*)\$\s*([^$\n]{1,60})\s*\$\s*=/gm,
    (_match, prefix, rawLabel) => {
      const label = simpleMathLabelToText(rawLabel);
      if (!label) return _match;
      return `${prefix}**${label}** =`;
    }
  );

  // Evita duplicados cuando el modelo mezcla inline math + texto:
  // $C$C =  -> $C$ =
  // $i$i =  -> $i$ =
  // $VA$VA = -> $VA$ =
  s = s.replace(/\$([A-Za-z]{1,4}[0-9n]?)\$\s*\1(?=\s*=)/g, (_match, variable) => {
    return `$${variable}$`;
  });

  // Corrige duplicados textuales:
  // VAVAVA -> VA
  // VFVFVF -> VF
  // VPVPVP -> VP
  // iii -> i
  // nnn -> n
  const collapseRepeatedVariableLabel = (rawLabel: string) => {
    const compact = String(rawLabel ?? "")
      .replace(/\$/g, "")
      .replace(/\*/g, "")
      .replace(/\s+/g, "")
      .trim();

    if (!compact) return String(rawLabel ?? "").trim();

    const candidates = [
      "VA",
      "VF",
      "VP",
      "PV",
      "CF",
      "FV",
      "VAN",
      "TIR",
      "WACC",
      "C0",
      "Cn",
      "R",
      "C",
      "i",
      "n",
      "r",
      "t",
      "x",
      "y",
      "z",
      "P",
      "F",
      "V",
      "M",
      "N",
      "A",
      "θ",
      "α",
      "β",
      "γ",
      "μ",
      "σ",
      "λ",
    ];

    for (const variable of candidates) {
      if (compact.length <= variable.length) continue;
      if (compact.length % variable.length !== 0) continue;

      const times = compact.length / variable.length;
      if (times < 2) continue;

      const repeated = variable.repeat(times);

      if (compact.toLowerCase() === repeated.toLowerCase()) {
        return compact.slice(0, variable.length);
      }
    }

    return String(rawLabel ?? "").trim();
  };

  s = s.replace(
    /^(\s*[-*]\s*)((?:\$?(?:VA|VF|VP|PV|CF|FV|VAN|TIR|WACC|C0|Cn|[A-Za-z])\$?\s*){2,})(?=\s*=)/gim,
    (_match, prefix, rawLabel) =>
      `${prefix}${collapseRepeatedVariableLabel(rawLabel)}`
  );

  s = s.replace(
    /^(\s*)((?:\$?(?:VA|VF|VP|PV|CF|FV|VAN|TIR|WACC|C0|Cn|[A-Za-z])\$?\s*){2,})(?=\s*=)/gim,
    (_match, prefix, rawLabel) =>
      `${prefix}${collapseRepeatedVariableLabel(rawLabel)}`
  );

  // Evita que definiciones cortas de variables se rompan así:
  // - i =
  //   tipo de interés
  //
  // y las deja como:
  // - i = tipo de interés
  s = s.replace(
    /^(\s*(?:[-*]|[•●])\s*(?:\*\*[^*\n]{1,40}\*\*|\$[A-Za-z]{1,8}\$|[A-Za-z]{1,8})\s*=\s*)\n+\s+/gm,
    "$1"
  );

  // Lo mismo si viene sin viñeta:
  // i =
  // tipo de interés
  s = s.replace(
    /^(\s*(?:\*\*[^*\n]{1,40}\*\*|\$[A-Za-z]{1,8}\$|[A-Za-z]{1,8})\s*=\s*)\n+\s+/gm,
    "$1"
  );

  // \[ ... \] -> $$ ... $$
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

  // Compactar saltos excesivos
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

function normalizeBulletMarkdown(text: string) {
  let s = String(text ?? "");

    // Elimina viñetas vacías que a veces aparecen cuando una fórmula se parte mal.
  s = s.replace(/^\s*(?:[•●]|[-*])\s*$/gm, "");

  // Convierte viñetas tipo "• texto" o "● texto" a Markdown real.
  s = s.replace(/^\s*[•●]\s+/gm, "- ");

  // Convierte falsas listas indentadas a listas reales SOLO cuando hay varias líneas seguidas.
  const lines = s.split("\n");
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const prev = lines[i - 1] ?? "";
    const next = lines[i + 1] ?? "";

    const isIndentedText =
      /^\s{2,}\S/.test(line) &&
      !/^\s{2,}[-*+]\s+/.test(line) &&
      !/^\s{2,}\d+\.\s+/.test(line);

    const hasIndentedNeighbour =
      /^\s{2,}\S/.test(prev) || /^\s{2,}\S/.test(next);

    const looksLikeHeading =
      /^\s{2,}.{1,48}:\s*$/.test(line);

    if (isIndentedText && hasIndentedNeighbour && !looksLikeHeading) {
      out.push(line.replace(/^\s+/, "- "));
    } else {
      out.push(line);
    }
  }

  s = out.join("\n");

  // Asegura salto antes de listas Markdown.
  s = s.replace(/([^\n])\n(-\s+)/g, "$1\n\n$2");

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

function shouldSuggestFileUploadFromText(text: string) {
  const t = (text || "").toLowerCase().trim();

  const negativeSignals = [
    "me has puesto eso para que te suba un archivo",
    "me has pedido que suba",
    "me estás pidiendo que suba",
    "por qué sale el botón",
    "para qué sirve ese botón",
    "qué es ese botón",
    "qué es ese bloque",
    "por qué me sale subir archivo",
  ];

  if (negativeSignals.some((k) => t.includes(k))) return false;

  const strongTriggers = [
    "captura",
    "screenshot",
    "pantallazo",
    "foto",
    "imagen",
    "pdf",
    "contrato",
    "documento",
    "audio",
    "vídeo",
    "video",
    "enlace",
    "link",
    "url",
    "web",
    "página",
    "pagina",
    "correo",
    "email",
    "número",
    "numero",
    "teléfono",
    "telefono",
  ];

  const intentTriggers = [
    "te lo paso",
    "te lo mando",
    "te lo envío",
    "te lo envio",
    "te envío",
    "te envio",
    "te lo enseño",
    "te lo adjunto",
    "te adjunto",
    "te lo subo",
    "lo subo",
    "te paso",
    "te mando",
    "mira esto",
    "mira esta",
    "mira este",
  ];

  return (
    strongTriggers.some((k) => t.includes(k)) ||
    intentTriggers.some((k) => t.includes(k))
  );
}

function buildNaturalUploadPrompt(text: string) {
  const t = (text || "").toLowerCase();

  if (t.includes("contrato") || t.includes("pdf") || t.includes("documento")) {
    return "Si quieres, súbemelo y te digo qué me preocuparía o qué revisaría antes de seguir.";
  }

  if (t.includes("audio")) {
    return "Si lo tienes a mano, súbelo y saco contigo lo importante para verlo más claro.";
  }

  if (t.includes("vídeo") || t.includes("video")) {
    return "Si quieres, súbelo y lo revisamos juntos para ver si hay algo raro o importante.";
  }

  if (
    t.includes("web") ||
    t.includes("enlace") ||
    t.includes("link") ||
    t.includes("url") ||
    t.includes("página") ||
    t.includes("pagina")
  ) {
    return "Pásamelo y lo miro contigo; así te puedo decir mejor si hay algo que me haría frenar.";
  }

  if (
    t.includes("captura") ||
    t.includes("pantallazo") ||
    t.includes("screenshot") ||
    t.includes("foto") ||
    t.includes("imagen")
  ) {
    return "Si quieres, súbemela y la reviso contigo para afinar mejor lo que estamos viendo.";
  }

  return "Si quieres, súbemelo y lo reviso contigo.";
}

function assistantIsActuallyInvitingUpload(text: string) {
  const t = (text || "").toLowerCase();

  const invitePhrases = [
    "si quieres, súbemelo",
    "si quieres, subemelo",
    "súbemelo y lo reviso contigo",
    "subemelo y lo reviso contigo",
    "pásamelo y lo miro contigo",
    "pasamelo y lo miro contigo",
    "si lo tienes a mano, súbelo",
    "si lo tienes a mano, subelo",
    "si quieres, súbemela",
    "si quieres, subemela",
    "si quieres, súbelo",
    "si quieres, subelo",
    "puedes subírmelo",
    "puedes subirmelo",
    "puedes subirlo",
    "adjúntalo",
    "adjuntalo",
  ];

  return invitePhrases.some((k) => t.includes(k));
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

  const [showContextualFileCard, setShowContextualFileCard] = useState(false);
const [contextualFilePrompt, setContextualFilePrompt] = useState("");

  // ✅ FIX: usar el origin real del navegador para evitar problemas PKCE entre dominio principal y previews
  const SITE_URL =
    typeof window !== "undefined"
      ? window.location.origin.replace(/\/$/, "")
      : ((process.env.NEXT_PUBLIC_SITE_URL as string | undefined) || "https://vonuai.com").replace(/\/$/, "");
      function getAuthRedirectTo() {
  if (typeof window === "undefined") {
    return `${SITE_URL}/chat`;
  }

  const origin = window.location.origin.replace(/\/$/, "");
  const path =
    window.location.pathname && window.location.pathname !== "/"
      ? window.location.pathname
      : "/chat";

  return `${origin}${path}`;
}

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

  async function ensureProfileExists(_u: any) {
  try {
    const { data } = await supabaseBrowser.auth.getSession();
    const token = data?.session?.access_token;

    if (!token) return;

    const res = await fetch("/api/profile/ensure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.warn(
        "[Vonu] No se pudo asegurar profile:",
        json?.error || res.status
      );
    }
  } catch (error) {
    console.warn("[Vonu] Error asegurando profile:", error);
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
      setIsPro(false);
      setUsageInfo(null);
      setPayMsg(null);
      setPendingCheckout(null);
      setPlan("free");
      setBilling("monthly");
      return;
    }

    await ensureProfileExists(u);

    const profile = computeProfileFromUser(u);

    setAuthUserEmail(profile.email);
    setAuthUserId(profile.id);
    setAuthUserName(profile.name);
  } catch {
    setAuthUserEmail(null);
    setAuthUserId(null);
    setAuthUserName(null);
    setIsPro(false);
    setUsageInfo(null);
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
await ensureProfileExists(after.session.user);

await refreshAuthSession();
await refreshProStatus();
await refreshUsageInfo();

      setLoginOpen(false);
      setLoginMsg(null);
    } catch {
      // no romper UI
    }
  }

 useEffect(() => {
  const preventBrowserFileDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  window.addEventListener("dragover", preventBrowserFileDrop);
  window.addEventListener("drop", preventBrowserFileDrop);

  return () => {
    window.removeEventListener("dragover", preventBrowserFileDrop);
    window.removeEventListener("drop", preventBrowserFileDrop);
  };
}, []);

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
  setUsageInfo(null);
  setPayMsg(null);
  setToastMsg(null);
  setPendingCheckout(null);
  setPlan("free");
  setBilling("monthly");
  resetVisibleHistoryForLoggedOut();
  return;
}

        await persistNameIfMissing(u);
await ensureProfileExists(u);

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
      setPayMsg("Necesitas iniciar sesión para gestionar tu suscripción.");
      setPayLoading(false);
      return;
    }

    const res = await fetch("/api/stripe/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({}),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setPayMsg(json?.error || "No se pudo cancelar la suscripción.");
      setPayLoading(false);
      return;
    }

    const message =
      json?.message ||
      "Tu plan se cancelará al final del periodo actual. Mantienes el acceso hasta entonces.";

    setPayMsg(message);
    setToastMsg("✅ Plan cancelado correctamente");
    setTimeout(() => setToastMsg(null), 4500);

    await refreshProStatus();
    await refreshUsageInfo();

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
          redirectTo: getAuthRedirectTo(),

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
  refreshAuthSession();
  refreshProStatus();
  refreshUsageInfo();
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
          emailRedirectTo: getAuthRedirectTo(),
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
    setProLoading(false);

    setUsageInfo(null);

    setPaywallOpen(false);
    setPayLoading(false);
    setPayMsg(null);
    setToastMsg(null);
    setPendingCheckout(null);
    setPlan("free");
    setBilling("monthly");

    setAuthLoading(false);

    resetVisibleHistoryForLoggedOut();
  } catch {
    setAuthUserEmail(null);
    setAuthUserId(null);
    setAuthUserName(null);
    setIsPro(false);
    setUsageInfo(null);
    setPayMsg(null);
    setToastMsg(null);
    setPendingCheckout(null);
    setPlan("free");
    setBilling("monthly");

    resetVisibleHistoryForLoggedOut();
  }
}

  // -------- Persistencia local --------
const [threads, setThreads] = useState<ChatThread[]>([makeNewThread()]);
const threadsRef = useRef<ChatThread[]>([]);
const [activeThreadId, setActiveThreadId] = useState<string>("");
const activeThreadIdRef = useRef<string>("");
const lastCloudSavedAssistantKeyRef = useRef<string>("");
const cloudHistoryLoadedForUserRef = useRef<string | null>(null);

useEffect(() => {
  threadsRef.current = threads;
}, [threads]);

// ✅ Seguridad: si no hay sesión, no debe quedar visible historial anterior.
// Esto evita que el historial local aparezca después de cerrar sesión.
useEffect(() => {
  if (!mounted) return;
  if (authLoading) return;
  if (isLoggedIn) return;

  resetVisibleHistoryForLoggedOut();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mounted, authLoading, isLoggedIn]);

useEffect(() => {
  if (authLoading) return;
  if (!isLoggedIn) return;
  if (!authUserId) return;

  const timer = window.setTimeout(() => {
    loadCloudThreadsOnce();
  }, 450);

  return () => window.clearTimeout(timer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authLoading, isLoggedIn, authUserId]);

// =======================
// ☁️ HISTORIAL REMOTO — fase 2A
// Guardamos solo en eventos concretos.
// NO autosync general sobre threads.
// =======================

async function getHistoryAccessToken() {
  try {
    const { data } = await supabaseBrowser.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function saveThreadToCloud(thread?: ChatThread | null) {
  try {
    console.log("[Vonu history] saveThreadToCloud START", {
      hasThread: !!thread,
      isLoggedIn,
      threadId: thread?.id,
      title: thread?.title,
      messages: thread?.messages?.length,
    });
    if (!thread) return;
    if (!isLoggedIn) {
  console.log("[Vonu history] cancelado: usuario no logueado");
  return;
}

    const safeThread = sanitizeThreadsForStorage([thread])[0];
    if (!safeThread) return;

    const hasUserMessage = safeThread.messages.some((m) => m.role === "user");
    if (!hasUserMessage) return;

    const firstUserTextForTitle =
  safeThread.messages.find(
    (m) => m.role === "user" && typeof m.text === "string" && m.text.trim()
  )?.text ?? "";

const threadForCloud = {
  ...safeThread,
  title:
    shouldAutoTitleThread(safeThread.title) && firstUserTextForTitle.trim()
      ? makeSmartThreadTitle(firstUserTextForTitle)
      : safeThread.title,
};

    const token = await getHistoryAccessToken();
    if (!token) {
  console.log("[Vonu history] cancelado: sin token");
  return;
}

    const res = await fetch("/api/chat-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
  thread: threadForCloud,
}),
    });

    console.log("[Vonu history] POST /api/chat-history", {
  status: res.status,
  ok: res.ok,
  threadId: safeThread.id,
  title: safeThread.title,
  messages: safeThread.messages.length,
});

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[Vonu] No se pudo guardar historial remoto:", txt);
    }
  } catch (error) {
    console.warn("[Vonu] Error guardando historial remoto:", error);
  }
}

function queueSaveThreadToCloud(threadId: string, delay = 700) {
  if (!threadId) {
    console.log("[Vonu history] queue cancelada: sin threadId");
    return;
  }

  console.log("[Vonu history] queue save", {
    threadId,
    delay,
  });

  window.setTimeout(() => {
    const thread = threadsRef.current.find((t) => t.id === threadId);

    console.log("[Vonu history] queue fired", {
      threadId,
      found: !!thread,
      title: thread?.title,
      messages: thread?.messages?.length,
      hasUserMessage: thread?.messages?.some((m) => m.role === "user"),
    });

    saveThreadToCloud(thread);
  }, delay);
}

async function deleteThreadFromCloud(threadId: string) {
  try {
    if (!threadId) return;
    if (!isLoggedIn) return;

    const token = await getHistoryAccessToken();
    if (!token) return;

    const res = await fetch("/api/chat-history", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        threadId,
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[Vonu] No se pudo borrar historial remoto:", txt);
    }
  } catch (error) {
    console.warn("[Vonu] Error borrando historial remoto:", error);
  }
}

function resetVisibleHistoryForLoggedOut() {
  const fresh = makeNewThread();

  cloudHistoryLoadedForUserRef.current = null;
  lastCloudSavedAssistantKeyRef.current = "";

  setThreads([fresh]);
  setActiveThreadId(fresh.id);
  setMenuOpen(false);
  setUiError(null);
  setInput("");
  setImagePreview(null);
  setPdfPreview(null);

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_BACKUP_KEY);
    window.localStorage.removeItem(STORAGE_LAST_GOOD_KEY);
  } catch {}

  requestAnimationFrame(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    shouldStickToBottomRef.current = false;
  });
}

async function loadCloudThreadsOnce() {
  try {
    if (!isLoggedIn) return;
    if (!authUserId) return;

    if (cloudHistoryLoadedForUserRef.current === authUserId) {
      return;
    }

    cloudHistoryLoadedForUserRef.current = authUserId;

    const token = await getHistoryAccessToken();

    if (!token) {
      cloudHistoryLoadedForUserRef.current = null;
      return;
    }

    const res = await fetch("/api/chat-history", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      console.warn("[Vonu] No se pudo cargar historial remoto:", json);
      cloudHistoryLoadedForUserRef.current = null;
      return;
    }

    const remoteThreads = Array.isArray(json.threads)
      ? json.threads.map(normalizeRemoteThreadForClient).filter(Boolean) as ChatThread[]
      : [];

    if (!remoteThreads.length) return;

    let nextActiveId = activeThreadIdRef.current;

    setThreads((prev) => {
      const merged = mergeLocalAndCloudThreads(prev, remoteThreads);

      if (!merged.some((t) => t.id === nextActiveId)) {
        nextActiveId = merged[0]?.id ?? "";
      }

      return merged;
    });

    window.setTimeout(() => {
      if (nextActiveId) {
        setActiveThreadId(nextActiveId);
      }
    }, 0);
  } catch (error) {
    console.warn("[Vonu] Error cargando historial remoto:", error);
    cloudHistoryLoadedForUserRef.current = null;
  }
}

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      resetVisibleHistoryForLoggedOut();
      return;
    }

    try {
      const parsed = readStoredThreadsFromLocalStorage();
      if (!parsed) return;

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
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
  if (!mounted) return;
  if (typeof window === "undefined") return;

  try {
    const safeThreads = sanitizeThreadsForStorage(threads);

    // Protección: nunca sobrescribimos el historial con algo vacío o corrupto.
    if (!looksLikeValidStoredThreads(safeThreads)) {
      console.warn("[Vonu] Guardado cancelado: historial vacío o no válido.");
      return;
    }

    const previousRaw = window.localStorage.getItem(STORAGE_KEY);

    if (previousRaw) {
      window.localStorage.setItem(STORAGE_BACKUP_KEY, previousRaw);
    }

    const nextRaw = JSON.stringify(safeThreads);

    window.localStorage.setItem(STORAGE_KEY, nextRaw);
    window.localStorage.setItem(STORAGE_LAST_GOOD_KEY, nextRaw);
  } catch (error) {
    console.warn("[Vonu] No se pudo guardar el historial completo:", error);

    try {
      const ultraSafeThreads = sanitizeThreadsForStorage(threads)
        .slice(0, 8)
        .map((thread) => ({
          ...thread,
          messages: thread.messages.slice(-30),
        }));

      if (!looksLikeValidStoredThreads(ultraSafeThreads)) {
        console.warn("[Vonu] Guardado reducido cancelado: historial no válido.");
        return;
      }

      const previousRaw = window.localStorage.getItem(STORAGE_KEY);

      if (previousRaw) {
        window.localStorage.setItem(STORAGE_BACKUP_KEY, previousRaw);
      }

      const fallbackRaw = JSON.stringify(ultraSafeThreads);

      window.localStorage.setItem(STORAGE_KEY, fallbackRaw);
      window.localStorage.setItem(STORAGE_LAST_GOOD_KEY, fallbackRaw);
    } catch (fallbackError) {
      console.warn("[Vonu] No se pudo guardar ni el historial reducido:", fallbackError);
    }
  }
}, [threads, mounted]);

// -------- UI --------
const [input, setInput] = useState("");
const exampleAutoSentRef = useRef(false);
const [isDraggingFile, setIsDraggingFile] = useState(false);
const dragDepthRef = useRef(0);

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
const realtimeLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const realtimeWarningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const realtimeStoppedByLimitRef = useRef(false);
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

function scrollToBottomNow(behavior: ScrollBehavior = "smooth") {
  const el = scrollRef.current;
  if (!el) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior,
  });

  setShowScrollToBottom(false);
  shouldStickToBottomRef.current = true;
}

function handlePickFileType(
  type: "image" | "pdf" | "audio" | "video" | "url" | "phone" | "board"
) {
  setShowContextualFileCard(false);
  setFilePickerOpen(false);

  if (type === "board") {
    openBoard();
    return;
  }

  setPendingFileType(type);

  if (type === "image") {
    fileInputRef.current?.click();
    return;
  }

  if (type === "pdf") {
    pdfInputRef.current?.click();
    return;
  }

  if (type === "url") {
    setUrlInputOpen(true);
    return;
  }

  if (type === "phone") {
    setPhoneInputOpen(true);
    return;
  }

  setMicMsg(
    `Pronto podrás subir ${
      type === "audio" ? "audios" : "vídeos"
    } para analizarlos.`
  );
  setTimeout(() => setMicMsg(null), 2200);
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

function clearRealtimeLimitTimers() {
  try {
    if (realtimeLimitTimerRef.current) {
      clearTimeout(realtimeLimitTimerRef.current);
    }

    if (realtimeWarningTimerRef.current) {
      clearTimeout(realtimeWarningTimerRef.current);
    }
  } catch {}

  realtimeLimitTimerRef.current = null;
  realtimeWarningTimerRef.current = null;
}

function openVoiceTopupModal() {
  setPayMsg(
    "Se han agotado tus minutos de voz. Puedes seguir usando el chat escrito, o hacer una recarga para continuar hablando con Vonu."
  );

  setBilling("topup");
  setPlan("free");
  setPaywallOpen(true);
}

function armRealtimeVoiceLimit(secondsLeft: number) {
  clearRealtimeLimitTimers();

  const safeSecondsLeft = Math.max(0, Math.floor(Number(secondsLeft || 0)));

  if (safeSecondsLeft <= 0) {
    realtimeStoppedByLimitRef.current = true;
    setVoiceModeOff();
    openVoiceTopupModal();
    return;
  }

  // Aviso suave cuando queda menos de 1 minuto.
  if (safeSecondsLeft > 30) {
    realtimeWarningTimerRef.current = setTimeout(() => {
      setMicMsg("Te queda menos de 1 minuto de voz.");
      setTimeout(() => setMicMsg(null), 3500);
    }, Math.max(0, (safeSecondsLeft - 30) * 1000));
  }

  // Corte automático al agotar minutos.
  realtimeLimitTimerRef.current = setTimeout(() => {
    realtimeStoppedByLimitRef.current = true;

    setMicMsg("Se han agotado tus minutos de voz.");
    setTimeout(() => setMicMsg(null), 2500);

    setVoiceModeOff();

    // Damos un pequeño margen para que se registre el consumo realtime.
    setTimeout(() => {
      refreshUsageInfo();
      openVoiceTopupModal();
    }, 900);
  }, safeSecondsLeft * 1000);
}

function setVoiceModeOff() {
    clearRealtimeLimitTimers();
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
        clearRealtimeLimitTimers();
    realtimeStoppedByLimitRef.current = false;
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
    const realtimeSecondsLeftBeforeStart = Math.max(
  0,
  Number(usageInfo?.realtime_seconds_left ?? 0)
);
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

        onUsageTracked: () => {
  refreshUsageInfo();

  if (realtimeStoppedByLimitRef.current) {
    realtimeStoppedByLimitRef.current = false;
    openVoiceTopupModal();
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

    armRealtimeVoiceLimit(realtimeSecondsLeftBeforeStart);
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createImageThumbnailFromDataUrl(
  dataUrl: string,
  options?: { maxSide?: number; quality?: number }
): Promise<string | null> {
  const maxSide = options?.maxSide ?? 520;
  const quality = options?.quality ?? 0.72;

  return new Promise((resolve) => {
    try {
      if (!dataUrl || !dataUrl.startsWith("data:image")) {
        resolve(null);
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          if (!width || !height) {
            resolve(null);
            return;
          }

          const ratio = Math.min(1, maxSide / Math.max(width, height));
          const nextW = Math.max(1, Math.round(width * ratio));
          const nextH = Math.max(1, Math.round(height * ratio));

          const canvas = document.createElement("canvas");
          canvas.width = nextW;
          canvas.height = nextH;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }

          // Fondo blanco por si la imagen original tiene transparencia.
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, nextW, nextH);
          ctx.drawImage(img, 0, 0, nextW, nextH);

          const thumb = canvas.toDataURL("image/jpeg", quality);
          resolve(thumb);
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
      img.src = dataUrl;
    } catch {
      resolve(null);
    }
  });
}

async function handleImageFile(file: File | null | undefined) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return;

  try {
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
  } catch (err) {
    console.error("No se pudo leer la imagen:", err);
  }
}

async function handleGlobalDrop(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
  e.stopPropagation();

  dragDepthRef.current = 0;
  setIsDraggingFile(false);

  const files = Array.from(e.dataTransfer?.files || []);
  const file = files[0];

  if (!file) {
    setMicMsg("No he podido recoger ese archivo.");
    setTimeout(() => setMicMsg(null), 2200);
    return;
  }

  await handleIncomingFile(file);
}

function handleGlobalDragEnter(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
  e.stopPropagation();

  dragDepthRef.current += 1;
  setIsDraggingFile(true);

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }
}

async function handlePasteIntoChat(e: React.ClipboardEvent<HTMLTextAreaElement>) {
  const items = Array.from(e.clipboardData?.items || []);

  const fileItem = items.find((item) => {
    const type = item.type || "";
    return type.startsWith("image/") || type === "application/pdf";
  });

  if (!fileItem) return;

  const file = fileItem.getAsFile();
  if (!file) return;

  e.preventDefault();
  await handleIncomingFile(file);
}

function handleGlobalDragOver(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
  e.stopPropagation();

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }

  if (!isDraggingFile) {
    setIsDraggingFile(true);
  }
}

function handleGlobalDragLeave(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
  e.stopPropagation();

  dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

  if (dragDepthRef.current === 0) {
    setIsDraggingFile(false);
  }
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

const [pdfPreview, setPdfPreview] = useState<{
  filename: string;
  pageCount: number | null;
  pdfText: string;
} | null>(null);

const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const [filePickerOpen, setFilePickerOpen] = useState(false);
const [pendingFileType, setPendingFileType] = useState<"image" | "pdf" | "audio" | "video" | "url" | "phone" | null>(null);
const [urlInputOpen, setUrlInputOpen] = useState(false);
const [urlDraft, setUrlDraft] = useState("");
const [phoneInputOpen, setPhoneInputOpen] = useState(false);
const [phoneDraft, setPhoneDraft] = useState("");
function submitPhoneAnalysis() {
  const clean = phoneDraft.trim();
  if (!clean) return;

  setPhoneInputOpen(false);
  setPhoneDraft("");

  sendQuickMessage(
  `Analiza este número de teléfono o llamada sospechosa: ${clean}

Dime si ves señales de riesgo y qué harías antes de devolver la llamada, responder por WhatsApp o compartir datos.`,
  "chat"
);
}

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
const [renameSavedPulse, setRenameSavedPulse] = useState(false);
const [renameThreadId, setRenameThreadId] = useState<string | null>(null);
const [recentlyRenamedThreadId, setRecentlyRenamedThreadId] = useState<string | null>(null);

  const [inputExpanded, setInputExpanded] = useState(false);

const scrollRef = useRef<HTMLDivElement>(null);
const inputBarRef = useRef<HTMLDivElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);
const headerRef = useRef<HTMLDivElement>(null);
const pendingScrollToBottomRef = useRef(false);
const shownFileCardForMessageRef = useRef<Set<string>>(new Set());
const pdfInputRef = useRef<HTMLInputElement | null>(null);


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
const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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
  const BOARD_BG = "#ffffff";
const [boardColor, setBoardColor] = useState<string>("#111827");

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
  <div className="my-3 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-visible py-[2px]">
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 w-full text-zinc-900 font-medium text-[1.04em] leading-[2.1]">
        <span className="min-w-0 break-words">{renderTextWithFractions(parts.left)}</span>
        <span className="font-semibold shrink-0">{parts.op}</span>
        <span className="min-w-0 break-words">{renderTextWithFractions(parts.right)}</span>
      </div>
    </div>
  );
}

  return {

      // ✅ Tablas Markdown bien renderizadas
  // Si el modelo genera una tabla, no la dejamos como texto roto con pipes.
  table({ children, ...props }: any) {
  return (
    <div className="not-prose my-4 box-border w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-zinc-200 bg-white [scrollbar-width:thin]">
      <table
        className="w-max min-w-full max-w-none border-collapse text-left text-[12.5px] leading-relaxed text-zinc-900 md:text-[14px]"
        {...props}
      >
        {children}
      </table>
    </div>
  );
},

  thead({ children, ...props }: any) {
    return (
      <thead className="bg-zinc-50 text-[12px] font-bold uppercase tracking-[0.08em] text-zinc-500" {...props}>
        {children}
      </thead>
    );
  },

  tbody({ children, ...props }: any) {
    return (
      <tbody className="divide-y divide-zinc-100" {...props}>
        {children}
      </tbody>
    );
  },

  tr({ children, ...props }: any) {
    return (
      <tr className="border-b border-zinc-100 last:border-b-0" {...props}>
        {children}
      </tr>
    );
  },

  th({ children, ...props }: any) {
  return (
    <th
      className="border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 align-top text-[12px] font-semibold text-zinc-800 md:text-[13px]"
      {...props}
    >
      {children}
    </th>
  );
},

td({ children, ...props }: any) {
  return (
    <td
      className="border-b border-zinc-100 px-3 py-2.5 align-top text-[12px] text-zinc-800 md:text-[13px]"
      {...props}
    >
      {children}
    </td>
  );
},

  // ✅ Lista ordenada con contador “badge” (como tu captura)
      ol({ children, ...props }: any) {
  return (
    <ol
      className="my-3 box-border list-decimal space-y-1.5 pl-8 pr-1 text-[16.5px] leading-8 text-zinc-900 marker:text-zinc-500 md:text-[17px]"
      {...props}
    >
      {children}
    </ol>
  );
},

ul({ children, ...props }: any) {
  return (
    <ul
      className="my-3 box-border list-disc space-y-1.5 pl-7 pr-1 text-[16.5px] leading-8 text-zinc-900 marker:text-zinc-500 md:text-[17px]"
      {...props}
    >
      {children}
    </ul>
  );
},

li({ children, ...props }: any) {
  return (
    <li
      className="min-w-0 pl-1 [overflow-wrap:anywhere]"
      {...props}
    >
      {children}
    </li>
  );
},

    // ✅ Títulos y negritas más potentes
    h1({ children, ...props }: any) {
    return (
      <h1
        className="mt-4 mb-2 text-[21px] md:text-[22px] leading-tight font-extrabold tracking-tight text-zinc-900"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </h1>
    );
  },

  h2({ children, ...props }: any) {
    return (
      <h2
        className="mt-4 mb-2 text-[18.5px] md:text-[19px] leading-snug font-extrabold tracking-tight text-zinc-950"
        {...props}
      >
        {renderChildrenWithFractions(children)}
      </h2>
    );
  },

  h3({ children, ...props }: any) {
    return (
      <h3
        className="mt-3 mb-2 text-[17.5px] md:text-[18px] leading-snug font-extrabold text-zinc-950"
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
        ? "my-4 text-[16.5px] leading-8 text-zinc-900 font-medium md:text-[17px]"
        : "my-3 text-[16.5px] leading-8 text-zinc-900 md:text-[17px]"
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
    <strong className="font-extrabold text-zinc-950" {...props}>
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

        // ✅ Bloques especiales copiables:
    // ```mensaje
    // ...
    // ```
    //
    // ```email
    // ...
    // ```
    //
    // ```texto
    // ...
    // ```
    const languageMatch = /language-([a-zA-Z0-9_-]+)/.exec(String(className ?? ""));
    const language = languageMatch?.[1]?.toLowerCase() ?? "";

    const copyBlockLanguages = new Set([
      "mensaje",
      "whatsapp",
      "sms",
      "email",
      "correo",
      "texto",
      "carta",
      "reclamacion",
      "reclamación",
      "codigo",
      "code",
    ]);

    if (copyBlockLanguages.has(language)) {
      return <VonuCopyBlock kind={language} text={clean} />;
    }

    // ✅ code block normal
    return (
      <pre className="max-w-full rounded-xl bg-zinc-900 p-3 text-white overflow-x-auto whitespace-pre-wrap break-words">
        <code className="text-[12.5px] whitespace-pre-wrap break-words" {...props}>
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
      className={`${className ?? ""} my-4 min-w-0 max-w-full rounded-2xl bg-white/45 px-2 py-2 text-center`}
      style={{
        overflowX: "hidden",
        overflowY: "visible",
        maxWidth: "100%",
        width: "100%",
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

// VisualViewport + teclado móvil
// En la pantalla inicial intentamos que el teclado NO empuje toda la app hacia arriba.
// En Chrome/Android usamos VirtualKeyboard.overlaysContent cuando está disponible.
useEffect(() => {
  if (typeof window === "undefined") return;

  const vv = window.visualViewport;
  const navAny = navigator as any;
  const virtualKeyboard = navAny?.virtualKeyboard;

  let previousOverlaysContent: boolean | null = null;
  let stableHomeHeight = window.innerHeight || 720;

  try {
    if (virtualKeyboard && "overlaysContent" in virtualKeyboard) {
      previousOverlaysContent = !!virtualKeyboard.overlaysContent;
      virtualKeyboard.overlaysContent = true;
    }
  } catch {
    previousOverlaysContent = null;
  }

  const isHomeInputMode = () =>
    document.documentElement.classList.contains("vonu-home-input-mode");

  const resetHomeScroll = () => {
    if (!isHomeInputMode()) return;

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  const setVars = () => {
  const viewportHeight = vv?.height ?? window.innerHeight;
  const viewportTop = vv?.offsetTop ?? 0;

  let keyboardHeight = 0;

  try {
    const rect = virtualKeyboard?.boundingRect;
    if (rect && typeof rect.height === "number") {
      keyboardHeight = Math.max(0, Math.round(rect.height));
    }
  } catch {
    keyboardHeight = 0;
  }

  if (!keyboardHeight) {
    keyboardHeight = Math.max(
      0,
      Math.round(window.innerHeight - (viewportHeight + viewportTop))
    );
  }

  const keyboardOpen =
    keyboardHeight > 80 ||
    (!!vv && viewportHeight < stableHomeHeight - 110);

  document.documentElement.classList.toggle(
    "vonu-home-keyboard-open",
    isHomeInputMode() && keyboardOpen
  );

  document.documentElement.style.setProperty(
    "--vonu-keyboard-height",
    `${keyboardHeight}px`
  );

    if (isHomeInputMode()) {
      if (!keyboardOpen) {
        stableHomeHeight = window.innerHeight || stableHomeHeight;
      }

      // Pantalla inicial: altura estable, sin inset inferior.
      document.documentElement.style.setProperty(
        "--vvh",
        `${stableHomeHeight}px`
      );
      document.documentElement.style.setProperty("--vvb", "0px");

      // Si el navegador intenta desplazar la página al enfocar textarea,
      // la devolvemos a su sitio varias veces durante la animación del teclado.
      resetHomeScroll();
      requestAnimationFrame(resetHomeScroll);
      window.setTimeout(resetHomeScroll, 80);
      window.setTimeout(resetHomeScroll, 180);
      window.setTimeout(resetHomeScroll, 360);

      return;
    }

        // Conversación normal: aquí sí dejamos que el input inferior siga al teclado.
    document.documentElement.style.setProperty("--vvh", `${viewportHeight}px`);

    const bottomInset = Math.max(
      0,
      Math.round(window.innerHeight - (viewportHeight + viewportTop))
    );

    // En algunos móviles/Android, al usar VirtualKeyboard.overlaysContent,
    // visualViewport puede devolver poco o 0, pero virtualKeyboard.boundingRect
    // sí trae la altura real del teclado. Usamos el mayor de los dos.
    const effectiveBottomInset = Math.max(bottomInset, keyboardHeight);

    document.documentElement.style.setProperty("--vvb", `${effectiveBottomInset}px`);
    document.documentElement.style.setProperty(
      "--vonu-keyboard-height",
      `${effectiveBottomInset}px`
    );
  };

  setVars();

  vv?.addEventListener("resize", setVars);
  vv?.addEventListener("scroll", setVars);
  window.addEventListener("resize", setVars);
  window.addEventListener("orientationchange", setVars);

  try {
    virtualKeyboard?.addEventListener?.("geometrychange", setVars);
  } catch {}

  return () => {
    vv?.removeEventListener("resize", setVars);
    vv?.removeEventListener("scroll", setVars);
    window.removeEventListener("resize", setVars);
    window.removeEventListener("orientationchange", setVars);

    try {
      virtualKeyboard?.removeEventListener?.("geometrychange", setVars);

      if (
        virtualKeyboard &&
        "overlaysContent" in virtualKeyboard &&
        previousOverlaysContent !== null
      ) {
        virtualKeyboard.overlaysContent = previousOverlaysContent;
      }
    } catch {}

    document.documentElement.classList.remove("vonu-home-keyboard-open");
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

// =======================
// 🏷️ TÍTULO AUTOMÁTICO
// Si el chat sigue como "Nueva consulta", usamos el primer mensaje real del usuario.
// Funciona para envío normal, quick prompts y voz.
// =======================
useEffect(() => {
  if (!activeThread) return;
  if (!shouldAutoTitleThread(activeThread.title)) return;

  const firstUserMessage = activeThread.messages.find(
    (m) => m.role === "user" && typeof m.text === "string" && m.text.trim()
  );

  const sourceText = firstUserMessage?.text?.trim();
  if (!sourceText) return;

  const nextTitle = makeSmartThreadTitle(sourceText);
  if (!nextTitle || nextTitle === activeThread.title) return;

  setThreads((prev) =>
    prev.map((t) =>
      t.id === activeThread.id
        ? {
            ...t,
            title: nextTitle,
            updatedAt: Date.now(),
          }
        : t
    )
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeThread?.id, activeThread?.title, messages.length]);

// =======================
// ☁️ HISTORIAL REMOTO — guardado al terminar respuesta
// No es autosync general: solo guarda cuando la última respuesta assistant ya está cerrada.
// =======================
useEffect(() => {
  if (!mounted) return;
  if (authLoading) return;
  if (!isLoggedIn) return;
  if (!activeThread) return;
  if (isTyping) return;

  const thread = activeThread;
  const threadMessages = thread.messages ?? [];

  const hasUserMessage = threadMessages.some((m) => m.role === "user");
  if (!hasUserMessage) return;

  const lastMessage = threadMessages[threadMessages.length - 1];

  if (!lastMessage) return;
  if (lastMessage.role !== "assistant") return;
  if (lastMessage.streaming) return;

  const saveKey = `${thread.id}:${lastMessage.id}:${threadMessages.length}:${thread.updatedAt}`;

  if (lastCloudSavedAssistantKeyRef.current === saveKey) return;
  lastCloudSavedAssistantKeyRef.current = saveKey;

  const timer = window.setTimeout(() => {
    const latestThread = threadsRef.current.find((t) => t.id === thread.id);
    saveThreadToCloud(latestThread);
  }, 800);

  return () => window.clearTimeout(timer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  mounted,
  authLoading,
  isLoggedIn,
  isTyping,
  activeThread?.id,
  messages.length,
]);

useEffect(() => {
  if (!activeThread) {
    setShowContextualFileCard(false);
    setContextualFilePrompt("");
    return;
  }

  if (imagePreview || filePickerOpen || urlInputOpen || phoneInputOpen) {
    setShowContextualFileCard(false);
    setContextualFilePrompt("");
    return;
  }

  const lastMessage = messages[messages.length - 1];

  const lastRealUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user" && (m.text ?? "").trim());

  if (!lastRealUserMessage?.text || !lastRealUserMessage?.id) {
    setShowContextualFileCard(false);
    setContextualFilePrompt("");
    return;
  }

  const userOpenedARealFileNeed = shouldSuggestFileUploadFromText(lastRealUserMessage.text);

  const assistantHasJustAnswered =
    !!lastMessage &&
    lastMessage.role === "assistant" &&
    !lastMessage.streaming &&
    !!(lastMessage.text ?? "").trim();

  const assistantInvitedUpload =
    assistantHasJustAnswered &&
    assistantIsActuallyInvitingUpload(lastMessage.text ?? "");

  const alreadyShownForThisUserMessage =
    shownFileCardForMessageRef.current.has(lastRealUserMessage.id);

  if (
    userOpenedARealFileNeed &&
    assistantInvitedUpload &&
    !alreadyShownForThisUserMessage
  ) {
    setContextualFilePrompt(buildNaturalUploadPrompt(lastRealUserMessage.text));
    setShowContextualFileCard(true);
    shownFileCardForMessageRef.current.add(lastRealUserMessage.id);
  } else {
    setShowContextualFileCard(false);
    setContextualFilePrompt("");
  }
}, [
  activeThread,
  messages,
  imagePreview,
  filePickerOpen,
  urlInputOpen,
  phoneInputOpen,
]);

useEffect(() => {
  if (!pendingScrollToBottomRef.current) return;

  const el = scrollRef.current;
  if (!el) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = el.scrollHeight - el.clientHeight;
      el.scrollTo({
        top: Math.max(0, target),
        behavior: "auto",
      });
      pendingScrollToBottomRef.current = false;
      setShowScrollToBottom(false);
      shouldStickToBottomRef.current = true;
    });
  });
}, [activeThreadId, messages.length]);

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

  const visibleSortedThreads = useMemo(() => {
  if (!isLoggedIn) return [];
  return sortedThreads;
}, [isLoggedIn, sortedThreads]);

  const userMsgCountInThread = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);

  const canSend = useMemo(() => {
  const basicReady = !isTyping && (!!input.trim() || !!imagePreview || !!pdfPreview);
  if (isBlockedByPaywall) return false;
  return basicReady;
}, [isTyping, input, imagePreview, pdfPreview, isBlockedByPaywall]);

const voiceUiState = useMemo<"idle" | "listening" | "speaking">(() => {
  if (!voiceMode) return "idle";
  if (realtimeStatus === "listening") return "listening";
  if (realtimeStatus === "speaking" || realtimeStatus === "connecting" || realtimeStatus === "connected") {
    return "speaking";
  }
  return "idle";
}, [voiceMode, realtimeStatus]);

  const hasUserMessage = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  useEffect(() => {
  if (typeof window === "undefined") return;

  let stableWindowHeight = window.innerHeight || 720;

  const keyboardLooksOpen = () => {
    const vv = window.visualViewport;
    if (!vv) return false;
    return vv.height < stableWindowHeight - 110;
  };

  const setHomeInputBottom = () => {
    // Cuando el teclado está abierto, NO recalculamos la posición del input.
    // Si recalculamos aquí, Android empuja la pantalla y el input salta.
    if (keyboardLooksOpen()) return;

    stableWindowHeight = window.innerHeight || stableWindowHeight || 720;

    const bottom = Math.max(
      190,
      Math.round(stableWindowHeight * 0.5 - 150)
    );

    document.documentElement.style.setProperty(
      "--vonu-home-input-bottom",
      `${bottom}px`
    );
  };

  setHomeInputBottom();

  window.addEventListener("resize", setHomeInputBottom);
  window.addEventListener("orientationchange", setHomeInputBottom);

  return () => {
    window.removeEventListener("resize", setHomeInputBottom);
    window.removeEventListener("orientationchange", setHomeInputBottom);
  };
}, []);

  useEffect(() => {
  const el = inputBarRef.current;
  if (!el) return;

  const shouldCenterInput = mounted && !hasUserMessage && !paywallOpen;

  el.classList.add("vonu-input-motion-shell");
  el.classList.toggle("vonu-home-input-centered", shouldCenterInput);

  document.documentElement.classList.toggle(
    "vonu-home-input-mode",
    shouldCenterInput
  );

  if (shouldCenterInput) {
    window.scrollTo(0, 0);
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }

  return () => {
    el.classList.remove("vonu-home-input-centered");
    el.classList.remove("vonu-input-motion-shell");
    document.documentElement.classList.remove("vonu-home-input-mode");
    document.documentElement.classList.remove("vonu-home-input-focus-mode");
    document.documentElement.classList.remove("vonu-home-keyboard-open");
  };
}, [mounted, hasUserMessage, paywallOpen, activeThreadId]);

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
  const el = scrollRef.current;
  if (!el) return;

  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  const isNearBottom = distanceFromBottom < 120;

  setShowScrollToBottom(!isNearBottom);
  shouldStickToBottomRef.current = isNearBottom;
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

async function handleIncomingFile(file?: File | null) {
  if (!file) return;

  const filename = file.name || "";
  const mime = file.type || "";

  const isImage = mime.startsWith("image/");
  const isPdf =
    mime === "application/pdf" || filename.toLowerCase().endsWith(".pdf");

  if (isImage) {
    await handleImageFile(file);
    return;
  }

  if (isPdf) {
    await processPdfFile(file);
    return;
  }

  setMicMsg("De momento puedo analizar imágenes y PDF.");
  setTimeout(() => setMicMsg(null), 2400);
}

async function onSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  // Limpiar input file para poder volver a elegir el mismo archivo
  e.target.value = "";

  if (!file) return;

  await handleIncomingFile(file);
}

async function processPdfFile(file: File) {
  try {
    setMicMsg("Vonu está leyendo el documento…");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze-pdf", {
      method: "POST",
      body: formData,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok || !json?.text) {
      setMicMsg(
        json?.error ||
          "No he podido leer este PDF todavía. Si quieres, prueba con otro PDF o con una captura."
      );
      setTimeout(() => setMicMsg(null), 2600);
      return;
    }

const hiddenPdfContext =
  `PDF adjunto por el usuario: "${json.filename}"` +
  `${json.pageCount ? ` (${json.pageCount} páginas)` : ""}.\n\n` +
  `INSTRUCCIONES PARA VONU:\n` +
  `- El usuario ha adjuntado este PDF como contexto de su mensaje.\n` +
  `- No pegues ni transcribas el contenido completo del PDF.\n` +
  `- No respondas como una plantilla fija.\n` +
  `- Adapta la respuesta a la pregunta concreta del usuario.\n` +
  `- Si el usuario pregunta si el documento está correcto, revisa lo visible y responde de forma práctica: qué parece correcto, qué habría que comprobar y qué harías ahora.\n` +
  `- Si detectas que es una factura, contrato, declaración, recibo, justificante o documento fiscal/legal, sé prudente: explica el riesgo o punto importante en lenguaje común y recomienda verificarlo con asesor/profesional solo cuando tenga sentido.\n` +
  `- No añadas apartados que no aplican. Por ejemplo, si es una factura, no hables de material de estudio.\n` +
  `- La respuesta debe sonar natural, concreta, cercana y útil, como si estuvieras ayudando a revisar el documento de verdad.\n\n` +
  `CONTENIDO EXTRAÍDO DEL PDF:\n\n${json.text}`;

    setPdfPreview({
      filename: json.filename || file.name || "documento.pdf",
      pageCount: json.pageCount ?? null,
      pdfText: hiddenPdfContext,
    });

    setMicMsg(null);
  } catch (err) {
    console.error(err);
    setMicMsg("Ha fallado la lectura del PDF.");
    setTimeout(() => setMicMsg(null), 2600);
  }
}

async function onSelectPdf(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  e.target.value = "";

  if (!file) return;

  await handleIncomingFile(file);
}

  function createThreadAndActivate() {
  // ✅ Nueva consulta pasa a ser feature de cuenta/plan.
  // Invitado: no puede reiniciar el contador creando hilos nuevos.
  if (!isLoggedIn) {
    setLoginMsg(
      "Para abrir nuevas consultas y guardar tu historial, inicia sesión."
    );
    openLoginModal("signin");
    return;
  }

  // ✅ Usuario registrado sin plan activo:
  // puede seguir dentro de su consulta/límite, pero no crear consultas infinitas.
  if (!isPro) {
    setPayMsg(
      "Nueva consulta es una función de los planes de Vonu. Puedes seguir en tu consulta actual o mejorar tu plan."
    );
    openPlansModal();
    return;
  }

  const t = makeNewThread();

  setThreads((prev) => [t, ...prev]);
  setActiveThreadId(t.id);
  setMenuOpen(false);
  setUiError(null);
  setInput("");
  setImagePreview(null);
  setPdfPreview(null);
  setShowContextualFileCard(false);
  setContextualFilePrompt("");

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

  const thread = threads.find((x) => x.id === id);
  const isFresh = (thread?.messages ?? []).filter((m) => m.role === "user").length === 0;

  if (isFresh) {
    pendingScrollToBottomRef.current = false;
    shouldStickToBottomRef.current = false;

    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: 0, behavior: "auto" });
    });
  } else {
    pendingScrollToBottomRef.current = true;
    shouldStickToBottomRef.current = true;
  }

  if (isDesktopPointer()) setTimeout(() => textareaRef.current?.focus(), 60);
}

  function openRename(threadId?: string) {
  const targetThread =
    threadId
      ? threadsRef.current.find((t) => t.id === threadId)
      : activeThread;

  if (!targetThread) return;

  setRenameSavedPulse(false);
  setRenameThreadId(targetThread.id);
  setRenameValue(targetThread.title);
  setRenameOpen(true);
}

  function confirmRename() {
  const targetThreadId = renameThreadId ?? activeThread?.id;
  if (!targetThreadId || renameSavedPulse) return;

  const name = renameValue.trim() || "Consulta";

  setThreads((prev) =>
    prev.map((t) =>
      t.id === targetThreadId
        ? { ...t, title: name, updatedAt: Date.now() }
        : t
    )
  );

  setRecentlyRenamedThreadId(targetThreadId);

  window.setTimeout(() => {
    setRecentlyRenamedThreadId((current) =>
      current === targetThreadId ? null : current
    );
  }, 1600);

  setRenameOpen(false);
setRenameSavedPulse(false);
setRenameThreadId(null);

queueSaveThreadToCloud(targetThreadId, 350);
}

  function deleteActiveThread() {
  if (!activeThread) return;

  deleteThreadFromCloud(activeThread.id);

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

  function deleteThreadById(threadId: string) {
  if (!threadId) return;

  deleteThreadFromCloud(threadId);

  if (threads.length <= 1) {
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

    if (isDesktopPointer()) {
      setTimeout(() => textareaRef.current?.focus(), 60);
    }

    return;
  }

  const remaining = threads.filter((t) => t.id !== threadId);
  if (!remaining.length) {
    const fresh = makeNewThread();
    setThreads([fresh]);
    setActiveThreadId(fresh.id);
    return;
  }

  const keepCurrent =
    activeThreadId &&
    activeThreadId !== threadId &&
    remaining.some((t) => t.id === activeThreadId);

  const next = keepCurrent
    ? remaining.find((t) => t.id === activeThreadId) ?? remaining[0]
    : remaining[0];

  setThreads(remaining);
  setActiveThreadId(next.id);
  setMenuOpen(false);
  setUiError(null);
  setInput("");
  setImagePreview(null);

  requestAnimationFrame(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    shouldStickToBottomRef.current = false;
  });

  if (isDesktopPointer()) {
    setTimeout(() => textareaRef.current?.focus(), 60);
  }
}

  // ✅ regla: tras 2 mensajes, bloquear el siguiente y pedir login/pago
  function enforceLimitIfNeeded(): boolean {
  const nextUserCount = userMsgCountInThread + 1;

  // ✅ Invitado: solo 1 mensaje gratuito total por navegador.
  // No depende solo del hilo actual, para evitar el bypass de abrir "Nueva consulta".
  if (!isLoggedIn) {
    const guestFreeAlreadyUsed = hasGuestFreeMessageBeenUsed();

    if (guestFreeAlreadyUsed || nextUserCount > GUEST_MESSAGE_LIMIT) {
      setLoginMsg(
        "Puedes probar Vonu con 1 mensaje gratuito. Para seguir, inicia sesión."
      );
      openLoginModal("signin");
      return true;
    }

    markGuestFreeMessageAsUsed();
    return false;
  }

  // ✅ Usuario logueado: el límite real lo controla Supabase / usage.
  return false;
}

  async function sendQuickMessage(
  textPreset: string,
  modePreset: ThreadMode,
  options?: { pdfText?: string | null }
) {

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
const hiddenPdfText = (options?.pdfText || "").trim();

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
  prev.map((t) => {
    if (t.id !== targetThreadId) return t;

    const shouldAutoTitle = shouldAutoTitleThread(t.title);

    return {
      ...t,
      title: shouldAutoTitle ? makeSmartThreadTitle(userText) : t.title,
      updatedAt: Date.now(),
      mode: modePreset,
      tutorProfile: t.tutorProfile ?? { level: "adult" },
    };
  })
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

    const shouldAutoTitle = shouldAutoTitleThread(t.title);
    const titleSource = userMsg.text || userText;

    return {
      ...t,
      title: shouldAutoTitle ? makeSmartThreadTitle(titleSource) : t.title,
      updatedAt: Date.now(),
      messages: [...t.messages, userMsg],
    };
  })
);

pinUserMessageNearTop(userMsg.id);

function scrollToBottomNow(behavior: ScrollBehavior = "smooth") {
  const el = scrollRef.current;
  if (!el) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior,
  });

  setShowScrollToBottom(false);
  shouldStickToBottomRef.current = true;
}

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
  pdfText: hiddenPdfText || null,
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

queueSaveThreadToCloud(targetThreadId, 700);

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

  useEffect(() => {
  if (!mounted) return;
  if (authLoading) return;
  if (!activeThread) return;
  if (exampleAutoSentRef.current) return;
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.href);
    const example = url.searchParams.get("example");

    if (!example || !example.trim()) return;

    const cleanExample = example.trim();

    exampleAutoSentRef.current = true;

    url.searchParams.delete("example");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${
        url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""
      }`
    );

    setTimeout(() => {
      sendQuickMessage(cleanExample, "chat");
    }, 120);
  } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mounted, authLoading, activeThread?.id]);

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
const pdfAttachment = pdfPreview;

const imageThumb = imageBase64
  ? await createImageThumbnailFromDataUrl(imageBase64, {
      maxSide: 520,
      quality: 0.72,
    })
  : null;

setUiError(null);

// ===== Tutor auto-activación (DESACTIVADA) =====
const threadModeNow: ThreadMode = activeThread.mode ?? "chat";
let nextMode: ThreadMode = threadModeNow;

let nextTutorLevel: TutorLevel = activeThread.tutorProfile?.level ?? "adult";

// ✅ Ya NO forzamos modo tutor por intención.
// El modo lo decide el usuario (UI) y se guarda en el thread.
// nextMode y nextTutorLevel quedan como están.

const conversationText = messages
  .filter((m) => (m.text ?? "").trim())
  .map((m) => `${m.role === "user" ? "Usuario" : "Vonu"}: ${m.text ?? ""}`)
  .join("\n\n");

if (imageBase64) {
  try {
    const attachmentPreviewResult = await analyzeAttachment({
      kind: "image",
      imageBase64,
      userMessage: userText,
      conversationText,
      mode: voiceModeRef.current ? "realtime" : nextMode,
    });

    console.log("[Attachment analysis preview]", attachmentPreviewResult);
  } catch (error) {
    console.error("Error preparando análisis de adjunto:", error);
  }
}


const userMsg: Message = {
  id: crypto.randomUUID(),
  role: "user",
  text:
    userText && pdfAttachment
      ? `${userText}\n\nPDF adjunto: ${pdfAttachment.filename}`
      : userText ||
        (imageBase64
          ? "He adjuntado una imagen."
          : pdfAttachment
          ? `He adjuntado un PDF: ${pdfAttachment.filename}`
          : undefined),
  image: imageBase64 || undefined,
  imageThumb: imageThumb || undefined,
};

const assistantId = crypto.randomUUID();

const assistantMsg: Message = {
  id: assistantId,
  role: "assistant",
  text:
    voiceModeRef.current && imageBase64
      ? "Dame un momento, voy a revisar la imagen con detenimiento."
      : "",
  streaming: !(voiceModeRef.current && imageBase64),
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
      messages: [...t.messages, userMsg, assistantMsg],
    };
  })
);

pinUserMessageNearTop(userMsg.id);

setInput("");
setImagePreview(null);
setPdfPreview(null);
setIsTyping(true);

if (!isDesktopPointer()) {
  textareaRef.current?.blur();
}

if (voiceModeRef.current && imageBase64) {
  try {
    await sleep(220);

    const threadNow =
      threadsRef.current.find((x) => x.id === targetThreadId) ?? activeThread;

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
  pdfText: pdfAttachment?.pdfText ?? null,
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

    const boardImageB64 =
      typeof data?.boardImageB64 === "string" && data.boardImageB64
        ? data.boardImageB64
        : null;

    const boardImagePlacement =
      data?.boardImagePlacement &&
      typeof data.boardImagePlacement?.x === "number" &&
      typeof data.boardImagePlacement?.y === "number" &&
      typeof data.boardImagePlacement?.w === "number" &&
      typeof data.boardImagePlacement?.h === "number"
        ? (data.boardImagePlacement as { x: number; y: number; w: number; h: number })
        : null;

    const pizarraJson =
      typeof data?.pizarra === "string" && data.pizarra.trim() ? data.pizarra : null;

   setThreads((prev) =>
  prev.map((t) => {
    if (t.id !== targetThreadId) return t;
    return {
      ...t,
      updatedAt: Date.now(),
      messages: t.messages.filter((m) => m.id !== assistantId),
    };
  })
);

try {
  realtimeConnRef.current?.sendContext(
    "Contexto confirmado: el usuario ya ha enviado una imagen en esta conversación y ya ha sido analizada. No digas que no la has recibido. Resumen fiable de la imagen: " +
      fullText,
    true
  );
} catch (error) {
  console.error("No se pudo sincronizar el análisis con realtime:", error);
}

setIsTyping(false);
sendGuardRef.current.busy = false;

return;
} catch (err: any) {
  const msg =
    typeof err?.message === "string"
      ? err.message
      : "Error desconocido conectando con la IA.";

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
                text:
                  "⚠️ No he podido analizar la imagen ahora mismo.\n\n**Detalles técnicos:**\n\n```\n" +
                  msg +
                  "\n```",
              }
            : m
        ),
      };
    })
  );

    setUiError(msg);
    setIsTyping(false);
    sendGuardRef.current.busy = false;
    return;
  }
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
  pdfText: pdfAttachment?.pdfText ?? null,
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

if (voiceModeRef.current && imageBase64 && fullText.trim()) {
  try {
    realtimeConnRef.current?.sendContext(
      "Contexto importante para la conversación: el usuario ha enviado una imagen y ya ha sido analizada. Resultado del análisis: " +
        fullText
    );
  } catch (error) {
    console.error("No se pudo sincronizar el análisis con realtime:", error);
  }
}

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

const chatBottomPad = paywallOpen
  ? 24
  : hasUserMessage
  ? inputBarH + (
      isLastFromAssistant
        ? (isDesktopPointer() ? 260 : 140)
        : isLastFromUser
        ? (isDesktopPointer() ? 180 : 260)
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
      width="11"
      height="11"
      viewBox="0 0 11 11"
      className={[
  "absolute pointer-events-none",
  "top-0",
  isRight ? "right-[-9px]" : "left-[-9px]",
  "z-0",
].join(" ")}
    >
      {isRight ? (
        <path
          d="
            M0 0
            L8.6 0
            Q10 0 10 1.7
            L0 10
            Z
          "
          fill={color}
        />
      ) : (
        <path
          d="
            M10 0
            L1.4 0
            Q0 0 0 1.7
            L10 10
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

function stripMarkdownForCopy(text: string) {
  let s = String(text ?? "");

  // bloques de código
  s = s.replace(/```[\s\S]*?```/g, (match) =>
    match.replace(/```/g, "").trim()
  );

  // inline code
  s = s.replace(/`([^`]+)`/g, "$1");

  // títulos markdown
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, "");

  // negritas / cursivas
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/_([^_]+)_/g, "$1");

  // links [texto](url) -> texto
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // listas
  s = s.replace(/^\s*[-*•]\s+/gm, "• ");

  // demasiados saltos
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

async function copyConversationToClipboard() {
  try {
    const conversationText = messages
      .filter((msg) => (msg.text ?? "").trim())
      .map((msg) => {
        const roleLabel = msg.role === "user" ? "Tú" : "Vonu";
        const cleanText = stripMarkdownForCopy(msg.text ?? "");
        return `${roleLabel}:\n${cleanText}`;
      })
      .join("\n\n");

    if (!conversationText.trim()) return;

    await navigator.clipboard.writeText(conversationText);
  } catch (err) {
    console.error("No se pudo copiar la conversación:", err);
  }
}

async function shareConversation() {
  try {
    const conversationText = messages
      .filter((msg) => (msg.text ?? "").trim())
      .map((msg) => {
        const roleLabel = msg.role === "user" ? "Tú" : "Vonu";
        const cleanText = stripMarkdownForCopy(msg.text ?? "");
        return `${roleLabel}:\n${cleanText}`;
      })
      .join("\n\n");

    if (!conversationText.trim()) return;

    if (navigator.share) {
      await navigator.share({
        title: "Conversación de Vonu",
        text: conversationText,
      });
      return;
    }

    await navigator.clipboard.writeText(conversationText);
  } catch (err) {
    console.error("No se pudo compartir la conversación:", err);
  }
}

function escapeHtml(text: string) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildConversationForExport() {
  return messages
    .filter((msg) => (msg.text ?? "").trim())
    .map((msg) => {
      const roleLabel = msg.role === "user" ? "Tú" : "Vonu";
      const cleanText = stripMarkdownForCopy(msg.text ?? "");
      return { roleLabel, cleanText };
    });
}

function downloadConversationAsPdf() {
  try {
    const items = buildConversationForExport();
    if (!items.length) return;

    const html = `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Conversación de Vonu</title>
          <style>
            @page {
              size: A4;
              margin: 18mm 14mm 18mm 14mm;
            }

            html, body {
              padding: 0;
              margin: 0;
              background: #ffffff;
              color: #18181b;
              font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body {
              padding: 0;
            }

            .wrap {
              max-width: 760px;
              margin: 0 auto;
            }

            .title {
              font-size: 22px;
              font-weight: 700;
              letter-spacing: -0.02em;
              margin: 0 0 6px 0;
            }

            .subtitle {
              font-size: 12px;
              color: #71717a;
              margin: 0 0 20px 0;
            }

            .item {
              margin: 0 0 18px 0;
              page-break-inside: avoid;
            }

            .role {
              font-size: 12px;
              font-weight: 700;
              color: #52525b;
              margin: 0 0 6px 0;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }

            .bubble {
              border-radius: 16px;
              padding: 12px 14px;
              font-size: 14px;
              line-height: 1.65;
              white-space: pre-wrap;
              word-break: break-word;
            }

            .bubble.user {
              background: #e9edf1;
            }

            .bubble.assistant {
              background: #ffffff;
              border: 1px solid #e4e4e7;
            }

            .footer-note {
              margin-top: 22px;
              font-size: 11px;
              color: #71717a;
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <h1 class="title">Conversación de Vonu</h1>
            <p class="subtitle">Exportación lista para guardar como PDF</p>

            ${items
              .map(
                (item) => `
                  <section class="item">
                    <div class="role">${escapeHtml(item.roleLabel)}</div>
                    <div class="bubble ${item.roleLabel === "Tú" ? "user" : "assistant"}">${escapeHtml(item.cleanText)}</div>
                  </section>
                `
              )
              .join("")}

            <div class="footer-note">
              Orientación preventiva · No sustituye profesionales.
            </div>
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 180);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } catch (err) {
    console.error("No se pudo preparar el PDF:", err);
  }
}

return (
    <div
      className={[
        "flex overflow-hidden transition-colors duration-700",
        hasUserMessage ? "bg-[#f8f9fa]" : "bg-[#f6f8fb]",
      ].join(" ")}
      style={{ height: "calc(var(--vvh, 100dvh))" }}
    >
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

  /* Markdown real de respuestas Vonu */
.vonu-markdown {
  font-size: 18px;
  line-height: 1.78;
  color: #18181b;
  font-weight: 500;
}

.vonu-markdown p {
  margin: 0.72rem 0 !important;
}

.vonu-markdown strong {
  font-weight: 950 !important;
  color: #000 !important;
}

.vonu-markdown h1,
.vonu-markdown h2,
.vonu-markdown h3 {
  color: #000 !important;
  font-weight: 950 !important;
  letter-spacing: -0.025em;
}

.vonu-markdown h2 {
  margin: 1.15rem 0 0.5rem !important;
  font-size: 1.08em !important;
  line-height: 1.32 !important;
}

.vonu-markdown h3 {
  margin: 1rem 0 0.42rem !important;
  font-size: 1.02em !important;
  line-height: 1.34 !important;
}

.vonu-markdown .vonu-md-list {
  display: block !important;
  margin: 0.85rem 0 1rem 0 !important;
  padding-left: 1.35rem !important;
}

.vonu-markdown .vonu-md-ul {
  list-style: disc outside !important;
}

.vonu-markdown .vonu-md-ol {
  list-style: decimal outside !important;
}

.vonu-markdown .vonu-md-li {
  display: list-item !important;
  margin: 0.38rem 0 !important;
  padding-left: 0.2rem !important;
  line-height: 1.65 !important;
}

.vonu-markdown .vonu-md-li::marker {
  color: #52525b !important;
  font-weight: 900 !important;
}

/* Si ReactMarkdown mete un <p> dentro de un <li>, evitamos que
   definiciones cortas tipo "i = tipo de interés" bajen a otra línea. */
.vonu-markdown .vonu-md-li > p {
  display: inline !important;
  margin: 0 !important;
}

.vonu-markdown .vonu-md-li > p + p {
  display: block !important;
  margin-top: 0.45rem !important;
}

@media (max-width: 767px) {
  .vonu-markdown {
    font-size: 18px;
    line-height: 1.76;
  }

  .vonu-markdown strong {
    font-weight: 950 !important;
    color: #000 !important;
  }

  .vonu-markdown .vonu-md-list {
    padding-left: 1.25rem !important;
  }
}

  /* Fondo inicial ligero: premium sin coste alto en móvil */
.vonu-home-soft-bg {
  background:
    radial-gradient(circle at 50% 18%, rgba(26, 115, 232, 0.10), transparent 34%),
    radial-gradient(circle at 16% 38%, rgba(96, 165, 250, 0.08), transparent 28%),
    radial-gradient(circle at 84% 42%, rgba(16, 185, 129, 0.06), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8f9fa 56%, #eef5ff 100%);
}

@keyframes vonuAssistantLogoEnter {
  0% {
    opacity: 0;
    transform: translateY(2px) scale(0.96);
    filter: blur(1px);
  }

  42% {
    opacity: 0.58;
    transform: translateY(1px) scale(0.985);
    filter: blur(0.45px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.vonu-assistant-logo-enter {
  animation: vonuAssistantLogoEnter 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: center center;
  will-change: transform, opacity, filter;
}

@media (max-width: 767px) {
  .vonu-assistant-logo-enter {
    animation-duration: 660ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vonu-assistant-logo-enter {
    animation: none !important;
  }
}

@media (max-width: 767px) {
  .vonu-home-soft-bg {
    background:
      radial-gradient(circle at 50% 20%, rgba(26, 115, 232, 0.08), transparent 34%),
      linear-gradient(180deg, #ffffff 0%, #f8f9fa 62%, #eef5ff 100%);
  }
}

/* Rendimiento móvil: reducimos animaciones decorativas */
@media (max-width: 767px) {
  .vonu-hero-rise,
  .vonu-input-motion-shell,
  .vonu-reveal,
  .vonu-dotmark-wrap,
  .vonu-dotmark-fill {
    animation: none !important;
    filter: none !important;
    will-change: auto !important;
  }

  .vonu-reveal {
    clip-path: none !important;
  }

  .vonu-input-motion-shell {
    transition:
      bottom 240ms ease-out,
      transform 240ms ease-out,
      opacity 160ms ease-out !important;
  }
}

  @keyframes vonuHeroRise {
    from {
      opacity: 0;
      transform: translateY(12px);
      filter: blur(3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }

  @keyframes vonuSoftGlow {
    0% {
      box-shadow:
        0 18px 60px rgba(15, 23, 42, 0.10),
        0 0 0 1px rgba(255,255,255,0.82),
        0 0 0 rgba(26,115,232,0);
    }
    50% {
      box-shadow:
        0 22px 76px rgba(15, 23, 42, 0.13),
        0 0 0 1px rgba(255,255,255,0.9),
        0 0 54px rgba(26,115,232,0.15);
    }
    100% {
      box-shadow:
        0 18px 60px rgba(15, 23, 42, 0.10),
        0 0 0 1px rgba(255,255,255,0.82),
        0 0 0 rgba(26,115,232,0);
    }
  }

  .vonu-hero-rise {
    animation: vonuHeroRise 620ms cubic-bezier(.2,.8,.2,1) both;
  }

    .vonu-input-motion-shell {
  transition:
    bottom 240ms cubic-bezier(.22, .61, .36, 1),
    transform 240ms cubic-bezier(.22, .61, .36, 1),
    opacity 260ms ease,
    filter 260ms ease,
    background-color 260ms ease !important;
  will-change: bottom, transform, filter;
}

.vonu-input-motion-shell.vonu-home-input-centered {
  transition:
    bottom 420ms cubic-bezier(.2,.8,.2,1),
    transform 420ms cubic-bezier(.2,.8,.2,1),
    opacity 320ms ease,
    filter 320ms ease,
    background-color 320ms ease !important;
}

.vonu-home-input-centered {
  top: auto !important;
  bottom: var(--vonu-home-input-bottom, 210px) !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: none !important;
  transform: translateY(0) !important;
  z-index: 70 !important;
  background: transparent !important;
  filter: drop-shadow(0 24px 70px rgba(15,23,42,0.14));
}

html.vonu-home-keyboard-open .vonu-home-input-centered {
  bottom: calc(var(--vonu-keyboard-height, 0px) + env(safe-area-inset-bottom, 0px) + 8px) !important;
  transform: translateY(0) !important;
}

.vonu-home-input-centered::before,
.vonu-home-input-centered::after {
  opacity: 0 !important;
}

@media (max-width: 767px) {
  html.vonu-home-input-focus-mode,
  html.vonu-home-input-focus-mode body {
    overflow: hidden !important;
    overscroll-behavior: none !important;
  }

  html.vonu-home-input-focus-mode .vonu-home-scroll {
    overflow: hidden !important;
    overscroll-behavior: none !important;
    touch-action: none;
  }
}

@media (min-width: 768px) {
  .vonu-home-input-centered {
    left: 304px !important;
    right: 0 !important;
    width: auto !important;
    max-width: none !important;
  }
}

html.vonu-home-input-mode {
  overflow: hidden !important;
  overscroll-behavior: none !important;
}

html.vonu-home-input-mode body {
  width: 100% !important;
  min-height: var(--vvh, 100dvh) !important;
  overflow: hidden !important;
  overscroll-behavior: none !important;
}

html.vonu-home-input-mode .vonu-home-scroll {
  overflow: hidden !important;
  overscroll-behavior: none !important;
}

html.vonu-home-input-mode .vonu-home-input-centered {
  top: auto !important;
}

/* Oculta la bandeja/capa blanca del input SOLO cuando está centrado en la home */
html.vonu-home-input-mode .chat-input-root,
html.vonu-home-input-mode .chat-input-root > div,
html.vonu-home-input-mode .chat-input-root > div > div {
  background: transparent !important;
}

html.vonu-home-input-mode .chat-input-tray-mask,
html.vonu-home-input-mode .chat-input-tray-panel,
html.vonu-home-input-mode .chat-input-disclaimer {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* En PC quitamos solo la placa blanca inferior.
   Dejamos la máscara en su comportamiento natural para no desplazar el input. */
@media (min-width: 768px) {
  html:not(.vonu-home-input-mode) .chat-input-tray-panel {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  html:not(.vonu-home-input-mode) .chat-input-tray-mask {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
}

/* Cortina segura dentro del scroll del chat.
   Más pegada al input para no borrar letras demasiado pronto. */
@media (min-width: 768px) {
  .vonu-home-scroll.vonu-chat-has-messages::after {
    content: "";
    position: sticky;
    bottom: 0;
    z-index: 35;
    display: block;
    height: 145px;
    margin-top: -145px;
    pointer-events: none;
    background: linear-gradient(
      to top,
      #f8f9fa 0%,
      #f8f9fa 34%,
      rgba(248, 249, 250, 0.76) 56%,
      rgba(248, 249, 250, 0.28) 78%,
      rgba(248, 249, 250, 0) 100%
    );
  }
}

/* Evita que las fórmulas se peguen demasiado a texto normal */
.prose .katex-display + p,
.prose p + .katex-display {
  margin-top: 0.75rem !important;
}

/* Móvil: legible, pero sin romper ancho */
@media (max-width: 767px) {
  .prose .katex-display {
    margin: 0.9rem 0 !important;
    padding: 0.2rem 0 0.3rem !important;
  }

  .prose .katex-display > .katex {
    font-size: 1.08em !important;
  }

  .prose .katex {
    font-size: 1em;
  }
}

/* Fallback por si alguna capa antigua sigue pintando la máscara */
html.vonu-home-input-mode .chat-input-root .pointer-events-none.absolute.inset-x-0.z-0,
html.vonu-home-input-mode .chat-input-root .absolute.inset-x-0.top-0.hidden {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* En modo home usamos bottom estable. No aplicamos translate al abrir teclado. */
html.vonu-home-keyboard-open .vonu-home-input-centered {
  transform: translateY(0) !important;
}

  @keyframes vonuRevealIn {
  0% {
    opacity: 0;
    transform: translateY(4px);
    filter: blur(1px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.vonu-reveal {
  animation: vonuRevealIn var(--vonu-reveal-ms, 520ms) ease-out both;
  will-change: opacity, transform, filter;
  overflow: visible !important;
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

/* Evita duplicados visuales: KaTeX genera una capa MathML accesible y una capa HTML visible.
   La capa MathML debe permanecer oculta en pantalla. */
.katex .katex-mathml,
.vonu-markdown .katex .katex-mathml,
.prose .katex .katex-mathml {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}

.katex .katex-html,
.vonu-markdown .katex .katex-html,
.prose .katex .katex-html {
  display: inline-block !important;
}

.vonu-markdown {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.vonu-markdown pre,
.vonu-markdown code {
  max-width: 100%;
}

.vonu-markdown pre {
  overflow-x: auto;
}

/* Fórmulas inline: legibles, sin crecer demasiado en móvil */
.prose .katex {
  font-size: 1.02em !important;
  line-height: normal !important;
  max-width: 100%;
}

/* Bloques matemáticos: no deben crear scroll horizontal visible */
.vonu-markdown .katex-display,
.prose .katex-display {
  box-sizing: border-box !important;
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  margin: 1rem 0 1.15rem !important;
  padding: 0.38rem 0.12rem 0.48rem !important;
  text-align: center !important;
  overflow-x: hidden !important;
  overflow-y: visible !important;
}

/* La fórmula debe intentar adaptarse al ancho disponible */
.vonu-markdown .katex-display > .katex,
.prose .katex-display > .katex {
  display: inline-block !important;
  max-width: 100% !important;
  width: auto !important;
  font-size: 1em !important;
  line-height: 1.44 !important;
  white-space: normal !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
}

/* Aire para estructuras altas: fracciones, raíces, exponentes */
.vonu-markdown .katex-display .vlist-t,
.prose .katex-display .vlist-t {
  line-height: 1.26 !important;
}

/* Fracciones anidadas: un poco de aire sin hacerlas gigantes */
.vonu-markdown .katex-display .mfrac .mfrac,
.prose .katex-display .mfrac .mfrac {
  padding-top: 0.16em !important;
  padding-bottom: 0.16em !important;
}

/* Línea de fracción limpia */
.vonu-markdown .katex .mfrac .frac-line,
.prose .katex .mfrac .frac-line {
  border-bottom-width: 0.055em !important;
}

/* Separación entre texto y fórmula */
.vonu-markdown .katex-display + p,
.vonu-markdown p + .katex-display,
.prose .katex-display + p,
.prose p + .katex-display {
  margin-top: 0.8rem !important;
}

/* Móvil: más compacto para evitar scroll en fórmulas */
@media (max-width: 767px) {
  .prose .katex {
    font-size: 0.94em !important;
    line-height: normal !important;
  }

  .vonu-markdown .katex-display,
  .prose .katex-display {
    margin: 0.8rem 0 0.95rem !important;
    padding: 0.28rem 0.04rem 0.38rem !important;
  }

  .vonu-markdown .katex-display > .katex,
  .prose .katex-display > .katex {
    font-size: 0.84em !important;
    line-height: 1.34 !important;
  }

  .vonu-markdown .katex-display .vlist-t,
  .prose .katex-display .vlist-t {
    line-height: 1.16 !important;
  }

  .vonu-markdown .katex-display .mfrac .mfrac,
  .prose .katex-display .mfrac .mfrac {
    padding-top: 0.1em !important;
    padding-bottom: 0.1em !important;
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
  -webkit-mask: url("/logo/vonu-cube-black.png?v=4") center / contain no-repeat;
  mask: url("/logo/vonu-cube-black.png?v=4") center / contain no-repeat;
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
  <div className="pointer-events-none fixed left-0 right-0 top-4 z-[90] flex justify-center px-4">
    <div className="pointer-events-auto flex w-full max-w-[540px] items-start gap-3 rounded-[28px] border border-zinc-200/80 bg-white/95 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-[13px] font-semibold text-white">
        ✓
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-5 tracking-[-0.02em] text-zinc-950">
          {toastMsg.replace(/^✅\s*/, "")}
        </div>

        {toastMsg.toLowerCase().includes("suscripción") ||
        toastMsg.toLowerCase().includes("plan") ? (
          <div className="mt-0.5 text-[12.5px] leading-5 text-zinc-500">
            Puedes seguir usando VonuAI hasta que termine el periodo pagado.
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setToastMsg(null)}
        className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[18px] leading-none text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
        aria-label="Cerrar aviso"
        title="Cerrar"
      >
        ×
      </button>
    </div>
  </div>
)}

      {/* ===== RENAME MODAL ===== */}
{renameOpen && (
  <div
    className="fixed inset-0 z-[85] overflow-y-auto bg-black/25 px-4 py-5 backdrop-blur-sm sm:px-6"
    onClick={() => {
      if (renameSavedPulse) return;
      setRenameSavedPulse(false);
      setRenameOpen(false);
    }}
  >
    <div className="flex min-h-full items-start justify-center">
      <div
        className={`mt-[8dvh] mb-6 w-full max-w-[420px] rounded-[22px] border border-zinc-200 bg-white p-5 shadow-[0_30px_90px_rgba(0,0,0,0.18)] transition-all duration-200 ${
          renameSavedPulse ? "scale-[0.985]" : "scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[16px] font-semibold text-zinc-900">
              Renombrar conversación
            </div>
            <div className="mt-1 text-[12.5px] leading-5 text-zinc-500">
              Ponle un nombre para encontrarla rápido.
            </div>
          </div>

          <button
            onClick={() => {
              if (renameSavedPulse) return;
              setRenameSavedPulse(false);
              setRenameOpen(false);
            }}
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-950 transition hover:bg-zinc-100 active:scale-95"
            aria-label="Cerrar"
          >
            <span className="relative top-[-1px] text-[24px] font-light leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-1 text-[12px] text-zinc-600">Nombre</div>

          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            disabled={renameSavedPulse}
            className="h-12 w-full rounded-[15px] border border-zinc-300 px-4 text-[15px] text-zinc-950 outline-none transition focus:border-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-500"
            placeholder="Ej: Estafa Wallapop, Inglés vocabulario…"
            autoFocus={isDesktopPointer()}
            onKeyDown={(e) => {
              e.stopPropagation();

              if (e.key === "Escape") {
                setRenameSavedPulse(false);
                setRenameOpen(false);
              }

              if (e.key === "Enter") {
                confirmRename();
              }
            }}
          />
        </div>

        {renameSavedPulse ? (
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-semibold text-emerald-800">
            Nombre actualizado ✓
          </div>
        ) : null}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              if (renameSavedPulse) return;
              setRenameSavedPulse(false);
              setRenameOpen(false);
            }}
            disabled={renameSavedPulse}
            className="h-11 flex-1 cursor-pointer rounded-full border border-zinc-200 text-sm font-semibold transition-colors hover:bg-zinc-50 disabled:cursor-default disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={confirmRename}
            disabled={renameSavedPulse}
            className="h-11 flex-1 cursor-pointer rounded-full bg-zinc-950 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-default disabled:bg-emerald-600"
          >
            {renameSavedPulse ? "Guardado ✓" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* ===== WHITEBOARD ===== */}
<ManualWhiteboardModal
  open={boardOpen}
  boardMsg={boardMsg}
  canvasRef={canvasRef}
  canvasWrapRef={canvasWrapRef}
  boardTool={boardTool}
  setBoardTool={setBoardTool}
  boardColor={boardColor}
  setBoardColor={setBoardColor}
  boardSize={boardSize}
  setBoardSize={setBoardSize}
  onClose={() => {
    setBoardOpen(false);
    setBoardMsg(null);
  }}
  onClear={clearBoard}
  onUndo={undoBoard}
  onExport={exportBoardToChat}
  onCanvasPointerDown={onCanvasPointerDown}
  onCanvasPointerMove={onCanvasPointerMove}
  onCanvasPointerEnd={endStroke}
/>


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

<FilePickerModal
  open={filePickerOpen}
  onClose={() => setFilePickerOpen(false)}
  onPickType={handlePickFileType}
/>

{urlInputOpen && (
  <div
  className="fixed inset-0 z-[115] overflow-hidden overscroll-none touch-none"
  style={{ WebkitOverflowScrolling: "auto" }}
>
    <div
      className="absolute inset-0 bg-black/25 backdrop-blur-[6px]"
      onClick={() => setUrlInputOpen(false)}
      aria-hidden="true"
    />

    <div
  className="absolute inset-0 flex items-start justify-center px-3 pt-[12vh] md:items-center md:px-6 md:pt-0 overflow-hidden overscroll-none touch-none"
  style={{ WebkitOverflowScrolling: "auto" }}
>
      <div
        className="w-full max-w-[520px] rounded-[30px] border border-zinc-200 bg-white/94 backdrop-blur-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
          <div className="text-[18px] font-semibold tracking-[-0.02em] text-zinc-900">
            Introduce el enlace
          </div>
        </div>

        <div className="p-4">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
            className="w-full h-12 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-[16px] text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-300"
            autoFocus
            inputMode="url"
          />
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setUrlInputOpen(false);
              setUrlDraft("");
            }}
            className="flex-1 h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-[14px] font-semibold text-zinc-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              const clean = urlDraft.trim();
              if (!clean) return;

              setUrlInputOpen(false);
              setUrlDraft("");

              sendQuickMessage(
                `Quiero que analices este enlace y me digas si ves algo sospechoso o importante: ${clean}`,
                activeThread?.mode ?? "chat"
              );
            }}
            className="flex-1 h-11 rounded-full bg-[#1a73e8] hover:bg-[#1669c1] text-white text-[14px] font-semibold transition-colors cursor-pointer"
          >
            Analizar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{phoneInputOpen && (
  <div
  className="fixed inset-0 z-[116] overflow-hidden overscroll-none touch-none"
  style={{ WebkitOverflowScrolling: "auto" }}
>
    <div
      className="absolute inset-0 bg-black/25 backdrop-blur-[6px]"
      onClick={() => setPhoneInputOpen(false)}
      aria-hidden="true"
    />

    <div
  className="absolute inset-0 flex items-start justify-center px-3 pt-[12vh] md:items-center md:px-6 md:pt-0 overflow-hidden overscroll-none touch-none"
  style={{ WebkitOverflowScrolling: "auto" }}
>
      <div
        className="w-full max-w-[520px] rounded-[30px] border border-zinc-200 bg-white/94 backdrop-blur-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
          <div className="text-[18px] font-semibold tracking-[-0.02em] text-zinc-900">
            Introduce el número
          </div>
        </div>

        <div className="p-4">
          <input
  value={phoneDraft}
  onChange={(e) => setPhoneDraft(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitPhoneAnalysis();
    }
  }}
  placeholder="+34 600 000 000"
            className="w-full h-12 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-[16px] text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-300"
            autoFocus
            inputMode="tel"
          />
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPhoneInputOpen(false);
              setPhoneDraft("");
            }}
            className="flex-1 h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-[14px] font-semibold text-zinc-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
  type="button"
  onClick={submitPhoneAnalysis}
            className="flex-1 h-11 rounded-full bg-[#1a73e8] hover:bg-[#1669c1] text-white text-[14px] font-semibold transition-colors cursor-pointer"
          >
            Analizar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<input
  ref={pdfInputRef}
  type="file"
  accept="application/pdf,.pdf"
  onChange={onSelectPdf}
  className="hidden"
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
  className="vonu-top-mask pointer-events-none fixed inset-x-0 top-0 z-[45] transition-opacity duration-500 md:hidden"
  style={{
    height: "102px",
    background:
      "linear-gradient(to bottom, rgba(248,249,250,1) 0%, rgba(248,249,250,0.96) 36%, rgba(248,249,250,0.45) 68%, rgba(248,249,250,0) 100%)",
  }}
/>

<Sidebar
  menuOpen={menuOpen}
  setMenuOpen={setMenuOpen}
  SIDEBAR_TOP={SIDEBAR_TOP}
  sortedThreads={sortedThreads}
  activeThreadId={activeThreadId}
  activateThread={activateThread}
    recentlyRenamedThreadId={recentlyRenamedThreadId}
  createThreadAndActivate={createThreadAndActivate}
  openRename={openRename}
  deleteActiveThread={deleteActiveThread}
    deleteThreadById={deleteThreadById}
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
  currentPlanId={usageInfo?.plan_id ?? null}
  messagesLeft={usageInfo?.messages_left ?? null}
realtimeSecondsLeft={usageInfo?.realtime_seconds_left ?? null}
billing={billing}
setBilling={setBilling}
plan={plan}
setPlan={setPlan}
payLoading={payLoading}
payMsg={payMsg}
startCheckout={startCheckout}
startTopupCheckout={startTopupCheckout}
cancelSubscriptionFromHere={cancelSubscriptionFromHere}
/>

      {/* MAIN */}
<div className="flex-1 flex flex-col min-h-0 md:ml-[304px]">
        {uiError && (
          <div className="mx-auto max-w-6xl px-2 md:px-6" style={{ paddingTop: 78, paddingBottom: chatBottomPad }}>
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Ha fallado la llamada a la IA. (Error: {uiError})</div>
          </div>
        )}


{/* ✅ CHAT / TUTOR RENDER     */}

<div
  ref={scrollRef}
  onScroll={handleChatScroll}
  onDragEnter={handleGlobalDragEnter}
  onDragOver={handleGlobalDragOver}
  onDragLeave={handleGlobalDragLeave}
  onDrop={handleGlobalDrop}
  className={[
    "vonu-home-scroll relative flex-1 overflow-y-auto min-h-0 overscroll-contain",
    hasUserMessage ? "vonu-chat-has-messages" : "",
  ].join(" ")}
>
   <div
  className={[
    "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500",
    hasUserMessage ? "opacity-0" : "opacity-100",
  ].join(" ")}
  aria-hidden="true"
>
  <div className="vonu-home-soft-bg absolute inset-0" />
</div>

    <div
  className={[
    "relative z-10 w-full px-4 md:px-6",
    hasUserMessage ? "mx-auto max-w-3xl" : "mx-auto max-w-[980px]",
  ].join(" ")}
  style={{
    paddingTop: hasUserMessage ? 0 : 92,
    paddingBottom: hasUserMessage
      ? chatBottomPad + (isDesktopPointer() ? 90 : 44)
      : inputBarH + 180,
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
  <div className="px-0">
    <div className="mx-auto flex min-h-[calc(100dvh-250px)] w-full max-w-[980px] flex-col items-center justify-start text-center md:min-h-[calc(100dvh-230px)]">
      <div className="vonu-hero-rise mt-[4.8vh] flex w-full flex-col items-center text-center md:mt-[6.5vh]">
        <h1 className="mx-auto max-w-[980px] whitespace-nowrap text-center text-[38px] font-[690] leading-none tracking-[-0.055em] text-zinc-950 md:text-[62px]">
          ¿Qué quieres revisar?
        </h1>
      </div>

      <p
  className="vonu-hero-rise mx-auto mt-5 max-w-[720px] px-2 text-center text-[16px] leading-7 text-zinc-500 md:mt-6 md:text-[18px]"
  style={{ animationDelay: "120ms" }}
>
  Antes de actuar, pega un mensaje, sube una captura o un archivo, o cuéntame la situación.
</p>
    </div>
  </div>
) : null}


      {/* ✅ Mensajes usuario / Vonu */}
      <div className="flex flex-col gap-4">
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const firstUserMessageIndex = messages.findIndex((x) => x.role === "user");
          const isFirstUserMessage =
            isUser && i === firstUserMessageIndex;
          const isLastAssistantMessage =
            m.role === "assistant" &&
            i === messages.length - 1;

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
  ? normalizeBulletMarkdown(
      normalizeMathMarkdown(
        sanitizeTutorLikeImage(normalizeAssistantText(mdTextRaw))
      )
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
                className={[
  "flex w-full justify-end animate-[fadeIn_240ms_ease-out]",
  isFirstUserMessage ? "mt-12 lg:mt-0" : "",
].join(" ")}
              >

                <div
                  className={[
                    "relative min-w-0 max-w-[88%] overflow-x-hidden overflow-y-visible break-words px-3 py-2 text-[15px] leading-relaxed md:max-w-[85%]",
                    "md:shadow-sm bg-[#e9edf1] text-zinc-900 rounded-[22px] mr-1 md:mr-2",
                  ].join(" ")}
                >
                  <div className="relative z-10">
                    {(m.image || m.imageThumb) && (
                    <div className="mb-2">
                      <img
                        src={m.image || m.imageThumb}
                        alt="Adjunto"
                        className="rounded-md max-h-60 max-w-full object-cover"
                      />
                    </div>
                  )}

                    {(m.text || m.streaming) && (
                      <div className="vonu-markdown w-full max-w-full min-w-0 overflow-x-hidden overflow-y-visible break-words [overflow-wrap:anywhere] font-sans text-[17.5px] md:text-[18px] leading-[1.72] md:leading-[1.72]">
                        <span className="whitespace-pre-wrap">{mdText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

                              // ===== VONU PENSANDO =====
          // Sale siempre durante la espera para que Vonu se sienta vivo.
          // Si luego la respuesta es de riesgo, quedará un indicador fijo encima.
          if (isStreaming && !((m.text ?? "").trim())) {
  return (
    <div
      key={m.id}
      className="flex w-full justify-start mt-3 md:mt-4 vonu-answer-in"
    >
      <div className="ml-2 mr-3 md:mr-4 flex w-full max-w-[94%] md:max-w-[86%] flex-col">
        <div className="mb-1.5 md:mb-2 flex justify-start pl-0 md:pl-0">
          <VonuThinking size={38} status="thinking" active />
        </div>
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
              <div className="ml-2 mr-2 md:mr-4 flex w-full max-w-[94%] md:max-w-[86%] flex-col md:flex-row md:items-start gap-0.5 md:gap-1">
                                <div className="hidden" aria-hidden="true" />

                                <div className="min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-visible">
  {(() => {
    if (isStreaming || isUser) return null;

    const previousUserMessage = getPreviousUserMessage(messages, i);

    const previousUserTextForDots = previousUserMessage?.text ?? "";

const isAcademicFinanceContextForDots =
  /\b(mof|ade|van|tir|valor actual|valor actual neto|finanzas|financiera|financieras|matemáticas financieras|matematicas financieras|coste de capital|costo de capital|tasa de descuento|flujo de caja|flujos de caja|proyecto de inversión|proyecto de inversion|renta financiera|amortización|amortizacion)\b/i.test(
    previousUserTextForDots
  );

const hasPracticalRiskIntentForDots =
  /\b(estafa|fraude|phishing|smishing|sms|whatsapp|telegram|enlace|link|url|web sospechosa|tienda online|banco|tarjeta|bizum|transferencia|contrato|cláusula|clausula|factura|cobro|suscripción|suscripcion|tinder|badoo|bumble|instagram|perfil falso|catfish|ia|deepfake|manipulada|manipulado|amenaza|chantaje|sextorsión|sextorsion|me manipula|me presiona|salud|dolor|síntoma|sintoma|urgencias)\b/i.test(
    previousUserTextForDots
  );

const shouldHideRiskDotsForTutorOrAcademic =
  activeThread?.mode === "tutor" ||
  isAcademicFinanceContextForDots ||
  (looksLikeTutorIntent(previousUserTextForDots) && !hasPracticalRiskIntentForDots);

if (shouldHideRiskDotsForTutorOrAcademic) return null;

const assistantRiskStatus = inferRiskStatusFromAssistantText(m.text ?? "");
const userRiskStatus = inferRiskStatusFromUserText(previousUserMessage?.text ?? "");
const neutralIdentityLookup = looksLikeNeutralIdentityLookupFromUserText(previousUserMessage?.text ?? "");

const assistantTextForDots = String(m.text ?? "").toLowerCase();

const previousUserTextForDotsLower = String(previousUserMessage?.text ?? "").toLowerCase();

const isPhoneAnalysisPromptForDots =
  (
    previousUserTextForDotsLower.includes("número de teléfono") ||
    previousUserTextForDotsLower.includes("numero de telefono") ||
    previousUserTextForDotsLower.includes("llamada sospechosa") ||
    previousUserTextForDotsLower.includes("teléfono o llamada") ||
    previousUserTextForDotsLower.includes("telefono o llamada")
  ) &&
  /(?:\+?\d[\d\s().-]{6,}\d)/.test(previousUserTextForDotsLower);

const assistantClearlyLowRiskPhone =
  isPhoneAnalysisPromptForDots &&
  (
    assistantTextForDots.includes("móvil español válido") ||
    assistantTextForDots.includes("movil espanol valido") ||
    assistantTextForDots.includes("móvil válido en españa") ||
    assistantTextForDots.includes("movil valido en espana") ||
    assistantTextForDots.includes("número válido") ||
    assistantTextForDots.includes("numero valido")
  ) &&
  (
    assistantTextForDots.includes("no muestra señales técnicas claras") ||
    assistantTextForDots.includes("no muestra senales tecnicas claras") ||
    assistantTextForDots.includes("no veo señales técnicas claras") ||
    assistantTextForDots.includes("no veo senales tecnicas claras") ||
    assistantTextForDots.includes("por sí solo") ||
    assistantTextForDots.includes("por si solo") ||
    assistantTextForDots.includes("sin más contexto") ||
    assistantTextForDots.includes("sin mas contexto") ||
    assistantTextForDots.includes("solo por el número") ||
    assistantTextForDots.includes("solo por el numero")
  );

const hasHardPhoneDangerInUserPrompt =
  previousUserTextForDotsLower.includes("banco") ||
  previousUserTextForDotsLower.includes("bizum") ||
  previousUserTextForDotsLower.includes("transferencia") ||
  previousUserTextForDotsLower.includes("código sms") ||
  previousUserTextForDotsLower.includes("codigo sms") ||
  previousUserTextForDotsLower.includes("otp") ||
  previousUserTextForDotsLower.includes("cargo") ||
  previousUserTextForDotsLower.includes("tarjeta") ||
  previousUserTextForDotsLower.includes("instalar") ||
  previousUserTextForDotsLower.includes("anydesk") ||
  previousUserTextForDotsLower.includes("teamviewer") ||
  previousUserTextForDotsLower.includes("acceso remoto") ||
  previousUserTextForDotsLower.includes("dni") ||
  previousUserTextForDotsLower.includes("contraseña") ||
  previousUserTextForDotsLower.includes("contrasena");

const assistantClearlyLowRiskPhoneForDots =
  assistantClearlyLowRiskPhone && !hasHardPhoneDangerInUserPrompt;

  const hasStrongPhoneFraudContextForDots =
  isPhoneAnalysisPromptForDots &&
  (
    hasHardPhoneDangerInUserPrompt ||
    assistantTextForDots.includes("no des ningún código") ||
    assistantTextForDots.includes("no des ningun codigo") ||
    assistantTextForDots.includes("no facilites ningún código") ||
    assistantTextForDots.includes("no facilites ningun codigo") ||
    assistantTextForDots.includes("intento de fraude") ||
    assistantTextForDots.includes("robarte el código") ||
    assistantTextForDots.includes("robarte el codigo") ||
    assistantTextForDots.includes("vaciar tu cuenta") ||
    assistantTextForDots.includes("los bancos nunca piden códigos") ||
    assistantTextForDots.includes("los bancos nunca piden codigos") ||
    assistantTextForDots.includes("contacta directamente con tu banco") ||
    assistantTextForDots.includes("teléfono oficial de tu banco") ||
    assistantTextForDots.includes("telefono oficial de tu banco")
  );

const assistantClearlyLowRiskDating =
  (
    assistantTextForDots.includes("tinder") ||
    assistantTextForDots.includes("bumble") ||
    assistantTextForDots.includes("badoo") ||
    assistantTextForDots.includes("app de citas") ||
    assistantTextForDots.includes("perfil de citas")
  ) &&
  (
    assistantTextForDots.includes("no hay banderas rojas claras") ||
    assistantTextForDots.includes("no se detectan señales claras") ||
    assistantTextForDots.includes("no se detectan senales claras") ||
    assistantTextForDots.includes("no veo señales claras de peligro") ||
    assistantTextForDots.includes("no veo senales claras de peligro") ||
    assistantTextForDots.includes("no hay señales claras de peligro") ||
    assistantTextForDots.includes("no hay senales claras de peligro")
  ) &&
  (
    assistantTextForDots.includes("verificación visible") ||
    assistantTextForDots.includes("verificacion visible") ||
    assistantTextForDots.includes("suma confianza") ||
    assistantTextForDots.includes("buen indicio")
  ) &&
  !assistantTextForDots.includes("aparece reutilizada") &&
  !assistantTextForDots.includes("foto reutilizada") &&
  !assistantTextForDots.includes("imagen reutilizada") &&
  !assistantTextForDots.includes("foto robada") &&
  !assistantTextForDots.includes("imagen robada") &&
  !assistantTextForDots.includes("perfil falso") &&
  !assistantTextForDots.includes("catfish") &&
  !assistantTextForDots.includes("pide dinero") &&
  !assistantTextForDots.includes("pedir dinero") &&
  !assistantTextForDots.includes("enviar dinero") &&
  !assistantTextForDots.includes("envíes dinero") &&
  !assistantTextForDots.includes("envies dinero") &&
  !assistantTextForDots.includes("enlace sospechoso") &&
  !assistantTextForDots.includes("enlaces sospechosos") &&
  !assistantTextForDots.includes("amenaza") &&
  !assistantTextForDots.includes("chantaje");

const finalRiskStatus = hasStrongPhoneFraudContextForDots
  ? "high"
  : neutralIdentityLookup
    ? "safe"
    : assistantClearlyLowRiskDating
      ? "safe"
      : assistantClearlyLowRiskPhoneForDots
        ? "safe"
        : assistantRiskStatus ?? userRiskStatus;

if (!finalRiskStatus) return null;

    return (
  <div className="mb-2 md:mb-2.5 flex min-h-[34px] md:min-h-0 items-start justify-start overflow-visible pt-2.5 md:pt-0 pl-0 md:pl-0">
    <div className="overflow-visible translate-y-[5px] md:translate-y-0">
      <VonuThinking
        size={38}
        status={finalRiskStatus}
        active={false}
      />
    </div>
  </div>
);
  })()}

  <div className="vonu-reveal min-w-0 max-w-full overflow-x-hidden overflow-y-visible">
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
    <div className="vonu-markdown w-full max-w-full min-w-0 overflow-x-hidden overflow-y-visible break-words [overflow-wrap:anywhere] font-sans text-[18px] md:text-[19px] leading-8 md:leading-8">
    {mdText.includes('"elements"') || mdText.includes("```excalidraw") ? null : (
      <>
        <ReactMarkdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
          components={makeMdComponents(
            m.boardImageB64,
            m.boardImagePlacement,
            m.pizarra
          )}
        >
          {mdText}
        </ReactMarkdown>

        {isStreaming && hasText ? <TypingCaret /> : null}
      </>
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

                  <AssistantMessageActions
                    isLastAssistantMessage={isLastAssistantMessage}
                    isStreaming={!!m.streaming}
                    hasText={!!(m.text ?? "").trim()}
                    onCopy={copyConversationToClipboard}
                    onShare={shareConversation}
                    onDownloadPdf={downloadConversationAsPdf}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
</div>
</div>

{isDraggingFile && !paywallOpen ? (
  <div className="fixed inset-0 z-[9999] pointer-events-none">
    <div className="absolute inset-0 bg-white/42 backdrop-blur-[6px]" />

    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] rounded-[30px] border border-zinc-300 bg-white/90 backdrop-blur-xl px-8 py-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-[18px] border border-zinc-300 bg-white grid place-items-center text-zinc-900">
          <svg viewBox="0 0 24 24" className="h-[24px] w-[24px]" fill="none" aria-hidden="true">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>

<div className="mt-4 mx-auto max-w-[260px] text-center text-[18px] leading-7 font-semibold tracking-[-0.02em] text-zinc-900">
  Suelta el archivo para analizarlo
</div>
      </div>
    </div>
  </div>
) : null}

{showScrollToBottom && hasUserMessage && !paywallOpen && (
  <button
    type="button"
    onClick={() => scrollToBottomNow("smooth")}
    className="fixed right-5 md:right-8 z-[65] h-11 w-11 rounded-full bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-white transition-all cursor-pointer grid place-items-center"
    style={{
      bottom: `calc(${inputBarH}px + env(safe-area-inset-bottom) + 14px)`,
    }}
    aria-label="Ir al final del chat"
    title="Ir al final"
  >
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-zinc-800" fill="none" aria-hidden="true">
      <path
        d="M12 6v11"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M7 14.5 12 19.5l5-5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)}

{!paywallOpen && (
  <ChatInputBar
  inputBarRef={inputBarRef}
  imagePreview={imagePreview}
  pdfPreview={pdfPreview}
  micMsg={micMsg}
  input={input}
  setInput={setInput}
  onHomeInputFocus={() => {
  if (!hasUserMessage) {
    document.documentElement.classList.add("vonu-home-input-focus-mode");

    const resetHomeScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    };

    requestAnimationFrame(resetHomeScroll);
    window.setTimeout(resetHomeScroll, 60);
    window.setTimeout(resetHomeScroll, 140);
    window.setTimeout(resetHomeScroll, 260);
    window.setTimeout(resetHomeScroll, 420);
  }
}}
onHomeInputBlur={() => {
  document.documentElement.classList.remove("vonu-home-input-focus-mode");
  document.documentElement.classList.remove("vonu-home-keyboard-open");

  // Solo limpiamos la altura del teclado si seguimos en pantalla inicial.
  // En conversación normal la necesitamos para que el input no quede debajo del teclado.
  if (!hasUserMessage) {
    document.documentElement.style.removeProperty("--vonu-keyboard-height");
  }
}}
    isTyping={isTyping}
    textareaRef={textareaRef}
    handleKeyDown={handleKeyDown}
    handlePaste={handlePasteIntoChat}
    canSend={canSend}
    sendMessage={sendMessage}
    voiceMode={voiceMode}
    realtimeStatus={realtimeStatus}
    isLoggedIn={isLoggedIn}
    toggleConversation={toggleConversation}
    openBoard={openBoard}
    openFilePicker={() => setFilePickerOpen(true)}
    fileInputRef={fileInputRef}
    onSelectImage={onSelectImage}
    clearImagePreview={() => setImagePreview(null)}
    clearPdfPreview={() => setPdfPreview(null)}
  />
)}
    </div>
  </div>
  );
}