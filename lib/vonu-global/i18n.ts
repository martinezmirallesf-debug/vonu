import type { SupportedLocale } from "@/lib/vonu-check/types";

export const GLOBAL_LOCALES: SupportedLocale[] = ["es", "en", "fr", "de", "ar"];
export const INDEXED_PUBLIC_SLUGS = [
  "producto",
  "casos-de-uso",
  "recursos",
  "precios",
  "como-funciona",
  "contacto",
  "comprobar-web-fiable",
  "comprobar-tienda-online",
  "analizar-link-sospechoso",
  "analizar-captura-pantalla",
  "analizar-sms-estafa",
  "email-sospechoso-estafa",
  "detectar-perfil-falso",
  "comprobar-inversion-estafa",
  "revisar-contrato",
  "revisar-contrato-alquiler",
  "comprobar-factura",
  "revisar-presupuesto",
  "revisar-contrato-servicios",
  "revisar-prestamo-financiacion",
  "detectar-manipulacion",
  "estafas-criptomonedas",
  "llamada-banco-codigo-sms",
  "es-fiable",
] as const;

export type IndexedPublicSlug = (typeof INDEXED_PUBLIC_SLUGS)[number];

export const localeInfo: Record<SupportedLocale, { label: string; native: string; dir: "ltr" | "rtl"; htmlLang: string }> = {
  es: { label: "ES", native: "Español", dir: "ltr", htmlLang: "es" },
  en: { label: "EN", native: "English", dir: "ltr", htmlLang: "en" },
  fr: { label: "FR", native: "Français", dir: "ltr", htmlLang: "fr" },
  de: { label: "DE", native: "Deutsch", dir: "ltr", htmlLang: "de" },
  ar: { label: "AR", native: "العربية", dir: "rtl", htmlLang: "ar" },
};

export function isGlobalLocale(value: string): value is SupportedLocale {
  return GLOBAL_LOCALES.includes(value as SupportedLocale);
}

export function isIndexedPublicSlug(value: string): value is IndexedPublicSlug {
  return INDEXED_PUBLIC_SLUGS.includes(value as IndexedPublicSlug);
}

export function publicPath(locale: SupportedLocale, slug: IndexedPublicSlug) {
  return locale === "es" ? `/${slug}` : `/${locale}/${slug}`;
}

export function checkPath(locale: SupportedLocale) {
  return `/${locale}/check`;
}

export function languageAlternates(slug: IndexedPublicSlug) {
  return {
    es: `https://vonuai.com/${slug}`,
    en: `https://vonuai.com/en/${slug}`,
    fr: `https://vonuai.com/fr/${slug}`,
    de: `https://vonuai.com/de/${slug}`,
    ar: `https://vonuai.com/ar/${slug}`,
    "x-default": `https://vonuai.com/${slug}`,
  };
}

type NavCopy = {
  product: string;
  cases: string;
  resources: string;
  pricing: string;
  how: string;
  analyze: string;
  legal: string;
  privacy: string;
  terms: string;
  responsible: string;
  contact: string;
  language: string;
};

export const navCopy: Record<SupportedLocale, NavCopy> = {
  es: {
    product: "Producto",
    cases: "Casos de uso",
    resources: "Recursos",
    pricing: "Precios",
    how: "Cómo funciona",
    analyze: "Analizar ahora",
    legal: "Legal",
    privacy: "Privacidad",
    terms: "Términos",
    responsible: "Uso responsable",
    contact: "Contacto",
    language: "Idioma",
  },
  en: {
    product: "Product",
    cases: "Use cases",
    resources: "Resources",
    pricing: "Pricing",
    how: "How it works",
    analyze: "Analyse now",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    responsible: "Responsible use",
    contact: "Contact",
    language: "Language",
  },
  fr: {
    product: "Produit",
    cases: "Cas d’usage",
    resources: "Ressources",
    pricing: "Tarifs",
    how: "Fonctionnement",
    analyze: "Analyser",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions",
    responsible: "Usage responsable",
    contact: "Contact",
    language: "Langue",
  },
  de: {
    product: "Produkt",
    cases: "Anwendungsfälle",
    resources: "Ressourcen",
    pricing: "Preise",
    how: "So funktioniert’s",
    analyze: "Jetzt analysieren",
    legal: "Impressum",
    privacy: "Datenschutz",
    terms: "Bedingungen",
    responsible: "Verantwortungsvolle Nutzung",
    contact: "Kontakt",
    language: "Sprache",
  },
  ar: {
    product: "المنتج",
    cases: "حالات الاستخدام",
    resources: "المصادر",
    pricing: "الأسعار",
    how: "كيف يعمل",
    analyze: "حلّل الآن",
    legal: "قانوني",
    privacy: "الخصوصية",
    terms: "الشروط",
    responsible: "الاستخدام المسؤول",
    contact: "اتصل بنا",
    language: "اللغة",
  },
};

type Topic = {
  title: string;
  description: string;
  eyebrow: string;
  hero: string;
};

