"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * ScanlineOverlay — Cinematic horizontal scanlines layered above the
 * page content. Ultra-subtle (opacity ~4%) — adds film-grain texture and
 * a premium sci-fi monitor feel. Aria-hidden, pointer-events-none.
 *
 * Respects prefers-reduced-motion: does not render at all.
 * Respects forced-colors: hidden via CSS.
 */
export function ScanlineOverlay() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="scanline-stripe"
      role="presentation"
    />
  );
}

/**
 * CRT Vignette — subtle edge darkening for depth and immersion.
 * Pure CSS, no JS needed after mount.
 */
export function CRTVignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: "calc(var(--z-cursor) + 4)",
        background:
          "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(6, 6, 10, 0.45) 100%)",
      }}
    />
  );
}
