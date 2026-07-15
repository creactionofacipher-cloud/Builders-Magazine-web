import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-[var(--spacing-gutter)] md:px-[var(--spacing-gutter-lg)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
