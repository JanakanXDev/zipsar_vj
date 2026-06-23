"use client";

import { useCallback, useContext } from "react";
import type Lenis from "lenis";
import { LenisContext } from "@/components/providers/SmoothScrollProvider";

/** Matches the sections' scroll-mt-24 (6rem) clearance under the fixed nav. */
const NAV_OFFSET = -96;

export interface ScrollToTargetOptions {
  /** Pixel offset from the target. @default -96 (nav clearance) */
  offset?: number;
  /** Seconds. Omit to use Lenis' default easing duration. */
  duration?: number;
  /** Jump without animation (still through Lenis). */
  immediate?: boolean;
  onComplete?: () => void;
}

export interface UseLenisResult {
  /** The live Lenis instance — null under reduced motion or before mount. */
  lenis: Lenis | null;
  /**
   * Smooth-scroll to an element, selector, or pixel position. Falls back
   * to a native jump when Lenis is inactive (reduced motion), where CSS
   * scroll-margin provides the nav clearance.
   *
   * A11y note (§8.4): after navigating to a section, the caller moves
   * focus to the target heading — pass that as `onComplete`.
   */
  scrollTo: (target: string | HTMLElement | number, options?: ScrollToTargetOptions) => void;
}

export function useLenis(): UseLenisResult {
  const lenis = useContext(LenisContext);

  const scrollTo = useCallback(
    (target: string | HTMLElement | number, options: ScrollToTargetOptions = {}) => {
      const { offset = NAV_OFFSET, onComplete, ...rest } = options;

      if (lenis) {
        lenis.scrollTo(target, { offset, onComplete, ...rest });
        return;
      }

      if (typeof target === "number") {
        window.scrollTo(0, target);
      } else {
        const element =
          typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        element?.scrollIntoView();
      }
      onComplete?.();
    },
    [lenis],
  );

  return { lenis, scrollTo };
}
