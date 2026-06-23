"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { EASE, STAGGER } from "@/components/experience/choreography/motion.tokens";
import { useExperienceStore } from "@/stores/experienceStore";
import { act1 } from "@/content/contentBible";
import { Container, Heading, Section } from "@/components/ui";

/**
 * SECTION 3 — Act 1: The Encounter ("You've Got an Idea. We've Got You.").
 *
 * A scroll-triggered conversation with cinematic bubble reveals via
 * clip-path. Each message has a decorative timestamp. A signal-line
 * connector runs vertically. Section atmosphere: cool-blue nebula.
 */

/* Decorative timestamps — not real times, purely atmospheric chrome */
const TIMESTAMPS = ["00:01", "00:02"] as const;

export function EncounterSection() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGsap(
    () => {
      const scope = scopeRef.current;
      const headline = headlineRef.current;
      if (!scope || !headline) return;

      const headlineSplit = SplitText.create(headline, {
        type: "chars,words",
        mask: "chars",
        aria: "auto",
      });

      const tl = gsap.timeline({
        defaults: { ease: EASE.arrive },
        scrollTrigger: {
          trigger: scope,
          start: "top 62%",
          onToggle: (self) => {
            if (self.isActive) useExperienceStore.getState().setActiveSection(act1.id);
          },
        },
      });

      tl.from(headlineSplit.chars, {
        yPercent: 110,
        stagger: STAGGER.words / 2,
        duration: 0.6,
      });

      act1.dialogue.forEach((message, index) => {
        const typing = `.js-typing-${index}`;
        const bubble = `.js-bubble-${index}`;
        const isZipsar = message.speaker === "Zipsar";

        tl.fromTo(
          typing,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.3 },
          index === 0 ? ">+0.25" : ">+0.35",
        )
          .to(typing, { autoAlpha: 0, scale: 0.7, duration: 0.25 }, ">+0.75")
          /* Clip-path reveal instead of plain scale/fade — more cinematic */
          .fromTo(
            bubble,
            {
              clipPath: isZipsar
                ? "inset(0% 0% 100% 100% round 1.25rem)"
                : "inset(0% 100% 100% 0% round 1.25rem)",
              autoAlpha: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
              autoAlpha: 1,
              duration: 0.55,
              ease: "power3.out",
            },
            ">-0.05",
          );
      });

      tl.from(
        ".js-encounter-point",
        { autoAlpha: 0, x: -16, duration: 0.5, stagger: 0.12 },
        ">+0.3",
      );

      return () => headlineSplit.revert();
    },
    [],
    { scope: scopeRef },
  );

  return (
    <Section id={act1.id} labelledBy={`${act1.id}-title`} className="section-atmo-encounter">
      <div ref={scopeRef}>
        <Container size="narrative">
          <Heading level={2} id={`${act1.id}-title`} size="lg" className="text-center">
            <span ref={headlineRef} className="block">
              {act1.sceneTitle}
            </span>
          </Heading>

          {/* Conversation */}
          <div className="relative mt-16">
            {/* Vertical signal line connecting bubbles */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--color-line-bright) 20%, var(--color-line-bright) 80%, transparent)",
              }}
            />

            <ul role="list" className="relative flex flex-col gap-8">
              {act1.dialogue.map((message, index) => {
                const isZipsar = message.speaker === "Zipsar";
                return (
                  <li
                    key={`${message.speaker}-${message.line}`}
                    className={`flex w-full ${isZipsar ? "justify-end" : "justify-start"}`}
                  >
                    <div className="relative max-w-[85%] sm:max-w-[72%]">
                      {/* Typing indicator */}
                      <div
                        aria-hidden="true"
                        style={{ opacity: 0 }}
                        className={`js-typing-${index} rounded-panel absolute inset-0 flex items-center gap-1.5 px-6 ${
                          isZipsar ? "glass neon-edge-blue justify-end" : "glass-subtle border-line"
                        }`}
                      >
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            style={{ animationDelay: `${dot * 0.15}s` }}
                            className="animate-typing bg-faint inline-block size-1.5 rounded-full"
                          />
                        ))}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`js-bubble-${index} rounded-panel px-6 py-5 ${
                          isZipsar
                            ? "glass neon-edge-blue"
                            : "glass-subtle"
                        }`}
                        style={{
                          borderColor: isZipsar
                            ? "rgba(0,191,255,0.35)"
                            : "var(--color-line-bright)",
                          border: "1px solid",
                        }}
                      >
                        {/* Speaker + timestamp row */}
                        <div className="mb-2.5 flex items-center justify-between gap-4">
                          <p
                            className={`overline-label ${
                              isZipsar ? "text-neon-blue-soft" : "text-faint"
                            }`}
                          >
                            {message.speaker}
                          </p>
                          <span className="font-mono text-[10px] text-faint/50">
                            {TIMESTAMPS[index]}
                          </span>
                        </div>
                        <p className="text-lead text-foreground">{message.line}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section explains */}
          <ul role="list" className="mt-14 flex flex-col gap-4">
            {act1.explains.map((point) => (
              <li key={point} className="js-encounter-point flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--color-neon-blue)" }}
                />
                <span className="text-muted text-body-lg">{point}</span>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
