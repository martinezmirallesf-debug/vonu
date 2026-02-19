// app/api/football/predict/match/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = "https://v3.football.api-sports.io";

// -------------------------
// Utils
// -------------------------
function getApiFootballKey(): string {
  const candidates = [
    process.env.API_FOOTBALL_KEY, // ✅ recomendado (principal)
    process.env.APIFOOTBALL_KEY, // alias legacy
    process.env.APISPORTS_KEY, // alias
    process.env.API_SPORTS_KEY, // alias
    process.env.API_FOOTBALL_API_KEY, // alias
  ];

  const key = candidates.find((v) => typeof v === "string" && v.trim().length > 0);
  if (!key) {
    throw new Error(
      "Missing API-Football key. Set API_FOOTBALL_KEY (preferred) or one of: APIFOOTBALL_KEY, APISPORTS_KEY, API_SPORTS_KEY, API_FOOTBALL_API_KEY",
    );
  }
  return key.trim();
}

async function apiFootballFetch(path: string): Promise<any> {
  const key = getApiFootballKey();

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

function clamp(x: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, x));
}

function mean(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}

function variance(nums: number[]): number {
  if (nums.length < 2) return 0;
  const m = mean(nums);
  return nums.reduce((s, v) => s + (v - m) * (v - m), 0) / (nums.length - 1);
}

function toPct(p: number): number {
  return Math.round(p * 1000) / 10;
}

function fairOddFromProb(p: number): number | null {
  if (p <= 0) return null;
  return Math.round((1 / p) * 100) / 100;
}

/* ------------------------------------------------------------------
   🔥 HYBRID STRENGTH / STYLE ENGINE
-------------------------------------------------------------------*/

function buildHybridStrength(homeAgg: any, awayAgg: any) {
  const homeAttack = homeAgg.goalsForAvg * 0.6 + homeAgg.shotsOnTargetForAvg * 0.4;
  const awayAttack = awayAgg.goalsForAvg * 0.6 + awayAgg.shotsOnTargetForAvg * 0.4;

  const homeDef = 1 / Math.max(0.3, homeAgg.goalsAgainstAvg);
  const awayDef = 1 / Math.max(0.3, awayAgg.goalsAgainstAvg);

  const strengthHome = homeAttack * 0.7 + homeDef * 0.3;
  const strengthAway = awayAttack * 0.7 + awayDef * 0.3;

  const diff = strengthHome - strengthAway;

  const eloFactorHome = clamp(1 + diff * 0.08, 0.85, 1.18);
  const eloFactorAway = clamp(1 - diff * 0.08, 0.85, 1.18);

  const formHome = clamp(1 + (homeAgg.goalsForAvg - homeAgg.goalsAgainstAvg) * 0.08, 0.88, 1.15);
  const formAway = clamp(1 + (awayAgg.goalsForAvg - awayAgg.goalsAgainstAvg) * 0.08, 0.88, 1.15);

  return { eloFactorHome, eloFactorAway, formHome, formAway };
}

function buildStyleProfile(agg: any) {
  const pressure = clamp(agg.shotsForAvg / Math.max(1, agg.shotsAgainstAvg), 0.6, 1.6);
  const possession = clamp(agg.shotsOnTargetForAvg / Math.max(1, agg.shotsForAvg), 0.2, 0.6);
  const verticality = clamp(agg.goalsForAvg / Math.max(1, agg.shotsOnTargetForAvg), 0.1, 0.5);

  return { pressure, possession, verticality };
}

function buildUpsetRisk(hybrid: any, lambdaHome: number, lambdaAway: number) {
  const strengthGap = Math.abs(hybrid.eloFactorHome - hybrid.eloFactorAway);

  const goalBalance = Math.abs(lambdaHome - lambdaAway);
  const chaosFactor = clamp(1 - goalBalance / 2.2, 0, 1);

  const parityFactor = clamp(1 - strengthGap * 2.2, 0, 1);

  const upsetScore = clamp(0.55 * chaosFactor + 0.45 * parityFactor, 0, 1);

  let label = "BAJO";
  if (upsetScore > 0.66) label = "ALTO";
  else if (upsetScore > 0.4) label = "MEDIO";

  return {
    score: Math.round(upsetScore * 100) / 100,
    label,
  };
}

function buildSharpness(goalsLines: any[], quiniela: any) {
  function edgeLabel(p: number) {
    if (p >= 0.82) return "MUY_ALTA";
    if (p >= 0.7) return "ALTA";
    if (p >= 0.58) return "MEDIA";
    return "BAJA";
  }

  const sharpGoals = goalsLines.map((l: any) => ({
    line: l.line,
    overEdge: edgeLabel((l.over.p || 0) / 100),
    underEdge: edgeLabel((l.under.p || 0) / 100),
  }));

  const sharp1X2 = {
    "1": edgeLabel((quiniela["1"]?.p || 0) / 100),
    "X": edgeLabel((quiniela["X"]?.p || 0) / 100),
    "2": edgeLabel((quiniela["2"]?.p || 0) / 100),
  };

  return {
    goals: sharpGoals,
    oneXtwo: sharp1X2,
  };
}

