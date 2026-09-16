import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync("lib/vonu-check/fraud-atlas.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
}).outputText;

const module = { exports: {} };
const context = {
  module,
  exports: module.exports,
  console,
  Set,
  String,
  Math,
};
vm.runInNewContext(compiled, context, { filename: "fraud-atlas.compiled.cjs" });

const { normaliseFraudAtlasEvidence, scoreFraudAtlasEvidence } = module.exports;

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function ev(id, excerpt, confidence = "high") {
  return { id, excerpt, confidence };
}

const cases = [
  {
    label: "ordinary family bizum has no deterministic high-risk floor",
    text: "Papá, ¿me haces un Bizum de 15 € para cenar?",
    evidence: [
      ev("family_or_close_relation", "Papá"),
      ev("money_request", "me haces un Bizum de 15 €"),
      ev("instant_payment_rail", "Bizum"),
    ],
    expected: 0,
  },
  {
    label: "new family identity plus money",
    text: "Mamá, soy tu hijo. Este es mi número nuevo. Envíame 400 €.",
    evidence: [
      ev("family_or_close_relation", "Mamá, soy tu hijo"),
      ev("identity_discontinuity", "Este es mi número nuevo"),
      ev("money_request", "Envíame 400 €"),
    ],
    expected: 68,
  },
  {
    label: "new family identity plus blocked verification",
    text: "Mamá, soy tu hijo. Este es mi número nuevo. Envíame 400 € ahora. No puedo llamarte.",
    evidence: [
      ev("family_or_close_relation", "Mamá, soy tu hijo"),
      ev("identity_discontinuity", "Este es mi número nuevo"),
      ev("money_request", "Envíame 400 €"),
      ev("urgent_action", "ahora"),
      ev("verification_suppression", "No puedo llamarte"),
    ],
    expected: 84,
  },
  {
    label: "otp disclosure request",
    text: "Dígame el código SMS que acaba de recibir.",
    evidence: [ev("otp_or_mfa_request", "código SMS que acaba de recibir")],
    expected: 82,
  },
  {
    label: "safe account transfer",
    text: "Transfiera el dinero a una cuenta segura para proteger sus fondos.",
    evidence: [ev("protect_funds_transfer", "cuenta segura para proteger sus fondos")],
    expected: 88,
  },
  {
    label: "job upfront fee",
    text: "Trabajo desde casa. Debes pagar un depósito de 100 € para empezar.",
    evidence: [
      ev("job_offer", "Trabajo desde casa"),
      ev("job_upfront_payment", "pagar un depósito de 100 € para empezar"),
    ],
    expected: 76,
  },
  {
    label: "delivery payment link",
    text: "No pudimos entregar el paquete. Pague 1,99 € en este enlace.",
    evidence: [
      ev("delivery_problem", "No pudimos entregar el paquete"),
      ev("money_request", "Pague 1,99 €"),
      ev("payment_link_or_qr", "este enlace"),
    ],
    expected: 70,
  },
  {
    label: "recovery advance fee",
    text: "Recuperamos su dinero perdido. Pague primero 300 € de gastos.",
    evidence: [
      ev("recovery_offer", "Recuperamos su dinero perdido"),
      ev("advance_fee", "Pague primero 300 € de gastos"),
    ],
    expected: 82,
  },
  {
    label: "cash courier",
    text: "Retire el efectivo y entrégueselo al mensajero que irá a su casa.",
    evidence: [ev("cash_courier_pickup", "entrégueselo al mensajero")],
    expected: 92,
  },
];

for (const test of cases) {
  const grounded = normaliseFraudAtlasEvidence(test.evidence, test.text);
  const result = scoreFraudAtlasEvidence(grounded);
  assertEqual(result.score, test.expected, test.label);
}

const hallucinated = normaliseFraudAtlasEvidence(
  [ev("otp_or_mfa_request", "share your secret OTP")],
  "Your appointment is tomorrow at 10:30.",
);
assertEqual(hallucinated.length, 0, "ungrounded excerpt rejected");
assertEqual(scoreFraudAtlasEvidence(hallucinated).score, 0, "ungrounded excerpt cannot raise risk");

console.log(`VONU_FRAUD_ATLAS_CONTRACT_GREEN cases=${cases.length} grounding=1`);
