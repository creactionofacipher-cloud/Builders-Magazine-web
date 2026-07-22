import type { PortableTextComponents } from "@portabletext/react";
import type {
  MediaAsset,
  RichText as RichTextValue,
  RichTextImageBlock,
  RichTextPullQuote,
  RichTextEmbed,
} from "@/types/content";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { List } from "@/components/ui/List";
import { Quote } from "@/components/ui/Quote";
import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { Divider } from "@/components/ui/Divider";
import { Embed } from "@/components/ui/Embed";
import { cn } from "@/utils/cn";

// Breaks out of the immediate parent proportionally — a percentage of
// *that parent's* width, not the viewport. RichText is a shared component
// rendered in very different contexts (Story's centered max-w-3xl column
// vs. Issue/BuildersCup's half-width grid cell alongside the cover image),
// so a viewport-relative breakout (100vw, centered via left-1/2 +
// -translate-x-1/2) centers on the element's own containing block, not
// the true viewport — in a grid cell that's off-center, which made wide
// images spill into the neighboring column. Percentages of the parent
// keep the same *proportional* breakout everywhere without knowing
// anything about that parent's absolute size or position. Shared with
// RichTextFullBleed.tsx, which reuses the fullWidth breakout directly.
// The breakout percentages only apply at md: and up — Container already
// pads the reading column down to near-full-width on mobile (see
// components/layout/Container.tsx), so there's no separate "wider column"
// left to break out into there. Applying the same >100% width
// unconditionally caused real page-level horizontal scroll on mobile
// (found while verifying RichTextFullBleed, which reuses this exact
// fullWidth breakout — see components/ui/richtext/RichTextFullBleed.tsx).
//
// The percentage alone isn't enough even at md: and up, though: at
// viewport widths roughly 768–1090px, 142% of a max-w-3xl (768px)
// reading column is wider than the viewport itself minus Container's own
// gutters, which reintroduces the same page-level horizontal scroll in
// that range (confirmed: at 768px viewport the column is 768-96=672px,
// so 1.42×672≈954px — 186px wider than the viewport). `min(...)` caps
// the breakout at whichever is smaller: the intended proportional
// breakout, or the true available viewport width (100vw minus both
// Container gutters) — never wider than the viewport, in every context
// this renders in (Story's centered column and Issue/BuildersCup's grid
// cell alike, since the grid cell is always ≤ that same viewport bound).
export const IMAGE_VARIANT_CLASSES: Record<string, string> = {
  inline: "mx-auto max-w-2xl",
  wide: "w-full md:relative md:left-1/2 md:w-[min(118%,calc(100vw_-_2*var(--spacing-gutter-lg)))] md:max-w-none md:-translate-x-1/2",
  fullWidth: "w-full md:relative md:left-1/2 md:w-[min(142%,calc(100vw_-_2*var(--spacing-gutter-lg)))] md:max-w-none md:-translate-x-1/2",
};

interface RichTextImageGalleryBlock {
  _type: "richTextImageGallery";
  _key: string;
  images: RichTextImageBlock[];
}

type GroupedBlock = RichTextValue[number] | RichTextImageGalleryBlock;

// Only consecutive richTextImage blocks left at the default "inline"
// width are grouped — wide/fullWidth images, and any other block type,
// end the current run (per the editorial spec: "wide/fullWidth images
// always break the gallery"). A run of exactly one image is left
// ungrouped so it renders as a normal single image, not a one-item grid.
function isGroupableInlineImage(block: RichTextValue[number]): block is RichTextImageBlock {
  // Not a `&&` on block.variant directly: PortableTextBlock's `_type` is
  // typed as a plain string (not a literal), so TS can't narrow the union
  // from the `_type` check alone — the explicit cast below is safe because
  // "richTextImage" never overlaps with any other block's `_type`.
  if (block._type !== "richTextImage") return false;
  const image = block as RichTextImageBlock;
  return (image.variant ?? "inline") === "inline";
}

