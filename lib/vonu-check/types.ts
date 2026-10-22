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

export type WebSecurityFinding = {
  id:
    | "php-unsupported"
    | "cookie-insecure"
    | "session-cookie-httponly"
    | "cookie-samesite"
    | "missing-hsts"
    | "missing-csp"
    | "missing-nosniff"
    | "missing-frame-protection"
    | "missing-referrer-policy";
  severity: "attention" | "improvement";
  count?: number;
};

export type WebSecurityAssessment = {
  inspected: boolean;
  limited: boolean;
  headers: {
    hsts: boolean;
    csp: boolean;
    nosniff: boolean;
    frameProtection: boolean;
    referrerPolicy: boolean;
  };
  cookies: {
    observed: number;
    sessionCookies: number;
    missingSecure: number;
    sessionMissingSecure: number;
    sessionMissingHttpOnly: number;
    missingSameSite: number;
  };
  php: {
    indicators: Array<"powered-by" | "session-cookie" | "url-extension">;
    reportedVersion: string | null;
    support: "active" | "security-only" | "unsupported" | "unknown";
  };
  findings: WebSecurityFinding[];
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
  security?: WebSecurityAssessment;
};

export type WebCheckResult = {
  version: "vonu-check-v1";
  checkedAt: string;
  locale: SupportedLocale;
  risk: {
    level: RiskLevel;
    band?: RiskBand;
    score: number;
    confidence: AnalysisConfidence;
  };
  facts: WebCheckFacts;
  signals: WebCheckSignal[];
  limitations: string[];
};
