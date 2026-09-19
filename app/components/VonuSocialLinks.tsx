type SocialVariant = "mobile" | "footer";

const socials = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/vonuai" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/vonuai/" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@vonu_ai" },
] as const;

function SocialIcon({ network }: { network: (typeof socials)[number]["key"] }) {
  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
        <path d="M13.6 20v-7h2.6l.4-3h-3V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.9v7h3.7Z" fill="currentColor"/>
      </svg>
    );
  }
  if (network === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="17.4" cy="6.8" r="1" fill="currentColor"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M14.2 4.2c.5 2.2 1.8 3.6 4 4v2.7c-1.6 0-3-.5-4-1.4v5.8a4.9 4.9 0 1 1-4.2-4.9v2.8a2.2 2.2 0 1 0 1.4 2.1V4.2h2.8Z" fill="currentColor"/>
    </svg>
  );
}

export default function VonuSocialLinks({ variant }: { variant: SocialVariant }) {
  const mobile = variant === "mobile";
  return (
    <div
      className={mobile ? "mt-3 flex items-center justify-center gap-4" : "ms-1 flex items-center gap-2.5 border-s border-white/[0.08] ps-4"}
      aria-label="Vonu social"
    >
      {socials.map((social) => (
        <a
          key={social.key}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={social.label}
          title={social.label}
          className={[
            "grid shrink-0 place-items-center text-[#7bb7ff] transition hover:text-[#a3ceff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7bb7ff]/45",
            mobile
              ? "h-9 w-9 rounded-xl border border-[#7bb7ff]/15 bg-[#7bb7ff]/[0.055] p-[8px]"
              : "h-6 w-6 rounded-md p-[3px]",
          ].join(" ")}
        >
          <SocialIcon network={social.key} />
        </a>
      ))}
    </div>
  );
}
