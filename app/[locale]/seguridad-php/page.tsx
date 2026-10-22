import { notFound, permanentRedirect } from "next/navigation";
import { isGlobalLocale } from "@/lib/vonu-global/i18n";
import { phpSecurityPath } from "@/lib/vonu-global/php-security";

/** Preserve old inbound links, but use one canonical, localized slug for each language. */
type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return ["es", "en", "fr", "de", "ar"].map(locale => ({ locale }));
}

export default async function LegacyPhpSecurityRoute({ params }: Props) {
  const { locale } = await params;
  if (!isGlobalLocale(locale)) notFound();
  permanentRedirect(phpSecurityPath(locale));
}
