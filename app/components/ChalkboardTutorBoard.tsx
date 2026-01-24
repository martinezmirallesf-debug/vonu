"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Placement = { x: number; y: number; w: number; h: number };

export type ChalkboardTutorBoardProps = {
  /** Texto dentro del bloque ```pizarra``` (mini-lenguaje). */
  value: string;
  /** Base64 PNG (sin data: prefix o con prefix; soporta ambos). */
  boardImageB64?: string | null;
  /** Posición en coordenadas del canvas lógico (1000x600). */
  boardImagePlacement?: Placement | null;
  /** Clases extra para el contenedor. */
  className?: string;
};

type Section =
  | { type: "title"; text: string }
  | { type: "lead"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "diagram"; lines: string[] }
  | { type: "formula"; text: string }
  | { type: "work"; lines: string[] }
  | { type: "result"; text: string }
  | { type: "check"; lines: string[] }
  | { type: "close"; text: string }
  | { type: "cole"; lines: string[] }
  | { type: "raw"; lines: string[] };

function isTag(line: string) {
  const t = line.trim().toUpperCase();
  return (
    t === "[COLE]" ||
    t === "[/COLE]" ||
    t === "[DIAGRAMA]" ||
    t === "[FORMULA]" ||
    t === "[WORK]" ||
    t === "[/WORK]" ||
    t === "[RESULT]" ||
    t === "[CHECK]" ||
    t === "[CIERRE]" ||
    t.startsWith("[IMG]")
  );
}

/**
 * Normaliza “cosas raras”:
 * - Quita LaTeX: \( ... \) o \[ ... \]
 * - Cambia potencias a “²/³” cuando se pueda
 * - Limpia escapes típicos
 *
 * IMPORTANTE: esto NO debe romper alineación de espacios para formato “cole”.
 * Por eso, en modo normal sí comprimimos espacios; en modo COLE NO.
 */
function prettifyLine(s: string, opts?: { preserveSpaces?: boolean }) {
  let t = (s ?? "").replace(/\r/g, "").trimEnd();

  t = t.replace(/\\\(([\s\S]*?)\\\)/g, "$1");
  t = t.replace(/\\\[([\s\S]*?)\\\]/g, "$1");

  t = t.replace(/\\rightarrow/g, "→");
  t = t.replace(/\\to/g, "→");

  t = t.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  t = t.replace(/\^2\b/g, "²");
  t = t.replace(/\^3\b/g, "³");
  t = t.replace(/([a-zA-Z0-9])\s*\^\s*2\b/g, "$1²");
  t = t.replace(/([a-zA-Z0-9])\s*\^\s*3\b/g, "$1³");

  // ❗️En modo “cole” NO comprimimos espacios (si no, adiós alineación)
  if (!opts?.preserveSpaces) {
    t = t.replace(/\s{2,}/g, " ");
  }

  return t;
}

