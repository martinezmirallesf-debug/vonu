// app/api/football/team-context/route.ts
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

  if (!res.ok) {
    return { ok: false, status: res.status, statusText: res.statusText, json, raw };
  }
  return { ok: true, status: res.status, json };
}

function pickStat(statsArr: any[], type: string) {
  const it = (statsArr || []).find((x) => (x?.type || "").toLowerCase() === type.toLowerCase());
  return it?.value ?? null;
}

function toNumberOrNull(v: any): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof v === "object" && v !== null && "total" in v) {
    const n = Number((v as any).total);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asIntOrNull(v: any): number | null {
  const n = toNumberOrNull(v);
  return n === null ? null : Math.round(n);
}

function safeAvg(nums: (number | null)[]) {
  const x = nums.filter((n): n is number => typeof n === "number" && Number.isFinite(n));
  if (!x.length) return null;
  return x.reduce((a, b) => a + b, 0) / x.length;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const team = url.searchParams.get("team");
    const league = url.searchParams.get("league");
    const season = url.searchParams.get("season");
    const last = url.searchParams.get("last") || "10";

    if (!team || !league || !season) {
      return NextResponse.json(
        { error: "Missing query params. Required: team, league, season. Optional: last" },
        { status: 400 }
      );
    }

    const lastN = Math.max(1, Math.min(20, Number(last) || 10));

    // 1) Últimos partidos del equipo (API-Sports)
    const fx = await apiFootballFetch(
      `/fixtures?team=${encodeURIComponent(team)}&league=${encodeURIComponent(
        league
      )}&season=${encodeURIComponent(season)}&last=${encodeURIComponent(String(lastN))}`
    );

    if (!fx.ok) {
      return NextResponse.json(
        { error: "API-Football fixtures error", details: fx },
        { status: 502 }
      );
    }

    const fixtures = (fx.json?.response || []) as any[];

    // 2) Para cada fixture, pedimos estadísticas del partido
    const perMatch = await Promise.all(
      fixtures.map(async (f) => {
        const fixtureId = f?.fixture?.id;
        const date = f?.fixture?.date;
        const status = f?.fixture?.status?.short;
        const homeId = f?.teams?.home?.id;
        const awayId = f?.teams?.away?.id;

        const isHome = String(homeId) === String(team);
        const opponent = isHome ? f?.teams?.away : f?.teams?.home;

        const goalsFor = asIntOrNull(isHome ? f?.goals?.home : f?.goals?.away);
        const goalsAgainst = asIntOrNull(isHome ? f?.goals?.away : f?.goals?.home);

        // Stats endpoint
        let shotsFor: number | null = null;
        let shotsAgainst: number | null = null;
        let shotsOnTargetFor: number | null = null;
        let shotsOnTargetAgainst: number | null = null;
        let cornersFor: number | null = null;
        let cornersAgainst: number | null = null;
        let yellowsFor: number | null = null;
        let yellowsAgainst: number | null = null;
        let redsFor: number | null = null;
        let redsAgainst: number | null = null;

        if (fixtureId) {
          const st = await apiFootballFetch(`/fixtures/statistics?fixture=${encodeURIComponent(String(fixtureId))}`);
          if (st.ok) {
            const statsResp = (st.json?.response || []) as any[];

            const teamBlock = statsResp.find((x) => String(x?.team?.id) === String(team));
            const oppBlock = statsResp.find((x) => String(x?.team?.id) === String(opponent?.id));

            const teamStats = teamBlock?.statistics || [];
            const oppStats = oppBlock?.statistics || [];

            // Nombres típicos de API-Sports (ojo: pueden variar por deporte/endpoint)
            shotsFor = asIntOrNull(pickStat(teamStats, "Total Shots"));
            shotsAgainst = asIntOrNull(pickStat(oppStats, "Total Shots"));

            shotsOnTargetFor = asIntOrNull(pickStat(teamStats, "Shots on Goal"));
            shotsOnTargetAgainst = asIntOrNull(pickStat(oppStats, "Shots on Goal"));

            cornersFor = asIntOrNull(pickStat(teamStats, "Corner Kicks"));
            cornersAgainst = asIntOrNull(pickStat(oppStats, "Corner Kicks"));

            yellowsFor = asIntOrNull(pickStat(teamStats, "Yellow Cards"));
            yellowsAgainst = asIntOrNull(pickStat(oppStats, "Yellow Cards"));

            redsFor = asIntOrNull(pickStat(teamStats, "Red Cards"));
            redsAgainst = asIntOrNull(pickStat(oppStats, "Red Cards"));
          }
        }

        return {
          fixtureId,
          date,
          status,
          isHome,
          opponent: { id: opponent?.id ?? null, name: opponent?.name ?? null },
          goalsFor,
          goalsAgainst,
          shotsFor,
          shotsAgainst,
          shotsOnTargetFor,
          shotsOnTargetAgainst,
          cornersFor,
          cornersAgainst,
          yellowsFor,
          yellowsAgainst,
          redsFor,
          redsAgainst,
        };
      })
    );

    const agg = {
      n: perMatch.length,
      goalsForAvg: safeAvg(perMatch.map((x) => x.goalsFor)),
      goalsAgainstAvg: safeAvg(perMatch.map((x) => x.goalsAgainst)),
      shotsForAvg: safeAvg(perMatch.map((x) => x.shotsFor)),
      shotsAgainstAvg: safeAvg(perMatch.map((x) => x.shotsAgainst)),
      shotsOnTargetForAvg: safeAvg(perMatch.map((x) => x.shotsOnTargetFor)),
      shotsOnTargetAgainstAvg: safeAvg(perMatch.map((x) => x.shotsOnTargetAgainst)),
      cornersForAvg: safeAvg(perMatch.map((x) => x.cornersFor)),
      cornersAgainstAvg: safeAvg(perMatch.map((x) => x.cornersAgainst)),
      yellowsForAvg: safeAvg(perMatch.map((x) => x.yellowsFor)),
      yellowsAgainstAvg: safeAvg(perMatch.map((x) => x.yellowsAgainst)),
      redsForAvg: safeAvg(perMatch.map((x) => x.redsFor)),
      redsAgainstAvg: safeAvg(perMatch.map((x) => x.redsAgainst)),
    };

    return NextResponse.json({
      team: Number(team),
      league: Number(league),
      season: Number(season),
      lastRequested: lastN,
      fixturesCount: perMatch.length,
      perMatch,
      agg,
      notes: {
        why: "Esto sirve para pre-partido: promedios recientes y concedidos por mercado.",
        next: "Con esto ya podemos generar líneas over/under con % y odd mínima (cuota justa).",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "team-context route failed", message: e?.message || String(e) },
      { status: 500 }
    );
  }
}
