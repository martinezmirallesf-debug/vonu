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
    review: "Se han observado señales técnicas que requieren revisión",
    improvements: "Hay configuraciones que podrían mejorarse",
    noIssues: "Sin problemas destacados en las comprobaciones disponibles",
    partial: "Evaluación técnica parcial",
    disclaimer: "No podemos verificar cómo se guardan los datos, el control de acceso, las bases de datos ni las vulnerabilidades internas. La ausencia de alertas no demuestra que la web sea segura.",
    observed: "Detectada",
    notObserved: "No observada",
    notVerified: "No verificable",
    php: "Tecnología PHP",
    noPhp: "Sin indicios públicos en esta respuesta",
    phpUnknown: "Hay indicios de PHP; versión no identificada",
    phpDetected: "Versión declarada por el servidor",
    supported: "soporte activo",
    securityOnly: "solo actualizaciones de seguridad",
    unsupported: "fuera de soporte",
    supportUnknown: "soporte no determinado",
    cookies: "Cookies de esta respuesta",
    cookiesNone: "Ninguna observada",
    cookiesObserved: "observadas",
    source: "Soporte de versiones PHP",
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
    observed: "Observed", notObserved: "Not observed", notVerified: "Not verifiable",
    php: "PHP technology", noPhp: "No public indicators in this response", phpUnknown: "PHP indicators found; version unknown", phpDetected: "Server-reported version",
    supported: "active support", securityOnly: "security fixes only", unsupported: "out of support", supportUnknown: "support unknown",
    cookies: "Cookies in this response", cookiesNone: "None observed", cookiesObserved: "observed",
    source: "PHP version support", sourceUrl: "https://www.php.net/supported-versions.php",
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
    observed: "Observé", notObserved: "Non observé", notVerified: "Non vérifiable",
    php: "Technologie PHP", noPhp: "Aucun indice public dans cette réponse", phpUnknown: "Indices PHP détectés ; version inconnue", phpDetected: "Version déclarée par le serveur",
    supported: "support actif", securityOnly: "correctifs de sécurité seuls", unsupported: "hors support", supportUnknown: "support inconnu",
    cookies: "Cookies de cette réponse", cookiesNone: "Aucun observé", cookiesObserved: "observés",
    source: "Versions PHP prises en charge", sourceUrl: "https://www.php.net/supported-versions.php",
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
    observed: "Erkannt", notObserved: "Nicht beobachtet", notVerified: "Nicht prüfbar",
    php: "PHP-Technologie", noPhp: "Keine öffentlichen Hinweise in dieser Antwort", phpUnknown: "PHP-Hinweise erkannt; Version unbekannt", phpDetected: "Vom Server gemeldete Version",
    supported: "aktiver Support", securityOnly: "nur Sicherheitsupdates", unsupported: "ohne Support", supportUnknown: "Support unbekannt",
    cookies: "Cookies in dieser Antwort", cookiesNone: "Keine beobachtet", cookiesObserved: "beobachtet",
    source: "PHP-Versionssupport", sourceUrl: "https://www.php.net/supported-versions.php",
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
    observed: "مرصود", notObserved: "غير مرصود", notVerified: "غير قابل للتحقق",
    php: "تقنية PHP", noPhp: "لا توجد مؤشرات عامة في هذه الاستجابة", phpUnknown: "مؤشرات PHP موجودة، والإصدار غير معروف", phpDetected: "الإصدار المعلن من الخادم",
    supported: "دعم نشط", securityOnly: "تصحيحات أمنية فقط", unsupported: "خارج الدعم", supportUnknown: "الدعم غير معروف",
    cookies: "ملفات تعريف الارتباط في هذه الاستجابة", cookiesNone: "لم يُرصد شيء", cookiesObserved: "مرصودة",
    source: "دعم إصدارات PHP", sourceUrl: "https://www.php.net/supported-versions.php",
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
    <section className="min-w-0 rounded-[24px] bg-[#141927]/86 p-5 ring-1 ring-white/[0.08]">
      <h2 className="text-[17px] font-bold text-white">{t.title}</h2>
      <p className="mt-2 text-[12px] leading-5 text-slate-400">{t.subtitle}</p>
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
  );
}
