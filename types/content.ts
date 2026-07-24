// Mirrors docs/03_CONTENT_MODEL.md exactly, including fields not yet
// consumed by any MVP page (e.g. Person.slug, most of Bike/Builder),
// so the CMS integration milestone (10) requires no type changes.

import type { PortableTextBlock } from "@portabletext/types";

// Print-magazine-style rich text blocks beyond plain paragraphs/marks —
// shared by Story.content, Issue.description, and BuildersCup.description
// (see cms/schemas/portableTextBlocks.ts / studio/schemas/portableTextBlocks.ts,
// the single source of truth for which block types exist and their
// fields). Person.bio and Product.description also use RichText but their
// schemas only allow plain blocks — this union is a superset, not a claim
// that every RichText field can contain these.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"] as const;
export type RichTextImageVariant = (typeof RICH_TEXT_IMAGE_VARIANTS)[number];

export interface RichTextImageBlock {
  _type: "richTextImage";
  _key: string;
  image?: MediaAsset;
  variant?: RichTextImageVariant;
}

export interface RichTextPullQuote {
  _type: "pullQuote";
  _key: string;
  text: string;
  attribution?: string;
}

export interface RichTextDivider {
  _type: "divider";
  _key: string;
}

// Provider is optional in the schema — the renderer (components/ui/Embed.tsx)
// auto-detects YouTube/Vimeo from the URL regardless, so an editor never has
// to set it correctly for the embed to work.
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"] as const;
export type EmbedProvider = (typeof EMBED_PROVIDERS)[number];

export interface RichTextEmbed {
  _type: "embed";
  _key: string;
  url: string;
  provider?: EmbedProvider;
}

// Advanced editorial layout blocks (docs: "advanced editorial image
// layouts for Rich Text"). Each has its own renderer component under
// components/ui/richtext/ — see RichText.tsx. Nested inside a
// twoColumnText (below), only the base block set is allowed — none of
// these four may nest inside each other or inside a twoColumnText.
export const IMAGE_ROW_LAYOUTS = ["equal", "2-1", "1-2", "large-left", "large-right"] as const;
export type ImageRowLayout = (typeof IMAGE_ROW_LAYOUTS)[number];

export const IMAGE_ROW_GAPS = ["small", "medium", "large"] as const;
export type ImageRowGap = (typeof IMAGE_ROW_GAPS)[number];

export interface RichTextImageRowBlock {
  _type: "imageRow";
  _key: string;
  images: MediaAsset[];
  layout?: ImageRowLayout;
  gap?: ImageRowGap;
  caption?: string;
}

export const IMAGE_TEXT_POSITIONS = ["left", "right"] as const;
export type ImageTextPosition = (typeof IMAGE_TEXT_POSITIONS)[number];

export const IMAGE_TEXT_WIDTHS = ["35%", "40%", "50%"] as const;
export type ImageTextWidth = (typeof IMAGE_TEXT_WIDTHS)[number];

// No dedicated text field — when textWrap is on, the image floats and
// whatever plain-paragraph blocks follow it elsewhere in the same
// RichText body wrap around it via CSS float (see RichText.tsx's
// flow-root container and RichTextImageText.tsx). Desktop only; always
// stacks full-width on mobile regardless of textWrap.
export interface RichTextImageTextBlock {
  _type: "imageText";
  _key: string;
  image?: MediaAsset;
  position?: ImageTextPosition;
  width?: ImageTextWidth;
  textWrap?: boolean;
}

// Caption comes from the referenced MediaAsset's own caption/copyright
// (see MediaAsset above) — no separate field, same as every other image
// block in this file. The image itself breaks out to the existing
// "fullWidth" breakout used by RichTextImageBlock's own fullWidth
// variant; the caption stays constrained to the normal reading column.
export interface RichTextFullBleedBlock {
  _type: "fullBleedImage";
  _key: string;
  image?: MediaAsset;
}

