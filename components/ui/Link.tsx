import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

type LinkVariant = "default" | "muted" | "plain";

type LinkProps = ComponentProps<typeof NextLink> & { variant?: LinkVariant };

const styleByVariant: Record<LinkVariant, string> = {
  default:
    "text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground",
  muted: "text-muted hover:text-foreground",
  plain: "text-foreground",
};

export function Link({ variant = "default", className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        styleByVariant[variant],
        className,
      )}
      {...props}
    />
  );
}
