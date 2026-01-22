"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Placement = { x: number; y: number; w: number; h: number };

type Props = {
  /** MINI-LENGUAJE (sin fences). Ej: empieza con # ... */
  script?: string | null;
  /** Mostrar/ocultar */
  show?: boolean;
  /** Reveal progresivo (efecto profesor escribiendo) */
  progressive?: boolean;
  /** Velocidad de reveal (ms por línea) */
  speedMs?: number;

  /** Imagen opcional (base64 png sin data: o con data:) */
  boardImageB64?: string | null;
  /** Placement lógico (si lo usas). Si no, se ignora */
  boardImagePlacement?: Placement | null;

  className?: string;
};

/** ---------- Parser MINI-LENGUAJE ---------- */
type Segment =
  | { kind: "title"; text: string }
  | { kind: "guide"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "label"; text: string } // [DIAGRAMA], [FORMULA], etc.
  | { kind: "text"; text: string } // líneas sueltas dentro de secciones
  | { kind: "work"; lines: string[] };

function isTagLine(line: string) {
  const t = line.trim().toUpperCase();
  return /^\[[A-Z_]+\]$/.test(t) || /^\[WORK\]$/.test(t) || /^\[\/WORK\]$/.test(t);
}

function normalizeDataUrl(b64: string) {
  if (!b64) return "";
  if (b64.startsWith("data:image")) return b64;
  // asumimos png
  return `data:image/png;base64,${b64}`;
}

