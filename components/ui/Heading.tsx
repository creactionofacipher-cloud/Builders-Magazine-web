import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const styleByLevel: Record<HeadingLevel, string> = {
  1: "font-display text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-foreground",
  2: "font-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-foreground",
  3: "font-display text-2xl md:text-3xl font-medium leading-tight text-foreground",
  4: "font-display text-xl md:text-2xl font-medium leading-tight text-foreground",
};

const tagByLevel: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = tagByLevel[level];
  return <Tag className={cn(styleByLevel[level], className)}>{children}</Tag>;
}
