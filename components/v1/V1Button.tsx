import { cn } from "@/lib/cn";

/**
 * V1.0 button — minimal & premium (Apple/Stripe/Linear). No glow, no
 * glass. The single accent appears only on the primary CTA ("used
 * sparingly"). Renders <a> when `href` is set, else <button>.
 */

type V1Variant = "primary" | "secondary";
type V1Size = "md" | "lg";

const BASE = cn(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium select-none",
  "transition-[transform,background-color,border-color,color,opacity] duration-300 ease-(--ease-arrive)",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
);

const SIZES: Record<V1Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const VARIANTS: Record<V1Variant, string> = {
  primary: "bg-accent text-ink hover:brightness-110",
  secondary: "border-hairline-strong text-paper hover:border-paper/40 border bg-transparent",
};

interface CommonProps {
  variant?: V1Variant;
  size?: V1Size;
}

type AsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
export type V1ButtonProps = AsButton | AsLink;

function classes(variant: V1Variant, size: V1Size, className?: string) {
  return cn(BASE, SIZES[size], VARIANTS[variant], className);
}

export function V1Button(props: V1ButtonProps) {
  const { variant = "primary", size = "md" } = props;

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className, children, ...rest } = props;
    return (
      <a data-cursor="hover" className={classes(variant, size, className)} {...rest}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} data-cursor="hover" className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
