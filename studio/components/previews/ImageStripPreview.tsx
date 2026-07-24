import { ImageStripThumbnails } from "./shared";

interface ImageStripSelection {
  caption?: string;
  file0?: unknown;
  file1?: unknown;
  file2?: unknown;
  file3?: unknown;
  file4?: unknown;
  file5?: unknown;
  count?: number;
}

// In-article counterpart of HorizontalImageStripPreview (Layout Block) —
// same 6-thumbnail-plus-overflow cap for the same reason (this block
// allows up to 30 images; Sanity's `select` only supports fixed dot
// paths). No imageHeight in the subtitle here since this block has no
// title field to lead with either — "N images" is the whole subtitle,
// matching ImageRowPreview's own terser in-article subtitle.
export const imageStripPreview = {
  select: {
    caption: "caption",
    file0: "images.0.file",
    file1: "images.1.file",
    file2: "images.2.file",
    file3: "images.3.file",
    file4: "images.4.file",
    file5: "images.5.file",
    count: "images.length",
  },
  prepare({ caption, file0, file1, file2, file3, file4, file5, count }: ImageStripSelection) {
    const files = [file0, file1, file2, file3, file4, file5].slice(0, count ?? 0);
    const n = count ?? 0;

    return {
      title: caption || `Image Strip — ${n} image${n === 1 ? "" : "s"}`,
      subtitle: caption ? `${n} image${n === 1 ? "" : "s"}` : undefined,
      media: <ImageStripThumbnails files={files} overflow={n - files.length} />,
    };
  },
};
