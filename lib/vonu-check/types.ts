export type SupportedLocale = "es" | "en" | "fr" | "de" | "ar";

export type RiskLevel = "low" | "caution" | "high" | "unknown";
export type RiskBand = "very_low" | "low" | "moderate" | "high" | "very_high" | "unknown";
export type SignalTone = "positive" | "warning" | "negative" | "neutral";
export type AnalysisConfidence = "limited" | "medium" | "high";

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
  registeredDomain?: string | null;
  domainRegisteredAt?: string | null;
  domainAgeDays?: number | null;
  urlhausChecked?: boolean;
  urlhausMatch?: boolean | null;
};

export type WebCheckResult = {
  version: "vonu-check-v1";
  checkedAt: string;
  locale: SupportedLocale;
  risk: {
    level: RiskLevel;
    band: RiskBand;
    score: number;
    confidence: AnalysisConfidence;
  };
  facts: WebCheckFacts;
  signals: WebCheckSignal[];
  limitations: string[];
};
