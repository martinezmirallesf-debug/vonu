// app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/authServer";
import { userHasActiveSub } from "@/app/lib/subscription";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getUserFromRequest(req);

    // Si no hay sesión, devolvemos active=false (sin error)
    if (!user) {
      return NextResponse.json({ active: false }, { status: 200 });
    }

    const active = await userHasActiveSub(user.id);
    return NextResponse.json({ active }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