const topics: Record<SupportedLocale, Record<IndexedPublicSlug, Topic>> = {
  es: {
    producto: { title: "Producto — Vonu", description: "Vonu analiza URLs, capturas y mensajes sospechosos para mostrar señales de riesgo antes de actuar.", eyebrow: "Producto", hero: "Comprueba antes de confiar." },
    "casos-de-uso": { title: "Casos de uso — Vonu", description: "Situaciones reales en las que Vonu ayuda a revisar señales antes de pagar, responder o compartir datos.", eyebrow: "Casos de uso", hero: "Cuando algo no encaja, revísalo antes de actuar." },
    recursos: { title: "Recursos — Vonu", description: "Guías prácticas para detectar señales de estafa, phishing, suplantación y riesgo digital.", eyebrow: "Recursos", hero: "Aprende a revisar antes de confiar." },
    precios: { title: "Precios — Vonu", description: "Empieza gratis con Vonu y amplía capacidad cuando necesites más análisis.", eyebrow: "Precios", hero: "Empieza gratis. Amplía cuando lo necesites." },
    "como-funciona": { title: "Cómo funciona Vonu", description: "Entiende cómo Vonu combina señales técnicas y contexto para ayudarte a revisar una situación antes de actuar.", eyebrow: "Cómo funciona", hero: "De una duda a una decisión más informada." },
    contacto: { title: "Contacto — Vonu", description: "Contacta con Vonu para soporte, privacidad o cuestiones sobre el servicio.", eyebrow: "Contacto", hero: "¿Necesitas hablar con nosotros?" },
    "comprobar-web-fiable": { title: "Cómo saber si una web es fiable — Vonu", description: "Revisa una web o tienda online antes de pagar, introducir datos o confiar en ella.", eyebrow: "Webs y enlaces", hero: "Comprueba una web antes de pagar." },
    "comprobar-tienda-online": { title: "Cómo saber si una tienda online es fiable — Vonu", description: "Revisa señales de riesgo de una tienda online antes de comprar o compartir datos.", eyebrow: "Compras online", hero: "Revisa una tienda antes de comprar." },
    "analizar-link-sospechoso": { title: "Analizar un link sospechoso — Vonu", description: "Comprueba redirecciones y señales de riesgo de un enlace antes de abrirlo o introducir datos.", eyebrow: "Enlaces", hero: "Analiza un enlace antes de pulsar." },
    "analizar-captura-pantalla": { title: "Analizar una captura de pantalla — Vonu", description: "Revisa capturas de SMS, WhatsApp, perfiles, webs y pantallas de pago.", eyebrow: "Capturas", hero: "Cuando la duda está en una imagen, analízala." },
    "analizar-sms-estafa": { title: "Cómo saber si un SMS es una estafa — Vonu", description: "Analiza SMS y WhatsApp sospechosos antes de responder, pulsar enlaces o compartir códigos.", eyebrow: "Mensajes", hero: "Revisa el mensaje antes de responder." },
    "email-sospechoso-estafa": { title: "Email sospechoso o phishing — Vonu", description: "Revisa un correo sospechoso para detectar presión, suplantación, enlaces y señales de phishing.", eyebrow: "Email", hero: "Comprueba un email antes de seguir sus instrucciones." },
    "detectar-perfil-falso": { title: "Cómo detectar un perfil falso — Vonu", description: "Revisa señales asociadas a perfiles falsos, cuentas clonadas y suplantación.", eyebrow: "Perfiles", hero: "Revisa la identidad antes de confiar." },
    "comprobar-inversion-estafa": { title: "Comprobar si una inversión es una estafa — Vonu", description: "Revisa promesas, presión y señales de riesgo antes de transferir dinero a una inversión.", eyebrow: "Inversiones", hero: "Antes de invertir, comprueba las señales." },
    "revisar-contrato": { title: "Qué revisar antes de firmar un contrato — Vonu", description: "Ordena cláusulas, obligaciones y puntos que conviene revisar antes de firmar un contrato.", eyebrow: "Contratos", hero: "Revisa antes de firmar." },
    "revisar-contrato-alquiler": { title: "Revisar un contrato de alquiler — Vonu", description: "Identifica cláusulas, fianza, plazos y puntos que conviene revisar antes de firmar un alquiler.", eyebrow: "Alquiler", hero: "Entiende el contrato antes de firmarlo." },
    "comprobar-factura": { title: "Cómo comprobar una factura — Vonu", description: "Revisa importes, conceptos y datos que conviene comprobar antes de pagar una factura.", eyebrow: "Facturas", hero: "Comprueba la factura antes de pagar." },
    "revisar-presupuesto": { title: "Revisar un presupuesto o proforma — Vonu", description: "Revisa precios, impuestos, vigencia, anticipos, exclusiones y condiciones antes de aceptar un presupuesto o proforma.", eyebrow: "Presupuestos", hero: "Revisa el presupuesto antes de aceptarlo." },
    "revisar-contrato-servicios": { title: "Revisar un contrato de servicios — Vonu", description: "Revisa alcance, pagos, duración, renovación, cancelación, responsabilidad y condiciones antes de firmar un contrato de servicios.", eyebrow: "Servicios", hero: "Entiende el servicio antes de firmar." },
    "revisar-prestamo-financiacion": { title: "Revisar un préstamo o financiación — Vonu", description: "Revisa capital, intereses, cuotas, comisiones, coste total, garantías y condiciones antes de aceptar financiación.", eyebrow: "Financiación", hero: "Entiende la financiación antes de aceptarla." },
    "detectar-manipulacion": { title: "Cómo detectar manipulación — Vonu", description: "Ordena una conversación y revisa señales de presión, urgencia o manipulación antes de responder.", eyebrow: "Conversaciones", hero: "Frena la presión y revisa lo que está pasando." },
    "estafas-criptomonedas": { title: "Estafas con criptomonedas — Vonu", description: "Revisa señales de riesgo en inversiones, wallets, soportes y supuestas oportunidades cripto.", eyebrow: "Cripto", hero: "No envíes cripto antes de comprobar las señales." },
    "llamada-banco-codigo-sms": { title: "Me llaman del banco y piden un código SMS — Vonu", description: "Revisa una llamada o mensaje que pide códigos, claves o acciones urgentes en nombre de tu banco.", eyebrow: "Suplantación bancaria", hero: "Un código SMS nunca debería decidirse con prisa." },
    "es-fiable": { title: "¿Es fiable? Compruébalo con Vonu", description: "Revisa una web, mensaje, perfil o situación cuando algo no termina de encajar.", eyebrow: "Vonu Check", hero: "¿Es fiable? Comprueba las señales antes de actuar." },
  },
  en: {
    producto: { title: "Product — Vonu", description: "Vonu analyses suspicious URLs, screenshots and messages to surface risk signals before you act.", eyebrow: "Product", hero: "Check before you trust." },
    "casos-de-uso": { title: "Use cases — Vonu", description: "Real situations where Vonu helps you review signals before paying, replying or sharing data.", eyebrow: "Use cases", hero: "When something feels off, check it before you act." },
    recursos: { title: "Resources — Vonu", description: "Practical guides for spotting scam, phishing, impersonation and online-risk signals.", eyebrow: "Resources", hero: "Learn what to check before you trust." },
    precios: { title: "Pricing — Vonu", description: "Start free with Vonu and add capacity when you need more analyses.", eyebrow: "Pricing", hero: "Start free. Upgrade when you need more." },
    "como-funciona": { title: "How Vonu works", description: "See how Vonu combines technical signals and context to help you review a situation before acting.", eyebrow: "How it works", hero: "From uncertainty to a more informed next step." },
    contacto: { title: "Contact — Vonu", description: "Contact Vonu for support, privacy or service questions.", eyebrow: "Contact", hero: "Need to talk to us?" },
    "comprobar-web-fiable": { title: "Is this website trustworthy? Check it with Vonu", description: "Review a website or online store before paying, entering personal data or trusting it.", eyebrow: "Websites & links", hero: "Check a website before you pay." },
    "comprobar-tienda-online": { title: "Is this online store legitimate? — Vonu", description: "Review an online store for relevant risk signals before buying or sharing data.", eyebrow: "Online shopping", hero: "Check the store before you buy." },
    "analizar-link-sospechoso": { title: "Check a suspicious link — Vonu", description: "Inspect redirects and risk signals before opening a suspicious link or entering data.", eyebrow: "Links", hero: "Check the link before you click." },
    "analizar-captura-pantalla": { title: "Analyse a suspicious screenshot — Vonu", description: "Review screenshots of texts, chats, profiles, websites and payment screens.", eyebrow: "Screenshots", hero: "If the warning sign is in an image, analyse it." },
    "analizar-sms-estafa": { title: "Is this text message a scam? — Vonu", description: "Analyse suspicious SMS or WhatsApp messages before replying, clicking links or sharing codes.", eyebrow: "Messages", hero: "Check the message before you reply." },
    "email-sospechoso-estafa": { title: "Suspicious email or phishing check — Vonu", description: "Review a suspicious email for urgency, impersonation, malicious links and phishing signals.", eyebrow: "Email", hero: "Check the email before following its instructions." },
    "detectar-perfil-falso": { title: "How to spot a fake profile — Vonu", description: "Review signals linked to fake profiles, cloned accounts and impersonation.", eyebrow: "Profiles", hero: "Check the identity before you trust it." },
    "comprobar-inversion-estafa": { title: "Is this investment a scam? — Vonu", description: "Review promises, pressure and risk signals before sending money to an investment opportunity.", eyebrow: "Investments", hero: "Check the signals before you invest." },
    "revisar-contrato": { title: "What to check before signing a contract — Vonu", description: "Organise clauses, obligations and points worth reviewing before signing a contract.", eyebrow: "Contracts", hero: "Review it before you sign." },
    "revisar-contrato-alquiler": { title: "Review a rental agreement — Vonu", description: "Identify clauses, deposits, deadlines and terms worth checking before signing a rental agreement.", eyebrow: "Rentals", hero: "Understand the agreement before you sign." },
    "comprobar-factura": { title: "How to check an invoice — Vonu", description: "Review amounts, line items and details worth checking before paying an invoice.", eyebrow: "Invoices", hero: "Check the invoice before you pay." },
    "revisar-presupuesto": { title: "Review a quote or pro forma — Vonu", description: "Review pricing, taxes, validity, deposits, exclusions and terms before accepting a quote or pro forma.", eyebrow: "Quotes", hero: "Review the quote before you accept it." },
    "revisar-contrato-servicios": { title: "Review a service contract — Vonu", description: "Review scope, fees, duration, renewal, termination, liability and key terms before signing a service contract.", eyebrow: "Services", hero: "Understand the service contract before you sign." },
    "revisar-prestamo-financiacion": { title: "Review a loan or financing agreement — Vonu", description: "Review principal, interest, instalments, fees, total cost, guarantees and conditions before accepting financing.", eyebrow: "Financing", hero: "Understand the financing before you accept it." },
    "detectar-manipulacion": { title: "How to spot manipulation — Vonu", description: "Review a conversation for pressure, urgency and manipulation signals before replying.", eyebrow: "Conversations", hero: "Slow the pressure down and review what is happening." },
    "estafas-criptomonedas": { title: "Cryptocurrency scam warning signs — Vonu", description: "Review risk signals around crypto investments, wallets, support agents and supposed opportunities.", eyebrow: "Crypto", hero: "Do not send crypto before checking the signals." },
    "llamada-banco-codigo-sms": { title: "Bank call asking for an SMS code — Is it a scam? | Vonu", description: "Review a call or message asking for codes, passwords or urgent actions in your bank's name.", eyebrow: "Bank impersonation", hero: "An SMS code should never be a rushed decision." },
    "es-fiable": { title: "Is it trustworthy? Check with Vonu", description: "Review a website, message, profile or situation when something does not feel right.", eyebrow: "Vonu Check", hero: "Is it trustworthy? Check the signals before acting." },
  },
  fr: {
    producto: { title: "Produit — Vonu", description: "Vonu analyse URLs, captures et messages suspects afin de faire ressortir les signaux de risque avant d’agir.", eyebrow: "Produit", hero: "Vérifiez avant de faire confiance." },
    "casos-de-uso": { title: "Cas d’usage — Vonu", description: "Des situations réelles où Vonu aide à vérifier les signaux avant de payer, répondre ou partager des données.", eyebrow: "Cas d’usage", hero: "Quand quelque chose semble étrange, vérifiez avant d’agir." },
    recursos: { title: "Ressources — Vonu", description: "Guides pratiques pour repérer les signaux d’arnaque, phishing, usurpation et risque en ligne.", eyebrow: "Ressources", hero: "Apprenez quoi vérifier avant de faire confiance." },
    precios: { title: "Tarifs — Vonu", description: "Commencez gratuitement avec Vonu et augmentez votre capacité lorsque vous avez besoin de plus d’analyses.", eyebrow: "Tarifs", hero: "Commencez gratuitement. Évoluez quand vous en avez besoin." },
    "como-funciona": { title: "Comment fonctionne Vonu", description: "Découvrez comment Vonu combine signaux techniques et contexte pour vous aider avant d’agir.", eyebrow: "Fonctionnement", hero: "D’un doute à une prochaine étape plus éclairée." },
    contacto: { title: "Contact — Vonu", description: "Contactez Vonu pour l’assistance, la confidentialité ou toute question sur le service.", eyebrow: "Contact", hero: "Besoin de nous parler ?" },
    "comprobar-web-fiable": { title: "Ce site est-il fiable ? Vérifiez avec Vonu", description: "Vérifiez un site ou une boutique avant de payer, saisir des données ou lui faire confiance.", eyebrow: "Sites & liens", hero: "Vérifiez un site avant de payer." },
    "comprobar-tienda-online": { title: "Cette boutique en ligne est-elle fiable ? — Vonu", description: "Analysez les signaux de risque d’une boutique en ligne avant d’acheter ou partager vos données.", eyebrow: "Achats en ligne", hero: "Vérifiez la boutique avant d’acheter." },
    "analizar-link-sospechoso": { title: "Analyser un lien suspect — Vonu", description: "Vérifiez redirections et signaux de risque avant d’ouvrir un lien suspect ou saisir des données.", eyebrow: "Liens", hero: "Vérifiez le lien avant de cliquer." },
    "analizar-captura-pantalla": { title: "Analyser une capture suspecte — Vonu", description: "Analysez les captures de SMS, chats, profils, sites et écrans de paiement.", eyebrow: "Captures", hero: "Si le doute est dans une image, analysez-la." },
    "analizar-sms-estafa": { title: "Ce SMS est-il une arnaque ? — Vonu", description: "Analysez les SMS ou messages WhatsApp suspects avant de répondre, cliquer ou partager un code.", eyebrow: "Messages", hero: "Vérifiez le message avant de répondre." },
    "email-sospechoso-estafa": { title: "Email suspect ou phishing — Vonu", description: "Analysez un email suspect pour repérer urgence, usurpation, liens et signaux de phishing.", eyebrow: "Email", hero: "Vérifiez l’email avant de suivre ses instructions." },
    "detectar-perfil-falso": { title: "Comment détecter un faux profil — Vonu", description: "Analysez les signaux liés aux faux profils, comptes clonés et usurpations.", eyebrow: "Profils", hero: "Vérifiez l’identité avant de faire confiance." },
    "comprobar-inversion-estafa": { title: "Cet investissement est-il une arnaque ? — Vonu", description: "Vérifiez promesses, pression et signaux de risque avant d’envoyer de l’argent.", eyebrow: "Investissements", hero: "Vérifiez les signaux avant d’investir." },
    "revisar-contrato": { title: "Que vérifier avant de signer un contrat — Vonu", description: "Organisez les clauses, obligations et points à vérifier avant de signer un contrat.", eyebrow: "Contrats", hero: "Vérifiez avant de signer." },
    "revisar-contrato-alquiler": { title: "Vérifier un contrat de location — Vonu", description: "Repérez clauses, dépôt, délais et conditions à vérifier avant de signer un bail.", eyebrow: "Location", hero: "Comprenez le contrat avant de signer." },
    "comprobar-factura": { title: "Comment vérifier une facture — Vonu", description: "Vérifiez montants, lignes et informations avant de payer une facture.", eyebrow: "Factures", hero: "Vérifiez la facture avant de payer." },
    "revisar-presupuesto": { title: "Vérifier un devis ou une pro forma — Vonu", description: "Vérifiez prix, taxes, validité, acomptes, exclusions et conditions avant d’accepter un devis ou une pro forma.", eyebrow: "Devis", hero: "Vérifiez le devis avant de l’accepter." },
    "revisar-contrato-servicios": { title: "Vérifier un contrat de services — Vonu", description: "Vérifiez périmètre, prix, durée, renouvellement, résiliation, responsabilité et conditions avant de signer.", eyebrow: "Services", hero: "Comprenez le contrat de services avant de signer." },
    "revisar-prestamo-financiacion": { title: "Vérifier un prêt ou un financement — Vonu", description: "Vérifiez capital, intérêts, échéances, frais, coût total, garanties et conditions avant d’accepter un financement.", eyebrow: "Financement", hero: "Comprenez le financement avant de l’accepter." },
    "detectar-manipulacion": { title: "Comment repérer la manipulation — Vonu", description: "Analysez une conversation pour repérer pression, urgence et manipulation avant de répondre.", eyebrow: "Conversations", hero: "Ralentissez la pression et vérifiez ce qui se passe." },
    "estafas-criptomonedas": { title: "Arnaques aux cryptomonnaies — Vonu", description: "Analysez les signaux de risque autour des investissements, wallets et fausses opportunités crypto.", eyebrow: "Crypto", hero: "N’envoyez pas de crypto avant de vérifier les signaux." },
    "llamada-banco-codigo-sms": { title: "Appel de banque demandant un code SMS — Arnaque ? | Vonu", description: "Analysez un appel ou message demandant codes, mots de passe ou actions urgentes au nom de votre banque.", eyebrow: "Usurpation bancaire", hero: "Un code SMS ne doit jamais être décidé dans l’urgence." },
    "es-fiable": { title: "Est-ce fiable ? Vérifiez avec Vonu", description: "Vérifiez un site, message, profil ou situation lorsque quelque chose ne semble pas normal.", eyebrow: "Vonu Check", hero: "Est-ce fiable ? Vérifiez les signaux avant d’agir." },
  },
  de: {
    producto: { title: "Produkt — Vonu", description: "Vonu analysiert verdächtige URLs, Screenshots und Nachrichten und zeigt Risikosignale vor einer Handlung.", eyebrow: "Produkt", hero: "Prüfen, bevor du vertraust." },
    "casos-de-uso": { title: "Anwendungsfälle — Vonu", description: "Reale Situationen, in denen Vonu vor Zahlung, Antwort oder Datenfreigabe relevante Signale prüft.", eyebrow: "Anwendungsfälle", hero: "Wenn etwas nicht stimmt, prüfe es vor dem Handeln." },
    recursos: { title: "Ressourcen — Vonu", description: "Praktische Leitfäden zu Betrug, Phishing, Identitätsmissbrauch und Online-Risiken.", eyebrow: "Ressourcen", hero: "Lerne, was du vor dem Vertrauen prüfen solltest." },
    precios: { title: "Preise — Vonu", description: "Starte kostenlos mit Vonu und erweitere bei Bedarf deine Analysekapazität.", eyebrow: "Preise", hero: "Kostenlos starten. Erweitern, wenn du mehr brauchst." },
    "como-funciona": { title: "So funktioniert Vonu", description: "Erfahre, wie Vonu technische Signale und Kontext kombiniert, um vor einer Handlung zu prüfen.", eyebrow: "So funktioniert’s", hero: "Von Unsicherheit zu einem besser informierten nächsten Schritt." },
    contacto: { title: "Kontakt — Vonu", description: "Kontaktiere Vonu bei Support-, Datenschutz- oder Servicefragen.", eyebrow: "Kontakt", hero: "Möchtest du mit uns sprechen?" },
    "comprobar-web-fiable": { title: "Ist diese Website seriös? Mit Vonu prüfen", description: "Prüfe eine Website oder einen Onlineshop, bevor du zahlst, Daten eingibst oder vertraust.", eyebrow: "Websites & Links", hero: "Prüfe die Website vor dem Bezahlen." },
    "comprobar-tienda-online": { title: "Ist dieser Onlineshop seriös? — Vonu", description: "Prüfe relevante Risikosignale eines Onlineshops, bevor du kaufst oder Daten teilst.", eyebrow: "Online-Shopping", hero: "Prüfe den Shop vor dem Kauf." },
    "analizar-link-sospechoso": { title: "Verdächtigen Link prüfen — Vonu", description: "Prüfe Weiterleitungen und Risikosignale, bevor du einen verdächtigen Link öffnest oder Daten eingibst.", eyebrow: "Links", hero: "Prüfe den Link vor dem Klick." },
    "analizar-captura-pantalla": { title: "Verdächtigen Screenshot analysieren — Vonu", description: "Analysiere Screenshots von SMS, Chats, Profilen, Websites und Zahlungsseiten.", eyebrow: "Screenshots", hero: "Wenn der Hinweis im Bild steckt, analysiere ihn." },
    "analizar-sms-estafa": { title: "Ist diese SMS Betrug? — Vonu", description: "Analysiere verdächtige SMS oder WhatsApp-Nachrichten vor Antwort, Link-Klick oder Code-Freigabe.", eyebrow: "Nachrichten", hero: "Prüfe die Nachricht vor der Antwort." },
    "email-sospechoso-estafa": { title: "Verdächtige E-Mail oder Phishing — Vonu", description: "Prüfe eine verdächtige E-Mail auf Druck, Identitätsmissbrauch, Links und Phishing-Signale.", eyebrow: "E-Mail", hero: "Prüfe die E-Mail, bevor du ihren Anweisungen folgst." },
    "detectar-perfil-falso": { title: "Fake-Profil erkennen — Vonu", description: "Prüfe Signale für Fake-Profile, geklonte Konten und Identitätsmissbrauch.", eyebrow: "Profile", hero: "Prüfe die Identität, bevor du vertraust." },
    "comprobar-inversion-estafa": { title: "Ist diese Investition Betrug? — Vonu", description: "Prüfe Versprechen, Druck und Risikosignale, bevor du Geld an eine Investition sendest.", eyebrow: "Investitionen", hero: "Prüfe die Signale vor der Investition." },
    "revisar-contrato": { title: "Was vor einer Vertragsunterschrift prüfen? — Vonu", description: "Ordne Klauseln, Pflichten und Punkte, die du vor einer Vertragsunterschrift prüfen solltest.", eyebrow: "Verträge", hero: "Prüfe, bevor du unterschreibst." },
    "revisar-contrato-alquiler": { title: "Mietvertrag prüfen — Vonu", description: "Prüfe Klauseln, Kaution, Fristen und Bedingungen vor der Unterschrift eines Mietvertrags.", eyebrow: "Miete", hero: "Verstehe den Vertrag, bevor du unterschreibst." },
    "comprobar-factura": { title: "Rechnung prüfen — Vonu", description: "Prüfe Beträge, Positionen und Angaben, bevor du eine Rechnung bezahlst.", eyebrow: "Rechnungen", hero: "Prüfe die Rechnung vor dem Bezahlen." },
    "revisar-presupuesto": { title: "Angebot oder Proforma prüfen — Vonu", description: "Prüfe Preise, Steuern, Gültigkeit, Anzahlungen, Ausschlüsse und Bedingungen vor der Annahme.", eyebrow: "Angebote", hero: "Prüfe das Angebot vor der Annahme." },
    "revisar-contrato-servicios": { title: "Dienstleistungsvertrag prüfen — Vonu", description: "Prüfe Leistungsumfang, Vergütung, Laufzeit, Verlängerung, Kündigung, Haftung und Bedingungen vor der Unterschrift.", eyebrow: "Dienstleistungen", hero: "Verstehe den Dienstleistungsvertrag vor der Unterschrift." },
    "revisar-prestamo-financiacion": { title: "Darlehen oder Finanzierung prüfen — Vonu", description: "Prüfe Kapital, Zinsen, Raten, Gebühren, Gesamtkosten, Sicherheiten und Bedingungen vor der Annahme.", eyebrow: "Finanzierung", hero: "Verstehe die Finanzierung vor der Annahme." },
    "detectar-manipulacion": { title: "Manipulation erkennen — Vonu", description: "Prüfe ein Gespräch auf Druck, Dringlichkeit und Manipulationssignale, bevor du antwortest.", eyebrow: "Gespräche", hero: "Nimm den Druck heraus und prüfe, was passiert." },
    "estafas-criptomonedas": { title: "Krypto-Betrug erkennen — Vonu", description: "Prüfe Risikosignale rund um Krypto-Investitionen, Wallets, Support und angebliche Chancen.", eyebrow: "Krypto", hero: "Sende keine Kryptowährung, bevor du die Signale geprüft hast." },
    "llamada-banco-codigo-sms": { title: "Bankanruf verlangt SMS-Code — Betrug? | Vonu", description: "Prüfe Anrufe oder Nachrichten, die im Namen deiner Bank Codes, Passwörter oder dringende Aktionen verlangen.", eyebrow: "Bank-Imitation", hero: "Ein SMS-Code darf keine hektische Entscheidung sein." },
    "es-fiable": { title: "Ist es seriös? Mit Vonu prüfen", description: "Prüfe eine Website, Nachricht, ein Profil oder eine Situation, wenn etwas nicht richtig wirkt.", eyebrow: "Vonu Check", hero: "Ist es seriös? Prüfe die Signale vor dem Handeln." },
  },
  ar: {
    producto: { title: "المنتج — Vonu", description: "يحلل Vonu الروابط ولقطات الشاشة والرسائل المشبوهة لإظهار إشارات الخطر قبل أن تتصرف.", eyebrow: "المنتج", hero: "تحقق قبل أن تثق." },
    "casos-de-uso": { title: "حالات الاستخدام — Vonu", description: "مواقف حقيقية يساعد فيها Vonu على مراجعة الإشارات قبل الدفع أو الرد أو مشاركة البيانات.", eyebrow: "حالات الاستخدام", hero: "عندما يبدو شيء غير طبيعي، تحقّق قبل أن تتصرف." },
    recursos: { title: "المصادر — Vonu", description: "أدلة عملية لاكتشاف إشارات الاحتيال والتصيد والانتحال والمخاطر الرقمية.", eyebrow: "المصادر", hero: "تعلّم ما يجب التحقق منه قبل أن تثق." },
    precios: { title: "الأسعار — Vonu", description: "ابدأ مجانًا مع Vonu وزِد السعة عندما تحتاج إلى تحليلات أكثر.", eyebrow: "الأسعار", hero: "ابدأ مجانًا. طوّر خطتك عندما تحتاج." },
    "como-funciona": { title: "كيف يعمل Vonu", description: "تعرّف على كيفية جمع Vonu بين الإشارات التقنية والسياق لمساعدتك قبل اتخاذ خطوة.", eyebrow: "كيف يعمل", hero: "من الشك إلى خطوة تالية أكثر وعيًا." },
    contacto: { title: "اتصل بنا — Vonu", description: "تواصل مع Vonu للدعم أو الخصوصية أو الأسئلة المتعلقة بالخدمة.", eyebrow: "اتصل بنا", hero: "هل تحتاج إلى التحدث معنا؟" },
    "comprobar-web-fiable": { title: "هل هذا الموقع موثوق؟ تحقّق باستخدام Vonu", description: "راجع موقعًا أو متجرًا إلكترونيًا قبل الدفع أو إدخال بياناتك أو الوثوق به.", eyebrow: "المواقع والروابط", hero: "تحقّق من الموقع قبل الدفع." },
    "comprobar-tienda-online": { title: "هل هذا المتجر الإلكتروني موثوق؟ — Vonu", description: "راجع إشارات الخطر في متجر إلكتروني قبل الشراء أو مشاركة بياناتك.", eyebrow: "التسوق الإلكتروني", hero: "تحقّق من المتجر قبل الشراء." },
    "analizar-link-sospechoso": { title: "فحص رابط مشبوه — Vonu", description: "افحص التحويلات وإشارات الخطر قبل فتح رابط مشبوه أو إدخال بياناتك.", eyebrow: "الروابط", hero: "تحقّق من الرابط قبل الضغط عليه." },
    "analizar-captura-pantalla": { title: "تحليل لقطة شاشة مشبوهة — Vonu", description: "حلّل لقطات الرسائل والمحادثات والملفات الشخصية والمواقع وصفحات الدفع.", eyebrow: "لقطات الشاشة", hero: "إذا كانت الإشارة في صورة، فحلّلها." },
    "analizar-sms-estafa": { title: "هل هذه الرسالة احتيال؟ — Vonu", description: "حلّل رسائل SMS أو WhatsApp المشبوهة قبل الرد أو فتح الروابط أو مشاركة الرموز.", eyebrow: "الرسائل", hero: "تحقّق من الرسالة قبل الرد." },
    "email-sospechoso-estafa": { title: "بريد مشبوه أو تصيد — Vonu", description: "راجع البريد المشبوه لاكتشاف الاستعجال والانتحال والروابط وإشارات التصيد.", eyebrow: "البريد", hero: "تحقّق من البريد قبل تنفيذ تعليماته." },
    "detectar-perfil-falso": { title: "كيفية اكتشاف ملف شخصي مزيف — Vonu", description: "راجع الإشارات المرتبطة بالملفات المزيفة والحسابات المستنسخة والانتحال.", eyebrow: "الملفات الشخصية", hero: "تحقّق من الهوية قبل أن تثق." },
    "comprobar-inversion-estafa": { title: "هل هذا الاستثمار احتيال؟ — Vonu", description: "راجع الوعود والضغط وإشارات الخطر قبل إرسال المال إلى فرصة استثمار.", eyebrow: "الاستثمارات", hero: "تحقّق من الإشارات قبل الاستثمار." },
    "revisar-contrato": { title: "ما الذي يجب مراجعته قبل توقيع عقد؟ — Vonu", description: "رتّب البنود والالتزامات والنقاط التي تستحق المراجعة قبل توقيع عقد.", eyebrow: "العقود", hero: "راجع قبل أن توقّع." },
    "revisar-contrato-alquiler": { title: "مراجعة عقد إيجار — Vonu", description: "راجع البنود والتأمين والمواعيد والشروط قبل توقيع عقد إيجار.", eyebrow: "الإيجار", hero: "افهم العقد قبل توقيعه." },
    "comprobar-factura": { title: "كيفية مراجعة فاتورة — Vonu", description: "راجع المبالغ والبنود والبيانات قبل دفع فاتورة.", eyebrow: "الفواتير", hero: "تحقّق من الفاتورة قبل الدفع." },
    "revisar-presupuesto": { title: "مراجعة عرض سعر أو فاتورة مبدئية — Vonu", description: "راجع الأسعار والضرائب والصلاحية والدفعات والاستثناءات والشروط قبل الموافقة.", eyebrow: "عروض الأسعار", hero: "راجع عرض السعر قبل الموافقة." },
    "revisar-contrato-servicios": { title: "مراجعة عقد خدمات — Vonu", description: "راجع نطاق الخدمة والرسوم والمدة والتجديد والإنهاء والمسؤولية والشروط قبل التوقيع.", eyebrow: "الخدمات", hero: "افهم عقد الخدمات قبل التوقيع." },
    "revisar-prestamo-financiacion": { title: "مراجعة قرض أو تمويل — Vonu", description: "راجع أصل المبلغ والفوائد والأقساط والرسوم والتكلفة الإجمالية والضمانات والشروط قبل قبول التمويل.", eyebrow: "التمويل", hero: "افهم التمويل قبل قبوله." },
    "detectar-manipulacion": { title: "كيفية اكتشاف التلاعب — Vonu", description: "راجع محادثة لاكتشاف الضغط والاستعجال وإشارات التلاعب قبل الرد.", eyebrow: "المحادثات", hero: "خفّف الضغط وراجع ما يحدث." },
    "estafas-criptomonedas": { title: "احتيال العملات الرقمية — Vonu", description: "راجع إشارات الخطر حول الاستثمارات والمحافظ والدعم والفرص المزعومة في العملات الرقمية.", eyebrow: "العملات الرقمية", hero: "لا ترسل عملات رقمية قبل التحقق من الإشارات." },
    "llamada-banco-codigo-sms": { title: "اتصال من البنك يطلب رمز SMS — هل هو احتيال؟ | Vonu", description: "راجع اتصالًا أو رسالة تطلب رموزًا أو كلمات مرور أو إجراءات عاجلة باسم البنك.", eyebrow: "انتحال البنك", hero: "رمز SMS لا يجب أن يكون قرارًا متسرعًا." },
    "es-fiable": { title: "هل هو موثوق؟ تحقّق مع Vonu", description: "راجع موقعًا أو رسالة أو ملفًا شخصيًا أو موقفًا عندما يبدو شيء غير طبيعي.", eyebrow: "Vonu Check", hero: "هل هو موثوق؟ تحقّق من الإشارات قبل التصرف." },
  },
};

