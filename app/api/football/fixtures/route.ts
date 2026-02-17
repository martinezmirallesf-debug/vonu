// app/api/football/fixtures/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = "https://v3.football.api-sports.io";

/**
 * ✅ API KEY unificada
 * Recomendado en Vercel: API_FOOTBALL_KEY
 * (pero soportamos aliases para evitar errores por duplicados)
 */
function getApiFootballKey() {
  const key =
    process.env.API_FOOTBALL_KEY ||
    process.env.APIFOOTBALL_KEY ||
    process.env.APISPORTS_KEY ||
    process.env.API_SPORTS_KEY ||
    process.env.API_FOOTBALL_API_KEY;

  if (!key) {
    throw new Error(
      "Missing env var: API_FOOTBALL_KEY (recomendado). También valen: APIFOOTBALL_KEY / APISPORTS_KEY / API_SPORTS_KEY / API_FOOTBALL_API_KEY",
    );
  }
  return key;
}

function hasApiSportsErrors(json: any) {
  const errs = json?.errors;
  if (errs && typeof errs === "object" && Object.keys(errs).length > 0) return true;
  if (typeof json?.message === "string" && json.message.trim().length > 0) return true;
  return false;
}

async function apiFootballFetch(path: string) {
  const key = getApiFootballKey();
  const upstreamUrl = `${API_BASE}${path}`;

  const res = await fetch(upstreamUrl, {
    headers: {
      "x-apisports-key": key,
      Accept: "application/json",
      "User-Agent": "VonuVercel/1.0",
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

  // ❌ Si no es JSON válido
  if (!json) {
    return {
      ok: false,
      status: res.status || 502,
      statusText: res.statusText || "Invalid JSON from upstream",
      json: null,
      raw: text,
      upstreamUrl,
    };
  }

  // ❌ Si HTTP no ok
  if (!res.ok) {
    return { ok: false, status: res.status, statusText: res.statusText, json, raw: text, upstreamUrl };
  }

  // ✅ MUY IMPORTANTE: aunque sea 200, puede venir con errors
  if (hasApiSportsErrors(json)) {
    return {
      ok: false,
      status: 502,
      statusText: "API-Sports returned errors (HTTP 200)",
      json,
      raw: text,
      upstreamUrl,
    };
  }

  return { ok: true, status: res.status, json, upstreamUrl };
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

  const notFinished = fixtures.filter((f) => {
    const st = String(f?.fixture?.status?.short ?? "");
    return st && st !== "FT" && st !== "AET" && st !== "PEN";
  });

  const list = (notFinished.length ? notFinished : fixtures).slice();
  list.sort((a, b) => Number(a?.fixture?.timestamp ?? 0) - Number(b?.fixture?.timestamp ?? 0));
  return list[0] ?? null;
}

/**
 * GET /api/football/fixtures
 *
 * MODO A) list:
 *  - ?date=YYYY-MM-DD
 *  - o ?from=YYYY-MM-DD&to=YYYY-MM-DD  ✅ (selecciones/copa/ventana)
 *  - o ?team=ID&next=30                ✅ (solo si NO hay date/from/to)
 *  opcionales: league, season, team
 *
 * MODO B) search por nombres:
 *  - ?q=Equipo A vs Equipo B&next=30&league=...&season=...
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const debug = url.searchParams.get("debug") === "1";
    const q = url.searchParams.get("q"); // "A vs B"

    const date = url.searchParams.get("date");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const league = url.searchParams.get("league");
    const season = url.searchParams.get("season");
    const team = url.searchParams.get("team");
    const next = url.searchParams.get("next");

    // next cap (API-Sports suele permitir hasta 100)
    const nextN = next ? Math.max(5, Math.min(100, Number(next))) : 30;

    // ---------- MODO B: q=... ----------
    if (q) {
      const parsed = parseVsQuery(q);
      if (!parsed) {
        return NextResponse.json({ error: 'Formato inválido en q. Usa "Equipo A vs Equipo B".' }, { status: 400 });
      }

      const homeId = await findTeamIdByName(parsed.home);
      const awayId = await findTeamIdByName(parsed.away);

      if (!homeId || !awayId) {
        return NextResponse.json(
          {
            error: "No pude resolver uno de los equipos por nombre.",
            details: { home: parsed.home, away: parsed.away, homeId, awayId },
          },
          { status: 404 },
        );
      }

      // ⚠️ IMPORTANTÍSIMO: aquí NO usamos from/to por defecto para no cambiar comportamiento.
      // Pedimos próximos partidos del HOME y filtramos por AWAY.
      // (Si el bug next vuelve, ya lo moveremos al resolver. Aquí lo dejamos “conservador”.)
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
            details: {
              upstreamUrl: (r as any).upstreamUrl ?? null,
              status: r.status,
              statusText: r.statusText,
              apiErrors: (r as any).json?.errors ?? null,
              apiMessage: (r as any).json?.message ?? null,
              body: (r as any).json ?? (r as any).raw,
            },
          },
          { status: 502 },
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
        ...(debug
          ? {
              upstream: {
                url: (r as any).upstreamUrl ?? null,
                results: r.json?.results ?? null,
                paging: r.json?.paging ?? null,
                errors: r.json?.errors ?? null,
              },
            }
          : {}),
      });
    }

    // ---------- MODO A ----------
    const hasRange = !!(from && to);
    const hasDate = !!date;

    // ✅ Si no hay date/from-to y tampoco next => error
    if (!hasDate && !hasRange && !next) {
      return NextResponse.json(
        {
          error:
            'Debes pasar ?date=YYYY-MM-DD o ?from=YYYY-MM-DD&to=YYYY-MM-DD o ?next=10 (y opcionalmente league/season/team) o usar ?q=EquipoA vs EquipoB',
        },
        { status: 400 },
      );
    }

    const qParams = new URLSearchParams();
    if (league) qParams.set("league", league);
    if (season) qParams.set("season", season);
    if (team) qParams.set("team", team);

    // ✅ prioridad: date > range > next
    if (hasDate) {
      qParams.set("date", String(date));
    } else if (hasRange) {
      qParams.set("from", String(from));
      qParams.set("to", String(to));
    } else {
      // ⚠️ next solo cuando NO hay date/from-to
      qParams.set("next", String(nextN));
    }

    const r = await apiFootballFetch(`/fixtures?${qParams.toString()}`);

    if (!r.ok) {
      return NextResponse.json(
        {
          error: "API-Football error",
          details: {
            upstreamUrl: (r as any).upstreamUrl ?? null,
            status: r.status,
            statusText: r.statusText,
            apiErrors: (r as any).json?.errors ?? null,
            apiMessage: (r as any).json?.message ?? null,
            body: (r as any).json ?? (r as any).raw,
          },
        },
        { status: 502 },
      );
    }

    const response = r.json?.response ?? [];
    const cleaned = response.map(cleanFixture);

    return NextResponse.json({
      mode: "list",
      count: cleaned.length,
      fixtures: cleaned,
      ...(debug
        ? {
            upstream: {
              url: (r as any).upstreamUrl ?? null,
              results: r.json?.results ?? null,
              paging: r.json?.paging ?? null,
              errors: r.json?.errors ?? null,
            },
          }
        : {}),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
