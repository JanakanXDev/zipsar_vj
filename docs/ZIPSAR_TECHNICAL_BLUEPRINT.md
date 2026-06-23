# 🏛 ZIPSAR — TECHNICAL BLUEPRINT
## "Ideas Beyond Dreams" — Cinematic Storytelling Website

> **Status:** AUTHORITATIVE TECHNICAL ARCHITECTURE — v1.0 (2026-06-12)
> **Content source:** All copy, scene titles, dialogues, CTAs, and services come **verbatim** from `ZIPSAR_CONTENT_BIBLE.md`. This blueprint defines *how* it is built; the Content Bible defines *what* is said. Neither overrides the other's domain.
> **Scope:** Architecture only. No implementation code. Every named file, component, and timeline in this document is a contract for the build phase.

---

# 0. EXECUTIVE OVERVIEW

## 0.1 What we are building

A single-page, scroll-driven cinematic experience that plays the Content Bible's six-chapter narrative — **Prologue → Act 1 → Act 2 → Act 3 → Act 4 → Finale** — as one continuous "film," followed by two static sections (Services grid, contact). The visual language per the Content Bible's Design Aesthetic: dark background, neon accents (blues, purples, greens), minimalistic yet immersive — *like entering a sci-fi lab* — with parallax scrolling, smooth transitions, and interactive elements during story progression.

## 0.2 Core architectural thesis

**One persistent WebGL canvas behind a semantic DOM narrative layer.**

- The 3D world (cosmos → Earth → cities → lab → future) lives in a single fixed-position canvas that never unmounts. Scroll position drives camera and scene transitions.
- The story copy lives in **real DOM text**, layered above the canvas. This single decision simultaneously solves SEO (crawlable content), accessibility (screen-reader-readable narrative), and reduced-motion fallback (the story works with the canvas removed entirely).
- Scroll is the only "play head." There is no autoplaying video; the user is the director.

## 0.3 Technology stack (decision record)

| Layer | Choice | Why (over alternatives) |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript (strict)** | SSG/SSR for SEO (a hard requirement); file-based routing for future pages; React Server Components keep the narrative HTML in the initial payload. Vite+React rejected: no first-class SSG/metadata story. |
| 3D | **Three.js via React Three Fiber (R3F v9) + drei + react-postprocessing** | Declarative scene graph that composes with React component hierarchy; drei provides battle-tested primitives (instancing, text, environment). Raw Three.js rejected: imperative lifecycle management duplicates what React already does. |
| Animation | **GSAP 3.13+ (ScrollTrigger, SplitText, DrawSVG, MotionPath, Flip)** | All plugins now free; ScrollTrigger is the industry standard for scroll choreography. Framer Motion rejected for scroll work: timeline orchestration across DOM + WebGL is GSAP's home turf. |
| Smooth scroll | **Lenis** | Lighter than ScrollSmoother, plays cleanly with R3F and native scroll position (no transform-hijacked body, so position: sticky and browser find-in-page still work). |
| Styling | **Tailwind CSS v4 + CSS custom-property design tokens** | Tokens (colors, type scale, motion) live in CSS variables so the 3D layer and DOM layer read the same palette. |
| State | **Zustand** | One tiny store for cross-cutting runtime state (scroll progress, active act, quality tier, reduced-motion flag). React context rejected for frame-rate data: re-render storms. |
| Content | **Typed content module mirroring the Content Bible** | All copy imported from one `content/` module; components never contain literal copy strings. Enforces the Content Bible rule mechanically. |
| Deployment | **Vercel** | Native Next.js target, preview deployments, edge network, analytics. |

## 0.4 Guiding principles (rank-ordered; resolve conflicts top-down)

1. **Content integrity** — every visible word traces to the Content Bible, verbatim.
2. **Accessibility is the floor, not a variant** — the site must fully work with no WebGL, no motion, no pointer.
3. **Performance is a feature of cinema** — a stuttering film is worse than no film. 60fps on mid-tier hardware or degrade gracefully.
4. **Awwwards polish** — micro-interactions, easing discipline, and scene transitions are first-class deliverables, not garnish.
5. **Maintainability** — each act is an isolated module; adding "Act 5" must not touch Acts 1–4.

---

# 1. COMPLETE PROJECT ARCHITECTURE

