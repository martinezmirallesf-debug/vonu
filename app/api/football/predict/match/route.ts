// app/api/football/predict/match/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = "https://v3.football.api-sports.io";

// -------------------------
// Utils
// -------------------------
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

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function mean(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}

function variance(nums: number[]) {
  if (nums.length < 2) return 0;
  const m = mean(nums);
  return nums.reduce((s, v) => s + (v - m) * (v - m), 0) / (nums.length - 1);
}

function toPct(p: number) {
  return Math.round(p * 1000) / 10; // 1 decimal (%)
}

function fairOddFromProb(p: number) {
  if (p <= 0) return null;
  return Math.round((1 / p) * 100) / 100;
}

// -------------------------
// RNG
// -------------------------
function randUniform() {
  let u = Math.random();
  while (u === 0) u = Math.random();
  return u;
}

function randNormal() {
  // Box-Muller
  const u1 = randUniform();
  const u2 = randUniform();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function poissonSample(lambda: number) {
  if (lambda <= 0) return 0;

  // Knuth for small/medium
  if (lambda < 60) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= randUniform();
    } while (p > L);
    return k - 1;
  }

  // Normal approx for large lambda
  const x = Math.round(lambda + Math.sqrt(lambda) * randNormal());
  return Math.max(0, x);
}

function binomialSample(n: number, p: number) {
  const pp = clamp(p, 0, 1);
  let x = 0;
  for (let i = 0; i < n; i++) if (Math.random() < pp) x++;
  return x;
}

// -------------------------
// Overdispersion without Gamma/LogGamma:
// Poisson-Lognormal mixture (practical NB-like)
// If Var = m + alpha*m^2  => choose sigma s.t. exp(sigma^2)-1 ≈ alpha
// => sigma^2 = ln(1+alpha)
// -------------------------
function sigmaFromAlpha(alpha: number) {
  const a = clamp(alpha, 1e-6, 5);
  return Math.sqrt(Math.log(1 + a));
}

function overdispersedPoissonSample(meanM: number, alpha: number) {
  const m = Math.max(0, meanM);
  if (m <= 0) return 0;

  const sigma = sigmaFromAlpha(alpha);
  // lognormal with mean 1: exp(sigma*z - 0.5*sigma^2)
  const z = randNormal();
  const mult = Math.exp(sigma * z - 0.5 * sigma * sigma);
  return poissonSample(m * mult);
}

// -------------------------
// Weather (Open-Meteo)
// -------------------------
async function geocodeCity(city: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  const item = json?.results?.[0];
  if (!item) return null;
  return { latitude: item.latitude, longitude: item.longitude, name: item.name, country: item.country };
}

