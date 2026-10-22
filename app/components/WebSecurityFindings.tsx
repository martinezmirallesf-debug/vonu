import type { SupportedLocale, WebSecurityAssessment, WebSecurityFinding } from "@/lib/vonu-check/types";

type FindingId = WebSecurityFinding["id"];
type FindingText = { title: string; description: string; action: string };
type Copy = {
  title: string;
  subtitle: string;
  review: string;
  improvements: string;
  noIssues: string;
  partial: string;
  disclaimer: string;
  observed: string;
  notObserved: string;
  notVerified: string;
  php: string;
  noPhp: string;
  phpUnknown: string;
  phpDetected: string;
  supported: string;
  securityOnly: string;
  unsupported: string;
  supportUnknown: string;
  cookies: string;
  cookiesNone: string;
  cookiesObserved: string;
  source: string;
  sourceUrl: string;
  headings: [string, string, string, string, string];
  findings: Record<FindingId, FindingText>;
};

const COPY: Record<SupportedLocale, Copy> = {
  es: {
    title: "Seguridad técnica de la web",
    subtitle: "Comprobaciones pasivas de la respuesta pública. No son una auditoría ni una prueba de explotación.",
    review: "Hay aspectos que conviene revisar",
    improvements: "Se pueden mejorar algunas protecciones",
    noIssues: "Sin problemas destacados en las comprobaciones disponibles",
    partial: "Solo hemos podido hacer parte de las comprobaciones",
    disclaimer: "No podemos verificar cómo se guardan los datos, el control de acceso, las bases de datos ni las vulnerabilidades internas. La ausencia de alertas no demuestra que la web sea segura.",
    observed: "Detectada",
    notObserved: "No detectada aquí",
    notVerified: "No verificable",
    php: "Tecnología PHP",
    noPhp: "Sin indicios públicos en esta respuesta",
    phpUnknown: "Hay indicios de PHP; versión no identificada",
    phpDetected: "Versión declarada por el servidor",
    supported: "soporte activo",
    securityOnly: "solo actualizaciones de seguridad",
    unsupported: "ya no recibe actualizaciones de seguridad oficiales",
    supportUnknown: "soporte no determinado",
    cookies: "Cookies de esta respuesta",
    cookiesNone: "Ninguna observada",
    cookiesObserved: "observadas",
    source: "Guía de seguridad PHP",
    sourceUrl: "https://www.php.net/supported-versions.php",
    headings: ["HSTS", "Política CSP", "X-Content-Type-Options", "Protección de marcos", "Referrer-Policy"],
    findings: {
      "php-unsupported": { title: "Versión PHP declarada fuera de soporte", description: "El servidor anuncia una rama de PHP cuyo soporte oficial ha terminado. La cabecera puede no reflejar la instalación real.", action: "Si gestionas esta web, verifica la versión instalada en el alojamiento y actualiza a una rama mantenida." },
      "cookie-insecure": { title: "Cookies sin atributo Secure", description: "Algunas cookies observadas en la respuesta HTTPS no indican Secure. No todas contienen información sensible.", action: "Revisa el uso de estas cookies y configura Secure cuando deban transmitirse únicamente por HTTPS." },
      "session-cookie-httponly": { title: "Posibles cookies de sesión sin HttpOnly", description: "Se han observado cookies con nombres típicos de sesión sin HttpOnly. Es una señal de configuración, no una filtración demostrada.", action: "Protege las cookies de sesión con HttpOnly si no necesitan ser accesibles desde JavaScript." },
      "cookie-samesite": { title: "Cookies de sesión sin SameSite explícito", description: "Algunas cookies con apariencia de sesión no indican una política SameSite.", action: "Elige Strict o Lax, o None con Secure cuando la integración requiera acceso entre sitios." },
      "missing-hsts": { title: "HSTS no observado", description: "La respuesta HTTPS no incluye una cabecera Strict-Transport-Security.", action: "Revisa la activación de HSTS cuando todo el dominio y sus subdominios sean compatibles con HTTPS." },
      "missing-csp": { title: "CSP no observada", description: "No se ha observado una política Content-Security-Policy aplicada en la página analizada.", action: "Diseña una CSP adaptada a los scripts y recursos de la web y comprueba que no rompa funciones legítimas." },
      "missing-nosniff": { title: "Falta la indicación nosniff", description: "No se ha visto X-Content-Type-Options: nosniff en la respuesta.", action: "Configura X-Content-Type-Options: nosniff y revisa los tipos MIME servidos." },
      "missing-frame-protection": { title: "Protección de incrustación no observada", description: "No se ha visto X-Frame-Options compatible ni una regla CSP frame-ancestors.", action: "Revisa frame-ancestors en CSP para restringir dónde puede incrustarse la web." },
      "missing-referrer-policy": { title: "Política Referrer-Policy no observada", description: "El servidor no declara una política Referrer-Policy en la respuesta.", action: "Establece una política acorde con la privacidad y los enlaces de tu web." },
    },
  },
  en: {
    title: "Website technical security",
    subtitle: "Passive checks of a public response. Not a penetration test or proof of exploitability.",
    review: "Technical findings need review",
    improvements: "Some configurations could be improved",
    noIssues: "No major findings in the available checks",
    partial: "Partial technical assessment",
    disclaimer: "We cannot verify how data is stored, access controls, databases or internal vulnerabilities. No alerts do not mean a website is safe.",
    observed: "Observed", notObserved: "Not detected here", notVerified: "Not verifiable",
    php: "PHP technology", noPhp: "No public indicators in this response", phpUnknown: "PHP indicators found; version unknown", phpDetected: "Server-reported version",
    supported: "active support", securityOnly: "security fixes only", unsupported: "out of support", supportUnknown: "support unknown",
    cookies: "Cookies in this response", cookiesNone: "None observed", cookiesObserved: "observed",
    source: "PHP security guide", sourceUrl: "https://www.php.net/supported-versions.php",
    headings: ["HSTS", "CSP policy", "X-Content-Type-Options", "Frame protection", "Referrer-Policy"],
    findings: {
      "php-unsupported": { title: "Server-reported PHP version is unsupported", description: "A response header advertises an end-of-life PHP branch. The header may not reflect the actual installation.", action: "If you own this website, verify the installed version in hosting settings and upgrade to a supported branch." },
      "cookie-insecure": { title: "Cookies without Secure", description: "Some cookies in the HTTPS response lack the Secure flag. Not all cookies contain sensitive information.", action: "Review these cookies and use Secure when they should only travel over HTTPS." },
      "session-cookie-httponly": { title: "Possible session cookies without HttpOnly", description: "Cookie names resembling session identifiers were found without HttpOnly. This does not prove a data leak.", action: "Use HttpOnly for session cookies that do not need to be read by JavaScript." },
      "cookie-samesite": { title: "Session cookies without explicit SameSite", description: "Some session-like cookies lack an explicit SameSite attribute.", action: "Consider Strict or Lax; use None with Secure when a cross-site integration requires it." },
      "missing-hsts": { title: "HSTS not observed", description: "The HTTPS response does not include Strict-Transport-Security.", action: "Consider enabling HSTS once the domain and relevant subdomains consistently support HTTPS." },
      "missing-csp": { title: "CSP not observed", description: "No enforced Content-Security-Policy was found on the inspected page.", action: "Design a CSP suited to your actual resources and test compatibility before enforcement." },
      "missing-nosniff": { title: "nosniff header not observed", description: "The response did not indicate X-Content-Type-Options: nosniff.", action: "Set X-Content-Type-Options: nosniff and verify appropriate content types." },
      "missing-frame-protection": { title: "Frame protection not observed", description: "Neither a compatible X-Frame-Options value nor CSP frame-ancestors was found.", action: "Consider CSP frame-ancestors to control which sites can embed the page." },
      "missing-referrer-policy": { title: "Referrer-Policy not observed", description: "The response does not declare Referrer-Policy.", action: "Set a referrer policy that fits the website's privacy needs." },
    },
  },
  fr: {
    title: "Sécurité technique du site", subtitle: "Contrôles passifs d'une réponse publique. Ni audit complet ni preuve d'exploitation.",
    review: "Des indices techniques nécessitent une vérification", improvements: "Certaines configurations peuvent être améliorées", noIssues: "Aucun problème majeur dans les contrôles disponibles", partial: "Évaluation technique partielle",
    disclaimer: "Ces contrôles ne vérifient ni le stockage des données, ni les accès, ni les bases de données ou les vulnérabilités internes. L'absence d'alerte n'est pas une garantie.",
    observed: "Observé", notObserved: "Non détecté ici", notVerified: "Non vérifiable",
    php: "Technologie PHP", noPhp: "Aucun indice public dans cette réponse", phpUnknown: "Indices PHP détectés ; version inconnue", phpDetected: "Version déclarée par le serveur",
    supported: "support actif", securityOnly: "correctifs de sécurité seuls", unsupported: "hors support", supportUnknown: "support inconnu",
    cookies: "Cookies de cette réponse", cookiesNone: "Aucun observé", cookiesObserved: "observés",
    source: "Guide de sécurité PHP", sourceUrl: "https://www.php.net/supported-versions.php",
    headings: ["HSTS", "Politique CSP", "X-Content-Type-Options", "Protection des cadres", "Referrer-Policy"],
    findings: {
      "php-unsupported": { title: "Version PHP déclarée hors support", description: "Une en-tête annonce une version PHP non maintenue ; elle peut ne pas correspondre à la version installée.", action: "Vérifiez la version réelle chez votre hébergeur et mettez-la à jour." },
      "cookie-insecure": { title: "Cookies sans Secure", description: "Certaines cookies HTTPS n'indiquent pas Secure ; toutes ne sont pas sensibles.", action: "Vérifiez leur usage et appliquez Secure aux cookies réservés à HTTPS." },
      "session-cookie-httponly": { title: "Cookies de session possibles sans HttpOnly", description: "Des noms de cookies ressemblant à des sessions manquent de HttpOnly.", action: "Utilisez HttpOnly si ces cookies n'ont pas besoin de JavaScript." },
      "cookie-samesite": { title: "Cookies de session sans SameSite explicite", description: "Certaines cookies de type session n'indiquent pas SameSite.", action: "Choisissez Lax ou Strict ; None avec Secure si nécessaire entre sites." },
      "missing-hsts": { title: "HSTS non observé", description: "L'en-tête Strict-Transport-Security est absent de la réponse HTTPS.", action: "Étudiez HSTS après avoir vérifié la compatibilité HTTPS." },
      "missing-csp": { title: "CSP non observée", description: "Aucune Content-Security-Policy appliquée n'a été observée.", action: "Définissez puis testez une CSP adaptée à vos ressources." },
      "missing-nosniff": { title: "nosniff non observé", description: "X-Content-Type-Options: nosniff n'a pas été observé.", action: "Configurez nosniff et vérifiez les types MIME." },
      "missing-frame-protection": { title: "Protection contre l'intégration non observée", description: "Ni X-Frame-Options adéquat ni CSP frame-ancestors n'ont été observés.", action: "Envisagez frame-ancestors pour restreindre l'intégration du site." },
      "missing-referrer-policy": { title: "Referrer-Policy non observée", description: "Aucune Referrer-Policy n'a été observée.", action: "Définissez une politique adaptée à la confidentialité du site." },
    },
  },
  de: {
    title: "Technische Website-Sicherheit", subtitle: "Passive Prüfung einer öffentlichen Antwort; kein Penetrationstest und kein Beweis einer Schwachstelle.",
    review: "Technische Hinweise sollten geprüft werden", improvements: "Einige Einstellungen können verbessert werden", noIssues: "Keine wichtigen Auffälligkeiten in den verfügbaren Prüfungen", partial: "Teilweise technische Prüfung",
    disclaimer: "Datenspeicherung, Zugriffsrechte, Datenbanken und interne Schwachstellen können nicht geprüft werden. Keine Warnung ist keine Sicherheitsgarantie.",
    observed: "Erkannt", notObserved: "Hier nicht erkannt", notVerified: "Nicht prüfbar",
    php: "PHP-Technologie", noPhp: "Keine öffentlichen Hinweise in dieser Antwort", phpUnknown: "PHP-Hinweise erkannt; Version unbekannt", phpDetected: "Vom Server gemeldete Version",
    supported: "aktiver Support", securityOnly: "nur Sicherheitsupdates", unsupported: "ohne Support", supportUnknown: "Support unbekannt",
    cookies: "Cookies in dieser Antwort", cookiesNone: "Keine beobachtet", cookiesObserved: "beobachtet",
    source: "PHP-Sicherheitsleitfaden", sourceUrl: "https://www.php.net/supported-versions.php",
    headings: ["HSTS", "CSP-Richtlinie", "X-Content-Type-Options", "Frame-Schutz", "Referrer-Policy"],
    findings: {
      "php-unsupported": { title: "Gemeldete PHP-Version ohne Support", description: "Ein HTTP-Header nennt eine nicht mehr unterstützte PHP-Version. Die tatsächliche Version kann abweichen.", action: "Prüfe die installierte Version beim Hoster und aktualisiere sie." },
      "cookie-insecure": { title: "Cookies ohne Secure", description: "Einige HTTPS-Cookies haben kein Secure-Attribut; nicht alle enthalten sensible Daten.", action: "Prüfe die Cookies und verwende Secure, wenn sie nur über HTTPS gesendet werden sollen." },
      "session-cookie-httponly": { title: "Mögliche Sitzungs-Cookies ohne HttpOnly", description: "Cookies mit sitzungsähnlichen Namen haben kein HttpOnly.", action: "Nutze HttpOnly, wenn JavaScript nicht auf die Sitzungs-Cookies zugreifen muss." },
      "cookie-samesite": { title: "Sitzungs-Cookies ohne explizites SameSite", description: "Einige sitzungsähnliche Cookies haben kein SameSite.", action: "Prüfe Lax oder Strict; bei seitenübergreifender Nutzung None mit Secure." },
      "missing-hsts": { title: "HSTS nicht beobachtet", description: "Strict-Transport-Security fehlt in der HTTPS-Antwort.", action: "Erwäge HSTS, wenn alle betreffenden Domains HTTPS unterstützen." },
      "missing-csp": { title: "CSP nicht beobachtet", description: "Keine durchgesetzte Content-Security-Policy wurde gefunden.", action: "Erstelle und teste eine passende CSP." },
      "missing-nosniff": { title: "nosniff nicht beobachtet", description: "X-Content-Type-Options: nosniff wurde nicht gefunden.", action: "Setze nosniff und prüfe die MIME-Typen." },
      "missing-frame-protection": { title: "Frame-Schutz nicht beobachtet", description: "Weder X-Frame-Options noch CSP frame-ancestors wurden gefunden.", action: "Nutze ggf. CSP frame-ancestors gegen unerwünschtes Einbetten." },
      "missing-referrer-policy": { title: "Referrer-Policy nicht beobachtet", description: "Keine Referrer-Policy wurde gefunden.", action: "Konfiguriere eine Richtlinie passend zu Datenschutzanforderungen." },
    },
  },
  ar: {
    title: "الأمان التقني للموقع", subtitle: "فحوص سلبية لاستجابة عامة؛ ليست اختبار اختراق ولا دليلاً على استغلال ثغرة.",
    review: "هناك مؤشرات تقنية تحتاج إلى مراجعة", improvements: "يمكن تحسين بعض إعدادات الأمان", noIssues: "لا توجد مشكلات بارزة في الفحوص المتاحة", partial: "فحص تقني جزئي",
    disclaimer: "لا تتحقق هذه الفحوص من تخزين البيانات أو صلاحيات الوصول أو قواعد البيانات أو الثغرات الداخلية. غياب التحذيرات لا يعني ضمان الأمان.",
    observed: "مرصود", notObserved: "غير مكتشف هنا", notVerified: "غير قابل للتحقق",
    php: "تقنية PHP", noPhp: "لا توجد مؤشرات عامة في هذه الاستجابة", phpUnknown: "مؤشرات PHP موجودة، والإصدار غير معروف", phpDetected: "الإصدار المعلن من الخادم",
    supported: "دعم نشط", securityOnly: "تصحيحات أمنية فقط", unsupported: "خارج الدعم", supportUnknown: "الدعم غير معروف",
    cookies: "ملفات تعريف الارتباط في هذه الاستجابة", cookiesNone: "لم يُرصد شيء", cookiesObserved: "مرصودة",
    source: "دليل أمان PHP", sourceUrl: "https://www.php.net/supported-versions.php",
    headings: ["HSTS", "سياسة CSP", "X-Content-Type-Options", "الحماية من الإطارات", "Referrer-Policy"],
    findings: {
      "php-unsupported": { title: "إصدار PHP معلن خارج الدعم", description: "يُظهر ترويس الخادم إصدار PHP لم يعد مدعوماً، وقد لا يعكس الإصدار المثبت فعلياً.", action: "تحقق من الإصدار في الاستضافة وحدّثه إلى إصدار مدعوم." },
      "cookie-insecure": { title: "ملفات تعريف ارتباط بدون Secure", description: "بعض ملفات الارتباط في استجابة HTTPS لا تحتوي على Secure، وليست جميعها حساسة.", action: "راجع هذه الملفات واضبط Secure عند الحاجة لإرسالها عبر HTTPS فقط." },
      "session-cookie-httponly": { title: "ملفات جلسة محتملة بدون HttpOnly", description: "رُصدت أسماء ملفات شبيهة بملفات الجلسات بدون HttpOnly.", action: "استخدم HttpOnly لملفات الجلسة التي لا تتطلب JavaScript." },
      "cookie-samesite": { title: "ملفات جلسة بدون SameSite صريح", description: "بعض ملفات الجلسات المحتملة لا تعلن SameSite.", action: "استخدم Lax أو Strict أو None مع Secure عند الحاجة." },
      "missing-hsts": { title: "HSTS غير مرصود", description: "لم يظهر Strict-Transport-Security في استجابة HTTPS.", action: "راجع تفعيل HSTS بعد التأكد من دعم HTTPS." },
      "missing-csp": { title: "CSP غير مرصودة", description: "لم تُرصد سياسة Content-Security-Policy مطبقة.", action: "ضع سياسة CSP مناسبة واختبر توافقها." },
      "missing-nosniff": { title: "nosniff غير مرصود", description: "لم يظهر X-Content-Type-Options: nosniff.", action: "اضبط nosniff وراجع أنواع المحتوى." },
      "missing-frame-protection": { title: "حماية الإطارات غير مرصودة", description: "لم يظهر X-Frame-Options مناسب ولا frame-ancestors.", action: "فكر في ضبط frame-ancestors لمنع التضمين غير المرغوب." },
      "missing-referrer-policy": { title: "Referrer-Policy غير مرصودة", description: "لم تُرصد Referrer-Policy.", action: "اضبط سياسة تناسب خصوصية الموقع." },
    },
  },
};

