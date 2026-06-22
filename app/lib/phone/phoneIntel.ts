import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export type PhoneRiskLevel = "low" | "medium" | "high" | "critical";

export type PhoneIntelResult = {
  raw: string;
  normalizedInput: string;
  e164: string | null;
  masked: string | null;
  country: string | null;
  countryCallingCode: string | null;
  nationalNumber: string | null;
  internationalFormat: string | null;
  nationalFormat: string | null;
  type: string | null;
  typeLabel: string;
  isPossible: boolean;
  isValid: boolean;
  prefixBucket: string | null;
  riskScore: number;
  riskLevel: PhoneRiskLevel;
  technicalSignals: string[];
  userSafeSummary: string;
};

const PHONE_TYPE_LABELS: Record<string, string> = {
  FIXED_LINE: "fijo",
  MOBILE: "móvil",
  FIXED_LINE_OR_MOBILE: "fijo o móvil",
  TOLL_FREE: "gratuito / atención",
  PREMIUM_RATE: "tarificación especial / premium",
  SHARED_COST: "coste compartido",
  VOIP: "VoIP / internet",
  PERSONAL_NUMBER: "número personal",
  PAGER: "busca",
  UAN: "número universal",
  VOICEMAIL: "buzón de voz",
  UNKNOWN: "desconocido",
};

function cleanPhoneInput(value: string) {
  return String(value ?? "")
    .trim()
    .replace(/[^\d+]/g, "");
}

function normalizeDefaultCountry(value?: string | null): CountryCode {
  const raw = String(value ?? "ES").trim().toUpperCase();

  if (/^[A-Z]{2}$/.test(raw)) {
    return raw as CountryCode;
  }

  return "ES";
}

function maskE164(e164: string | null) {
  if (!e164) return null;

  const clean = e164.replace(/[^\d+]/g, "");
  const digits = clean.replace(/\D/g, "");

  if (digits.length <= 5) {
    return clean.slice(0, 3) + "***";
  }

  const prefix = clean.startsWith("+")
    ? "+" + digits.slice(0, Math.min(2, digits.length))
    : digits.slice(0, 2);

  const last = digits.slice(-3);

  return `${prefix} *** *** ${last}`;
}

function getPrefixBucket(e164: string | null) {
  if (!e164) return null;

  const digits = e164.replace(/\D/g, "");
  if (digits.length < 5) return null;

  // Bucket prudente: país + primeros dígitos, sin identificar número completo.
  // Ejemplo España móvil: +34 6xx -> +346
  // Ejemplo fijo Madrid: +34 91x -> +3491
  if (digits.startsWith("34")) {
    const afterCountry = digits.slice(2);
    if (afterCountry.startsWith("6") || afterCountry.startsWith("7")) {
      return `+34${afterCountry.slice(0, 1)}`;
    }

    return `+34${afterCountry.slice(0, 2)}`;
  }

  return `+${digits.slice(0, Math.min(4, digits.length))}`;
}

