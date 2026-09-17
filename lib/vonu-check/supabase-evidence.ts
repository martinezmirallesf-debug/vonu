type EvidencePayload = Record<string, unknown>;

function cleanBaseUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

function evidenceConfig() {
  const supabaseUrl = cleanBaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  );
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY_FALLBACK ||
    ""
  ).trim();

  return {
    endpoint: supabaseUrl ? `${supabaseUrl}/functions/v1/check-evidence` : "",
    anonKey,
  };
}

async function callEvidence(body: EvidencePayload, timeoutMs: number) {
  const { endpoint, anonKey } = evidenceConfig();
  if (!endpoint || !anonKey) return null;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "content-type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export async function lookupSupabaseUrlReputation(url: string) {
  return callEvidence({ action: "url_reputation", url }, 2_500);
}

export async function lookupSupabaseReverseImage(imageBase64: string) {
  return callEvidence({ action: "reverse_image", imageBase64 }, 5_500);
}
