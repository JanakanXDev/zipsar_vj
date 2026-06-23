import { cn } from "@/lib/cn";

type GlassVariant = "subtle" | "default" | "strong";
type GlassAccent = "blue" | "purple" | "green";
type GlassPadding = "none" | "md" | "lg";
type GlassTag = "div" | "article" | "li" | "figure";

const VARIANT_CLASSES: Record<GlassVariant, string> = {
  subtle: "glass-subtle",
  default: "glass",
  strong: "glass-strong",
};

const ACCENT_CLASSES: Record<GlassAccent, string> = {
  blue: "border-neon-blue/40 shadow-glow-blue",
  purple: "border-neon-purple/40 shadow-glow-purple",
  green: "border-neon-green/40 shadow-glow-green",
};

const ACCENT_HOVER_CLASSES: Record<GlassAccent, string> = {
  blue: "hover:border-neon-blue/70",
  purple: "hover:border-neon-purple/70",
  green: "hover:border-neon-green/70",
};

const PADDING_CLASSES: Record<GlassPadding, string> = {
  none: "",
  md: "p-6",
  lg: "p-8",
};

export interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: GlassTag;
  variant?: GlassVariant;
  /** Neon edge tint. Omit for a neutral glass border. */
  accent?: GlassAccent;
  padding?: GlassPadding;
  /** Adds hover lift + border response (service cards, links). */
  interactive?: boolean;
}

/**
 * Glassmorphism panel on the design-system glass tokens. Falls back to
 * an opaque surface where backdrop-filter is unsupported, and to system
 * colors under forced-colors (handled in globals.css).
 */
export function GlassCard({
  as: Tag = "div",
  variant = "default",
  accent,
  padding = "md",
  interactive = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-panel",
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        accent && ACCENT_CLASSES[accent],
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-(--duration-beat) ease-(--ease-arrive) hover:-translate-y-1",
        interactive && (accent ? ACCENT_HOVER_CLASSES[accent] : "hover:border-line-bright"),
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
