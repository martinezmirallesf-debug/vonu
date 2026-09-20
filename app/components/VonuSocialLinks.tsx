type SocialVariant = "mobile" | "footer";

const socials = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/vonuai" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/vonuai/" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@vonu_ai" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@vonuai" },
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
        <rect x="2.9" y="2.9" width="18.2" height="18.2" rx="5.3" stroke="currentColor" strokeWidth="2.05"/>
        <circle cx="12" cy="12" r="4.15" stroke="currentColor" strokeWidth="2.05"/>
        <circle cx="17.55" cy="6.45" r="1.2" fill="currentColor"/>
      </svg>
    );
  }

  if (network === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
        <path d="M21.25 7.15a2.75 2.75 0 0 0-1.94-1.95C17.6 4.75 12 4.75 12 4.75s-5.6 0-7.31.45a2.75 2.75 0 0 0-1.94 1.95A28.7 28.7 0 0 0 2.3 12c0 1.63.15 3.25.45 4.85a2.75 2.75 0 0 0 1.94 1.95c1.71.45 7.31.45 7.31.45s5.6 0 7.31-.45a2.75 2.75 0 0 0 1.94-1.95c.3-1.6.45-3.22.45-4.85s-.15-3.25-.45-4.85Z" fill="currentColor"/>
        <path d="m10.25 15.45 4.65-3.45-4.65-3.45v6.9Z" fill="#0b0e17"/>
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
      className={mobile ? "mt-3 flex items-center justify-center gap-5" : "ms-1 flex items-center gap-2.5 border-s border-white/[0.08] ps-4"}
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
            "grid shrink-0 place-items-center !text-[#7bb7ff] transition hover:!text-[#a3ceff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7bb7ff]/45",
            mobile
              ? "h-8 w-8 p-[4px]"
              : "h-6 w-6 rounded-md p-[3px]",
          ].join(" ")}
        >
          <SocialIcon network={social.key} />
        </a>
      ))}
    </div>
  );
}
