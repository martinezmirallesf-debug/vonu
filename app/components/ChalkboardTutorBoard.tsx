"use client";

import React, { useEffect, useMemo, useState } from "react";

type Placement = { x: number; y: number; w: number; h: number } | null;

export type ChalkboardTutorBoardProps = {
  /** ✅ Para poder pasar className desde page.tsx */
  className?: string;

  /** Mini-lenguaje en texto plano (sin ```pizarra```) */
  value: string;

  /** base64 png (SIN data: prefix) o null */
  boardImageB64?: string | null;

  /** placement lógico en canvas 1000x600 (opcional) */
  boardImagePlacement?: Placement;

  /** para ajustar densidad si lo quieres */
  compact?: boolean;
};

type BoardSection =
  | { kind: "title"; text: string }
  | { kind: "guide"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "label"; text: string } // [DIAGRAMA], [FORMULA], etc.
  | { kind: "diagram"; lines: string[] }
  | { kind: "formula"; text: string }
  | { kind: "work"; lines: string[] }
  | { kind: "result"; lines: string[] }
  | { kind: "check"; questions: string[] }
  | { kind: "close"; text: string }
  | { kind: "text"; lines: string[] };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function stripCodeFenceIfAny(raw: string) {
  const t = (raw || "").trim();
  const m = t.match(/```pizarra\s*([\s\S]*?)\s*```/i);
  if (m?.[1]) return m[1].trim();
  return t;
}

