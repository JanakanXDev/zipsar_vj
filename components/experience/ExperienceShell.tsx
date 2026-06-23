"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useExperienceStore } from "@/stores/experienceStore";

const ExperienceCanvas = dynamic(() => import("./canvas/ExperienceCanvas"), { ssr: false });

/**
 * Mounts the WebGL film layer only when it should exist (Blueprint §5.5
 * tier "Off" handling): never under prefers-reduced-motion, never
 * without WebGL support, never after an unrecoverable context loss.
 * In all of those cases the CSS nebula poster behind the page is the
 * designed stand-in — the site is complete without the canvas.
 */
export function ExperienceShell() {
  const reducedMotion = usePrefersReducedMotion();
  const webglOk = useExperienceStore((state) => state.webglOk);
  const [supported, setSupported] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  /* Defer canvas mount until the main thread is idle, so Three.js parsing
     never competes with first paint / hydration (Blueprint §9.2). */
  useEffect(() => {
    const start = () => setIdle(true);
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(start, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (reducedMotion || !webglOk || !supported || !idle) return null;
  return <ExperienceCanvas />;
}
