export const FRAUD_ATLAS_EVIDENCE_IDS = [
  "family_or_close_relation",
  "trusted_identity_claim",
  "identity_discontinuity",
  "authority_or_business_impersonation",
  "urgent_action",
  "secrecy_or_isolation",
  "verification_suppression",
  "money_request",
  "instant_payment_rail",
  "third_party_payment",
  "off_platform_move",
  "payment_link_or_qr",
  "advance_fee",
  "otp_or_mfa_request",
  "credential_request",
  "remote_access_request",
  "protect_funds_transfer",
  "guaranteed_return",
  "investment_pitch",
  "fake_balance_or_withdrawal_fee",
  "romantic_grooming",
  "job_offer",
  "job_upfront_payment",
  "invoice_bank_change",
  "delivery_problem",
  "government_threat",
  "refund_or_subscription_claim",
  "prize_claim",
  "rental_deposit_before_viewing",
  "recovery_offer",
  "sexual_blackmail",
  "seed_phrase_or_private_key",
  "wallet_signature_or_approval",
  "inverse_payment_request",
  "overpayment_refund",
  "cash_courier_pickup",
  "utility_cutoff",
] as const;

export type FraudAtlasEvidenceId = (typeof FRAUD_ATLAS_EVIDENCE_IDS)[number];
export type FraudAtlasEvidenceConfidence = "low" | "medium" | "high";

export type FraudAtlasEvidence = {
  id: FraudAtlasEvidenceId;
  confidence: FraudAtlasEvidenceConfidence;
  excerpt: string;
};

export type FraudAtlasScore = {
  score: number;
  confidence: "limited" | "medium" | "high";
  matchedRules: string[];
  evidence: FraudAtlasEvidence[];
};

const evidenceIdSet = new Set<string>(FRAUD_ATLAS_EVIDENCE_IDS);

/**
 * This context deliberately describes behavioural primitives rather than scam
 * scripts. The model should therefore recognise new wording, brands and
 * channels that implement the same manipulation mechanics.
 */
