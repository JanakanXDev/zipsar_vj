"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const COLORS = ["bg-neon-blue/60", "bg-neon-purple/60", "bg-neon-green/60"];

/**
 * Interactive DOM particle field — dots that repel away from the cursor
 * (Section 7 "particle interactions"). Uses gsap.quickTo so it rides the
 * shared GSAP ticker (no second rAF, Blueprint §9.3). Base centers are
 * cached on setup/resize, so the pointer handler does no layout reads.
 *
 * Decorative (aria-hidden), pointer-events-none. Pointer-fine + motion-OK
 * only; otherwise a static (opacity-twinkling) starfield.
 */
export function ParticleField({
  count = 22,
  radius = 150,
  strength = 55,
}: {
  count?: number;
  radius?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const enabled = pointerFine && !reducedMotion;

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return x - Math.floor(x);
  };

  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const base = i * 13.37;
        // Round to 2 decimals for percentage to match server-rendered precision
        const roundedValue = (val: number) => Math.round(val * 100) / 100;
        return {
          top: roundedValue(seededRandom(base + 1) * 100),
          left: roundedValue(seededRandom(base + 2) * 100),
          size: Math.round((2 + seededRandom(base + 3) * 3) * 100) / 100,
          delay: Math.round(seededRandom(base + 4) * 4 * 100) / 100,
          color: COLORS[i % COLORS.length]!,
        };
      }),
    [count],
  );

  useEffect(() => {
    if (!enabled) return;
    const container = ref.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLElement>("[data-dot]"));
    const setters = nodes.map((node) => ({
      x: gsap.quickTo(node, "x", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(node, "y", { duration: 0.7, ease: "power3.out" }),
    }));

    let centers = nodes.map((n) => ({
      x: n.offsetLeft + n.offsetWidth / 2,
      y: n.offsetTop + n.offsetHeight / 2,
    }));
    const recompute = () => {
      centers = nodes.map((n) => ({
        x: n.offsetLeft + n.offsetWidth / 2,
        y: n.offsetTop + n.offsetHeight / 2,
      }));
    };

    const reset = () => setters.forEach((s) => (s.x(0), s.y(0)));

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      if (mx < -40 || my < -40 || mx > rect.width + 40 || my > rect.height + 40) {
        reset();
        return;
      }
      nodes.forEach((_, i) => {
        const c = centers[i]!;
        const dx = c.x - mx;
        const dy = c.y - my;
        const dist = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, (radius - dist) / radius) * strength;
        setters[i]!.x((dx / dist) * push);
        setters[i]!.y((dy / dist) * push);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", recompute);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", recompute);
      gsap.killTweensOf(nodes);
      gsap.set(nodes, { x: 0, y: 0 });
    };
  }, [enabled, radius, strength]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          data-dot
          style={{
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDelay: `${dot.delay}s`,
          }}
          className={`animate-glow-pulse absolute rounded-full ${dot.color}`}
        />
      ))}
    </div>
  );
}
