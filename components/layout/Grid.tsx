import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface GridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnsByCount: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function Grid({ children, columns = 3, className }: GridProps) {
  return (
    <div className={cn("grid gap-[var(--spacing-gutter-lg)]", columnsByCount[columns], className)}>
      {children}
    </div>
  );
}
