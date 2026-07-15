import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type TextVariant = "lead" | "body" | "small" | "muted";
type TextTone = "default" | "inverted";

interface TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

const sizeByVariant: Record<TextVariant, string> = {
  lead: "font-body text-lg md:text-xl leading-relaxed",
  body: "font-body text-base leading-relaxed",
  small: "font-body text-sm leading-normal",
  muted: "font-body text-sm leading-normal",
};

// Color depends on both variant and tone (see Heading for why this isn't
// a plain className override): "muted" reads as a dimmed white, not the
// full-strength white used by other variants, when placed on a photo.
const colorByVariantAndTone: Record<TextVariant, Record<TextTone, string>> = {
  lead: { default: "text-foreground", inverted: "text-white" },
  body: { default: "text-foreground", inverted: "text-white" },
  small: { default: "text-foreground", inverted: "text-white" },
  muted: { default: "text-muted", inverted: "text-white/80" },
};

export function Text({ variant = "body", tone = "default", as, children, className }: TextProps) {
  const Tag = as ?? "p";
  return (
    <Tag className={cn(sizeByVariant[variant], colorByVariantAndTone[variant][tone], className)}>
      {children}
    </Tag>
  );
}
