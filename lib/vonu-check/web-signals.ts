import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { SupportedLocale, WebCheckResult, WebCheckSignal } from "./types";

const MAX_REDIRECTS = 4;
const MAX_HTML_BYTES = 400_000;
const FETCH_TIMEOUT_MS = 8_000;

const signalCopy: Record<SupportedLocale, Record<string, [string, string]>> = {
  es: {
    https: ["Conexión HTTPS", "La URL final utiliza HTTPS. Esto cifra la conexión, aunque por sí solo no demuestra que la web sea legítima."],
    noHttps: ["Sin HTTPS", "La URL final no utiliza HTTPS. No introduzcas contraseñas, tarjetas ni datos sensibles."],
    status: ["Respuesta de la web", "La web respondió correctamente a la comprobación."],
    protected: ["Acceso protegido por el servidor", "El servidor ha limitado la comprobación automatizada. Esto es habitual en bancos y servicios con protección anti-bot y no es una señal de fraude por sí sola."],
    badStatus: ["Respuesta HTTP no estándar", "La web devolvió un estado HTTP distinto del habitual. Esto describe cómo respondió el servidor, pero por sí solo no indica fraude."],
    redirects: ["Varias redirecciones", "La URL pasa por varias redirecciones antes de llegar al destino final."],
    password: ["Formulario de contraseña", "La página contiene un campo de contraseña. Comprueba muy bien el dominio antes de introducir credenciales."],
    externalForm: ["Formulario envía datos a otro dominio", "Se ha detectado al menos un formulario cuyo destino está en un dominio diferente."],
    legal: ["Información legal detectada", "Se han encontrado términos habituales de información legal, condiciones o privacidad."],
    noLegal: ["Información legal no detectada", "En la página analizada no hemos localizado términos habituales de aviso legal, condiciones o privacidad."],
    contact: ["Información de contacto detectada", "Se han encontrado señales de una sección o información de contacto."],
    noContact: ["Contacto no detectado", "En la página analizada no hemos localizado señales claras de contacto."],
    payment: ["Métodos de pago de mayor precaución", "La página menciona transferencia, criptomonedas, Bizum u otros términos que conviene revisar en contexto."],
    punycode: ["Dominio internacional codificado", "El dominio utiliza Punycode. Puede ser legítimo, pero conviene comprobar que no imite visualmente a otra marca."],
    hyphens: ["Dominio con muchos guiones", "El nombre del dominio contiene varios guiones. Es una señal débil, pero merece una comprobación adicional."],
  },
  en: {
    https: ["HTTPS connection", "The final URL uses HTTPS. This encrypts the connection, but does not by itself prove the site is legitimate."],
    noHttps: ["No HTTPS", "The final URL does not use HTTPS. Do not enter passwords, card details or sensitive data."],
    status: ["Website response", "The website responded normally to the check."],
    protected: ["Server-protected access", "The server limited the automated check. This is common on banks and anti-bot protected services and is not, by itself, a fraud signal."],
    badStatus: ["Non-standard HTTP response", "The website returned a different HTTP status than usual. This describes the server response but does not by itself indicate fraud."],
    redirects: ["Multiple redirects", "The URL goes through several redirects before reaching the final destination."],
    password: ["Password form", "The page contains a password field. Verify the domain carefully before entering credentials."],
    externalForm: ["Form sends data to another domain", "At least one form appears to submit data to a different domain."],
    legal: ["Legal information detected", "Common legal, terms or privacy wording was detected."],
    noLegal: ["Legal information not detected", "We did not find common legal, terms or privacy wording on the analysed page."],
    contact: ["Contact information detected", "Signals of a contact section or contact information were found."],
    noContact: ["Contact information not detected", "We did not find clear contact signals on the analysed page."],
    payment: ["Payment terms needing caution", "The page mentions bank transfer, crypto or other payment wording that should be reviewed in context."],
    punycode: ["Encoded international domain", "The domain uses Punycode. It may be legitimate, but check that it is not visually imitating another brand."],
    hyphens: ["Domain with many hyphens", "The domain name contains several hyphens. This is a weak signal, but worth an additional check."],
  },
  fr: {
    https: ["Connexion HTTPS", "L’URL finale utilise HTTPS. La connexion est chiffrée, mais cela ne prouve pas à lui seul que le site est légitime."],
    noHttps: ["Pas de HTTPS", "L’URL finale n’utilise pas HTTPS. N’entrez pas de mot de passe, carte ou donnée sensible."],
    status: ["Réponse du site", "Le site a répondu normalement à la vérification."],
    protected: ["Accès protégé par le serveur", "Le serveur a limité la vérification automatisée. C’est fréquent pour les banques et les services anti-bot et ce n’est pas, à lui seul, un signal de fraude."],
    badStatus: ["Réponse HTTP non standard", "Le site a renvoyé un statut HTTP différent de l’habituel. Cela décrit la réponse du serveur mais n’indique pas, à lui seul, une fraude."],
    redirects: ["Plusieurs redirections", "L’URL passe par plusieurs redirections avant la destination finale."],
    password: ["Formulaire de mot de passe", "La page contient un champ de mot de passe. Vérifiez soigneusement le domaine avant de saisir vos identifiants."],
    externalForm: ["Formulaire vers un autre domaine", "Au moins un formulaire semble envoyer des données vers un autre domaine."],
    legal: ["Informations légales détectées", "Des mentions habituelles liées aux informations légales, conditions ou confidentialité ont été trouvées."],
    noLegal: ["Informations légales non détectées", "Nous n’avons pas trouvé les mentions légales, conditions ou confidentialité habituelles sur la page analysée."],
    contact: ["Contact détecté", "Des signaux d’une section ou d’informations de contact ont été trouvés."],
    noContact: ["Contact non détecté", "Nous n’avons pas trouvé de signal clair de contact sur la page analysée."],
    payment: ["Moyens de paiement à vérifier", "La page mentionne virement, crypto ou d’autres termes de paiement à examiner dans leur contexte."],
    punycode: ["Domaine international encodé", "Le domaine utilise Punycode. Il peut être légitime, mais vérifiez qu’il n’imite pas visuellement une autre marque."],
    hyphens: ["Domaine avec plusieurs tirets", "Le nom de domaine contient plusieurs tirets. C’est un signal faible, mais qui mérite une vérification supplémentaire."],
  },
  de: {
    https: ["HTTPS-Verbindung", "Die endgültige URL verwendet HTTPS. Das verschlüsselt die Verbindung, beweist aber allein nicht die Seriosität der Website."],
    noHttps: ["Kein HTTPS", "Die endgültige URL verwendet kein HTTPS. Gib keine Passwörter, Kartendaten oder sensiblen Daten ein."],
    status: ["Antwort der Website", "Die Website hat normal auf die Prüfung reagiert."],
    protected: ["Servergeschützter Zugriff", "Der Server hat die automatisierte Prüfung begrenzt. Das ist bei Banken und Anti-Bot-geschützten Diensten üblich und allein kein Betrugssignal."],
    badStatus: ["Nicht standardmäßige HTTP-Antwort", "Die Website hat einen anderen HTTP-Status als üblich zurückgegeben. Das beschreibt die Serverantwort, weist aber allein nicht auf Betrug hin."],
    redirects: ["Mehrere Weiterleitungen", "Die URL durchläuft mehrere Weiterleitungen bis zum endgültigen Ziel."],
    password: ["Passwortformular", "Die Seite enthält ein Passwortfeld. Prüfe die Domain sorgfältig, bevor du Zugangsdaten eingibst."],
    externalForm: ["Formular sendet an andere Domain", "Mindestens ein Formular scheint Daten an eine andere Domain zu senden."],
    legal: ["Rechtliche Informationen erkannt", "Typische Hinweise zu Impressum, Bedingungen oder Datenschutz wurden erkannt."],
    noLegal: ["Rechtliche Informationen nicht erkannt", "Auf der analysierten Seite wurden keine typischen Hinweise zu Impressum, Bedingungen oder Datenschutz gefunden."],
    contact: ["Kontaktinformationen erkannt", "Hinweise auf einen Kontaktbereich oder Kontaktinformationen wurden gefunden."],
    noContact: ["Kontakt nicht erkannt", "Auf der analysierten Seite wurden keine klaren Kontakthinweise gefunden."],
    payment: ["Zahlungsbegriffe mit Vorsichtsbedarf", "Die Seite erwähnt Überweisung, Krypto oder andere Zahlungsbegriffe, die im Kontext geprüft werden sollten."],
    punycode: ["Kodierte internationale Domain", "Die Domain verwendet Punycode. Das kann legitim sein, sollte aber auf visuelle Markenimitation geprüft werden."],
    hyphens: ["Domain mit vielen Bindestrichen", "Der Domainname enthält mehrere Bindestriche. Das ist ein schwaches Signal, aber eine zusätzliche Prüfung wert."],
  },
  ar: {
    https: ["اتصال HTTPS", "يستخدم الرابط النهائي HTTPS. هذا يشفر الاتصال لكنه لا يثبت وحده أن الموقع شرعي."],
    noHttps: ["بدون HTTPS", "الرابط النهائي لا يستخدم HTTPS. لا تدخل كلمات مرور أو بيانات بطاقة أو معلومات حساسة."],
    status: ["استجابة الموقع", "استجاب الموقع بشكل طبيعي للفحص."],
    protected: ["وصول محمي من الخادم", "قيّد الخادم الفحص الآلي. هذا شائع لدى البنوك والخدمات المحمية ضد الروبوتات ولا يعد وحده إشارة احتيال."],
    badStatus: ["استجابة HTTP غير قياسية", "أعاد الموقع حالة HTTP مختلفة عن المعتاد. هذا يصف استجابة الخادم ولا يدل وحده على الاحتيال."],
    redirects: ["عمليات إعادة توجيه متعددة", "يمر الرابط بعدة عمليات إعادة توجيه قبل الوصول إلى الوجهة النهائية."],
    password: ["نموذج كلمة مرور", "تحتوي الصفحة على حقل كلمة مرور. تحقق من النطاق بعناية قبل إدخال بيانات الدخول."],
    externalForm: ["نموذج يرسل البيانات إلى نطاق آخر", "يبدو أن نموذجًا واحدًا على الأقل يرسل البيانات إلى نطاق مختلف."],
    legal: ["تم رصد معلومات قانونية", "تم العثور على عبارات معتادة للشروط أو الخصوصية أو المعلومات القانونية."],
    noLegal: ["لم يتم رصد معلومات قانونية", "لم نعثر في الصفحة على عبارات معتادة للشروط أو الخصوصية أو المعلومات القانونية."],
    contact: ["تم رصد معلومات اتصال", "تم العثور على مؤشرات لقسم أو معلومات اتصال."],
    noContact: ["لم يتم رصد معلومات اتصال", "لم نعثر على مؤشرات واضحة لمعلومات اتصال في الصفحة."],
    payment: ["مصطلحات دفع تستحق الحذر", "تذكر الصفحة التحويل البنكي أو العملات المشفرة أو مصطلحات دفع أخرى ينبغي مراجعتها في سياقها."],
    punycode: ["نطاق دولي مُرمّز", "يستخدم النطاق Punycode. قد يكون مشروعًا، لكن ينبغي التأكد من أنه لا يقلد علامة أخرى بصريًا."],
    hyphens: ["نطاق يحتوي على شرطات كثيرة", "يحتوي اسم النطاق على عدة شرطات. هذه إشارة ضعيفة لكنها تستحق فحصًا إضافيًا."],
  },
};

