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
  rentalGuidance?: string[];
  rentalReferences?: JurisdictionReference[];
  rentalRegionRequirement?: string;
  statusWarnings?: string[];
};

export const JURISDICTION_PROFILES: Record<JurisdictionProfile["code"], JurisdictionProfile> = {
  ES: {
    code: "ES",
    name: "España",
    reviewedAt: "2026-10-06",
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
    rentalGuidance: [
      "For Spanish residential rentals, use the consolidated Ley 29/1994 de Arrendamientos Urbanos (LAU) as the primary verified national anchor and first distinguish vivienda habitual from other uses.",
      "LAU art. 36 currently requires a cash deposit equivalent to one month of rent for residential housing; additional guarantees and regional deposit-registration duties require separate scope checks.",
      "LAU art. 18 governs annual rent updates. Check the actual clause, contract date and current statutory reference rules before stating what increase can be applied.",
      "Autonomous-community civil law, deposit rules, housing measures and declared stressed-market areas can materially change the analysis. If the autonomous community or relevant local status is unclear, state that the national review is incomplete.",
      "Do not treat a temporary, seasonal or room rental as habitual housing merely because the document is in Spanish. Classify the use and legal regime from the document and facts.",
    ],
    rentalReferences: [
      {
        title: "Ley 29/1994 de Arrendamientos Urbanos — texto consolidado",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003",
        scope: "Current national framework for Spanish urban leases; BOE consolidated text reviewed 2026-10-06.",
      },
      {
        title: "Ley 12/2023 por el derecho a la vivienda",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203",
        scope: "Housing framework including stressed-market concepts and large-landlord rules where applicable.",
      },
    ],
    statusWarnings: [
      "CRITICAL CURRENT-LAW NOTE (Spain, reviewed 2026-10-06): Real Decreto-ley 26/2026 and Real Decreto-ley 27/2026 of 29 September 2026 were both repealed by Congress on 2 October 2026. Their changes must NOT be applied as current law.",
      "The Spanish Government approved replacement housing decrees on 6 October 2026. Do not apply their announced measures until the exact official BOE text, entry into force and applicable parliamentary status have been verified and added to this profile.",
    ],
  },
  DE: {
    code: "DE",
    name: "Deutschland",
    reviewedAt: "2026-10-06",
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
    rentalGuidance: [
      "For German residential leases, identify whether the agreement is Wohnraummiete and whether any special category or exception applies before using residential tenancy rules.",
      "BGB §551 limits a tenant security deposit to three months of net rent excluding operating-cost advances and allows payment in instalments; verify whether the requested security falls within this rule.",
      "BGB §556d can limit the initial rent to at most 10% above the local comparative rent only in an area formally designated as a tight housing market and subject to statutory exceptions. Never apply this limit without checking location and exceptions.",
      "Rent increases, operating costs, termination and fixed-term clauses have separate statutory requirements. Flag the contractual effect and the relevant section for verification rather than declaring a clause invalid from wording alone.",
    ],
    rentalReferences: [
      {
        title: "BGB §551 — Begrenzung und Anlage von Mietsicherheiten",
        url: "https://www.gesetze-im-internet.de/bgb/__551.html",
        scope: "Residential tenancy deposit amount and payment rules.",
      },
      {
        title: "BGB §556d — Zulässige Miethöhe bei Mietbeginn",
        url: "https://www.gesetze-im-internet.de/bgb/__556d.html",
        scope: "Initial-rent limit in formally designated tight housing markets, subject to statutory scope and exceptions.",
      },
      {
        title: "Bürgerliches Gesetzbuch — Mietrecht",
        url: "https://www.gesetze-im-internet.de/bgb/BJNR001950896.html",
        scope: "Official current BGB text for tenancy duration, rent, operating costs and termination rules.",
      },
    ],
  },
  FR: {
    code: "FR",
    name: "France",
    reviewedAt: "2026-10-06",
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
    rentalGuidance: [
      "For a French residential lease, first determine whether the property is the tenant's principal residence and whether it is furnished (meublé) or unfurnished, because duration, deposit and other rules differ.",
      "Loi n° 89-462 art. 3 sets mandatory lease information for covered residential leases. Missing or inconsistent required information should be flagged for verification.",
      "For an unfurnished principal-residence lease covered by art. 22, the security deposit is generally capped at one month of rent excluding charges. Furnished leases can follow a different cap, so classify the lease before applying a number.",
      "Notice, rent review, local rent-control rules and energy-performance restrictions depend on the lease type, location and date. Do not generalise a Paris or zone-tendue rule to all of France.",
    ],
    rentalReferences: [
      {
        title: "Loi n° 89-462 du 6 juillet 1989 — Article 3",
        url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039369598",
        scope: "Mandatory information in covered residential leases.",
      },
      {
        title: "Loi n° 89-462 — Article 22",
        url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028806696",
        scope: "Security deposit rules for covered unfurnished principal-residence leases.",
      },
      {
        title: "Loi n° 89-462 — texte en vigueur",
        url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509310/",
        scope: "Official current residential tenancy statute and its furnished/unfurnished regimes.",
      },
    ],
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    reviewedAt: "2026-10-06",
    guidance: [
      "For UK-law business contracts, identify the constituent jurisdiction and contract type before applying statutory rules; England and Wales, Scotland and Northern Ireland can differ.",
      "For England-and-Wales business contracts, liability exclusions or restrictions and standard written terms may fall within the Unfair Contract Terms Act 1977; verify scope before using its reasonableness framework.",
      "The Late Payment of Commercial Debts (Interest) Act 1998 may be relevant to qualifying commercial debts; verify the transaction and territorial scope before comparing remedies.",
    ],
    references: [
      {
        title: "Unfair Contract Terms Act 1977",
        url: "https://www.legislation.gov.uk/ukpga/1977/50",
        scope: "Business liability and reasonableness controls where the Act applies.",
      },
      {
        title: "Late Payment of Commercial Debts (Interest) Act 1998",
        url: "https://www.legislation.gov.uk/ukpga/1998/20",
        scope: "Statutory interest and remedies for qualifying commercial debts.",
      },
    ],
    rentalGuidance: [
      "RENTAL SCOPE WARNING: the verified rental anchors in this profile are for ENGLAND only. Do not apply them to Wales, Scotland or Northern Ireland. Require document evidence that the property or tenancy is in England before using them.",
      "From 1 May 2026, the Renters' Rights Act 2025 changed the assured private-rented tenancy system in England, including the move of most assured tenancies to periodic tenancies. Verify tenancy category and any statutory exclusion before applying this.",
      "England has government-approved tenancy-deposit protection requirements for covered deposits. Identify the tenancy type, deposit amount and scheme information before flagging compliance.",
      "Rent increases and possession grounds under the post-1-May-2026 English regime have specific processes. Describe the clause and compare only when the tenancy is confirmed to be within the English assured-tenancy regime.",
    ],
    rentalReferences: [
      {
        title: "Renters' Rights Act 2025 — tenant overview",
        url: "https://www.gov.uk/guidance/renters-rights-act-overview-for-tenants",
        scope: "Official England guidance on private-rental changes applying from 1 May 2026.",
      },
      {
        title: "Renters' Rights Act 2025",
        url: "https://www.legislation.gov.uk/ukpga/2025/26",
        scope: "Primary legislation; relevant commencement and tenancy scope must be checked.",
      },
      {
        title: "Tenancy deposit protection",
        url: "https://www.gov.uk/tenancy-deposit-protection",
        scope: "Government guidance on protected tenancy deposits.",
      },
    ],
    rentalRegionRequirement: "England",
  },
};

