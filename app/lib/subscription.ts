// app/lib/subscription.ts
import { getStripe } from "@/app/lib/stripe";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";

function isNoSuchCustomer(err: any) {
  const msg = (err?.message ?? "").toString().toLowerCase();
  return msg.includes("no such customer") || (msg.includes("customer") && msg.includes("does not exist"));
}

function subIsActive(status?: string | null) {
  return status === "active" || status === "trialing";
}

export async function userHasActiveSub(userId: string): Promise<boolean> {
  const sbAdmin = getSupabaseAdmin();
  const stripe = getStripe();

  // 1) Leer profile
  const { data: profile, error: pErr } = await sbAdmin
    .from("profiles")
    .select("id,email,stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  if (pErr) throw new Error(pErr.message);

  let storedCustomerId: string | null = profile?.stripe_customer_id ?? null;
  const email: string | null = profile?.email ?? null;

  // Helper: listar subs por customer
  const listSubs = async (customerId: string) => {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });
    return subs.data ?? [];
  };

  // 2) Si hay customerId guardado, probar
  if (storedCustomerId) {
    try {
      const subs = await listSubs(storedCustomerId);
      return subs.some((s) => subIsActive(s.status));
    } catch (e: any) {
      // Si era un cus_ de TEST pero estamos en LIVE → "No such customer"
      if (!isNoSuchCustomer(e)) throw e;
      storedCustomerId = null;
    }
  }

  // 3) No hay customerId válido → buscar en Stripe y reparar profile
  try {
    let resolved: string | null = null;

    // 3a) Preferimos buscar por metadata.supabase_user_id (lo seteas al crear customer ✅)
    try {
      const foundByMeta = await stripe.customers.search({
        query: `metadata['supabase_user_id']:'${userId}'`,
        limit: 1,
      });
      resolved = foundByMeta.data?.[0]?.id ?? null;
    } catch {
      resolved = null; // si search no está habilitado, seguimos con fallback
    }

    // 3b) Fallback por email si lo tenemos
    if (!resolved && email) {
      const byEmail = await stripe.customers.list({ email, limit: 10 });
      const sorted = (byEmail.data ?? []).sort((a, b) => (a.created ?? 0) - (b.created ?? 0));
      resolved = sorted.length ? sorted[sorted.length - 1].id : null;
    }

    if (!resolved) return false;

    // TS: a partir de aquí es string seguro
    const customerId = resolved;

    // 4) Guardar en profiles para que ya quede bien
    await sbAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          stripe_customer_id: customerId,
          email: email ?? null,
        },
        { onConflict: "id" }
      );

    // 5) Comprobar subs
    const subs = await listSubs(customerId);
    return subs.some((s) => subIsActive(s.status));
  } catch {
    // No romper la app si Stripe falla (mejor “false” que error)
    return false;
  }
}
