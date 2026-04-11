export type RealtimeVoiceStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "speaking"
  | "error"
  | "closed";

type RealtimeVoiceOptions = {
  onStatus?: (status: RealtimeVoiceStatus) => void;
  onError?: (message: string) => void;
  onEvent?: (event: any) => void;
  onAssistantFinalText?: (text: string) => void;
  onUserFinalTranscript?: (text: string) => void;
};

export type RealtimeVoiceConnection = {
  sendText: (text: string) => void;
  sendContext: (text: string, triggerResponse?: boolean) => void;
  stop: () => void;
};

function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function pickTranscriptFromContentArray(content: any[]): string {
  if (!Array.isArray(content)) return "";

  for (const part of content) {
    const transcript = cleanText(part?.transcript);
    if (transcript) return transcript;

    const text = cleanText(part?.text);
    if (text) return text;
  }

  return "";
}

function extractUserTranscriptFromEvent(data: any): string {
  if (!data || typeof data !== "object") return "";

  if (
    data?.type === "conversation.item.input_audio_transcription.completed" &&
    cleanText(data?.transcript)
  ) {
    return cleanText(data.transcript);
  }

  const item = data?.item;
  if (item?.role === "user" && item?.status === "completed") {
    const fromContent = pickTranscriptFromContentArray(item?.content);
    if (fromContent) return fromContent;

    const formattedTranscript = cleanText(item?.formatted?.transcript);
    if (formattedTranscript) return formattedTranscript;

    const directTranscript = cleanText(item?.transcript);
    if (directTranscript) return directTranscript;

    const directText = cleanText(item?.text);
    if (directText) return directText;
  }

  return "";
}

function extractAssistantTranscriptFromEvent(
  data: any
): {
  delta?: string;
  done?: string;
} {
  if (!data || typeof data !== "object") return {};

  if (
    data?.type === "response.output_audio_transcript.delta" &&
    typeof data?.delta === "string"
  ) {
    return { delta: data.delta };
  }

  if (
    data?.type === "response.output_audio_transcript.done" &&
    cleanText(data?.transcript)
  ) {
    return { done: cleanText(data.transcript) };
  }

  if (
    data?.type === "response.output_text.delta" &&
    typeof data?.delta === "string"
  ) {
    return { delta: data.delta };
  }

  if (
    data?.type === "response.output_text.done" &&
    cleanText(data?.text)
  ) {
    return { done: cleanText(data.text) };
  }

  const item = data?.item;
  if (item?.role === "assistant") {
    const fromContent = pickTranscriptFromContentArray(item?.content);
    if (fromContent) return { done: fromContent };

    const formattedTranscript = cleanText(item?.formatted?.transcript);
    if (formattedTranscript) return { done: formattedTranscript };

    const directTranscript = cleanText(item?.transcript);
    if (directTranscript) return { done: directTranscript };

    const directText = cleanText(item?.text);
    if (directText) return { done: directText };
  }

  const out = Array.isArray(data?.response?.output) ? data.response.output : [];
  for (const itemOut of out) {
    const content = Array.isArray(itemOut?.content) ? itemOut.content : [];
    const fromContent = pickTranscriptFromContentArray(content);
    if (fromContent) return { done: fromContent };
  }

  return {};
}

