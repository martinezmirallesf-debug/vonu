"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Props = {
  value: string; // contenido dentro de ```pizarra
  className?: string;
  backgroundSrc?: string; // por defecto tu imagen
  width?: number; // tamaño canvas real (px)
  height?: number;
};

type ColorName = "white" | "yellow" | "cyan" | "pink" | "green" | "orange" | "red";

const COLOR_MAP: Record<ColorName, string> = {
  white: "#e9efe9",
  yellow: "#ffe67a",
  cyan: "#79e6ff",
  pink: "#ff86c8",
  green: "#8cff9a",
  orange: "#ffb36b",
  red: "#ff6b6b",
};

// El modelo “piensa” en este lienzo.
// Importante: en analyze.ts le dices “1000x600”.
const VIRTUAL_W = 1000;
const VIRTUAL_H = 600;

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
  return COLOR_MAP[key] ?? v; // permite hex si algún día lo usas
}

/**
 * Soporta:
 * - Texto normal (líneas)
 * - Tags: [yellow]hola[/yellow]
 * - Comandos:
 *   @rect x y w h color=white w=3
 *   @circle x y r color=white w=3
 *   @line x1 y1 x2 y2 color=white w=3
 *   @arrow x1 y1 x2 y2 color=white w=4
 *   @underline x1 y x2 color=yellow w=5
 *   @text x y size=26 color=white |TEXTO|
 *   @tri x y w h color=white w=3 (triángulo rectángulo)
 */
type DrawCmd =
  | { kind: "rect"; x: number; y: number; w: number; h: number; color: string; lw: number }
  | { kind: "circle"; x: number; y: number; r: number; color: string; lw: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; color: string; lw: number }
  | { kind: "arrow"; x1: number; y1: number; x2: number; y2: number; color: string; lw: number }
  | { kind: "underline"; x1: number; y: number; x2: number; color: string; lw: number }
  | { kind: "text"; x: number; y: number; size: number; color: string; text: string }
  | { kind: "tri"; x: number; y: number; w: number; h: number; color: string; lw: number };

type ParsedBoard = {
  lines: string[]; // líneas de texto “normales”
  cmds: DrawCmd[]; // comandos de dibujo
};

function parseCommand(line: string): DrawCmd | null {
  const raw = line.trim();
  if (!raw.startsWith("@")) return null;

  // @text ... |...|
  if (raw.toLowerCase().startsWith("@text ")) {
    const pipeA = raw.indexOf("|");
    const pipeB = raw.lastIndexOf("|");
    const inside = pipeA !== -1 && pipeB !== -1 && pipeB > pipeA ? raw.slice(pipeA + 1, pipeB) : "";
    const head = (pipeA !== -1 ? raw.slice(0, pipeA) : raw).trim();

    const parts = head.split(/\s+/).slice(1); // quita @text
    const x = parseNumber(parts[0], 60);
    const y = parseNumber(parts[1], 60);

    let size = 26;
    let color = COLOR_MAP.white;

    for (const token of parts.slice(2)) {
      const [k, v] = token.split("=");
      if (!v) continue;
      if (k === "size") size = clamp(parseNumber(v, 26), 12, 72);
      if (k === "color") color = parseColorToken(v);
    }

    return { kind: "text", x, y, size, color, text: inside || "" };
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
  const lw = clamp(parseNumber(kv["w"], 3), 1, 12);

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

function looksLikeAsciiJunk(line: string) {
  // evita que el modelo “dibuje” con ASCII y te rompa la pizarra
  const t = (line || "").trim();
  if (!t) return false;
  const hasBox = /(\+[-=]{2,}\+)|(\|[-=]{2,}\|)/.test(t);
  const hasManyPipes = (t.match(/\|/g)?.length ?? 0) >= 3;
  const hasManyDashes = (t.match(/[-=]/g)?.length ?? 0) >= 6;
  return hasBox || (hasManyPipes && hasManyDashes);
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
    else {
      if (!looksLikeAsciiJunk(l)) lines.push(l);
    }
  }

  return { lines, cmds };
}

// --- tags [color]text[/color] ---
type Seg = { text: string; color: string };

function parseColorTags(line: string): Seg[] {
  const out: Seg[] = [];
  let rest = line;

  const re = /\[(white|yellow|cyan|pink|green|orange|red)\]([\s\S]*?)\[\/\1\]/i;

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
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "rgba(255,255,255,0.22)";
  ctx.shadowBlur = 1.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  fn();
  ctx.restore();
}

function drawLineDust(ctx: CanvasRenderingContext2D, x: number, y: number, lw: number, color: string) {
  const dust = Math.max(1, Math.floor(lw / 2));
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = color;
  for (let i = 0; i < dust; i++) {
    const rx = x + (Math.random() - 0.5) * (lw * 3);
    const ry = y + (Math.random() - 0.5) * (lw * 3);
    ctx.fillRect(rx, ry, 1, 1);
  }
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lw: number,
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 12 + lw * 1.4;

  ctx.strokeStyle = color;
  ctx.lineWidth = lw;

  drawChalkStroke(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - Math.PI / 7), y2 - head * Math.sin(ang - Math.PI / 7));
    ctx.lineTo(x2 - head * Math.cos(ang + Math.PI / 7), y2 - head * Math.sin(ang + Math.PI / 7));
    ctx.closePath();
    ctx.stroke();
  });
}