function parseMiniLanguage(raw: string): Section[] {
  const rawLines = (raw || "").replace(/\r\n/g, "\n").split("\n");

  const out: Section[] = [];

  let title = "";
  let lead = "";
  const bullets: string[] = [];

  let i = 0;
  while (i < rawLines.length) {
    const rawLine = rawLines[i] ?? "";
    const line = prettifyLine(rawLine).trim();

    if (!line) {
      i++;
      continue;
    }

    // Título
    if (line.startsWith("#")) {
      if (!title) title = line.replace(/^#+\s*/, "").trim();
      else out.push({ type: "raw", lines: [line] });
      i++;
      continue;
    }

    // Idea clave
    if (line.startsWith(">")) {
      if (!lead) lead = line.replace(/^>\s*/, "").trim();
      else out.push({ type: "raw", lines: [line] });
      i++;
      continue;
    }

    // Bullets iniciales
    if (line.startsWith("-")) {
      bullets.push(line.replace(/^-+\s*/, "").trim());
      i++;
      continue;
    }

    const upper = line.toUpperCase();

    // ✅ COLE: bloque monoespaciado, preserva espacios
    if (upper === "[COLE]") {
      const block: string[] = [];
      i++;
      while (i < rawLines.length) {
        const rawL = rawLines[i] ?? "";
        const up = rawL.trim().toUpperCase();
        if (up === "[/COLE]") break;

        // 👇 NO trim, NO compresión de espacios
        block.push(prettifyLine(rawL, { preserveSpaces: true }).replace(/\r/g, ""));
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().toUpperCase() === "[/COLE]") i++;
      out.push({ type: "cole", lines: block });
      continue;
    }

    if (upper === "[DIAGRAMA]") {
      const block: string[] = [];
      i++;
      while (i < rawLines.length) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (!l || isTag(l)) break;
        block.push(l);
        i++;
      }
      out.push({ type: "diagram", lines: block });
      continue;
    }

    if (upper === "[FORMULA]") {
      i++;
      const f: string[] = [];
      while (i < rawLines.length) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (!l || isTag(l)) break;
        f.push(l);
        i++;
      }
      out.push({ type: "formula", text: f.join(" ") });
      continue;
    }

    if (upper === "[WORK]") {
      const w: string[] = [];
      i++;
      while (i < rawLines.length && (rawLines[i] ?? "").trim().toUpperCase() !== "[/WORK]") {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (l) w.push(l);
        i++;
      }
      if (i < rawLines.length && (rawLines[i] ?? "").trim().toUpperCase() === "[/WORK]") i++;
      out.push({ type: "work", lines: w });
      continue;
    }

    if (upper === "[RESULT]") {
      i++;
      const r: string[] = [];
      while (i < rawLines.length) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (!l || isTag(l)) break;
        r.push(l);
        i++;
      }
      out.push({ type: "result", text: r.join(" ") });
      continue;
    }

    if (upper === "[CHECK]") {
      i++;
      const c: string[] = [];
      while (i < rawLines.length) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (!l || isTag(l)) break;
        c.push(l);
        i++;
      }
      out.push({ type: "check", lines: c });
      continue;
    }

    if (upper === "[CIERRE]") {
      i++;
      const c: string[] = [];
      while (i < rawLines.length) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (!l || isTag(l)) break;
        c.push(l);
        i++;
      }
      out.push({ type: "close", text: c.join(" ") });
      continue;
    }

    // Ignorar [IMG] (la imagen llega por props)
    if (upper.startsWith("[IMG]")) {
      i++;
      continue;
    }

    // Texto suelto
    out.push({ type: "raw", lines: [line] });
    i++;
  }

  // Cabecera primero si existe
  if (title) out.unshift({ type: "title", text: title });
  if (lead) out.splice(title ? 1 : 0, 0, { type: "lead", text: lead });
  if (bullets.length) {
    const insertAt = (title ? 1 : 0) + (lead ? 1 : 0);
    out.splice(insertAt, 0, { type: "bullets", items: bullets });
  }

  return out;
}

function toDataUrlMaybe(b64: string) {
  const s = (b64 || "").trim();
  if (!s) return "";
  if (s.startsWith("data:image")) return s;
  return `data:image/png;base64,${s}`;
}

