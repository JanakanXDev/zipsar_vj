/**
 * Reusable animation presets — the shared vocabulary of the Zipsar
 * motion language ("Cinematic Drift", Blueprint §4.1).
 *
 * Rules:
 * - Every preset reads motion.tokens — no magic numbers.
 * - Transform/opacity/clip-path only — never layout properties (§9.3).
 * - Presets create tweens/triggers but do NOT own cleanup: call them
 *   inside a useGsap / useScrollTrigger effect (or any gsap.context) and
 *   reversion is automatic. Presets returning instances (SplitText,
 *   ScrollTrigger) document their extra cleanup.
 * - Reduced motion is handled by the calling hook (gsap.matchMedia,
 *   §6.2) — presets themselves stay variant-free.
 */
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { DURATION, EASE, STAGGER } from "./motion.tokens";

/* ────────────────────────── FADES ────────────────────────── */

export interface FadeVars extends gsap.TweenVars {
  /** Travel distance in px. @default 40 */
  distance?: number;
}

/** Fade Up — enter from below. The workhorse reveal. */
export function fadeUp(target: gsap.TweenTarget, vars: FadeVars = {}): gsap.core.Tween {
  const { distance = 40, ...rest } = vars;
  return gsap.from(target, {
    autoAlpha: 0,
    y: distance,
    duration: DURATION.phrase,
    ease: EASE.arrive,
    ...rest,
  });
}

/** Fade Down — enter from above (nav bars, overlines, dropping labels). */
export function fadeDown(target: gsap.TweenTarget, vars: FadeVars = {}): gsap.core.Tween {
  const { distance = 40, ...rest } = vars;
  return gsap.from(target, {
    autoAlpha: 0,
    y: -distance,
    duration: DURATION.phrase,
    ease: EASE.arrive,
    ...rest,
  });
}

/* ────────────────────────── BLUR REVEAL ────────────────────────── */

export interface BlurRevealVars extends gsap.TweenVars {
  /** Initial blur in px. @default 8 */
  blur?: number;
  /** Travel distance in px. @default 30 */
  distance?: number;
}

/**
 * Blur Reveal — the V1.0 signature entrance (opacity + y + de-blur).
 * Premium, restrained, no sliding/flying. fromTo so it is SSR-faithful
 * and reduced-motion safe (the calling hook gates execution).
 */
export function blurReveal(target: gsap.TweenTarget, vars: BlurRevealVars = {}): gsap.core.Tween {
  const { blur = 8, distance = 30, ...rest } = vars;
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: distance, filter: `blur(${blur}px)` },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: DURATION.phrase,
      ease: EASE.arrive,
      ...rest,
    },
  );
}

/* ────────────────────────── STAGGER ────────────────────────── */

export interface StaggerVars extends FadeVars {
  /** Per-item delay in seconds. @default STAGGER.cards (0.08) */
  each?: number;
  /** Where the cascade starts. @default "start" */
  from?: gsap.StaggerVars["from"];
}

/**
 * Stagger — cascade a group in (service cards, list items, icon rows).
 */
export function staggerIn(targets: gsap.TweenTarget, vars: StaggerVars = {}): gsap.core.Tween {
  const { each = STAGGER.cards, from = "start", distance = 32, ...rest } = vars;
  return fadeUp(targets, {
    distance,
    stagger: { each, from },
    ...rest,
  });
}

/* ────────────────────────── REVEAL ────────────────────────── */

export type RevealDirection = "up" | "down" | "left" | "right";

const CLIP_FROM: Record<RevealDirection, string> = {
  up: "inset(0% 0% 100% 0%)",
  down: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

export interface RevealVars extends gsap.TweenVars {
  /** Wipe direction the content is revealed toward. @default "up" */
  direction?: RevealDirection;
}

/**
 * Reveal — clip-path wipe (images, panels, media frames). No wrapper
 * element needed; GPU-friendly.
 */
export function reveal(target: gsap.TweenTarget, vars: RevealVars = {}): gsap.core.Tween {
  const { direction = "up", ...rest } = vars;
  return gsap.fromTo(
    target,
    { clipPath: CLIP_FROM[direction] },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: DURATION.scene,
      ease: EASE.drift,
      ...rest,
    },
  );
}

/* ────────────────────────── CHARACTER REVEAL ────────────────────────── */

export interface CharacterRevealVars {
  /** Per-character delay. @default STAGGER.words / 2 (0.02) */
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  scrollTrigger?: ScrollTrigger.Vars;
}