function setChalkFont(ctx: CanvasRenderingContext2D, fontSize: number) {
  ctx.font = `${fontSize}px "Architects Daughter", "Patrick Hand", system-ui, -apple-system, Segoe UI, Roboto, Arial`;
}

function wrapSegmentsToLines(
  ctx: CanvasRenderingContext2D,
  segs: Seg[],
  maxWidth: number,
): Seg[][] {
  // “wrap” por palabras (manteniendo colores)
  const lines: Seg[][] = [];
  let current: Seg[] = [];
  let currentW = 0;

  const pushLine = () => {
    if (current.length) lines.push(current);
    current = [];
    currentW = 0;
  };

  for (const seg of segs) {
    const words = seg.text.split(/(\s+)/); // mantiene espacios como tokens
    for (const w of words) {
      const wWidth = ctx.measureText(w).width;
      if (currentW + wWidth > maxWidth && currentW > 0) {
        // salto de línea
        pushLine();
      }
      current.push({ text: w, color: seg.color });
      currentW += wWidth;
    }
  }

  pushLine();
  return lines;
}

function drawSegLine(ctx: CanvasRenderingContext2D, segs: Seg[], x: number, y: number, fontSize: number) {
  ctx.save();
  ctx.textBaseline = "top";
  setChalkFont(ctx, fontSize);

  let cursorX = x;
  for (const seg of segs) {
    if (!seg.text) continue;
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = "rgba(255,255,255,0.22)";
    ctx.shadowBlur = 1.2;

    ctx.fillText(seg.text, cursorX, y);

    const w = ctx.measureText(seg.text).width;
    drawLineDust(ctx, cursorX + w, y + fontSize * 0.7, Math.max(3, Math.floor(fontSize / 10)), seg.color);

    cursorX += w;
  }

  ctx.restore();
}