## 1.1 Layered architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5 — DELIVERY        Vercel Edge · CDN · CI/CD        │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4 — APPLICATION     Next.js App Router · routes ·    │
│                            metadata · sitemap · OG images   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3 — EXPERIENCE      ┌──────────────┬───────────────┐ │
│  (the film)                │ NarrativeLayer│ ExperienceCanvas│
│                            │ (semantic DOM)│ (R3F WebGL)   │ │
│                            └──────┬───────┴───────┬───────┘ │
│                                   └── Choreographer ─┘       │
│                            (GSAP master timeline + Lenis)    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 — STATE           Zustand experience store ·       │
│                            quality tier · a11y prefs        │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1 — CONTENT         contentBible module (typed,      │
│                            verbatim from ZIPSAR_CONTENT_    │
│                            BIBLE.md) · design tokens        │
└─────────────────────────────────────────────────────────────┘
```

**Dependency rule:** arrows point downward only. The content layer knows nothing about React; the canvas never imports copy directly (it receives it via props); the choreographer is the *only* module that knows both DOM and WebGL exist.

## 1.2 The three runtime actors

| Actor | Owns | Never touches |
|---|---|---|
| **NarrativeLayer** (DOM) | Semantic HTML, copy, CTAs, focus order, headings | Three.js objects |
| **ExperienceCanvas** (WebGL) | Scene graph, materials, camera, postprocessing | Copy strings, scroll listeners |
| **Choreographer** (GSAP) | Master timeline, ScrollTriggers, syncing both actors via refs/store | Rendering of either layer |

This separation means the reduced-motion build simply omits the Choreographer's scroll-scrub timelines and the Canvas, and the site still reads as a complete, beautiful document.

## 1.3 Page map

| Route | Type | Content (per Content Bible) |
|---|---|---|
| `/` | The cinematic experience | Prologue, Acts 1–4, Finale, Services Section, contact CTA |
| `/services` *(optional phase 2)* | Static, SSG | Deep-dive on the 7 services (verbatim descriptions as anchors) |
| `404` | Static | On-brand "lost in space" page (new copy → requires approval per Content Bible rules) |

Phase 1 ships `/` only; the architecture leaves room without rework.

## 1.4 Section-to-Content-Bible mapping (build contract)

| # | Site section | Scene Title (verbatim) | Content Bible source |
|---|---|---|---|
| 1 | Prologue | "The World Needs More Dreamers" | Prologue: The Spark — narration, name, tagline, vision, mission |
| 2 | Act 1 | "You've Got an Idea. We've Got You." | Act 1 — dialogue + 3 "Section Explains" points |
| 3 | Act 2 | "Every Pixel. Every Line. A Purpose." | Act 2 — 4-chapter breakdown + overlay icons |
| 4 | Act 3 | "More Than Launching. We Nurture." | Act 3 — content line, 4 sections, AI dialogue |
| 5 | Act 4 | "Unlocking Dreams You Haven't Dreamt Yet" | Act 4 — labs teaser copy |
| 6 | Finale | "Your Turn." | Finale — 🚀 Start Your Journey CTA block |
| 7 | Services | (static) | 🧠 Services Section — 7 services, exact one-liners |
| 8 | Footer | — | Tagline + secondary CTA "💬 Let's chat. Tell us your dream." |

---

# 2. FOLDER STRUCTURE

```
zipsar/
├── app/                                # Next.js App Router (Layer 4)
│   ├── layout.tsx                      # Root: fonts, tokens, providers, metadata
│   ├── page.tsx                        # "/" — assembles narrative sections (RSC)
│   ├── sitemap.ts                      # Generated sitemap
│   ├── robots.ts                       # Robots policy
│   ├── opengraph-image.tsx             # OG image (dark + neon brand frame)
│   └── (legal)/                        # Future: privacy, imprint (route group)
│
├── components/
│   ├── experience/                     # Layer 3 — the film
│   │   ├── ExperienceShell.tsx         # Mounts Canvas + Choreographer (client)
│   │   ├── canvas/                     # WebGL world (R3F) — see §5
│   │   │   ├── ExperienceCanvas.tsx
│   │   │   ├── SceneDirector.tsx
│   │   │   ├── CameraRig.tsx
│   │   │   ├── PostFX.tsx
│   │   │   ├── scenes/
│   │   │   │   ├── CosmosScene.tsx     # Prologue
│   │   │   │   ├── EncounterScene.tsx  # Act 1
│   │   │   │   ├── BuildScene.tsx      # Act 2
│   │   │   │   ├── EvolutionScene.tsx  # Act 3
│   │   │   │   ├── FutureScene.tsx     # Act 4
│   │   │   │   └── FinaleScene.tsx     # Finale
│   │   │   ├── actors/                 # Reusable 3D objects
│   │   │   │   ├── Starfield.tsx
│   │   │   │   ├── Earth.tsx
│   │   │   │   ├── NeonGrid.tsx
│   │   │   │   ├── ParticleField.tsx
│   │   │   │   ├── WireframeBlueprint.tsx
│   │   │   │   └── OracleLight.tsx     # Act 1 "helpful AI / Greek oracle" presence
│   │   │   └── materials/              # Custom shader materials (GLSL)
│   │   │       ├── nebula/
│   │   │       ├── hologram/
│   │   │       └── neonGlow/
│   │   ├── narrative/                  # Semantic DOM sections — see §3
│   │   │   ├── PrologueSection.tsx
│   │   │   ├── Act1Encounter.tsx
│   │   │   ├── Act2Build.tsx
│   │   │   ├── Act3Evolution.tsx
│   │   │   ├── Act4Future.tsx
│   │   │   ├── FinaleSection.tsx
│   │   │   └── primitives/
│   │   │       ├── SceneTitle.tsx
│   │   │       ├── NarrationBlock.tsx
│   │   │       ├── DialogueExchange.tsx
│   │   │       └── ChapterStep.tsx     # Act 2 numbered chapters
│   │   └── choreography/               # GSAP layer — see §4 & §6
│   │       ├── Choreographer.tsx       # Registers all act timelines
│   │       ├── timelines/
│   │       │   ├── prologue.timeline.ts
│   │       │   ├── act1.timeline.ts
│   │       │   ├── act2.timeline.ts
│   │       │   ├── act3.timeline.ts
│   │       │   ├── act4.timeline.ts
│   │       │   └── finale.timeline.ts
│   │       ├── motion.tokens.ts        # Durations, easings, stagger constants
│   │       └── reducedMotion.ts        # Static-variant choreography
│   │
│   ├── sections/                       # Non-cinematic static sections
│   │   ├── ServicesGrid.tsx            # 🧠 Smart Grid (7 services)
│   │   ├── ServiceCard.tsx
│   │   └── SiteFooter.tsx
│   │
│   ├── ui/                             # Design-system atoms
│   │   ├── CtaButton.tsx               # 🚀 Start Your Journey
│   │   ├── NavBar.tsx                  # Minimal overlay nav + skip link
│   │   ├── ScrollProgress.tsx          # Film-reel progress indicator
│   │   ├── SkipToContent.tsx
│   │   └── Cursor.tsx                  # Custom cursor (pointer-fine only)
│   │
│   └── providers/
│       ├── SmoothScrollProvider.tsx    # Lenis + ScrollTrigger sync
│       ├── MotionPreferenceProvider.tsx
│       └── QualityTierProvider.tsx     # GPU tier detection
│
├── content/                            # Layer 1 — SINGLE SOURCE OF COPY
│   ├── contentBible.ts                 # Typed, verbatim from ZIPSAR_CONTENT_BIBLE.md
│   ├── seo.ts                          # Titles/descriptions (composed from Bible lines)
│   └── types.ts                        # Scene, Dialogue, Service, CTA types
│
├── stores/
│   └── experienceStore.ts              # Zustand: scrollProgress, activeAct,
│                                       # qualityTier, prefersReducedMotion, webglOk
│
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useActiveAct.ts
│   ├── usePrefersReducedMotion.ts
│   └── useGpuTier.ts
│
├── lib/
│   ├── gsap.ts                         # Central plugin registration (one place)
│   ├── three/                          # Loaders, draco/ktx2 setup, disposal utils
│   └── analytics.ts
│
├── styles/
│   ├── globals.css                     # Tailwind v4 entry
│   └── tokens.css                      # --color-*, --ease-*, --duration-*, type scale
│
├── public/
│   ├── models/                         # .glb (Draco + Meshopt compressed)
│   ├── textures/                       # .ktx2 / .webp
│   ├── fonts/                          # Variable font subsets (woff2)
│   └── og/
│
├── tests/
│   ├── a11y/                           # axe + keyboard-path tests
│   └── content/                        # ⭐ Content-integrity test: rendered copy
│                                       #    must match contentBible verbatim
│
├── .github/workflows/ci.yml            # lint → typecheck → test → build → Lighthouse CI
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**Conventions:**
- `*.timeline.ts` files export pure timeline-builder functions (testable, no side effects at import).
- Anything importing `three` or `gsap` is client-only and dynamically imported; `app/` and `content/` stay server-safe.
- One scene file per act; one timeline file per act; one narrative section per act — the act is the unit of work.

---

# 3. COMPONENT HIERARCHY

