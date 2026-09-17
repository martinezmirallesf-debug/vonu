import { readFile } from "node:fs/promises";

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

function requireText(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

const [controller, polish, layout] = await Promise.all([
  read("app/components/CheckExperienceController.tsx"),
  read("app/check-experience-polish.css"),
  read("app/layout.tsx"),
]);

requireText(controller, 'previousFetch("/api/check/entitlement"', "live entitlement refresh");
requireText(controller, 'data-vonu-entitlement-status', "balance status target");
requireText(controller, 'creditsRemaining > 0', "remaining-credit balance");
requireText(controller, 'noneAvailable', "exhausted balance");
requireText(controller, 'const exhausted = Boolean(snapshot?.freeUsed)', "conversion paywall state");
requireText(controller, 'conversion.style.display', "hide irrelevant purchase nudge");
requireText(controller, 'subjectModeByLabel', "analysed subject mode mapping");
requireText(controller, 'applyInconclusivePolish', "inconclusive result polish");
requireText(controller, 'checkedUrl', "unavailable URL semantics");
requireText(controller, 'noScore', "inconclusive no-score disclosure");

for (const marker of [
  "1 análisis gratuito disponible",
  "1 free analysis available",
  "1 analyse gratuite disponible",
  "1 kostenlose Analyse verfügbar",
  "تحليل مجاني واحد متاح",
]) requireText(controller, marker, "localized free balance");

for (const mode of ["url", "capture", "text"]) {
  requireText(polish, `data-vonu-subject-mode=\"${mode}\"`, `${mode} subject icon`);
}
requireText(polish, "width: 20px", "subject icon width parity");
requireText(polish, "height: 20px", "subject icon height parity");
requireText(layout, 'import "./check-experience-polish.css"', "global check polish stylesheet");
requireText(layout, "<CheckExperienceController />", "global check experience controller");

console.log("VONU_CHECK_EXPERIENCE_CONTRACT_GREEN locales=5 balance=live icons=parity inconclusive=precise conversion=entitlement-aware");
