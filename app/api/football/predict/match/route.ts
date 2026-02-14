// app/api/football/predict/match/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = "https://v3.football.api-sports.io";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function apiFootballFetch(path: string) {
  const key = requiredEnv("APIFOOTBALL_KEY");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "x-apisports-key": key },
    cache: "no-store",
  });

  const raw = await res.text().catch(() => "");
  let json: any = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }

  if (!res.ok) return { ok: false, status: res.status, statusText: res.statusText, json, raw };
  return { ok: true, status: res.status, json };
}

// ---------- Probabilidades (MVP) ----------
// Usamos Poisson para totales (rápido y estable). Luego lo mejoraremos a NegBin/cópulas.
function factorial(n: number) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k: number, lambda: number) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

function poissonCdf(k: number, lambda: number) {
  // P(X <= k)
  let s = 0;
  for (let i = 0; i <= k; i++) s += poissonPmf(i, lambda);
  return Math.min(1, Math.max(0, s));
}

function probOverLinePoisson(lambda: number, line: number) {
  // Over 2.5 => P(X >= 3). Para líneas .5 es limpio.
  const threshold = Math.floor(line) + 1;
  return 1 - poissonCdf(threshold - 1, lambda);
}

function probUnderLinePoisson(lambda: number, line: number) {
  const threshold = Math.floor(line); // Under 2.5 => P(X <= 2)
  return poissonCdf(threshold, lambda);
}

function fairOdds(p: number) {
  // “cuota justa / odd mínima”
  if (p <= 0) return null;
  return 1 / p;
}

