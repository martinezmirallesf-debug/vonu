import Link from "next/link";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type NoticeCopy = {
  beforeTerms: string;
  terms: string;
  betweenTermsPrivacy: string;
  privacy: string;
  afterPrivacy: string;
  learn: string;
};

const copy: Record<SupportedLocale, NoticeCopy> = {
  es: {
    beforeTerms: "Al enviar contenido para analizar, aceptas nuestros ",
    terms: "Términos de servicio",
    betweenTermsPrivacy: " y el ",
    privacy: "Aviso de privacidad",
    afterPrivacy:
      ". No envíes información personal, confidencial o sensible. El contenido puede ser procesado por los proveedores técnicos necesarios para realizar el análisis; Vonu no se hace responsable del contenido que envíes. ",
    learn: "Más información",
  },
  en: {
    beforeTerms: "By submitting content for analysis, you agree to our ",
    terms: "Terms of Service",
    betweenTermsPrivacy: " and ",
    privacy: "Privacy Notice",
    afterPrivacy:
      ". Please do not submit personal, confidential or sensitive information. Content may be processed by the technical providers required to perform the analysis; Vonu is not responsible for the content you submit. ",
    learn: "Learn more",
  },
  fr: {
    beforeTerms: "En envoyant du contenu à analyser, vous acceptez nos ",
    terms: "Conditions d’utilisation",
    betweenTermsPrivacy: " et notre ",
    privacy: "Politique de confidentialité",
    afterPrivacy:
      ". N’envoyez pas d’informations personnelles, confidentielles ou sensibles. Le contenu peut être traité par les prestataires techniques nécessaires à l’analyse ; Vonu n’est pas responsable du contenu que vous envoyez. ",
    learn: "En savoir plus",
  },
  de: {
    beforeTerms: "Mit dem Absenden von Inhalten zur Analyse stimmst du unseren ",
    terms: "Nutzungsbedingungen",
    betweenTermsPrivacy: " und unserem ",
    privacy: "Datenschutzhinweis",
    afterPrivacy:
      ". Bitte sende keine persönlichen, vertraulichen oder sensiblen Informationen. Inhalte können von den für die Analyse erforderlichen technischen Dienstleistern verarbeitet werden; Vonu übernimmt keine Verantwortung für die von dir übermittelten Inhalte. ",
    learn: "Mehr erfahren",
  },
  ar: {
    beforeTerms: "بإرسال محتوى للتحليل، فإنك توافق على ",
    terms: "شروط الخدمة",
    betweenTermsPrivacy: " و",
    privacy: "إشعار الخصوصية",
    afterPrivacy:
      ". يرجى عدم إرسال معلومات شخصية أو سرية أو حساسة. قد تتم معالجة المحتوى بواسطة مزودي الخدمات التقنية اللازمين لإجراء التحليل؛ ولا تتحمل Vonu مسؤولية المحتوى الذي ترسله. ",
    learn: "معرفة المزيد",
  },
};

export default function SubmissionNotice({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];

  return (
    <p className="vonu-submission-notice">
      {t.beforeTerms}
      <Link href="/legal/terminos">{t.terms}</Link>
      {t.betweenTermsPrivacy}
      <Link href="/legal/privacidad">{t.privacy}</Link>
      {t.afterPrivacy}
      <Link href="/legal/privacidad">{t.learn}</Link>.
    </p>
  );
}
