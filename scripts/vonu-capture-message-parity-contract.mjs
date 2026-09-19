import fs from "node:fs";

const capture = fs.readFileSync("app/api/check/image/route.ts", "utf8");
const checkClient = fs.readFileSync("app/[locale]/check/CheckClient.tsx", "utf8");
const text = fs.readFileSync("app/api/check/text/route.ts", "utf8");
const visualOverrides = fs.readFileSync("app/components/CheckVisualOverrides.tsx", "utf8");
const experiencePolish = fs.readFileSync("app/check-experience-polish.css", "utf8");

function requireSource(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
  }
}

function rejectSource(source, needle, label) {
  if (source.includes(needle)) {
    throw new Error(`${label}: forbidden ${JSON.stringify(needle)}`);
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
requireSource(capture, "exact substrings of visibleText", "capture exact-evidence grounding");
requireSource(capture, "Preserve wording and polarity", "capture polarity instruction");
requireSource(capture, "atlasScore.confidence", "capture atlas confidence");
requireSource(capture, "extractFirstBalancedObject", "capture balanced-json recovery");
requireSource(capture, "minimalRecoveryPrompt", "capture minimal recovery prompt");
requireSource(capture, "vision_recovery_failed", "capture final recovery guard");
requireSource(checkClient, "URL.createObjectURL(file)", "capture stable thumbnail URL");
requireSource(checkClient, "imageData || imagePreviewUrl", "capture result thumbnail uses stable uploaded image data");
requireSource(checkClient, 'data-vonu-capture-thumbnail={subject.mode === "capture" ? "true" : undefined}', "capture thumbnail explicit render marker");
requireSource(visualOverrides, "object-fit: cover !important", "capture visual override shows real image");
requireSource(visualOverrides, "object-position: center !important", "capture visual override centers real image");
rejectSource(visualOverrides, 'content: url("data:image/svg+xml', "capture thumbnail icon replacement removed");
rejectSource(experiencePolish, "object-position: 9999px 9999px", "capture thumbnail offscreen hiding removed");
requireSource(text, "Fraud Atlas evidence MUST be grounded in exact text excerpts", "text exact-evidence grounding");

console.log("VONU_CAPTURE_MESSAGE_PARITY_CONTRACT_GREEN capture=1 text=1 shared_atlas=1 polarity=1 image_json_recovery=1 thumbnail_persistence=1 thumbnail_render=1");
