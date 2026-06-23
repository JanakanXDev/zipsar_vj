"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { useTilt } from "@/hooks/useTilt";
import { fadeUp, staggerIn } from "@/components/experience/choreography/animations";
import { extras, services, type Service } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";

/**
 * SECTION 5 — Services ("Everything You Need to Build").
 *
 * The Content Bible's "Smart Grid". Each card: glassmorphism, hover glow
 * (cursor-following inner glow + neon edge), border animation (the
 * `neon-border-trace` light tracing the edge on hover), and micro
 * interactions (3D tilt, icon lift, arrow nudge, blurb brighten).
 *
 * Service names + blurbs are verbatim; icons are decorative (aria-hidden).
 */

type Accent = "blue" | "purple" | "green";

const ACCENTS: Accent[] = ["blue", "purple", "green"];

/* Decorative icons + per-card glow tint, keyed by the verbatim names. */
const META: Record<string, { icon: string; glow: string }> = {
  "UI/UX Design": { icon: "🖌", glow: "rgba(0, 191, 255, 0.18)" },
  Development: { icon: "💻", glow: "rgba(167, 139, 250, 0.18)" },
  DevOps: { icon: "⚙", glow: "rgba(52, 211, 153, 0.18)" },
  Maintenance: { icon: "🛠", glow: "rgba(0, 191, 255, 0.18)" },
  "AI Integration": { icon: "🧠", glow: "rgba(167, 139, 250, 0.18)" },
  "Dev Support": { icon: "🤝", glow: "rgba(52, 211, 153, 0.18)" },
  "Tech Advisory": { icon: "🧭", glow: "rgba(0, 191, 255, 0.18)" },
};

const EDGE: Record<Accent, string> = {
  blue: "neon-edge-blue",
  purple: "neon-edge-purple",
  green: "neon-edge-green",
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6 });
  const accent = ACCENTS[index % ACCENTS.length]!;
  const meta = META[service.name] ?? { icon: "✨", glow: "rgba(0, 191, 255, 0.18)" };

  return (
    <li className="js-service-card list-none [perspective:1100px]">
      <div
        ref={tiltRef}
        className="neon-border-trace rounded-panel group relative h-full will-change-transform"
      >
        <GlassCard
          as="article"
          interactive
          padding="lg"
          className="relative h-full overflow-hidden"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${meta.glow}, transparent 60%)`,
              opacity: "var(--glow-opacity, 0)",
              transition: "opacity 0.4s var(--ease-arrive)",
            }}
          />

          <div className="relative flex h-full flex-col gap-4">
            <span
              aria-hidden="true"
              className={`${EDGE[accent]} rounded-chip grid size-12 place-items-center text-2xl transition-transform duration-(--duration-beat) ease-(--ease-arrive) group-hover:-translate-y-1 group-hover:scale-110`}
            >
              {meta.icon}
            </span>

            <Heading level={3} size="sm">
              {service.name}
            </Heading>

            <p className="text-muted group-hover:text-foreground text-body-lg transition-colors duration-(--duration-beat)">
              {service.blurb}
            </p>

            <span
              aria-hidden="true"
              className="text-neon-blue-soft mt-auto inline-flex items-center gap-2 text-sm transition-transform duration-(--duration-beat) ease-(--ease-arrive) group-hover:translate-x-1"
            >
              Explore <span>→</span>
            </span>
          </div>
        </GlassCard>
      </div>
    </li>
  );
}

export function ServicesSection() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      fadeUp(".js-services-head", { scrollTrigger: { trigger: scope, start: "top 80%" } });
      staggerIn(".js-service-card", {
        each: 0.07,
        scrollTrigger: { trigger: scope, start: "top 68%" },
      });
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={services.id} labelledBy={`${services.id}-title`}>
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="js-services-head max-w-narrative mx-auto text-center">
            <Heading level={2} id={`${services.id}-title`} size="lg">
              {extras.servicesTitle}
            </Heading>
            <div className="hairline mx-auto mt-8 w-40" />
          </div>

          <ul role="list" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.items.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
