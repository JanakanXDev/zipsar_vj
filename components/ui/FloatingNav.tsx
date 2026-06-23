"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * FloatingNav — Scroll-tracking pill navigation with section dots.
 * Appears after the user scrolls past the hero, disappears at the footer.
 * Each dot represents a section; the active one glows blue.
 * Fully accessible: each dot is a button with aria-label.
 */

const SECTIONS = [
  { id: "prologue", label: "The Spark" },
  { id: "why", label: "Why Zipsar" },
  { id: "encounter", label: "The Encounter" },
  { id: "build", label: "The Build" },
  { id: "services", label: "Services" },
  { id: "evolution", label: "The Evolution" },
  { id: "future", label: "R&D Lab" },
  { id: "finale", label: "Your Turn" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<SectionId>("prologue");
  const navRef = useRef<HTMLElement>(null);

  /* Show/hide on scroll */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > window.innerHeight * 0.6;
        setVisible(scrolled);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Track active section with IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id as SectionId);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Animate in/out */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.to(nav, {
      autoAlpha: visible ? 1 : 0,
      x: visible ? 0 : 16,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [visible]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-(--z-nav) -translate-y-1/2 opacity-0"
      style={{ visibility: "hidden" }}
    >
      <div
        className="glass-strong rounded-full flex flex-col items-center gap-3 px-2.5 py-4"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              id={`floating-nav-${id}`}
              onClick={() => scrollToSection(id)}
              aria-label={`Go to ${label}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex size-6 items-center justify-center"
            >
              {/* Dot */}
              <span
                className="block rounded-full transition-all duration-(--duration-beat) ease-(--ease-arrive)"
                style={{
                  width: isActive ? "8px" : "5px",
                  height: isActive ? "8px" : "5px",
                  background: isActive
                    ? "var(--color-neon-blue)"
                    : "var(--color-line-bright)",
                  boxShadow: isActive ? "var(--shadow-glow-blue)" : "none",
                }}
              />
              {/* Tooltip label */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-surface/90 px-2.5 py-1 text-xs font-medium text-muted opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-(--duration-beat) group-hover:opacity-100">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
