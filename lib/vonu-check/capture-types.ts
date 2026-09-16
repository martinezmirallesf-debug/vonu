import type { AnalysisConfidence, RiskLevel, SignalTone, SupportedLocale, WebCheckSignal } from "./types";

export type CaptureKind =
  | "message"
  | "email"
  | "social_profile"
  | "marketplace"
  | "website_or_checkout"
  | "other";

export type CaptureSignal = {
  id: string;
  tone: SignalTone;
  title: string;
  detail: string;
  weight: number;
};

export type CaptureExtracted = {
  urls: string[];
  phones: string[];
  emails: string[];
  brands: string[];
};

export type LinkedUrlCheck = {
  url: string;
  risk: {
    level: RiskLevel;
    score: number;
    confidence: AnalysisConfidence;
  };
  signals: WebCheckSignal[];
};

export type CaptureCheckResult = {
  version: "vonu-capture-v1";
  checkedAt: string;
  locale: SupportedLocale;
  kind: CaptureKind;
  risk: {
    level: RiskLevel;
    score: number;
    confidence: AnalysisConfidence;
  };
  summary: string;
  signals: CaptureSignal[];
  extracted: CaptureExtracted;
  recommendedActions: string[];
  linkedUrlCheck: LinkedUrlCheck | null;
  limitations: string[];
};
