"use client";

import { useEffect } from "react";
import type { SupportedLocale } from "@/lib/vonu-check/types";

type EntitlementSnapshot = {
  freeUsed: boolean;
  creditsRemaining: number;
  lifetimeAnalyses: number;
};

type Copy = {
  analyze: string;
  analyzeFree: string;
  freeAvailable: string;
  freeUsed: string;
  creditsAvailable: (count: number) => string;
  unknown: string;
  unknownSummary: string;
  technical: string;
  checkedUrl: string;
  unavailable: string;
  limitations: string;
  unavailableLimitation: string;
  noScore: string;
  newCheck: string[];
};

const copy: Record<SupportedLocale, Copy> = {
  es: {
    analyze: "Analizar ahora",
    analyzeFree: "Analizar gratis",
    freeAvailable: "1 análisis gratuito disponible",
    freeUsed: "Análisis gratuito utilizado",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "análisis disponible" : "análisis disponibles"}`,
    unknown: "No concluyente",
    unknownSummary: "No hemos podido revisar suficiente contenido para dar una conclusión fiable. Esto no implica por sí solo que sea una estafa; revisa el motivo técnico que aparece abajo.",
    technical: "Qué hemos comprobado",
    checkedUrl: "URL comprobada",
    unavailable: "No disponible",
    limitations: "Qué no hemos podido comprobar",
    unavailableLimitation: "No hemos podido acceder al contenido de la web, así que no hemos podido revisar sus páginas, formularios ni otros elementos visibles.",
    noScore: "No se ha calculado una puntuación porque no hemos podido obtener datos suficientes. El resultado no concluyente no confirma ni descarta una estafa.",
    newCheck: ["Nueva comprobación"],
  },
  en: {
    analyze: "Analyse now",
    analyzeFree: "Analyse for free",
    freeAvailable: "1 free analysis available",
    freeUsed: "Free analysis used",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analysis available" : "analyses available"}`,
    unknown: "Inconclusive",
    unknownSummary: "We could not review enough content to give a reliable conclusion. This does not by itself mean the site is a scam; check the technical reason shown below.",
    technical: "What we checked",
    checkedUrl: "Checked URL",
    unavailable: "Unavailable",
    limitations: "What we could not check",
    unavailableLimitation: "We could not access the website content, so we could not inspect its pages, forms or other visible elements.",
    noScore: "No score was calculated because we could not obtain enough data. An inconclusive result neither confirms nor rules out a scam.",
    newCheck: ["New check"],
  },
  fr: {
    analyze: "Analyser",
    analyzeFree: "Analyser gratuitement",
    freeAvailable: "1 analyse gratuite disponible",
    freeUsed: "Analyse gratuite utilisée",
    creditsAvailable: (count) => `${count}/3 ${count === 1 ? "analyse disponible" : "analyses disponibles"}`,
    unknown: "Non concluant",
    unknownSummary: "Nous n’avons pas pu examiner assez de contenu pour donner une conclusion fiable. Cela ne signifie pas à lui seul qu’il s’agit d’une arnaque ; consultez la raison technique indiquée ci-dessous.",
    technical: "Ce que nous avons vérifié",
    checkedUrl: "URL vérifiée",
    unavailable: "Indisponible",
    limitations: "Ce que nous n’avons pas pu vérifier",
    unavailableLimitation: "Nous n’avons pas pu accéder au contenu du site ; ses pages, formulaires et autres éléments visibles n’ont donc pas pu être examinés.",
    noScore: "Aucun score n’a été calculé faute de données suffisantes. Un résultat non concluant ne confirme ni n’exclut une arnaque.",
    newCheck: ["Nouvelle vérification"],
  },
  de: {
    analyze: "Jetzt analysieren",
    analyzeFree: "Kostenlos analysieren",
    freeAvailable: "1 kostenlose Analyse verfügbar",
    freeUsed: "Kostenlose Analyse genutzt",
    creditsAvailable: (count) => `${count}/3 Analysen verfügbar`,
    unknown: "Nicht eindeutig",
    unknownSummary: "Wir konnten nicht genug Inhalt prüfen, um eine verlässliche Schlussfolgerung zu geben. Das bedeutet für sich allein nicht, dass die Website betrügerisch ist; prüfe den unten angegebenen technischen Grund.",
    technical: "Was wir geprüft haben",
    checkedUrl: "Geprüfte URL",
    unavailable: "Nicht verfügbar",
    limitations: "Was wir nicht prüfen konnten",
    unavailableLimitation: "Wir konnten nicht auf den Inhalt der Website zugreifen und deshalb ihre Seiten, Formulare oder andere sichtbare Elemente nicht prüfen.",
    noScore: "Es wurde keine Punktzahl berechnet, weil nicht genügend Daten vorlagen. Ein nicht eindeutiges Ergebnis bestätigt einen Betrug weder noch schließt es ihn aus.",
    newCheck: ["Neue Prüfung", "Neue Überprüfung"],
  },
  ar: {
    analyze: "حلّل الآن",
    analyzeFree: "حلّل مجانًا",
    freeAvailable: "تحليل مجاني واحد متاح",
    freeUsed: "تم استخدام التحليل المجاني",
    creditsAvailable: (count) => `${count}/3 تحليلات متاحة`,
    unknown: "غير حاسم",
    unknownSummary: "لم نتمكن من مراجعة محتوى كافٍ لإعطاء نتيجة موثوقة. هذا لا يعني بحد ذاته أن الموقع احتيالي؛ راجع السبب التقني الموضح أدناه.",
    technical: "ما الذي تحققنا منه",
    checkedUrl: "الرابط الذي تم فحصه",
    unavailable: "غير متاح",
    limitations: "ما الذي لم نتمكن من التحقق منه",
    unavailableLimitation: "لم نتمكن من الوصول إلى محتوى الموقع، لذلك تعذر فحص صفحاته ونماذجه والعناصر الظاهرة الأخرى.",
    noScore: "لم يتم احتساب درجة لعدم توفر بيانات كافية. النتيجة غير الحاسمة لا تؤكد الاحتيال ولا تستبعده.",
    newCheck: ["فحص جديد", "تحقق جديد"],
  },
};

