import type { EnabledLocale } from "@/lib/i18n/locales";
import type { HeroStoryBlock } from "@/types/content";
import { Hero } from "@/components/editorial/Hero";
import { getBlockSectionProps } from "./blockSettings";

interface HeroBlockProps {
  block: HeroStoryBlock;
  locale: EnabledLocale;
}

// Wraps the existing Hero component unmodified — no Section/Container,
// Hero already renders full-bleed. Hero is the one block that doesn't
// use <Section> internally, so a minimal wrapping <div> carries only the
// Block Settings that make sense for an intentionally always-full-bleed
// block: anchor id and spacing overrides. containerWidth/background
// don't apply here (there's no container to cap and Hero's photo is its
// own background), same reasoning as FullPhotoBlock.
export function HeroBlock({ block, locale }: HeroBlockProps) {
  const { story } = block;
  if (!story) return null;

  const { id, style } = getBlockSectionProps(block.settings);

  return (
    <div id={id} style={style}>
      <Hero
        image={story.coverImage}
        title={story.title}
        subtitle={story.shortDescription}
        cta={{ label: "Читать", href: `/${locale}/stories/${story.slug}` }}
      />
    </div>
  );
}