const CVE_COPY: Record<SupportedLocale, {
  title: string;
  noVersion: string;
  loadingUnavailable: string;
  incomplete: string;
  empty: string;
  found: (count: number) => string;
  partial: string;
  warning: string;
  label: string;
  source: string;
  owner: string;
}> = {
  es: {
    title: "Coincidencias de vulnerabilidades publicadas (CVE)",
    noVersion: "La web no expone una versión PHP completa. Sin una versión verificable no podemos buscar coincidencias específicas.",
    loadingUnavailable: "La consulta de NVD no se ha podido completar. No significa que haya cero vulnerabilidades.",
    incomplete: "La versión PHP anunciada es incompleta; hace falta la versión exacta para la consulta.",
    empty: "No aparecen coincidencias en esta consulta a NVD. Esto no garantiza la ausencia de vulnerabilidades.",
    found: (count) => `${count} coincidencias potenciales publicadas para la versión declarada`,
    partial: "La consulta es parcial: se muestran algunos registros; pueden existir más CVE.",
    warning: "Son coincidencias de versión según NVD, no vulnerabilidades verificadas en esta web. Pueden depender de módulos, compilación, configuración o parches del proveedor.",
    label: "CVSS",
    source: "Consultar NVD",
    owner: "Si administras el sitio, comprueba la versión instalada y los parches reales antes de sacar conclusiones.",
  },
  en: {
    title: "Published vulnerability matches (CVE)",
    noVersion: "The website does not publicly disclose a full PHP version, so we cannot check version-specific CVEs.",
    loadingUnavailable: "The NVD request did not complete. This does not mean there are zero vulnerabilities.",
    incomplete: "The publicly reported PHP version is incomplete; a full version is required.",
    empty: "No matches were returned by this NVD query. This does not guarantee the absence of vulnerabilities.",
    found: (count) => `${count} possible published matches for the reported version`,
    partial: "Partial NVD result: other CVEs may not be included in the displayed list.",
    warning: "These are NVD version matches, not verified vulnerabilities of this website. Applicability depends on modules, builds, configuration and vendor patches.",
    label: "CVSS", source: "View NVD record",
    owner: "If you own the website, check its actual installed version and patch level before drawing conclusions.",
  },
  fr: {
    title: "Correspondances de vulnérabilités publiées (CVE)",
    noVersion: "Le site ne publie pas de version PHP complète ; nous ne pouvons pas consulter les CVE propres à cette version.",
    loadingUnavailable: "La consultation NVD a échoué. Cela ne signifie pas qu'il n'existe aucune vulnérabilité.",
    incomplete: "La version PHP annoncée est incomplète.",
    empty: "Aucune correspondance renvoyée par NVD. Cela ne garantit pas l'absence de vulnérabilités.",
    found: (count) => `${count} correspondances potentielles pour la version déclarée`,
    partial: "Résultat NVD partiel : d'autres CVE peuvent exister.",
    warning: "Ce sont des correspondances de version, pas des vulnérabilités vérifiées sur ce site. Leur pertinence dépend des modules, de la configuration et des correctifs.",
    label: "CVSS", source: "Voir la fiche NVD",
    owner: "Si vous gérez ce site, vérifiez la version réellement installée et les correctifs.",
  },
  de: {
    title: "Bekannte Schwachstellen-Kandidaten (CVE)",
    noVersion: "Die Website veröffentlicht keine vollständige PHP-Version. Ein versionsspezifischer CVE-Abgleich ist nicht möglich.",
    loadingUnavailable: "NVD war nicht erreichbar. Dies bedeutet nicht, dass es keine Schwachstellen gibt.",
    incomplete: "Die gemeldete PHP-Version ist unvollständig.",
    empty: "Diese NVD-Abfrage ergab keine Treffer. Das ist keine Sicherheitsgarantie.",
    found: (count) => `${count} mögliche veröffentlichte Treffer zur gemeldeten Version`,
    partial: "NVD-Teilergebnis: weitere CVEs können vorhanden sein.",
    warning: "Es handelt sich um Versionszuordnungen, nicht um bestätigte Schwachstellen der Website. Module, Konfiguration und Hersteller-Patches beeinflussen die Anwendbarkeit.",
    label: "CVSS", source: "NVD-Eintrag öffnen",
    owner: "Betreiber sollten die tatsächlich installierte Version und den Patch-Stand überprüfen.",
  },
  ar: {
    title: "تطابقات الثغرات المنشورة (CVE)",
    noVersion: "لا يكشف الموقع إصدار PHP كاملاً، لذا لا يمكن مطابقة ثغرات هذا الإصدار.",
    loadingUnavailable: "تعذر إكمال استعلام NVD. هذا لا يعني عدم وجود ثغرات.",
    incomplete: "إصدار PHP المعلن غير مكتمل.",
    empty: "لم يُرجع استعلام NVD تطابقات. هذا لا يضمن عدم وجود ثغرات.",
    found: (count) => `${count} تطابقات محتملة منشورة للإصدار المعلن`,
    partial: "نتيجة NVD جزئية؛ ربما توجد سجلات CVE إضافية.",
    warning: "هذه تطابقات إصدارات من NVD وليست ثغرات مؤكدة في الموقع. يعتمد انطباقها على المكونات والإعدادات وتصحيحات المزود.",
    label: "CVSS", source: "عرض سجل NVD",
    owner: "إذا كنت تدير الموقع فتحقق من الإصدار الفعلي والتحديثات الأمنية قبل الاستنتاج.",
  },
};