function parseScript(script: string): Segment[] {
  const lines = (script || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  const out: Segment[] = [];

  let inWork = false;
  let workLines: string[] = [];

  for (let raw of lines) {
    const line = raw.trimEnd();
    const t = line.trim();

    if (!t) continue;

    // WORK block
    if (t.toUpperCase() === "[WORK]") {
      inWork = true;
      workLines = [];
      out.push({ kind: "label", text: "[WORK]" });
      continue;
    }
    if (t.toUpperCase() === "[/WORK]") {
      inWork = false;
      out.push({ kind: "work", lines: workLines.slice(0) });
      continue;
    }
    if (inWork) {
      workLines.push(line);
      continue;
    }

    // Title
    if (t.startsWith("# ")) {
      out.push({ kind: "title", text: t.replace(/^#\s+/, "").trim() });
      continue;
    }

    // Guide
    if (t.startsWith("> ")) {
      out.push({ kind: "guide", text: t.replace(/^>\s+/, "").trim() });
      continue;
    }

    // Bullets
    if (t.startsWith("- ")) {
      out.push({ kind: "bullet", text: t.replace(/^-+\s+/, "").trim() });
      continue;
    }

    // Tags
    if (isTagLine(t)) {
      out.push({ kind: "label", text: t.toUpperCase() });
      continue;
    }

    // Plain text line
    out.push({ kind: "text", text: t });
  }

  return out;
}

/** ---------- UI helpers ---------- */
function labelHuman(tag: string) {
  const t = (tag || "").toUpperCase();
  if (t === "[DIAGRAMA]") return "Diagrama";
  if (t === "[FORMULA]") return "Fórmula";
  if (t === "[RESULT]") return "Resultado";
  if (t === "[CHECK]") return "Comprueba";
  if (t === "[CIERRE]") return "Cierre";
  if (t === "[WORK]") return "Paso a paso";
  if (t === "[IMG]") return "Imagen";
  return tag.replace(/\[|\]/g, "");
}

function splitIntoRenderLines(segments: Segment[]) {
  // Convertimos segmentos en “líneas renderizables”
  // para poder hacer reveal progresivo por línea.
  const lines: Array<{ key: string; node: React.ReactNode }> = [];

  let key = 0;

  for (const seg of segments) {
    key++;

    if (seg.kind === "title") {
      lines.push({
        key: `t-${key}`,
        node: (
          <div style={styles.title}>
            {seg.text}
            <div style={styles.titleUnderline} />
          </div>
        ),
      });
      continue;
    }

    if (seg.kind === "guide") {
      lines.push({
        key: `g-${key}`,
        node: <div style={styles.guide}>→ {seg.text}</div>,
      });
      continue;
    }

    if (seg.kind === "label") {
      // No queremos que parezca “código”, así que lo convertimos a “cabeceras” de sección
      // (salvo [IMG], que la UI la maneja por separado).
      if (seg.text === "[IMG]") continue;

      lines.push({
        key: `l-${key}`,
        node: (
          <div style={styles.sectionHeader}>
            <span style={styles.sectionPill}>{labelHuman(seg.text)}</span>
          </div>
        ),
      });
      continue;
    }

    if (seg.kind === "bullet") {
      lines.push({
        key: `b-${key}`,
        node: (
          <div style={styles.bulletRow}>
            <span style={styles.bulletDot}>•</span>
            <span style={styles.bulletText}>{seg.text}</span>
          </div>
        ),
      });
      continue;
    }

    if (seg.kind === "text") {
      // Texto normal (por ejemplo líneas dentro de diagrama)
      lines.push({
        key: `x-${key}`,
        node: <div style={styles.textLine}>{seg.text}</div>,
      });
      continue;
    }

    if (seg.kind === "work") {
      // Work en bloque tipo “cuaderno”
      lines.push({
        key: `w-${key}`,
        node: (
          <div style={styles.workBox}>
            {seg.lines.map((ln, i) => (
              <div key={`wl-${key}-${i}`} style={styles.workLine}>
                {ln}
              </div>
            ))}
          </div>
        ),
      });
      continue;
    }
  }

  return lines;
}

/** ---------- Component ---------- */
export default function ChalkboardTutorBoard({
  script,
  show = false,
  progressive = true,
  speedMs = 120,
  boardImageB64 = null,
  boardImagePlacement = null,
  className,
}: Props) {
  const segments = useMemo(() => parseScript(script || ""), [script]);
  const renderLines = useMemo(() => splitIntoRenderLines(segments), [segments]);

  const [visibleCount, setVisibleCount] = useState(progressive ? 0 : renderLines.length);
  const [mounted, setMounted] = useState(false);

  const prevScriptRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cuando cambia el script, re-iniciamos la animación
  useEffect(() => {
    if (!show) return;

    const current = (script || "").trim();
    const prev = prevScriptRef.current;

    // si es el mismo, no reiniciamos
    if (current && prev && current === prev) return;

    prevScriptRef.current = current;

    if (!progressive) {
      setVisibleCount(renderLines.length);
      return;
    }

    setVisibleCount(0);

    let i = 0;
    const max = renderLines.length;

    const id = setInterval(() => {
      i++;
      setVisibleCount((v) => (v < max ? v + 1 : v));
      if (i >= max) clearInterval(id);
    }, Math.max(60, speedMs));

    return () => clearInterval(id);
  }, [script, show, progressive, speedMs, renderLines.length]);

  // Si se oculta, resetea suavemente
  useEffect(() => {
    if (!show) {
      setVisibleCount(progressive ? 0 : renderLines.length);
    }
  }, [show, progressive, renderLines.length]);

  const wantsImg = useMemo(() => {
    const s = (script || "").toUpperCase();
    return s.includes("[IMG]");
  }, [script]);

  const hasImg = Boolean(boardImageB64 && wantsImg);

  // Si quieres respetar placement lógico, lo convertimos a % aproximado.
  // Si no hay placement, simplemente se muestra centrada.
  const imgStyle = useMemo(() => {
    if (!boardImagePlacement) return styles.boardImgCentered;

    // Canvas lógico 1000x600 (como comentabas)
    const W = 1000;
    const H = 600;

    const leftPct = Math.max(0, Math.min(100, (boardImagePlacement.x / W) * 100));
    const topPct = Math.max(0, Math.min(100, (boardImagePlacement.y / H) * 100));
    const wPct = Math.max(10, Math.min(100, (boardImagePlacement.w / W) * 100));
    const hPct = Math.max(10, Math.min(100, (boardImagePlacement.h / H) * 100));

    return {
      position: "absolute" as const,
      left: `${leftPct}%`,
      top: `${topPct}%`,
      width: `${wPct}%`,
      height: `${hPct}%`,
      objectFit: "contain" as const,
      opacity: 0.92,
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
      pointerEvents: "none" as const,
    };
  }, [boardImagePlacement]);

  // Evitar parpadeos SSR
  if (!mounted) return null;

  return (
    <div
      className={className}
      style={{
        ...styles.wrap,
        ...(show ? styles.wrapShown : styles.wrapHidden),
      }}
      aria-hidden={!show}
    >
      {/* Fondo “tiza” */}
      <div style={styles.board}>
        {/* Imagen de apoyo (opcional) */}
        {hasImg && (
          <img
            alt=""
            style={imgStyle}
            src={normalizeDataUrl(boardImageB64!)}
          />
        )}

        {/* Contenido */}
        <div style={styles.content}>
          {renderLines.slice(0, visibleCount).map((l) => (
            <div key={l.key} style={styles.lineAppear}>
              {l.node}
            </div>
          ))}
        </div>

        {/* “Respiración” abajo para que no quede pegado */}
        <div style={{ height: 10 }} />
      </div>
    </div>
  );
}

/** ---------- Styles (inline para que copies/pegues fácil) ---------- */
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    overflow: "hidden",
    transition: "max-height 420ms ease, opacity 420ms ease, transform 420ms ease",
    willChange: "max-height, opacity, transform",
    marginTop: 10,
  },
  wrapShown: {
    opacity: 1,
    transform: "translateY(0px)",
    maxHeight: 1600,
  },
  wrapHidden: {
    opacity: 0,
    transform: "translateY(-6px)",
    maxHeight: 0,
  },

  board: {
    position: "relative",
    width: "100%",
    borderRadius: 18,
    padding: 18,
    background:
      "radial-gradient(1200px 500px at 30% 0%, rgba(255,255,255,0.09), rgba(0,0,0,0) 55%)," +
      "radial-gradient(800px 500px at 80% 10%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)," +
      "linear-gradient(180deg, #0c1310, #07100c)",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(255,255,255,0.06)",
  },

  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  lineAppear: {
    animation: "vonuFadeIn 220ms ease-out both",
  },

  title: {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(255,255,255,0.95)",
    textTransform: "uppercase",
  },
  titleUnderline: {
    height: 3,
    width: "100%",
    marginTop: 8,
    borderRadius: 99,
    background: "rgba(255, 215, 0, 0.70)",
    boxShadow: "0 6px 16px rgba(255,215,0,0.10)",
  },

  guide: {
    fontSize: 15,
    fontWeight: 650,
    color: "rgba(255,255,255,0.86)",
    opacity: 0.95,
  },

  sectionHeader: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
  },
  sectionPill: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.90)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 999,
    padding: "6px 10px",
  },

  bulletRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  bulletDot: {
    marginTop: 2,
    fontSize: 18,
    lineHeight: "18px",
    color: "rgba(150, 236, 255, 0.95)",
  },
  bulletText: {
    fontSize: 16,
    color: "rgba(150, 236, 255, 0.92)",
    fontWeight: 650,
  },

  textLine: {
    fontSize: 16,
    color: "rgba(255,255,255,0.88)",
    fontWeight: 520,
  },

  workBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
  },
  workLine: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.45,
  },

  boardImgCentered: {
    position: "absolute",
    left: "50%",
    top: "62%",
    transform: "translate(-50%, -50%)",
    width: "72%",
    height: "34%",
    objectFit: "contain",
    opacity: 0.92,
    filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
    pointerEvents: "none",
  },
};

/** Inject keyframes (sin depender de CSS global) */
if (typeof document !== "undefined") {
  const id = "vonu-chalkboard-kf";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
@keyframes vonuFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0px); }
}`;
    document.head.appendChild(style);
  }
}
