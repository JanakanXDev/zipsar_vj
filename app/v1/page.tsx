import type { Metadata } from "next";
import { CustomCursor } from "@/components/ui";
import { V1Hero } from "@/components/v1/sections/V1Hero";

/**
 * V1.0 CINEMATIC EXPERIENCE — parallel build (Blueprint amendment A17).
 * The live homepage at `/` is untouched until sign-off.
 *
 * PHASE 2 — Hero shipped (photoreal Earth + cinematic intro). Upcoming:
 * Vision, Mission, Services, Process, Future, Finale.
 */

export const metadata: Metadata = {
  title: "Zipsar — V1 Preview",
  robots: { index: false, follow: false },
};

export default function V1Page() {
  return (
    <main id="content" className="bg-ink text-paper">
      <V1Hero />

      {/* Upcoming phases */}
      <section className="px-gutter border-hairline border-t py-20">
        <div className="max-w-v1 mx-auto w-full">
          <p className="text-paper-faint text-sm">
            Phase 2 — Hero (photoreal Earth) complete. Next: Vision, Mission, Services, Process,
            Future, Finale. The live homepage at <span className="text-accent">/</span> remains
            untouched until sign-off.
          </p>
        </div>
      </section>

      <CustomCursor />
    </main>
  );
}
