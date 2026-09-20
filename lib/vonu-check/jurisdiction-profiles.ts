export type JurisdictionReference = {
  title: string;
  url: string;
  scope: string;
};

export type JurisdictionProfile = {
  code: "ES" | "DE" | "FR" | "GB";
  name: string;
  reviewedAt: string;
  guidance: string[];
  references: JurisdictionReference[];
};

export const JURISDICTION_PROFILES: Record<JurisdictionProfile["code"], JurisdictionProfile> = {
  ES: {
    code: "ES",
    name: "España",
    reviewedAt: "2026-09-20",
    guidance: [
      "For Spanish-law contracts, treat unilateral discretion, payment terms, penalties and liability allocation as review points when materially one-sided; do not declare invalidity without the applicable facts.",
      "Spanish Civil Code arts. 1255-1258 provide general contract principles; art. 1256 says validity and performance cannot be left to one party's discretion.",
      "For B2B commercial payment terms, Ley 3/2004 may be relevant; first verify that the transaction falls within its scope and is not a consumer transaction.",
    ],
    references: [
      {
        title: "Código Civil — contratos (arts. 1254-1258)",
        url: "https://www.boe.es/eli/es/rd/1889/07/24/(1)",
        scope: "General Spanish contract principles, including party autonomy, good faith and unilateral discretion.",
      },
      {
        title: "Ley 3/2004 — morosidad en operaciones comerciales",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21830",
        scope: "Commercial payment periods, late-payment interest and recovery costs where the Act applies.",
      },
    ],
  },
  DE: {
    code: "DE",
    name: "Deutschland",
    reviewedAt: "2026-09-20",
    guidance: [
      "For German-law contracts, distinguish individually negotiated terms from standard terms (AGB) before applying AGB review concepts.",
      "BGB §307 is a relevant review anchor for standard terms that may unreasonably disadvantage the other party or lack clarity.",
      "For payment default in transactions without a consumer, BGB §288 contains the statutory default-interest framework and a EUR 40 lump sum; verify scope before comparing contractual terms.",
    ],
    references: [
      {
        title: "BGB §307 — Inhaltskontrolle",
        url: "https://www.gesetze-im-internet.de/bgb/__307.html",
        scope: "Review of standard terms for unreasonable disadvantage and transparency.",
      },
      {
        title: "BGB §288 — Verzugszinsen",
        url: "https://www.gesetze-im-internet.de/bgb/__288.html",
        scope: "Default interest and the EUR 40 lump sum in qualifying non-consumer payment claims.",
      },
    ],
  },
  FR: {
    code: "FR",
    name: "France",
    reviewedAt: "2026-09-20",
    guidance: [
      "For French-law contracts, first determine whether a term is non-negotiable in a contrat d'adhésion before using Code civil art. 1171 as a review anchor.",
      "Code civil art. 1231-5 is relevant when a contract fixes a penalty amount for non-performance; a judge may adjust a manifestly excessive or derisory penalty.",
      "For B2B payment terms, Code de commerce L441-10 may be relevant; verify the transaction and current version before drawing conclusions.",
    ],
    references: [
      {
        title: "Code civil art. 1171",
        url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036829836",
        scope: "Significant imbalance in non-negotiable terms of a contrat d'adhésion.",
      },
      {
        title: "Code civil art. 1231-5",
        url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032010131",
        scope: "Contractual penalty clauses and judicial moderation of manifestly excessive or derisory penalties.",
      },
      {
        title: "Code de commerce L441-10",
        url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000038411055/",
        scope: "Commercial payment periods and late-payment terms where applicable.",
      },
    ],
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    reviewedAt: "2026-09-20",
    guidance: [
      "For UK-law business contracts, identify whether liability exclusions or restrictions and standard written terms fall within the scope of the Unfair Contract Terms Act 1977 before applying its reasonableness framework.",
      "The Late Payment of Commercial Debts (Interest) Act 1998 may be relevant to qualifying commercial debts and contractual remedies for late payment.",
      "Do not apply consumer-law conclusions to a business-to-business contract unless the document and parties support that classification.",
    ],
    references: [
      {
        title: "Unfair Contract Terms Act 1977",
        url: "https://www.legislation.gov.uk/ukpga/1977/50",
        scope: "Business liability, standard terms and reasonableness controls in applicable cases.",
      },
      {
        title: "Late Payment of Commercial Debts (Interest) Act 1998",
        url: "https://www.legislation.gov.uk/ukpga/1998/20",
        scope: "Statutory interest and contractual remedies for qualifying commercial debts.",
      },
    ],
  },
};

export function getJurisdictionProfile(code: string | null | undefined) {
  if (!code) return null;
  return JURISDICTION_PROFILES[code as JurisdictionProfile["code"]] ?? null;
}

export function jurisdictionGuidancePrompt() {
  return Object.values(JURISDICTION_PROFILES)
    .map((profile) => {
      const rules = profile.guidance.map((item) => `- ${item}`).join("\n");
      return `${profile.code} — ${profile.name} (reviewed ${profile.reviewedAt})\n${rules}`;
    })
    .join("\n\n");
}