async function fetchKickoffWeather(lat: number, lon: number, kickoffIso: string) {
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

function weatherMultipliers(w: { temperatureC: number; precipitationMm: number; windKmh: number } | null) {
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
  const cards = clamp(1 + 0.02 * rainLevel, 0.95, 1.10);

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
function injuryMultipliers(injuries: any[] | null) {
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

function competitionMultipliers(leagueName: string | null) {
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
// Dixon–Coles (no logGamma needed)
// We'll use factorial table up to 15
// -------------------------
const FACT: number[] = (() => {
  const f = [1];
  for (let i = 1; i <= 25; i++) f[i] = f[i - 1] * i;
  return f;
})();

function poissonPmf(k: number, lambda: number) {
  if (k < 0) return 0;
  if (lambda <= 0) return k === 0 ? 1 : 0;
  const kk = Math.min(k, 25);
  const denom = FACT[kk] || 1;
  // For safety if k > 25 (we never go that high in goals)
  if (k > 25) return 0;
  return Math.exp(-lambda) * Math.pow(lambda, k) / denom;
}

function dcTau(x: number, y: number, lambda: number, mu: number, rho: number) {
  if (x === 0 && y === 0) return 1 - lambda * mu * rho;
  if (x === 0 && y === 1) return 1 + lambda * rho;
  if (x === 1 && y === 0) return 1 + mu * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

function dcScoreMatrix(lambda: number, mu: number, rho: number, maxGoals = 7) {
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

function oneXtwoFromScores(scores: { home: number; away: number; p: number }[]) {
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

function topScores(scores: { home: number; away: number; p: number }[], topN = 10) {
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
// Helpers
// -------------------------
function safeRate(num: number, den: number, fallback: number, lo: number, hi: number) {
  if (!isFinite(num) || !isFinite(den) || den <= 0) return clamp(fallback, lo, hi);
  return clamp(num / den, lo, hi);
}

function lineProbFromSamples(samples: number[], line: number) {
  const k = Math.floor(line + 0.5); // Over x.5 => >= x+1
  const overCount = samples.filter((v) => v >= k).length;
  const pOver = overCount / Math.max(1, samples.length);
  const pUnder = 1 - pOver;
  return {
    line,
    over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
    under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
  };
}

function estimateAlphaFromTotals(totals: number[]) {
  const m = mean(totals);
  if (m <= 0 || totals.length < 5) return 0.15;
  const v = variance(totals);
  const a = (v - m) / (m * m);
  return clamp(isFinite(a) ? a : 0.15, 0.03, 0.8);
}

// -------------------------
// Route
// -------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fixtureId = searchParams.get("fixture");
    const lastN = parseInt(searchParams.get("last") || "10", 10);
    const simsRaw = parseInt(searchParams.get("sims") || "25000", 10);
    const sims = clamp(isFinite(simsRaw) ? simsRaw : 25000, 5000, 50000);

    if (!fixtureId) return NextResponse.json({ error: "Missing fixture" }, { status: 400 });

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
    const statusShort = fixture?.fixture?.status?.short;

    if (!home?.id || !away?.id || !league?.id || !league?.season) {
      return NextResponse.json({ error: "Fixture missing team/league data" }, { status: 500 });
    }

    // 2) Injuries
    const injRes = await apiFootballFetch(`/injuries?fixture=${fixtureId}`);
    const injuries = injRes.ok ? injRes.json?.response || [] : [];

    // 3) team-context endpoints
    const baseUrl = new URL(req.url);
    const origin = `${baseUrl.protocol}//${baseUrl.host}`;

    const homeCtxRes = await fetch(
      `${origin}/api/football/team-context?team=${home.id}&league=${league.id}&season=${league.season}&last=${lastN}`,
      { cache: "no-store" }
    );
    const awayCtxRes = await fetch(
      `${origin}/api/football/team-context?team=${away.id}&league=${league.id}&season=${league.season}&last=${lastN}`,
      { cache: "no-store" }
    );

    const homeCtx = await homeCtxRes.json().catch(() => null);
    const awayCtx = await awayCtxRes.json().catch(() => null);

    const homeAgg: Agg = homeCtx?.agg;
    const awayAgg: Agg = awayCtx?.agg;

    if (!homeAgg || !awayAgg) {
      return NextResponse.json(
        { error: "Missing team-context agg for one team", homeAgg, awayAgg },
        { status: 500 }
      );
    }

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

    // -------------------------
    // PRO: Shots means (home/away) from (for + conceded)/2
    // -------------------------
    let meanShotsHome = (homeAgg.shotsForAvg + awayAgg.shotsAgainstAvg) / 2;
    let meanShotsAway = (awayAgg.shotsForAvg + homeAgg.shotsAgainstAvg) / 2;

    // Apply context
    meanShotsHome = meanShotsHome * injBuilt.mult.homeAttack * injBuilt.mult.awayConcede * comp.shots * wMult.shots;
    meanShotsAway = meanShotsAway * injBuilt.mult.awayAttack * injBuilt.mult.homeConcede * comp.shots * wMult.shots;

    meanShotsHome = clamp(meanShotsHome, 4, 30);
    meanShotsAway = clamp(meanShotsAway, 4, 30);

    // Shots dispersion alpha from variance (team series)
    const homeShotsForSeries = homeMatches.map((m: any) => m.shotsFor ?? 0).filter((x: any) => isFinite(x));
    const awayShotsForSeries = awayMatches.map((m: any) => m.shotsFor ?? 0).filter((x: any) => isFinite(x));
    const alphaShotsHome = estimateAlphaFromTotals(homeShotsForSeries.length ? homeShotsForSeries : [meanShotsHome]);
    const alphaShotsAway = estimateAlphaFromTotals(awayShotsForSeries.length ? awayShotsForSeries : [meanShotsAway]);

    // p(SoT|Shot)
    const pSotTeamHome = safeRate(homeAgg.shotsOnTargetForAvg, homeAgg.shotsForAvg, 0.32, 0.15, 0.55);
    const pSotTeamAway = safeRate(awayAgg.shotsOnTargetForAvg, awayAgg.shotsForAvg, 0.32, 0.15, 0.55);

    const pSotConcedeByAway = safeRate(awayAgg.shotsOnTargetAgainstAvg, awayAgg.shotsAgainstAvg, 0.32, 0.15, 0.55);
    const pSotConcedeByHome = safeRate(homeAgg.shotsOnTargetAgainstAvg, homeAgg.shotsAgainstAvg, 0.32, 0.15, 0.55);

    let pSotHome = Math.sqrt(pSotTeamHome * pSotConcedeByAway);
    let pSotAway = Math.sqrt(pSotTeamAway * pSotConcedeByHome);

    pSotHome = clamp(pSotHome * clamp(wMult.shotsOnTarget / wMult.shots, 0.9, 1.05), 0.12, 0.60);
    pSotAway = clamp(pSotAway * clamp(wMult.shotsOnTarget / wMult.shots, 0.9, 1.05), 0.12, 0.60);

    // p(Goal|SoT)
    const pGoalTeamHome = safeRate(homeAgg.goalsForAvg, homeAgg.shotsOnTargetForAvg, 0.28, 0.10, 0.45);
    const pGoalTeamAway = safeRate(awayAgg.goalsForAvg, awayAgg.shotsOnTargetForAvg, 0.28, 0.10, 0.45);

    const pGoalConcedeByAway = safeRate(awayAgg.goalsAgainstAvg, awayAgg.shotsOnTargetAgainstAvg, 0.28, 0.10, 0.50);
    const pGoalConcedeByHome = safeRate(homeAgg.goalsAgainstAvg, homeAgg.shotsOnTargetAgainstAvg, 0.28, 0.10, 0.50);

    let pGoalHome = Math.sqrt(pGoalTeamHome * pGoalConcedeByAway);
    let pGoalAway = Math.sqrt(pGoalTeamAway * pGoalConcedeByHome);

    pGoalHome = clamp(pGoalHome * injBuilt.mult.homeAttack, 0.08, 0.55);
    pGoalAway = clamp(pGoalAway * injBuilt.mult.awayAttack, 0.08, 0.55);

    // -------------------------
    // Corners/Cards (totals) means + alpha
    // -------------------------
    let meanCornersTotal =
      (homeAgg.cornersForAvg + awayAgg.cornersAgainstAvg + awayAgg.cornersForAvg + homeAgg.cornersAgainstAvg) / 2;
    let meanCardsTotal =
      (homeAgg.yellowsForAvg + awayAgg.yellowsAgainstAvg + awayAgg.yellowsForAvg + homeAgg.yellowsAgainstAvg) / 2;

    meanCornersTotal = clamp(meanCornersTotal * comp.corners * wMult.corners, 4, 15);
    meanCardsTotal = clamp(meanCardsTotal * comp.cards * wMult.cards, 1.5, 9);

    const cornersTotals = [
      ...homeMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const cardsTotals = [
      ...homeMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const alphaCorners = estimateAlphaFromTotals(cornersTotals.length ? cornersTotals : [meanCornersTotal]);
    const alphaCards = estimateAlphaFromTotals(cardsTotals.length ? cardsTotals : [meanCardsTotal]);

    // -------------------------
    // Monte Carlo:
    // Shots totals, SoT totals, Goals -> lambdas
    // Corners totals, Cards totals via Poisson-lognormal
    // -------------------------
    const simShotsTotal: number[] = [];
    const simSoTTotal: number[] = [];
    const simGoalsHome: number[] = [];
    const simGoalsAway: number[] = [];
    const simGoalsTotal: number[] = [];
    const simCornersTotal: number[] = [];
    const simCardsTotal: number[] = [];

    let sumGH = 0,
      sumGA = 0,
      sumShotsT = 0,
      sumSoTT = 0,
      sumCT = 0,
      sumCardsT = 0;

    for (let i = 0; i < sims; i++) {
      const shotsH = overdispersedPoissonSample(meanShotsHome, alphaShotsHome);
      const shotsA = overdispersedPoissonSample(meanShotsAway, alphaShotsAway);

      const sotH = binomialSample(shotsH, pSotHome);
      const sotA = binomialSample(shotsA, pSotAway);

      const goalsH = binomialSample(sotH, pGoalHome);
      const goalsA = binomialSample(sotA, pGoalAway);

      const cornersT = overdispersedPoissonSample(meanCornersTotal, alphaCorners);
      const cardsT = overdispersedPoissonSample(meanCardsTotal, alphaCards);

      const shotsT = shotsH + shotsA;
      const sotT = sotH + sotA;
      const goalsT = goalsH + goalsA;

      simShotsTotal.push(shotsT);
      simSoTTotal.push(sotT);
      simGoalsHome.push(goalsH);
      simGoalsAway.push(goalsA);
      simGoalsTotal.push(goalsT);
      simCornersTotal.push(cornersT);
      simCardsTotal.push(cardsT);

      sumGH += goalsH;
      sumGA += goalsA;
      sumShotsT += shotsT;
      sumSoTT += sotT;
      sumCT += cornersT;
      sumCardsT += cardsT;
    }

    const lambdaHome = sumGH / sims;
    const lambdaAway = sumGA / sims;

    // -------------------------
    // Dixon–Coles (score/1X2) with lambdas from chain
    // -------------------------
    const expectedGoalsTotal = lambdaHome + lambdaAway;
    let rho = -0.08;
    if (expectedGoalsTotal <= 2.0) rho = -0.12;
    else if (expectedGoalsTotal >= 3.2) rho = -0.05;
    rho = clamp(rho, -0.2, 0.05);

    const dcScores = dcScoreMatrix(lambdaHome, lambdaAway, rho, 7);
    const oneXtwo = oneXtwoFromScores(dcScores);
    const top = topScores(dcScores, 10);

    function goalsTotalProbOverFromDC(line: number) {
      const k = Math.floor(line + 0.5);
      let pUnder = 0;
      for (const s of dcScores) {
        if (s.home + s.away <= k - 1) pUnder += s.p;
      }
      return 1 - pUnder;
    }

    const goalsLines = [0.5, 1.5, 2.5, 3.5, 4.5].map((line) => {
      const pOver = clamp(goalsTotalProbOverFromDC(line), 0, 1);
      const pUnder = 1 - pOver;
      return {
        line,
        over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
        under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
      };
    });

    const shotsLines = [15.5, 17.5, 19.5, 21.5, 23.5, 25.5].map((l) => lineProbFromSamples(simShotsTotal, l));
    const sotLines = [5.5, 6.5, 7.5, 8.5, 9.5].map((l) => lineProbFromSamples(simSoTTotal, l));
    const cornersLines = [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5].map((l) => lineProbFromSamples(simCornersTotal, l));
    const cardsLines = [2.5, 3.5, 4.5, 5.5, 6.5].map((l) => lineProbFromSamples(simCardsTotal, l));

    const markets = {
      goals: {
        model: "Chain (Shots->SoT->Goals) for λ + Dixon–Coles for score/1X2",
        lambdaHome: Math.round(lambdaHome * 100) / 100,
        lambdaAway: Math.round(lambdaAway * 100) / 100,
        rho: Math.round(rho * 1000) / 1000,
        lines: goalsLines,
      },
      corners: {
        model: "Poisson-Lognormal (NB-like overdispersion) + Monte Carlo lines",
        mean: Math.round((sumCT / sims) * 100) / 100,
        alpha: Math.round(alphaCorners * 1000) / 1000,
        lines: cornersLines,
      },
      cards: {
        model: "Poisson-Lognormal (NB-like overdispersion) + Monte Carlo lines",
        mean: Math.round((sumCardsT / sims) * 100) / 100,
        alpha: Math.round(alphaCards * 1000) / 1000,
        lines: cardsLines,
      },
      shots: {
        model: "Overdispersed Poisson per team + Monte Carlo totals",
        meanTotal: Math.round((sumShotsT / sims) * 100) / 100,
        lines: shotsLines,
      },
      shotsOnTarget: {
        model: "Binomial(SoT|Shots) per team + Monte Carlo totals",
        meanTotal: Math.round((sumSoTT / sims) * 100) / 100,
        lines: sotLines,
      },
    };

    const quiniela = {
      model: "Dixon–Coles 1X2 + exact scores (λ from chain model)",
      "1": { p: toPct(oneXtwo.pH), fairOdd: fairOddFromProb(oneXtwo.pH) },
      "X": { p: toPct(oneXtwo.pD), fairOdd: fairOddFromProb(oneXtwo.pD) },
      "2": { p: toPct(oneXtwo.pA), fairOdd: fairOddFromProb(oneXtwo.pA) },
      topScores: top,
    };

    return NextResponse.json({
      fixture: {
        id: fixture?.fixture?.id,
        date: kickoffIso,
        status: statusShort,
        league: { id: league?.id, name: league?.name, country: league?.country, season: league?.season, round: league?.round },
        venue: { id: venue?.id, name: venue?.name, city: venue?.city },
        teams: { home: { id: home?.id, name: home?.name }, away: { id: away?.id, name: away?.name } },
      },
      inputs: { lastN, sims },
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
        dispersion: {
          alphaCorners: Math.round(alphaCorners * 1000) / 1000,
          alphaCards: Math.round(alphaCards * 1000) / 1000,
          note: "Alpha calibrada con Var ≈ mean + alpha*mean^2. Implementación Poisson-Lognormal equivalente práctica.",
        },
        baseAgg: { homeAgg, awayAgg },
      },
      quiniela,
      markets,
      glossary: {
        p: "probabilidad (%)",
        fairOdd: "cuota justa (odd mínima) = 1 / prob",
        alpha: "overdispersion (Var ≈ mean + alpha*mean^2)",
        rho: "corrección Dixon–Coles (correlación en marcadores bajos)",
        sims: "número de simulaciones Monte Carlo",
      },
      disclaimer: "Modelo probabilístico orientativo: no garantiza resultados. Úsalo para análisis y control de riesgo, no como certeza.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "predict/match failed", message: e?.message || String(e) }, { status: 500 });
  }
}
