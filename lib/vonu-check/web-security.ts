import type { WebSecurityAssessment, WebSecurityFinding } from "./types";

/**
 * Passive, bounded assessment of ONE already-fetched public HTTP response.
 * Never sends probes or attempts to exploit a vulnerability.
 * Never persists cookie values, authorization tokens or response bodies.
 */
export function assessPublicWebSecurity(
  headers: Headers,
  finalUrl: URL,
  httpStatus: number,
  hasHtml: boolean,
): WebSecurityAssessment {
  const limited = !hasHtml || httpStatus < 200 || httpStatus >= 400;
  const https = finalUrl.protocol === "https:";
  const csp = headers.get("content-security-policy") || "";
  const hsts = Boolean(headers.get("strict-transport-security"));
  const nosniff = /\bnosniff\b/i.test(headers.get("x-content-type-options") || "");
  const frameProtection =
    /\b(?:DENY|SAMEORIGIN)\b/i.test(headers.get("x-frame-options") || "") ||
    /(?:^|;)\s*frame-ancestors\s+/i.test(csp);
  const referrerPolicy = Boolean(headers.get("referrer-policy"));

  const observed = {
    hsts,
    csp: Boolean(csp.trim()),
    nosniff,
    frameProtection,
    referrerPolicy,
  };

  // getSetCookie exposes each Set-Cookie header separately in server-side fetch.
  // If the runtime cannot expose these safely, do not guess cookie attributes.
  const responseHeaders = headers as Headers & { getSetCookie?: () => string[] };
  const rawCookies = typeof responseHeaders.getSetCookie === "function"
    ? responseHeaders.getSetCookie().slice(0, 50)
    : [];

  let sessionCookies = 0;
  let missingSecure = 0;
  let sessionMissingHttpOnly = 0;
  let missingSameSite = 0;
  let phpSession = false;

  for (const raw of rawCookies) {
    const parts = raw.split(";");
    const first = parts[0]?.trim() || "";
    const equals = first.indexOf("=");
    if (equals < 1) continue;
    const name = first.slice(0, equals).trim();
    // The cookie NAME is used only for classification, never returned.
    const isSession = /(?:^|[_-])(?:session|sess|auth|token)(?:[_-]|$)|^phpsessid$|^jsessionid$|^asp\.net_sessionid$/i.test(name);
    if (/^phpsessid$/i.test(name)) phpSession = true;
    if (isSession) sessionCookies += 1;

    const attributes = parts.slice(1).map((part) => part.trim().toLowerCase());
    const hasSecure = attributes.some((part) => part === "secure");
    const hasHttpOnly = attributes.some((part) => part === "httponly");
    const hasSameSite = attributes.some((part) => part.startsWith("samesite="));

    if (https && !hasSecure) missingSecure += 1;
    if (isSession && !hasHttpOnly) sessionMissingHttpOnly += 1;
    if (isSession && !hasSameSite) missingSameSite += 1;
  }

  const poweredBy = headers.get("x-powered-by") || "";
  const phpIndicators: WebSecurityAssessment["php"]["indicators"] = [];
  if (/\bPHP\b/i.test(poweredBy)) phpIndicators.push("powered-by");
  if (phpSession) phpIndicators.push("session-cookie");
  if (/\.php$/i.test(finalUrl.pathname)) phpIndicators.push("url-extension");

  // A public response header is an indication, NOT a verified PHP installation.
  const reportedVersion = poweredBy.match(/\bPHP\/(\d+\.\d+(?:\.\d+)?)/i)?.[1] ?? null;

  let support: WebSecurityAssessment["php"]["support"] = "unknown";
  if (reportedVersion) {
    const [major, minor] = reportedVersion.split(".").map(Number);
    if (Number.isInteger(major) && Number.isInteger(minor)) {
      if (major < 8 || (major === 8 && minor < 2)) {
        support = "unsupported";
      } else if (major === 8 && minor >= 2 && minor <= 5) {
        const supportEnds: Record<number, { active: string; security: string }> = {
          2: { active: "2024-12-31", security: "2026-12-31" },
          3: { active: "2025-12-31", security: "2027-12-31" },
          4: { active: "2026-12-31", security: "2028-12-31" },
          5: { active: "2027-12-31", security: "2029-12-31" },
        };
        const now = new Date().toISOString().slice(0, 10);
        const period = supportEnds[minor];
        support = now > period.security ? "unsupported" : now > period.active ? "security-only" : "active";
      }
    }
  }

  const findings: WebSecurityFinding[] = [];
  const add = (id: WebSecurityFinding["id"], severity: WebSecurityFinding["severity"], count?: number) =>
    findings.push({ id, severity, ...(count ? { count } : {}) });

  if (support === "unsupported") add("php-unsupported", "attention");
  if (missingSecure) add("cookie-insecure", "attention", missingSecure);
  if (sessionMissingHttpOnly) add("session-cookie-httponly", "attention", sessionMissingHttpOnly);
  if (missingSameSite) add("cookie-samesite", "improvement", missingSameSite);

  // Missing headers are hardening opportunities, NOT proven vulnerabilities.
  // Only report their absence on an inspectable successful HTML response.
  if (!limited) {
    if (https && !hsts) add("missing-hsts", "improvement");
    if (!observed.csp) add("missing-csp", "improvement");
    if (!nosniff) add("missing-nosniff", "improvement");
    if (!frameProtection) add("missing-frame-protection", "improvement");
    if (!referrerPolicy) add("missing-referrer-policy", "improvement");
  }

  return {
    inspected: true,
    limited,
    headers: observed,
    cookies: {
      observed: rawCookies.length,
      sessionCookies,
      missingSecure,
      sessionMissingHttpOnly,
      missingSameSite,
    },
    php: {
      indicators: phpIndicators,
      reportedVersion,
      support,
    },
    findings,
  };
}