export function groupInlineImages(value: RichTextValue): GroupedBlock[] {
  const result: GroupedBlock[] = [];
  let run: RichTextImageBlock[] = [];

  const flushRun = () => {
    if (run.length === 0) return;
    if (run.length === 1) {
      result.push(run[0]);
    } else {
      result.push({ _type: "richTextImageGallery", _key: `gallery-${run[0]._key}`, images: run });
    }
    run = [];
  };

  for (const block of value) {
    if (isGroupableInlineImage(block)) {
      run.push(block);
    } else {
      flushRun();
      result.push(block);
    }
  }
  flushRun();

  return result;
}

// Shared by the top-level RichText body (RichText.tsx) and any nested
// Portable Text body (twoColumnText.content — see RichTextTwoColumns.tsx).
// Deliberately excludes the four advanced editorial layout blocks
// (imageRow/imageText/fullBleedImage/twoColumnText): Studio only allows
// the base set inside a nested twoColumnText (see
// studio/schemas/portableTextBlocks.ts's BASE_PORTABLE_TEXT_BLOCKS), and
// keeping that split here too avoids a circular import between this
// module and the four new renderer components (RichText.tsx registers
// those on top of this base set; RichTextTwoColumns.tsx only ever needs
// this base set for its own nested content).
//
// Every non-paragraph/non-list block below clears floats (`clear-both`).
// This matters once a RichTextImageText block floats an image (see
// RichTextImageText.tsx) — without it, a heading/quote/divider/embed/image
// that follows before the float's height is exceeded would render
// squeezed into the narrow remaining space beside it instead of below it.
// Plain paragraphs and lists are exactly what SHOULD wrap around a float,
// so they're the only two block kinds left un-cleared. Harmless when no
// float is present (the default, unchanged case for every existing page).
export const basePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <Text variant="body">{children}</Text>,
    h2: ({ children }) => <Heading level={2} className="clear-both">{children}</Heading>,
    h3: ({ children }) => <Heading level={3} className="clear-both">{children}</Heading>,
    h4: ({ children }) => <Heading level={4} className="clear-both">{children}</Heading>,
    blockquote: ({ children }) => <Quote className="clear-both">{children}</Quote>,
  },
  list: {
    bullet: ({ children }) => <List as="ul">{children}</List>,
    number: ({ children }) => <List as="ol">{children}</List>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => <Link href={(value?.href as string) ?? "#"}>{children}</Link>,
  },
  types: {
    richTextImage: ({ value }: { value: RichTextImageBlock }) => {
      if (!value.image) return null;
      const variant = value.variant ?? "inline";
      return (
        <Image
          asset={value.image}
          preset="editorial"
          showCaption
          sizes={variant === "inline" ? "(min-width: 1024px) 66vw, 100vw" : "100vw"}
          className={cn(IMAGE_VARIANT_CLASSES[variant], "clear-both")}
          lightbox
        />
      );
    },
    // Synthetic type produced by groupInlineImages() above — never comes
    // from Sanity directly. Reuses ImageGrid (already used for entity
    // gallery fields) rather than a bespoke layout.
    richTextImageGallery: ({ value }: { value: RichTextImageGalleryBlock }) => {
      const images = value.images
        .map((block) => block.image)
        .filter((image): image is MediaAsset => Boolean(image));
      if (images.length === 0) return null;
      return (
        <ImageGrid
          images={images}
          columns={images.length >= 3 ? 3 : 2}
          className="mx-auto max-w-2xl clear-both"
        />
      );
    },
    pullQuote: ({ value }: { value: RichTextPullQuote }) => (
      <Quote className="clear-both">
        {value.text}
        {value.attribution && (
          <footer className="mt-2 text-sm text-muted not-italic">— {value.attribution}</footer>
        )}
      </Quote>
    ),
    divider: () => <Divider className="my-4 clear-both" />,
    embed: ({ value }: { value: RichTextEmbed }) => (
      <Embed url={value.url} className="mx-auto max-w-2xl clear-both" />
    ),
  },
};