function riskLevelFromScore(score: number): PhoneRiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function analyzePhoneNumber(
  rawPhone: string,
  options?: {
    defaultCountry?: string | null;
  }
): PhoneIntelResult {
  const raw = String(rawPhone ?? "");
  const normalizedInput = cleanPhoneInput(raw);
  const defaultCountry = normalizeDefaultCountry(options?.defaultCountry);

  const technicalSignals: string[] = [];

  if (!normalizedInput) {
    return {
      raw,
      normalizedInput,
      e164: null,
      masked: null,
      country: null,
      countryCallingCode: null,
      nationalNumber: null,
      internationalFormat: null,
      nationalFormat: null,
      type: null,
      typeLabel: "desconocido",
      isPossible: false,
      isValid: false,
      prefixBucket: null,
      riskScore: 45,
      riskLevel: "medium",
      technicalSignals: ["No se ha podido leer un número de teléfono claro."],
      userSafeSummary:
        "No he podido leer un número claro. Conviene revisar si está completo y añadir el contexto de la llamada o mensaje.",
    };
  }

  const phone = parsePhoneNumberFromString(normalizedInput, defaultCountry);

  if (!phone) {
    return {
      raw,
      normalizedInput,
      e164: null,
      masked: null,
      country: null,
      countryCallingCode: null,
      nationalNumber: null,
      internationalFormat: null,
      nationalFormat: null,
      type: null,
      typeLabel: "desconocido",
      isPossible: false,
      isValid: false,
      prefixBucket: null,
      riskScore: 55,
      riskLevel: "medium",
      technicalSignals: [
        "El número no se ha podido interpretar con formato telefónico estándar.",
      ],
      userSafeSummary:
        "El número no se interpreta bien. Eso no prueba una estafa, pero sí es motivo para no devolver llamadas ni compartir datos sin más contexto.",
    };
  }

  const e164 = phone.number || null;
  const isPossible = phone.isPossible();
  const isValid = phone.isValid();
  const country = phone.country ?? null;
  const countryCallingCode = phone.countryCallingCode ?? null;
  const nationalNumber = phone.nationalNumber ?? null;
  const type = phone.getType?.() ?? "UNKNOWN";
  const typeLabel = PHONE_TYPE_LABELS[type] ?? "desconocido";

  let score = 15;

  if (isPossible) {
    technicalSignals.push("El número tiene una estructura telefónica posible.");
  } else {
    score += 35;
    technicalSignals.push("La estructura del número no parece posible.");
  }

  if (isValid) {
    technicalSignals.push("El número encaja con reglas conocidas de numeración.");
  } else {
    score += 25;
    technicalSignals.push("El número no aparece como válido según reglas de numeración.");
  }

  if (country) {
    technicalSignals.push(`País detectado: ${country}.`);
  }

  if (countryCallingCode) {
    technicalSignals.push(`Prefijo internacional detectado: +${countryCallingCode}.`);
  }

  if (type && type !== "UNKNOWN") {
    technicalSignals.push(`Tipo detectado: ${typeLabel}.`);
  } else {
    score += 10;
    technicalSignals.push("No se ha podido determinar claramente el tipo de número.");
  }

  if (type === "PREMIUM_RATE") {
    score += 55;
    technicalSignals.push("El número parece de tarificación especial/premium.");
  }

  if (type === "VOIP") {
    score += 25;
    technicalSignals.push("El número parece VoIP/internet, algo habitual en usos legítimos pero también en abuso telefónico.");
  }

  if (type === "SHARED_COST") {
    score += 25;
    technicalSignals.push("El número parece de coste compartido.");
  }

  if (type === "TOLL_FREE") {
    score += 5;
    technicalSignals.push("El número parece gratuito o de atención.");
  }

  if (country && country !== defaultCountry) {
    score += 10;
    technicalSignals.push(
      `El país detectado (${country}) no coincide con el país por defecto usado (${defaultCountry}).`
    );
  }

  const riskScore = clampScore(score);
  const riskLevel = riskLevelFromScore(riskScore);

  const masked = maskE164(e164);
  const prefixBucket = getPrefixBucket(e164);

  const userSafeSummary =
    riskLevel === "critical" || riskLevel === "high"
      ? "Por las señales técnicas, conviene tratar este número con bastante precaución y no compartir códigos, datos ni dinero."
      : riskLevel === "medium"
        ? "Hay algunas señales técnicas que conviene revisar, pero el contexto de la llamada o mensaje será clave."
        : "A nivel técnico no se ve una señal fuerte solo por el número, pero el contexto sigue siendo lo más importante.";

  return {
    raw,
    normalizedInput,
    e164,
    masked,
    country,
    countryCallingCode,
    nationalNumber,
    internationalFormat: phone.formatInternational?.() ?? null,
    nationalFormat: phone.formatNational?.() ?? null,
    type,
    typeLabel,
    isPossible,
    isValid,
    prefixBucket,
    riskScore,
    riskLevel,
    technicalSignals,
    userSafeSummary,
  };
}