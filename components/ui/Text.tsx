import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type TextVariant = "lead" | "body" | "small" | "muted";

interface TextProps {
  variant?: TextVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

const styleByVariant: Record<TextVariant, string> = {
  lead: "font-body text-lg md:text-xl leading-relaxed text-foreground",
  body: "font-body text-base leading-relaxed text-foreground",
  small: "font-body text-sm leading-normal text-foreground",
  muted: "font-body text-sm leading-normal text-muted",
};

export function Text({ variant = "body", as, children, className }: TextProps) {
  const Tag = as ?? "p";
  return <Tag className={cn(styleByVariant[variant], className)}>{children}</Tag>;
}
