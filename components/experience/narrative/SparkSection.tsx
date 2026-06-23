"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE, STAGGER } from "@/components/experience/choreography/motion.tokens";
import { useExperienceStore } from "@/stores/experienceStore";
import { brand, extras, finale, prologue } from "@/content/contentBible";
import { Container, GradientText, MagneticButton, Section } from "@/components/ui";

/**
 * SECTION 1 — Prologue: The Spark.
 *
 * One pinned scrub timeline plays the cinematic reveal while the camera
 * (CameraRig reads this section's progress from the store, §6.3) flies
 * Space → Earth → Cities → Dreamers behind the DOM.
 *
 * Beat order: character headline → tagline → scene rail draw → narration
 * line 1 (words) → narration line 2 (words, punchier) → CTA → held beat.
 *
 * All copy is rendered VERBATIM from the Content Bible; the staccato
 * "Bold, simple, extraordinary." cadence is delivered via word-level
 * reveal, not by rewriting the sentence.
 *
 * Reduced motion: useGsap's matchMedia simply does not run this effect,
 * so every line is plain, fully visible, and statically laid out.
 */

/* Scene-journey labels — UI chrome describing the visual sequence the
   Content Bible specifies ("zooming into Earth, then cities, then
   people"). Not narrative copy. */
const SCENE_STAGES = ["Space", "Earth", "Cities", "Dreamers"] as const;

