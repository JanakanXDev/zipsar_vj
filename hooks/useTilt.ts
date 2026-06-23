"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "./useMediaQuery";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface TiltOptions {
  /** Max tilt in degrees on each axis. @default 6 */
  max?: number;
}

/**
 * 3D tilt-toward-cursor with a cursor-following glow (Blueprint §4.5).
 * Attach the returned ref to the element you want to rotate; its
 * ANCESTOR must establish perspective (e.g. `[perspective:1200px]`).
 *
 * Also writes `--glow-x`, `--glow-y`, `--glow-opacity` to the element so
 * a descendant overlay can render a pointer-tracking glow. Damped via
 * gsap.quickTo. Pointer-fine + motion-OK only; otherwise a no-op (the
 * ref still attaches, the card is simply static).
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const enabled = pointerFine && !reducedMotion;
  const max = options.max ?? 6;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.4, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width; // 0..1
      const py = (event.clientY - rect.top) / rect.height; // 0..1
      rotY((px - 0.5) * 2 * max);
      rotX(-(py - 0.5) * 2 * max);
      el.style.setProperty("--glow-x", `${px * 100}%`);
      el.style.setProperty("--glow-y", `${py * 100}%`);
    };

    const onEnter = () => el.style.setProperty("--glow-opacity", "1");
    const onLeave = () => {
      el.style.setProperty("--glow-opacity", "0");
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { rotationX: 0, rotationY: 0 });
    };
  }, [enabled, max]);

  return ref;
}
