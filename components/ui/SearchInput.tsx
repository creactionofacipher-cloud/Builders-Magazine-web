"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m17 17-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={cn(
          "w-full border border-border bg-background py-2.5 pr-4 pl-10",
          "font-body text-base text-foreground placeholder:text-muted",
          "rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
          "focus-visible:border-foreground focus-visible:outline-none",
        )}
        {...props}
      />
    </div>
  );
}
