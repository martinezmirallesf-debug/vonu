import fs from "node:fs";
import { spawn } from "node:child_process";

const port = 3218;
const baseUrl = `http://127.0.0.1:${port}`;
const corpus = JSON.parse(fs.readFileSync("scripts/fixtures/vonu-risk-adversarial-corpus.json", "utf8"));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/robots.txt`, {
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });
      if (response.status > 0) return;
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }

  throw lastError ?? new Error("next_start_timeout");
}

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
  {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => process.stdout.write(`[adversarial-server] ${chunk}`));
server.stderr.on("data", (chunk) => process.stderr.write(`[adversarial-server] ${chunk}`));

let passed = 0;
const results = [];

try {
  await waitForServer();

  for (const testCase of corpus.textCases) {
    const startedAt = Date.now();
    let status = 0;
    let payload = null;
    let requestError = null;

    try {
      const response = await fetch(`${baseUrl}/api/check/text`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: testCase.text, locale: testCase.locale }),
        signal: AbortSignal.timeout(60_000),
      });
      status = response.status;
      payload = await response.json().catch(() => null);
    } catch (error) {
      requestError = error instanceof Error ? error.message : String(error);
    }

    const score = typeof payload?.risk?.score === "number" ? payload.risk.score : null;
    const ok =
      status >= 200 &&
      status < 300 &&
      score != null &&
      score >= testCase.expected.min &&
      score <= testCase.expected.max;

    if (ok) passed += 1;

    const result = {
      id: testCase.id,
      expected: testCase.expected,
      status,
      score,
      band: payload?.risk?.band ?? null,
      level: payload?.risk?.level ?? null,
      confidence: payload?.risk?.confidence ?? null,
      kind: payload?.kind ?? null,
      signalCount: Array.isArray(payload?.signals) ? payload.signals.length : 0,
      signals: Array.isArray(payload?.signals)
        ? payload.signals.slice(0, 6).map((signal) => ({
            id: signal?.id ?? null,
            tone: signal?.tone ?? null,
            weight: signal?.weight ?? null,
            title: signal?.title ?? null,
          }))
        : [],
      linkedUrlScore: payload?.linkedUrlCheck?.risk?.score ?? null,
      durationMs: Date.now() - startedAt,
      error: requestError ?? payload?.error ?? null,
      pass: ok,
    };

    results.push(result);
    console.log(`VONU_ADVERSARIAL_E2E_CASE ${JSON.stringify(result)}`);
  }

  const total = corpus.textCases.length;
  if (passed !== total) {
    console.error(`VONU_ADVERSARIAL_E2E_RED passed=${passed} total=${total} failed=${total - passed}`);
    process.exitCode = 1;
  } else {
    console.log(`VONU_ADVERSARIAL_E2E_GREEN passed=${passed} total=${total}`);
  }
} finally {
  if (!server.killed) server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    sleep(3_000),
  ]);
}
