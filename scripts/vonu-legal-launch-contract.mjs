import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const telemetry = read("app/components/FunnelTelemetry.tsx");
const legal = read("app/legal/aviso-legal/page.tsx");
const privacy = read("app/legal/privacidad/page.tsx");
const terms = read("app/legal/terminos/page.tsx");
const cookies = read("app/legal/cookies/page.tsx");
const responsible = read("app/legal/uso-responsable/page.tsx");
const localizedLegal = read("app/components/LocalizedLegalDocument.tsx");
const legalPage = read("app/components/LegalPage.tsx");
const homeHeader = read("app/components/HomeHeader.tsx");
const homeFooter = read("app/components/HomeFooter.tsx");
const publicHeader = read("app/components/GlobalPublicHeader.tsx");
const publicFooter = read("app/components/GlobalPublicFooter.tsx");
const legalRoutes = read("lib/vonu-legal/routes.ts");
const checkout = read("app/api/stripe/checkout/route.ts");
const checkClient = read("app/[locale]/check/CheckClient.tsx");
const submissionNotice = read("app/[locale]/check/SubmissionNotice.tsx");
const resourceSignup = read("app/components/ResourceSignup.tsx");
const subscribeRoute = read("app/api/subscribe/route.ts");
const contactForm = read("app/components/ContactForm.tsx");
const consentVersion = read("lib/vonu-legal/consent.ts");

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
  requireText(source, "20 de septiembre de 2026", `${label} update date`);
  rejectText(source, "<h1", `${label} duplicate legacy hero`);
  rejectText(source, 'bg-[#f5f5f7]', `${label} legacy light legal surface`);
  requireText(source, 'bg-[#0d101b]', `${label} unified legal surface`);
}

rejectText(localizedLegal, "<h1", "localized legal duplicate legacy hero");
rejectText(localizedLegal, 'bg-[#f5f5f7]', "localized legal legacy light surface");
requireText(localizedLegal, 'bg-[#0d101b]', "localized legal unified surface");

requireText(legal, "documentos PDF", "legal document product");
requireText(legal, "firmar o realizar un pago", "legal document decision scope");
requireText(legal, "no certifican", "legal certification limitation");
requireText(legal, "jurídicamente válido", "legal document validity limitation");
requireText(privacy, "OpenAI", "privacy OpenAI disclosure");
requireText(privacy, "Google Gemini", "privacy Gemini disclosure");
requireText(privacy, "URLhaus", "privacy URLhaus disclosure");
requireText(privacy, "RDAP", "privacy RDAP disclosure");
requireText(privacy, "Stripe", "privacy Stripe disclosure");
requireText(privacy, "Supabase", "privacy Supabase disclosure");
requireText(privacy, "Vercel", "privacy Vercel disclosure");
requireText(privacy, "Resend", "privacy Resend disclosure");
requireText(terms, "índice orientativo de riesgo", "terms risk score meaning");
requireText(terms, "índice de prioridad de revisión", "terms document review score meaning");
requireText(terms, "Ninguna de las dos representa una probabilidad matemática", "terms probability limitation");
requireText(terms, "El idioma del documento o de la interfaz no determina por sí solo la jurisdicción", "terms jurisdiction separation");
requireText(terms, "Vonu no garantiza que una cláusula sea válida, inválida, abusiva, exigible o conforme a derecho", "terms legal conclusion limitation");
requireText(terms, "desistimiento", "terms consumer withdrawal");
requireText(responsible, "contraseñas", "responsible secret minimization");
requireText(responsible, "códigos OTP", "responsible OTP minimization");
requireText(responsible, "Documentos, contratos y facturas", "responsible document section");
requireText(responsible, "La jurisdicción se intenta identificar a partir del propio documento, no del idioma", "responsible jurisdiction separation");
requireText(responsible, "Un resultado bajo tampoco garantiza seguridad", "responsible false reassurance guard");
requireText(cookies, "no utiliza Google Analytics ni cookies publicitarias", "cookies current analytics state");
requireText(localizedLegal, "Legal notice", "English legal documents");
requireText(localizedLegal, "Politique de confidentialité", "French legal documents");
requireText(localizedLegal, "Datenschutzerklärung", "German legal documents");
requireText(localizedLegal, "سياسة الخصوصية", "Arabic legal documents");
requireText(localizedLegal, "PDF documents", "English PDF legal coverage");
requireText(localizedLegal, "documents PDF", "French PDF legal coverage");
requireText(localizedLegal, "PDF-Dokumente", "German PDF legal coverage");
requireText(localizedLegal, "مستندات PDF", "Arabic PDF legal coverage");
requireText(legalRoutes, 'return `/${locale}/legal/${document}`', "localized legal routing");
requireText(legalPage, "href={item.href}", "legal document navigation href");
requireText(legalPage, "href={checkPath(locale)}", "legal back-to-check href");
rejectText(legalPage, 'from "next/link"', "legal document navigation must force full-page routing");
rejectText(homeFooter, '<Link scroll={false} href={legalPath', "check footer legal router links");
rejectText(publicFooter, '<Link scroll={false} href={legalPath', "public footer legal router links");
rejectText(submissionNotice, '<Link href={legalPath', "scanner legal router links");
rejectText(resourceSignup, '<Link href={legalPath', "resource privacy router link");
rejectText(contactForm, '<Link href={legalPath', "contact privacy router link");
requireText(homeHeader, "href={localeTarget(item)}", "legal-aware locale switch href");
requireText(publicHeader, "href={localizedPublicPath(item, slug)}", "public locale switch href");
requireText(checkout, "legal_consent_required", "checkout legal consent enforcement");
requireText(checkout, "immediate_performance_requested", "checkout immediate performance evidence");
requireText(checkout, "withdrawal_acknowledged", "checkout withdrawal evidence");
requireText(submissionNotice, "Vonu utiliza IA y comprobaciones automatizadas", "visible AI disclosure");
requireText(submissionNotice, 'legalPath(locale, "terms")', "localized submission terms link");
requireText(submissionNotice, 'legalPath(locale, "privacy")', "localized submission privacy link");
rejectText(checkClient, ">{t.aiNotice}<", "duplicate standalone AI notice");
requireText(resourceSignup, 'legalPath(locale, "privacy")', "localized resource privacy link");
requireText(resourceSignup, "RESOURCE_CONSENT_VERSION", "resource consent version sent");
requireText(resourceSignup, "locale,", "resource consent locale sent");
requireText(subscribeRoute, "consent_at", "resource consent timestamp persisted");
requireText(subscribeRoute, "consent_version", "resource consent version persisted");
requireText(subscribeRoute, "unsubscribed_at", "resource unsubscribe state persisted");
requireText(subscribeRoute, "RESOURCE_CONSENT_VERSION", "resource consent version enforced");
requireText(contactForm, 'legalPath(locale, "privacy")', "localized contact privacy link");
requireText(consentVersion, '2026-09-18-v1', "resource consent wording version");


rejectText(telemetry, "NEXT_PUBLIC_GA_MEASUREMENT_ID", "telemetry Google Analytics disabled");
rejectText(telemetry, "gtag", "telemetry gtag disabled");
rejectText(telemetry, "vonu_locale", "telemetry locale cookie disabled");
requireText(telemetry, 'track(name, data)', "telemetry Vercel analytics");

console.log("VONU_LEGAL_LAUNCH_CONTRACT_GREEN legal=documents+jurisdiction providers=8 privacy=1 analytics=1 checkout_consents=1 ai_transparency=1 resource_consent=1 contact_privacy=1 single_legal_header=1");