export const FRAUD_ATLAS_PROMPT = `
FRAUD ATLAS — BEHAVIOURAL EVIDENCE
Identify mechanics, not memorised phrases or scam names. A new wording, brand,
country or channel can express the same primitive. Only emit an item when the
USER TEXT itself contains evidence for it. For every item, quote a short EXACT
excerpt from USER TEXT; never paraphrase the excerpt and never infer invisible
context.

POLARITY IS CRITICAL: do NOT emit a risky evidence id when the behaviour is only
mentioned as a warning, prohibition, security tip, quoted scam example or negated
instruction. “Never share the code” is not otp_or_mfa_request. “Do not move money
to a safe account” is not protect_funds_transfer. “We never ask you to install
remote access” is not remote_access_request. The sender must actually request,
encourage, threaten, claim or direct the risky behaviour in the current message.

Evidence ids:
- family_or_close_relation: sender claims to be a child, parent, partner, friend or other close/trusted person.
- trusted_identity_claim: sender claims a specific trusted identity or role relevant to the request.
- identity_discontinuity: claimed trusted person suddenly uses a new number/account/device, has lost access to the usual channel, or says the normal identity channel is broken/lost/unavailable. Temporary inability to talk, by itself, is not identity discontinuity.
- authority_or_business_impersonation: sender claims to represent a bank, company, platform, police, government or other authority.
- urgent_action: explicit pressure to act now/quickly/today or before a short deadline.
- secrecy_or_isolation: asks the target not to tell/call/check with other people or keeps them isolated.
- verification_suppression: prevents or discourages an independent identity check, e.g. says they cannot be called, says not to contact the usual account, or insists on staying in this channel. Mere temporary unavailability without discouraging later verification is weak and should normally be omitted.
- money_request: explicitly asks the target to send/pay/transfer money or value.
- instant_payment_rail: asks to use an instant or hard-to-reverse rail such as Bizum, instant transfer, crypto, gift card or cash.
- third_party_payment: asks to pay a different person, account, phone, wallet or beneficiary from the claimed sender/entity.
- off_platform_move: moves a marketplace/service transaction away from its normal protected payment/chat flow.
- payment_link_or_qr: directs the target to a link/QR to pay, receive money, verify or log in.
- advance_fee: demands a fee/tax/insurance/deposit/unlock payment before receiving money, a prize, job, refund, loan or withdrawal.
- otp_or_mfa_request: asks the target to disclose, forward or approve a one-time code, SMS code, MFA prompt, security token or equivalent temporary digits. It can be described without using the words OTP, SMS or code. A message saying NEVER SHARE a code is not this primitive.
- credential_request: asks for password, PIN, full card details, login credentials or similarly secret authentication data.
- remote_access_request: asks to install or open remote-control/support software, share a screen, enter a remote-support key, or hand over device control.
- protect_funds_transfer: tells the target to move money to a “safe/protected/secure/holding/custody/temporary” account or wallet, or otherwise relocate funds supposedly to isolate/protect them from fraud.
- guaranteed_return: promises guaranteed, risk-free, unusually fast or certain investment profit.
- investment_pitch: asks or persuades the target to invest/trade/deposit into an investment or crypto opportunity.
- fake_balance_or_withdrawal_fee: claims gains/balance exist but requires another payment/tax/fee to withdraw them.
- romantic_grooming: relationship/romantic trust is explicitly used around a financial or sensitive request.
- job_offer: presents paid work, recruitment, task work or a side hustle.
- job_upfront_payment: requires the worker/applicant to pay, deposit or buy a starter kit/training/equipment to start, unlock tasks or receive earnings.
- invoice_bank_change: changes an IBAN/account/payment destination for an invoice, supplier or executive request.
- delivery_problem: claims a parcel, customs or delivery problem requiring action.
- government_threat: authority/police/government threat of arrest, fine, sanction or legal consequence.
- refund_or_subscription_claim: unexpected renewal/charge/refund/cancellation claim used to trigger contact or action.
- prize_claim: says the target won a lottery, prize, grant or giveaway.
- rental_deposit_before_viewing: asks for a housing/rental deposit before a credible viewing/verification.
- recovery_offer: offers to recover previously lost/scammed funds, especially for a fee or access.
- sexual_blackmail: threatens exposure/distribution of intimate material unless the target complies or pays.
- seed_phrase_or_private_key: asks for a wallet seed phrase, recovery words or private key.
- wallet_signature_or_approval: asks for an unexpected wallet signature/approval/permit with financial consequences.
- inverse_payment_request: target expects to receive money but is actually asked to approve/send a payment request.
- overpayment_refund: claims an overpayment and asks the target to send back the difference before funds are irreversibly settled.
- cash_courier_pickup: instructs the target to withdraw cash/valuables and hand them to a courier/person.
- utility_cutoff: threatens imminent electricity/gas/telecom/service cutoff unless payment is made.

Important: a single everyday money request between relatives, a normal Bizum request,
urgency by itself, a new phone number by itself, or an ordinary link by itself must NOT
be treated as a high-risk pattern. Risk comes from corroborating mechanics.
`.trim();

function normaliseForQuote(value: string) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[“”„‟«»‘’‚‛]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function excerptIsGrounded(userText: string, excerpt: string) {
  const haystack = normaliseForQuote(userText);
  const needle = normaliseForQuote(excerpt);
  return needle.length >= 3 && haystack.includes(needle);
}

const NEGATION_SENSITIVE_IDS = new Set<FraudAtlasEvidenceId>([
  "money_request",
  "instant_payment_rail",
  "third_party_payment",
  "off_platform_move",
  "payment_link_or_qr",
  "advance_fee",
  "otp_or_mfa_request",
  "credential_request",
  "remote_access_request",
  "protect_funds_transfer",
  "guaranteed_return",
  "investment_pitch",
  "job_upfront_payment",
  "invoice_bank_change",
  "rental_deposit_before_viewing",
  "seed_phrase_or_private_key",
  "wallet_signature_or_approval",
  "inverse_payment_request",
  "overpayment_refund",
  "cash_courier_pickup",
]);

