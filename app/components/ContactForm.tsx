"use client";

import { useState } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { legalPath } from "@/lib/vonu-legal/routes";

type FormState = "idle" | "sending" | "success" | "error";

type FormCopy = {
  name: string;
  namePlaceholder: string;
  email: string;
  reason: string;
  reasonPlaceholder: string;
  reasons: string[];
  message: string;
  messagePlaceholder: string;
  safety: string;
  privacyPrefix: string;
  privacyLink: string;
  required: string;
  sending: string;
  submit: string;
  success: string;
  genericError: string;
};

const copy: Record<SupportedLocale, FormCopy> = {
  es: {
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    reason: "Motivo",
    reasonPlaceholder: "Selecciona una opción",
    reasons: ["Soporte o cuenta", "Pagos, planes o recargas", "Privacidad o datos", "Feedback del producto", "Colaboración", "Otro motivo"],
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos brevemente qué necesitas...",
    safety: "No compartas contraseñas, códigos de verificación ni datos bancarios completos.",
    privacyPrefix: "Usaremos estos datos únicamente para gestionar y responder tu consulta. Consulta nuestra",
    privacyLink: "Política de privacidad",
    required: "Déjanos al menos tu email y un mensaje para poder ayudarte.",
    sending: "Enviando...",
    submit: "Enviar mensaje",
    success: "Mensaje enviado. Gracias, te responderemos lo antes posible.",
    genericError: "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos.",
  },
  en: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    reason: "Reason",
    reasonPlaceholder: "Choose an option",
    reasons: ["Support or account", "Payments or analysis packs", "Privacy or data", "Product feedback", "Partnership", "Other"],
    message: "Message",
    messagePlaceholder: "Tell us briefly what you need...",
    safety: "Do not share passwords, verification codes or full banking details.",
    privacyPrefix: "We will use these details only to manage and reply to your request. See our",
    privacyLink: "Privacy Policy",
    required: "Please leave at least your email and a message so we can help.",
    sending: "Sending...",
    submit: "Send message",
    success: "Message sent. Thank you — we will reply as soon as possible.",
    genericError: "We could not send the message. Please try again in a few minutes.",
  },
  fr: {
    name: "Nom",
    namePlaceholder: "Votre nom",
    email: "Email",
    reason: "Motif",
    reasonPlaceholder: "Choisissez une option",
    reasons: ["Support ou compte", "Paiements ou packs d’analyses", "Confidentialité ou données", "Avis sur le produit", "Collaboration", "Autre"],
    message: "Message",
    messagePlaceholder: "Expliquez brièvement ce dont vous avez besoin...",
    safety: "Ne partagez pas de mots de passe, codes de vérification ni coordonnées bancaires complètes.",
    privacyPrefix: "Nous utiliserons ces données uniquement pour gérer et répondre à votre demande. Consultez notre",
    privacyLink: "Politique de confidentialité",
    required: "Indiquez au moins votre email et un message afin que nous puissions vous aider.",
    sending: "Envoi...",
    submit: "Envoyer",
    success: "Message envoyé. Merci — nous vous répondrons dès que possible.",
    genericError: "Le message n’a pas pu être envoyé. Réessayez dans quelques minutes.",
  },
  de: {
    name: "Name",
    namePlaceholder: "Dein Name",
    email: "E-Mail",
    reason: "Grund",
    reasonPlaceholder: "Option auswählen",
    reasons: ["Support oder Konto", "Zahlungen oder Analysepakete", "Datenschutz oder Daten", "Produkt-Feedback", "Zusammenarbeit", "Anderes Anliegen"],
    message: "Nachricht",
    messagePlaceholder: "Beschreibe kurz, wobei du Hilfe brauchst...",
    safety: "Teile keine Passwörter, Bestätigungscodes oder vollständigen Bankdaten.",
    privacyPrefix: "Wir verwenden diese Angaben nur, um deine Anfrage zu bearbeiten und zu beantworten. Siehe unsere",
    privacyLink: "Datenschutzerklärung",
    required: "Bitte gib mindestens deine E-Mail-Adresse und eine Nachricht an.",
    sending: "Wird gesendet...",
    submit: "Nachricht senden",
    success: "Nachricht gesendet. Danke — wir antworten so bald wie möglich.",
    genericError: "Die Nachricht konnte nicht gesendet werden. Bitte versuche es in einigen Minuten erneut.",
  },
  ar: {
    name: "الاسم",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    reason: "سبب التواصل",
    reasonPlaceholder: "اختر خيارًا",
    reasons: ["الدعم أو الحساب", "المدفوعات أو حزم التحليل", "الخصوصية أو البيانات", "ملاحظات حول المنتج", "التعاون", "سبب آخر"],
    message: "الرسالة",
    messagePlaceholder: "اشرح باختصار ما الذي تحتاجه...",
    safety: "لا تشارك كلمات المرور أو رموز التحقق أو البيانات البنكية الكاملة.",
    privacyPrefix: "سنستخدم هذه البيانات فقط لإدارة طلبك والرد عليه. راجع",
    privacyLink: "سياسة الخصوصية",
    required: "يرجى إدخال بريدك الإلكتروني ورسالة على الأقل حتى نتمكن من مساعدتك.",
    sending: "جارٍ الإرسال...",
    submit: "إرسال الرسالة",
    success: "تم إرسال الرسالة. شكرًا لك — سنرد في أقرب وقت ممكن.",
    genericError: "تعذر إرسال الرسالة. حاول مرة أخرى بعد بضع دقائق.",
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

export default function ContactForm({ locale = "es" }: { locale?: SupportedLocale }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const t = copy[locale];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    const userMessage = String(formData.get("message") || "").trim();

    if (!email || !userMessage) {
      setState("error");
      setMessage(t.required);
      return;
    }

    try {
      setState("sending");
      setMessage(null);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, message: userMessage }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || t.genericError);
      form.reset();
      setState("success");
      setMessage(t.success);
    } catch (error: any) {
      setState("error");
      setMessage(error?.message || t.genericError);
    }
  }

  const isSending = state === "sending";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-slate-300">{t.name}</span>
          <input
            type="text"
            name="name"
            placeholder={t.namePlaceholder}
            className="h-12 rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 text-[15px] text-white outline-none transition placeholder:text-slate-600 focus:border-[#7bb7ff]/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#7bb7ff]/10"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-slate-300">{t.email}</span>
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            required
            className="h-12 rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 text-[15px] text-white outline-none transition placeholder:text-slate-600 focus:border-[#7bb7ff]/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#7bb7ff]/10"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-[13px] font-semibold text-slate-300">{t.reason}</span>
        <select
          name="reason"
          defaultValue=""
          className="h-12 rounded-2xl border border-white/[0.09] bg-[#101522] px-4 text-[15px] text-slate-200 outline-none transition focus:border-[#7bb7ff]/70 focus:ring-4 focus:ring-[#7bb7ff]/10"
        >
          <option value="" disabled>{t.reasonPlaceholder}</option>
          {t.reasons.map((reason) => <option key={reason}>{reason}</option>)}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-[13px] font-semibold text-slate-300">{t.message}</span>
        <textarea
          name="message"
          rows={6}
          required
          placeholder={t.messagePlaceholder}
          className="resize-none rounded-[22px] border border-white/[0.09] bg-white/[0.045] px-4 py-3 text-[15px] leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-[#7bb7ff]/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#7bb7ff]/10"
        />
      </label>

      <div className="space-y-1.5 text-[12px] leading-5 text-slate-500">
        <p>{t.safety}</p>
        <p>
          {t.privacyPrefix}{" "}
          <a href={legalPath(locale, "privacy")} className="font-semibold text-slate-400 underline decoration-slate-700 underline-offset-2 transition hover:text-[#9bc8ff]">
            {t.privacyLink}
          </a>.
        </p>
      </div>

      {message && (
        <div className={["rounded-2xl border px-4 py-3 text-[13px] leading-6", state === "success" ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200" : "border-red-400/20 bg-red-400/[0.08] text-red-200"].join(" ")}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSending}
        className={["inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[14px] font-bold transition active:scale-[0.99]", isSending ? "cursor-wait bg-slate-700 text-slate-400" : "bg-[#7bb7ff] text-[#07142f] shadow-[0_10px_30px_rgba(123,183,255,.18)] hover:-translate-y-0.5 hover:bg-[#a3ceff]"].join(" ")}
      >
        {isSending ? t.sending : t.submit}
        {!isSending && <ArrowIcon />}
      </button>
    </form>
  );
}
