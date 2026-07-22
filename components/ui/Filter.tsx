"use client";

import { cn } from "@/utils/cn";
import { Tag } from "./Tag";

interface FilterProps<T extends string> {
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
  allLabel?: string;
  /** Describes what's being filtered for screen reader users (e.g.
   * "Фильтр по категории") — defaults to a generic label since this
   * component has no inherent knowledge of its options' meaning. */
  ariaLabel?: string;
  className?: string;
}

export function Filter<T extends string>({
  options,
  value,
  onChange,
  allLabel = "Все",
  ariaLabel = "Фильтр",
  className,
}: FilterProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap gap-2", className)}>
      <Tag selected={value === null} onClick={() => onChange(null)}>
        {allLabel}
      </Tag>
      {options.map((option) => (
        <Tag key={option} selected={value === option} onClick={() => onChange(option)}>
          {option}
        </Tag>
      ))}
    </div>
  );
}
