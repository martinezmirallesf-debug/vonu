"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

console.log("✅ ChalkboardTutorBoard ACTIVO (BoardSpecV1 + fixed-height background + diagrams + image)");

type Props = {
  value: string;
  className?: string;
  backgroundSrc?: string;
  width?: number; // logical 1000
  height?: number; // logical 600
  boardImageB64?: string | null;
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null;
};

type ColorName = "white" | "yellow" | "cyan" | "pink" | "green" | "orange" | "red" | "blue" | "lightgreen";

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

function parseColorToken(v: string | undefined): string {
  if (!v) return COLOR_MAP.white;
  const key = v.toLowerCase() as ColorName;
  return COLOR_MAP[key] ?? v;
}

// ================== SANITIZE ==================
function sanitizeBoardValue(raw: string) {
  const s = (raw || "").replace(/\r\n/g, "\n");

  // Si viene un JSON gigantesco tool-ish colado, lo tiramos.
  const tooJsony = s.includes('"elements"') || s.includes('"files"') || s.includes('"appState"');
  if (tooJsony && !s.trim().startsWith("{")) {
    return "";
  }

  const lines = s.split("\n");
  const cleaned: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    // restos típicos
    if (t.includes("{{IM") || t.includes("[[IM") || t.includes("placement") || t.includes("boardImage") || t.includes("b64")) continue;
    if (t.startsWith(" ") && t.toLowerCase().includes("excalidraw")) continue;

    cleaned.push(line);
  }

  return cleaned.join("\n");
}

// ================== SPEC V1 (lo que devuelve el tutor) ==================
type BoardSpecV1 = {
  v: 1;
  layout: "split" | "full";
  title: string;
  left?: string[];
  right?: string[];
  diagram?: "pipeline" | "right_triangle" | "axes" | "none";
  centerLabel?: string;
  triangle?: { a?: string; b?: string; c?: string; formula?: string };
  axes?: { xLabel?: string; yLabel?: string; curveLabel?: string };
  image?: { enabled: boolean };
};