```
RootLayout (RSC)
├── MotionPreferenceProvider (client)
├── QualityTierProvider (client)
├── SmoothScrollProvider (client)
└── HomePage (RSC — narrative HTML server-rendered for SEO)
    ├── SkipToContent
    ├── NavBar
    │   └── CtaButton (compact "Let's chat")
    ├── ExperienceShell (client, dynamic import, ssr:false for canvas only)
    │   ├── ExperienceCanvas ──────────────── aria-hidden, fixed, z-0
    │   │   ├── CameraRig
    │   │   ├── SceneDirector (mounts/culls scenes by activeAct ±1)
    │   │   │   ├── CosmosScene      → Starfield, Earth, ParticleField
    │   │   │   ├── EncounterScene   → OracleLight, ParticleField
    │   │   │   ├── BuildScene       → WireframeBlueprint, NeonGrid
    │   │   │   ├── EvolutionScene   → data-graph particles, confetti burst
    │   │   │   ├── FutureScene      → sketch-mode ghosts, dotted-line shaders
    │   │   │   └── FinaleScene      → interface light-up, Starfield reprise
    │   │   └── PostFX (Bloom, Vignette, ChromaticAberration·subtle)
    │   └── Choreographer (registers per-act timelines onto ScrollTriggers)
    │
    ├── main#content ─────────────────────── narrative DOM, z-10
    │   ├── PrologueSection        <header> + <h1>
    │   │   ├── SceneTitle         "The World Needs More Dreamers"
    │   │   ├── NarrationBlock     "In a world filled with complexity…"
    │   │   ├── Brand lockup       Zipsar — "Ideas Beyond Dreams"
    │   │   ├── VisionStatement    (blockquote)
    │   │   └── MissionStatement   (blockquote)
    │   ├── Act1Encounter          <section aria-labelledby>
    │   │   ├── SceneTitle         "You've Got an Idea. We've Got You."
    │   │   ├── DialogueExchange   Client ↔ Zipsar (2 lines)
    │   │   └── Explains list      (3 verbatim points)
    │   ├── Act2Build
    │   │   ├── SceneTitle         "Every Pixel. Every Line. A Purpose."
    │   │   ├── ChapterStep ×4     Requirements & Discovery / Design /
    │   │   │                      Review Cycles / Development & Sprint Meetings
    │   │   └── OverlayIcons       🖌 💻 ⚙ 🤝
    │   ├── Act3Evolution
    │   │   ├── SceneTitle         "More Than Launching. We Nurture."
    │   │   ├── NarrationBlock     "We don't disappear after launch…"
    │   │   ├── Sections list      (4 verbatim points)
    │   │   └── DialogueExchange   "We need an AI assistant…" / "Already prototyping."
    │   ├── Act4Future
    │   │   ├── SceneTitle         "Unlocking Dreams You Haven't Dreamt Yet"
    │   │   └── NarrationBlock     "Our labs are brewing something exciting…"
    │   ├── FinaleSection
    │   │   ├── SceneTitle         "Your Turn."
    │   │   ├── CtaButton primary  🚀 Start Your Journey
    │   │   ├── Supporting line    "One service or a whole roadmap—Zipsar flexes with you."
    │   │   └── CtaButton secondary 💬 Let's chat. Tell us your dream.
    │   └── ServicesGrid           <section> Smart Grid
    │       └── ServiceCard ×7     verbatim name + one-liner each
    ├── SiteFooter
    └── ScrollProgress (aria-hidden, decorative)
```

**Hierarchy rules:**
- Headings: exactly one `<h1>` (Prologue brand lockup), each scene title an `<h2>`, Act 2 chapters `<h3>`. Document outline reads as the complete story.
- Every narrative component receives copy **as props from `contentBible.ts`** — zero hardcoded strings in components (enforced by the content-integrity test).
- `SceneDirector` keeps at most the active scene ±1 mounted; others are disposed (geometry/material cleanup contract in §5.6).
- DOM sections own layout and copy; they expose `ref`s that timelines animate. Components never call GSAP themselves — only the choreography layer does.

---

# 4. ANIMATION ARCHITECTURE (Motion Design)

## 4.1 Motion design language — "Cinematic Drift"

The brand feel is *cosmic, confident, unhurried*. Three motion rules govern everything:

1. **Nothing snaps.** Every property eases; minimum perceptible duration 0.4s, hero moments 1.2–2.0s of scroll-scrub.
2. **Depth over distance.** Elements move in z (scale/parallax/blur) more than in x/y — the camera travels, the world stays still.
3. **Light leads.** Transitions are announced by light (glow intensifying, neon tracing) a beat before geometry moves.

## 4.2 Motion tokens (single source: `motion.tokens.ts` + `tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--ease-drift` | cubic-bezier(0.22, 1, 0.36, 1) | Default — camera, section reveals |
| `--ease-arrive` | cubic-bezier(0.16, 1, 0.3, 1) | Elements entering (decelerate hard) |
| `--ease-exit` | cubic-bezier(0.7, 0, 0.84, 0) | Elements leaving (accelerate away) |
| `--ease-pulse` | sine in-out | Glow breathing, idle loops |
| `--duration-beat` | 0.4s | Micro-interactions (hover, focus) |
| `--duration-phrase` | 0.8s | Text line reveals |
| `--duration-scene` | 1.6s | Scene-level crossfades |
| `--stagger-words` | 0.04s | SplitText word cascades |
| `--stagger-cards` | 0.08s | Services grid entrance |

All GSAP timelines and all CSS transitions read from these tokens. No magic numbers in timeline files.

## 4.3 Scroll choreography — the master storyboard

Total scroll length ≈ **800vh** for the film + natural-flow static sections. Each act owns a pinned scroll segment; within it, a normalized local progress 0→1 drives both layers.

| Scroll range | Act | DOM choreography | 3D choreography (see §5) |
|---|---|---|---|
| 0–12% | **Prologue** | Scene title fades up word-by-word (SplitText). Narration lines reveal sequentially. Brand lockup + tagline hold center. Vision/Mission blockquotes drift in with parallax offset. | Camera dolly: deep space → Earth approach → city-light glow. Starfield parallax 3 layers. |
| 12–24% | **Act 1** | Dialogue renders as chat-like exchange: Client line types in, beat, Zipsar line answers with glow. 3 "explains" points stagger in. | OracleLight materializes (shader dissolve-in); particles gather toward it. |
| 24–46% | **Act 2** | Longest act. 4 ChapterSteps pinned sequence — each chapter: number draws (DrawSVG), title arrives, body line reveals; previous chapter recedes in z. Overlay icons orbit into a row. | WireframeBlueprint assembles line-by-line; NeonGrid floor pulses per chapter; montage feel via light flickers. |
| 46–60% | **Act 3** | Narration line reveals. 4 sections list staggers. AI dialogue exchange repeats Act 1 pattern (continuity). Confetti micro-burst at "product launch" beat. | Deployment stream particles; graph lines draw upward; confetti = one-shot GPU particle burst. |
| 60–72% | **Act 4** | Copy reveals over ghosted mockups; dotted-line SVGs draw continuously while pinned. | Sketch-mode wireframe ghosts, faded mockup planes at varying z, dotted shader lines. |
| 72–84% | **Finale** | "Your Turn." lands big. CTA buttons arrive with `--ease-arrive` + idle glow pulse. Supporting line fades in beneath. | Camera pulls back; Zipsar "interface" lights up — neon UI planes ignite in sequence; starfield reprise (bookend with Prologue). |
| 84–100% | **Services + Footer** | Canvas fades to 20% opacity ambient starfield. ServicesGrid cards stagger in on entry (`--stagger-cards`), normal scroll (unpinned). | Ambient idle only; frameloop drops to demand. |

## 4.4 Timeline orchestration model

- **One ScrollTrigger per act**, pinning its narrative section; each owns a local GSAP timeline built by its `*.timeline.ts` builder.
- A **master progress observer** writes global progress + activeAct to the Zustand store every scroll tick — the canvas reads from the store, never from ScrollTrigger directly (single sync point, no listener sprawl).
- **Scrub value 0.8–1.2s** (per-act tuning) for the "heavy film camera" feel; never `scrub: true` (too raw).
- **Snap:** gentle snap to act boundaries on scroll-stop (directional, low velocity) so users never rest mid-transition.
- Non-scroll animations (hover, focus, CTA pulse, cursor) live in component-scoped GSAP contexts, independent of the master flow.

## 4.5 Micro-interaction inventory (Awwwards layer)

| Element | Interaction |
|---|---|
| CTA buttons | Magnetic hover (pointer-fine only), neon border trace on hover (DrawSVG), press scale 0.97 |
| Service cards | 3D tilt toward cursor (max 6°), glow follows pointer, icon micro-bounce on enter |
| Nav links | Underline draws center-out; current-act indicator morphs (Flip) |
| Custom cursor | Dot + trailing ring; ring expands over interactive elements; hidden on touch |
| Scroll progress | Thin film-strip edge indicator with act tick marks |
| Dialogue lines | Caret blink during type-in; subtle glow pulse on the Zipsar lines |
| Text reveals | SplitText by words; lines mask-reveal from baseline |

