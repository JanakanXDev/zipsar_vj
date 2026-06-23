/**
 * ⭐ THE CONTENT MODULE — typed, VERBATIM mirror of
 * docs/ZIPSAR_CONTENT_BIBLE.md (the authoritative source).
 *
 * RULES (Blueprint §1.1, §7.1):
 * - Components NEVER contain copy literals; everything imports from here.
 * - Nothing here may be rewritten, simplified, or omitted.
 * - `extras` holds owner-approved additions requested in the build steps
 *   (2026-06-12) that do not exist in the Content Bible.
 */

export interface DialogueLine {
  speaker: "Client" | "Zipsar";
  line: string;
}

export interface Chapter {
  number: number;
  title: string;
  tagline: string;
  detail: string;
}

export interface Service {
  name: string;
  blurb: string;
}

export const brand = {
  name: "Zipsar",
  tagline: "Ideas Beyond Dreams",
  theme: "From Vision to Victory",
} as const;

export const prologue = {
  id: "prologue",
  sceneTitle: "The World Needs More Dreamers",
  narration: [
    "In a world filled with complexity, one thing remains clear—dreams need the right fuel.",
    "✨ Zipsar was born to make dreams real. Bold, simple, extraordinary.",
  ],
} as const;

export const visionMission = {
  id: "why",
  vision: {
    label: "Vision",
    lines: [
      "We're here to build more than software.",
      "We aim to elevate lifestyles, create joyful work cultures, and shape a world where creativity and technology dance in harmony.",
    ],
  },
  mission: {
    label: "Mission",
    lines: [
      "We stand beside every nursing dream, delivering time, quality, and soul into everything we build.",
    ],
  },
} as const;

export const act1 = {
  id: "encounter",
  sceneTitle: "You've Got an Idea. We've Got You.",
  dialogue: [
    { speaker: "Client", line: "I have an idea but no team." },
    { speaker: "Zipsar", line: "We're your team now. Let's design your dream." },
  ] satisfies DialogueLine[],
  explains: [
    "How clients can approach with any scale of ideas.",
    "Introduction to flexible service model — take one or many services.",
    "Encouragement for startups, SMEs, devs.",
  ],
} as const;

export const act2 = {
  id: "build",
  sceneTitle: "Every Pixel. Every Line. A Purpose.",
  chapters: [
    {
      number: 1,
      title: "Requirements & Discovery",
      tagline: "We listen deeply. We ask better questions. We understand you.",
      detail: "Sprint 0, research, goals.",
    },
    {
      number: 2,
      title: "Design",
      tagline: "Beautiful, intuitive, pixel-perfect UI/UX.",
      detail: "Wireframes to interactive prototypes.",
    },
    {
      number: 3,
      title: "Review Cycles",
      tagline: "You speak, we tweak.",
      detail: "Feedback loops, iteration rounds.",
    },
    {
      number: 4,
      title: "Development & Sprint Meetings",
      tagline: "Frontend, backend, full stack. We build magic, not just software.",
      detail: "Agile progress, sprint demos.",
    },
  ] satisfies Chapter[],
  overlayIcons: [
    { icon: "🖌", label: "UI/UX" },
    { icon: "💻", label: "Development" },
    { icon: "⚙", label: "DevOps" },
    { icon: "🤝", label: "Tech Support" },
  ],
} as const;

export const services = {
  id: "services",
  items: [
    { name: "UI/UX Design", blurb: "Where beauty meets logic." },
    { name: "Development", blurb: "Code that performs." },
    { name: "DevOps", blurb: "Automation, scalability, peace of mind." },
    { name: "Maintenance", blurb: "We grow as you grow." },
    { name: "AI Integration", blurb: "Bring intelligence to your products." },
    { name: "Dev Support", blurb: "Need backup? We're your crew." },
    { name: "Tech Advisory", blurb: "Years of experience in a Zoom call." },
  ] satisfies Service[],
} as const;

export const act3 = {
  id: "evolution",
  sceneTitle: "More Than Launching. We Nurture.",
  content: "We don't disappear after launch. We evolve with you.",
  items: [
    "R&D support for future scaling",
    "Ongoing enhancements & UX audits",
    "Dev support and maintenance",
    "AI integrations on request",
  ],
  dialogue: [
    { speaker: "Client", line: "We need an AI assistant in our app now." },
    { speaker: "Zipsar", line: "Already prototyping." },
  ] satisfies DialogueLine[],
} as const;

export const act4 = {
  id: "future",
  sceneTitle: "Unlocking Dreams You Haven't Dreamt Yet",
  lines: [
    "Our labs are brewing something exciting.",
    "Stay with us—we're building products that will redefine your tomorrow.",
  ],
} as const;

export const finale = {
  id: "finale",
  sceneTitle: "Your Turn.",
  ctaPrimary: { emoji: "🚀", label: "Start Your Journey" },
  support: "One service or a whole roadmap—Zipsar flexes with you.",
  ctaSecondary: { emoji: "💬", label: "Let's chat. Tell us your dream." },
} as const;

/**
 * Owner-approved additions from the build-step prompts (2026-06-12).
 * NOT Content Bible copy — flag for the owner's final proofread.
 */
export const extras = {
  whyOverline: "Why Zipsar Exists",
  servicesTitle: "Everything You Need to Build",
  futureOverline: "R&D Lab",
  finaleHeadline: "Let's Talk",
  finaleSubhead: "Tell us your dream",
  finaleButtons: [
    { label: "Book a Consultation", href: "mailto:hello@zipsar.com?subject=Consultation" },
    { label: "Contact Zipsar", href: "mailto:hello@zipsar.com" },
  ],
  contact: { email: "hello@zipsar.com" },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zipsar" },
    { label: "X (Twitter)", href: "https://x.com/zipsar" },
    { label: "GitHub", href: "https://github.com/zipsar" },
  ],
  copyright: `© ${new Date().getFullYear()} Zipsar. All rights reserved.`,
} as const;

export const seoContent = {
  title: "Zipsar — Ideas Beyond Dreams",
  description:
    "Zipsar was born to make dreams real. Bold, simple, extraordinary. UI/UX Design, Development, DevOps, Maintenance, AI Integration, Dev Support, and Tech Advisory.",
  url: "https://zipsar.com",
} as const;