// In-article version of the Horizontal Image Strip Layout Block
// (HorizontalImageStripBlock, below) — same film-strip idea, embedded
// inline in an article instead of a full page section. Named "imageStrip"
// (not "horizontalImageStrip") so its _type never collides with the Layout
// Block's, even though the two live in unrelated arrays: it also has a
// smaller field set (no title, matching imageRow's own convention of
// having a caption but no title). GalleryHeight/Gap are declared further
// down in this file's Gallery section — forward references between
// type/interface declarations are fine in TypeScript, unlike const/let.
export interface RichTextImageStripBlock {
  _type: "imageStrip";
  _key: string;
  images: MediaAsset[];
  imageHeight?: GalleryHeight;
  gap?: GalleryGap;
  showCaptions?: boolean;
  showScrollbar?: boolean;
  caption?: string;
}

// Nested Portable Text, restricted Studio-side to the base block set
// (block/richTextImage/pullQuote/divider/embed — see
// studio/schemas/portableTextBlocks.ts's BASE_PORTABLE_TEXT_BLOCKS).
// Reuses the full RichText union here for simplicity rather than a
// separate narrower type; content that somehow contained one of the four
// blocks above just renders nothing for that entry (no matching handler
// in RichTextTwoColumns's nested PortableText components).
export interface RichTextTwoColumnTextBlock {
  _type: "twoColumnText";
  _key: string;
  content: RichText;
}

export type RichText = (
  | PortableTextBlock
  | RichTextImageBlock
  | RichTextPullQuote
  | RichTextDivider
  | RichTextEmbed
  | RichTextImageRowBlock
  | RichTextImageTextBlock
  | RichTextFullBleedBlock
  | RichTextImageStripBlock
  | RichTextTwoColumnTextBlock
)[];

export type PublishStatus = "draft" | "published";

export interface MediaAsset {
  id: string;
  url: string;
  width: number;
  height: number;
  caption?: string;
  author?: Person;
  copyright?: string;
  altText: string;
  relatedObject?: string;
  /** Sanity's auto-generated low-quality image placeholder (a tiny base64
   * data URI) — sourced from the asset's own metadata, never generated by
   * this app. Absent for mock data, which has no Sanity asset behind it;
   * components/ui/Image.tsx treats that as "no blur placeholder" rather
   * than an error. */
  blurDataURL?: string;
}

// Const array (not just a union type) so it can also drive the category
// filter UI and validate the ?category= search param at runtime —
// mirrors the SUPPORTED_LOCALES/ENABLED_LOCALES pattern in lib/i18n/locales.ts.
export const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"] as const;
export type StoryCategory = (typeof STORY_CATEGORIES)[number];

// Which block(s) of the About page's team section a Person shows up in.
// A person can belong to more than one (e.g. someone who is both on the
// core team and a photographer) — see cms/services/people.ts. Adding a
// new block later (the team grid is expected to grow) means adding one
// entry here plus the two schema mirrors (cms/schemas/person.ts,
// studio/schemas/person.ts) — no other code changes, same pattern as
// STORY_CATEGORIES above. English values, matching every other taxonomy
// enum in this codebase (STORY_CATEGORIES, etc.) — the Russian label
// shown to site visitors lives in PERSON_GROUP_LABELS below, not in the
// stored value itself.
export const PERSON_GROUPS = ["Team", "Photographers"] as const;
export type PersonGroup = (typeof PERSON_GROUPS)[number];

// Visitor-facing Russian label for each group — see
// app/[locale]/about/page.tsx, the only place a group is rendered as a
// section heading rather than just used as a filter key.
export const PERSON_GROUP_LABELS: Record<PersonGroup, string> = {
  Team: "Команда",
  Photographers: "Фотографы",
};

export interface Person {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo?: MediaAsset;
  bio?: RichText;
  groups?: PersonGroup[];
  articles?: Story[];
}

export interface Builder {
  id: string;
  slug: string;
  name: string;
  location?: string;
  bio?: RichText;
  socialLinks?: Record<string, string>;
  projects?: Bike[];
  stories?: Story[];
}

