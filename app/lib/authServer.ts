// app/lib/authServer.ts
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env"
    );
  }

  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getUserFromRequest(req: NextRequest): Promise<{
  user: { id: string; email?: string | null } | null;
  error: string | null;
}> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!token) return { user: null, error: "Missing bearer token" };

  try {
    const sb = getSupabaseAuthClient();
    const { data, error } = await sb.auth.getUser(token);

    if (error || !data?.user) {
      return { user: null, error: error?.message ?? "Invalid token" };
    }

    return {
      user: { id: data.user.id, email: data.user.email },
      error: null,
    };
  } catch (e: any) {
    return { user: null, error: e?.message ?? "Auth error" };
  }
}
