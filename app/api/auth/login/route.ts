import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // importante: Auth + email mejor en node (no edge)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function json(status: number, data: any) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  return json(200, { ok: true, route: "/api/auth/login" });
}

export async function POST(req: Request) {
  try {
    // 1) Lee raw para depurar PowerShell
    const raw = await req.text();
    console.log("[/api/auth/login] raw body:", raw);

    let body: any = null;
    try {
      body = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("[/api/auth/login] JSON parse error:", e);
      return json(400, {
        ok: false,
        error: "INVALID_JSON",
        detail: "El body no es JSON válido",
        raw,
      });
    }

    const email = (body?.email ?? "").toString().trim().toLowerCase();
    console.log("[/api/auth/login] parsed email:", email);

    if (!email || !email.includes("@")) {
      return json(400, {
        ok: false,
        error: "MISSING_EMAIL",
        detail: "Falta email en el body. Esperado: { email: \"...\" }",
        received: body,
      });
    }

    // 2) URL de redirección (muy importante en Supabase Auth)
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

    // Puedes elegir una ruta real tuya, por ejemplo /chat o /auth/callback
    const redirectTo = `${siteUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        // Si estás usando "OTP por código" vs magic link, Supabase decide según config.
        // Si tienes problemas de rate limit, esto te lo dirá error.message.
      },
    });

    if (error) {
      console.error("[/api/auth/login] supabase error:", error);
      return json(500, {
        ok: false,
        error: "SUPABASE_AUTH_ERROR",
        message: error.message,
        status: (error as any).status,
      });
    }

    console.log("[/api/auth/login] supabase data:", data);

    return json(200, {
      ok: true,
      sent: true,
      email,
      redirectTo,
    });
  } catch (err: any) {
    console.error("[/api/auth/login] unexpected error:", err);
    return json(500, {
      ok: false,
      error: "UNEXPECTED",
      message: err?.message ?? String(err),
    });
  }
}