function signal(locale: SupportedLocale, id: string, tone: WebCheckSignal["tone"], weight: number, detailSuffix = ""): WebCheckSignal {
  const [title, baseDetail] = signalCopy[locale][id];
  return { id, tone, weight, title, detail: `${baseDetail}${detailSuffix}` };
}

function normalizeInput(input: string): URL {
  const value = input.trim();
  if (!value) throw new Error("empty_url");
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("unsupported_protocol");
  if (url.username || url.password) throw new Error("credentials_not_allowed");
  return url;
}

function isPrivateIpv4(address: string): boolean {
  const p = address.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string): boolean {
  const v = address.toLowerCase();
  if (v === '::' || v === '::1') return true;
  if (v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')) return true;
  if (v.startsWith('ff') || v.startsWith('2001:db8:')) return true;
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? isPrivateIpv4(mapped[1]) : false;
}

async function assertPublicHostname(hostname: string) {
  const literalType = isIP(hostname);
  if (literalType === 4 && isPrivateIpv4(hostname)) throw new Error("private_target");
  if (literalType === 6 && isPrivateIpv6(hostname)) throw new Error("private_target");
  if (literalType) return;

  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error("private_target");
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error("dns_not_found");
  for (const entry of addresses) {
    if ((entry.family === 4 && isPrivateIpv4(entry.address)) || (entry.family === 6 && isPrivateIpv6(entry.address))) {
      throw new Error("private_target");
    }
  }
}

async function readLimitedText(response: Response): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let output = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) {
      await reader.cancel();
      break;
    }
    output += decoder.decode(value, { stream: true });
  }
  output += decoder.decode();
  return output;
}

