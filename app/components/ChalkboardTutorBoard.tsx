"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
console.log("✅ ChalkboardTutorBoard ACTIVO (wobble check)");

type Props = {
  value: string;
  className?: string;
  backgroundSrc?: string;
  width?: number; // logical 1000
  height?: number; // logical 600
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
  return COLOR_MAP[key] ?? v; // allow hex
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

// ---------- compat parsers ----------
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

  // Original DSL: @text x y size=.. color=.. |TEXT|
  if (raw.toLowerCase().startsWith("@text ")) {
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

  // Compat: @text(400,50) [size 66] TEXT
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

  // Original non-text: @rect x y w h color=.. w=..
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
    if (c) cmds.push(c);
    else lines.push(l);
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

function drawChalkStroke(ctx: CanvasRenderingContext2D, fn: () => void) {
  ctx.save();
  ctx.globalAlpha = 0.93;
  ctx.shadowColor = "rgba(255,255,255,0.22)";
  ctx.shadowBlur = 1.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fn();
  ctx.restore();
}

function drawLineDust(ctx: CanvasRenderingContext2D, x: number, y: number, lw: number, color: string, rng: () => number) {
  const dust = Math.max(1, Math.floor(lw / 2));
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = color;
  for (let i = 0; i < dust; i++) {
    const rx = x + (rng() - 0.5) * (lw * 3);
    const ry = y + (rng() - 0.5) * (lw * 3);
    ctx.fillRect(rx, ry, 1, 1);
  }
  ctx.restore();
}

// -------- seeded rng (estable, sin parpadeo) --------
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

// -------- hand-drawn primitives (wobble real) --------
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
  const steps = clamp(Math.round(dist / 22), 6, 28);

  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);

  const jitter = clamp(lw * 0.55, 1.2, 5);

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

        // ruido perpendicular (mano)
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

  // doble trazo: profe real
  drawOnce(0.92, 0);
  drawOnce(0.55, 1.5);
}

function drawWobblyRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, lw: number, rng: () => number) {
  drawWobblyLine(ctx, x, y, x + w, y, color, lw, rng);
  drawWobblyLine(ctx, x + w, y, x + w, y + h, color, lw, rng);
  drawWobblyLine(ctx, x + w, y + h, x, y + h, color, lw, rng);
  drawWobblyLine(ctx, x, y + h, x, y, color, lw, rng);
}

function drawWobblyCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, lw: number, rng: () => number) {
  const steps = 40;
  const jitter = clamp(lw * 0.45, 1.0, 4.0);

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
  drawOnce(0.55, 1.2);
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number, rng: () => number) {
  drawWobblyLine(ctx, x1, y1, x2, y2, color, lw, rng);

  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 11 + lw * 1.3;

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
    // micro jitter en texto
    const jx = (rng() - 0.5) * 0.8;
    const jy = (rng() - 0.5) * 0.8;

    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = "rgba(255,255,255,0.22)";
    ctx.shadowBlur = 1.2;

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

export default function ChalkboardTutorBoard({
  value,
  className,
  backgroundSrc = "/boards/chalkboard-classic.webp",
  width = 1000,
  height = 600,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const parsed = useMemo(() => parseBoard(value), [value]);
  const [box, setBox] = useState({ w: 0, h: 0 });

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

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      const dispW = box.w || width;
      const dispH = box.h || Math.round((dispW * height) / width);

      c.width = Math.floor(dispW * dpr);
      c.height = Math.floor(dispH * dpr);

      const sx = dispW / width;
      const sy = dispH / height;

      ctx.setTransform(dpr * sx, 0, 0, dpr * sy, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // rng base por board (estable)
      const baseSeed = hashStr(value || "board");
      const rngBase = mulberry32(baseSeed);

      // 1) commands
      for (const cmd of parsed.cmds) {
        const seed = hashStr(JSON.stringify(cmd) + String(baseSeed));
        const rng = mulberry32(seed);

        if (cmd.kind === "rect") {
          if (cmd.fill) {
            ctx.save();
            ctx.globalAlpha = 0.16;
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
            ctx.globalAlpha = 0.16;
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

        if (cmd.kind === "text") {
          drawTextLine(ctx, [{ text: cmd.text, color: cmd.color }], cmd.x, cmd.y, cmd.size, rng);
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

          // ángulo recto
          drawWobblyLine(ctx, x + 18, y, x + 18, y + 18, cmd.color, Math.max(2, cmd.lw - 1), rng);
          drawWobblyLine(ctx, x + 18, y + 18, x, y + 18, cmd.color, Math.max(2, cmd.lw - 1), rng);

          drawLineDust(ctx, x2, y2, cmd.lw, cmd.color, rng);
          drawLineDust(ctx, x3, y3, cmd.lw, cmd.color, rng);
        }
      }

      // 2) normal lines
      let x = 80;
      let y = 70;

      const titleSize = 64;
      const textSize = 40;
      const lineGap = 10;

      parsed.lines.forEach((line, i) => {
        const isTitle = i === 0;
        const size = isTitle ? titleSize : textSize;
        const segs = parseColorTags(line);

        // rng estable por línea
        const rng = mulberry32(hashStr("line:" + i + ":" + line + ":" + baseSeed));
        drawTextLine(ctx, segs, x, y, size, rng);

        y += size + lineGap;
      });

      // debug minúsculo para confirmar que ESTA versión está activa (puedes quitarlo luego)
      const debugRng = mulberry32(hashStr("debug:" + baseSeed));
      drawTextLine(ctx, [{ text: "·", color: COLOR_MAP.yellow }], 960, 560, 26, debugRng);
    };

    draw();
  }, [parsed, width, height, box.w, box.h, value]);

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
