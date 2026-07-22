import type { SpacerBlock as SpacerBlockType } from "@/types/content";
import { SPACER_HEIGHT_CLASSES } from "./blockSettings";

interface SpacerBlockProps {
  block: SpacerBlockType;
}

export function SpacerBlock({ block }: SpacerBlockProps) {
  return (
    <div
      aria-hidden
      id={block.settings?.anchor || undefined}
      className={SPACER_HEIGHT_CLASSES[block.size ?? "md"]}
    />
  );
}