export function SparkSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      if (!section || !headline) return;

      const bridge = useExperienceStore.getState();

      /* Character animation (scene titles only, §6.5). */
      const headlineSplit = SplitText.create(headline, {
        type: "chars,words",
        mask: "chars",
        aria: "auto",
      });

      /* Word reveals for narration — text stays in the DOM (SEO) and is
         exposed to AT via aria:"auto". */
      const lineSplits = gsap.utils
        .toArray<HTMLElement>(section.querySelectorAll(".js-spark-line"))
        .map((el) => SplitText.create(el, { type: "words", aria: "auto" }));

      /* INTRO — plays on load (NOT scroll-coupled), so the hero is visible
         the moment the page arrives. This is the LCP element; binding it
         to scroll would leave it hidden at the top. */
      const intro = gsap.timeline({ defaults: { ease: EASE.arrive } });
      intro
        .from(".js-spark-overline", { autoAlpha: 0, y: 16, duration: 0.6 })
        .from(
          headlineSplit.chars,
          { yPercent: 110, stagger: STAGGER.words / 2, duration: 1.1 },
          "<0.1",
        )
        .from(".js-spark-tagline", { autoAlpha: 0, y: 22, duration: 0.7 }, "<0.45")
        .from(".js-spark-eyebrow-line", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: EASE.drift }, "<0.2");

      /* SCROLL — drives the camera (via the store) and reveals the scene
         rail, narration, and CTA as the pinned section is scrubbed. */
      const tl = gsap.timeline({
        defaults: { ease: EASE.drift },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (window.innerWidth < 768 ? "+=190%" : "+=260%"),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => bridge.setSectionProgress(prologue.id, self.progress),
          onToggle: (self) => {
            if (self.isActive) bridge.setActiveSection(prologue.id);
          },
        },
      });

      tl.to(".js-spark-cue", { autoAlpha: 0, duration: 0.4 })
        .from(".js-rail-fill", { scaleY: 0, duration: 3, ease: "none" }, "<")
        .from(".js-scene-stage", { autoAlpha: 0.2, x: 12, duration: 0.5, stagger: 0.4 }, "<");

      lineSplits.forEach((split, index) => {
        tl.from(
          split.words,
          {
            autoAlpha: 0,
            yPercent: 60,
            duration: 0.7,
            ease: EASE.arrive,
            stagger: index === 1 ? 0.12 : STAGGER.words,
          },
          index === 0 ? ">+0.2" : ">-0.1",
        );
      });

      tl.from(
        ".js-spark-cta",
        { autoAlpha: 0, y: 24, scale: 0.92, duration: 0.8, ease: EASE.arrive },
        ">+0.4",
      ).to({}, { duration: 1.4 }); // held beat — the dreamer arrival

      return () => {
        intro.kill();
        headlineSplit.revert();
        lineSplits.forEach((split) => split.revert());
      };
    },
    [],
    { scope: sectionRef },
  );

  return (
    <Section id={prologue.id} labelledBy={`${prologue.id}-title`} flush className="relative section-atmo-prologue">
      <div ref={sectionRef}>
        <div className="relative flex min-h-svh items-center">

          {/* Depth layer: large faint brand name watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              className="text-aurora whitespace-nowrap font-bold opacity-[0.025] select-none"
              style={{ fontSize: "clamp(6rem, 20vw, 22rem)", letterSpacing: "-0.04em" }}
            >
              {brand.name}
            </span>
          </div>

          {/* Scene-journey rail — desktop only */}
          <div
            aria-hidden="true"
            className="px-gutter absolute inset-y-0 right-0 hidden flex-col justify-center md:flex"
          >
            <div className="flex items-stretch gap-4">
              <div className="bg-line relative w-px self-stretch">
                <div className="js-rail-fill from-neon-blue via-neon-purple to-neon-green absolute inset-0 origin-top bg-gradient-to-b" />
              </div>
              <ul className="flex flex-col justify-between gap-6 py-2">
                {SCENE_STAGES.map((stage, i) => (
                  <li key={stage} className="js-scene-stage flex items-center gap-2.5">
                    {/* Stage dot */}
                    <span
                      className="block size-1.5 rounded-full"
                      style={{
                        background: ["var(--color-neon-blue)", "var(--color-neon-blue-soft)", "var(--color-neon-purple-soft)", "var(--color-neon-purple)"][i],
                      }}
                    />
                    <span className="overline-label text-neon-blue-soft">{stage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Container size="narrative" className="relative z-10 py-24 text-center">
            {/* Brand eyebrow with animated line */}
            <div className="mb-8 flex flex-col items-center gap-3">
              <p className="js-spark-overline overline-label tracking-ultra text-neon-blue-soft/70">
                {brand.name}
              </p>
              <div
                className="js-spark-eyebrow-line h-px w-16 origin-left"
                style={{
                  background: "linear-gradient(90deg, var(--color-neon-blue), var(--color-neon-purple))",
                }}
              />
            </div>

            <h1
              id={`${prologue.id}-title`}
              ref={headlineRef}
              className="text-display-xxl font-bold text-liquid-glass"
            >
              {prologue.sceneTitle}
            </h1>

            <p className="js-spark-tagline text-lead mt-8">
              <GradientText className="font-semibold">{brand.tagline}</GradientText>
            </p>

            <div className="mx-auto mt-16 flex max-w-prose flex-col gap-5">
              <p className="js-spark-line text-lead text-muted">{prologue.narration[0]}</p>
              <p className="js-spark-line text-lead text-foreground font-medium">{prologue.narration[1]}</p>
            </div>

            <div className="js-spark-cta mt-14 flex flex-col items-center gap-4">
              <MagneticButton accent="blue" size="lg" href={`mailto:${extras.contact.email}`}>
                <span aria-hidden="true">{finale.ctaPrimary.emoji}</span>
                {finale.ctaPrimary.label}
              </MagneticButton>
              <p className="overline-label text-faint/60">Scroll to explore ↓</p>
            </div>
          </Container>

          {/* Scroll cue — comet animation */}
          <div
            aria-hidden="true"
            className="js-spark-cue absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
          >
            <span className="overline-label text-faint/50">Scroll</span>
            {/* Comet track */}
            <span
              className="relative block overflow-hidden"
              style={{ width: "1px", height: "48px", background: "var(--color-line)" }}
            >
              {/* Comet head */}
              <span
                className="absolute inset-x-0 top-0 block h-1/2 origin-top"
                style={{
                  background: "linear-gradient(to bottom, var(--color-neon-blue), transparent)",
                  animation: "var(--animate-comet)",
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
