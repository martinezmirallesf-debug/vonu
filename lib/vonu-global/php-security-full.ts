import type { SupportedLocale } from "@/lib/vonu-check/types";

type PhpGuideLocale = Exclude<SupportedLocale, "es">;
type Tile = { title: string; text: string };
type PhpGuideCopy = {
  heroLead: string; heroAccent: string; heroLast: string; intro: string;
  cta: string; secondaryCta: string;
  quickLabel: string; quickTitle: string; quickAccent: string; quickIntro: string; checklist: string[];
  warningLabel: string; warningTitle: string; warningAccent: string; warningIntro: string; warnings: Tile[];
  casesLabel: string; casesTitle: string; casesAccent: string; casesIntro: string; cases: Tile[];
  mistakesLabel: string; mistakesTitle: string; mistakesAccent: string; mistakesIntro: string; mistakes: string[];
  stepsLabel: string; stepsTitle: string; stepsIntro: string; dateLabel: string; checks: Tile[];
  sourcesLabel: string; sourceAction: string; sources: Array<Tile & { href: string }>;
  relatedLabel: string; relatedAction: string; related: Array<Tile & { slug: "comprobar-web-fiable" | "analizar-link-sospechoso" | "comprobar-tienda-online" }>;
  faqLabel: string; faqTitle: string; faqAccent: string; faqs: Array<{ q: string; a: string }>;
  finalTitle: string; finalIntro: string; finalCta: string;
};