export interface Bike {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  model?: string;
  year?: number;
  style?: string;
  engine?: string;
  description?: RichText;
  specifications?: Record<string, string>;
  images: MediaAsset[];
  builder?: Builder;
  stories?: Story[];
  issues?: Issue[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  coverImage: MediaAsset;
  shortDescription: string;
  content: RichText;
  category: StoryCategory;
  author?: Person;
  publishedDate: string;
  issue?: Issue;
  gallery?: MediaAsset[];
  gallerySettings?: GallerySettings;
  relatedBike?: Bike[];
  relatedBuilder?: Builder[];
  tags?: string[];
  status: PublishStatus;
}

export interface Issue {
  id: string;
  slug: string;
  number: number;
  year: number;
  title: string;
  coverImage: MediaAsset;
  description?: RichText;
  releaseDate: string;
  advertisers?: string[];
  buyLinks?: { label: string; url: string }[];
  status: PublishStatus;
  featuredStories?: Story[];
  gallery?: MediaAsset[];
  gallerySettings?: GallerySettings;
}

export interface BuildersCup {
  id: string;
  slug: string;
  name: string;
  date: string;
  location?: string;
  description?: RichText;
  coverImage: MediaAsset;
  gallery?: MediaAsset[];
  gallerySettings?: GallerySettings;
  participants?: Bike[];
  winners?: Bike[];
  stories?: Story[];
}

// Singleton (not a collection) — docs/10_POST_MVP.md: "Create Site
// Settings singleton in Sanity." Only one document of this shape exists.
// Field order here matches both the Studio schema's field order
// (studio/schemas/siteSettings.ts) and the About page's block order
// (app/[locale]/about/page.tsx) — О журнале → Философия → Миссия →
// Команда/Фотографы (Person, a separate document type, not a field
// here) → Контакты → Сотрудничество, with Default SEO always last since
// it's infrastructure config, not editorial content editors browse daily.
export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  philosophy: string;
  mission: string;
  contacts: {
    email: string;
    city?: string;
    // Nested under Contacts (not a sibling field) since that's where an
    // editor naturally looks for "how to reach/follow us" — was a
    // top-level field until the About page actually started rendering
    // it (previously true: "not consumed by any UI yet").
    socialLinks?: { label: string; url: string }[];
  };
  cooperation: string;
  footerText: string;
  // The single source of truth for site-wide SEO configuration (see
  // app/layout.tsx and lib/seo/*.ts) — every page still defines its own
  // title/description/openGraph/etc (see each route's own
  // generateMetadata), but whatever a page *doesn't* specify falls back
  // to these values via Next.js's normal parent/child metadata merging,
  // rather than being duplicated as a hardcoded literal in every page.
  defaultSEO?: {
    title: string;
    description: string;
    // Same string array shape Next.js's own `Metadata.keywords` expects
    // — see lib/seo/keywords.ts, which combines this with any
    // page-specific keywords a route wants to add later.
    keywords?: string[];
    ogImage?: MediaAsset;
    favicon?: MediaAsset;
    // Falls back to `ogImage` when unset (see app/layout.tsx) rather
    // than requiring every project to upload a second near-identical
    // image just to have *a* Twitter image.
    twitterImage?: MediaAsset;
    // Raw `<meta name="robots">` content (e.g. "index, follow") — a
    // plain string field in Sanity rather than a structured toggle set,
    // since Next.js's `Metadata.robots` accepts a string directly and
    // this covers the MVP need (global default, per-page override via
    // the page's own `robots` key — see app/[locale]/search/page.tsx
    // for an example of a page that already overrides it).
    robots?: string;
    // Distinct from `siteTitle` on purpose: this is specifically what
    // OpenGraph/Twitter/JSON-LD should call the site (falls back to
    // siteTitle when unset), not necessarily identical to the
    // editorial/branding title used elsewhere.
    siteName?: string;
  };
}

// Product catalog entity — docs/03_CONTENT_MODEL.md's Scalability
// section names "Product" as a future addition without a field list;
// this is that field list, scoped to catalog presentation only. No
// cart/checkout/stock fields — external-link purchase only, per
// docs/10_POST_MVP.md Phase 3 (Shop is still post-MVP).
export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: RichText;
  shortDescription: string;
  mainImage: MediaAsset;
  gallery?: MediaAsset[];
  gallerySettings?: GallerySettings;
  price: number;
  currency: string;
  sizes?: string[];
  materials?: string;
  externalBuyUrl: string;
  status: PublishStatus;
}

