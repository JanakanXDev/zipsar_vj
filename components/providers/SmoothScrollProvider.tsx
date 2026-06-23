"use client";

import Lenis from "lenis";
import { createContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useExperienceStore } from "@/stores/experienceStore";

export const LenisContext = createContext<Lenis | null>(null);

/**
 * Smooth scroll orchestration (Blueprint §6.4, §9.3):
 * - Lenis on the window scroller, lerp 0.1 — native scroll preserved on
 *   touch devices (no hijacked momentum);
 * - ONE RAF: Lenis is driven by GSAP's ticker, never its own loop;
 * - lag smoothing off so scrub timelines and scroll position can't drift;
 * - every scroll tick updates ScrollTrigger and writes global progress +
 *   velocity to the experience store (§6.3 — the single sync point);
 * - disabled entirely under prefers-reduced-motion: the browser's native
 *   scroll (with CSS scroll-margin anchors) is the designed variant.
 *
 * Plain anchor links keep native jump behavior; enhanced smooth anchor
 * navigation (with focus move, §8.4) goes through useLenis().scrollTo.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    const onScroll = (self: Lenis) => {
      ScrollTrigger.update();
      useExperienceStore.getState().setScroll(self.progress ?? 0, self.velocity ?? 0);
    };
    instance.on("scroll", onScroll);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);
    ScrollTrigger.refresh();

    /* Pins/triggers are measured against the loaded display font — refresh
       once it swaps in so positions stay correct (Blueprint §6.2). */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP defaults
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