// -------------------------
// Weather (Open-Meteo)
// -------------------------
async function geocodeCity(
  city: string,
): Promise<{ latitude: number; longitude: number; name: string; country: string } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const item = json?.results?.[0];
  if (!item) return null;
  return { latitude: item.latitude, longitude: item.longitude, name: item.name, country: item.country };
}

async function fetchKickoffWeather(
  lat: number,
  lon: number,
  kickoffIso: string,
): Promise<{ time: string; temperatureC: number; precipitationMm: number; windKmh: number } | null> {
  const date = kickoffIso.slice(0, 10);
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,precipitation,wind_speed_10m` +
    `&timezone=UTC` +
    `&start_date=${date}&end_date=${date}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const times: string[] = json?.hourly?.time || [];
  const temps: number[] = json?.hourly?.temperature_2m || [];
  const prec: number[] = json?.hourly?.precipitation || [];
  const wind: number[] = json?.hourly?.wind_speed_10m || [];
  if (!times.length) return null;

  const kickoffTs = Date.parse(kickoffIso);
  let bestIdx = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const ts = Date.parse(times[i] + ":00Z");
    const d = Math.abs(ts - kickoffTs);
    if (d < bestDiff) {
      bestDiff = d;
      bestIdx = i;
    }
  }

  return {
    time: times[bestIdx] + ":00Z",
    temperatureC: temps[bestIdx],
    precipitationMm: prec[bestIdx],
    windKmh: wind[bestIdx],
  };
}

function weatherMultipliers(
  w: { temperatureC: number; precipitationMm: number; windKmh: number } | null,
): { goals: number; shots: number; shotsOnTarget: number; corners: number; cards: number; note: string } {
  if (!w) {
    return {
      goals: 1,
      shots: 1,
      shotsOnTarget: 1,
      corners: 1,
      cards: 1,
      note: "Sin clima (fallback neutro).",
    };
  }

  const rain = w.precipitationMm ?? 0;
  const wind = w.windKmh ?? 0;

  const rainLevel = clamp(rain / 5, 0, 2);
  const windLevel = clamp((wind - 15) / 20, 0, 2);

  const goals = clamp(1 - 0.04 * rainLevel - 0.03 * windLevel, 0.85, 1.05);
  const shots = clamp(1 - 0.03 * rainLevel - 0.02 * windLevel, 0.88, 1.05);
  const shotsOnTarget = clamp(1 - 0.04 * rainLevel - 0.03 * windLevel, 0.85, 1.05);
  const corners = clamp(1 + 0.02 * rainLevel, 0.95, 1.08);
  const cards = clamp(1 + 0.02 * rainLevel, 0.95, 1.1);

  return {
    goals,
    shots,
    shotsOnTarget,
    corners,
    cards,
    note: `Clima aplicado: lluvia ${rain}mm/h, viento ${wind}km/h.`,
  };
}

// -------------------------
// Injuries / Competition multipliers
// -------------------------
function injuryMultipliers(injuries: any[] | null): {
  buildForTeams: (homeId: number, awayId: number) => {
    counts: { homeMissing: number; homeQuestionable: number; awayMissing: number; awayQuestionable: number };
    mult: { homeAttack: number; awayAttack: number; homeConcede: number; awayConcede: number };
  };
} {
  const arr = injuries || [];
  return {
    buildForTeams: (homeId: number, awayId: number) => {
      let homeMissing = 0;
      let awayMissing = 0;
      let homeQuestionable = 0;
      let awayQuestionable = 0;

      for (const it of arr) {
        const teamId = it?.team?.id;
        const type = (it?.player?.type || it?.type || "").toLowerCase();
        const isMissing = type.includes("missing");
        const isQuestionable = type.includes("questionable");
        if (!teamId) continue;

        if (teamId === homeId) {
          if (isMissing) homeMissing++;
          else if (isQuestionable) homeQuestionable++;
        } else if (teamId === awayId) {
          if (isMissing) awayMissing++;
          else if (isQuestionable) awayQuestionable++;
        }
      }

      const homeAttack = clamp(1 - 0.02 * homeMissing - 0.01 * homeQuestionable, 0.85, 1);
      const awayAttack = clamp(1 - 0.02 * awayMissing - 0.01 * awayQuestionable, 0.85, 1);

      const homeConcede = clamp(1 + 0.01 * homeMissing + 0.005 * homeQuestionable, 1, 1.12);
      const awayConcede = clamp(1 + 0.01 * awayMissing + 0.005 * awayQuestionable, 1, 1.12);

      return {
        counts: { homeMissing, homeQuestionable, awayMissing, awayQuestionable },
        mult: { homeAttack, awayAttack, homeConcede, awayConcede },
      };
    },
  };
}

