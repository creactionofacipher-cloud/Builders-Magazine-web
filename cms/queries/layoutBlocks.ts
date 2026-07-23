import { bikeProjection, builderProjection, mediaAssetProjection, richTextField, storyProjection } from "./fragments";
import { issueFields } from "./issue";
import { buildersCupFields } from "./buildersCup";
import { productFields } from "./product";

// Resolves a Layout Blocks array field (types/content.ts's LayoutBlock
// union — see studio/schemas/layoutBlocks.ts / cms/schemas/layoutBlocks.ts
// for the schema side) into fully-dereferenced entities, the same way
// fragments.ts's richTextField() resolves a portable-text array field.
// Not itself in fragments.ts: it needs issueFields/buildersCupFields/
// productFields, which are each exported from their own query file and
// already import *from* fragments.ts — putting this here (downstream of
// all four) instead of in fragments.ts avoids a circular import between
// fragments.ts and issue.ts/buildersCup.ts/product.ts.
//
// One reusable function — any future document's own query file (a
// landing page, a Builders Cup promo page, a digital issue) calls
// layoutBlocksField("blocks") the same way and gets full resolution with
// no copy-pasted GROQ. cms/queries/homepage.ts is the first caller.
//
// `quote`, `spacer`, `cta`, `socialFeed`, and `editorialDivider` blocks
// carry only plain scalars (or, for `cta`, one direct reference resolved
// below) — the leading `...` already passes plain scalars through
// unchanged, so blocks with nothing but scalars need no conditional
// branch here. `storyGrid`'s `stories` is always resolved (harmless for
// "automatic" mode, where the field is simply absent/empty in the source
// document and cms/services/layoutBlocks.ts's resolveDynamicBlocks()
// fills it in afterwards) — the block doesn't know at query time which
// data source it uses.
export function layoutBlocksField(fieldName: string): string {
  return `"${fieldName}": ${fieldName}[]{
    ...,
    _type == "heroStory" => {
      "story": story->${storyProjection}
    },
    _type == "storyGrid" => {
      "stories": stories[]->${storyProjection}
    },
    _type == "fullWidthPhoto" => {
      "image": image->${mediaAssetProjection}
    },
    _type == "featuredIssue" => {
      "issue": issue->${issueFields}
    },
    _type == "buildersCupHighlight" => {
      "event": event->${buildersCupFields}
    },
    _type == "merchandise" => {
      "products": products[]->${productFields}
    },
    _type == "richText" => {
      ${richTextField("content")}
    },
    _type == "bikeSpotlight" => {
      "bike": bike->${bikeProjection}
    },
    _type == "builderSpotlight" => {
      "builder": builder->${builderProjection}
    },
    _type == "cta" => {
      "backgroundImage": backgroundImage->${mediaAssetProjection}
    },
    _type == "horizontalImageStrip" => {
      "images": images[]->${mediaAssetProjection}
    }
  }`;
}
