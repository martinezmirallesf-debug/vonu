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
 * Normaliza “cosas raras” (sin romper el formato COLE):
 * - Quita LaTeX: \( ... \) o \[ ... \]
 * - Cambia potencias a “²/³”
 * - Limpia escapes típicos
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

  // En COLE no comprimimos espacios
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

    if (line.startsWith("#")) {
      if (!title) title = line.replace(/^#+\s*/, "").trim();
      else out.push({ type: "raw", lines: [line] });
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      if (!lead) lead = line.replace(/^>\s*/, "").trim();
      else out.push({ type: "raw", lines: [line] });
      i++;
      continue;
    }

    if (line.startsWith("-")) {
      bullets.push(line.replace(/^-+\s*/, "").trim());
      i++;
      continue;
    }

    const upper = line.toUpperCase();

    if (upper === "[COLE]") {
      const block: string[] = [];
      i++;

      while (i < rawLines.length) {
        const rawL = rawLines[i] ?? "";
        if (rawL.trim().toUpperCase() === "[/COLE]") break;

        block.push(prettifyLine(rawL, { preserveSpaces: true }));
        i++;
      }

      if (
        i < rawLines.length &&
        rawLines[i].trim().toUpperCase() === "[/COLE]"
      ) {
        i++;
      }

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

      while (
        i < rawLines.length &&
        (rawLines[i] ?? "").trim().toUpperCase() !== "[/WORK]"
      ) {
        const l = prettifyLine(rawLines[i] ?? "").trim();
        if (l) w.push(l);
        i++;
      }

      if (
        i < rawLines.length &&
        (rawLines[i] ?? "").trim().toUpperCase() === "[/WORK]"
      ) {
        i++;
      }

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

    if (upper.startsWith("[IMG]")) {
      i++;
      continue;
    }

    out.push({ type: "raw", lines: [line] });
    i++;
  }

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

type ColeToken =
  | { kind: "text"; value: string }
  | { kind: "frac"; num: string; den: string };

function tokenizeColeLine(line: string): ColeToken[] {
  const re = /(\d+)\s*\/\s*(\d+)/g;

  const out: ColeToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line)) !== null) {
    const start = m.index;
    const end = start + m[0].length;

    if (start > last) {
      out.push({ kind: "text", value: line.slice(last, start) });
    }

    out.push({ kind: "frac", num: m[1], den: m[2] });

    last = end;
  }

  if (last < line.length) {
    out.push({ kind: "text", value: line.slice(last) });
  }

  if (!out.length) return [{ kind: "text", value: line }];

  return out;
}

function Fraction({ num, den }: { num: string; den: string }) {
  return (
    <span
      className="mx-[2px] inline-flex align-middle"
      style={{ transform: "translateY(-1px)" }}
    >
      <span className="inline-flex flex-col items-center leading-none text-zinc-950">
        <span className="px-[2px] text-[0.92em]">{num}</span>
        <span
          className="my-[2px] block w-full"
          style={{
            height: 0,
            borderTop: "2px solid rgba(24,24,27,0.86)",
          }}
        />
        <span className="px-[2px] text-[0.92em]">{den}</span>
      </span>
    </span>
  );
}

function VonuGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      className={[
        "relative grid place-items-center overflow-hidden rounded-[18px]",
        "border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(26,115,232,0.18),transparent_36%),radial-gradient(circle_at_80%_95%,rgba(16,185,129,0.12),transparent_38%)]" />
      <span className="relative h-[18px] w-[14px] rounded-[5px] border-[4px] border-zinc-950" />
    </span>
  );
}

function SectionLabel({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "blue" | "green" | "amber" | "dark";
}) {
  const dot =
    tone === "blue"
      ? "bg-blue-500"
      : tone === "green"
      ? "bg-emerald-500"
      : tone === "amber"
      ? "bg-amber-500"
      : tone === "dark"
      ? "bg-zinc-950"
      : "bg-zinc-400";

  return (
    <div className="mb-2 flex items-center gap-2">
      <span className={["h-1.5 w-1.5 rounded-full", dot].join(" ")} />
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {children}
      </div>
    </div>
  );
}

