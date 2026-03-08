export type ThreadMode = "chat" | "tutor";

function normalizeText(s: string) {
  return (s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?¡¿]+/g, "");
}

export function wantsWrittenReply(text: string, threadMode: ThreadMode) {
  const t = normalizeText(text);

  if (!t) return false;
  if (threadMode === "tutor") return true;

  const triggers = [
    "por escrito",
    "escribelo",
    "escribemelo",
    "ponlo por escrito",
    "redactame",
    "redactalo",
    "hazme un email",
    "hazme un correo",
    "escribe un correo",
    "escribe un email",
    "resume",
    "resumen",
    "resumelo",
    "hazme un resumen",
    "explicamelo",
    "paso a paso",
    "apuntes",
    "ejercicios",
    "lista",
    "repaso",
    "traducelo",
    "quiero verlo en texto",
    "quiero que lo escribas",
    "mandamelo escrito",
    "dejamelo escrito",
  ];

  return triggers.some((k) => t.includes(k));
}

export function makeVoiceWriteGuard() {
  let lastRequestedText = "";
  let writeInFlight = false;
  let alreadyGeneratedFor = "";

  return {
    getLastRequestedText() {
      return lastRequestedText;
    },

    setLastRequestedText(text: string) {
      lastRequestedText = (text ?? "").trim();
    },

    shouldGenerate(text: string, threadMode: ThreadMode) {
      const clean = (text ?? "").trim();
      if (!clean) return false;
      if (!wantsWrittenReply(clean, threadMode)) return false;

      const norm = normalizeText(clean);
      if (!norm) return false;

      if (writeInFlight) return false;
      if (alreadyGeneratedFor === norm) return false;

      return true;
    },

    markGenerating(text: string) {
      writeInFlight = true;
      alreadyGeneratedFor = normalizeText(text);
    },

    markFinished() {
      writeInFlight = false;
    },

    reset() {
      lastRequestedText = "";
      writeInFlight = false;
      alreadyGeneratedFor = "";
    },
  };
}