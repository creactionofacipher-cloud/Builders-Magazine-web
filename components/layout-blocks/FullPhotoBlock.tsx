import type { FullWidthPhotoBlock } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";
import { getBlockSectionProps } from "./blockSettings";

interface FullPhotoBlockProps {
  block: FullWidthPhotoBlock;
}

// No Container — genuinely full viewport width, same idea as Hero and
// RichTextFullBleed's breakout, just without needing a breakout trick
// since this block isn't nested inside a narrower reading column to
// begin with. containerWidth is therefore never read here (there's no
// Container to apply it to), same reasoning as Hero.
export function FullPhotoBlock({ block }: FullPhotoBlockProps) {
  const { image } = block;
  if (!image) return null;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Image asset={image} preset="editorial" sizes="100vw" className="w-full" />
      {block.caption && (
        <Text variant="muted" as="p" className="mx-auto mt-2 max-w-2xl px-[var(--spacing-gutter)] text-center">
          {block.caption}
        </Text>
      )}
    </Section>
  );
}
