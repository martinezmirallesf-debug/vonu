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
  },
  de: {
    heroLead: "Website-Sicherheit.", heroAccent: "PHP-Schwachstellen?", heroLast: "Was sich wirklich prüfen lässt.",
    intro: "Viele Websites nutzen PHP. Erfahre, welche Risiken veraltete Software mit sich bringt, was von außen sichtbar ist und wie du Warnungen ohne unnötige Panik einordnen kannst.",
    cta: "Website prüfen", secondaryCta: "Warnzeichen ansehen",
    quickLabel: "Die kurze Antwort", quickTitle: "Eine Website nutzt PHP?", quickAccent: "Das macht sie nicht unsicher.",
    quickIntro: "Das Risiko hängt von Version, Modulen, Patches und Konfiguration ab. VONÜ prüft öffentliche Signale und gleicht eine offen angegebene PHP-Version mit CVE-Meldungen ab. Die interne Serverkonfiguration bleibt dabei unbekannt.",
    checklist: [
      "PHP wird häufig eingesetzt. Seine bloße Verwendung ist kein Warnzeichen.",
      "VONÜ prüft öffentlich sichtbare Signale, nicht die private Serverkonfiguration.",
      "Wenn der Server eine genaue PHP-Version nennt, können bekannte CVE-Meldungen zugeordnet werden.",
      "Ein CVE-Versionstreffer beweist keine ausnutzbare Schwachstelle dieser Website.",
      "HTTPS schützt die Übertragung, belegt aber nicht den Patch-Stand des Servers.",
      "Keine bekannten Malware-Treffer bedeuten nicht, dass es keine Schwachstellen gibt.",
      "Betreiber sollten installierte Versionen und Sicherheitsupdates beim Hoster überprüfen."
    ],
    warningLabel: "Wichtige Warnzeichen", warningTitle: "PHP-Sicherheit:", warningAccent: "sechs wichtige Punkte.",
    warningIntro: "Eine weit verbreitete Sicherheitsmeldung betrifft nicht automatisch jede PHP-Website. Entscheidend sind Version, Bedingungen und offizielle Quellen.",
    warnings: [
      { title: "Veraltetes PHP", text: "PHP-Versionen ohne Sicherheitsupdates sollten geprüft werden. Betreiber finden die tatsächliche Version meist beim Hoster." },
      { title: "Version nicht sichtbar", text: "Viele Websites geben ihre PHP-Version nicht preis. Das bedeutet weder, dass sie sicher, noch dass sie verwundbar sind." },
      { title: "HTTPS allein reicht nicht", text: "Das Schloss steht für eine verschlüsselte Verbindung, nicht für aktuelle PHP-, CMS- oder Plugin-Versionen." },
      { title: "Plugins und Erweiterungen", text: "Auch mit aktuellem PHP können unsichere Erweiterungen, Themes oder Abhängigkeiten eingesetzt werden." },
      { title: "Dramatische Schlagzeilen", text: "Ein CVSS-Wert bewertet die allgemeine Schwere einer bekannten Schwachstelle, nicht ein bestätigtes Risiko der geprüften Website." },
      { title: "Persönliche Daten", text: "Prüfe vor Anmeldung, Dokumenten-Upload oder Zahlung die echte Organisation und ihre offizielle Webadresse." }
    ],
    casesLabel: "Typische Situationen", casesTitle: "Unterschiedliche Fragen", casesAccent: "brauchen passende Antworten.",
    casesIntro: "Besucher möchten wissen, ob sie Daten teilen sollten. Betreiber benötigen Hinweise auf verbesserungsbedürftige Einstellungen.",
    cases: [
      { title: "Online einkaufen", text: "Prüfe Händler, Rückgaberegeln und offizielle Domain. Ein guter Betrugswert ist keine Server-Sicherheitszertifizierung." },
      { title: "WordPress betreiben", text: "Prüfe PHP, WordPress, Themes und Plugins im Admin- und Hosting-Bereich und plane sichere Updates." },
      { title: "Eine neue CVE-Meldung lesen", text: "Prüfe Originalmeldung, betroffene Versionen, notwendige Bedingungen und verfügbare Updates." },
      { title: "Einen verdächtigen Link erhalten", text: "Prüfe Domain und Nachrichtenkontext, bevor du Daten teilst. Phishing und PHP-Schwachstellen sind verschiedene Risiken." }
    ],
    mistakesLabel: "Häufige Fehler", mistakesTitle: "Ein guter Wert", mistakesAccent: "ist kein PHP-Sicherheitsaudit.",
    mistakesIntro: "Eine Website kann wenige öffentlich sichtbare Betrugssignale zeigen und dennoch interne Probleme haben, die ein externer Check nicht erkennt.",
    mistakes: [
      "Eine Website als verwundbar bezeichnen, ohne Version und Konfiguration zu bestätigen.",
      "Keine bekannten Malware-Treffer mit einer vollständigen Serverprüfung verwechseln.",
      "Annehmen, dass HTTPS gegen alle internen Schwachstellen schützt.",
      "Ohne Backups oder Tests in der Live-Umgebung aktualisieren.",
      "Glauben, dass jede PHP-Website von einer viralen Sicherheitsmeldung betroffen ist."
    ],
    stepsLabel: "Nachvollziehbare Prüfung", stepsTitle: "PHP-Sicherheit Schritt für Schritt überprüfen.",
    stepsIntro: "VONÜ analysiert öffentliche Hinweise. Betreiber können ihre installierte Software, Einstellungen und Patches mit Hosting- und Administrationstools überprüfen.",
    dateLabel: "Aktualisiert am 22. Oktober 2026",
    checks: [
      { title: "Kläre deine Rolle", text: "Besucher beurteilen öffentliche Signale. Betreiber können die tatsächliche Serverkonfiguration und Software prüfen." },
      { title: "PHP-Version ermitteln", text: "Schau in die Hosting-Verwaltung oder frage deinen Anbieter. Veröffentliche keine Diagnose-Dateien mit privaten Daten." },
      { title: "Offiziellen Support prüfen", text: "Vergleiche installierte Version und Patch-Stand mit PHP.net und offiziellen Sicherheitshinweisen." },
      { title: "Gesamte Software prüfen", text: "Berücksichtige CMS, Plugins, Themes, Erweiterungen und Bibliotheken statt nur PHP." },
      { title: "Vorsichtig aktualisieren", text: "Erstelle Backups und teste die Kompatibilität vor Änderungen an der Live-Website." },
      { title: "VONÜ richtig verstehen", text: "Gemeldete Versionen können CVE-Treffer ergeben. Diese beweisen keine ausnutzbaren Lücken oder Datenlecks." },
      { title: "Sinnvolle Maßnahmen wählen", text: "Besucher sollten die Organisation unabhängig verifizieren. Betreiber können Hinweise mit dem Hoster prüfen." }
    ],
    sourcesLabel: "Offizielle Referenzen", sourceAction: "Quelle öffnen",
    sources: [
      { title: "PHP.net · Unterstützte Versionen", text: "Offizieller Zeitplan zur PHP-Wartung und Sicherheitsunterstützung.", href: "https://www.php.net/supported-versions.php" },
      { title: "PHP.net · Sicherheit", text: "Offizielle Sicherheitshinweise und Informationen zu PHP.", href: "https://www.php.net/security" },
      { title: "NVD · CVE-Datenbank", text: "Öffentlich dokumentierte Schwachstellen und ihre allgemeine Schwere.", href: "https://nvd.nist.gov/" }
    ],
    relatedLabel: "Weitere Prüfungen", relatedAction: "Ratgeber lesen",
    related: [
      { title: "Ist diese Website seriös?", text: "Identität und Reputation prüfen, bevor du vertraust.", slug: "comprobar-web-fiable" },
      { title: "Verdächtigen Link prüfen", text: "Eine per Nachricht erhaltene URL bewerten.", slug: "analizar-link-sospechoso" },
      { title: "Onlineshop prüfen", text: "Worauf du vor dem Einkauf achten solltest.", slug: "comprobar-tienda-online" }
    ],
    faqLabel: "Häufig gestellte Fragen", faqTitle: "Fragen zur", faqAccent: "PHP-Sicherheit",
    faqs: [
      { q: "Was ist PHP?", a: "PHP ist eine Programmiersprache für Websites und Webanwendungen. Wie jede Software kann sie Sicherheitslücken enthalten." },
      { q: "Erkennt VONÜ PHP-Schwachstellen?", a: "VONÜ untersucht öffentliche Hinweise und kann eine gemeldete PHP-Version mit bekannten CVE-Einträgen abgleichen. Ob eine Website tatsächlich ausnutzbar ist, wird dadurch nicht bestätigt." },
      { q: "Woran erkenne ich eine verwundbare PHP-Version?", a: "Betreiber müssen die reale Version, Module, Konfiguration und Patches prüfen. Eine öffentliche Versionsangabe ist nur ein Hinweis." },
      { q: "Ist eine HTTPS-Website automatisch sicher?", a: "Nein. HTTPS verschlüsselt Daten auf dem Übertragungsweg, garantiert aber weder die Echtheit des Anbieters noch sichere Datenspeicherung oder aktuelle Software." },
      { q: "Bedeutet ein niedriger VONÜ-Risikowert, dass es keine Schwachstellen gibt?", a: "Nein. Der Wert beschreibt beobachtbare Signale und ersetzt kein vollständiges Server- oder Datenschutz-Audit." },
      { q: "Was tun, wenn PHP nicht mehr unterstützt wird?", a: "Kontaktiere den Hoster, sichere die Website, plane ein Update auf eine unterstützte Version und teste anschließend die Funktionen." }
    ],
    finalTitle: "Signale prüfen. Grenzen verstehen.",
    finalIntro: "Gib eine URL ein, um öffentlich sichtbare Sicherheits- und Vertrauenshinweise zu prüfen. Interne Patches und Datenspeicherung müssen separat kontrolliert werden.",
    finalCta: "URL mit VONÜ prüfen"
  },
  ar: {
    heroLead: "أمان المواقع.", heroAccent: "هل PHP معرّض للثغرات؟", heroLast: "ما الذي نستطيع التحقق منه؟",
    intro: "تعتمد مواقع كثيرة على PHP. تعرّف إلى مخاطر البرامج القديمة، وما تكشفه الفحوص العامة، وكيف تفهم التنبيهات دون إثارة مخاوف غير مبررة.",
    cta: "فحص موقع", secondaryCta: "عرض مؤشرات الخطر",
    quickLabel: "الإجابة المختصرة", quickTitle: "هل يستخدم الموقع PHP؟", quickAccent: "هذا لا يعني أنه غير آمن.",
    quickIntro: "يعتمد الخطر على الإصدار الفعلي والمكونات والتحديثات والإعدادات. يفحص VONÜ الإشارات العامة ويمكنه مقارنة إصدار PHP المعلن بسجلات CVE، لكنه لا يتحقق من إعدادات الخادم الداخلية.",
    checklist: [
      "PHP تقنية واسعة الانتشار، واستخدامها ليس علامة خطر بحد ذاته.",
      "يفحص VONÜ معلومات الموقع العامة، لا إعدادات الخادم الخاصة.",
      "إذا كشف الخادم إصدار PHP دقيقاً، يمكن مقارنته بتنبيهات CVE المنشورة.",
      "تطابق الإصدار مع CVE لا يثبت إمكانية استغلال ثغرة في هذا الموقع.",
      "يحمي HTTPS البيانات أثناء نقلها، لكنه لا يثبت أن الخادم محدّث.",
      "عدم ظهور الموقع في قوائم البرمجيات الضارة لا ينفي وجود ثغرات.",
      "على مسؤولي المواقع التأكد من الإصدارات والتحديثات عبر الاستضافة."
    ],
    warningLabel: "إشارات مهمة", warningTitle: "أمان PHP:", warningAccent: "ست نقاط ينبغي معرفتها.",
    warningIntro: "انتشار خبر عن ثغرة لا يعني أن كل المواقع التي تستخدم PHP متأثرة. يجب مراجعة الإصدارات والشروط والمصادر الرسمية.",
    warnings: [
      { title: "إصدار PHP قديم", text: "الإصدارات التي توقفت تحديثاتها الأمنية تحتاج إلى مراجعة. يمكن للمالك فحص الإصدار المثبت في لوحة الاستضافة." },
      { title: "الإصدار غير ظاهر", text: "كثير من المواقع لا يكشف إصدار PHP. عدم ظهوره لا يثبت أن الموقع آمن أو معرض للخطر." },
      { title: "HTTPS وحده لا يكفي", text: "يشفّر رمز القفل الاتصال، لكنه لا يثبت تحديث PHP أو نظام إدارة المحتوى أو الإضافات." },
      { title: "الإضافات والمكونات", text: "قد يستخدم الموقع PHP محدثاً مع وجود إضافات أو قوالب أو مكتبات تحتوي على ثغرات." },
      { title: "عناوين الأخبار المخيفة", text: "تعبّر درجة CVSS عن الخطورة العامة لثغرة منشورة، ولا تؤكد وجودها في الموقع الذي فحصته." },
      { title: "بياناتك الشخصية", text: "قبل تسجيل الدخول أو إرسال مستندات أو دفع المال، تحقق من الجهة الحقيقية وعنوان موقعها الرسمي." }
    ],
    casesLabel: "حالات شائعة", casesTitle: "لكل حالة", casesAccent: "طريقة مناسبة للتحقق.",
    casesIntro: "يريد الزائر معرفة مدى ملاءمة مشاركة بياناته، بينما يريد مالك الموقع معرفة إعدادات الحماية التي يجب تحسينها.",
    cases: [
      { title: "التسوق عبر الإنترنت", text: "تحقق من التاجر وسياسة الإرجاع والنطاق الرسمي. انخفاض مؤشرات الاحتيال لا يعني اعتماد أمان الخادم." },
      { title: "إدارة WordPress", text: "تحقق من PHP وWordPress والقوالب والإضافات في لوحة الإدارة والاستضافة، ثم خطط للتحديثات." },
      { title: "قراءة خبر عن CVE", text: "راجع التنبيه الأصلي والإصدارات المتأثرة وشروط الاستغلال والتصحيحات المتاحة." },
      { title: "استلام رابط مشبوه", text: "افحص النطاق وسياق الرسالة قبل مشاركة بياناتك. التصيد الاحتيالي وثغرات PHP نوعان مختلفان من المخاطر." }
    ],
    mistakesLabel: "أخطاء ينبغي تجنبها", mistakesTitle: "النتيجة الجيدة", mistakesAccent: "ليست تدقيقاً شاملاً لأمان PHP.",
    mistakesIntro: "قد لا تظهر على موقع إشارات احتيال عامة، ومع ذلك تكون لديه مشكلات داخلية لا يستطيع الفحص الخارجي رؤيتها.",
    mistakes: [
      "وصف موقع بأنه معرض للثغرات دون التأكد من إصداره الفعلي وإعداداته.",
      "الاعتقاد أن غياب بلاغات البرمجيات الضارة يعني إتمام تدقيق كامل للخادم.",
      "الاعتقاد أن HTTPS يحمي من جميع المشكلات الأمنية الداخلية.",
      "تحديث الموقع مباشرة دون نسخ احتياطية أو اختبارات توافق.",
      "افتراض أن خبراً واسع الانتشار عن ثغرة ينطبق على جميع مواقع PHP."
    ],
    stepsLabel: "خطوات عملية", stepsTitle: "كيف تراجع أمان PHP خطوة بخطوة؟",
    stepsIntro: "يفحص VONÜ الإشارات العامة. ويمكن لمالكي المواقع التحقق من المكونات والتحديثات الفعلية عبر الاستضافة ولوحات الإدارة.",
    dateLabel: "آخر تحديث: 22 أكتوبر 2026",
    checks: [
      { title: "حدّد دورك", text: "يستطيع الزائر مراجعة الأدلة العامة، بينما يمكن للمالك فحص إعدادات الخادم والبرامج المثبتة." },
      { title: "تعرّف على إصدار PHP", text: "راجعه في لوحة الاستضافة أو اسأل المزود. لا تنشر ملفات تشخيص تكشف معلومات خاصة." },
      { title: "راجع الدعم الرسمي", text: "قارن الإصدار المثبت والتحديثات مع الإصدارات المدعومة وتنبيهات PHP.net." },
      { title: "راجع المكونات كلها", text: "يشمل ذلك نظام إدارة المحتوى والإضافات والقوالب والمكتبات والتبعيات، لا PHP وحده." },
      { title: "حدّث بحذر", text: "أنشئ نسخاً احتياطية واختبر التوافق قبل تطبيق التحديثات على الموقع الفعلي." },
      { title: "افهم نتائج VONÜ", text: "قد تظهر تطابقات CVE لإصدار معلن، لكنها لا تثبت ثغرة قابلة للاستغلال أو تسرب بيانات." },
      { title: "اختر الخطوة التالية", text: "على الزائر التأكد من الجهة بشكل مستقل؛ ويمكن للمالك مراجعة النتائج مع الاستضافة أو المطور." }
    ],
    sourcesLabel: "مصادر رسمية", sourceAction: "فتح المصدر",
    sources: [
      { title: "PHP.net · الإصدارات المدعومة", text: "جدول الدعم والتحديثات الرسمية لإصدارات PHP.", href: "https://www.php.net/supported-versions.php" },
      { title: "PHP.net · الأمان", text: "معلومات وتنبيهات أمنية رسمية عن PHP.", href: "https://www.php.net/security" },
      { title: "NVD · قاعدة CVE", text: "سجلات الثغرات المنشورة وتقييمات خطورتها العامة.", href: "https://nvd.nist.gov/" }
    ],
    relatedLabel: "فحوص أخرى", relatedAction: "قراءة الدليل",
    related: [
      { title: "هل هذا الموقع موثوق؟", text: "راجع السمعة والهوية قبل الثقة بالموقع.", slug: "comprobar-web-fiable" },
      { title: "فحص رابط مشبوه", text: "راجع رابطاً تلقيته عبر رسالة.", slug: "analizar-link-sospechoso" },
      { title: "فحص متجر إلكتروني", text: "ما الذي ينبغي التحقق منه قبل الشراء؟", slug: "comprobar-tienda-online" }
    ],
    faqLabel: "الأسئلة الشائعة", faqTitle: "أسئلة حول", faqAccent: "أمان PHP",
    faqs: [
      { q: "ما PHP؟", a: "PHP لغة برمجة تُستخدم لبناء مواقع وتطبيقات الويب. ومثل أي برنامج قد تحتوي على ثغرات أمنية." },
      { q: "هل يكتشف VONÜ ثغرات PHP؟", a: "يفحص VONÜ إشارات عامة وقد يقارن إصدار PHP المعلن بتنبيهات CVE المنشورة. لكنه لا يثبت أن الثغرة قابلة للاستغلال في الموقع." },
      { q: "كيف أعرف ما إذا كان الموقع يستخدم إصداراً ضعيفاً؟", a: "على المالك التحقق من الإصدار الحقيقي والمكونات والتصحيحات. أما الإصدار المعلن للعامة فمجرد مؤشر." },
      { q: "هل يضمن HTTPS أمان الموقع؟", a: "لا. يشفر HTTPS الاتصال، لكنه لا يضمن هوية الجهة أو أمان تخزين البيانات أو تحديث البرامج." },
      { q: "هل تعني درجة الخطر المنخفضة عدم وجود ثغرات؟", a: "لا. تعكس درجة VONÜ الإشارات العامة المرصودة ولا تحل محل تدقيق أمني كامل للخادم أو حماية البيانات." },
      { q: "ماذا أفعل إذا توقف دعم إصدار PHP؟", a: "استشر مزود الاستضافة وأنشئ نسخة احتياطية وخطط للتحديث إلى إصدار مدعوم واختبر الموقع بعد ذلك." }
    ],
    finalTitle: "افحص الإشارات. وافهم حدود الفحص.",
    finalIntro: "الصق رابطاً لمراجعة مؤشرات الأمان والثقة العامة. تحتاج الإعدادات الداخلية وتخزين البيانات إلى تحقق مستقل.",
    finalCta: "فحص رابط باستخدام VONÜ"
  },
};
