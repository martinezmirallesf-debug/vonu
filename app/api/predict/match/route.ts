// app/api/predict/match/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// =====================
// Helpers: distributions
// =====================

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function poissonPMF(k: number, lambda: number) {
  // PMF(k) = e^-λ * λ^k / k!
  if (k < 0) return 0;
  if (lambda <= 0) return k === 0 ? 1 : 0;

  // estable: usamos log factorial simple
  let logFact = 0;
  for (let i = 2; i <= k; i++) logFact += Math.log(i);
  const logP = -lambda + k * Math.log(lambda) - logFact;
  return Math.exp(logP);
}

function poissonCDF(maxK: number, lambda: number) {
  let s = 0;
  for (let k = 0; k <= maxK; k++) s += poissonPMF(k, lambda);
  return clamp(s, 0, 1);
}

// Negative Binomial (NB2) con overdispersion: Var = mu + alpha*mu^2
// Parametrización: r, p con PMF(k) = C(k+r-1,k) * (1-p)^k * p^r
function nbParamsFromMuAlpha(mu: number, alpha: number) {
  // Var = mu + alpha*mu^2 = mu + mu^2/r  -> r = 1/alpha
  // pero si alpha muy pequeña, r grande.
  const a = Math.max(1e-6, alpha);
  const r = 1 / a;
  const p = r / (r + mu); // p = r/(r+mu)
  return { r, p };
}

function nbPMF(k: number, mu: number, alpha: number) {
  if (k < 0) return 0;
  if (mu <= 0) return k === 0 ? 1 : 0;

  const { r, p } = nbParamsFromMuAlpha(mu, alpha);

  // log comb: log Γ(k+r) - log Γ(r) - log Γ(k+1)
  // aproximación con sumas (suficiente para k<=80 y r razonable)
  const logGamma = (x: number) => {
    // Stirling simple (ok para x>1)
    if (x < 1) return 0;
    return (x - 0.5) * Math.log(x) - x + 0.5 * Math.log(2 * Math.PI);
  };

  const logC = logGamma(k + r) - logGamma(r) - logGamma(k + 1);
  const logP = logC + k * Math.log(1 - p) + r * Math.log(p);
  return Math.exp(logP);
}

function nbCDF(maxK: number, mu: number, alpha: number) {
  let s = 0;
  for (let k = 0; k <= maxK; k++) s += nbPMF(k, mu, alpha);
  return clamp(s, 0, 1);
}

function probOver(line: number, cdfFn: (k: number) => number) {
  // Over 8.5 -> P(X >= 9) = 1 - CDF(8)
  const k = Math.floor(line);
  return clamp(1 - cdfFn(k), 0, 1);
}
function probUnder(line: number, cdfFn: (k: number) => number) {
  // Under 8.5 -> P(X <= 8) = CDF(8)
  const k = Math.floor(line);
  return clamp(cdfFn(k), 0, 1);
}

function oddMin(prob: number) {
  if (!prob || prob <= 0) return null;
  return Number((1 / prob).toFixed(2));
}

function mkLine(line: number, overProb: number, underProb: number) {
  return {
    line,
    over: { prob: Number(overProb.toFixed(3)), oddMin: oddMin(overProb) },
    under: { prob: Number(underProb.toFixed(3)), oddMin: oddMin(underProb) },
  };
}

// =====================
// Fetch helpers (internal endpoints)
// =====================