export default function ChalkboardTutorBoard({
  value,
  className,
  backgroundSrc = "/boards/chalkboard-classic.webp",
  width = 2350,
  height = 1500,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parsed = useMemo(() => parseBoard(value), [value]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // ✅ Márgenes seguros (dentro del marco de madera)
    // Ajusta si quieres: cuanto más grande, más “dentro” se dibuja.
    const PAD_X = Math.round(width * 0.06);  // ~141px en 2350
    const PAD_Y = Math.round(height * 0.09); // ~135px en 1500

    const innerW = width - PAD_X * 2;
    const innerH = height - PAD_Y * 2;

    const sx = innerW / VIRTUAL_W;
    const sy = innerH / VIRTUAL_H;
    const s = Math.min(sx, sy); // escala uniforme para que no se deforme

    const offsetX = PAD_X + (innerW - VIRTUAL_W * s) / 2;
    const offsetY = PAD_Y + (innerH - VIRTUAL_H * s) / 2;

    const tx = (x: number) => offsetX + x * s;
    const ty = (y: number) => offsetY + y * s;
    const tlw = (lw: number) => clamp(lw * s, 1, 18);
    const tsize = (fs: number) => clamp(fs * s, 14, 96);

    const clampX = (x: number) => clamp(x, 0, VIRTUAL_W);
    const clampY = (y: number) => clamp(y, 0, VIRTUAL_H);

    // --- 1) Dibuja comandos (cajas, flechas, etc.) ---
    for (const cmd of parsed.cmds) {
      if (cmd.kind === "rect") {
        const x = tx(clampX(cmd.x));
        const y = ty(clampY(cmd.y));
        const w = cmd.w * s;
        const h = cmd.h * s;

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = tlw(cmd.lw);
        drawChalkStroke(ctx, () => ctx.strokeRect(x, y, w, h));
        drawLineDust(ctx, x + w, y + h, ctx.lineWidth, cmd.color);
      }

      if (cmd.kind === "circle") {
        const x = tx(clampX(cmd.x));
        const y = ty(clampY(cmd.y));
        const r = cmd.r * s;

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = tlw(cmd.lw);
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
        });
        drawLineDust(ctx, x + r, y, ctx.lineWidth, cmd.color);
      }

      if (cmd.kind === "line") {
        const x1 = tx(clampX(cmd.x1));
        const y1 = ty(clampY(cmd.y1));
        const x2 = tx(clampX(cmd.x2));
        const y2 = ty(clampY(cmd.y2));

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = tlw(cmd.lw);
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
        drawLineDust(ctx, x2, y2, ctx.lineWidth, cmd.color);
      }

      if (cmd.kind === "arrow") {
        const x1 = tx(clampX(cmd.x1));
        const y1 = ty(clampY(cmd.y1));
        const x2 = tx(clampX(cmd.x2));
        const y2 = ty(clampY(cmd.y2));

        drawArrow(ctx, x1, y1, x2, y2, cmd.color, tlw(cmd.lw));
        drawLineDust(ctx, x2, y2, tlw(cmd.lw), cmd.color);
      }

      if (cmd.kind === "underline") {
        const x1 = tx(clampX(cmd.x1));
        const y = ty(clampY(cmd.y));
        const x2 = tx(clampX(cmd.x2));

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = tlw(cmd.lw);
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        });
        drawLineDust(ctx, x2, y, ctx.lineWidth, cmd.color);
      }

      if (cmd.kind === "text") {
        const x = tx(clampX(cmd.x));
        const y = ty(clampY(cmd.y));
        const size = tsize(cmd.size);

        drawSegLine(ctx, [{ text: cmd.text, color: cmd.color }], x, y, size);
      }

      if (cmd.kind === "tri") {
        // triángulo rectángulo con ángulo recto en (x,y): cateto horizontal w, vertical h
        const x = clampX(cmd.x);
        const y = clampY(cmd.y);
        const w = cmd.w;
        const h = cmd.h;

        const X = tx(x);
        const Y = ty(y);
        const X2 = tx(x + w);
        const Y2 = ty(y);
        const X3 = tx(x);
        const Y3 = ty(y + h);

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = tlw(cmd.lw);

        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(X, Y);
          ctx.lineTo(X2, Y2);
          ctx.lineTo(X3, Y3);
          ctx.closePath();
          ctx.stroke();
        });

        // marca ángulo recto
        drawChalkStroke(ctx, () => {
          const k = 18 * s;
          ctx.beginPath();
          ctx.moveTo(X + k, Y);
          ctx.lineTo(X + k, Y + k);
          ctx.lineTo(X, Y + k);
          ctx.stroke();
        });

        drawLineDust(ctx, X2, Y2, ctx.lineWidth, cmd.color);
        drawLineDust(ctx, X3, Y3, ctx.lineWidth, cmd.color);
      }
    }

    // --- 2) Texto normal (encima) con WRAP + límites ---
    const startX = tx(60);
    let cursorY = ty(50);

    const maxTextW = innerW - (startX - (offsetX)) - (60 * s); // margen derecho virtual aprox
    const titleSize = clamp(46 * s, 28, 92);
    const bodySize = clamp(38 * s, 22, 74);
    const lineGap = clamp(10 * s, 6, 18);

    // Si el contenido es muy largo, reducimos un poco el cuerpo
    const tooManyLines = parsed.lines.length >= 18;
    const bodySize2 = tooManyLines ? clamp(bodySize * 0.90, 18, 64) : bodySize;

    parsed.lines.forEach((line, i) => {
      const raw = line.trim();
      const isTitle = i === 0;

      // título: si viene con [white]...[/white] lo dejamos
      const size = isTitle ? titleSize : bodySize2;
      const segs = parseColorTags(raw);

      ctx.save();
      setChalkFont(ctx, size);

      const wrapped = wrapSegmentsToLines(ctx, segs, maxTextW);

      for (const segLine of wrapped) {
        // límite inferior: no pintes fuera de la pizarra
        const bottomLimit = offsetY + VIRTUAL_H * s - 40 * s;
        if (cursorY + size > bottomLimit) return;

        drawSegLine(ctx, segLine, startX, cursorY, size);
        cursorY += size + lineGap;
      }

      // espacio extra tras el título
      if (isTitle) cursorY += clamp(8 * s, 6, 18);

      ctx.restore();
    });
  }, [parsed, width, height]);

  return (
    <div className={className ?? ""}>
      <div className="relative w-full overflow-hidden rounded-[26px] border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
        <img
          src={backgroundSrc}
          alt="Pizarra"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />

        <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
