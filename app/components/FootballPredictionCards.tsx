// app/components/FootballPredictionCards.tsx
"use client";

import React from "react";

type LineSide = { p?: number; fairOdd?: number };
type Line = { line: number; over?: LineSide; under?: LineSide };

type Markets = {
  goals?: { lines?: Line[] };
  corners?: { lines?: Line[] };
  cards?: { lines?: Line[] };
  shots?: { lines?: Line[] };
  shotsOnTarget?: { lines?: Line[] };
};

type Fixture = {
  date?: string;
  league?: { name?: string; round?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
};

type Quiniela = {
  ["1"]?: { p?: number; fairOdd?: number };
  ["X"]?: { p?: number; fairOdd?: number };
  ["2"]?: { p?: number; fairOdd?: number };
  doubleChance?: {
    ["1X"]?: { p?: number; fairOdd?: number };
    ["X2"]?: { p?: number; fairOdd?: number };
    ["12"]?: { p?: number; fairOdd?: number };
  };
  topScores?: Array<{ score: string; p?: number; fairOdd?: number }>;
};

export type FootballPrediction = {
  fixture?: Fixture;
  markets?: Markets;
  quiniela?: Quiniela;
  summary?: any;
  disclaimer?: string;
};

function fmtPct(x: any) {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : "N/A";
}
function fmtOdd(x: any) {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n.toFixed(2) : "N/A";
}

function MarketBlock({
  title,
  lines,
  wanted,
}: {
  title: string;
  lines?: Line[];
  wanted: number[];
}) {
  const map = new Map<number, Line>();
  (lines || []).forEach((l) => map.set(Number(l.line), l));

  const picked = wanted.map((x) => map.get(x)).filter(Boolean) as Line[];

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 space-y-2 text-sm">
        {picked.length ? (
          picked.map((l) => (
            <div key={l.line} className="leading-5">
              <span className="font-medium">Línea {l.line}:</span>{" "}
              <span>Over {fmtPct(l.over?.p)} (mín {fmtOdd(l.over?.fairOdd)})</span>{" "}
              <span className="text-black/50">|</span>{" "}
              <span>Under {fmtPct(l.under?.p)} (mín {fmtOdd(l.under?.fairOdd)})</span>
            </div>
          ))
        ) : (
          <div className="text-black/60">No hay líneas disponibles.</div>
        )}
      </div>
    </div>
  );
}

export function FootballPredictionCards({
  prediction,
}: {
  prediction: FootballPrediction | null;
}) {
  if (!prediction) return null;

  const fx = prediction.fixture;
  const home = fx?.teams?.home?.name || "Local";
  const away = fx?.teams?.away?.name || "Visitante";
  const league = fx?.league?.name || "";
  const round = fx?.league?.round || "";
  const date = fx?.date || "";

  const q = prediction.quiniela;
  const dc = q?.doubleChance;
  const topScores = q?.topScores || [];

  const markets = prediction.markets || {};

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
        <div className="text-sm font-semibold">
          {home} vs {away}
        </div>
        <div className="mt-1 text-xs text-black/60">
          {league ? league : "—"} {round ? `· ${round}` : ""} {date ? `· ${date}` : ""}
        </div>

        <div className="mt-3 text-sm">
          <div className="font-semibold">1X2</div>
          <div className="mt-1 space-y-1 text-black/80">
            {q?.["1"] && <div>1: {fmtPct(q["1"].p)} · mín {fmtOdd(q["1"].fairOdd)}</div>}
            {q?.["X"] && <div>X: {fmtPct(q["X"].p)} · mín {fmtOdd(q["X"].fairOdd)}</div>}
            {q?.["2"] && <div>2: {fmtPct(q["2"].p)} · mín {fmtOdd(q["2"].fairOdd)}</div>}
          </div>

          {(dc?.["1X"] || dc?.["X2"] || dc?.["12"]) && (
            <>
              <div className="mt-3 font-semibold">Doble oportunidad</div>
              <div className="mt-1 space-y-1 text-black/80">
                {dc?.["1X"] && <div>1X: {fmtPct(dc["1X"].p)} · mín {fmtOdd(dc["1X"].fairOdd)}</div>}
                {dc?.["X2"] && <div>X2: {fmtPct(dc["X2"].p)} · mín {fmtOdd(dc["X2"].fairOdd)}</div>}
                {dc?.["12"] && <div>12: {fmtPct(dc["12"].p)} · mín {fmtOdd(dc["12"].fairOdd)}</div>}
              </div>
            </>
          )}

          {topScores.length > 0 && (
            <>
              <div className="mt-3 font-semibold">Marcadores top</div>
              <div className="mt-1 space-y-1 text-black/80">
                {topScores.slice(0, 5).map((s) => (
                  <div key={s.score}>
                    {s.score}: {fmtPct(s.p)} · mín {fmtOdd(s.fairOdd)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mercados (con “aire”) */}
      <MarketBlock title="⚽ GOLES (Over/Under)" lines={markets.goals?.lines} wanted={[0.5, 1.5, 2.5, 3.5, 4.5]} />
      <MarketBlock title="🚩 CÓRNERS (Over/Under)" lines={markets.corners?.lines} wanted={[7.5, 8.5, 9.5, 10.5, 11.5]} />
      <MarketBlock title="🟨 TARJETAS (Over/Under)" lines={markets.cards?.lines} wanted={[3.5, 4.5, 5.5, 6.5]} />
      <MarketBlock title="🎯 TIROS (Over/Under)" lines={markets.shots?.lines} wanted={[18.5, 20.5, 22.5, 24.5, 26.5]} />
      <MarketBlock title="🥅 TIROS A PUERTA (Over/Under)" lines={markets.shotsOnTarget?.lines} wanted={[5.5, 6.5, 7.5, 8.5, 9.5]} />

      {prediction.disclaimer && (
        <div className="text-xs text-black/60">
          ⚠️ {prediction.disclaimer}
        </div>
      )}
    </div>
  );
}
