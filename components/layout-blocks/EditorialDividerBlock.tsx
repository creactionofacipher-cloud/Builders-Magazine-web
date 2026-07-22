import type { EditorialDividerBlock as EditorialDividerBlockType } from "@/types/content";
import { Divider } from "@/components/ui/Divider";
import { Text } from "@/components/ui/Text";
import { cn } from "@/utils/cn";
import { getBlockSectionProps, SPACER_HEIGHT_CLASSES } from "./blockSettings";

interface EditorialDividerBlockProps {
  block: EditorialDividerBlockType;
}

// A real visual divider, distinct from Spacer.tsx (which only adds empty
// space) — reuses components/ui/Divider.tsx for the "line" mark rather
// than reimplementing a horizontal rule. Variants are additive: a 6th
// one is one more branch below, no schema/type ripple.
//
// Two distinct "spacing" concepts compose here: the block's own
// `spacing` field sizes the mark's box (via the h-* class), while Block
// Settings' spacingTop/spacingBottom (getBlockSectionProps) add extra
// margin on top of that, same as every other block — the id/style
// spread below must not be dropped the way it previously was, or the
// shared Block Settings panel silently does nothing on this block.
export function EditorialDividerBlock({ block }: EditorialDividerBlockProps) {
  const variant = block.variant ?? "line";
  const { id, style } = getBlockSectionProps(block.settings);

  return (
    <div
      id={id}
      style={style}
      className={cn(
        "mx-auto flex w-full max-w-3xl items-center justify-center px-[var(--spacing-gutter)]",
        SPACER_HEIGHT_CLASSES[block.spacing ?? "md"],
      )}
    >
      {variant === "line" && <Divider className="w-full" />}
      {variant === "minimal" && <Divider className="w-16" />}
      {variant === "dot" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-border" />}
      {variant === "diamond" && <span aria-hidden className="h-2 w-2 rotate-45 bg-border" />}
      {variant === "label" && (
        <div className="flex w-full items-center gap-4">
          <Divider className="flex-1" />
          <Text variant="small" className="tracking-[0.2em] text-muted uppercase">
            {block.label || "Builders"}
          </Text>
          <Divider className="flex-1" />
        </div>
      )}
    </div>
  );
}
