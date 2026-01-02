// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    url.origin;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/`);
  }

  // Cliente "simple" para intercambiar code->session.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${appUrl}/`);
}
