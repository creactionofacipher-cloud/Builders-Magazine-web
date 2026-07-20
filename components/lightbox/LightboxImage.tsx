"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface LightboxImageProps {
  lightboxId?: string;
  onOpen?: () => void;
  className?: string;
  children: ReactNode;
}

// The clickable trigger for a lightbox-enabled image. Renders a plain,
// non-interactive <div> with the exact same className when lightboxId/onOpen
// are absent (lightbox disabled, or no LightboxProvider in the tree), so
// swapping between the two never changes layout — only interactivity.
export function LightboxImage({ lightboxId, onOpen, className, children }: LightboxImageProps) {
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
