"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE } from "@/components/experience/choreography/motion.tokens";
import { staggerIn } from "@/components/experience/choreography/animations";
import { useExperienceStore } from "@/stores/experienceStore";
import { act3 } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";
import { DialogueExchange } from "./primitives/DialogueExchange";
import { GROWTH_CHART_WIDTH, GrowthChart } from "./primitives/GrowthChart";

/**
 * SECTION 6 — Act 3: The Evolution ("More Than Launching. We Nurture.").
 *
 * Enhanced: character-by-character heading reveal, milestone dots with
 * bounce, nurture items with an animated green arrow, AI dialogue with
 * clip-path bubble reveal. Atmosphere: green-left nebula.
 */
export function EvolutionSection() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      const headline = headlineRef.current;
      if (!scope || !headline) return;

      const bridge = useExperienceStore.getState();

      /* Character-by-character reveal on heading (previously just fadeUp) */
      const headlineSplit = SplitText.create(headline, {
        type: "chars,words",
        mask: "chars",
        aria: "auto",
      });

      gsap.from(headlineSplit.chars, {
        yPercent: 110,
        stagger: 0.025,
        duration: 0.7,
        ease: EASE.arrive,
        scrollTrigger: { trigger: scope, start: "top 78%" },
      });

      gsap.from(".js-evo-subhead", {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: EASE.arrive,
        scrollTrigger: { trigger: scope, start: "top 72%" },
      });

      /* Growth chart animation */
      const chart = gsap.timeline({
        scrollTrigger: {
          trigger: ".js-evo-chart",
          start: "top 75%",
          onToggle: (self) => {
            if (self.isActive) bridge.setActiveSection(act3.id);
          },
        },
      });
      chart
        .fromTo(
          ".js-growth-clip",
          { attr: { width: 0 } },
          { attr: { width: GROWTH_CHART_WIDTH }, duration: 1.6, ease: "power2.out" },
        )
        .from(
          ".js-growth-dot",
          {
            scale: 0,
            transformOrigin: "center",
            duration: 0.5,
            ease: "back.out(2.5)",
            stagger: 0.08,
          },
          "-=0.3",
        );

      /* Nurture items stagger */
      staggerIn(".js-evo-item", {
        each: 0.1,
        scrollTrigger: { trigger: ".js-evo-list", start: "top 82%" },
      });

      gsap.from(".js-evo-underline", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: EASE.drift,
        stagger: 0.1,
        scrollTrigger: { trigger: ".js-evo-list", start: "top 80%" },
      });

      /* Counter-up animation for the arrow icons */
      gsap.from(".js-evo-arrow", {
        autoAlpha: 0,
        x: -8,
        rotate: -45,
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".js-evo-list", start: "top 78%" },
      });

      gsap.from(".js-evo-dialogue .js-bubble", {
        autoAlpha: 0,
        y: 20,
        scale: 0.9,
        transformOrigin: "bottom center",
        duration: 0.5,
        ease: "back.out(1.5)",
        stagger: 0.18,
        scrollTrigger: { trigger: ".js-evo-dialogue", start: "top 84%" },
      });

      return () => headlineSplit.revert();
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={act3.id} labelledBy={`${act3.id}-title`} className="section-atmo-evolution">
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="max-w-narrative mx-auto text-center">
            <Heading level={2} id={`${act3.id}-title`} size="lg">
              <span ref={headlineRef} className="block">{act3.sceneTitle}</span>
            </Heading>
            <p className="js-evo-subhead text-lead text-muted mt-6">{act3.content}</p>
          </div>

          <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-2">
            {/* Data visualization */}
            <GlassCard variant="strong" padding="lg" className="js-evo-chart flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <p className="overline-label text-neon-green-soft">Growth after launch</p>
                {/* Live badge */}
                <span
                  className="status-dot flex items-center gap-1.5 text-xs text-neon-green-soft"
                >
                  <span
                    className="block size-1.5 animate-pulse rounded-full"
                    style={{ background: "var(--color-neon-green)" }}
                    aria-hidden="true"
                  />
                  Live growth
                </span>
              </div>
              <GrowthChart />
            </GlassCard>

            {/* Nurture items */}
            <ul role="list" className="js-evo-list grid gap-4 content-start">
              {act3.items.map((item) => (
                <li
                  key={item}
                  className="js-evo-item glass-subtle rounded-panel border-line flex flex-col gap-3 border p-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="js-evo-arrow text-neon-green-soft text-xl font-bold"
                    >
                      ↗
                    </span>
                    <span className="text-foreground text-body-lg">{item}</span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="js-evo-underline from-neon-blue via-neon-purple to-neon-green block h-0.5 origin-left rounded-full bg-gradient-to-r"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* AI-assistant conversation */}
          <div className="js-evo-dialogue max-w-narrative mx-auto mt-16">
            <DialogueExchange messages={act3.dialogue} />
          </div>
        </Container>
      </div>
    </Section>
  );
}
