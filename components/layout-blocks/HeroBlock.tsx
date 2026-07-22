import type { EnabledLocale } from "@/lib/i18n/locales";
import type { HeroStoryBlock } from "@/types/content";
import { Hero } from "@/components/editorial/Hero";
import { getBlockSectionProps } from "./blockSettings";

interface HeroBlockProps {
  block: HeroStoryBlock;
  locale: EnabledLocale;
  /** Whether this is the first block in the document's Layout Blocks
   * sequence — an editor can place more than one Hero Story block, and
   * only the first is genuinely above the fold and the page's one H1.
   * See Hero.tsx's `priority`/`headingLevel` props. */
  isFirstBlock: boolean;
}

// Wraps the existing Hero component unmodified — no Section/Container,
// Hero already renders full-bleed. Hero is the one block that doesn't
// use <Section> internally, so a minimal wrapping <div> carries only the
// Block Settings that make sense for an intentionally always-full-bleed
// block: anchor id and spacing overrides. containerWidth/background
// don't apply here (there's no container to cap and Hero's photo is its
// own background), same reasoning as FullPhotoBlock.
export function HeroBlock({ block, locale, isFirstBlock }: HeroBlockProps) {
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
        priority={isFirstBlock}
        headingLevel={isFirstBlock ? 1 : 2}
      />
    </div>
  );
}
