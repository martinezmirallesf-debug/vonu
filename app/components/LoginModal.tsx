"use client";

import React from "react";

type UsageInfo = {
  plan_id: string;
  messages_used: number;
  messages_limit: number;
  messages_left: number;
  realtime_seconds_used: number;
  realtime_seconds_limit: number;
  realtime_seconds_left: number;
};

type AuthCardMode = "signin" | "signup";

type LoginModalProps = {
  loginOpen: boolean;
  setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isLoggedIn: boolean;
  loginSending: boolean;
  loginMsg: string | null;
  setLoginMsg: React.Dispatch<React.SetStateAction<string | null>>;

  authMode: AuthCardMode;
  setAuthMode: React.Dispatch<React.SetStateAction<AuthCardMode>>;

  loginEmail: string;
  setLoginEmail: React.Dispatch<React.SetStateAction<string>>;

  loginPassword: string;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;

  keepSignedIn: boolean;
  setKeepSignedIn: React.Dispatch<React.SetStateAction<boolean>>;

  authUserName: string | null;
  authUserEmail: string | null;
  authLoading: boolean;
  proLoading: boolean;
  usageInfo: UsageInfo | null;

  loginEmailRef: React.RefObject<HTMLInputElement | null>;

  signInWithPassword: () => void;
  signUpWithPassword: () => void;
  signInWithOAuth: (provider: "google" | "azure") => void;
  logout: () => Promise<void>;

  OAuthLogo: React.ComponentType<{
    src: string;
    alt: string;
    invert?: boolean;
  }>;
};