// Layout Blocks — a general-purpose, reusable editorial composition
// system (schema in studio/schemas/layoutBlocks.ts + cms/schemas/layoutBlocks.ts,
// GROQ resolution via cms/queries/fragments.ts's layoutBlocksField(),
// mapping via cms/mappers/layoutBlocks.ts, rendering via
// components/layout-blocks/). HomePage (below) is its first consumer —
// any future document type that wants an editor-composed, freely
// reorderable sequence of sections (a landing page, a Builders Cup promo
// page, a digital issue) declares its own `blocks: LayoutBlock[]` field
// and reuses every layer of this system unchanged.
//
// Every block's entity reference(s) are optional, not required: a block
// an editor has added but not yet filled in (e.g. no story picked yet)
// is valid, incomplete Sanity data, not an error — every block component
// under components/layout-blocks/ checks for its own required content
// and renders nothing when absent, the same defensive pattern already
// used by components/ui/richtext/RichTextFullBleed.tsx.

export const STORY_GRID_LAYOUTS = ["2-columns", "3-columns", "editorial"] as const;
export type StoryGridLayout = (typeof STORY_GRID_LAYOUTS)[number];

export const SPACER_SIZES = ["sm", "md", "lg", "xl"] as const;
export type SpacerSize = (typeof SPACER_SIZES)[number];

// Shared by every Layout Block — see Block Settings below. `_key` moves
// here (was previously declared independently on every block interface)
// purely to avoid repeating it once `settings` is added to all of them.
export interface LayoutBlockBase {
  _key: string;
  settings?: BlockSettings;
}

export const BLOCK_BACKGROUNDS = ["none", "surface", "custom"] as const;
export type BlockBackground = (typeof BLOCK_BACKGROUNDS)[number];

export const CONTAINER_WIDTHS = ["normal", "wide", "full"] as const;
export type ContainerWidth = (typeof CONTAINER_WIDTHS)[number];

// Generic per-block overrides available to every Layout Block, authored
// in a collapsed "Settings" fieldset in Studio (see
// studio/schemas/layoutBlocks.ts's blockSettingsFields) so they stay out
// of the way of the block's own primary fields. Applied by
// components/layout-blocks/blockSettings.ts, not by each block reimplementing
// this logic — see that file for exactly which blocks honor which
// setting (e.g. containerWidth is meaningless for an intentionally
// full-bleed block like Hero).
export interface BlockSettings {
  spacingTop?: SpacerSize;
  spacingBottom?: SpacerSize;
  background?: BlockBackground;
  /** Only meaningful when background === "custom". */
  backgroundColor?: string;
  containerWidth?: ContainerWidth;
  /** Renders as this element's `id` — lets a CTA/nav link deep-link to
   * this specific block via `#anchor`. */
  anchor?: string;
}

export interface HeroStoryBlock extends LayoutBlockBase {
  _type: "heroStory";
  story?: Story;
}

// The single "list of stories" block — covers both hand-curated grids
// (dataSource: "manual", the original/default behavior) and query-driven
// listings (dataSource: "automatic": category/tag/count/sort filters,
// resolved by cms/services/layoutBlocks.ts's resolveDynamicBlocks()).
// "Automatic" with no category/tag set and sort "newest" is exactly what
// a separate "Latest Stories" block would have been — folded in here
// rather than duplicated as its own block type.
export const STORY_DATA_SOURCES = ["manual", "automatic"] as const;
export type StoryDataSource = (typeof STORY_DATA_SOURCES)[number];

export const STORY_SORT_ORDERS = ["newest", "oldest"] as const;
export type StorySortOrder = (typeof STORY_SORT_ORDERS)[number];

