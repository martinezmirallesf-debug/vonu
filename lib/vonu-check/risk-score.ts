import type { RiskBand, RiskLevel } from "./types";

export const VONU_RISK_BANDS = {
  veryLowMax: 19,
  lowMax: 39,
  moderateMax: 59,
  highMax: 79,
} as const;

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
