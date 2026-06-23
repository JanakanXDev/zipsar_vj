"use client";

import { useEffect, useState } from "react";
import {
  AnimatedText,
  Button,
  GlassCard,
  GradientText,
  Heading,
  LoadingScreen,
  MagneticButton,
} from "@/components/ui";

/**
 * Internal demo harness for /styleguide — interactive component showcase.
 * All strings here are internal labels, not website copy.
 */
export function ComponentsDemo() {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loaderOpen) return;
    setProgress(0);
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(1, value + 0.07 + Math.random() * 0.05));
    }, 80);
    return () => window.clearInterval(timer);
  }, [loaderOpen]);

  return (
    <div className="flex flex-col gap-12">
      {/* ── Buttons ── */}
      <div className="rounded-panel border-line bg-void border p-8">
        <h3 className="text-label text-faint mb-6 uppercase">
          Button — variants · accents · sizes
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button accent="blue">Primary blue</Button>
          <Button accent="purple">Primary purple</Button>
          <Button accent="green">Primary green</Button>
          <Button variant="ghost">Ghost</Button>
          <Button accent="blue" size="lg">
            Large primary
          </Button>
          <Button accent="blue" disabled>
            Disabled
          </Button>
          <Button variant="ghost" href="#components" rel="nofollow">
            As link
          </Button>
        </div>
      </div>

      {/* ── MagneticButton ── */}
      <div className="rounded-panel border-line bg-void border p-8">
        <h3 className="text-label text-faint mb-6 uppercase">
          MagneticButton — pointer-fine only, inert under reduced motion
        </h3>
        <div className="flex flex-wrap items-center gap-8 py-4">
          <MagneticButton accent="blue" size="lg">
            Hover me
          </MagneticButton>
          <MagneticButton variant="ghost" strength={0.5}>
            Stronger pull
          </MagneticButton>
        </div>
      </div>

      {/* ── GlassCard ── */}
      <div className="bg-nebula rounded-panel border-line border p-8">
        <h3 className="text-label text-faint mb-6 uppercase">GlassCard — accents · interactive</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <GlassCard accent="blue" interactive>
            <p className="font-medium">Accent blue</p>
            <p className="text-muted mt-2 text-sm">interactive — hover lift</p>
          </GlassCard>
          <GlassCard accent="purple" interactive variant="strong">
            <p className="font-medium">Accent purple</p>
            <p className="text-muted mt-2 text-sm">strong glass</p>
          </GlassCard>
          <GlassCard variant="subtle" interactive>
            <p className="font-medium">Neutral</p>
            <p className="text-muted mt-2 text-sm">subtle glass</p>
          </GlassCard>
        </div>
      </div>

      {/* ── Text components ── */}
      <div className="rounded-panel border-line bg-void border p-8">
        <h3 className="text-label text-faint mb-6 uppercase">
          Heading · GradientText · AnimatedText
        </h3>
        <Heading level={3} overline="Overline label" className="mb-6">
          Heading with <GradientText>gradient text</GradientText>
        </Heading>
        <AnimatedText as="p" className="text-lead text-muted max-w-narrative">
          This sentence reveals word by word when it scrolls into view, while screen readers and
          search engines always receive the plain text.
        </AnimatedText>
      </div>

      {/* ── LoadingScreen ── */}
      <div className="rounded-panel border-line bg-void border p-8">
        <h3 className="text-label text-faint mb-6 uppercase">
          LoadingScreen — determinate progress, 2.5s failsafe
        </h3>
        <Button variant="ghost" onClick={() => setLoaderOpen(true)}>
          Replay loader
        </Button>
        {loaderOpen && (
          <LoadingScreen
            wordmark="Zipsar"
            progress={progress}
            done={progress >= 1}
            onExitComplete={() => setLoaderOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
