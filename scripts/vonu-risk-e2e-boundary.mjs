import fs from "node:fs";
import { spawn } from "node:child_process";

const port = 3219;
const baseUrl = `http://127.0.0.1:${port}`;
const corpus = JSON.parse(fs.readFileSync("scripts/fixtures/vonu-risk-boundary-pairs.json", "utf8"));

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

async function analyse(text, locale) {
  const startedAt = Date.now();
  let status = 0;
  let payload = null;
  let requestError = null;

  try {
    const response = await fetch(`${baseUrl}/api/check/text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, locale }),
      signal: AbortSignal.timeout(60_000),
    });
    status = response.status;
    payload = await response.json().catch(() => null);
  } catch (error) {
    requestError = error instanceof Error ? error.message : String(error);
  }

  return {
    status,
    score: typeof payload?.risk?.score === "number" ? payload.risk.score : null,
    band: payload?.risk?.band ?? null,
    confidence: payload?.risk?.confidence ?? null,
    signals: Array.isArray(payload?.signals)
      ? payload.signals.slice(0, 6).map((signal) => ({
          id: signal?.id ?? null,
          tone: signal?.tone ?? null,
          weight: signal?.weight ?? null,
        }))
      : [],
    durationMs: Date.now() - startedAt,
    error: requestError ?? payload?.error ?? null,
  };
}

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
  {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => process.stdout.write(`[boundary-server] ${chunk}`));
server.stderr.on("data", (chunk) => process.stderr.write(`[boundary-server] ${chunk}`));

let passed = 0;

try {
  await waitForServer();

  for (const pair of corpus.pairs) {
    const low = await analyse(pair.low, pair.locale);
    const high = await analyse(pair.high, pair.locale);
    const gap = low.score != null && high.score != null ? high.score - low.score : null;

    const ok =
      low.status >= 200 &&
      low.status < 300 &&
      high.status >= 200 &&
      high.status < 300 &&
      low.score != null &&
      high.score != null &&
      low.score <= pair.lowMax &&
      high.score >= pair.highMin &&
      gap != null &&
      gap >= pair.minGap;

    if (ok) passed += 1;

    console.log(
      `VONU_BOUNDARY_E2E_PAIR ${JSON.stringify({
        id: pair.id,
        variable: pair.variable,
        guardrail: { lowMax: pair.lowMax, highMin: pair.highMin, minGap: pair.minGap },
        low,
        high,
        gap,
        pass: ok,
      })}`,
    );
  }

  const total = corpus.pairs.length;
  if (passed !== total) {
    console.error(`VONU_BOUNDARY_E2E_RED passed=${passed} total=${total} failed=${total - passed}`);
    process.exitCode = 1;
  } else {
    console.log(`VONU_BOUNDARY_E2E_GREEN passed=${passed} total=${total}`);
  }
} finally {
  if (!server.killed) server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    sleep(3_000),
  ]);
}
