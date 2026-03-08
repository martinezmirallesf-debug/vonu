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
  stop: () => void;
};

function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function startRealtimeVoice(
  options: RealtimeVoiceOptions = {}
): Promise<RealtimeVoiceConnection> {
  const { onStatus, onError, onEvent, onAssistantFinalText, onUserFinalTranscript } = options;
  let lastDeliveredUserTranscript = "";

  function extractUserTranscriptFromEvent(data: any) {
  // Caso 1: evento directo de transcripción completada
  if (
    (data?.type === "conversation.item.input_audio_transcription.completed" ||
      data?.type === "input_audio_transcription.completed") &&
    typeof data?.transcript === "string" &&
    data.transcript.trim()
  ) {
    return data.transcript.trim();
  }

  // Caso 2: viene dentro de item/content
  const item = data?.item;
  if (item?.role === "user" && Array.isArray(item?.content)) {
    for (const part of item.content) {
      if (typeof part?.transcript === "string" && part.transcript.trim()) {
        return part.transcript.trim();
      }
      if (typeof part?.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  // Caso 3: formato alternativo
  if (typeof data?.item?.formatted?.transcript === "string" && data.item.formatted.transcript.trim()) {
    return data.item.formatted.transcript.trim();
  }

  return "";
}

  const setStatus = (status: RealtimeVoiceStatus) => {
    try {
      onStatus?.(status);
    } catch {}
  };

  try {
    setStatus("connecting");

    // 1) Pedimos client secret a tu backend
    const tokenRes = await fetch("/api/realtime/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const tokenJson = await tokenRes.json().catch(() => null);

    if (!tokenRes.ok) {
      throw new Error(
        tokenJson?.error ||
          tokenJson?.message ||
          "No se pudo crear la sesión realtime."
      );
    }

    const ephemeralKey =
      tokenJson?.client_secret?.value ||
      tokenJson?.value ||
      null;

    if (!ephemeralKey) {
      throw new Error("La respuesta no trae client_secret.value");
    }

    // 2) Creamos conexión WebRTC
    const pc = new RTCPeerConnection();

    // 3) Audio remoto (lo que habla Vonu)
    const remoteAudio = document.createElement("audio");
remoteAudio.autoplay = true;
remoteAudio.setAttribute("playsinline", "true");

    pc.ontrack = (event) => {
      remoteAudio.srcObject = event.streams[0];
      setStatus("speaking");
    };

    // 4) Micrófono local
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

    // 5) Canal de eventos
    const dc = pc.createDataChannel("oai-events");
    let assistantTextBuffer = "";

    dc.addEventListener("open", () => {
      setStatus("connected");

      // Ajustes de sesión una vez abierta
            const sessionUpdate = {
        type: "session.update",
        session: {
          type: "realtime",
          model: "gpt-realtime",
          modalities: ["audio", "text"],
          input_audio_transcription: {
            model: "gpt-4o-mini-transcribe",
          },
          instructions:
            "Eres Vonu. Habla siempre en español de España, con acento castellano neutro y natural. Evita acentos latinoamericanos. Tu tono debe sonar humano, cálido, claro y agradable, nunca robótico. Responde de forma útil, cercana y breve. Si el usuario pide una explicación tipo profesor, explica paso a paso, con claridad y tono didáctico.",
        },
      };

      try {
        dc.send(JSON.stringify(sessionUpdate));
      } catch {}
    });

    dc.addEventListener("message", (event) => {
  const data = safeParseJson(event.data);
  if (!data) return;

  try {
    onEvent?.(data);
  } catch {}

  const userTranscript = extractUserTranscriptFromEvent(data);

  if (userTranscript && userTranscript !== lastDeliveredUserTranscript) {
    lastDeliveredUserTranscript = userTranscript;
    try {
      onUserFinalTranscript?.(userTranscript);
    } catch {}
  }

  // ✅ Usuario empieza a hablar
  if (data.type === "input_audio_buffer.speech_started") {
    setStatus("listening");
  }

  // ✅ También volvemos a connected cuando acaba la voz del usuario
  if (data.type === "input_audio_buffer.speech_stopped") {
    setStatus("connected");
  }

  // ✅ Texto del asistente por transcript de audio
  if (
    data.type === "response.audio_transcript.delta" &&
    typeof data.delta === "string"
  ) {
    assistantTextBuffer += data.delta;
  }

  if (
    data.type === "response.audio_transcript.done" &&
    typeof data.transcript === "string" &&
    data.transcript.trim()
  ) {
    assistantTextBuffer = data.transcript.trim();
  }

  // ✅ Compatibilidad por si llegan eventos de texto “normales”
  if (
    data.type === "response.output_text.delta" &&
    typeof data.delta === "string"
  ) {
    assistantTextBuffer += data.delta;
  }

  if (
    data.type === "response.output_text.done" &&
    typeof data.text === "string" &&
    data.text.trim()
  ) {
    assistantTextBuffer = data.text.trim();
  }

  // ✅ Fallback: algunas respuestas vienen por output[0].content[0].transcript/text
  const out = Array.isArray(data?.response?.output) ? data.response.output : [];
  for (const item of out) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.transcript === "string" && part.transcript.trim()) {
        assistantTextBuffer = part.transcript.trim();
      }
      if (typeof part?.text === "string" && part.text.trim()) {
        assistantTextBuffer = part.text.trim();
      }
    }
  }

  // ✅ Cuando termina la respuesta, volcamos el texto final
  if (
    data.type === "response.done" ||
    data.type === "output_audio_buffer.stopped"
  ) {
    const finalText = assistantTextBuffer.trim();

    if (finalText) {
      try {
        onAssistantFinalText?.(finalText);
      } catch {}
      assistantTextBuffer = "";
    }

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

    // 6) Oferta SDP
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Esperar a que localDescription exista
    if (!pc.localDescription?.sdp) {
      throw new Error("No se pudo generar la oferta WebRTC.");
    }

    // 7) Enviamos SDP a OpenAI Realtime
    const sdpRes = await fetch(
  "https://api.openai.com/v1/realtime?model=gpt-realtime",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/sdp",
    },
    body: pc.localDescription.sdp,
  }
);

    const answerSdp = await sdpRes.text().catch(() => "");

    if (!sdpRes.ok || !answerSdp) {
      throw new Error(
        `No se pudo completar la conexión de voz (HTTP ${sdpRes.status}).`
      );
    }

    await pc.setRemoteDescription({
      type: "answer",
      sdp: answerSdp,
    });

    const stop = () => {
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

    return {
      sendText,
      stop,
    };
  } catch (error: any) {
    setStatus("error");
    onError?.(error?.message || "Error iniciando voz realtime.");
    throw error;
  }
}