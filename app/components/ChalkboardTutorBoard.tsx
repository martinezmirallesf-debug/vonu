"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
console.log("✅ ChalkboardTutorBoard ACTIVO (JSON boardSpec + stable layout)");

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

type DrawCmd =
  | { kind: "rect"; x: number; y: number; w: number; h: number; color: string; lw: number; fill?: string | null }
  | { kind: "circle"; x: number; y: number; r: number; color: string; lw: number; fill?: string | null }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; color: string; lw: number }
  | { kind: "arrow"; x1: number; y1: number; x2: number; y2: number; color: string; lw: number }
  | { kind: "underline"; x1: number; y: number; x2: number; color: string; lw: number }
  | { kind: "text"; x: number; y: number; size: number; color: string; text: string }
  | { kind: "tri"; x: number; y: number; w: number; h: number; color: string; lw: number };

type ParsedBoard = {
  lines: string[];
  cmds: DrawCmd[];
};

// ---------- legacy compat parsers ----------
function numsFromParen(raw: string): number[] {
  const m = raw.match(/\(([^)]*)\)/);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => parseNumber(x, 0));
}

function tagsFromBrackets(raw: string): string[] {
  const tags: string[] = [];
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    if (m[1]) tags.push(m[1].trim());
  }
  return tags;
}

function parseBracketTags(tags: string[]) {
  const out: { size?: number; color?: string; w?: number; fill?: string | null; arrow?: boolean } = {};
  for (const t of tags) {
    const parts = t.split(/\s+/).filter(Boolean);
    if (!parts.length) continue;

    if (parts[0].toLowerCase() === "arrow") out.arrow = true;
    if (parts[0].toLowerCase() === "size" && parts[1]) out.size = clamp(parseNumber(parts[1], 38), 14, 90);
    if (parts[0].toLowerCase() === "w" && parts[1]) out.w = clamp(parseNumber(parts[1], 4), 1, 12);
    if (parts[0].toLowerCase() === "color" && parts[1]) out.color = parseColorToken(parts[1]);
    if (parts[0].toLowerCase() === "fill" && parts[1]) out.fill = parseColorToken(parts[1]);
  }
  return out;
}

