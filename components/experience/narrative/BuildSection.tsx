"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE } from "@/components/experience/choreography/motion.tokens";
import { fadeUp } from "@/components/experience/choreography/animations";
import { useExperienceStore } from "@/stores/experienceStore";
import { act2 } from "@/content/contentBible";
import { Container, GlassCard, Heading, Section } from "@/components/ui";
import { BuildPreview } from "./primitives/BuildPreview";

/**
 * SECTION 4 — Act 2: The Build ("Every Pixel. Every Line. A Purpose.").
 *
 * Pinned horizontal storytelling: vertical scroll drives a horizontal
 * journey through the 4 chapters. Each card has a large watermark
 * chapter number for visual depth. Section atmosphere: purple-bleed bottom.
 */
export function BuildSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGsap(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const progress = progressRef.current;
      if (!section || !viewport || !track) return;

      const bridge = useExperienceStore.getState();
      const steps = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".js-act2-step"));
      const panels = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".js-act2-panel"));
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      viewport.style.overflow = "hidden";

      fadeUp(".js-act2-head", { scrollTrigger: { trigger: section, start: "top 80%" } });

      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bridge.setSectionProgress(act2.id, self.progress);
            if (progress) gsap.set(progress, { scaleX: self.progress });
            const active = Math.min(
              act2.chapters.length - 1,
              Math.floor(self.progress * act2.chapters.length),
            );
            steps.forEach((el, i) => el.classList.toggle("is-active", i <= active));

            /* Blur non-active panels for depth perception */
            panels.forEach((panel, i) => {
              const isActive = i === active;
              const dist = Math.abs(i - active);
              gsap.to(panel, {
                filter: `blur(${dist > 0 ? dist * 1.5 : 0}px)`,
                opacity: isActive ? 1 : Math.max(0.4, 1 - dist * 0.25),
                duration: 0.4,
                ease: EASE.arrive,
                overwrite: "auto",
              });
            });
          },
          onToggle: (self) => {
            if (self.isActive) bridge.setActiveSection(act2.id);
          },
        },
      });

      /* Reveal each panel's content as it scrolls into view horizontally */
      panels.forEach((panel) => {
        gsap.from(panel.querySelectorAll(".js-act2-reveal"), {
          autoAlpha: 0,
          y: 44,
          duration: 0.6,
          ease: EASE.arrive,
          stagger: 0.08,
          scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: "left 85%" },
        });
      });

      return () => {
        viewport.style.overflow = "";
      };
    },
    [],
    { scope: sectionRef },
  );

  return (
    <Section id={act2.id} labelledBy={`${act2.id}-title`} flush className="section-atmo-build">
      <div ref={sectionRef} className="relative">
        <div className="flex h-svh flex-col gap-6 py-10">
          {/* Header — stays in view while pinned */}
          <Container size="wide" className="js-act2-head">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Heading level={2} id={`${act2.id}-title`} size="md">
                {act2.sceneTitle}
              </Heading>
              <ul role="list" className="hidden gap-2 sm:flex">
                {act2.overlayIcons.map((service) => (
                  <li
                    key={service.label}
                    className="glass-subtle rounded-chip flex items-center gap-1.5 px-2.5 py-1"
                  >
                    <span aria-hidden="true">{service.icon}</span>
                    <span className="overline-label text-faint">{service.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step indicators */}
            <ol role="list" className="mt-6 flex flex-wrap items-center gap-2">
              {act2.chapters.map((chapter) => (
                <li
                  key={chapter.number}
                  className="js-act2-step flex items-center gap-2 rounded-full border px-3 py-1.5"
                >
                  <span className="font-mono text-xs">
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <span className="overline-label hidden lg:inline">{chapter.title}</span>
                </li>
              ))}
            </ol>

            {/* Progress line */}
            <div className="bg-line relative mt-4 h-px w-full overflow-hidden">
              <span
                ref={progressRef}
                className="from-neon-blue via-neon-purple to-neon-green absolute inset-0 origin-left scale-x-0 bg-gradient-to-r"
              />
            </div>
          </Container>

          {/* Horizontal viewport */}
          <div
            ref={viewportRef}
            tabIndex={0}
            aria-label={act2.sceneTitle}
            className="grow overflow-x-auto overflow-y-hidden"
          >
            <div
              ref={trackRef}
              className="px-gutter flex h-full items-stretch gap-6"
              style={{ width: "max-content" }}
            >
              {act2.chapters.map((chapter, index) => (
                <article
                  key={chapter.number}
                  className="js-act2-panel flex w-[86vw] shrink-0 flex-col sm:w-[60vw] lg:w-[44vw] transition-[filter,opacity]"
                >
                  <GlassCard variant="default" padding="lg" className="relative flex h-full flex-col gap-6 overflow-hidden">

                    {/* Large watermark chapter number for visual depth */}
                    <span
                      aria-hidden="true"
                      className="text-aurora pointer-events-none absolute -right-4 -top-6 select-none font-bold opacity-[0.06]"
                      style={{ fontSize: "clamp(8rem, 18vw, 14rem)", lineHeight: 1 }}
                    >
                      {String(chapter.number).padStart(2, "0")}
                    </span>

                    <div className="relative flex items-baseline gap-4">
                      <span className="js-act2-reveal text-aurora text-display-lg font-semibold">
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <Heading level={3} size="md" className="js-act2-reveal">
                        {chapter.title}
                      </Heading>
                    </div>
                    <p className="js-act2-reveal text-lead text-foreground">{chapter.tagline}</p>
                    <p className="js-act2-reveal text-muted text-body-lg">{chapter.detail}</p>
                    <div className="js-act2-reveal mt-auto">
                      <BuildPreview variant={index} />
                    </div>
                  </GlassCard>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
