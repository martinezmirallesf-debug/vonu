import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import LegalPage from "./LegalPage";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import type { LegalDocument } from "@/lib/vonu-legal/routes";

type Section = { title: string; paragraphs?: string[]; items?: string[] };
type DocCopy = {
  title: string;
  description: string;
  eyebrow: string;
  hero: string;
  updatedAt: string;
  sections: Section[];
};

type LocalizedLocale = Exclude<SupportedLocale, "es">;

const IDENTITY = {
  en: "Francisco Luis Martínez Miralles, NIF 74235561W, Calle Velarde 55, 03203 Elche, Alicante, Spain.",
  fr: "Francisco Luis Martínez Miralles, NIF 74235561W, Calle Velarde 55, 03203 Elche, Alicante, Espagne.",
  de: "Francisco Luis Martínez Miralles, NIF 74235561W, Calle Velarde 55, 03203 Elche, Alicante, Spanien.",
  ar: "Francisco Luis Martínez Miralles، رقم التعريف الضريبي NIF 74235561W، Calle Velarde 55، 03203 Elche، Alicante، إسبانيا.",
} as const;

const UPDATED: Record<LocalizedLocale, string> = {
  en: "Last updated: 18 September 2026",
  fr: "Dernière mise à jour : 18 septembre 2026",
  de: "Letzte Aktualisierung: 18. September 2026",
  ar: "آخر تحديث: 18 سبتمبر 2026",
};

