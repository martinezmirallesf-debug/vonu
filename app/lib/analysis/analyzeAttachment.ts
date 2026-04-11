export type AttachmentKind =
  | "image"
  | "pdf"
  | "audio"
  | "video"
  | "url"
  | "unknown";

export type AttachmentAnalysisMode = "chat" | "realtime" | "tutor";

export type AttachmentInput = {
  kind: AttachmentKind;
  fileName?: string | null;
  mimeType?: string | null;
  text?: string | null;
  imageBase64?: string | null;
  fileUrl?: string | null;
  userMessage?: string | null;
  conversationText?: string | null;
  mode?: AttachmentAnalysisMode;
};

export type AttachmentAnalysisResult = {
  ok: boolean;
  kind: AttachmentKind;
  summary: string;
  rawText?: string | null;
  confidence: "high" | "medium" | "low";
  needsHumanReview?: boolean;
  source: "vision" | "document" | "audio" | "video" | "url" | "unknown";
  findings?: string[];
  caution?: string | null;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function inferAttachmentKind(input: AttachmentInput): AttachmentKind {
  if (input.kind && input.kind !== "unknown") return input.kind;

  const mime = cleanText(input.mimeType).toLowerCase();
  const name = cleanText(input.fileName).toLowerCase();

  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  if (mime.includes("html") || mime.includes("text/uri-list")) return "url";

  return "unknown";
}

function makeFallbackSummary(kind: AttachmentKind) {
  switch (kind) {
    case "image":
      return "He recibido una imagen, pero todavía no está conectada la ruta real de análisis.";
    case "pdf":
      return "He recibido un PDF, pero todavía no está conectada la ruta real de análisis.";
    case "audio":
      return "He recibido un audio, pero todavía no está conectada la ruta real de análisis.";
    case "video":
      return "He recibido un vídeo, pero todavía no está conectada la ruta real de análisis.";
    case "url":
      return "He recibido un enlace, pero todavía no está conectada la ruta real de análisis.";
    default:
      return "He recibido un archivo, pero todavía no está conectada la ruta real de análisis.";
  }
}

async function analyzeImage(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  return {
    ok: false,
    kind: "image",
    summary: makeFallbackSummary("image"),
    rawText: null,
    confidence: "low",
    needsHumanReview: true,
    source: "vision",
    findings: [],
    caution:
      "Pendiente conectar un único flujo real de visión para evitar duplicidades entre chat y realtime.",
  };
}

async function analyzePdf(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  return {
    ok: false,
    kind: "pdf",
    summary: makeFallbackSummary("pdf"),
    rawText: null,
    confidence: "low",
    needsHumanReview: true,
    source: "document",
    findings: [],
    caution: "Pendiente conectar lectura real de PDF.",
  };
}

async function analyzeAudio(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  return {
    ok: false,
    kind: "audio",
    summary: makeFallbackSummary("audio"),
    rawText: null,
    confidence: "low",
    needsHumanReview: true,
    source: "audio",
    findings: [],
    caution: "Pendiente conectar transcripción/análisis real de audio.",
  };
}

async function analyzeVideo(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  return {
    ok: false,
    kind: "video",
    summary: makeFallbackSummary("video"),
    rawText: null,
    confidence: "low",
    needsHumanReview: true,
    source: "video",
    findings: [],
    caution: "Pendiente conectar análisis real de vídeo.",
  };
}

async function analyzeUrl(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  return {
    ok: false,
    kind: "url",
    summary: makeFallbackSummary("url"),
    rawText: null,
    confidence: "low",
    needsHumanReview: true,
    source: "url",
    findings: [],
    caution: "Pendiente conectar análisis real de URL/web.",
  };
}

export async function analyzeAttachment(
  input: AttachmentInput
): Promise<AttachmentAnalysisResult> {
  const kind = inferAttachmentKind(input);

  switch (kind) {
    case "image":
      return analyzeImage({ ...input, kind });

    case "pdf":
      return analyzePdf({ ...input, kind });

    case "audio":
      return analyzeAudio({ ...input, kind });

    case "video":
      return analyzeVideo({ ...input, kind });

    case "url":
      return analyzeUrl({ ...input, kind });

    default:
      return {
        ok: false,
        kind: "unknown",
        summary: makeFallbackSummary("unknown"),
        rawText: null,
        confidence: "low",
        needsHumanReview: true,
        source: "unknown",
        findings: [],
        caution: "Tipo de adjunto no reconocido todavía.",
      };
  }
}