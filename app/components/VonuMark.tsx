type VonuMarkProps = {
  className?: string;
  framed?: boolean;
};

export default function VonuMark({ className = "h-8 w-8" }: VonuMarkProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 3.8 33.8 11v18L20 36.2 6.2 29V11L20 3.8Z"
        fill="rgba(16,185,129,.035)"
        stroke="#34d399"
        strokeWidth="2.65"
        strokeLinejoin="round"
      />
      <path
        d="M13.2 11.2 20 7.7l6.8 3.5M9.7 17.2 20 12l10.3 5.2M9.7 22.8 20 28l10.3-5.2M13.2 28.8 20 32.3l6.8-3.5"
        stroke="rgba(110,231,183,.5)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
