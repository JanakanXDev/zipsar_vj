import { cn } from "@/lib/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Anchor id — required for deep links and nav jumps (Blueprint §7.4). */
  id: string;
  /**
   * id of the heading that names this section (Blueprint §8.3).
   * Pair with a <Heading id={...}> inside the section:
   *   <Section id="act-1" labelledBy="act-1-title">
   *     <Heading level={2} id="act-1-title">…</Heading>
   */
  labelledBy?: string;
  /** Skip the default vertical section rhythm (py-section). */
  flush?: boolean;
}

/**
 * Semantic landmark for one act/section of the page. Provides the act
 * rhythm spacing and scroll-margin so anchor navigation lands clear of
 * the fixed nav.
 */
export function Section({
  id,
  labelledBy,
  flush = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-24", !flush && "py-section", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
