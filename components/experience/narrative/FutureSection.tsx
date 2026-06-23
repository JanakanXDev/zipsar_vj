"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE } from "@/components/experience/choreography/motion.tokens";
import { useExperienceStore } from "@/stores/experienceStore";
import { act4, extras } from "@/content/contentBible";
import { Container, GradientText, Heading, Section } from "@/components/ui";
import { ParticleField } from "./primitives/ParticleField";

/**
 * SECTION 7 — Act 4: The Future ("Unlocking Dreams You Haven't Dreamt Yet").
 *
 * The R&D Lab: a fog reveal clears to expose floating "future product"
 * teaser cards (sketch-mode placeholders — no invented product claims),
 * over an interactive particle field. Copy verbatim from the Content
 * Bible (overline "R&D Lab" is an owner-approved extra).
 *
 * Fog defaults to invisible and cards to sharp/visible, so reduced motion
 * / no-JS shows the lab fully revealed with no fog.
 */

/* Placeholder future concepts — sketch teasers, not real products. */
const CONCEPTS = [
  { code: "Concept 01", offset: "lg:-translate-y-6" },
  { code: "Concept 02", offset: "lg:translate-y-4" },
  { code: "Concept 03", offset: "lg:-translate-y-2" },
];

export function FutureSection() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 70%",
          onToggle: (self) => {
            if (self.isActive) useExperienceStore.getState().setActiveSection(act4.id);
          },
        },
      });

      tl.fromTo(
        ".js-fog",
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 1.5, ease: "power2.inOut" },
        0,
      )
        .from(
          ".js-future-head > *",
          { autoAlpha: 0, y: 28, stagger: 0.12, duration: 0.7, ease: EASE.arrive },
          0.2,
        )
        .fromTo(
          ".js-future-card",
          { autoAlpha: 0, filter: "blur(12px)" },
          { autoAlpha: 1, filter: "blur(0px)", stagger: 0.15, duration: 0.8, ease: EASE.arrive },
          0.4,
        );
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={act4.id} labelledBy={`${act4.id}-title`}>
      <div ref={scopeRef} className="relative overflow-hidden">
        {/* Interactive particle field */}
        <ParticleField count={24} />

        <Container size="wide" className="relative z-10">
          <div className="js-future-head max-w-narrative mx-auto text-center">
            <p className="overline-label tracking-mega text-neon-purple-soft mb-4">
              {extras.futureOverline}
            </p>
            <Heading level={2} id={`${act4.id}-title`} size="lg">
              <GradientText>{act4.sceneTitle}</GradientText>
            </Heading>
            <p className="text-lead text-foreground mt-6">{act4.lines[0]}</p>
            <p className="text-lead text-muted mt-3">{act4.lines[1]}</p>
          </div>

          {/* Floating future-product teaser cards */}
          <ul role="list" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((concept, index) => (
              <li key={concept.code} className={`list-none ${concept.offset}`}>
                <article
                  aria-label="Future concept — revealing soon"
                  style={{ animationDelay: `${index * 0.8}s` }}
                  className="js-future-card animate-float glass-subtle rounded-panel border-line-bright/50 h-full border border-dashed p-6"
                >
                  <div aria-hidden="true" className="mb-6 flex flex-col gap-2">
                    <span className="bg-line block h-2 w-1/2 rounded-full" />
                    <span className="bg-line block h-2 w-3/4 rounded-full" />
                    <span className="border-line mt-2 block h-20 w-full rounded-lg border border-dashed" />
                  </div>
                  <p className="overline-label text-neon-purple-soft">{extras.futureOverline}</p>
                  <p className="text-foreground text-body-lg mt-1">{concept.code}</p>
                  <span className="text-faint mt-3 inline-flex items-center gap-2 text-sm">
                    <span aria-hidden="true">🔒</span> Revealing soon
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </Container>

        {/* Fog overlay — clears on reveal */}
        <div
          aria-hidden="true"
          className="js-fog pointer-events-none invisible absolute inset-0 z-20 opacity-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 120%, rgba(167,139,250,0.18), transparent 60%), radial-gradient(100% 70% at 20% 0%, rgba(0,191,255,0.14), transparent 55%), rgba(10,10,15,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
      </div>
    </Section>
  );
}
