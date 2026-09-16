import { NextRequest } from "next/server";
import { POST as runTextCheck } from "@/app/api/check/text/route";
import corpus from "@/scripts/fixtures/vonu-risk-corpus.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CalibrationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const selected = corpus.textCases.find((item) => item.id === id) ?? corpus.textCases[0];

  const request = new NextRequest("https://preview.local/api/check/text", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: selected.text, locale: selected.locale }),
  });

  const response = await runTextCheck(request);
  const result: any = await response.json().catch(() => null);
  const score = typeof result?.risk?.score === "number" ? result.risk.score : null;
  const passed =
    response.ok &&
    score != null &&
    score >= selected.expected.min &&
    score <= selected.expected.max;

  const payload = {
    runner: "vonu-risk-calibration-20260916",
    id: selected.id,
    expected: selected.expected,
    httpStatus: response.status,
    passed,
    actual: result
      ? {
          score,
          band: result?.risk?.band ?? null,
          level: result?.risk?.level ?? null,
          confidence: result?.risk?.confidence ?? null,
          kind: result?.kind ?? null,
          signalCount: Array.isArray(result?.signals) ? result.signals.length : 0,
          signals: Array.isArray(result?.signals)
            ? result.signals.slice(0, 8).map((signal: any) => ({
                id: signal?.id ?? null,
                tone: signal?.tone ?? null,
                weight: signal?.weight ?? null,
                title: signal?.title ?? null,
              }))
            : [],
          linkedUrlScore: result?.linkedUrlCheck?.risk?.score ?? null,
          summary: result?.summary ?? null,
        }
      : null,
    error: response.ok ? null : result,
  };

  return (
    <main style={{ padding: 24, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {JSON.stringify(payload, null, 2)}
    </main>
  );
}
