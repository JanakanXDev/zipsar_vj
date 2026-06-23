"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Motion preference — the single signal every animated component checks
 * (Blueprint §8.2). Defaults to `true` (reduced) during SSR so motion is
 * strictly opt-in after hydration; no animation can run before the real
 * preference is known.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
