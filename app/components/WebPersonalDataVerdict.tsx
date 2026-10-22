import type { SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

type Outcome = "avoid" | "review" | "uncertain" | "no-major-alerts";

type Translation = {
  eyebrow: string;
  question: string;
  headline: Record<Outcome, string>;
  explanation: Record<Outcome, string>;
  php: string;
  session: string;
  unfamiliar: string;
  checkOfficial: string;
  noGuarantee: string;
  detail: string;
  detected: string;
};

const I18N: Record<SupportedLocale, Translation> = {
  es: {
    eyebrow: "La respuesta en palabras sencillas",
    question: "¿Puedo compartir mis datos personales aquí?",
    headline: {
      avoid: "Por ahora, mejor no introduzcas tus datos.",
      review: "Antes de compartir tus datos, comprueba esta web.",
      uncertain: "No tenemos información suficiente para aconsejarte.",
      "no-major-alerts": "No hemos detectado señales importantes de peligro.",
    },
    explanation: {
      avoid: "Hemos encontrado señales que merecen mucha precaución. No introduzcas contraseñas, documentos ni datos bancarios hasta confirmar por otra vía que estás en la web correcta.",
      review: "Hemos encontrado aspectos que conviene revisar, pero no hemos demostrado que estén robando datos ni que la web sea fraudulenta.",
      uncertain: "La web no nos ha permitido completar todas las comprobaciones o las pruebas son limitadas. No sería responsable decirte que es segura o insegura.",
      "no-major-alerts": "Las pruebas disponibles no han revelado señales importantes de riesgo. Aun así, no podemos comprobar cómo guarda o utiliza tus datos personales.",
    },
    php: "El servidor anuncia una versión de PHP que ya no recibe actualizaciones oficiales de seguridad. Conviene que el responsable la revise.",
    session: "Algunas cookies que podrían servir para mantener una sesión no tienen todas las protecciones recomendadas.",
    unfamiliar: "Hay configuraciones técnicas que podrían mejorarse, pero eso no demuestra que exista una filtración.",
    checkOfficial: "Consejo: comprueba que la dirección pertenece a la empresa real. Si llegaste desde un mensaje, busca la web oficial por tu cuenta.",
    noGuarantee: "VONÜ no puede asegurar al 100 % que tus datos estén protegidos ni confirmar problemas internos solo con una URL.",
    detail: "El informe técnico está disponible más abajo, para quien quiera ver exactamente qué hemos podido observar.",
    detected: "¿Por qué recomendamos precaución?",
  },
  en: {
    eyebrow: "The answer in plain language",
    question: "Should I share personal information here?",
    headline: {
      avoid: "For now, avoid entering your personal details.",
      review: "Check this website before sharing personal information.",
      uncertain: "We do not have enough information to advise you.",
      "no-major-alerts": "No major warning signs were found.",
    },
    explanation: {
      avoid: "We found signals that call for particular caution. Avoid entering passwords, documents or banking details until you independently confirm the website.",
      review: "Some findings deserve attention, but we have not demonstrated that this website is stealing data or is fraudulent.",
      uncertain: "The website restricted checks or we had insufficient evidence. It would be misleading to call it either safe or unsafe.",
      "no-major-alerts": "The available checks did not reveal major warning signs. However, we cannot check how the website stores or uses your personal data.",
    },
    php: "The server advertises a PHP version that no longer gets official security updates. The website owner should review this.",
    session: "Some cookies that may be used for sessions lack recommended protection settings.",
    unfamiliar: "Some technical configurations could be improved. This does not prove a data breach.",
    checkOfficial: "Tip: make sure this address belongs to the real organization. If you followed a message link, find its official website independently.",
    noGuarantee: "VONÜ cannot guarantee data safety or confirm internal problems from a URL alone.",
    detail: "The technical report is below if you want to see exactly what we could check.",
    detected: "Why do we suggest caution?",
  },
  fr: {
    eyebrow: "Une réponse simple",
    question: "Puis-je partager mes données personnelles ici ?",
    headline: {
      avoid: "Pour le moment, évitez de saisir vos données.",
      review: "Vérifiez ce site avant de partager vos données.",
      uncertain: "Nous manquons d'informations pour vous conseiller.",
      "no-major-alerts": "Aucun signal d'alerte majeur détecté.",
    },
    explanation: {
      avoid: "Des signaux invitent à une grande prudence. Ne saisissez ni mots de passe, ni documents, ni informations bancaires avant de vérifier le site indépendamment.",
      review: "Certains éléments méritent une vérification. Nous n'avons toutefois pas démontré de vol de données ni de fraude.",
      uncertain: "Le site a limité les contrôles ou les preuves sont insuffisantes. Il serait trompeur de le déclarer sûr ou dangereux.",
      "no-major-alerts": "Les contrôles disponibles ne montrent pas de signal d'alerte majeur. Ils ne permettent pas de vérifier le stockage ou l'utilisation de vos données.",
    },
    php: "Le serveur annonce une version PHP qui ne reçoit plus de mises à jour officielles de sécurité.",
    session: "Certaines cookies pouvant servir à gérer une session n'ont pas toutes les protections recommandées.",
    unfamiliar: "Certains réglages de sécurité pourraient être améliorés. Cela ne prouve pas une fuite de données.",
    checkOfficial: "Conseil : vérifiez que l'adresse appartient à l'organisation réelle. En cas de lien reçu par message, retrouvez le site officiel indépendamment.",
    noGuarantee: "VONÜ ne peut pas garantir la sécurité de vos données ni confirmer des problèmes internes à partir d'une simple URL.",
    detail: "Le rapport technique se trouve plus bas.",
    detected: "Pourquoi être prudent ?",
  },
  de: {
    eyebrow: "Die Antwort in einfachen Worten",
    question: "Kann ich hier persönliche Daten eingeben?",
    headline: {
      avoid: "Gib vorerst besser keine persönlichen Daten ein.",
      review: "Prüfe diese Website, bevor du Daten teilst.",
      uncertain: "Für eine Empfehlung fehlen uns Informationen.",
      "no-major-alerts": "Keine größeren Warnzeichen gefunden.",
    },
    explanation: {
      avoid: "Es wurden ernstzunehmende Warnzeichen gefunden. Gib keine Passwörter, Dokumente oder Bankdaten ein, bevor du die Website unabhängig überprüft hast.",
      review: "Einige Hinweise verdienen Aufmerksamkeit. Wir haben jedoch weder Datendiebstahl noch Betrug nachgewiesen.",
      uncertain: "Die Website begrenzt Prüfungen oder die Hinweise reichen nicht aus. Wir können sie nicht zuverlässig als sicher oder unsicher bewerten.",
      "no-major-alerts": "Die verfügbaren Prüfungen zeigten keine größeren Warnzeichen. Wie deine Daten gespeichert oder genutzt werden, können wir aber nicht prüfen.",
    },
    php: "Der Server meldet eine PHP-Version, die keine offiziellen Sicherheitsupdates mehr erhält.",
    session: "Einige mögliche Sitzungs-Cookies haben nicht alle empfohlenen Schutzattribute.",
    unfamiliar: "Einige technische Einstellungen könnten verbessert werden. Das beweist keinen Datenabfluss.",
    checkOfficial: "Tipp: Prüfe, ob die Adresse zur echten Organisation gehört. Öffne die offizielle Website nach Möglichkeit unabhängig vom erhaltenen Link.",
    noGuarantee: "VONÜ kann Datensicherheit nicht garantieren und interne Schwachstellen nicht allein anhand einer URL bestätigen.",
    detail: "Weitere technische Informationen findest du unten.",
    detected: "Warum raten wir zur Vorsicht?",
  },
  ar: {
    eyebrow: "الإجابة بلغة بسيطة",
    question: "هل يمكنني مشاركة بياناتي الشخصية هنا؟",
    headline: {
      avoid: "من الأفضل ألا تدخل بياناتك حالياً.",
      review: "تحقق من الموقع قبل مشاركة بياناتك.",
      uncertain: "ليست لدينا معلومات كافية لتقديم توصية.",
      "no-major-alerts": "لم نجد مؤشرات خطر كبيرة.",
    },
    explanation: {
      avoid: "رصدنا مؤشرات تستدعي الحذر الشديد. لا تدخل كلمات المرور أو المستندات أو البيانات البنكية قبل التحقق من الموقع بشكل مستقل.",
      review: "توجد أمور تستحق المراجعة، لكننا لم نثبت سرقة بيانات أو احتيالاً.",
      uncertain: "قيّد الموقع الفحوص أو لم تتوفر أدلة كافية، لذا لا يمكن وصفه بأنه آمن أو غير آمن بشكل موثوق.",
      "no-major-alerts": "لم تكشف الفحوص المتاحة مؤشرات خطر كبيرة، لكننا لا نستطيع معرفة كيفية تخزين الموقع لبياناتك أو استخدامها.",
    },
    php: "يعلن الخادم إصدار PHP لم يعد يتلقى تحديثات أمنية رسمية.",
    session: "بعض ملفات تعريف ارتباط الجلسة المحتملة تفتقر إلى إعدادات الحماية الموصى بها.",
    unfamiliar: "يمكن تحسين بعض إعدادات الأمان، لكن ذلك لا يثبت تسرب البيانات.",
    checkOfficial: "نصيحة: تأكد من أن العنوان يعود إلى الجهة الحقيقية، وابحث عن موقعها الرسمي بشكل مستقل إذا وصل الرابط عبر رسالة.",
    noGuarantee: "لا يستطيع VONÜ ضمان سلامة البيانات أو تأكيد ثغرات داخلية بالاعتماد على رابط وحده.",
    detail: "التفاصيل التقنية متاحة أدناه.",
    detected: "لماذا ننصح بالحذر؟",
  },
};

export function personalDataOutcome(result: WebCheckResult): Outcome {
  // Assess the ability to share data independently of technical CVSS severity.
  if (result.facts.urlhausMatch === true ||
      (result.facts.httpStatus !== null && !result.facts.usesHttps) ||
      result.risk.level === "high") return "avoid";

  const findings = result.facts.security?.findings ?? [];
  const hasImportantTechnicalClue = findings.some((f) => f.severity === "attention");
  if (result.risk.level === "caution" || hasImportantTechnicalClue) return "review";

  const accessLimited = result.risk.level === "unknown" ||
    !result.facts.security ||
    result.facts.security.limited ||
    result.facts.httpStatus === null;
  if (accessLimited) return "uncertain";

  // A low fraud score is not a safety certification.
  return result.risk.level === "low" && result.risk.confidence !== "limited"
    ? "no-major-alerts" : "uncertain";
}

export default function WebPersonalDataVerdict({ result, locale }: {
  result: WebCheckResult;
  locale: SupportedLocale;
}) {
  const t = I18N[locale];
  const outcome = personalDataOutcome(result);
  const findingIds = new Set((result.facts.security?.findings ?? []).map((f) => f.id));
  const technicalClues = [
    findingIds.has("php-unsupported") ? t.php : null,
    (findingIds.has("session-cookie-httponly") ||
      (result.facts.security?.cookies.sessionMissingSecure ?? 0) > 0) ? t.session : null,
    !findingIds.has("php-unsupported") &&
      !findingIds.has("session-cookie-httponly") &&
      result.facts.security?.findings.length ? t.unfamiliar : null,
  ].filter((x): x is string => Boolean(x));

  return (
    <section className="mt-5 rounded-[24px] border border-[#24385c] bg-[#101c3c] p-5 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.10em] text-[#79b4ff]">{t.eyebrow}</p>
      <h2 className="mt-2 text-[19px] font-semibold leading-snug text-white sm:text-[22px]">{t.question}</h2>
      <p className={`mt-3 text-[20px] font-bold leading-snug ${outcome === "avoid" ? "text-red-300" : outcome === "review" ? "text-amber-200" : outcome === "no-major-alerts" ? "text-emerald-300" : "text-[#79b4ff]"}`}>
        {t.headline[outcome]}
      </p>
      <p className="mt-3 max-w-3xl text-[14px] leading-6 text-slate-200">{t.explanation[outcome]}</p>
      {technicalClues.length > 0 && (outcome === "review" || outcome === "avoid") && (
        <div className="mt-4 rounded-xl bg-black/15 p-3.5">
          <h3 className="text-[13px] font-semibold text-white">{t.detected}</h3>
          <ul className="mt-2 space-y-2 text-[13px] leading-6 text-slate-300">
            {technicalClues.map((clue) => <li key={clue}>• {clue}</li>)}
          </ul>
        </div>
      )}
      <p className="mt-4 text-[13px] leading-6 text-slate-200">{t.checkOfficial}</p>
      <p className="mt-2 text-[12px] leading-5 text-slate-400">{t.noGuarantee} {t.detail}</p>
    </section>
  );
}
