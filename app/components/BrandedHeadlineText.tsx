export default function BrandedHeadlineText({ text }: { text: string }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const lastWord = words[words.length - 1];
  const grayStart = Math.max(0, words.length - 3);
  const prefix = words.slice(0, grayStart).join(" ");
  const grayWords = words.slice(grayStart, -1).join(" ");

  const gradient = (
    <span
      className="inline"
      style={{
        backgroundImage: "linear-gradient(92deg, #60A5FA 0%, #38BDF8 35%, #34D399 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
    >
      {lastWord}
    </span>
  );

  if (!prefix) {
    return (
      <span className="block text-slate-400">
        {grayWords ? `${grayWords} ` : ""}
        {gradient}
      </span>
    );
  }

  return (
    <>
      {prefix}
      <span className="block text-slate-400">
        {grayWords ? `${grayWords} ` : ""}
        {gradient}
      </span>
    </>
  );
}
