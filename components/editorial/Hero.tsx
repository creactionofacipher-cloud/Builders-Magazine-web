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
}

// Full-bleed image with overlaid title/CTA. Reusable wherever a large
// visual intro is needed (homepage, and later Story/Issue/Builders Cup
// detail pages, which also open on a Hero Image per docs/02_SITE_STRUCTURE.md).
export function Hero({ image, title, subtitle, cta, className }: HeroProps) {
  return (
    <div className={cn("relative flex min-h-[70vh] items-end overflow-hidden", className)}>
      <div className="absolute inset-0">
        <Image asset={image} fill priority sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-scrim/30" />
      <Container className="relative flex flex-col gap-4 pb-[var(--spacing-gutter-lg)]">
        <Heading level={1} tone="inverted">
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
