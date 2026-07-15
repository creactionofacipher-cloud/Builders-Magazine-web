import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Tag({ selected = false, className, ...props }: TagProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-[var(--radius-full)] border px-3 py-1.5 font-body text-sm",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground hover:border-foreground",
        className,
      )}
      {...props}
    />
  );
}
