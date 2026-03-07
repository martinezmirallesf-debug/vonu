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
  const { onStatus, onError, onEvent } = options;

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

    dc.addEventListener("open", () => {
      setStatus("connected");

      // Ajustes de sesión una vez abierta
      const sessionUpdate = {
        type: "session.update",
        session: {
          type: "realtime",
          model: "gpt-realtime",
          modalities: ["audio", "text"],
          instructions:
            "Eres Vonu. Habla en español de España, de forma natural, cálida y clara. Responde de forma útil, cercana y breve. No uses un tono robótico. Si el usuario habla en español, responde en español. Tu función es ayudar a pensar con calma y detectar riesgos antes de actuar.",
        },
      };

      try {
        dc.send(JSON.stringify(sessionUpdate));
      } catch {}
    });

    dc.addEventListener("message", (event) => {
      const data = safeParseJson(event.data);
      if (!data) return;

      onEvent?.(data);

      // Estados útiles para UI
      if (data.type === "input_audio_buffer.speech_started") {
        setStatus("listening");
      }

      if (data.type === "response.audio.delta") {
        setStatus("speaking");
      }

      if (
        data.type === "response.done" ||
        data.type === "output_audio_buffer.stopped"
      ) {
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