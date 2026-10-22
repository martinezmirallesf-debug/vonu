import type { PhpCveLookup, PhpCveMatch } from "./types";

// Strict allow-list: no domain, user-supplied URL or secret is sent to NVD.
// Only a concrete version already exposed by the target site's public header.
const VERSION = /^(?:[5-9]|10)\.\d{1,2}\.\d{1,3}$/;
const CVE_ID = /^CVE-\d{4}-\d{4,}$/;
const SOURCE: PhpCveLookup["source"] = "NVD CVE API 2.0";
const PAGE_SIZE = 300;
const TIMEOUT_MS = 5_000;

export function nvdPhpVersionQuery(version: string): string | null {
  if (!VERSION.test(version)) return null;
  const cpe = `cpe:2.3:a:php:php:${version}:*:*:*:*:*:*:*`;
  const url = new URL("https://services.nvd.nist.gov/rest/json/cves/2.0");
  url.searchParams.set("cpeName", cpe);
  url.searchParams.set("isVulnerable", "");
  url.searchParams.set("resultsPerPage", String(PAGE_SIZE));
  url.searchParams.set("startIndex", "0");
  return url.toString();
}

function severityOf(cve: Record<string, unknown>): { severity: PhpCveMatch["severity"]; score: number | null } {
  const metrics = cve.metrics as Record<string, unknown> | null | undefined;
  if (!metrics || typeof metrics !== "object") return { severity: "UNKNOWN", score: null };
  for (const key of ["cvssMetricV40", "cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]) {
    const candidate = metrics[key];
    if (!Array.isArray(candidate) || !candidate.length) continue;
    const preferred = candidate.find((item) => item && item.type === "Primary") || candidate[0];
    const score = preferred?.cvssData?.baseScore;
    const level = preferred?.cvssData?.baseSeverity || preferred?.baseSeverity;
    const sev = typeof level === "string" ? level.toUpperCase() : "";
    return {
      severity: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(sev) ? sev as PhpCveMatch["severity"] : "UNKNOWN",
      score: typeof score === "number" && score >= 0 && score <= 10 ? score : null,
    };
  }
  return { severity: "UNKNOWN", score: null };
}

export function parseNvdPhpCandidates(
  raw: unknown,
  version: string,
  checkedAt: string,
): PhpCveLookup {
  const data = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const listed = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];
  const total = data.totalResults;
  if (!Number.isInteger(total) || typeof total !== "number" || total < 0) {
    throw new Error("invalid_nvd_response");
  }
  const matches: PhpCveMatch[] = [];
  for (const entry of listed) {
    const cve = entry?.cve;
    if (!cve || typeof cve !== "object") continue;
    const id = cve.id;
    if (typeof id !== "string" || !CVE_ID.test(id) || cve.vulnStatus === "Rejected") continue;
    const descriptions = Array.isArray(cve.descriptions) ? cve.descriptions : [];
    const english = descriptions.find((d: { lang?: string; value?: unknown }) => d?.lang === "en" && typeof d.value === "string");
    const severity = severityOf(cve as Record<string, unknown>);
    matches.push({
      id,
      ...severity,
      published: typeof cve.published === "string" ? cve.published.slice(0, 10) : null,
      summary: typeof english?.value === "string" ? english.value.replace(/\s+/g, " ").slice(0, 230) : null,
    });
  }
  const unique = [...new Map(matches.map((x) => [x.id, x])).values()];
  unique.sort((a, b) =>
    (b.score ?? -1) - (a.score ?? -1) ||
    (b.published || "").localeCompare(a.published || "") ||
    a.id.localeCompare(b.id),
  );
  // No inferred "no CVEs": the API may have capped results or NVD may lag.
  const incomplete = listed.length < total || total > PAGE_SIZE;
  return {
    source: SOURCE,
    version,
    checkedAt,
    status: incomplete ? "partial" : "ok",
    totalMatches: total,
    items: unique.slice(0, 6),
  };
}

export async function lookupNvdPhpCves(version: string): Promise<PhpCveLookup> {
  const checkedAt = new Date().toISOString();
  const url = nvdPhpVersionQuery(version);
  if (!url) {
    return { status: "incomplete-version", source: SOURCE, version, checkedAt, totalMatches: null, items: [] };
  }

  try {
    const headers: Record<string, string> = {
      accept: "application/json",
      "user-agent": "VonuCheck/1.3 (+https://vonuai.com)",
    };
    // Optional: configure a server-only NVD_API_KEY for larger API quotas.
    if (process.env.NVD_API_KEY) headers.apiKey = process.env.NVD_API_KEY;
    const response = await fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error("nvd_unavailable");
    const raw = await response.json();
    return parseNvdPhpCandidates(raw, version, checkedAt);
  } catch {
    // Failing open is important: lack of NVD access must NEVER become "0 CVEs".
    return { status: "unavailable", source: SOURCE, version, checkedAt, totalMatches: null, items: [] };
  }
}
