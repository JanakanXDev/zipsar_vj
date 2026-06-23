"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const V1Canvas = dynamic(() => import("./V1Canvas"), { ssr: false });

/**
 * Mounts the hero Earth canvas, scoped to its section (Earth appears only
 * in Hero + Finale per V1 direction). Gates on reduced-motion and WebGL
 * support; pauses the frameloop when the section scrolls out of view or
 * the tab is hidden. The CSS fallback behind it is pure black.
 */
export function V1CanvasMount() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setSupported(Boolean(c.getContext("webgl2") ?? c.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => setActive(Boolean(entry?.isIntersecting)), {
      rootMargin: "100px",
    });
    io.observe(wrap);
    const onVis = () => {
      if (document.hidden) setActive(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {!reducedMotion && supported && <V1Canvas active={active} />}
    </div>
  );
}
