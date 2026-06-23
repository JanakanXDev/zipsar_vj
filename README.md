# 🌌 Zipsar — Ideas Beyond Dreams

Cinematic scroll-driven storytelling website. Dark, neon, minimalistic yet immersive — like entering a sci-fi lab.

## Authoritative documents

| Document                                                                 | Role                                                                     |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [docs/ZIPSAR_CONTENT_BIBLE.md](docs/ZIPSAR_CONTENT_BIBLE.md)             | **All website copy, verbatim.** Never rewrite, simplify, or omit.        |
| [docs/ZIPSAR_TECHNICAL_BLUEPRINT.md](docs/ZIPSAR_TECHNICAL_BLUEPRINT.md) | Architecture contract — stack, structure, choreography, budgets, phases. |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger · React Three Fiber + drei · Lenis · Zustand · Vercel

## Scripts

| Command                           | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `npm run dev`                     | Dev server (Turbopack)                           |
| `npm run build`                   | Production build                                 |
| `npm run start`                   | Serve production build                           |
| `npm run lint`                    | ESLint (flat config, incl. blueprint guardrails) |
| `npm run typecheck`               | `tsc --noEmit`                                   |
| `npm run format` / `format:check` | Prettier                                         |

## Structure (Blueprint §2)

```
app/            Next.js App Router — routes, metadata (server-safe; no gsap/three)
components/
  experience/   The film: canvas/ (R3F scenes) · narrative/ (semantic DOM) · choreography/ (GSAP)
  sections/     Static sections (Services grid, footer)
  ui/           Design-system atoms (CTA, nav, cursor, progress)
  providers/    Smooth scroll, motion preference, GPU quality tier
content/        ⭐ Single source of copy — typed, verbatim from the Content Bible
stores/         Zustand experience store (scroll progress, active act, quality tier)
hooks/          useScrollProgress, usePrefersReducedMotion, useGpuTier…
lib/            gsap registration, three loaders/disposal, analytics
styles/         globals.css + tokens.css (design tokens: colors, easings, durations)
tests/          a11y/ + content/ (content-integrity gate)
```

## Rules of the build

1. **No copy literals in components** — all copy is imported from `content/`.
2. **`app/` and `content/` never import gsap/three** (ESLint-enforced).
3. Build follows the 6 phases in Blueprint §11; every phase ships deployable.
4. Reduced motion is a designed variant, not a degraded one.

## Deployment

Vercel (framework preset: Next.js). Every PR gets a preview deployment; `main` deploys to production. CI gates in `.github/workflows/ci.yml`.
