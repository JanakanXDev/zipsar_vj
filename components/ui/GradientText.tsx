import { cn } from "@/lib/cn";

type GradientTag = "span" | "strong" | "em";

export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: GradientTag;
}

/**
 * Aurora gradient text — the full neon spectrum (blue → purple → green)
 * clipped to the glyphs. Display sizes only; falls back to plain
 * CanvasText under forced-colors (globals.css).
 */
export function GradientText({
  as: Tag = "span",
  className,
  children,
  ...rest
}: GradientTextProps) {
  return (
    <Tag className={cn("text-aurora", className)} {...rest}>
      {children}
    </Tag>
  );
}
