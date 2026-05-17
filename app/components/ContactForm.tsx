"use client";

import { useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    const userMessage = String(formData.get("message") || "").trim();

    if (!email || !userMessage) {
      setState("error");
      setMessage("Déjanos al menos tu email y un mensaje para poder ayudarte.");
      return;
    }

    try {
      setState("sending");
      setMessage(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          reason,
          message: userMessage,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error || "No se ha podido enviar el mensaje ahora mismo."
        );
      }

      form.reset();
      setState("success");
      setMessage("Mensaje enviado. Gracias, te responderemos lo antes posible.");
    } catch (error: any) {
      setState("error");
      setMessage(
        error?.message ||
          "Ha ocurrido un error enviando el mensaje. Inténtalo de nuevo en unos minutos."
      );
    }
  }

  const isSending = state === "sending";

  return (
    <div className="rounded-[36px] border border-zinc-200 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-zinc-800">
              Nombre
            </span>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              className="h-12 rounded-2xl border border-zinc-200 bg-[#f8f9fa] px-4 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-zinc-800">
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              className="h-12 rounded-2xl border border-zinc-200 bg-[#f8f9fa] px-4 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-[14px] font-semibold text-zinc-800">
            Motivo
          </span>
          <select
            name="reason"
            defaultValue=""
            className="h-12 rounded-2xl border border-zinc-200 bg-[#f8f9fa] px-4 text-[15px] text-zinc-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            <option>Soporte o cuenta</option>
            <option>Pagos, planes o recargas</option>
            <option>Privacidad o datos</option>
            <option>Feedback del producto</option>
            <option>Colaboración</option>
            <option>Otro motivo</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-[14px] font-semibold text-zinc-800">
            Mensaje
          </span>
          <textarea
            name="message"
            rows={7}
            required
            placeholder="Cuéntanos brevemente qué necesitas..."
            className="resize-none rounded-[24px] border border-zinc-200 bg-[#f8f9fa] px-4 py-3 text-[15px] leading-7 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <p className="text-[13px] leading-6 text-zinc-500">
          No compartas contraseñas, códigos de verificación, datos bancarios
          completos ni información extremadamente sensible que no sea necesaria.
        </p>

        {message && (
          <div
            className={[
              "rounded-2xl px-4 py-3 text-[14px] leading-6",
              state === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                : "bg-red-50 text-red-800 border border-red-100",
            ].join(" ")}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className={[
            "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition active:scale-[0.99]",
            isSending
              ? "cursor-wait bg-zinc-500"
              : "bg-zinc-950 hover:scale-[1.01]",
          ].join(" ")}
        >
          {isSending ? "Enviando..." : "Enviar mensaje"}
          {!isSending && <ArrowIcon />}
        </button>
      </form>
    </div>
  );
}