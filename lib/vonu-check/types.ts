export type SupportedLocale = "es" | "en" | "fr" | "de" | "ar";

export type RiskLevel = "low" | "caution" | "high" | "unknown";
export type SignalTone = "positive" | "warning" | "negative" | "neutral";

export type WebCheckSignal = {
  id: string;
  tone: SignalTone;
  title: string;
  detail: string;
  weight: number;
};

export type WebCheckFacts = {
  hostname: string;
  normalizedUrl: string;
  finalUrl: string;
  httpStatus: number | null;
  redirects: number;
  usesHttps: boolean;
  title: string | null;
  hasPasswordField: boolean;
  formCount: number;
  externalFormActions: number;
  legalTextDetected: boolean;
  contactTextDetected: boolean;
  paymentRiskTextDetected: boolean;
};

export type WebCheckResult = {
  version: "vonu-check-v1";
  checkedAt: string;
  locale: SupportedLocale;
  risk: {
    level: RiskLevel;
    score: number;
    confidence: "limited" | "medium";
  };
  facts: WebCheckFacts;
  signals: WebCheckSignal[];
  limitations: string[];
};
