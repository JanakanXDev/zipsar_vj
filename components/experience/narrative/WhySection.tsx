"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { useTilt } from "@/hooks/useTilt";
import { fadeUp, parallax, staggerIn } from "@/components/experience/choreography/animations";
import { extras, visionMission } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";

/**
 * SECTION 2 — Why Zipsar Exists (Vision & Mission).
 *
 * Two glassmorphism cards with: glow (neon edge + cursor-following inner
 * glow), parallax (differential scrub drift for depth), and mouse
 * interaction (3D tilt via useTilt). Copy verbatim from the Content
 * Bible's Vision/Mission statements.
 */

type Accent = "blue" | "purple" | "green";

interface CardConfig {
  key: string;
  label: string;
  lines: readonly string[];
  accent: Accent;
  /** Inner-glow color (matches the accent neon at low alpha). */
  glow: string;
  /** Label tint. */
  labelClass: string;
  /** Differential parallax depth factor. */
  parallaxSpeed: number;
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
  },
  {
    key: "mission",
    label: visionMission.mission.label,
    lines: visionMission.mission.lines,
    accent: "green",
    glow: "rgba(52, 211, 153, 0.2)",
    labelClass: "text-neon-green-soft",
    parallaxSpeed: 0.04,
  },
];

function VisionMissionCard({ config }: { config: CardConfig }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 7 });

  return (
    <li className="js-why-card list-none [perspective:1200px]" data-parallax={config.parallaxSpeed}>
      <div ref={tiltRef} className="h-full will-change-transform">
        <GlassCard
          as="article"
          variant="strong"
          accent={config.accent}
          padding="lg"
          className="relative h-full overflow-hidden"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${config.glow}, transparent 60%)`,
              opacity: "var(--glow-opacity, 0)",
              transition: "opacity 0.4s var(--ease-arrive)",
            }}
          />
          <div className="relative flex flex-col gap-5">
            <p className={`overline-label ${config.labelClass}`}>{config.label}</p>
            {config.lines.map((line, index) => (
              <p
                key={line}
                className={index === 0 ? "text-display text-foreground" : "text-lead text-muted"}
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

      fadeUp(".js-why-head", { scrollTrigger: { trigger: scope, start: "top 78%" } });
      staggerIn(".js-why-card", {
        each: 0.15,
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
    <Section id={visionMission.id} labelledBy={`${visionMission.id}-title`}>
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="js-why-head max-w-narrative mx-auto text-center">
            <Heading level={2} id={`${visionMission.id}-title`} size="lg">
              {extras.whyOverline}
            </Heading>
            <div className="hairline mx-auto mt-8 w-40" />
          </div>

          <ul role="list" className="mt-16 grid gap-8 md:grid-cols-2">
            {CARDS.map((config) => (
              <VisionMissionCard key={config.key} config={config} />
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
