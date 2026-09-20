import type { AnalysisConfidence, RiskBand, RiskLevel, SignalTone, SupportedLocale } from "./types";

export type DocumentKind =
  | "invoice"
  | "quote_or_proforma"
  | "contract"
  | "rental_contract"
  | "service_contract"
  | "loan_or_financing"
  | "other";

export type DocumentSignal = {
  id: string;
  tone: SignalTone;
  title: string;
  detail: string;
  weight: number;
};

export type DocumentKeyFacts = {
  parties: string[];
  amounts: string[];
  dates: string[];
  paymentDetails: string[];
  keyClauses: string[];
};

export type DocumentCheckResult = {
  version: "vonu-document-v1";
  checkedAt: string;
  locale: SupportedLocale;
  kind: DocumentKind;
  filename: string;
  pageCount: number | null;
  risk: {
    level: RiskLevel;
    band: RiskBand;
    score: number;
    confidence: AnalysisConfidence;
  };
  summary: string;
  signals: DocumentSignal[];
  keyFacts: DocumentKeyFacts;
  extracted: {
    urls: string[];
    phones: string[];
    emails: string[];
    brands: string[];
  };
  recommendedActions: string[];
  limitations: string[];
};
