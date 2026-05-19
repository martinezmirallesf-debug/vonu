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

export default function ResourceSignup({ page = "unknown" }: { page?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setState("error");
      setMessage("Introduce tu email para recibir recursos.");
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
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "No se ha podido guardar el email.");
      }

      form.reset();
      setState("success");
      setMessage(
        "Perfecto. Recibirás nuevos recursos útiles próximamente."
      );
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
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
            Recursos Vonu
          </p>

          <h2 className="mt-3 max-w-2xl text-[42px] font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-[64px]">
            Guías y avances para decidir mejor.
          </h2>

          <p className="mt-5 max-w-xl text-[17px] leading-8 text-zinc-600">
            Recibe contenido útil sobre decisiones digitales, seguridad,
            documentos, voz, estudio, nuevas funciones y formas de usar Vonu con
            más claridad.
          </p>
        </div>

        <div className="rounded-[36px] bg-zinc-950 p-6 text-white sm:p-8">
          <h3 className="text-[28px] font-semibold tracking-[-0.05em]">
            Recibe recursos útiles, no ruido.
          </h3>

          <p className="mt-3 text-[16px] leading-7 text-zinc-300">
            Guías breves, casos prácticos y avances de producto para revisar
            mejor lo importante antes de actuar.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {resourceTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[14px] text-zinc-200"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-400 text-zinc-950">
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
    placeholder="tu@email.com"
    className="h-[48px] w-full min-w-0 rounded-full border border-white/10 bg-white px-5 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400 focus:ring-4 focus:ring-blue-400/20"
  />

  <button
    type="submit"
    disabled={isSending}
    className={[
      "h-[48px] w-full rounded-full px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(26,115,232,0.22)] transition active:scale-[0.99]",
      isSending
        ? "cursor-wait bg-blue-500"
        : "bg-[#1a73e8] hover:scale-[1.01]",
    ].join(" ")}
  >
    {isSending ? "Guardando..." : "Recibir recursos"}
  </button>
</form>

{message && (
  <div
    className={[
      "mt-4 rounded-2xl px-4 py-3 text-[13.5px] leading-6",
      state === "success"
        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
        : "border border-red-400/20 bg-red-400/10 text-red-100",
    ].join(" ")}
  >
    {message}
  </div>
)}

          <p className="mt-4 text-[12.5px] leading-5 text-zinc-400">
            Sin spam. Solo contenido útil sobre decisiones seguras, producto y
            nuevas funciones.
          </p>
        </div>
      </div>
    </section>
  );
}