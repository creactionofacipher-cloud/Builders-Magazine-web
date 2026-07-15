import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ListProps {
  as?: "ul" | "ol";
  children: ReactNode;
  className?: string;
}

export function List({ as = "ul", children, className }: ListProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-body text-base leading-relaxed text-foreground",
        "flex flex-col gap-2 pl-5",
        Tag === "ul" ? "list-disc" : "list-decimal",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