## 4.6 Reduced-motion variant (full spec in §8)

`prefers-reduced-motion: reduce` ⇒ Choreographer registers the **static variant**: no pinning, no scrub, no parallax, no SplitText. Sections are normal document flow; the only animation is a ≤0.3s opacity fade on section entry (no transform). Canvas is replaced by a static gradient/starfield poster image. **This is a designed variant, not a degraded one** — typography and spacing are tuned for it specifically.

---

# 5. THREE.JS ARCHITECTURE

## 5.1 Canvas strategy

- **Single persistent `<Canvas>`** (R3F), `position: fixed; inset: 0; z-index: 0;`, `aria-hidden="true"`, `pointer-events: none` (DOM owns all input; pointer position is forwarded to the store for shader/tilt effects).
- Dynamically imported, `ssr: false`, mounted after first paint (LCP is the DOM hero text, never the canvas).
- **DPR clamped** to [1, 2], reduced to [1, 1.5] on mid-tier GPUs.
- `frameloop="always"` while scrolling or any timeline is active; `"demand"` after 500ms idle (battery + thermals).
- WebGL context-loss handler: attempts one restore, else swaps to the static poster fallback and sets `webglOk: false`.

## 5.2 Scene graph organization

```
<Canvas>
└── SceneDirector
    ├── CameraRig                 # One PerspectiveCamera; rig moves, scenes don't
    │   └── (camera path defined per act; positions are pure data —
    │        an exported keyframe table, scrubbed by act progress)
    ├── SharedActors              # Persist across all acts
    │   ├── Starfield             # GPU-instanced points, 3 parallax shells
    │   └── AmbientNebula         # Fullscreen shader plane behind everything
    ├── ActStage (×6)             # One group per scene, mounted activeAct ±1
    │   └── [scene-specific actors per §3]
    └── PostFX                    # EffectComposer: Bloom → Vignette → (CA on hi-tier)
```

**Transition model:** scenes crossfade via per-scene global opacity uniform + camera travel — never hard mounts/unmounts on screen. Mount happens one act early (invisible), unmount one act late.

## 5.3 Visual systems per scene (build contracts)

| Scene | Key systems | Technique |
|---|---|---|
| CosmosScene | Starfield (15k pts), Earth, atmosphere | Instanced points; Earth = low-poly sphere + emissive night-lights texture + fresnel atmosphere shader. The "zoom to Earth, cities, people" beat is camera dolly + city-light texture intensify. |
| EncounterScene | OracleLight | Volumetric-look light column: layered alpha planes + noise shader dissolve. "Helpful AI / mythical Greek oracle" = abstract luminous presence, not a character mesh. |
| BuildScene | WireframeBlueprint, NeonGrid | Line segments with draw-progress shader (uniform-driven, GSAP-scrubbed); grid = shader plane with animated UV pulse per chapter. |
| EvolutionScene | Data graphs, confetti | Graph lines via the same draw-progress shader; confetti = one-shot instanced burst (~800), pre-allocated, fire-and-forget. |
| FutureScene | Ghost mockups, dotted lines | Translucent planes with blueprint shader; dotted lines = dashed-line material with animated dash offset. |
| FinaleScene | Interface ignition | Neon UI planes (hologram material) igniting in stagger; starfield reprise = camera return to Prologue orientation (bookend). |

## 5.4 Asset pipeline

| Asset type | Format | Budget |
|---|---|---|
| Models | glTF (.glb) + Draco/Meshopt | ≤ 1.5 MB total, ≤ 30k tris on screen |
| Textures | KTX2 (Basis) primary, WebP fallback | ≤ 2 MB total; max 2048², most 1024² |
| Shaders | GLSL co-located in `materials/` | Shared noise/easing chunks via includes |
| Fonts (3D text) | None — all text is DOM | 3D text rejected: SEO + a11y + cost |

Loading: drei async loaders inside Suspense; Prologue assets preloaded before reveal; later acts lazy-load behind scroll position (act N+2 prefetched when act N activates). A minimal brand loader (logo + neon progress line) gates first reveal; max 2.5s, then reveal regardless and stream in.

## 5.5 Quality tiers (set once at boot by `QualityTierProvider`)

| Tier | Detection | Settings |
|---|---|---|
| **High** | detect-gpu tier ≥ 2, no `saveData`, desktop | DPR 2, Bloom + Vignette + CA, 15k stars, all shaders |
| **Mid** | tier 1 or mobile | DPR 1.5, Bloom only, 6k stars, simplified nebula |
| **Low** | tier 0, old mobile | DPR 1, no postprocessing, 2k stars, flat materials |
| **Off** | no WebGL2 / context loss / reduced-motion | Static poster image; site fully functional |

## 5.6 Memory & disposal contract

- Every scene component disposes geometries/materials/textures on unmount (shared util in `lib/three/`).
- All vectors/quaternions used per-frame are pre-allocated module-level scratch objects — **zero allocations inside `useFrame`**.
- Texture/geometry caches keyed by URL; React StrictMode double-mount safe.

---

# 6. GSAP ARCHITECTURE

## 6.1 Plugin registry (one place: `lib/gsap.ts`)

Registered once: **ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, Flip.** Client-only module; importing it anywhere else than the choreography layer and `ui/` micro-interactions is a lint error.

## 6.2 Module layout & ownership

```
choreography/
├── Choreographer.tsx        # The only component that creates ScrollTriggers.
│                            # On mount: builds all act timelines inside ONE
│                            # gsap.context(); on unmount: ctx.revert().
├── timelines/*.timeline.ts  # Pure builders: (refs, tokens, store) → Timeline.
│                            # No DOM queries — refs only. No side effects.
├── motion.tokens.ts         # §4.2 tokens as typed constants
└── reducedMotion.ts         # Static-variant registration
```

**Rules:**
1. **One `gsap.context()` wraps the whole experience** — teardown is a single `revert()`; no orphaned ScrollTriggers in dev fast-refresh.
2. **Timelines are built from refs passed in**, never from `document.querySelector` — keeps builders testable and React-safe.
3. **`gsap.matchMedia()` is the variant switch**: `(prefers-reduced-motion: no-preference)` → film timelines; `(prefers-reduced-motion: reduce)` → static variant; breakpoint queries adjust pin distances/parallax for mobile.
4. ScrollTrigger refresh strategy: refresh on font-load and on canvas-ready; `ignoreMobileResize` for address-bar jitter.

## 6.3 GSAP ↔ Three.js bridge (the critical integration)

GSAP never touches Three objects directly across module boundaries. The bridge:

```
ScrollTrigger (per act)
   └─ onUpdate → experienceStore.setActProgress(act, p)   // one write per tick
                       │
        Canvas reads in useFrame (R3F)                     // one read per frame
                       │
        CameraRig + scene uniforms interpolate toward
        target values with damped lerp (smoothing ≈ 0.08)
```

- **Why:** decouples scroll tick rate from render frame rate; damping gives the "heavy camera" cinematic lag for free; store is the single sync point (debuggable, recordable).
- **Exception:** one-shot 3D moments (confetti burst, oracle ignition) are triggered by timeline `call()`s that fire store events the relevant scene subscribes to.
- GSAP's ticker is unified with R3F's frameloop (one RAF driver) to prevent double-RAF drift.

