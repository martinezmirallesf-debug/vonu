import { spawn } from "node:child_process";

const PORT = 3221;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const NEXT_BIN = "node_modules/next/dist/bin/next";

const cases = [
  {
    id: "safe-example-https",
    url: "https://example.com",
    expectStatus: 200,
    maxScore: 35,
    allowedLevels: ["low", "unknown", "caution"],
  },
  {
    id: "safe-example-no-scheme",
    url: "example.com",
    expectStatus: 200,
    maxScore: 35,
    allowedLevels: ["low", "unknown", "caution"],
  },
  {
    id: "reject-ftp",
    url: "ftp://example.com/file.txt",
    expectStatus: 422,
    expectError: "unsupported_protocol",
  },
  {
    id: "reject-javascript",
    url: "javascript:alert(1)",
    expectStatus: 422,
    expectError: "unsupported_protocol",
  },
  {
    id: "reject-credentials",
    url: "https://user:pass@example.com",
    expectStatus: 422,
    expectError: "credentials_not_allowed",
  },
  {
    id: "reject-private-ipv4",
    url: "http://127.0.0.1",
    expectStatus: 422,
    expectError: "private_target",
  },
  {
    id: "reject-private-localhost",
    url: "http://localhost",
    expectStatus: 422,
    expectError: "private_target",
  },
  {
    id: "reject-private-ipv6",
    url: "http://[::1]",
    expectStatus: 422,
    allowedErrors: ["private_target", "dns_not_found"],
  },
  {
    id: "reject-nonexistent-domain",
    url: "https://vonu-definitely-does-not-exist.invalid",
    expectStatus: 422,
    expectError: "dns_not_found",
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${ORIGIN}/robots.txt`, { signal: AbortSignal.timeout(1_500) });
      if (response.status < 500) return;
    } catch {
      // Server may still be starting.
    }
    await wait(350);
  }
  throw new Error("web_e2e_server_timeout");
}

async function runCase(test) {
  const startedAt = Date.now();
  let status = 0;
  let payload = null;
  let error = null;

  try {
    const response = await fetch(`${ORIGIN}/api/check/web`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: test.url, locale: "es" }),
      signal: AbortSignal.timeout(25_000),
    });
    status = response.status;
    payload = await response.json().catch(() => null);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : String(cause);
  }

  const score = typeof payload?.risk?.score === "number" ? payload.risk.score : null;
  const level = typeof payload?.risk?.level === "string" ? payload.risk.level : null;
  const responseError = typeof payload?.error === "string" ? payload.error : null;

  let pass = !error && status === test.expectStatus;
  if (pass && typeof test.maxScore === "number") pass = score !== null && score <= test.maxScore;
  if (pass && Array.isArray(test.allowedLevels)) pass = test.allowedLevels.includes(level);
  if (pass && test.expectError) pass = responseError === test.expectError;
  if (pass && Array.isArray(test.allowedErrors)) pass = test.allowedErrors.includes(responseError);

  const result = {
    id: test.id,
    status,
    score,
    level,
    error: responseError ?? error,
    finalUrl: payload?.facts?.finalUrl ?? null,
    urlhausChecked: payload?.facts?.urlhausChecked ?? null,
    domainAgeDays: payload?.facts?.domainAgeDays ?? null,
    durationMs: Date.now() - startedAt,
    pass,
  };
  console.log(`VONU_WEB_E2E_CASE ${JSON.stringify(result)}`);
  return result;
}

const server = spawn(process.execPath, [NEXT_BIN, "start", "-H", "127.0.0.1", "-p", String(PORT)], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (chunk) => process.stdout.write(`[web-server] ${chunk}`));
server.stderr.on("data", (chunk) => process.stderr.write(`[web-server] ${chunk}`));

try {
  await waitForServer();
  const results = [];
  for (const test of cases) results.push(await runCase(test));
  const passed = results.filter((item) => item.pass).length;
  if (passed !== results.length) {
    console.error(`VONU_WEB_E2E_RED passed=${passed} total=${results.length}`);
    process.exitCode = 1;
  } else {
    console.log(`VONU_WEB_E2E_GREEN passed=${passed} total=${results.length}`);
  }
} finally {
  server.kill("SIGTERM");
}