const SAFETY_NEGATION_PATTERNS = [
  /\bno\s+(?:lo\s+)?(?:hagas|transfieras|muevas|env[ií]es|pagues|compartas|digas|facilites|leas|firmes|instales|aceptes|uses|escanees|abras|conectes|compres|adelantes)\b/i,
  /\bno\s+tienes\s+que\s+(?:pagar|transferir|mover|enviar|compartir|instalar|firmar|comprar|adelantar)\b/i,
  /\bnunca\s+(?:te\s+)?(?:pedir[aá]|pediremos|pedimos|debes)\b/i,
  /\b(?:debes|deber[ií]as)\s+(?:rechazar|ignorar|evitar)\b/i,
  /\bdo\s+not\s+(?:send|transfer|move|pay|share|read|sign|install|accept|use|scan|open|connect|buy)\b/i,
  /\bnever\s+(?:send|transfer|move|pay|share|read|sign|install|accept|use|scan|open|connect|ask)\b/i,
  /\bwill\s+never\s+ask\b/i,
  /\bne\s+(?:transf[eé]rez|payez|partagez|signez|installez|acceptez|utilisez|scannez|ouvrez)\s+pas\b/i,
  /\b(?:niemals|nicht)\s+(?:überweisen|zahlen|teilen|unterschreiben|installieren|akzeptieren|verwenden|scannen|öffnen)\b/i,
];

function sentenceWindow(userText: string, excerpt: string) {
  const haystack = normaliseForQuote(userText);
  const needle = normaliseForQuote(excerpt);
  const index = haystack.indexOf(needle);
  if (index < 0) return "";

  const sentenceStart = Math.max(
    haystack.lastIndexOf(".", index - 1),
    haystack.lastIndexOf("!", index - 1),
    haystack.lastIndexOf("?", index - 1),
    haystack.lastIndexOf("\n", index - 1),
  );
  const candidates = [".", "!", "?", "\n"]
    .map((mark) => haystack.indexOf(mark, index + needle.length))
    .filter((value) => value >= 0);
  const sentenceEnd = candidates.length > 0 ? Math.min(...candidates) : haystack.length;

  return haystack.slice(Math.max(0, sentenceStart + 1), Math.min(haystack.length, sentenceEnd + 1)).trim();
}

function evidenceIsSafetyNegated(id: FraudAtlasEvidenceId, userText: string, excerpt: string) {
  if (!NEGATION_SENSITIVE_IDS.has(id)) return false;
  const window = sentenceWindow(userText, excerpt);
  if (!window) return false;
  return SAFETY_NEGATION_PATTERNS.some((pattern) => pattern.test(window));
}

export function normaliseFraudAtlasEvidence(raw: unknown, userText: string): FraudAtlasEvidence[] {
  if (!Array.isArray(raw)) return [];
  const output: FraudAtlasEvidence[] = [];
  const seen = new Set<string>();

  for (const item of raw.slice(0, 20)) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    const id = typeof candidate.id === "string" ? candidate.id : "";
    const confidence = candidate.confidence;
    const excerpt = typeof candidate.excerpt === "string" ? candidate.excerpt.trim().slice(0, 240) : "";

    if (!evidenceIdSet.has(id)) continue;
    if (confidence !== "low" && confidence !== "medium" && confidence !== "high") continue;
    if (!excerptIsGrounded(userText, excerpt)) continue;
    if (evidenceIsSafetyNegated(id as FraudAtlasEvidenceId, userText, excerpt)) continue;
    if (seen.has(id)) continue;

    seen.add(id);
    output.push({
      id: id as FraudAtlasEvidenceId,
      confidence,
      excerpt,
    });
  }

  return output;
}