## 6.4 Lenis integration

- `SmoothScrollProvider` creates Lenis on the window scroller, syncs `lenis.on('scroll') → ScrollTrigger.update()`, and drives Lenis from GSAP's ticker (single RAF).
- Lerp factor 0.1 desktop; **native scroll on touch devices** (Lenis `syncTouch: false`) — fighting touch momentum is an Awwwards anti-pattern.
- Anchor navigation (nav links → acts) uses Lenis scrollTo with act offsets; focus moved programmatically to the target heading on arrival (a11y §8.4).
- Disabled entirely under reduced-motion.

## 6.5 Text animation policy (SplitText)

- SplitText runs **after hydration, behind `fonts.ready`**, and wraps in aria-safe mode (original text preserved for AT; split spans `aria-hidden` with an sr-only copy).
- Split by words only (not chars) for narrative lines — readability over flash; chars allowed for the six short scene titles only.
- Reverted under reduced-motion (no splitting at all).

---

# 7. SEO ARCHITECTURE

## 7.1 Rendering strategy

- `/` is **fully static (SSG)**. The complete narrative HTML — every verbatim line from the Content Bible — is in the initial server-rendered payload. The canvas and choreography hydrate later as pure enhancement. Crawlers see the entire story with zero JS.
- No client-side-only copy. The content-integrity test (in `tests/content/`) asserts the rendered HTML of `/` contains every narrative line, dialogue, CTA, and service description from `contentBible.ts` — SEO and Content Bible compliance verified in one test.

## 7.2 Metadata plan (Next Metadata API)

| Field | Source (verbatim composition from Content Bible) |
|---|---|
| `<title>` | `Zipsar — Ideas Beyond Dreams` |
| Meta description | Composed from Prologue narration: "Zipsar was born to make dreams real. Bold, simple, extraordinary." (+ services keywords) |
| OG/Twitter | Dark + neon brand card via `opengraph-image.tsx`; `summary_large_image` |
| Canonical | Absolute self-referencing |
| Theme color | Dark background token |

## 7.3 Structured data (JSON-LD)

- **`Organization`** — name Zipsar, slogan "Ideas Beyond Dreams", logo, URL, contact point.
- **`WebSite`** — site-level entity.
- **`Service` ×7** — one per Services Section entry, `description` = the verbatim one-liner (e.g., UI/UX Design — "Where beauty meets logic.").
- Rendered server-side in `layout.tsx`/`page.tsx`; validated in CI with a schema linter.

## 7.4 Semantic & crawl infrastructure

- Heading outline = story outline (§3): `h1` brand lockup → `h2` scene titles → `h3` Act 2 chapters and service names. A crawler's document outline literally reads the film script.
- `sitemap.ts` + `robots.ts` generated; image alt text for the poster fallback describes the cosmic scene.
- **Section anchors** (`#prologue`, `#act-1`…`#services`, `#contact`) — deep-linkable, used by nav, sitemap-friendly.
- Performance is SEO: Core Web Vitals budgets in §9 are enforced in CI via Lighthouse — LCP element is the Prologue `h1` text block, deliberately not the canvas.

---

# 8. ACCESSIBILITY ARCHITECTURE (WCAG 2.2 AA)

## 8.1 Foundational stance

The DOM narrative **is** the accessible experience. The canvas is decorative (`aria-hidden`), all meaning lives in semantic HTML. If WebGL, JS, or motion are unavailable, nothing meaningful is lost.

## 8.2 Motion safety

- `prefers-reduced-motion: reduce` honored at every layer via one source of truth (`MotionPreferenceProvider` + `gsap.matchMedia`): no pinning, no scrub, no parallax, no smooth-scroll, canvas → static poster (§4.6).
- An **in-page motion toggle** in the nav ("Reduce motion") overrides OS setting both directions; persisted in localStorage. Awwwards-grade sites respect the user who gets motion-sick *and* the user on a corporate machine with motion force-disabled.
- No flashing > 3Hz anywhere (confetti and light pulses tuned below threshold).

## 8.3 Semantics & screen readers

- Landmarks: `header` (nav), `main#content` (the story), `footer`. Each act: `<section aria-labelledby="{act}-title">`.
- Dialogues marked up as definition-style pairs with visible speaker labels ("Client:", "Zipsar:") — already verbatim in the Content Bible.
- Decorative emojis in CTAs (🚀, 💬) wrapped `aria-hidden` with clean accessible names ("Start Your Journey", "Let's chat. Tell us your dream.").
- SplitText aria-safe pattern (§6.5); scroll progress and cursor are `aria-hidden`.
- Live region politeness: none needed — nothing announces on scroll (scroll-driven reveals are visual-only; the text is always in the DOM for AT regardless of its animated opacity, via `visibility` strategy, not `display:none`).

## 8.4 Keyboard & focus

- `SkipToContent` first tab stop → `main`.
- Full keyboard path: nav → each act's CTA-relevant controls → finale CTAs → service cards → footer. Pinned sections must not trap focus: pin containers are not focusable; focusable elements inside follow document order.
- Nav anchor jumps move focus to the target section heading (`tabindex="-1"` + programmatic focus) so keyboard/AT users land where sighted users do.
- Custom cursor never replaces the native focus indicator: `:focus-visible` ring token (2px neon, 2px offset, ≥3:1 against background) on every interactive element.

## 8.5 Visual accessibility on a dark neon theme

