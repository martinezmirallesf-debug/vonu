import Link from "next/link";

export type TrustSeoCheck = {
  title: string;
  text: string;
};

export type TrustSeoSource = {
  name: string;
  text: string;
  href: string;
};

export type TrustSeoRelated = {
  title: string;
  text: string;
  href: string;
};

export default function TrustSeoAuthoritySection({
  eyebrow,
  title,
  intro,
  updatedAt,
  checks,
  sources = [],
  related = [],
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt: string;
  checks: TrustSeoCheck[];
  sources?: TrustSeoSource[];
  related?: TrustSeoRelated[];
}) {
  return (
    <section className="bg-[#f5f5f7]">
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[42px] border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.035),0_16px_44px_rgba(0,0,0,0.055)] sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.055em] text-zinc-950 sm:text-[66px]">
                {title}
              </h2>
              <p className="mt-6 text-[17px] leading-8 text-zinc-600">
                {intro}
              </p>
              <p className="mt-5 text-[13px] font-medium text-zinc-500">
                Actualizado el {updatedAt}
              </p>
            </div>

            <ol className="grid gap-4">
              {checks.map((item, index) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[42px_1fr] gap-4 rounded-[28px] border border-zinc-200 bg-[#f5f5f7] p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-[13px] font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-zinc-600">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {sources.length > 0 ? (
            <div className="mt-10 border-t border-zinc-200 pt-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Fuentes oficiales de referencia
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-[24px] border border-zinc-200 bg-white p-5 transition hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <span className="text-[15px] font-semibold text-zinc-950">
                      {source.name}
                    </span>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-600">
                      {source.text}
                    </p>
                    <span className="mt-3 inline-block text-[13px] font-semibold text-blue-600">
                      Consultar fuente ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {related.length > 0 ? (
            <div className="mt-10 border-t border-zinc-200 pt-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Comprueba según tu caso
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[24px] border border-zinc-200 bg-[#f5f5f7] p-5 transition hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <span className="text-[18px] font-semibold tracking-[-0.03em] text-zinc-950">
                      {item.title}
                    </span>
                    <p className="mt-2 text-[14px] leading-6 text-zinc-600">
                      {item.text}
                    </p>
                    <span className="mt-3 inline-block text-[13px] font-semibold text-blue-600">
                      Ver guía →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