function parseCommand(line: string): DrawCmd | null {
  const raw = line.trim();
  if (!raw.startsWith("@")) return null;

  // ✅ hard rule: si una línea @text tiene pipes rotos, NO la pintamos (evita “se ve código”)
  if (raw.toLowerCase().startsWith("@text ")) {
    const pipeCount = (raw.match(/\|/g) || []).length;
    if (pipeCount !== 2) return null;

    const pipeA = raw.indexOf("|");
    const pipeB = raw.lastIndexOf("|");
    const inside = pipeA !== -1 && pipeB !== -1 && pipeB > pipeA ? raw.slice(pipeA + 1, pipeB) : "";
    const head = (pipeA !== -1 ? raw.slice(0, pipeA) : raw).trim();

    const parts = head.split(/\s+/).slice(1);
    const x = parseNumber(parts[0], 60);
    const y = parseNumber(parts[1], 60);

    let size = 38;
    let color = COLOR_MAP.white;

    for (const token of parts.slice(2)) {
      const [k, v] = token.split("=");
      if (!v) continue;
      if (k === "size") size = clamp(parseNumber(v, 38), 14, 90);
      if (k === "color") color = parseColorToken(v);
    }

    return { kind: "text", x, y, size, color, text: inside || "" };
  }

  // Compat viejo con paréntesis (si existiera)
  if (raw.toLowerCase().startsWith("@text(")) {
    const nums = numsFromParen(raw);
    const tags = parseBracketTags(tagsFromBrackets(raw));
    const after = raw.replace(/@text\([^)]*\)/i, "").replace(/\[[^\]]*\]/g, "").trim();

    const x = nums[0] ?? 60;
    const y = nums[1] ?? 60;
    const size = tags.size ?? 38;
    const color = tags.color ?? COLOR_MAP.white;

    return { kind: "text", x, y, size, color, text: after };
  }

  if (raw.toLowerCase().startsWith("@line(")) {
    const nums = numsFromParen(raw);
    const tags = parseBracketTags(tagsFromBrackets(raw));
    const color = tags.color ?? COLOR_MAP.white;
    const lw = tags.w ?? 4;

    const [x1, y1, x2, y2] = nums;
    if (tags.arrow) return { kind: "arrow", x1, y1, x2, y2, color, lw };
    return { kind: "line", x1, y1, x2, y2, color, lw };
  }

  if (raw.toLowerCase().startsWith("@circle(")) {
    const nums = numsFromParen(raw);
    const tags = parseBracketTags(tagsFromBrackets(raw));
    const color = tags.color ?? COLOR_MAP.white;
    const lw = tags.w ?? 4;
    const fill = tags.fill ?? null;

    const [x, y, r] = nums;
    return { kind: "circle", x, y, r, color, lw, fill };
  }

  if (raw.toLowerCase().startsWith("@rect(")) {
    const nums = numsFromParen(raw);
    const tags = parseBracketTags(tagsFromBrackets(raw));
    const color = tags.color ?? COLOR_MAP.white;
    const lw = tags.w ?? 4;
    const fill = tags.fill ?? null;

    const [x, y, w, h] = nums;
    return { kind: "rect", x, y, w, h, color, lw, fill };
  }

  const parts = raw.split(/\s+/);
  const cmd = parts[0].slice(1).toLowerCase();

  const nums: number[] = [];
  const kv: Record<string, string> = {};
  for (const t of parts.slice(1)) {
    if (t.includes("=")) {
      const [k, v] = t.split("=");
      if (k && v) kv[k.toLowerCase()] = v;
    } else {
      nums.push(parseNumber(t, 0));
    }
  }

  const color = parseColorToken(kv["color"]);
  const lw = clamp(parseNumber(kv["w"], 4), 1, 12);

  if (cmd === "rect") {
    const [x, y, w, h] = nums;
    return { kind: "rect", x, y, w, h, color, lw };
  }
  if (cmd === "circle") {
    const [x, y, r] = nums;
    return { kind: "circle", x, y, r, color, lw };
  }
  if (cmd === "line") {
    const [x1, y1, x2, y2] = nums;
    return { kind: "line", x1, y1, x2, y2, color, lw };
  }
  if (cmd === "arrow") {
    const [x1, y1, x2, y2] = nums;
    return { kind: "arrow", x1, y1, x2, y2, color, lw };
  }
  if (cmd === "underline") {
    const [x1, y, x2] = nums;
    return { kind: "underline", x1, y, x2, color, lw };
  }
  if (cmd === "tri") {
    const [x, y, w, h] = nums;
    return { kind: "tri", x, y, w, h, color, lw };
  }

  return null;
}

function parseBoard(value: string): ParsedBoard {
  const rawLines = (value || "").replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  const cmds: DrawCmd[] = [];

  for (const l of rawLines) {
    const trimmed = l.trim();
    if (!trimmed) continue;

    const c = parseCommand(trimmed);
    if (c) {
      cmds.push(c);
      continue;
    }

    // ✅ clave: si empieza por @ pero no es comando válido -> NO lo pintes como texto (evita “código”)
    if (trimmed.startsWith("@")) continue;

    lines.push(l);
  }

  return { lines, cmds };
}

// --- tags [color]text[/color] ---
type Seg = { text: string; color: string };

function parseColorTags(line: string): Seg[] {
  const out: Seg[] = [];
  let rest = line;

  const re = /\[(white|yellow|cyan|pink|green|orange|red|blue|lightgreen)\]([\s\S]*?)\[\/\1\]/i;

  while (true) {
    const m = rest.match(re);
    if (!m || m.index === undefined) break;

    const before = rest.slice(0, m.index);
    if (before) out.push({ text: before, color: COLOR_MAP.white });

    const colName = (m[1] || "white").toLowerCase() as ColorName;
    out.push({ text: m[2] || "", color: COLOR_MAP[colName] || COLOR_MAP.white });

    rest = rest.slice(m.index + m[0].length);
  }

  if (rest) out.push({ text: rest, color: COLOR_MAP.white });

  return out.filter((s) => s.text.length > 0);
}

