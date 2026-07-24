"use client";

import { useContext, useEffect, useId } from "react";
import type { Slide, SlideImage } from "yet-another-react-lightbox";
import type { MediaAsset } from "@/types/content";
import { capSourceWidth } from "@/lib/sanityImageUrl";
import { LightboxContext } from "./LightboxProvider";

// Custom fields for the info panel (see Lightbox.tsx's render.slideFooter) —
// deliberately not the Captions plugin's title/description (that plugin
// isn't used; the custom footer covers its job plus photographer/counter
// in one panel, per the editorial spec). `thumbnail` is the Thumbnails
// plugin's own field (module-augmented onto GenericSlide wherever that
// plugin is imported) — a smaller Sanity CDN-resized variant of the same
// asset.url, not a separate image. `backgroundSrc` is the same idea for
// the ambient blurred backdrop (see Lightbox.tsx's render.controls) —
// its own reduced-size variant, never the full-resolution asset.url,
// since it's blurred into illegibility anyway.
export interface AppSlide extends SlideImage {
  caption?: string;
  photographer?: string;
  credit?: string;
  backgroundSrc?: string;
}

function toSlide(asset: MediaAsset): AppSlide {
  return {
    // Capped the same way as Image.tsx's next/image src — the lightbox
    // renders this directly (no next/image proxy), so an uncapped 100MB+
    // original would force the browser to download it whole.
    src: capSourceWidth(asset.url),
    alt: asset.altText,
    width: asset.width,
    height: asset.height,
    thumbnail: `${asset.url}?w=200&h=200&fit=crop&auto=format`,
    backgroundSrc: `${asset.url}?w=1200&auto=format`,
    caption: asset.caption,
    photographer: asset.author?.name,
    credit: asset.copyright ? `© ${asset.copyright}` : undefined,
  };
}

interface UseLightboxImageResult {
  lightboxId?: string;
  onOpen?: () => void;
}

// Registers `asset` as a slide in the current page's shared lightbox
// gallery whenever `enabled` is true, and unregisters it on unmount (or
// when `enabled` turns false). Returns nothing actionable when disabled,
// no LightboxProvider is mounted (e.g. an isolated preview context), or
// there's no asset — callers render a plain, non-interactive image in
// that case.
export function useLightboxImage(
  asset: MediaAsset | undefined,
  enabled: boolean,
): UseLightboxImageResult {
  const id = useId();
  const ctx = useContext(LightboxContext);

  useEffect(() => {
    if (!enabled || !asset || !ctx) return undefined;
    ctx.register(id, toSlide(asset) as Slide);
    return () => ctx.unregister(id);
    // asset.id (not the asset object) is the real dependency — a fresh
    // object identity from a server re-fetch shouldn't force re-registration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, asset?.id, ctx]);

  if (!enabled || !ctx || !asset) return {};
  return { lightboxId: id, onOpen: () => ctx.openImage(id) };
}
