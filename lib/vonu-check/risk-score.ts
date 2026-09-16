import type { RiskBand, RiskLevel, SignalTone } from "./types";

export const VONU_RISK_BANDS = {
  veryLowMax: 19,
  lowMax: 39,
  moderateMax: 59,
  highMax: 79,
} as const;

export type RiskSignalLike = {
  tone: SignalTone;
  weight: number;
};

const FALLBACK_TONE_WEIGHT: Partial<Record<SignalTone, number>> = {
  warning: 6,
  negative: 12,
};

export function clampRiskScore(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export function riskBandFromScore(score: number): Exclude<RiskBand, "unknown"> {
  const value = clampRiskScore(score);
  if (value <= VONU_RISK_BANDS.veryLowMax) return "very_low";
  if (value <= VONU_RISK_BANDS.lowMax) return "low";
  if (value <= VONU_RISK_BANDS.moderateMax) return "moderate";
  if (value <= VONU_RISK_BANDS.highMax) return "high";
  return "very_high";
}

/**
 * Compatibility level used by the existing UI and signal copy.
 * The public score and five-band RiskBand are the canonical interpretation.
 */
export function riskLevelFromScore(score: number): Exclude<RiskLevel, "unknown"> {
  const band = riskBandFromScore(score);
  if (band === "very_low" || band === "low") return "low";
  if (band === "moderate") return "caution";
  return "high";
}

function calibrationWeight(signal: RiskSignalLike): number {
  if (signal.tone !== "warning" && signal.tone !== "negative") return 0;
  const explicit = Math.min(30, clampRiskScore(signal.weight));
  return explicit > 0 ? explicit : FALLBACK_TONE_WEIGHT[signal.tone] ?? 0;
}

/**
 * Prevent a language/vision model from assigning a high numeric score when the
 * structured evidence it returned does not support that severity.
 *
 * This is intentionally one-way: it can cap an over-aggressive model score,
 * but never raises a score. Objective reputation/technical evidence is fused
 * afterwards and can still move the final result upward.
 */
export function calibrateModelRiskScore(rawScore: unknown, signals: RiskSignalLike[]): number {
  const score = clampRiskScore(rawScore);
  const riskSignals = signals.filter(
    (signal) => signal.tone === "warning" || signal.tone === "negative",
  );

  const evidenceWeight = riskSignals.reduce(
    (total, signal) => total + calibrationWeight(signal),
    0,
  );
  const negativeCount = riskSignals.filter((signal) => signal.tone === "negative").length;

  // No concrete warning/negative evidence should remain outside the very-low
  // band even if the model emitted a higher number because of uncertainty.
  if (riskSignals.length === 0 || evidenceWeight === 0) {
    return Math.min(score, VONU_RISK_BANDS.veryLowMax);
  }

  // Evidence strength defines a conservative ceiling. Examples with explicit
  // weights: 5 points -> 29 max, 10 -> 39, 20 -> 59, 30 -> 79.
  let ceiling = Math.min(100, VONU_RISK_BANDS.veryLowMax + evidenceWeight * 2);

  // Warning-only evidence can justify a high result, but not "very high" by
  // itself. A very-high score requires at least one explicitly negative signal.
  if (negativeCount === 0) ceiling = Math.min(ceiling, 69);

  // A lone/limited negative signal without enough supporting evidence should
  // not reach the very-high band either.
  if (negativeCount > 0 && evidenceWeight < 30) ceiling = Math.min(ceiling, 79);

  return Math.min(score, ceiling);
}

/**
 * Fuse two substantially independent risk estimates without simply adding them.
 * The strongest evidence dominates; the weaker estimate contributes 20%.
 */
export function combineIndependentRiskScores(a: number, b: number): number {
  const first = clampRiskScore(a);
  const second = clampRiskScore(b);
  if (first <= 0) return second;
  if (second <= 0) return first;
  const strongest = Math.max(first, second);
  const supporting = Math.min(first, second);
  return clampRiskScore(strongest + Math.round(supporting * 0.2));
}