/**
 * Character Reveal — masked char rise for short display lines (scene
 * titles ONLY — never narrative copy, §6.5). Built on SplitText with:
 * - `aria: "auto"` → original text exposed to AT, fragments hidden;
 * - `mask: "chars"` → per-char overflow clips, true baseline rise;
 * - `autoSplit` → re-splits on font load/resize, re-creating the tween
 *   returned from onSplit (font-safety per §6.5).
 *
 * Cleanup: revert the returned SplitText (`split.revert()`) — automatic
 * when created inside a gsap.context (useGsap/useScrollTrigger).
 */
export function characterReveal(target: gsap.DOMTarget, vars: CharacterRevealVars = {}): SplitText {
  const {
    stagger = STAGGER.words / 2,
    duration = DURATION.phrase,
    ease = EASE.arrive,
    delay = 0,
    scrollTrigger,
  } = vars;

  return SplitText.create(target, {
    type: "chars,words",
    mask: "chars",
    aria: "auto",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.chars, {
        yPercent: 110,
        duration,
        ease,
        delay,
        stagger,
        scrollTrigger,
      }),
  });
}

/* ────────────────────────── PARALLAX ────────────────────────── */

export interface ParallaxVars {
  /**
   * Depth factor: fraction of the element's height it drifts while
   * crossing the viewport. Positive = lags behind (background layers),
   * negative = overtakes (foreground). @default 0.2
   */
  speed?: number;
  /** Scroll container reference. @default the target itself */
  trigger?: gsap.DOMTarget;
  start?: string;
  end?: string;
}

/**
 * Parallax — continuous depth drift while the element crosses the
 * viewport. Linear by design (raw scrub): parallax is position, not
 * animation, so it must track the finger/wheel exactly.
 */
export function parallax(target: gsap.DOMTarget, vars: ParallaxVars = {}): gsap.core.Tween {
  const { speed = 0.2, trigger, start = "top bottom", end = "bottom top" } = vars;
  return gsap.to(target, {
    yPercent: speed * -100,
    ease: "none",
    scrollTrigger: {
      trigger: trigger ?? target,
      start,
      end,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
}

/* ────────────────────────── HORIZONTAL SCROLL ────────────────────────── */

export interface HorizontalScrollVars {
  /** Scrub smoothing in seconds (§4.4). @default 1 */
  scrub?: number | boolean;
  /** Snap to each child panel of the track. @default false */
  snapToChildren?: boolean;
  markers?: boolean;
}

/**
 * Horizontal Scroll — pins `section` and translates `track` sideways so
 * vertical scroll drives a horizontal journey. Distance and end position
 * are functions, so the trigger survives resize/refresh correctly.
 */
export function horizontalScroll(
  section: HTMLElement,
  track: HTMLElement,
  vars: HorizontalScrollVars = {},
): gsap.core.Tween {
  const { scrub = 1, snapToChildren = false, markers } = vars;
  const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

  return gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers,
      snap: snapToChildren
        ? {
            snapTo: 1 / Math.max(1, track.children.length - 1),
            duration: { min: 0.2, max: DURATION.phrase },
            ease: EASE.drift,
          }
        : undefined,
    },
  });
}

/* ────────────────────────── PINNING ────────────────────────── */

export interface PinVars {
  /** @default "top top" */
  start?: string | number;
  /** Pin distance. @default "+=100%" (one viewport) */
  end?: string | number | (() => string);
  /** Keep layout space while pinned. @default true */
  pinSpacing?: boolean | string;
  /** Pin a different element than the trigger (§4.4 act sections). */
  pin?: boolean | gsap.DOMTarget;
  markers?: boolean;
  onUpdate?: (self: ScrollTrigger) => void;
  onToggle?: (self: ScrollTrigger) => void;
}

/**
 * Pinning — hold a section while the story plays (Blueprint §4.3 act
 * segments). For pin + scrubbed timeline in React, prefer the
 * useScrollTrigger hook; this preset is the primitive for bare pins.
 *
 * Returns the ScrollTrigger instance (`.kill()` to clean up manually;
 * automatic inside a gsap.context).
 */
export function pin(target: gsap.DOMTarget, vars: PinVars = {}): ScrollTrigger {
  const {
    start = "top top",
    end = "+=100%",
    pinSpacing = true,
    pin: pinTarget = true,
    markers,
    onUpdate,
    onToggle,
  } = vars;

  return ScrollTrigger.create({
    trigger: target,
    start,
    end,
    pin: pinTarget,
    pinSpacing,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    markers,
    onUpdate,
    onToggle,
  });
}
