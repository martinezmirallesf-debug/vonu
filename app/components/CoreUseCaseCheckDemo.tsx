"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Mode = "url" | "capture" | "message";

type DemoConfig = {
  mode: Mode;
  input: string;
  result: string;
  score: number;
  signals: [string, string, string];
  nextStep: string;
};

const demos: Record<string, DemoConfig> = {
  "/comprobar-web-fiable": {
    mode: "url",
    input: "https://oferta-ejemplo.shop/producto",
    result: "Precaución antes de pagar",
    score: 68,
    signals: [
      "Dominio reciente y con poco historial verificable",
      "El pago por transferencia reduce la protección del comprador",
      "Tener HTTPS no demuestra que la tienda sea legítima",
    ],
    nextStep: "busca la empresa fuera de la propia web y no pagues hasta verificar quién está detrás y qué opciones de reclamación ofrece.",
  },
  "/comprobar-tienda-online": {
    mode: "url",
    input: "https://superoferta-ejemplo.shop",
    result: "Riesgo elevado antes de comprar",
    score: 76,
    signals: [
      "Precios muy por debajo de lo habitual para productos populares",
      "No aparece una empresa claramente verificable detrás de la tienda",
      "Los métodos de pago disponibles ofrecen poca protección",
    ],
    nextStep: "no completes la compra hasta encontrar datos empresariales verificables, opiniones externas y un método de pago con protección.",
  },
  "/analizar-link-sospechoso": {
    mode: "url",
    input: "https://correos-seguridad-ejemplo.com/entrega",
    result: "Enlace sospechoso: no continúes todavía",
    score: 84,
    signals: [
      "El dominio intenta parecerse al de una entidad conocida",
      "El mensaje asociado usa urgencia para provocar una acción rápida",
      "El destino no coincide con el dominio oficial del servicio",
    ],
    nextStep: "no abras el enlace ni introduzcas datos; entra manualmente en la web o app oficial y comprueba allí si existe realmente el aviso.",
  },
  "/analizar-captura-pantalla": {
    mode: "capture",
    input: "captura-whatsapp-sospechosa.png · 1080 × 2400",
    result: "La captura contiene varias señales de alerta",
    score: 78,
    signals: [
      "El mensaje pide actuar con urgencia y evita que compruebes la información",
      "Solicita datos o un pago desde un canal no verificado",
      "La identidad mostrada en pantalla no basta para confirmar quién escribe",
    ],
    nextStep: "contacta con la entidad o persona por un canal que ya conozcas y verifica la petición antes de responder, pagar o compartir información.",
  },
  "/analizar-sms-estafa": {
    mode: "message",
    input: "“Tu paquete está retenido. Abona 1,99 € hoy para evitar la devolución: entrega-segura-ejemplo.com”",
    result: "Alta probabilidad de intento de phishing",
    score: 89,
    signals: [
      "Combina una cantidad pequeña con urgencia para reducir la desconfianza",
      "El enlace no pertenece al dominio oficial de la empresa mencionada",
      "Pide completar un pago desde un SMS inesperado",
    ],
    nextStep: "no pulses el enlace; comprueba el envío desde la app o web oficial del transportista usando tus propios accesos.",
  },
  "/email-sospechoso-estafa": {
    mode: "message",
    input: "De: seguridad@banco-verificacion-ejemplo.com\nAsunto: Acceso bloqueado · Verifica tu cuenta ahora",
    result: "El correo merece una verificación independiente",
    score: 82,
    signals: [
      "El dominio del remitente no coincide con el dominio oficial del banco",
      "El asunto utiliza amenaza y urgencia para forzar una reacción",
      "Solicita verificar la cuenta desde un enlace recibido por email",
    ],
    nextStep: "no uses los enlaces del correo; abre directamente la app del banco o llama al número oficial para comprobar si existe alguna incidencia.",
  },
  "/detectar-perfil-falso": {
    mode: "capture",
    input: "captura-perfil-social.png · vendedor con 3 publicaciones",
    result: "El perfil necesita más comprobaciones",
    score: 66,
    signals: [
      "Actividad reciente y muy poco historial público",
      "Las imágenes y la identidad mostrada no permiten verificar a la persona",
      "Intenta mover rápidamente la conversación hacia pago o mensajería privada",
    ],
    nextStep: "verifica identidad, antigüedad, referencias y método de pago antes de enviar dinero o datos personales.",
  },
  "/comprobar-inversion-estafa": {
    mode: "message",
    input: "“Rentabilidad garantizada del 3% diario. Recuperas tu capital en semanas. Plazas limitadas: entra hoy.”",
    result: "Señales fuertes de una oferta de inversión peligrosa",
    score: 93,
    signals: [
      "Promete una rentabilidad extraordinaria y prácticamente garantizada",
      "Utiliza escasez y presión temporal para evitar una revisión tranquila",
      "No aporta evidencia suficiente de regulación, riesgos ni entidad responsable",
    ],
    nextStep: "no envíes dinero; comprueba quién ofrece la inversión, su regulación y sus advertencias oficiales antes de continuar.",
  },
};

function UrlIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 8.5h9M7.5 12.5h6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ModeTab({ mode, active, children }: { mode: Mode; active: boolean; children: React.ReactNode }) {
  const Icon = mode === "url" ? UrlIcon : mode === "capture" ? CaptureIcon : MessageIcon;
  return (
    <div className={["flex items-center justify-center gap-2 px-2 pb-4", active ? "border-b-2 border-sky-400 text-slate-100" : "text-slate-500"].join(" ")}>
      <Icon />
      <span>{children}</span>
    </div>
  );
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      card: "border-rose-300/20 bg-gradient-to-b from-rose-300/[0.12] to-rose-300/[0.035] shadow-[0_10px_30px_rgba(251,113,133,0.08)]",
      label: "text-rose-200/65",
      value: "text-rose-200",
      suffix: "text-rose-100/55",
      bar: "bg-gradient-to-r from-rose-300 to-orange-200",
      dot: "bg-rose-300",
    };
  }

  return {
    card: "border-amber-300/20 bg-gradient-to-b from-amber-300/[0.12] to-amber-300/[0.035] shadow-[0_10px_30px_rgba(251,191,36,0.08)]",
    label: "text-amber-200/65",
    value: "text-amber-200",
    suffix: "text-amber-100/55",
    bar: "bg-gradient-to-r from-amber-300 to-yellow-200",
    dot: "bg-amber-300",
  };
}

function Demo({ config }: { config: DemoConfig }) {
  const tone = scoreTone(config.score);

  return (
    <div className="mx-auto mt-14 max-w-[1040px] sm:mt-18" data-vonu-check-demo="core">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] shadow-[0_35px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <div className="flex items-center justify-end border-b border-white/[0.07] px-4 py-3 sm:px-6">
          <span className="text-[11px] font-medium tracking-[0.06em] text-slate-500">VONU CHECK</span>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/[0.07] p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <div className="grid grid-cols-3 border-b border-white/[0.07] text-[12px] font-semibold sm:text-[13px]">
              <ModeTab mode="url" active={config.mode === "url"}>Enlace</ModeTab>
              <ModeTab mode="capture" active={config.mode === "capture"}>Captura</ModeTab>
              <ModeTab mode="message" active={config.mode === "message"}>Mensaje</ModeTab>
            </div>

            <div className="mt-6 min-h-[58px] whitespace-pre-line rounded-2xl border border-white/[0.08] bg-[#070a11] px-4 py-4 text-left text-[14px] leading-6 text-slate-500 shadow-inner">
              {config.input}
            </div>

            <a href="/es/check" className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-emerald-400 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition hover:bg-emerald-300 active:scale-[.99]">
              Analizar ahora
            </a>

            <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
              Ejemplo visual · El análisis real se realiza en Vonu Check.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Resultado</p>
                <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.045em] text-white sm:text-[30px]">{config.result}</h2>
              </div>

              <div className={["min-w-[94px] shrink-0 rounded-[18px] border px-3.5 py-3", tone.card].join(" ")}>
                <p className={["text-[9px] font-bold uppercase tracking-[0.18em]", tone.label].join(" ")}>Score</p>
                <div className="mt-1 flex items-end gap-1 leading-none">
                  <span className={["text-[29px] font-semibold tracking-[-0.055em]", tone.value].join(" ")}>{config.score}</span>
                  <span className={["pb-1 text-[10px] font-semibold", tone.suffix].join(" ")}>/100</span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className={["h-full rounded-full", tone.bar].join(" ")} style={{ width: `${config.score}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {config.signals.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3.5 text-left text-[13px] leading-6 text-slate-300">
                  <span className={["mt-1.5 h-2 w-2 shrink-0 rounded-full", index === 2 ? "bg-slate-500" : tone.dot].join(" ")} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-left text-[13px] leading-6 text-slate-500">
              Siguiente paso: {config.nextStep}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoreUseCaseCheckDemo({ pathname }: { pathname: string }) {
  const config = demos[pathname];
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!config) return;

    const heroInner = document.querySelector<HTMLElement>(
      'main > section:first-of-type > div[class*="max-w-[1500px]"]',
    );
    if (!heroInner) return;

    const legacyDemo = Array.from(heroInner.children).find((element) =>
      element instanceof HTMLElement && element.classList.contains("max-w-5xl"),
    ) as HTMLElement | undefined;

    if (legacyDemo) {
      legacyDemo.dataset.vonuLegacyDemo = "hidden";
      legacyDemo.style.display = "none";
    }

    setTarget(heroInner);

    return () => {
      if (legacyDemo) {
        legacyDemo.style.display = "";
        delete legacyDemo.dataset.vonuLegacyDemo;
      }
      setTarget(null);
    };
  }, [config, pathname]);

  if (!config || !target) return null;
  return createPortal(<Demo config={config} />, target);
}
