import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SectionProps {
  children: ReactNode;
  surface?: boolean;
  className?: string;
  /** Layout Blocks' shared Block Settings (components/layout-blocks/blockSettings.ts)
   * thread an anchor id and spacing/background overrides through these —
   * every other caller omits them, unaffected. */
  id?: string;
  style?: CSSProperties;
}

// Owns the generous vertical rhythm docs/06_DESIGN_GUIDE.md asks for
// ("layouts should breathe") — pages compose Sections, they never set
// their own section padding.
export function Section({ children, surface = false, className, id, style }: SectionProps) {
  return (
    <section
      id={id}
      style={style}
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
