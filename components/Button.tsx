"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-ink/90 active:scale-[0.98] disabled:bg-ink/40 disabled:cursor-not-allowed",
  secondary:
    "bg-cream text-ink border border-ink/20 hover:border-ink/60 active:scale-[0.98]",
  ghost: "text-ink/60 hover:text-ink underline underline-offset-4",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", children, ...rest },
  ref,
) {
  const base =
    "rounded-full px-6 py-4 text-base font-medium transition-all duration-150 select-none";
  const v = styles[variant];
  return (
    <button ref={ref} className={`${base} ${v} ${className}`} {...rest}>
      {children}
    </button>
  );
});
