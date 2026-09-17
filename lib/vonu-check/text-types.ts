import type { CaptureCheckResult } from "./capture-types";

export type TextCheckResult = Omit<CaptureCheckResult, "version"> & {
  version: "vonu-text-v1";
};
