"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

console.log("✅ ChalkboardTutorBoard ACTIVO (BoardSpec v1 + layout + diagrams + sanitize + clip)");

type Props = {
  value: string;
  className?: string;
  backgroundSrc?: string;
  width?: number; // logical 1000
  height?: number; // logical 600
  boardImageB64?: string | null;
  boardImagePlacement?: { x: number; y: number; w: number; h: number } | null;
};

type ColorName = "white" | "yellow" | "cyan" | "pink" | "green" | "orange" | "red" | "blue" | "lightgreen" | "chalk";

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
  chalk: "#f4f7f4",
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
/**
 * Elimina “restos” típicos:
 * - tool/json incrustados
 * - líneas con placement, b64, etc
 * - latex escapado feo \\( \\) \\[ \\]
 */
function sanitizeBoardValue(raw: string) {
  const s0 = (raw || "").replace(/\r\n/g, "\n");

  // Si viene un JSON gigantesco “colado” (excalidraw), lo tiramos.
  const tooJsony = s0.includes('"elements"') || s0.includes('"files"') || s0.includes('"appState"');
  if (tooJsony && !s0.trim().startsWith("{")) return "";

  // Limpieza LaTeX escapado típico (para que jamás se vea \\(c\\))
  const s = s0
    .replace(/\\\\\[/g, "")
    .replace(/\\\\\]/g, "")
    .replace(/\\\\\(/g, "(")
    .replace(/\\\\\)/g, ")")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")");

  const lines = s.split("\n");
  const cleaned: string[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    // basura típica
    if (t.includes("{{IM") || t.includes("[[IM")) continue;
    if (t.toLowerCase().includes("placement")) continue;
    if (t.toLowerCase().includes("boardimage")) continue;
    if (t.toLowerCase().includes("b64")) continue;
    if (t.startsWith(" ") && t.toLowerCase().includes("excalidraw")) continue;

    cleaned.push(line);
  }

  return cleaned.join("\n").trim();
}

// ================== RNG / Chalk ==================
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