const DOCS: Record<LocalizedLocale, Record<LegalDocument, DocCopy>> = {
  en: {
    "legal-notice": {
      title: "Legal notice",
      description: "Who provides Vonu, what the service does and the essential legal limits of its use.",
      eyebrow: "Legal",
      hero: "Clear information about who operates Vonu and how the service should be used.",
      updatedAt: UPDATED.en,
      sections: [
        { title: "1. Service provider", paragraphs: [`Vonu and vonuai.com are operated by ${IDENTITY.en}`, "General contact: hello@vonuai.com. Legal matters: legal@vonuai.com. Privacy matters: privacy@vonuai.com."] },
        { title: "2. Purpose of Vonu", paragraphs: ["Vonu is a preventive checking tool for reviewing messages, screenshots, links and websites before a user trusts, replies, shares data or makes a payment.", "Results combine automated analysis, artificial intelligence, internal rules and, for some links, technical or reputation checks. They are guidance based on available signals, not a certification that a person, company, message or website is legitimate or fraudulent."] },
        { title: "3. Lawful and responsible use", paragraphs: ["You must use Vonu lawfully, in good faith and without infringing third-party rights. The service must not be used to commit fraud, impersonate others, obtain credentials, attack systems, harass people or facilitate unlawful activity."] },
        { title: "4. AI and service limitations", paragraphs: ["Vonu uses AI and automated checks. These systems can make mistakes, lack context or miss new threats. A low score is not a guarantee of safety and a high score is not proof of a crime or fraud.", "For sensitive decisions, independently verify through an official channel. In urgent situations involving money, account compromise, threats or safety, also contact the relevant bank, platform, professional or authority."] },
        { title: "5. Intellectual property", paragraphs: ["The Vonu brand, software, design, original texts, internal rules and visual elements are protected by applicable intellectual-property rules. Users retain the rights they have in content they submit and only authorise the processing necessary to provide the requested service."] },
        { title: "6. Third-party services", paragraphs: ["Some functions depend on infrastructure, payment, AI, email, domain-registration or threat-intelligence providers. Vonu does not control their permanent availability and cannot guarantee that external data is always complete or current."] },
        { title: "7. Liability", paragraphs: ["Vonu takes reasonable measures to provide useful and understandable results but does not guarantee absolute accuracy, uninterrupted availability or error-free operation. Nothing in this notice excludes mandatory consumer rights or liability that cannot legally be excluded."] },
        { title: "8. Applicable law and consumers", paragraphs: ["The service is managed from Spain. Spanish law applies where appropriate, without prejudice to mandatory consumer protections and jurisdiction rules in the consumer's country of residence."] },
        { title: "9. Complaints and contact", paragraphs: ["For legal questions or complaints, contact legal@vonuai.com. For service support, contact hello@vonuai.com. We aim to respond through a written channel that allows the request and response to be documented."] },
        { title: "10. Updates", paragraphs: ["This notice may be updated to reflect product, provider or legal changes. The current version and its date are published on this page."] },
      ],
    },
    privacy: {
      title: "Privacy policy",
      description: "How Vonu processes submitted content, device identifiers, payments, analytics and product events.",
      eyebrow: "Privacy",
      hero: "What Vonu receives, why it is needed and what control you have over your data.",
      updatedAt: UPDATED.en,
      sections: [
        { title: "1. Controller", paragraphs: [`The data controller is ${IDENTITY.en}`, "Contact: privacy@vonuai.com."] },
        { title: "2. Data we may process", items: ["Content submitted for a check: text, messages, screenshots, images, URLs and visible data contained in them.", "Technical analysis data: check type, detected signals, risk score or band, timing, status and public technical data about a domain.", "A random pseudonymous device identifier used to apply the free-use limit and purchased credits.", "Contact or newsletter data when you voluntarily send a form or request updates.", "Payment and transaction identifiers supplied by Stripe; Vonu does not need to store full card numbers.", "Aggregated analytics data such as pages, referrers, country or approximate region, browser/device type and privacy-safe product events."] },
        { title: "3. Purposes and legal bases", paragraphs: ["We process data to provide the requested check, maintain device credits, process purchases, answer support requests, prevent abuse, secure and diagnose the service, measure product performance and comply with legal, accounting or tax duties.", "Depending on the context, the legal basis may be performance of the service or contract, pre-contractual measures, consent, compliance with a legal obligation or legitimate interests in security and product improvement after considering user rights."] },
        { title: "4. Artificial intelligence", paragraphs: ["Text or image checks may be processed by AI providers such as OpenAI and Google, depending on the active function and configuration. Vonu asks these systems for structured risk analysis and applies its own calibration rules.", "The result is preventive guidance. It is not an automated decision producing legal or similarly significant effects on the user."] },
        { title: "5. Links and external technical checks", paragraphs: ["When you submit a URL, Vonu may fetch the page and query external services such as URLhaus or public RDAP services. Do not submit URLs containing passwords, private tokens or secret parameters unless strictly necessary."] },
        { title: "6. Device access without an account", paragraphs: ["Vonu Check can be used without an account. A first-party technical cookie named vonu_device_id stores a random identifier. It does not contain your name, email or submitted content.", "Deleting browser data, using private browsing or changing browser/device may prevent Vonu from recognising previous credits."] },
        { title: "7. Payments", paragraphs: ["Payments are processed by Stripe. Vonu sends only the minimum operational metadata needed to associate the purchase with the device and grant credits. Stripe may process contact, billing, anti-fraud and payment information under its own legal responsibilities and terms."] },
        { title: "8. Providers", items: ["Vercel: hosting, execution, Web Analytics and performance measurement.", "Supabase: database and backend functions.", "OpenAI and Google: AI processing where enabled.", "Stripe: payment processing, receipts and payment-fraud prevention.", "Resend: delivery of contact-related email.", "abuse.ch/URLhaus and public RDAP services: technical threat intelligence and domain data for relevant URL checks."] },
        { title: "9. International transfers", paragraphs: ["Some technology providers may process data outside the European Economic Area. Where applicable, transfers must rely on a recognised adequacy decision or appropriate safeguards such as the European Commission's Standard Contractual Clauses, together with any additional measures required by law."] },
        { title: "10. Retention", paragraphs: ["We keep data only for as long as needed for its purpose and applicable legal duties. The device cookie is designed for a maximum technical lifetime of around one year unless deleted earlier. Transaction and invoicing records are retained for legally required periods.", "Submitted content is processed to generate the requested result. It is not sent to product analytics as raw text, image or full analysed URL. Where an operational security or quality function stores a masked or derived report, it is limited to the purpose for which that function is enabled and should not contain unnecessary secrets."] },
        { title: "11. Analytics and product events", paragraphs: ["Vercel Web Analytics is used for aggregated traffic and product measurement without third-party analytics cookies. Vonu may measure page, referrer, country/region, device/browser and events such as analysis mode, language, risk band, category, duration, success or error.", "Vonu does not intentionally include the submitted message, screenshot, email address or full analysed URL as an analytics property."] },
        { title: "12. Sensitive data, third-party data and minors", paragraphs: ["Do not submit passwords, OTP codes, PINs, full card details, full identity documents, unnecessary medical data or other secrets. Mask unrelated third-party data in screenshots.", "If a minor uses Vonu, a parent or legal guardian should supervise where required by applicable law. Vonu is not intended to knowingly collect unnecessary personal data from children, and minors should not make purchases without the legally required authorisation."] },
        { title: "13. Your rights", paragraphs: ["Where applicable you may request access, rectification, erasure, portability, restriction or objection, and withdraw consent without affecting prior lawful processing. Write to privacy@vonuai.com with enough information to locate the relevant data.", "You may also complain to the Spanish Data Protection Agency (AEPD) or another competent supervisory authority."] },
        { title: "14. Security and changes", paragraphs: ["We apply reasonable technical and organisational security measures. No internet-connected system can guarantee absolute security. This policy will be updated when the product, providers or processing materially changes."] },
      ],
    },
    terms: {
      title: "Terms and conditions",
      description: "Rules for using Vonu, purchasing analysis credits and understanding the limits of AI-assisted risk checks.",
      eyebrow: "Terms",
      hero: "The conditions for using Vonu and buying additional analyses.",
      updatedAt: UPDATED.en,
      sections: [
        { title: "1. Provider and acceptance", paragraphs: [`Vonu is provided by ${IDENTITY.en}`, "By using the service you agree to these Terms, the Privacy Policy, the Cookies information and the Responsible Use rules, without waiving any mandatory consumer rights."] },
        { title: "2. What Vonu provides", paragraphs: ["Vonu checks messages, text, screenshots, links and websites for signals associated with fraud, phishing, impersonation, pressure, manipulation and other digital risks. A risk score is an index based on available signals, not a mathematical probability or official certification."] },
        { title: "3. AI transparency and limitations", paragraphs: ["Vonu uses artificial intelligence and automated checks. They may be wrong or incomplete. Do not treat a result as professional legal, financial, medical or emergency advice, or as proof that a person committed a crime."] },
        { title: "4. Responsible use and user content", paragraphs: ["You must have a lawful basis to submit content and should minimise personal data. You grant Vonu the limited permission needed to process the content and transmit it to necessary technical providers for the requested function.", "Prohibited uses include fraud, phishing, impersonation, credential theft, unauthorised system access, harassment, extortion and unlawful exploitation of third-party data."] },
        { title: "5. Access without an account", paragraphs: ["Vonu Check currently works without registration. A random pseudonymous browser/device identifier is used to apply the free analysis and preserve purchased credits. Clearing browser data or changing device may prevent recognition of the previous balance."] },
        { title: "6. Free check and paid packs", paragraphs: ["At launch, one analysis is free per recognised browser/device. After it is used, the current offer is a pack of 3 additional analyses for €3.99, unless the pricing page clearly displays a later offer before purchase.", "Credits are consumed when a billable analysis is completed. Technical failures expressly classified as non-billable do not intentionally consume a credit."] },
        { title: "7. Price, taxes and payment", paragraphs: ["The total price is shown before payment. The current €3.99 pack is a one-time payment, not a subscription and has no automatic renewal. The displayed consumer price includes taxes where applicable; Stripe shows the final payable amount and available payment methods before confirmation."] },
        { title: "8. Electronic contracting steps", items: ["Choose the paid analysis pack.", "Review the price, main characteristics, legal links and required confirmations.", "Continue to Stripe Checkout and review or correct payment/billing information.", "Confirm the payment using Stripe's payment button.", "After successful payment, return to Vonu and receive the purchased credits on the recognised device."] },
        { title: "9. Contract record and correction of errors", paragraphs: ["Vonu and Stripe keep the transaction records required for payment, accounting, tax, support and fraud prevention. Stripe may send a receipt to the email provided during checkout.", "Before paying, you can return or correct information shown in Checkout. After payment, support can locate the purchase using the Stripe receipt or transaction identifier. The service can be contracted in Spanish, English, French, German or Arabic through the corresponding version of the site."] },
        { title: "10. Immediate performance and withdrawal", paragraphs: ["Consumers normally have the statutory withdrawal period unless a legal exception applies. Because the purchased service can be made available immediately, Vonu asks you to expressly request immediate performance during that period and acknowledge that your withdrawal right may be affected as the service is performed, only to the extent permitted by mandatory law.", "If you exercise a valid withdrawal right after part of the service has already been performed at your express request, the legal consequences, including any proportionate amount due, are those established by applicable consumer law. Nothing in these Terms creates a broader waiver than the law allows."] },
        { title: "11. Withdrawal model", items: ["To: Vonu / Francisco Luis Martínez Miralles — legal@vonuai.com", "I hereby give notice that I withdraw from my contract for the following Vonu purchase: [identify the purchase or Stripe receipt].", "Ordered on: [date].", "Consumer name: [name].", "Consumer address: [address, only if needed for the request].", "Date: [date]. Signature only if this form is sent on paper."] },
        { title: "12. Refunds, incidents and complaints", paragraphs: ["For payment, credit or withdrawal questions, contact hello@vonuai.com or legal@vonuai.com and include the Stripe receipt or transaction reference. Refunds and consumer remedies will be handled according to the applicable mandatory law and the actual state of service performance."] },
        { title: "13. Availability and abuse prevention", paragraphs: ["Vonu may change, maintain or temporarily suspend functions for security, quality, cost or provider reasons. Reasonable technical limits may be used to prevent abusive automation, payment fraud, systematic circumvention of the free limit or threats to service security."] },
        { title: "14. Intellectual property", paragraphs: ["The Vonu brand, software, internal rules, original texts and design remain protected by applicable intellectual-property law. Use of the service does not transfer ownership of those elements."] },
        { title: "15. Liability", paragraphs: ["Vonu is not a substitute for independent verification and does not guarantee that every threat will be detected. Nothing in these Terms excludes liability or consumer rights that cannot legally be excluded or limited."] },
        { title: "16. Law, jurisdiction and language", paragraphs: ["Spanish law applies where appropriate without prejudice to mandatory protections of the consumer's country of residence. Consumers retain the courts and remedies granted to them by mandatory law.", "Localized versions are intended to communicate the same conditions. If a translation creates ambiguity, it must not be interpreted to reduce a mandatory right available to the consumer."] },
        { title: "17. Contact and changes", paragraphs: ["Legal contact: legal@vonuai.com. The version in force is the one published on this page with its update date. Material changes will be reflected before they apply to new purchases where required."] },
      ],
    },
    cookies: {
      title: "Cookies and local storage",
      description: "Technical storage and privacy-focused analytics currently used by Vonu.",
      eyebrow: "Privacy",
      hero: "What is stored in your browser and why Vonu needs it.",
      updatedAt: UPDATED.en,
      sections: [
        { title: "1. Current setup", paragraphs: ["Vonu does not currently use Google Analytics or advertising cookies on the public checking experience. The main measurement service is Vercel Web Analytics and privacy-safe product events."] },
        { title: "2. Necessary device cookie", paragraphs: ["Vonu uses a strictly necessary first-party cookie named vonu_device_id. It contains a random pseudonymous identifier and not your name, email or submitted content.", "It is used to recognise whether the free analysis was used and to preserve purchased credits. It is configured as a secure HTTP-only first-party cookie with a technical lifetime of around one year unless removed earlier."] },
        { title: "3. Vercel Web Analytics", paragraphs: ["Vercel Web Analytics does not rely on third-party analytics cookies. It provides aggregated measurements such as page views, referrers, approximate geolocation, browser, operating system and device type, together with custom product events.", "Vonu configures events so the raw message, screenshot, email address and full analysed URL are not intentionally sent as analytics properties."] },
        { title: "4. Stripe and external services", paragraphs: ["When you voluntarily open Stripe Checkout, Stripe may use its own cookies or similar technologies for security, fraud prevention and payment processing under its own policies. Other external services may receive technical connection data when their function is requested."] },
        { title: "5. No advertising profiling", paragraphs: ["The current public product does not use advertising cookies or cross-site behavioural advertising. If non-essential tracking is introduced later, Vonu will update this information and obtain consent where required before activating it."] },
        { title: "6. Deleting browser data", paragraphs: ["Deleting cookies, using private browsing or switching browser/device may cause Vonu to lose the link to the free-use status or purchased credits. Keep the Stripe receipt if you make a purchase."] },
        { title: "7. Browser controls", paragraphs: ["You can inspect, block or delete cookies and site storage through your browser settings. Blocking strictly necessary storage may prevent the credit and free-use system from working correctly."] },
        { title: "8. Contact and updates", paragraphs: ["For privacy questions contact privacy@vonuai.com. This page will be updated if the storage or analytics configuration materially changes."] },
      ],
    },
    "responsible-use": {
      title: "Responsible use",
      description: "How to interpret Vonu checks safely and use AI-assisted risk analysis responsibly.",
      eyebrow: "Safety",
      hero: "Vonu helps identify signals. The final decision should also use context and independent verification.",
      updatedAt: UPDATED.en,
      sections: [
        { title: "1. What Vonu does", paragraphs: ["Vonu reviews messages, screenshots, links and websites to surface risk signals and practical next checks before you trust, reply, share data or pay."] },
        { title: "2. You are interacting with AI", paragraphs: ["Vonu uses artificial intelligence and automated technical checks. AI can misunderstand context, miss a signal or generate an incorrect explanation. Treat the output as preventive guidance, not a verdict."] },
        { title: "3. A score is not proof", paragraphs: ["The 0-100 risk index summarises available evidence. It is not the exact probability of fraud, does not certify identity and does not prove a criminal offence. A low score is not a guarantee of safety."] },
        { title: "4. Verify independently", paragraphs: ["If a bank, relative, company, marketplace, authority or support agent asks for money, credentials, codes or urgent action, verify through a channel you already know or obtain independently from an official source."] },
        { title: "5. Do not submit secrets", paragraphs: ["Do not submit passwords, OTP or authentication codes, recovery keys, PINs, full card numbers or banking credentials. Mask unnecessary third-party personal data in screenshots."] },
        { title: "6. Links and websites", paragraphs: ["HTTPS, an old domain or no match in a threat database does not prove legitimacy. Avoid URLs containing private tokens or secret parameters. Some checks may query external reputation or registration services."] },
        { title: "7. High and low risk results", paragraphs: ["For high risk, pause the sensitive action and verify the strongest signals. For low risk, continue to consider outside context, unexpected requests and changes of bank details or identity."] },
        { title: "8. If you already paid or shared data", paragraphs: ["Act quickly: contact the relevant bank or payment provider, secure affected accounts, change compromised credentials, preserve evidence and use official reporting or support channels where appropriate."] },
        { title: "9. Professional and emergency limits", paragraphs: ["Vonu does not replace banks, lawyers, doctors, emergency services, platforms or public authorities. If there is immediate danger, extortion, unauthorised account access or significant financial loss, use the appropriate official channels without waiting for Vonu."] },
        { title: "10. Minors and third-party content", paragraphs: ["Minors should use Vonu with appropriate adult supervision where required. Do not upload intimate, identifying or other unnecessary sensitive information about a child or another person."] },
        { title: "11. Prohibited uses", items: ["Creating, improving or testing scams, phishing or impersonation.", "Obtaining credentials, codes or sensitive data from third parties.", "Harassment, blackmail, extortion or manipulation.", "Unauthorised probing, attacking or overloading of systems.", "Presenting a Vonu score as definitive proof of guilt or identity."] },
        { title: "12. Contact", paragraphs: ["If you find a clearly incorrect result or a pattern Vonu should recognise, contact hello@vonuai.com without including unnecessary secrets or sensitive data."] },
      ],
    },
  },
  fr: {
    "legal-notice": {
      title: "Mentions légales",
      description: "Qui fournit Vonu, ce que fait le service et les limites juridiques essentielles de son utilisation.",
      eyebrow: "Mentions légales",
      hero: "Informations claires sur l’exploitant de Vonu et l’utilisation du service.",
      updatedAt: UPDATED.fr,
      sections: [
        { title: "1. Éditeur du service", paragraphs: [`Vonu et vonuai.com sont exploités par ${IDENTITY.fr}`, "Contact général : hello@vonuai.com. Questions juridiques : legal@vonuai.com. Confidentialité : privacy@vonuai.com."] },
        { title: "2. Objet de Vonu", paragraphs: ["Vonu est un outil de vérification préventive pour analyser messages, captures, liens et sites avant de faire confiance, répondre, transmettre des données ou payer.", "Les résultats combinent analyses automatisées, intelligence artificielle, règles internes et, pour certains liens, vérifications techniques ou de réputation. Ils constituent une orientation et non une certification de légitimité ou de fraude."] },
        { title: "3. Utilisation licite et responsable", paragraphs: ["Vonu doit être utilisé légalement, de bonne foi et dans le respect des droits des tiers. Il est interdit de l’utiliser pour frauder, usurper une identité, obtenir des identifiants, attaquer des systèmes, harceler ou faciliter une activité illicite."] },
        { title: "4. IA et limites du service", paragraphs: ["Vonu utilise l’IA et des contrôles automatisés susceptibles de se tromper, de manquer de contexte ou de ne pas détecter une menace récente. Un score faible ne garantit pas la sécurité et un score élevé ne prouve pas une infraction.", "Pour toute décision sensible, vérifiez aussi par un canal officiel ou indépendant."] },
        { title: "5. Propriété intellectuelle", paragraphs: ["La marque Vonu, le logiciel, le design, les textes originaux et les règles internes sont protégés. L’utilisateur conserve les droits qu’il détient sur le contenu transmis et n’autorise que le traitement nécessaire au service demandé."] },
        { title: "6. Services tiers", paragraphs: ["Certaines fonctions dépendent de fournisseurs d’infrastructure, paiement, IA, email, données de domaine ou renseignement sur les menaces. Vonu ne contrôle pas leur disponibilité permanente ni l’exhaustivité de leurs données."] },
        { title: "7. Responsabilité", paragraphs: ["Vonu met en œuvre des mesures raisonnables mais ne garantit ni exactitude absolue, ni disponibilité continue, ni absence d’erreurs. Aucune clause n’exclut les droits impératifs des consommateurs ou une responsabilité légalement non excluable."] },
        { title: "8. Droit applicable et consommateurs", paragraphs: ["Le service est exploité depuis l’Espagne. Le droit espagnol s’applique lorsque pertinent, sans préjudice des règles impératives de protection et de compétence du pays de résidence du consommateur."] },
        { title: "9. Réclamations et contact", paragraphs: ["Pour une question juridique ou une réclamation : legal@vonuai.com. Pour l’assistance : hello@vonuai.com."] },
        { title: "10. Mises à jour", paragraphs: ["Cette page peut évoluer en fonction du produit, des fournisseurs ou de la loi. La version en vigueur et sa date sont publiées ici."] },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      description: "Comment Vonu traite le contenu soumis, l’identifiant d’appareil, les paiements et les données analytiques.",
      eyebrow: "Confidentialité",
      hero: "Ce que Vonu reçoit, pourquoi et quels sont vos droits.",
      updatedAt: UPDATED.fr,
      sections: [
        { title: "1. Responsable du traitement", paragraphs: [`Le responsable est ${IDENTITY.fr}`, "Contact : privacy@vonuai.com."] },
        { title: "2. Données susceptibles d’être traitées", items: ["Contenu d’une vérification : texte, messages, captures, images, URL et données visibles.", "Données techniques : type de vérification, signaux, score/niveau de risque, durée, état et données publiques de domaine.", "Identifiant aléatoire pseudonyme du navigateur/appareil pour la gratuité et les crédits achetés.", "Données de contact ou newsletter fournies volontairement.", "Identifiants de transaction Stripe ; Vonu n’a pas besoin de conserver le numéro complet de carte.", "Mesures agrégées : pages, provenance, pays/région approximative, navigateur/appareil et événements produit."] },
        { title: "3. Finalités et bases juridiques", paragraphs: ["Les données servent à fournir l’analyse demandée, maintenir les crédits, traiter les achats, répondre au support, prévenir les abus, sécuriser et diagnostiquer le service, mesurer son fonctionnement et respecter les obligations légales, comptables ou fiscales.", "Selon le cas, la base peut être l’exécution du service ou du contrat, des mesures précontractuelles, le consentement, une obligation légale ou l’intérêt légitime en matière de sécurité et d’amélioration après mise en balance des droits."] },
        { title: "4. Intelligence artificielle", paragraphs: ["Les vérifications de texte ou d’image peuvent être traitées par des fournisseurs d’IA tels qu’OpenAI ou Google selon la fonction active. Vonu applique ensuite ses propres règles de calibration.", "Le résultat est une aide préventive et non une décision automatisée produisant des effets juridiques ou similaires sur l’utilisateur."] },
        { title: "5. Liens et vérifications externes", paragraphs: ["Une URL peut être chargée par l’infrastructure Vonu et consultée auprès de services tels qu’URLhaus ou RDAP public. N’envoyez pas d’URL contenant mot de passe, token privé ou paramètre secret inutile."] },
        { title: "6. Accès sans compte", paragraphs: ["Vonu Check peut fonctionner sans compte grâce à une cookie technique de première partie appelée vonu_device_id contenant un identifiant aléatoire pseudonyme. Elle ne contient ni nom, ni email, ni contenu soumis.", "La suppression des données du navigateur ou un changement d’appareil peut empêcher la reconnaissance du solde précédent."] },
        { title: "7. Paiements", paragraphs: ["Stripe traite les paiements. Vonu transmet uniquement les métadonnées opérationnelles minimales permettant d’associer le paiement à l’appareil et d’ajouter les crédits. Stripe traite les données de paiement, de facturation et de prévention de fraude selon ses propres responsabilités."] },
        { title: "8. Prestataires", items: ["Vercel : hébergement, exécution, Web Analytics et performance.", "Supabase : base de données et fonctions backend.", "OpenAI et Google : traitement IA lorsque activé.", "Stripe : paiement, reçus et prévention de fraude.", "Resend : email lié au contact.", "abuse.ch/URLhaus et RDAP : renseignements techniques pour certaines URL."] },
        { title: "9. Transferts internationaux", paragraphs: ["Certains prestataires peuvent traiter des données hors EEE. Le cas échéant, les transferts reposent sur une décision d’adéquation ou des garanties appropriées telles que les clauses contractuelles types de la Commission européenne et les mesures complémentaires nécessaires."] },
        { title: "10. Conservation", paragraphs: ["Les données sont conservées uniquement le temps nécessaire à la finalité et aux obligations légales. La cookie d’appareil a une durée technique maximale d’environ un an sauf suppression anticipée ; les données de transaction/facturation suivent les délais légaux.", "Le contenu brut n’est pas envoyé aux analytics produit. Lorsqu’une fonction de sécurité ou qualité conserve un rapport dérivé ou masqué, celui-ci est limité à la finalité de la fonction activée et ne doit pas contenir de secrets inutiles."] },
        { title: "11. Analytics et événements produit", paragraphs: ["Vercel Web Analytics mesure de façon agrégée pages, provenance, pays/région, appareil/navigateur et événements tels que mode d’analyse, langue, catégorie, niveau de risque, durée, succès ou erreur, sans cookie analytique tiers.", "Vonu n’envoie pas intentionnellement le message, la capture, l’email ou l’URL complète analysée comme propriété analytique."] },
        { title: "12. Données sensibles, tiers et mineurs", paragraphs: ["N’envoyez pas mots de passe, OTP, PIN, carte complète, documents d’identité complets, données médicales inutiles ou autres secrets. Masquez les données de tiers non nécessaires.", "Lorsqu’un mineur utilise Vonu, une supervision parentale ou du représentant légal est recommandée et requise lorsque la loi l’impose. Les mineurs ne doivent pas effectuer d’achat sans l’autorisation légalement nécessaire."] },
        { title: "13. Vos droits", paragraphs: ["Vous pouvez, lorsque la loi le prévoit, demander accès, rectification, effacement, portabilité, limitation ou opposition et retirer un consentement. Contactez privacy@vonuai.com.", "Vous pouvez également saisir l’AEPD ou une autre autorité de contrôle compétente."] },
        { title: "14. Sécurité et modifications", paragraphs: ["Nous appliquons des mesures techniques et organisationnelles raisonnables. Aucun système connecté à Internet ne garantit une sécurité absolue. Cette politique sera mise à jour en cas de changement matériel."] },
      ],
    },
    terms: {
      title: "Conditions générales",
      description: "Conditions d’utilisation de Vonu et d’achat de crédits d’analyse.",
      eyebrow: "Conditions",
      hero: "Les règles pour utiliser Vonu et acheter des analyses supplémentaires.",
      updatedAt: UPDATED.fr,
      sections: [
        { title: "1. Prestataire et acceptation", paragraphs: [`Vonu est fourni par ${IDENTITY.fr}`, "En utilisant le service, vous acceptez ces Conditions, la Politique de confidentialité, les informations Cookies et les règles d’Usage responsable, sans renoncer à aucun droit impératif."] },
        { title: "2. Service", paragraphs: ["Vonu recherche dans des messages, textes, captures, liens et sites des signaux associés à la fraude, au phishing, à l’usurpation, à la pression ou à d’autres risques numériques. Le score est un indice, pas une probabilité mathématique ni une certification officielle."] },
        { title: "3. Transparence de l’IA", paragraphs: ["Vonu utilise de l’intelligence artificielle et des vérifications automatisées susceptibles d’être incomplètes ou erronées. Le résultat ne constitue pas un conseil juridique, financier, médical ou d’urgence et ne prouve pas une infraction."] },
        { title: "4. Utilisation responsable et contenu", paragraphs: ["Vous devez avoir une base légitime pour transmettre le contenu et minimiser les données personnelles. Vous autorisez uniquement le traitement nécessaire à la fonction demandée.", "Sont interdits notamment la fraude, le phishing, l’usurpation, le vol d’identifiants, l’accès non autorisé, le harcèlement, l’extorsion et l’exploitation illicite de données de tiers."] },
        { title: "5. Accès sans compte", paragraphs: ["Vonu Check fonctionne actuellement sans inscription et utilise un identifiant pseudonyme aléatoire du navigateur/appareil pour la gratuité et les crédits. Effacer les données ou changer d’appareil peut rompre cette association."] },
        { title: "6. Gratuité et packs", paragraphs: ["Au lancement, une analyse est gratuite par navigateur/appareil reconnu. L’offre actuelle suivante est un pack de 3 analyses supplémentaires pour 3,99 €, sauf offre ultérieure clairement affichée avant achat.", "Un crédit est consommé lorsqu’une analyse facturable est terminée. Les échecs techniques explicitement non facturables ne doivent pas consommer de crédit."] },
        { title: "7. Prix, taxes et paiement", paragraphs: ["Le prix total est affiché avant paiement. Le pack à 3,99 € est un paiement unique, sans abonnement ni renouvellement automatique. Le prix consommateur affiché inclut les taxes lorsqu’elles s’appliquent ; Stripe affiche le montant final et les moyens de paiement disponibles."] },
        { title: "8. Étapes de la commande électronique", items: ["Choisir le pack.", "Vérifier prix, caractéristiques, liens juridiques et confirmations requises.", "Accéder à Stripe Checkout et corriger si nécessaire les informations de paiement/facturation.", "Confirmer le paiement.", "Revenir sur Vonu et recevoir les crédits sur l’appareil reconnu."] },
        { title: "9. Archivage et correction", paragraphs: ["Vonu et Stripe conservent les traces de transaction nécessaires au paiement, à la comptabilité, à la fiscalité, au support et à la lutte contre la fraude. Stripe peut envoyer un reçu.", "Avant paiement, vous pouvez revenir en arrière ou corriger les informations. Après paiement, le reçu Stripe permet de retrouver l’opération. Le contrat peut être conclu en espagnol, anglais, français, allemand ou arabe via la version correspondante du site."] },
        { title: "10. Exécution immédiate et rétractation", paragraphs: ["Le consommateur bénéficie du délai légal de rétractation sauf exception prévue par la loi. Comme le service peut être rendu disponible immédiatement, Vonu demande une demande expresse d’exécution pendant ce délai et la reconnaissance que le droit de rétractation peut être affecté au fur et à mesure de l’exécution, uniquement dans les limites prévues par la loi.", "Si une rétractation valable intervient après une exécution partielle expressément demandée, les conséquences prévues par le droit de la consommation, y compris le cas échéant un montant proportionnel, s’appliquent. Aucune renonciation plus large que celle autorisée par la loi n’est imposée."] },
        { title: "11. Modèle de rétractation", items: ["À : Vonu / Francisco Luis Martínez Miralles — legal@vonuai.com", "Je vous notifie par la présente ma rétractation du contrat relatif à l’achat Vonu suivant : [achat ou reçu Stripe].", "Commandé le : [date].", "Nom du consommateur : [nom].", "Adresse : [si nécessaire].", "Date : [date]. Signature uniquement pour un envoi papier."] },
        { title: "12. Remboursements et réclamations", paragraphs: ["Pour toute question de paiement, crédit ou rétractation : hello@vonuai.com ou legal@vonuai.com, avec le reçu ou la référence Stripe. Les recours obligatoires du consommateur restent applicables."] },
        { title: "13. Disponibilité et prévention des abus", paragraphs: ["Vonu peut maintenir, modifier ou suspendre temporairement des fonctions pour sécurité, qualité, coût ou dépendance fournisseur. Des limites raisonnables peuvent empêcher automatisation abusive, fraude de paiement ou contournement systématique de la gratuité."] },
        { title: "14. Propriété intellectuelle", paragraphs: ["La marque, le logiciel, les règles internes, les textes et le design Vonu restent protégés. L’utilisation du service ne transfère aucun droit de propriété sur ces éléments."] },
        { title: "15. Responsabilité", paragraphs: ["Vonu ne remplace pas une vérification indépendante et ne garantit pas la détection de toutes les menaces. Aucune clause n’exclut une responsabilité ou un droit consommateur que la loi rend impératif."] },
        { title: "16. Loi, juridiction et langue", paragraphs: ["Le droit espagnol s’applique lorsque pertinent, sans préjudice des protections impératives du pays de résidence du consommateur. Les traductions visent la même portée et ne peuvent être interprétées comme réduisant un droit impératif."] },
        { title: "17. Contact et modifications", paragraphs: ["Contact juridique : legal@vonuai.com. La version en vigueur est celle publiée ici avec sa date."] },
      ],
    },
    cookies: {
      title: "Cookies et stockage local",
      description: "Stockage technique et analytics respectueux de la vie privée utilisés par Vonu.",
      eyebrow: "Confidentialité",
      hero: "Ce qui est stocké dans votre navigateur et pourquoi.",
      updatedAt: UPDATED.fr,
      sections: [
        { title: "1. Configuration actuelle", paragraphs: ["Vonu n’utilise actuellement ni Google Analytics ni cookies publicitaires dans l’expérience publique de vérification. La mesure principale repose sur Vercel Web Analytics et des événements produit."] },
        { title: "2. Cookie technique nécessaire", paragraphs: ["La cookie de première partie vonu_device_id contient un identifiant aléatoire pseudonyme, sans nom, email ni contenu soumis. Elle sert à reconnaître l’analyse gratuite et les crédits achetés, avec une durée technique d’environ un an sauf suppression."] },
        { title: "3. Vercel Web Analytics", paragraphs: ["Vercel Web Analytics ne repose pas sur des cookies analytiques tiers et fournit des mesures agrégées : pages, provenance, géolocalisation approximative, navigateur, système et appareil ainsi que des événements personnalisés.", "Vonu évite d’envoyer le message brut, la capture, l’email ou l’URL complète analysée comme propriété analytique."] },
        { title: "4. Stripe et services externes", paragraphs: ["En ouvrant volontairement Stripe Checkout, Stripe peut utiliser ses propres technologies pour la sécurité, la prévention de fraude et le paiement."] },
        { title: "5. Pas de profilage publicitaire", paragraphs: ["Le produit public actuel n’utilise pas de cookies publicitaires ni de publicité comportementale intersites. Toute future technologie non nécessaire sera documentée et soumise au consentement lorsqu’il est requis."] },
        { title: "6. Suppression des données", paragraphs: ["Effacer les cookies, utiliser la navigation privée ou changer d’appareil peut supprimer l’association avec le statut gratuit ou les crédits. Conservez votre reçu Stripe après achat."] },
        { title: "7. Contrôles du navigateur", paragraphs: ["Vous pouvez consulter, bloquer ou supprimer cookies et stockage depuis le navigateur. Bloquer le stockage strictement nécessaire peut empêcher le système de crédits de fonctionner."] },
        { title: "8. Contact", paragraphs: ["Questions de confidentialité : privacy@vonuai.com. Cette page sera mise à jour en cas de changement matériel."] },
      ],
    },
    "responsible-use": {
      title: "Usage responsable",
      description: "Comment interpréter en sécurité les analyses Vonu et l’assistance par IA.",
      eyebrow: "Sécurité",
      hero: "Vonu aide à repérer des signaux ; la décision finale doit aussi reposer sur le contexte et une vérification indépendante.",
      updatedAt: UPDATED.fr,
      sections: [
        { title: "1. Rôle de Vonu", paragraphs: ["Vonu examine messages, captures, liens et sites afin de faire ressortir des signaux de risque et des vérifications utiles avant de faire confiance, répondre, partager des données ou payer."] },
        { title: "2. Vous interagissez avec une IA", paragraphs: ["Vonu utilise de l’intelligence artificielle et des contrôles automatisés. L’IA peut mal comprendre le contexte ou produire une explication incorrecte. Le résultat est une orientation préventive, pas un verdict."] },
        { title: "3. Un score n’est pas une preuve", paragraphs: ["L’indice 0-100 résume les éléments disponibles. Il n’est pas la probabilité exacte d’une fraude, ne certifie pas une identité et ne prouve pas une infraction. Un score faible ne garantit pas la sécurité."] },
        { title: "4. Vérification indépendante", paragraphs: ["Pour toute demande d’argent, de codes, d’identifiants ou d’action urgente attribuée à une banque, un proche, une entreprise ou une autorité, vérifiez par un canal obtenu indépendamment."] },
        { title: "5. Ne transmettez pas de secrets", paragraphs: ["Ne transmettez pas mots de passe, OTP, clés de récupération, PIN, carte complète ou identifiants bancaires. Masquez les données de tiers inutiles."] },
        { title: "6. Liens et sites", paragraphs: ["HTTPS, l’ancienneté d’un domaine ou l’absence de signal dans une base de menaces ne prouvent pas la légitimité. Évitez les URL contenant des tokens privés."] },
        { title: "7. Résultats élevés ou faibles", paragraphs: ["En cas de risque élevé, stoppez l’action sensible et vérifiez les signaux. En cas de risque faible, tenez encore compte du contexte externe et des demandes inhabituelles."] },
        { title: "8. Si vous avez déjà payé ou partagé des données", paragraphs: ["Contactez rapidement banque ou prestataire, sécurisez les comptes, changez les identifiants affectés, conservez les preuves et utilisez les canaux officiels de signalement."] },
        { title: "9. Limites professionnelles et urgences", paragraphs: ["Vonu ne remplace pas banque, avocat, médecin, service d’urgence, plateforme ou autorité. En cas de danger immédiat, extorsion, accès non autorisé ou perte financière importante, utilisez les canaux officiels sans attendre."] },
        { title: "10. Mineurs et données de tiers", paragraphs: ["Les mineurs doivent utiliser Vonu sous supervision appropriée lorsque nécessaire. N’envoyez pas d’informations intimes ou sensibles inutiles concernant un enfant ou une autre personne."] },
        { title: "11. Usages interdits", items: ["Créer ou améliorer escroqueries, phishing ou usurpations.", "Obtenir identifiants, codes ou données sensibles de tiers.", "Harcèlement, chantage, extorsion ou manipulation.", "Attaquer ou explorer sans autorisation des systèmes.", "Présenter un score Vonu comme preuve définitive de culpabilité ou d’identité."] },
        { title: "12. Contact", paragraphs: ["Pour signaler un résultat manifestement erroné : hello@vonuai.com, sans secrets ni données sensibles inutiles."] },
      ],
    },
  },
  de: {
    "legal-notice": {
      title: "Impressum und rechtliche Hinweise",
      description: "Wer Vonu anbietet, was der Dienst leistet und welche wesentlichen rechtlichen Grenzen gelten.",
      eyebrow: "Rechtliches",
      hero: "Klare Angaben zum Anbieter von Vonu und zur Nutzung des Dienstes.",
      updatedAt: UPDATED.de,
      sections: [
        { title: "1. Anbieter", paragraphs: [`Vonu und vonuai.com werden betrieben von ${IDENTITY.de}`, "Allgemeiner Kontakt: hello@vonuai.com. Rechtliches: legal@vonuai.com. Datenschutz: privacy@vonuai.com."] },
        { title: "2. Zweck von Vonu", paragraphs: ["Vonu ist ein präventives Prüfwerkzeug für Nachrichten, Screenshots, Links und Websites, bevor Nutzer vertrauen, antworten, Daten weitergeben oder zahlen.", "Ergebnisse kombinieren automatisierte Analysen, KI, interne Regeln und bei bestimmten Links technische oder Reputationsprüfungen. Sie sind Orientierung und keine Zertifizierung von Seriosität oder Betrug."] },
        { title: "3. Rechtmäßige Nutzung", paragraphs: ["Vonu darf nur rechtmäßig, nach Treu und Glauben und unter Wahrung von Rechten Dritter genutzt werden. Betrug, Identitätsmissbrauch, Zugangsdiebstahl, Angriffe, Belästigung oder sonstige rechtswidrige Nutzung sind untersagt."] },
        { title: "4. KI und Grenzen", paragraphs: ["Vonu nutzt KI und automatisierte Prüfungen, die Fehler machen, Kontext übersehen oder neue Bedrohungen nicht erkennen können. Ein niedriger Wert garantiert keine Sicherheit; ein hoher Wert beweist keine Straftat.", "Bei sensiblen Entscheidungen ist zusätzlich über einen offiziellen oder unabhängigen Kanal zu prüfen."] },
        { title: "5. Geistiges Eigentum", paragraphs: ["Marke, Software, Design, eigene Texte und interne Regeln von Vonu sind geschützt. Nutzer behalten ihre Rechte an eingereichten Inhalten und erlauben nur die zur angeforderten Leistung notwendige Verarbeitung."] },
        { title: "6. Drittanbieter", paragraphs: ["Einige Funktionen hängen von Infrastruktur-, Zahlungs-, KI-, E-Mail-, Domain- oder Threat-Intelligence-Anbietern ab. Vonu kontrolliert deren dauerhafte Verfügbarkeit und Vollständigkeit nicht."] },
        { title: "7. Haftung", paragraphs: ["Vonu trifft angemessene Maßnahmen, garantiert aber keine absolute Richtigkeit, ständige Verfügbarkeit oder Fehlerfreiheit. Zwingende Verbraucherrechte und nicht ausschließbare Haftung bleiben unberührt."] },
        { title: "8. Anwendbares Recht", paragraphs: ["Der Dienst wird aus Spanien betrieben. Spanisches Recht gilt, soweit einschlägig, unbeschadet zwingender Verbraucherschutz- und Gerichtsstandsregeln im Wohnsitzstaat."] },
        { title: "9. Beschwerden und Kontakt", paragraphs: ["Rechtliche Fragen oder Beschwerden: legal@vonuai.com. Support: hello@vonuai.com."] },
        { title: "10. Änderungen", paragraphs: ["Diese Hinweise können bei Änderungen von Produkt, Anbietern oder Rechtslage angepasst werden. Es gilt die hier veröffentlichte Fassung mit Datum."] },
      ],
    },
    privacy: {
      title: "Datenschutzerklärung",
      description: "Wie Vonu eingereichte Inhalte, Gerätekennungen, Zahlungen und Analysedaten verarbeitet.",
      eyebrow: "Datenschutz",
      hero: "Welche Daten Vonu erhält, wofür sie benötigt werden und welche Rechte du hast.",
      updatedAt: UPDATED.de,
      sections: [
        { title: "1. Verantwortlicher", paragraphs: [`Verantwortlicher ist ${IDENTITY.de}`, "Kontakt: privacy@vonuai.com."] },
        { title: "2. Mögliche Datenkategorien", items: ["Prüfinhalte: Text, Nachrichten, Screenshots, Bilder, URLs und darin sichtbare Daten.", "Technische Analysedaten: Prüfart, Signale, Risikowert/-stufe, Dauer, Status und öffentliche Domaindaten.", "Zufällige pseudonyme Browser-/Gerätekennung für Gratisnutzung und gekaufte Credits.", "Freiwillig übermittelte Kontakt- oder Newsletterdaten.", "Stripe-Transaktionskennungen; Vonu muss keine vollständige Kartennummer speichern.", "Aggregierte Messdaten wie Seiten, Referrer, Land/ungefähre Region, Browser/Gerät und Produkt-Events."] },
        { title: "3. Zwecke und Rechtsgrundlagen", paragraphs: ["Verarbeitung erfolgt zur Durchführung der angeforderten Prüfung, Verwaltung von Credits, Zahlungsabwicklung, Support, Missbrauchsprävention, Sicherheit und Fehlerdiagnose, Produktmessung sowie Erfüllung gesetzlicher, steuerlicher oder buchhalterischer Pflichten.", "Rechtsgrundlagen können Vertragserfüllung oder vorvertragliche Maßnahmen, Einwilligung, gesetzliche Pflichten oder berechtigte Interessen an Sicherheit und Verbesserung nach Interessenabwägung sein."] },
        { title: "4. Künstliche Intelligenz", paragraphs: ["Text- oder Bildprüfungen können je nach aktiver Funktion durch KI-Anbieter wie OpenAI oder Google verarbeitet werden. Vonu wendet anschließend eigene Kalibrierungsregeln an.", "Das Ergebnis ist präventive Orientierung und keine automatisierte Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung für den Nutzer."] },
        { title: "5. Links und externe Prüfungen", paragraphs: ["URLs können von Vonu abgerufen und bei Diensten wie URLhaus oder öffentlichen RDAP-Diensten geprüft werden. Keine Passwörter, privaten Tokens oder unnötigen geheimen Parameter in URLs übermitteln."] },
        { title: "6. Nutzung ohne Konto", paragraphs: ["Vonu Check kann ohne Konto genutzt werden. Das notwendige First-Party-Cookie vonu_device_id enthält eine zufällige pseudonyme Kennung, nicht Name, E-Mail oder Prüfinhalt.", "Löschen von Browserdaten oder Gerätewechsel kann dazu führen, dass vorherige Credits nicht erkannt werden."] },
        { title: "7. Zahlungen", paragraphs: ["Stripe verarbeitet Zahlungen. Vonu übermittelt nur minimale operative Metadaten zur Zuordnung des Kaufs und Gutschrift der Analysen. Zahlungs-, Rechnungs- und Betrugspräventionsdaten verarbeitet Stripe nach eigener Verantwortlichkeit."] },
        { title: "8. Dienstleister", items: ["Vercel: Hosting, Ausführung, Web Analytics und Performance.", "Supabase: Datenbank und Backend-Funktionen.", "OpenAI und Google: KI-Verarbeitung, soweit aktiviert.", "Stripe: Zahlungen, Belege und Zahlungsbetrugsprävention.", "Resend: E-Mail-Zustellung im Kontaktbereich.", "abuse.ch/URLhaus und RDAP: technische Informationen für relevante URL-Prüfungen."] },
        { title: "9. Internationale Übermittlungen", paragraphs: ["Einige Anbieter können Daten außerhalb des EWR verarbeiten. Soweit erforderlich, stützen sich Übermittlungen auf Angemessenheitsbeschlüsse oder geeignete Garantien wie EU-Standardvertragsklauseln und notwendige Zusatzmaßnahmen."] },
        { title: "10. Speicherdauer", paragraphs: ["Daten werden nur so lange gespeichert, wie Zweck und gesetzliche Pflichten es erfordern. Das Geräte-Cookie hat technisch etwa ein Jahr Laufzeit, sofern es nicht vorher gelöscht wird; Zahlungs- und Rechnungsdaten folgen gesetzlichen Fristen.", "Rohinhalte werden nicht als Produkt-Analytics-Eigenschaft gesendet. Wenn eine aktivierte Sicherheits- oder Qualitätsfunktion einen maskierten oder abgeleiteten Bericht speichert, wird er auf den jeweiligen Zweck beschränkt und soll keine unnötigen Geheimnisse enthalten."] },
        { title: "11. Analytics und Produkt-Events", paragraphs: ["Vercel Web Analytics misst aggregiert Seiten, Referrer, Land/Region, Gerät/Browser und Events wie Analysemodus, Sprache, Kategorie, Risikostufe, Dauer, Erfolg oder Fehler ohne Third-Party-Analytics-Cookies.", "Nachricht, Screenshot, E-Mail-Adresse oder vollständige analysierte URL werden nicht absichtlich als Analytics-Eigenschaft gesendet."] },
        { title: "12. Sensible Daten, Dritte und Minderjährige", paragraphs: ["Keine Passwörter, OTPs, PINs, vollständigen Kartendaten, vollständigen Ausweisdokumente, unnötigen Gesundheitsdaten oder sonstigen Geheimnisse übermitteln. Nicht benötigte Drittdaten maskieren.", "Minderjährige sollen Vonu mit angemessener Aufsicht nutzen, soweit erforderlich. Käufe durch Minderjährige benötigen die gesetzlich erforderliche Zustimmung."] },
        { title: "13. Rechte", paragraphs: ["Soweit anwendbar bestehen Rechte auf Auskunft, Berichtigung, Löschung, Portabilität, Einschränkung und Widerspruch sowie Widerruf einer Einwilligung. Kontakt: privacy@vonuai.com.", "Beschwerden können bei der spanischen Datenschutzbehörde AEPD oder einer anderen zuständigen Aufsichtsbehörde eingereicht werden."] },
        { title: "14. Sicherheit und Änderungen", paragraphs: ["Wir setzen angemessene technische und organisatorische Maßnahmen ein. Absolute Sicherheit kann kein internetverbundenes System garantieren. Wesentliche Änderungen werden in dieser Erklärung aktualisiert."] },
      ],
    },
    terms: {
      title: "Nutzungs- und Kaufbedingungen",
      description: "Bedingungen für die Nutzung von Vonu und den Kauf zusätzlicher Analyse-Credits.",
      eyebrow: "Bedingungen",
      hero: "Regeln für die Nutzung von Vonu und den Kauf zusätzlicher Analysen.",
      updatedAt: UPDATED.de,
      sections: [
        { title: "1. Anbieter und Zustimmung", paragraphs: [`Vonu wird bereitgestellt von ${IDENTITY.de}`, "Mit Nutzung des Dienstes gelten diese Bedingungen, Datenschutzerklärung, Cookie-Hinweise und Regeln zur verantwortungsvollen Nutzung, ohne Verzicht auf zwingende Verbraucherrechte."] },
        { title: "2. Leistung", paragraphs: ["Vonu prüft Nachrichten, Texte, Screenshots, Links und Websites auf Signale für Betrug, Phishing, Identitätsmissbrauch, Druck oder andere digitale Risiken. Der Risikowert ist ein Index und keine mathematische Wahrscheinlichkeit oder offizielle Zertifizierung."] },
        { title: "3. KI-Transparenz", paragraphs: ["Vonu nutzt KI und automatisierte Prüfungen, die fehlerhaft oder unvollständig sein können. Ergebnisse sind keine professionelle Rechts-, Finanz-, Medizin- oder Notfallberatung und kein Beweis für eine Straftat."] },
        { title: "4. Verantwortungsvolle Nutzung und Inhalte", paragraphs: ["Für eingereichte Inhalte muss eine rechtmäßige Grundlage bestehen; personenbezogene Daten sind zu minimieren. Die Verarbeitungserlaubnis beschränkt sich auf die angeforderte Funktion.", "Untersagt sind insbesondere Betrug, Phishing, Identitätsmissbrauch, Zugangsdiebstahl, unbefugter Systemzugriff, Belästigung, Erpressung und rechtswidrige Nutzung von Drittdaten."] },
        { title: "5. Nutzung ohne Konto", paragraphs: ["Vonu Check funktioniert derzeit ohne Registrierung. Eine zufällige pseudonyme Gerätekennung verwaltet Gratisanalyse und Credits. Löschen von Browserdaten oder Gerätewechsel kann die Zuordnung aufheben."] },
        { title: "6. Gratisanalyse und Pakete", paragraphs: ["Zum Start ist eine Analyse pro erkanntem Browser/Gerät kostenlos. Danach gilt derzeit ein Paket mit 3 zusätzlichen Analysen für 3,99 €, sofern vor dem Kauf nicht klar ein späteres Angebot angezeigt wird.", "Ein Credit wird verbraucht, wenn eine kostenpflichtige Analyse abgeschlossen ist. Ausdrücklich als nicht abrechenbar eingestufte technische Fehler sollen keinen Credit verbrauchen."] },
        { title: "7. Preis, Steuern und Zahlung", paragraphs: ["Der Gesamtpreis wird vor der Zahlung angezeigt. 3,99 € sind eine einmalige Zahlung ohne Abo oder automatische Verlängerung. Der angezeigte Verbraucherpreis enthält anwendbare Steuern; Stripe zeigt vor Bestätigung den Endbetrag und verfügbare Zahlungsarten."] },
        { title: "8. Schritte des elektronischen Vertrags", items: ["Paket auswählen.", "Preis, Hauptmerkmale, Rechtstexte und erforderliche Bestätigungen prüfen.", "Stripe Checkout öffnen und Zahlungs-/Rechnungsdaten prüfen oder korrigieren.", "Zahlung bestätigen.", "Zu Vonu zurückkehren und Credits auf dem erkannten Gerät erhalten."] },
        { title: "9. Speicherung und Fehlerkorrektur", paragraphs: ["Vonu und Stripe speichern erforderliche Transaktionsdaten für Zahlung, Buchhaltung, Steuern, Support und Betrugsprävention. Stripe kann einen Beleg senden.", "Vor Zahlung können Angaben in Checkout korrigiert oder der Vorgang verlassen werden. Nach Zahlung kann Support die Transaktion über den Stripe-Beleg finden. Vertragssprachen sind Spanisch, Englisch, Französisch, Deutsch und Arabisch über die jeweilige Website-Version."] },
        { title: "10. Sofortige Ausführung und Widerruf", paragraphs: ["Verbraucher haben grundsätzlich das gesetzliche Widerrufsrecht, soweit keine gesetzliche Ausnahme greift. Da die Leistung sofort verfügbar sein kann, bittet Vonu um ausdrücklichen Wunsch zur Ausführung innerhalb der Widerrufsfrist und die Kenntnisnahme, dass das Widerrufsrecht durch die Leistungserbringung nur im gesetzlich zulässigen Umfang beeinflusst werden kann.", "Bei wirksamem Widerruf nach ausdrücklich verlangter Teilleistung gelten die gesetzlichen Folgen, gegebenenfalls einschließlich eines anteiligen Betrags. Ein weitergehender Verzicht wird nicht verlangt."] },
        { title: "11. Muster-Widerruf", items: ["An: Vonu / Francisco Luis Martínez Miralles — legal@vonuai.com", "Hiermit widerrufe ich meinen Vertrag über folgenden Vonu-Kauf: [Kauf oder Stripe-Beleg].", "Bestellt am: [Datum].", "Name des Verbrauchers: [Name].", "Anschrift: [falls erforderlich].", "Datum: [Datum]. Unterschrift nur bei Papierübermittlung."] },
        { title: "12. Erstattungen und Beschwerden", paragraphs: ["Bei Fragen zu Zahlung, Credits oder Widerruf: hello@vonuai.com oder legal@vonuai.com mit Stripe-Beleg/Referenz. Zwingende Verbraucheransprüche bleiben unberührt."] },
        { title: "13. Verfügbarkeit und Missbrauchsschutz", paragraphs: ["Funktionen können aus Sicherheits-, Qualitäts-, Kosten- oder Anbietergründen geändert, gewartet oder vorübergehend ausgesetzt werden. Angemessene Limits können missbräuchliche Automatisierung, Zahlungsbetrug oder systematische Umgehung der Gratisgrenze verhindern."] },
        { title: "14. Geistiges Eigentum", paragraphs: ["Marke, Software, interne Regeln, Texte und Design von Vonu bleiben geschützt. Die Nutzung überträgt keine Eigentumsrechte daran."] },
        { title: "15. Haftung", paragraphs: ["Vonu ersetzt keine unabhängige Prüfung und garantiert nicht die Erkennung jeder Bedrohung. Zwingende Haftung und Verbraucherrechte bleiben unberührt."] },
        { title: "16. Recht, Gerichtsstand und Sprache", paragraphs: ["Spanisches Recht gilt, soweit einschlägig, ohne zwingende Rechte im Wohnsitzstaat einzuschränken. Übersetzungen sollen denselben Inhalt vermitteln und dürfen nicht so ausgelegt werden, dass zwingende Rechte vermindert werden."] },
        { title: "17. Kontakt und Änderungen", paragraphs: ["Rechtlicher Kontakt: legal@vonuai.com. Es gilt die mit Datum veröffentlichte aktuelle Fassung."] },
      ],
    },
    cookies: {
      title: "Cookies und lokale Speicherung",
      description: "Technische Speicherung und datenschutzorientierte Analysen bei Vonu.",
      eyebrow: "Datenschutz",
      hero: "Was im Browser gespeichert wird und warum.",
      updatedAt: UPDATED.de,
      sections: [
        { title: "1. Aktueller Stand", paragraphs: ["Vonu verwendet in der öffentlichen Prüffunktion derzeit weder Google Analytics noch Werbe-Cookies. Die Hauptmessung erfolgt über Vercel Web Analytics und Produkt-Events."] },
        { title: "2. Notwendiges Geräte-Cookie", paragraphs: ["Das First-Party-Cookie vonu_device_id enthält eine zufällige pseudonyme Kennung, nicht Name, E-Mail oder Prüfinhalt. Es erkennt Gratisnutzung und gekaufte Credits und hat technisch etwa ein Jahr Laufzeit, sofern es nicht vorher gelöscht wird."] },
        { title: "3. Vercel Web Analytics", paragraphs: ["Vercel Web Analytics nutzt keine Third-Party-Analytics-Cookies und liefert aggregierte Messungen zu Seiten, Referrern, ungefährer Geolokalisierung, Browser, Betriebssystem, Gerät und Custom Events.", "Vonu vermeidet die Übermittlung von Roh-Nachricht, Screenshot, E-Mail oder vollständiger analysierter URL als Analytics-Eigenschaft."] },
        { title: "4. Stripe und externe Dienste", paragraphs: ["Beim freiwilligen Öffnen von Stripe Checkout kann Stripe eigene Technologien für Sicherheit, Betrugsprävention und Zahlung einsetzen."] },
        { title: "5. Keine Werbeprofilierung", paragraphs: ["Das aktuelle öffentliche Produkt nutzt keine Werbe-Cookies oder websiteübergreifende Verhaltenswerbung. Künftige nicht notwendige Technologien werden dokumentiert und, falls erforderlich, erst nach Einwilligung aktiviert."] },
        { title: "6. Löschen von Browserdaten", paragraphs: ["Cookies löschen, privates Surfen oder Gerätewechsel kann die Zuordnung von Gratisstatus und Credits entfernen. Stripe-Belege nach einem Kauf aufbewahren."] },
        { title: "7. Browser-Einstellungen", paragraphs: ["Cookies und Speicher können im Browser eingesehen, blockiert oder gelöscht werden. Das Blockieren technisch notwendiger Speicherung kann das Credit-System beeinträchtigen."] },
        { title: "8. Kontakt", paragraphs: ["Datenschutzfragen: privacy@vonuai.com. Wesentliche Änderungen werden auf dieser Seite aktualisiert."] },
      ],
    },
    "responsible-use": {
      title: "Verantwortungsvolle Nutzung",
      description: "Wie Vonu-Analysen und KI-gestützte Risikohinweise sicher eingeordnet werden sollten.",
      eyebrow: "Sicherheit",
      hero: "Vonu zeigt Signale. Die endgültige Entscheidung braucht zusätzlich Kontext und unabhängige Prüfung.",
      updatedAt: UPDATED.de,
      sections: [
        { title: "1. Aufgabe von Vonu", paragraphs: ["Vonu prüft Nachrichten, Screenshots, Links und Websites, um Risikosignale und sinnvolle nächste Prüfungen vor Vertrauen, Antwort, Datenweitergabe oder Zahlung sichtbar zu machen."] },
        { title: "2. Du interagierst mit KI", paragraphs: ["Vonu nutzt künstliche Intelligenz und automatisierte technische Prüfungen. KI kann Kontext falsch verstehen oder eine fehlerhafte Erklärung erzeugen. Das Ergebnis ist präventive Orientierung, kein Urteil."] },
        { title: "3. Ein Wert ist kein Beweis", paragraphs: ["Der 0-100-Index fasst verfügbare Hinweise zusammen. Er ist keine exakte Betrugswahrscheinlichkeit, bestätigt keine Identität und beweist keine Straftat. Ein niedriger Wert garantiert keine Sicherheit."] },
        { title: "4. Unabhängig prüfen", paragraphs: ["Bei Geld-, Code-, Zugangsdaten- oder Dringlichkeitsforderungen im Namen von Bank, Angehörigen, Unternehmen oder Behörden über einen unabhängig ermittelten offiziellen Kanal prüfen."] },
        { title: "5. Keine Geheimnisse übermitteln", paragraphs: ["Keine Passwörter, OTPs, Recovery Keys, PINs, vollständigen Kartendaten oder Bankzugänge eingeben. Nicht benötigte Drittdaten maskieren."] },
        { title: "6. Links und Websites", paragraphs: ["HTTPS, Domainalter oder kein Treffer in einer Threat-Datenbank beweisen keine Seriosität. URLs mit privaten Tokens oder geheimen Parametern vermeiden."] },
        { title: "7. Hohe und niedrige Ergebnisse", paragraphs: ["Bei hohem Risiko die sensible Aktion stoppen und die stärksten Hinweise prüfen. Bei niedrigem Risiko weiterhin äußeren Kontext und ungewöhnliche Änderungen berücksichtigen."] },
        { title: "8. Wenn bereits gezahlt oder Daten geteilt wurden", paragraphs: ["Bank/Zahlungsanbieter schnell kontaktieren, Konten absichern, kompromittierte Zugänge ändern, Beweise sichern und offizielle Meldewege nutzen."] },
        { title: "9. Professionelle und Notfallgrenzen", paragraphs: ["Vonu ersetzt weder Bank, Anwalt, Arzt, Notdienst, Plattform noch Behörde. Bei unmittelbarer Gefahr, Erpressung, unbefugtem Kontozugriff oder erheblichem finanziellen Verlust offizielle Kanäle sofort nutzen."] },
        { title: "10. Minderjährige und Drittdaten", paragraphs: ["Minderjährige sollen Vonu bei Bedarf unter angemessener Aufsicht nutzen. Keine unnötigen intimen, identifizierenden oder sensiblen Daten über Kinder oder andere Personen hochladen."] },
        { title: "11. Verbotene Nutzungen", items: ["Betrug, Phishing oder Identitätsmissbrauch erstellen oder verbessern.", "Zugangsdaten, Codes oder sensible Drittdaten erlangen.", "Belästigung, Erpressung oder Manipulation.", "Systeme ohne Erlaubnis angreifen oder ausforschen.", "Vonu-Werte als endgültigen Schuld- oder Identitätsbeweis darstellen."] },
        { title: "12. Kontakt", paragraphs: ["Offensichtlich falsche Ergebnisse können an hello@vonuai.com gemeldet werden, ohne unnötige Geheimnisse oder sensible Daten zu senden."] },
      ],
    },
  },
  ar: {
    "legal-notice": {
      title: "إشعار قانوني",
      description: "من يقدّم Vonu، وما الذي يفعله، وما الحدود القانونية الأساسية لاستخدامه.",
      eyebrow: "قانوني",
      hero: "معلومات واضحة عن مشغّل Vonu وكيفية استخدام الخدمة.",
      updatedAt: UPDATED.ar,
      sections: [
        { title: "1. مقدم الخدمة", paragraphs: [`يتم تشغيل Vonu وموقع vonuai.com بواسطة ${IDENTITY.ar}`, "للتواصل العام: hello@vonuai.com. للمسائل القانونية: legal@vonuai.com. للخصوصية: privacy@vonuai.com."] },
        { title: "2. غرض Vonu", paragraphs: ["Vonu أداة فحص وقائي لمراجعة الرسائل ولقطات الشاشة والروابط والمواقع قبل الثقة أو الرد أو مشاركة البيانات أو الدفع.", "تجمع النتائج بين التحليل الآلي والذكاء الاصطناعي والقواعد الداخلية، وقد تشمل فحوصاً تقنية أو فحوص سمعة لبعض الروابط. النتيجة إرشاد مبني على الإشارات المتاحة وليست شهادة بأن شخصاً أو شركة أو رسالة أو موقعاً شرعي أو احتيالي."] },
        { title: "3. الاستخدام القانوني والمسؤول", paragraphs: ["يجب استخدام Vonu بصورة قانونية وحسنة النية مع احترام حقوق الغير. يُحظر استخدامه للاحتيال أو انتحال الهوية أو الحصول على بيانات الدخول أو مهاجمة الأنظمة أو التحرش أو تسهيل نشاط غير قانوني."] },
        { title: "4. الذكاء الاصطناعي وحدود الخدمة", paragraphs: ["يستخدم Vonu الذكاء الاصطناعي وفحوصاً آلية يمكن أن تخطئ أو تفتقد السياق أو لا تكتشف تهديداً جديداً. النتيجة المنخفضة لا تضمن الأمان والنتيجة المرتفعة لا تثبت وقوع جريمة أو احتيال.", "في القرارات الحساسة تحقق أيضاً عبر قناة رسمية أو مستقلة."] },
        { title: "5. الملكية الفكرية", paragraphs: ["علامة Vonu وبرمجياته وتصميمه ونصوصه الأصلية وقواعده الداخلية محمية. يحتفظ المستخدم بحقوقه في المحتوى الذي يرسله ويمنح فقط الإذن اللازم لمعالجته لتقديم الوظيفة المطلوبة."] },
        { title: "6. خدمات الغير", paragraphs: ["تعتمد بعض الوظائف على مزودي بنية تحتية أو دفع أو ذكاء اصطناعي أو بريد أو بيانات نطاقات أو معلومات تهديدات. لا يتحكم Vonu في توافر هذه الخدمات دائماً أو اكتمال بياناتها."] },
        { title: "7. المسؤولية", paragraphs: ["يتخذ Vonu تدابير معقولة لتقديم نتائج مفهومة لكنه لا يضمن الدقة المطلقة أو التوافر المستمر أو خلو الخدمة من الأخطاء. لا يستبعد هذا الإشعار أي حق إلزامي للمستهلك أو مسؤولية لا يجوز استبعادها قانوناً."] },
        { title: "8. القانون وحماية المستهلك", paragraphs: ["تُدار الخدمة من إسبانيا. يطبق القانون الإسباني حيث يكون ذلك مناسباً، دون المساس بقواعد حماية المستهلك والاختصاص القضائي الإلزامية في بلد إقامة المستهلك."] },
        { title: "9. الشكاوى والتواصل", paragraphs: ["للمسائل القانونية أو الشكاوى: legal@vonuai.com. للدعم: hello@vonuai.com."] },
        { title: "10. التحديثات", paragraphs: ["قد يتم تحديث هذا الإشعار عند تغير المنتج أو المزودين أو المتطلبات القانونية. النسخة الحالية وتاريخها منشوران في هذه الصفحة."] },
      ],
    },
    privacy: {
      title: "سياسة الخصوصية",
      description: "كيف يعالج Vonu المحتوى المرسل ومعرّف الجهاز والمدفوعات وبيانات التحليلات.",
      eyebrow: "الخصوصية",
      hero: "ما الذي يستلمه Vonu، ولماذا، وما الحقوق المتاحة لك.",
      updatedAt: UPDATED.ar,
      sections: [
        { title: "1. مسؤول المعالجة", paragraphs: [`مسؤول المعالجة هو ${IDENTITY.ar}`, "للتواصل: privacy@vonuai.com."] },
        { title: "2. البيانات التي قد نعالجها", items: ["محتوى الفحص: نصوص ورسائل ولقطات وصور وروابط والبيانات الظاهرة فيها.", "بيانات تقنية: نوع الفحص والإشارات ودرجة/فئة الخطر والمدة والحالة وبيانات عامة عن النطاق.", "معرّف عشوائي مستعار للمتصفح/الجهاز لإدارة الاستخدام المجاني والأرصدة المشتراة.", "بيانات التواصل أو النشرة التي ترسلها طوعاً.", "معرّفات الدفع والمعاملات من Stripe؛ لا يحتاج Vonu إلى حفظ رقم البطاقة الكامل.", "بيانات قياس مجمعة مثل الصفحات والمصدر والبلد/المنطقة التقريبية والمتصفح/الجهاز وأحداث المنتج."] },
        { title: "3. الأغراض والأسس القانونية", paragraphs: ["تستخدم البيانات لتقديم الفحص المطلوب، وإدارة الأرصدة، ومعالجة المشتريات، والرد على الدعم، ومنع إساءة الاستخدام، وتأمين الخدمة وتشخيصها، وقياس الأداء، والوفاء بالالتزامات القانونية أو المحاسبية أو الضريبية.", "قد يكون الأساس القانوني تنفيذ الخدمة أو العقد، أو إجراءات ما قبل التعاقد، أو الموافقة، أو التزاماً قانونياً، أو مصلحة مشروعة في الأمن وتحسين المنتج بعد موازنة حقوق المستخدم."] },
        { title: "4. الذكاء الاصطناعي", paragraphs: ["قد تتم معالجة فحوص النصوص أو الصور بواسطة مزودي ذكاء اصطناعي مثل OpenAI أو Google بحسب الوظيفة النشطة. يطبق Vonu بعد ذلك قواعد المعايرة الخاصة به.", "النتيجة إرشاد وقائي وليست قراراً آلياً ينتج أثراً قانونياً أو أثراً مهماً مماثلاً على المستخدم."] },
        { title: "5. الروابط والفحوص الخارجية", paragraphs: ["قد يقوم Vonu بفتح الرابط من بنيته أو الاستعلام لدى خدمات مثل URLhaus أو RDAP العامة. لا ترسل روابط تحتوي كلمات مرور أو رموزاً خاصة أو معاملات سرية غير ضرورية."] },
        { title: "6. الاستخدام بدون حساب", paragraphs: ["يمكن استخدام Vonu Check بدون حساب. تستخدم الخدمة ملف تعريف ارتباط ضرورياً من الطرف الأول باسم vonu_device_id يحتوي معرّفاً عشوائياً مستعاراً ولا يحتوي الاسم أو البريد أو المحتوى المرسل.", "حذف بيانات المتصفح أو تغيير الجهاز قد يمنع التعرف على الرصيد السابق."] },
        { title: "7. المدفوعات", paragraphs: ["تتم معالجة المدفوعات بواسطة Stripe. يرسل Vonu الحد الأدنى من البيانات التشغيلية اللازمة لربط الشراء بالجهاز وإضافة الأرصدة. يعالج Stripe بيانات الدفع والفوترة ومنع الاحتيال وفق مسؤولياته القانونية وشروطه."] },
        { title: "8. المزودون", items: ["Vercel: الاستضافة والتنفيذ والتحليلات وقياس الأداء.", "Supabase: قاعدة البيانات ووظائف الخلفية.", "OpenAI وGoogle: معالجة الذكاء الاصطناعي عند تفعيلها.", "Stripe: الدفع والإيصالات ومنع احتيال الدفع.", "Resend: إرسال رسائل التواصل.", "abuse.ch/URLhaus وRDAP: معلومات تقنية لفحوص الروابط ذات الصلة."] },
        { title: "9. النقل الدولي", paragraphs: ["قد يعالج بعض المزودين البيانات خارج المنطقة الاقتصادية الأوروبية. عند الحاجة يجب أن يعتمد النقل على قرار ملاءمة أو ضمانات مناسبة مثل البنود التعاقدية القياسية للاتحاد الأوروبي والتدابير الإضافية اللازمة."] },
        { title: "10. مدة الاحتفاظ", paragraphs: ["نحتفظ بالبيانات فقط بقدر ما يلزم للغرض والالتزامات القانونية. العمر التقني لملف الجهاز يقارب سنة ما لم يُحذف قبل ذلك؛ وتخضع سجلات الدفع والفوترة للمدد القانونية.", "لا يُرسل المحتوى الخام إلى تحليلات المنتج. وإذا كانت وظيفة أمن أو جودة مفعلة تحفظ تقريراً مشتقاً أو مخفياً جزئياً، فيقتصر ذلك على غرض تلك الوظيفة ولا ينبغي أن يتضمن أسراراً غير ضرورية."] },
        { title: "11. التحليلات وأحداث المنتج", paragraphs: ["يستخدم Vercel Web Analytics لقياس الصفحات والمصدر والبلد/المنطقة والجهاز/المتصفح وأحداث مثل نوع التحليل واللغة والفئة ومستوى الخطر والمدة والنجاح أو الخطأ بصورة مجمعة ودون ملفات تعريف ارتباط تحليلية من طرف ثالث.", "لا يرسل Vonu عمداً الرسالة أو لقطة الشاشة أو البريد الإلكتروني أو الرابط الكامل الذي تم تحليله كخاصية تحليلية."] },
        { title: "12. البيانات الحساسة وبيانات الغير والقاصرون", paragraphs: ["لا ترسل كلمات المرور أو رموز OTP أو PIN أو بيانات البطاقة الكاملة أو وثائق الهوية الكاملة أو بيانات طبية غير لازمة أو أسراراً أخرى. أخفِ بيانات الغير غير اللازمة.", "إذا استخدم قاصر Vonu فينبغي وجود إشراف من ولي الأمر عندما يتطلب القانون ذلك. لا ينبغي للقاصر إجراء شراء دون الإذن القانوني اللازم."] },
        { title: "13. حقوقك", paragraphs: ["بحسب القانون يمكنك طلب الوصول أو التصحيح أو الحذف أو النقل أو التقييد أو الاعتراض وسحب الموافقة. تواصل عبر privacy@vonuai.com.", "يمكنك أيضاً تقديم شكوى إلى الوكالة الإسبانية لحماية البيانات AEPD أو سلطة رقابية مختصة أخرى."] },
        { title: "14. الأمان والتغييرات", paragraphs: ["نطبق تدابير تقنية وتنظيمية معقولة، ولا يمكن لأي نظام متصل بالإنترنت ضمان أمان مطلق. سنحدث هذه السياسة عند حدوث تغيير جوهري."] },
      ],
    },
    terms: {
      title: "الشروط والأحكام",
      description: "شروط استخدام Vonu وشراء أرصدة التحليل الإضافية.",
      eyebrow: "الشروط",
      hero: "قواعد استخدام Vonu وشراء تحليلات إضافية.",
      updatedAt: UPDATED.ar,
      sections: [
        { title: "1. مقدم الخدمة وقبول الشروط", paragraphs: [`يقدم Vonu بواسطة ${IDENTITY.ar}`, "باستخدام الخدمة فإنك تقبل هذه الشروط وسياسة الخصوصية ومعلومات ملفات الارتباط وقواعد الاستخدام المسؤول، دون التنازل عن أي حق إلزامي للمستهلك."] },
        { title: "2. ما الذي يقدمه Vonu", paragraphs: ["يفحص Vonu الرسائل والنصوص واللقطات والروابط والمواقع بحثاً عن إشارات مرتبطة بالاحتيال أو التصيد أو الانتحال أو الضغط أو مخاطر رقمية أخرى. درجة الخطر مؤشر وليست احتمالاً رياضياً أو شهادة رسمية."] },
        { title: "3. شفافية الذكاء الاصطناعي", paragraphs: ["يستخدم Vonu الذكاء الاصطناعي وفحوصاً آلية قد تكون خاطئة أو غير مكتملة. النتيجة ليست استشارة قانونية أو مالية أو طبية أو طارئة ولا تثبت وقوع جريمة."] },
        { title: "4. الاستخدام المسؤول والمحتوى", paragraphs: ["يجب أن يكون لديك أساس قانوني لإرسال المحتوى وأن تقلل البيانات الشخصية إلى الضروري. تمنح Vonu الإذن المحدود اللازم لمعالجة المحتوى لتقديم الوظيفة المطلوبة.", "يُحظر الاحتيال والتصيد والانتحال وسرقة بيانات الدخول والوصول غير المصرح به والتحرش والابتزاز والاستخدام غير القانوني لبيانات الغير."] },
        { title: "5. الاستخدام بدون حساب", paragraphs: ["يعمل Vonu Check حالياً بدون تسجيل ويستخدم معرّفاً عشوائياً مستعاراً للمتصفح/الجهاز لإدارة التحليل المجاني والأرصدة. حذف بيانات المتصفح أو تغيير الجهاز قد يفصل هذا الارتباط."] },
        { title: "6. التحليل المجاني والحزم", paragraphs: ["عند الإطلاق يوجد تحليل مجاني واحد لكل متصفح/جهاز معروف. بعد ذلك يكون العرض الحالي 3 تحليلات إضافية مقابل 3.99 € ما لم يظهر عرض لاحق بوضوح قبل الشراء.", "يُستهلك رصيد عند اكتمال تحليل قابل للفوترة. الأخطاء التقنية المصنفة صراحة كغير قابلة للفوترة لا يفترض أن تستهلك رصيداً."] },
        { title: "7. السعر والضرائب والدفع", paragraphs: ["يظهر السعر الإجمالي قبل الدفع. مبلغ 3.99 € دفعة واحدة وليس اشتراكاً ولا يتجدد تلقائياً. السعر المعروض للمستهلك يشمل الضرائب عند انطباقها، ويعرض Stripe المبلغ النهائي وطرق الدفع المتاحة قبل التأكيد."] },
        { title: "8. خطوات التعاقد الإلكتروني", items: ["اختيار الحزمة.", "مراجعة السعر والخصائص الرئيسية والروابط القانونية والتأكيدات المطلوبة.", "الانتقال إلى Stripe Checkout ومراجعة أو تصحيح بيانات الدفع/الفوترة.", "تأكيد الدفع.", "العودة إلى Vonu وإضافة الأرصدة إلى الجهاز المعروف."] },
        { title: "9. حفظ العقد وتصحيح الأخطاء", paragraphs: ["يحتفظ Vonu وStripe بسجلات المعاملة اللازمة للدفع والمحاسبة والضرائب والدعم ومنع الاحتيال، وقد يرسل Stripe إيصالاً.", "قبل الدفع يمكنك العودة أو تصحيح المعلومات في Checkout. بعد الدفع يمكن للدعم العثور على العملية من خلال إيصال Stripe. يمكن إبرام العقد بالإسبانية أو الإنجليزية أو الفرنسية أو الألمانية أو العربية عبر النسخة المقابلة من الموقع."] },
        { title: "10. التنفيذ الفوري وحق الانسحاب", paragraphs: ["يتمتع المستهلك عادة بمدة الانسحاب القانونية ما لم ينطبق استثناء قانوني. ولأن الخدمة قد تصبح متاحة فوراً، يطلب Vonu طلباً صريحاً لبدء التنفيذ خلال تلك المدة وإقراراً بأن حق الانسحاب قد يتأثر مع تنفيذ الخدمة، فقط في الحدود التي يسمح بها القانون الإلزامي.", "إذا تم انسحاب صحيح بعد تنفيذ جزء من الخدمة بناءً على طلب صريح، فتطبق النتائج التي يحددها قانون المستهلك، بما في ذلك عند الاقتضاء مبلغ نسبي. لا تفرض هذه الشروط تنازلاً أوسع مما يسمح به القانون."] },
        { title: "11. نموذج الانسحاب", items: ["إلى: Vonu / Francisco Luis Martínez Miralles — legal@vonuai.com", "أبلغكم بموجب هذا بانسحابي من عقد شراء Vonu التالي: [حدد الشراء أو إيصال Stripe].", "تاريخ الطلب: [التاريخ].", "اسم المستهلك: [الاسم].", "العنوان: [إذا كان لازماً].", "التاريخ: [التاريخ]. التوقيع فقط عند الإرسال ورقياً."] },
        { title: "12. الاسترداد والشكاوى", paragraphs: ["لأسئلة الدفع أو الأرصدة أو الانسحاب: hello@vonuai.com أو legal@vonuai.com مع إيصال أو مرجع Stripe. تبقى حقوق المستهلك الإلزامية كاملة."] },
        { title: "13. التوافر ومنع إساءة الاستخدام", paragraphs: ["قد يعدل Vonu أو يصون أو يوقف مؤقتاً وظائف لأسباب أمنية أو جودة أو تكلفة أو اعتماد على مزود. قد تطبق حدود معقولة لمنع الأتمتة المسيئة أو احتيال الدفع أو التحايل المنهجي على الحد المجاني."] },
        { title: "14. الملكية الفكرية", paragraphs: ["تظل علامة Vonu وبرمجياته وقواعده الداخلية ونصوصه وتصميمه محمية. استخدام الخدمة لا ينقل ملكية هذه العناصر."] },
        { title: "15. المسؤولية", paragraphs: ["لا يحل Vonu محل التحقق المستقل ولا يضمن اكتشاف كل تهديد. لا تستبعد هذه الشروط أي مسؤولية أو حق للمستهلك لا يجوز استبعاده قانوناً."] },
        { title: "16. القانون والاختصاص واللغة", paragraphs: ["يطبق القانون الإسباني حيث يكون مناسباً دون المساس بالحماية الإلزامية في بلد إقامة المستهلك. تهدف الترجمات إلى نقل نفس الشروط ولا يجوز تفسيرها بما يقلل حقاً إلزامياً."] },
        { title: "17. التواصل والتغييرات", paragraphs: ["للمسائل القانونية: legal@vonuai.com. النسخة السارية هي المنشورة هنا مع تاريخها."] },
      ],
    },
    cookies: {
      title: "ملفات تعريف الارتباط والتخزين المحلي",
      description: "التخزين التقني والتحليلات التي تراعي الخصوصية في Vonu.",
      eyebrow: "الخصوصية",
      hero: "ما الذي يُخزن في متصفحك ولماذا.",
      updatedAt: UPDATED.ar,
      sections: [
        { title: "1. الوضع الحالي", paragraphs: ["لا يستخدم Vonu حالياً Google Analytics أو ملفات تعريف ارتباط إعلانية في تجربة الفحص العامة. يعتمد القياس أساساً على Vercel Web Analytics وأحداث المنتج."] },
        { title: "2. ملف الجهاز الضروري", paragraphs: ["يستخدم Vonu ملف طرف أول ضرورياً باسم vonu_device_id يحوي معرّفاً عشوائياً مستعاراً ولا يحتوي الاسم أو البريد أو محتوى الفحص. يستخدم لمعرفة التحليل المجاني والأرصدة المشتراة، بعمر تقني يقارب سنة ما لم يُحذف قبل ذلك."] },
        { title: "3. Vercel Web Analytics", paragraphs: ["لا يعتمد Vercel Web Analytics على ملفات تحليلية من طرف ثالث، ويقدم قياسات مجمعة عن الصفحات والمصدر والموقع التقريبي والمتصفح ونظام التشغيل ونوع الجهاز والأحداث المخصصة.", "يضبط Vonu الأحداث لتجنب إرسال الرسالة الخام أو لقطة الشاشة أو البريد أو الرابط الكامل الذي تم تحليله كخاصية تحليلية."] },
        { title: "4. Stripe والخدمات الخارجية", paragraphs: ["عند فتح Stripe Checkout طوعاً قد يستخدم Stripe تقنياته الخاصة للأمان ومنع الاحتيال وتنفيذ الدفع وفق سياساته."] },
        { title: "5. لا يوجد استهداف إعلاني", paragraphs: ["المنتج العام الحالي لا يستخدم ملفات إعلانية أو إعلاناً سلوكياً عابراً للمواقع. أي تقنية مستقبلية غير ضرورية ستُشرح وسيُطلب لها موافقة عندما يفرض القانون ذلك."] },
        { title: "6. حذف بيانات المتصفح", paragraphs: ["حذف الملفات أو استخدام التصفح الخاص أو تغيير الجهاز قد يزيل ارتباط الحالة المجانية أو الأرصدة. احتفظ بإيصال Stripe بعد الشراء."] },
        { title: "7. تحكم المتصفح", paragraphs: ["يمكنك عرض ملفات الارتباط أو حظرها أو حذفها من إعدادات المتصفح. حظر التخزين الضروري قد يمنع نظام الأرصدة من العمل."] },
        { title: "8. التواصل", paragraphs: ["لأسئلة الخصوصية: privacy@vonuai.com. سيتم تحديث هذه الصفحة إذا تغيرت إعدادات التخزين أو التحليلات بصورة جوهرية."] },
      ],
    },
    "responsible-use": {
      title: "الاستخدام المسؤول",
      description: "كيفية تفسير فحوص Vonu والتحليل المدعوم بالذكاء الاصطناعي بصورة آمنة.",
      eyebrow: "الأمان",
      hero: "يساعد Vonu على إظهار الإشارات، لكن القرار النهائي يحتاج أيضاً إلى السياق والتحقق المستقل.",
      updatedAt: UPDATED.ar,
      sections: [
        { title: "1. دور Vonu", paragraphs: ["يفحص Vonu الرسائل واللقطات والروابط والمواقع لإظهار إشارات الخطر والخطوات المفيدة قبل الثقة أو الرد أو مشاركة البيانات أو الدفع."] },
        { title: "2. أنت تتفاعل مع ذكاء اصطناعي", paragraphs: ["يستخدم Vonu الذكاء الاصطناعي وفحوصاً تقنية آلية. قد يسيء الذكاء الاصطناعي فهم السياق أو ينتج تفسيراً غير صحيح. النتيجة إرشاد وقائي وليست حكماً نهائياً."] },
        { title: "3. الدرجة ليست دليلاً", paragraphs: ["مؤشر 0-100 يلخص الأدلة المتاحة. ليس احتمالاً دقيقاً للاحتيال ولا يثبت الهوية أو وقوع جريمة. الدرجة المنخفضة لا تضمن الأمان."] },
        { title: "4. تحقق بشكل مستقل", paragraphs: ["إذا طلب بنك أو قريب أو شركة أو جهة أو دعم تقني مالاً أو رموزاً أو بيانات دخول أو إجراءً عاجلاً، فتحقق عبر قناة رسمية حصلت عليها بشكل مستقل."] },
        { title: "5. لا ترسل الأسرار", paragraphs: ["لا ترسل كلمات المرور أو رموز OTP أو مفاتيح الاسترداد أو PIN أو أرقام البطاقات الكاملة أو بيانات الدخول البنكية. أخفِ بيانات الغير غير اللازمة."] },
        { title: "6. الروابط والمواقع", paragraphs: ["HTTPS أو قدم النطاق أو غياب نتيجة في قاعدة تهديدات لا يثبت الشرعية. تجنب الروابط التي تحتوي رموزاً خاصة أو معاملات سرية."] },
        { title: "7. النتائج المرتفعة والمنخفضة", paragraphs: ["عند الخطر المرتفع أوقف الإجراء الحساس وتحقق من أقوى الإشارات. عند الخطر المنخفض استمر في مراعاة السياق الخارجي والطلبات غير المتوقعة."] },
        { title: "8. إذا دفعت أو شاركت بيانات بالفعل", paragraphs: ["تواصل سريعاً مع البنك أو مزود الدفع، أمّن الحسابات، غيّر بيانات الدخول المتأثرة، احتفظ بالأدلة واستخدم قنوات الإبلاغ الرسمية."] },
        { title: "9. الحدود المهنية والطوارئ", paragraphs: ["لا يحل Vonu محل البنك أو المحامي أو الطبيب أو خدمات الطوارئ أو المنصة أو السلطات. عند وجود خطر فوري أو ابتزاز أو دخول غير مصرح به أو خسارة مالية مهمة استخدم القنوات الرسمية فوراً."] },
        { title: "10. القاصرون وبيانات الغير", paragraphs: ["ينبغي أن يستخدم القاصر Vonu تحت إشراف مناسب عند الحاجة. لا ترفع معلومات حميمة أو تعريفية أو حساسة غير لازمة عن طفل أو شخص آخر."] },
        { title: "11. استخدامات محظورة", items: ["إنشاء أو تحسين الاحتيال أو التصيد أو الانتحال.", "الحصول على بيانات دخول أو رموز أو بيانات حساسة للغير.", "التحرش أو الابتزاز أو التلاعب.", "مهاجمة أو استكشاف أنظمة دون تصريح.", "تقديم درجة Vonu كدليل نهائي على الذنب أو الهوية."] },
        { title: "12. التواصل", paragraphs: ["يمكن الإبلاغ عن نتيجة خاطئة بوضوح عبر hello@vonuai.com دون إرسال أسرار أو بيانات حساسة غير لازمة."] },
      ],
    },
  },
};

export function getLegalPageMeta(locale: LocalizedLocale, document: LegalDocument) {
  const doc = DOCS[locale][document];
  return { title: `${doc.title} — Vonu`, description: doc.description };
}

export default function LocalizedLegalDocument({
  locale,
  document,
}: {
  locale: LocalizedLocale;
  document: LegalDocument;
}) {
  const doc = DOCS[locale][document];

  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#0d101b] text-slate-200">
      <HomeHeader />
      <LegalPage locale={locale} title={doc.title} description={doc.description} updatedAt={doc.updatedAt}>
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items?.length ? (
              <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
            ) : null}
          </section>
        ))}
      </LegalPage>

      <HomeFooter />
    </main>
  );
}
