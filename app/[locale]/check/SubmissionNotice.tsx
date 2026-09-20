"use client";

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
};

const copy: Record<SupportedLocale, NoticeCopy> = {
  es: {
    ai: "Vonu utiliza IA y comprobaciones automatizadas; puede equivocarse y el resultado no es un veredicto. ",
    beforeTerms: "Al analizar, aceptas nuestros ",
    terms: "Términos",
    betweenTermsPrivacy: " y confirmas que has leído ",
    privacy: "Privacidad",
    afterPrivacy: ".",
  },
  en: {
    ai: "Vonu uses AI and automated checks; it can make mistakes and the result is not a verdict. ",
    beforeTerms: "By analysing, you agree to our ",
    terms: "Terms",
    betweenTermsPrivacy: " and confirm that you have read ",
    privacy: "Privacy",
    afterPrivacy: ".",
  },
  fr: {
    ai: "Vonu utilise l’IA et des vérifications automatisées ; des erreurs sont possibles et le résultat n’est pas un verdict. ",
    beforeTerms: "En lançant l’analyse, vous acceptez nos ",
    terms: "Conditions",
    betweenTermsPrivacy: " et confirmez avoir lu la ",
    privacy: "Confidentialité",
    afterPrivacy: ".",
  },
  de: {
    ai: "Vonu verwendet KI und automatisierte Prüfungen; Fehler sind möglich und das Ergebnis ist kein abschließendes Urteil. ",
    beforeTerms: "Mit der Analyse stimmst du den ",
    terms: "Bedingungen",
    betweenTermsPrivacy: " zu und bestätigst die ",
    privacy: "Datenschutzinformationen",
    afterPrivacy: ".",
  },
  ar: {
    ai: "تستخدم Vonu الذكاء الاصطناعي وعمليات فحص آلية؛ وقد تخطئ، والنتيجة ليست حكمًا نهائيًا. ",
    beforeTerms: "بإجراء التحليل، فإنك توافق على ",
    terms: "الشروط",
    betweenTermsPrivacy: " وتؤكد أنك قرأت ",
    privacy: "الخصوصية",
    afterPrivacy: ".",
  },
}

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
      <a href={legalPath(locale, "terms")}>{t.terms}</a>
      {t.betweenTermsPrivacy}
      <a href={legalPath(locale, "privacy")}>{t.privacy}</a>
      {t.afterPrivacy}
    </p>,
    target,
  );
}
