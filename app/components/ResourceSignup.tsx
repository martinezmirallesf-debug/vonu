"use client";

import { useState } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { RESOURCE_CONSENT_VERSION } from "@/lib/vonu-legal/consent";
import { legalPath } from "@/lib/vonu-legal/routes";

type FormState = "idle" | "sending" | "success" | "error";

type SignupCopy = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  cardTitle: string;
  cardMuted: string;
  cardText: string;
  topics: string[];
  placeholder: string;
  ariaEmail: string;
  consentPrefix: string;
  privacy: string;
  consentSuffix: string;
  button: string;
  sending: string;
  empty: string;
  invalid: string;
  consentError: string;
  success: string;
  fallbackError: string;
  footnote: string;
};

const copy: Record<SupportedLocale, SignupCopy> = {
  es: {
    eyebrow: "Recursos Vonu",
    title: "Nuevas señales para decidir",
    accent: "antes.",
    intro: "Recibe guías breves sobre fraude, phishing y también sobre qué revisar en contratos, facturas, presupuestos y otras decisiones importantes.",
    cardTitle: "Alertas y guías útiles,",
    cardMuted: "no ruido.",
    cardText: "Casos prácticos, cambios importantes en Vonu y recursos para comprobar antes de confiar, firmar o pagar.",
    topics: ["Phishing y smishing", "Enlaces y dominios", "Inversiones y cripto", "Contratos y alquiler", "Facturas y presupuestos", "Financiación y servicios"],
    placeholder: "tu@email.com",
    ariaEmail: "Email para recibir recursos de Vonu",
    consentPrefix: "Quiero recibir recursos y novedades de Vonu. He leído la",
    privacy: "Política de privacidad",
    consentSuffix: ".",
    button: "Recibir recursos",
    sending: "Guardando...",
    empty: "Introduce tu email para recibir recursos.",
    invalid: "Revisa el email. Parece que no está completo.",
    consentError: "Necesitamos tu consentimiento para enviarte estos recursos.",
    success: "Perfecto. Te avisaremos cuando haya una guía o alerta que merezca la pena.",
    fallbackError: "No se ha podido guardar el email ahora mismo. Inténtalo de nuevo en unos minutos.",
    footnote: "Sin spam ni publicidad de terceros. Puedes darte de baja cuando quieras.",
  },
  en: {
    eyebrow: "Vonu resources",
    title: "New signals to spot",
    accent: "earlier.",
    intro: "Get short guides on scams and phishing, plus what to review in contracts, invoices, quotes and other important decisions.",
    cardTitle: "Useful alerts and guides,",
    cardMuted: "not noise.",
    cardText: "Practical cases, important Vonu updates and resources that help you check before you trust, sign or pay.",
    topics: ["Phishing and smishing", "Links and domains", "Investment and crypto", "Contracts and rentals", "Invoices and quotes", "Financing and services"],
    placeholder: "you@email.com",
    ariaEmail: "Email to receive Vonu resources",
    consentPrefix: "I want to receive Vonu resources and updates. I have read the",
    privacy: "Privacy Policy",
    consentSuffix: ".",
    button: "Get resources",
    sending: "Saving...",
    empty: "Enter your email to receive resources.",
    invalid: "Check the email address. It looks incomplete.",
    consentError: "We need your consent to send these resources.",
    success: "Done. We’ll let you know when there is a useful guide or alert worth seeing.",
    fallbackError: "We could not save your email right now. Please try again in a few minutes.",
    footnote: "No spam or third-party advertising. You can unsubscribe at any time.",
  },
  fr: {
    eyebrow: "Ressources Vonu",
    title: "De nouveaux signaux à repérer",
    accent: "plus tôt.",
    intro: "Recevez de courtes ressources sur les arnaques et le phishing, mais aussi sur les points à vérifier dans contrats, factures, devis et décisions importantes.",
    cardTitle: "Des alertes et guides utiles,",
    cardMuted: "pas du bruit.",
    cardText: "Des cas pratiques, les changements importants de Vonu et des ressources pour vérifier avant de faire confiance, signer ou payer.",
    topics: ["Phishing et smishing", "Liens et domaines", "Investissement et crypto", "Contrats et locations", "Factures et devis", "Financement et services"],
    placeholder: "vous@email.com",
    ariaEmail: "Email pour recevoir les ressources Vonu",
    consentPrefix: "Je souhaite recevoir les ressources et nouveautés de Vonu. J’ai lu la",
    privacy: "Politique de confidentialité",
    consentSuffix: ".",
    button: "Recevoir les ressources",
    sending: "Enregistrement...",
    empty: "Saisissez votre email pour recevoir les ressources.",
    invalid: "Vérifiez l’adresse email. Elle semble incomplète.",
    consentError: "Votre consentement est nécessaire pour envoyer ces ressources.",
    success: "Parfait. Nous vous préviendrons lorsqu’un guide ou une alerte utile sera disponible.",
    fallbackError: "Impossible d’enregistrer votre email pour le moment. Réessayez dans quelques minutes.",
    footnote: "Pas de spam ni de publicité de tiers. Vous pouvez vous désabonner à tout moment.",
  },
  de: {
    eyebrow: "Vonu-Ressourcen",
    title: "Neue Signale",
    accent: "früher erkennen.",
    intro: "Kurze Hinweise zu Betrug und Phishing sowie zu wichtigen Prüfpunkten in Verträgen, Rechnungen, Angeboten und anderen Entscheidungen.",
    cardTitle: "Nützliche Hinweise und Leitfäden,",
    cardMuted: "kein Rauschen.",
    cardText: "Praxisfälle, wichtige Vonu-Updates und Ressourcen zum Prüfen vor Vertrauen, Unterschrift oder Zahlung.",
    topics: ["Phishing und Smishing", "Links und Domains", "Investment und Krypto", "Verträge und Miete", "Rechnungen und Angebote", "Finanzierung und Dienste"],
    placeholder: "du@email.com",
    ariaEmail: "E-Mail für Vonu-Ressourcen",
    consentPrefix: "Ich möchte Vonu-Ressourcen und Updates erhalten. Ich habe die",
    privacy: "Datenschutzerklärung",
    consentSuffix: " gelesen.",
    button: "Ressourcen erhalten",
    sending: "Speichern...",
    empty: "Gib deine E-Mail-Adresse ein.",
    invalid: "Prüfe die E-Mail-Adresse. Sie scheint unvollständig zu sein.",
    consentError: "Wir benötigen deine Einwilligung, um diese Ressourcen zu senden.",
    success: "Erledigt. Wir melden uns, wenn es einen wirklich nützlichen Leitfaden oder Hinweis gibt.",
    fallbackError: "Die E-Mail konnte gerade nicht gespeichert werden. Bitte versuche es in einigen Minuten erneut.",
    footnote: "Kein Spam und keine Werbung Dritter. Du kannst dich jederzeit abmelden.",
  },
  ar: {
    eyebrow: "موارد Vonu",
    title: "إشارات جديدة تساعدك على التحقق",
    accent: "مبكرًا.",
    intro: "احصل على أدلة قصيرة حول الاحتيال والتصيد، وما ينبغي مراجعته في العقود والفواتير وعروض الأسعار والقرارات المهمة.",
    cardTitle: "تنبيهات وأدلة مفيدة،",
    cardMuted: "بدون ضوضاء.",
    cardText: "حالات عملية وتحديثات Vonu وموارد تساعدك على التحقق قبل الثقة أو التوقيع أو الدفع.",
    topics: ["التصيد والرسائل الاحتيالية", "الروابط والنطاقات", "الاستثمار والعملات المشفرة", "العقود والإيجار", "الفواتير وعروض الأسعار", "التمويل والخدمات"],
    placeholder: "you@email.com",
    ariaEmail: "البريد الإلكتروني لتلقي موارد Vonu",
    consentPrefix: "أرغب في تلقي موارد وتحديثات Vonu وقد قرأت",
    privacy: "سياسة الخصوصية",
    consentSuffix: ".",
    button: "تلقي الموارد",
    sending: "جارٍ الحفظ...",
    empty: "أدخل بريدك الإلكتروني لتلقي الموارد.",
    invalid: "راجع البريد الإلكتروني؛ يبدو غير مكتمل.",
    consentError: "نحتاج إلى موافقتك لإرسال هذه الموارد.",
    success: "تم. سنخبرك عندما يتوفر دليل أو تنبيه يستحق الاطلاع عليه.",
    fallbackError: "تعذر حفظ البريد الإلكتروني الآن. حاول مرة أخرى بعد بضع دقائق.",
    footnote: "بدون رسائل مزعجة أو إعلانات من أطراف ثالثة. يمكنك إلغاء الاشتراك في أي وقت.",
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline" style={{ backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
      {children}
    </span>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ResourceSignup({ page = "unknown", locale = "es" }: { page?: string; locale?: SupportedLocale }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const t = copy[locale];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const consent = formData.get("consent") === "on";

    if (!email) {
      setState("error");
      setMessage(t.empty);
      return;
    }
    if (!isValidEmail(email)) {
      setState("error");
      setMessage(t.invalid);
      return;
    }
    if (!consent) {
      setState("error");
      setMessage(t.consentError);
      return;
    }

    try {
      setState("sending");
      setMessage(null);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          page,
          source: "resource_signup",
          consent: true,
          locale,
          consentVersion: RESOURCE_CONSENT_VERSION,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(t.fallbackError);

      form.reset();
      setState("success");
      setMessage(t.success);
    } catch {
      setState("error");
      setMessage(t.fallbackError);
    }
  }

  const isSending = state === "sending";

  return (
    <section className="border-b border-white/[0.06] bg-[#080b12]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.eyebrow}</p>
          <h2 className="mt-4 max-w-[620px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
            {t.title} <GradientText>{t.accent}</GradientText>
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">{t.intro}</p>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_28px_80px_rgba(0,0,0,.22)] sm:p-8">
          <h3 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-[36px]">
            {t.cardTitle}<span className="block text-slate-500">{t.cardMuted}</span>
          </h3>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">{t.cardText}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {t.topics.map((topic) => (
              <div key={topic} className="flex items-center gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[13px] text-slate-300">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300"><CheckIcon /></span>
                {topic}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-7">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
              <input type="email" name="email" required inputMode="email" autoComplete="email" placeholder={t.placeholder} aria-label={t.ariaEmail} className="h-[50px] w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#070a11] px-4 text-[14px] text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/35 focus:ring-4 focus:ring-emerald-400/10" />
              <button type="submit" disabled={isSending} className={["h-[50px] w-full rounded-xl px-5 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition active:scale-[0.99]", isSending ? "cursor-wait bg-emerald-300/80" : "bg-emerald-400 hover:bg-emerald-300"].join(" ")}>
                {isSending ? t.sending : t.button}
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-[12px] leading-5 text-slate-500">
              <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-emerald-400" />
              <span>{t.consentPrefix} <a href={legalPath(locale, "privacy")} className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:text-white">{t.privacy}</a>{t.consentSuffix}</span>
            </label>
          </form>

          {message && (
            <div role="status" aria-live="polite" className={["mt-4 rounded-[16px] px-4 py-3 text-[13px] leading-6", state === "success" ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100" : "border border-red-400/20 bg-red-400/10 text-red-100"].join(" ")}>
              {message}
            </div>
          )}

          <p className="mt-4 text-[12px] leading-5 text-slate-500">{t.footnote}</p>
        </div>
      </div>
    </section>
  );
}