export function getJurisdictionProfile(code: string | null | undefined) {
  if (!code) return null;
  return JURISDICTION_PROFILES[code as JurisdictionProfile["code"]] ?? null;
}

export function jurisdictionProfileAppliesToRental(
  profile: JurisdictionProfile,
  jurisdictionText: string,
) {
  if (!profile.rentalRegionRequirement) return true;
  return jurisdictionText.toLowerCase().includes(profile.rentalRegionRequirement.toLowerCase());
}

export function referencesForDocument(
  profile: JurisdictionProfile,
  kind: string,
  jurisdictionText = "",
) {
  if (kind !== "rental_contract") return profile.references;
  if (!jurisdictionProfileAppliesToRental(profile, jurisdictionText)) return [];
  return profile.rentalReferences ?? [];
}

export function jurisdictionGuidancePrompt() {
  return Object.values(JURISDICTION_PROFILES)
    .map((profile) => {
      const general = profile.guidance.map((item) => `- GENERAL: ${item}`).join("\n");
      const rental = (profile.rentalGuidance ?? [])
        .map((item) => `- RENTAL: ${item}`)
        .join("\n");
      const warnings = (profile.statusWarnings ?? [])
        .map((item) => `- STATUS: ${item}`)
        .join("\n");
      return `${profile.code} — ${profile.name} (reviewed ${profile.reviewedAt})\n${general}${rental ? `\n${rental}` : ""}${warnings ? `\n${warnings}` : ""}`;
    })
    .join("\n\n");
}
