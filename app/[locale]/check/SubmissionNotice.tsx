"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { legalPath } from "@/lib/vonu-legal/routes";

type NoticeCopy = {
  ai: string;
  beforeTerms: string;
  terms: string;
  betweenTermsPrivacy: string;
  privacy: string;
  afterPrivacy: string;
  learn: string;
};

const copy: Record<SupportedLocale, NoticeCopy> = {
  es: {
    ai: "Vonu utiliza IA y comprobaciones automatizadas; puede equivocarse y el resultado no es un veredicto. ",
    beforeTerms: "Al enviar contenido para analizar, aceptas nuestros ",
    terms: "Términos de servicio",
    betweenTermsPrivacy: " y confirmas que has leído el ",
    privacy: "Aviso de privacidad",
    afterPrivacy:
      ". No envíes contraseñas, códigos de verificación, datos bancarios completos ni información sensible innecesaria. El contenido puede ser procesado por los proveedores técnicos necesarios para realizar el análisis. ",
    learn: "Más información",
  },
  en: {
    ai: "Vonu uses AI and automated checks; it can make mistakes and the result is not a verdict. ",
    beforeTerms: "By submitting content for analysis, you agree to our ",
    terms: "Terms of Service",
    betweenTermsPrivacy: " and confirm that you have read the ",
    privacy: "Privacy Notice",
    afterPrivacy:
      ". Do not submit passwords, verification codes, full banking details or unnecessary sensitive information. Content may be processed by the technical providers required to perform the analysis. ",
    learn: "Learn more",
  },
  fr: {
    ai: "Vonu utilise l’IA et des vérifications automatisées ; des erreurs sont possibles et le résultat ne constitue pas un verdict. ",
    beforeTerms: "En envoyant du contenu à analyser, vous acceptez nos ",
    terms: "Conditions d’utilisation",
    betweenTermsPrivacy: " et confirmez avoir lu notre ",
    privacy: "Politique de confidentialité",
    afterPrivacy:
      ". N’envoyez pas de mots de passe, codes de vérification, coordonnées bancaires complètes ni d’informations sensibles inutiles. Le contenu peut être traité par les prestataires techniques nécessaires à l’analyse. ",
    learn: "En savoir plus",
  },
  de: {
    ai: "Vonu verwendet KI und automatisierte Prüfungen; Fehler sind möglich und das Ergebnis ist kein abschließendes Urteil. ",
    beforeTerms: "Mit dem Absenden von Inhalten zur Analyse stimmst du unseren ",
    terms: "Nutzungsbedingungen",
    betweenTermsPrivacy: " zu und bestätigst, dass du den ",
    privacy: "Datenschutzhinweis",
    afterPrivacy:
      " gelesen hast. Sende keine Passwörter, Bestätigungscodes, vollständigen Bankdaten oder unnötigen sensiblen Informationen. Inhalte können von den für die Analyse erforderlichen technischen Dienstleistern verarbeitet werden. ",
    learn: "Mehr erfahren",
  },
  ar: {
    ai: "تستخدم Vonu الذكاء الاصطناعي وعمليات فحص آلية؛ وقد تخطئ، والنتيجة ليست حكمًا نهائيًا. ",
    beforeTerms: "بإرسال محتوى للتحليل، فإنك توافق على ",
    terms: "شروط الخدمة",
    betweenTermsPrivacy: " وتؤكد أنك قرأت ",
    privacy: "إشعار الخصوصية",
    afterPrivacy:
      ". لا ترسل كلمات المرور أو رموز التحقق أو البيانات المصرفية الكاملة أو معلومات حساسة غير ضرورية. قد تتم معالجة المحتوى بواسطة مزودي الخدمات التقنية اللازمين لإجراء التحليل. ",
    learn: "معرفة المزيد",
  },
};

export default function SubmissionNotice({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const ctaStack = document.querySelector<HTMLElement>(
      '.vonu-check-page main:has(> section.text-center) section[class*="max-w-[850px]"] > div:last-child > div:last-child',
    );
    setTarget(ctaStack);
  }, []);

  if (!target) return null;

  return createPortal(
    <p className="vonu-submission-notice">
      {t.ai}
      {t.beforeTerms}
      <Link href={legalPath(locale, "terms")}>{t.terms}</Link>
      {t.betweenTermsPrivacy}
      <Link href={legalPath(locale, "privacy")}>{t.privacy}</Link>
      {t.afterPrivacy}
      <Link href={legalPath(locale, "privacy")}>{t.learn}</Link>.
    </p>,
    target,
  );
}
