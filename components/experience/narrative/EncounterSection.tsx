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
 * A scroll-triggered conversation: when the section enters, one GSAP
 * timeline plays the chat — each line is preceded by an animated typing
 * indicator, then the bubble pops in from its speaker's side (Client
 * left / Zipsar right), followed by the "Section Explains" points.
 *
 * The timeline plays once (not scrubbed) so the chat keeps a natural
 * conversational rhythm. Copy is verbatim from the Content Bible.
 *
 * Reduced motion: the effect does not run — every bubble is plainly
 * visible, typing indicators stay hidden (CSS opacity-0, absolute), and
 * the conversation reads as a static transcript.
 */
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
        const origin = message.speaker === "Zipsar" ? "right bottom" : "left bottom";

        tl.fromTo(
          typing,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.3 },
          index === 0 ? ">+0.25" : ">+0.35",
        )
          .to(typing, { autoAlpha: 0, scale: 0.7, duration: 0.25 }, ">+0.75")
          .from(
            bubble,
            {
              autoAlpha: 0,
              scale: 0.85,
              y: 18,
              transformOrigin: origin,
              duration: 0.5,
              ease: "back.out(1.6)",
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
    <Section id={act1.id} labelledBy={`${act1.id}-title`}>
      <div ref={scopeRef}>
        <Container size="narrative">
          <Heading level={2} id={`${act1.id}-title`} size="lg" className="text-center">
            <span ref={headlineRef} className="block">
              {act1.sceneTitle}
            </span>
          </Heading>

          {/* Conversation */}
          <ul role="list" className="mt-16 flex flex-col gap-6">
            {act1.dialogue.map((message, index) => {
              const isZipsar = message.speaker === "Zipsar";
              return (
                <li
                  key={`${message.speaker}-${message.line}`}
                  className={`flex w-full ${isZipsar ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative max-w-[85%] sm:max-w-[72%]">
                    {/* Typing indicator — absolute, overlays the reserved bubble box */}
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
                      className={`js-bubble-${index} rounded-panel px-6 py-4 ${
                        isZipsar
                          ? "glass neon-edge-blue origin-bottom-right"
                          : "glass-subtle border-line origin-bottom-left"
                      }`}
                    >
                      <p
                        className={`overline-label mb-2 ${
                          isZipsar ? "text-neon-blue-soft" : "text-faint"
                        }`}
                      >
                        {message.speaker}
                      </p>
                      <p className="text-lead text-foreground">{message.line}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Section explains */}
          <ul role="list" className="mt-14 flex flex-col gap-4">
            {act1.explains.map((point) => (
              <li key={point} className="js-encounter-point flex gap-3">
                <span
                  aria-hidden="true"
                  className="bg-neon-blue mt-2.5 size-1.5 shrink-0 rounded-full"
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
