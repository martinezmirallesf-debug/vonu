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

function cleanFixture(fx: any) {
  return {
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
  };
}

function parseVsQuery(q: string): { home: string; away: string } | null {
  const s = (q || "").trim();
  if (!s) return null;

  // soporta: "A vs B", "A v B", "A - B", "A contra B"
  const m = s.match(/(.+?)\s*(?:vs|v|contra|-)\s*(.+)/i);
  if (!m) return null;

  const home = (m[1] || "").trim();
  const away = (m[2] || "").trim();
  if (!home || !away) return null;

  return { home, away };
}

async function findTeamIdByName(name: string): Promise<number | null> {
  const query = encodeURIComponent(name.trim());
  const r = await apiFootballFetch(`/teams?search=${query}`);
  if (!r.ok) return null;

  const arr = r.json?.response ?? [];
  const first = arr?.[0];
  const id = first?.team?.id;
  return typeof id === "number" ? id : null;
}

function pickBestFixture(fixtures: any[]): any | null {
  if (!Array.isArray(fixtures) || fixtures.length === 0) return null;

  // Preferimos el más cercano que NO sea FT (si hay)
  const notFinished = fixtures.filter((f) => {
    const st = String(f?.fixture?.status?.short ?? "");
    return st && st !== "FT" && st !== "AET" && st !== "PEN";
  });

  const list = (notFinished.length ? notFinished : fixtures).slice();

  list.sort((a, b) => {
    const ta = Number(a?.fixture?.timestamp ?? 0);
    const tb = Number(b?.fixture?.timestamp ?? 0);
    return ta - tb;
  });

  return list[0] ?? null;
}

// GET /api/football/fixtures
// MODO A) clásico:
//   ?date=YYYY-MM-DD&league=140&season=2024
//   opcionales: team=541, next=10
//
// MODO B) búsqueda por nombres:
//   ?q=Real Madrid vs Real Sociedad&next=30&league=140&season=2024
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q"); // NUEVO: "A vs B"
    const date = url.searchParams.get("date");
    const league = url.searchParams.get("league");
    const season = url.searchParams.get("season");
    const team = url.searchParams.get("team");
    const next = url.searchParams.get("next");

    const nextN = next ? Math.max(5, Math.min(80, Number(next))) : 30;

    // ---------- MODO B: q=... ----------
    if (q) {
      const parsed = parseVsQuery(q);
      if (!parsed) {
        return NextResponse.json(
          { error: 'Formato inválido en q. Usa "Equipo A vs Equipo B".' },
          { status: 400 }
        );
      }

      const homeId = await findTeamIdByName(parsed.home);
      const awayId = await findTeamIdByName(parsed.away);

      if (!homeId || !awayId) {
        return NextResponse.json(
          {
            error: "No pude resolver uno de los equipos por nombre.",
            details: { home: parsed.home, away: parsed.away, homeId, awayId },
          },
          { status: 404 }
        );
      }

      // Pedimos próximos partidos del HOME y filtramos por AWAY
      const qFx = new URLSearchParams();
      qFx.set("team", String(homeId));
      qFx.set("next", String(nextN));
      if (league) qFx.set("league", league);
      if (season) qFx.set("season", season);

      const r = await apiFootballFetch(`/fixtures?${qFx.toString()}`);
      if (!r.ok) {
        return NextResponse.json(
          {
            error: "API-Football error",
            details: { status: r.status, statusText: r.statusText, body: r.json ?? r.raw },
          },
          { status: 500 }
        );
      }

      const response = r.json?.response ?? [];

      const filtered = response.filter((fx: any) => {
        const h = fx?.teams?.home?.id;
        const a = fx?.teams?.away?.id;
        return (h === homeId && a === awayId) || (h === awayId && a === homeId);
      });

      const best = pickBestFixture(filtered);

      const cleaned = filtered.map(cleanFixture);

      return NextResponse.json({
        mode: "search",
        query: parsed,
        resolved: { homeId, awayId },
        bestFixtureId: best?.fixture?.id ?? null,
        count: cleaned.length,
        fixtures: cleaned,
      });
    }

    // ---------- MODO A: date/next ----------
    if (!date && !next) {
      return NextResponse.json(
        { error: "Debes pasar ?date=YYYY-MM-DD o ?next=10 (y opcionalmente league/season/team) o usar ?q=EquipoA vs EquipoB" },
        { status: 400 }
      );
    }

    const qParams = new URLSearchParams();
    if (date) qParams.set("date", date);
    if (league) qParams.set("league", league);
    if (season) qParams.set("season", season);
    if (team) qParams.set("team", team);
    if (!date && next) qParams.set("next", next);

    const r = await apiFootballFetch(`/fixtures?${qParams.toString()}`);

    if (!r.ok) {
      return NextResponse.json(
        {
          error: "API-Football error",
          details: { status: r.status, statusText: r.statusText, body: r.json ?? r.raw },
        },
        { status: 500 }
      );
    }

    const response = r.json?.response ?? [];
    const cleaned = response.map(cleanFixture);

    return NextResponse.json({
      mode: "list",
      count: cleaned.length,
      fixtures: cleaned,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
