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
 * R&D Lab: named future-product cards with holographic overlays, status
 * chips, circuit grid backgrounds, and an interactive particle field.
 * Copy verbatim from the Content Bible. Atmosphere: purple nebula center.
 */

/* Named future product teasers — sketch placeholders, not real products */
const CONCEPTS = [
  {
    code: "Zipsar AI",
    tagline: "Intelligent integration layer",
    icon: "🧠",
    status: "In Dev",
    statusColor: "var(--color-neon-purple)",
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(0,191,255,0.06) 100%)",
    offset: "lg:-translate-y-6",
  },
  {
    code: "Zipsar Launch",
    tagline: "Product validation toolkit",
    icon: "🚀",
    status: "Beta",
    statusColor: "var(--color-neon-blue)",
    gradient: "linear-gradient(135deg, rgba(0,191,255,0.12) 0%, rgba(52,211,153,0.06) 100%)",
    offset: "lg:translate-y-4",
  },
  {
    code: "Zipsar Scale",
    tagline: "Enterprise dev platform",
    icon: "⚡",
    status: "Coming Soon",
    statusColor: "var(--color-neon-green)",
    gradient: "linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(167,139,250,0.06) 100%)",
    offset: "lg:-translate-y-2",
  },
] as const;

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
          { autoAlpha: 0, y: 40, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.15,
            duration: 0.9,
            ease: EASE.arrive,
          },
          0.5,
        );
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={act4.id} labelledBy={`${act4.id}-title`} className="section-atmo-future">
      <div ref={scopeRef} className="relative overflow-hidden">
        {/* Interactive particle field */}
        <ParticleField count={28} />

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

          {/* Future product teaser cards */}
          <ul role="list" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((concept, index) => (
              <li key={concept.code} className={`list-none ${concept.offset}`}>
                <article
                  aria-label={`${concept.code} — ${concept.tagline} — revealing soon`}
                  style={{ animationDelay: `${index * 0.9}s` }}
                  className="js-future-card animate-float-slow glass-subtle rounded-panel border-line-bright/50 relative h-full border overflow-hidden"
                >
                  {/* Holographic gradient overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: concept.gradient }}
                  />

                  {/* Circuit grid background */}
                  <div
                    aria-hidden="true"
                    className="circuit-bg pointer-events-none absolute inset-0 opacity-60"
                  />

                  {/* Dashed border frame */}
                  <div
                    aria-hidden="true"
                    className="border-line-bright/20 absolute inset-3 rounded-lg border border-dashed"
                  />

                  <div className="relative p-7 flex flex-col gap-5">
                    {/* Header: icon + status */}
                    <div className="flex items-start justify-between">
                      <span
                        className="rounded-chip neon-edge-blue grid size-14 place-items-center text-3xl"
                        aria-hidden="true"
                      >
                        {concept.icon}
                      </span>

                      {/* Status chip with pulsing dot */}
                      <span
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          background: `color-mix(in srgb, ${concept.statusColor} 12%, transparent)`,
                          border: `1px solid ${concept.statusColor}`,
                          color: concept.statusColor,
                        }}
                      >
                        <span
                          className="block size-1.5 rounded-full"
                          style={{
                            background: concept.statusColor,
                            animation: "var(--animate-status-blink)",
                          }}
                          aria-hidden="true"
                        />
                        {concept.status}
                      </span>
                    </div>

                    {/* Product identity */}
                    <div>
                      <p className="overline-label text-neon-purple-soft mb-1">{extras.futureOverline}</p>
                      <p className="text-foreground text-xl font-semibold">{concept.code}</p>
                      <p className="text-muted text-body-lg mt-1">{concept.tagline}</p>
                    </div>

                    {/* Placeholder wireframe lines */}
                    <div aria-hidden="true" className="flex flex-col gap-2 pt-1">
                      <span className="bg-line-bright/40 block h-1.5 w-2/3 rounded-full" />
                      <span className="bg-line-bright/30 block h-1.5 w-1/2 rounded-full" />
                    </div>

                    {/* Lock indicator */}
                    <span className="text-faint/60 mt-1 inline-flex items-center gap-2 text-xs">
                      <span aria-hidden="true">🔒</span> Revealing soon
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>

        {/* Fog overlay */}
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
