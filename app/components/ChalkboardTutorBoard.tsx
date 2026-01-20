"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
console.log("✅ ChalkboardTutorBoard ACTIVO (layout 50/50 + sanitize + clip + image)");

// ================== TYPES ==================
type Props = {
  value: string;
  className?: string;
  backgroundSrc?: string;
  width?: number; // logical 1000
  height?: number; // logical 600
  boardImageB64?: string | null;
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null;
};

type ColorName =
  | "white"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "orange"
  | "red"
  | "blue"
  | "lightgreen";

const COLOR_MAP: Record<ColorName, string> = {
  white: "#e9efe9",
  yellow: "#ffe67a",
  cyan: "#79e6ff",
  pink: "#ff86c8",
  green: "#8cff9a",
  orange: "#ffb36b",
  red: "#ff6b6b",
  blue: "#79a7ff",
  lightgreen: "#9dffb8",
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function parseNumber(s: string, fallback = 0) {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}
function parseColorToken(v: string | undefined): string {
  if (!v) return COLOR_MAP.white;
  const key = v.toLowerCase() as ColorName;
  return COLOR_MAP[key] ?? v;
}

// ================== SANITIZE ==================
/**
 * Esto elimina “restos” típicos que a veces se cuelan:
 *  - {{IM ...}}, [[IM...]], placement, b64, "elements", etc.
 *  - bloques tool/json incrustados
 */
function sanitizeBoardValue(raw: string) {
  const s = (raw || "").replace(/\r\n/g, "\n");

  // Si viene un JSON gigantesco “colado”, lo tiramos.
  const tooJsony = s.includes('"elements"') || s.includes('"files"') || s.includes('"appState"');
  if (tooJsony && !s.trim().startsWith("{")) {
    // mejor mostrar nada que basura
    return "";
  }

  const lines = s.split("\n");
  const cleaned: string[] = [];

  for (const line of lines) {
    const t = line.trim();

    // basura típica
    if (!t) continue;
    if (t.includes("{{IM") || t.includes("[[IM") || t.includes("placement") || t.includes("boardImage") || t.includes("b64")) continue;
    if (t.startsWith("```") && t.toLowerCase().includes("excalidraw")) continue;

    cleaned.push(line);
  }

  return cleaned.join("\n");
}

// ================== AUTO LAYOUT (50/50) ==================
/**
 * Este modo es CLAVE:
 * La IA ya NO tiene que dibujar flechas ni colocar nada.
 * Solo devuelve un JSON muy simple dentro del ```pizarra
 *
 * {
 *   "layout":"twoCol",
 *   "title":"FOTOSÍNTESIS",
 *   "leftTitle":"ENTRA",
 *   "left":["CO2 (aire)","H2O (raíz)","LUZ (sol)"],
 *   "rightTitle":"SALE",
 *   "right":["GLUCOSA","O2"],
 *   "note":"(en cloroplastos)"
 * }
 */
type AutoBoard = {
  layout: "twoCol";
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  left?: string[];
  right?: string[];
  note?: string;
};

function tryParseAutoBoard(value: string): AutoBoard | null {
  const t = (value || "").trim();
  if (!t.startsWith("{") || !t.endsWith("}")) return null;
  try {
    const obj = JSON.parse(t);
    if (obj?.layout !== "twoCol") return null;
    return obj as AutoBoard;
  } catch {
    return null;
  }
}

// ================== DRAWING PRIMITIVES ==================
function drawChalkStroke(ctx: CanvasRenderingContext2D, fn: () => void) {
  ctx.save();
  ctx.globalAlpha = 0.93;
  ctx.shadowColor = "rgba(255,255,255,0.20)";
  ctx.shadowBlur = 1.0;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fn();
  ctx.restore();
}

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawWobblyLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lw: number,
  rng: () => number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  const steps = clamp(Math.round(dist / 34), 4, 18);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const jitter = clamp(lw * 0.18, 0.45, 1.6);

  const drawOnce = (alpha: number, extra: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;

    drawChalkStroke(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const tt = i / steps;
        const bx = x1 + dx * tt;
        const by = y1 + dy * tt;

        const wob = (rng() - 0.5) * (jitter + extra);
        const px = bx + nx * wob;
        const py = by + ny * wob;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    ctx.restore();
  };

  drawOnce(0.92, 0);
  drawOnce(0.35, 0.5);
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number, rng: () => number) {
  drawWobblyLine(ctx, x1, y1, x2, y2, color, lw, rng);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 10 + lw * 1.1;

  const ax1 = x2 - head * Math.cos(ang - Math.PI / 7);
  const ay1 = y2 - head * Math.sin(ang - Math.PI / 7);
  const ax2 = x2 - head * Math.cos(ang + Math.PI / 7);
  const ay2 = y2 - head * Math.sin(ang + Math.PI / 7);

  drawWobblyLine(ctx, x2, y2, ax1, ay1, color, lw, rng);
  drawWobblyLine(ctx, x2, y2, ax2, ay2, color, lw, rng);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, rng: () => number) {
  ctx.save();
  ctx.textBaseline = "top";
  ctx.font = `${size}px "Architects Daughter","Patrick Hand",system-ui,-apple-system,Segoe UI,Roboto,Arial`;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "rgba(255,255,255,0.18)";
  ctx.shadowBlur = 0.9;

  const jx = (rng() - 0.5) * 0.45;
  const jy = (rng() - 0.5) * 0.45;
  ctx.fillText(text, x + jx, y + jy);
  ctx.restore();
}

async function ensureFontsReady() {
  try {
    // @ts-ignore
    if (document?.fonts?.ready) {
      // @ts-ignore
      await document.fonts.ready;
    }
  } catch {}
}

async function loadB64Image(b64: string): Promise<HTMLImageElement | null> {
  if (!b64) return null;
  const src = b64.startsWith("data:image") ? b64 : `data:image/png;base64,${b64}`;
  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ================== COMPONENT ==================
export default function ChalkboardTutorBoard({
  value,
  className,
  backgroundSrc = "/boards/chalkboard-classic.webp",
  width = 1000,
  height = 600,
  boardImageB64 = null,
  boardImagePlacement = null,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const imgCacheRef = useRef<{ b64: string | null; img: HTMLImageElement | null }>({ b64: null, img: null });

  const safeValue = useMemo(() => sanitizeBoardValue(value), [value]);
  const auto = useMemo(() => tryParseAutoBoard(safeValue), [safeValue]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setBox({ w: Math.max(1, Math.floor(cr.width)), h: Math.max(1, Math.floor(cr.height)) });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    const draw = async () => {
      await ensureFontsReady();

      // cache image
      let rightImg: HTMLImageElement | null = null;
      if (boardImageB64) {
        if (imgCacheRef.current.b64 !== boardImageB64) {
          imgCacheRef.current.b64 = boardImageB64;
          imgCacheRef.current.img = await loadB64Image(boardImageB64);
        }
        rightImg = imgCacheRef.current.img;
      } else {
        imgCacheRef.current.b64 = null;
        imgCacheRef.current.img = null;
      }

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const dispW = box.w || width;
      const dispH = box.h || Math.round((dispW * height) / width);

      c.width = Math.floor(dispW * dpr);
      c.height = Math.floor(dispH * dpr);

      const sx = dispW / width;
      const sy = dispH / height;

      ctx.setTransform(dpr * sx, 0, 0, dpr * sy, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // safe inset (para que nada pinte fuera)
      const INSET_X = 58;
      const INSET_Y = 44;
      const CLIP_W = width - INSET_X * 2;
      const CLIP_H = height - INSET_Y * 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(INSET_X, INSET_Y, CLIP_W, CLIP_H);
      ctx.clip();

      // 0) image below everything
      if (rightImg && boardImagePlacement) {
        const { x, y, w, h } = boardImagePlacement;
        const xx = clamp(x, INSET_X, INSET_X + CLIP_W - 1);
        const yy = clamp(y, INSET_Y, INSET_Y + CLIP_H - 1);
        const ww = clamp(w, 1, INSET_X + CLIP_W - xx);
        const hh = clamp(h, 1, INSET_Y + CLIP_H - yy);

        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.shadowColor = "rgba(255,255,255,0.18)";
        ctx.shadowBlur = 0.9;
        ctx.drawImage(rightImg, xx, yy, ww, hh);
        ctx.restore();
      }

      // ===== AUTO LAYOUT 50/50 =====
      if (auto?.layout === "twoCol") {
        const seed = hashStr(JSON.stringify(auto));
        const rng = mulberry32(seed);

        const title = (auto.title || "").trim();
        const leftTitle = (auto.leftTitle || "ENTRA").trim();
        const rightTitle = (auto.rightTitle || "SALE").trim();
        const left = Array.isArray(auto.left) ? auto.left.filter(Boolean).slice(0, 8) : [];
        const right = Array.isArray(auto.right) ? auto.right.filter(Boolean).slice(0, 8) : [];
        const note = (auto.note || "").trim();

        const TITLE_SIZE = 66;
        const H_SIZE = 36;
        const ITEM_SIZE = 34;

        // columnas
        const colGap = 60;
        const colW = (CLIP_W - colGap) / 2;
        const leftX = INSET_X + 18;
        const rightX = INSET_X + colW + colGap + 18;

        // title
        let y = INSET_Y + 18;
        if (title) {
          drawText(ctx, title.toUpperCase(), leftX, y, TITLE_SIZE, COLOR_MAP.white, rng);
          // underline
          const ulY = y + TITLE_SIZE + 6;
          drawWobblyLine(ctx, leftX, ulY, leftX + Math.min(420, colW - 40), ulY, COLOR_MAP.yellow, 6, rng);
          y += TITLE_SIZE + 26;
        } else {
          y += 20;
        }

        // headers
        drawText(ctx, leftTitle.toUpperCase() + ":", leftX, y, H_SIZE, COLOR_MAP.white, rng);
        drawText(ctx, rightTitle.toUpperCase() + ":", rightX, y, H_SIZE, COLOR_MAP.white, rng);
        y += H_SIZE + 14;

        // filas alineadas (flechas centradas entre columnas)
        const rows = Math.max(left.length, right.length, 1);
        const rowH = 46;

        for (let i = 0; i < rows; i++) {
          const ly = y + i * rowH;
          const ltxt = left[i] || "";
          const rtxt = right[i] || "";

          if (ltxt) drawText(ctx, ltxt, leftX, ly, ITEM_SIZE, COLOR_MAP.cyan, rng);
          if (rtxt) drawText(ctx, rtxt, rightX, ly, ITEM_SIZE, COLOR_MAP.green, rng);

          // flecha SOLO si hay izquierda y derecha
          if (ltxt && rtxt) {
            const ax1 = leftX + colW - 40;
            const ax2 = rightX - 18;
            const ay = ly + 16;
            drawArrow(ctx, ax1, ay, ax2, ay, COLOR_MAP.white, 5, rng);
          }
        }

        // note
        if (note) {
          const ny = y + rows * rowH + 10;
          drawText(ctx, note, leftX, ny, 30, COLOR_MAP.white, rng);
        }

        ctx.restore();
        return;
      }

      // ===== FALLBACK (si NO viene JSON) =====
      // Si llega “texto suelto”, lo pintamos simple en una columna limpia.
      const baseSeed = hashStr(safeValue || "board");
      const r = mulberry32(baseSeed);

      let x = INSET_X + 18;
      let y = INSET_Y + 18;

      const lines = (safeValue || "")
        .split("\n")
        .map((l) => l.trimEnd())
        .filter(Boolean)
        .slice(0, 14);

      const title = lines[0] || "";
      if (title) {
        drawText(ctx, title.toUpperCase(), x, y, 62, COLOR_MAP.white, r);
        const ulY = y + 62 + 6;
        drawWobblyLine(ctx, x, ulY, x + 420, ulY, COLOR_MAP.yellow, 6, r);
        y += 92;
      }

      for (let i = 1; i < lines.length; i++) {
        drawText(ctx, lines[i], x, y, 34, COLOR_MAP.white, r);
        y += 44;
      }

      ctx.restore();
    };

    draw();
  }, [safeValue, auto, width, height, box.w, box.h, boardImageB64, boardImagePlacement]);

  return (
    <div className={className ?? ""}>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[26px] border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
      >
        <img
          src={backgroundSrc}
          alt="Pizarra"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