const analyzeLabels = new Set(
  Object.values(copy).flatMap((item) => [item.analyze, item.analyzeFree]),
);

const subjectModeByLabel = new Map<string, "url" | "capture" | "text">([
  ["Enlace analizado", "url"],
  ["Analysed link", "url"],
  ["Lien analysé", "url"],
  ["Analysierter Link", "url"],
  ["الرابط الذي تم تحليله", "url"],
  ["Captura analizada", "capture"],
  ["Analysed screenshot", "capture"],
  ["Capture analysée", "capture"],
  ["Analysierter Screenshot", "capture"],
  ["لقطة الشاشة التي تم تحليلها", "capture"],
  ["Mensaje analizado", "text"],
  ["Analysed message", "text"],
  ["Message analysé", "text"],
  ["Analysierte Nachricht", "text"],
  ["الرسالة التي تم تحليلها", "text"],
]);

function currentLocale(): SupportedLocale | null {
  const match = window.location.pathname.match(/^\/(es|en|fr|de|ar)\/check\/?$/);
  return match ? (match[1] as SupportedLocale) : null;
}

function entitlementFromData(data: any): EntitlementSnapshot {
  return {
    freeUsed: Boolean(data?.free_used),
    creditsRemaining: Math.max(0, Number(data?.credits_remaining || 0)),
    lifetimeAnalyses: Math.max(0, Number(data?.lifetime_analyses || 0)),
  };
}

function setText(element: Element | null | undefined, value: string) {
  if (element && (element.textContent || "").trim() !== value) element.textContent = value;
}

