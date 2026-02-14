// app/api/weather/match/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function toISODateTimeUTC(d: string) {
  // esperamos un ISO como "2026-02-13T20:00:00+00:00"
  // Open-Meteo acepta timezone, pero nosotros pedimos hourly en timezone local.
  return d;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city"); // "Elche"
    const dateISO = url.searchParams.get("dateISO"); // del fixture

    if (!city || !dateISO) {
      return NextResponse.json({ error: "Debes pasar ?city=Elche&dateISO=2026-02-13T20:00:00+00:00" }, { status: 400 });
    }

    // 1) Geocoding (Open-Meteo) -> lat/lon
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`,
      { cache: "no-store" }
    );
    const geoJson = await geoRes.json().catch(() => ({} as any));
    const g = (geoJson?.results ?? [])[0];

    if (!g?.latitude || !g?.longitude) {
      return NextResponse.json({ error: "No pude geolocalizar la ciudad.", geo: geoJson }, { status: 500 });
    }

    const lat = g.latitude;
    const lon = g.longitude;

    // 2) Forecast hourly (variables útiles para fútbol)
    // - temperature_2m
    // - precipitation
    // - windspeed_10m
    // - windgusts_10m
    // - relative_humidity_2m
    // - cloudcover
    // - weathercode (estado general)
    //
    // timezone=auto para que te devuelva horas locales
    const meteoRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(lon)}&hourly=temperature_2m,precipitation,windspeed_10m,windgusts_10m,relative_humidity_2m,cloudcover,weathercode&timezone=auto`,
      { cache: "no-store" }
    );

    const meteoJson = await meteoRes.json().catch(() => ({} as any));

    // 3) Buscar la hora más cercana al kickoff
    // Open-Meteo devuelve arrays paralelos: hourly.time[i], hourly.temperature_2m[i], etc.
    const times: string[] = meteoJson?.hourly?.time ?? [];
    const kickoff = new Date(toISODateTimeUTC(dateISO));
    if (!times.length || isNaN(kickoff.getTime())) {
      return NextResponse.json({ error: "No hay hourly o dateISO inválida.", meteo: meteoJson }, { status: 500 });
    }

    let bestIdx = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < times.length; i++) {
      const t = new Date(times[i]);
      const diff = Math.abs(t.getTime() - kickoff.getTime());
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    const h = meteoJson.hourly;

    const picked = {
      time: times[bestIdx],
      temperature: h.temperature_2m?.[bestIdx] ?? null,
      precipitation: h.precipitation?.[bestIdx] ?? null,
      windspeed: h.windspeed_10m?.[bestIdx] ?? null,
      windgusts: h.windgusts_10m?.[bestIdx] ?? null,
      humidity: h.relative_humidity_2m?.[bestIdx] ?? null,
      cloudcover: h.cloudcover?.[bestIdx] ?? null,
      weathercode: h.weathercode?.[bestIdx] ?? null,
    };

    return NextResponse.json({
      location: { city: g.name, country: g.country, latitude: lat, longitude: lon },
      kickoffISO: dateISO,
      closestHour: picked,
      notes: {
        tip:
          "Esto NO te da 'estado del césped' real (eso casi nunca es gratis). Pero sí clima útil para ajustar ritmo/precisión.",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unexpected error" }, { status: 500 });
  }
}
