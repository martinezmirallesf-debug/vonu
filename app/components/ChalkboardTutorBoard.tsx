"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Props = {
  value: string;                // contenido dentro de ```pizarra
  className?: string;
  backgroundSrc?: string;       // por defecto tu imagen
  width?: number;               // canvas lógico (1000x600 recomendado)
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
  lines: string[];      // líneas de texto “normales”
  cmds: DrawCmd[];      // comandos de dibujo
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
      if (k === "size") size = clamp(parseNumber(v, 26), 14, 64);
      if (k === "color") color = parseColorToken(v);
    }

    return { kind: "text", x, y, size, color, text: inside || "" };
  }

  // Normal commands
  const parts = raw.split(/\s+/);
  const cmd = parts[0].slice(1).toLowerCase();

  // helper: args + kv
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
  const lw = clamp(parseNumber(kv["w"], 3), 1, 10);

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
  // soporta [yellow]hola[/yellow] repetidas veces
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

  return out.filter(s => s.text.length > 0);
}

function drawChalkStroke(ctx: CanvasRenderingContext2D, fn: () => void) {
  ctx.save();

  // “tiza”: glow suave + un pelín de rugosidad con micro trazos
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "rgba(255,255,255,0.22)";
  ctx.shadowBlur = 1.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  fn();

  // “polvo” muy sutil
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.10;
  // polvo: puntitos en el último path no lo podemos recuperar, así que lo dejamos para texto/lineas solo en llamadas específicas

  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number) {
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

function drawLineDust(ctx: CanvasRenderingContext2D, x: number, y: number, lw: number, color: string) {
  // polvo sutil alrededor del punto
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

function drawTextLine(
  ctx: CanvasRenderingContext2D,
  segs: Seg[],
  x: number,
  y: number,
  fontSize: number,
) {
  ctx.save();
  ctx.textBaseline = "top";

  // Usa la fuente si la tienes cargada en CSS (Architects Daughter), si no, fallback.
  ctx.font = `${fontSize}px "Architects Daughter", "Patrick Hand", system-ui, -apple-system, Segoe UI, Roboto, Arial`;

  let cursorX = x;
  for (const seg of segs) {
    ctx.fillStyle = seg.color;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = "rgba(255,255,255,0.22)";
    ctx.shadowBlur = 1.2;

    ctx.fillText(seg.text, cursorX, y);

    // polvo cerca del final del texto (sutil)
    const w = ctx.measureText(seg.text).width;
    drawLineDust(ctx, cursorX + w, y + fontSize * 0.7, 4, seg.color);

    cursorX += w;
  }

  ctx.restore();
}

export default function ChalkboardTutorBoard({
  value,
  className,
  backgroundSrc = "/boards/chalkboard-classic.webp",
  width = 1000,
  height = 600,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const parsed = useMemo(() => parseBoard(value), [value]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Limpia
    ctx.clearRect(0, 0, width, height);

    // --- 1) Dibuja comandos (cajas, flechas, etc.) ---
    for (const cmd of parsed.cmds) {
      if (cmd.kind === "rect") {
        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = cmd.lw;
        drawChalkStroke(ctx, () => {
          ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h);
        });
        drawLineDust(ctx, cmd.x + cmd.w, cmd.y + cmd.h, cmd.lw, cmd.color);
      }

      if (cmd.kind === "circle") {
        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = cmd.lw;
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI * 2);
          ctx.stroke();
        });
        drawLineDust(ctx, cmd.x + cmd.r, cmd.y, cmd.lw, cmd.color);
      }

      if (cmd.kind === "line") {
        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = cmd.lw;
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.stroke();
        });
        drawLineDust(ctx, cmd.x2, cmd.y2, cmd.lw, cmd.color);
      }

      if (cmd.kind === "arrow") {
        drawArrow(ctx, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.color, cmd.lw);
        drawLineDust(ctx, cmd.x2, cmd.y2, cmd.lw, cmd.color);
      }

      if (cmd.kind === "underline") {
        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = cmd.lw;
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y);
          ctx.lineTo(cmd.x2, cmd.y);
          ctx.stroke();
        });
        drawLineDust(ctx, cmd.x2, cmd.y, cmd.lw, cmd.color);
      }

      if (cmd.kind === "text") {
        drawTextLine(ctx, [{ text: cmd.text, color: cmd.color }], cmd.x, cmd.y, cmd.size);
      }

      if (cmd.kind === "tri") {
        // triángulo rectángulo con ángulo recto en (x,y): cateto horizontal w, vertical h
        const x = cmd.x, y = cmd.y;
        const x2 = x + cmd.w, y2 = y;
        const x3 = x, y3 = y + cmd.h;

        ctx.strokeStyle = cmd.color;
        ctx.lineWidth = cmd.lw;
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.stroke();
        });

        // marca ángulo recto pequeña
        drawChalkStroke(ctx, () => {
          ctx.beginPath();
          ctx.moveTo(x + 22, y);
          ctx.lineTo(x + 22, y + 22);
          ctx.lineTo(x, y + 22);
          ctx.stroke();
        });

        drawLineDust(ctx, x2, y2, cmd.lw, cmd.color);
        drawLineDust(ctx, x3, y3, cmd.lw, cmd.color);
      }
    }

    // --- 2) Dibuja texto “normal” (encima) ---
    // Layout simple: empieza arriba izquierda
    let x = 70;
    let y = 70;
    const baseSize = 30;
    const lineGap = 10;

    parsed.lines.forEach((line, i) => {
      const isTitle = i === 0 || /^\s*\[white\].+\[\/white\]\s*$/i.test(line.trim());
      const size = isTitle ? baseSize + 6 : baseSize;
      const segs = parseColorTags(line);
      drawTextLine(ctx, segs, x, y, size);
      y += size + lineGap;
    });
  }, [parsed, width, height]);

  return (
    <div className={className ?? ""}>
      <div className="relative w-full overflow-hidden rounded-[26px] border border-zinc-200 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
        {/* Fondo imagen */}
        <img
          src={backgroundSrc}
          alt="Pizarra"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />

        {/* Canvas encima (coordenadas 1000x600) */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
