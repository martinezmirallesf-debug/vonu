import fs from "node:fs";

const capture = fs.readFileSync("app/api/check/image/route.ts", "utf8");
const text = fs.readFileSync("app/api/check/text/route.ts", "utf8");

function requireSource(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
  }
}

const sharedRequirements = [
  "FRAUD_ATLAS_PROMPT",
  "normaliseFraudAtlasEvidence",
  "scoreFraudAtlasEvidence",
  "calibrateModelRiskScore",
  "combineIndependentRiskScores",
  "Math.max(calibratedModelScore, atlasScore.score)",
];

for (const needle of sharedRequirements) {
  requireSource(text, needle, `text route parity`);
  requireSource(capture, needle, `capture route parity`);
}

requireSource(capture, "visibleText", "capture visible-text grounding");
requireSource(capture, "exact substring of visibleText", "capture exact-evidence grounding");
requireSource(capture, "Preserve wording and polarity", "capture polarity instruction");
requireSource(capture, "atlasScore.confidence", "capture atlas confidence");
requireSource(text, "Fraud Atlas evidence MUST be grounded in exact text excerpts", "text exact-evidence grounding");

console.log("VONU_CAPTURE_MESSAGE_PARITY_CONTRACT_GREEN capture=1 text=1 shared_atlas=1 polarity=1");
