/**
 * Skip link (Blueprint §8.4) — the first tab stop, jumping keyboard and
 * screen-reader users straight to <main id="content">. Visually hidden
 * until focused. Server-safe (no client JS).
 */
export function SkipToContent() {
  return (
    <a
      href="#content"
      className="focus:bg-surface focus:text-foreground focus:ring-neon-blue sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-overlay) focus:rounded-full focus:px-5 focus:py-2 focus:text-sm focus:ring-2"
    >
      Skip to content
    </a>
  );
}