function competitionMultipliers(leagueName: string | null): {
  goals: number;
  corners: number;
  cards: number;
  shots: number;
  shotsOnTarget: number;
} {
  const name = (leagueName || "").toLowerCase();

  const isFriendly = name.includes("friendly") || name.includes("amist");
  const isCup = name.includes("cup") || name.includes("copa") || name.includes("king") || name.includes("del rey");
  const isUcl = name.includes("champions") || name.includes("uefa");
  const isInternational = name.includes("world") || name.includes("euro") || name.includes("qualification");

  let goals = 1;
  let corners = 1;
  let cards = 1;
  let shots = 1;
  let shotsOnTarget = 1;

  if (isFriendly) {
    goals *= 0.97;
    shots *= 0.95;
    shotsOnTarget *= 0.95;
    cards *= 0.8;
  }

  if (isCup || isUcl || isInternational) {
    cards *= 1.08;
    goals *= 0.99;
  }

  return {
    goals: clamp(goals, 0.9, 1.1),
    corners: clamp(corners, 0.9, 1.1),
    cards: clamp(cards, 0.75, 1.2),
    shots: clamp(shots, 0.9, 1.1),
    shotsOnTarget: clamp(shotsOnTarget, 0.9, 1.1),
  };
}

// -------------------------
// Dixon–Coles goals model
// -------------------------
function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k: number, lambda: number): number {
  if (k < 0) return 0;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

function dcTau(x: number, y: number, lambda: number, mu: number, rho: number): number {
  if (x === 0 && y === 0) return 1 - lambda * mu * rho;
  if (x === 0 && y === 1) return 1 + lambda * rho;
  if (x === 1 && y === 0) return 1 + mu * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

function dcScoreMatrix(
  lambda: number,
  mu: number,
  rho: number,
  maxGoals = 7,
): { home: number; away: number; p: number }[] {
  const mat: { home: number; away: number; p: number }[] = [];
  let total = 0;

  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const base = poissonPmf(h, lambda) * poissonPmf(a, mu);
      const p = base * dcTau(h, a, lambda, mu, rho);
      total += p;
      mat.push({ home: h, away: a, p });
    }
  }

  if (total > 0) for (const s of mat) s.p = s.p / total;
  return mat;
}

function oneXtwoFromScores(scores: { home: number; away: number; p: number }[]): { pH: number; pD: number; pA: number } {
  let pH = 0,
    pD = 0,
    pA = 0;
  for (const s of scores) {
    if (s.home > s.away) pH += s.p;
    else if (s.home === s.away) pD += s.p;
    else pA += s.p;
  }
  return { pH, pD, pA };
}

function topScores(
  scores: { home: number; away: number; p: number }[],
  topN = 10,
): { score: string; p: number; fairOdd: number | null }[] {
  return [...scores]
    .sort((a, b) => b.p - a.p)
    .slice(0, topN)
    .map((s) => ({
      score: `${s.home}-${s.away}`,
      p: toPct(s.p),
      fairOdd: fairOddFromProb(s.p),
    }));
}

// -------------------------
// Negative Binomial (counts)
// -------------------------
function estimateAlphaFromTotals(totals: number[]): number {
  const m = mean(totals);
  if (m <= 0 || totals.length < 5) return 0.15;
  const v = variance(totals);
  const a = (v - m) / (m * m);
  return clamp(isFinite(a) ? a : 0.15, 0.03, 0.8);
}

function logGammaLanczos(z: number): number {
  const p: number[] = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGammaLanczos(1 - z);
  }

  z -= 1;
  let x = 0.9999999999998099;
  for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);

  const t = z + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function nbPmf(k: number, meanM: number, alpha: number): number {
  if (k < 0) return 0;
  const a = clamp(alpha, 1e-6, 10);
  const r = 1 / a;
  const pp = r / (r + meanM);
  const logCoef = logGammaLanczos(k + r) - logGammaLanczos(r) - logGammaLanczos(k + 1);
  const logP = logCoef + k * Math.log(1 - pp) + r * Math.log(pp);
  return Math.exp(logP);
}

function nbCdf(k: number, meanM: number, alpha: number): number {
  let s = 0;
  for (let i = 0; i <= k; i++) s += nbPmf(i, meanM, alpha);
  return clamp(s, 0, 1);
}

function buildLinesNB(meanM: number, alpha: number, lines: number[]): any[] {
  return lines.map((line) => {
    const k = Math.floor(line + 0.5);
    const pUnder = nbCdf(k - 1, meanM, alpha);
    const pOver = 1 - pUnder;
    return {
      line,
      over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
      under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
    };
  });
}