export default function ChalkboardTutorBoard({
  value,
  boardImageB64 = null,
  boardImagePlacement = null,
  className = "",
}: ChalkboardTutorBoardProps) {
  const sections = useMemo(() => parseMiniLanguage(value), [value]);

  // Canvas lógico (para placement)
  const LOGICAL_W = 1000;
  const LOGICAL_H = 600;

  return (
    // ✅ h-auto (crece según contenido). Sin “pantalla dentro de pantalla”.
    <div className={`relative w-full rounded-3xl overflow-hidden ${className}`}>
      {/* Fondo pizarra */}
      <div className="absolute inset-0 bg-[#0B0F12] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        {/* Viñeteado suave */}
        <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(0,0,0,0.65)_60%)]" />
        {/* Ruido / polvo */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.10] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:10px_10px]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={value ? "board" : "empty"}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ duration: 0.35 }}
          // ✅ YA NO absolute. Ahora el contenedor coge altura real.
          className="relative p-6 md:p-8"
        >
          {/* Imagen (si existe) */}
          {boardImageB64 && boardImagePlacement ? (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute"
                style={{
                  left: `${(boardImagePlacement.x / LOGICAL_W) * 100}%`,
                  top: `${(boardImagePlacement.y / LOGICAL_H) * 100}%`,
                  width: `${(boardImagePlacement.w / LOGICAL_W) * 100}%`,
                  height: `${(boardImagePlacement.h / LOGICAL_H) * 100}%`,
                  opacity: 0.92,
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.45))",
                }}
              >
                <img
                  src={toDataUrlMaybe(boardImageB64)}
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            </div>
          ) : null}

          {/* Texto “tiza” */}
          <div className="relative z-10 max-w-[980px] break-words">
            {sections.map((sec, idx) => {
              if (sec.type === "title") {
                return (
                  <div key={idx} className="mb-3">
                    <div className="text-[34px] md:text-[40px] leading-[1.05] tracking-[0.08em] font-extrabold text-white">
                      {sec.text.toUpperCase()}
                    </div>
                    <div className="mt-3 h-[3px] w-full max-w-[620px] rounded-full bg-[#F6D365] opacity-90" />
                  </div>
                );
              }

              if (sec.type === "lead") {
                return (
                  <div key={idx} className="mt-4 mb-4 text-[#F6D365] text-[16px] md:text-[17px] italic">
                    → {sec.text}
                  </div>
                );
              }

              if (sec.type === "bullets") {
                return (
                  <ul key={idx} className="mb-4 space-y-2">
                    {sec.items.map((b, i) => (
                      <li key={i} className="text-[#7FE7FF] text-[17px] md:text-[18px]">
                        • {b}
                      </li>
                    ))}
                  </ul>
                );
              }

              // ✅ BLOQUE "COLE" (fracciones/divisiones/matrices en columna)
              if (sec.type === "cole") {
                return (
                  <div key={idx} className="mt-4 mb-4">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      EN EL COLE
                    </div>

                    <div
                      className="rounded-3xl border border-white/15 bg-black/25 p-4 md:p-5 text-white text-[16px] md:text-[17px]"
                      style={{
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        whiteSpace: "pre",
                        lineHeight: 1.35,
                        overflowX: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      {sec.lines.join("\n")}
                    </div>
                  </div>
                );
              }

              if (sec.type === "diagram") {
                return (
                  <div key={idx} className="mt-4 mb-4">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      DIAGRAMA
                    </div>
                    <div className="space-y-1 text-white text-[16px] md:text-[17px]">
                      {sec.lines.map((l, i) => (
                        <div key={i} className="opacity-95">
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sec.type === "formula") {
                return (
                  <div key={idx} className="mt-4 mb-4">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      FÓRMULA
                    </div>
                    <div className="inline-block rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white text-[16px] md:text-[17px] break-words">
                      {sec.text}
                    </div>
                  </div>
                );
              }

              if (sec.type === "work") {
                return (
                  <div key={idx} className="mt-4 mb-4">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      PASO A PASO
                    </div>
                    <div className="rounded-3xl border border-white/15 bg-black/20 p-4 md:p-5">
                      <ol className="space-y-2 text-white text-[15px] md:text-[16px] list-decimal pl-5">
                        {sec.lines.map((l, i) => (
                          <li key={i} className="leading-relaxed break-words">
                            {l}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                );
              }

              if (sec.type === "result") {
                return (
                  <div key={idx} className="mt-4 mb-4">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      RESULTADO
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white text-[16px] md:text-[17px] break-words">
                      {sec.text}
                    </div>
                  </div>
                );
              }

              if (sec.type === "check") {
                return (
                  <div key={idx} className="mt-4 mb-2">
                    <div className="text-white/70 font-semibold tracking-[0.16em] text-[13px] mb-2">
                      MINI CHECK
                    </div>
                    <div className="space-y-2 text-white text-[15px] md:text-[16px]">
                      {sec.lines.map((l, i) => (
                        <div key={i} className="opacity-95 break-words">
                          • {l}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sec.type === "close") {
                return (
                  <div key={idx} className="mt-4 text-white/85 text-[15px] md:text-[16px] italic break-words">
                    {sec.text}
                  </div>
                );
              }

              if (sec.type === "raw") {
                return (
                  <div key={idx} className="mt-2 text-white/85 text-[15px] md:text-[16px] break-words">
                    {sec.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
