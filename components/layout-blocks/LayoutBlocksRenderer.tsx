import type { EnabledLocale } from "@/lib/i18n/locales";
import type { LayoutBlock } from "@/types/content";
import { HeroBlock } from "./HeroBlock";
import { StoryGridBlock } from "./StoryGridBlock";
import { FullPhotoBlock } from "./FullPhotoBlock";
import { QuoteBlock } from "./QuoteBlock";
import { FeaturedIssueBlock } from "./FeaturedIssueBlock";
import { BuildersCupBlock } from "./BuildersCupBlock";
import { MerchandiseBlock } from "./MerchandiseBlock";
import { SpacerBlock } from "./SpacerBlock";
import { RichTextBlock } from "./RichTextBlock";
import { BikeSpotlightBlock } from "./BikeSpotlightBlock";
import { BuilderSpotlightBlock } from "./BuilderSpotlightBlock";
import { CtaBlock } from "./CtaBlock";
import { SocialFeedBlock } from "./SocialFeedBlock";
import { EditorialDividerBlock } from "./EditorialDividerBlock";

interface LayoutBlocksRendererProps {
  blocks: LayoutBlock[];
  locale: EnabledLocale;
}

// The only file that knows the full Layout Block type list — every block
// component above only knows its own shape. Renders blocks sequentially,
// exactly in the order the document authored them in; no section is
// hardcoded or assumed here. Reusable by any document with its own
// `blocks: LayoutBlock[]` field, not just HomePage (app/[locale]/page.tsx
// is simply today's one caller).
export function LayoutBlocksRenderer({ blocks, locale }: LayoutBlocksRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block._type) {
          case "heroStory":
            return (
              <HeroBlock
                key={block._key}
                block={block}
                locale={locale}
                isFirstBlock={index === 0}
              />
            );
          case "storyGrid":
            return <StoryGridBlock key={block._key} block={block} locale={locale} />;
          case "fullWidthPhoto":
            return <FullPhotoBlock key={block._key} block={block} />;
          case "quote":
            return <QuoteBlock key={block._key} block={block} />;
          case "featuredIssue":
            return <FeaturedIssueBlock key={block._key} block={block} locale={locale} />;
          case "buildersCupHighlight":
            return <BuildersCupBlock key={block._key} block={block} locale={locale} />;
          case "merchandise":
            return <MerchandiseBlock key={block._key} block={block} locale={locale} />;
          case "spacer":
            return <SpacerBlock key={block._key} block={block} />;
          case "richText":
            return <RichTextBlock key={block._key} block={block} />;
          case "bikeSpotlight":
            return <BikeSpotlightBlock key={block._key} block={block} />;
          case "builderSpotlight":
            return <BuilderSpotlightBlock key={block._key} block={block} />;
          case "cta":
            return <CtaBlock key={block._key} block={block} />;
          case "socialFeed":
            return <SocialFeedBlock key={block._key} block={block} />;
          case "editorialDivider":
            return <EditorialDividerBlock key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
