/**
 * Motion tokens for GSAP — the JS mirror of styles/tokens.css (§4.2).
 * All timelines and micro-interactions read from here; no magic numbers
 * in animation code. Keep in sync with tokens.css.
 *
 * Eases are the named CustomEase ids registered in lib/gsap.ts.
 */

export const EASE = {
  drift: "zip-drift", // default — camera, section reveals
  arrive: "zip-arrive", // elements entering (decelerate hard)
  exit: "zip-exit", // elements leaving (accelerate away)
  pulse: "zip-pulse", // glow breathing, idle loops
} as const;

export const DURATION = {
  beat: 0.4, // micro-interactions (hover, focus)
  phrase: 0.8, // text line reveals
  scene: 1.6, // scene-level crossfades
} as const;

export const STAGGER = {
  words: 0.04, // word cascades
  cards: 0.08, // grid entrances
} as const;
