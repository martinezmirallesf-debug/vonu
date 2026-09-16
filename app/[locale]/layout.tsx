import { notFound } from "next/navigation";
import DocumentLocale from "@/app/components/DocumentLocale";
import { isGlobalLocale } from "@/lib/vonu-global/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isGlobalLocale(locale)) notFound();

  return (
    <>
      <DocumentLocale locale={locale} />
      {children}
    </>
  );
}
