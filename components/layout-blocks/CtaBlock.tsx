import type { CtaBlock as CtaBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/utils/cn";
import { getBlockSectionProps } from "./blockSettings";

interface CtaBlockProps {
  block: CtaBlockType;
}

const alignClasses: Record<NonNullable<CtaBlockType["alignment"]>, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

// No Container — a campaign banner reads full-bleed, the one new block
// composing primitives directly since no existing "CTA banner" component
// fits. Falls back to a surface tint (via Block Settings' own default
// mechanism, see getBlockSectionProps) when the editor sets neither a
// background image nor color, so the block still reads as a distinct
// section either way.
export function CtaBlock({ block }: CtaBlockProps) {
  if (!block.title || !block.buttonText || !block.buttonUrl) return null;

  const alignment = block.alignment ?? "center";
  const hasBanner = Boolean(block.backgroundImage || block.backgroundColor);
  const inverted = Boolean(block.backgroundImage);
  const sectionProps = getBlockSectionProps(block.settings, !hasBanner);

  return (
    <Section
      {...sectionProps}
      className="relative overflow-hidden"
      style={{
        ...sectionProps.style,
        ...(block.backgroundColor ? { backgroundColor: block.backgroundColor } : {}),
      }}
    >
      {block.backgroundImage && (
        <Image
          asset={block.backgroundImage}
          preset="editorial"
          sizes="100vw"
          fill
          className="absolute inset-0"
        />
      )}
      {block.backgroundImage && block.overlay && (
        <div aria-hidden className="absolute inset-0 bg-black/50" />
      )}
      <div
        className={cn(
          "relative mx-auto flex max-w-2xl flex-col gap-4 px-[var(--spacing-gutter)]",
          alignClasses[alignment],
        )}
      >
        <Heading level={2} tone={inverted ? "inverted" : "default"}>
          {block.title}
        </Heading>
        {block.subtitle && (
          <Text variant="lead" tone={inverted ? "inverted" : "default"}>
            {block.subtitle}
          </Text>
        )}
        <ButtonLink href={block.buttonUrl} variant={inverted ? "inverted" : "primary"}>
          {block.buttonText}
        </ButtonLink>
      </div>
    </Section>
  );
}
