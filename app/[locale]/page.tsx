import { notFound, redirect } from "next/navigation";
import { isGlobalLocale } from "@/lib/vonu-global/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleEntryPage({ params }: Props) {
  const { locale } = await params;
  if (!isGlobalLocale(locale)) notFound();
  redirect(`/${locale}/check`);
}