export interface StoryGridBlock extends LayoutBlockBase {
  _type: "storyGrid";
  title?: string;
  layout?: StoryGridLayout;
  /** Absent/undefined behaves as "manual" — every pre-v2 document that
   * only ever picked stories by hand keeps working unchanged. */
  dataSource?: StoryDataSource;
  /** Manual mode: editor-picked, GROQ-resolved. Automatic mode: filled
   * in by resolveDynamicBlocks() after the query runs. Either way, by
   * the time StoryGridBlock.tsx renders, this is just a plain Story[]. */
  stories?: Story[];
  category?: StoryCategory;
  tag?: string;
  count?: number;
  sort?: StorySortOrder;
}

export interface FullWidthPhotoBlock extends LayoutBlockBase {
  _type: "fullWidthPhoto";
  image?: MediaAsset;
  caption?: string;
}

export interface QuoteBlock extends LayoutBlockBase {
  _type: "quote";
  text: string;
  author?: string;
}

export interface FeaturedIssueBlock extends LayoutBlockBase {
  _type: "featuredIssue";
  issue?: Issue;
}

// Named buildersCupHighlight, not buildersCup — a Sanity project has one
// flat type-name namespace across document and object types, and
// "buildersCup" is already the document type name (see
// studio/schemas/buildersCup.ts). Matches the BuildersCupHighlight
// component this block renders through.
export interface BuildersCupHighlightBlock extends LayoutBlockBase {
  _type: "buildersCupHighlight";
  event?: BuildersCup;
}

export interface MerchandiseBlock extends LayoutBlockBase {
  _type: "merchandise";
  title?: string;
  products?: Product[];
}

export interface SpacerBlock extends LayoutBlockBase {
  _type: "spacer";
  size?: SpacerSize;
}

// Reuses the existing article RichText union wholesale — see
// components/ui/RichText.tsx, rendered here unmodified. No new rich-text
// feature is introduced by this block; it just makes the same authoring
// surface available outside a Story.
export interface RichTextLayoutBlock extends LayoutBlockBase {
  _type: "richText";
  content: RichText;
}

