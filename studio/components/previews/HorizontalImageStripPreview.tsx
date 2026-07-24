import { ImageStripThumbnails } from "./shared";

interface HorizontalImageStripSelection {
  title?: string;
  file0?: unknown;
  file1?: unknown;
  file2?: unknown;
  file3?: unknown;
  file4?: unknown;
  file5?: unknown;
  count?: number;
  imageHeight?: string;
}

const HEIGHT_LABELS: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

// Same fixed-index-path constraint as ImageRowPreview — Sanity's `select`
// can't dereference through an array of unknown length, only fixed dot
// paths. Image Row can afford one path per slot (max 4 images total);
// this block allows up to 30, so the preview caps at the first 6
// thumbnails plus a "+N" overflow indicator (ImageStripThumbnails, shared
// with ImageStripPreview's RichText counterpart) rather than trying to
// select every possible index.
const THUMBNAIL_LIMIT = 6;

export const horizontalImageStripPreview = {
  select: {
    title: "title",
    file0: "images.0.file",
    file1: "images.1.file",
    file2: "images.2.file",
    file3: "images.3.file",
    file4: "images.4.file",
    file5: "images.5.file",
    count: "images.length",
    imageHeight: "imageHeight",
  },
  prepare({ title, file0, file1, file2, file3, file4, file5, count, imageHeight }: HorizontalImageStripSelection) {
    const files = [file0, file1, file2, file3, file4, file5].slice(0, count ?? 0);
    const n = count ?? 0;
    const heightLabel = HEIGHT_LABELS[imageHeight ?? "medium"] ?? HEIGHT_LABELS.medium;

    return {
      title: title || "Horizontal Image Strip",
      subtitle: `${n} image${n === 1 ? "" : "s"} · ${heightLabel}`,
      media: <ImageStripThumbnails files={files} overflow={n - files.length} />,
    };
  },
};
