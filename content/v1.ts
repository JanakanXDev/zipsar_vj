/**
 * V1.0 EXPLICIT COPY — the headlines/labels/CTAs the FINAL CREATIVE
 * DIRECTION v1.0 specifies as replacements. Owner-authored (not invented).
 *
 * Business content (vision, mission, service names/blurbs, the reused
 * headlines like "The World Needs More Dreamers", "Ideas Beyond Dreams",
 * "Why Zipsar Exists", "Unlocking Dreams You Haven't Dreamt Yet") stays
 * in contentBible.ts — the source of truth for company identity.
 * Priority: business content (Bible) > V1 copy here.
 */

export const v1 = {
  hero: {
    cta: "Start Your Project",
  },
  process: {
    steps: [
      { n: "01", label: "Discover" },
      { n: "02", label: "Design" },
      { n: "03", label: "Build" },
      { n: "04", label: "Scale" },
    ],
  },
  cta: {
    lines: ["Your idea deserves more than a pitch deck.", "Let's build something real."],
  },
  finale: {
    lines: [
      "You arrived here because you have an idea.",
      "Every great company started with one.",
      "Let's build yours.",
    ],
  },
} as const;