const TECH_UI: Record<SupportedLocale, {
  open: string;
  hint: string;
  explanation: string;
  original: string;
  candidate: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
  unknown: string;
}> = {
  es: {
    open: "Ver análisis técnico completo",
    hint: "Información adicional para responsables de la web",
    explanation: "«No detectada» significa que no apareció en la respuesta que VONÜ recibió. No confirma que esa protección falte en toda la web. Una versión anunciada por el servidor tampoco prueba qué software se ejecuta realmente.",
    original: "Ver explicación técnica original en inglés",
    candidate: "Este registro describe un problema publicado de PHP. La puntuación valora la gravedad del problema en general, no el riesgo confirmado de esta web.",
    critical: "Gravedad general muy alta",
    high: "Gravedad general alta",
    medium: "Gravedad general media",
    low: "Gravedad general baja",
    unknown: "Gravedad sin determinar",
  },
  en: {
    open: "Show the full technical analysis",
    hint: "Additional information for website administrators",
    explanation: "«Not detected» means the setting was absent from the response VONÜ received. It does not prove the whole website lacks the protection. A reported PHP version is also not proof of the actual runtime.",
    original: "Show original technical explanation",
    candidate: "This published PHP issue is a version-based candidate, not a verified vulnerability of this website. CVSS is a general severity score.",
    critical: "Very high general severity",
    high: "High general severity",
    medium: "Medium general severity",
    low: "Low general severity",
    unknown: "Unknown severity",
  },
  fr: {
    open: "Afficher l'analyse technique complète",
    hint: "Informations supplémentaires pour les responsables du site",
    explanation: "«Non détecté» signifie absent de la réponse reçue. Cela ne prouve pas que tout le site manque de cette protection. Une version PHP annoncée n'est pas une preuve de la version réellement exécutée.",
    original: "Voir la description technique originale (anglais)",
    candidate: "Cet avis PHP est une correspondance possible, et non une vulnérabilité confirmée de ce site. CVSS indique la gravité générale.",
    critical: "Gravité générale très élevée",
    high: "Gravité générale élevée",
    medium: "Gravité générale moyenne",
    low: "Gravité générale faible",
    unknown: "Gravité inconnue",
  },
  de: {
    open: "Vollständige technische Analyse anzeigen",
    hint: "Zusatzinformationen für Websitebetreiber",
    explanation: "«Nicht erkannt» bedeutet, dass die Einstellung in der geprüften Antwort nicht vorkam. Es beweist nicht, dass die gesamte Website ungeschützt ist. Eine gemeldete PHP-Version beweist nicht die tatsächlich installierte Version.",
    original: "Technischen Originaltext auf Englisch anzeigen",
    candidate: "Dieser PHP-Hinweis ist ein möglicher Versionstreffer, keine bestätigte Schwachstelle der Website. CVSS beschreibt die allgemeine Schwere.",
    critical: "Sehr hoher allgemeiner Schweregrad",
    high: "Hoher allgemeiner Schweregrad",
    medium: "Mittlerer allgemeiner Schweregrad",
    low: "Niedriger allgemeiner Schweregrad",
    unknown: "Schweregrad unbekannt",
  },
  ar: {
    open: "عرض التحليل التقني الكامل",
    hint: "معلومات إضافية لمسؤولي الموقع",
    explanation: "«غير مكتشف» يعني أن الإعداد لم يظهر في الاستجابة التي فحصها VONÜ، ولا يثبت غيابه عن الموقع كله. كما أن إصدار PHP المعلن لا يؤكد الإصدار الفعلي.",
    original: "عرض الوصف التقني الأصلي بالإنجليزية",
    candidate: "هذا سجل محتمل مرتبط بإصدار PHP، وليس ثغرة مثبتة في هذا الموقع. تعبر CVSS عن الخطورة العامة فقط.",
    critical: "خطورة عامة شديدة جداً",
    high: "خطورة عامة مرتفعة",
    medium: "خطورة عامة متوسطة",
    low: "خطورة عامة منخفضة",
    unknown: "خطورة غير محددة",
  },
};