- Contrast contract in `tokens.css`: body text ≥ 7:1 (AAA target, easy on near-black), large display text ≥ 4.5:1, UI borders/icons ≥ 3:1. **Neon accents are validated per-pairing in CI** (automated token contrast test) — neon-on-dark fails silently otherwise (e.g., pure neon blue #00BFFF on #0A0A0F passes large-text only; body copy uses a desaturated high-luminance variant).
- Text never rendered inside the canvas — always DOM, always zoomable to 400% reflow without loss (WCAG 1.4.10).
- Forced-colors / Windows High Contrast: tokens degrade to system colors; canvas hidden.

## 8.6 Testing gates (CI-blocking)

axe-core automated scan (zero critical/serious), keyboard-only path test, reduced-motion snapshot test, contrast token test, NVDA + VoiceOver manual pass per release.

---

# 9. PERFORMANCE ARCHITECTURE

## 9.1 Budgets (CI-enforced via Lighthouse CI + bundle analysis)

| Metric | Budget |
|---|---|
| LCP (Prologue h1 text) | ≤ 2.0s (4G mid-tier) |
| INP | ≤ 200ms |
| CLS | ≤ 0.02 (pinning reserves space; fonts size-adjusted) |
| Initial JS (route, gz) | ≤ 180 KB before canvas chunk |
| Canvas chunk (lazy, gz) | ≤ 250 KB (three + R3F + drei, tree-shaken) |
| GSAP chunk (gz) | ≤ 60 KB |
| 3D assets total | ≤ 3.5 MB (≤ 1.2 MB before first reveal) |
| Fonts | ≤ 120 KB (1 variable family, subset, woff2) |
| Frame rate | 60fps high-tier / 60fps mid (reduced load) / 30fps floor low-tier |

## 9.2 Loading sequence (designed, not incidental)

```
0ms     HTML (SSG) + critical CSS → narrative text visible (LCP)
~0ms    Variable font (preloaded, swap with size-adjust fallback)
idle    Hydration of providers + nav
idle+   Canvas chunk dynamic import → Prologue assets (≤1.2MB) → canvas
        fades in UNDER the already-visible text (no layout impact)
scroll  Act N+2 assets prefetch when act N activates
```

The site is **readable in < 1s** and becomes a film progressively. The poster gradient backdrop renders in CSS instantly so the canvas fade-in is seamless.

## 9.3 Runtime performance strategy

- **Zero allocation in hot paths**: `useFrame` and scroll handlers use pre-allocated scratch objects (§5.6); store writes throttled to ticker rate.
- **Single RAF** drives GSAP ticker, Lenis, and R3F frameloop — no competing loops.
- Pinned sections use `will-change: transform` only while pinned (applied/removed by ScrollTrigger callbacks); no permanent compositing layers.
- DOM animation properties restricted to `transform`, `opacity`, `clip-path` — no layout-triggering properties in any timeline (lint rule on timeline files).
- Postprocessing: half-resolution bloom on mid tier; effects composer skipped entirely on low tier (§5.5).
- Adaptive degradation: R3F `PerformanceMonitor` steps DPR down (2 → 1.5 → 1) and disables CA → Bloom if sustained frame time > 20ms; never steps back up mid-session (no oscillation).
- Tab hidden ⇒ frameloop paused; idle 500ms ⇒ `demand` mode (§5.1).

## 9.4 Measurement

Vercel Speed Insights (field CWV) + Lighthouse CI on every PR (lab) + a dev-only stats overlay (FPS, draw calls, memory) toggled by query param. Regression = blocked merge.

---

# 10. DEPLOYMENT ARCHITECTURE

## 10.1 Environments & flow

| Env | Trigger | URL | Purpose |
|---|---|---|---|
| Local | — | localhost | Dev, stats overlay enabled |
| Preview | every PR | `*.vercel.app` per-PR | Review + full CI gates |
| Production | merge to `main` | `zipsar.com` (apex + www redirect) | Live |

Trunk-based: short-lived feature branches → PR → preview → squash-merge → auto-deploy. Production deploys are atomic with instant rollback (Vercel immutable deployments).

## 10.2 CI pipeline (GitHub Actions, all blocking)

```
PR opened
├── 1. Lint + typecheck (ESLint incl. custom rules: no copy literals in
│      components, no layout props in timelines; tsc --noEmit)
├── 2. Content-integrity test  ⭐ rendered copy ≡ contentBible ≡ Content Bible
├── 3. Unit tests (timeline builders, store, hooks)
├── 4. A11y suite (axe, keyboard path, contrast tokens, reduced-motion)
├── 5. Build + bundle-size check (budgets §9.1)
├── 6. Lighthouse CI on preview (perf ≥ 90, a11y = 100, SEO = 100)
└── 7. JSON-LD schema validation
```

## 10.3 Edge & caching

- Static HTML + assets on Vercel Edge Network; immutable hashed filenames ⇒ `Cache-Control: immutable, max-age=1y` for JS/CSS/models/textures/fonts.
- `.glb`/`.ktx2` served with correct MIME + compression (already binary-compressed; no double-gzip).
- Security headers: CSP (no inline script except JSON-LD nonce), HSTS, X-Content-Type-Options, Referrer-Policy.

## 10.4 Observability & ops

- **Field performance:** Vercel Speed Insights (CWV by device class).
- **Errors:** Sentry — with a dedicated breadcrumb channel for WebGL context loss and quality-tier downgrades (the failure modes unique to this site).
- **Analytics:** privacy-respecting (Vercel Analytics or Plausible), no cookie banner needed; custom events: act reached (scroll depth per act), CTA clicks, motion-toggle usage, quality tier distribution.
- **Uptime:** external ping on `/` + OG image route.

## 10.5 Launch checklist (gate to production DNS)

1. All CI gates green on `main`
2. Manual screen-reader pass (NVDA + VoiceOver)
3. Real-device matrix: iPhone (mid + recent), mid-tier Android, Safari/Firefox/Chrome desktop
4. Content Bible final proofread against rendered site (word-for-word)
5. 404 page copy approved (new content → needs explicit approval per Content Bible rules)
6. Domain, redirects (www→apex), OG validation (social card debuggers)

---

# 11. BUILD PHASING (recommended execution order)

| Phase | Deliverable | Proves |
|---|---|---|
| 1 | Content module + semantic narrative page (no canvas, no GSAP) + tokens | SEO/a11y floor; Content Bible compliance test green |
| 2 | Lenis + Choreographer skeleton + Prologue timeline (DOM only) | Scroll architecture |
| 3 | Canvas + SceneDirector + CosmosScene + store bridge | GSAP↔Three bridge under real load |
| 4 | Acts 1–4 + Finale scenes & timelines (one act per iteration) | The act-module isolation principle |
| 5 | Services grid + micro-interactions + reduced-motion variant polish | Awwwards layer |
| 6 | Quality tiers, perf hardening, full CI gates, launch checklist | Production readiness |

Each phase ends deployable. Phase 1 alone is already a complete, accessible, SEO-correct website.

---

# 12. RISK REGISTER

| Risk | Mitigation (already designed in) |
|---|---|
| Pinned sections + mobile address-bar resize ⇒ jank/jumping | `ignoreMobileResize`, native touch scroll, dvh-based pin sizing |
| Neon-on-dark contrast failures | Token contrast test in CI (§8.5) |
| Three.js bundle bloat | Hard chunk budget; drei imports cherry-picked; bundle check in CI |
| SplitText vs. screen readers | aria-safe split pattern (§6.5) |
| Scroll-scrub feel diverges across devices | Per-act scrub tuning + damped store bridge (§6.3); device matrix in launch checklist |
| Mission statement wording ("nursing dream") questioned late | Already flagged to owner; Content Bible is authoritative until owner amends |
| Scope growth (Act 5, new pages) | Act-module isolation (§1.4, §11 phase 4 proves it) |

---

*End of blueprint. Implementation may begin at Phase 1. Any deviation from this document during build should be recorded as an amendment here, not made silently.*

---

# 13. AMENDMENTS

| # | Date | Change | Reason |
|---|---|---|---|
| A1 | 2026-06-12 | `tailwind.config.ts` (listed in §2 tree) is **not created**. Tailwind v4 is CSS-first: all design tokens live in `styles/tokens.css` via `@theme`, loaded through `@tailwindcss/postcss`. | Tailwind v4 no longer requires a JS config; a second token location would violate the single-source-of-tokens rule (§4.2). |
| A2 | 2026-06-12 | Project scaffolded at `D:\Zipsar\zipsar` with Next.js **15.5.19**, React 19, Tailwind v4, ESLint 9 (flat config), Prettier 3. Both authoritative docs copied into `zipsar/docs/` so CI can access them; root copies remain the originals. | Setup phase executed; versions pinned by lockfile. |
| A3 | 2026-06-12 | Design system implemented. Three additions to the §2 tree: `styles/utilities.css` (Tailwind v4 `@utility` layer — glass, neon text/edges, aurora text, overline, hairline, nebula backdrop), `lib/theme.ts` (runtime CSS-token reader so the WebGL layer shares the palette per §0.3), and `app/styleguide/` (internal, noindex living style guide). Forced-colors and reduced-motion fallbacks live in `globals.css`. | Tokens needed a utility layer and a WebGL bridge; a visual styleguide makes the system verifiable. |
| A4 | 2026-06-12 | UI primitives implemented in `components/ui/` (Container, Section, Heading, GlassCard, Button, MagneticButton, AnimatedText, GradientText, CustomCursor, LoadingScreen) plus shared infra: `lib/gsap.ts` (central plugin registry per §6.1 — CustomEase registered now with named `zip-*` brand eases; remaining plugins register when choreography lands), `lib/cn.ts`, `hooks/useMediaQuery.ts`, `hooks/usePrefersReducedMotion.ts`, and `components/experience/choreography/motion.tokens.ts` (§4.2 JS mirror, created early because UI micro-interactions consume it). AnimatedText uses React-level word splitting (sr-only copy + aria-hidden fragments) instead of SplitText — SplitText remains the tool for the scroll-choreography layer (§6.5). | UI primitives needed the motion tokens and registry ahead of Phase 2; React-level splitting is SSR-faithful (no hydration flash, text always in DOM) for this generic primitive. |
| A5 | 2026-06-12 | Animation system implemented (Phase 2 skeleton). `lib/gsap.ts` now registers ScrollTrigger + SplitText (with `ignoreMobileResize`); new files: `hooks/useGsap.ts` (gsap.matchMedia-based context hook — reduced motion is a first-class variant per §6.2), `hooks/useScrollTrigger.ts` (one scrubbed timeline per section, default scrub 1, bridges progress/activeSection to the store per §6.3), `hooks/useLenis.ts` + `components/providers/SmoothScrollProvider.tsx` (Lenis on GSAP's ticker — single RAF per §9.3, native touch, disabled under reduced motion per §6.4, wired into the root layout), `stores/experienceStore.ts` (scrollProgress/velocity/activeSection/sectionProgress), and `components/experience/choreography/animations.ts` (presets: fadeUp, fadeDown, staggerIn, reveal, characterReveal via SplitText `aria:"auto"`+`mask:"chars"`+`autoSplit`, parallax, horizontalScroll, pin). | The §6 architecture realized as reusable code ahead of act timelines; presets give all future sections one motion vocabulary. |
| A6 | 2026-06-12 | Step 6 — Three.js infrastructure (R3F v9 + drei). New: `components/experience/canvas/{ExperienceCanvas,Scene,CameraRig}.tsx`, `canvas/actors/{Starfield,GalaxyParticles,FloatingParticles,StoryProps}.tsx`, `components/experience/ExperienceShell.tsx` (dynamic `ssr:false`, gates on reduced-motion / WebGL support / context-loss → CSS nebula poster), `hooks/useQualityTier.ts` (detect-gpu → High/Mid/Low). Experience store extended with `pointerX/Y`, `qualityTier`, `webglOk`. Cursor interaction system = one window pointer listener → store → read by CameraRig + FloatingParticles in `useFrame`. 60fps tactics: single draw call per particle system, zero per-frame allocation (module scratch + damp), DPR clamp by tier, `PerformanceMonitor` steps DPR down only. `content/contentBible.ts` created (verbatim) and `SparkSection.tsx` (Step 7, fixed to compile). Canvas mounted behind homepage; Three.js code-split out of First Load JS (homepage 105 kB). Demand-mode frameloop (§5.1) deferred — currently `always` with PerformanceMonitor degradation. | Step 6 realizes §5 as working, build-verified code; cursor system and tiers are the foundation Sections 1–8 build on. |
| A7 | 2026-06-12 | Step 7 — Section 1 (Prologue: The Spark) shipped in `SparkSection.tsx` and wired into the homepage `main`. One pinned scrub timeline (end 260%/190% mobile) plays char-reveal headline → tagline → scene rail → narration word-reveals → CTA, bridging progress to the store so CameraRig flies Space→Earth→Cities→Dreamers. Copy is verbatim Content Bible. **Content note:** Step 7's prompt re-paced the narration into staccato lines ("Bold./Simple./Extraordinary."); resolved by keeping the document's exact two-sentence text in the DOM and delivering the staccato via word-level reveal cadence — no rewrite. Headline/subheadline match the document exactly. Homepage First Load 161 kB (GSAP now in page bundle; Three.js still code-split). | Section 1 is the first real consumer of the §4/§6 motion system and the §5 camera bridge. |
| A8 | 2026-06-12 | Step 8 — Section 2 (Why Zipsar Exists) shipped: `WhySection.tsx` (Vision + Mission glass cards) + reusable `hooks/useTilt.ts` (3D tilt-toward-cursor + cursor-following glow via `--glow-x/y/opacity` CSS vars, pointer-fine + motion-OK only). Effects: glassmorphism (GlassCard strong), glow (neon edge + inner radial glow overlay), parallax (differential scrub drift per card via the §4 `parallax` preset), mouse interaction (useTilt). Copy verbatim (Vision 2 lines incl. "nursing dream" mission). Section heading uses owner-approved `extras.whyOverline`. Wired after SparkSection; homepage First Load 163 kB. | Vision/Mission realize the §4.5 micro-interaction layer; useTilt is shared infra for Step 11 service cards. |
| A9 | 2026-06-12 | Step 9 — Section 3 (Act 1: The Encounter) shipped: `EncounterSection.tsx`. Scroll-triggered conversation — one played (non-scrubbed) timeline reveals char headline → per-message animated typing indicator (new `--animate-typing` token in tokens.css) → bubble pop-in from speaker's side (`back.out`, Client left / Zipsar right, Zipsar bubble neon-edge glow) → 3 "explains" points stagger. Typing indicators are absolute/opacity-0 so reduced motion shows a clean static transcript. Dialogue + explains verbatim. Wired after WhySection; homepage First Load 164 kB. | Realizes §4.5 chat-bubble micro-interactions; non-scrub timeline gives the conversation a natural cadence. |
| A10 | 2026-06-12 | Step 10 — Section 4 (Act 2: The Build) shipped: `BuildSection.tsx` + `narrative/primitives/BuildPreview.tsx` (CSS-wireframe placeholder UI mockups, one per chapter; `--animate-float` token). Pinned horizontal storytelling (§4.3 Act 2) via a scrub tween translating the track, with progress line (scaleX from onUpdate), activating step indicators (`.js-act2-step.is-active` CSS toggled in onUpdate — no re-render), and per-panel reveals via ScrollTrigger `containerAnimation`. **Reduced-motion / no-JS fallback:** viewport defaults to `overflow-x-auto` + `tabIndex=0` so chapters are a natively scrollable, keyboard-focusable row — no clipping; motion mode sets overflow hidden + pins. 4 chapters + overlay icons verbatim. Homepage First Load 165 kB. | First pinned horizontal section; the overflow-auto fallback keeps it content-complete without motion. |
| A11 | 2026-06-12 | Step 11 — Section 5 (Services) shipped: `components/sections/ServicesSection.tsx` (named ServicesSection, internal ServiceCard — supersedes the §2-tree ServicesGrid/ServiceCard split). All 7 services verbatim in a Smart Grid (sm:2/lg:3). Effects: glass cards (GlassCard interactive), hover glow (cursor-following inner glow via useTilt + neon edge), border animation (new `neon-border-trace` utility in globals.css — conic gradient masked to a 1px ring, `@property --trace-angle` rotation, inert under reduced motion), micro interactions (3D tilt, icon lift+scale, "Explore →" arrow nudge, blurb brighten). Icons decorative/aria-hidden; names+blurbs verbatim. Homepage First Load 166 kB. | Reuses useTilt/GlassCard; adds the reusable border-trace utility to the system. |
| A12 | 2026-06-12 | Step 12 — Section 6 (Act 3: The Evolution) shipped: `EvolutionSection.tsx` + `primitives/GrowthChart.tsx` (decorative SVG area/line chart, aria-hidden, illustrative — NO invented KPI numbers). Growth animations: chart revealed by animating clip-rect `attr.width` 0→full + endpoint pop; nurture rows rise (staggerIn) with drawing neon underlines (scaleX). AI dialogue reuses the DialogueExchange primitive with a bubble pop-in reveal. Content line, 4 nurture items, and dialogue verbatim (Step 12's 5-item paraphrase set aside in favor of the document's 4 items). Chart full-visible by default → reduced-motion safe. Homepage First Load 167 kB. | Realizes the §4.3 Act 3 data-viz beat; decorative-only viz avoids presenting fabricated metrics as fact. |
| A13 | 2026-06-12 | Step 13 — Section 7 (Act 4: The Future) shipped: `FutureSection.tsx` + reusable `primitives/ParticleField.tsx`. R&D Lab with: fog reveal (blurred mist overlay, `invisible` by default → fades out on enter via fromTo autoAlpha), floating future-product teaser cards (sketch-mode placeholders "Concept 0X / Revealing soon" — no invented products; `animate-float` ambient + blur→sharp reveal), and particle interactions (ParticleField — dots repel from cursor via gsap.quickTo on the shared ticker, no second rAF; centers cached, no per-move layout reads). Scene title + 2 content lines verbatim; "R&D Lab" overline is owner-approved extra. Reduced motion: fog stays invisible, cards sharp/visible, particles static-twinkle. Homepage First Load 169 kB. | Completes the §4.3 Act 4 beat; ParticleField is reusable cursor-reactive decor that respects the single-RAF rule. |
| A14 | 2026-06-12 | Step 14 — Section 8 (Finale: Your Turn) shipped: `FinaleSection.tsx`. Pinned scrub writes finale progress to the store → GalaxyParticles CONVERGE (stars pulling inward, the §5.3 hook wired in Step 6); ignition glow blooms behind the CTA ("dream becoming reality"); char-reveal headline + 3 CTAs stagger in. Buttons: "🚀 Start Your Journey" (primary, verbatim), "Book a Consultation", "💬 Contact Zipsar" (extras). **Content reconciliation:** "Your Turn." (overline) + "Start Your Journey" + support line are verbatim; "Let's Talk" headline & "Tell us your dream" subhead are owner-approved Step-14 copy (added to extras); document `ctaSecondary` text preserved in the module. All 8 narrative sections now live. Homepage First Load 169 kB. | Finale closes the cinematic arc and is the payoff for the Step-6 galaxy-convergence wiring. |
| A15 | 2026-06-12 | Step 15 — Footer shipped: `components/sections/SiteFooter.tsx` (static server component, 0 added JS). Columns: Company (brand + tagline + theme), Company nav (anchor links to sections), Services (7 verbatim names → #services), Contact (mailto email + social links with inline SVG icons, `nav` landmarks + aria-labels). Bottom bar: copyright + tagline. All copy from the content module; social URLs from `extras`. Mounted after `main` (opaque `bg-abyss`, z-narrative over the canvas). Homepage First Load unchanged at 169 kB. | Completes the page chrome; server-rendered footer keeps SEO/a11y strong and adds no client weight. |
| A16 | 2026-06-12 | Steps 16+17 — SEO implementation + full audit fixes. **SEO (§7):** enriched `app/layout.tsx` metadata (title template, keywords, authors, canonical, robots, OpenGraph, Twitter summary_large_image), `app/sitemap.ts`, `app/robots.ts` (disallows /styleguide), `app/opengraph-image.tsx` (next/og dark+neon card), `app/icon.svg` favicon, `components/seo/StructuredData.tsx` (JSON-LD @graph: Organization + WebSite + 7 Service, verbatim descriptions, in page.tsx). **Perf/LCP:** SparkSection hero decoupled from scroll → on-load INTRO timeline (was hidden at top, hurting LCP); ExperienceShell defers canvas mount to requestIdleCallback; global `fonts.ready` ScrollTrigger.refresh in SmoothScrollProvider. **Three.js:** frameloop pauses (`never`) while tab hidden. **A11y:** `SkipToContent` first tab stop → #content; footer social tap targets 40→44px; explicit viewport width/initialScale/colorScheme. Build green; new static routes /sitemap.xml /robots.txt /opengraph-image /icon.svg. NOTE: Lighthouse not executed in the build environment — fixes target 95+ and 60fps by construction; a real LHCI/device run is still required to confirm. | Final audit; closes the SEO gap and the LCP/visibility/idle-mount perf issues. |
| A17 | 2026-06-12 | **V1.0 CINEMATIC DIRECTION — parallel rebuild begins.** Owner issued "FINAL CREATIVE DIRECTION v1.0": premium/Apple/Stripe/Linear/Interstellar — pure black `#050505`, white + `rgba(255,255,255,.7)` text, ONE accent `#4FD1FF` used sparingly; BANS neon overload, floating particles, smoke, floating cards, gaming/cyberpunk, holograms, excessive glass. Earth is the hero "character" (photoreal NASA maps, Hero + Finale only). Decisions: **(1) Content** = hybrid — V1 visual/experience wins, Content Bible stays SoT for business copy, use V1 explicit copy where given, preserve Bible verbatim where silent, invent nothing. **(2) Assets** = source real NASA/license-free assets into `public/assets`, placeholder inventory doc until then. **(3) Approach** = build PARALLEL on `/v1` (noindex, robots-disallowed); DO NOT modify `/` until sign-off; phases 1–7. **Phase 1 (Foundation) shipped:** `styles/v1-tokens.css` (additive @theme: ink/paper/accent/hairline + `--container-v1`), `blurReveal` preset (opacity+y+de-blur, the V1 signature), `components/v1/{V1Button,V1Reveal}.tsx`, `content/v1.ts` (V1 explicit copy: hero CTA, process steps, CTA/finale lines), `public/assets/` structure + `ASSET_INVENTORY.md`, `app/v1/page.tsx` foundation page. Legacy neon system untouched (isolation by usage). Build green; `/v1` First Load 154 kB. | Owner pivot; parallel route preserves the working build while V1 is validated. |
| A18 | 2026-06-12 | V1 Phase 2 — Hero (Cinematic Brand + Aetheris Voyage + Reveal Hero). Sourced real Earth textures into `public/assets/earth/` (Solar System Scope diffuse/night/clouds — CC BY 4.0, attribution owed; three.js specular — MIT; normal not sourced → flat). New `components/v1/canvas/`: `V1Earth` (custom day/night shader + ocean glint + fresnel atmosphere + cloud shell, defensive texture load w/ procedural fallback, time-based "emerge" intro), `V1Starfield` (restrained, ~2200 pts), `V1HeroScene`, `V1Canvas` (AA on, frameloop gated), `V1CanvasMount` (dynamic ssr:false, reduced-motion/WebGL gate, IntersectionObserver + tab-hidden pause — Earth scoped to hero only). `components/v1/Magnetic.tsx` (generic magnetic wrapper). `components/v1/sections/V1Hero.tsx` (blur-reveal intro eyebrow→headline→sub→CTA, copy parallax, magnetic CTA, scroll cue) on `/v1`; CustomCursor reused. Headline/subhead verbatim; CTA "Start Your Project" (v1 copy). Confirmed motion language = blur reveals/parallax/fades/magnetic/cursor only — no particles-overload/cyberpunk/Web3. `/v1` First Load 162 kB; Earth canvas code-split. | Earth-as-character realized with real maps; pause-when-offscreen keeps it 60fps-friendly. |
