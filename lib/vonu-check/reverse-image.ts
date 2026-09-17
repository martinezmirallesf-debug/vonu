import type { CaptureKind, CaptureSignal } from "./capture-types";
import type { SupportedLocale } from "./types";

export type ReverseImageEvidence = {
  available: boolean;
  fullMatches: number;
  partialMatches: number;
  pagesWithMatches: number;
  visuallySimilar: number;
  bestGuessLabels: string[];
};

const emptyEvidence = (): ReverseImageEvidence => ({
  available: false,
  fullMatches: 0,
  partialMatches: 0,
  pagesWithMatches: 0,
  visuallySimilar: 0,
  bestGuessLabels: [],
});

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function labelsFrom(value: unknown) {
  return asArray(value)
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && typeof item.label === "string") return item.label.trim();
      return "";
    })
    .filter(Boolean)
    .slice(0, 4);
}

function readNumericEvidence(node: any): ReverseImageEvidence | null {
  if (!node || typeof node !== "object" || Array.isArray(node)) return null;
  const hasCountField = [
    "full_matching_images_count",
    "partial_matching_images_count",
    "pages_with_matching_images_count",
    "visually_similar_images_count",
  ].some((key) => key in node);
  if (!hasCountField) return null;

  const n = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
  };

  return {
    available: Boolean(node.checked ?? true),
    fullMatches: n(node.full_matching_images_count),
    partialMatches: n(node.partial_matching_images_count),
    pagesWithMatches: n(node.pages_with_matching_images_count),
    visuallySimilar: n(node.visually_similar_images_count),
    bestGuessLabels: labelsFrom(node.best_guess_labels),
  };
}

function readWebDetection(node: any): ReverseImageEvidence | null {
  if (!node || typeof node !== "object" || Array.isArray(node)) return null;

  const numeric = readNumericEvidence(node);
  if (numeric) return numeric;

  const hasKnownField = [
    "fullMatchingImages",
    "full_matching_images",
    "partialMatchingImages",
    "partial_matching_images",
    "pagesWithMatchingImages",
    "pages_with_matching_images",
    "visuallySimilarImages",
    "visually_similar_images",
    "bestGuessLabels",
    "best_guess_labels",
    "webEntities",
    "web_entities",
  ].some((key) => key in node);

  if (!hasKnownField) return null;

  return {
    available: true,
    fullMatches: asArray(node.fullMatchingImages ?? node.full_matching_images).length,
    partialMatches: asArray(node.partialMatchingImages ?? node.partial_matching_images).length,
    pagesWithMatches: asArray(node.pagesWithMatchingImages ?? node.pages_with_matching_images).length,
    visuallySimilar: asArray(node.visuallySimilarImages ?? node.visually_similar_images).length,
    bestGuessLabels: labelsFrom(node.bestGuessLabels ?? node.best_guess_labels),
  };
}

function mergeEvidence(a: ReverseImageEvidence, b: ReverseImageEvidence): ReverseImageEvidence {
  return {
    available: a.available || b.available,
    fullMatches: Math.max(a.fullMatches, b.fullMatches),
    partialMatches: Math.max(a.partialMatches, b.partialMatches),
    pagesWithMatches: Math.max(a.pagesWithMatches, b.pagesWithMatches),
    visuallySimilar: Math.max(a.visuallySimilar, b.visuallySimilar),
    bestGuessLabels: Array.from(new Set([...a.bestGuessLabels, ...b.bestGuessLabels])).slice(0, 4),
  };
}

export function extractReverseImageEvidence(payload: unknown): ReverseImageEvidence {
  let result = emptyEvidence();
  const seen = new WeakSet<object>();

  function walk(node: any, depth: number) {
    if (!node || typeof node !== "object" || depth > 7) return;
    if (seen.has(node)) return;
    seen.add(node);

    const direct = readWebDetection(node);
    if (direct) result = mergeEvidence(result, direct);

    const nestedCandidates = [
      node.webDetection,
      node.web_detection,
      node.reverseImage,
      node.reverse_image,
      node.reverseImageCheck,
      node.reverse_image_check,
      node.reverseImageRisk,
      node.reverse_image_risk,
      node.googleVision,
      node.google_vision,
      node.vision,
      node.imageAux,
      node.image_aux,
      node.auxiliary,
      node.aux,
    ];

    for (const candidate of nestedCandidates) {
      if (candidate && typeof candidate === "object") walk(candidate, depth + 1);
    }

    for (const response of asArray(node.responses)) {
      if (response && typeof response === "object") walk(response, depth + 1);
    }

    if (depth < 4) {
      for (const [key, value] of Object.entries(node)) {
        if (!value || typeof value !== "object") continue;
        if (/image|vision|reverse|web.?detect|aux/i.test(key)) walk(value, depth + 1);
      }
    }
  }

  walk(payload, 0);
  return result;
}

type ReverseCopy = {
  reused: [string, string];
  partial: [string, string];
  exactCounts: (full: number, pages: number) => string;
  partialCounts: (partial: number, similar: number) => string;
};

