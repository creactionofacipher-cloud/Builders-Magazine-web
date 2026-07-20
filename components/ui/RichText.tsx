import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type {
  MediaAsset,
  RichText as RichTextValue,
  RichTextImageBlock,
  RichTextPullQuote,
  RichTextEmbed,
} from "@/types/content";
import { cn } from "@/utils/cn";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { List } from "./List";
import { Quote } from "./Quote";
import { Link } from "./Link";
import { Image } from "./Image";
import { ImageGrid } from "./ImageGrid";
import { Divider } from "./Divider";
import { Embed } from "./Embed";

// Breaks out of the immediate parent proportionally — a percentage of
// *that parent's* width, not the viewport. RichText is a shared component
// rendered in very different contexts (Story's centered max-w-3xl column
// vs. Issue/BuildersCup's half-width grid cell alongside the cover image),
// so a viewport-relative breakout (100vw, centered via left-1/2 +
// -translate-x-1/2) centers on the element's own containing block, not
// the true viewport — in a grid cell that's off-center, which made wide
// images spill into the neighboring column. Percentages of the parent
// keep the same *proportional* breakout everywhere without knowing
// anything about that parent's absolute size or position.
const IMAGE_VARIANT_CLASSES: Record<string, string> = {
  inline: "mx-auto max-w-2xl",
  wide: "relative left-1/2 w-[118%] max-w-none -translate-x-1/2",
  fullWidth: "relative left-1/2 w-[142%] max-w-none -translate-x-1/2",
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

function groupInlineImages(value: RichTextValue): GroupedBlock[] {
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

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <Text variant="body">{children}</Text>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    blockquote: ({ children }) => <Quote>{children}</Quote>,
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
          showCaption
          sizes={variant === "inline" ? "(min-width: 1024px) 66vw, 100vw" : "100vw"}
          className={IMAGE_VARIANT_CLASSES[variant]}
          lightbox
        />
      );
    },
    // Synthetic type produced by groupInlineImages() below — never comes
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
          className="mx-auto max-w-2xl"
        />
      );
    },
    pullQuote: ({ value }: { value: RichTextPullQuote }) => (
      <Quote>
        {value.text}
        {value.attribution && (
          <footer className="mt-2 text-sm text-muted not-italic">— {value.attribution}</footer>
        )}
      </Quote>
    ),
    divider: () => <Divider className="my-4" />,
    embed: ({ value }: { value: RichTextEmbed }) => (
      <Embed url={value.url} className="mx-auto max-w-2xl" />
    ),
  },
};

interface RichTextProps {
  value: RichTextValue;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PortableText value={groupInlineImages(value)} components={portableTextComponents} />
    </div>
  );
}
