"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface LoadingScreenProps {
  /** Brand wordmark to display (copy comes from the caller, never hardcoded here). */
  wordmark: string;
  /** 0..1 determinate progress; omit for an indeterminate shimmer. */
  progress?: number | null;
  /** Parent signals readiness → exit animation plays. */
  done?: boolean;
  /**
   * Failsafe: exit regardless after this many ms (Blueprint §5.4 —
   * "max 2.5s, then reveal regardless and stream in").
   */
  maxDurationMs?: number;
  /** Fired after the exit animation completes and the overlay unmounts. */
  onExitComplete?: () => void;
  /** Screen-reader announcement. */
  srLabel?: string;
}

/**
 * Brand loading overlay: wordmark + neon progress hairline over the void.
 * Locks scroll while visible. Exit: progress completes, then the overlay
 * slides away (simple short fade under prefers-reduced-motion).
 */
export function LoadingScreen({
  wordmark,
  progress = null,
  done = false,
  maxDurationMs = 2500,
  onExitComplete,
  srLabel = "Loading",
}: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const exitStartedRef = useRef(false);
  const [hidden, setHidden] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const finish = useCallback(() => {
    setHidden(true);
    onExitComplete?.();
  }, [onExitComplete]);

  const beginExit = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    const root = rootRef.current;
    const bar = barRef.current;
    if (!root) {
      finish();
      return;
    }

    gsap.killTweensOf([root, bar]);

    if (reducedMotion) {
      gsap.to(root, { autoAlpha: 0, duration: 0.25, onComplete: finish });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    if (bar) {
      tl.to(bar, { xPercent: 0, scaleX: 1, width: "100%", duration: 0.25, ease: "power1.out" });
    }
    tl.to(root, { yPercent: -100, duration: 0.8, ease: "zip-exit" }, "+=0.1");
  }, [finish, reducedMotion]);

  /* Scroll lock while visible + failsafe timer (§5.4). */
  useEffect(() => {
    if (hidden) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const failsafe = window.setTimeout(beginExit, maxDurationMs);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.clearTimeout(failsafe);
    };
  }, [hidden, maxDurationMs, beginExit]);

  /* Progress bar: determinate scale or indeterminate shimmer. */
  useEffect(() => {
    if (hidden || exitStartedRef.current) return;
    const bar = barRef.current;
    if (!bar) return;

    if (reducedMotion) {
      gsap.set(bar, { scaleX: progress ?? 1 });
      return;
    }

    if (progress === null || progress === undefined) {
      gsap.set(bar, { width: "33.333%", scaleX: 1 });
      const shimmer = gsap.fromTo(
        bar,
        { xPercent: -100 },
        { xPercent: 300, duration: 1.2, ease: "power1.inOut", repeat: -1 },
      );
      return () => {
        shimmer.kill();
      };
    }

    gsap.to(bar, { scaleX: Math.min(Math.max(progress, 0), 1), duration: 0.3, ease: "power1.out" });
  }, [hidden, progress, reducedMotion]);

  /* Parent readiness. */
  useEffect(() => {
    if (done) beginExit();
  }, [done, beginExit]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className="bg-void fixed inset-0 z-(--z-overlay) flex flex-col items-center justify-center gap-8"
    >
      <span className="sr-only">{srLabel}</span>
      <span aria-hidden="true" className="text-display-lg text-aurora animate-glow-pulse">
        {wordmark}
      </span>
      <span aria-hidden="true" className="bg-line block h-px w-48 overflow-hidden">
        <span
          ref={barRef}
          className="from-neon-blue via-neon-purple to-neon-green block h-full w-full origin-left scale-x-0 bg-gradient-to-r"
        />
      </span>
      {typeof progress === "number" && (
        <span aria-hidden="true" className="text-faint font-mono text-xs">
          {Math.round(Math.min(Math.max(progress, 0), 1) * 100)}%
        </span>
      )}
    </div>
  );
}
