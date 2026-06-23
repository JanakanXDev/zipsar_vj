"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, select, textarea, label, [data-cursor='hover']";

/**
 * Custom cursor: dot + trailing ring (Blueprint §4.5). Ring expands over
 * interactive elements. Pointer-fine devices only; never rendered on
 * touch, under prefers-reduced-motion, or before hydration. Purely
 * decorative (aria-hidden) — it never replaces the native focus
 * indicator (§8.4). Mount once, app-wide.
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const enabled = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      if (!shown) {
        shown = true;
        gsap.to(root, { autoAlpha: 1, duration: 0.2 });
      }
    };

    const onOver = (event: PointerEvent) => {
      const interactive = (event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR);
      gsap.to(ring, { scale: interactive ? 1.6 : 1, duration: 0.25, ease: "zip-arrive" });
      gsap.to(dot, { scale: interactive ? 0.5 : 1, duration: 0.25, ease: "zip-arrive" });
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15, ease: "power2.out" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "zip-arrive" });
    const onDocLeave = () => gsap.to(root, { autoAlpha: 0, duration: 0.2 });
    const onDocEnter = () => {
      if (shown) gsap.to(root, { autoAlpha: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onDocLeave);
    document.documentElement.addEventListener("mouseenter", onDocEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.documentElement.removeEventListener("mouseenter", onDocEnter);
      document.documentElement.classList.remove("has-custom-cursor");
      gsap.killTweensOf([root, dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-(--z-cursor) opacity-0"
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 size-10 rounded-full border border-white/80 mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-white mix-blend-difference"
      />
    </div>
  );
}
