// @sanity/icons deprecated most root-level icon exports (typed `never`
// there as of this version) in favor of per-icon subpaths.
import { BlockquoteIcon } from "@sanity/icons/Blockquote";

interface PullQuoteSelection {
  text?: string;
  attribution?: string;
}

// The quote itself, wrapped in curly quotation marks, is the title —
// exactly what an editor scanning the block list wants to read, not a
// generic "Pull Quote" label.
export const pullQuotePreview = {
  select: { text: "text", attribution: "attribution" },
  prepare({ text, attribution }: PullQuoteSelection) {
    return {
      title: text ? `“${text}”` : "Цитата без текста",
      subtitle: attribution,
      media: BlockquoteIcon,
    };
  },
};
