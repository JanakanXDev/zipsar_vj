import type { Metadata } from "next";
import { CustomCursor } from "@/components/ui";
import { ComponentsDemo } from "./ComponentsDemo";

/**
 * INTERNAL STYLE GUIDE — living reference for the Zipsar design system.
 * Not a website section; not indexed; not linked from the site.
 * Tokens: styles/tokens.css · Utilities: styles/utilities.css
 */

export const metadata: Metadata = {
  title: "Design System — Zipsar (internal)",
  robots: { index: false, follow: false },
};

const surfaceSwatches = [
  { name: "abyss", className: "bg-abyss", hex: "#06060a" },
  { name: "void", className: "bg-void", hex: "#0a0a0f" },
  { name: "surface", className: "bg-surface", hex: "#12121c" },
  { name: "raised", className: "bg-raised", hex: "#1a1a2a" },
  { name: "line", className: "bg-line", hex: "#262638" },
  { name: "line-bright", className: "bg-line-bright", hex: "#3a3a55" },
];

const textSwatches = [
  { name: "foreground", className: "text-foreground", hex: "#f2f4ff", note: "~17:1" },
  { name: "muted", className: "text-muted", hex: "#aab2c8", note: "~9:1" },
  { name: "faint", className: "text-faint", hex: "#8a93ad", note: "~6:1" },
];

const neonSwatches = [
  { name: "neon-blue", className: "text-neon-blue", soft: "text-neon-blue-soft", hex: "#00bfff" },
  {
    name: "neon-purple",
    className: "text-neon-purple",
    soft: "text-neon-purple-soft",
    hex: "#a78bfa",
  },
  {
    name: "neon-green",
    className: "text-neon-green",
    soft: "text-neon-green-soft",
    hex: "#34d399",
  },
];

const typeScale = [
  { utility: "text-display-xl", sample: "Scene Title", note: "clamp 48→104px · scene titles" },
  { utility: "text-display-lg", sample: "Brand Lockup", note: "clamp 36→72px · section heroes" },
  { utility: "text-display", sample: "Chapter Heading", note: "clamp 26→44px · h3 chapters" },
  { utility: "text-lead", sample: "Narration flows like this.", note: "clamp 18→23px · narration" },
  { utility: "text-body-lg", sample: "Long-form body copy.", note: "18px · body" },
  { utility: "text-label", sample: "OVERLINE LABEL", note: "13px · 0.22em tracking" },
];

const motionTokens = [
  { token: "--ease-drift", value: "cubic-bezier(0.22, 1, 0.36, 1)", use: "camera, reveals" },
  { token: "--ease-arrive", value: "cubic-bezier(0.16, 1, 0.3, 1)", use: "entering elements" },
  { token: "--ease-exit", value: "cubic-bezier(0.7, 0, 0.84, 0)", use: "leaving elements" },
  { token: "--ease-pulse", value: "cubic-bezier(0.37, 0, 0.63, 1)", use: "glow breathing" },
  { token: "--duration-beat", value: "0.4s", use: "micro-interactions" },
  { token: "--duration-phrase", value: "0.8s", use: "text line reveals" },
  { token: "--duration-scene", value: "1.6s", use: "scene crossfades" },
  { token: "--stagger-words", value: "0.04s", use: "SplitText cascades" },
  { token: "--stagger-cards", value: "0.08s", use: "grid entrances" },
];

const layoutTokens = [
  { token: "--spacing-gutter", value: "clamp(1.25rem, 4vw, 3rem)", use: "page edge gutter" },
  { token: "--spacing-section", value: "clamp(6rem, 14vh, 11rem)", use: "act/section rhythm" },
  { token: "--container-narrative", value: "46rem", use: "reading column" },
  { token: "--container-wide", value: "80rem", use: "services grid" },
  { token: "--radius-panel", value: "1.25rem", use: "glass panels" },
  { token: "--radius-chip", value: "0.625rem", use: "chips, tags" },
];

function SectionHeading({ overline, title }: { overline: string; title: string }) {
  return (
    <header className="mb-10">
      <p className="overline-label mb-3">{overline}</p>
      <h2 className="text-display">{title}</h2>
      <div className="hairline mt-6" />
    </header>
  );
}

