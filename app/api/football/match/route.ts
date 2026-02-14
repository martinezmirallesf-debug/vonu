// app/api/football/match/route.ts
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

function pickStat(statsArr: any[], type: string) {
  // API-Football devuelve [{type, value}, ...]
  const it = (statsArr || []).find((x) => (x?.type || "").toLowerCase() === type.toLowerCase());
  return it?.value ?? null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fixture = url.searchParams.get("fixture");
    if (!fixture) {
      return NextResponse.json({ error: "Debes pasar ?fixture=1391049" }, { status: 400 });
    }

    // 1) Detalle fixture (equipos, estadio, etc.)
    const fx = await apiFootballFetch(`/fixtures?id=${encodeURIComponent(fixture)}`);
    if (!fx.ok) {
      return NextResponse.json(
        { error: "API-Football fixtures error", details: { status: fx.status, body: fx.json ?? fx.raw } },
        { status: 500 }
      );
    }

    const fixtureObj = (fx.json?.response ?? [])[0] ?? null;

    // 2) Estadísticas del partido (si existen)
    const st = await apiFootballFetch(`/fixtures/statistics?fixture=${encodeURIComponent(fixture)}`);
    const statsResp = st.ok ? (st.json?.response ?? []) : [];

    // 3) Alineaciones probables/confirmadas (si existen)
    const ln = await apiFootballFetch(`/fixtures/lineups?fixture=${encodeURIComponent(fixture)}`);
    const lineupsResp = ln.ok ? (ln.json?.response ?? []) : [];

    // 4) Lesiones (por fixture). Ojo: a veces no devuelve para muy futuro
    const inj = await apiFootballFetch(`/injuries?fixture=${encodeURIComponent(fixture)}`);
    const injuriesResp = inj.ok ? (inj.json?.response ?? []) : [];

    // Compactamos estadísticas por equipo (home/away)
    const statsByTeam: Record<string, any> = {};
    for (const teamBlock of statsResp) {
      const teamId = String(teamBlock?.team?.id ?? "");
      const arr = teamBlock?.statistics ?? [];
      statsByTeam[teamId] = {
        shotsOnGoal: pickStat(arr, "Shots on Goal"),
        shotsOffGoal: pickStat(arr, "Shots off Goal"),
        totalShots: pickStat(arr, "Total Shots"),
        blockedShots: pickStat(arr, "Blocked Shots"),
        shotsInsideBox: pickStat(arr, "Shots insidebox"),
        shotsOutsideBox: pickStat(arr, "Shots outsidebox"),
        fouls: pickStat(arr, "Fouls"),
        cornerKicks: pickStat(arr, "Corner Kicks"),
        offsides: pickStat(arr, "Offsides"),
        yellowCards: pickStat(arr, "Yellow Cards"),
        redCards: pickStat(arr, "Red Cards"),
        goalkeeperSaves: pickStat(arr, "Goalkeeper Saves"),
        totalPasses: pickStat(arr, "Total passes"),
        passesAccurate: pickStat(arr, "Passes accurate"),
        passesPct: pickStat(arr, "Passes %"),
        possession: pickStat(arr, "Ball Possession"),
      };
    }

    // Lesiones limpias
    const injuriesClean = (injuriesResp || []).map((x: any) => ({
      team: { id: x?.team?.id ?? null, name: x?.team?.name ?? null },
      player: { id: x?.player?.id ?? null, name: x?.player?.name ?? null },
      reason: x?.player?.reason ?? null,
      type: x?.player?.type ?? null,
    }));

    // Lineups limpias (si hay)
    const lineupsClean = (lineupsResp || []).map((x: any) => ({
      team: { id: x?.team?.id ?? null, name: x?.team?.name ?? null },
      formation: x?.formation ?? null,
      startXI: (x?.startXI ?? []).map((p: any) => p?.player?.name).filter(Boolean),
      substitutes: (x?.substitutes ?? []).map((p: any) => p?.player?.name).filter(Boolean),
      coach: x?.coach?.name ?? null,
    }));

    // Fixture compacto
    const cleaned = fixtureObj
      ? {
          fixtureId: fixtureObj?.fixture?.id ?? null,
          date: fixtureObj?.fixture?.date ?? null,
          timestamp: fixtureObj?.fixture?.timestamp ?? null,
          status: fixtureObj?.fixture?.status?.short ?? null,
          league: {
            id: fixtureObj?.league?.id ?? null,
            name: fixtureObj?.league?.name ?? null,
            country: fixtureObj?.league?.country ?? null,
            season: fixtureObj?.league?.season ?? null,
            round: fixtureObj?.league?.round ?? null,
          },
          venue: {
            id: fixtureObj?.fixture?.venue?.id ?? null,
            name: fixtureObj?.fixture?.venue?.name ?? null,
            city: fixtureObj?.fixture?.venue?.city ?? null,
          },
          teams: {
            home: {
              id: fixtureObj?.teams?.home?.id ?? null,
              name: fixtureObj?.teams?.home?.name ?? null,
            },
            away: {
              id: fixtureObj?.teams?.away?.id ?? null,
              name: fixtureObj?.teams?.away?.name ?? null,
            },
          },
        }
      : null;

    return NextResponse.json({
      fixture: cleaned,
      statsByTeam,
      lineups: lineupsClean,
      injuries: injuriesClean,
      notes: {
        statsAvailable: statsResp.length > 0,
        lineupsAvailable: lineupsResp.length > 0,
        injuriesAvailable: injuriesResp.length > 0,
        tip:
          "Si el partido es futuro, stats/lineups pueden venir vacíos. Para modelar pre-partido usaremos histórico (team stats) + bajas + contexto.",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