async function fetchPage(start: URL) {
  let current = start;
  let redirects = 0;

  while (true) {
    await assertPublicHostname(current.hostname);
    const response = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'user-agent': 'VonuCheck/0.1 (+https://vonuai.com)',
        accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return { response, finalUrl: current, redirects, html: '' };
      if (redirects >= MAX_REDIRECTS) throw new Error('too_many_redirects');
      current = new URL(location, current);
      if (!['http:', 'https:'].includes(current.protocol)) throw new Error('unsupported_redirect');
      redirects += 1;
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    const html = contentType.includes('text/html') || contentType.includes('application/xhtml+xml')
      ? await readLimitedText(response)
      : '';
    return { response, finalUrl: current, redirects, html };
  }
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, ' ').trim().slice(0, 180) : null;
}

function countMatches(html: string, regex: RegExp): number {
  return (html.match(regex) || []).length;
}

function externalFormActions(html: string, pageUrl: URL): number {
  const forms = html.match(/<form\b[\s\S]*?>/gi) || [];
  let external = 0;
  for (const form of forms) {
    const action = form.match(/\baction\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!action || action.startsWith('#') || action.toLowerCase().startsWith('javascript:')) continue;
    try {
      const target = new URL(action, pageUrl);
      if (target.hostname && target.hostname !== pageUrl.hostname) external += 1;
    } catch {
      // Ignore malformed form actions: they are not reliable enough to score.
    }
  }
  return external;
}

