/**
 * Runtime bridge to the design tokens in styles/tokens.css — the single
 * source of truth for both layers (Blueprint §0.3, §4.2).
 *
 * The WebGL layer (scene materials, shader uniforms, fog/clear colors)
 * must read colors through this module instead of hardcoding hex values,
 * so a token change in CSS propagates to the 3D world automatically.
 *
 * Client-only by nature: returns the fallback during SSR.
 */

export const COLOR_TOKENS = {
  abyss: "--color-abyss",
  void: "--color-void",
  surface: "--color-surface",
  raised: "--color-raised",
  line: "--color-line",
  lineBright: "--color-line-bright",
  foreground: "--color-foreground",
  muted: "--color-muted",
  faint: "--color-faint",
  neonBlue: "--color-neon-blue",
  neonPurple: "--color-neon-purple",
  neonGreen: "--color-neon-green",
  neonBlueSoft: "--color-neon-blue-soft",
  neonPurpleSoft: "--color-neon-purple-soft",
  neonGreenSoft: "--color-neon-green-soft",
} as const;

export type ColorTokenName = keyof typeof COLOR_TOKENS;

/** Read any CSS custom property from :root. SSR-safe (returns fallback). */
export function readCssVar(variableName: `--${string}`, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  return value.trim() || fallback;
}

/** Read a named color token, e.g. themeColor("neonBlue") → "#00bfff". */
export function themeColor(name: ColorTokenName, fallback = "#ffffff"): string {
  return readCssVar(COLOR_TOKENS[name], fallback);
}

/** Read every color token at once — for seeding shader uniform palettes. */
export function themePalette(): Record<ColorTokenName, string> {
  const palette = {} as Record<ColorTokenName, string>;
  for (const name of Object.keys(COLOR_TOKENS) as ColorTokenName[]) {
    palette[name] = themeColor(name);
  }
  return palette;
}