export default function WebSecurityFindings({
  locale,
  security,
}: {
  locale: SupportedLocale;
  security?: WebSecurityAssessment;
}) {
  const t = COPY[locale];
  const findings = security?.findings ?? [];
  const hasAttention = findings.some((item) => item.severity === "attention");
  const verdict = !security || security.limited
    ? t.partial
    : hasAttention ? t.review : findings.length ? t.improvements : t.noIssues;
  const label = (value: boolean) => !security || (security.limited && !value) ? t.notVerified : value ? t.observed : t.notObserved;
  const headerRows: Array<[string, boolean]> = [
    [t.headings[0], security?.headers.hsts ?? false],
    [t.headings[1], security?.headers.csp ?? false],
    [t.headings[2], security?.headers.nosniff ?? false],
    [t.headings[3], security?.headers.frameProtection ?? false],
    [t.headings[4], security?.headers.referrerPolicy ?? false],
  ];
  const php = security?.php;
  const phpSupport = php?.support === "active"
    ? t.supported
    : php?.support === "security-only"
      ? t.securityOnly
      : php?.support === "unsupported"
        ? t.unsupported : t.supportUnknown;
  const phpText = php?.reportedVersion
    ? `${t.phpDetected}: PHP ${php.reportedVersion} (${phpSupport})`
    : php?.indicators.length ? t.phpUnknown : t.noPhp;
  return (
    <details className="group min-w-0 overflow-hidden rounded-[24px] bg-[#141927]/86 ring-1 ring-white/[0.08]">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-5 hover:bg-white/[0.025]">
        <span className="min-w-0">
          <span className="block text-[16px] font-semibold text-white">{TECH_UI[locale].open}</span>
          <span className="mt-1 block text-[12px] leading-5 text-slate-400">{TECH_UI[locale].hint}</span>
        </span>
        <span className="shrink-0 rounded-full bg-[#233452] px-2.5 py-1 text-[18px] leading-6 text-[#79b4ff] group-open:rotate-45">+</span>
      </summary>
      <section className="border-t border-white/[0.07] p-5">
      <h2 className="text-[17px] font-bold text-white">{t.title}</h2>
      <p className="mt-2 text-[12px] leading-5 text-slate-400">{t.subtitle}</p>
      <p className="mt-2 text-[12px] leading-5 text-slate-300">{TECH_UI[locale].explanation}</p>
      <p className={`mt-4 text-[14px] font-semibold ${hasAttention ? "text-amber-300" : "text-[#79b4ff]"}`}>{verdict}</p>

      <dl className="mt-4 grid gap-2.5 text-[12px]">
        {headerRows.map(([heading, detected]) => (
          <div key={heading} className="flex justify-between gap-3">
            <dt className="min-w-0 text-slate-400">{heading}</dt>
            <dd className="shrink-0 font-medium text-slate-200">{label(detected)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-xl bg-black/15 p-3">
        <p className="text-[12px] font-semibold text-slate-200">{t.php}</p>
        <p className="mt-1 break-words text-[12px] leading-5 text-slate-400">{phpText}</p>
        <p className="mt-2 text-[12px] leading-5 text-slate-400">
          {t.cookies}: {security?.cookies.observed ? `${security.cookies.observed} ${t.cookiesObserved}` : t.cookiesNone}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/15 p-3">
        <h3 className="text-[13px] font-semibold text-white">{CVE_COPY[locale].title}</h3>
        {!php?.reportedVersion ? (
          <p className="mt-2 text-[12px] leading-5 text-slate-400">{CVE_COPY[locale].noVersion}</p>
        ) : php.cves?.status === "unavailable" || !php.cves ? (
          <p className="mt-2 text-[12px] leading-5 text-slate-400">{CVE_COPY[locale].loadingUnavailable}</p>
        ) : php.cves.status === "incomplete-version" ? (
          <p className="mt-2 text-[12px] leading-5 text-slate-400">{CVE_COPY[locale].incomplete}</p>
        ) : (
          <>
            <p className={`mt-2 text-[12px] font-semibold ${(php.cves.totalMatches ?? 0) > 0 ? "text-amber-200" : "text-[#79b4ff]"}`}>
              {(php.cves.totalMatches ?? 0) > 0 ? CVE_COPY[locale].found(php.cves.totalMatches ?? 0) : CVE_COPY[locale].empty}
            </p>
            {php.cves.status === "partial" && <p className="mt-2 text-[12px] leading-5 text-amber-200">{CVE_COPY[locale].partial}</p>}
            {(php.cves.totalMatches ?? 0) > 0 && (
              <p className="mt-2 text-[12px] leading-5 text-slate-400">{CVE_COPY[locale].warning}</p>
            )}
            {php.cves.items.length > 0 && (
              <div className="mt-3 grid gap-2">
                {php.cves.items.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-white/[0.05] bg-black/15 p-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a
                        href={`https://nvd.nist.gov/vuln/detail/${entry.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-[#79b4ff] hover:underline"
                      >{entry.id} ↗</a>
                      <span className="text-[11px] text-slate-300">
                        {entry.severity === "CRITICAL" ? TECH_UI[locale].critical : entry.severity === "HIGH" ? TECH_UI[locale].high : entry.severity === "MEDIUM" ? TECH_UI[locale].medium : entry.severity === "LOW" ? TECH_UI[locale].low : TECH_UI[locale].unknown}{entry.score !== null ? ` · ${CVE_COPY[locale].label} ${entry.score.toFixed(1)}/10` : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-300">{TECH_UI[locale].candidate}</p>
                    {entry.summary && <details className="mt-2"><summary className="cursor-pointer text-[11px] text-[#79b4ff]">{TECH_UI[locale].original}</summary><p lang="en" className="mt-2 text-[11px] leading-5 text-slate-400">{entry.summary}</p></details>}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[11px] leading-5 text-slate-400">{CVE_COPY[locale].owner}</p>
          </>
        )}
      </div>

      {findings.length > 0 && (
        <div className="mt-4 grid gap-2.5">
          {findings.map((item) => {
            const itemCopy = t.findings[item.id];
            return (
              <div key={item.id} className="rounded-xl border border-white/[0.06] bg-black/10 p-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.severity === "attention" ? "bg-amber-400" : "bg-sky-400"}`} />
                  <h3 className="text-[12px] font-semibold text-white">{itemCopy.title}{item.count ? ` (${item.count})` : ""}</h3>
                </div>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-400">{itemCopy.description}</p>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-300">{itemCopy.action}</p>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-[12px] leading-5 text-slate-400">{t.disclaimer}</p>
      <a
        href={locale === "es" ? "/seguridad-php" : `/${locale}/seguridad-php`}
        className="mt-4 inline-flex rounded-[12px] bg-[#1a73e8] px-4 py-2.5 text-[12px] font-semibold text-white"
      >
        {t.source} →
      </a>
      </section>
    </details>
  );
}
