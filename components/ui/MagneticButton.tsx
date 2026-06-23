"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Button, type ButtonProps } from "./Button";

export type MagneticButtonProps = ButtonProps & {
  /** Pull factor: 0 = static, 1 = glued to the pointer. */
  strength?: number;
};

/**
 * Button with magnetic hover (Blueprint §4.5). The element drifts toward
 * the pointer and snaps back elastically on leave. Pointer-fine devices
 * only; inert under prefers-reduced-motion and on touch.
 */
export function MagneticButton({ strength = 0.3, ...buttonProps }: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const enabled = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const xTo = gsap.quickTo(inner, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(inner);
      gsap.set(inner, { x: 0, y: 0 });
    };
  }, [enabled, strength]);

  return (
    <span ref={wrapRef} className="inline-block">
      <span ref={innerRef} className="inline-block will-change-transform">
        <Button {...buttonProps} />
      </span>
    </span>
  );
}
