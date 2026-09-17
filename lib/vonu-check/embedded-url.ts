function stripTrailingPunctuation(value: string) {
  return value.trim().replace(/[),.;!?\]}>'"]+$/g, "");
}

export function normalizeEmbeddedUrl(value: string): string | null {
  const clean = stripTrailingPunctuation(value || "");
  if (!clean || clean.length > 2048) return null;

  const candidate = /^https?:\/\//i.test(clean)
    ? clean
    : /^(?:www\.)?[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(?:[/:?#].*)?$/i.test(clean)
      ? `https://${clean}`
      : null;

  if (!candidate) return null;

  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    if (!parsed.hostname || !parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function pickEmbeddedUrls(values: string[], max = 2) {
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const value of values) {
    const normalized = normalizeEmbeddedUrl(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    urls.push(normalized);
    if (urls.length >= max) break;
  }

  return urls;
}