async function fetchJSON(path: string) {
  const res = await fetch(path, { cache: "no-store" });
  const raw = await res.text().catch(() => "");
  let json: any = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} ${raw}`);
  return json;
}

// =====================
// Domain logic
// =====================

// Ajuste simple por bajas (pre-partido)
// - Missing Fixture: -3% a ataque y +3% a defensa concedida (peor)
// - Questionable: -1%
// cap ±15%
function injuryImpact(injuries: any[], teamId: number) {
  const list = (injuries || []).filter((x) => Number(x?.team?.id) === Number(teamId));
  let missing = 0;
  let doubtful = 0;

  for (const it of list) {
    const type = String(it?.type ?? "").toLowerCase();
    if (type.includes("missing")) missing++;
    if (type.includes("question")) doubtful++;
  }

  const attackDown = clamp(0.03 * missing + 0.01 * doubtful, 0, 0.15);
  const defenseDown = attackDown; // simétrico (simple)

  return { missing, doubtful, attackDown, defenseDown };
}

// Ajuste por clima (ritmo/pace)
// - lluvia moderada, viento alto -> baja ritmo
function weatherPaceFactor(weather: any | null) {
  if (!weather) return 1.0;

  const p = Number(weather?.precipitation ?? 0);
  const w = Number(weather?.windspeed ?? 0);
  const g = Number(weather?.windgusts ?? 0);
  const t = Number(weather?.temperature ?? 15);

  let factor = 1.0;

  // lluvia
  if (p >= 2) factor *= 0.95;
  if (p >= 6) factor *= 0.90;

  // viento
  if (w >= 25 || g >= 40) factor *= 0.95;

  // frío extremo o calor extremo (muy leve)
  if (t <= 3) factor *= 0.97;
  if (t >= 30) factor *= 0.97;

  return clamp(factor, 0.82, 1.05);
}

// Combina promedios “for/against” en un total esperado del partido.
// (versión sencilla pero coherente)
function expectedTotal(meanHomeFor: number | null, meanAwayAgainst: number | null, meanAwayFor: number | null, meanHomeAgainst: number | null) {
  const a = typeof meanHomeFor === "number" ? meanHomeFor : null;
  const b = typeof meanAwayAgainst === "number" ? meanAwayAgainst : null;
  const c = typeof meanAwayFor === "number" ? meanAwayFor : null;
  const d = typeof meanHomeAgainst === "number" ? meanHomeAgainst : null;

  // total esperado = media de (home produce + away concede) + (away produce + home concede)
  const left = (a !== null && b !== null) ? (a + b) / 2 : null;
  const right = (c !== null && d !== null) ? (c + d) / 2 : null;

  if (left === null && right === null) return null;
  if (left !== null && right !== null) return left + right;
  // si falta una mitad, usamos la que haya *2 (aprox)
  return (left ?? right ?? 0) * 2;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fixtureId = url.searchParams.get("fixture"); // 1391049
    if (!fixtureId) {
      return NextResponse.json({ error: "Debes pasar ?fixture=1391049" }, { status: 400 });
    }

    const origin = url.origin;

    // 1) Fixture + injuries (tu endpoint actual)
    //    IMPORTANTE: ajusta esta ruta si tu endpoint se llama distinto.
    const fixturePack = await fetchJSON(`${origin}/api/football/fixture?fixture=${encodeURIComponent(fixtureId)}`);

    const fixture = fixturePack?.fixture;
    if (!fixture?.teams?.home?.id || !fixture?.teams?.away?.id) {
      return NextResponse.json({ error: "Fixture inválido o incompleto", fixturePack }, { status: 500 });
    }

    const leagueId = fixture?.league?.id;
    const season = fixture?.league?.season;
    const homeId = Number(fixture?.teams?.home?.id);
    const awayId = Number(fixture?.teams?.away?.id);

    // 2) Contexto de equipos (últimos 10)
    const homeCtx = await fetchJSON(
      `${origin}/api/football/team-context?team=${homeId}&league=${leagueId}&season=${season}&last=10`
    );
    const awayCtx = await fetchJSON(
      `${origin}/api/football/team-context?team=${awayId}&league=${leagueId}&season=${season}&last=10`
    );

    const H = homeCtx?.agg ?? {};
    const A = awayCtx?.agg ?? {};

    // 3) Meteo (por ciudad del estadio)
    const city = fixture?.venue?.city ?? "";
    const dateISO = fixture?.date ?? "";
    let weather: any = null;
    try {
      const w = await fetchJSON(`${origin}/api/weather/match?city=${encodeURIComponent(city)}&dateISO=${encodeURIComponent(dateISO)}`);
      weather = w?.closestHour ?? null;
    } catch {
      weather = null;
    }

    const pace = weatherPaceFactor(weather);

    // 4) Ajuste por bajas
    const injuries = fixturePack?.injuries ?? [];
    const homeInj = injuryImpact(injuries, homeId);
    const awayInj = injuryImpact(injuries, awayId);

    // 5) Medias esperadas por mercado (total partido) con ajustes
    // GOLES
    let muGoalsTotal = expectedTotal(H.goalsForAvg, A.goalsAgainstAvg, A.goalsForAvg, H.goalsAgainstAvg);
    if (typeof muGoalsTotal === "number") {
      // bajas: bajan ataque
      muGoalsTotal *= (1 - homeInj.attackDown * 0.7) * (1 - awayInj.attackDown * 0.7);
      // clima: baja ritmo
      muGoalsTotal *= pace;
      muGoalsTotal = clamp(muGoalsTotal, 0.6, 5.5);
    }

    // CORNERS
    let muCornersTotal = expectedTotal(H.cornersForAvg, A.cornersAgainstAvg, A.cornersForAvg, H.cornersAgainstAvg);
    if (typeof muCornersTotal === "number") {
      muCornersTotal *= (1 - homeInj.attackDown * 0.4) * (1 - awayInj.attackDown * 0.4);
      muCornersTotal *= pace;
      muCornersTotal = clamp(muCornersTotal, 5, 14);
    }

    // TARJETAS (amarillas totales)
    let muYellowsTotal = expectedTotal(H.yellowsForAvg, A.yellowsAgainstAvg, A.yellowsForAvg, H.yellowsAgainstAvg);
    if (typeof muYellowsTotal === "number") {
      // clima influye poco a tarjetas (casi nada)
      muYellowsTotal *= clamp(0.98 + (1 - pace) * 0.25, 0.90, 1.05);
      muYellowsTotal = clamp(muYellowsTotal, 2.0, 8.5);
    }

    // TIROS TOTALES
    let muShotsTotal = expectedTotal(H.shotsForAvg, A.shotsAgainstAvg, A.shotsForAvg, H.shotsAgainstAvg);
    if (typeof muShotsTotal === "number") {
      muShotsTotal *= (1 - homeInj.attackDown * 0.6) * (1 - awayInj.attackDown * 0.6);
      muShotsTotal *= pace;
      muShotsTotal = clamp(muShotsTotal, 14, 35);
    }

    // TIROS A PUERTA
    let muSoTTotal = expectedTotal(H.shotsOnTargetForAvg, A.shotsOnTargetAgainstAvg, A.shotsOnTargetForAvg, H.shotsOnTargetAgainstAvg);
    if (typeof muSoTTotal === "number") {
      muSoTTotal *= (1 - homeInj.attackDown * 0.7) * (1 - awayInj.attackDown * 0.7);
      muSoTTotal *= pace;
      muSoTTotal = clamp(muSoTTotal, 4, 14);
    }

    // 6) Construir líneas
    // - Goles (Poisson)
    const goalsLines = [0.5, 1.5, 2.5, 3.5, 4.5].map((ln) => {
      const cdf = (k: number) => poissonCDF(k, muGoalsTotal ?? 2.4);
      const over = probOver(ln, cdf);
      const under = probUnder(ln, cdf);
      return mkLine(ln, over, under);
    });

    // - Corners (NB)
    const cornersAlpha = 0.22; // overdispersion típica
    const cornersLines = [6.5, 7.5, 8.5, 9.5, 10.5, 11.5].map((ln) => {
      const cdf = (k: number) => nbCDF(k, muCornersTotal ?? 9.2, cornersAlpha);
      const over = probOver(ln, cdf);
      const under = probUnder(ln, cdf);
      return mkLine(ln, over, under);
    });

    // - Tarjetas (NB)
    const cardsAlpha = 0.28;
    const cardsLines = [2.5, 3.5, 4.5, 5.5, 6.5].map((ln) => {
      const cdf = (k: number) => nbCDF(k, muYellowsTotal ?? 4.8, cardsAlpha);
      const over = probOver(ln, cdf);
      const under = probUnder(ln, cdf);
      return mkLine(ln, over, under);
    });

    // - Tiros totales (NB)
    const shotsAlpha = 0.18;
    const shotsLines = [18.5, 20.5, 22.5, 24.5, 26.5, 28.5].map((ln) => {
      const cdf = (k: number) => nbCDF(k, muShotsTotal ?? 24, shotsAlpha);
      const over = probOver(ln, cdf);
      const under = probUnder(ln, cdf);
      return mkLine(ln, over, under);
    });

    // - Tiros a puerta (NB)
    const sotAlpha = 0.20;
    const sotLines = [6.5, 7.5, 8.5, 9.5, 10.5].map((ln) => {
      const cdf = (k: number) => nbCDF(k, muSoTTotal ?? 8.4, sotAlpha);
      const over = probOver(ln, cdf);
      const under = probUnder(ln, cdf);
      return mkLine(ln, over, under);
    });

    // 7) Respuesta
    return NextResponse.json({
      fixture: {
        fixtureId: Number(fixtureId),
        date: fixture?.date,
        league: fixture?.league,
        venue: fixture?.venue,
        teams: fixture?.teams,
      },
      inputs: {
        homeAgg: H,
        awayAgg: A,
        injuries: {
          home: homeInj,
          away: awayInj,
          list: injuries,
        },
        weather,
        paceFactor: pace,
      },
      expected: {
        goalsTotal: muGoalsTotal,
        cornersTotal: muCornersTotal,
        yellowsTotal: muYellowsTotal,
        shotsTotal: muShotsTotal,
        shotsOnTargetTotal: muSoTTotal,
      },
      markets: {
        goals: goalsLines,
        corners: cornersLines,
        cards: cardsLines,
        shots: shotsLines,
        shotsOnTarget: sotLines,
      },
      notes: {
        cuotaJusta: "oddMin = 1/prob (sin margen). Si quieres margen book, lo añadimos después.",
        next: "Luego hacemos UI bonita + explicación narrativa del partido con bullets y confianza.",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
