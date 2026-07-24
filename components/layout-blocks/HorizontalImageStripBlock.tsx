import type { HorizontalImageStripBlock as HorizontalImageStripBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Gallery } from "@/components/ui/Gallery";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface HorizontalImageStripBlockProps {
  block: HorizontalImageStripBlockType;
}

// Full-bleed horizontal film-strip — a standalone Layout Block section,
// a thin config layer over Gallery's "strip" layout (not an in-article
// gallery, that's RichTextImageStrip, the same Gallery strip mode
// embedded inline in an article instead of a full page section).
export function HorizontalImageStripBlock({ block }: HorizontalImageStripBlockProps) {
  const images = block.images ?? [];
  if (images.length < 2) return null;

  const containerWidth = resolveContainerWidth(block.settings);

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <div className="flex flex-col gap-6">
        {block.title && (
          <Container width={containerWidth}>
            <Heading level={2}>{block.title}</Heading>
          </Container>
        )}

        <Gallery
          layout="strip"
          images={images}
          imageHeight={block.imageHeight}
          gap={block.gap}
          showCaptions={block.showCaptions}
          showScrollbar={block.showScrollbar}
        />

        {block.caption && (
          <Container width={containerWidth}>
            <Text variant="muted" as="p" className="text-center">
              {block.caption}
            </Text>
          </Container>
        )}
      </div>
    </Section>
  );
}
