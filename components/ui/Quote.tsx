import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface QuoteProps {
  children: ReactNode;
  className?: string;
}

export function Quote({ children, className }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        "font-display text-2xl md:text-3xl font-medium leading-tight text-foreground",
        "border-l border-border pl-6",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}
