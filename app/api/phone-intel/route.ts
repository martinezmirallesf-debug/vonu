import { NextResponse } from "next/server";
import { analyzePhoneNumber } from "@/app/lib/phone/phoneIntel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const phone = String(body?.phone ?? "").trim();
    const defaultCountry = String(body?.defaultCountry ?? "ES").trim();

    if (!phone) {
      return NextResponse.json(
        {
          ok: false,
          error: "Falta el número de teléfono.",
        },
        { status: 400 }
      );
    }

    const intel = analyzePhoneNumber(phone, {
      defaultCountry,
    });

    return NextResponse.json({
      ok: true,
      intel,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "No se pudo analizar el número.",
      },
      { status: 500 }
    );
  }
}