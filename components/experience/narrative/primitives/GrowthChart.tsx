/**
 * Decorative post-launch growth chart for Section 6 (Act 3). PLACEHOLDER
 * DATA VISUALIZATION — aria-hidden, illustrative only (no real metrics).
 * The area + line are revealed left-to-right by animating the clip rect's
 * width (driven from EvolutionSection); the chart is fully visible by
 * default so it survives reduced motion / no-JS.
 */

const DATA = [18, 30, 26, 48, 60, 58, 82, 104, 128];
const W = 320;
const H = 176;
const PAD = 12;
const MAX_V = 140;

export const GROWTH_CHART_WIDTH = W;

function buildPaths() {
  const stepX = (W - PAD * 2) / (DATA.length - 1);
  const pts = DATA.map((v, i) => [PAD + i * stepX, H - PAD - (v / MAX_V) * (H - PAD * 2)] as const);
  const line = pts
    .map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const area = `${line} L ${last[0].toFixed(1)} ${H - PAD} L ${first[0].toFixed(1)} ${H - PAD} Z`;
  return { line, area, last };
}

export function GrowthChart() {
  const { line, area, last } = buildPaths();

  return (
    <svg aria-hidden="true" role="presentation" viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="growth-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-neon-blue)" />
          <stop offset="50%" stopColor="var(--color-neon-purple)" />
          <stop offset="100%" stopColor="var(--color-neon-green)" />
        </linearGradient>
        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-neon-purple)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-neon-purple)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="growth-clip">
          <rect className="js-growth-clip" x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>

      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={PAD}
          x2={W - PAD}
          y1={PAD + f * (H - PAD * 2)}
          y2={PAD + f * (H - PAD * 2)}
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}

      <g clipPath="url(#growth-clip)">
        <path d={area} fill="url(#growth-area)" />
        <path
          d={line}
          fill="none"
          stroke="url(#growth-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <circle
        className="js-growth-dot"
        cx={last[0]}
        cy={last[1]}
        r="4.5"
        fill="var(--color-neon-green)"
      />
    </svg>
  );
}
