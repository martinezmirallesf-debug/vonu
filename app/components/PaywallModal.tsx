"use client";

import React from "react";

type PaywallModalProps = {
  paywallOpen: boolean;
  closePaywall: () => void;

  billing: "monthly" | "yearly" | "topup";
  setBilling: React.Dispatch<
    React.SetStateAction<"monthly" | "yearly" | "topup">
  >;

  plan: "free" | "plus" | "max";
  setPlan: React.Dispatch<
    React.SetStateAction<"free" | "plus" | "max">
  >;

  payLoading: boolean;
  payMsg: string | null;

  isPro: boolean;

  startCheckout: (chosen: {
    plan: "plus" | "max";
    billing: "monthly" | "yearly";
  }) => void;

  startTopupCheckout: (pack: "basic" | "medium" | "large") => void;
  cancelSubscriptionFromHere: () => void;

  ShieldIcon: React.ComponentType<{ className?: string }>;
};

export default function PaywallModal({
  paywallOpen,
  closePaywall,
  billing,
  setBilling,
  plan,
  setPlan,
  payLoading,
  payMsg,
  isPro,
  startCheckout,
  startTopupCheckout,
  cancelSubscriptionFromHere,
  ShieldIcon,
}: PaywallModalProps) {
  if (!paywallOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closePaywall}
        aria-hidden="true"
      />

      <div
        className="relative h-full w-full flex items-center justify-center px-3 py-3"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui" }}
      >
        <div
          className="w-full max-w-[980px] rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)] border border-zinc-200 overflow-hidden"
          style={{ height: "min(760px, calc(var(--vvh, 100dvh) - 24px))" }}
        >
          <div className="flex h-full flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
  <div className="flex items-center gap-2 min-w-0">
    <img
      src="/logo/vonu-mark-black.png?v=1"
      alt="Vonu"
      className="h-7 w-7 shrink-0 object-contain"
      draggable={false}
    />
    <span className="font-sans text-[18px] leading-none tracking-[-0.03em] text-zinc-900 font-semibold">
      VonuAI
    </span>
  </div>

  <button
    onClick={closePaywall}
    className="h-10 w-10 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 cursor-pointer shrink-0 p-0 grid place-items-center"
    aria-label="Cerrar"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  </button>
</div>

            {/* CONTENIDO FIJO CON SCROLL INTERNO */}
            <div className="px-4 md:px-5 py-4 flex-1 overflow-y-auto">
              {/* TABS */}
              <div className="grid grid-cols-3 gap-1 rounded-full border border-zinc-200 p-1 bg-white w-full">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`h-10 rounded-full text-[14px] font-semibold transition-colors ${
                    billing === "monthly"
                      ? "bg-blue-600 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Mensual
                </button>

                <button
                  onClick={() => setBilling("yearly")}
                  className={`h-10 rounded-full text-[14px] font-semibold transition-colors ${
                    billing === "yearly"
                      ? "bg-blue-600 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Anual
                </button>

                <button
                  onClick={() => setBilling("topup")}
                  className={`h-10 rounded-full text-[14px] font-semibold transition-colors ${
                    billing === "topup"
                      ? "bg-blue-600 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Recargas
                </button>
              </div>

              {/* PLANES */}
              {billing !== "topup" && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                  <button
                    onClick={() => setPlan("free")}
                    disabled={!!payLoading}
                    className={[
                      "w-full text-left rounded-[22px] border px-4 py-4 transition-all h-full flex flex-col",
                      plan === "free"
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Gratis
                    </div>
                    <div className="mt-1 text-[28px] leading-none font-extrabold tracking-tight text-zinc-900">
                      0€
                    </div>

                    <div className="mt-4 space-y-2 text-[13px] text-zinc-800">
                      <div>20 mensajes al mes</div>
                      <div>Analiza mensajes y situaciones</div>
                      <div>Pruébalo sin compromiso</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPlan("plus")}
                    disabled={!!payLoading}
                    className={[
                      "w-full text-left rounded-[22px] border px-4 py-4 transition-all h-full flex flex-col",
                      plan === "plus"
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Plus
                    </div>
                    <div className="mt-1 text-[31px] leading-none font-extrabold tracking-tight text-zinc-900">
                      {billing === "monthly" ? "9,99€" : "79,99€"}
                    </div>

                    <div className="mt-4 space-y-2 text-[13px] text-zinc-800">
                      <div>250 mensajes al mes</div>
                      <div>15 min de voz</div>
                      <div>Modo tutor</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPlan("max")}
                    disabled={!!payLoading}
                    className={[
                      "w-full text-left rounded-[22px] border px-4 py-4 transition-all h-full flex flex-col",
                      plan === "max"
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Max
                    </div>
                    <div className="mt-1 text-[31px] leading-none font-extrabold tracking-tight text-zinc-900">
                      {billing === "monthly" ? "19,99€" : "159,99€"}
                    </div>

                    <div className="mt-4 space-y-2 text-[13px] text-zinc-800">
                      <div>800 mensajes al mes</div>
                      <div>45 min de voz</div>
                      <div>Uso intensivo</div>
                    </div>
                  </button>
                </div>
              )}

              {/* RECARGAS */}
              {billing === "topup" && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                  <div className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 h-full flex flex-col min-h-[300px]">
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Recarga básica
                    </div>

                    <div className="mt-1 text-[31px] leading-none font-extrabold tracking-tight text-zinc-900">
                      2,99€
                    </div>

                    <div className="mt-4 space-y-2.5 text-[13px] text-zinc-800">
                      <div>50 mensajes extra</div>
                      <div>5 min de voz</div>
                      <div>Pago único</div>
                      <div>Vuelve a tener margen enseguida</div>
                    </div>

                    <button
                      onClick={() => startTopupCheckout("basic")}
                      className="mt-auto w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold"
                    >
                      Comprar
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 h-full flex flex-col min-h-[300px]">
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Recarga media
                    </div>

                    <div className="mt-1 text-[31px] leading-none font-extrabold tracking-tight text-zinc-900">
                      6,99€
                    </div>

                    <div className="mt-4 space-y-2.5 text-[13px] text-zinc-800">
                      <div>150 mensajes extra</div>
                      <div>15 min de voz</div>
                      <div>Pago único</div>
                      <div>La opción más equilibrada</div>
                    </div>

                    <button
                      onClick={() => startTopupCheckout("medium")}
                      className="mt-auto w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold"
                    >
                      Comprar
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-zinc-200 bg-white px-4 py-4 h-full flex flex-col min-h-[300px]">
                    <div className="text-[15px] font-semibold text-zinc-900">
                      Recarga grande
                    </div>

                    <div className="mt-1 text-[31px] leading-none font-extrabold tracking-tight text-zinc-900">
                      14,99€
                    </div>

                    <div className="mt-4 space-y-2.5 text-[13px] text-zinc-800">
                      <div>400 mensajes extra</div>
                      <div>40 min de voz</div>
                      <div>Pago único</div>
                      <div>La mejor para uso intensivo</div>
                    </div>

                    <button
                      onClick={() => startTopupCheckout("large")}
                      className="mt-auto w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              )}

              {payMsg ? (
                <div className="mt-4 rounded-[16px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] text-zinc-700 leading-5">
                  {payMsg}
                </div>
              ) : null}
            </div>

            {/* FOOTER FIJO */}
            <div className="px-4 md:px-5 pb-4 pt-3 bg-white shrink-0 border-t border-zinc-100">
              <div className="min-h-[48px] flex items-center justify-center">
                {billing !== "topup" ? (
                  <button
                    onClick={() => {
                      if (payLoading) return;

                      if (plan === "free") {
                        closePaywall();
                        return;
                      }

                      startCheckout({ plan, billing });
                    }}
                    className="w-full md:w-[360px] h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold transition-colors cursor-pointer disabled:opacity-50 block mx-auto"
                    disabled={!!payLoading}
                  >
                    {payLoading
                      ? "Procesando…"
                      : plan === "free"
                      ? "Volver al chat"
                      : "Empezar ahora"}
                  </button>
                ) : null}
              </div>

              <div className="mt-2 min-h-[20px] text-center text-[12px] text-zinc-500">
                {billing === "topup"
                  ? "Elige una recarga para continuar usando Vonu."
                  : "Cancela cuando quieras"}
              </div>

              <div className="mt-2 min-h-[18px] flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <span className="text-blue-700">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                <span>Pago seguro con Stripe.</span>
              </div>

              {isPro && billing !== "topup" ? (
                <button
                  onClick={cancelSubscriptionFromHere}
                  className="mt-3 w-full h-10 rounded-full border border-red-200 hover:bg-red-50 text-[12px] text-red-700 cursor-pointer disabled:opacity-50"
                  disabled={!!payLoading}
                >
                  Cancelar suscripción
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}