function tryParseBoardSpecV1(value: string): BoardSpecV1 | null {
  const t = (value || "").trim();
  if (!t.startsWith("{") || !t.endsWith("}")) return null;

  try {
    const obj = JSON.parse(t);
    if (!obj || typeof obj !== "object") return null;
    if (obj.v !== 1) return null;
    if (obj.layout !== "split" && obj.layout !== "full") return null;
    if (typeof obj.title !== "string") return null;
    return obj as BoardSpecV1;
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

function measureText(ctx: CanvasRenderingContext2D, text: string, size: number) {
  ctx.save();
  ctx.font = `${size}px "Architects Daughter","Patrick Hand",system-ui,-apple-system,Segoe UI,Roboto,Arial`;
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
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

// ================== DIAGRAMS ==================
function drawPipelineDiagram(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  centerLabel: string,
  rng: () => number
) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;

  const bw = Math.min(320, box.w * 0.72);
  const bh = Math.min(120, box.h * 0.42);

  const x = cx - bw / 2;
  const y = cy - bh / 2;

  // caja
  drawWobblyLine(ctx, x, y, x + bw, y, COLOR_MAP.white, 5, rng);
  drawWobblyLine(ctx, x + bw, y, x + bw, y + bh, COLOR_MAP.white, 5, rng);
  drawWobblyLine(ctx, x + bw, y + bh, x, y + bh, COLOR_MAP.white, 5, rng);
  drawWobblyLine(ctx, x, y + bh, x, y, COLOR_MAP.white, 5, rng);

  // label centrado
  const label = (centerLabel || "PROCESO").toUpperCase();
  const size = 34;
  const tw = measureText(ctx, label, size);
  drawText(ctx, label, cx - tw / 2, cy - size / 2, size, COLOR_MAP.yellow, rng);

  // flechas lados
  const axL = box.x + 16;
  const axR = box.x + box.w - 16;
  drawArrow(ctx, axL, cy, x - 14, cy, COLOR_MAP.white, 5, rng);
  drawArrow(ctx, x + bw + 14, cy, axR, cy, COLOR_MAP.white, 5, rng);
}

function drawRightTriangle(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  tri: { a?: string; b?: string; c?: string; formula?: string } | undefined,
  rng: () => number
) {
  // triángulo grande y centrado
  const pad = 18;
  const x0 = box.x + pad;
  const y0 = box.y + box.h - pad;
  const x1 = box.x + box.w - pad;
  const y1 = box.y + box.h - pad;
  const x2 = box.x + pad;
  const y2 = box.y + pad;

  // base, altura, hipotenusa
  drawWobblyLine(ctx, x0, y0, x1, y1, COLOR_MAP.white, 6, rng);
  drawWobblyLine(ctx, x0, y0, x2, y2, COLOR_MAP.white, 6, rng);
  drawWobblyLine(ctx, x2, y2, x1, y1, COLOR_MAP.white, 6, rng);

  // ángulo recto (cuadradito)
  const s = 26;
  drawWobblyLine(ctx, x0, y0, x0 + s, y0, COLOR_MAP.white, 5, rng);
  drawWobblyLine(ctx, x0 + s, y0, x0 + s, y0 - s, COLOR_MAP.white, 5, rng);
  drawWobblyLine(ctx, x0 + s, y0 - s, x0, y0 - s, COLOR_MAP.white, 5, rng);

  const a = (tri?.a || "a").trim();
  const b = (tri?.b || "b").trim();
  const c = (tri?.c || "c").trim();

  drawText(ctx, a, (x0 + x1) / 2 - 8, y0 + 10, 30, COLOR_MAP.cyan, rng);
  drawText(ctx, b, x0 - 30, (y0 + y2) / 2 - 16, 30, COLOR_MAP.cyan, rng);
  drawText(ctx, c, (x2 + x1) / 2 - 10, (y2 + y1) / 2 - 30, 30, COLOR_MAP.green, rng);

  const f = (tri?.formula || "c² = a² + b²").trim();
  if (f) {
    drawText(ctx, f, box.x + 10, box.y + 10, 30, COLOR_MAP.yellow, rng);
  }
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  ax: { xLabel?: string; yLabel?: string; curveLabel?: string } | undefined,
  rng: () => number
) {
  const pad = 18;
  const x0 = box.x + pad;
  const y0 = box.y + box.h - pad;
  const x1 = box.x + box.w - pad;
  const y1 = box.y + pad;

  // ejes con flecha
  drawArrow(ctx, x0, y0, x1, y0, COLOR_MAP.white, 5, rng);
  drawArrow(ctx, x0, y0, x0, y1, COLOR_MAP.white, 5, rng);

  const xLabel = (ax?.xLabel || "x").trim();
  const yLabel = (ax?.yLabel || "y").trim();
  drawText(ctx, xLabel, x1 - 14, y0 + 8, 28, COLOR_MAP.cyan, rng);
  drawText(ctx, yLabel, x0 - 22, y1 - 6, 28, COLOR_MAP.cyan, rng);

  // curva simple (parábola suave)
  const steps = 18;
  ctx.save();
  ctx.strokeStyle = COLOR_MAP.green;
  ctx.lineWidth = 5;
  drawChalkStroke(ctx, () => {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 - (box.h * 0.62) * (t * t); // curva hacia arriba
      const wobx = (rng() - 0.5) * 0.9;
      const woby = (rng() - 0.5) * 0.9;
      if (i === 0) ctx.moveTo(x + wobx, y + woby);
      else ctx.lineTo(x + wobx, y + woby);
    }
    ctx.stroke();
  });
  ctx.restore();

  const curve = (ax?.curveLabel || "y = ...").trim();
  if (curve) drawText(ctx, curve, x0 + 10, y1 + 10, 28, COLOR_MAP.green, rng);
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
  const spec = useMemo(() => tryParseBoardSpecV1(safeValue), [safeValue]);

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

      // cache overlay image
      let overlayImg: HTMLImageElement | null = null;
      if (boardImageB64) {
        if (imgCacheRef.current.b64 !== boardImageB64) {
          imgCacheRef.current.b64 = boardImageB64;
          imgCacheRef.current.img = await loadB64Image(boardImageB64);
        }
        overlayImg = imgCacheRef.current.img;
      } else {
        imgCacheRef.current.b64 = null;
        imgCacheRef.current.img = null;
      }

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      const dispW = box.w || width;
      const dispH = box.h || height;

      c.width = Math.floor(dispW * dpr);
      c.height = Math.floor(dispH * dpr);

      // logical to screen transform
      const sx = dispW / width;
      const sy = dispH / height;
      ctx.setTransform(dpr * sx, 0, 0, dpr * sy, 0, 0);

      ctx.clearRect(0, 0, width, height);

      // safe inset
      const INSET_X = 58;
      const INSET_Y = 44;
      const CLIP_W = width - INSET_X * 2;
      const CLIP_H = height - INSET_Y * 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(INSET_X, INSET_Y, CLIP_W, CLIP_H);
      ctx.clip();

      // image under everything
      if (overlayImg && boardImagePlacement) {
        const { x, y, w, h } = boardImagePlacement;
        const xx = clamp(x, INSET_X, INSET_X + CLIP_W - 1);
        const yy = clamp(y, INSET_Y, INSET_Y + CLIP_H - 1);
        const ww = clamp(w, 1, INSET_X + CLIP_W - xx);
        const hh = clamp(h, 1, INSET_Y + CLIP_H - yy);

        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.shadowColor = "rgba(255,255,255,0.18)";
        ctx.shadowBlur = 0.9;
        ctx.drawImage(overlayImg, xx, yy, ww, hh);
        ctx.restore();
      }

      // ===== RENDER SPEC V1 =====
      if (spec) {
        const seed = hashStr(JSON.stringify(spec));
        const rng = mulberry32(seed);

        const title = (spec.title || "").trim();
        const layout = spec.layout;
        const diagram = spec.diagram || "none";

        // tamaños “más clase”: títulos menos grandes, texto más protagonista
        const TITLE_SIZE = 54; // antes 66
        const ITEM_SIZE = 36; // un pelín más grande y legible
        const SMALL_SIZE = 30;

        // 1) Title
        let y = INSET_Y + 16;
        const xL = INSET_X + 18;

        if (title) {
          drawText(ctx, title.toUpperCase(), xL, y, TITLE_SIZE, COLOR_MAP.white, rng);
          const ulY = y + TITLE_SIZE + 6;
          drawWobblyLine(ctx, xL, ulY, xL + Math.min(520, CLIP_W - 40), ulY, COLOR_MAP.yellow, 6, rng);
          y += TITLE_SIZE + 22;
        } else {
          y += 14;
        }

        // 2) Regions (rigid layout)
        const contentTop = y;
        const contentH = INSET_Y + CLIP_H - contentTop;

        if (layout === "split") {
          const gap = 56;
          const colW = (CLIP_W - gap) / 2;

          const leftBox = { x: INSET_X + 18, y: contentTop + 4, w: colW - 18, h: contentH - 8 };
          const rightBox = { x: INSET_X + colW + gap + 18, y: contentTop + 4, w: colW - 18, h: contentH - 8 };

          const leftLines = Array.isArray(spec.left) ? spec.left.filter(Boolean).slice(0, 8) : [];
          const rightLines = Array.isArray(spec.right) ? spec.right.filter(Boolean).slice(0, 8) : [];

          // left text
          let ly = leftBox.y;
          const rowH = 46;
          for (let i = 0; i < leftLines.length; i++) {
            drawText(ctx, String(leftLines[i]), leftBox.x, ly, ITEM_SIZE, COLOR_MAP.cyan, rng);
            ly += rowH;
          }

          // right text
          let ry = rightBox.y;
          for (let i = 0; i < rightLines.length; i++) {
            drawText(ctx, String(rightLines[i]), rightBox.x, ry, ITEM_SIZE, COLOR_MAP.green, rng);
            ry += rowH;
          }

          // diagram region in the middle lane (no overlap)
          const mid = {
            x: INSET_X + colW - 6,
            y: contentTop + 16,
            w: gap + 12,
            h: contentH - 32,
          };

          if (diagram === "pipeline") {
            drawPipelineDiagram(ctx, mid, spec.centerLabel || "PROCESO", rng);
          } else if (diagram === "right_triangle") {
            // if asked, render triangle in right box (bigger)
            drawRightTriangle(ctx, { x: rightBox.x, y: rightBox.y + 6, w: rightBox.w, h: rightBox.h - 10 }, spec.triangle, rng);
          } else if (diagram === "axes") {
            drawAxes(ctx, { x: rightBox.x, y: rightBox.y + 6, w: rightBox.w, h: rightBox.h - 10 }, spec.axes, rng);
          } else {
            // subtle divider
            drawWobblyLine(ctx, INSET_X + colW + gap / 2, contentTop + 8, INSET_X + colW + gap / 2, INSET_Y + CLIP_H - 8, COLOR_MAP.white, 3, rng);
          }
        } else {
          // full layout: top-left text + big diagram centered below
          const leftLines = Array.isArray(spec.left) ? spec.left.filter(Boolean).slice(0, 8) : [];
          const tx = INSET_X + 18;
          let ty = contentTop + 2;

          const rowH = 46;
          for (let i = 0; i < leftLines.length; i++) {
            drawText(ctx, String(leftLines[i]), tx, ty, ITEM_SIZE, COLOR_MAP.white, rng);
            ty += rowH;
          }

          const diagBox = {
            x: INSET_X + 18,
            y: Math.max(ty + 10, contentTop + 130),
            w: CLIP_W - 36,
            h: INSET_Y + CLIP_H - (Math.max(ty + 10, contentTop + 130)) - 18,
          };

          if (diagram === "pipeline") drawPipelineDiagram(ctx, diagBox, spec.centerLabel || "PROCESO", rng);
          if (diagram === "right_triangle") drawRightTriangle(ctx, diagBox, spec.triangle, rng);
          if (diagram === "axes") drawAxes(ctx, diagBox, spec.axes, rng);

          // right lines (si existen) abajo a la derecha
          const rightLines = Array.isArray(spec.right) ? spec.right.filter(Boolean).slice(0, 6) : [];
          if (rightLines.length) {
            const rx = INSET_X + CLIP_W * 0.58;
            let ry = contentTop + 2;
            for (let i = 0; i < rightLines.length; i++) {
              drawText(ctx, String(rightLines[i]), rx, ry, SMALL_SIZE, COLOR_MAP.green, rng);
              ry += 40;
            }
          }
        }

        ctx.restore();
        return;
      }

      // ===== FALLBACK (si NO viene JSON spec) =====
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
        drawText(ctx, title.toUpperCase(), x, y, 54, COLOR_MAP.white, r);
        const ulY = y + 54 + 6;
        drawWobblyLine(ctx, x, ulY, x + 520, ulY, COLOR_MAP.yellow, 6, r);
        y += 84;
      }

      for (let i = 1; i < lines.length; i++) {
        drawText(ctx, lines[i], x, y, 34, COLOR_MAP.white, r);
        y += 44;
      }

      ctx.restore();
    };

    draw();
  }, [safeValue, spec, width, height, box.w, box.h, boardImageB64, boardImagePlacement]);

  return (
    <div className={className ?? ""}>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[26px] border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
        style={{
          backgroundImage: `url(${backgroundSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {/* Reservamos altura real (la da el contenedor padre). Si no hay, ponemos una base. */}
        <div aria-hidden="true" className="w-full" style={{ height: "clamp(360px, 62vh, 720px)" }} />
      </div>
    </div>
  );
}
