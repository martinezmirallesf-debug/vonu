type VonuMarkProps = {
  className?: string;
  framed?: boolean;
};

export default function VonuMark({ className = "h-7 w-7", framed = false }: VonuMarkProps) {
  const mark = (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <path
        d="M32 9 46.5 17.5v17L32 43 17.5 34.5v-17L32 9Z"
        fill="rgba(16,185,129,.08)"
        stroke="#34d399"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M32 13.5 41.8 19 32 24.4 22.2 19 32 13.5Z" stroke="rgba(110,231,183,.75)" strokeWidth="1.7" />
      <path d="M22.2 19v10.9L32 35.5l9.8-5.6V19M32 24.4v11.1" stroke="rgba(110,231,183,.58)" strokeWidth="1.7" />
      <path d="M32 5.8c3.1 0 5.2 1.7 5.2 4.1 0 1.5-.8 2.7-2 3.5h-6.4c-1.3-.8-2-2-2-3.5 0-2.4 2.1-4.1 5.2-4.1Z" fill="#34d399" />
      <path d="M14.9 21.8 9.5 19.4c-2.1-.9-4.5.7-4 3 .4 2.1 2.5 3.4 4.5 2.7l5.1-1.8M49.1 21.8l5.4-2.4c2.1-.9 4.5.7 4 3-.4 2.1-2.5 3.4-4.5 2.7l-5.1-1.8" stroke="#34d399" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M20 36.2 15.4 41c-1.6 1.7-.8 4.5 1.5 5 1.9.4 3.8-.7 4.4-2.5l1.7-5M44 36.2l4.6 4.8c1.6 1.7.8 4.5-1.5 5-1.9.4-3.8-.7-4.4-2.5l-1.7-5" stroke="#34d399" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M27.5 44.8h9L32 51.5l-4.5-6.7Z" fill="#34d399" opacity=".9" />
      <circle cx="30.1" cy="9.6" r=".8" fill="#07110d" />
      <circle cx="33.9" cy="9.6" r=".8" fill="#07110d" />
    </svg>
  );

  if (!framed) return mark;

  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] shadow-[0_0_28px_rgba(52,211,153,.08)]">
      {mark}
    </span>
  );
}