// -------- chalk render (más recto, menos wobble) --------
function drawChalkStroke(ctx: CanvasRenderingContext2D, fn: () => void) {
  ctx.save();
  ctx.globalAlpha = 0.93;
  ctx.shadowColor = "rgba(255,255,255,0.18)";
  ctx.shadowBlur = 0.9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fn();
  ctx.restore();
}

function drawLineDust(ctx: CanvasRenderingContext2D, x: number, y: number, lw: number, color: string, rng: () => number) {
  const dust = Math.max(1, Math.floor(lw / 3));
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = color;
  for (let i = 0; i < dust; i++) {
    const rx = x + (rng() - 0.5) * (lw * 2.0);
    const ry = y + (rng() - 0.5) * (lw * 2.0);
    ctx.fillRect(rx, ry, 1, 1);
  }
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

  const steps = clamp(Math.round(dist / 34), 4, 16);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);

  const jitter = clamp(lw * 0.16, 0.35, 1.6);

  const drawOnce = (alpha: number, extra: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;

    drawChalkStroke(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const bx = x1 + dx * t;
        const by = y1 + dy * t;

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
  drawOnce(0.35, 0.45);
}

function drawWobblyRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  lw: number,
  rng: () => number
) {
  drawWobblyLine(ctx, x, y, x + w, y, color, lw, rng);
  drawWobblyLine(ctx, x + w, y, x + w, y + h, color, lw, rng);
  drawWobblyLine(ctx, x + w, y + h, x, y + h, color, lw, rng);
  drawWobblyLine(ctx, x, y + h, x, y, color, lw, rng);
}

function drawWobblyCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, lw: number, rng: () => number) {
  const steps = 28;
  const jitter = clamp(lw * 0.14, 0.35, 1.35);

  const drawOnce = (alpha: number, extra: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;

    drawChalkStroke(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const rr = r + (rng() - 0.5) * (jitter + extra);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.restore();
  };

  drawOnce(0.92, 0);
  drawOnce(0.35, 0.45);
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

function drawTextLine(ctx: CanvasRenderingContext2D, segs: Seg[], x: number, y: number, fontSize: number, rng: () => number) {
  ctx.save();
  ctx.textBaseline = "top";
  ctx.font = `${fontSize}px "Architects Daughter", "Patrick Hand", system-ui, -apple-system, Segoe UI, Roboto, Arial`;

  let cursorX = x;

  for (const seg of segs) {
    const jx = (rng() - 0.5) * 0.35;
    const jy = (rng() - 0.5) * 0.35;

    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = "rgba(255,255,255,0.16)";
    ctx.shadowBlur = 0.8;

    ctx.fillText(seg.text, cursorX + jx, y + jy);

    const w = ctx.measureText(seg.text).width;
    cursorX += w;
  }

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

// ✅ cargar imagen b64 -> HTMLImageElement
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

// -------------------- NEW: JSON boardSpec --------------------
type BoardSpecV1 = {
  v: 1;
  layout: "split" | "full";
  title: string;

  // Texto principal (profe). Corto, entendible.
  left?: string[];
  right?: string[];

  // Diagrama “universal” (sin coords)
  diagram?: "pipeline" | "right_triangle" | "axes" | "none";
  centerLabel?: string;

  // Para mates
  triangle?: { a?: string; b?: string; c?: string; formula?: string };
  axes?: { xLabel?: string; yLabel?: string; curveLabel?: string };

  // Si hace falta imagen IA (tiza), el backend la devuelve por props; aquí solo ponemos hueco layout
  image?: { enabled: boolean };
};

function tryParseBoardSpec(raw: string): BoardSpecV1 | null {
  const t = (raw || "").trim();
  if (!t) return null;
  if (!(t.startsWith("{") && t.endsWith("}"))) return null;
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

function sanitizeLines(arr: any, max = 8): string[] {
  if (!Array.isArray(arr)) return [];
  const out: string[] = [];
  for (const x of arr) {
    if (typeof x !== "string") continue;
    const s = x.trim();
    if (!s) continue;
    out.push(s.slice(0, 120));
    if (out.length >= max) break;
  }
  return out;
}

function buildCmdsFromSpec(spec: BoardSpecV1): DrawCmd[] {
  const cmds: DrawCmd[] = [];

  const TITLE_X = 110;
  const TITLE_Y = 70;

  cmds.push({ kind: "text", x: TITLE_X, y: TITLE_Y, size: 66, color: COLOR_MAP.white, text: spec.title.toUpperCase() });
  cmds.push({ kind: "underline", x1: TITLE_X, y: 140, x2: 610, color: COLOR_MAP.yellow, lw: 7 });

  const left = sanitizeLines(spec.left, 9);
  const right = sanitizeLines(spec.right, 9);

  // Área útil para layout
  const LEFT_X = 95;
  const RIGHT_X = 560;
  const TOP_Y = 200;
  const LINE_H = 44;

  const drawBullets = (x: number, y: number, lines: string[], color: string) => {
    let yy = y;
    for (const ln of lines) {
      cmds.push({ kind: "text", x, y: yy, size: 38, color, text: ln });
      yy += LINE_H;
    }
  };

  if (spec.layout === "split") {
    // texto izquierda y derecha
    if (left.length) drawBullets(LEFT_X, TOP_Y, left, COLOR_MAP.white);
    if (right.length) drawBullets(RIGHT_X, TOP_Y, right, COLOR_MAP.white);

    // diagrama “pipeline” en medio (si aplica)
    const diagram = spec.diagram || "pipeline";
    const center = (spec.centerLabel || "").trim();

    if (diagram === "pipeline") {
      const CX = 500;
      const CY = 320;

      if (center) {
        cmds.push({ kind: "text", x: 440, y: 300, size: 38, color: COLOR_MAP.white, text: center.toUpperCase() });
      }

      // Flechas izquierda -> centro
      cmds.push({ kind: "arrow", x1: 320, y1: 265, x2: 460, y2: 265, color: COLOR_MAP.white, lw: 6 });
      cmds.push({ kind: "arrow", x1: 320, y1: 310, x2: 460, y2: 310, color: COLOR_MAP.white, lw: 6 });
      cmds.push({ kind: "arrow", x1: 320, y1: 355, x2: 460, y2: 355, color: COLOR_MAP.white, lw: 6 });

      // Flechas centro -> derecha
      cmds.push({ kind: "arrow", x1: 660, y1: 265, x2: 845, y2: 265, color: COLOR_MAP.white, lw: 6 });
      cmds.push({ kind: "arrow", x1: 660, y1: 310, x2: 845, y2: 310, color: COLOR_MAP.white, lw: 6 });

      // Punto de atención en el centro (pequeño círculo tiza)
      cmds.push({ kind: "circle", x: CX, y: CY, r: 22, color: COLOR_MAP.white, lw: 5 });
      cmds.push({ kind: "underline", x1: 430, y: 345, x2: 630, color: COLOR_MAP.white, lw: 4 });
    }

    // Si hay imagen, el backend la dibuja por props debajo de todo (ya lo manejas)
    // Aquí no metemos @image para evitar “código” y depender de pipes.
    return cmds;
  }

  // layout full
  const body = left.length ? left : right;
  if (body.length) {
    let yy = 190;
    for (const ln of body) {
      cmds.push({ kind: "text", x: 110, y: yy, size: 40, color: COLOR_MAP.white, text: ln });
      yy += 46;
    }
  }

  // diagramas full
  const diag = spec.diagram || "none";
  if (diag === "right_triangle") {
    cmds.push({ kind: "tri", x: 180, y: 245, w: 320, h: 240, color: COLOR_MAP.white, lw: 6 });

    const a = spec.triangle?.a || "a";
    const b = spec.triangle?.b || "b";
    const c = spec.triangle?.c || "c";
    const f = spec.triangle?.formula || "c² = a² + b²";

    cmds.push({ kind: "text", x: 130, y: 200, size: 40, color: COLOR_MAP.cyan, text: f });
    cmds.push({ kind: "text", x: 260, y: 505, size: 34, color: COLOR_MAP.cyan, text: `${a} (cateto)` });
    cmds.push({ kind: "text", x: 515, y: 375, size: 34, color: COLOR_MAP.green, text: `${b} (cateto)` });
    cmds.push({ kind: "text", x: 310, y: 330, size: 34, color: COLOR_MAP.yellow, text: `${c} (hipotenusa)` });
    cmds.push({ kind: "underline", x1: 120, y: 242, x2: 520, color: COLOR_MAP.yellow, lw: 6 });
  }

  if (diag === "axes") {
    // ejes simples
    cmds.push({ kind: "line", x1: 160, y1: 500, x2: 160, y2: 200, color: COLOR_MAP.white, lw: 6 });
    cmds.push({ kind: "line", x1: 160, y1: 500, x2: 520, y2: 500, color: COLOR_MAP.white, lw: 6 });
    cmds.push({ kind: "arrow", x1: 160, y1: 200, x2: 160, y2: 175, color: COLOR_MAP.white, lw: 6 });
    cmds.push({ kind: "arrow", x1: 520, y1: 500, x2: 545, y2: 500, color: COLOR_MAP.white, lw: 6 });

    const xL = spec.axes?.xLabel || "x";
    const yL = spec.axes?.yLabel || "y";
    cmds.push({ kind: "text", x: 545, y: 510, size: 32, color: COLOR_MAP.white, text: xL });
    cmds.push({ kind: "text", x: 120, y: 160, size: 32, color: COLOR_MAP.white, text: yL });

    // curva sencilla
    cmds.push({ kind: "line", x1: 175, y1: 470, x2: 235, y2: 430, color: COLOR_MAP.cyan, lw: 5 });
    cmds.push({ kind: "line", x1: 235, y1: 430, x2: 305, y2: 365, color: COLOR_MAP.cyan, lw: 5 });
    cmds.push({ kind: "line", x1: 305, y1: 365, x2: 390, y2: 305, color: COLOR_MAP.cyan, lw: 5 });
    cmds.push({ kind: "line", x1: 390, y1: 305, x2: 500, y2: 250, color: COLOR_MAP.cyan, lw: 5 });

    const cl = spec.axes?.curveLabel || "";
    if (cl) cmds.push({ kind: "text", x: 380, y: 225, size: 34, color: COLOR_MAP.cyan, text: cl });
  }

  return cmds;
}

async function ensureFontsReadyOnce() {
  await ensureFontsReady();
}

// -------------------- component --------------------
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

  const spec = useMemo(() => tryParseBoardSpec(value), [value]);
  const parsed = useMemo(() => (spec ? { lines: [], cmds: buildCmdsFromSpec(spec) } : parseBoard(value)), [value, spec]);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const imgCacheRef = useRef<{ b64: string | null; img: HTMLImageElement | null }>({ b64: null, img: null });

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
      await ensureFontsReadyOnce();

      // imagen cache
      let img: HTMLImageElement | null = null;
      if (boardImageB64) {
        if (imgCacheRef.current.b64 !== boardImageB64) {
          imgCacheRef.current.b64 = boardImageB64;
          imgCacheRef.current.img = await loadB64Image(boardImageB64);
        }
        img = imgCacheRef.current.img;
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

      // clip (evita pintar en marco madera)
      const INSET_X = 58;
      const INSET_Y = 44;
      const CLIP_W = width - INSET_X * 2;
      const CLIP_H = height - INSET_Y * 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(INSET_X, INSET_Y, CLIP_W, CLIP_H);
      ctx.clip();

      const baseSeed = hashStr(value || "board");

      // 0) imagen debajo
      if (img && boardImagePlacement) {
        const { x, y, w, h } = boardImagePlacement;
        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.shadowColor = "rgba(255,255,255,0.16)";
        ctx.shadowBlur = 0.8;
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      }

      // 1) formas primero, texto después
      const textCmds: Extract<DrawCmd, { kind: "text" }>[] = [];

      for (const cmd of parsed.cmds) {
        if (cmd.kind === "text") {
          textCmds.push(cmd);
          continue;
        }

        const seed = hashStr(JSON.stringify(cmd) + String(baseSeed));
        const rng = mulberry32(seed);

        if (cmd.kind === "rect") {
          if (cmd.fill) {
            ctx.save();
            ctx.globalAlpha = 0.14;
            ctx.fillStyle = cmd.fill;
            ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h);
            ctx.restore();
          }
          drawWobblyRect(ctx, cmd.x, cmd.y, cmd.w, cmd.h, cmd.color, cmd.lw, rng);
          drawLineDust(ctx, cmd.x + cmd.w, cmd.y + cmd.h, cmd.lw, cmd.color, rng);
        }

        if (cmd.kind === "circle") {
          if (cmd.fill) {
            ctx.save();
            ctx.globalAlpha = 0.14;
            ctx.fillStyle = cmd.fill;
            ctx.beginPath();
            ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          drawWobblyCircle(ctx, cmd.x, cmd.y, cmd.r, cmd.color, cmd.lw, rng);
          drawLineDust(ctx, cmd.x + cmd.r, cmd.y, cmd.lw, cmd.color, rng);
        }

        if (cmd.kind === "line") {
          drawWobblyLine(ctx, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.lw, rng);
          drawLineDust(ctx, cmd.x2, cmd.y2, cmd.lw, cmd.color, rng);
        }

        if (cmd.kind === "arrow") {
          drawArrow(ctx, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.lw, rng);
          drawLineDust(ctx, cmd.x2, cmd.y2, cmd.lw, cmd.color, rng);
        }

        if (cmd.kind === "underline") {
          drawWobblyLine(ctx, cmd.x1, cmd.y, cmd.x2, cmd.y, cmd.color, cmd.lw, rng);
          drawLineDust(ctx, cmd.x2, cmd.y, cmd.lw, cmd.color, rng);
        }

        if (cmd.kind === "tri") {
          const x = cmd.x,
            y = cmd.y;
          const x2 = x + cmd.w,
            y2 = y;
          const x3 = x,
            y3 = y + cmd.h;

          drawWobblyLine(ctx, x, y, x2, y2, cmd.color, cmd.lw, rng);
          drawWobblyLine(ctx, x2, y2, x3, y3, cmd.color, cmd.lw, rng);
          drawWobblyLine(ctx, x3, y3, x, y, cmd.color, cmd.lw, rng);

          drawWobblyLine(ctx, x + 16, y, x + 16, y + 16, cmd.color, Math.max(2, cmd.lw - 1), rng);
          drawWobblyLine(ctx, x + 16, y + 16, x, y + 16, cmd.color, Math.max(2, cmd.lw - 1), rng);

          drawLineDust(ctx, x2, y2, cmd.lw, cmd.color, rng);
          drawLineDust(ctx, x3, y3, cmd.lw, cmd.color, rng);
        }
      }

      // textos encima
      for (const cmd of textCmds) {
        const seed = hashStr(JSON.stringify(cmd) + String(baseSeed));
        const rng = mulberry32(seed);
        drawTextLine(ctx, [{ text: cmd.text, color: cmd.color }], cmd.x, cmd.y, cmd.size, rng);
      }

      // líneas “normales” (si viniera texto sin comandos)
      let x = 80;
      let y = 70;

      const titleSize = 64;
      const textSize = 40;
      const lineGap = 10;

      parsed.lines.forEach((line, i) => {
        const isTitle = i === 0;
        const size = isTitle ? titleSize : textSize;
        const segs = parseColorTags(line);
        const rng = mulberry32(hashStr("line:" + i + ":" + line + ":" + baseSeed));
        drawTextLine(ctx, segs, x, y, size, rng);
        y += size + lineGap;
      });

      ctx.restore();
    };

    draw();
  }, [parsed, width, height, box.w, box.h, value, boardImageB64, boardImagePlacement]);

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
