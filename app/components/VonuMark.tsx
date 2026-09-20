type VonuMarkProps = {
  className?: string;
  framed?: boolean;
};

export default function VonuMark({ className = "h-8 w-8" }: VonuMarkProps) {
  return (
    <img
      src="/vonu-mark-official.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`block shrink-0 object-contain ${className}`}
    />
  );
}
