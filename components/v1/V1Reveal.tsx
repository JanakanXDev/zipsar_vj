"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { blurReveal } from "@/components/experience/choreography/animations";

export interface V1RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Initial blur (px). @default 8 */
  blur?: number;
  /** Travel distance (px). @default 30 */
  distance?: number;
  /** Start delay (s). */
  delay?: number;
  /**
   * If set, reveals descendant `[data-reveal-item]` elements with this
   * per-item stagger instead of the wrapper itself.
   */
  stagger?: number;
  /** ScrollTrigger start. @default "top 82%" */
  start?: string;
}

/**
 * V1.0 scroll-reveal wrapper — applies the `blurReveal` entrance once the
 * element enters the viewport. Reduced motion: the effect does not run,
 * so content is plainly visible (no inline hidden state).
 */
export function V1Reveal({
  children,
  className,
  blur = 8,
  distance = 30,
  delay = 0,
  stagger,
  start = "top 82%",
}: V1RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;

      if (stagger != null) {
        const items = el.querySelectorAll("[data-reveal-item]");
        if (items.length === 0) return;
        blurReveal(items, {
          blur,
          distance,
          delay,
          stagger,
          scrollTrigger: { trigger: el, start },
        });
      } else {
        blurReveal(el, { blur, distance, delay, scrollTrigger: { trigger: el, start } });
      }
    },
    [],
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