// Highlights a single Bike/Builder via the existing BikeCard/BuilderCard
// components (components/editorial/) — reused unmodified. ctaUrl is a
// free-form URL rather than an auto-derived detail-page link because
// /bikes/[slug] and /builders/[slug] don't exist yet (post-MVP).
export interface BikeSpotlightBlock extends LayoutBlockBase {
  _type: "bikeSpotlight";
  bike?: Bike;
  heading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface BuilderSpotlightBlock extends LayoutBlockBase {
  _type: "builderSpotlight";
  builder?: Builder;
  heading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const CTA_ALIGNMENTS = ["left", "center", "right"] as const;
export type CtaAlignment = (typeof CTA_ALIGNMENTS)[number];

// A promo/campaign banner — distinct from the generic Block Settings
// background above: this block's own backgroundImage/backgroundColor are
// its primary visual design (the banner itself), not an outer-section
// override.
export interface CtaBlock extends LayoutBlockBase {
  _type: "cta";
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage?: MediaAsset;
  backgroundColor?: string;
  alignment?: CtaAlignment;
  overlay?: boolean;
}

// Provider-abstracted from the start (per explicit correction — "Social
// Feed", not "Instagram Feed") so a second network is one more entry in
// SOCIAL_PROVIDERS plus one more case in cms/services/socialFeed.ts,
// never a new block _type or schema/renderer change.
export const SOCIAL_PROVIDERS = ["instagram"] as const;
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

export const SOCIAL_PROVIDER_LABELS: Record<SocialProvider, string> = {
  instagram: "Instagram",
};

export interface SocialPost {
  id: string;
  provider: SocialProvider;
  imageUrl: string;
  caption?: string;
  permalink: string;
}

export interface SocialFeedBlock extends LayoutBlockBase {
  _type: "socialFeed";
  title?: string;
  provider?: SocialProvider;
  count?: number;
  /** Editor-authored destination for the "Follow on {provider}" button —
   * a real provider integration has no reliable way to hand back a
   * profile URL alongside individual post permalinks, so this is set by
   * hand rather than derived. Falls back to the first resolved post's
   * permalink when unset (mainly so the mock provider still shows a
   * working button before an editor has filled this in). */
  profileUrl?: string;
  /** Resolved by cms/services/layoutBlocks.ts's resolveDynamicBlocks() —
   * never authored directly in Studio. */
  posts?: SocialPost[];
}

// A real divider, distinct from Spacer (which only adds empty space) —
// renders an actual visual mark. New variants are additive: one more
// entry here plus one more case in EditorialDividerBlock.tsx, no
// schema/type ripple beyond that.
export const DIVIDER_VARIANTS = ["line", "dot", "diamond", "label", "minimal"] as const;
export type DividerVariant = (typeof DIVIDER_VARIANTS)[number];

export interface EditorialDividerBlock extends LayoutBlockBase {
  _type: "editorialDivider";
  variant?: DividerVariant;
  label?: string;
  spacing?: SpacerSize;
}

// Gallery — the single reusable multi-image renderer (components/ui/Gallery.tsx),
// supporting a "grid" layout (single-column stack, its original/only
// behavior) and a "strip" layout (a magazine contact-sheet/film-strip
// section, distinct from RichText's imageRow, which belongs inside an
// article's reading column and never scrolls, and from ImageGrid, a
// separate compact multi-column thumbnail component). Every Gallery
// consumer — the plain `gallery` field on Story/Issue/BuildersCup/Product,
// and the dedicated HorizontalImageStripBlock/RichTextImageStripBlock
// (both hardcode layout: "strip") — shares these same types.
export const GALLERY_LAYOUTS = ["grid", "strip"] as const;
export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number];

export const GALLERY_HEIGHTS = ["small", "medium", "large"] as const;
export type GalleryHeight = (typeof GALLERY_HEIGHTS)[number];

export const GALLERY_GAPS = ["none", "small", "medium", "large"] as const;
export type GalleryGap = (typeof GALLERY_GAPS)[number];

// Settings for the plain `gallery` field on Story/Issue/BuildersCup/Product
// — a new, optional sibling field (gallerySettings) so existing documents
// (which lack it entirely) keep resolving to `layout: "grid"`, today's
// only behavior, with zero data migration.
export interface GallerySettings {
  layout?: GalleryLayout;
  imageHeight?: GalleryHeight;
  gap?: GalleryGap;
  showCaptions?: boolean;
  showScrollbar?: boolean;
}

export interface HorizontalImageStripBlock extends LayoutBlockBase {
  _type: "horizontalImageStrip";
  images: MediaAsset[];
  title?: string;
  caption?: string;
  imageHeight?: GalleryHeight;
  gap?: GalleryGap;
  showCaptions?: boolean;
  showScrollbar?: boolean;
}

export type LayoutBlock =
  | HeroStoryBlock
  | StoryGridBlock
  | FullWidthPhotoBlock
  | QuoteBlock
  | FeaturedIssueBlock
  | BuildersCupHighlightBlock
  | MerchandiseBlock
  | SpacerBlock
  | RichTextLayoutBlock
  | BikeSpotlightBlock
  | BuilderSpotlightBlock
  | CtaBlock
  | SocialFeedBlock
  | EditorialDividerBlock
  | HorizontalImageStripBlock;


// Singleton (not a collection), same pattern as SiteSettings above — one
// document, fetched by fixed _id ("homePage"). The homepage as a
// "magazine spread": editors compose it as a sequence of Layout Blocks
// (above) in Sanity, and the frontend renders exactly that sequence in
// that order — see components/layout-blocks/LayoutBlocksRenderer.tsx.
export interface HomePage {
  blocks: LayoutBlock[];
}

// A collection (not a singleton, unlike HomePage) — any number of these
// can exist, each at its own /ru/p/[slug] route (see
// app/[locale]/p/[slug]/page.tsx). Same Layout Blocks composition model
// as HomePage, proving that system is genuinely reusable rather than
// homepage-specific — a standalone promo/campaign page, not part of the
// site's main navigation.
export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  blocks: LayoutBlock[];
}
