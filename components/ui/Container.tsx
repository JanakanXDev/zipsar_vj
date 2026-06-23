import { cn } from "@/lib/cn";

type ContainerTag = "div" | "section" | "article" | "header" | "footer" | "nav" | "main" | "aside";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Rendered element. Defaults to `div`. */
  as?: ContainerTag;
  /**
   * `narrative` — 46rem reading column for story copy.
   * `wide` — 80rem layout column for grids and full sections.
   */
  size?: "narrative" | "wide";
}

/**
 * Horizontal layout primitive: centers content, applies the fluid page
 * gutter, and caps width at a design-system container token.
 */
export function Container({
  as: Tag = "div",
  size = "wide",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "px-gutter mx-auto w-full",
        size === "narrative" ? "max-w-narrative" : "max-w-wide",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
