"use client";

import { useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

const resourceTopics = [
  "Guías prácticas",
  "Avances de Vonu",
  "Voz y nuevas funciones",
  "Estudio y tutor",
  "Documentos y contratos",
  "Uso responsable de IA",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline"
      style={{
        backgroundImage:
          "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ResourceSignup({ page = "unknown" }: { page?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (state === "sending") return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!email) {
      setState("error");
      setMessage("Introduce tu email para recibir recursos.");
      return;
    }

    if (!isValidEmail(email)) {
      setState("error");
      setMessage("Revisa el email. Parece que no está completo.");
      return;
    }

    try {
      setState("sending");
      setMessage(null);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          page,
          source: "resource_signup",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "No se ha podido guardar el email.");
      }

      form.reset();
      setState("success");
      setMessage("Perfecto. Te avisaremos cuando haya nuevos recursos útiles.");
    } catch (error: any) {
      setState("error");
      setMessage(
        error?.message ||
          "Ha ocurrido un error. Inténtalo de nuevo en unos minutos."
      );
    }
  }

  const isSending = state === "sending";

  return (
    <section className="border-b border-white/[0.06] bg-[#080b12]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Recursos Vonu
          </p>

          <h2 className="mt-4 max-w-[620px] text-[42px] font-semibold leading-[1] tracking-[-0.055em] text-white sm:text-[62px]">
            Guías y avances para decidir <GradientText>mejor.</GradientText>
          </h2>

          <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-slate-400">
            Recibe contenido útil sobre decisiones digitales, seguridad,
            documentos, voz, estudio, nuevas funciones y formas de usar Vonu con
            más claridad.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_28px_80px_rgba(0,0,0,.22)] sm:p-8">
          <h3 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-[36px]">
            Recursos útiles,
            <span className="block text-slate-500">no ruido.</span>
          </h3>

          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            Guías breves, casos prácticos y avances de producto para revisar
            mejor lo importante antes de actuar.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {resourceTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[13px] text-slate-300"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/[0.10] text-emerald-300">
                  <CheckIcon />
                </span>
                {topic}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]"
          >
            <input
              type="email"
              name="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="tu@email.com"
              aria-label="Email para recibir recursos de Vonu"
              className="h-[50px] w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#070a11] px-4 text-[14px] text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/35 focus:ring-4 focus:ring-emerald-400/10"
            />

            <button
              type="submit"
              disabled={isSending}
              className={[
                "h-[50px] w-full rounded-xl px-5 text-[14px] font-bold text-[#07110d] shadow-[0_9px_26px_rgba(52,211,153,.15)] transition active:scale-[0.99]",
                isSending
                  ? "cursor-wait bg-emerald-300/80"
                  : "bg-emerald-400 hover:bg-emerald-300",
              ].join(" ")}
            >
              {isSending ? "Guardando..." : "Recibir recursos"}
            </button>
          </form>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={[
                "mt-4 rounded-[16px] px-4 py-3 text-[13px] leading-6",
                state === "success"
                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border border-red-400/20 bg-red-400/10 text-red-100",
              ].join(" ")}
            >
              {message}
            </div>
          )}

          <p className="mt-4 text-[12px] leading-5 text-slate-500">
            Sin spam. Solo contenido útil sobre decisiones seguras, producto y
            nuevas funciones. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
}
