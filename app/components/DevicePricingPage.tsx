import Link from "next/link";
import DevicePackCheckoutButton from "./DevicePackCheckoutButton";
import type { SupportedLocale } from "@/lib/vonu-check/types";
import { checkPath } from "@/lib/vonu-global/i18n";
import BrandedHeadlineText from "./BrandedHeadlineText";

const copy: Record<SupportedLocale, {
  eyebrow: string;
  title: string;
  subtitle: string;
  freeTitle: string;
  freePrice: string;
  freeText: string;
  freeFeatures: string[];
  freeCta: string;
  packTitle: string;
  packPrice: string;
  packText: string;
  packFeatures: string[];
  packCta: string;
  note: string;
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
}> = {
  es: {
    eyebrow: "Precios",
    title: "Prueba uno. Paga solo si necesitas más.",
    subtitle: "Sin cuenta, sin suscripción y sin renovación automática.",
    freeTitle: "Primer análisis",
    freePrice: "0 €",
    freeText: "Comprueba una URL, un mensaje o una captura sin registrarte.",
    freeFeatures: ["1 análisis gratuito por navegador/dispositivo", "URLs, mensajes y capturas", "Puntuación de riesgo y señales", "Sin tarjeta para empezar"],
    freeCta: "Hacer mi análisis gratis",
    packTitle: "Pack de 3 análisis",
    packPrice: "3,99 €",
    packText: "Cuando agotes el gratuito, añade tres análisis más con un único pago.",
    packFeatures: ["3 análisis adicionales", "Pago único", "Sin suscripción", "Asociados a este navegador/dispositivo"],
    packCta: "Comprar 3 análisis · 3,99 €",
    note: "Si borras los datos del navegador o cambias de dispositivo, Vonü puede no reconocer los análisis comprados. Conserva el recibo de Stripe por si necesitas soporte.",
    faqTitle: "Lo importante, claro.",
    faqs: [
      { q: "¿Tengo que crear una cuenta?", a: "No. Vonü Check funciona sin registro. El acceso se asocia de forma pseudónima al navegador/dispositivo." },
      { q: "¿Es una suscripción?", a: "No. Los 3,99 € son un pago único por tres análisis adicionales. No hay renovación automática." },
      { q: "¿Puedo volver a comprar otro pack?", a: "Sí. Si consumes los tres análisis, puedes comprar otro pack de tres y se añadirá al mismo navegador/dispositivo." },
      { q: "¿Qué pasa si cambio de móvil o borro las cookies?", a: "Al no existir una cuenta, el nuevo navegador o dispositivo puede no reconocer el saldo anterior. Si has pagado, conserva el recibo para que podamos ayudarte." },
    ],
  },
  en: {
    eyebrow: "Pricing", title: "Try one. Pay only if you need more.", subtitle: "No account, no subscription and no automatic renewal.",
    freeTitle: "First analysis", freePrice: "€0", freeText: "Check one URL, message or screenshot without signing up.",
    freeFeatures: ["1 free analysis per browser/device", "URLs, messages and screenshots", "Risk score and evidence", "No card to start"], freeCta: "Run my free analysis",
    packTitle: "3-analysis pack", packPrice: "€3.99", packText: "After the free analysis, add three more with one payment.",
    packFeatures: ["3 additional analyses", "One-time payment", "No subscription", "Linked to this browser/device"], packCta: "Buy 3 analyses · €3.99",
    note: "If you clear browser data or switch device, Vonü may not recognise purchased analyses. Keep your Stripe receipt for support.", faqTitle: "Simple by design.",
    faqs: [
      { q: "Do I need an account?", a: "No. Vonü Check works without registration. Access is linked pseudonymously to the browser/device." },
      { q: "Is this a subscription?", a: "No. €3.99 is a one-time payment for three additional analyses, with no automatic renewal." },
      { q: "Can I buy another pack later?", a: "Yes. When you use the three analyses, you can buy another pack and it will be added to the same browser/device." },
      { q: "What if I change device or clear cookies?", a: "Without an account, a new browser or device may not recognise the previous balance. Keep your receipt so support can help if needed." },
    ],
  },
  fr: {
    eyebrow: "Tarifs", title: "Essayez une fois. Payez seulement si vous avez besoin de plus.", subtitle: "Sans compte, sans abonnement et sans renouvellement automatique.",
    freeTitle: "Première analyse", freePrice: "0 €", freeText: "Vérifiez une URL, un message ou une capture sans inscription.",
    freeFeatures: ["1 analyse gratuite par navigateur/appareil", "URLs, messages et captures", "Score de risque et signaux", "Aucune carte pour commencer"], freeCta: "Faire mon analyse gratuite",
    packTitle: "Pack de 3 analyses", packPrice: "3,99 €", packText: "Après l'analyse gratuite, ajoutez-en trois avec un paiement unique.",
    packFeatures: ["3 analyses supplémentaires", "Paiement unique", "Sans abonnement", "Liées à ce navigateur/appareil"], packCta: "Acheter 3 analyses · 3,99 €",
    note: "Si vous effacez les données du navigateur ou changez d'appareil, Vonü peut ne plus reconnaître les analyses achetées. Conservez votre reçu Stripe.", faqTitle: "Simple et clair.",
    faqs: [
      { q: "Dois-je créer un compte ?", a: "Non. Vonü Check fonctionne sans inscription. L'accès est associé de manière pseudonyme au navigateur/appareil." },
      { q: "Est-ce un abonnement ?", a: "Non. 3,99 € est un paiement unique pour trois analyses supplémentaires, sans renouvellement automatique." },
      { q: "Puis-je acheter un autre pack ?", a: "Oui. Une fois les trois analyses utilisées, vous pouvez ajouter un nouveau pack au même navigateur/appareil." },
      { q: "Que se passe-t-il si je change d'appareil ?", a: "Sans compte, un nouveau navigateur ou appareil peut ne pas reconnaître l'ancien solde. Conservez votre reçu pour le support." },
    ],
  },
  de: {
    eyebrow: "Preise", title: "Einmal testen. Nur bei Bedarf mehr bezahlen.", subtitle: "Kein Konto, kein Abo und keine automatische Verlängerung.",
    freeTitle: "Erste Analyse", freePrice: "0 €", freeText: "Prüfe eine URL, Nachricht oder einen Screenshot ohne Registrierung.",
    freeFeatures: ["1 kostenlose Analyse pro Browser/Gerät", "URLs, Nachrichten und Screenshots", "Risikowert und Signale", "Keine Karte zum Start"], freeCta: "Kostenlose Analyse starten",
    packTitle: "3-Analysen-Paket", packPrice: "3,99 €", packText: "Nach der Gratisanalyse drei weitere mit einer Einmalzahlung hinzufügen.",
    packFeatures: ["3 zusätzliche Analysen", "Einmalige Zahlung", "Kein Abo", "Mit diesem Browser/Gerät verknüpft"], packCta: "3 Analysen kaufen · 3,99 €",
    note: "Wenn du Browserdaten löschst oder das Gerät wechselst, kann Vonü gekaufte Analysen eventuell nicht erkennen. Bewahre den Stripe-Beleg auf.", faqTitle: "Einfach und klar.",
    faqs: [
      { q: "Brauche ich ein Konto?", a: "Nein. Vonü Check funktioniert ohne Registrierung. Der Zugriff wird pseudonym mit dem Browser/Gerät verknüpft." },
      { q: "Ist das ein Abo?", a: "Nein. 3,99 € ist eine einmalige Zahlung für drei zusätzliche Analysen ohne automatische Verlängerung." },
      { q: "Kann ich später ein weiteres Paket kaufen?", a: "Ja. Nach Verbrauch der drei Analysen kannst du ein weiteres Paket für denselben Browser/dasselbe Gerät kaufen." },
      { q: "Was passiert bei einem Gerätewechsel?", a: "Ohne Konto erkennt ein neuer Browser oder ein neues Gerät das alte Guthaben möglicherweise nicht. Bewahre den Beleg für den Support auf." },
    ],
  },
  ar: {
    eyebrow: "الأسعار", title: "جرّب تحليلاً واحداً. ادفع فقط إذا احتجت المزيد.", subtitle: "بدون حساب أو اشتراك أو تجديد تلقائي.",
    freeTitle: "التحليل الأول", freePrice: "0 €", freeText: "افحص رابطاً أو رسالة أو لقطة شاشة بدون تسجيل.",
    freeFeatures: ["تحليل مجاني واحد لكل متصفح/جهاز", "روابط ورسائل ولقطات شاشة", "درجة المخاطر والإشارات", "لا تحتاج بطاقة للبدء"], freeCta: "ابدأ التحليل المجاني",
    packTitle: "حزمة 3 تحليلات", packPrice: "3.99 €", packText: "بعد التحليل المجاني، أضف ثلاثة تحليلات بدفعة واحدة.",
    packFeatures: ["3 تحليلات إضافية", "دفعة واحدة", "بدون اشتراك", "مرتبطة بهذا المتصفح/الجهاز"], packCta: "شراء 3 تحليلات · 3.99 €",
    note: "إذا حذفت بيانات المتصفح أو غيرت الجهاز، قد لا يتعرف Vonü على التحليلات المشتراة. احتفظ بإيصال Stripe للدعم.", faqTitle: "واضح وبسيط.",
    faqs: [
      { q: "هل أحتاج إلى حساب؟", a: "لا. يعمل Vonü Check بدون تسجيل، ويرتبط الوصول بشكل مستعار بالمتصفح/الجهاز." },
      { q: "هل هذا اشتراك؟", a: "لا. مبلغ 3.99 € هو دفعة واحدة مقابل ثلاثة تحليلات إضافية بدون تجديد تلقائي." },
      { q: "هل يمكنني شراء حزمة أخرى؟", a: "نعم. بعد استخدام التحليلات الثلاثة يمكنك شراء حزمة أخرى وإضافتها إلى نفس المتصفح/الجهاز." },
      { q: "ماذا لو غيرت الجهاز؟", a: "بدون حساب قد لا يتعرف المتصفح أو الجهاز الجديد على الرصيد السابق. احتفظ بالإيصال حتى يمكن للدعم مساعدتك." },
    ],
  },
};

