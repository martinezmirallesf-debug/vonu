"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  title?: string;
  onOpenCanvas?: () => void;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function ChalkboardTutorBoard({ value, title = "Pizarra", onOpenCanvas }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const [bgReady, setBgReady] = useState(false);

  // líneas “humanas”: mantenemos saltos, quitamos exceso, recortamos final
  const lines = useMemo(() => {
    const raw = (value || "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trimEnd();
    const arr = raw.split("\n").map((l) => l.trimEnd());
    // evita “plantilla vacía”
    return arr.filter((l) => l.trim().length > 0);
  }, [value]);

  // animación: cuántas líneas visibles
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const total = lines.length;
    if (!total) return;

    const speed = total > 16 ? 65 : 110;
    const t = setInterval(() => {
      setShown((s) => {
        const next = Math.min(total, s + 1);
        if (next >= total) clearInterval(t);
        return next;
      });
    }, speed);

    return () => clearInterval(t);
  }, [lines]);

  // carga fondo
  useEffect(() => {
    const img = new Image();
    img.src = "/boards/chalkboard-classic.webp";
    img.onload = () => {
      bgImgRef.current = img;
      setBgReady(true);
    };
    img.onerror = () => setBgReady(true); // seguimos aunque falle
  }, []);

  function draw() {
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    if (!wrap || !c) return;

    const rect = wrap.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const W = Math.max(320, Math.floor(rect.width));
    const H = Math.max(220, Math.floor(rect.height));

    c.width = Math.floor(W * dpr);
    c.height = Math.floor(H * dpr);
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;

    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // fondo: tu imagen
    ctx.clearRect(0, 0, W, H);
    const bg = bgImgRef.current;
    if (bg) {
      ctx.drawImage(bg, 0, 0, W, H);
    } else {
      // fallback oscuro
      ctx.fillStyle = "#0b0f0d";
      ctx.fillRect(0, 0, W, H);
    }

    // “polvo” sutil extra
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();

    // texto estilo tiza (pero “humano”)
    const seed = Math.floor((value.length + shown * 97) % 100000) + 1234;
    const rnd = mulberry32(seed);

    // tipografía (parece mano)
    // si no está Architects Daughter, cae a system
    const baseSize = clamp(Math.floor(W / 34), 18, 28); // responsive
    ctx.font = `${baseSize}px "Architects Daughter","Chalkboard SE","Segoe Print","Comic Sans MS",system-ui`;
    ctx.textBaseline = "top";

    const marginX = clamp(Math.floor(W * 0.06), 18, 54);
    const marginY = clamp(Math.floor(H * 0.08), 18, 56);
    const lineGap = Math.floor(baseSize * 0.55);

    // tiza: glow + pequeñas imperfecciones
    ctx.fillStyle = "rgba(248,250,252,0.92)";
    ctx.shadowColor = "rgba(255,255,255,0.28)";
    ctx.shadowBlur = 1.4;

    const visible = lines.slice(0, shown);

    let y = marginY;
    for (let i = 0; i < visible.length; i++) {
      const line = visible[i] ?? "";

      // jitter de línea (humano)
      const jx = (rnd() - 0.5) * 2.2;
      const jy = (rnd() - 0.5) * 1.8;

      // “ligero cambio de tamaño” por línea
      const sizeJ = (rnd() - 0.5) * 1.2;
      ctx.font = `${baseSize + sizeJ}px "Architects Daughter","Chalkboard SE","Segoe Print","Comic Sans MS",system-ui`;

      // render por “capas” para que parezca tiza (doble pasada)
      const x = marginX + jx;

      // 1) pasada suave
      ctx.save();
      ctx.globalAlpha = 0.60;
      ctx.fillText(line, x + (rnd() - 0.5) * 0.6, y + jy + (rnd() - 0.5) * 0.6);
      ctx.restore();

      // 2) pasada principal
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillText(line, x, y + jy);
      ctx.restore();

      // “polvillo” alrededor de la línea
      ctx.save();
      ctx.globalAlpha = 0.10;
      for (let k = 0; k < 16; k++) {
        const px = x + rnd() * Math.min(W - x - 20, 520);
        const py = y + jy + rnd() * (baseSize + 6);
        ctx.fillRect(px, py, 1, 1);
      }
      ctx.restore();

      y += baseSize + lineGap;

      // si nos salimos, cortamos
      if (y > H - marginY - baseSize) break;
    }

    // cursor mientras “escribe”
    if (shown < lines.length) {
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "rgba(248,250,252,0.85)";
      ctx.fillRect(marginX, y + 2, 10, baseSize);
      ctx.restore();
    }
  }

  // redibuja al cambiar shown/value o al redimensionar
  useEffect(() => {
    if (!bgReady) return;

    const raf = requestAnimationFrame(() => draw());

    const onResize = () => draw();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgReady, shown, value]);

  return (
    <div className="my-2 rounded-2xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-zinc-200 bg-white">
        <div className="text-[12px] font-semibold text-zinc-900">🧑‍🏫 {title}</div>

        {onOpenCanvas ? (
          <button
            onClick={onOpenCanvas}
            className="h-8 px-3 rounded-full bg-black hover:bg-zinc-900 text-white text-[12px] font-semibold"
          >
            Abrir pizarra
          </button>
        ) : null}
      </div>

      <div ref={wrapRef} className="w-full" style={{ height: 260 }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>
    </div>
  );
}