export const PHP_GUIDE_FULL: Record<PhpGuideLocale, PhpGuideCopy> = {
  en: {
    heroLead: "Website security.", heroAccent: "Vulnerable PHP?", heroLast: "What you can actually check.",
    intro: "Millions of websites use PHP. Learn how outdated software can create risks, what public checks can reveal, and how to interpret the results without unnecessary alarm.",
    cta: "Check a website", secondaryCta: "Explore warning signs",
    quickLabel: "The short answer", quickTitle: "Does a website use PHP?", quickAccent: "That doesn't make it vulnerable.",
    quickIntro: "Risk depends on the actual version, modules, patches and configuration. VONÜ can inspect public signals and match an openly reported PHP version to known notices, but cannot verify the server's internal state.",
    checklist: [
      "PHP is a widely used technology. Its presence is not a warning sign by itself.",
      "VONÜ checks public website signals, not private server configuration.",
      "If the server discloses a precise PHP version, published CVE matches can be investigated.",
      "A CVE version match does not establish that this specific website can be exploited.",
      "HTTPS protects data in transit, but does not prove a server is fully updated.",
      "An absence of known malware matches does not rule out vulnerabilities.",
      "Website owners should verify installed versions and security updates with their hosting provider."
    ],
    warningLabel: "What to look for", warningTitle: "PHP security:", warningAccent: "six things worth knowing.",
    warningIntro: "A widely shared security alert does not mean that every PHP website is affected. Look at the specific software version, conditions and official evidence.",
    warnings: [
      { title: "Outdated PHP", text: "PHP branches that no longer receive security updates deserve attention. An owner should check the installed version in their hosting panel." },
      { title: "Hidden version", text: "Many websites do not reveal their PHP version publicly. Not seeing a version does not mean the site is secure or vulnerable." },
      { title: "HTTPS isn't enough", text: "The padlock encrypts the connection. It does not tell you if PHP, a CMS or a plugin has been patched." },
      { title: "Plugins and extensions", text: "Even a fully updated PHP installation can coexist with vulnerable plugins, themes or other dependencies." },
      { title: "Scary headlines", text: "A CVE score reflects the general severity of a published issue; it does not prove the website you checked has that weakness." },
      { title: "Your personal data", text: "Before signing in, sharing documents or paying, check that the organization and web address are genuine as well as reviewing technical warnings." }
    ],
    casesLabel: "Common situations", casesTitle: "Different situations", casesAccent: "need different answers.",
    casesIntro: "Visitors want to know whether sharing data is sensible. Website owners need to know what to inspect and fix.",
    cases: [
      { title: "Shopping online", text: "Confirm the business, return policy and official domain. A low scam-risk rating cannot certify internal server security." },
      { title: "Running WordPress", text: "Check PHP, WordPress core, themes and plugins in your hosting and administration panels. Plan safe updates." },
      { title: "Reading about a new CVE", text: "Read the original advisory, affected versions, exploitation conditions and available fixes before making assumptions." },
      { title: "Receiving a suspicious link", text: "Verify the domain and the message's context before sharing data. Phishing and PHP vulnerabilities are separate threats." }
    ],
    mistakesLabel: "Mistakes to avoid", mistakesTitle: "A good rating", mistakesAccent: "is not a PHP security audit.",
    mistakesIntro: "A website may show few public fraud signals while still having internal weaknesses invisible to an external check.",
    mistakes: [
      "Calling a website vulnerable without checking its actual version and configuration.",
      "Confusing no known malware match with a full server security review.",
      "Thinking HTTPS protects against every internal security issue.",
      "Upgrading a live website without backups or compatibility tests.",
      "Assuming a viral vulnerability report affects every website using PHP."
    ],
    stepsLabel: "Practical verification", stepsTitle: "How to review PHP security step by step.",
    stepsIntro: "VONÜ checks public signals. Owners can confirm installed software and patches through their hosting provider and administration tools.",
    dateLabel: "Updated 22 October 2026",
    checks: [
      { title: "Know your role", text: "As a visitor you can review public evidence. As an owner you can verify actual server settings and installed software." },
      { title: "Identify your PHP version", text: "Check the hosting control panel or ask your provider. Avoid publishing diagnostic files that expose private configuration." },
      { title: "Check official support", text: "Compare the installed PHP branch and patch level with PHP.net's supported versions and security notices." },
      { title: "Review the full software stack", text: "Include the CMS, plugins, themes, extensions and dependencies—not only PHP itself." },
      { title: "Update carefully", text: "Back up the site and test compatibility before applying production updates." },
      { title: "Interpret VONÜ correctly", text: "A disclosed version can produce potential CVE matches, but this does not confirm exploitable weaknesses or data breaches." },
      { title: "Choose a sensible next step", text: "Visitors should verify the organization independently. Owners should review relevant findings with their host or developer." }
    ],
    sourcesLabel: "Official reference sources", sourceAction: "Read source",
    sources: [
      { title: "PHP.net · Supported versions", text: "Official PHP release maintenance and support information.", href: "https://www.php.net/supported-versions.php" },
      { title: "PHP.net · Security", text: "Security-related PHP information and notices.", href: "https://www.php.net/security" },
      { title: "NVD · CVE database", text: "Publicly catalogued vulnerabilities and their documented severity.", href: "https://nvd.nist.gov/" }
    ],
    relatedLabel: "More ways to check", relatedAction: "Read guide",
    related: [
      { title: "Is this website safe?", text: "Check reputation and identity before you trust a website.", slug: "comprobar-web-fiable" },
      { title: "Check a suspicious link", text: "Review a URL received through a message.", slug: "analizar-link-sospechoso" },
      { title: "Check an online store", text: "What to check before buying online.", slug: "comprobar-tienda-online" }
    ],
    faqLabel: "Frequently asked questions", faqTitle: "Questions about", faqAccent: "PHP security",
    faqs: [
      { q: "What is PHP?", a: "PHP is a programming language used to power websites and applications. Like any software, it can have security vulnerabilities." },
      { q: "Can VONÜ detect PHP vulnerabilities?", a: "VONÜ can inspect public clues, detect a version if the server exposes it, and compare it with published CVE notices. It cannot verify that a listed issue is actually exploitable on that website." },
      { q: "How do I know whether a website uses a vulnerable version?", a: "An owner should check the real installed version, enabled components and vendor patches. Public version disclosures are clues, not definitive proof." },
      { q: "Does HTTPS mean a website is safe?", a: "No. HTTPS encrypts traffic between your device and the website. It does not certify the organization, its data storage or the security of its software." },
      { q: "Does a low VONÜ risk score mean no vulnerabilities exist?", a: "No. The overall risk score describes observable signals, not a complete security audit of the server or its handling of personal data." },
      { q: "What should I do if PHP is no longer supported?", a: "Check with your hosting provider, make backups, plan a supported version upgrade and test that your site still works." }
    ],
    finalTitle: "Check the signals. Understand the limits.",
    finalIntro: "Paste a URL for a public security and trust check. Internal configuration, patch levels and data protection need separate verification.",
    finalCta: "Check a URL with VONÜ"
  },
  fr: {
    heroLead: "Sécurité des sites.", heroAccent: "PHP vulnérable ?", heroLast: "Ce qu'on peut réellement vérifier.",
    intro: "De nombreux sites utilisent PHP. Comprenez les risques des logiciels obsolètes, les indices visibles et les limites d'une analyse externe, sans alarmisme.",
    cta: "Vérifier un site", secondaryCta: "Voir les signaux d'alerte",
    quickLabel: "Réponse rapide", quickTitle: "Un site utilise PHP ?", quickAccent: "Cela ne le rend pas vulnérable.",
    quickIntro: "Le risque dépend de la version installée, des modules, correctifs et réglages. VONÜ examine des indices publics et peut comparer une version annoncée à des avis CVE, sans vérifier l'état interne du serveur.",
    checklist: [
      "PHP est une technologie très répandue. Sa présence n'est pas en soi un signe de danger.",
      "VONÜ examine des signaux publics, pas la configuration privée du serveur.",
      "Une version PHP précise annoncée peut être comparée aux avis de vulnérabilité publiés.",
      "Une correspondance CVE ne prouve pas qu'un site est exploitable.",
      "HTTPS chiffre la connexion, sans prouver que le serveur est entièrement à jour.",
      "L'absence de signalement de logiciel malveillant n'exclut pas les failles.",
      "Les responsables doivent vérifier les versions et correctifs auprès de leur hébergeur."
    ],
    warningLabel: "Signaux d'alerte", warningTitle: "Sécurité PHP :", warningAccent: "six points essentiels.",
    warningIntro: "Un avis largement partagé ne concerne pas nécessairement tous les sites PHP. Il faut vérifier la version, les conditions et les sources officielles.",
    warnings: [
      { title: "PHP obsolète", text: "Une version PHP qui ne reçoit plus de correctifs de sécurité mérite une vérification dans l'espace d'hébergement." },
      { title: "Version non visible", text: "De nombreux sites masquent leur version PHP. Son absence ne prouve ni leur sécurité ni leur vulnérabilité." },
      { title: "HTTPS ne suffit pas", text: "Le cadenas chiffre la connexion mais ne prouve pas que PHP, les extensions ou le CMS sont à jour." },
      { title: "Extensions et thèmes", text: "Un site peut disposer d'un PHP à jour et utiliser néanmoins des extensions, thèmes ou dépendances vulnérables." },
      { title: "Titres alarmants", text: "Le score CVSS mesure la gravité générale d'un avis, pas une faille confirmée sur le site analysé." },
      { title: "Données personnelles", text: "Avant de vous connecter, transmettre des documents ou payer, vérifiez l'identité du site et son adresse officielle." }
    ],
    casesLabel: "Situations courantes", casesTitle: "Chaque situation", casesAccent: "appelle sa réponse.",
    casesIntro: "Un visiteur veut savoir s'il peut partager des données. Un responsable veut savoir quels réglages améliorer.",
    cases: [
      { title: "Acheter en ligne", text: "Vérifiez le commerçant, les retours et le domaine officiel. Une note de confiance ne certifie pas la sécurité du serveur." },
      { title: "Administrer WordPress", text: "Vérifiez PHP, WordPress, les thèmes et les extensions, puis planifiez les mises à jour nécessaires." },
      { title: "Lire un avis CVE", text: "Consultez la source originale, les versions affectées, les conditions d'exploitation et les correctifs disponibles." },
      { title: "Recevoir un lien suspect", text: "Vérifiez le domaine et le contexte du message avant de partager des données. Le phishing et les failles PHP sont distincts." }
    ],
    mistakesLabel: "Erreurs à éviter", mistakesTitle: "Une bonne note", mistakesAccent: "n'est pas un audit PHP.",
    mistakesIntro: "Un site peut présenter peu d'indices de fraude tout en ayant des faiblesses internes invisibles de l'extérieur.",
    mistakes: [
      "Déclarer un site vulnérable sans confirmer sa version réelle et sa configuration.",
      "Confondre l'absence de logiciel malveillant répertorié avec un audit serveur complet.",
      "Croire que HTTPS protège contre toutes les failles internes.",
      "Mettre à jour un site en production sans sauvegardes ni tests.",
      "Supposer qu'un avis viral touche tous les sites utilisant PHP."
    ],
    stepsLabel: "Vérifications utiles", stepsTitle: "Comment vérifier la sécurité PHP, étape par étape.",
    stepsIntro: "VONÜ vérifie des signaux publics. Les propriétaires doivent confirmer les versions et correctifs avec leurs outils d'administration.",
    dateLabel: "Mis à jour le 22 octobre 2026",
    checks: [
      { title: "Déterminez votre situation", text: "Un visiteur consulte les indices publics ; un administrateur peut vérifier les réglages et logiciels réels." },
      { title: "Identifiez la version PHP", text: "Consultez votre hébergement ou demandez à votre prestataire. N'exposez pas de fichier de diagnostic contenant des secrets." },
      { title: "Vérifiez le support officiel", text: "Comparez la version installée avec les versions maintenues et les avis de PHP.net." },
      { title: "Vérifiez tous les composants", text: "N'oubliez pas le CMS, les extensions, thèmes, bibliothèques et autres dépendances." },
      { title: "Mettez à jour prudemment", text: "Effectuez des sauvegardes et testez la compatibilité avant toute mise à jour en production." },
      { title: "Interprétez VONÜ avec prudence", text: "Une version annoncée peut produire des correspondances CVE, sans prouver une faille exploitable ou une fuite de données." },
      { title: "Adaptez votre action", text: "Les visiteurs doivent vérifier l'entreprise indépendamment ; les propriétaires peuvent consulter leur hébergeur." }
    ],
    sourcesLabel: "Sources officielles", sourceAction: "Consulter la source",
    sources: [
      { title: "PHP.net · Versions maintenues", text: "Calendrier officiel de maintenance des versions PHP.", href: "https://www.php.net/supported-versions.php" },
      { title: "PHP.net · Sécurité", text: "Informations et avis officiels de sécurité PHP.", href: "https://www.php.net/security" },
      { title: "NVD · Base de données CVE", text: "Avis de vulnérabilités publiés et évaluations de gravité.", href: "https://nvd.nist.gov/" }
    ],
    relatedLabel: "Autres vérifications", relatedAction: "Lire le guide",
    related: [
      { title: "Un site est-il fiable ?", text: "Consultez les indices de réputation et d'identité.", slug: "comprobar-web-fiable" },
      { title: "Vérifier un lien suspect", text: "Analysez une URL reçue par message.", slug: "analizar-link-sospechoso" },
      { title: "Vérifier une boutique en ligne", text: "Les questions essentielles avant un achat.", slug: "comprobar-tienda-online" }
    ],
    faqLabel: "Questions fréquentes", faqTitle: "Comprendre la", faqAccent: "sécurité PHP",
    faqs: [
      { q: "Qu'est-ce que PHP ?", a: "PHP est un langage utilisé pour créer des sites et applications. Comme tout logiciel, il peut présenter des failles de sécurité." },
      { q: "VONÜ détecte-t-il les vulnérabilités PHP ?", a: "VONÜ peut relever des indices publics et comparer une version PHP annoncée avec des avis CVE. Cela ne confirme pas que le site présente une faille exploitable." },
      { q: "Comment savoir si une version vulnérable est utilisée ?", a: "Le responsable doit contrôler la version installée, les composants et les correctifs. Une version publiquement déclarée reste un indice." },
      { q: "HTTPS garantit-il la sécurité d'un site ?", a: "Non. HTTPS chiffre la connexion mais ne certifie ni l'identité de l'entreprise, ni le stockage des données, ni la sécurité des logiciels." },
      { q: "Une faible note de risque exclut-elle des failles ?", a: "Non. La note de VONÜ reflète des signaux observables, pas un audit complet des serveurs ou des données personnelles." },
      { q: "Que faire si PHP n'est plus maintenu ?", a: "Vérifiez auprès de l'hébergeur, sauvegardez le site, planifiez la mise à jour et testez son bon fonctionnement." }
    ],
    finalTitle: "Vérifiez les indices. Comprenez leurs limites.",
    finalIntro: "Collez une URL pour examiner les indices publics de sécurité et de confiance. Les réglages internes demandent une vérification distincte.",
    finalCta: "Vérifier une URL avec VONÜ"
  }
};
