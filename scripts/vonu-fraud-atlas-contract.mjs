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
    label: "ordinary urgent family bizum still has no deterministic high-risk floor",
    text: "Mamá, hazme un Bizum de 20 € ahora que estoy pagando el súper.",
    evidence: [
      ev("family_or_close_relation", "Mamá"),
      ev("money_request", "hazme un Bizum de 20 €"),
      ev("instant_payment_rail", "Bizum"),
      ev("urgent_action", "ahora"),
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
    label: "known family identity plus third party and blocked verification",
    text: "Mamá, soy Dani. No me llames. Haz un Bizum de 300 € al número de mi compañero.",
    evidence: [
      ev("family_or_close_relation", "Mamá, soy Dani"),
      ev("verification_suppression", "No me llames"),
      ev("money_request", "Haz un Bizum de 300 €"),
      ev("third_party_payment", "al número de mi compañero"),
    ],
    expected: 74,
  },
  {
    label: "temporary family account is identity discontinuity",
    text: "Papá, soy Marta. He perdido el acceso a mi WhatsApp de siempre y uso esta cuenta temporal. Transfiéreme 280 €.",
    evidence: [
      ev("family_or_close_relation", "Papá, soy Marta"),
      ev("identity_discontinuity", "He perdido el acceso a mi WhatsApp de siempre y uso esta cuenta temporal"),
      ev("money_request", "Transfiéreme 280 €"),
    ],
    expected: 68,
  },
  {
    label: "otp disclosure request",
    text: "Dígame el código SMS que acaba de recibir.",
    evidence: [ev("otp_or_mfa_request", "código SMS que acaba de recibir")],
    expected: 82,
  },
  {
    label: "otp semantic variant without code word",
    text: "Léame los seis dígitos que acaban de aparecer en la notificación.",
    evidence: [ev("otp_or_mfa_request", "los seis dígitos que acaban de aparecer en la notificación")],
    expected: 82,
  },
  {
    label: "safe account transfer",
    text: "Transfiera el dinero a una cuenta segura para proteger sus fondos.",
    evidence: [ev("protect_funds_transfer", "cuenta segura para proteger sus fondos")],
    expected: 88,
  },
  {
    label: "safe account semantic variant",
    text: "Mueva el saldo al IBAN temporal de custodia para aislar sus fondos.",
    evidence: [ev("protect_funds_transfer", "IBAN temporal de custodia para aislar sus fondos")],
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
    label: "job starter kit variant",
    text: "Puesto remoto aprobado. Debes comprar el kit de incorporación de 59 € para empezar.",
    evidence: [
      ev("job_offer", "Puesto remoto aprobado"),
      ev("job_upfront_payment", "comprar el kit de incorporación de 59 € para empezar"),
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
    label: "delivery qr payment variant",
    text: "Su envío está retenido. Escanee el QR y pague 2,37 € de gestión.",
    evidence: [
      ev("delivery_problem", "Su envío está retenido"),
      ev("payment_link_or_qr", "Escanee el QR"),
      ev("money_request", "pague 2,37 € de gestión"),
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
    label: "remote support semantic variant",
    text: "Somos de soporte. Abra Asistencia rápida y acepte que tomemos el control del equipo.",
    evidence: [
      ev("authority_or_business_impersonation", "Somos de soporte"),
      ev("remote_access_request", "acepte que tomemos el control del equipo"),
    ],
    expected: 90,
  },
  {
    label: "invoice bank change",
    text: "Para la factura pendiente ignore el IBAN habitual y pague en la nueva cuenta indicada.",
    evidence: [ev("invoice_bank_change", "ignore el IBAN habitual y pague en la nueva cuenta indicada")],
    expected: 78,
  },
  {
    label: "unexpected wallet approval",
    text: "Conecte su wallet y firme ahora la autorización para reclamar el airdrop.",
    evidence: [
      ev("wallet_signature_or_approval", "firme ahora la autorización"),
      ev("urgent_action", "ahora"),
    ],
    expected: 82,
  },
  {
    label: "overpayment refund",
    text: "Te mandé 650 € en vez de 450 €. Devuélveme ahora los 200 € de diferencia.",
    evidence: [ev("overpayment_refund", "Devuélveme ahora los 200 € de diferencia")],
    expected: 76,
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

const lowConfidence = normaliseFraudAtlasEvidence(
  [ev("cash_courier_pickup", "entrégueselo al mensajero", "low")],
  "Retire el efectivo y entrégueselo al mensajero.",
);
assertEqual(scoreFraudAtlasEvidence(lowConfidence).score, 0, "low-confidence evidence cannot create a deterministic floor");

const negatedCases = [
  {
    label: "safe-account safety advice",
    text: "Aviso de seguridad: si alguien te pide mover tus ahorros a una cuenta segura, no lo hagas.",
    evidence: ev("protect_funds_transfer", "mover tus ahorros a una cuenta segura"),
  },
  {
    label: "otp disclosure with clitic negation",
    text: "No me leas los seis dígitos que acaban de aparecer en la notificación del móvil.",
    evidence: ev("otp_or_mfa_request", "los seis dígitos que acaban de aparecer en la notificación del móvil"),
  },
  {
    label: "release fee explicitly absent",
    text: "La venta ya está pagada. No tienes que abonar ninguna tasa para que la plataforma libere los 380 € a tu cuenta.",
    evidence: ev("fake_balance_or_withdrawal_fee", "abonar ninguna tasa para que la plataforma libere los 380 €"),
  },
  {
    label: "cash courier with clitic negation",
    text: "Por seguridad, no retires efectivo ni se lo entregues al mensajero que irá a tu casa.",
    evidence: ev("cash_courier_pickup", "se lo entregues al mensajero"),
  },
];

for (const test of negatedCases) {
  const grounded = normaliseFraudAtlasEvidence([test.evidence], test.text);
  assertEqual(grounded.length, 0, `${test.label} rejected`);
  assertEqual(scoreFraudAtlasEvidence(grounded).score, 0, `${test.label} cannot raise risk`);
}

console.log(`VONU_FRAUD_ATLAS_CONTRACT_GREEN cases=${cases.length} grounding=1 low_confidence=1 negation=${negatedCases.length}`);