const copy: Record<SupportedLocale, ReverseCopy> = {
  es: {
    reused: [
      "La imagen aparece en otros sitios",
      "Google Web Detection ha encontrado coincidencias de esta imagen en la web. Una imagen reutilizada no demuestra fraude por sí sola, pero es especialmente relevante al verificar perfiles, vendedores o identidades.",
    ],
    partial: [
      "Hay imágenes relacionadas en la web",
      "Google Web Detection ha encontrado coincidencias parciales o visualmente similares. Es contexto útil, pero no permite afirmar que la imagen haya sido robada o reutilizada con intención fraudulenta.",
    ],
    exactCounts: (full, pages) => `${full} coincidencias completas · ${pages} páginas`,
    partialCounts: (partial, similar) => `${partial} parciales · ${similar} similares`,
  },
  en: {
    reused: [
      "The image appears elsewhere online",
      "Google Web Detection found matches for this image on the web. Reuse does not prove fraud by itself, but it is especially relevant when checking profiles, sellers or identities.",
    ],
    partial: [
      "Related images exist on the web",
      "Google Web Detection found partial or visually similar matches. This is useful context, but it does not prove the image was stolen or reused fraudulently.",
    ],
    exactCounts: (full, pages) => `${full} full matches · ${pages} pages`,
    partialCounts: (partial, similar) => `${partial} partial · ${similar} similar`,
  },
  fr: {
    reused: [
      "L’image apparaît ailleurs sur le Web",
      "Google Web Detection a trouvé des correspondances de cette image sur le Web. La réutilisation ne prouve pas une fraude à elle seule, mais elle est particulièrement pertinente pour vérifier un profil, un vendeur ou une identité.",
    ],
    partial: [
      "Des images similaires existent sur le Web",
      "Google Web Detection a trouvé des correspondances partielles ou visuellement similaires. C’est un contexte utile, sans prouver que l’image a été volée ou réutilisée frauduleusement.",
    ],
    exactCounts: (full, pages) => `${full} correspondances complètes · ${pages} pages`,
    partialCounts: (partial, similar) => `${partial} partielles · ${similar} similaires`,
  },
  de: {
    reused: [
      "Das Bild erscheint an anderen Stellen im Web",
      "Google Web Detection hat Treffer für dieses Bild gefunden. Wiederverwendung beweist allein keinen Betrug, ist aber bei Profilen, Verkäufern oder Identitäten besonders relevant.",
    ],
    partial: [
      "Ähnliche Bilder sind im Web vorhanden",
      "Google Web Detection hat teilweise oder visuell ähnliche Treffer gefunden. Das ist nützlicher Kontext, beweist aber nicht, dass das Bild gestohlen oder betrügerisch wiederverwendet wurde.",
    ],
    exactCounts: (full, pages) => `${full} vollständige Treffer · ${pages} Seiten`,
    partialCounts: (partial, similar) => `${partial} teilweise · ${similar} ähnlich`,
  },
  ar: {
    reused: [
      "تظهر الصورة في أماكن أخرى على الويب",
      "وجد Google Web Detection تطابقات لهذه الصورة على الويب. إعادة استخدام الصورة لا تثبت الاحتيال بمفردها، لكنها مهمة خصوصاً عند التحقق من الملفات الشخصية أو البائعين أو الهويات.",
    ],
    partial: [
      "توجد صور مرتبطة على الويب",
      "وجد Google Web Detection تطابقات جزئية أو صوراً متشابهة بصرياً. هذا سياق مفيد، لكنه لا يثبت أن الصورة مسروقة أو أعيد استخدامها بقصد احتيالي.",
    ],
    exactCounts: (full, pages) => `${full} تطابقات كاملة · ${pages} صفحات`,
    partialCounts: (partial, similar) => `${partial} جزئية · ${similar} مشابهة`,
  },
};

export function reverseImageSignal(
  locale: SupportedLocale,
  evidence: ReverseImageEvidence,
  kind: CaptureKind,
): CaptureSignal | null {
  if (!evidence.available) return null;

  const exactEvidence = evidence.fullMatches > 0 || evidence.pagesWithMatches > 0;
  if (exactEvidence) {
    const [title, baseDetail] = copy[locale].reused;
    const detail = `${baseDetail} (${copy[locale].exactCounts(evidence.fullMatches, evidence.pagesWithMatches)})`;
    const identitySensitive = kind === "social_profile" || kind === "marketplace";
    return {
      id: "reverse-image-web-match",
      tone: identitySensitive ? "warning" : "neutral",
      weight: identitySensitive ? 10 : 0,
      title,
      detail,
    };
  }

  if (evidence.partialMatches > 0 || evidence.visuallySimilar > 0) {
    const [title, baseDetail] = copy[locale].partial;
    return {
      id: "reverse-image-related",
      tone: "neutral",
      weight: 0,
      title,
      detail: `${baseDetail} (${copy[locale].partialCounts(evidence.partialMatches, evidence.visuallySimilar)})`,
    };
  }

  return null;
}
