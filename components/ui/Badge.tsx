import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-border",
        "px-2 py-0.5 font-body text-xs font-medium tracking-wide text-muted uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
