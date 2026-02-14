// app/api/football/teams/route.ts
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

// GET /api/football/teams?search=Real%20Madrid
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();

    if (!search || search.length < 2) {
      return NextResponse.json({ error: "Missing search" }, { status: 400 });
    }

    const q = new URLSearchParams();
    q.set("search", search);

    const r = await apiFootballFetch(`/teams?${q.toString()}`);

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
    const cleaned = response.map((t: any) => ({
      id: t?.team?.id ?? null,
      name: t?.team?.name ?? null,
      code: t?.team?.code ?? null,
      country: t?.team?.country ?? null,
      founded: t?.team?.founded ?? null,
      logo: t?.team?.logo ?? null,
    }));

    return NextResponse.json({ count: cleaned.length, teams: cleaned });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