function PremiumCard({
  children,
  className = "",
  elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white/82 px-4 py-3 backdrop-blur-xl md:px-5 md:py-4",
        elevated
          ? "shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
          : "shadow-[0_10px_32px_rgba(15,23,42,0.055)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.18))]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function ChalkboardTutorBoard({
  value,
  boardImageB64 = null,
  boardImagePlacement = null,
  className = "",
}: ChalkboardTutorBoardProps) {
  const sections = useMemo(() => parseMiniLanguage(value), [value]);

  const LOGICAL_W = 1000;
  const LOGICAL_H = 600;

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-[38px] border border-zinc-200/90 bg-white",
        "shadow-[0_30px_110px_rgba(15,23,42,0.12)]",
        className,
      ].join(" ")}
    >
      {/* Fondo premium tipo lienzo vivo, sin ser oscuro */}
      <div className="pointer-events-none absolute inset-0 bg-[#fbfbfc]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(26,115,232,0.16),transparent_32%),radial-gradient(circle_at_92%_10%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(245,158,11,0.13),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(24,24,27,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.055)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-52 w-52 rounded-[48px] border border-blue-200/40 bg-white/30 blur-[1px] rotate-12" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-60 w-60 rounded-full border border-emerald-200/40 bg-white/25 blur-[1px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={value ? "board" : "empty"}
          initial={{ opacity: 0, y: 10, scale: 0.985, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, scale: 0.99, filter: "blur(8px)" }}
          transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative p-4 md:p-6"
        >
          {/* Header premium */}
          <div className="relative z-20 mb-5 flex items-center justify-between gap-4 rounded-[30px] border border-zinc-200 bg-white/78 px-4 py-3 shadow-[0_14px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <VonuGlyph className="h-11 w-11 shrink-0" />

              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Vonu Tutor
                </div>
                <div className="truncate text-[18px] font-semibold tracking-[-0.04em] text-zinc-950 md:text-[20px]">
                  Pizarra visual
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[12px] font-semibold text-zinc-500 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              paso a paso
            </div>
          </div>

          {boardImageB64 && boardImagePlacement ? (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute"
                style={{
                  left: `${(boardImagePlacement.x / LOGICAL_W) * 100}%`,
                  top: `${(boardImagePlacement.y / LOGICAL_H) * 100}%`,
                  width: `${(boardImagePlacement.w / LOGICAL_W) * 100}%`,
                  height: `${(boardImagePlacement.h / LOGICAL_H) * 100}%`,
                  opacity: 0.94,
                  filter: "drop-shadow(0 18px 34px rgba(15,23,42,0.14))",
                }}
              >
                <img
                  src={toDataUrlMaybe(boardImageB64)}
                  alt=""
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </div>
            </div>
          ) : null}

          <div className="relative z-10 max-w-[980px] break-words">
            {sections.map((sec, idx) => {
              if (sec.type === "title") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03, duration: 0.32 }}
                  >
                    <div className="text-[31px] font-semibold leading-[1.02] tracking-[-0.064em] text-zinc-950 md:text-[44px]">
                      {sec.text}
                    </div>

                    <div className="mt-4 h-[3px] w-full max-w-[620px] overflow-hidden rounded-full bg-zinc-200">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-zinc-950 via-blue-600 to-emerald-400" />
                    </div>
                  </motion.div>
                );
              }

              if (sec.type === "lead") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.32 }}
                  >
                    <PremiumCard elevated className="text-zinc-700">
                      <div className="text-[15px] leading-6 md:text-[16px]">
                        {sec.text}
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "bullets") {
                return (
                  <motion.ul
                    key={idx}
                    className="mb-5 space-y-2.5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.32 }}
                  >
                    {sec.items.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[15px] leading-6 text-zinc-800 md:text-[16px]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-950 shadow-[0_0_18px_rgba(24,24,27,0.22)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </motion.ul>
                );
              }

              if (sec.type === "cole") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5 mt-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07, duration: 0.32 }}
                  >
                    <SectionLabel tone="blue">En el cole</SectionLabel>

                    <PremiumCard className="overflow-x-auto bg-white/86">
                      <div
                        className="text-[15px] text-zinc-950 md:text-[17px]"
                        style={{
                          fontFamily:
                            '"Chalkboard SE","Bradley Hand","Comic Sans MS","Segoe Print",ui-sans-serif,system-ui',
                        }}
                      >
                        {sec.lines.map((line, i) => {
                          const tokens = tokenizeColeLine(line);

                          return (
                            <div
                              key={i}
                              style={{ whiteSpace: "pre", lineHeight: 1.46 }}
                            >
                              {tokens.map((t, k) => {
                                if (t.kind === "text") {
                                  return (
                                    <span key={k} style={{ whiteSpace: "pre" }}>
                                      {t.value}
                                    </span>
                                  );
                                }

                                return (
                                  <Fraction key={k} num={t.num} den={t.den} />
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "diagram") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5 mt-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.32 }}
                  >
                    <SectionLabel tone="green">Diagrama</SectionLabel>

                    <PremiumCard>
                      <div className="space-y-1 text-[15px] leading-7 text-zinc-800 md:text-[16px]">
                        {sec.lines.map((l, i) => (
                          <div key={i}>{l}</div>
                        ))}
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "formula") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5 mt-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.09, duration: 0.32 }}
                  >
                    <SectionLabel tone="amber">Fórmula</SectionLabel>

                    <PremiumCard
                      elevated
                      className="inline-block max-w-full border-amber-200/80 bg-amber-50/70"
                    >
                      <div className="text-[16px] font-semibold leading-7 text-zinc-950 md:text-[17px]">
                        {sec.text}
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "work") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5 mt-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.32 }}
                  >
                    <SectionLabel tone="blue">Paso a paso</SectionLabel>

                    <PremiumCard>
                      <ol className="list-decimal space-y-3 pl-5 text-[15px] text-zinc-800 md:text-[16px]">
                        {sec.lines.map((l, i) => (
                          <li key={i} className="leading-relaxed break-words">
                            {l}
                          </li>
                        ))}
                      </ol>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "result") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-5 mt-4"
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.12, duration: 0.34 }}
                  >
                    <SectionLabel tone="green">Resultado</SectionLabel>

                    <PremiumCard
                      elevated
                      className="border-emerald-200 bg-emerald-50/75"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-[14px] font-bold text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]">
                          ✓
                        </span>

                        <div className="text-[16px] font-semibold leading-7 text-zinc-950 md:text-[17px]">
                          {sec.text}
                        </div>
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "check") {
                return (
                  <motion.div
                    key={idx}
                    className="mb-4 mt-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.13, duration: 0.32 }}
                  >
                    <SectionLabel tone="dark">Mini check</SectionLabel>

                    <PremiumCard>
                      <div className="space-y-2 text-[15px] leading-6 text-zinc-800 md:text-[16px]">
                        {sec.lines.map((l, i) => (
                          <div key={i} className="flex gap-2 break-words">
                            <span className="text-zinc-400">•</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "close") {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14, duration: 0.32 }}
                  >
                    <PremiumCard className="mt-5 text-[15px] italic leading-6 text-zinc-600 md:text-[16px]">
                      {sec.text}
                    </PremiumCard>
                  </motion.div>
                );
              }

              if (sec.type === "raw") {
                return (
                  <motion.div
                    key={idx}
                    className="mt-2 text-[15px] leading-7 text-zinc-700 md:text-[16px]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.28 }}
                  >
                    {sec.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </motion.div>
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