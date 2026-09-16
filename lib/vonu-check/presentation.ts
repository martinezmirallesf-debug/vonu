import type { SupportedLocale, WebCheckSignal } from "./types";

type FriendlySignalCopy = Record<string, [string, string]>;

const copy: Record<SupportedLocale, FriendlySignalCopy> = {
  es: {
    https: ["La conexión está cifrada", "La web usa una conexión segura. Es una buena señal, aunque por sí sola no garantiza que la página sea legítima."],
    noHttps: ["La conexión no es segura", "La web no cifra la conexión. No introduzcas contraseñas, datos bancarios ni información sensible."],
    status: ["La web responde con normalidad", "La página ha respondido correctamente a nuestras comprobaciones."],
    protected: ["La web limita las comprobaciones automáticas", "Algunas webs, especialmente bancos y servicios grandes, bloquean parte de los análisis automáticos. Esto no significa que sea una estafa."],
    badStatus: ["La web ha respondido de forma poco habitual", "La página no ha respondido como suele hacerlo una web normal. Esto puede tener muchas causas y no significa por sí solo que sea fraudulenta."],
    redirects: ["El enlace cambia de dirección varias veces", "Antes de llegar a la página final, el enlace pasa por varios destinos. Conviene comprobar que la página final sea la que esperabas."],
    password: ["La página pide una contraseña", "Antes de escribir tus credenciales, comprueba que estás realmente en la web oficial."],
    externalForm: ["Un formulario enviaría tus datos a otra web", "Hemos detectado un formulario que parece enviar la información a una dirección diferente. Revisa bien dónde estás antes de introducir datos."],
    legal: ["Hay información legal visible", "La página incluye apartados habituales como condiciones, privacidad o información legal."],
    noLegal: ["No vemos información legal clara", "En la parte de la web que hemos podido revisar no aparece información legal, condiciones o privacidad de forma clara."],
    contact: ["Hay información de contacto", "La web muestra algún medio de contacto o una sección para contactar."],
    noContact: ["No vemos un contacto claro", "En la parte analizada no hemos encontrado una forma clara de contactar con la empresa o responsable."],
    payment: ["Aparecen formas de pago que requieren más cuidado", "La web menciona transferencia, criptomonedas, Bizum u otras formas de pago que conviene revisar especialmente antes de enviar dinero."],
    punycode: ["El nombre de la web usa caracteres poco habituales", "El dominio está codificado de una forma que puede ser completamente legítima, pero también puede utilizarse para imitar visualmente el nombre de otra marca."],
    hyphens: ["El nombre de la web tiene muchos guiones", "No es una prueba de fraude, pero es un detalle que merece una comprobación adicional."],
    "infra-hsts": ["La web obliga a usar conexión segura", "El servidor está configurado para mantener la navegación cifrada en navegadores compatibles. Es una señal positiva de seguridad técnica."],
    "infra-csp": ["La web limita qué contenido puede ejecutarse", "Tiene una protección que restringe qué recursos y scripts puede cargar la página. Es una señal positiva de configuración."],
    "infra-caa": ["El dominio protege mejor sus certificados", "El dominio limita qué entidades pueden emitir certificados de seguridad para él. Es una señal positiva, aunque no demuestra quién está detrás de la web."],
    "infra-dns": ["La infraestructura parece estable", "La web utiliza varios servidores para gestionar su dominio. Esto suele ser una señal de infraestructura estable, aunque no garantiza legitimidad."],
    "infra-securityTxt": ["La web publica un canal para avisos de seguridad", "Existe una vía técnica para comunicar vulnerabilidades. Es una señal positiva de madurez en seguridad."],
    "reputation-urlhaus-match": ["El enlace aparece en una lista conocida de malware", "Este enlace coincide con una base externa que registra direcciones usadas para distribuir software malicioso. Es una señal de riesgo muy importante."],
    "reputation-urlhaus-clear": ["No aparece en esa lista conocida de malware", "No hemos encontrado este enlace en esa base concreta. Esto es positivo, pero no descarta phishing, fraude, suplantación ni amenazas nuevas."],
    "domain-age-very-new": ["La web se registró hace muy poco", "El dominio tiene menos de 30 días. Puede ser legítimo, pero conviene extremar la precaución si pide pagos, contraseñas o datos personales."],
    "domain-age-new": ["La web es relativamente nueva", "El dominio tiene menos de 90 días. No es una prueba de fraude, pero es un dato que conviene valorar junto al resto de señales."],
    "domain-age-established": ["La web lleva tiempo registrada", "El dominio lleva más de un año registrado. Es una señal positiva de contexto, aunque no garantiza que la web sea legítima."],
  },
  en: {
    https: ["The connection is encrypted", "The site uses a secure connection. That is positive, but it does not by itself prove the site is legitimate."],
    noHttps: ["The connection is not secure", "The site does not encrypt the connection. Do not enter passwords, banking details or sensitive information."],
    status: ["The website responds normally", "The page responded correctly to our checks."],
    protected: ["The website limits automated checks", "Some sites, especially banks and large services, block part of automated analysis. This does not mean the site is a scam."],
    badStatus: ["The website responded unusually", "The page did not respond in the usual way. This can have many causes and does not by itself mean the site is fraudulent."],
    redirects: ["The link changes direction several times", "The link passes through several destinations before reaching the final page. Check that the final page is the one you expected."],
    password: ["The page asks for a password", "Before entering credentials, make sure you are really on the official website."],
    externalForm: ["A form would send your data to another site", "We found a form that appears to send information to a different address. Check carefully before entering personal data."],
    legal: ["Legal information is visible", "The page includes common sections such as terms, privacy or legal information."],
    noLegal: ["We do not see clear legal information", "In the part of the site we could review, legal, terms or privacy information was not clearly visible."],
    contact: ["Contact information is visible", "The site shows a way to contact the company or responsible party."],
    noContact: ["We do not see clear contact details", "In the analysed content, we could not find a clear way to contact the company or responsible party."],
    payment: ["Some payment methods deserve extra caution", "The site mentions bank transfer, crypto or other payment methods that should be checked carefully before sending money."],
    punycode: ["The website name uses unusual characters", "The domain is encoded in a way that can be legitimate, but can also be used to visually imitate another brand."],
    hyphens: ["The website name contains many hyphens", "This is not proof of fraud, but it is worth an extra check."],
    "infra-hsts": ["The site forces a secure connection", "The server is configured to keep browsing encrypted in compatible browsers. This is a positive security sign."],
    "infra-csp": ["The site limits what content can run", "It has a protection that restricts which resources and scripts can load. This is a positive configuration sign."],
    "infra-caa": ["The domain better protects its certificates", "The domain limits which authorities can issue security certificates for it. This is positive, but it does not prove who controls the site."],
    "infra-dns": ["The infrastructure looks stable", "The site uses several servers to manage its domain. This often suggests stable infrastructure, but does not guarantee legitimacy."],
    "infra-securityTxt": ["The site publishes a security contact", "There is a technical channel for reporting vulnerabilities. This is a positive sign of security maturity."],
    "reputation-urlhaus-match": ["The link appears on a known malware list", "This link matches an external database of addresses used to distribute malicious software. This is a strong risk signal."],
    "reputation-urlhaus-clear": ["The link is not on that known malware list", "We did not find the link in that specific database. This is positive, but does not rule out phishing, fraud, impersonation or new threats."],
    "domain-age-very-new": ["The site was registered very recently", "The domain is less than 30 days old. It may be legitimate, but extra caution is sensible if it asks for money, passwords or personal data."],
    "domain-age-new": ["The site is relatively new", "The domain is less than 90 days old. This is not proof of fraud, but it is useful context alongside the other signals."],
    "domain-age-established": ["The site has been registered for some time", "The domain has been registered for more than a year. This is positive context, but it does not guarantee legitimacy."],
  },
  fr: {
    https: ["La connexion est chiffrée", "Le site utilise une connexion sécurisée. C’est positif, mais cela ne prouve pas à lui seul que le site est légitime."],
    noHttps: ["La connexion n’est pas sécurisée", "Le site ne chiffre pas la connexion. N’entrez pas de mot de passe, coordonnées bancaires ou données sensibles."],
    status: ["Le site répond normalement", "La page a répondu correctement à nos vérifications."],
    protected: ["Le site limite les vérifications automatiques", "Certains sites, notamment les banques et grands services, bloquent une partie des analyses automatiques. Cela ne signifie pas qu’il s’agit d’une arnaque."],
    badStatus: ["Le site a répondu de façon inhabituelle", "La page n’a pas répondu comme d’habitude. Cela peut avoir de nombreuses causes et ne signifie pas, à lui seul, qu’elle est frauduleuse."],
    redirects: ["Le lien change plusieurs fois de destination", "Le lien passe par plusieurs adresses avant la page finale. Vérifiez que la destination finale est bien celle attendue."],
    password: ["La page demande un mot de passe", "Avant de saisir vos identifiants, vérifiez que vous êtes bien sur le site officiel."],
    externalForm: ["Un formulaire enverrait vos données vers un autre site", "Nous avons détecté un formulaire qui semble envoyer les informations vers une autre adresse. Vérifiez avant de saisir des données."],
    legal: ["Des informations légales sont visibles", "La page contient des sections habituelles comme les conditions, la confidentialité ou les mentions légales."],
    noLegal: ["Nous ne voyons pas d’informations légales claires", "Dans la partie du site analysée, nous n’avons pas trouvé clairement de mentions légales, conditions ou politique de confidentialité."],
    contact: ["Des coordonnées de contact sont visibles", "Le site affiche un moyen de contacter l’entreprise ou son responsable."],
    noContact: ["Nous ne voyons pas de contact clair", "Dans le contenu analysé, nous n’avons pas trouvé de moyen clair de contacter l’entreprise ou son responsable."],
    payment: ["Certains moyens de paiement demandent plus de prudence", "Le site mentionne virement, crypto ou d’autres moyens de paiement à vérifier attentivement avant d’envoyer de l’argent."],
    punycode: ["Le nom du site utilise des caractères inhabituels", "Le domaine est encodé d’une manière qui peut être légitime, mais qui peut aussi servir à imiter visuellement une autre marque."],
    hyphens: ["Le nom du site contient beaucoup de tirets", "Ce n’est pas une preuve de fraude, mais cela mérite une vérification supplémentaire."],
    "reputation-urlhaus-match": ["Le lien apparaît dans une liste connue de logiciels malveillants", "Ce lien correspond à une base externe recensant des adresses utilisées pour diffuser des logiciels malveillants. C’est un signal de risque important."],
    "reputation-urlhaus-clear": ["Le lien n’apparaît pas dans cette liste connue", "Nous n’avons pas trouvé ce lien dans cette base précise. C’est positif, mais cela n’exclut pas phishing, fraude, usurpation ou menace récente."],
    "domain-age-very-new": ["Le site a été enregistré très récemment", "Le domaine a moins de 30 jours. Il peut être légitime, mais il faut redoubler de prudence s’il demande un paiement, un mot de passe ou des données personnelles."],
    "domain-age-new": ["Le site est relativement récent", "Le domaine a moins de 90 jours. Ce n’est pas une preuve de fraude, mais c’est un élément à considérer avec les autres signaux."],
    "domain-age-established": ["Le site est enregistré depuis un certain temps", "Le domaine est enregistré depuis plus d’un an. C’est un contexte positif, sans garantie de légitimité."],
  },
  de: {
    https: ["Die Verbindung ist verschlüsselt", "Die Website nutzt eine sichere Verbindung. Das ist positiv, beweist aber allein nicht, dass die Seite seriös ist."],
    noHttps: ["Die Verbindung ist nicht sicher", "Die Website verschlüsselt die Verbindung nicht. Gib keine Passwörter, Bankdaten oder sensiblen Informationen ein."],
    status: ["Die Website antwortet normal", "Die Seite hat korrekt auf unsere Prüfung reagiert."],
    protected: ["Die Website begrenzt automatische Prüfungen", "Einige Seiten, besonders Banken und große Dienste, blockieren Teile automatischer Analysen. Das bedeutet nicht, dass die Seite betrügerisch ist."],
    badStatus: ["Die Website hat ungewöhnlich geantwortet", "Die Seite hat nicht wie üblich reagiert. Das kann viele Ursachen haben und bedeutet allein nicht, dass sie betrügerisch ist."],
    redirects: ["Der Link wechselt mehrfach das Ziel", "Der Link führt über mehrere Adressen zur endgültigen Seite. Prüfe, ob das Endziel wirklich erwartet war."],
    password: ["Die Seite fragt nach einem Passwort", "Prüfe vor der Eingabe deiner Zugangsdaten, ob du wirklich auf der offiziellen Website bist."],
    externalForm: ["Ein Formular würde Daten an eine andere Website senden", "Wir haben ein Formular gefunden, das Informationen offenbar an eine andere Adresse sendet. Prüfe das vor der Eingabe persönlicher Daten."],
    legal: ["Rechtliche Informationen sind sichtbar", "Die Seite enthält übliche Bereiche wie Bedingungen, Datenschutz oder rechtliche Hinweise."],
    noLegal: ["Wir sehen keine klaren rechtlichen Informationen", "Im geprüften Bereich der Website waren rechtliche Hinweise, Bedingungen oder Datenschutzinformationen nicht klar zu finden."],
    contact: ["Kontaktinformationen sind sichtbar", "Die Website zeigt eine Möglichkeit, das Unternehmen oder die verantwortliche Stelle zu kontaktieren."],
    noContact: ["Wir sehen keinen klaren Kontakt", "Im analysierten Inhalt konnten wir keine klare Kontaktmöglichkeit finden."],
    payment: ["Einige Zahlungsarten erfordern besondere Vorsicht", "Die Website erwähnt Überweisung, Krypto oder andere Zahlungsarten, die vor einer Zahlung sorgfältig geprüft werden sollten."],
    punycode: ["Der Website-Name nutzt ungewöhnliche Zeichen", "Die Domain ist so kodiert, dass sie legitim sein kann, aber auch zur optischen Nachahmung einer Marke verwendet werden kann."],
    hyphens: ["Der Website-Name enthält viele Bindestriche", "Das ist kein Betrugsbeweis, aber eine zusätzliche Prüfung ist sinnvoll."],
    "reputation-urlhaus-match": ["Der Link erscheint auf einer bekannten Malware-Liste", "Dieser Link stimmt mit einer externen Datenbank für Adressen überein, die Schadsoftware verbreiten. Das ist ein starkes Risikosignal."],
    "reputation-urlhaus-clear": ["Der Link steht nicht auf dieser bekannten Malware-Liste", "Wir haben den Link in dieser konkreten Datenbank nicht gefunden. Das ist positiv, schließt Phishing, Betrug, Identitätsmissbrauch oder neue Bedrohungen aber nicht aus."],
    "domain-age-very-new": ["Die Website wurde erst vor Kurzem registriert", "Die Domain ist jünger als 30 Tage. Sie kann legitim sein, aber bei Zahlungen, Passwörtern oder persönlichen Daten ist besondere Vorsicht sinnvoll."],
    "domain-age-new": ["Die Website ist relativ neu", "Die Domain ist jünger als 90 Tage. Das beweist keinen Betrug, ist aber nützlicher Kontext zusammen mit den anderen Signalen."],
    "domain-age-established": ["Die Website ist schon länger registriert", "Die Domain ist seit mehr als einem Jahr registriert. Das ist positiver Kontext, garantiert aber keine Seriosität."],
  },
  ar: {
    https: ["الاتصال مشفّر", "يستخدم الموقع اتصالاً آمناً. هذه إشارة إيجابية لكنها لا تثبت وحدها أن الموقع شرعي."],
    noHttps: ["الاتصال غير آمن", "لا يشفّر الموقع الاتصال. لا تدخل كلمات المرور أو البيانات البنكية أو المعلومات الحساسة."],
    status: ["الموقع يستجيب بشكل طبيعي", "استجابت الصفحة بشكل صحيح للفحوصات."],
    protected: ["الموقع يحد من الفحوصات الآلية", "بعض المواقع، خصوصاً البنوك والخدمات الكبيرة، تمنع جزءاً من التحليل الآلي. هذا لا يعني أن الموقع احتيالي."],
    badStatus: ["استجاب الموقع بطريقة غير معتادة", "لم تستجب الصفحة بالطريقة المعتادة. قد تكون هناك أسباب كثيرة، ولا يعني ذلك وحده أنها احتيالية."],
    redirects: ["الرابط يغيّر وجهته عدة مرات", "يمر الرابط بعدة عناوين قبل الوصول إلى الصفحة النهائية. تحقق من أن الوجهة النهائية هي التي كنت تتوقعها."],
    password: ["الصفحة تطلب كلمة مرور", "قبل إدخال بيانات الدخول، تأكد من أنك في الموقع الرسمي فعلاً."],
    externalForm: ["قد يرسل نموذج بياناتك إلى موقع آخر", "اكتشفنا نموذجاً يبدو أنه يرسل المعلومات إلى عنوان مختلف. تحقق جيداً قبل إدخال بيانات شخصية."],
    legal: ["توجد معلومات قانونية ظاهرة", "تحتوي الصفحة على أقسام معتادة مثل الشروط أو الخصوصية أو المعلومات القانونية."],
    noLegal: ["لا نرى معلومات قانونية واضحة", "في الجزء الذي استطعنا فحصه لم نجد معلومات قانونية أو شروطاً أو سياسة خصوصية بشكل واضح."],
    contact: ["توجد معلومات اتصال", "يعرض الموقع وسيلة للتواصل مع الشركة أو الجهة المسؤولة."],
    noContact: ["لا نرى وسيلة اتصال واضحة", "في المحتوى الذي تم تحليله لم نجد وسيلة واضحة للتواصل مع الشركة أو المسؤول."],
    payment: ["بعض طرق الدفع تستحق حذراً إضافياً", "يذكر الموقع التحويل البنكي أو العملات الرقمية أو طرق دفع أخرى ينبغي التحقق منها جيداً قبل إرسال الأموال."],
    punycode: ["اسم الموقع يستخدم أحرفاً غير معتادة", "النطاق مشفّر بطريقة قد تكون شرعية، لكنها قد تُستخدم أيضاً لتقليد اسم علامة تجارية بصرياً."],
    hyphens: ["اسم الموقع يحتوي على شرطات كثيرة", "هذا ليس دليلاً على الاحتيال، لكنه يستحق فحصاً إضافياً."],
    "reputation-urlhaus-match": ["الرابط موجود في قائمة معروفة للبرمجيات الخبيثة", "يتطابق هذا الرابط مع قاعدة خارجية لعناوين استُخدمت لنشر برامج ضارة. هذه إشارة خطر قوية."],
    "reputation-urlhaus-clear": ["الرابط غير موجود في تلك القائمة المعروفة", "لم نجد الرابط في تلك القاعدة المحددة. هذه إشارة إيجابية لكنها لا تستبعد التصيد أو الاحتيال أو الانتحال أو التهديدات الجديدة."],
    "domain-age-very-new": ["تم تسجيل الموقع حديثاً جداً", "عمر النطاق أقل من 30 يوماً. قد يكون مشروعاً، لكن الحذر الإضافي مناسب إذا طلب مالاً أو كلمات مرور أو بيانات شخصية."],
    "domain-age-new": ["الموقع جديد نسبياً", "عمر النطاق أقل من 90 يوماً. هذا ليس دليلاً على الاحتيال، لكنه معلومة مهمة مع بقية الإشارات."],
    "domain-age-established": ["الموقع مسجل منذ فترة", "النطاق مسجل منذ أكثر من عام. هذه معلومة إيجابية، لكنها لا تضمن الشرعية."],
  },
};