function parseBoard(value: string): BoardSection[] {
  const v = stripCodeFenceIfAny(value);
  const lines = v
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  let i = 0;
  const out: BoardSection[] = [];

  const takeWhile = (fn: (line: string) => boolean) => {
    const acc: string[] = [];
    while (i < lines.length && fn(lines[i])) {
      acc.push(lines[i]);
      i++;
    }
    return acc;
  };

  const isTag = (l: string) => /^\[[A-ZÁÉÍÓÚÜÑ_]+\]$/i.test(l.trim());
  const normalizeTag = (l: string) => l.trim().toUpperCase();

  while (i < lines.length && !lines[i].trim()) i++;
  if (i < lines.length && lines[i].startsWith("#")) {
    out.push({ kind: "title", text: lines[i].replace(/^#+\s*/, "").trim() });
    i++;
  }

  while (i < lines.length && !lines[i].trim()) i++;
  if (i < lines.length && lines[i].startsWith(">")) {
    out.push({ kind: "guide", text: lines[i].replace(/^>\s*/, "").trim() });
    i++;
  }

  while (i < lines.length) {
    if (!lines[i].trim()) {
      i++;
      continue;
    }

    const l = lines[i].trim();

    if (l.startsWith("- ")) {
      const items = takeWhile((x) => x.trim().startsWith("- ")).map((x) => x.trim().slice(2).trim());
      if (items.length) out.push({ kind: "bullets", items });
      continue;
    }

    if (isTag(l)) {
      const tag = normalizeTag(l);
      i++;

      if (tag === "[FORMULA]" || tag === "[FÓRMULA]") {
        while (i < lines.length && !lines[i].trim()) i++;
        const formula = i < lines.length ? lines[i].trim() : "";
        out.push({ kind: "label", text: "FÓRMULA" });
        if (formula) {
          out.push({ kind: "formula", text: formula });
          i++;
        }
        continue;
      }

      if (tag === "[DIAGRAMA]" || tag === "[DIAGRAM]") {
        const block = takeWhile((x) => x.trim().length > 0 && !isTag(x.trim()));
        out.push({ kind: "label", text: "DIAGRAMA" });
        out.push({ kind: "diagram", lines: block.filter(Boolean) });
        continue;
      }

      if (tag === "[WORK]") {
        const block: string[] = [];
        while (i < lines.length) {
          const cur = lines[i].trim();
          if (cur.toUpperCase() === "[/WORK]") {
            i++;
            break;
          }
          block.push(lines[i]);
          i++;
        }
        out.push({ kind: "label", text: "PASO A PASO" });
        out.push({ kind: "work", lines: block.filter((x) => x.trim().length > 0) });
        continue;
      }

      if (tag === "[RESULT]" || tag === "[RESULTADO]") {
        const block = takeWhile((x) => x.trim().length > 0 && !isTag(x.trim()));
        out.push({ kind: "label", text: "RESULTADO" });
        out.push({ kind: "result", lines: block.filter(Boolean) });
        continue;
      }

      if (tag === "[CHECK]") {
        while (i < lines.length && !lines[i].trim()) i++;
        const q = i < lines.length ? lines[i].trim() : "";
        if (q) {
          const last = out[out.length - 1];
          if (last?.kind === "check") last.questions.push(q);
          else {
            out.push({ kind: "label", text: "COMPRUEBA" });
            out.push({ kind: "check", questions: [q] });
          }
          i++;
        }
        continue;
      }

      if (tag === "[CIERRE]" || tag === "[CLOSE]") {
        while (i < lines.length && !lines[i].trim()) i++;
        const close = i < lines.length ? lines[i].trim() : "";
        if (close) {
          out.push({ kind: "close", text: close });
          i++;
        }
        continue;
      }

      if (tag === "[IMG]") {
        while (i < lines.length && !lines[i].trim()) i++;
        if (i < lines.length && !isTag(lines[i].trim())) i++;
        continue;
      }

      out.push({ kind: "label", text: l.replace(/^\[|\]$/g, "").trim() });
      continue;
    }

    const block = takeWhile((x) => {
      const t = x.trim();
      if (!t) return false;
      if (t.startsWith("- ")) return false;
      if (isTag(t)) return false;
      if (t.startsWith("#")) return false;
      if (t.startsWith(">")) return false;
      return true;
    });
    if (block.length) out.push({ kind: "text", lines: block });

    if (block.length === 0) i++;
  }

  return out;
}

function dataUrlFromB64(b64: string) {
  const clean = (b64 || "").trim();
  if (!clean) return null;
  if (clean.startsWith("data:image")) return clean;
  return `data:image/png;base64,${clean}`;
}

function placementToStyle(p: Placement) {
  const BASE_W = 1000;
  const BASE_H = 600;

  if (!p) return null;

  const leftPct = (p.x / BASE_W) * 100;
  const topPct = (p.y / BASE_H) * 100;
  const wPct = (p.w / BASE_W) * 100;
  const hPct = (p.h / BASE_H) * 100;

  return {
    left: `${clamp(leftPct, 0, 100)}%`,
    top: `${clamp(topPct, 0, 100)}%`,
    width: `${clamp(wPct, 0, 100)}%`,
    height: `${clamp(hPct, 0, 100)}%`,
  } as React.CSSProperties;
}

export default function ChalkboardTutorBoard({
  className,
  value,
  boardImageB64 = null,
  boardImagePlacement = null,
  compact = false,
}: ChalkboardTutorBoardProps) {
  const sections = useMemo(() => parseBoard(value), [value]);
  const imgUrl = useMemo(() => (boardImageB64 ? dataUrlFromB64(boardImageB64) : null), [boardImageB64]);
  const imgStyle = useMemo(() => placementToStyle(boardImagePlacement), [boardImagePlacement]);

  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const total = sections.length + 2;
    const timers: number[] = [];

    let k = 0;
    const tick = () => {
      k++;
      setStep(k);
      if (k < total) timers.push(window.setTimeout(tick, 90));
    };
    timers.push(window.setTimeout(tick, 60));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [sections]);

  const pad = compact ? "p-4 md:p-5" : "p-5 md:p-6";
  const titleSize = compact ? "text-[30px] md:text-[34px]" : "text-[32px] md:text-[38px]";
  const baseText = compact ? "text-[16px] md:text-[17px]" : "text-[17px] md:text-[18px]";

  const Reveal: React.FC<{ idx: number; children: React.ReactNode }> = ({ idx, children }) => {
    const show = step >= idx;
    return (
      <div className={["transition-all duration-300 ease-out", show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"].join(" ")}>
        {children}
      </div>
    );
  };

  let idx = 1;

  return (
    <div className={["w-full", className || ""].join(" ").trim()}>
      <div
        className={[
          "relative inline-block w-full max-w-[980px]",
          "rounded-2xl overflow-hidden",
          "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
          "bg-[#0b0f0f]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_38%),radial-gradient(circle_at_70%_65%,rgba(255,255,255,0.08),transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.55] bg-[radial-gradient(circle_at_50%_45%,transparent_45%,rgba(0,0,0,0.75))]" />
        </div>

        <div className={["relative", pad].join(" ")}>
          {imgUrl && (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute opacity-[0.55]"
                style={
                  imgStyle ?? {
                    left: "10%",
                    top: "58%",
                    width: "80%",
                    height: "34%",
                  }
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt=""
                  className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.45))" }}
                />
              </div>
            </div>
          )}

          <div className={["relative", baseText, "text-white/90"].join(" ")}>
            {sections.map((s, si) => {
              const myIdx = idx++;

              if (s.kind === "title") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-3">
                      <div className={["font-[800] tracking-[0.06em] text-white", titleSize].join(" ")}>
                        {s.text.toUpperCase()}
                      </div>
                      <div className="mt-2 h-[3px] w-full rounded-full bg-white/70" />
                      <div className="mt-3" />
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "guide") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-4 text-white/85">
                      <span className="text-white/70">→ </span>
                      <span className="italic">{s.text}</span>
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "bullets") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <ul className="mb-4 space-y-1">
                      {s.items.map((it, k) => (
                        <li key={k} className="flex gap-3">
                          <span className="mt-[9px] h-[6px] w-[6px] rounded-full bg-[#6ee7ff] opacity-90" />
                          <span className="text-white/90">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              }

              if (s.kind === "label") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mt-5 mb-2 text-white/70 font-semibold tracking-[0.14em]">{s.text}</div>
                  </Reveal>
                );
              }

              if (s.kind === "diagram") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-4 space-y-1">
                      {s.lines.map((l, k) => (
                        <div key={k} className="text-white/90">
                          {l}
                        </div>
                      ))}
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "formula") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-5">
                      <div className="inline-block rounded-xl border border-white/35 bg-white/5 px-4 py-3">
                        <div className="font-mono text-[15px] md:text-[16px] text-white/95">{s.text}</div>
                      </div>
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "work") {
                const hasNumbers = s.lines.some((x) => /^\d+\./.test(x.trim()));
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-5 rounded-2xl border border-white/20 bg-black/20 px-4 py-4">
                      <div className="space-y-2">
                        {s.lines.map((l, k) => (
                          <div key={k} className="text-white/90 flex gap-3">
                            {!hasNumbers ? <span className="text-white/55 w-6 text-right">{k + 1}.</span> : <span className="text-white/0 w-0" />}
                            <span className="flex-1">{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "result") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-5 rounded-2xl border border-white/30 bg-white/5 px-4 py-4">
                      {s.lines.map((l, k) => (
                        <div key={k} className="text-white/95 font-semibold">
                          {l}
                        </div>
                      ))}
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "check") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-4">
                      <div className="space-y-2">
                        {s.questions.slice(0, 2).map((q, k) => (
                          <div key={k} className="text-white/85">
                            <span className="text-white/60">✓ </span>
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              }

              if (s.kind === "close") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mt-2 text-white/80 italic">{s.text}</div>
                  </Reveal>
                );
              }

              if (s.kind === "text") {
                return (
                  <Reveal key={si} idx={myIdx}>
                    <div className="mb-4 space-y-1">
                      {s.lines.map((l, k) => (
                        <div key={k} className="text-white/88 leading-relaxed">
                          {l}
                        </div>
                      ))}
                    </div>
                  </Reveal>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
