import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
};

const legalLinks = [
  { label: "Aviso legal", href: "/legal/aviso-legal" },
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Términos", href: "/legal/terminos" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Uso responsable", href: "/legal/uso-responsable" },
];

export default function LegalPage({
  title,
  description,
  updatedAt = "Última actualización: septiembre de 2026",
  children,
}: LegalPageProps) {
  return (
    <section className="min-h-screen bg-[#0d101b] text-slate-200">
      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.30fr_0.70fr] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Legal · Vonu
            </div>

            <h1 className="mt-5 max-w-xl text-[42px] font-bold leading-[1.02] tracking-[-0.055em] text-white sm:text-[58px]">
              {title}
            </h1>

            <p className="mt-5 max-w-md text-[16px] leading-7 text-slate-400">
              {description}
            </p>

            <p className="mt-4 text-[12px] text-slate-600">{updatedAt}</p>

            <nav className="mt-7 grid gap-1 rounded-[22px] border border-white/[0.08] bg-[#141927] p-2 text-[14px]">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/es/check"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-[14px] font-bold text-[#07110d] transition hover:bg-emerald-300"
            >
              Volver a Vonu Check
            </Link>
          </aside>

          <article className="rounded-[28px] border border-white/[0.08] bg-[#141927] p-5 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-8 lg:p-10">
            <div className="prose prose-invert max-w-none prose-headings:tracking-[-0.035em] prose-h2:mt-10 prose-h2:text-[28px] prose-h2:leading-tight prose-h2:text-white prose-h3:text-[20px] prose-h3:text-slate-100 prose-p:text-[15px] prose-p:leading-7 prose-p:text-slate-400 prose-li:text-[15px] prose-li:leading-7 prose-li:text-slate-400 prose-strong:text-slate-100 prose-a:text-emerald-300 prose-a:no-underline hover:prose-a:text-emerald-200">
              {children}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