const limitations: Record<SupportedLocale, Record<string, string>> = {
  es: {
    "technical-signals-only": "Hemos podido comprobar aspectos técnicos y visibles de la web, pero no toda su actividad ni quién está realmente detrás.",
    "no-reputation-layer-yet": "No hemos podido contrastar esta web con todas las fuentes externas de reputación disponibles.",
    "no-business-identity-layer-yet": "No hemos podido confirmar la identidad de la empresa o persona que está detrás de la web.",
    "no-domain-age-layer-yet": "No hemos podido comprobar desde cuándo está registrado el dominio.",
    "page-content-not-inspectable": "La web bloqueó parte de la comprobación automática, así que no pudimos revisar todo su contenido.",
    "urlhaus-covers-known-malware-not-all-fraud": "La comprobación externa utilizada detecta amenazas conocidas, pero no puede descartar todas las formas de fraude, phishing o suplantación.",
  },
  en: {
    "technical-signals-only": "We could check technical and visible parts of the site, but not all of its activity or who is really behind it.",
    "no-reputation-layer-yet": "We could not cross-check this site against every available external reputation source.",
    "no-business-identity-layer-yet": "We could not confirm the identity of the company or person behind the site.",
    "no-domain-age-layer-yet": "We could not confirm how long the domain has been registered.",
    "page-content-not-inspectable": "The site blocked part of the automated check, so we could not review all of its content.",
    "urlhaus-covers-known-malware-not-all-fraud": "The external check can detect known threats, but it cannot rule out every form of fraud, phishing or impersonation.",
  },
  fr: {
    "technical-signals-only": "Nous avons pu vérifier des éléments techniques et visibles, mais pas toute l’activité du site ni l’identité réelle de la personne qui se trouve derrière.",
    "no-reputation-layer-yet": "Nous n’avons pas pu recouper ce site avec toutes les sources externes de réputation disponibles.",
    "no-business-identity-layer-yet": "Nous n’avons pas pu confirmer l’identité de l’entreprise ou de la personne derrière le site.",
    "no-domain-age-layer-yet": "Nous n’avons pas pu confirmer depuis combien de temps le domaine est enregistré.",
    "page-content-not-inspectable": "Le site a bloqué une partie de la vérification automatique, nous n’avons donc pas pu examiner tout son contenu.",
    "urlhaus-covers-known-malware-not-all-fraud": "La vérification externe peut détecter des menaces connues, mais elle ne peut pas exclure toutes les formes de fraude, phishing ou usurpation.",
  },
  de: {
    "technical-signals-only": "Wir konnten technische und sichtbare Teile der Website prüfen, aber nicht ihre gesamte Aktivität oder wer tatsächlich dahintersteht.",
    "no-reputation-layer-yet": "Wir konnten die Website nicht mit allen verfügbaren externen Reputationsquellen abgleichen.",
    "no-business-identity-layer-yet": "Wir konnten die Identität des Unternehmens oder der Person hinter der Website nicht bestätigen.",
    "no-domain-age-layer-yet": "Wir konnten nicht bestätigen, wie lange die Domain bereits registriert ist.",
    "page-content-not-inspectable": "Die Website hat einen Teil der automatischen Prüfung blockiert, daher konnten wir nicht den gesamten Inhalt prüfen.",
    "urlhaus-covers-known-malware-not-all-fraud": "Die externe Prüfung kann bekannte Bedrohungen erkennen, aber nicht jede Form von Betrug, Phishing oder Identitätsmissbrauch ausschließen.",
  },
  ar: {
    "technical-signals-only": "تمكنا من فحص الجوانب التقنية والظاهرة من الموقع، لكن ليس كل نشاطه أو هوية من يقف خلفه فعلياً.",
    "no-reputation-layer-yet": "لم نتمكن من مقارنة الموقع بكل مصادر السمعة الخارجية المتاحة.",
    "no-business-identity-layer-yet": "لم نتمكن من تأكيد هوية الشركة أو الشخص الذي يقف خلف الموقع.",
    "no-domain-age-layer-yet": "لم نتمكن من تأكيد مدة تسجيل النطاق.",
    "page-content-not-inspectable": "حجب الموقع جزءاً من الفحص الآلي، لذلك لم نتمكن من مراجعة كل المحتوى.",
    "urlhaus-covers-known-malware-not-all-fraud": "يمكن للفحص الخارجي اكتشاف تهديدات معروفة، لكنه لا يستطيع استبعاد كل أشكال الاحتيال أو التصيد أو الانتحال.",
  },
};

export function humanizeWebSignal(locale: SupportedLocale, signal: WebCheckSignal) {
  const friendly = copy[locale]?.[signal.id];
  if (!friendly) return signal;
  return { ...signal, title: friendly[0], detail: friendly[1] };
}

export function humanizeLimitation(locale: SupportedLocale, key: string) {
  return limitations[locale]?.[key] || key;
}

export function friendlyHttpStatus(locale: SupportedLocale, status: number | null) {
  if (status == null) {
    return locale === "es" ? "No disponible" : locale === "fr" ? "Indisponible" : locale === "de" ? "Nicht verfügbar" : locale === "ar" ? "غير متاح" : "Unavailable";
  }
  const ok = status >= 200 && status < 400;
  if (locale === "es") return ok ? `Correcta (${status})` : `Inusual (${status})`;
  if (locale === "fr") return ok ? `Normale (${status})` : `Inhabituelle (${status})`;
  if (locale === "de") return ok ? `Normal (${status})` : `Ungewöhnlich (${status})`;
  if (locale === "ar") return ok ? `طبيعية (${status})` : `غير معتادة (${status})`;
  return ok ? `Normal (${status})` : `Unusual (${status})`;
}
