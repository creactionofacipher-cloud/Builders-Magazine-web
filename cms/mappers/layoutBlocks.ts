import type {
  BikeSpotlightBlock,
  BuilderSpotlightBlock,
  BuildersCupHighlightBlock,
  CtaBlock,
  EditorialDividerBlock,
  FeaturedIssueBlock,
  FullWidthPhotoBlock,
  HeroStoryBlock,
  LayoutBlock,
  MerchandiseBlock,
  Product,
  QuoteBlock,
  RichTextLayoutBlock,
  SocialFeedBlock,
  SpacerBlock,
  StoryGridBlock,
} from "@/types/content";
import { mapStory, type RawStory } from "./story";
import { mapIssue, type RawIssue } from "./issue";
import { mapBuildersCup, type RawBuildersCup } from "./buildersCup";
import { mapProduct } from "./product";
import { mapBike, type RawBike } from "./bike";
import { mapBuilder, type RawBuilder } from "./builder";

// Raw shape of every Layout Block — mirrors LayoutBlock (types/content.ts)
// field-for-field, with each block's own entity reference(s) still in
// their pre-mapping Raw* shape. Blocks with no entity reference needing a
// sub-mapper (mediaAssetProjection/richTextField/Product already project
// directly into their final shape, same as every other MediaAsset/Product
// usage elsewhere in this codebase) are identical to their LayoutBlock
// counterparts.
export type RawLayoutBlock =
  | (Omit<HeroStoryBlock, "story"> & { story?: RawStory })
  | (Omit<StoryGridBlock, "stories"> & { stories?: RawStory[] })
  | FullWidthPhotoBlock
  | QuoteBlock
  | (Omit<FeaturedIssueBlock, "issue"> & { issue?: RawIssue })
  | (Omit<BuildersCupHighlightBlock, "event"> & { event?: RawBuildersCup })
  | (Omit<MerchandiseBlock, "products"> & { products?: Product[] })
  | SpacerBlock
  | RichTextLayoutBlock
  | (Omit<BikeSpotlightBlock, "bike"> & { bike?: RawBike })
  | (Omit<BuilderSpotlightBlock, "builder"> & { builder?: RawBuilder })
  | CtaBlock
  | SocialFeedBlock
  | EditorialDividerBlock;

function mapLayoutBlock(block: RawLayoutBlock): LayoutBlock {
  switch (block._type) {
    case "heroStory":
      return { ...block, story: block.story ? mapStory(block.story) : undefined };
    case "storyGrid":
      return { ...block, stories: block.stories?.map(mapStory) };
    case "featuredIssue":
      return { ...block, issue: block.issue ? mapIssue(block.issue) : undefined };
    case "buildersCupHighlight":
      return { ...block, event: block.event ? mapBuildersCup(block.event) : undefined };
    case "merchandise":
      return { ...block, products: block.products?.map(mapProduct) };
    case "bikeSpotlight":
      return { ...block, bike: block.bike ? mapBike(block.bike) : undefined };
    case "builderSpotlight":
      return { ...block, builder: block.builder ? mapBuilder(block.builder) : undefined };
    default:
      return block;
  }
}

// Reusable across any document type with its own Layout Blocks field —
// see cms/queries/layoutBlocks.ts's layoutBlocksField() for the GROQ-side
// counterpart. cms/mappers/homepage.ts is the first caller.
export function mapLayoutBlocks(raw?: RawLayoutBlock[]): LayoutBlock[] {
  return (raw ?? []).map(mapLayoutBlock);
}
