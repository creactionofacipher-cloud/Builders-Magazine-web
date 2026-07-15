import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-body font-medium " +
  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-neutral-800",
  secondary: "border border-border text-foreground hover:border-foreground",
  ghost: "text-foreground hover:text-muted",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variantStyles[variant], sizeStyles[size], className);
}