function CheckIcon() {
  return <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300">✓</span>;
}

export default function DevicePricingPage({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  return (
    <main lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#080b12] text-slate-100">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1080px] px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-28">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-[900px] text-[48px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[76px]">
              {locale === "es" ? (
                t.title
              ) : locale === "en" ? (
                <>
                  <span className="block">Try one. Pay only</span>
                  <span className="block text-slate-400">
                    if you need{" "}
                    <span
                      className="inline"
                      style={{
                        backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      more.
                    </span>
                  </span>
                </>
              ) : (
                <BrandedHeadlineText text={t.title} />
              )}
            </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-[17px] leading-8 text-slate-400 sm:text-[19px]">{t.subtitle}</p>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#0a0d15]">
        <div className="mx-auto grid max-w-[980px] gap-5 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <article className="flex min-h-[430px] flex-col rounded-[28px] border border-white/[0.07] bg-white/[0.03] p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.freeTitle}</p>
            <p className="mt-7 text-[56px] font-semibold tracking-[-0.07em] text-white">{t.freePrice}</p>
            <p className="mt-4 text-[14px] leading-7 text-slate-400">{t.freeText}</p>
            <div className="mt-7 mb-3 space-y-3">
              {t.freeFeatures.map((item) => <div key={item} className="flex items-center gap-3 text-[13px] text-slate-300"><CheckIcon /><span>{item}</span></div>)}
            </div>
            <a href={checkPath(locale)} className="mt-auto inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.045] px-5 text-[14px] font-bold text-white hover:bg-white/[0.07]">{t.freeCta}</a>
          </article>

          <article className="relative flex min-h-[430px] flex-col rounded-[28px] border border-emerald-400/30 bg-emerald-400/[0.055] p-7 shadow-[0_26px_80px_rgba(16,185,129,.08)]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">{t.packTitle}</p>
            <p className="mt-7 text-[56px] font-semibold tracking-[-0.07em] text-white">{t.packPrice}</p>
            <p className="mt-4 text-[14px] leading-7 text-slate-400">{t.packText}</p>
            <div className="mt-7 mb-3 space-y-3">
              {t.packFeatures.map((item) => <div key={item} className="flex items-center gap-3 text-[13px] text-slate-300"><CheckIcon /><span>{item}</span></div>)}
            </div>
            <DevicePackCheckoutButton locale={locale} label={t.packCta} className="mt-auto h-12 w-full rounded-xl bg-emerald-400 px-5 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300 disabled:opacity-70" />
          </article>

          <p className="lg:col-span-2 mx-auto max-w-[760px] text-center text-[12px] leading-6 text-slate-500">{t.note}</p>
        </div>
      </section>

      <section className="bg-[#080b12]">
        <div className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center text-[40px] font-semibold tracking-[-0.05em] text-white sm:text-[58px]">{t.faqTitle}</h2>
          <div className="mt-10 space-y-3">
            {t.faqs.map((item) => (
              <details key={item.q} className="rounded-[22px] border border-white/[0.07] bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none text-[17px] font-semibold text-slate-100">{item.q}</summary>
                <p className="mt-4 text-[14px] leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
