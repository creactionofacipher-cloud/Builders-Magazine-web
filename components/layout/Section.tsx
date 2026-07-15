import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SectionProps {
  children: ReactNode;
  surface?: boolean;
  className?: string;
}

// Owns the generous vertical rhythm docs/06_DESIGN_GUIDE.md asks for
// ("layouts should breathe") — pages compose Sections, they never set
// their own section padding.
export function Section({ children, surface = false, className }: SectionProps) {
  return (
    <section
      className={cn(
        "py-[var(--spacing-section)] md:py-[var(--spacing-section-lg)]",
        surface && "bg-surface",
        className,
      )}
    >
      {children}
    </section>
  );
}
