// app/api/football/fixture/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = "https://v3.football.api-sports.io";

function getApiKey() {
  // Soportamos varios nombres por si lo tienes distinto
  const key =
    process.env.API_FOOTBALL_KEY ||
    process.env.APISPORTS_KEY ||
    process.env.API_SPORTS_KEY ||
    process.env.API_FOOTBALL_API_KEY;

  if (!key) {
    throw new Error(
      "Falta la API key. Añade en .env.local una de estas variables: API_FOOTBALL_KEY (recomendado) / APISPORTS_KEY / API_SPORTS_KEY / API_FOOTBALL_API_KEY"
    );
  }
  return key;
}

async function apiFootball(path: string) {
  const key = getApiKey();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "x-apisports-key": key,
    },
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(`API-Football error ${res.status}: ${text}`);
  }

  return json;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fixtureId = url.searchParams.get("fixture");
    if (!fixtureId) {
      return NextResponse.json({ error: "Debes pasar ?fixture=1391049" }, { status: 400 });
    }

    // 1) Fixture base
    const fixtureRes = await apiFootball(`/fixtures?id=${encodeURIComponent(fixtureId)}`);
    const fx = fixtureRes?.response?.[0];

    if (!fx?.fixture?.id) {
      return NextResponse.json({ error: "No se encontró el fixture", raw: fixtureRes }, { status: 404 });
    }

    const fixture = {
      fixtureId: fx.fixture.id,
      date: fx.fixture.date,
      timestamp: fx.fixture.timestamp,
      status: fx.fixture.status?.short ?? fx.fixture.status,
      league: {
        id: fx.league?.id,
        name: fx.league?.name,
        country: fx.league?.country,
        season: fx.league?.season,
        round: fx.league?.round,
      },
      venue: {
        id: fx.fixture.venue?.id,
        name: fx.fixture.venue?.name,
        city: fx.fixture.venue?.city,
      },
      teams: {
        home: { id: fx.teams?.home?.id, name: fx.teams?.home?.name },
        away: { id: fx.teams?.away?.id, name: fx.teams?.away?.name },
      },
    };

    // 2) Injuries
    let injuries: any[] = [];
    try {
      const injRes = await apiFootball(`/injuries?fixture=${encodeURIComponent(fixtureId)}`);
      injuries = injRes?.response ?? [];
    } catch {
      injuries = [];
    }

    // 3) Lineups (si existen)
    let lineups: any[] = [];
    try {
      const luRes = await apiFootball(`/fixtures/lineups?fixture=${encodeURIComponent(fixtureId)}`);
      lineups = luRes?.response ?? [];
    } catch {
      lineups = [];
    }

    // 4) Stats (si existen)
    let statsByTeam: Record<string, any> = {};
    try {
      const stRes = await apiFootball(`/fixtures/statistics?fixture=${encodeURIComponent(fixtureId)}`);
      const arr = stRes?.response ?? [];
      // lo dejamos en formato "por equipo"
      for (const it of arr) {
        const teamId = it?.team?.id;
        if (!teamId) continue;
        statsByTeam[String(teamId)] = it?.statistics ?? it;
      }
    } catch {
      statsByTeam = {};
    }

    const statsAvailable = Object.keys(statsByTeam).length > 0;
    const lineupsAvailable = Array.isArray(lineups) && lineups.length > 0;
    const injuriesAvailable = Array.isArray(injuries) && injuries.length > 0;

    return NextResponse.json({
      fixture,
      statsByTeam,
      lineups,
      injuries,
      notes: {
        statsAvailable,
        lineupsAvailable,
        injuriesAvailable,
        tip: "Si el partido es futuro, stats/lineups pueden venir vacíos. Para modelar pre-partido usaremos histórico (team stats) + bajas + contexto.",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
