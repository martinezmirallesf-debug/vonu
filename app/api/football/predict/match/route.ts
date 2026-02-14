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

  const rainLevel = clamp(rain / 5, 0, 2); // 0..2
  const windLevel = clamp((wind - 15) / 20, 0, 2); // penalize >15 km/h

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

      // Conservative + capped
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
    cards *= 0.80;
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
function factorial(n: number) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k: number, lambda: number) {
  if (k < 0) return 0;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

// Dixon–Coles tau adjustment (classic)
function dcTau(x: number, y: number, lambda: number, mu: number, rho: number) {
  if (x === 0 && y === 0) return 1 - lambda * mu * rho;
  if (x === 0 && y === 1) return 1 + lambda * rho;
  if (x === 1 && y === 0) return 1 + mu * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

// score matrix with DC, normalized
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

  // normalize to 1 (within grid)
  if (total > 0) {
    for (const s of mat) s.p = s.p / total;
  }

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

function topScores(scores: { home: number; away: number; p: number }[], topN = 8) {
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
// Parameterization: mean = m, alpha = overdispersion (Var = m + alpha*m^2)
// r = 1/alpha, p = r/(r+m)
// -------------------------

// log-gamma (Lanczos approximation)
function logGamma(z: number) {
  const p = [
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
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = 0.9999999999998099;
  for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
  const t = z + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function nbPmf(k: number, meanM: number, alpha: number) {
  if (k < 0) return 0;
  const a = clamp(alpha, 1e-6, 10);
  const r = 1 / a; // shape
  const p = r / (r + meanM); // success prob in NB(r,p)
  // pmf = C(k+r-1, k) * (1-p)^k * p^r
  // use logs for stability
  const logCoef = logGamma(k + r) - logGamma(r) - logGamma(k + 1);
  const logP = logCoef + k * Math.log(1 - p) + r * Math.log(p);
  return Math.exp(logP);
}

function nbCdf(k: number, meanM: number, alpha: number) {
  // sum pmf up to k
  let s = 0;
  for (let i = 0; i <= k; i++) s += nbPmf(i, meanM, alpha);
  return clamp(s, 0, 1);
}

function buildLinesNB(meanM: number, alpha: number, lines: number[]) {
  return lines.map((line) => {
    const k = Math.floor(line + 0.5); // 2.5->3
    const pUnder = nbCdf(k - 1, meanM, alpha);
    const pOver = 1 - pUnder;
    return {
      line,
      over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
      under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
    };
  });
}

function estimateAlphaFromTotals(totals: number[]) {
  // alpha = (var - mean) / mean^2
  const m = mean(totals);
  if (m <= 0 || totals.length < 5) return 0.15; // sane default
  const v = variance(totals);
  const a = (v - m) / (m * m);
  // clamp to stable range
  return clamp(isFinite(a) ? a : 0.15, 0.03, 0.8);
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
// Route
// -------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fixtureId = searchParams.get("fixture");
    const lastN = parseInt(searchParams.get("last") || "10", 10);

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

    // 2) Injuries
    const injRes = await apiFootballFetch(`/injuries?fixture=${fixtureId}`);
    const injuries = injRes.ok ? injRes.json?.response || [] : [];

    // 3) Call your team-context endpoints
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

    // 4) Build home/away splits for goals (for DC)
    const homeMatches = (homeCtx?.perMatch || []).filter((m: any) => m.status === "FT");
    const awayMatches = (awayCtx?.perMatch || []).filter((m: any) => m.status === "FT");

    const homeAtHome = homeMatches.filter((m: any) => m.isHome === true);
    const awayAtAway = awayMatches.filter((m: any) => m.isHome === false);

    const homeGoalsForHome = homeAtHome.length ? mean(homeAtHome.map((m: any) => m.goalsFor ?? 0)) : homeAgg.goalsForAvg;
    const homeGoalsAgainstHome = homeAtHome.length ? mean(homeAtHome.map((m: any) => m.goalsAgainst ?? 0)) : homeAgg.goalsAgainstAvg;

    const awayGoalsForAway = awayAtAway.length ? mean(awayAtAway.map((m: any) => m.goalsFor ?? 0)) : awayAgg.goalsForAvg;
    const awayGoalsAgainstAway = awayAtAway.length ? mean(awayAtAway.map((m: any) => m.goalsAgainst ?? 0)) : awayAgg.goalsAgainstAvg;

    // Base lambdas per team
    let lambdaHomeGoals = (homeGoalsForHome + awayGoalsAgainstAway) / 2;
    let lambdaAwayGoals = (awayGoalsForAway + homeGoalsAgainstHome) / 2;

    // Base totals for other markets (mean)
    let meanCornersTotal =
      (homeAgg.cornersForAvg + awayAgg.cornersAgainstAvg + awayAgg.cornersForAvg + homeAgg.cornersAgainstAvg) / 2;

    let meanCardsTotal =
      (homeAgg.yellowsForAvg + awayAgg.yellowsAgainstAvg + awayAgg.yellowsForAvg + homeAgg.yellowsAgainstAvg) / 2;

    let meanShotsTotal =
      (homeAgg.shotsForAvg + awayAgg.shotsAgainstAvg + awayAgg.shotsForAvg + homeAgg.shotsAgainstAvg) / 2;

    let meanSoTTotal =
      (homeAgg.shotsOnTargetForAvg +
        awayAgg.shotsOnTargetAgainstAvg +
        awayAgg.shotsOnTargetForAvg +
        homeAgg.shotsOnTargetAgainstAvg) /
      2;

    // 5) Estimate dispersion alpha from empirical match totals (from perMatch)
    // We use totals per match from each team's recent games as proxies; then average both.
    const cornersTotals = [
      ...homeMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.cornersFor ?? 0) + (m.cornersAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const cardsTotals = [
      ...homeMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.yellowsFor ?? 0) + (m.yellowsAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const shotsTotals = [
      ...homeMatches.map((m: any) => (m.shotsFor ?? 0) + (m.shotsAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.shotsFor ?? 0) + (m.shotsAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const sotTotals = [
      ...homeMatches.map((m: any) => (m.shotsOnTargetFor ?? 0) + (m.shotsOnTargetAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.shotsOnTargetFor ?? 0) + (m.shotsOnTargetAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const alphaCorners = estimateAlphaFromTotals(cornersTotals);
    const alphaCards = estimateAlphaFromTotals(cardsTotals);
    const alphaShots = estimateAlphaFromTotals(shotsTotals);
    const alphaSoT = estimateAlphaFromTotals(sotTotals);

    // 6) Context multipliers
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

    // Apply context to goals (team-level)
    lambdaHomeGoals =
      lambdaHomeGoals *
      injBuilt.mult.homeAttack *
      injBuilt.mult.awayConcede *
      comp.goals *
      wMult.goals;

    lambdaAwayGoals =
      lambdaAwayGoals *
      injBuilt.mult.awayAttack *
      injBuilt.mult.homeConcede *
      comp.goals *
      wMult.goals;

    // Apply context to totals markets (mean)
    meanCornersTotal = meanCornersTotal * comp.corners * wMult.corners;
    meanCardsTotal = meanCardsTotal * comp.cards * wMult.cards;
    meanShotsTotal = meanShotsTotal * comp.shots * wMult.shots;
    meanSoTTotal = meanSoTTotal * comp.shotsOnTarget * wMult.shotsOnTarget;

    // Safety clamps
    lambdaHomeGoals = clamp(lambdaHomeGoals, 0.2, 4.5);
    lambdaAwayGoals = clamp(lambdaAwayGoals, 0.2, 4.5);

    meanCornersTotal = clamp(meanCornersTotal, 4, 15);
    meanCardsTotal = clamp(meanCardsTotal, 1.5, 8.5);
    meanShotsTotal = clamp(meanShotsTotal, 12, 40);
    meanSoTTotal = clamp(meanSoTTotal, 3, 16);

    // 7) Dixon–Coles rho estimation (lightweight + stable)
    // Typical rho is slightly negative (inflates 0-0 / 1-0 / 0-1 / 1-1 patterns).
    // We adjust rho by "low scoring tendency" using recent totals.
    const recentGoalsTotals = [
      ...homeMatches.map((m: any) => (m.goalsFor ?? 0) + (m.goalsAgainst ?? 0)),
      ...awayMatches.map((m: any) => (m.goalsFor ?? 0) + (m.goalsAgainst ?? 0)),
    ].filter((x: any) => typeof x === "number" && isFinite(x));

    const recentGoalsMean = mean(recentGoalsTotals);
    // More low-scoring => more negative rho (within safe range)
    let rho = -0.08;
    if (recentGoalsMean <= 2.0) rho = -0.12;
    else if (recentGoalsMean >= 3.2) rho = -0.05;
    rho = clamp(rho, -0.2, 0.05);

    const dcScores = dcScoreMatrix(lambdaHomeGoals, lambdaAwayGoals, rho, 7);
    const oneXtwo = oneXtwoFromScores(dcScores);
    const top = topScores(dcScores, 10);

    // Totals goals from DC matrix (for O/U goals with correlation respected)
    // We compute P(total <= t) by summing score probs
    function goalsTotalProbOver(line: number) {
      const k = Math.floor(line + 0.5); // 2.5 -> 3
      let pUnder = 0; // P(total <= k-1)
      for (const s of dcScores) {
        if (s.home + s.away <= k - 1) pUnder += s.p;
      }
      return 1 - pUnder;
    }
    function goalsTotalProbUnder(line: number) {
      return 1 - goalsTotalProbOver(line);
    }

    const goalsLines = [0.5, 1.5, 2.5, 3.5, 4.5].map((line) => {
      const pOver = clamp(goalsTotalProbOver(line), 0, 1);
      const pUnder = clamp(goalsTotalProbUnder(line), 0, 1);
      return {
        line,
        over: { p: toPct(pOver), fairOdd: fairOddFromProb(pOver) },
        under: { p: toPct(pUnder), fairOdd: fairOddFromProb(pUnder) },
      };
    });

    // 8) Markets
    const markets = {
      goals: {
        model: "Dixon–Coles (bivariate Poisson adjusted)",
        lambdaHome: Math.round(lambdaHomeGoals * 100) / 100,
        lambdaAway: Math.round(lambdaAwayGoals * 100) / 100,
        rho: Math.round(rho * 1000) / 1000,
        lines: goalsLines,
      },
      corners: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanCornersTotal * 100) / 100,
        alpha: Math.round(alphaCorners * 1000) / 1000,
        lines: buildLinesNB(meanCornersTotal, alphaCorners, [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5]),
      },
      cards: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanCardsTotal * 100) / 100,
        alpha: Math.round(alphaCards * 1000) / 1000,
        lines: buildLinesNB(meanCardsTotal, alphaCards, [2.5, 3.5, 4.5, 5.5, 6.5]),
      },
      shots: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanShotsTotal * 100) / 100,
        alpha: Math.round(alphaShots * 1000) / 1000,
        lines: buildLinesNB(meanShotsTotal, alphaShots, [15.5, 17.5, 19.5, 21.5, 23.5, 25.5]),
      },
      shotsOnTarget: {
        model: "Negative Binomial (overdispersion)",
        mean: Math.round(meanSoTTotal * 100) / 100,
        alpha: Math.round(alphaSoT * 1000) / 1000,
        lines: buildLinesNB(meanSoTTotal, alphaSoT, [5.5, 6.5, 7.5, 8.5, 9.5]),
      },
    };

    const quiniela = {
      model: "Dixon–Coles 1X2 + exact scores",
      "1": { p: toPct(oneXtwo.pH), fairOdd: fairOddFromProb(oneXtwo.pH) },
      "X": { p: toPct(oneXtwo.pD), fairOdd: fairOddFromProb(oneXtwo.pD) },
      "2": { p: toPct(oneXtwo.pA), fairOdd: fairOddFromProb(oneXtwo.pA) },
      topScores: top,
    };

    return NextResponse.json({
      fixture: {
        id: fixture?.fixture?.id,
        date: kickoffIso,
        status: fixture?.fixture?.status?.short,
        league: { id: league?.id, name: league?.name, country: league?.country, season: league?.season, round: league?.round },
        venue: { id: venue?.id, name: venue?.name, city: venue?.city },
        teams: { home: { id: home?.id, name: home?.name }, away: { id: away?.id, name: away?.name } },
      },
      inputs: { lastN },
      context: {
        injuriesCount: injBuilt.counts,
        injuryMultipliers: injBuilt.mult,
        competition: { name: league?.name || null, multipliers: comp },
        weather: weather
          ? { ...weather, geo: weatherGeo, multipliers: wMult, note: wMult.note }
          : { geo: weatherGeo || null, multipliers: wMult, note: wMult.note },
        dispersion: {
          cornersAlpha: Math.round(alphaCorners * 1000) / 1000,
          cardsAlpha: Math.round(alphaCards * 1000) / 1000,
          shotsAlpha: Math.round(alphaShots * 1000) / 1000,
          sotAlpha: Math.round(alphaSoT * 1000) / 1000,
          note: "Alpha controla sobre-dispersión (varianza > media). Estimado de históricos recientes.",
        },
        baseAgg: { homeAgg, awayAgg },
      },
      quiniela,
      markets,
      glossary: {
        p: "probabilidad (%)",
        fairOdd: "cuota justa (odd mínima) = 1 / prob",
        mean: "media esperada del conteo",
        alpha: "overdispersion (Var = mean + alpha*mean^2)",
        rho: "corrección Dixon–Coles (correlación en marcadores bajos)",
      },
      disclaimer:
        "Modelo probabilístico orientativo. No garantiza resultados. Úsalo para análisis y gestión de riesgo, no como certeza.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "predict/match failed", message: e?.message || String(e) }, { status: 500 });
  }
}