export function scoreFraudAtlasEvidence(evidence: FraudAtlasEvidence[]): FraudAtlasScore {
  // Low-confidence model guesses never create a deterministic high-risk floor.
  const reliable = evidence.filter((item) => item.confidence === "medium" || item.confidence === "high");
  const ids = new Set(reliable.map((item) => item.id));
  const highIds = new Set(
    reliable.filter((item) => item.confidence === "high").map((item) => item.id),
  );
  const has = (...wanted: FraudAtlasEvidenceId[]) => wanted.every((id) => ids.has(id));
  const any = (...wanted: FraudAtlasEvidenceId[]) => wanted.some((id) => ids.has(id));

  let score = 0;
  const matchedRules: string[] = [];
  const raise = (floor: number, rule: string) => {
    if (floor > score) score = floor;
    if (!matchedRules.includes(rule)) matchedRules.push(rule);
  };

  // Secrets / account takeover primitives are strong even without a named scam.
  if (has("seed_phrase_or_private_key")) raise(95, "wallet_secret_request");
  if (has("otp_or_mfa_request")) raise(82, "otp_or_mfa_disclosure");
  if (has("credential_request", "authority_or_business_impersonation")) raise(78, "impersonation_credentials");
  if (has("protect_funds_transfer")) raise(88, "safe_account_transfer");
  if (has("cash_courier_pickup")) raise(92, "cash_courier");
  if (has("sexual_blackmail")) raise(90, "sexual_blackmail");

  // Family/close-person impersonation. A normal family Bizum alone is deliberately not enough.
  if (has("family_or_close_relation", "identity_discontinuity", "money_request")) {
    raise(68, "family_new_identity_money");
    if (any("urgent_action", "instant_payment_rail")) raise(76, "family_new_identity_fast_money");
    if (any("verification_suppression", "secrecy_or_isolation", "third_party_payment")) {
      raise(84, "family_new_identity_verification_blocked");
    }
  }
  if (
    has("family_or_close_relation", "money_request") &&
    has("verification_suppression") &&
    any("third_party_payment", "urgent_action", "secrecy_or_isolation")
  ) {
    raise(74, "family_money_verification_suppressed");
  }

  // Bank/business/authority social engineering.
  if (has("remote_access_request", "authority_or_business_impersonation")) {
    raise(90, "trusted_support_remote_access");
  } else if (has("remote_access_request")) {
    raise(70, "remote_access_request");
  }
  if (has("government_threat", "money_request")) raise(84, "government_payment_threat");
  if (has("utility_cutoff", "money_request")) raise(74, "utility_cutoff_payment");
  if (has("invoice_bank_change")) raise(78, "invoice_bank_change");

  // Payment diversion and marketplace mechanics.
  if (has("inverse_payment_request")) raise(76, "inverse_payment_request");
  if (has("advance_fee")) raise(68, "advance_fee");
  if (has("advance_fee") && any("prize_claim", "job_offer", "recovery_offer", "fake_balance_or_withdrawal_fee")) {
    raise(82, "advance_fee_with_premise");
  }
  if (has("off_platform_move", "money_request") && any("payment_link_or_qr", "instant_payment_rail")) {
    raise(68, "off_platform_payment");
  }
  if (has("overpayment_refund")) raise(76, "overpayment_refund");

  // Delivery/payment-link pattern.
  if (has("delivery_problem", "payment_link_or_qr") && has("money_request")) {
    raise(70, "delivery_payment_link");
  } else if (has("delivery_problem", "payment_link_or_qr", "credential_request")) {
    raise(72, "delivery_credential_link");
  }

  // Investment / romance / crypto mechanics.
  if (has("guaranteed_return", "investment_pitch")) {
    raise(76, "guaranteed_investment");
    if (has("money_request")) raise(84, "guaranteed_investment_payment");
  }
  if (has("fake_balance_or_withdrawal_fee")) raise(86, "fake_balance_withdrawal_fee");
  if (has("romantic_grooming", "investment_pitch")) raise(82, "romance_investment");
  if (has("romantic_grooming", "money_request") && any("urgent_action", "advance_fee")) {
    raise(72, "romance_emergency_money");
  }
  if (has("wallet_signature_or_approval") && any("investment_pitch", "payment_link_or_qr", "urgent_action")) {
    raise(82, "unexpected_wallet_approval");
  }

  // Employment, rental, refund and recovery variants.
  if (has("job_offer", "job_upfront_payment")) raise(76, "job_upfront_payment");
  if (has("rental_deposit_before_viewing")) raise(70, "rental_deposit_before_viewing");
  if (has("recovery_offer", "advance_fee")) raise(82, "recovery_advance_fee");
  if (has("refund_or_subscription_claim", "remote_access_request")) raise(86, "refund_remote_access");
  if (has("refund_or_subscription_claim", "credential_request")) raise(78, "refund_credentials");
  if (has("prize_claim", "money_request")) raise(70, "prize_payment");

  // Corroboration raises confidence, not just the number.
  const highEvidenceCount = reliable.filter((item) => item.confidence === "high").length;
  const confidence: "limited" | "medium" | "high" =
    score >= 80 && highEvidenceCount >= 2
      ? "high"
      : score >= 60 && reliable.length >= 2
        ? "medium"
        : "limited";

  // A floor should never be created from only low-confidence evidence.
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    confidence,
    matchedRules,
    evidence,
  };
}
