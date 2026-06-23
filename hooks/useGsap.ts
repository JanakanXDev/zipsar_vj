"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** useLayoutEffect on the client, useEffect during SSR (no warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type GsapEffect = (context: gsap.Context) => void | (() => void);

export interface UseGsapOptions {
  /** Scope element — selector text inside the effect resolves within it. */
  scope?: React.RefObject<HTMLElement | null>;
  /**
   * Designed static variant for prefers-reduced-motion (Blueprint §4.6).
   * When omitted, the effect simply does not run under reduced motion —
   * since timelines animate FROM hidden states, content stays visible.
   */
  reducedEffect?: GsapEffect;
}

/**
 * Foundation animation hook (Blueprint §6.2):
 * - wraps the effect in gsap.matchMedia() so reduced-motion is a designed
 *   variant, not an afterthought — and reacts live to preference changes;
 * - everything created inside is reverted automatically on cleanup
 *   (StrictMode/fast-refresh safe — no orphaned tweens or triggers);
 * - runs in a layout effect, before paint, so initial states never flash.
 */
export function useGsap(
  effect: GsapEffect,
  deps: React.DependencyList = [],
  options: UseGsapOptions = {},
): void {
  const { scope } = options;

  /* Latest-callback refs: changing the callbacks alone must not rebuild
     the animation world — `deps` is the only rebuild signal. */
  const effectRef = useRef(effect);
  effectRef.current = effect;
  const reducedRef = useRef(options.reducedEffect);
  reducedRef.current = options.reducedEffect;

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(scope?.current ?? undefined);

    mm.add("(prefers-reduced-motion: no-preference)", (ctx) =>
      effectRef.current(ctx as gsap.Context),
    );
    mm.add("(prefers-reduced-motion: reduce)", (ctx) => reducedRef.current?.(ctx as gsap.Context));

    return () => mm.revert();
  }, deps); // caller-provided dependency list — the only rebuild signal
}
