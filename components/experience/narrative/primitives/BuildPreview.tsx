/**
 * Floating UI preview mockups for Section 4 (Act 2). PLACEHOLDER ASSETS
 * by design (Blueprint §5.4) — pure-CSS wireframes standing in for the
 * "Figma boards / developers typing / sticky notes" montage until real
 * product imagery is supplied. One variant per chapter.
 */

function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`bg-line block rounded-full ${className}`} />;
}

function MockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-panel border-line w-full overflow-hidden border">
      <div className="border-line flex items-center gap-1.5 border-b px-4 py-3">
        <span className="bg-neon-blue/70 size-2 rounded-full" />
        <span className="bg-neon-purple/70 size-2 rounded-full" />
        <span className="bg-neon-green/70 size-2 rounded-full" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* 0 — Requirements & Discovery: research / sticky-note board */
function DiscoveryMock() {
  return (
    <MockFrame>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-chip border-line flex flex-col gap-2 border p-3"
          >
            <Skeleton className="h-1.5 w-3/4" />
            <Skeleton className="h-1.5 w-1/2" />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* 1 — Design: canvas with shapes + toolbar */
function DesignMock() {
  return (
    <MockFrame>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="bg-raised size-7 rounded-md" />
          ))}
        </div>
        <div className="bg-surface border-line relative grow rounded-lg border p-4">
          <span className="border-neon-blue/60 absolute top-5 left-5 size-14 rounded-lg border-2" />
          <span className="bg-neon-purple/30 absolute top-8 right-6 size-10 rounded-full" />
          <span className="bg-neon-green/30 absolute bottom-5 left-10 h-3 w-24 rounded-full" />
        </div>
      </div>
    </MockFrame>
  );
}

/* 2 — Review Cycles: comment threads */
function ReviewMock() {
  return (
    <MockFrame>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`flex gap-3 ${i % 2 ? "flex-row-reverse" : ""}`}>
            <span className="bg-neon-blue/40 size-6 shrink-0 rounded-full" />
            <div
              className={`flex grow flex-col gap-2 rounded-xl p-3 ${
                i % 2 ? "glass neon-edge-blue" : "bg-surface border-line border"
              }`}
            >
              <Skeleton className="h-1.5 w-2/3" />
              <Skeleton className="h-1.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* 3 — Development: code editor */
function DevMock() {
  const widths = ["w-1/2", "w-3/4", "w-2/5", "w-5/6", "w-1/3", "w-2/3"];
  return (
    <MockFrame>
      <div className="font-mono">
        {widths.map((w, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <span className="text-faint w-4 text-right text-[0.6rem]">{i + 1}</span>
            <Skeleton
              className={`h-1.5 ${w} ${i % 3 === 0 ? "bg-neon-purple/50" : i % 3 === 1 ? "bg-neon-blue/50" : "bg-neon-green/50"}`}
            />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

const VARIANTS = [DiscoveryMock, DesignMock, ReviewMock, DevMock];

export function BuildPreview({ variant }: { variant: number }) {
  const Mock = VARIANTS[variant % VARIANTS.length]!;
  return (
    <div aria-hidden="true" className="js-act2-float animate-float">
      <Mock />
    </div>
  );
}
