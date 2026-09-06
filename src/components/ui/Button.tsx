import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-purple-core text-white hover:bg-purple-bright shadow-[0_0_0_1px_rgba(124,77,255,0.5)] hover:shadow-glow",
  secondary:
    "glass text-ink hover:border-purple-400/50 hover:bg-white/[0.08]",
  ghost: "bg-transparent text-ink hover:bg-white/[0.06]",
  danger: "bg-transparent text-ink border border-white/15 hover:border-purple-300/60 hover:bg-white/[0.06]",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-control font-body font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