export default function CheckExperienceController() {
  useEffect(() => {
    const initialLocale = currentLocale();
    if (!initialLocale) return;

    let cancelled = false;
    let entitlement: EntitlementSnapshot | null = null;
    let resultWasVisible = false;
    let frame: number | null = null;

    function balanceLabel(locale: SupportedLocale, snapshot: EntitlementSnapshot) {
      const t = copy[locale];
      if (!snapshot.freeUsed && snapshot.creditsRemaining <= 0) return t.freeAvailable;
      if (snapshot.creditsRemaining > 0) return t.creditsAvailable(snapshot.creditsRemaining);
      if (snapshot.lifetimeAnalyses >= 4) return t.creditsAvailable(0);
      return t.freeUsed;
    }

    function applyBalance(locale: SupportedLocale) {
      if (!entitlement) return;
      const t = copy[locale];
      const button = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((candidate) => {
        const label = (candidate.textContent || "").trim();
        return candidate.dataset.vonuAnalyzeCta === "true" || analyzeLabels.has(label);
      });
      if (!button) return;

      button.dataset.vonuAnalyzeCta = "true";
      const freeAvailable = !entitlement.freeUsed && entitlement.creditsRemaining <= 0;
      setText(button, freeAvailable ? t.analyzeFree : t.analyze);

      const row = button.parentElement;
      let status = row?.querySelector<HTMLElement>('[data-vonu-entitlement-status="true"]') || null;
      if (!status) status = row?.querySelector<HTMLElement>("div span") || null;
      if (status) {
        status.dataset.vonuEntitlementStatus = "true";
        setText(status, balanceLabel(locale, entitlement));
      }
    }

    function applySubjectIcons() {
      document.querySelectorAll<HTMLElement>("main > section").forEach((section) => {
        const label = section.querySelector<HTMLElement>(":scope > div:nth-child(2) > p:first-child");
        const mode = subjectModeByLabel.get((label?.textContent || "").trim());
        if (mode && section.dataset.vonuSubjectMode !== mode) section.dataset.vonuSubjectMode = mode;
      });
    }

    function applyInconclusivePolish(locale: SupportedLocale) {
      const t = copy[locale];
      const riskHeading = Array.from(document.querySelectorAll<HTMLHeadingElement>("h1")).find(
        (heading) => (heading.textContent || "").trim() === t.unknown,
      );
      if (!riskHeading) return;

      const technicalHeading = Array.from(document.querySelectorAll<HTMLHeadingElement>("h2")).find(
        (heading) => (heading.textContent || "").trim() === t.technical,
      );
      const technicalSection = technicalHeading?.closest("section");
      const rows = technicalSection ? Array.from(technicalSection.querySelectorAll<HTMLElement>("dl > div")) : [];
      if (rows.length < 5) return;

      const responseValue = (rows[1].querySelector("dd")?.textContent || "").trim();
      if (responseValue !== t.unavailable) return;

      setText(riskHeading.nextElementSibling, t.unknownSummary);
      setText(rows[0].querySelector("dt"), t.checkedUrl);
      setText(rows[2].querySelector("dd"), t.unavailable);
      setText(rows[3].querySelector("dd"), t.unavailable);
      setText(rows[4].querySelector("dd"), t.unavailable);

      const limitationsHeading = Array.from(document.querySelectorAll<HTMLHeadingElement>("h2")).find(
        (heading) => (heading.textContent || "").trim() === t.limitations,
      );
      const limitation = limitationsHeading?.closest("section")?.querySelector("li");
      if (limitation) setText(limitation, `• ${t.unavailableLimitation}`);

      const newCheckButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
        (button) => t.newCheck.includes((button.textContent || "").trim()),
      );
      setText(newCheckButton?.parentElement?.querySelector("p"), t.noScore);
    }

    function hasResult(locale: SupportedLocale) {
      const labels = copy[locale].newCheck;
      return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).some((button) =>
        labels.includes((button.textContent || "").trim()),
      );
    }

    async function refreshEntitlement() {
      if (cancelled || !currentLocale()) return;
      try {
        const response = await fetch("/api/check/entitlement", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (cancelled || !response.ok || !data) return;
        entitlement = entitlementFromData(data);
        window.dispatchEvent(new CustomEvent("vonu:entitlement", { detail: entitlement }));
        const locale = currentLocale();
        if (locale) applyBalance(locale);
      } catch {
        // Server-side metering remains authoritative if the balance refresh fails.
      }
    }

    function applyAll() {
      frame = null;
      if (cancelled) return;
      const locale = currentLocale();
      if (!locale) return;

      applyBalance(locale);
      applySubjectIcons();
      applyInconclusivePolish(locale);

      const visible = hasResult(locale);
      if (visible && !resultWasVisible) void refreshEntitlement();
      resultWasVisible = visible;
    }

    function scheduleApply() {
      if (frame != null) return;
      frame = window.requestAnimationFrame(applyAll);
    }

    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const onFocus = () => void refreshEntitlement();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refreshEntitlement();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    scheduleApply();
    void refreshEntitlement();

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame != null) window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
