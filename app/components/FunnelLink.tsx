"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  event: string;
  className?: string;
  children: ReactNode;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export default function FunnelLink({ href, event, className, children, properties }: Props) {
  const isCheckDestination = /^\/(?:es|en|fr|de|ar)\/check(?:[/?#]|$)/.test(href) || href === "/check";

  function handleClick(_: MouseEvent<HTMLAnchorElement>) {
    track(event, properties || {});
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", event, properties || {});
    }
  }

  if (isCheckDestination) {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
