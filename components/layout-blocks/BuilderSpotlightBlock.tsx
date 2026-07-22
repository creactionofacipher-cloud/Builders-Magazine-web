import type { BuilderSpotlightBlock as BuilderSpotlightBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BuilderCard } from "@/components/editorial/BuilderCard";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface BuilderSpotlightBlockProps {
  block: BuilderSpotlightBlockType;
}

// Reuses BuilderCard (components/editorial/BuilderCard.tsx) unmodified —
// no detail page to link the card itself to yet (post-MVP), so the CTA
// is a free-form editor-authored URL instead (confirmed with user).
export function BuilderSpotlightBlock({ block }: BuilderSpotlightBlockProps) {
  if (!block.builder) return null;

  const hasCta = Boolean(block.ctaText && block.ctaUrl);

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)} className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={2}>{block.heading || block.builder.name}</Heading>
          {hasCta && <ButtonLink href={block.ctaUrl as string}>{block.ctaText}</ButtonLink>}
        </div>
        <BuilderCard builder={block.builder} className="mx-auto w-full max-w-md" />
      </Container>
    </Section>
  );
}
