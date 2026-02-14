// app/api/football/fixtures/route.ts
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
    return { ok: false, status: res.status, statusText: res.statusText, json, raw: text };
  }

  return { ok: true, status: res.status, json };
}

// GET /api/football/fixtures?date=YYYY-MM-DD&league=140&season=2024
// Opcionales:
// - team=541
// - next=10  (si quieres próximos N partidos)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const date = url.searchParams.get("date"); // YYYY-MM-DD
    const league = url.searchParams.get("league"); // ejemplo LaLiga 140
    const season = url.searchParams.get("season"); // ejemplo 2024
    const team = url.searchParams.get("team");
    const next = url.searchParams.get("next");

    if (!date && !next) {
      return NextResponse.json(
        { error: "Debes pasar ?date=YYYY-MM-DD o ?next=10 (y opcionalmente league/season/team)" },
        { status: 400 }
      );
    }

    // Construimos query API-Football
    const q = new URLSearchParams();
    if (date) q.set("date", date);
    if (league) q.set("league", league);
    if (season) q.set("season", season);
    if (team) q.set("team", team);
    if (!date && next) q.set("next", next);

    const r = await apiFootballFetch(`/fixtures?${q.toString()}`);

    if (!r.ok) {
      return NextResponse.json(
        {
          error: "API-Football error",
          details: { status: r.status, statusText: r.statusText, body: r.json ?? r.raw },
        },
        { status: 500 }
      );
    }

    // Devolvemos un payload “limpio” para Vonu
    const response = r.json?.response ?? [];
    const cleaned = response.map((fx: any) => ({
      fixtureId: fx?.fixture?.id ?? null,
      date: fx?.fixture?.date ?? null,
      timestamp: fx?.fixture?.timestamp ?? null,
      status: fx?.fixture?.status?.short ?? null,
      league: {
        id: fx?.league?.id ?? null,
        name: fx?.league?.name ?? null,
        country: fx?.league?.country ?? null,
        season: fx?.league?.season ?? null,
        round: fx?.league?.round ?? null,
      },
      venue: {
        id: fx?.fixture?.venue?.id ?? null,
        name: fx?.fixture?.venue?.name ?? null,
        city: fx?.fixture?.venue?.city ?? null,
      },
      teams: {
        home: { id: fx?.teams?.home?.id ?? null, name: fx?.teams?.home?.name ?? null },
        away: { id: fx?.teams?.away?.id ?? null, name: fx?.teams?.away?.name ?? null },
      },
      goals: {
        home: fx?.goals?.home ?? null,
        away: fx?.goals?.away ?? null,
      },
    }));

    return NextResponse.json({
      count: cleaned.length,
      fixtures: cleaned,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
