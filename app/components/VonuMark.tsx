type VonuMarkProps = {
  className?: string;
  framed?: boolean;
};

export default function VonuMark({ className = "h-8 w-8" }: VonuMarkProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <g fill="#7bb7ff">
        <circle cx="24.6" cy="8.7" r="7.2" />
        <circle cx="8.6" cy="20.1" r="7.2" />
        <circle cx="25.1" cy="31.1" r="7.2" />
        <circle cx="18.7" cy="20.1" r="5.9" />
        <path d="M12.8 16.3 19.7 10.9 24.8 15.4 20.8 20.1 25.4 25.5 20.7 30.1 14.2 23.8Z" />
      </g>
    </svg>
  );
}
