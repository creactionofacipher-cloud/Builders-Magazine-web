import type { MediaAsset } from "@/types/content";
import { Container } from "@/components/layout/Container";
import { Image } from "@/components/ui/Image";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/utils/cn";

interface HeroCta {
  label: string;
  href: string;
}

interface HeroProps {
  image: MediaAsset;
  title: string;
  subtitle?: string;
  cta?: HeroCta;
  className?: string;
  /** Registers the hero image in the page's shared lightbox gallery (see
   * components/lightbox/) — on for entity detail-page heroes (the hero
   * *is* that page's cover image), off for the homepage's promotional
   * hero, which isn't "content" in that sense. Off by default. */
  lightbox?: boolean;
  /** Defaults to true — every direct caller (Story/Issue/Builders Cup/
   * Product detail pages) renders Hero as the page's first element, so
   * it's always genuinely above the fold there. The one exception is
   * components/layout-blocks/HeroBlock.tsx: an editor-composed Layout
   * Blocks sequence can place a Hero Story block anywhere, so that
   * caller explicitly passes `priority` only for the first block in the
   * sequence — otherwise a below-the-fold hero would preload an image
   * the visitor may never scroll to. */
  priority?: boolean;
  /** Defaults to 1 (a page has exactly one H1). HeroBlock passes 2 for
   * any Hero Story block after the first in an editor-composed sequence,
   * so a document with multiple Hero blocks never renders more than one
   * H1. */
  headingLevel?: 1 | 2;
}

// Full-bleed image with overlaid title/CTA. Reusable wherever a large
// visual intro is needed (homepage, and later Story/Issue/Builders Cup
// detail pages, which also open on a Hero Image per docs/02_SITE_STRUCTURE.md).
export function Hero({
  image,
  title,
  subtitle,
  cta,
  className,
  lightbox = false,
  priority = true,
  headingLevel = 1,
}: HeroProps) {
  return (
    <div className={cn("relative flex min-h-[70vh] items-end overflow-hidden", className)}>
      <div className="absolute inset-0">
        <Image asset={image} preset="hero" fill priority={priority} sizes="100vw" lightbox={lightbox} />
      </div>
      <div className="absolute inset-0 bg-scrim/30 pointer-events-none" />
      <Container className="relative flex flex-col gap-4 pb-[var(--spacing-gutter-lg)]">
        <Heading level={headingLevel} tone="inverted">
          {title}
        </Heading>
        {subtitle && (
          <Text variant="lead" tone="inverted" className="max-w-xl">
            {subtitle}
          </Text>
        )}
        {cta && (
          <ButtonLink href={cta.href} variant="inverted" className="self-start">
            {cta.label}
          </ButtonLink>
        )}
      </Container>
    </div>
  );
}