export async function startRealtimeVoice(
  options: RealtimeVoiceOptions = {}
): Promise<RealtimeVoiceConnection> {
  const {
    onStatus,
    onError,
    onEvent,
    onAssistantFinalText,
    onUserFinalTranscript,
  } = options;

  let lastDeliveredUserTranscript = "";
  let lastDeliveredAssistantTranscript = "";
  let assistantTextBuffer = "";
  let stopped = false;

  const setStatus = (status: RealtimeVoiceStatus) => {
    try {
      onStatus?.(status);
    } catch {}
  };

  try {
    setStatus("connecting");

    const tokenRes = await fetch("/api/realtime/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const tokenJson = await tokenRes.json().catch(() => null);

    if (!tokenRes.ok) {
      const details =
        tokenJson?.details?.error?.message ||
        tokenJson?.details?.message ||
        tokenJson?.message ||
        tokenJson?.error ||
        `No se pudo crear la sesión realtime (HTTP ${tokenRes.status}).`;

      throw new Error(details);
    }

    const ephemeralKey = tokenJson?.client_secret?.value || tokenJson?.value || null;

    if (!ephemeralKey) {
      throw new Error("La respuesta no trae client_secret.value");
    }

    const pc = new RTCPeerConnection();

    const remoteAudio = document.createElement("audio");
    remoteAudio.autoplay = true;
    remoteAudio.setAttribute("playsinline", "true");

    pc.ontrack = async (event) => {
      console.log("[Realtime ontrack] remote stream received", event);

      remoteAudio.srcObject = event.streams[0];
      remoteAudio.muted = false;
      remoteAudio.volume = 1;

      remoteAudio.onplaying = () => {
        console.log("[Realtime audio] onplaying");
        setStatus("speaking");
      };

      remoteAudio.onended = () => {
        console.log("[Realtime audio] onended");
        setStatus("connected");
      };

      try {
        await remoteAudio.play();
        console.log("[Realtime audio] play() OK");
      } catch (err) {
        console.warn("[Realtime audio play error]", err);
      }
    };

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    for (const track of localStream.getTracks()) {
      pc.addTrack(track, localStream);
    }

    const dc = pc.createDataChannel("oai-events");

    dc.addEventListener("open", () => {
      setStatus("connected");

      const sessionUpdate = {
        type: "session.update",
        session: {
          type: "realtime",
          instructions:
            "Eres Vonu. Habla siempre en español de España, con tono natural, cercano, claro y humano. Usa acento castellano neutro. Evita sonar robótico. Sé útil y breve. Si el usuario pide ayuda para estudiar o explicar algo, enséñalo paso a paso con tono didáctico.",
        },
      };

      try {
        dc.send(JSON.stringify(sessionUpdate));
      } catch {}
    });

    dc.addEventListener("message", (event) => {
      const data = safeParseJson(event.data);
      if (!data) return;

      console.log("[Realtime event]", data?.type, data);

      if (data?.type === "session.updated") {
        console.log("[Realtime] session updated OK", data);
      }

      try {
        onEvent?.(data);
      } catch {}

      if (data?.type === "error") {
        const msg =
          cleanText(data?.error?.message) ||
          cleanText(data?.message) ||
          "Error en la sesión realtime.";

        try {
          onError?.(msg);
        } catch {}
      }

      if (data?.type === "input_audio_buffer.speech_started") {
        setStatus("listening");
      }

      if (
        data?.type === "input_audio_buffer.speech_stopped" ||
        data?.type === "input_audio_buffer.committed"
      ) {
        setStatus("connected");
      }

      const userTranscript = extractUserTranscriptFromEvent(data);
      if (userTranscript && userTranscript !== lastDeliveredUserTranscript) {
        lastDeliveredUserTranscript = userTranscript;
        try {
          onUserFinalTranscript?.(userTranscript);
        } catch {}
      }

      const assistant = extractAssistantTranscriptFromEvent(data);

      if (assistant.delta) {
        assistantTextBuffer += assistant.delta;
      }

      if (assistant.done) {
        assistantTextBuffer = assistant.done;
      }

      if (data?.type === "response.done") {
        const finalText = cleanText(assistantTextBuffer);

        if (finalText && finalText !== lastDeliveredAssistantTranscript) {
          lastDeliveredAssistantTranscript = finalText;
          try {
            onAssistantFinalText?.(finalText);
          } catch {}
        }

        assistantTextBuffer = "";
        setStatus("connected");
      }
    });

    pc.addEventListener("connectionstatechange", () => {
      const state = pc.connectionState;

      if (state === "connected") setStatus("connected");

      if (state === "failed" || state === "disconnected") {
        setStatus("error");
      }

      if (state === "closed") {
        setStatus("closed");
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    if (!pc.localDescription?.sdp) {
      throw new Error("No se pudo generar la oferta WebRTC.");
    }

    const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp",
      },
      body: pc.localDescription.sdp,
    });

    const answerSdp = await sdpRes.text().catch(() => "");

    if (!sdpRes.ok || !answerSdp) {
      throw new Error(
        answerSdp?.trim()
          ? `No se pudo completar la conexión de voz (HTTP ${sdpRes.status}): ${answerSdp}`
          : `No se pudo completar la conexión de voz (HTTP ${sdpRes.status}).`
      );
    }

    await pc.setRemoteDescription({
      type: "answer",
      sdp: answerSdp,
    });

    const stop = () => {
  if (stopped) return;
  stopped = true;

  try {
    dc.close();
  } catch {}

  try {
    pc.getSenders().forEach((sender) => {
      try {
        sender.track?.stop();
      } catch {}
    });
  } catch {}

  try {
    pc.close();
  } catch {}

  try {
    localStream.getTracks().forEach((t) => t.stop());
  } catch {}

  try {
    remoteAudio.pause();
  } catch {}

  try {
    if (remoteAudio.srcObject) {
      const tracks = (remoteAudio.srcObject as MediaStream).getTracks?.() || [];
      tracks.forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
    }
  } catch {}

  setStatus("closed");
};

const sendText = (text: string) => {
  const clean = (text || "").trim();
  if (!clean || dc.readyState !== "open") return;

  const createItem = {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: clean,
        },
      ],
    },
  };

  const createResponse = {
    type: "response.create",
  };

  try {
    dc.send(JSON.stringify(createItem));
    dc.send(JSON.stringify(createResponse));
  } catch {}
};

const sendContext = (text: string, triggerResponse = false) => {
  const clean = (text || "").trim();
  if (!clean || dc.readyState !== "open") return;

  const contextItem = {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: clean,
        },
      ],
    },
  };

  try {
    dc.send(JSON.stringify(contextItem));

    if (triggerResponse) {
      dc.send(
        JSON.stringify({
          type: "response.create",
          response: {
            instructions:
              "Responde ahora al usuario en español de España, de forma natural y útil, basándote en el contexto que acabas de recibir. No digas que no has visto la imagen. No repitas que vas a analizarla: ya está analizada. Describe lo que se ve con claridad y sigue la conversación con normalidad.",
          },
        })
      );
    }
  } catch {}
};

return {
  sendText,
  sendContext,
  stop,
};
  } catch (error: any) {
    setStatus("error");
    try {
      onError?.(error?.message || "Error iniciando voz realtime.");
    } catch {}
    throw error;
  }
}