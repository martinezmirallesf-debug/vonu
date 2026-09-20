import Link from "next/link";
import GlobalPublicHeader from "./GlobalPublicHeader";
import GlobalPublicFooter from "./GlobalPublicFooter";
import ContactForm from "./ContactForm";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { checkPath } from "@/lib/vonu-global/i18n";

type ContactCopy = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  write: string;
  analyse: string;
  reasons: Array<{ title: string; text: string }>;
  formEyebrow: string;
  formTitle: string;
  formIntro: string;
  notesTitle: string;
  notes: string[];
  bottomTitle: string;
  bottomText: string;
  bottomCta: string;
};

const copy: Record<SupportedLocale, ContactCopy> = {
  es: {
    eyebrow: "Contacto",
    title: "Estamos aquí para",
    accent: "ayudarte.",
    intro: "Soporte, pagos, privacidad, feedback o colaboración. Cuéntanos qué necesitas y te responderemos con la información más útil posible.",
    write: "Escribir ahora",
    analyse: "Analizar con Vonu",
    reasons: [
      { title: "Soporte", text: "Cuenta, acceso, pagos, recargas o funcionamiento." },
      { title: "Producto", text: "Errores, ideas y sugerencias para mejorar Vonu." },
      { title: "Privacidad", text: "Datos, documentación, seguridad y uso responsable." },
      { title: "Colaboración", text: "Partners, medios y propuestas relacionadas con Vonu." },
    ],
    formEyebrow: "Escríbenos",
    formTitle: "Cuéntanos qué necesitas.",
    formIntro: "Elige el motivo y explica brevemente la situación. No hace falta que compartas más información de la necesaria.",
    notesTitle: "Antes de enviar",
    notes: ["No incluyas contraseñas, códigos ni datos bancarios completos.", "Si quieres comprobar una web, mensaje o captura sospechosa, usa directamente Vonu Check."],
    bottomTitle: "¿Lo que necesitas es comprobar algo sospechoso?",
    bottomText: "Puedes analizarlo ahora mismo y obtener señales de riesgo antes de actuar.",
    bottomCta: "Analizar ahora",
  },
  en: {
    eyebrow: "Contact",
    title: "We are here to",
    accent: "help.",
    intro: "Support, payments, privacy, feedback or partnerships. Tell us what you need and we will reply with the most useful information we can.",
    write: "Write to us",
    analyse: "Analyse with Vonu",
    reasons: [
      { title: "Support", text: "Account, access, payments, packs or how Vonu works." },
      { title: "Product", text: "Bugs, ideas and suggestions to improve Vonu." },
      { title: "Privacy", text: "Data, documentation, security and responsible use." },
      { title: "Partnerships", text: "Media, partners and collaboration proposals." },
    ],
    formEyebrow: "Message us",
    formTitle: "Tell us what you need.",
    formIntro: "Choose a reason and briefly explain the situation. You do not need to share more information than necessary.",
    notesTitle: "Before you send",
    notes: ["Do not include passwords, codes or full banking details.", "If you want to check a suspicious website, message or screenshot, use Vonu Check directly."],
    bottomTitle: "Do you need to check something suspicious?",
    bottomText: "Analyse it now and review risk signals before you act.",
    bottomCta: "Analyse now",
  },
  fr: {
    eyebrow: "Contact",
    title: "Nous sommes là pour",
    accent: "vous aider.",
    intro: "Support, paiements, confidentialité, avis ou collaboration. Expliquez-nous ce dont vous avez besoin et nous vous répondrons avec les informations les plus utiles possible.",
    write: "Nous écrire",
    analyse: "Analyser avec Vonu",
    reasons: [
      { title: "Support", text: "Compte, accès, paiements, packs ou fonctionnement." },
      { title: "Produit", text: "Bugs, idées et suggestions pour améliorer Vonu." },
      { title: "Confidentialité", text: "Données, documentation, sécurité et usage responsable." },
      { title: "Collaboration", text: "Médias, partenaires et propositions de collaboration." },
    ],
    formEyebrow: "Écrivez-nous",
    formTitle: "Dites-nous ce dont vous avez besoin.",
    formIntro: "Choisissez un motif et expliquez brièvement la situation. Ne partagez pas plus d’informations que nécessaire.",
    notesTitle: "Avant d’envoyer",
    notes: ["N’incluez pas de mots de passe, codes ou coordonnées bancaires complètes.", "Pour vérifier un site, un message ou une capture suspecte, utilisez directement Vonu Check."],
    bottomTitle: "Vous souhaitez vérifier quelque chose de suspect ?",
    bottomText: "Analysez-le maintenant et consultez les signaux de risque avant d’agir.",
    bottomCta: "Analyser maintenant",
  },
  de: {
    eyebrow: "Kontakt",
    title: "Wir sind da, um",
    accent: "zu helfen.",
    intro: "Support, Zahlungen, Datenschutz, Feedback oder Zusammenarbeit. Sag uns, was du brauchst, und wir antworten mit möglichst hilfreichen Informationen.",
    write: "Nachricht schreiben",
    analyse: "Mit Vonu analysieren",
    reasons: [
      { title: "Support", text: "Konto, Zugriff, Zahlungen, Pakete oder Funktionsweise." },
      { title: "Produkt", text: "Fehler, Ideen und Vorschläge zur Verbesserung von Vonu." },
      { title: "Datenschutz", text: "Daten, Dokumentation, Sicherheit und verantwortungsvolle Nutzung." },
      { title: "Zusammenarbeit", text: "Medien, Partner und Kooperationsanfragen." },
    ],
    formEyebrow: "Schreib uns",
    formTitle: "Sag uns, was du brauchst.",
    formIntro: "Wähle einen Grund und beschreibe die Situation kurz. Teile nur die Informationen, die wirklich nötig sind.",
    notesTitle: "Vor dem Senden",
    notes: ["Keine Passwörter, Codes oder vollständigen Bankdaten angeben.", "Wenn du eine verdächtige Website, Nachricht oder einen Screenshot prüfen willst, nutze direkt Vonu Check."],
    bottomTitle: "Möchtest du etwas Verdächtiges prüfen?",
    bottomText: "Analysiere es jetzt und prüfe Risikosignale, bevor du handelst.",
    bottomCta: "Jetzt analysieren",
  },
  ar: {
    eyebrow: "اتصل بنا",
    title: "نحن هنا من أجل",
    accent: "مساعدتك.",
    intro: "الدعم والمدفوعات والخصوصية والملاحظات والتعاون. أخبرنا بما تحتاجه وسنرد بأكثر المعلومات فائدة قدر الإمكان.",
    write: "اكتب لنا",
    analyse: "حلّل باستخدام Vonu",
    reasons: [
      { title: "الدعم", text: "الحساب أو الوصول أو المدفوعات أو حزم التحليل أو طريقة العمل." },
      { title: "المنتج", text: "الأخطاء والأفكار والاقتراحات لتحسين Vonu." },
      { title: "الخصوصية", text: "البيانات والوثائق والأمان والاستخدام المسؤول." },
      { title: "التعاون", text: "الإعلام والشركاء ومقترحات التعاون." },
    ],
    formEyebrow: "راسلنا",
    formTitle: "أخبرنا بما تحتاجه.",
    formIntro: "اختر سبب التواصل واشرح الموقف باختصار. لا تشارك معلومات أكثر من اللازم.",
    notesTitle: "قبل الإرسال",
    notes: ["لا تدرج كلمات مرور أو رموزًا أو بيانات بنكية كاملة.", "إذا كنت تريد فحص موقع أو رسالة أو لقطة شاشة مشبوهة، فاستخدم Vonu Check مباشرة."],
    bottomTitle: "هل تريد فحص شيء مشبوه؟",
    bottomText: "حلّله الآن وراجع إشارات الخطر قبل أن تتصرف.",
    bottomCta: "حلّل الآن",
  },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 12h13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactPublicPage({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const rtl = locale === "ar";

  return (
    <main className="min-h-screen bg-[#080b12] text-white" dir={rtl ? "rtl" : "ltr"}>
      <GlobalPublicHeader locale={locale} slug="contacto" />

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#1d78ff]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-[1180px] px-4 pb-12 pt-14 sm:px-6 sm:pb-18 sm:pt-20 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ec2ff]">{t.eyebrow}</p>
            <h1 className="mt-5 text-[48px] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[72px] lg:text-[86px]">
              {t.title} <span className="text-[#7bb7ff]">{t.accent}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[720px] text-[16px] leading-7 text-slate-400 sm:text-[18px] sm:leading-8">{t.intro}</p>
            <div className="mt-8 flex justify-center gap-2.5">
              <a href="#contact-form" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-5 text-[13px] font-bold text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.18)] transition hover:-translate-y-0.5 hover:bg-[#a3ceff] sm:flex-none sm:px-6">
                {t.write} <ArrowIcon />
              </a>
              <a href={checkPath(locale)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.04] px-5 text-[13px] font-semibold text-slate-200 transition hover:bg-white/[0.07] sm:flex-none sm:px-6">
                {t.analyse}
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1050px] grid-cols-2 gap-3 lg:grid-cols-4">
            {t.reasons.map((reason) => (
              <article key={reason.title} className="rounded-[20px] border border-white/[0.07] bg-white/[0.035] p-4 sm:p-5">
                <h2 className="text-[16px] font-semibold tracking-[-0.025em] text-white sm:text-[18px]">{reason.title}</h2>
                <p className="mt-2 text-[12px] leading-5 text-slate-500 sm:text-[13px] sm:leading-6">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8ec2ff]">{t.formEyebrow}</p>
            <h2 className="mt-4 max-w-[520px] text-[38px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[56px]">{t.formTitle}</h2>
            <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-slate-400">{t.formIntro}</p>

            <div className="mt-7 rounded-[22px] border border-white/[0.07] bg-white/[0.03] p-5">
              <p className="text-[14px] font-semibold text-slate-200">{t.notesTitle}</p>
              <div className="mt-3 grid gap-3">
                {t.notes.map((note) => (
                  <div key={note} className="flex gap-3 text-[13px] leading-6 text-slate-500">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7bb7ff]" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/[0.08] bg-[#0d121d] p-4 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:p-6 lg:p-7">
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>

      <section className="bg-[#080b12]">
        <div className="mx-auto max-w-[900px] px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-[34px] font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-[50px]">{t.bottomTitle}</h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 text-slate-500">{t.bottomText}</p>
          <a href={checkPath(locale)} className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#7bb7ff] px-6 text-[13px] font-bold text-[#07142f] transition hover:-translate-y-0.5 hover:bg-[#a3ceff]">
            {t.bottomCta} <ArrowIcon />
          </a>
        </div>
      </section>

      <GlobalPublicFooter locale={locale} />
    </main>
  );
}
