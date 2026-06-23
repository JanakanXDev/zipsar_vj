"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, STAGGER } from "@/components/experience/choreography/motion.tokens";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

type AnimatedTextTag = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "blockquote";

export interface AnimatedTextProps {
  /** Plain string only — guarantees a clean split and a faithful sr copy. */
  children: string;
  as?: AnimatedTextTag;
  /**
   * `words` for narrative copy; `chars` reserved for short scene titles
   * only (Blueprint §6.5 — readability over flash).
   */
  split?: "words" | "chars";
  /** Seconds before the reveal starts once in view. */
  delay?: number;
  /** Per-unit stagger in seconds. Defaults to the design-system token. */
  stagger?: number;
  /** Portion of the element visible before triggering. */
  threshold?: number;
  className?: string;
  id?: string;
}

/**
 * Word/char cascade reveal, aria-safe per Blueprint §6.5:
 * a sr-only copy carries the real text (always in the DOM — SEO and
 * screen readers see plain prose), while the animated fragments are
 * aria-hidden. Server-rendered fully visible; hidden just before first
 * paint on capable clients; inert under prefers-reduced-motion.
 */
export function AnimatedText({
  children,
  as: Tag = "p",
  split = "words",
  delay = 0,
  stagger,
  threshold = 0.25,
  className,
  id,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const units = container.querySelectorAll<HTMLSpanElement>("[data-animate-unit]");
    if (units.length === 0) return;

    gsap.set(units, { opacity: 0, yPercent: 60 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        gsap.to(units, {
          opacity: 1,
          yPercent: 0,
          duration: DURATION.phrase,
          ease: EASE.arrive,
          delay,
          stagger: stagger ?? (split === "chars" ? STAGGER.words / 2 : STAGGER.words),
        });
      },
      { threshold },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(units);
      gsap.set(units, { clearProps: "all" });
    };
  }, [reducedMotion, children, split, delay, stagger, threshold]);

  const parts = split === "words" ? children.split(/(\s+)/) : Array.from(children);

  return (
    <Tag ref={containerRef as React.Ref<never>} id={id} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {parts.map((part, index) =>
          /^\s+$/.test(part) ? (
            part
          ) : (
            <span
              key={index}
              data-animate-unit=""
              className={cn("inline-block will-change-transform", part === " " && "inline")}
            >
              {part === " " ? " " : part}
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