export default function StyleguidePage() {
  return (
    <main id="content" className="bg-nebula px-gutter min-h-dvh py-24">
      <div className="max-w-wide mx-auto flex flex-col gap-24">
        {/* ── Hero ── */}
        <header>
          <p className="overline-label tracking-mega mb-4">Internal · Design System</p>
          <h1 className="text-display-xl text-aurora">Zipsar</h1>
          <p className="text-lead text-muted max-w-narrative mt-4">
            Dark background, neon accents, minimalistic yet immersive — like entering a sci-fi lab.
            Every token below is the single source for both the DOM and WebGL layers.
          </p>
        </header>

        {/* ── Colors ── */}
        <section aria-labelledby="colors">
          <SectionHeading overline="01" title="Colors" />

          <h3 className="text-label text-faint mb-4 uppercase">Surfaces</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {surfaceSwatches.map((s) => (
              <div key={s.name} className="rounded-panel border-line bg-surface border p-3">
                <div className={`${s.className} rounded-chip border-line h-16 border`} />
                <p className="text-foreground mt-3 font-mono text-xs">{s.name}</p>
                <p className="text-faint font-mono text-xs">{s.hex}</p>
              </div>
            ))}
          </div>

          <h3 className="text-label text-faint mt-10 mb-4 uppercase">Text — contrast on void</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {textSwatches.map((t) => (
              <div key={t.name} className="rounded-panel border-line bg-void border p-5">
                <p className={`${t.className} text-body-lg`}>The quick cosmic fox</p>
                <p className="text-faint mt-2 font-mono text-xs">
                  {t.name} · {t.hex} · {t.note}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-label text-faint mt-10 mb-4 uppercase">
            Neon accents + soft variants
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {neonSwatches.map((n) => (
              <div key={n.name} className="rounded-panel border-line bg-void border p-5">
                <p className={`${n.className} text-display`}>Aa</p>
                <p className={`${n.soft} text-body-lg`}>Soft variant for body-size text</p>
                <p className="text-faint mt-2 font-mono text-xs">
                  {n.name} · {n.hex}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section aria-labelledby="typography">
          <SectionHeading overline="02" title="Typography" />
          <div className="flex flex-col gap-10">
            {typeScale.map((t) => (
              <div key={t.utility}>
                <p className={t.utility === "text-label" ? "overline-label" : t.utility}>
                  {t.sample}
                </p>
                <p className="text-faint mt-2 font-mono text-xs">
                  {t.utility} · {t.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Spacing & layout ── */}
        <section aria-labelledby="spacing">
          <SectionHeading overline="03" title="Spacing & Layout" />
          <div className="rounded-panel border-line bg-surface overflow-hidden border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-line border-b">
                  <th className="text-faint p-4 font-mono font-normal">token</th>
                  <th className="text-faint p-4 font-mono font-normal">value</th>
                  <th className="text-faint p-4 font-mono font-normal">use</th>
                </tr>
              </thead>
              <tbody>
                {layoutTokens.map((row) => (
                  <tr key={row.token} className="border-line border-b last:border-0">
                    <td className="text-neon-blue-soft p-4 font-mono text-xs">{row.token}</td>
                    <td className="text-foreground p-4 font-mono text-xs">{row.value}</td>
                    <td className="text-muted p-4">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Glassmorphism ── */}
        <section aria-labelledby="glass">
          <SectionHeading overline="04" title="Glassmorphism" />
          <div className="bg-nebula rounded-panel border-line grid gap-6 border p-8 sm:grid-cols-3">
            <div className="glass-subtle rounded-panel p-6">
              <p className="text-foreground font-medium">glass-subtle</p>
              <p className="text-muted mt-2 text-sm">8px blur · 40% surface</p>
            </div>
            <div className="glass rounded-panel p-6">
              <p className="text-foreground font-medium">glass</p>
              <p className="text-muted mt-2 text-sm">16px blur · 62% surface</p>
            </div>
            <div className="glass-strong rounded-panel p-6">
              <p className="text-foreground font-medium">glass-strong</p>
              <p className="text-muted mt-2 text-sm">24px blur · 82% surface</p>
            </div>
          </div>
        </section>

        {/* ── Neon effects ── */}
        <section aria-labelledby="neon">
          <SectionHeading overline="05" title="Neon Effects" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-panel border-line bg-void border p-8">
              <h3 className="text-label text-faint mb-6 uppercase">Neon text (display only)</h3>
              <p className="neon-text-blue text-display">Every Pixel.</p>
              <p className="neon-text-purple text-display">Every Line.</p>
              <p className="neon-text-green text-display">A Purpose.</p>
              <p className="text-aurora text-display mt-6">Aurora gradient text</p>
            </div>

            <div className="rounded-panel border-line bg-void border p-8">
              <h3 className="text-label text-faint mb-6 uppercase">Neon edges & glow</h3>
              <div className="flex flex-col gap-4">
                <div className="neon-edge-blue rounded-chip bg-surface p-4">
                  <span className="text-neon-blue-soft text-sm">neon-edge-blue</span>
                </div>
                <div className="neon-edge-purple rounded-chip bg-surface p-4">
                  <span className="text-neon-purple-soft text-sm">neon-edge-purple</span>
                </div>
                <div className="neon-edge-green rounded-chip bg-surface p-4">
                  <span className="text-neon-green-soft text-sm">neon-edge-green</span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="neon-edge-blue animate-glow-pulse bg-neon-blue inline-block size-4 rounded-full"
                  />
                  <span className="text-muted text-sm">
                    animate-glow-pulse — idle breathing (3.6s sine)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hairline my-10" />
          <p className="text-faint text-center font-mono text-xs">
            hairline — divider that fades at both ends
          </p>
        </section>

        {/* ── Motion tokens ── */}
        <section aria-labelledby="motion">
          <SectionHeading overline="06" title="Motion Tokens — Cinematic Drift" />
          <div className="rounded-panel border-line bg-surface overflow-hidden border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-line border-b">
                  <th className="text-faint p-4 font-mono font-normal">token</th>
                  <th className="text-faint p-4 font-mono font-normal">value</th>
                  <th className="text-faint p-4 font-mono font-normal">use</th>
                </tr>
              </thead>
              <tbody>
                {motionTokens.map((row) => (
                  <tr key={row.token} className="border-line border-b last:border-0">
                    <td className="text-neon-purple-soft p-4 font-mono text-xs">{row.token}</td>
                    <td className="text-foreground p-4 font-mono text-xs">{row.value}</td>
                    <td className="text-muted p-4">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-faint mt-4 text-sm">
            All CSS animation collapses to 0.01ms under prefers-reduced-motion (globals.css). GSAP
            variants switch via gsap.matchMedia() — Blueprint §8.2.
          </p>
        </section>

        {/* ── UI components ── */}
        <section aria-labelledby="components" id="components">
          <SectionHeading overline="07" title="UI Components" />
          <ComponentsDemo />
        </section>
      </div>
      <CustomCursor />
    </main>
  );
}
