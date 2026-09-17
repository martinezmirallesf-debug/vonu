import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const telemetry = read("app/components/FunnelTelemetry.tsx");
const legal = read("app/legal/aviso-legal/page.tsx");
const privacy = read("app/legal/privacidad/page.tsx");
const terms = read("app/legal/terminos/page.tsx");
const cookies = read("app/legal/cookies/page.tsx");
const responsible = read("app/legal/uso-responsable/page.tsx");

function requireText(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

function rejectText(source, needle, label) {
  if (source.includes(needle)) throw new Error(`${label}: forbidden ${JSON.stringify(needle)}`);
}

for (const [source, label] of [
  [legal, "legal notice"],
  [privacy, "privacy"],
  [terms, "terms"],
  [cookies, "cookies"],
  [responsible, "responsible use"],
]) {
  rejectText(source, "VonuAI", `${label} obsolete brand`);
  requireText(source, "16 de septiembre de 2026", `${label} update date`);
}

requireText(legal, "mensajes, capturas de pantalla, enlaces y sitios web", "legal current product");
requireText(legal, "índice de riesgo orientativo", "legal score limitation");
requireText(privacy, "OpenAI", "privacy OpenAI disclosure");
requireText(privacy, "Google Gemini", "privacy Gemini disclosure");
requireText(privacy, "URLhaus", "privacy URLhaus disclosure");
requireText(privacy, "RDAP", "privacy RDAP disclosure");
requireText(privacy, "Stripe", "privacy Stripe disclosure");
requireText(privacy, "Supabase", "privacy Supabase disclosure");
requireText(privacy, "Vercel", "privacy Vercel disclosure");
requireText(privacy, "Resend", "privacy Resend disclosure");
requireText(terms, "índice de riesgo", "terms score meaning");
requireText(terms, "no representa una probabilidad matemática", "terms probability limitation");
requireText(terms, "desistimiento", "terms consumer withdrawal");
requireText(responsible, "contraseñas", "responsible secret minimization");
requireText(responsible, "códigos OTP", "responsible OTP minimization");
requireText(responsible, "Un resultado bajo tampoco garantiza seguridad", "responsible false reassurance guard");
requireText(cookies, "no utiliza Google Analytics ni cookies publicitarias", "cookies current analytics state");

rejectText(telemetry, "NEXT_PUBLIC_GA_MEASUREMENT_ID", "telemetry Google Analytics disabled");
rejectText(telemetry, "gtag", "telemetry gtag disabled");
rejectText(telemetry, "vonu_locale", "telemetry locale cookie disabled");
requireText(telemetry, 'track(name, data)', "telemetry Vercel analytics");

console.log("VONU_LEGAL_LAUNCH_CONTRACT_GREEN legal=5 providers=8 privacy=1 analytics=1");
