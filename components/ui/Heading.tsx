import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingTone = "default" | "inverted";

interface HeadingProps {
  level: HeadingLevel;
  tone?: HeadingTone;
  children: ReactNode;
  className?: string;
}

const sizeByLevel: Record<HeadingLevel, string> = {
  1: "font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight",
  2: "font-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight",
  3: "font-display text-2xl md:text-3xl font-medium leading-tight",
  4: "font-display text-xl md:text-2xl font-medium leading-tight",
};

// Separate from sizeByLevel so callers pick a color via `tone` (e.g. text
// on a photo in Hero) instead of fighting the component's default color
// with an ad hoc className override — two color utilities on one element
// have unpredictable precedence in Tailwind's generated CSS.
const colorByTone: Record<HeadingTone, string> = {
  default: "text-foreground",
  inverted: "text-white",
};

const tagByLevel: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

export function Heading({ level, tone = "default", children, className }: HeadingProps) {
  const Tag = tagByLevel[level];
  return <Tag className={cn(sizeByLevel[level], colorByTone[tone], className)}>{children}</Tag>;
}