function round2(n: number | null) {
  if (n === null || !Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function roundPct(p: number) {
  return Math.round(p * 1000) / 10; // 1 decimal
}

function buildLinesPoisson(lambdaTotal: number, lines: number[]) {
  return lines.map((line) => {
    const pOver = probOverLinePoisson(lambdaTotal, line);
    const pUnder = probUnderLinePoisson(lambdaTotal, line);
    return {
      line,
      over: { p: roundPct(pOver), fairOdd: round2(fairOdds(pOver)) },
      under: { p: roundPct(pUnder), fairOdd: round2(fairOdds(pUnder)) },
    };
  });
}

// Mezcla simple “científica para MVP” usando tu idea base:
// total esperado ≈ promedio de (a favor equipo A + concedidos equipo B) y viceversa.
function expectedTotal(
  homeForAvg: number | null,
  homeAgainstAvg: number | null,
  awayForAvg: number | null,
  awayAgainstAvg: number | null
) {
  if (
    homeForAvg === null ||
    homeAgainstAvg === null ||
    awayForAvg === null ||
    awayAgainstAvg === null
  ) return null;

  const homeComponent = (homeForAvg + awayAgainstAvg) / 2;
  const awayComponent = (awayForAvg + homeAgainstAvg) / 2;
  return homeComponent + awayComponent;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fixtureId = url.searchParams.get("fixture");
    const last = url.searchParams.get("last") || "10";

    if (!fixtureId) {
      return NextResponse.json({ error: "Missing query param: fixture" }, { status: 400 });
    }

    // 1) Traer fixture (equipos, liga, season, ciudad/estadio)
    const fx = await apiFootballFetch(`/fixtures?id=${encodeURIComponent(fixtureId)}`);
    if (!fx.ok) return NextResponse.json({ error: "Fixture fetch failed", details: fx }, { status: 502 });

    const fixture = fx.json?.response?.[0];
    if (!fixture) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });

    const leagueId = fixture?.league?.id;
    const season = fixture?.league?.season;
    const homeTeamId = fixture?.teams?.home?.id;
    const awayTeamId = fixture?.teams?.away?.id;

    if (!leagueId || !season || !homeTeamId || !awayTeamId) {
      return NextResponse.json({ error: "Fixture missing league/season/teams" }, { status: 500 });
    }

    const lastN = Math.max(1, Math.min(20, Number(last) || 10));

    // 2) Traer contexto de ambos equipos (tu endpoint team-context)
    // En vez de llamar interno por URL (puede fallar en Vercel), llamamos directo a API y repetimos lógica mínima:
    // Pero como tú ya lo tienes, lo más simple es llamar a tu propia ruta por fetch relativo.
    const baseUrl = `${url.protocol}//${url.host}`;

    const [homeCtxRes, awayCtxRes] = await Promise.all([
      fetch(`${baseUrl}/api/football/team-context?team=${homeTeamId}&league=${leagueId}&season=${season}&last=${lastN}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/football/team-context?team=${awayTeamId}&league=${leagueId}&season=${season}&last=${lastN}`, { cache: "no-store" }),
    ]);

    const homeCtx = await homeCtxRes.json();
    const awayCtx = await awayCtxRes.json();

    if (!homeCtxRes.ok) return NextResponse.json({ error: "Home team-context failed", details: homeCtx }, { status: 502 });
    if (!awayCtxRes.ok) return NextResponse.json({ error: "Away team-context failed", details: awayCtx }, { status: 502 });

    // 3) Lesiones (pre-partido)
    const inj = await apiFootballFetch(`/injuries?fixture=${encodeURIComponent(fixtureId)}`);
    const injuries = inj.ok ? (inj.json?.response || []) : [];

    // 4) Esperanzas (lambdas) por mercado (MVP)
    const gTotal = expectedTotal(
      homeCtx?.agg?.goalsForAvg ?? null,
      homeCtx?.agg?.goalsAgainstAvg ?? null,
      awayCtx?.agg?.goalsForAvg ?? null,
      awayCtx?.agg?.goalsAgainstAvg ?? null
    );

    const cTotal = expectedTotal(
      homeCtx?.agg?.cornersForAvg ?? null,
      homeCtx?.agg?.cornersAgainstAvg ?? null,
      awayCtx?.agg?.cornersForAvg ?? null,
      awayCtx?.agg?.cornersAgainstAvg ?? null
    );

    const yTotal = expectedTotal(
      homeCtx?.agg?.yellowsForAvg ?? null,
      homeCtx?.agg?.yellowsAgainstAvg ?? null,
      awayCtx?.agg?.yellowsForAvg ?? null,
      awayCtx?.agg?.yellowsAgainstAvg ?? null
    );

    const sTotal = expectedTotal(
      homeCtx?.agg?.shotsForAvg ?? null,
      homeCtx?.agg?.shotsAgainstAvg ?? null,
      awayCtx?.agg?.shotsForAvg ?? null,
      awayCtx?.agg?.shotsAgainstAvg ?? null
    );

    const sotTotal = expectedTotal(
      homeCtx?.agg?.shotsOnTargetForAvg ?? null,
      homeCtx?.agg?.shotsOnTargetAgainstAvg ?? null,
      awayCtx?.agg?.shotsOnTargetForAvg ?? null,
      awayCtx?.agg?.shotsOnTargetAgainstAvg ?? null
    );

    // 5) Construir tablas de líneas
    // Goles típicos
    const goalLines = [0.5, 1.5, 2.5, 3.5, 4.5];
    // Córners típicos (lo que tú pediste: 6..11)
    const cornerLines = [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5];
    // Tarjetas típicas
    const cardLines = [2.5, 3.5, 4.5, 5.5, 6.5];
    // Tiros totales típicos (ajústalo luego a tu gusto)
    const shotLines = [15.5, 17.5, 19.5, 21.5, 23.5, 25.5];
    // Tiros a puerta típicos
    const sotLines = [5.5, 6.5, 7.5, 8.5, 9.5];

    const markets = {
      goals: gTotal === null ? null : { lambda: round2(gTotal), lines: buildLinesPoisson(gTotal, goalLines) },
      corners: cTotal === null ? null : { lambda: round2(cTotal), lines: buildLinesPoisson(cTotal, cornerLines) },
      cards: yTotal === null ? null : { lambda: round2(yTotal), lines: buildLinesPoisson(yTotal, cardLines) },
      shots: sTotal === null ? null : { lambda: round2(sTotal), lines: buildLinesPoisson(sTotal, shotLines) },
      shotsOnTarget: sotTotal === null ? null : { lambda: round2(sotTotal), lines: buildLinesPoisson(sotTotal, sotLines) },
    };

    return NextResponse.json({
      fixture: {
        id: fixture?.fixture?.id,
        date: fixture?.fixture?.date,
        status: fixture?.fixture?.status?.short,
        league: fixture?.league,
        venue: fixture?.fixture?.venue,
        teams: fixture?.teams,
        goals: fixture?.goals,
      },
      inputs: {
        lastN,
        homeTeam: { id: homeTeamId, name: fixture?.teams?.home?.name },
        awayTeam: { id: awayTeamId, name: fixture?.teams?.away?.name },
      },
      context: {
        injuries,
        homeAgg: homeCtx?.agg,
        awayAgg: awayCtx?.agg,
        note:
          "MVP: Poisson sobre total esperado usando (a favor + concedidos). Luego mejoramos a NegBin + factor de ritmo + clima + bajas ponderadas.",
      },
      markets,
      glossary: {
        p: "probabilidad (%)",
        fairOdd: "cuota justa (odd mínima) = 1 / prob",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "predict/match failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
