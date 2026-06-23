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
 * Pinned scrub: as the user scrolls, this section writes its progress to
 * the store, which the GalaxyParticles read to CONVERGE (stars pulling
 * inward — §5.3) while an ignition glow blooms behind the CTA ("dream
 * becoming reality") and the headline + three buttons reveal.
 *
 * "Your Turn." + "Start Your Journey" + the support line are verbatim
 * Content Bible; the "Let's Talk" headline and "Tell us your dream"
 * subhead are owner-approved finale copy (extras).
 *
 * Reduced motion / no-WebGL: no pin, no convergence (canvas unmounted),
 * glow stays hidden — the full CTA is plainly visible.
 */
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
        .to(".js-finale-glow", { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" }, "<")
        .from(split.chars, { yPercent: 110, stagger: STAGGER.words / 2, duration: 0.9 }, ">-0.3")
        .from(".js-finale-sub", { autoAlpha: 0, y: 24, duration: 0.6 }, ">-0.2")
        .from(".js-finale-support", { autoAlpha: 0, y: 20, duration: 0.6 }, ">-0.1")
        .from(
          ".js-finale-cta",
          { autoAlpha: 0, y: 26, scale: 0.92, stagger: 0.12, duration: 0.6, ease: "back.out(1.5)" },
          ">+0.1",
        )
        .to({}, { duration: 1.2 }); // hold while the stars finish converging

      return () => split.revert();
    },
    [],
    { scope: sectionRef },
  );

  return (
    <Section id={finale.id} labelledBy={`${finale.id}-title`} flush>
      <div ref={sectionRef} className="relative overflow-hidden">
        {/* Ignition glow — "dream becoming reality" */}
        <div
          aria-hidden="true"
          className="js-finale-glow pointer-events-none absolute top-1/2 left-1/2 -z-0 size-[120vmin] -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0"
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

            <h2 id={`${finale.id}-title`} ref={headlineRef} className="text-display-xl">
              <GradientText>{extras.finaleHeadline}</GradientText>
            </h2>

            <p className="js-finale-sub text-lead text-foreground mt-6">{extras.finaleSubhead}</p>

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
          </Container>
        </div>
      </div>
    </Section>
  );
}
