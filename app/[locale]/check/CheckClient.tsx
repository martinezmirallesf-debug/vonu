"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { copy, localeMeta, supportedLocales } from "@/lib/vonu-check/i18n";
import type { SupportedLocale, WebCheckResult } from "@/lib/vonu-check/types";

function riskClasses(level: WebCheckResult["risk"]["level"]) {
  if (level === "high") return "border-red-200 bg-red-50 text-red-800";
  if (level === "caution") return "border-amber-200 bg-amber-50 text-amber-900";
  if (level === "low") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  return "border-zinc-200 bg-zinc-50 text-zinc-800";
}

function signalClasses(tone: WebCheckResult["signals"][number]["tone"]) {
  if (tone === "negative") return "border-red-200 bg-red-50";
  if (tone === "warning") return "border-amber-200 bg-amber-50";
  if (tone === "positive") return "border-emerald-200 bg-emerald-50";
  return "border-zinc-200 bg-zinc-50";
}

export default function CheckClient({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  const meta = localeMeta[locale];
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<WebCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const riskLabel = useMemo(() => {
    if (!result) return "";
    return t[result.risk.level];
  }, [result, t]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/check/web", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, locale }),
      });
      if (!response.ok) throw new Error("check_failed");
      const data = (await response.json()) as WebCheckResult;
      setResult(data);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir={meta.dir} className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={`/${locale}/check`} className="text-lg font-black tracking-[-0.04em]">VONU</Link>
          <nav className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
            {supportedLocales.map((item) => (
              <Link
                key={item}
                href={`/${item}/check`}
                className={`rounded-full px-2.5 py-1.5 transition hover:bg-zinc-100 ${item === locale ? "bg-zinc-950 text-white hover:bg-zinc-950" : ""}`}
              >
                {localeMeta[item].label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold tracking-[0.22em] text-blue-600">{t.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
            {t.heading}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            {t.subheading}
          </p>

          <form onSubmit={submit} className="mx-auto mt-9 max-w-3xl rounded-[28px] border border-zinc-200 bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder={t.placeholder}
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="min-h-14 flex-1 rounded-[20px] border-0 bg-zinc-50 px-5 text-base outline-none ring-0 placeholder:text-zinc-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="min-h-14 rounded-[20px] bg-zinc-950 px-6 text-sm font-bold text-white transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? t.checking : t.button}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-500">
            <span>🔒 {t.privacy}</span>
            <span>✓ {t.firstFree}</span>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {result && (
          <section className="mx-auto mt-12 max-w-5xl space-y-6">
            <div className={`rounded-[30px] border p-6 sm:p-8 ${riskClasses(result.risk.level)}`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">{t.result}</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{riskLabel}</h2>
                  <p className="mt-2 break-all text-sm opacity-70">{result.facts.hostname}</p>
                </div>
                <div className="shrink-0">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] opacity-60">{t.score}</div>
                  <div className="mt-1 text-5xl font-black tracking-[-0.06em]">{result.risk.score}<span className="text-lg font-bold opacity-50">/100</span></div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[30px] border border-zinc-200 bg-white p-6 sm:p-8">
                <h3 className="text-xl font-bold tracking-[-0.03em]">{t.signals}</h3>
                <div className="mt-5 space-y-3">
                  {result.signals.map((item) => (
                    <article key={`${item.id}-${item.detail}`} className={`rounded-2xl border p-4 ${signalClasses(item.tone)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-zinc-700">{item.detail}</p>
                        </div>
                        {item.weight > 0 && <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-zinc-600">+{item.weight}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="rounded-[30px] border border-zinc-200 bg-white p-6 sm:p-8">
                <h3 className="text-xl font-bold tracking-[-0.03em]">{t.facts}</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div><dt className="font-semibold text-zinc-500">{t.finalUrl}</dt><dd className="mt-1 break-all font-medium">{result.facts.finalUrl}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">{t.httpStatus}</dt><dd className="mt-1 font-medium">{result.facts.httpStatus ?? "—"}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">{t.redirects}</dt><dd className="mt-1 font-medium">{result.facts.redirects}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">{t.https}</dt><dd className="mt-1 font-medium">{result.facts.usesHttps ? "✓" : "✕"}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">{t.pageTitleLabel}</dt><dd className="mt-1 font-medium">{result.facts.title || "—"}</dd></div>
                  <div><dt className="font-semibold text-zinc-500">{t.forms}</dt><dd className="mt-1 font-medium">{result.facts.formCount}</dd></div>
                </dl>
              </aside>
            </div>

            <div className="rounded-[26px] border border-zinc-200 bg-zinc-100 p-5 text-sm leading-6 text-zinc-600 sm:p-6">
              <p>{t.disclaimer}</p>
              <p className="mt-2 font-medium text-zinc-700">{t.noCertification}</p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