export default function LoginModal({
  loginOpen,
  setLoginOpen,
  isLoggedIn,
  loginSending,
  loginMsg,
  setLoginMsg,
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  keepSignedIn,
  setKeepSignedIn,
  authUserName,
  authUserEmail,
  authLoading,
  proLoading,
  usageInfo,
  loginEmailRef,
  signInWithPassword,
  signUpWithPassword,
  signInWithOAuth,
  logout,
  OAuthLogo,
}: LoginModalProps) {
  if (!loginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-sm flex items-center justify-center px-6"
      onClick={() => (!loginSending ? setLoginOpen(false) : null)}
    >
      <div
        className="w-full max-w-[380px] rounded-[20px] bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.18)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoggedIn ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-semibold text-zinc-900">
                  Sesión iniciada
                </div>
                <div className="text-[12.5px] text-zinc-500 mt-1">
                  Estás dentro. Aquí tienes tu estado.
                </div>
              </div>

              <button
                onClick={() => {
                  setLoginOpen(false);
                  setLoginMsg(null);
                }}
                className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                aria-label="Cerrar"
              >
                <span className="text-[18px] leading-none relative top-[-0.5px]">
                  ×
                </span>
              </button>
            </div>

            <div className="mt-5 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="text-[12px] text-zinc-500">Cuenta</div>
              <div className="mt-1 text-[14px] font-semibold text-zinc-900 truncate">
                {authUserName ?? "Usuario"}
              </div>
              <div className="text-[12px] text-zinc-600 truncate">
                {authUserEmail ?? "Email no disponible"}
              </div>

              <div className="mt-2 text-[12px] text-zinc-600">
                Plan:{" "}
                <span className="font-semibold text-zinc-900">
                  {authLoading || proLoading
                    ? "comprobando…"
                    : usageInfo?.plan_id === "plus"
                    ? "Plus"
                    : usageInfo?.plan_id === "max"
                    ? "Max"
                    : "Gratis"}
                </span>
              </div>

              <div className="mt-3 rounded-[12px] border border-zinc-200 bg-white px-3 py-3">
                <div className="text-[11px] text-zinc-500">Uso mensual</div>

                {usageInfo ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="text-zinc-600">Mensajes restantes</span>
                      <span className="font-semibold text-zinc-900">
                        {usageInfo.messages_left}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="text-zinc-600">
                        Minutos de voz restantes
                      </span>
                      <span className="font-semibold text-zinc-900">
                        {Math.max(
                          0,
                          Math.floor((usageInfo.realtime_seconds_left ?? 0) / 60)
                        )}{" "}
                        min
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-[12px] text-zinc-500">
                    Cargando uso mensual…
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={async () => {
                  await logout();
                  setLoginMsg(null);
                  setLoginOpen(false);
                }}
                className="flex-1 h-11 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
              <button
                onClick={() => {
                  setLoginOpen(false);
                  setLoginMsg(null);
                }}
                className="flex-1 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Volver
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-semibold text-zinc-900">
                  {authMode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
                </div>
                <div className="text-[12.5px] text-zinc-500 mt-1">
                  {authMode === "signin"
                    ? "para continuar"
                    : "crea tu cuenta para continuar"}
                </div>
              </div>

              <button
                onClick={() => {
                  setLoginOpen(false);
                  setLoginMsg(null);
                }}
                className="h-9 w-9 aspect-square rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 grid place-items-center cursor-pointer p-0"
                aria-label="Cerrar"
                disabled={!!loginSending}
              >
                <span className="text-[18px] leading-none relative top-[-0.5px]">
                  ×
                </span>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="text-[12px] text-zinc-600 mb-1">Email</div>
                <input
                  ref={loginEmailRef}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                  placeholder="tuemail@ejemplo.com"
                  autoFocus={false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }
                    if (e.key === "Enter") {
                      authMode === "signin"
                        ? signInWithPassword()
                        : signUpWithPassword();
                    }
                  }}
                />
              </div>

              <div>
                <div className="text-[12px] text-zinc-600 mb-1">
                  Contraseña
                </div>
                <input
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  type="password"
                  className="w-full h-11 rounded-[14px] border border-zinc-300 px-4 text-sm outline-none focus:border-zinc-400"
                  placeholder="••••••••"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setLoginOpen(false);
                      setLoginMsg(null);
                    }
                    if (e.key === "Enter") {
                      authMode === "signin"
                        ? signInWithPassword()
                        : signUpWithPassword();
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[12px] text-zinc-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Mantener sesión
                </label>

                <button
                  className="text-[12px] text-blue-700 hover:text-blue-800 cursor-pointer"
                  onClick={() =>
                    setLoginMsg(
                      "Si has olvidado tu contraseña, por ahora crea una cuenta nueva con otro email (lo mejoraremos)."
                    )
                  }
                  disabled={!!loginSending}
                >
                  ¿OLVIDASTE LA CONTRASEÑA?
                </button>
              </div>

              {loginMsg && (
                <div className="whitespace-pre-wrap text-[12px] text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-[14px] px-3 py-2">
                  {loginMsg}
                </div>
              )}

              <button
                onClick={
                  authMode === "signin" ? signInWithPassword : signUpWithPassword
                }
                className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                disabled={!!loginSending}
              >
                {loginSending
                  ? "Procesando…"
                  : authMode === "signin"
                  ? "INICIAR SESIÓN"
                  : "CREAR CUENTA"}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-zinc-200" />
                <div className="text-[12px] text-zinc-500">o</div>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <button
                onClick={() => signInWithOAuth("google")}
                className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!!loginSending}
              >
                <OAuthLogo src="/auth/Google.png" alt="Google" />
                Continuar con Google
              </button>

              <button
                onClick={() => signInWithOAuth("azure")}
                className="w-full h-11 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!!loginSending}
              >
                <OAuthLogo src="/auth/Microsoft.png" alt="Microsoft" />
                Continuar con Microsoft
              </button>

              <div className="text-[12px] text-zinc-600 text-center pt-1">
                {authMode === "signin" ? (
                  <>
                    ¿No tienes cuenta?{" "}
                    <button
                      className="text-blue-700 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        setAuthMode("signup");
                        setLoginMsg(null);
                      }}
                      disabled={!!loginSending}
                    >
                      Crear cuenta
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{" "}
                    <button
                      className="text-blue-700 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        setAuthMode("signin");
                        setLoginMsg(null);
                      }}
                      disabled={!!loginSending}
                    >
                      Iniciar sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}