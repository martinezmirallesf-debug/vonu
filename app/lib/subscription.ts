// app/lib/subscription.ts
import { supabaseServer } from "@/app/lib/supabaseServer";

export async function userHasActiveSub(userId: string) {
  const sb = supabaseServer();

  const { data, error } = await sb
    .from("subscriptions")
    .select("status, current_period_end, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) return false;

  const sub = data?.[0];
  if (!sub) return false;

  const okStatuses = new Set(["active", "trialing"]);
  if (!okStatuses.has(sub.status)) return false;

  if (sub.current_period_end) {
    const end = new Date(sub.current_period_end).getTime();
    if (Number.isFinite(end) && end < Date.now()) return false;
  }

  return true;
}
