import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "xl" | "lg" | "md" | "sm";

const SIZE_CLASSES: Record<HeadingSize, string> = {
  xl: "text-display-xl", // scene titles
  lg: "text-display-lg", // brand lockup, section heroes
  md: "text-display", // chapter headings
  sm: "text-lead font-medium",
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: "xl",
  2: "lg",
  3: "md",
  4: "sm",
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level (document outline — Blueprint §3). */
  level: HeadingLevel;
  /** Visual size, decoupled from semantics. Defaults by level. */
  size?: HeadingSize;
  /** Eyebrow label rendered above the heading ("Prologue", "Act 1", …). */
  overline?: string;
}

/**
 * Semantic heading with a decoupled visual scale, so the document
 * outline (h1 → h4) never has to compromise with the design.
 */
export function Heading({ level, size, overline, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as `h${HeadingLevel}`;
  const sizeClass = SIZE_CLASSES[size ?? DEFAULT_SIZE[level]];

  const heading = (
    <Tag className={cn(sizeClass, className)} {...rest}>
      {children}
    </Tag>
  );

  if (!overline) return heading;

  return (
    <div>
      <p className="overline-label mb-3">{overline}</p>
      {heading}
    </div>
  );
}
