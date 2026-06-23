import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost";
type ButtonAccent = "blue" | "purple" | "green";
type ButtonSize = "md" | "lg";

const BASE_CLASSES = cn(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium select-none",
  "transition-[transform,box-shadow,border-color,background-color,color]",
  "duration-(--duration-beat) ease-(--ease-arrive)",
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
);

const ACCENT_CLASSES: Record<ButtonAccent, string> = {
  blue: "border-neon-blue/45 shadow-glow-blue hover:border-neon-blue",
  purple: "border-neon-purple/45 shadow-glow-purple hover:border-neon-purple",
  green: "border-neon-green/45 shadow-glow-green hover:border-neon-green",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  /** Neon tint — primary variant only. */
  accent?: ButtonAccent;
  size?: ButtonSize;
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClasses(
  variant: ButtonVariant,
  accent: ButtonAccent,
  size: ButtonSize,
  className?: string,
): string {
  return cn(
    BASE_CLASSES,
    SIZE_CLASSES[size],
    variant === "primary"
      ? cn(
          "border bg-surface/60 text-foreground backdrop-blur-md hover:bg-raised",
          ACCENT_CLASSES[accent],
        )
      : "border border-line bg-transparent text-muted hover:border-line-bright hover:text-foreground",
    className,
  );
}

/**
 * Design-system button. Renders an <a> when `href` is given, otherwise a
 * <button type="button">. `data-cursor="hover"` lets CustomCursor react.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", accent = "blue", size = "md" } = props;

  if (props.href !== undefined) {
    const { variant: _v, accent: _a, size: _s, className, children, ...anchorRest } = props;
    return (
      <a
        data-cursor="hover"
        className={buttonClasses(variant, accent, size, className)}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    accent: _a,
    size: _s,
    className,
    children,
    type = "button",
    ...buttonRest
  } = props;
  return (
    <button
      type={type}
      data-cursor="hover"
      className={buttonClasses(variant, accent, size, className)}
      {...buttonRest}
    >
      {children}
    </button>
  );
}
