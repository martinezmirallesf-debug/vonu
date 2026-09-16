import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync("lib/vonu-check/risk-score.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
}).outputText;

const module = { exports: {} };
const context = {
  module,
  exports: module.exports,
  console,
  Number,
  Math,
};
vm.runInNewContext(compiled, context, { filename: "risk-score.compiled.cjs" });

const {
  clampRiskScore,
  riskBandFromScore,
  riskLevelFromScore,
  calibrateModelRiskScore,
  combineIndependentRiskScores,
} = module.exports;

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

const bandCases = [
  [0, "very_low"],
  [19, "very_low"],
  [20, "low"],
  [39, "low"],
  [40, "moderate"],
  [59, "moderate"],
  [60, "high"],
  [79, "high"],
  [80, "very_high"],
  [100, "very_high"],
];
for (const [score, expected] of bandCases) {
  assertEqual(riskBandFromScore(score), expected, `band ${score}`);
}

assertEqual(clampRiskScore(-20), 0, "clamp negative");
assertEqual(clampRiskScore(140), 100, "clamp high");
assertEqual(clampRiskScore("not-a-number"), 0, "clamp invalid");
assertEqual(riskLevelFromScore(39), "low", "compat 39");
assertEqual(riskLevelFromScore(40), "caution", "compat 40");
assertEqual(riskLevelFromScore(59), "caution", "compat 59");
assertEqual(riskLevelFromScore(60), "high", "compat 60");

const calibrationCases = [
  {
    label: "benign text cannot become moderate without evidence",
    raw: 72,
    signals: [],
    expected: 19,
  },
  {
    label: "single weak warning stays low",
    raw: 80,
    signals: [{ tone: "warning", weight: 5 }],
    expected: 29,
  },
  {
    label: "two weak warnings stay below moderate ceiling",
    raw: 90,
    signals: [{ tone: "warning", weight: 8 }, { tone: "warning", weight: 5 }],
    expected: 45,
  },
  {
    label: "multiple warnings can justify high but not very high",
    raw: 90,
    signals: [{ tone: "warning", weight: 12 }, { tone: "warning", weight: 10 }],
    expected: 63,
  },
  {
    label: "warning-only evidence cannot reach very high",
    raw: 95,
    signals: [{ tone: "warning", weight: 30 }],
    expected: 69,
  },
  {
    label: "limited negative evidence stays below very high",
    raw: 95,
    signals: [{ tone: "negative", weight: 20 }, { tone: "warning", weight: 8 }],
    expected: 75,
  },
  {
    label: "strong supported evidence preserves very high",
    raw: 95,
    signals: [{ tone: "negative", weight: 25 }, { tone: "warning", weight: 15 }],
    expected: 95,
  },
];
for (const test of calibrationCases) {
  assertEqual(calibrateModelRiskScore(test.raw, test.signals), test.expected, test.label);
}

assertEqual(combineIndependentRiskScores(0, 70), 70, "fusion one source");
assertEqual(combineIndependentRiskScores(50, 50), 60, "fusion corroborated moderate");
assertEqual(combineIndependentRiskScores(80, 30), 86, "fusion strong plus weak");
assertEqual(combineIndependentRiskScores(100, 100), 100, "fusion clamp");

console.log(`VONU_RISK_CALIBRATION_CONTRACT_GREEN bands=${bandCases.length} calibration=${calibrationCases.length}`);
