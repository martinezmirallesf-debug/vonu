import CheckVisualOverrides from "./CheckVisualOverrides";
import type { SupportedLocale } from "@/lib/vonu-check/types";

export default function CheckRuntimeFixes({ locale: _locale }: { locale: SupportedLocale }) {
  return <CheckVisualOverrides />;
}
