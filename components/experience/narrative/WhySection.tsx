"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { useTilt } from "@/hooks/useTilt";
import { parallax, staggerIn } from "@/components/experience/choreography/animations";
import { extras, visionMission } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";

/**
 * SECTION 2 — Why Zipsar Exists (Vision & Mission).
 *
 * Asymmetric layout: Vision card on the left (dominant), Mission card
 * on the right (subordinate). Blur reveal on heading. Corner accents,
 * per-card glow, parallax. Atmosphere: purple-left / green-right bleed.
 */

type Accent = "blue" | "purple" | "green";

interface CardConfig {
  key: string;
  label: string;
  lines: readonly string[];
  accent: Accent;
  glow: string;
  labelClass: string;
  parallaxSpeed: number;
  cornerColor: string;
}

const CARDS: CardConfig[] = [
  {
    key: "vision",
    label: visionMission.vision.label,
    lines: visionMission.vision.lines,
    accent: "purple",
    glow: "rgba(167, 139, 250, 0.22)",
    labelClass: "text-neon-purple-soft",
    parallaxSpeed: 0.12,
    cornerColor: "var(--color-neon-purple)",
  },
  {
    key: "mission",
    label: visionMission.mission.label,
    lines: visionMission.mission.lines,
    accent: "green",
    glow: "rgba(52, 211, 153, 0.2)",
    labelClass: "text-neon-green-soft",
    parallaxSpeed: 0.04,
    cornerColor: "var(--color-neon-green)",
  },
];

function VisionMissionCard({ config, large = false }: { config: CardConfig; large?: boolean }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6 });

  return (
    <li
      className="js-why-card list-none [perspective:1200px]"
      data-parallax={config.parallaxSpeed}
    >
      <div ref={tiltRef} className="h-full will-change-transform">
        <GlassCard
          as="article"
          variant="strong"
          accent={config.accent}
          padding="lg"
          className="relative h-full overflow-hidden"
        >
          {/* Cursor-following inner glow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${config.glow}, transparent 60%)`,
              opacity: "var(--glow-opacity, 0)",
              transition: "opacity 0.4s var(--ease-arrive)",
            }}
          />

          {/* Corner accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 size-6"
            style={{
              borderTop: `1.5px solid ${config.cornerColor}`,
              borderLeft: `1.5px solid ${config.cornerColor}`,
              borderRadius: "3px 0 0 0",
              opacity: 0.5,
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 size-6"
            style={{
              borderBottom: `1.5px solid ${config.cornerColor}`,
              borderRight: `1.5px solid ${config.cornerColor}`,
              borderRadius: "0 0 3px 0",
              opacity: 0.5,
            }}
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <p className={`overline-label ${config.labelClass}`}>{config.label}</p>
              {/* Label line accent */}
              <span
                className="h-px flex-1 opacity-30"
                style={{ background: config.cornerColor }}
                aria-hidden="true"
              />
            </div>
            {config.lines.map((line, index) => (
              <p
                key={line}
                className={
                  index === 0
                    ? large
                      ? "text-display-lg text-foreground"
                      : "text-display text-foreground"
                    : "text-lead text-muted"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </GlassCard>
      </div>
    </li>
  );
}

export function WhySection() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      /* Blur reveal on heading instead of simple fadeUp */
      gsap.fromTo(
        ".js-why-head",
        { autoAlpha: 0, y: 32, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start: "top 78%" },
        },
      );

      staggerIn(".js-why-card", {
        each: 0.18,
        distance: 48,
        scrollTrigger: { trigger: scope, start: "top 62%" },
      });

      gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(".js-why-card")).forEach((el) => {
        parallax(el, { speed: Number(el.dataset.parallax ?? 0.1) });
      });
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={visionMission.id} labelledBy={`${visionMission.id}-title`} className="section-atmo-why">
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="js-why-head max-w-narrative mx-auto text-center">
            <Heading level={2} id={`${visionMission.id}-title`} size="lg">
              {extras.whyOverline}
            </Heading>
            {/* Centered hairline divider */}
            <div className="mx-auto mt-6 flex items-center gap-4">
              <div className="hairline flex-1" />
              <span className="text-neon-purple-soft text-lg" aria-hidden="true">◆</span>
              <div className="hairline flex-1" />
            </div>
          </div>

          {/* Asymmetric layout: Vision (2fr) | Mission (1fr) */}
          <ul role="list" className="mt-16 grid gap-6 lg:grid-cols-[3fr_2fr]">
            <VisionMissionCard config={CARDS[0]!} large />
            <VisionMissionCard config={CARDS[1]!} />
          </ul>
        </Container>
      </div>
    </Section>
  );
}
