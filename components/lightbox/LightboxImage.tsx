"use client";

import type { ReactNode } from "react";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { useLightboxImage } from "./useLightbox";

interface LightboxImageProps {
  asset: MediaAsset | undefined;
  /** Registers `asset` in the page's shared lightbox gallery when true. */
  enabled: boolean;
  className?: string;
  children: ReactNode;
}

// The clickable trigger for a lightbox-enabled image. Owns the
// useLightboxImage hook call itself (rather than requiring the caller to
// call it) so that Image.tsx — this component's only caller — can stay a
// plain Server Component; only this small trigger needs to cross the
// client boundary. Renders a plain, non-interactive <div> with the exact
// same className when disabled (or no LightboxProvider is in the tree),
// so swapping between the two never changes layout — only interactivity.
export function LightboxImage({ asset, enabled, className, children }: LightboxImageProps) {
  const { lightboxId, onOpen } = useLightboxImage(asset, enabled);

  if (!lightboxId || !onOpen) {
    return <div className={className}>{children}</div>;
  }

  return (
    <button
      type="button"
      data-lightbox-id={lightboxId}
      onClick={onOpen}
      className={cn("block w-full cursor-zoom-in text-left", className)}
      aria-label="Открыть изображение на весь экран"
    >
      {children}
    </button>
  );
}