// -------------------------
// ✅ Seeded RNG (determinista)
// -------------------------
function fnv1a32(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let RNG: (() => number) | null = null;
function R(): number {
  return RNG ? RNG() : Math.random();
}

// -------------------------
// RNG sampling
// -------------------------
function randn(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = R();
  while (v === 0) v = R();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function gammaRand(shape: number, scale: number): number {
  if (shape <= 0 || scale <= 0) return 0;

  if (shape < 1) {
    const u = R();
    return gammaRand(shape + 1, scale) * Math.pow(u, 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    const x = randn();
    let v = 1 + c * x;
    if (v <= 0) continue;
    v = v * v * v;

    const u = R();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

function poissonSample(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= R();
  } while (p > L);
  return k - 1;
}

function nbSample(meanM: number, alpha: number): number {
  const a = clamp(alpha, 1e-6, 10);
  const r = 1 / a;
  const scale = meanM / r;
  const lam = gammaRand(r, scale);
  return poissonSample(lam);
}

function binomialSample(n: number, p: number): number {
  const pp = clamp(p, 0, 1);
  let x = 0;
  for (let i = 0; i < n; i++) if (R() < pp) x++;
  return x;
}

// -------------------------
// Types
// -------------------------
type Agg = {
  n: number;
  goalsForAvg: number;
  goalsAgainstAvg: number;
  shotsForAvg: number;
  shotsAgainstAvg: number;
  shotsOnTargetForAvg: number;
  shotsOnTargetAgainstAvg: number;
  cornersForAvg: number;
  cornersAgainstAvg: number;
  yellowsForAvg: number;
  yellowsAgainstAvg: number;
  redsForAvg: number | null;
  redsAgainstAvg: number | null;
};

// -------------------------
// PRO estimation helpers
// -------------------------
function safeRate(num: number, den: number, fallback: number, lo: number, hi: number): number {
  if (!isFinite(num) || !isFinite(den) || den <= 0) return clamp(fallback, lo, hi);
  return clamp(num / den, lo, hi);
}

function lineProbFromSamples(samples: number[], line: number): any {
  const n = Math.max(1, samples.length);
  const k = Math.floor(line + 0.5);
  let overCount = 0;
  for (let i = 0; i < n; i++) if (samples[i] >= k) overCount++;

  const pOver = overCount / n;
  const pUnder = 1 - pOver;

  const se = Math.sqrt((pOver * (1 - pOver)) / n);
  const z = 1.96;
  const pOverLo = clamp(pOver - z * se, 0, 1);
  const pOverHi = clamp(pOver + z * se, 0, 1);

  return {
    line,
    over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver), lo: toPct(pOverLo), hi: toPct(pOverHi) },
    under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
  };
}

function mkHalfLines(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let x = from; x <= to + 1e-9; x += step) out.push(Math.round(x * 10) / 10);
  return out;
}

function paceLabel(shotsTotalMean: number, cornersMean: number): { label: "ALTO" | "MEDIO" | "BAJO"; score: number } {
  const score = 0.6 * shotsTotalMean + 0.4 * (cornersMean * 2.5);
  if (score >= 26) return { label: "ALTO", score: Math.round(score * 10) / 10 };
  if (score >= 22) return { label: "MEDIO", score: Math.round(score * 10) / 10 };
  return { label: "BAJO", score: Math.round(score * 10) / 10 };
}

function opennessLabel(expectedGoalsTotal: number): "ABIERTO" | "EQUILIBRADO" | "CERRADO" {
  if (expectedGoalsTotal >= 3.0) return "ABIERTO";
  if (expectedGoalsTotal >= 2.2) return "EQUILIBRADO";
  return "CERRADO";
}

// -------------------------
// Route
// -------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fixtureId = searchParams.get("fixture");
    const lastN = parseInt(searchParams.get("last") || "10", 10);
    const simsRaw = parseInt(searchParams.get("sims") || "20000", 10);
    const sims = clamp(isFinite(simsRaw) ? simsRaw : 20000, 5000, 50000);

    if (!fixtureId) return NextResponse.json({ error: "Missing fixture" }, { status: 400 });

    // ✅ Leer profile al principio (para que afecte a seed y a todo el output)
    const profile = (searchParams.get("profile") || "normal").toLowerCase();

    // ✅ Seed determinista: mismo fixture + params + profile => misma predicción SIEMPRE
    const seedStr = `fixture=${fixtureId}|last=${lastN}|sims=${sims}|profile=${profile}`;
    RNG = mulberry32(fnv1a32(seedStr));

    // 1) Fixture
    const fx = await apiFootballFetch(`/fixtures?id=${fixtureId}`);
    if (!fx.ok) return NextResponse.json({ error: "fixture fetch failed", details: fx }, { status: 500 });

    const fixture = fx.json?.response?.[0];
    if (!fixture) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });

    const home = fixture?.teams?.home;
    const away = fixture?.teams?.away;
    const league = fixture?.league;
    const venue = fixture?.fixture?.venue;
    const kickoffIso = fixture?.fixture?.date;

    // 2) Injuries
    const injRes = await apiFootballFetch(`/injuries?fixture=${fixtureId}`);
    const injuries = injRes.ok ? injRes.json?.response || [] : [];

    // 3) team-context endpoints (internal)
    const baseUrl = new URL(req.url);
    const origin = `${baseUrl.protocol}//${baseUrl.host}`;

    const homeCtxRes = await fetch(
      `${origin}/api/football/team-context?team=${home.id}&league=${league.id}&season=${league.season}&last=${lastN}`,
      { cache: "no-store" },
    );
    const awayCtxRes = await fetch(
      `${origin}/api/football/team-context?team=${away.id}&league=${league.id}&season=${league.season}&last=${lastN}`,
      { cache: "no-store" },
    );

    const homeCtx = await homeCtxRes.json().catch(() => null);
    const awayCtx = await awayCtxRes.json().catch(() => null);

    const homeAgg: Agg = homeCtx?.agg;
    const awayAgg: Agg = awayCtx?.agg;

    const homeMatches = (homeCtx?.perMatch || []).filter((m: any) => m.status === "FT");
    const awayMatches = (awayCtx?.perMatch || []).filter((m: any) => m.status === "FT");

    // 4) Context multipliers
    const inj = injuryMultipliers(injuries);
    const injBuilt = inj.buildForTeams(home.id, away.id);
    const comp = competitionMultipliers(league?.name || null);

    let weather: any = null;
    let weatherGeo: any = null;
    if (venue?.city && kickoffIso) {
      weatherGeo = await geocodeCity(String(venue.city));
      if (weatherGeo?.latitude && weatherGeo?.longitude) {
        weather = await fetchKickoffWeather(weatherGeo.latitude, weatherGeo.longitude, kickoffIso);
      }
    }
    const wMult = weatherMultipliers(weather);

    const hybrid = buildHybridStrength(homeAgg, awayAgg);
    const styleHome = buildStyleProfile(homeAgg);
    const styleAway = buildStyleProfile(awayAgg);

    // -------------------------
    // PRO: Chain model
    // -------------------------
    let meanShotsHome = (homeAgg.shotsForAvg + awayAgg.shotsAgainstAvg) / 2;
    let meanShotsAway = (awayAgg.shotsForAvg + homeAgg.shotsAgainstAvg) / 2;

    meanShotsHome =
      meanShotsHome *
      injBuilt.mult.homeAttack *
      injBuilt.mult.awayConcede *
      comp.shots *
      wMult.shots *
      hybrid.eloFactorHome *
      hybrid.formHome *
      clamp(1 + (styleHome.pressure - 1) * 0.12, 0.9, 1.15);

    meanShotsAway =
      meanShotsAway *
      injBuilt.mult.awayAttack *
      injBuilt.mult.homeConcede *
      comp.shots *
      wMult.shots *
      hybrid.eloFactorAway *
      hybrid.formAway *
      clamp(1 + (styleAway.pressure - 1) * 0.15, 0.85, 1.2);

    meanShotsHome = clamp(meanShotsHome, 4, 30);
    meanShotsAway = clamp(meanShotsAway, 4, 30);

    const homeShotsForSeries = homeMatches.map((m: any) => m.shotsFor ?? 0).filter((x: any) => isFinite(x));
    const awayShotsForSeries = awayMatches.map((m: any) => m.shotsFor ?? 0).filter((x: any) => isFinite(x));
    const alphaShotsHome = estimateAlphaFromTotals(homeShotsForSeries.length ? homeShotsForSeries : [meanShotsHome]);
    const alphaShotsAway = estimateAlphaFromTotals(awayShotsForSeries.length ? awayShotsForSeries : [meanShotsAway]);

    const pSotTeamHome = safeRate(homeAgg.shotsOnTargetForAvg, homeAgg.shotsForAvg, 0.32, 0.15, 0.55);
    const pSotTeamAway = safeRate(awayAgg.shotsOnTargetForAvg, awayAgg.shotsForAvg, 0.32, 0.15, 0.55);

    const pSotConcedeByAway = safeRate(awayAgg.shotsOnTargetAgainstAvg, awayAgg.shotsAgainstAvg, 0.32, 0.15, 0.55);
    const pSotConcedeByHome = safeRate(homeAgg.shotsOnTargetAgainstAvg, homeAgg.shotsAgainstAvg, 0.32, 0.15, 0.55);

    let pSotHome = Math.sqrt(pSotTeamHome * pSotConcedeByAway);
    let pSotAway = Math.sqrt(pSotTeamAway * pSotConcedeByHome);

    pSotHome = clamp(pSotHome * clamp(wMult.shotsOnTarget / wMult.shots, 0.9, 1.05), 0.12, 0.6);
    pSotAway = clamp(pSotAway * clamp(wMult.shotsOnTarget / wMult.shots, 0.9, 1.05), 0.12, 0.6);

    const pGoalTeamHome = safeRate(homeAgg.goalsForAvg, homeAgg.shotsOnTargetForAvg, 0.28, 0.1, 0.45);
    const pGoalTeamAway = safeRate(awayAgg.goalsForAvg, awayAgg.shotsOnTargetForAvg, 0.28, 0.1, 0.45);

    const pGoalConcedeByAway = safeRate(awayAgg.goalsAgainstAvg, awayAgg.shotsOnTargetAgainstAvg, 0.28, 0.1, 0.5);
    const pGoalConcedeByHome = safeRate(homeAgg.goalsAgainstAvg, homeAgg.shotsOnTargetAgainstAvg, 0.28, 0.1, 0.5);

    let pGoalHome = Math.sqrt(pGoalTeamHome * pGoalConcedeByAway);
    let pGoalAway = Math.sqrt(pGoalTeamAway * pGoalConcedeByHome);

    pGoalHome = clamp(pGoalHome * injBuilt.mult.homeAttack, 0.08, 0.55);
    pGoalAway = clamp(pGoalAway * injBuilt.mult.awayAttack, 0.08, 0.55);

    // -------------------------
    // Corners/Cards NB (totals)
    // -------------------------
    let meanCornersTotal =
      (homeAgg.cornersForAvg + awayAgg.cornersAgainstAvg + awayAgg.cornersForAvg + homeAgg.cornersAgainstAvg) / 2;
    let meanCardsTotal =
      (homeAgg.yellowsForAvg + awayAgg.yellowsAgainstAvg + awayAgg.yellowsForAvg + homeAgg.yellowsAgainstAvg) / 2;

    meanCornersTotal = meanCornersTotal * comp.corners * wMult.corners;
    meanCardsTotal = meanCardsTotal * comp.cards * wMult.cards;

    meanCornersTotal = clamp(meanCornersTotal, 4, 15);
    meanCardsTotal = clamp(meanCardsTotal, 1.5, 9);

    const cornersTotals = [
      ...homeMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const cardsTotals = [
      ...homeMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const alphaCorners = estimateAlphaFromTotals(cornersTotals);
    const alphaCards = estimateAlphaFromTotals(cardsTotals);

    // -------------------------
    // Monte Carlo: Shots -> SoT -> Goals
    // -------------------------
    const simShotsTotal: number[] = [];
    const simSoTTotal: number[] = [];

    let sumGH = 0,
      sumGA = 0,
      sumShotsT = 0,
      sumSoTT = 0;

    for (let i = 0; i < sims; i++) {
      const shotsH = nbSample(meanShotsHome, alphaShotsHome);
      const shotsA = nbSample(meanShotsAway, alphaShotsAway);

      const sotH = binomialSample(shotsH, pSotHome);
      const sotA = binomialSample(shotsA, pSotAway);

      const goalsH = binomialSample(sotH, pGoalHome);
      const goalsA = binomialSample(sotA, pGoalAway);

      const shotsT = shotsH + shotsA;
      const sotT = sotH + sotA;

      simShotsTotal.push(shotsT);
      simSoTTotal.push(sotT);

      sumGH += goalsH;
      sumGA += goalsA;
      sumShotsT += shotsT;
      sumSoTT += sotT;
    }

    const lambdaHomeFromChain = sumGH / sims;
    const lambdaAwayFromChain = sumGA / sims;

    // -------------------------
    // Dixon–Coles with lambdas
    // -------------------------
    const expectedGoalsTotal = lambdaHomeFromChain + lambdaAwayFromChain;

    const upset = buildUpsetRisk(hybrid, lambdaHomeFromChain, lambdaAwayFromChain);

    let rho = -0.08;
    if (expectedGoalsTotal <= 2.0) rho = -0.12;
    else if (expectedGoalsTotal >= 3.2) rho = -0.05;
    rho = clamp(rho, -0.2, 0.05);

    const dcScores = dcScoreMatrix(lambdaHomeFromChain, lambdaAwayFromChain, rho, 7);
    const oneXtwo = oneXtwoFromScores(dcScores);
    const top = topScores(dcScores, 10);

    const p1X = clamp(oneXtwo.pH + oneXtwo.pD, 0, 1);
    const pX2 = clamp(oneXtwo.pD + oneXtwo.pA, 0, 1);
    const p12 = clamp(oneXtwo.pH + oneXtwo.pA, 0, 1);

    function goalsTotalProbOverFromDC(line: number): number {
      const k = Math.floor(line + 0.5);
      let pUnder = 0;
      for (const s of dcScores) if (s.home + s.away <= k - 1) pUnder += s.p;
      return 1 - pUnder;
    }

    // -------------------------
    // LÍNEAS (normal vs wide)
    // -------------------------
    function mkHalf(from: number, to: number, step = 0.5): number[] {
      const out: number[] = [];
      for (let x = from; x <= to + 1e-9; x += step) out.push(Math.round(x * 10) / 10);
      return out;
    }

    const ranges =
      profile === "wide"
        ? {
            goals: { from: 0.5, to: 10.5, step: 0.5 },
            shots: { from: 6.5, to: 48.5, step: 2 },
            sot: { from: 0.5, to: 22.5, step: 1 },
            corners: { from: 2.5, to: 20.5, step: 1 },
            cards: { from: 0.5, to: 14.5, step: 1 },
          }
        : {
            goals: { from: 0.5, to: 8.5, step: 0.5 },
            shots: { from: 8.5, to: 40.5, step: 2 },
            sot: { from: 1.5, to: 16.5, step: 1 },
            corners: { from: 3.5, to: 16.5, step: 1 },
            cards: { from: 0.5, to: 10.5, step: 1 },
          };

    const goalsLinesWanted = mkHalf(ranges.goals.from, ranges.goals.to, ranges.goals.step);

    const goalsLines = goalsLinesWanted.map((line) => {
      const pOver = clamp(goalsTotalProbOverFromDC(line), 0, 1);
      const pUnder = 1 - pOver;
      return {
        line,
        over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
        under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
      };
    });

    const shotsLinesWanted = mkHalfLines(ranges.shots.from, ranges.shots.to, ranges.shots.step);
    const sotLinesWanted = mkHalfLines(ranges.sot.from, ranges.sot.to, ranges.sot.step);

    const shotsLines = shotsLinesWanted.map((l) => lineProbFromSamples(simShotsTotal, l));
    const sotLines = sotLinesWanted.map((l) => lineProbFromSamples(simSoTTotal, l));

    const cornersLinesWanted = mkHalfLines(ranges.corners.from, ranges.corners.to, ranges.corners.step);
    const cardsLinesWanted = mkHalfLines(ranges.cards.from, ranges.cards.to, ranges.cards.step);

    const markets = {
      goals: {
        model: "Chain (Shots->SoT->Goals) for λ + Dixon–Coles for score/1X2",
        lambdaHome: Math.round(lambdaHomeFromChain * 100) / 100,
        lambdaAway: Math.round(lambdaAwayFromChain * 100) / 100,
        lambdaTotal: Math.round(expectedGoalsTotal * 100) / 100,
        rho: Math.round(rho * 1000) / 1000,
        lines: goalsLines,
      },
      corners: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanCornersTotal * 100) / 100,
        alpha: Math.round(alphaCorners * 1000) / 1000,
        lines: buildLinesNB(meanCornersTotal, alphaCorners, cornersLinesWanted),
      },
      cards: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanCardsTotal * 100) / 100,
        alpha: Math.round(alphaCards * 1000) / 1000,
        lines: buildLinesNB(meanCardsTotal, alphaCards, cardsLinesWanted),
      },
      shots: {
        model: "Chain: Shots ~ NegBin(team) then totals via simulation",
        meanTotal: Math.round((sumShotsT / sims) * 100) / 100,
        lines: shotsLines,
      },
      shotsOnTarget: {
        model: "Chain: SoT | Shots ~ Binomial(team) then totals via simulation",
        meanTotal: Math.round((sumSoTT / sims) * 100) / 100,
        lines: sotLines,
      },
    };

    const quiniela = {
      model: "Dixon–Coles 1X2 + exact scores (λ from chain model)",
      "1": { p: toPct(oneXtwo.pH), fairOdd: fairOddFromProb(oneXtwo.pH) },
      "X": { p: toPct(oneXtwo.pD), fairOdd: fairOddFromProb(oneXtwo.pD) },
      "2": { p: toPct(oneXtwo.pA), fairOdd: fairOddFromProb(oneXtwo.pA) },
      doubleChance: {
        "1X": { p: toPct(p1X), fairOdd: fairOddFromProb(p1X) },
        "X2": { p: toPct(pX2), fairOdd: fairOddFromProb(pX2) },
        "12": { p: toPct(p12), fairOdd: fairOddFromProb(p12) },
      },
      topScores: top,
    };

    // -------------------------
    // Summary humano (A)
    // -------------------------
    const shotsTotalMean = Math.round((sumShotsT / sims) * 100) / 100;
    const pace = paceLabel(shotsTotalMean, meanCornersTotal);
    const openness = opennessLabel(expectedGoalsTotal);

    const injCounts = injBuilt.counts;
    const injuryNote =
      injCounts.homeMissing + injCounts.homeQuestionable + injCounts.awayMissing + injCounts.awayQuestionable === 0
        ? "Sin bajas relevantes detectadas por la API."
        : `Bajas: Local (missing ${injCounts.homeMissing}, duda ${injCounts.homeQuestionable}) | Visitante (missing ${injCounts.awayMissing}, duda ${injCounts.awayQuestionable}).`;

    const weatherNote =
      weather && typeof weather.temperatureC === "number"
        ? `Clima aprox. en kickoff: ${weather.temperatureC}°C, lluvia ${weather.precipitationMm}mm/h, viento ${weather.windKmh} km/h.`
        : "Clima no disponible (fallback neutro).";

    const sharpness = buildSharpness(goalsLines, quiniela);

    const summary = {
      expected: {
        goalsTotal: Math.round(expectedGoalsTotal * 100) / 100,
        goalsHome: Math.round(lambdaHomeFromChain * 100) / 100,
        goalsAway: Math.round(lambdaAwayFromChain * 100) / 100,
        shotsTotal: shotsTotalMean,
        sotTotal: Math.round((sumSoTT / sims) * 100) / 100,
        cornersTotal: Math.round(meanCornersTotal * 100) / 100,
        cardsTotal: Math.round(meanCardsTotal * 100) / 100,
      },
      matchProfile: {
        pace: { label: pace.label, score: pace.score },
        openness,
        upsetRisk: upset,
        note:
          openness === "CERRADO"
            ? "Se espera partido de pocas ocasiones; suele favorecer unders y empate/partidos ajustados."
            : openness === "ABIERTO"
              ? "Se espera partido con intercambio y llegadas; suele subir overs y mercados de tiros/córners."
              : "Partido intermedio: puede decidirse por detalles (efectividad y momentos).",
      },
      contextNotes: {
        injuries: injuryNote,
        competition: `Competición detectada: ${league?.name || "N/A"} (multiplicadores aplicados).`,
        weather: `${weatherNote} ${wMult.note}`,
      },
    };

    return NextResponse.json({
      fixture: {
        id: fixture?.fixture?.id,
        date: kickoffIso,
        status: fixture?.fixture?.status?.short,
        league: {
          id: league?.id,
          name: league?.name,
          country: league?.country,
          season: league?.season,
          round: league?.round,
        },
        venue: { id: venue?.id, name: venue?.name, city: venue?.city },
        teams: { home: { id: home?.id, name: home?.name }, away: { id: away?.id, name: away?.name } },
      },
      inputs: { lastN, sims, profile },
      summary,
      sharpness,
      context: {
        injuriesCount: injBuilt.counts,
        injuryMultipliers: injBuilt.mult,
        competition: { name: league?.name || null, multipliers: comp },
        weather: weather
          ? { ...weather, geo: weatherGeo, multipliers: wMult, note: wMult.note }
          : { geo: weatherGeo || null, multipliers: wMult, note: wMult.note },
        chainParams: {
          meanShotsHome: Math.round(meanShotsHome * 100) / 100,
          meanShotsAway: Math.round(meanShotsAway * 100) / 100,
          alphaShotsHome: Math.round(alphaShotsHome * 1000) / 1000,
          alphaShotsAway: Math.round(alphaShotsAway * 1000) / 1000,
          pSotHome: Math.round(pSotHome * 1000) / 1000,
          pSotAway: Math.round(pSotAway * 1000) / 1000,
          pGoalHome: Math.round(pGoalHome * 1000) / 1000,
          pGoalAway: Math.round(pGoalAway * 1000) / 1000,
          note: "Modelo causal aproximado: Shots -> SoT -> Goals con efectos de rival + contexto.",
        },
        nbDispersion: {
          cornersAlpha: Math.round(alphaCorners * 1000) / 1000,
          cardsAlpha: Math.round(alphaCards * 1000) / 1000,
          note: "Alpha controla sobre-dispersión (varianza > media) en conteos.",
        },
        baseAgg: { homeAgg, awayAgg },
      },
      quiniela,
      markets,
      glossary: {
        p: "probabilidad (%)",
        fairOdd: "cuota justa (odd mínima) = 1 / prob",
        alpha: "overdispersion (Var = mean + alpha*mean^2)",
        rho: "corrección Dixon–Coles (correlación en marcadores bajos)",
        sims: "número de simulaciones Monte Carlo",
      },
      disclaimer:
        "Modelo probabilístico orientativo: no garantiza resultados. Úsalo para análisis y control de riesgo, no como certeza.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "predict/match failed", message: e?.message || String(e) }, { status: 500 });
  }
}
