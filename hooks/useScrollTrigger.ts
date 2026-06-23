"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/components/experience/choreography/motion.tokens";
import { useExperienceStore } from "@/stores/experienceStore";
import { useGsap, type GsapEffect } from "./useGsap";

export interface UseScrollTriggerOptions {
  /** The section element that drives this timeline. */
  trigger: React.RefObject<HTMLElement | null>;
  /** @default "top top" */
  start?: string | number;
  /** @default "+=100%" */
  end?: string | number | (() => string);
  /**
   * Scrub smoothing in seconds — the "heavy film camera" lag
   * (Blueprint §4.4: 0.8–1.2 per act; never raw `true`).
   * @default 1
   */
  scrub?: number | boolean;
  /** Pin the trigger section for the duration of the timeline. */
  pin?: boolean;
  pinSpacing?: boolean | string;
  /** Gentle snap to timeline positions on scroll-stop (§4.4). */
  snap?: number | number[] | "labels" | "labelsDirectional";
  markers?: boolean;
  /**
   * Section id for the experience store bridge (§6.3): activates
   * `activeSection` and streams local progress to `sectionProgress`.
   */
  sectionId?: string;
  /** Extra per-tick observer (called with local progress 0..1). */
  onProgress?: (progress: number) => void;
  /** Timeline tween defaults. @default { ease: EASE.drift } */
  defaults?: gsap.TweenVars;
  /** Designed static variant under prefers-reduced-motion. */
  reducedEffect?: GsapEffect;
}

/**
 * One scroll-scrubbed timeline per section (Blueprint §4.4/§6.2).
 * The builder receives a fresh paused-by-scrub timeline; populate it and
 * nothing else — creation, store bridging, reduced-motion variant, and
 * cleanup are owned here.
 *
 * Returns a ref to the live timeline (null under reduced motion or
 * before mount) for imperative needs like `tl.scrollTrigger.refresh()`.
 */
export function useScrollTrigger(
  build: (timeline: gsap.core.Timeline) => void,
  options: UseScrollTriggerOptions,
  deps: React.DependencyList = [],
): React.RefObject<gsap.core.Timeline | null> {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /* Latest-value refs — options/build identity must not rebuild the
     trigger; `deps` is the only rebuild signal (same contract as useGsap). */
  const buildRef = useRef(build);
  buildRef.current = build;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useGsap(
    () => {
      const o = optionsRef.current;
      const element = o.trigger.current;
      if (!element) return;

      const bridge = useExperienceStore.getState();

      const timeline = gsap.timeline({
        defaults: { ease: EASE.drift, ...o.defaults },
        scrollTrigger: {
          trigger: element,
          start: o.start ?? "top top",
          end: o.end ?? "+=100%",
          scrub: o.scrub ?? 1,
          pin: o.pin ?? false,
          pinSpacing: o.pinSpacing,
          snap: o.snap,
          markers: o.markers,
          anticipatePin: o.pin ? 1 : 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (o.sectionId) bridge.setSectionProgress(o.sectionId, self.progress);
            o.onProgress?.(self.progress);
          },
          onToggle: (self) => {
            if (self.isActive && o.sectionId) bridge.setActiveSection(o.sectionId);
          },
        },
      });

      timelineRef.current = timeline;
      buildRef.current(timeline);

      return () => {
        timelineRef.current = null;
      };
    },
    deps,
    { scope: options.trigger, reducedEffect: options.reducedEffect },
  );

  return timelineRef;
}