export async function collectWebSignals(input: string, locale: SupportedLocale): Promise<WebCheckResult> {
  const initialUrl = normalizeInput(input);
  const { response, finalUrl, redirects, html } = await fetchPage(initialUrl);
  const lower = html.toLowerCase();
  const usesHttps = finalUrl.protocol === 'https:';
  const formCount = countMatches(html, /<form\b/gi);
  const hasPasswordField = /<input\b[^>]*type\s*=\s*["']?password\b/i.test(html);
  const extForms = externalFormActions(html, finalUrl);
  const legalTextDetected = /(aviso legal|legal notice|mentions légales|impressum|terms (of|and) conditions|términos y condiciones|conditions générales|datenschutz|privacy policy|política de privacidad|سياسة الخصوصية)/i.test(lower);
  const contactTextDetected = /(contacto|contact us|contactez|kontakt|contáctanos|customer service|service client|kundenservice|اتصل بنا|تواصل معنا)/i.test(lower);
  const paymentRiskTextDetected = /(bank transfer|wire transfer|transferencia bancaria|virement bancaire|überweisung|bitcoin|cryptocurrency|crypto|criptomoneda|kryptowährung|bizum|عملة مشفرة|تحويل بنكي)/i.test(lower);
  const accessProtected = [401, 403, 429].includes(response.status);
  const contentInspectable = html.trim().length > 0;

  const signals: WebCheckSignal[] = [];
  let score = 0;

  if (usesHttps) signals.push(signal(locale, 'https', 'positive', 0));
  else { signals.push(signal(locale, 'noHttps', 'negative', 30)); score += 30; }

  if (response.status >= 200 && response.status < 400) {
    signals.push(signal(locale, 'status', 'positive', 0, ` (${response.status})`));
  } else if (accessProtected) {
    signals.push(signal(locale, 'protected', 'neutral', 0, ` (${response.status})`));
  } else {
    signals.push(signal(locale, 'badStatus', 'neutral', 0, ` (${response.status})`));
  }

  if (redirects >= 3) { signals.push(signal(locale, 'redirects', 'warning', 6, ` (${redirects})`)); score += 6; }
  if (hasPasswordField) { signals.push(signal(locale, 'password', 'neutral', 4)); score += usesHttps ? 4 : 12; }
  if (extForms > 0) { signals.push(signal(locale, 'externalForm', 'warning', 16, ` (${extForms})`)); score += 16; }

  // Only infer absence of legal/contact information when the page body was actually inspectable.
  if (contentInspectable) {
    if (legalTextDetected) signals.push(signal(locale, 'legal', 'positive', 0));
    else { signals.push(signal(locale, 'noLegal', 'warning', 8)); score += 8; }

    if (contactTextDetected) signals.push(signal(locale, 'contact', 'positive', 0));
    else { signals.push(signal(locale, 'noContact', 'warning', 5)); score += 5; }

    if (paymentRiskTextDetected) { signals.push(signal(locale, 'payment', 'warning', 7)); score += 7; }
  }

  if (finalUrl.hostname.includes('xn--')) { signals.push(signal(locale, 'punycode', 'warning', 7)); score += 7; }
  const hyphenCount = (finalUrl.hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) { signals.push(signal(locale, 'hyphens', 'warning', 5, ` (${hyphenCount})`)); score += 5; }

  score = Math.max(0, Math.min(100, score));
  const level = accessProtected && score < 20
    ? 'unknown'
    : score >= 45
      ? 'high'
      : score >= 20
        ? 'caution'
        : 'low';

  const limitations = [
    'technical-signals-only',
    'no-reputation-layer-yet',
    'no-business-identity-layer-yet',
    'no-domain-age-layer-yet',
  ];
  if (!contentInspectable) limitations.unshift('page-content-not-inspectable');

  return {
    version: 'vonu-check-v1',
    checkedAt: new Date().toISOString(),
    locale,
    risk: { level, score, confidence: 'limited' },
    facts: {
      hostname: finalUrl.hostname,
      normalizedUrl: initialUrl.toString(),
      finalUrl: finalUrl.toString(),
      httpStatus: response.status,
      redirects,
      usesHttps,
      title: extractTitle(html),
      hasPasswordField,
      formCount,
      externalFormActions: extForms,
      legalTextDetected,
      contactTextDetected,
      paymentRiskTextDetected,
    },
    signals,
    limitations,
  };
}
