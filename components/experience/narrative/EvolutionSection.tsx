"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE } from "@/components/experience/choreography/motion.tokens";
import { fadeUp, staggerIn } from "@/components/experience/choreography/animations";
import { useExperienceStore } from "@/stores/experienceStore";
import { act3 } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";
import { DialogueExchange } from "./primitives/DialogueExchange";
import { GROWTH_CHART_WIDTH, GrowthChart } from "./primitives/GrowthChart";

/**
 * SECTION 6 — Act 3: The Evolution ("More Than Launching. We Nurture.").
 *
 * Growth animations (chart clip-reveal, drawing underlines, rising rows),
 * a decorative data-visualization (the GrowthChart), scaling visuals, and
 * the AI-assistant conversation. Copy verbatim from the Content Bible:
 * the content line, the four nurture items, and the dialogue.
 *
 * Everything is visible by default, so reduced motion / no-JS shows the
 * full chart, items, and transcript with no reveal animation.
 */
export function EvolutionSection() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const bridge = useExperienceStore.getState();

      fadeUp(".js-evo-head", { scrollTrigger: { trigger: scope, start: "top 78%" } });

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
          { attr: { width: GROWTH_CHART_WIDTH }, duration: 1.4, ease: "power2.out" },
        )
        .from(
          ".js-growth-dot",
          { scale: 0, transformOrigin: "center", duration: 0.4, ease: "back.out(2)" },
          "-=0.25",
        );

      staggerIn(".js-evo-item", {
        each: 0.1,
        scrollTrigger: { trigger: ".js-evo-list", start: "top 82%" },
      });
      gsap.from(".js-evo-underline", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: EASE.drift,
        stagger: 0.1,
        scrollTrigger: { trigger: ".js-evo-list", start: "top 80%" },
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
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={act3.id} labelledBy={`${act3.id}-title`}>
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="js-evo-head max-w-narrative mx-auto text-center">
            <Heading level={2} id={`${act3.id}-title`} size="lg">
              {act3.sceneTitle}
            </Heading>
            <p className="text-lead text-muted mt-6">{act3.content}</p>
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
            {/* Data visualization */}
            <GlassCard variant="strong" padding="lg" className="js-evo-chart">
              <p className="overline-label text-neon-green-soft mb-5">Growth after launch</p>
              <GrowthChart />
            </GlassCard>

            {/* Scaling visuals — nurture items (verbatim) */}
            <ul role="list" className="js-evo-list grid gap-4">
              {act3.items.map((item) => (
                <li
                  key={item}
                  className="js-evo-item glass-subtle rounded-panel border-line flex flex-col gap-3 border p-5"
                >
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="text-neon-green-soft text-lg">
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
