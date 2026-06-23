"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE, STAGGER } from "@/components/experience/choreography/motion.tokens";
import { useExperienceStore } from "@/stores/experienceStore";
import { extras, finale } from "@/content/contentBible";
import { Button, Container, GradientText, MagneticButton, Section } from "@/components/ui";

/**
 * SECTION 8 — Finale: Your Turn ("Let's Talk").
 *
 * Pinned scrub: dual glow rings, aurora-shimmer headline, CTA buttons
 * with enhanced borders. Stars converge in the WebGL layer. Ambient
 * floating CSS particle dots in the background.
 */

/* Ambient background particles — pure CSS, no JS */
const AMBIENT_COUNT = 16;
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const AMBIENT_PARTICLES = Array.from({ length: AMBIENT_COUNT }, (_, i) => ({
  id: i,
  left: `${seededRandom(i * 10 + 1) * 100}%`,
  top: `${seededRandom(i * 10 + 2) * 100}%`,
  size: `${2 + seededRandom(i * 10 + 3) * 3}px`,
  delay: `${seededRandom(i * 10 + 4) * 6}s`,
  duration: `${5 + seededRandom(i * 10 + 5) * 6}s`,
  opacity: 0.2 + seededRandom(i * 10 + 6) * 0.3,
  color:
    ["var(--color-neon-blue)", "var(--color-neon-purple)", "var(--color-neon-green)"][
      Math.floor(i % 3)
    ],
}));

export function FinaleSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      const headline = headlineRef.current;
      if (!section || !headline) return;

      const bridge = useExperienceStore.getState();
      const split = SplitText.create(headline, {
        type: "chars,words",
        mask: "chars",
        aria: "auto",
      });

      const tl = gsap.timeline({
        defaults: { ease: EASE.arrive },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => bridge.setSectionProgress(finale.id, self.progress),
          onToggle: (self) => {
            if (self.isActive) bridge.setActiveSection(finale.id);
          },
        },
      });

      tl.from(".js-finale-overline", { autoAlpha: 0, y: 20, duration: 0.6 })
        /* Dual glow ring: inner ring blooms first */
        .to(".js-finale-glow-inner", { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "<")
        /* Outer ring follows with slight delay */
        .to(".js-finale-glow-outer", { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power2.out" }, "<+0.3")
        .from(split.chars, { yPercent: 110, stagger: STAGGER.words / 2, duration: 0.9 }, ">-0.4")
        .from(".js-finale-sub", { autoAlpha: 0, y: 24, duration: 0.6 }, ">-0.2")
        .from(".js-finale-support", { autoAlpha: 0, y: 20, duration: 0.6 }, ">-0.1")
        .from(
          ".js-finale-cta",
          {
            autoAlpha: 0,
            y: 26,
            scale: 0.92,
            stagger: 0.12,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
          ">+0.1",
        )
        .to({}, { duration: 1.2 }); // hold while stars converge

      return () => split.revert();
    },
    [],
    { scope: sectionRef },
  );

  return (
    <Section id={finale.id} labelledBy={`${finale.id}-title`} flush className="section-atmo-finale">
      <div ref={sectionRef} className="relative overflow-hidden">

        {/* CSS ambient particles — pure cosmetic */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {AMBIENT_PARTICLES.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: p.color,
                opacity: p.opacity,
                animationDelay: p.delay,
                animationDuration: p.duration,
                animation: `float-y ${p.duration} var(--ease-pulse) ${p.delay} infinite`,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Outer ignition ring — wider, subtler */}
        <div
          aria-hidden="true"
          className="js-finale-glow-outer pointer-events-none absolute top-1/2 left-1/2 -z-0 size-[160vmin] -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0"
          style={{
            background:
              "radial-gradient(circle, transparent 30%, rgba(167,139,250,0.08) 50%, rgba(0,191,255,0.05) 70%, transparent 85%)",
          }}
        />

        {/* Inner ignition glow — the "dream becoming reality" core */}
        <div
          aria-hidden="true"
          className="js-finale-glow-inner pointer-events-none absolute top-1/2 left-1/2 -z-0 size-[120vmin] -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(0,191,255,0.22), rgba(167,139,250,0.14) 35%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex min-h-svh items-center">
          <Container size="narrative" className="py-24 text-center">
            <p className="overline-label tracking-mega js-finale-overline text-neon-blue-soft mb-6">
              {finale.sceneTitle}
            </p>

            <h2
              id={`${finale.id}-title`}
              ref={headlineRef}
              className="text-display-xl font-bold"
            >
              <GradientText>{extras.finaleHeadline}</GradientText>
            </h2>

            <p className="js-finale-sub text-lead text-foreground mt-6 font-medium">
              {extras.finaleSubhead}
            </p>

            <p className="js-finale-support text-muted text-body-lg mx-auto mt-4 max-w-prose">
              {finale.support}
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <span className="js-finale-cta inline-block">
                <MagneticButton
                  accent="blue"
                  size="lg"
                  href={`mailto:${extras.contact.email}?subject=${encodeURIComponent(finale.ctaPrimary.label)}`}
                >
                  <span aria-hidden="true">{finale.ctaPrimary.emoji}</span>
                  {finale.ctaPrimary.label}
                </MagneticButton>
              </span>

              {extras.finaleButtons.map((button, index) => (
                <span key={button.label} className="js-finale-cta inline-block">
                  <Button variant="ghost" size="lg" href={button.href}>
                    {index === extras.finaleButtons.length - 1 && (
                      <span aria-hidden="true">{finale.ctaSecondary.emoji}</span>
                    )}
                    {button.label}
                  </Button>
                </span>
              ))}
            </div>

            {/* Social proof micro-line */}
            <p className="text-faint/50 mt-10 text-xs">
              Trusted by dreamers across 3 continents · Available globally
            </p>
          </Container>
        </div>
      </div>
    </Section>
  );
}
