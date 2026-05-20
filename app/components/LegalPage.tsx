import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
};

export default function LegalPage({
  title,
  description,
  updatedAt = "Última actualización: mayo de 2026",
  children,
}: LegalPageProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
              Legal
            </p>

            <h1 className="mt-4 max-w-xl text-[48px] font-semibold leading-[0.96] tracking-[-0.07em] text-zinc-950 sm:text-[68px]">
              {title}
            </h1>

            <p className="mt-5 max-w-md text-[17px] leading-8 text-zinc-600">
              {description}
            </p>

            <p className="mt-5 text-[13px] text-zinc-500">{updatedAt}</p>

            <nav className="mt-8 grid gap-2 rounded-[28px] border border-zinc-200 bg-[#f8f9fa] p-2 text-[14px] font-medium text-zinc-600">
              <Link
                href="/legal/aviso-legal"
                className="rounded-2xl px-4 py-3 hover:bg-white hover:text-zinc-950"
              >
                Aviso legal
              </Link>
              <Link
                href="/legal/privacidad"
                className="rounded-2xl px-4 py-3 hover:bg-white hover:text-zinc-950"
              >
                Privacidad
              </Link>
              <Link
                href="/legal/terminos"
                className="rounded-2xl px-4 py-3 hover:bg-white hover:text-zinc-950"
              >
                Términos
              </Link>
              <Link
                href="/legal/cookies"
                className="rounded-2xl px-4 py-3 hover:bg-white hover:text-zinc-950"
              >
                Cookies
              </Link>
              <Link
                href="/legal/uso-responsable"
                className="rounded-2xl px-4 py-3 hover:bg-white hover:text-zinc-950"
              >
                Uso responsable
              </Link>
            </nav>
          </aside>

          <article className="rounded-[36px] border border-zinc-200 bg-[#f8f9fa] p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="prose prose-zinc max-w-none prose-headings:tracking-[-0.04em] prose-h2:text-[30px] prose-h2:leading-tight prose-h2:text-zinc-950 prose-h3:text-[22px] prose-p:text-[16px] prose-p:leading-8 prose-p:text-zinc-650 prose-li:text-[16px] prose-li:leading-8 prose-strong:text-zinc-950">
              {children}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}