function drawChalkStroke(ctx: CanvasRenderingContext2D, fn: () => void) {
  ctx.save();
  ctx.globalAlpha = 0.93;
  ctx.shadowColor = "rgba(255,255,255,0.18)";
  ctx.shadowBlur = 1.0;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fn();
  ctx.restore();
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

function setChalkFont(ctx: CanvasRenderingContext2D, size: number) {
  // IMPORTANT: no template string broken
  ctx.font = `${size}px "Architects Daughter","Patrick Hand","Comic Sans MS",system-ui,-apple-system,Segoe UI,Roboto,Arial`;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, rng: () => number) {
  ctx.save();
  ctx.textBaseline = "top";
  setChalkFont(ctx, size);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.96;
  ctx.shadowColor = "rgba(255,255,255,0.14)";
  ctx.shadowBlur = 0.9;

  const jx = (rng() - 0.5) * 0.55;
  const jy = (rng() - 0.5) * 0.55;
  ctx.fillText(text, x + jx, y + jy);
  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const out: string[] = [];
  let line = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = line + " " + words[i];
    const w = ctx.measureText(test).width;
    if (w <= maxWidth) {
      line = test;
    } else {
      out.push(line);
      line = words[i];
    }
  }
  out.push(line);
  return out;
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

// ================== BoardSpec v1 (NEW) ==================
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

// ================== Legacy (twoCol) ==================
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

  // ✅ NEW: soporta BoardSpec v1
  const specV1 = useMemo(() => tryParseBoardSpecV1(safeValue), [safeValue]);

  // legacy
  const auto = useMemo(() => (specV1 ? null : tryParseAutoBoard(safeValue)), [safeValue, specV1]);

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

      // ✅ IMPORTANTE: aquí hacemos que el canvas SIEMPRE siga el contenedor real
      const dispW = box.w || width;
      const dispH = box.h || Math.round((dispW * height) / width);

      c.width = Math.floor(dispW * dpr);
      c.height = Math.floor(dispH * dpr);

      const sx = dispW / width;
      const sy = dispH / height;

      ctx.setTransform(dpr * sx, 0, 0, dpr * sy, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // safe inset
      const INSET_X = 56;
      const INSET_Y = 44;
      const CLIP_W = width - INSET_X * 2;
      const CLIP_H = height - INSET_Y * 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(INSET_X, INSET_Y, CLIP_W, CLIP_H);
      ctx.clip();

      // 0) optional image below everything
      if (rightImg && boardImagePlacement) {
        const { x, y, w, h } = boardImagePlacement;
        const xx = clamp(x, INSET_X, INSET_X + CLIP_W - 1);
        const yy = clamp(y, INSET_Y, INSET_Y + CLIP_H - 1);
        const ww = clamp(w, 1, INSET_X + CLIP_W - xx);
        const hh = clamp(h, 1, INSET_Y + CLIP_H - yy);

        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.shadowColor = "rgba(255,255,255,0.16)";
        ctx.shadowBlur = 0.9;
        ctx.drawImage(rightImg, xx, yy, ww, hh);
        ctx.restore();
      }

      // =========================
      // ✅ RENDER: BoardSpec v1
      // =========================
      if (specV1) {
        const seed = hashStr(JSON.stringify(specV1));
        const rng = mulberry32(seed);

        const titleRaw = (specV1.title || "").trim();
        const title = titleRaw.length > 42 ? titleRaw.slice(0, 42) + "…" : titleRaw;

        const layout = specV1.layout;
        const left = Array.isArray(specV1.left) ? specV1.left.filter(Boolean).slice(0, 10) : [];
        const right = Array.isArray(specV1.right) ? specV1.right.filter(Boolean).slice(0, 10) : [];

        const diagram = specV1.diagram || "none";

        // Title size adaptive (no gigantón)
        const TITLE_SIZE = clamp(Math.round(54 - Math.max(0, title.length - 16) * 0.8), 36, 54);
        const H_SIZE = 30;
        const ITEM_SIZE = 30;

        // zones
        const topY = INSET_Y + 16;
        let y = topY;

        // Title (left aligned, underline)
        if (title) {
          drawText(ctx, title.toUpperCase(), INSET_X + 16, y, TITLE_SIZE, COLOR_MAP.chalk, rng);
          const ulY = y + TITLE_SIZE + 6;
          drawWobblyLine(ctx, INSET_X + 16, ulY, INSET_X + 16 + Math.min(520, CLIP_W - 40), ulY, COLOR_MAP.yellow, 5, rng);
          y += TITLE_SIZE + 22;
        } else {
          y += 18;
        }

        const contentTop = y;
        const contentH = INSET_Y + CLIP_H - contentTop - 10;

        // columns
        const gap = layout === "split" ? 54 : 0;
        const colW = layout === "split" ? (CLIP_W - gap) / 2 : CLIP_W;
        const leftX = INSET_X + 16;
        const rightX = INSET_X + colW + gap + 16;

        // diagram box (reserved so no solapes)
        // For split: diagram goes on the right lower area (or center if full)
        const diagBox = (() => {
          if (diagram === "none") return null;

          if (layout === "split") {
            return {
              x: rightX,
              y: contentTop + 10 + Math.min(110, right.length * 34),
              w: colW - 28,
              h: Math.max(180, contentH - Math.min(110, right.length * 34) - 18),
            };
          }

          // full layout: diagram to the right half, text to the left half
          return {
            x: INSET_X + CLIP_W * 0.52,
            y: contentTop + 14,
            w: CLIP_W * 0.46,
            h: contentH - 20,
          };
        })();

        // text max widths
        const leftTextMax = layout === "split" ? colW - 34 : CLIP_W * 0.48 - 30;
        const rightTextMax = layout === "split" ? colW - 34 : CLIP_W * 0.48 - 30;

        // In full: text area is left half
        const fullTextX = INSET_X + 16;
        const fullTextW = CLIP_W * 0.48;

        // helper to draw list
        const drawList = (items: string[], x0: number, y0: number, maxW: number, color: string) => {
          ctx.save();
          setChalkFont(ctx, ITEM_SIZE);
          ctx.fillStyle = color;
          ctx.restore();

          let yy = y0;
          for (const it of items) {
            const text = String(it || "").trim();
            if (!text) continue;

            // wrapping
            ctx.save();
            setChalkFont(ctx, ITEM_SIZE);
            const lines = wrapText(ctx, text, maxW);
            ctx.restore();

            for (const line of lines.slice(0, 2)) {
              drawText(ctx, "• " + line, x0, yy, ITEM_SIZE, color, rng);
              yy += 36;
            }

            // spacing between bullets
            yy += 6;

            // if overflow, stop
            if (yy > contentTop + contentH - 24) break;
          }
        };

        // split layout
        if (layout === "split") {
          // headers (optional feel)
          drawText(ctx, "IZQ:", leftX, contentTop, H_SIZE, COLOR_MAP.white, rng);
          drawText(ctx, "DER:", rightX, contentTop, H_SIZE, COLOR_MAP.white, rng);

          const listY = contentTop + H_SIZE + 10;

          // Left list
          drawList(left, leftX, listY, leftTextMax, COLOR_MAP.cyan);

          // Right list (but if we have diagram, keep top area for list)
          let rightListMaxH = contentTop + contentH;
          if (diagBox) rightListMaxH = diagBox.y - 18;

          // Draw right list with a manual clamp by temporarily clipping
          ctx.save();
          ctx.beginPath();
          ctx.rect(rightX, listY, colW - 20, rightListMaxH - listY);
          ctx.clip();
          drawList(right, rightX, listY, rightTextMax, COLOR_MAP.green);
          ctx.restore();

          // Draw arrows between first pairs (clean & aligned)
          const rows = Math.min(left.length, right.length, 6);
          if (rows > 0) {
            const rowY0 = listY + 10;
            const rowH = 42;
            for (let i = 0; i < rows; i++) {
              const ay = rowY0 + i * rowH + 10;
              const ax1 = leftX + colW - 58;
              const ax2 = rightX - 16;
              drawArrow(ctx, ax1, ay, ax2, ay, COLOR_MAP.white, 4.6, rng);
            }
          }
        } else {
          // full layout: text left half
          const textX = fullTextX;
          const textY = contentTop + 6;

          // a “subheader” feel with centerLabel
          const centerLabel = (specV1.centerLabel || "").trim();
          if (centerLabel) {
            drawText(ctx, centerLabel.toUpperCase(), textX, textY, 30, COLOR_MAP.yellow, rng);
          }

          const listsY = textY + (centerLabel ? 46 : 10);
          drawList(left.length ? left : right, textX, listsY, fullTextW - 22, COLOR_MAP.white);
        }

        // =========================
        // Diagrams
        // =========================
        if (diagBox) {
          const { x, y: dy, w: dw, h: dh } = diagBox;

          const drawBoxTitle = (label: string) => {
            if (!label) return;
            drawText(ctx, label.toUpperCase(), x + 8, dy + 6, 26, COLOR_MAP.yellow, rng);
            const ulY = dy + 34;
            drawWobblyLine(ctx, x + 8, ulY, x + 8 + Math.min(dw - 18, 220), ulY, COLOR_MAP.yellow, 4, rng);
          };

          if (diagram === "right_triangle") {
            drawBoxTitle("Triángulo");

            const pad = 26;
            const bx = x + pad;
            const by = dy + 64;
            const bw = dw - pad * 2;
            const bh = dh - 86;

            // triangle points
            const p1 = { x: bx, y: by + bh }; // bottom-left
            const p2 = { x: bx + bw, y: by + bh }; // bottom-right
            const p3 = { x: bx, y: by }; // top-left (right angle at p1? -> use p1 as corner)
            // Better: right angle at bottom-left: (bx, by+bh), top-left (bx, by), bottom-right (bx+bw, by+bh)
            drawWobblyLine(ctx, p1.x, p1.y, p2.x, p2.y, COLOR_MAP.white, 5, rng); // base
            drawWobblyLine(ctx, p1.x, p1.y, p3.x, p3.y, COLOR_MAP.white, 5, rng); // vertical
            drawWobblyLine(ctx, p3.x, p3.y, p2.x, p2.y, COLOR_MAP.white, 5, rng); // hypotenuse

            // right angle mark
            const ra = 18;
            drawWobblyLine(ctx, p1.x, p1.y - ra, p1.x + ra, p1.y - ra, COLOR_MAP.yellow, 3.8, rng);
            drawWobblyLine(ctx, p1.x + ra, p1.y - ra, p1.x + ra, p1.y, COLOR_MAP.yellow, 3.8, rng);

            const a = specV1.triangle?.a || "a";
            const b = specV1.triangle?.b || "b";
            const c = specV1.triangle?.c || "c";
            const formula = specV1.triangle?.formula || "c² = a² + b²";

            // labels
            drawText(ctx, b, (p1.x + p2.x) / 2 - 8, p1.y + 10, 26, COLOR_MAP.cyan, rng);
            drawText(ctx, a, p1.x - 22, (p1.y + p3.y) / 2 - 10, 26, COLOR_MAP.cyan, rng);
            drawText(ctx, c, (p3.x + p2.x) / 2 + 10, (p3.y + p2.y) / 2 - 18, 26, COLOR_MAP.green, rng);

            // formula
            drawText(ctx, formula, x + 8, dy + dh - 36, 28, COLOR_MAP.green, rng);
          }

          if (diagram === "axes") {
            drawBoxTitle("Ejes");

            const pad = 26;
            const bx = x + pad;
            const by = dy + 64;
            const bw = dw - pad * 2;
            const bh = dh - 86;

            const ox = bx + 26;
            const oy = by + bh - 18;

            // axes
            drawArrow(ctx, ox, oy, ox + bw - 30, oy, COLOR_MAP.white, 4.6, rng);
            drawArrow(ctx, ox, oy, ox, by + 16, COLOR_MAP.white, 4.6, rng);

            const xLabel = specV1.axes?.xLabel || "x";
            const yLabel = specV1.axes?.yLabel || "y";
            const curve = specV1.axes?.curveLabel || "y = …";

            drawText(ctx, xLabel, ox + bw - 42, oy + 6, 24, COLOR_MAP.cyan, rng);
            drawText(ctx, yLabel, ox - 18, by + 10, 24, COLOR_MAP.cyan, rng);

            // simple curve
            ctx.save();
            ctx.strokeStyle = COLOR_MAP.green;
            ctx.lineWidth = 4.2;
            drawChalkStroke(ctx, () => {
              ctx.beginPath();
              for (let i = 0; i <= 24; i++) {
                const t = i / 24;
                const px = ox + t * (bw - 56);
                const py = oy - (t * t) * (bh - 60);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.stroke();
            });
            ctx.restore();

            drawText(ctx, curve, ox + 16, by + 18, 26, COLOR_MAP.green, rng);
          }

          if (diagram === "pipeline") {
            drawBoxTitle(specV1.centerLabel || "Proceso");

            const pad = 24;
            const bx = x + pad;
            const by = dy + 66;
            const bw = dw - pad * 2;
            const bh = dh - 88;

            // 3 steps
            const stepH = 46;
            const stepW = bw - 20;
            const startY = by + 10;

            const steps = [
              (specV1.left?.[0] || "Entrada").slice(0, 28),
              (specV1.centerLabel || "Proceso").slice(0, 28),
              (specV1.right?.[0] || "Salida").slice(0, 28),
            ];

            for (let i = 0; i < 3; i++) {
              const sy = startY + i * (stepH + 22);
              // box
              ctx.save();
              ctx.globalAlpha = 0.9;
              ctx.strokeStyle = "rgba(255,255,255,0.65)";
              ctx.lineWidth = 3.2;
              drawChalkStroke(ctx, () => {
                ctx.beginPath();
                ctx.roundRect?.(bx + 10, sy, stepW, stepH, 14);
                ctx.stroke();
              });
              ctx.restore();

              drawText(ctx, steps[i], bx + 26, sy + 10, 26, i === 1 ? COLOR_MAP.yellow : COLOR_MAP.white, rng);

              if (i < 2) {
                const ax1 = bx + bw * 0.5;
                const ay1 = sy + stepH + 6;
                const ax2 = ax1;
                const ay2 = sy + stepH + 18;
                drawArrow(ctx, ax1, ay1, ax2, ay2, COLOR_MAP.white, 4, rng);
              }
            }
          }
        }

        ctx.restore();
        return;
      }

      // =========================
      // Legacy: twoCol JSON
      // =========================
      if (auto?.layout === "twoCol") {
        const seed = hashStr(JSON.stringify(auto));
        const rng = mulberry32(seed);

        const title = (auto.title || "").trim();
        const leftTitle = (auto.leftTitle || "ENTRA").trim();
        const rightTitle = (auto.rightTitle || "SALE").trim();
        const left = Array.isArray(auto.left) ? auto.left.filter(Boolean).slice(0, 8) : [];
        const right = Array.isArray(auto.right) ? auto.right.filter(Boolean).slice(0, 8) : [];
        const note = (auto.note || "").trim();

        const TITLE_SIZE = 52;
        const H_SIZE = 32;
        const ITEM_SIZE = 30;

        const colGap = 54;
        const colW = (CLIP_W - colGap) / 2;
        const leftX = INSET_X + 16;
        const rightX = INSET_X + colW + colGap + 16;

        let y = INSET_Y + 16;

        if (title) {
          drawText(ctx, title.toUpperCase(), leftX, y, TITLE_SIZE, COLOR_MAP.white, rng);
          const ulY = y + TITLE_SIZE + 6;
          drawWobblyLine(ctx, leftX, ulY, leftX + Math.min(460, colW - 40), ulY, COLOR_MAP.yellow, 5, rng);
          y += TITLE_SIZE + 22;
        } else {
          y += 16;
        }

        drawText(ctx, leftTitle.toUpperCase() + ":", leftX, y, H_SIZE, COLOR_MAP.white, rng);
        drawText(ctx, rightTitle.toUpperCase() + ":", rightX, y, H_SIZE, COLOR_MAP.white, rng);
        y += H_SIZE + 12;

        const rows = Math.max(left.length, right.length, 1);
        const rowH = 44;

        for (let i = 0; i < rows; i++) {
          const ly = y + i * rowH;
          const ltxt = left[i] || "";
          const rtxt = right[i] || "";

          if (ltxt) drawText(ctx, ltxt, leftX, ly, ITEM_SIZE, COLOR_MAP.cyan, rng);
          if (rtxt) drawText(ctx, rtxt, rightX, ly, ITEM_SIZE, COLOR_MAP.green, rng);

          if (ltxt && rtxt) {
            const ax1 = leftX + colW - 52;
            const ax2 = rightX - 16;
            const ay = ly + 14;
            drawArrow(ctx, ax1, ay, ax2, ay, COLOR_MAP.white, 4.6, rng);
          }
        }

        if (note) {
          const ny = y + rows * rowH + 10;
          drawText(ctx, note, leftX, ny, 26, COLOR_MAP.white, rng);
        }

        ctx.restore();
        return;
      }

      // =========================
      // Fallback: texto suelto
      // =========================
      const baseSeed = hashStr(safeValue || "board");
      const r = mulberry32(baseSeed);

      let x = INSET_X + 16;
      let y = INSET_Y + 16;

      const lines = (safeValue || "")
        .split("\n")
        .map((l) => l.trimEnd())
        .filter(Boolean)
        .slice(0, 14);

      const title = lines[0] || "";
      if (title) {
        const T = clamp(54 - Math.max(0, title.length - 16) * 0.8, 36, 54);
        drawText(ctx, title.toUpperCase(), x, y, T, COLOR_MAP.white, r);
        const ulY = y + T + 6;
        drawWobblyLine(ctx, x, ulY, x + Math.min(520, CLIP_W - 40), ulY, COLOR_MAP.yellow, 5, r);
        y += T + 22;
      }

      for (let i = 1; i < lines.length; i++) {
        drawText(ctx, lines[i], x, y, 30, COLOR_MAP.white, r);
        y += 40;
      }

      ctx.restore();
    };

    draw();
  }, [safeValue, specV1, auto, width, height, box.w, box.h, boardImageB64, boardImagePlacement]);

  return (
    <div className={className ?? ""}>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[26px] border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
      >
        <img src={backgroundSrc} alt="Pizarra" className="block w-full h-auto select-none pointer-events-none" draggable={false} />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
