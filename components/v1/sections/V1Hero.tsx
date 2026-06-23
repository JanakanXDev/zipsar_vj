"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { blurReveal, parallax } from "@/components/experience/choreography/animations";
import { brand, prologue } from "@/content/contentBible";
import { v1 } from "@/content/v1";
import { V1Button } from "@/components/v1/V1Button";
import { Magnetic } from "@/components/v1/Magnetic";
import { V1CanvasMount } from "@/components/v1/canvas/V1CanvasMount";

/**
 * SECTION 1 — Hero (Cinematic Brand + Aetheris Voyage + Reveal Hero).
 *
 * Space → Earth horizon → stars (the photoreal Earth canvas), with a
 * cinematic blur-reveal intro for eyebrow → headline → subhead → CTA, a
 * gentle scroll parallax on the copy, and a magnetic primary CTA.
 *
 * Copy: headline + subhead verbatim (Content Bible); CTA "Start Your
 * Project" is V1 explicit copy. Reduced motion: no canvas, no intro —
 * the hero is plain, fully-visible text on black.
 */
export function V1Hero() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const intro = gsap.timeline();
      intro
        .add(blurReveal(".js-hero-eyebrow", { blur: 10, distance: 16, duration: 0.7 }), 0.2)
        .add(blurReveal(".js-hero-title", { blur: 18, distance: 34, duration: 1.1 }), 0.5)
        .add(blurReveal(".js-hero-sub", { blur: 10, distance: 20, duration: 0.8 }), 1.15)
        .from(".js-hero-cta", { autoAlpha: 0, scale: 0.95, duration: 0.7 }, 1.5)
        .from(".js-hero-cue", { autoAlpha: 0, duration: 0.8 }, 1.8);

      /* Gentle parallax — copy drifts up as the Earth settles. */
      parallax(".js-hero-copy", { speed: 0.18, start: "top top", end: "bottom top" });
    },
    [],
    { scope: scopeRef },
  );

  return (
    <section className="bg-ink relative min-h-svh overflow-hidden">
      <div ref={scopeRef} className="absolute inset-0">
        {/* Earth canvas */}
        <V1CanvasMount />

        {/* Legibility wash behind the upper copy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.1) 38%, transparent 60%)",
          }}
        />

        {/* Copy */}
        <div className="px-gutter relative z-10 flex min-h-svh flex-col items-center justify-start pt-[18vh] text-center">
          <div className="js-hero-copy max-w-v1-text mx-auto w-full">
            <p className="js-hero-eyebrow text-paper-faint text-sm tracking-[0.3em] uppercase">
              {brand.name}
            </p>
            <h1 className="js-hero-title text-display-xl text-paper mt-6 font-semibold tracking-tight">
              {prologue.sceneTitle}
            </h1>
            <p className="js-hero-sub text-paper-dim text-lead mx-auto mt-6 max-w-prose">
              {brand.tagline}
            </p>
            <div className="js-hero-cta mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <V1Button variant="primary" size="lg" href="#vision">
                  {v1.hero.cta}
                </V1Button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="js-hero-cue absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-paper-faint text-xs tracking-[0.3em] uppercase">Scroll</span>
          <span className="via-paper-dim h-10 w-px bg-gradient-to-b from-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
