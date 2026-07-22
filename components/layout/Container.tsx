import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type ContainerWidth = "normal" | "wide" | "full";

const maxWidthByWidth: Record<ContainerWidth, string> = {
  normal: "max-w-7xl",
  wide: "max-w-[100rem]",
  full: "max-w-none",
};

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Defaults to "normal" (today's max-w-7xl, unchanged for every
   * existing caller) — "wide"/"full" back Layout Blocks' Block Settings
   * `containerWidth` override (components/layout-blocks/blockSettings.ts). */
  width?: ContainerWidth;
}

export function Container({ children, className, width = "normal" }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--spacing-gutter)] md:px-[var(--spacing-gutter-lg)]",
        maxWidthByWidth[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
