"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { useTilt } from "@/hooks/useTilt";
import { staggerIn } from "@/components/experience/choreography/animations";
import { extras, services, type Service } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";
import { gsap } from "@/lib/gsap";

/**
 * SECTION 5 — Services ("Everything You Need to Build").
 *
 * Premium service grid with: large icon area, gradient card-number
 * watermarks, animated arrow CTA, enhanced hover glow. Masonry-like
 * alternating heights for visual rhythm. Atmosphere: green nebula top.
 */

type Accent = "blue" | "purple" | "green";

const ACCENTS: Accent[] = ["blue", "purple", "green"];

const META: Record<string, { icon: string; glow: string; accentColor: string }> = {
  "UI/UX Design": {
    icon: "🖌",
    glow: "rgba(0, 191, 255, 0.18)",
    accentColor: "var(--color-neon-blue)",
  },
  Development: {
    icon: "💻",
    glow: "rgba(167, 139, 250, 0.18)",
    accentColor: "var(--color-neon-purple)",
  },
  DevOps: {
    icon: "⚙",
    glow: "rgba(52, 211, 153, 0.18)",
    accentColor: "var(--color-neon-green)",
  },
  Maintenance: {
    icon: "🛠",
    glow: "rgba(0, 191, 255, 0.18)",
    accentColor: "var(--color-neon-blue)",
  },
  "AI Integration": {
    icon: "🧠",
    glow: "rgba(167, 139, 250, 0.18)",
    accentColor: "var(--color-neon-purple)",
  },
  "Dev Support": {
    icon: "🤝",
    glow: "rgba(52, 211, 153, 0.18)",
    accentColor: "var(--color-neon-green)",
  },
  "Tech Advisory": {
    icon: "🧭",
    glow: "rgba(0, 191, 255, 0.18)",
    accentColor: "var(--color-neon-blue)",
  },
};

const EDGE: Record<Accent, string> = {
  blue: "neon-edge-blue",
  purple: "neon-edge-purple",
  green: "neon-edge-green",
};

/* Alternating height pattern for masonry-like rhythm */
const HEIGHT_PATTERN = [
  "min-h-[20rem]",
  "min-h-[17rem]",
  "min-h-[20rem]",
  "min-h-[17rem]",
  "min-h-[20rem]",
  "min-h-[17rem]",
  "min-h-[20rem]",
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>({ max: 6 });
  const accent = ACCENTS[index % ACCENTS.length]!;
  const meta = META[service.name] ?? {
    icon: "✨",
    glow: "rgba(0, 191, 255, 0.18)",
    accentColor: "var(--color-neon-blue)",
  };
  const cardNumber = String(index + 1).padStart(2, "0");
  const minH = HEIGHT_PATTERN[index % HEIGHT_PATTERN.length];

  return (
    <li className={`js-service-card list-none [perspective:1100px] ${minH}`}>
      <div
        ref={tiltRef}
        className="neon-border-trace rounded-panel card-shimmer group relative h-full will-change-transform"
      >
        <GlassCard
          as="article"
          interactive
          padding="lg"
          className="relative h-full overflow-hidden"
        >
          {/* Cursor-following inner glow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${meta.glow}, transparent 60%)`,
              opacity: "var(--glow-opacity, 0)",
              transition: "opacity 0.4s var(--ease-arrive)",
            }}
          />

          {/* Large watermark number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 bottom-3 select-none font-bold opacity-[0.06] transition-all duration-(--duration-beat) group-hover:opacity-[0.1] group-hover:scale-110"
            style={{
              fontSize: "5rem",
              lineHeight: 1,
              color: meta.accentColor,
            }}
          >
            {cardNumber}
          </span>

          <div className="relative flex h-full flex-col gap-5">
            {/* Icon — larger, elevated on hover */}
            <span
              aria-hidden="true"
              className={`${EDGE[accent]} rounded-chip grid size-16 place-items-center text-3xl transition-transform duration-(--duration-beat) ease-(--ease-arrive) group-hover:-translate-y-1.5 group-hover:scale-110`}
            >
              {meta.icon}
            </span>

            <Heading level={3} size="sm">
              {service.name}
            </Heading>

            <p className="text-muted group-hover:text-foreground text-body-lg flex-1 transition-colors duration-(--duration-beat)">
              {service.blurb}
            </p>

            {/* Animated arrow CTA */}
            <span
              aria-hidden="true"
              className="text-neon-blue-soft mt-auto inline-flex items-center gap-2 text-sm font-medium"
            >
              <span className="transition-all duration-(--duration-beat) ease-(--ease-arrive) group-hover:tracking-wide">
                Explore
              </span>
              <span className="inline-block transition-transform duration-(--duration-beat) ease-(--ease-arrive) group-hover:translate-x-2">
                →
              </span>
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

      gsap.fromTo(
        ".js-services-head",
        { autoAlpha: 0, y: 32, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start: "top 80%" },
        },
      );

      staggerIn(".js-service-card", {
        each: 0.06,
        distance: 28,
        scrollTrigger: { trigger: scope, start: "top 68%" },
      });
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={services.id} labelledBy={`${services.id}-title`} className="section-atmo-services">
      <div ref={scopeRef}>
        <Container size="wide">
          <div className="js-services-head max-w-narrative mx-auto text-center">
            <p className="overline-label tracking-mega text-neon-green-soft mb-4">
              {extras.servicesTitle.split(" ").slice(0, 2).join(" ")}
            </p>
            <Heading level={2} id={`${services.id}-title`} size="lg">
              {extras.servicesTitle}
            </Heading>
            <div className="mx-auto mt-6 flex items-center gap-4">
              <div className="hairline flex-1" />
              <span className="text-neon-green-soft text-lg" aria-hidden="true">◆</span>
              <div className="hairline flex-1" />
            </div>
          </div>

          <ul role="list" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.items.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