type TemplateCopy = {
  intro: string;
  reviewEyebrow: string;
  reviewTitle: string;
  reviewItems: Array<{ title: string; text: string }>;
  processEyebrow: string;
  processTitle: string;
  processItems: Array<{ title: string; text: string }>;
  proofEyebrow: string;
  proofTitle: string;
  proofText: string;
  faqEyebrow: string;
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
  cta: string;
  ctaSecondary: string;
  disclaimer: string;
};

export const templateCopy: Record<SupportedLocale, TemplateCopy> = {
  es: {
    intro: "Vonu separa hechos observables, señales de riesgo e incertidumbre para que puedas frenar a tiempo, comprobar por otra vía y decidir con más contexto.",
    reviewEyebrow: "Qué revisar",
    reviewTitle: "Cuatro señales que merecen atención",
    reviewItems: [
      { title: "Identidad y origen", text: "Comprueba quién está detrás, si los datos son coherentes y si la identidad puede verificarse fuera del propio mensaje o página." },
      { title: "Urgencia y presión", text: "Las prisas, amenazas, oportunidades irrepetibles y peticiones de actuar ya son señales que conviene tratar con cautela." },
      { title: "Dinero y datos", text: "Frena si te piden transferencias, códigos, contraseñas, tarjeta completa o información sensible sin una razón verificable." },
      { title: "Verificación independiente", text: "Contrasta el caso por una vía distinta: web oficial, teléfono conocido, banco, proveedor o una fuente externa fiable." },
    ],
    processEyebrow: "Cómo ayuda Vonu",
    processTitle: "No solo un semáforo: contexto y próximos pasos",
    processItems: [
      { title: "1. Analiza", text: "Revisa el contenido, enlaces, contexto y señales técnicas disponibles." },
      { title: "2. Explica", text: "Distingue lo observado de lo que no puede demostrarse y muestra el nivel de confianza." },
      { title: "3. Te orienta", text: "Propone comprobaciones y acciones concretas para reducir el riesgo antes de continuar." },
    ],
    proofEyebrow: "Uso responsable",
    proofTitle: "Claridad sin falsas certezas",
    proofText: "Vonu no certifica que una persona, web o mensaje sea legítimo o fraudulento. Te ayuda a detectar señales, entender límites y decidir qué comprobar a continuación.",
    faqEyebrow: "Preguntas frecuentes",
    faqTitle: "Antes de actuar",
    faq: [
      { q: "¿Vonu puede confirmar que algo es una estafa?", a: "No. Vonu identifica señales de riesgo y explica la evidencia disponible, pero no sustituye una investigación oficial ni certifica fraude." },
      { q: "¿Tengo que registrarme para probarlo?", a: "No para el primer análisis. Puedes probar Vonu Check y decidir después si quieres crear una cuenta o ampliar tu plan." },
      { q: "¿Qué datos no debo compartir?", a: "No compartas contraseñas, códigos SMS de autenticación, PIN, datos completos de tarjeta ni otra información extremadamente sensible." },
      { q: "¿Qué hago si ya he pagado o compartido datos?", a: "Guarda pruebas y actúa rápido: contacta con tu banco o proveedor, cambia credenciales afectadas y utiliza los canales oficiales de denuncia o soporte cuando corresponda." },
    ],
    cta: "Analizar ahora",
    ctaSecondary: "Ver precios",
    disclaimer: "Orientación preventiva. No sustituye a profesionales ni autoridades.",
  },
  en: {
    intro: "Vonu separates observable facts, risk signals and uncertainty so you can slow down, verify independently and make the next decision with more context.",
    reviewEyebrow: "What to check",
    reviewTitle: "Four signals worth your attention",
    reviewItems: [
      { title: "Identity and source", text: "Check who is behind it, whether the details are consistent and whether the identity can be verified outside the page or message itself." },
      { title: "Urgency and pressure", text: "Threats, countdowns, once-in-a-lifetime offers and demands to act immediately are signals worth treating cautiously." },
      { title: "Money and sensitive data", text: "Slow down if you are asked for transfers, codes, passwords, full card details or sensitive information without a verifiable reason." },
      { title: "Independent verification", text: "Cross-check through a different channel: an official website, a known phone number, your bank, the provider or another reliable source." },
    ],
    processEyebrow: "How Vonu helps",
    processTitle: "More than a traffic light: context and next steps",
    processItems: [
      { title: "1. Analyse", text: "Review the content, links, context and technical signals that are available." },
      { title: "2. Explain", text: "Separate observed evidence from what cannot be proven and show how confident the analysis is." },
      { title: "3. Act", text: "Get concrete checks and next steps to reduce risk before you continue." },
    ],
    proofEyebrow: "Responsible use",
    proofTitle: "Clarity without false certainty",
    proofText: "Vonu does not certify that a person, website or message is legitimate or fraudulent. It helps you identify signals, understand limits and decide what to verify next.",
    faqEyebrow: "FAQ",
    faqTitle: "Before you act",
    faq: [
      { q: "Can Vonu confirm that something is a scam?", a: "No. Vonu surfaces risk signals and explains available evidence, but it does not replace an official investigation or certify fraud." },
      { q: "Do I need an account to try it?", a: "Not for the first analysis. You can try Vonu Check first and decide later whether to create an account or upgrade." },
      { q: "What should I never submit?", a: "Do not share passwords, authentication SMS codes, PINs, complete card details or other extremely sensitive information." },
      { q: "What if I already paid or shared data?", a: "Save evidence and act quickly: contact your bank or provider, change affected credentials and use official reporting or support channels where appropriate." },
    ],
    cta: "Analyse now",
    ctaSecondary: "See pricing",
    disclaimer: "Preventive guidance. It does not replace professionals or authorities.",
  },
  fr: {
    intro: "Vonu sépare les faits observables, les signaux de risque et l’incertitude afin de vous aider à ralentir, vérifier autrement et décider avec plus de contexte.",
    reviewEyebrow: "À vérifier",
    reviewTitle: "Quatre signaux qui méritent votre attention",
    reviewItems: [
      { title: "Identité et origine", text: "Vérifiez qui se trouve derrière, si les informations sont cohérentes et si l’identité peut être confirmée en dehors du message ou du site." },
      { title: "Urgence et pression", text: "Menaces, comptes à rebours, offres uniques et demandes d’agir immédiatement doivent être traités avec prudence." },
      { title: "Argent et données sensibles", text: "Ralentissez si l’on vous demande virements, codes, mots de passe, carte complète ou données sensibles sans raison vérifiable." },
      { title: "Vérification indépendante", text: "Recoupez par un autre canal : site officiel, numéro connu, banque, fournisseur ou source externe fiable." },
    ],
    processEyebrow: "Comment Vonu aide",
    processTitle: "Plus qu’un feu tricolore : contexte et prochaines étapes",
    processItems: [
      { title: "1. Analyser", text: "Examiner le contenu, les liens, le contexte et les signaux techniques disponibles." },
      { title: "2. Expliquer", text: "Séparer les faits observés de ce qui ne peut pas être prouvé et indiquer le niveau de confiance." },
      { title: "3. Agir", text: "Proposer des vérifications concrètes pour réduire le risque avant de continuer." },
    ],
    proofEyebrow: "Usage responsable",
    proofTitle: "De la clarté sans fausse certitude",
    proofText: "Vonu ne certifie pas qu’une personne, un site ou un message est légitime ou frauduleux. Il aide à repérer les signaux, comprendre les limites et choisir quoi vérifier ensuite.",
    faqEyebrow: "Questions fréquentes",
    faqTitle: "Avant d’agir",
    faq: [
      { q: "Vonu peut-il confirmer une arnaque ?", a: "Non. Vonu met en évidence des signaux de risque et explique les éléments disponibles, sans remplacer une enquête officielle ni certifier une fraude." },
      { q: "Faut-il créer un compte pour essayer ?", a: "Pas pour la première analyse. Vous pouvez essayer Vonu Check puis décider si vous souhaitez créer un compte ou passer à une offre supérieure." },
      { q: "Quelles données ne dois-je jamais envoyer ?", a: "Ne partagez pas mots de passe, codes SMS d’authentification, PIN, données complètes de carte ni informations extrêmement sensibles." },
      { q: "Que faire si j’ai déjà payé ou partagé des données ?", a: "Conservez les preuves et agissez vite : contactez votre banque ou fournisseur, changez les identifiants concernés et utilisez les canaux officiels de signalement." },
    ],
    cta: "Analyser maintenant",
    ctaSecondary: "Voir les tarifs",
    disclaimer: "Orientation préventive. Ne remplace pas les professionnels ni les autorités.",
  },
  de: {
    intro: "Vonu trennt beobachtbare Fakten, Risikosignale und Unsicherheit, damit du verlangsamen, unabhängig prüfen und mit mehr Kontext entscheiden kannst.",
    reviewEyebrow: "Was du prüfen solltest",
    reviewTitle: "Vier Signale, die Aufmerksamkeit verdienen",
    reviewItems: [
      { title: "Identität und Herkunft", text: "Prüfe, wer dahintersteht, ob die Angaben zusammenpassen und ob sich die Identität außerhalb der Nachricht oder Seite bestätigen lässt." },
      { title: "Dringlichkeit und Druck", text: "Drohungen, Countdown, einmalige Chancen und sofortige Handlungsaufforderungen sind Gründe, vorsichtiger zu werden." },
      { title: "Geld und sensible Daten", text: "Stoppe, wenn Überweisungen, Codes, Passwörter, vollständige Kartendaten oder sensible Informationen ohne überprüfbaren Grund verlangt werden." },
      { title: "Unabhängige Bestätigung", text: "Prüfe über einen anderen Kanal: offizielle Website, bekannte Telefonnummer, Bank, Anbieter oder eine verlässliche externe Quelle." },
    ],
    processEyebrow: "Wie Vonu hilft",
    processTitle: "Mehr als eine Ampel: Kontext und nächste Schritte",
    processItems: [
      { title: "1. Analysieren", text: "Inhalt, Links, Kontext und verfügbare technische Signale prüfen." },
      { title: "2. Erklären", text: "Beobachtete Belege von nicht beweisbaren Annahmen trennen und die Sicherheit der Analyse zeigen." },
      { title: "3. Handeln", text: "Konkrete Prüfungen und nächste Schritte erhalten, um das Risiko vor dem Fortfahren zu senken." },
    ],
    proofEyebrow: "Verantwortungsvolle Nutzung",
    proofTitle: "Klarheit ohne falsche Gewissheit",
    proofText: "Vonu bestätigt nicht, dass eine Person, Website oder Nachricht legitim oder betrügerisch ist. Es hilft, Signale zu erkennen, Grenzen zu verstehen und die nächste Prüfung zu wählen.",
    faqEyebrow: "Häufige Fragen",
    faqTitle: "Bevor du handelst",
    faq: [
      { q: "Kann Vonu bestätigen, dass etwas Betrug ist?", a: "Nein. Vonu zeigt Risikosignale und erklärt verfügbare Belege, ersetzt aber keine offizielle Untersuchung und zertifiziert keinen Betrug." },
      { q: "Brauche ich ein Konto zum Ausprobieren?", a: "Nicht für die erste Analyse. Du kannst Vonu Check testen und später entscheiden, ob du ein Konto oder einen größeren Plan möchtest." },
      { q: "Welche Daten sollte ich nie eingeben?", a: "Teile keine Passwörter, SMS-Authentifizierungscodes, PINs, vollständigen Kartendaten oder andere hochsensible Informationen." },
      { q: "Was, wenn ich bereits bezahlt oder Daten geteilt habe?", a: "Sichere Beweise und handle schnell: kontaktiere Bank oder Anbieter, ändere betroffene Zugangsdaten und nutze offizielle Melde- oder Supportkanäle." },
    ],
    cta: "Jetzt analysieren",
    ctaSecondary: "Preise ansehen",
    disclaimer: "Präventive Orientierung. Kein Ersatz für Fachleute oder Behörden.",
  },
  ar: {
    intro: "يفصل Vonu بين الحقائق القابلة للملاحظة وإشارات الخطر وعدم اليقين حتى تتمكن من التمهل والتحقق عبر قناة أخرى واتخاذ الخطوة التالية بسياق أفضل.",
    reviewEyebrow: "ما الذي يجب التحقق منه",
    reviewTitle: "أربع إشارات تستحق الانتباه",
    reviewItems: [
      { title: "الهوية والمصدر", text: "تحقق ممن يقف خلف الرسالة أو الموقع، ومن اتساق التفاصيل، ومن إمكانية إثبات الهوية خارج المصدر نفسه." },
      { title: "الاستعجال والضغط", text: "التهديدات والعد التنازلي والفرص التي لا تتكرر وطلب التصرف فورًا كلها إشارات تستحق الحذر." },
      { title: "المال والبيانات الحساسة", text: "توقف إذا طُلبت تحويلات أو رموز أو كلمات مرور أو بيانات بطاقة كاملة أو معلومات حساسة دون سبب يمكن التحقق منه." },
      { title: "تحقق مستقل", text: "قارن عبر قناة مختلفة: الموقع الرسمي أو رقم معروف أو البنك أو مزود الخدمة أو مصدر خارجي موثوق." },
    ],
    processEyebrow: "كيف يساعد Vonu",
    processTitle: "أكثر من إشارة لونية: سياق وخطوات تالية",
    processItems: [
      { title: "1. التحليل", text: "مراجعة المحتوى والروابط والسياق والإشارات التقنية المتاحة." },
      { title: "2. التفسير", text: "فصل الأدلة التي تمت ملاحظتها عما لا يمكن إثباته وإظهار درجة الثقة." },
      { title: "3. الخطوة التالية", text: "اقتراح فحوصات وإجراءات عملية لتقليل الخطر قبل المتابعة." },
    ],
    proofEyebrow: "استخدام مسؤول",
    proofTitle: "وضوح دون يقين زائف",
    proofText: "لا يشهد Vonu بأن شخصًا أو موقعًا أو رسالة شرعية أو احتيالية. بل يساعدك على اكتشاف الإشارات وفهم الحدود وتحديد ما يجب التحقق منه لاحقًا.",
    faqEyebrow: "أسئلة شائعة",
    faqTitle: "قبل أن تتصرف",
    faq: [
      { q: "هل يستطيع Vonu تأكيد أن الأمر احتيال؟", a: "لا. يعرض Vonu إشارات الخطر ويشرح الأدلة المتاحة، لكنه لا يحل محل تحقيق رسمي ولا يصدر شهادة احتيال." },
      { q: "هل أحتاج إلى حساب للتجربة؟", a: "ليس للتحليل الأول. يمكنك تجربة Vonu Check أولًا ثم تقرير ما إذا كنت تريد إنشاء حساب أو ترقية الخطة." },
      { q: "ما البيانات التي يجب ألا أرسلها؟", a: "لا ترسل كلمات المرور أو رموز SMS للمصادقة أو PIN أو بيانات البطاقة الكاملة أو معلومات شديدة الحساسية." },
      { q: "ماذا أفعل إذا دفعت أو شاركت بيانات بالفعل؟", a: "احتفظ بالأدلة وتصرف بسرعة: تواصل مع البنك أو مزود الخدمة، غيّر بيانات الدخول المتأثرة واستخدم قنوات الإبلاغ الرسمية المناسبة." },
    ],
    cta: "حلّل الآن",
    ctaSecondary: "عرض الأسعار",
    disclaimer: "إرشاد وقائي. لا يحل محل المختصين أو السلطات.",
  },
};

export function getTopic(locale: SupportedLocale, slug: IndexedPublicSlug) {
  return topics[locale][slug];
}
